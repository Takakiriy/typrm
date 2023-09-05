import * as fs from 'fs'; // file system
import * as path from "path";
import * as readline from 'readline';
import globby from 'globby';
import * as csvParse from 'csv-parse';
import chalk from 'chalk';
import * as yaml from 'js-yaml';
import * as child_process from 'child_process';
import * as lib from "./lib";
import sharp from 'sharp';
// import { pp, ff, cc, ccCount } from "./lib";
var __dirname = path.resolve();
// var  debugSearchScore = false;
// main
export async function main() {
    startTestRedirect();
    try {
        await mainMain();
    }
    finally {
        endTestRedirect();
        if (programOptions.stdoutBuffer) {
            process.stdout.write(stdout);
        }
        // debug
        // if (true) {
        //     var d = lib.pp('');
        //     d=d;  // Set break point here and watch the variable d
        //     // If exception was raised, this code does not execute.
        //     // Set a break point at the catch block of calling "main.main"
        // }
    }
}
// mainMain
export async function mainMain() {
    lib.loadDotEnvSecrets(programOptions.inheritDotenv);
    locale = Intl.NumberFormat().resolvedOptions().locale;
    if ('locale' in programOptions) {
        locale = programOptions.locale;
    }
    const verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        printConfig();
    }
    if ('input' in programOptions) {
        lib.setInputOption(new lib.InputOption(programOptions.input.split('\n')));
    }
    if (programArguments.length === 0) {
        await search();
    }
    else if (programArguments.length >= 1) {
        if (programArguments[0] === 's' || programArguments[0] === 'search') {
            if (verboseMode) {
                console.log('Verbose: typrm command: search');
            }
            await search();
        }
        else if (programArguments[0] === 'm' || programArguments[0] === 'mutual-search') {
            varidateMutualSearchCommandArguments();
            if (verboseMode) {
                console.log('Verbose: typrm command: mutual-search');
            }
            await mutualSearch();
        }
        else if (programArguments[0] === 'c' || programArguments[0] === 'check') {
            if (verboseMode) {
                console.log('Verbose: typrm command: check');
            }
            var checkingFilePath;
            if (programArguments.length >= 2) {
                checkingFilePath = programArguments[1];
            }
            await check(checkingFilePath);
        }
        else if (programArguments[0] === 'r' || programArguments[0] === 'replace') {
            if (verboseMode) {
                console.log('Verbose: typrm command: replace');
            }
            if (programArguments.length === 1) {
                var inputFilePath = '';
            }
            else {
                var inputFilePath = programArguments[1];
            }
            await replace(inputFilePath);
        }
        else if (programArguments[0] === 'reset') {
            if (programArguments.length === 1) {
                var inputFilePath = '';
            }
            else {
                var inputFilePath = programArguments[1];
            }
            await reset(inputFilePath);
        }
        else {
            await search();
        }
    }
}
async function checkRoutine(inputFilePath, copyTags, parser) {
    const parentPath = path.dirname(inputFilePath);
    inputFileParentPath = parentPath;
    parser.command = CommandEnum.check;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = inputFilePath;
    const settingTree = await makeSettingTree(parser);
    // List up original tag
    const originalTagTree = await makeOriginalTagTree(parser, settingTree);
    for (const index of Object.keys(originalTagTree.replaceTo)) {
        for (const [name, replace] of Object.entries(originalTagTree.replaceTo[index])) {
            const log = `${getTestablePath(inputFilePath)}:${replace.lineNum}: ` +
                `#original: ${name}: ${settingTree.settings[index][name].value} => ${replace.value}`;
            parser.originalTagList.push(log);
        }
    }
    // List up to tag
    const toTagTree = await makeReplaceToTagTree(parser, settingTree);
    for (const index of Object.keys(toTagTree.replaceTo)) {
        for (const [name, replace] of Object.entries(toTagTree.replaceTo[index])) {
            const log = `${getTestablePath(inputFilePath)}:${replace.lineNum}: ` +
                `#to: ${name}: ${settingTree.settings[index][name].value} => ${replace.value}`;
            parser.toTagList.push(log);
            parser.totalToTagCount += 1;
        }
    }
    if (parser.outputToTagList) {
        parser.flushToTagList();
    }
    // Check template
    if (parser.verbose) {
        console.log(`Verbose: Phase 3: check ...`);
    }
    var reader = readline.createInterface({
        input: fs.createReadStream(inputFilePath),
        crlfDelay: Infinity
    });
    parser.lineNum = 0;
    parser.line = '';
    const verbose = parser.verbose;
    var setting = {};
    var lineNum = 0;
    var fileTemplateTags = [];
    var previousLineIncludesFileTemplate = false;
    const copyTagParser = new CopyTag.CheckParser();
    const lines = [];
    const ifTagParser = new IfTagParser(parser);
    const enableFileTemplateParser = new EnableFileTemplateParser(parser);
    for await (const line1 of reader) {
        const line = line1;
        lines.push(line);
    }
    for (const line of lines) {
        lineNum += 1;
        parser.lineNum = lineNum;
        // Set condition by "#if:" tag.
        ifTagParser.evaluate(line, setting);
        enableFileTemplateParser.evaluate(line, setting);
        parser.verbose = false;
        // setting = ...
        settingTree.moveToLine(parser);
        parser.verbose = verbose;
        setting = settingTree.currentSettings;
        if (settingTree.outOfScopeSettingIndices.length >= 1) {
            onEndOfSettingScope(settingTree.settings[settingTree.outOfScopeSettingIndices[0]], parser);
        }
        // Check the "#same-as:" tag.
        if (settingTree.wasChanged) {
            for (const [variableName, variable] of Object.entries(settingTree.currentSettings)) {
                const lineNumInSetting = setting[variableName].lineNum;
                if (variable.sameAs && !variable.sameAsWasChecked) {
                    variable.sameAsWasChecked = true;
                    var expectedVariableName = variable.sameAs;
                    var errorInSameAsTag = false;
                    const r = SameAsTag.evaluateVariableName(expectedVariableName, setting);
                    expectedVariableName = r.variableName;
                    var variableNames = r.referencedVariableNames;
                    for (const errorVariableName of r.errorVariableNames) {
                        parser.flushToTagList();
                        console.log('');
                        console.log(getVariablesForErrorMessage('', [], settingTree, lines, inputFilePath));
                        console.log(`${getTestablePath(inputFilePath)}:${lineNumInSetting}: ${lines[lineNumInSetting - 1]}`);
                        console.log(`    ${translate('Warning')}: ${translate('Not found a variable name specified in the same-as tag.')}`);
                        console.log(`    Variable Name: ${errorVariableName}`);
                        parser.warningCount += 1;
                        errorInSameAsTag = true;
                    }
                    if (expectedVariableName in setting) {
                        if (variable.value !== setting[expectedVariableName].value) {
                            parser.flushToTagList();
                            variableNames.push(expectedVariableName);
                            console.log('');
                            console.log(getVariablesForErrorMessage('', variableNames, settingTree, lines, inputFilePath));
                            console.log(`${getTestablePath(inputFilePath)}:${lineNumInSetting}: ${lines[lineNumInSetting - 1]}`);
                            console.log(`    ${translate('Warning')}: ${translate('Not matched with the value referenced from same-as tag.')}`);
                            console.log(`    Same as: ${expectedVariableName}`);
                            console.log(`    Expected: ${setting[expectedVariableName].value}`);
                            parser.warningCount += 1;
                        }
                    }
                    else {
                        if (!errorInSameAsTag) {
                            parser.flushToTagList();
                            console.log('');
                            console.log(getVariablesForErrorMessage('', variableNames, settingTree, lines, inputFilePath));
                            console.log(`${getTestablePath(inputFilePath)}:${lineNumInSetting}: ${lines[lineNumInSetting - 1]}`);
                            console.log(`    ${translate('Warning')}: ${translate('Not found a variable name specified in the same-as tag.')}`);
                            console.log(`    Variable Name: ${expectedVariableName}`);
                            parser.warningCount += 1;
                        }
                    }
                }
            }
        }
        // Check the condition by "#expect:" tag.
        if (line.includes(expectLabel) && ifTagParser.thisIsOutOfFalseBlock) {
            const condition = line.substring(line.indexOf(expectLabel) + expectLabel.length).trim();
            const evaluatedContidion = evaluateIfCondition(condition, setting, parser);
            if (typeof evaluatedContidion === 'boolean') {
                if (!evaluatedContidion) {
                    parser.flushToTagList();
                    console.log('');
                    console.log(translate('Error of not expected condition:'));
                    console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                    console.log(`  Contents: ${condition}`);
                    parser.errorCount += 1;
                }
            }
            else {
                parser.flushToTagList();
                console.log('');
                console.log('Error of expect tag syntax:');
                console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                console.log(`  Contents: ${condition}`);
                parser.errorCount += 1;
            }
        }
        // Check if previous line has "template" replaced contents.
        const templateTag = parseTemplateTag(line, parser);
        if (templateTag.lineNumOffset >= 1 && templateTag.isFound) {
            parser.flushToTagList();
            console.log("");
            console.log(`${getTestablePath(inputFilePath)}:${lineNum}: ${line.trim()}`);
            console.log(`    ${translate('Error')}: ${translate('The parameter must be less than 0')}`);
            templateTag.isFound = false;
            parser.templateCount += 1;
            parser.errorCount += 1;
        }
        if (templateTag.isFound) {
            parser.templateCount += 1;
            const checkingLine = lines[lineNum - 1 + templateTag.lineNumOffset];
            const commonCase = (templateTag.label !== templateIfLabel);
            const settingForTemplate = (copyTagParser.parsingCopyTag) ? copyTagParser.settingAndCopyTagParameters : setting;
            if (commonCase) {
                var expected = getExpectedLine(settingForTemplate, templateTag.template);
            }
            else { // if (templateTag.label === templateIfLabel)
                templateTag.evaluate(settingForTemplate);
                var expected = getExpectedLine(settingForTemplate, templateTag.newTemplate, { relatedReferenced: true });
            }
            if (templateTag.lineNumOffset === 0) {
                var checkingLineWithoutTemplate = checkingLine.substring(0, templateTag.indexInLine);
            }
            else {
                var checkingLineWithoutTemplate = checkingLine;
            }
            if (!checkingLineWithoutTemplate.includes(expected) && ifTagParser.thisIsOutOfFalseBlock) {
                parser.flushToTagList();
                console.log("");
                console.log(getErrorMessageOfNotMatchedWithTemplate(templateTag, settingTree, lines));
                console.log(`    ${translate('Warning')}: ${translate('Not matched with the template.')}`);
                console.log(`    ${translate('Expected')}: ${expected}`);
                parser.warningCount += 1;
            }
        }
        // Check target file contents by "#file-template:" tag.
        for (const fileTemplateTag of fileTemplateTags) {
            if (templateTag.label === fileTemplateLabel && ifTagParser.thisIsOutOfFalseBlock &&
                previousLineIncludesFileTemplate) {
                fileTemplateTag.indentAtTag = templateTag.indentAtTag;
            }
            else {
                const continue_ = fileTemplateTag.onReadLine(line);
                if (!continue_) {
                    await fileTemplateTag.checkTargetFileContents(setting, parser);
                    fileTemplateTags = fileTemplateTags.filter(object => (object !== fileTemplateTag));
                }
            }
        }
        if (templateTag.label === fileTemplateLabel && ifTagParser.thisIsOutOfFalseBlock &&
            enableFileTemplateParser.isEnabled) {
            fileTemplateTags.push(templateTag);
            previousLineIncludesFileTemplate = true;
        }
        else {
            previousLineIncludesFileTemplate = false;
        }
        // ...
        copyTagParser.evaluate(line, copyTags, templateTag, setting, parser);
    }
    settingTree.moveToEndOfFile();
    if (settingTree.outOfScopeSettingIndices.length >= 1) {
        onEndOfSettingScope(settingTree.settings[settingTree.outOfScopeSettingIndices[0]], parser);
    }
    parser.lineNum += 1;
    // Check target file contents by "#file-template:" tag (2).
    for (const fileTemplateTag of fileTemplateTags) {
        fileTemplateTag.onEndOfFile();
        await fileTemplateTag.checkTargetFileContents(setting, parser);
    }
}
function getErrorMessageOfNotMatchedWithTemplate(templateTag, settingTree, lines) {
    var errorMessage = '';
    const variableNames = templateTag.scanKeys(Object.keys(settingTree.currentSettings));
    const parser = templateTag.parser;
    errorMessage += getVariablesForErrorMessage('', variableNames, settingTree, lines, parser.filePath) + '\n';
    const targetLineNum = parser.lineNum + templateTag.lineNumOffset;
    errorMessage += `${getTestablePath(parser.filePath)}:${targetLineNum}: ${lines[targetLineNum - 1]}\n`; // target line
    if (templateTag.lineNumOffset !== 0) {
        errorMessage += `${getTestablePath(parser.filePath)}:${parser.lineNum}: ${lines[parser.lineNum - 1]}\n`; // template
    }
    return lib.cutLast(errorMessage, '\n');
}
function getVariablesForErrorMessage(indent, variableNames, settingTree, lines, inputFilePath, options = {}) {
    var errorMessage = '';
    var settingIndices = [];
    for (let settingIndex = settingTree.currentSettingIndex; settingIndex !== '/'; settingIndex = path.dirname(settingIndex)) {
        settingIndices.push(settingIndex);
    }
    settingIndices.push('/');
    settingIndices = settingIndices.reverse();
    for (const parentSettingIndex of settingIndices) {
        if (parentSettingIndex in settingTree.settingsInformation) {
            const settings = settingTree.settingsInformation[parentSettingIndex];
            if (settings.lineNum !== 0) {
                const variableMessages = [];
                for (const variableName of variableNames) {
                    const variable = settingTree.currentSettings[variableName];
                    if (lib.cutAlphabetInIndex(variable.settingsIndex) === parentSettingIndex) {
                        var line = lines[variable.lineNum - 1];
                        if (options.replaceToTag) {
                            if (variableName in options.replaceToTag) {
                                if (line.indexOf(' #to:') == notFound) {
                                    const before = getValue(line, line.indexOf(':'));
                                    const after = options.replaceToTag[variableName].value;
                                    if (after !== before) {
                                        line = line.trimRight() + `  #to: ${after}`;
                                    }
                                }
                            }
                        }
                        if (options.coloredValue) {
                            line = getLineWithColoredValue(line);
                        }
                        variableMessages.push({
                            lineNum: variable.lineNum,
                            message: `${getTestablePath(inputFilePath)}:${variable.lineNum}: ${line}\n`,
                        });
                    }
                }
                variableMessages.sort((a, b) => (a.lineNum - b.lineNum));
                errorMessage += indent + `${getTestablePath(inputFilePath)}:${settings.lineNum}: ${lines[settings.lineNum - 1]}\n`; // settings
                for (const variableMessage of variableMessages) {
                    errorMessage += indent + variableMessage.message; // variable
                }
            }
        }
    }
    return lib.cutLast(errorMessage, '\n');
}
async function makeSettingTree(parser) {
    const tree = new SettingsTree();
    const indentStack = [
        { lineNum: 1, indent: '' }
    ];
    const settingStack = // #search: settingStack of typrm makeSettingTree
     [
        { lineNum: 0, index: '/', nextNumberIndex: 0, nextAlphabetIndex: 'a', indent: '', startLineNum: 1, startIndentLevel: -1 },
        { lineNum: 0, index: '/1', nextNumberIndex: 1, nextAlphabetIndex: 'a', indent: '', startLineNum: 0, startIndentLevel: 0 }
        // "parentIndentLevel" is a parent indent of a settings tag. It is not a indent of a settings tag.
    ];
    var reader = readline.createInterface({
        input: fs.createReadStream(parser.filePath),
        crlfDelay: Infinity
    });
    var isReadingSetting = false;
    var setting = {};
    var currentSettingIndex = '/';
    var lineNum = 0;
    var settingIndentLength = 0;
    tree.indices.set(1, '/');
    tree.indicesWithIf.set(1, '/');
    tree.settings = {};
    if (parser.verbose) {
        console.log(`Verbose: Phase 1: parse settings ...  ${getTestablePath(parser.filePath)}`);
    }
    for await (const line1 of reader) {
        const line = line1;
        lineNum += 1;
        parser.line = line;
        parser.lineNum = lineNum;
        // indentStack = ...
        const indent = indentRegularExpression.exec(line)[0];
        if (line !== '') {
            // Pop "indentStack"
            while (!indent.startsWith(indentStack[indentStack.length - 1].indent)) {
                indentStack.pop();
            }
            // ...
            const currentIndentStackIndex = indentStack.length - 1;
            var currentSettingStackIndex = settingStack.length - 2;
            const previousIndent = indentStack[currentIndentStackIndex];
            const inIfBlock = lib.isAlphabetIndex(currentSettingIndex);
            // Pop "settingStack" in #if: block
            if (inIfBlock) {
                while (indent.length <= settingStack[currentSettingStackIndex].indent.length) {
                    const parentSettingStackIndex = currentSettingStackIndex - 1;
                    const lastEndIf = !lib.isAlphabetIndex(settingStack[parentSettingStackIndex].index);
                    if (isReadingSetting) {
                        tree.settings[currentSettingIndex] = { ...tree.settings[currentSettingIndex], ...setting };
                    }
                    currentSettingStackIndex -= 1;
                    setting = {};
                    settingStack.pop();
                    if (parser.verbose) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${lineNum - 1}: end #if:`);
                    }
                    const nextSetting = settingStack[settingStack.length - 1];
                    const parentSettingIndex = path.dirname(nextSetting.index);
                    const usedNumber = lib.fromAlphabetIndex(path.basename(nextSetting.index));
                    nextSetting.lineNum = 0;
                    if (parentSettingIndex === '/') {
                        nextSetting.index = `/${lib.getAlphabetIndex(usedNumber + 1)}`;
                    }
                    else {
                        nextSetting.index = `${parentSettingIndex}/${lib.getAlphabetIndex(usedNumber + 1)}`;
                    }
                    currentSettingIndex = settingStack[currentSettingStackIndex].index;
                    tree.indicesWithIf.set(lineNum, currentSettingIndex);
                    if (lastEndIf) {
                        if (indent.length <= settingStack[currentSettingStackIndex + 1].indent.length) {
                            nextSetting.nextAlphabetIndex = path.basename(nextSetting.index);
                            if (parentSettingIndex === '/') {
                                nextSetting.index = `/${nextSetting.nextNumberIndex}`;
                            }
                            else {
                                nextSetting.index = `${parentSettingIndex}/${nextSetting.nextNumberIndex}`;
                            }
                        }
                        break;
                    }
                }
            }
            // Pop "settingStack" out of #if: block
            while (indent.length <= settingStack[currentSettingStackIndex].startIndentLevel) {
                settingStack.pop();
                currentSettingStackIndex -= 1;
                const setting_ = settingStack[settingStack.length - 1];
                if (!(currentSettingIndex in tree.settings)) {
                    if (isReadingSetting) {
                        tree.settings[currentSettingIndex] = setting;
                    }
                    tree.indices.set(setting_.startLineNum, currentSettingIndex);
                    tree.indicesWithIf.set(setting_.startLineNum, currentSettingIndex);
                    tree.settingsInformation[currentSettingIndex] = {
                        index: currentSettingIndex,
                        lineNum: setting_.lineNum,
                        indent: setting_.indent,
                        condition: '',
                        inSettings: isReadingSetting,
                    };
                }
                else {
                    tree.settings[currentSettingIndex] = { ...tree.settings[currentSettingIndex], ...setting };
                }
                setting = {};
                currentSettingIndex = settingStack[currentSettingStackIndex].index;
                tree.indices.set(lineNum, currentSettingIndex);
                tree.indicesWithIf.set(lineNum, currentSettingIndex);
                const nextSetting = setting_;
                const parentSettingIndex = path.dirname(nextSetting.index);
                const usedNumber = parseInt(path.basename(nextSetting.index));
                nextSetting.lineNum = 0;
                if (parentSettingIndex === '/') {
                    nextSetting.index = `/${usedNumber + 1}`;
                }
                else {
                    nextSetting.index = `${parentSettingIndex}/${usedNumber + 1}`;
                }
                nextSetting.nextNumberIndex += 1;
            }
            // push "indentStack"
            if (indent === previousIndent.indent) {
                previousIndent.lineNum = lineNum;
            }
            else {
                indentStack.push({ lineNum, indent });
            }
        }
        // setting = ...
        if (settingLabel.test(line) && !line.includes(disableLabel)) {
            isReadingSetting = true;
            if (indent === '') {
                settingStack[0].lineNum = lineNum;
                currentSettingIndex = '/';
                if (currentSettingIndex in tree.settingsInformation) {
                    console.log('');
                    console.log(`${getTestablePath(parser.filePath)}:${lineNum}`);
                    console.log(`    Warning: double settings are not supported.`);
                    console.log(`    First settings at: ${getTestablePath(parser.filePath)}:` +
                        `${tree.settingsInformation[currentSettingIndex].lineNum}`);
                    parser.warningCount += 1;
                    var isNewSettings = false;
                }
                else {
                    var isNewSettings = true;
                }
            }
            else {
                const currentSetting = settingStack[settingStack.length - 2];
                if (currentSetting.indent.length === indent.length) {
                    console.log('');
                    console.log(`${getTestablePath(parser.filePath)}:${lineNum}`);
                    console.log(`    Warning: double settings are not supported.`);
                    console.log(`    First settings at: ${getTestablePath(parser.filePath)}:` +
                        `${tree.settingsInformation[currentSettingIndex].lineNum}`);
                    parser.warningCount += 1;
                    var isNewSettings = false;
                }
                else {
                    const parentSetting = currentSetting;
                    const parentIndex = parentSetting.index;
                    const setting_ = settingStack[settingStack.length - 1];
                    if (parentIndex === '/') {
                        var previousIndex = `/1`;
                    }
                    else {
                        var previousIndex = `${parentIndex}/1`;
                    }
                    var previousIndentIsDeeper = false;
                    if (previousIndex in tree.settingsInformation) {
                        var previousIndentIsDeeper = tree.settingsInformation[previousIndex].indent.length > indent.length;
                    }
                    // insert parent settings
                    if (previousIndentIsDeeper) {
                        const ceilingLineNum = indentStack[indentStack.length - 2].lineNum;
                        const shiftingIndices = [];
                        for (const [index, settingsInformation] of Object.entries(tree.settingsInformation)) {
                            if (settingsInformation.lineNum > ceilingLineNum) {
                                shiftingIndices.push(index);
                            }
                        }
                        if (shiftingIndices.length >= 1) {
                            const firstShiftingIndex = shiftingIndices[0];
                            shiftingIndices.sort((a, b) => (b.length - a.length));
                            for (const [lineNum_, index] of tree.indices.entries()) {
                                if (lineNum_ > ceilingLineNum) {
                                    const indexBefore = index;
                                    const indexAfter = insertParentIndexNum(indexBefore, firstShiftingIndex);
                                    tree.indices.set(lineNum_, indexAfter);
                                }
                            }
                            var lastIndexAfter = '';
                            for (const [lineNum_, index] of tree.indicesWithIf.entries()) {
                                if (lineNum_ > ceilingLineNum) {
                                    const indexBefore = index;
                                    const indexAfter = insertParentIndexNum(indexBefore, firstShiftingIndex);
                                    lastIndexAfter = indexAfter;
                                    tree.indicesWithIf.set(lineNum_, indexAfter);
                                }
                            }
                            var lastSettingIndexAfter = '';
                            for (const shiftingIndex of shiftingIndices) {
                                const indexBefore = shiftingIndex;
                                const indexAfter = insertParentIndexNum(indexBefore, firstShiftingIndex);
                                lastSettingIndexAfter = indexAfter;
                                tree.settings[indexAfter] = tree.settings[indexBefore];
                                delete tree.settings[indexBefore];
                                for (const settings of Object.values(tree.settings[indexAfter])) {
                                    settings.settingsIndex = indexAfter;
                                }
                                tree.settingsInformation[indexAfter] = tree.settingsInformation[indexBefore];
                                tree.settingsInformation[indexAfter].index = indexAfter;
                                delete tree.settingsInformation[indexBefore];
                            }
                            currentSettingIndex = firstShiftingIndex;
                            if (lastIndexAfter !== currentSettingIndex) {
                                tree.indices.set(lineNum, `${currentSettingIndex}`);
                                tree.indicesWithIf.set(lineNum, `${currentSettingIndex}`);
                            }
                            settingStack[settingStack.length - 1].index = currentSettingIndex;
                            var nextNestedIndex = currentSettingIndex + '/' +
                                (parseInt(lastSettingIndexAfter.substring(currentSettingIndex.length + 1)) + 1).toString();
                        }
                        else {
                            var nextNestedIndex = setting_.index + '/1';
                        }
                    }
                    else {
                        var nextNestedIndex = setting_.index + '/1';
                    }
                    // ...
                    setting_.lineNum = lineNum;
                    setting_.indent = indent;
                    setting_.startLineNum = indentStack[indentStack.length - 2].lineNum;
                    setting_.startIndentLevel = indentStack[indentStack.length - 2].indent.length;
                    currentSettingIndex = setting_.index;
                    settingStack.push({
                        lineNum: 0,
                        index: nextNestedIndex,
                        nextNumberIndex: 1,
                        nextAlphabetIndex: 'a',
                        indent: '',
                        startLineNum: 0,
                        startIndentLevel: -1
                    });
                    tree.indices.set(setting_.startLineNum, currentSettingIndex);
                    tree.indicesWithIf.set(setting_.startLineNum, currentSettingIndex);
                    tree.indices = new Map([...tree.indices.entries()].sort(([key1, _item1], [key2, _item2]) => key1 - key2));
                    tree.indicesWithIf = new Map([...tree.indicesWithIf.entries()].sort(([key1, _item1], [key2, _item2]) => key1 - key2));
                    var isNewSettings = true;
                }
            }
            if (isNewSettings) {
                setting = {};
                settingIndentLength = indent.length;
                tree.settingsInformation[currentSettingIndex] = {
                    index: currentSettingIndex,
                    lineNum,
                    indent: indentStack[indentStack.length - 1].indent,
                    condition: '',
                    inSettings: isReadingSetting,
                };
            }
            if (parser.verbose) {
                // console.log(`Verbose: settings ${currentSettingIndex}`);
                //    "currentSettingIndex" should be not shown because it is sometimes changed.
                console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${lineNum}: settings`);
            }
        }
        else if (indent.length <= settingIndentLength && isReadingSetting) {
            isReadingSetting = false;
            tree.settings[currentSettingIndex] = { ...tree.settings[currentSettingIndex], ...setting };
        }
        if (isReadingSetting) {
            const separator = line.indexOf(':');
            if (separator !== notFound) {
                const key = line.substring(0, separator).trim();
                const value = getValue(line, separator);
                if (value !== '' && key.length >= 1 && key[0] !== '#') {
                    const previous = setting[key];
                    if (key in setting && value !== previous.value) {
                        console.log('');
                        console.log(translate('Error of duplicated variable name:'));
                        console.log(`  ${translate('typrmFile')}A: ${getTestablePath(parser.filePath)}:${previous.lineNum}`);
                        console.log(`  ContentsA: ${key}: ${previous.value}`);
                        console.log(`  ${translate('typrmFile')}B: ${getTestablePath(parser.filePath)}:${lineNum}`);
                        console.log(`  ContentsB: ${key}: ${value}`);
                        parser.errorCount += 1;
                    }
                    if (parser.verbose) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${lineNum}:     ${key}: ${value}`);
                    }
                    const currentSetting = settingStack[settingStack.length - 2];
                    const sameAsIndex = line.indexOf(' ' + SameAsTag.label);
                    if (sameAsIndex != notFound) {
                        var sameAs = getValue(line, sameAsIndex + SameAsTag.label.length + 1);
                    }
                    else {
                        var sameAs = '';
                    }
                    setting[key] = {
                        value,
                        lineNum,
                        settingsIndex: currentSetting.index,
                        tag: 'settings',
                        isReferenced: false,
                        sameAs,
                    };
                }
            }
        }
        // Set condition by "#if:" tag.
        const ifPosition = ifLabelRE.exec(line);
        if (ifPosition && !line.includes(disableLabel)) {
            const condition = getValue(line, ifPosition.index + ifPosition[0].length);
            tree.settings[currentSettingIndex] = { ...tree.settings[currentSettingIndex], ...setting };
            setting = {};
            const setting_ = settingStack[settingStack.length - 2];
            const nextSetting = settingStack[settingStack.length - 1];
            const inIfBlock = lib.isAlphabetIndex(setting_.index);
            const childIsIfBlock = lib.isAlphabetIndex(nextSetting.index);
            nextSetting.lineNum = lineNum;
            if (!inIfBlock && !childIsIfBlock) {
                if (setting_.index === '/') {
                    nextSetting.index = '/' + nextSetting.nextAlphabetIndex;
                }
                else {
                    nextSetting.index = setting_.index + '/' + nextSetting.nextAlphabetIndex;
                }
            }
            nextSetting.indent = indent;
            nextSetting.startLineNum = setting_.startLineNum;
            nextSetting.startIndentLevel = setting_.startIndentLevel;
            settingStack.push({
                lineNum: 0,
                index: nextSetting.index + '/a',
                nextNumberIndex: 1,
                nextAlphabetIndex: 'a',
                indent: '',
                startLineNum: 0,
                startIndentLevel: -1
            });
            currentSettingIndex = nextSetting.index;
            tree.indicesWithIf.set(lineNum, currentSettingIndex);
            tree.settingsInformation[currentSettingIndex] = {
                index: currentSettingIndex,
                lineNum,
                indent,
                condition,
                inSettings: isReadingSetting,
            };
            if (parser.verbose) {
                // console.log(`Verbose: settings ${currentSettingIndex}`);
                //    "currentSettingIndex" should be not shown because it is sometimes changed.
                console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${lineNum}: #if: ${condition}`);
            }
        }
    }
    if (isReadingSetting) {
        const setting_ = settingStack[settingStack.length - 2];
        tree.settings[currentSettingIndex] = { ...tree.settings[currentSettingIndex], ...setting };
        if (!(currentSettingIndex in tree.settingsInformation)) {
            tree.settingsInformation[currentSettingIndex] = {
                index: currentSettingIndex,
                lineNum: setting_.lineNum,
                indent: setting_.indent,
                condition: '',
                inSettings: isReadingSetting,
            };
        }
    }
    if (!('/' in tree.settings)) {
        tree.settings['/'] = {};
    }
    if (!('/' in tree.settingsInformation)) {
        tree.settingsInformation['/'] = {
            index: '/', lineNum: 0, indent: '', condition: '', inSettings: false,
        };
    }
    for (const index of Object.values(tree.indices)) {
        if (!(index in tree.settings)) {
            throw new Error('parse error in makeSettingTree');
        }
    }
    if (parser.verbose) {
        console.log(`Verbose: settings tree:`);
        for (const [lineNum, index] of tree.indicesWithIf.entries()) {
            console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${lineNum}: scope start`);
            console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${tree.settingsInformation[index].lineNum}:         settings ${index} define`);
        }
        console.log(`Verbose: variables:`);
        for (const [index, variables] of Object.entries(tree.settings)) {
            console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${tree.settingsInformation[index].lineNum}: settings ${index}`);
            for (const [name, value] of Object.entries(variables)) {
                console.log(`        Verbose: ${name}: ${value.value}`);
            }
        }
    }
    return tree;
}
function insertParentIndexNum(indexBefore, firstShiftingIndex) {
    if (indexBefore === '/') {
        return firstShiftingIndex;
    }
    // e.g. indexBefore = '/2/6/7', firstShiftingIndex = '/2/3'
    const rightOfInsert = indexBefore.substring(firstShiftingIndex.length); // e.g. '/7'
    const minus = parseInt(path.basename(firstShiftingIndex)) - 1; // e.g. 2
    const beforeMinus = parseInt(path.basename(indexBefore.substring(0, indexBefore.length - rightOfInsert.length))); // e.g. 6
    return `${firstShiftingIndex}/${beforeMinus - minus}${rightOfInsert}`; // e.g. '/2/3/4/7'
}
async function makeReplaceToTagTree(parser, settingTree) {
    const toTagTree = new ReplaceToTagTree();
    const verbose = parser.verbose;
    var reader = readline.createInterface({
        input: fs.createReadStream(parser.filePath),
        crlfDelay: Infinity
    });
    var isReadingSetting = false;
    var settingIndentLength = 0;
    var variableName = '';
    var value = '';
    var previousTemplateTag = null;
    var currentSettingIndex = '';
    var blockStartLineNums = Array.from(settingTree.indicesWithIf.keys());
    var nextBlockIndex = 0;
    var nextBlockLineNum = 1;
    let breaking = false;
    let exception;
    if (parser.verbose) {
        console.log(`Verbose: Phase 2: parse "#to:" tags ...`);
    }
    toTagTree.replaceTo['/'] = {};
    var lineNum = 0;
    for await (const line1 of reader) {
        if (breaking) {
            continue;
        } // "reader" requests read all lines
        try {
            const line = line1;
            lineNum += 1;
            parser.line = line;
            parser.lineNum = lineNum;
            parser.verbose = false;
            settingTree.moveToLine(parser);
            parser.verbose = verbose;
            if (lineNum === nextBlockLineNum) {
                currentSettingIndex = settingTree.indicesWithIf.get(lineNum);
                nextBlockIndex += 1;
                nextBlockLineNum = blockStartLineNums[nextBlockIndex];
            }
            if (!(currentSettingIndex in toTagTree.replaceTo)) {
                toTagTree.replaceTo[currentSettingIndex] = {};
            }
            // setting = ...
            if (settingLabel.test(line) && !line.includes(disableLabel)) {
                isReadingSetting = true;
                settingIndentLength = indentRegularExpression.exec(line)[0].length;
                previousTemplateTag = null;
            }
            else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                isReadingSetting = false;
                variableName = '';
                value = '';
            }
            if (isReadingSetting) {
                const separator = line.indexOf(':');
                if (separator !== notFound) {
                    const keyOrNot = line.substring(0, separator).trim();
                    if (keyOrNot[0] !== '#') {
                        variableName = keyOrNot;
                        value = getValue(line, separator);
                    }
                }
            }
            var toLabelIndex = line.indexOf(toLabel);
            if (toLabelIndex !== notFound) {
                var toValue = getValue(line, toLabelIndex + toLabel.length - 1);
            }
            else {
                var toValue = '';
            }
            const templateTag = parseTemplateTag(line, parser);
            if (templateTag.isFound) {
                previousTemplateTag = templateTag;
            }
            if (toValue) {
                // #to: tag in the settings
                if (isReadingSetting) {
                    if (parser.verbose) {
                        console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${lineNum}:`);
                        console.log(`        Verbose: ${variableName}: ${value}  #to: ${toValue}`);
                    }
                    if (variableName in toTagTree.replaceTo[currentSettingIndex]) {
                        const variable = toTagTree.replaceTo[currentSettingIndex][variableName];
                        if (toValue !== variable.value) {
                            console.log('');
                            console.log(`Error of conflict #to: tag:`);
                            console.log(`    variableName: ${variableName}`);
                            console.log(`    valueA: ${variable.value} ` +
                                `in ${getTestablePath(parser.filePath)}:${variable.lineNum}`);
                            console.log(`    valueB: ${toValue} ` +
                                `in ${getTestablePath(parser.filePath)}:${lineNum}`);
                            parser.errorCount += 1;
                        }
                    }
                    toTagTree.replaceTo[currentSettingIndex][variableName] = {
                        value: toValue,
                        lineNum: lineNum,
                        settingsIndex: currentSettingIndex,
                        tag: 'toInSettings',
                        isReferenced: false,
                    };
                    if (parser.command !== CommandEnum.check) {
                        console.log(`${getTestablePath(parser.filePath)}:${lineNum}: #to: ${variableName}: ${toValue}`);
                    }
                    // #to: tag after the #template:
                }
                else {
                    if (previousTemplateTag) {
                        if (parser.verbose) {
                            console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${lineNum}:`);
                        }
                        const newKeyValues = await previousTemplateTag.scanKeyValues(toValue, settingTree.currentSettings, parser);
                        if (parser.verbose) {
                            for (const [variableName, newValue] of Object.entries(newKeyValues)) {
                                console.log(`        Verbose: A setting of replace to:`);
                                console.log(`            Verbose: settings: ${newValue.settingsIndex}`);
                                console.log(`            Verbose: tag: ${newValue.tag}`);
                                console.log(`            Verbose: variableName: ${variableName}`);
                                console.log(`            Verbose: to value: ${newValue.value}`);
                            }
                        }
                        for (const [variableName, newValue] of Object.entries(newKeyValues)) {
                            const indices = searchDefinedSettingIndices(variableName, currentSettingIndex, settingTree, parser);
                            for (const index of indices) {
                                if (variableName in toTagTree.replaceTo[index]) {
                                    const variable = toTagTree.replaceTo[index][variableName];
                                    if (newKeyValues[variableName].value !== variable.value) {
                                        console.log('');
                                        console.log(`Error of conflict #to: tag:`);
                                        console.log(`    variableName: ${variableName}`);
                                        console.log(`    valueA: ${variable.value} ` +
                                            `in ${getTestablePath(parser.filePath)}:${variable.lineNum}`);
                                        console.log(`    valueB: ${toValue} ` +
                                            `in ${getTestablePath(parser.filePath)}:${lineNum}`);
                                        parser.errorCount += 1;
                                    }
                                }
                                if (newValue.settingsIndex === index) {
                                    toTagTree.replaceTo[index][variableName] = newValue;
                                }
                                else {
                                    const newValueCopy = Object.assign({}, newValue);
                                    newValueCopy.settingsIndex = index;
                                    toTagTree.replaceTo[index][variableName] = newValueCopy;
                                }
                            }
                            if (parser.command !== CommandEnum.check) {
                                console.log(`${getTestablePath(parser.filePath)}:${lineNum}: #to: ${variableName}: ${getLineWithColoredValue(newValue.value)}`);
                            }
                        }
                        previousTemplateTag = null;
                    }
                }
            }
        }
        catch (e) {
            exception = e;
            breaking = true;
        }
    }
    if (parser.verbose) {
        console.log(`Verbose: to tag tree:`);
        console.log(`    Verbose: replaceTo:`);
        for (const [index, toSettings] of Object.entries(toTagTree.replaceTo)) {
            console.log(`        Verbose: settings "${index}":`);
            for (const [variableName, toSetting] of Object.entries(toSettings)) {
                const setting = settingTree.settingsInformation[index];
                console.log(`            Verbose: variable: ${variableName}`);
                console.log(`            Verbose: before:`);
                console.log(`                Verbose: value: ${settingTree.settings[index][variableName]}`);
                console.log(`                Verbose: ${getTestablePath(parser.filePath)}:${setting.lineNum}:`);
                console.log(`                Verbose: settings: ${setting.index}`);
                console.log(`            Verbose: after:`);
                console.log(`                Verbose: to value: ${toSetting.value}`);
                console.log(`                Verbose: tag: ${toSetting.tag}`);
                console.log(`                Verbose: ${getTestablePath(parser.filePath)}:${toSetting.lineNum}:`);
                console.log(`                Verbose: settings: ${toSetting.settingsIndex}`);
            }
        }
        console.log(`    Verbose: outOfFalseBlocks:`);
        for (const [lineNum, trueOrFalse] of toTagTree.outOfFalseBlocks.entries()) {
            console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${lineNum}: ${trueOrFalse}`);
        }
    }
    if (exception) {
        throw exception;
    }
    return toTagTree;
}
async function makeOriginalTagTree(parser, settingTree) {
    const toTagTree = new ReplaceToTagTree();
    var reader = readline.createInterface({
        input: fs.createReadStream(parser.filePath),
        crlfDelay: Infinity
    });
    var isReadingSetting = false;
    var settingIndentLength = 0;
    var currentSettingIndex = '';
    var blockStartLineNums = Array.from(settingTree.indicesWithIf.keys());
    var nextBlockIndex = 0;
    var nextBlockLineNum = 1;
    let breaking = false;
    let exception;
    if (parser.verbose) {
        console.log(`Verbose: Phase 2: parse "original" tags ...`);
    }
    var lineNum = 0;
    for await (const line1 of reader) {
        if (breaking) {
            continue;
        } // "reader" requests read all lines
        try {
            const line = line1;
            lineNum += 1;
            parser.line = line;
            parser.lineNum = lineNum;
            settingTree.moveToLine(parser);
            if (lineNum === nextBlockLineNum) {
                currentSettingIndex = settingTree.indicesWithIf.get(lineNum);
                nextBlockIndex += 1;
                nextBlockLineNum = blockStartLineNums[nextBlockIndex];
            }
            if (!(currentSettingIndex in toTagTree.replaceTo)) {
                toTagTree.replaceTo[currentSettingIndex] = {};
            }
            // setting = ...
            if (settingLabel.test(line) && !line.includes(disableLabel)) {
                isReadingSetting = true;
                settingIndentLength = indentRegularExpression.exec(line)[0].length;
            }
            else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                isReadingSetting = false;
            }
            if (isReadingSetting) {
                const separator = line.indexOf(':');
                const originalLabelIndex = line.indexOf(originalLabel);
                var variableName = '';
                if (separator !== notFound) {
                    const keyOrNot = line.substr(0, separator).trim();
                    if (keyOrNot[0] !== '#') {
                        variableName = keyOrNot;
                    }
                }
                if (variableName !== '' && originalLabelIndex != notFound) {
                    var originalValue = getValue(line, originalLabelIndex + originalLabel.length - 1);
                    if (parser.verbose) {
                        console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${lineNum}:`);
                        console.log(`    Verbose:     ${variableName}: #original: ${originalValue}`);
                    }
                    toTagTree.replaceTo[currentSettingIndex][variableName] = {
                        value: originalValue,
                        lineNum: lineNum,
                        settingsIndex: currentSettingIndex,
                        tag: 'original',
                        isReferenced: false,
                    };
                    if (parser.command !== CommandEnum.check) {
                        console.log(`${getTestablePath(parser.filePath)}:${lineNum}: #original: ${variableName}: ${originalValue}`);
                    }
                }
            }
        }
        catch (e) {
            exception = e;
            breaking = true;
        }
    }
    if (exception) {
        throw exception;
    }
    toTagTree.command = 'reset';
    return toTagTree;
}
async function makeTemplatesInCopyTag(replacingLines) {
    const templatesInCopyTag = [];
    const copyTagRe = new RegExp(' #copy(-template)?: *([^,]*),[^\\$]*(\\$settings\..*)}');
    const copyTemplateTagRe = new RegExp(' #copy-template: *([^,]*),(.*)');
    const settingsRe = new RegExp('\\$settings\\.([^ ,}]*)', 'g');
    const variableNames = {};
    for (const line of replacingLines) {
        const matchedCopyTag = copyTagRe.exec(line);
        if (matchedCopyTag) {
            const name = matchedCopyTag[2];
            const parameters = matchedCopyTag[3];
            const templateVariableNames = new Set();
            var settingsMatch = null;
            settingsRe.lastIndex = 0;
            variableNames[name] = templateVariableNames;
            while ((settingsMatch = settingsRe.exec(parameters)) !== null) {
                templateVariableNames.add(settingsMatch[1].trimRight());
            }
        }
    }
    for (const inputFileFullPath of await listUpFilePaths('')) {
        var reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        var lineNum = 0;
        var copyTagIndent = '';
        var copyTagName = '';
        var copyTagLineNum = 0;
        var copyTagParameterNames = [];
        for await (const line1 of reader) {
            const line = line1;
            lineNum += 1;
            if (copyTagIndent) {
                if (line.startsWith(copyTagIndent)) {
                    const templateIndex = line.indexOf(' ' + templateLabel);
                    if (templateIndex !== notFound) {
                        const template = getValue(line, templateIndex + templateLabel.length + 1);
                        templatesInCopyTag.push({
                            copyTagName,
                            lineNumOffset: lineNum - copyTagLineNum,
                            template,
                        });
                    }
                }
                else if (line.trim() === '') {
                }
                else {
                    copyTagIndent = '';
                }
            }
            if (!copyTagIndent) {
                const matchedCopyTag = copyTemplateTagRe.exec(line);
                if (matchedCopyTag) {
                    copyTagName = matchedCopyTag[1];
                    if (copyTagName in variableNames) {
                        copyTagIndent = indentRegularExpression.exec(line)[0] + ' ';
                        copyTagLineNum = lineNum;
                    }
                    else {
                        copyTagName = '';
                    }
                }
            }
        }
    }
    return templatesInCopyTag;
}
function getReplacedLineInSettings(line, separator, oldValue, replacedValue, addOriginalTag, cutOriginalTag, cutReplaceToTagEnabled) {
    // spaceAndComment
    // __SettingB__: SetB
    // __SettingB__: SetB  #// comment
    // __SettingB__: SetB      #to: NewSetB   #// SetBB...
    //                   ^ spaceAndCommentIndex
    var spaceAndComment = '';
    const commentMatch = / +#.*/.exec(line.substring(separator));
    if (commentMatch) {
        var spaceAndCommentIndex = separator + commentMatch.index;
        spaceAndComment = line.substring(spaceAndCommentIndex);
    }
    else {
        var spaceAndCommentIndex = notFound;
    }
    const originalLabelIndex = line.indexOf(originalLabel);
    const lineIncludesOriginalLabel = (originalLabelIndex !== notFound);
    if (addOriginalTag && lineIncludesOriginalLabel) {
        const originalValue = getValue(line, originalLabelIndex + originalLabel.length - 1);
        if (replacedValue === originalValue) {
            cutOriginalTag = true;
        }
    }
    var original = '';
    // addOriginalTag
    if (addOriginalTag) {
        // before: __SettingB__: SetB
        // after:  __SettingB__: NewSetB  #original: SetB
        if (!lineIncludesOriginalLabel) {
            original = `  ${originalLabel} ${oldValue}`;
        }
        else {
            original = '';
        }
        // cutReplaceToTag
        if (cutReplaceToTagEnabled && spaceAndComment !== '') {
            const commentIndex = line.indexOf('#', spaceAndCommentIndex);
            const toLabelIndex = line.indexOf(toLabel, commentIndex);
            if (toLabelIndex > commentIndex) {
                var nextCommentIndex = line.indexOf(' #', toLabelIndex + 1);
                if (nextCommentIndex === notFound) {
                    // before: __SettingB__: SetB    #// comment1     #to: NewSetB
                    //                               ^ commentIndex   ^ toLabelIndex
                    // after:  __SettingB__: NewSetB  #original: SetB    #// comment1
                    spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                        line.substring(commentIndex, toLabelIndex).trimRight();
                }
                else {
                    nextCommentIndex += 1;
                    if (line[toLabelIndex - 2] !== ' ' && line[nextCommentIndex - 2] !== ' ') {
                        // before: __SettingB__: SetB    #// comment1 #to: NewSetB #// comment2
                        //                               ^ commentIndex            ^ nextCommentIndex
                        //      spaceAndCommentIndex ^                ^ toLabelIndex 
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1 #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substring(commentIndex, toLabelIndex) +
                            line.substring(nextCommentIndex);
                    }
                    else {
                        const commentMatch2 = / +#.*/.exec(line.substr(toLabelIndex));
                        const spaceAndCommentIndex2 = toLabelIndex + commentMatch2.index;
                        // before: __SettingB__: SetB    #// comment1     #to: NewSetB___      #// comment2
                        //                               ^ commentIndex   ^ toLabelIndex       ^ nextCommentIndex
                        //                           ^ spaceAndCommentIndex              ^ spaceAndCommentIndex2
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1         #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substring(commentIndex, toLabelIndex - 1) +
                            line.substring(spaceAndCommentIndex2 + 1);
                    }
                }
            }
            else {
                var nextCommentIndex = notFound;
                if (toLabelIndex !== notFound) {
                    const nextCommentMatch = / +#.*/.exec(line.substring(commentIndex));
                    if (nextCommentMatch) {
                        nextCommentIndex = commentIndex + nextCommentMatch.index;
                    }
                }
                if (toLabelIndex === notFound) {
                    // before: __SettingB__: SetB   #// comment
                    // after:  __SettingB__: NewSetB  #original: SetB   #// comment
                    // Do nothing
                }
                else {
                    if (nextCommentIndex === notFound) {
                        // before: __SettingB__: SetB  #to: NewSetB
                        //                             ^ commentIndex == toLabelIndex
                        // after:  __SettingB__: NewSetB  #original: SetB
                        spaceAndComment = '';
                    }
                    else {
                        // before: __SettingB__: SetB      #to: NewSetB   #// next comment
                        //    commentIndex == toLabelIndex ^           ^ nextCommentIndex
                        // after:  __SettingB__: NewSetB   #original: SetB      #// next comment
                        const spaceCountBeforeToTag = line.indexOf('#', spaceAndCommentIndex) - spaceAndCommentIndex;
                        const spaceCountAfterToTag = line.indexOf('#', nextCommentIndex) - nextCommentIndex;
                        const originalExists = (line.indexOf(originalLabel) !== notFound);
                        if (!lineIncludesOriginalLabel) {
                            original = ' '.repeat(spaceCountAfterToTag) + `${originalLabel} ${oldValue}`;
                        }
                        spaceAndComment = ' '.repeat(spaceCountBeforeToTag) +
                            line.substring(nextCommentIndex + spaceCountAfterToTag);
                    }
                }
            }
        }
    }
    // cutOriginalTag
    if (cutOriginalTag && lineIncludesOriginalLabel) {
        const replacedValuePattern = lib.escapeRegularExpression(replacedValue).replace(/\$/g, '$$');
        spaceAndComment = spaceAndComment.replace(new RegExp(` *${originalLabel} *${replacedValuePattern}`), '');
    }
    return { original, spaceAndComment };
}
function cutReplaceToTag(line) {
    const toLabelIndex = line.indexOf(toLabel);
    if (toLabelIndex !== notFound) {
        const commentIndex = line.indexOf(' #', toLabelIndex);
        if (commentIndex !== notFound) {
            // added tag: SetB    #to: NewSetB  #template: __B__
            // replaced:  NewSetB    #template: __B__
            // reverted:  SetB    #template: __B__
            line = line.substring(0, toLabelIndex) + line.substring(commentIndex + 1);
        }
        else {
            // added tag: SetB    #to: NewSetB
            // replaced:  NewSetB
            // reverted:  SetB
            line = line.substring(0, toLabelIndex).trimRight();
        }
    }
    return line;
}
class TemplateTag {
    // constructor
    constructor(parser) {
        this.label = '';
        this.template = '';
        this.isFound = false;
        // template tag
        this.indexInLine = notFound;
        // template-at tag
        this.lineNumOffset = 0;
        this.startIndexInLine = notFound;
        this.endIndexInLine = notFound;
        // template-if tag
        this.oldTemplate = '';
        this.newTemplate = '';
        // for file-template tag
        this.templateLines = [];
        this.indentAtTag = '';
        this.minIndentLength = 0;
        this.parser = parser;
    }
    // parseLine
    parseLine(line) {
        const disabled = (line.indexOf(disableLabel) !== notFound);
        this.label = templateLabel;
        this.indexInLine = line.indexOf(templateLabel);
        if (this.indexInLine === notFound) {
            this.label = fileTemplateLabel;
            this.indexInLine = line.indexOf(fileTemplateLabel);
        }
        if (this.indexInLine === notFound) {
            this.label = templateIfLabel;
            this.indexInLine = line.indexOf(templateIfLabel);
        }
        if (this.indexInLine !== notFound && !disabled) {
            this.isFound = true;
            const leftOfTemplate = cutReplaceToTag(line.substring(0, this.indexInLine).trim());
            if (this.label === fileTemplateLabel) {
                this.onFileTemplateTagReading(line);
            }
            this.template = line.substr(this.indexInLine + this.label.length).trim();
            this.template = getValue(this.template);
            if (leftOfTemplate === '') {
                this.lineNumOffset = -1;
            }
            else {
                this.lineNumOffset = 0;
            }
            return;
        }
        this.label = templateAtStartLabel;
        this.startIndexInLine = line.indexOf(templateAtStartLabel);
        if (this.startIndexInLine !== notFound && !disabled) {
            this.isFound = true;
            this.endIndexInLine = line.indexOf(templateAtEndLabel, this.startIndexInLine);
            if (this.endIndexInLine !== notFound) {
                this.template = cutReplaceToTag(line.substr(this.endIndexInLine + templateAtEndLabel.length).trim());
                this.lineNumOffset = parseInt(line.substring(this.startIndexInLine + templateAtStartLabel.length, this.endIndexInLine));
                return;
            }
        }
        this.isFound = false;
        this.label = '';
        this.template = '';
        this.lineNumOffset = 0;
    }
    onFileTemplateTagReading(line) {
        this.indentAtTag = indentRegularExpression.exec(line)[0];
        this.minIndentLength = maxNumber;
    }
    onReadLine(line) {
        const currentIndent = indentRegularExpression.exec(line)[0];
        var readingNext = true;
        if (currentIndent.length > this.indentAtTag.length && line.startsWith(this.indentAtTag)) {
            this.templateLines.push(line);
            this.minIndentLength = Math.min(this.minIndentLength, currentIndent.length);
        }
        else if (line.trim() === '') {
            this.templateLines.push(line);
        }
        else {
            this.onEndOfFile();
            readingNext = false;
        }
        return readingNext;
    }
    onEndOfFile() {
        this.templateLines = this.templateLines.map((line) => (line.substring(this.minIndentLength)));
    }
    // includesKey
    includesKey(keys) {
        const commonCase = (this.label !== templateIfLabel);
        if (commonCase) {
            for (const key of keys) {
                if (this.template.includes(key)) {
                    return true;
                }
            }
            return false;
        }
        else { // if (this.label === templateIfLabel)
            return keys.includes(templateIfYesKey) && keys.includes(templateIfNoKey);
        }
    }
    // scanKeys
    scanKeys(allKeys) {
        const keysSortedByLength = allKeys.slice(); // copy
        keysSortedByLength.sort((b, a) => (a.length, b.length));
        const scanedKeys = [];
        const replaced = '\n';
        var template = this.template;
        for (const key of keysSortedByLength) {
            const keyRE = new RegExp(lib.escapeRegularExpression(key), 'g');
            if (keyRE.test(template)) {
                scanedKeys.push(key);
                template = template.replace(keyRE, replaced);
            }
        }
        return scanedKeys;
    }
    // scanKeyValues
    async scanKeyValues(toValue, allKeys, parser) {
        const keysSortedByLength = Object.keys(allKeys).slice(); // copy
        keysSortedByLength.sort((b, a) => (a.length, b.length));
        const foundIndices = new Map();
        const verboseMode = parser.verbose;
        var template = this.template;
        // Set variable names to "key" from "#template:" tag's value
        //     key = [ __A__, __B__ ]
        //     #template: (__A__:__B__)
        for (const key of keysSortedByLength) {
            var index = 0;
            for (;;) {
                index = template.indexOf(key, index);
                if (index === notFound) {
                    break;
                }
                foundIndices.set(index, key);
                template =
                    template.substring(0, index) +
                        ' '.repeat(key.length) +
                        template.substring(index + key.length);
                // erase the key
                index += 1;
            }
        }
        const indices = Array.from(foundIndices.keys()).sort((a, b) => (a - b));
        const keys = indices.map((index) => (foundIndices.get(index)));
        const placeholder = '\n';
        var templatePattern = this.template;
        for (let i = indices.length - 1; i >= 0; i -= 1) {
            templatePattern =
                templatePattern.substring(0, indices[i]) +
                    placeholder +
                    templatePattern.substring(indices[i] + keys[i].length);
        }
        const templateRegularExpression = lib.escapeRegularExpression(templatePattern).replace(new RegExp(placeholder, "g"), '(.*)');
        const toValueIsMatchedWithTemplate = new RegExp(templateRegularExpression).exec(toValue);
        const keyValues = {};
        if (verboseMode) {
            console.log(`        Verbose: scanKeyValues:`);
            console.log(`            Verbose: template: ${this.template}`);
            console.log(`            Verbose: templatePattern: ${templatePattern.replace(new RegExp(placeholder, "g"), '*')}`);
            console.log(`            Verbose: toValue: ${toValue}`);
            console.log(`            Verbose: toValueIsMatchedWithTemplate: ${toValueIsMatchedWithTemplate != null}`);
        }
        if (toValueIsMatchedWithTemplate) {
            // Case that "#to:" tag is pattern of template
            //     (A:B)  #to: (a:b)  #template: (__A__:__B__)
            for (let i = 1; i < toValueIsMatchedWithTemplate.length; i += 1) {
                const value = toValueIsMatchedWithTemplate[i].trim();
                checkLineNoConfilict(keyValues, keys[i - 1], value, parser);
                keyValues[keys[i - 1]] = value;
            }
        }
        else {
            // Case that "#to:" tag is CSV
            //     (A:B)  #to: a, b  #template: (__A__:__B__)
            const toValues = await lib.parseCSVColumns(toValue);
            if (toValues.length !== keys.length) {
                console.log('');
                console.log(`ERROR: ${translate(`The parameter count in #to tag:`)}`);
                console.log(`    To tag: ${getTestablePath(parser.filePath)}:${parser.lineNum}:${parser.line}`);
                console.log(`    ${translate('Variable count in the template tag:')} ${keys.length}`);
                console.log(`    ${translate('Value count in the to tag:')} ${toValues.length}`);
                parser.errorCount += 1;
                parser.toTagError = true;
            }
            for (let i = 0; i < keys.length; i += 1) {
                if (i < toValues.length && toValues[i]) {
                    checkLineNoConfilict(keyValues, keys[i], toValues[i], parser);
                    keyValues[keys[i]] = toValues[i];
                }
            }
        }
        const returnKeyValues = {};
        for (const key of Object.keys(keyValues)) {
            returnKeyValues[key] = {
                value: keyValues[key],
                lineNum: parser.lineNum,
                settingsIndex: allKeys[key].settingsIndex,
                tag: 'toAfterTemplate',
                isReferenced: false,
            };
        }
        return returnKeyValues;
    }
    // evaluate
    evaluate(setting) {
        if (this.label !== templateIfLabel) {
            return new Error();
        }
        const expression = this.template;
        const evaluatedContidion = evaluateIfCondition(expression, setting, this.parser);
        if (typeof evaluatedContidion === 'boolean') {
            if (evaluatedContidion) {
                this.oldTemplate = templateIfNoKey;
                this.newTemplate = templateIfYesKey;
            }
            else {
                this.oldTemplate = templateIfYesKey;
                this.newTemplate = templateIfNoKey;
            }
            return evaluatedContidion;
        }
        else if (instanceOf.EvaluatedCondition(evaluatedContidion)) {
            return new Error();
        }
        else {
            return evaluatedContidion;
        }
    }
    // checkTargetFileContents
    async checkTargetFileContents(setting, parser) {
        const parentPath = path.dirname(parser.filePath);
        const targetFilePath = lib.getFullPath(getExpectedLine(setting, this.template), parentPath);
        const templateEndLineNum = parser.lineNum;
        if (parser.verbose) {
            console.log(`        Verbose: checkTargetFileContents: ${getTestablePath(parser.filePath)}`);
        }
        if (!fs.existsSync(targetFilePath)) {
            const templateLineNum = templateEndLineNum - this.templateLines.length;
            parser.flushToTagList();
            console.log("");
            console.log(translate(`Error of not found the target file:`));
            console.log(`  ${translate('NotFound')}: ${getTestablePath(targetFilePath)}`);
            console.log(`  Template: ${getTestablePath(parser.filePath)}:${templateLineNum}`);
            parser.errorCount += 1;
            return false;
        }
        const targetFileReader = readline.createInterface({
            input: fs.createReadStream(targetFilePath),
            crlfDelay: Infinity
        });
        if (this.templateLines.length === 0) {
            return false;
        }
        const testingContents = [];
        for await (const line1 of targetFileReader) {
            const line = line1;
            testingContents.push(line);
        }
        var expectedParts = [];
        var lastEmptyLineCount = 0;
        for (const line of this.templateLines) {
            expectedParts.push(getExpectedLineInFileTemplate(setting, line, parser));
            lastEmptyLineCount = (line.trim() === '') ? (lastEmptyLineCount + 1) : 0;
        }
        expectedParts.splice(expectedParts.length - lastEmptyLineCount, expectedParts.length);
        const indent = ' '.repeat(this.minIndentLength);
        const unexpectedLine = lib.checkExpectedTextContents(testingContents, expectedParts, fileTemplateAnyLinesLabel);
        if (unexpectedLine) {
            console.log('');
            console.log(`${getTestablePath(parser.filePath)}:${parser.lineNum - this.templateLines.length + unexpectedLine.partsLineNum - 1}: ` +
                `${indent + this.templateLines[unexpectedLine.partsLineNum - 1]}`);
            console.log(`${getTestablePath(targetFilePath)}:${unexpectedLine.contentsLineNum}: ${unexpectedLine.contentsLine || '(Not found)'}`);
            console.log(`    ${translate('Warning')}: ${translate('Not same as file contents')}`);
            console.log(`    ${translate('Expected')}: ${unexpectedLine.partsLine}`);
            parser.warningCount += 1;
            return false;
        }
        return true;
    }
}
class IfTagParser {
    // constructor
    constructor(parser) {
        this.thisIsOutOfFalseBlock_ = true;
        this.indentLengthsOfIfTag = [
            { indentLength: -1, resultOfIf: true, enabled: true, isReplacable: true }
        ];
        this.isReplacable_ = true;
        this.parser = parser;
    }
    get thisIsOutOfFalseBlock() { return this.thisIsOutOfFalseBlock_; }
    get isReplacable() { return this.isReplacable_; } // #search: typrm replace with if tag
    // evaluate
    evaluate(line, setting, previsousEvalatedKeys = []) {
        var expression = '';
        const indentLength = indentRegularExpression.exec(line)[0].length;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {
                this.indentLengthsOfIfTag.pop();
                this.thisIsOutOfFalseBlock_ = lastOf(this.indentLengthsOfIfTag).enabled;
                this.isReplacable_ = lastOf(this.indentLengthsOfIfTag).isReplacable;
                if (this.parser.verbose) {
                    console.log(`        Verbose: ${getTestablePath(this.parser.filePath)}:${this.parser.lineNum - 1}: end #if:`);
                }
            }
        }
        if (ifLabelRE.exec(line) && !line.includes(disableLabel)) {
            expression = line.substring(line.indexOf(ifLabel) + ifLabel.length).trim();
            const evaluatedContidion = evaluateIfCondition(expression, setting, this.parser, previsousEvalatedKeys);
            if (typeof evaluatedContidion === 'boolean') {
                var resultOfIf = evaluatedContidion;
                var isReplacable = false;
            }
            else if (instanceOf.EvaluatedCondition(evaluatedContidion)) {
                var resultOfIf = evaluatedContidion.result;
                var isReplacable = evaluatedContidion.isReplacable;
            }
            else {
                if (this.parser.ifTagErrorMessageIsEnabled) {
                    console.log('');
                    console.log(`${getTestablePath(this.parser.filePath)}:${this.parser.lineNum}: ${line}`);
                    console.log(`    ${translate('Error')}: ${translate('if tag syntax')}`);
                    this.parser.errorCount += 1;
                }
                var resultOfIf = true;
                var isReplacable = false;
            }
            if (this.thisIsOutOfFalseBlock && !resultOfIf) {
                this.thisIsOutOfFalseBlock_ = false;
            }
            this.indentLengthsOfIfTag.push({ indentLength, resultOfIf,
                enabled: this.thisIsOutOfFalseBlock, isReplacable: this.isReplacable_ });
            this.isReplacable_ = isReplacable;
        }
    }
    // setPosition
    setPosition(filePath, line, lineNum) {
        this.parser.filePath = filePath;
        this.parser.lineNum = lineNum;
        this.parser.line = line;
    }
}
class EnableFileTemplateParser {
    constructor(parser) {
        this.indentLengthsOfIfTag = [
            { indentLength: -1, resultOfIf: true }
        ];
        this.isEnabled_ = true;
        this.parser = parser;
    }
    get isEnabled() { return this.isEnabled_; }
    evaluate(line, setting) {
        const indentLength = indentRegularExpression.exec(line)[0].length;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {
                this.indentLengthsOfIfTag.pop();
                this.isEnabled_ = lastOf(this.indentLengthsOfIfTag).resultOfIf;
            }
        }
        if (line.includes(enableFileTemplateIfExistLabel) && !line.includes(disableLabel)) {
            const tagLabel = enableFileTemplateIfExistLabel;
            const basePath = path.parse(this.parser.filePath).dir;
            const pathParameter = line.substring(line.indexOf(tagLabel) + tagLabel.length).trim();
            const fullPathParameter = lib.getFullPath(pathParameter, basePath);
            var resultOfIf = fs.existsSync(fullPathParameter);
            this.indentLengthsOfIfTag.push({ indentLength, resultOfIf });
            this.isEnabled_ = resultOfIf;
        }
    }
}
class BlockDisableTagParser {
    constructor() {
        this.previousLineHasTag = false;
        this.isInBlock_ = false;
        this.blockIndentLength = 0;
    }
    get isInBlock() { return this.isInBlock_; }
    evaluate(line) {
        if (line.trim() === '') {
            return;
        }
        const indentLength = indentRegularExpression.exec(line)[0].length;
        if (this.isInBlock_) {
            if (indentLength <= this.blockIndentLength) {
                this.blockIndentLength = 0;
                this.isInBlock_ = false;
            }
        }
        else {
            this.isInBlock_ = this.previousLineHasTag;
        }
        if (line.includes(searchIfLabel)) {
            this.blockIndentLength = indentLength;
            this.previousLineHasTag = true;
        }
        else {
            this.previousLineHasTag = false;
        }
    }
}
class WordPositions {
    constructor() {
        this.wordPositions = [];
    }
    get length() { return this.wordPositions.length; }
    setPhrase(phrase) {
        const words = phrase.split(' ');
        var wordIndex = 0;
        var position = 0;
        for (const word of words) {
            this.wordPositions.push(position);
            wordIndex += 1;
            position += word.length + 1;
        }
    }
    getWordIndex(phrasePosition) {
        var wordIndex = -1;
        for (const wordPosition of this.wordPositions) {
            if (phrasePosition < wordPosition) {
                break; // wordIndex = .
            }
            wordIndex += 1;
        }
        if (wordIndex >= this.wordPositions.length) {
            wordIndex = this.wordPositions.length - 1;
        }
        return wordIndex;
    }
}
// ParticpleWord related functions:
//      particpleWordIsCorrectCase
function newParticplesFromKeyphrase(keyphrase, thesaurus) {
    const keywords = lib.toWordArray(keyphrase);
    return {
        keyphrase: keyphrase,
        words: keywords.map((keyword) => {
            const keywordLowerCase = keyword.toLowerCase();
            const keywordE = (keyword.slice(-1) === 'e') ? keyword.slice(0, -1) : keyword; // cut last "e"
            const keywordS = (keyword.slice(-1) === 's') ? keyword + 'e' : keyword; // add last "e"
            const keywordLowerCaseE = keywordE.toLowerCase();
            return {
                specified: keyword,
                specifiedLowerCase: keywordLowerCase,
                commonPartLowerCase: keywordLowerCaseE,
                particples: [
                    keywordE + 'ing',
                    keywordE + 'er',
                    keywordE + 'ed',
                    keywordS + 's'
                ],
                particplesLowerCase: [
                    keywordLowerCaseE + 'ing',
                    keywordLowerCaseE + 'er',
                    keywordLowerCaseE + 'ed',
                    keywordS.toLowerCase() + 's'
                ],
            };
        }),
        formalWordsLowerCase: keywords.map(keyword => thesaurus.normalize(keyword).toLocaleLowerCase()),
        normalizedWords: keywords.map(keyword => {
            const normalized = thesaurus.normalize(keyword);
            const normalizedLowerCase = normalized.toLowerCase();
            const normalizedE = (normalized.slice(-1) === 'e') ? normalized.slice(0, -1) : normalized; // cut last "e"
            const normalizedS = (normalized.slice(-1) === 's') ? normalized + 'e' : normalized; // add last "e"
            const normalizedLowerCaseE = normalizedE.toLowerCase();
            return {
                specified: normalized,
                specifiedLowerCase: normalizedLowerCase,
                commonPartLowerCase: normalizedLowerCaseE,
                particples: [
                    normalizedE + 'ing',
                    normalizedE + 'er',
                    normalizedE + 'ed',
                    normalizedS + 's'
                ],
                particplesLowerCase: [
                    normalizedLowerCaseE + 'ing',
                    normalizedLowerCaseE + 'er',
                    normalizedLowerCaseE + 'ed',
                    normalizedS.toLowerCase() + 's'
                ],
            };
        }),
    };
}
function particpleWordIsCorrectCase(checkingWord, keywordParticple, commonLength) {
    const checkingCommonLowerCase = checkingWord.substring(0, commonLength).toLowerCase();
    const keywordCommonLowerCase = keywordParticple.substring(0, commonLength).toLowerCase();
    const checkingSuffix = checkingWord.substring(commonLength);
    const keywordSuffix = keywordParticple.substring(commonLength);
    return keywordCommonLowerCase === checkingCommonLowerCase && keywordSuffix === checkingSuffix;
}
async function replace(inputFileOrFolderPath) {
    await replaceMain(inputFileOrFolderPath, 'replace');
}
async function reset(inputFileOrFolderPath) {
    await replaceMain(inputFileOrFolderPath, 'reset');
}
async function replaceMain(inputFileOrFolderPath, command) {
    const parser = new Parser();
    const currentFolderBackUp = process.cwd();
    try {
        for await (const inputFilePath of await listUpFilePaths(inputFileOrFolderPath)) {
            await replaceSub(inputFilePath, parser, command);
        }
    }
    catch (e) {
        console.log('');
        console.log('Exception: ' + e.toString());
        parser.errorCount += 1;
    }
    finally {
        process.chdir(currentFolderBackUp);
    }
    console.log('');
    console.log(`${translate('Warning')}: ${parser.warningCount}, ${translate('Error')}: ${parser.errorCount}`);
}
async function replaceSub(inputFilePath, parser, command) {
    parser.command = CommandEnum.replace;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = inputFilePath;
    if (parser.verbose) {
        console.log(`    Verbose: replaceSub:`);
        console.log(`        Verbose: inputFilePath: ${getTestablePath(inputFilePath)}`);
    }
    const settingTree = await makeSettingTree(parser);
    if (command === 'replace') {
        var toTagTree = await makeReplaceToTagTree(parser, settingTree);
        var addOriginalTag = true;
        var cutOriginalTag = false;
        var cutReplaceToTagEnabled = true;
    }
    else { // if (command === 'reset') {
        var toTagTree = await makeOriginalTagTree(parser, settingTree);
        var addOriginalTag = false;
        var cutOriginalTag = true;
        var cutReplaceToTagEnabled = false;
    }
    if (toTagTree.replaceToLength === 0) {
        return;
    }
    if (parser.verbose) {
        console.log(`Verbose: Phase 3: replace ...`);
    }
    const verbose = parser.verbose;
    const conflictErrors = {};
    var isSetting = false;
    var replacingKeys = [];
    var replacingKeyValues = {};
    const updatingFilePath = inputFilePath + ".updating";
    const writer = new WriteBuffer(fs.createWriteStream(updatingFilePath));
    const fileContents = fs.readFileSync(inputFilePath, 'utf-8');
    const hasLastLF = (fileContents.slice(-1) === '\n');
    const lines = fileContents.split('\n');
    if (hasLastLF) {
        lines.pop(); // cut last empty line
    }
    const linesWithoutToTagOnlyLine = [];
    var settingIndentLength = 0;
    var lineNum = 0;
    var isCheckingTemplateIfKey = false;
    var templateIfKeyError = false;
    var copyTagIndent = '';
    var copyTagLineNum = 0;
    var oldSettingAndCopyTagParameters = {};
    var newSettingAndCopyTagParameters = {};
    const checkedTemplateTags = {};
    var templatesInCopyTag = [];
    const templatesInCopyTagAll = await makeTemplatesInCopyTag(lines);
    try {
        for (const line of lines) {
            var output = false;
            lineNum += 1;
            parser.lineNum = lineNum;
            linesWithoutToTagOnlyLine.push(line);
            parser.verbose = false;
            settingTree.moveToLine(parser);
            parser.verbose = verbose;
            toTagTree.moveToLine(parser, settingTree);
            const oldSetting = toTagTree.currentOldSettingsInIfBlock; // not settingTree.currentSettings
            const newSetting = toTagTree.currentNewSettingsInIfBlock;
            if (settingTree.wasChanged) {
                replacingKeys = Object.keys(oldSetting);
                replacingKeyValues = {};
                for (const [key, value] of Object.entries(newSetting)) {
                    replacingKeyValues[key] = value.value;
                }
                for (const error of toTagTree.currentNotFoundNameInSameAsTag) {
                    const settingNames = error.referencedVariableNames.concat([error.settingName]);
                    console.log('');
                    console.log(`${getVariablesForErrorMessage('', settingNames, settingTree, lines, parser.filePath)}`);
                    console.log(`    ${translate('Warning')}: ${translate('Not found a variable name.')}`);
                    console.log(`    Same as: ${error.notFoundName}`);
                    parser.errorCount += 1;
                }
            }
            // #copy tag   #breadcrumb:
            if (copyTagIndent) {
                if (!line.startsWith(copyTagIndent) && line.trim() !== '') {
                    copyTagIndent = '';
                    copyTagLineNum = 0;
                    replacingKeys = Object.keys(oldSetting);
                    templatesInCopyTag = [];
                    oldSettingAndCopyTagParameters = {};
                    newSettingAndCopyTagParameters = {};
                }
            }
            if (line.includes('#copy')) {
                const copyTagIndex = tagIndexOf(line, copyLabel);
                const copyTemplateTagIndex = tagIndexOf(line, copyTemplateLabel);
                if (copyTagIndex !== notFound || copyTemplateTagIndex !== notFound) {
                    if (copyTagIndex !== notFound) { // if copyTagIndex
                        var copyTagValue = getValue(line, copyTagIndex + copyLabel.length);
                    }
                    else { // if copyTemplateTagIndex
                        var copyTagValue = getValue(line, copyTemplateTagIndex + copyTemplateLabel.length);
                    }
                    const firstCommaIndex = copyTagValue.indexOf(',');
                    if (firstCommaIndex !== notFound) {
                        const copyTagName = copyTagValue.substring(0, firstCommaIndex);
                        const parameters = yaml.load(copyTagValue.substring(firstCommaIndex + 1));
                        const values = Object.entries(parameters).filter(keyValue => !keyValue[1].startsWith(settingsDot))
                            .map(keyValue => [keyValue[0], {
                                value: keyValue[1].toString(), lineNum, settingsIndex: '', tag: 'copyArgument', isReferenced: true,
                            }]);
                        const variables = Object.entries(parameters).filter(keyValue => keyValue[1].startsWith(settingsDot))
                            .map(keyValue => [keyValue[0], keyValue[1].toString().substring(settingsDot.length)]);
                        const copyTagParameters = variables.filter(keyValue => (keyValue[1] in oldSetting));
                        copyTagIndent = indentRegularExpression.exec(line)[0] + ' ';
                        copyTagLineNum = lineNum;
                        templatesInCopyTag = templatesInCopyTagAll.filter(item => item.copyTagName === copyTagName);
                        oldSettingAndCopyTagParameters = {
                            ...oldSetting,
                            ...Object.fromEntries(values),
                            ...Object.fromEntries(copyTagParameters.map(keyValue => [keyValue[0], oldSetting[keyValue[1]]]))
                        };
                        newSettingAndCopyTagParameters = {
                            ...newSetting,
                            ...Object.fromEntries(values),
                            ...Object.fromEntries(copyTagParameters.map(keyValue => [keyValue[0], newSetting[keyValue[1]]]))
                        };
                        replacingKeys = Object.keys(oldSettingAndCopyTagParameters);
                        if (copyTagParameters.length < variables.length) {
                            const foundVaraibleNames = copyTagParameters.map(keyValue => keyValue[1]);
                            const notFoundVariables = variables.filter(keyValue => !foundVaraibleNames.includes(keyValue[1]))
                                .map(keyValue => keyValue[1]);
                            console.log('');
                            console.log(getVariablesForErrorMessage('', [], settingTree, lines, inputFilePath));
                            console.log(`${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                            console.log(`    ${translate('Error')}: ${translate('Not found specified variable name.')}`);
                            console.log(`    ${translate('Variable')}: ${notFoundVariables.join(', ')}`);
                            parser.errorCount += 1;
                        }
                    }
                }
            }
            // #settings tag   #breadcrumb:
            if (settingLabel.test(line) && !line.includes(disableLabel)) {
                isSetting = true;
                settingIndentLength = indentRegularExpression.exec(line)[0].length;
                if (!templateIfKeyError) {
                    isCheckingTemplateIfKey = true;
                }
            }
            else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isSetting) {
                isSetting = false;
            }
            // In settings   #breadcrumb:
            if (isSetting) {
                const separator = line.indexOf(':');
                if (separator !== notFound) {
                    const key = line.substring(0, separator).trim();
                    if (command === 'replace') {
                        var currentIsOutOfFalse = toTagTree.currentIsOutOfFalseBlock;
                    }
                    else { // command === 'reset'
                        var currentIsOutOfFalse = settingTree.currentIsOutOfFalseBlock;
                    }
                    if (key in oldSetting && replacingKeys.includes(key) && currentIsOutOfFalse) {
                        const oldValue = getValue(line, separator);
                        // This is not "oldSetting[key].value", because it adds bad #original tag in #if tag block.
                        var newValue = newSetting[key].value;
                        if (newValue !== oldValue) {
                            if (parser.verbose) {
                                console.log(`    Verbose: replace a setting: ${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                                console.log(`    Verbose:     replace from: ${oldValue}`);
                                console.log(`    Verbose:     replace to  : ${newValue}`);
                            }
                            // Change a settings value   #breadcrumb:
                            const { original, spaceAndComment } = getReplacedLineInSettings(line, separator, oldValue, newValue, addOriginalTag, cutOriginalTag, cutReplaceToTagEnabled);
                            const newLine = line.substring(0, separator + 1) + ' ' + newValue + original + spaceAndComment;
                            writer.write(newLine + "\n");
                            output = true;
                            if (parser.verbose) {
                                console.log(`    Verbose: ${getTestablePath(inputFilePath)}:${lineNum}: ${newLine}`);
                            }
                        }
                    }
                }
                // Out of settings   #breadcrumb:
            }
            else {
                const templateTag = parseTemplateTag(line, parser);
                if (templateTag.isFound) {
                    parser.templateCount += 1;
                }
                else {
                    if (copyTagIndent) {
                        const templateInCopyTag = templatesInCopyTag.find(item => item.lineNumOffset === lineNum - copyTagLineNum);
                        if (templateInCopyTag) {
                            templateTag.isFound = true;
                            templateTag.template = templateInCopyTag.template;
                            templateTag.label = templateLabel;
                            templateTag.lineNumOffset = 0;
                        }
                    }
                }
                if (templateTag.isFound && templateTag.includesKey(replacingKeys)
                    && toTagTree.currentIsOutOfFalseBlock) {
                    const replacingLine = linesWithoutToTagOnlyLine[linesWithoutToTagOnlyLine.length - 1 + templateTag.lineNumOffset];
                    const commonCase = (templateTag.label !== templateIfLabel);
                    const emphasizedColor = chalk.yellowBright;
                    if (!copyTagIndent) { // if common case
                        if (commonCase) {
                            var expected = getExpectedLine(oldSetting, templateTag.template);
                            var replaced = getReplacedLine(newSetting, templateTag.template);
                            var coloredReplaced = emphasizedColor(replaced);
                        }
                        else { // if (templateTag.label === templateIfLabel)
                            templateTag.evaluate(newSetting);
                            var expected = getExpectedLine(oldSetting, templateTag.oldTemplate);
                            var replaced = getReplacedLine(newSetting, templateTag.newTemplate);
                            var coloredReplaced = emphasizedColor(replaced);
                        }
                    }
                    else { // if copyTagIndent
                        if (commonCase) {
                            var expected = getExpectedLine(oldSettingAndCopyTagParameters, templateTag.template);
                            var replaced = getReplacedLine(newSettingAndCopyTagParameters, templateTag.template);
                            var coloredReplaced = emphasizedColor(replaced);
                        }
                        else { // if (templateTag.label === templateIfLabel)
                            templateTag.evaluate(newSetting);
                            var expected = getExpectedLine(oldSettingAndCopyTagParameters, templateTag.oldTemplate);
                            var replaced = getReplacedLine(newSettingAndCopyTagParameters, templateTag.newTemplate);
                            var coloredReplaced = emphasizedColor(replaced);
                        }
                    }
                    if (replacingLine.includes(expected)) {
                        const before = expected;
                        const after = replaced;
                        if (parser.verbose && before !== after) {
                            if (templateTag.lineNumOffset === 0) {
                                console.log(`    Verbose: replace template variables`);
                            }
                            else {
                                console.log(`    Verbose: replace template-at(${templateTag.lineNumOffset}) variables`);
                            }
                            console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                            console.log(`        Verbose:     replace from: ${before}`);
                            console.log(`        Verbose:     replace to  : ${after}`);
                        }
                        if (templateTag.lineNumOffset === 0) {
                            var replacedLine = line.replace(new RegExp(lib.escapeRegularExpression(before), 'g'), after.replace(/\$/g, '$$'));
                            if (cutReplaceToTagEnabled) {
                                replacedLine = cutReplaceToTag(replacedLine);
                            }
                            writer.write(replacedLine + "\n");
                            output = true;
                            const outputTargetLineNum = writer.lineBuffer.length;
                            checkedTemplateTags[outputTargetLineNum] = [];
                            checkedTemplateTags[outputTargetLineNum].push({
                                templateLineNum: lineNum,
                                template: templateTag.template,
                                variableNames: templateTag.scanKeys(Object.keys(settingTree.currentSettings)),
                                targetLineNum: lineNum,
                                expected: before,
                                replaced: after.replace(/\$/g, '$$'),
                                coloredReplaced: coloredReplaced.replace(/\$/g, '$$')
                            });
                            if (parser.verbose) {
                                if (before !== after) {
                                    console.log(`    Verbose: replaced`);
                                    console.log(`        Verbose: before: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${line}`);
                                    console.log(`        Verbose: after:  ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${replacedLine}`);
                                }
                                else {
                                    console.log(`    Verbose: not replaced`);
                                    console.log(`        Verbose: after:  ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${replacedLine}`);
                                }
                            }
                        }
                        else if (templateTag.lineNumOffset <= -1) {
                            const outputTargetLineNum = writer.lineBuffer.length + 1 + templateTag.lineNumOffset;
                            if (!(outputTargetLineNum in checkedTemplateTags)) {
                                checkedTemplateTags[outputTargetLineNum] = [];
                            }
                            checkedTemplateTags[outputTargetLineNum].push({
                                templateLineNum: lineNum,
                                template: templateTag.template,
                                variableNames: templateTag.scanKeys(Object.keys(settingTree.currentSettings)),
                                targetLineNum: lineNum + templateTag.lineNumOffset,
                                expected: before,
                                replaced: after.replace(/\$/g, '$$'),
                                coloredReplaced: coloredReplaced.replace(/\$/g, '$$')
                            });
                            var lengthSortedTemplates = checkedTemplateTags[outputTargetLineNum].slice();
                            lengthSortedTemplates = lengthSortedTemplates.sort((b, a) => (a.expected.length - b.expected.length));
                            let replacingLine = linesWithoutToTagOnlyLine[linesWithoutToTagOnlyLine.length + templateTag.lineNumOffset - 1];
                            var maskedLine = replacingLine;
                            const mask = '\n';
                            var conflictedTemplates = [];
                            if (parser.verbose) {
                                console.log(`    Verbose: check not conflicted:`);
                                console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${linesWithoutToTagOnlyLine.length + templateTag.lineNumOffset}: ${replacingLine}`);
                                console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${linesWithoutToTagOnlyLine.length}: ${line}`);
                                console.log(`        Verbose: replacingLine: ${replacingLine}`);
                                console.log(`        Verbose: maskedLine   : ${maskedLine}`);
                            }
                            for (const template of lengthSortedTemplates) {
                                if (template.expected !== template.replaced) {
                                    if (parser.verbose) {
                                        console.log(`        Verbose: replace from: ${template.expected}`);
                                        console.log(`        Verbose: replace to  : ${template.replaced}`);
                                    }
                                    if (template.expected.includes(template.replaced)) {
                                        // e.g. expected == 'something', replaced = 'some'
                                        if (replacingLine.includes(template.expected)) {
                                            var wasReplaced = false;
                                        }
                                        else {
                                            var wasReplaced = replacingLine.includes(replaced);
                                        }
                                    }
                                    else if (template.replaced.includes(template.expected)) {
                                        // e.g. expected == 'some', replaced = 'something'
                                        var wasReplaced = replacingLine.includes(template.replaced);
                                    }
                                    else {
                                        // e.g. expected == 'anything', replaced = 'something'
                                        var wasReplaced = replacingLine.includes(template.replaced);
                                    }
                                    var i = 0;
                                    if (wasReplaced) {
                                        if (parser.verbose) {
                                            console.log(`        Verbose: wasReplaced = true`);
                                        }
                                    }
                                    else {
                                        if (!maskedLine.includes(template.expected)) {
                                            conflictedTemplates.push(template);
                                        }
                                        else {
                                            for (;;) {
                                                i = maskedLine.indexOf(template.expected, i);
                                                if (i === notFound) {
                                                    break;
                                                }
                                                // Replace in template
                                                replacingLine = replacingLine.replace(new RegExp(lib.escapeRegularExpression(template.expected), 'g'), template.replaced);
                                                maskedLine = maskedLine.substring(0, i) + mask.repeat(template.replaced.length) + maskedLine.substring(i + template.expected.length);
                                                i += template.expected.length;
                                            }
                                            if (parser.verbose) {
                                                console.log(`        Verbose: replacingLine: ${replacingLine}`);
                                                console.log(`        Verbose: maskedLine   : ${maskedLine.replace(/\n/g, '_')}`);
                                            }
                                        }
                                    }
                                }
                            }
                            for (const template of lengthSortedTemplates) {
                                if (!replacingLine.includes(template.replaced)) {
                                    conflictedTemplates.push(template);
                                }
                            }
                            conflictedTemplates = lib.cutSameItems(conflictedTemplates);
                            writer.replaceAboveLine(templateTag.lineNumOffset, replacingLine + "\n");
                            if (conflictedTemplates.length >= 1 || outputTargetLineNum in conflictErrors) {
                                var variableNames = [];
                                for (const template of checkedTemplateTags[outputTargetLineNum]) {
                                    variableNames.push(...template.variableNames);
                                }
                                variableNames = lib.cutSameItems(variableNames);
                                var errorMessage = '';
                                errorMessage += '\n';
                                errorMessage += `${getTestablePath(inputFilePath)}:${outputTargetLineNum}: ${lines[outputTargetLineNum - 1]}\n`;
                                errorMessage += `    ${translate('Error')}: ${translate('template target values after replace are conflicted.')}` +
                                    ` ${translate('You should add #to: tags at setting variables in other templates.')}\n`;
                                errorMessage += getVariablesForErrorMessage('    ', variableNames, settingTree, lines, parser.filePath, { coloredValue: true, replaceToTag: toTagTree.currentNewSettings }) + '\n';
                                var templateNum = 0;
                                for (const template of checkedTemplateTags[outputTargetLineNum]) {
                                    const replacedLine = lines[outputTargetLineNum - 1].replace(new RegExp(lib.escapeRegularExpression(template.expected), 'g'), template.replaced);
                                    templateNum += 1;
                                    errorMessage += `    replaced (${templateNum}): ${replacedLine.trim()}\n`;
                                    errorMessage += `        ${getTestablePath(inputFilePath)}:${template.templateLineNum}: ${lines[template.templateLineNum - 1]}\n`;
                                    errorMessage += `        ${getTestablePath(inputFilePath)}:${outputTargetLineNum}: ${lines[outputTargetLineNum - 1]}\n`;
                                    errorMessage += `            ${translate('Before Replacing')}: ${template.expected.trim()}\n`;
                                    errorMessage += `            ${translate('After  Replacing')}: ${template.coloredReplaced.trim()}\n`;
                                    errorMessage += `        ${getTestablePath(inputFilePath)}:${outputTargetLineNum}: ${replacedLine}\n`;
                                }
                                conflictErrors[outputTargetLineNum] = lib.cutLast(errorMessage, '\n');
                            }
                            if (parser.verbose) {
                                const replacedLine = replacingLine;
                                if (before !== after) {
                                    console.log(`    Verbose: replaced`);
                                    console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length + templateTag.lineNumOffset}: ${replacedLine}`);
                                    console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${line}`);
                                }
                                else {
                                    console.log(`    Verbose: not replaced`);
                                    console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${replacedLine}`);
                                }
                            }
                        }
                    }
                    else if (replacingLine.includes(replaced)) {
                        // Do nothing
                    }
                    else {
                        if (parser.errorCount === 0) { // Since only one old value can be replaced at a time
                            console.log('');
                            console.log(getErrorMessageOfNotMatchedWithTemplate(templateTag, settingTree, lines));
                            if (expected === replaced) {
                                console.log(`    ${translate('Warning')}: ${translate('Not matched with the template.')}`);
                                parser.warningCount += 1;
                            }
                            else {
                                console.log(`    ${translate('Error')}: ${translate('Not found any replacing target.')} ` +
                                    `${translate('Modify the template target to old or new value.')}`);
                                parser.errorCount += 1;
                            }
                            console.log(`    ${translate('Expected')}: ${expected.trim()}`);
                        }
                    }
                }
                else {
                    if (isCheckingTemplateIfKey && templateTag.label === templateIfLabel) {
                        isCheckingTemplateIfKey = false;
                        const necessaryVariableNames = getNotSetTemplateIfTagVariableNames(replacingKeys);
                        if (necessaryVariableNames !== '') {
                            console.log('');
                            console.log(`${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                            console.log(`  ${translate('Error')}: ${translate('template-if tag related settings are not defined')}`);
                            console.log(`  ${translate('Solution')}: ${translate('Set the variable')} ${necessaryVariableNames}`);
                            console.log(`  ${translate('Setting')}: ${getTestablePath(inputFilePath)}:${settingTree.settingsInformation[settingTree.currentSettingIndex].lineNum}`);
                            parser.errorCount += 1;
                            templateIfKeyError = true;
                        }
                    }
                }
            }
            // Output a line, if not yet   #breadcrumb:
            if (!output) {
                if (!cutReplaceToTagEnabled) {
                    writer.write(line + "\n");
                }
                else {
                    if (line.trim() === '') {
                        writer.write(line + "\n");
                    }
                    else {
                        const cutLine = cutReplaceToTag(line);
                        if (cutLine.trim() === '') {
                            linesWithoutToTagOnlyLine.pop(); // for template-at tag
                        }
                        else {
                            writer.write(cutLine + "\n");
                        }
                    }
                }
            }
        }
        if (!parser.toTagError) {
            for (const conflictError of Object.values(conflictErrors)) {
                console.log(conflictError);
                parser.errorCount += 1;
                break; // Error message count should be 1, because user can focus on one place.
            }
        }
        if (!hasLastLF) {
            writer.cutLastLF();
        }
        writer.end();
        await new Promise((resolve) => {
            writer.on('finish', () => {
                if (parser.errorCount === 0) {
                    const newFileContents = writer.getAllLines();
                    const oldFileContents = fileContents;
                    if (newFileContents !== oldFileContents) {
                        // Overwite the file   #breadcrumb:
                        fs.copyFileSync(updatingFilePath, inputFilePath);
                    }
                }
                resolve(parser.errorCount);
            });
        });
    }
    finally {
        deleteFileSync(updatingFilePath);
    }
}
async function check(checkingFilePath) {
    const parser = new Parser();
    const currentFolderBackUp = process.cwd();
    const copyTags = await CopyTag.scanAllTemplate(checkingFilePath);
    var fileCount = 0;
    try {
        for (const inputFileFullPath of await listUpFilePaths(checkingFilePath)) {
            fileCount += 1;
            await checkRoutine(inputFileFullPath, copyTags, parser);
        }
        parser.flushToTagList();
    }
    catch (e) {
        console.log('');
        console.log('Exception: ' + e.toString());
        parser.errorCount += 1;
    }
    finally {
        process.chdir(currentFolderBackUp);
    }
    CopyTag.check(copyTags, parser);
    console.log('');
    console.log(`${translate('Warning')}: ${parser.warningCount}, ${translate('Error')}: ${parser.errorCount}`);
    console.log(`checked file count = ${fileCount}, template count = ${parser.templateCount}, ` +
        `#to tag count = ${parser.totalToTagCount}`);
}
var CopyTag;
(function (CopyTag) {
    // CopyTag.CheckParser
    class CheckParser {
        constructor() {
            this.parsingCopyTag = undefined;
            this.copyTemplateTag = undefined;
            this.copyTagIndent = '';
            this.settingAndCopyTagParameters = {};
            this.comparableDollers = {};
        }
        // CheckParser.evaluate
        evaluate(line, copyTags, templateTag, setting, parser) {
            this._evaluateCopyTagContents(line, copyTags, templateTag, setting, parser);
            this._evaluateCopyTagStart(line, copyTags, templateTag, setting, parser);
        }
        _evaluateCopyTagStart(line, copyTags, templateTag, setting, parser) {
            if (!this.parsingCopyTag) {
                const copyTagIndex = tagIndexOf(line, copyLabel);
                const copyTemplateTagIndex = tagIndexOf(line, copyTemplateLabel);
                if (copyTagIndex !== notFound || copyTemplateTagIndex !== notFound) {
                    // if copyLabel
                    if (copyTagIndex !== notFound) {
                        const value = getValue(line, copyTagIndex + copyLabel.length);
                        const firstCommaIndex = value.indexOf(',');
                        if (firstCommaIndex === notFound) {
                            var copyName = value;
                        }
                        else {
                            var copyName = value.substring(0, firstCommaIndex).trim();
                        }
                        this.parsingCopyTag = {
                            filePath: parser.filePath,
                            lineNum: parser.lineNum,
                            line,
                            tagName: copyLabel,
                            value,
                            copyName,
                            contents: [], arguments: {}, argumentNames: {},
                        };
                        this.copyTemplateTag = copyTags.find(item => (item.copyName === copyName && item.tagName === copyTemplateLabel));
                        copyTags.push(this.parsingCopyTag);
                        // if copyTemplateLabel
                    }
                    else {
                        const value = getValue(line, copyTemplateTagIndex + copyTemplateLabel.length);
                        const firstCommaIndex = value.indexOf(',');
                        if (firstCommaIndex === notFound) {
                            var copyName = value;
                        }
                        else {
                            var copyName = value.substring(0, firstCommaIndex).trim();
                        }
                        this.parsingCopyTag = copyTags.find(item => (item.copyName === copyName));
                        this.parsingCopyTag.contents = [];
                        this.copyTemplateTag = undefined;
                    }
                    const { evaluated: evaluatedCopyTagValue, isError } = evaluateSettingsDotVariable(this.parsingCopyTag.value, setting);
                    if (isError) {
                        console.log('');
                        console.log(`${getTestablePath(parser.filePath)}:${parser.lineNum}: ${line}`);
                        console.log('    Error: undefined variable');
                        parser.errorCount += 1;
                    }
                    else {
                        this.parsingCopyTag.value = evaluatedCopyTagValue;
                        const firstCommaIndex = this.parsingCopyTag.value.indexOf(',');
                        this.copyTagIndent = indentRegularExpression.exec(line)[0] + ' ';
                        this.settingAndCopyTagParameters = { ...setting };
                        this.comparableDollers = {};
                        for (const name of Object.keys(setting)) {
                            this.comparableDollers[name] = {
                                value: `${settingsDot}${name}`,
                                lineNum: parser.lineNum,
                                settingsIndex: '',
                                tag: 'copyArgument',
                                isReferenced: false,
                            };
                        }
                        if (firstCommaIndex !== notFound) {
                            const specifiedCopyArguments = yaml.load(this.parsingCopyTag.value.substring(firstCommaIndex + 1));
                            if (this.copyTemplateTag) {
                                const defaultArguments = yaml.load(this.copyTemplateTag.value.substring(firstCommaIndex + 1));
                                var copyArguments = Object.entries({ ...defaultArguments, ...specifiedCopyArguments });
                            }
                            else {
                                var copyArguments = Object.entries(specifiedCopyArguments);
                            }
                            for (const [copyTagArgumentName, copyTagArgumentValue] of copyArguments) {
                                this.settingAndCopyTagParameters[copyTagArgumentName] = {
                                    value: copyTagArgumentValue.toString(),
                                    lineNum: parser.lineNum,
                                    settingsIndex: '',
                                    tag: 'copyArgument',
                                    isReferenced: false,
                                };
                                this.comparableDollers[copyTagArgumentName] = {
                                    value: `${copyDot}${copyTagArgumentName}`,
                                    lineNum: parser.lineNum,
                                    settingsIndex: '',
                                    tag: 'copyArgument',
                                    isReferenced: false,
                                };
                            }
                        }
                    }
                }
            }
        }
        _evaluateCopyTagContents(line, copyTags, templateTag, setting, parser) {
            if (this.parsingCopyTag) {
                if (line.startsWith(this.copyTagIndent) || line.trim() === '') {
                    if (this.copyTemplateTag) {
                        const lineNumOffset = this.parsingCopyTag.contents.length;
                        const lineInTemplate = this.copyTemplateTag.contents[lineNumOffset];
                        var sourceTemplateTag = parseTemplateTag(lineInTemplate, parser);
                    }
                    else {
                        var sourceTemplateTag = templateTag;
                    }
                    if (sourceTemplateTag.isFound) {
                        const { expected: expectedText, log: variablesInTemplate } = getExpectedLineAndEvaluationLog(this.settingAndCopyTagParameters, sourceTemplateTag.template);
                        const replacedTextContainsDoller = getReplacedLine(this.comparableDollers, sourceTemplateTag.template);
                        const templateIndex = (templateTag.indexInLine !== notFound) ? templateTag.indexInLine : line.length;
                        const checkingLineWithoutTemplate = line.substring(0, templateIndex);
                        var comparableLine = checkingLineWithoutTemplate.replace(expectedText, replacedTextContainsDoller) +
                            line.substring(templateIndex);
                    }
                    else {
                        var comparableLine = line;
                    }
                    this.parsingCopyTag.contents.push(comparableLine);
                }
                else {
                    this.parsingCopyTag = undefined;
                    this.copyTemplateTag = undefined;
                    this.settingAndCopyTagParameters = {};
                }
            }
        }
    }
    CopyTag.CheckParser = CheckParser;
    // CopyTag.scanAllTemplate
    async function scanAllTemplate(checkingFilePath) {
        const copyTags = [];
        var copyTag = undefined;
        const filePaths = await listUpFilePaths();
        if (checkingFilePath && !filePaths.some(item => item.endsWith(checkingFilePath))) {
            if (fs.existsSync(checkingFilePath)) {
                filePaths.push(lib.getFullPath(checkingFilePath, process.cwd()));
            }
        }
        for (const inputFileFullPath of filePaths) {
            var reader = readline.createInterface({
                input: fs.createReadStream(inputFileFullPath),
                crlfDelay: Infinity
            });
            var lineNum = 0;
            var copyTagIndent = '';
            for await (const line1 of reader) {
                lineNum += 1;
                const line = line1;
                if (copyTag) {
                    if (line.startsWith(copyTagIndent)) {
                        copyTag.contents.push(line);
                    }
                    else {
                        copyTag = undefined;
                    }
                }
                if (line.includes(copyTemplateLabel) && !copyTag) {
                    const copyTagIndex = line.indexOf(copyTemplateLabel);
                    const firstCommaIndex = line.indexOf(',', copyTagIndex);
                    if (firstCommaIndex === notFound) {
                        var copyName = line.substring(copyTagIndex + copyTemplateLabel.length).trim();
                    }
                    else {
                        var copyName = line.substring(copyTagIndex + copyTemplateLabel.length, firstCommaIndex).trim();
                    }
                    copyTag = {
                        filePath: inputFileFullPath,
                        lineNum,
                        line,
                        tagName: copyTemplateLabel,
                        value: getValue(line, copyTagIndex + copyTemplateLabel.length),
                        copyName,
                        contents: [],
                        arguments: {},
                        argumentNames: {},
                    };
                    copyTags.push(copyTag);
                    copyTagIndent = indentRegularExpression.exec(line)[0] + ' ';
                }
            }
        }
        return copyTags;
    }
    CopyTag.scanAllTemplate = scanAllTemplate;
    // CopyTag.check
    function check(copyTags, parser) {
        // copyTags = ...
        for (const copyTag of copyTags) {
            copyTag.contents = copyTag.contents.map(contents => contents.replace(keywordTagAndParameterRegExp, '$1').trimRight());
        }
        const copyNames = Array.from(new Set(copyTags.map(t => t.copyName)));
        const copyTemplateTags = new Map(copyTags.filter(t => t.tagName === copyTemplateLabel).map(t => [t.copyName, t]));
        // checkExpectedTextContents()
        for (const copyName of copyNames) {
            const copyGroup = copyTags.filter(t => t.copyName === copyName);
            if (copyTemplateTags.has(copyName)) {
                var sourceCopyTag = copyTemplateTags.get(copyName);
            }
            else {
                var sourceCopyTag = copyGroup[0];
            }
            for (const copyTag of copyGroup) {
                if (copyTag === sourceCopyTag) {
                    continue;
                }
                const sourceCopyTagDollerContents = getReplacedCopyTagContents(sourceCopyTag, sourceCopyTag, sourceCopyTag.arguments);
                const copyTagDollerContents = getReplacedCopyTagContents(copyTag, sourceCopyTag, copyTag.arguments);
                if (copyTag.contents.length > sourceCopyTagDollerContents.length) {
                    var errorMessage = translate(`(out of copy tag block)`);
                    while (copyTag.contents.includes(errorMessage)) {
                        errorMessage += '_';
                    }
                    sourceCopyTagDollerContents[sourceCopyTagDollerContents.length] = errorMessage;
                }
                for (let lineNumOffset = 0; lineNumOffset < sourceCopyTagDollerContents.length; lineNumOffset += 1) {
                    const templateRegExp = templateTagAndParameterRegExp;
                    const sourceLine = sourceCopyTagDollerContents[lineNumOffset];
                    var targetLine = copyTagDollerContents[lineNumOffset];
                    const templateInSourceLine = templateRegExp.exec(sourceLine);
                    const templateInTargetLine = templateRegExp.exec(targetLine);
                    if (targetLine === undefined) {
                        break;
                    }
                    if (templateInSourceLine && !templateInTargetLine) {
                        targetLine = targetLine.trimRight() + templateInSourceLine[0];
                        copyTagDollerContents[lineNumOffset] = targetLine;
                    }
                }
                const unexpectedLine = lib.checkExpectedTextContents(copyTagDollerContents, sourceCopyTagDollerContents, fileTemplateAnyLinesLabel);
                if (unexpectedLine) {
                    const foundFirstLine = (unexpectedLine.contentsLineNum >= 1);
                    if (foundFirstLine) {
                        var sourceCopyLine = sourceCopyTagDollerContents[unexpectedLine.partsLineNum - 1];
                        var copyLine = unexpectedLine.contentsLine;
                    }
                    else {
                        var sourceCopyLine = sourceCopyTagDollerContents[0];
                        var copyLine = copyTagDollerContents[0];
                    }
                    if (sourceCopyLine.includes('(out of copy tag block)')) {
                        var diff = { greenLine: translate(sourceCopyLine), redLine: copyLine };
                    }
                    else {
                        if (foundFirstLine) {
                            var copyIndentLength = unexpectedLine.contentsIndentLength;
                            var sourceCopyIndentLength = unexpectedLine.partsIndentLength;
                            if (unexpectedLine.indentDiff > 0) {
                                copyIndentLength += unexpectedLine.indentDiff;
                            }
                            else {
                                sourceCopyIndentLength -= unexpectedLine.indentDiff;
                            }
                            var diff = lib.coloredDiff(copyLine, sourceCopyLine, copyIndentLength, sourceCopyIndentLength);
                        }
                        else {
                            const copyIndentLength = indentRegularExpression.exec(copyLine)[0].length;
                            const sourceCopyIndentLength = indentRegularExpression.exec(sourceCopyLine)[0].length;
                            var diff = lib.coloredDiff(copyLine, sourceCopyLine, copyIndentLength, sourceCopyIndentLength);
                        }
                    }
                    console.log('');
                    console.log(`${getTestablePath(sourceCopyTag.filePath)}:${sourceCopyTag.lineNum + unexpectedLine.partsLineNum}: ` +
                        `${diff.greenLine}`);
                    console.log(`${getTestablePath(copyTag.filePath)}:` +
                        `${unexpectedLine.contentsLineNum ? copyTag.lineNum + unexpectedLine.contentsLineNum : copyTag.lineNum + 1}: ` +
                        `${diff.redLine}`);
                    console.log(`    ${translate('Warning')}: ${translate('Not same as #copy tag contents')}`);
                    parser.warningCount += 1;
                }
                if (copyTag.contents.length < sourceCopyTagDollerContents.length) {
                    console.log('');
                    console.log(`${getTestablePath(sourceCopyTag.filePath)}:${sourceCopyTag.lineNum + copyTag.contents.length + 1}: ` +
                        `${sourceCopyTagDollerContents[copyTag.contents.length]}`);
                    console.log(`${getTestablePath(copyTag.filePath)}:${copyTag.lineNum + copyTag.contents.length + 1}: ` +
                        `${translate(`(out of copy tag block)`)}`);
                    console.log(`    ${translate('Warning')}: ${translate('Not same as #copy tag contents')}`);
                    parser.warningCount += 1;
                }
            }
        }
    }
    CopyTag.check = check;
})(CopyTag || (CopyTag = {}));
var SameAsTag;
(function (SameAsTag) {
    // SameAsTag.label
    SameAsTag.label = "#same-as:";
    // evaluateVariableName
    function evaluateVariableName(variableName, setting) {
        const return_ = {
            variableName,
            referencedVariableNames: [],
            errorVariableNames: [],
        };
        var matchedVariable = null;
        settingsDotRe.lastIndex = 0;
        while ((matchedVariable = settingsDotRe.exec(variableName)) !== null) {
            const referencingVariableName = matchedVariable[1];
            if (referencingVariableName in setting) {
                return_.variableName = return_.variableName.replace(matchedVariable[0], `${setting[referencingVariableName].value}`);
                setting[referencingVariableName].isReferenced = true;
                return_.referencedVariableNames.push(referencingVariableName);
            }
            else {
                return_.errorVariableNames.push(referencingVariableName);
            }
        }
        return return_;
    }
    SameAsTag.evaluateVariableName = evaluateVariableName;
})(SameAsTag || (SameAsTag = {}));
async function listUpFilePaths(checkingFilePath) {
    const currentFolder = process.cwd();
    const inputFileFullPaths = [];
    const notFoundPaths = [];
    var targetFolders = await lib.parseCSVColumns(programOptions.folder);
    targetFolders = targetFolders.map((path) => (lib.pathResolve(path))); // Normalize path separators
    if (checkingFilePath) {
        if (lib.isFullPath(checkingFilePath)) {
            inputFileFullPaths.push(checkingFilePath);
        }
        else {
            if (!targetFolders.includes(currentFolder)) {
                targetFolders.push(currentFolder);
            }
            for (const folder of targetFolders) {
                const targetFolderFullPath = lib.getFullPath(folder, currentFolder);
                const inputFileFullPath = lib.getFullPath(checkingFilePath, targetFolderFullPath);
                if (fs.existsSync(inputFileFullPath)) {
                    inputFileFullPaths.push(inputFileFullPath);
                }
                else {
                    notFoundPaths.push(getTestablePath(inputFileFullPath));
                }
            }
            if (inputFileFullPaths.length === 0) {
                throw new Error(`Not found specified target file at "${JSON.stringify(notFoundPaths)}".`);
            }
            else if (inputFileFullPaths.length >= 2) {
                console.log('');
                console.log(`${translate('Error')}: ${translate('same file name exists.')}`);
                console.log(`    FileName: ${getTestablePath(checkingFilePath)}`);
                console.log(`    Folder: ${getTestablePath(programOptions.folder)}`);
                throw new Error(`same file name exists "${checkingFilePath}".`);
            }
        }
    }
    else {
        for (const folder of targetFolders) {
            const { targetFolderFullPath, globbyParameters } = await lib.getGlobbyParameters(folder, currentFolder);
            if (!fs.existsSync(targetFolderFullPath)) {
                throw new Error(`Not found target folder at "${getTestablePath(targetFolderFullPath)}".`);
            }
            process.chdir(targetFolderFullPath);
            const scanedPaths = await globby(globbyParameters);
            scanedPaths.forEach((scanedPath) => {
                inputFileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath));
            });
        }
        process.chdir(currentFolder);
    }
    return inputFileFullPaths;
}
function checkLineNoConfilict(keyValue, key, newValue, parser) {
    if (key in keyValue) {
        if (keyValue[key] !== newValue) {
            console.log('');
            console.log('Error of conflict #to: tag:');
            console.log(`    variableName: ${key}`);
            console.log(`    valueA: ${keyValue[key]} in ${getTestablePath(parser.filePath)}:${parser.lineNum}`);
            console.log(`    valueB: ${newValue} in ${getTestablePath(parser.filePath)}:${parser.lineNum}`);
            parser.errorCount += 1;
        }
    }
}
function runShellCommand(keyword) {
    if (!programOptions.commandSymbol) {
        console.log(`${translate('Error')}: ${translate(`To run shell command, TYPRM_COMMAND_SYMBOL environment variable must be set.`)}`);
        return;
    }
    if (!keyword.startsWith(programOptions.commandSymbol)) {
        console.log(`${translate('Error')}: ${translate(`Not found command prefix "${programOptions.commandSymbol} ".`)}`);
        return;
    }
    const command = keyword.substring(programOptions.commandSymbol.length + 1);
    execShellCommand(command);
}
function execShellCommand(command, requestedCommandFolder = true) {
    if (!programOptions.commandFolder && requestedCommandFolder) {
        console.log(`${translate('Error')}: ${translate('To run shell command, TYPRM_COMMAND_FOLDER environment variable or --command-folder option must be set.')}`);
        return;
    }
    const currentFolder = process.cwd();
    var stdout_ = '';
    try {
        if ('verbose' in programOptions) {
            console.log(`Verbose: current folder: ${getTestablePath(programOptions.commandFolder)}`);
            console.log(`Verbose: command: ${command}`);
        }
        if (requestedCommandFolder) {
            process.chdir(programOptions.commandFolder);
        }
        else {
            process.chdir(__dirname);
        }
        const stdoutBuffer = child_process.execSync(command);
        stdout_ = cutLastLF(stdoutBuffer.toString());
    }
    catch (e) {
        stdout_ = e.toString();
    }
    if (stdout_) {
        console.log(stdout_);
    }
    process.chdir(currentFolder);
}
async function search() {
    const startIndex = (programArguments[0] === 's' || programArguments[0] === 'search') ? 1 : 0;
    const keyword = programArguments.slice(startIndex).join(' ');
    let Command;
    (function (Command) {
        Command[Command["search"] = 0] = "search";
        Command[Command["openDocument"] = 1] = "openDocument";
        Command[Command["printRef"] = 2] = "printRef";
        Command[Command["runVerb"] = 3] = "runVerb";
        Command[Command["check"] = 4] = "check";
        Command[Command["replace"] = 5] = "replace";
        Command[Command["reset"] = 6] = "reset";
        Command[Command["mutualSearch"] = 7] = "mutualSearch";
        Command[Command["shellCommand"] = 8] = "shellCommand";
    })(Command || (Command = {}));
    ;
    if (keyword !== '') {
        const lastWord = programArguments.length === 0 ? '' : programArguments[programArguments.length - 1];
        const hasVerb = numberRegularExpression.test(lastWord);
        var command = Command.search;
        if (hasRefTag(keyword)) {
            if (hasVerb) {
                command = Command.runVerb;
            }
            else {
                command = Command.printRef;
            }
        }
        else if (hasMutualTag(keyword)) {
            command = Command.mutualSearch;
        }
        if (command === Command.search) {
            await searchSub(keyword, false);
        }
        else if (command === Command.mutualSearch) {
            await searchSub(keyword.replace(mutualTag, ''), true);
        }
        else if (command === Command.printRef) {
            await printRef(keyword);
        }
        else if (command === Command.runVerb) {
            const keywordWithoutVerb = programArguments.slice(startIndex, programArguments.length - 1).join(' ');
            const ref = await printRef(keywordWithoutVerb, { print: false });
            runVerb(ref.verbs, ref.address, ref.addressLineNum, ref.existingAddress, lastWord);
        }
    }
    else { // if keyword === ''
        lib.inputSkip(startIndex);
        var previousPrint = getEmptyOfPrintRefResult();
        for (;;) {
            var prompt = `keyword${programOptions.commandSymbol || ''}:`;
            if (previousPrint.hasVerbMenu) {
                var prompt = `keyword or number${programOptions.commandSymbol || ''}:`;
            }
            // typrm shell
            const keyword = await lib.input(chalk.gray('typrm') + ' ' + chalk.yellow(prompt) + ' ');
            if (keyword === 'exit()') {
                break;
            }
            else if (keyword === '') {
                previousPrint.hasVerbMenu = false;
            }
            else {
                var command = Command.search;
                if (previousPrint.hasVerbMenu && numberRegularExpression.test(keyword)) {
                    command = Command.runVerb;
                }
                else if (hasNumberTag(keyword)) {
                    command = Command.openDocument;
                }
                else if (hasRefTag(keyword)) {
                    command = Command.printRef;
                }
                else if (hasCheckTag(keyword)) {
                    command = Command.check;
                }
                else if (hasReplaceTag(keyword)) {
                    command = Command.replace;
                }
                else if (hasResetTag(keyword)) {
                    command = Command.reset;
                }
                else if (hasMutualTag(keyword)) {
                    command = Command.mutualSearch;
                }
                else if (hasShellCommandSymbol(keyword)) {
                    command = Command.shellCommand;
                }
                if (command === Command.search) {
                    previousPrint = await searchSub(keyword, false);
                }
                else if (command === Command.mutualSearch) {
                    await searchSub(cutTag(keyword), true);
                }
                else if (command === Command.openDocument) {
                    const foundLines = previousPrint.foundLines;
                    const foundIndex = parseInt(keyword.substring(1));
                    if (foundIndex >= 1 && foundIndex <= foundLines.length) {
                        const foundLine = foundLines[foundLines.length - foundIndex];
                        openDocument(`${foundLine.path}:${foundLine.lineNum}`);
                    }
                }
                else if (command === Command.printRef) {
                    previousPrint = await printRef(keyword);
                }
                else if (command === Command.runVerb) {
                    const verbNumber = keyword;
                    runVerb(previousPrint.verbs, previousPrint.address, previousPrint.addressLineNum, previousPrint.existingAddress, verbNumber);
                }
                else if (command === Command.check) {
                    const filePath = cutTag(keyword);
                    await check(filePath);
                }
                else if (command === Command.replace) {
                    const filePath = cutTag(keyword);
                    await replace(filePath);
                }
                else if (command === Command.reset) {
                    const filePath = cutTag(keyword);
                    await reset(filePath);
                }
                else if (command === Command.shellCommand) {
                    runShellCommand(keyword);
                }
            }
            if (keyword === 'q' || keyword === 'quit' || keyword === 'exit') {
                console.log('Use exit() or Ctrl-C to exit');
            }
        }
    }
}
async function searchSub(keyword, isMutual) {
    const thesaurus = new Thesaurus();
    if ('thesaurus' in programOptions) {
        const thesaurusFilePath = programOptions.thesaurus;
        if (!fs.existsSync(thesaurusFilePath)) {
            throw new Error(`not found the thesaurus file "${lib.getFullPath(thesaurusFilePath, process.cwd())}"`);
        }
        await thesaurus.load(thesaurusFilePath);
    }
    // chageToAlphabets
    const lastIsSpace = (' ' + jpsp).includes(keyword.slice(-1));
    if (lastIsSpace || zenkakuAlphabetExpression.test(keyword)) {
        const oldKeyword = keyword;
        keyword = lib.chageToAlphabets(keyword);
        if (keyword !== oldKeyword) {
            console.log(`keyword="${keyword.trim()}"`);
        }
    }
    keyword = keyword.trim();
    keyword = lib.splitIdioms(keyword, thesaurus.getWords());
    // keywordWithoutTag = ...
    const searchTagIndex = tagIndexOf(keyword, searchLabel);
    if (searchTagIndex !== notFound) {
        var keywordWithoutTag = getValue(keyword, searchTagIndex + searchLabel.length);
    }
    else {
        const keywordTagIndex = tagIndexOf(keyword, keywordLabel);
        if (keywordTagIndex !== notFound) {
            var keywordWithoutTag = getValue(keyword, keywordTagIndex + keywordLabel.length);
            if (keywordWithoutTag === '') {
                const colonIndex = keyword.indexOf(':');
                if (colonIndex !== notFound) {
                    keywordWithoutTag = keyword.substring(0, colonIndex);
                    if (keywordWithoutTag.startsWith('- ')) {
                        keywordWithoutTag = keywordWithoutTag.substring(2);
                    }
                }
                else {
                    keywordWithoutTag = '';
                }
            }
        }
        else {
            var keywordWithoutTag = keyword;
        }
    }
    // ...
    const fileFullPaths = await listUpFilePaths();
    var foundLines = [];
    const keywordsParticples = newParticplesFromKeyphrase(keywordWithoutTag, thesaurus);
    // search
    for (const inputFileFullPath of fileFullPaths) {
        // if (debugSearchScore) {
        //     console.log(`searchSub: ${inputFileFullPath}`);
        // }
        const reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        const glossaryTags = [];
        const scoreTags = [];
        const blockDisable = new BlockDisableTagParser();
        const snippetScaning = [];
        var lineNum = 0;
        var plusScore = 0;
        for await (const line1 of reader) {
            const line = line1;
            lineNum += 1;
            blockDisable.evaluate(line);
            const currentIndent = indentRegularExpression.exec(line)[0];
            const currentIndentLength = currentIndent.length;
            const indexOfKeywordLabel = line.indexOf(keywordLabel);
            const indexOfSearchLabelIfMutual = (isMutual) ? line.indexOf(searchLabel) : notFound;
            // score tag
            if (line !== '') {
                var scoreChaging = false;
                while (scoreTags.length >= 1) {
                    var deepestScoreTag = scoreTags[scoreTags.length - 1];
                    if (currentIndentLength < deepestScoreTag.indentPosition) {
                        scoreTags.pop();
                        scoreChaging = true;
                    }
                    else {
                        break;
                    }
                }
                const scoreTagIndex = tagIndexOf(line, scoreLabel);
                if (scoreTagIndex !== notFound) {
                    const scoreTag = {
                        indentPosition: scoreTagIndex,
                        plusScore: parseInt(getValue(line, scoreTagIndex + scoreLabel.length)),
                    };
                    scoreTags.push(scoreTag);
                    scoreChaging = true;
                }
                if (scoreChaging) {
                    plusScore = scoreTags.reduce((previousReturnValue, scoreTag) => {
                        return previousReturnValue + scoreTag.plusScore;
                    }, 0);
                }
            }
            // keyword tag
            if ((indexOfKeywordLabel !== notFound || indexOfSearchLabelIfMutual !== notFound)
                && !line.includes(disableLabel) && !blockDisable.isInBlock) {
                if (indexOfKeywordLabel !== notFound) {
                    var label = keywordLabel;
                    var indexOfLabel = indexOfKeywordLabel;
                    var labelLength = keywordLabel.length;
                }
                else {
                    var label = searchLabel;
                    var indexOfLabel = indexOfSearchLabelIfMutual;
                    var labelLength = searchLabel.length;
                }
                var csv = getValue(line, indexOfLabel + labelLength); // keywords, target words
                if (csv !== '') {
                    var withParameter = true;
                }
                else {
                    var withParameter = false;
                    csv = parseKeyName(line); // Keywords at the left of keyword tag
                }
                const columns = await lib.parseCSVColumns(csv)
                    .catch((e) => {
                    console.log(`Warning: ${e.message} in ${inputFileFullPath}:${lineNum}: ${line}`);
                    return [];
                });
                const found = getKeywordMatchingScore(columns, keywordsParticples, thesaurus);
                if (found.matchedSearchKeywordCount >= 1) {
                    const unescapedLine = unscapePercentByte(line);
                    if (withParameter) {
                        var positionOfCSV = unescapedLine.indexOf(csv, unescapedLine.indexOf(label) + labelLength);
                    }
                    else {
                        var positionOfCSV = unescapedLine.indexOf(csv);
                    }
                    const columnPositions = lib.parseCSVColumnPositions(csv, columns);
                    found.score += keywordMatchScore + plusScore;
                    found.path = inputFileFullPath;
                    found.lineNum = lineNum;
                    found.line = unescapedLine;
                    found.indentLength = indentRegularExpression.exec(line)[0].length;
                    found.tagLabel = label;
                    for (const match of found.matches) {
                        if (match.targetType === '') {
                            match.position += positionOfCSV + columnPositions[match.targetWordsIndex];
                        }
                    }
                    for (let i = 0; i < columnPositions.length; i += 1) {
                        if (i < columnPositions.length - 1) {
                            var rightPosition = csv.lastIndexOf(',', columnPositions[i + 1]);
                        }
                        else {
                            var rightPosition = csv.length;
                        }
                        found.rightOfTargetKeywords.push(positionOfCSV + rightPosition);
                    }
                    found.evaluateSnippetDepthTag(line);
                    foundLines.push(found);
                    snippetScaning.push(found);
                }
            }
            // glossary tag
            var glossaryTag = undefined;
            if (line.trim() !== '') {
                if (glossaryTags.length >= 1) {
                    glossaryTag = glossaryTags[glossaryTags.length - 1];
                }
                if (glossaryTag) {
                    if (currentIndent.length <= glossaryTag.indentAtTag.length) {
                        glossaryTags.pop();
                        if (glossaryTags.length >= 1) {
                            glossaryTag = glossaryTags[glossaryTags.length - 1];
                        }
                        else {
                            glossaryTag = undefined;
                        }
                    }
                    else {
                        if (glossaryTag.indentAtFirstContents === '') {
                            glossaryTag.indentAtFirstContents = currentIndent;
                            glossaryTag.indentPosition = glossaryTag.indentAtFirstContents.length;
                        }
                    }
                }
                if (line.includes(glossaryLabel) && !line.includes(disableLabel) && !blockDisable.isInBlock) {
                    var glossaryWords = getValue(line, line.indexOf(glossaryLabel) + glossaryLabel.length);
                    if (glossaryWords !== '') {
                        glossaryWords += ' '; // ' ' is a word separator
                    }
                    else {
                        glossaryWords = parseKeyName(line) + ' '; // Keywords at the left of glossary tag
                    }
                    glossaryTags.push({
                        indentPosition: -1,
                        glossaryWords,
                        indentAtTag: indentRegularExpression.exec(line)[0],
                        indentAtFirstContents: '',
                    });
                }
                if (glossaryTag) {
                    const characterAtIndent = line[glossaryTag.indentPosition];
                    const isGlossaryIndentLevel = (characterAtIndent !== ' ' &&
                        characterAtIndent !== '\t' &&
                        characterAtIndent !== undefined);
                    const isComment = (characterAtIndent === '#');
                    if (!isGlossaryIndentLevel || isComment) {
                        // Skip this line
                    }
                    else {
                        const colonPosition = line.indexOf(':', currentIndent.length);
                        const wordInGlossary = glossaryTag.glossaryWords +
                            line.substr(currentIndent.length, colonPosition - currentIndent.length);
                        const found = getKeywordMatchingScore([wordInGlossary], keywordsParticples, thesaurus);
                        if (found.partMatchedTargetKeywordCount >= 1 && colonPosition !== notFound) {
                            found.score += glossaryMatchScore + plusScore;
                            found.path = inputFileFullPath;
                            found.lineNum = lineNum;
                            found.indentLength = currentIndent.length;
                            found.tagLabel = glossaryLabel;
                            if (glossaryTag.glossaryWords === '') {
                                found.line = line;
                                for (const match of found.matches) {
                                    match.position += glossaryTag.indentPosition;
                                }
                            }
                            else {
                                found.line = glossaryTag.glossaryWords.trim() + ':' + line;
                                for (const match of found.matches) {
                                    if (match.position >= glossaryTag.glossaryWords.length) {
                                        match.position += glossaryTag.indentPosition;
                                    }
                                }
                            }
                            found.evaluateSnippetDepthTag(line);
                            foundLines.push(found);
                            snippetScaning.push(found);
                        }
                    }
                }
            }
            // found.snippet = ...
            if (snippetScaning.length >= 1) {
                if ('disableSnippet' in programOptions) {
                    snippetScaning.length = 0;
                }
                else {
                    const endsOfSnippets = [];
                    for (const found of snippetScaning) {
                        if (lineNum > found.lineNum) {
                            var endOfSnippet = false;
                            if (!found.isSnippetOver(line)) {
                                if (found.snippetDepth >= 1 || found.snippet.length < parseInt(programOptions.snippetLineCount)) {
                                    var snippetLine = line.substring(found.indentLength);
                                    found.snippet.push(snippetLine);
                                }
                                else {
                                    found.snippet.pop();
                                    found.snippet.push('    ....');
                                    endOfSnippet = true;
                                }
                            }
                            else {
                                endOfSnippet = true;
                            }
                            if (endOfSnippet) {
                                endsOfSnippets.push(found);
                            }
                        }
                    }
                    for (const removingFound of endsOfSnippets.reverse()) {
                        snippetScaning.splice(snippetScaning.indexOf(removingFound), 1);
                    }
                }
            }
        }
    }
    const maximumHitWordCount = foundLines.reduce((previousMinimumHitWordCount, found) => (Math.max(previousMinimumHitWordCount, found.matchedSearchKeywordCount)), 0);
    // searchWithoutTags (find all)
    foundLines = foundLines.filter((found) => (found.matchedSearchKeywordCount === maximumHitWordCount));
    foundLines.sort(compareScoreAndSoOn);
    if (!('disableFindAll' in programOptions) && !isMutual) {
        var foundLineWithoutTags = await searchWithoutTags(keyword);
        const maximumHitWordCount2 = foundLineWithoutTags.reduce((previousMinimumHitWordCount, found) => (Math.max(previousMinimumHitWordCount, found.matchedSearchKeywordCount)), 0);
        foundLineWithoutTags = foundLineWithoutTags.filter((found) => (found.matchedSearchKeywordCount === maximumHitWordCount2));
        foundLines = [...foundLineWithoutTags, ...foundLines];
        foundLines = foundLines.filter(lib.lastUniqueFilterFunction((found1, found2) => found1.path == found2.path && found1.lineNum == found2.lineNum));
        foundLines.sort(compareScoreAndSoOn);
    }
    // Debug score compare in 2 founds
    // {
    //     const  a = foundLines.find((x)=> (x.lineNum === 266))!;  // x.targetKeyphrase.includes('____')  &&  x.tagLabel === '____'
    //     const  b = foundLines.find((x)=> (x.lineNum === 264))!;
    //     if (a && b) {
    //         var  compare = compareScoreAndSoOn(a, b);  // Set break point here
    //     }
    // }
    if (thesaurus.errorMessage) {
        console.log(thesaurus.errorMessage);
    }
    // console.log(foundLineInformation)
    const foundCountMax = parseInt(programOptions.foundCountMax);
    if (foundLines.length > foundCountMax) {
        console.log(`... (` + translate(`To show more result, restart typrm with --found-count-max option`) + ')');
        var startFoundIndex = foundLines.length - foundCountMax;
    }
    else {
        var startFoundIndex = 0;
    }
    var foundCount = 0;
    for (const foundLineInformation of foundLines) {
        if (foundCount >= startFoundIndex) {
            console.log(foundLineInformation.toString());
        }
        foundCount += 1;
    }
    // console.log(snippet)
    if (foundLines.length >= 1 && foundLines[foundLines.length - 1].snippet.length >= 1) {
        const found = foundLines[foundLines.length - 1];
        const snippet = (await evaluateEnvironmentVariable(found.snippet, found.path, found.lineNum)).join('\n');
        const snippetColor = chalk.rgb(144, 144, 160);
        console.log(snippetColor(snippet));
    }
    // printRef
    if (foundLines.length >= 1 && lastOf(foundLines).line.includes(refLabel)) {
        const foundLine = lastOf(foundLines).line;
        const refTagPosition = foundLine.indexOf(refLabel);
        const nextTagPosition = foundLine.indexOf(' #', refTagPosition + 1);
        if (nextTagPosition === notFound) {
            var refTagAndAddress = foundLine.substring(refTagPosition);
        }
        else {
            var refTagAndAddress = foundLine.substring(refTagPosition, nextTagPosition);
        }
        const verbReturn = await printRef(refTagAndAddress);
        verbReturn.foundLines = foundLines;
        return verbReturn;
    }
    else {
        const normalReturn = getEmptyOfPrintRefResult();
        if (foundLines.length === 0) {
            normalReturn.previousKeyword = keyword;
        }
        normalReturn.foundLines = foundLines;
        return normalReturn;
    }
}
function getKeywordMatchingScore(targetStrings, keywordsParticples, thesaurus) {
    const found = subMain();
    return found;
    function subMain() {
        const keyphrase = keywordsParticples.keyphrase;
        const bestFound = targetStrings.reduce((bestFound, aTargetString, stringIndex) => {
            var found = new FoundLine();
            var previousPosition = -1;
            var isNormalizedMatched = false;
            const aTargetStringLowerCase = aTargetString.toLowerCase();
            const normalizedTargetKeywords = thesaurus.normalize(aTargetString, keywordsParticples.formalWordsLowerCase);
            const normalizedTargetKeywordsLowerCase = normalizedTargetKeywords.toLowerCase();
            const matchedCounts = new MatchedCounts(aTargetString, normalizedTargetKeywords);
            // #focus: score
            for (let wordIndex = 0; wordIndex < keywordsParticples.words.length; wordIndex += 1) {
                const keyword = keywordsParticples.words[wordIndex];
                const normalizedWord = keywordsParticples.normalizedWords[wordIndex];
                if (keyword.specified === '') {
                    continue;
                }
                const result = getSubMatchedScore(aTargetString, aTargetStringLowerCase, keyword, stringIndex, '', found);
                if (result.score !== 0) {
                    found.searchKeyphrase = keyphrase;
                    found.targetKeyphrase = aTargetString;
                    if (result.position > previousPosition) {
                        found.score += result.score + orderMatchScore;
                    }
                    else {
                        found.score += result.score;
                    }
                    found.score += notNormalizedScore;
                    // if (debugSearchScore) {
                    //     console.log(`    getSubMatchedScore: ${keyword.specified}, ${aTargetString}, result score: ${result.score} => ${found.score}`);
                    // }
                }
                if (result.position !== notFound) {
                    matchedCounts.setFoundPosition(result.position, result.score, false);
                    found.matchedSearchKeywordCount += 1;
                    previousPosition = result.position;
                }
                const useThesaurus = (result.score === 0 && result.position === notFound && thesaurus.enabled);
                if (useThesaurus) {
                    if (normalizedWord.specified !== keyword.specified || normalizedTargetKeywords !== aTargetString) {
                        const targetType = (normalizedTargetKeywords === aTargetString) ? '' : 'normalized';
                        const result = getSubMatchedScore(normalizedTargetKeywords, normalizedTargetKeywordsLowerCase, normalizedWord, stringIndex, targetType, found);
                        if (result.score !== 0) {
                            found.searchKeyphrase = keyphrase;
                            found.targetKeyphrase = aTargetString;
                            if (result.position > previousPosition) {
                                found.score += result.score + orderMatchScore;
                            }
                            else {
                                found.score += result.score;
                            }
                            // if (debugSearchScore) {
                            //     console.log(`    getSubMatchedScore(thesaurus): ${normalizedWord.specified}, ${aTargetString}, result score: ${result.score} => ${found.score}`);
                            // }
                        }
                        if (result.position !== notFound) {
                            matchedCounts.setFoundPosition(result.position, result.score, true);
                            found.matchedSearchKeywordCount += 1;
                            previousPosition = result.position;
                            if (normalizedTargetKeywords !== aTargetString) {
                                isNormalizedMatched = true;
                            }
                        }
                    }
                }
            }
            if (found.score !== 0) {
                if (!isNormalizedMatched) {
                    var matchedTargetString = aTargetString;
                }
                else {
                    var matchedTargetString = normalizedTargetKeywords;
                }
                // e.g.
                //     keyphrase = "aa bbb ccc"
                //     matchedTargetString = "aabbb ccc dd ee"
                // score += character count
                // searchKeywordCount = 3
                // superMatchedTargetKeywordCount = 1  // ccc
                // semiMatchedTargetKeywordCount = 1
                // participleMatchedTargetKeywordCount = 1
                // caseIgnoredSuperMatchedTargetKeywordCount = 1
                // caseIgnoredParticipleMatchedTargetKeywordCount = 1
                // partMatchedTargetKeywordCount = 2
                // targetWordCount = 4
                found.score += 2 * (keyphrase.length - matchedTargetString.length);
                // 2 is double score from the score of different (upper/loser) case
                found.searchKeywordCount = keywordsParticples.words.length;
                found = matchedCounts.countFoundWords(found);
                if (!isNormalizedMatched) {
                    found.targetWordCount = lib.getWordCount(aTargetString);
                }
                else {
                    found.targetWordCount = Math.max(lib.getWordCount(aTargetString), lib.getWordCount(normalizedTargetKeywords));
                }
                // if (debugSearchScore) {
                //     console.log(`    getSubMatchedScore(final): ${keyphrase}, ${aTargetString}, => ${found.score}`);
                // }
            }
            var matchedNormalized = '';
            if (found.score !== 0) {
                const matches = bestFound.matches.concat(found.matches);
                if (isNormalizedMatched) {
                    matchedNormalized = normalizedTargetKeywords;
                }
                const normalizedTargetsKeywords = bestFound.normalizedTargetsKeywords;
                if (compareScoreAndSoOn(bestFound, found) < 0) {
                    bestFound = found;
                }
                bestFound.matches = matches;
                bestFound.normalizedTargetsKeywords = normalizedTargetsKeywords;
            }
            bestFound.normalizedTargetsKeywords.push(matchedNormalized);
            return bestFound;
        }, new FoundLine());
        return bestFound;
    }
    function getSubMatchedScore(targetString, targetStringLowerCase, keywordParticples, stringIndex, targetType, found) {
        var score = 0;
        var position = notFound;
        if (targetStringLowerCase.indexOf(keywordParticples.commonPartLowerCase) !== notFound) {
            const keyword = keywordParticples.specified;
            const keywordLowerCase = keywordParticples.specifiedLowerCase;
            var partMatchPosition = notFound;
            var caseIgnoredPartMatchPosition = notFound;
            var matchedKeyword = '';
            if ((position = targetString.indexOf(keyword)) !== notFound) {
                if (targetString.length === keyword.length) {
                    score = fullMatchScore;
                    matchedKeyword = keyword;
                }
                else {
                    if (isSuperWordMatch(targetString, position, keyword)) {
                        score = wordsSuperMatchScore;
                        matchedKeyword = keyword;
                    }
                    else if (isWordMatch(targetString, position, keyword)) {
                        score = wordsSemiMatchScore;
                        matchedKeyword = keyword;
                    }
                    else {
                        if (keyword.length >= 2) {
                            partMatchPosition = position;
                        }
                    }
                }
            }
            if (score === 0) {
                for (const particple of keywordParticples.particples) {
                    if ((position = targetString.indexOf(particple)) !== notFound) {
                        if (targetString.length === particple.length) {
                            score = particpleFullMatchScore;
                            matchedKeyword = particple;
                            break;
                        }
                        else {
                            if (isWordMatch(targetString, position, particple)) {
                                score = particpleWordMatchScore;
                                matchedKeyword = particple;
                                break;
                            }
                        }
                    }
                }
            }
            if (score === 0) {
                if ((position = targetStringLowerCase.indexOf(keywordLowerCase)) !== notFound) {
                    if (targetString.length === keywordLowerCase.length) {
                        score = caseIgnoredFullMatchScore;
                        matchedKeyword = keywordLowerCase;
                    }
                    else {
                        if (isSuperWordMatch(targetString, position, keyword)) {
                            score = caseIgnoredWordSuperMatchScore;
                            matchedKeyword = keywordLowerCase;
                        }
                        else if (isWordMatch(targetString, position, keyword)) {
                            score = caseIgnoredWordsSemiMatchScore;
                            matchedKeyword = keywordLowerCase;
                        }
                        else {
                            if (keyword.length >= 2) {
                                caseIgnoredPartMatchPosition = position;
                            }
                        }
                    }
                }
            }
            if (score === 0) {
                for (const particpleLowerCase of keywordParticples.particplesLowerCase) {
                    if ((position = targetStringLowerCase.indexOf(particpleLowerCase)) !== notFound) {
                        if (targetString.length === particpleLowerCase.length) {
                            const semiMatchedKeyword = targetString.substr(position, particpleLowerCase.length);
                            const commonLength = keywordParticples.commonPartLowerCase.length;
                            if (particpleWordIsCorrectCase(semiMatchedKeyword, particpleLowerCase, commonLength)) {
                                score = caseIgnoredParticpleFullMatchScore;
                                matchedKeyword = particpleLowerCase;
                                break;
                            }
                        }
                        else {
                            if (isWordMatch(targetString, position, particpleLowerCase)) {
                                const semiMatchedKeyword = targetString.substr(position, particpleLowerCase.length);
                                const commonLength = keywordParticples.commonPartLowerCase.length;
                                if (particpleWordIsCorrectCase(semiMatchedKeyword, particpleLowerCase, commonLength)) {
                                    score = caseIgnoredParticpleWordMatchScore;
                                    matchedKeyword = particpleLowerCase;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (score === 0) {
                if (partMatchPosition !== notFound) {
                    score = partMatchScore;
                    matchedKeyword = keyword;
                    position = partMatchPosition;
                }
                else if (caseIgnoredPartMatchPosition !== notFound) {
                    score = caseIgnoredPartMatchScore;
                    matchedKeyword = keywordLowerCase;
                    position = caseIgnoredPartMatchPosition;
                }
            }
            if (score >= 1) {
                const matched = new MatchedPart();
                matched.position = position;
                matched.length = matchedKeyword.replace(/"/g, '""').length;
                matched.targetWordsIndex = stringIndex;
                matched.matchedString = targetString.substr(position, matched.length);
                matched.targetType = targetType;
                found.matches.push(matched);
            }
            else {
                position = notFound;
            }
        }
        return { score, position };
    }
}
function isSuperWordMatch(targetString, targetPosition, keyword) {
    return (targetPosition === 0 || isSuperSeparator(targetString[targetPosition - 1])) &&
        (targetPosition + keyword.length === targetString.length ||
            isSuperSeparator(targetString[targetPosition + keyword.length]));
}
function isWordMatch(targetString, targetPosition, keyword) {
    return (targetPosition === 0 || isSeparator(targetString[targetPosition - 1])) &&
        (targetPosition + keyword.length === targetString.length ||
            isSeparator(targetString[targetPosition + keyword.length]));
}
function isSuperSeparator(checkingCharacter) {
    return programOptions.wordSuperSeparators.includes(checkingCharacter);
}
function isSeparator(checkingCharacter) {
    return programOptionsWordSeparators.includes(checkingCharacter);
}
class MatchedCounts {
    constructor(targetString, normalizedTargetKeywords = '') {
        normalizedTargetKeywords = normalizedTargetKeywords || targetString;
        this.wordPositions = new WordPositions();
        this.normalizedWordPositions = new WordPositions();
        this.wordPositions.setPhrase(targetString);
        this.normalizedWordPositions.setPhrase(normalizedTargetKeywords);
        const countersLength = this.wordPositions.length + this.normalizedWordPositions.length;
        this.superMatchedCountsByWord = new Array(countersLength).fill(0);
        this.semiMatchedCountsByWord = new Array(countersLength).fill(0);
        this.participleMatchedCountsByWord = new Array(countersLength).fill(0);
        this.semiOrParticipleMatchedCountsByWord = new Array(countersLength).fill(0);
        this.caseIgnoredSuperMatchedCountsByWord = new Array(countersLength).fill(0);
        this.caseIgnoredSemiMatchedCountsByWord = new Array(countersLength).fill(0);
        this.caseIgnoredParticipleMatchedCountsByWord = new Array(countersLength).fill(0);
        this.caseIgnoredSemiOrParticipleMatchedCountsByWord = new Array(countersLength).fill(0);
        this.partMatchedCountsByWord = new Array(countersLength).fill(0);
    }
    setFoundPosition(foundPosition, score, useThesaurus = false) {
        if (foundPosition === notFound) {
            return;
        }
        const wordPosition = this.wordPositions.getWordIndex(foundPosition);
        if (useThesaurus) {
            var normalizedWordPosition = this.wordPositions.length + this.normalizedWordPositions.getWordIndex(foundPosition);
        }
        else {
            var normalizedWordPosition = notFound;
        }
        if (score === fullMatchScore || score == wordsSuperMatchScore) {
            this.superMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSuperMatchedCountsByWord[wordPosition] += 1;
            this.semiMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiMatchedCountsByWord[wordPosition] += 1;
            this.participleMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredParticipleMatchedCountsByWord[wordPosition] += 1;
            this.semiOrParticipleMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiOrParticipleMatchedCountsByWord[wordPosition] += 1;
        }
        else if (score === caseIgnoredFullMatchScore || score === caseIgnoredWordSuperMatchScore) {
            this.caseIgnoredSuperMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredParticipleMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiOrParticipleMatchedCountsByWord[wordPosition] += 1;
        }
        else if (score === wordsSemiMatchScore) {
            this.semiMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiMatchedCountsByWord[wordPosition] += 1;
            this.semiOrParticipleMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiOrParticipleMatchedCountsByWord[wordPosition] += 1;
        }
        else if (score === caseIgnoredWordsSemiMatchScore) {
            this.caseIgnoredSemiMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiOrParticipleMatchedCountsByWord[wordPosition] += 1;
        }
        else if (score === particpleFullMatchScore || score === particpleWordMatchScore) {
            this.participleMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredParticipleMatchedCountsByWord[wordPosition] += 1;
            this.semiOrParticipleMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiOrParticipleMatchedCountsByWord[wordPosition] += 1;
        }
        else if (score === caseIgnoredParticpleFullMatchScore || score === caseIgnoredParticpleWordMatchScore) {
            this.caseIgnoredParticipleMatchedCountsByWord[wordPosition] += 1;
            this.caseIgnoredSemiOrParticipleMatchedCountsByWord[wordPosition] += 1;
        }
        if (useThesaurus) {
            this.partMatchedCountsByWord[normalizedWordPosition] += 1;
        }
        else {
            this.partMatchedCountsByWord[wordPosition] += 1;
        }
    }
    countFoundWords(found) {
        found.superMatchedTargetKeywordCount = this.superMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.semiMatchedTargetKeywordCount = this.semiMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.participleMatchedTargetKeywordCount = this.participleMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.semiOrParticipleMatchedTargetKeywordCount = this.semiOrParticipleMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.caseIgnoredSuperMatchedTargetKeywordCount = this.caseIgnoredSuperMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.caseIgnoredSemiMatchedTargetKeywordCount = this.caseIgnoredSemiMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.caseIgnoredParticipleMatchedTargetKeywordCount = this.caseIgnoredParticipleMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount = this.caseIgnoredSemiOrParticipleMatchedCountsByWord.filter((count) => (count >= 1)).length;
        found.partMatchedTargetKeywordCount = this.partMatchedCountsByWord.filter((count) => (count >= 1)).length;
        return found;
    }
}
function compareScoreAndSoOn(a, b) {
    var different = 0; // plus: a is prior.  minus: b is prior.
    if (a.searchKeywordCount === 0 || b.searchKeywordCount === 0) {
        return a.searchKeywordCount - b.searchKeywordCount;
    }
    if (a.searchKeywordCount < b.searchKeywordCount) {
        var kPoint = b.searchKeywordCount - a.searchKeywordCount + 0.5;
    }
    else if (a.searchKeywordCount > b.searchKeywordCount) {
        var kPoint = a.searchKeywordCount - b.searchKeywordCount - 0.5;
    }
    else {
        var kPoint = 0;
    }
    // __FoundLineProperty__ (__LabelOfScoreDebug___)
    // matchedSearchKeywordCount (matchedSearchCount)
    if (different === 0) {
        different = a.matchedSearchKeywordCount - b.matchedSearchKeywordCount + kPoint;
    }
    // partMatchedTargetKeywordCount (part)
    // semiMatchedTargetKeywordCount (semi) (1)
    // targetWordCount (targetWordCount)
    var allWordsAreSemiMatched = false;
    if (different === 0) {
        different = a.partMatchedTargetKeywordCount - b.partMatchedTargetKeywordCount + kPoint;
        if (different !== 0) {
            if (a.partMatchedTargetKeywordCount === a.caseIgnoredSemiMatchedTargetKeywordCount ||
                b.partMatchedTargetKeywordCount === b.caseIgnoredSemiMatchedTargetKeywordCount) {
                different = 0;
                allWordsAreSemiMatched = true;
            }
        }
    }
    // tagLabel (tag)
    if (different === 0) {
        if (a.tagLabel !== b.tagLabel) {
            if (a.tagLabel === keywordLabel || a.tagLabel === glossaryLabel) {
                different += 1;
            }
            if (b.tagLabel === keywordLabel || b.tagLabel === glossaryLabel) {
                different -= 1;
            }
        }
    }
    if (different === 0 && allWordsAreSemiMatched) {
        const aNotMatchCount = a.targetWordCount - a.caseIgnoredSemiMatchedTargetKeywordCount;
        const bNotMatchCount = b.targetWordCount - b.caseIgnoredSemiMatchedTargetKeywordCount;
        different = bNotMatchCount - aNotMatchCount;
    }
    // caseIgnoredParticipleMatchedTargetKeywordCount (caseIgnoredParticiple)
    if (different === 0) {
        different =
            a.caseIgnoredParticipleMatchedTargetKeywordCount -
                b.caseIgnoredParticipleMatchedTargetKeywordCount + kPoint;
    }
    // targetWordCount (targetWordCount)
    if (different === 0) {
        different = b.targetWordCount - a.targetWordCount - kPoint;
    }
    // participleMatchedTargetKeywordCount (participle)
    if (different === 0) {
        different =
            a.participleMatchedTargetKeywordCount -
                b.participleMatchedTargetKeywordCount + kPoint;
    }
    // caseIgnoredSuperMatchedTargetKeywordCount (caseIgnoredSuper)
    if (different === 0) {
        different =
            a.caseIgnoredSuperMatchedTargetKeywordCount -
                b.caseIgnoredSuperMatchedTargetKeywordCount + kPoint;
    }
    // superMatchedTargetKeywordCount (superMatchedTargetCount)
    if (different === 0) {
        different = a.superMatchedTargetKeywordCount - b.superMatchedTargetKeywordCount + kPoint;
    }
    // semiMatchedTargetKeywordCount (semi) (2)
    if (different === 0) {
        different = a.caseIgnoredSemiMatchedTargetKeywordCount - b.caseIgnoredSemiMatchedTargetKeywordCount + kPoint;
    }
    // score
    if (different === 0) {
        var different = a.score - b.score + kPoint;
    }
    // path
    if (different === 0) {
        if (a.path < b.path) {
            different = -1;
        }
        else if (a.path > b.path) {
            different = +1;
        }
    }
    // lineNum
    if (different === 0) {
        different = b.lineNum - a.lineNum;
    }
    return different;
}
async function searchWithoutTags(keywords) {
    const foundLines = [];
    const keywordCount = keywords.split(' ').filter((keyword) => (keyword !== '')).length;
    const thesaurus = new Thesaurus();
    const keywordsParticples = newParticplesFromKeyphrase(keywords, thesaurus);
    const keyword1PartLowerCase = keywordsParticples.words[0].commonPartLowerCase;
    const keywordsParticples2 = keywordsParticples.words.slice(1);
    var fullMatchKeywords = keywords;
    if (tagIndexOf(fullMatchKeywords, searchLabel) !== notFound) {
        fullMatchKeywords = fullMatchKeywords.replace(searchLabel, keywordLabel);
    }
    fullMatchKeywords = lib.cutLast(fullMatchKeywords.trim(), ':').trimRight();
    var matchCount = 0;
    var fullMatchCount = 0;
    function isFullMatch(line, fullMatchKeywords) {
        if (line.trimStart().startsWith(fullMatchKeywords)) {
            if (line.trim() === fullMatchKeywords) {
                return true;
            }
            const lineTrimR = line.trimRight();
            if (lineTrimR.substring(lineTrimR.length - 1) === ':') {
                return true;
            }
        }
        return false;
    }
    for (const inputFileFullPath of await listUpFilePaths()) {
        // if (debugSearchScore) {
        //     console.log(`searchWithoutTags: ${inputFileFullPath}`);
        // }
        const reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        var lineNum = 0;
        let breaking = false;
        let exception;
        for await (const line1 of reader) {
            if (breaking) {
                continue;
            } // "reader" requests read all lines
            try {
                const line = line1;
                lineNum += 1;
                // full match
                if (fullMatchCount < foundCountSystemMax && isFullMatch(line, fullMatchKeywords)) {
                    fullMatchCount += 1;
                    const found = new FoundLine();
                    found.path = inputFileFullPath;
                    found.lineNum = lineNum;
                    found.line = line;
                    found.searchKeyphrase = keywords;
                    found.targetKeyphrase = line;
                    found.matches.push({
                        position: line.indexOf(fullMatchKeywords),
                        length: fullMatchKeywords.length,
                        targetWordsIndex: -1,
                        matchedString: fullMatchKeywords,
                        targetType: 'withoutTags',
                    });
                    found.matchedSearchKeywordCount = keywordCount;
                    found.searchKeywordCount = keywordCount;
                    found.participleMatchedTargetKeywordCount = keywordCount;
                    found.partMatchedTargetKeywordCount = keywordCount; // not keywordsLowerCase.length
                    found.caseIgnoredParticipleMatchedTargetKeywordCount = keywordCount;
                    found.superMatchedTargetKeywordCount = keywordCount;
                    found.caseIgnoredSuperMatchedTargetKeywordCount = keywordCount;
                    found.caseIgnoredSemiMatchedTargetKeywordCount = keywordCount;
                    found.targetWordCount = lib.getWordCount(line);
                    found.tagLabel = 'find all';
                    found.score =
                        notNormalizedScore * found.caseIgnoredParticipleMatchedTargetKeywordCount +
                            (wordsSemiMatchScore + orderMatchScore + notNormalizedScore) * found.matchedSearchKeywordCount +
                            lineFullMatchScore + keywords.trim().length - line.trim().length;
                    foundLines.push(found);
                    // if (debugSearchScore) {
                    //     console.log(`    searchWithoutTags(full match): ${found.score}, ${line}`);
                    // }
                }
                // shuffled keywords match
                else if (matchCount < foundCountSystemMax) {
                    var keywordIndex = line.toLowerCase().indexOf(keyword1PartLowerCase);
                    if (keywordIndex !== notFound) {
                        const found = getKeywordMatchingScoreWithoutTags(inputFileFullPath, line, lineNum, keywordsParticples, thesaurus);
                        foundLines.push(found);
                        // if (debugSearchScore) {
                        //     console.log(`    searchWithoutTags(shuffled match): ${found.score}, ${line}`);
                        // }
                    }
                }
            }
            catch (e) {
                exception = e;
                breaking = true;
            }
        }
        if (exception) {
            throw exception;
        }
    }
    return foundLines;
}
function getKeywordMatchingScoreWithoutTags(inputFileFullPath, line, lineNum, keywordsParticples, thesaurus) {
    const found = getKeywordMatchingScore([line], keywordsParticples, thesaurus);
    found.path = inputFileFullPath;
    found.line = line;
    found.lineNum = lineNum;
    found.tagLabel = 'find all';
    return found;
}
function addParticiplesFoundCountInFullSearch(found, line, keywordIndex, participles) {
    const lineLowerCase = line.toLocaleLowerCase();
    const wordSuperMatch = isSuperWordMatch(line, keywordIndex, participles.specified);
    const wordSemiMatch = isWordMatch(line, keywordIndex, participles.specified);
    const caseMatch = (line.substr(keywordIndex, participles.specified.length) === participles.specified);
    var addedParticipleMatchedTargetKeywordCount = false;
    var addedCaseIgnoredParticipleMatchedTargetKeywordCount = false;
    var matchedKeyword = participles.specified;
    found.matchedSearchKeywordCount += 1;
    if (wordSuperMatch) {
        if (caseMatch) {
            found.superMatchedTargetKeywordCount += 1;
            found.caseIgnoredSuperMatchedTargetKeywordCount += 1;
            found.semiMatchedTargetKeywordCount += 1;
            found.caseIgnoredSemiMatchedTargetKeywordCount += 1;
            found.participleMatchedTargetKeywordCount += 1;
            found.caseIgnoredParticipleMatchedTargetKeywordCount += 1;
            found.semiOrParticipleMatchedTargetKeywordCount += 1;
            found.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount += 1;
            found.partMatchedTargetKeywordCount += 1;
            addedParticipleMatchedTargetKeywordCount = true;
            addedCaseIgnoredParticipleMatchedTargetKeywordCount = true;
        }
        else {
            found.caseIgnoredSuperMatchedTargetKeywordCount += 1;
            found.caseIgnoredSemiMatchedTargetKeywordCount += 1;
            found.caseIgnoredParticipleMatchedTargetKeywordCount += 1;
            found.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount += 1;
            found.partMatchedTargetKeywordCount += 1;
            addedCaseIgnoredParticipleMatchedTargetKeywordCount = true;
        }
    }
    else if (wordSemiMatch) {
        if (caseMatch) {
            found.semiMatchedTargetKeywordCount += 1;
            found.caseIgnoredSemiMatchedTargetKeywordCount += 1;
            found.semiOrParticipleMatchedTargetKeywordCount += 1;
            found.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount += 1;
            found.partMatchedTargetKeywordCount += 1;
        }
        else {
            found.caseIgnoredSemiMatchedTargetKeywordCount += 1;
            found.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount += 1;
            found.partMatchedTargetKeywordCount += 1;
        }
    }
    else {
        found.partMatchedTargetKeywordCount += 1;
    }
    if (!addedParticipleMatchedTargetKeywordCount) {
        for (const partiple of participles.particples) {
            if (isWordMatch(line, keywordIndex, partiple) &&
                line.substr(keywordIndex, partiple.length) === partiple) {
                found.participleMatchedTargetKeywordCount += 1;
                found.caseIgnoredSemiMatchedTargetKeywordCount += 1;
                found.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount += 1;
                matchedKeyword = partiple;
                break;
            }
        }
    }
    if (!addedCaseIgnoredParticipleMatchedTargetKeywordCount) {
        for (const partipleLowerCase of participles.particplesLowerCase) {
            if (isWordMatch(lineLowerCase, keywordIndex, partipleLowerCase)) {
                const partipleLength = partipleLowerCase.length;
                const commonLength = participles.commonPartLowerCase.length;
                const commonInLineLowerCase = lineLowerCase.substr(keywordIndex, commonLength);
                const tailInLine = line.substr(keywordIndex + commonLength, partipleLength - commonLength);
                const tailInPartipleLowerCase = partipleLowerCase.substring(commonLength);
                if (commonInLineLowerCase === participles.commonPartLowerCase &&
                    tailInLine == tailInPartipleLowerCase) // e.g. "STRed" is matched with "str" search keyword
                 {
                    found.caseIgnoredParticipleMatchedTargetKeywordCount += 1;
                    found.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount += 1;
                    if (matchedKeyword === participles.commonPartLowerCase) {
                        matchedKeyword = partipleLowerCase;
                    }
                    break;
                }
            }
        }
    }
    found.matches.push({
        position: keywordIndex,
        length: matchedKeyword.length,
        targetWordsIndex: -1,
        matchedString: matchedKeyword,
        targetType: 'withoutTags',
    });
    return found;
}
async function mutualSearch() {
    const keyword = programArguments.slice(1).join(' ');
    await searchSub(keyword, true);
}
const printRefOptionDefault = {
    print: true,
};
function getEmptyOfPrintRefResult() {
    return {
        foundLines: [],
        hasVerbMenu: false,
        verbs: [],
        address: '',
        addressLineNum: 0,
        existingAddress: '',
        previousKeyword: '',
    };
}
function openDocument(ref) {
    if (!process.env.TYPRM_OPEN_DOCUMENT) {
        console.log(`${translate('Error')}: ${translate('Not defined TYPRM_OPEN_DOCUMENT environment variable.')}`);
        return;
    }
    const command = process.env.TYPRM_OPEN_DOCUMENT.replace('${ref}', ref);
    execShellCommand(command);
}
async function printRef(refTagAndAddress, option = printRefOptionDefault) {
    const addressBefore = refTagAndAddress.trim().substring(refLabel.length).trim();
    const variableRe = new RegExp(variablePattern, 'g'); // variableRegularExpression
    const variables = {};
    variableRe.lastIndex = 0;
    for (;;) {
        const variable = variableRe.exec(addressBefore);
        if (variable === null) {
            break;
        }
        variables[variable[0]] = undefined;
    }
    // address = ...
    var address = addressBefore;
    if (!address.startsWith("\\\\")) {
        address = address.replace(/(\\+)([^\$\\ ]|$)/g, (match, backSlashes, nextCharacter, offset) => {
            return backSlashes.replace(/\\/g, '/') + nextCharacter; // replace \\ to /
        });
    }
    address = cutQuotation(address);
    if (variables) {
        for (const variable of Object.keys(variables)) {
            const variableName = variable.substr('${'.length, variable.length - '${}'.length);
            const value = process.env[`${typrmEnvPrefix}${variableName}`];
            if (value) {
                const variableRegExp = new RegExp('\\\\?' + lib.escapeRegularExpression(variable), 'g');
                address = address.replace(variableRegExp, (match, offset) => {
                    const startsBackSlash = (match.substring(0, 1) === '\\');
                    if (startsBackSlash) {
                        var dollarOffset = offset + 1;
                    }
                    else {
                        var dollarOffset = offset;
                    }
                    const replacing = !isBackSlashParameter(address, dollarOffset);
                    if (replacing) {
                        if (startsBackSlash) {
                            return '\\' + value.replace(/\$/g, '$$').replace('\\', '/');
                        }
                        else {
                            return value.replace(/\$/g, '$$').replace('\\', '/');
                        }
                    }
                    else {
                        return variable.replace(/\$/g, '$$');
                        // If startsBackSlash === true, cut \ character.
                    }
                });
            }
        }
    }
    if (address.startsWith('~')) {
        address = lib.getHomePath() + address.substring(1);
    }
    address = lib.replacePathToSlashed(address);
    // linkableAddress = ...
    var linkableAddress = address;
    var addressLineNum = notFound;
    var existingAddress = '';
    var existingParentOnly = false;
    if (!lib.isFullPath(address)) {
        console.log(translate `Warning` + ': ' + translate `ref tag value \"${address}\" must be full path. Then you can specify the path with a variable.`);
    }
    else if (lib.isInFileSystem(address)) {
        const getter = getRelatedLineNumGetter(address);
        if (getter.type === 'text') {
            const lineNumGetter = getter;
            const { filePath, lineNum } = await searchAsText(lineNumGetter, address);
            if (lineNum === notFound || lineNum === notSearchedInFile || lineNum === notFoundInFile) {
                linkableAddress = address;
                existingAddress = lib.getExistingParentPath(filePath);
                existingParentOnly = (lib.replacePathToSlashed(existingAddress) !== lib.replacePathToSlashed(filePath));
            }
            else {
                linkableAddress = lineNumGetter.address
                    .replace(verbVar.file, lib.replacePathToSlashed(filePath))
                    .replace(verbVar.windowsFile, lib.replacePathToSlashed(filePath))
                    .replace(verbVar.fragment, '')
                    .replace(verbVar.lineNum, lineNum.toString());
                // This format is hyperlinkable in the Visual Studio Code Terminal
                existingAddress = filePath;
            }
            addressLineNum = lineNum;
        }
        else if (getter.type === 'figure') {
            const figurePointGetter = getter;
            linkableAddress = await getPointedFigurePath(figurePointGetter, address);
            existingAddress = linkableAddress;
        }
        else if (getter.type === 'keep') {
            const localKeepGetter = getter;
            const filePath = getFilePathFromKeepGetter(address, localKeepGetter);
            linkableAddress = address;
            existingAddress = lib.getExistingParentPath(filePath);
            if (lib.replacePathToSlashed(existingAddress) !== lib.replacePathToSlashed(filePath)) {
                addressLineNum = notFound;
                existingParentOnly = true;
            }
            else {
                addressLineNum = notSearchedInFile;
                existingParentOnly = false;
            }
        }
    }
    if (lib.isInFileSystem(linkableAddress)) {
        if (runningOS === 'Windows') {
            linkableAddress = lib.replaceToPathForWindows(linkableAddress);
        }
    }
    else {
        addressLineNum = notSearchedInFile;
    }
    // recommended = ...
    var recommended = address;
    recommended = recommended.replace(/\$/g, '\\$'); // not expanded $ by address.replace()
    const lowerCaseDriveRegExp = /^[a-z]:/;
    const upperCaseDriveRegExp = /^[A-Z]:/;
    const sortedEnvronmentVariables = [];
    const reservedNames = ['TYPRM_COMMAND_FOLDER', 'TYPRM_COMMAND_SYMBOL', 'TYPRM_FOLDER', 'TYPRM_FOUND_COUNT_MAX',
        'TYPRM_LINE_NUM_GETTER', 'TYPRM_OPEN_DOCUMENT', 'TYPRM_SNIPPET_LINE_COUNT', 'TYPRM_THESAURUS', 'TYPRM_VERB'];
    for (const [envName, envValue] of Object.entries(process.env)) {
        if (envName.startsWith(typrmEnvPrefix) && !reservedNames.includes(envName) && envValue) {
            const variableName = envName.substring(typrmEnvPrefix.length);
            const value = lib.replacePathToSlashed(envValue);
            sortedEnvronmentVariables.push({ key: variableName, value });
            if (lowerCaseDriveRegExp.test(value)) {
                sortedEnvronmentVariables.push({ key: variableName, value: value.substring(0, 1).toUpperCase() + value.substring(1) });
            }
            else if (upperCaseDriveRegExp.test(value)) {
                sortedEnvronmentVariables.push({ key: variableName, value: value.substring(0, 1).toLowerCase() + value.substring(1) });
            }
        }
    }
    sortedEnvronmentVariables.sort((a, b) => {
        return b.value.length - a.value.length; // descending order
    });
    recommended = lib.replacePathToSlashed(recommended);
    recommended = lib.unexpandVariable(recommended, sortedEnvronmentVariables.map((variable) => [`\${${variable.key}}`, variable.value]));
    if (recommended.startsWith(lib.replacePathToSlashed(lib.getHomePath()))) {
        recommended = '~' + recommended.substring(lib.getHomePath().length);
    }
    // print the address and recommend
    if (option.print && lib.isFullPath(address)) {
        if (recommended !== addressBefore) {
            console.log('Recommend: #ref: ' + recommended);
        }
        if (addressLineNum === notFound && !('noFileExistCheck' in programOptions)) {
            var checkedPath = (runningOS === 'Windows') ? lib.replaceToPathForWindows(linkableAddress) : lib.replacePathToSlashed(linkableAddress);
            console.log(translate `ERROR: not found a file or folder at` + ` "${checkedPath}"`);
        }
        else {
            console.log(linkableAddress);
            if (addressLineNum === notFoundInFile) {
                console.log(existingAddress);
            }
        }
        if (existingParentOnly) {
            console.log(existingAddress);
        }
    }
    // print the verb menu
    if (lib.isInFileSystem(linkableAddress) && lib.isFullPath(address)) {
        var verbs = getRelatedVerbs(address);
    }
    else {
        var verbs = [];
    }
    if (verbs.length >= 1) {
        var verbMenu = verbs.map((verb) => (verb.label)).join(', ');
        if (verbMenu !== '' && option.print) {
            console.log('    ' + verbMenu);
        }
    }
    else {
        var verbMenu = '';
    }
    return {
        foundLines: [],
        hasVerbMenu: (verbMenu !== ''),
        verbs,
        address,
        addressLineNum,
        existingAddress,
        previousKeyword: '',
    };
}
function getRelatedLineNumGetter(address) {
    if (process.env.TYPRM_LINE_NUM_GETTER) {
        const getterConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof getterConfig === 'object' && getterConfig) {
            const getters = getterConfig;
            for (const getter of getters) {
                if (new RegExp(getter.regularExpression).test(address)) {
                    return getter;
                }
            }
        }
    }
    const verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: Not matched address "${address}". Check TYPRM_LINE_NUM_GETTER environment variable.`);
    }
    return {
        regularExpression: '^(.*?)(#.*)?$',
        type: 'keep',
        filePathRegularExpressionIndex: 1,
        address,
    };
}
function getRelatedVerbs(address) {
    var relatedVerbs = [];
    if (process.env.TYPRM_VERB) {
        const verbConfig = yaml.load(process.env.TYPRM_VERB);
        if (typeof verbConfig === 'object' && verbConfig) {
            const verbs = verbConfig;
            for (const verb of verbs) {
                if (new RegExp(verb.regularExpression).test(address)) {
                    verb.requestedCommandFolder = true;
                    relatedVerbs.push(verb);
                }
            }
        }
    }
    relatedVerbs = relatedVerbs.concat(getFolderVerbs());
    return relatedVerbs;
}
function getFolderVerbs() {
    const relatedVerbs = [];
    if (runningOS === 'Windows') {
        var command = `explorer /select, "${verbVar.windowsExistingAddress}"`;
        var requestedCommandFolder = false;
    }
    else {
        var command = `open -R "${verbVar.existingAddress}"`;
        // Open the folder by Finder and select the file
        var requestedCommandFolder = false;
    }
    return [{
            regularExpression: '.*',
            label: '0.Folder',
            number: '0',
            command,
            requestedCommandFolder,
        }];
}
function runVerb(verbs, address, lineNum, existingAddress, verbNum) {
    var command = '';
    var requestedCommandFolder = true;
    const matchesVerbs = verbs.filter((verb) => (verb.number.toString() === verbNum));
    if (matchesVerbs.length >= 1) {
        const verb = matchesVerbs[0];
        const fragmentIndex = address.indexOf('#');
        if (fragmentIndex === notFound) {
            command = verb.command
                .replace(verbVar.ref, address)
                .replace(verbVar.windowsRef, lib.replaceToPathForWindows(address))
                .replace(verbVar.file, lib.replacePathToSlashed(address))
                .replace(verbVar.windowsFile, lib.replaceToPathForWindows(address))
                .replace(verbVar.existingAddress, lib.replacePathToSlashed(existingAddress))
                .replace(verbVar.windowsExistingAddress, lib.replaceToPathForWindows(existingAddress))
                .replace(verbVar.fragment, '')
                .replace(verbVar.lineNum, lineNum.toString());
            var fileOrFolderPath = address;
        }
        else {
            command = verb.command
                .replace(verbVar.ref, address)
                .replace(verbVar.windowsRef, lib.replaceToPathForWindows(address.substring(0, fragmentIndex)) + address.substring(fragmentIndex))
                .replace(verbVar.file, lib.replacePathToSlashed(address.substring(0, fragmentIndex)))
                .replace(verbVar.windowsFile, lib.replaceToPathForWindows(address.substring(0, fragmentIndex)))
                .replace(verbVar.existingAddress, lib.replacePathToSlashed(existingAddress))
                .replace(verbVar.windowsExistingAddress, lib.replaceToPathForWindows(existingAddress))
                .replace(verbVar.fragment, address.substring(fragmentIndex + 1))
                .replace(verbVar.lineNum, lineNum.toString());
            var fileOrFolderPath = address.substring(0, fragmentIndex);
        }
        if (runningOS === 'Windows') {
            fileOrFolderPath = fileOrFolderPath.replace(/\//g, '\\');
        }
        fileOrFolderPath = lib.getFullPath(fileOrFolderPath, process.cwd());
        requestedCommandFolder = verb.requestedCommandFolder;
    }
    if (command !== '') {
        execShellCommand(command, requestedCommandFolder);
    }
    else {
        console.log(translate `Error that verb number ${verbNum} is not defined`);
    }
}
function printConfig() {
    console.log(`Verbose: Option and environment variables:`);
    if ('folder' in programOptions) {
        console.log(`    Verbose: --folder, TYPRM_FOLDER: ${programOptions.folder}`);
    }
    if ('thesaurus' in programOptions) {
        console.log(`    Verbose: --thesaurus, TYPRM_THESAURUS: ${programOptions.thesaurus}`);
    }
    if ('commandSymbol' in programOptions) {
        console.log(`    Verbose: --command-symbol, TYPRM_COMMAND_SYMBOL: ${programOptions.commandSymbol}`);
    }
    if ('commandFolder' in programOptions) {
        console.log(`    Verbose: --command-folder, TYPRM_COMMAND_FOLDER: ${programOptions.commandFolder}`);
    }
    if ('wordSuperSeparators' in programOptions) {
        console.log(`    Verbose: --word-super-separators, TYPRM_WORD_SUPER_SEPARATORS: "${programOptions.wordSuperSeparators}"`);
    }
    if ('wordSeparators' in programOptions) {
        console.log(`    Verbose: --word-separators, TYPRM_WORD_SEPARATORS: "${programOptions.wordSeparators}"`);
    }
    console.log(`    Verbose: programOptionsWordSeparators: "${programOptionsWordSeparators}"`);
    for (const [envName, envValue] of Object.entries(process.env)) {
        if (envName.startsWith('TYPRM_') && envName !== 'TYPRM_LINE_NUM_GETTER' && envName !== 'TYPRM_VERB') {
            console.log(`    Verbose: ${envName} = ${envValue}`);
        }
    }
    if (process.env.TYPRM_LINE_NUM_GETTER) {
        const getterConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof getterConfig === 'object' && getterConfig) {
            const getters = getterConfig;
            var index = 0;
            for (const getter1 of getters) {
                if (getter1.type === 'text') {
                    const getter = getter1;
                    console.log(`    Verbose: TYPRM_LINE_NUM_GETTER[${index}]:`);
                    console.log(`        Verbose: regularExpression: ${getter.regularExpression}`);
                    console.log(`        Verbose: type: ${getter.type}`);
                    console.log(`        Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
                    console.log(`        Verbose: keywordRegularExpressionIndex: ${getter.keywordRegularExpressionIndex}`);
                    console.log(`        Verbose: csvOptionRegularExpressionIndex: ${getter.csvOptionRegularExpressionIndex}`);
                    console.log(`        Verbose: targetMatchIdRegularExpressionIndex: ${getter.targetMatchIdRegularExpressionIndex}`);
                    console.log(`        Verbose: address: ${getter.address}`);
                }
                else if (getter1.type === 'figure') {
                    const getter = getter1;
                    console.log(`    Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
                    console.log(`        Verbose: regularExpression: ${getter.regularExpression}`);
                    console.log(`        Verbose: type: ${getter.type}`);
                    console.log(`        Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
                    console.log(`        Verbose: xExpressionIndex: ${getter.xExpressionIndex}`);
                    console.log(`        Verbose: yExpressionIndex: ${getter.yExpressionIndex}`);
                    console.log(`        Verbose: nameExpressionIndex: ${getter.nameExpressionIndex}`);
                    console.log(`        Verbose: pointerImage: ${getter.pointerImage}`);
                    console.log(`        Verbose: outputFolder: ${getter.outputFolder}`);
                }
                else if (getter1.type === 'keep') {
                    const getter = getter1;
                    console.log(`    Verbose: TYPRM_LINE_NUM_GETTER[${index}]:`);
                    console.log(`        Verbose: regularExpression: ${getter.regularExpression}`);
                    console.log(`        Verbose: type: ${getter.type}`);
                    console.log(`        Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
                }
                else {
                    const getter = getter1;
                    console.log(`    Verbose: TYPRM_LINE_NUM_GETTER[${index}]:`);
                    console.log(`        Verbose: regularExpression: ${getter.regularExpression}`);
                    console.log(`        Verbose: type: ${getter.type} (unknown)`);
                }
                index += 1;
            }
        }
    }
    if (process.env.TYPRM_VERB) {
        const verbConfig = yaml.load(process.env.TYPRM_VERB);
        if (typeof verbConfig === 'object' && verbConfig) {
            const verbs = verbConfig;
            var index = 0;
            for (const verb of verbs) {
                console.log(`    Verbose: TYPRM_VERB[${index}]:`);
                console.log(`        Verbose: regularExpression: ${verb.regularExpression}`);
                console.log(`        Verbose: label: ${verb.label}`);
                console.log(`        Verbose: number: ${verb.number}`);
                console.log(`        Verbose: command: ${verb.command}`);
                index += 1;
            }
        }
    }
    const secretEnvNames = Object.keys(lib.getDotEnvSecrets());
    if (secretEnvNames.length >= 1) {
        for (const envName of secretEnvNames) {
            console.log(`    Verbose: (.env) ${envName} = (secret)`);
        }
        console.log(`    Verbose: ${translate `Envrironment variables defined in ".env" file are not inherit to child processes.`}`);
    }
}
function varidateMutualSearchCommandArguments() {
    if (programArguments.length < 2) {
        throw new Error('Error: Too few argurments.\n' +
            'typrm mutual-search  __Keywords__"');
    }
}
function onEndOfSettingScope(setting, parser) {
    for (const key of Object.keys(setting)) {
        if (!setting[key].isReferenced) {
            parser.flushToTagList();
            console.log('');
            console.log(translate `Warning: ${getTestablePath(parser.filePath)}:${setting[key].lineNum}`);
            console.log(translate `  Not referenced: ${key}`);
            parser.warningCount += 1;
        }
    }
}
function evaluateIfCondition(expression, setting, parser, previsousEvalatedKeyValues = []) {
    if (expression === 'true') {
        if (parser.verbose) {
            console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: true`);
        }
        return true;
    }
    else if (expression === 'false') {
        if (parser.verbose) {
            console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: false`);
        }
        return false;
    }
    const envDot = '$env.';
    var match = null;
    var parent = '';
    if (expression.startsWith(settingsDot)) {
        parent = settingsDot;
        // e.g. $settings.__Stage__ == develop
        // e.g. $settings.__Stage__ != develop
        match = /\$settings.([^ ]*) *(==|!=) *([^ ].*)/.exec(expression);
    }
    else if (expression.startsWith(envDot)) {
        parent = envDot;
        // e.g. $env.typrm_aaa == aaa
        // e.g. $env.typrm_aaa != aaa
        // e.g. $env.typrm_aaa == ""
        // e.g. $env.typrm_aaa != ""
        match = /\$env.([^ ]*) *(==|!=) *([^ ]*)/.exec(expression);
    }
    if (match && parent) {
        const name = match[1];
        const operator = match[2];
        var rightValue = match[3];
        if (parent === settingsDot) {
            if (name in setting) {
                var leftValue = setting[name].value;
                setting[name].isReferenced = true;
            }
            else {
                return new Error(`not found ${name} in the settings`);
            }
        }
        else if (parent === envDot) {
            const envValue = process.env[name];
            if (envValue) {
                var leftValue = envValue;
            }
            else {
                var leftValue = '';
            }
        }
        else { // if no parent
            var leftValue = '';
        }
        if (rightValue === '""') {
            rightValue = '';
        }
        var result;
        if (operator === '==') {
            result = (leftValue === rightValue);
        }
        else if (operator === '!=') {
            result = (leftValue !== rightValue);
        }
        if (result !== undefined) {
            if (previsousEvalatedKeyValues.length === 0) {
                if (parser.verbose) {
                    if (parser.command == CommandEnum.replace) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: skipped evaluation: #if: ${expression}`);
                    }
                    else if (parser.command == CommandEnum.check) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: ${expression}  (${result}, ${name} = ${leftValue})`);
                    }
                }
                return result;
            }
            else {
                const isReplacable = previsousEvalatedKeyValues.includes(name) || parent !== settingsDot;
                if (parser.verbose) {
                    if (!isReplacable) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: skipped evaluation: #if: ${expression}`);
                    }
                    else {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: ${expression}  (${result}, ${name} = ${leftValue})`);
                    }
                }
                return {
                    result,
                    isReplacable,
                };
            }
        }
    }
    return new Error('syntax error');
}
class EvaluatedCondition {
    constructor() {
        this.result = false;
        this.isReplacable = false;
    }
}
var instanceOf;
(function (instanceOf) {
    function EvaluatedCondition(object) {
        return object.hasOwnProperty('isReplacable');
    }
    instanceOf.EvaluatedCondition = EvaluatedCondition;
})(instanceOf || (instanceOf = {}));
function getTestablePath(path_) {
    if ('test' in programOptions) {
        const home = lib.getHomePath();
        if (path_.startsWith(home)) {
            return '${HOME}' + lib.replacePathToSlashed(path_.substring(home.length));
        }
        else if (path_.startsWith(inputFileParentPath + path.sep) && inputFileParentPath !== '') {
            return '${inputFileParentPath}/' + lib.replacePathToSlashed(path_.substring(inputFileParentPath.length + 1));
        }
        else {
            return lib.replacePathToSlashed(path_);
        }
    }
    else {
        return path_;
    }
}
function getTestableOSPath(path_) {
    if ('test' in programOptions) {
        const home = lib.getHomePath();
        if (path_.startsWith(home)) {
            return '${HOME}' + path_.substring(home.length);
        }
        else if (path_.startsWith(inputFileParentPath + path.sep) && inputFileParentPath !== '') {
            return '${inputFileParentPath}/' + path_.substring(inputFileParentPath.length + 1);
        }
        else {
            return path_;
        }
    }
    else {
        return path_;
    }
}
function deleteFileSync(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
function getExpectedLine(setting, template, options = {}) {
    return getExpectedLineAndEvaluationLog(setting, template, false, options).expected;
}
function getExpectedLineAndEvaluationLog(setting, template, withLog = false, options = {}) {
    var expected = template;
    const log = [];
    for (const key of Object.keys(setting).sort((a, b) => (b.length - a.length))) {
        const keyRe = new RegExp(lib.escapeRegularExpression(key), 'g');
        const value = setting[key].value.replace(/\$/g, '$$');
        if (keyRe.test(expected)) {
            const expectedAfter = expected.replace(keyRe, value);
            setting[key].isReferenced = true;
            if ('relatedReferenced' in options) {
                const relatedKey = getRelatedKey(key);
                if (relatedKey in setting) {
                    setting[relatedKey].isReferenced = true;
                }
            }
            expected = expectedAfter;
            log.push({ before: key, after: setting[key].value });
        }
    }
    return { expected, log };
    function getRelatedKey(key) {
        if (key.endsWith('(yes)')) {
            var relatedKey = key.slice(0, -'(yes)'.length) + '(no)';
        }
        else if (key.endsWith('(no)')) {
            var relatedKey = key.slice(0, -'(no)'.length) + '(yes)';
        }
        else {
            var relatedKey = '';
        }
        return relatedKey;
    }
}
function getExpectedLineInFileTemplate(setting, lineInTemplate, parser) {
    const templateTag = parseTemplateTag(lineInTemplate, parser);
    if (templateTag.isFound) {
        const settingWithSecrets = mergeSecretEnvironmentVariable(setting);
        const before = getExpectedLine(setting, templateTag.template);
        const after = getExpectedLine(settingWithSecrets, templateTag.template);
        var expected = lineInTemplate.substring(0, templateTag.indexInLine).replace(before, after).trimRight();
    }
    else {
        var expected = lineInTemplate;
    }
    return expected;
}
function getReplacedLine(setting, template) {
    const replacedSetting = {};
    for (const key of Object.keys(setting)) {
        var value = setting[key].value;
        replacedSetting[key] = { value, isReferenced: true /*dummy*/, tag: 'toAfterTemplate',
            lineNum: 0 /*dummy*/, settingsIndex: '' };
    }
    return getExpectedLine(replacedSetting, template);
}
// evaluateSettingsDotVariable
// e.g.
// this.parsingCopyTag.value = 'copyName, {argument: $settings.var}'
// replacedCopyTagValue = 'copyName, {argument: value}'
function evaluateSettingsDotVariable(expression, setting) {
    const dollerSettingsIndex = expression.indexOf(settingsDot);
    if (dollerSettingsIndex === notFound) {
        return { evaluated: expression, isError: false };
    }
    const variableNameIndex = dollerSettingsIndex + settingsDot.length;
    for (const variableName of Object.keys(setting).sort((a, b) => (b.length - a.length))) {
        if (expression.indexOf(variableName, variableNameIndex) !== notFound) {
            setting[variableName].isReferenced = true;
            return {
                evaluated: expression.replace(`${settingsDot}${variableName}`, setting[variableName].value),
                isError: false
            };
        }
    }
    return { evaluated: expression, isError: true };
}
// getReplacedCopyTagContents
// copyTag.contents.
function getReplacedCopyTagContents(copyTag, sourceCopyTag, parameters) {
    if (Object.keys(copyTag.arguments).length === 0) {
        return copyTag.contents;
    }
    else {
        const emptySetting = { lineNum: 0, settingsIndex: '', tag: 'copyArgument', isReferenced: true };
        const replacedContents = [];
        const parser = new Parser();
        const replacingKeys = Object.keys(sourceCopyTag.arguments);
        const key = 0, value = 1;
        function toSetting(value) {
            return { ...{ value }, ...emptySetting };
        }
        const oldSetting = Object.fromEntries(Object.entries(sourceCopyTag.arguments).map(keyValue => [keyValue[key], toSetting(keyValue[value])]));
        const newSetting = Object.fromEntries(Object.entries({ ...sourceCopyTag.arguments, ...parameters }).map(keyValue => [keyValue[key], toSetting(keyValue[value])]));
        for (let lineNum = 1; lineNum <= sourceCopyTag.contents.length; lineNum += 1) {
            const sourceLine = sourceCopyTag.contents[lineNum - 1];
            const replacingLine = copyTag.contents[lineNum - 1];
            const templateTag = parseTemplateTag(sourceLine, parser);
            if (templateTag.isFound && templateTag.includesKey(replacingKeys)) {
                var expected = getExpectedLine(oldSetting, templateTag.template);
                var replaced = getReplacedLine(newSetting, templateTag.template);
                if (replacingLine.includes(expected)) {
                    var replacedLine = replacingLine.replace(new RegExp(lib.escapeRegularExpression(expected), 'g'), replaced.replace(/\$/g, '$$'));
                    const templateTagIndex = tagIndexOf(replacedLine, templateLabel);
                    replacedLine = replacedLine.substring(0, templateTagIndex).trimRight();
                    replacedContents.push(replacedLine);
                }
                else {
                    replacedContents.push(replacingLine);
                }
            }
            else {
                replacedContents.push(sourceLine);
            }
        }
        return replacedContents;
    }
}
function mergeSecretEnvironmentVariable(settings) {
    const settingsAndEnv = Object.assign({}, settings);
    for (const [envName, envValue] of Object.entries(lib.getProcessEnvAndDotEnvSecrets())) {
        const value = {
            value: envValue || '(no_value)',
            lineNum: 0,
            settingsIndex: '/',
            tag: 'env',
            isReferenced: true,
        };
        value.value = getTestableOSPath(value.value);
        settingsAndEnv[`$env.{${envName}}`] = value;
        settingsAndEnv[`$env.${envName}`] = value;
    }
    return settingsAndEnv;
}
async function evaluateEnvironmentVariable(lines, filePath, linesLineNum) {
    const evaluatedLines = [];
    const parser = new Parser();
    parser.command = CommandEnum.search;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = filePath;
    const settingsTree = await makeSettingTree(parser);
    const reader = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    parser.lineNum = 0;
    for await (const line1 of reader) {
        parser.lineNum += 1;
        settingsTree.moveToLine(parser);
        if (parser.lineNum == linesLineNum) {
            for (const replacingLine of lines) {
                evaluatedLines.push(getExpectedLineInFileTemplate(settingsTree.currentSettings, replacingLine, parser));
            }
        }
    }
    return evaluatedLines;
}
// tagIndexOf
// /(^| )tag/
function tagIndexOf(line, tag) {
    var index = -1;
    for (;;) {
        index = line.indexOf(tag, index + 1);
        if (index <= 0 || line[index - 1] === ' ') {
            return index;
        }
    }
}
function getValue(line, separatorIndex = -1) {
    var value = line.substring(separatorIndex + 1).trim();
    if (value[0] === '#') {
        var comment = 0;
    }
    else {
        var comment = value.indexOf(' #');
    }
    if (comment !== notFound) {
        value = value.substring(0, comment).trim();
    }
    value = unscapePercentByte(value);
    return value;
}
function getLineWithColoredValue(line) {
    const toIndex = line.indexOf(' #to:');
    if (toIndex == notFound) {
        // __Value__:                 #//
        //          ^separatorIndex  ^nextSharpIndex
        var separatorIndex = line.indexOf(':');
    }
    else {
        // __Value__:  #//   #to:      #//
        //                  ^toIndex  ^nextSharpIndex
        //                      ^separatorIndex
        var separatorIndex = toIndex + 4;
    }
    var nextSharpIndex = line.indexOf(' #', separatorIndex);
    if (nextSharpIndex == notFound) {
        nextSharpIndex = line.length;
    }
    const value = line.substring(separatorIndex + 1, nextSharpIndex).trim();
    const valueIndex = line.indexOf(value, separatorIndex);
    if (value.length === 0) {
        return line;
    }
    else {
        return line.substring(0, valueIndex) +
            chalk.yellowBright(value) +
            line.substring(valueIndex + value.length);
    }
}
function unscapePercentByte(value) {
    var found = 0;
    for (;;) {
        const found20 = value.indexOf('"%20"', found);
        const found25 = value.indexOf('"%25"', found);
        if (found20 !== notFound) {
            if (found25 !== notFound) {
                if (found20 < found25) {
                    value = value.replace('"%20"', ' ');
                    found = found20 + 1;
                }
                else {
                    value = value.replace('"%25"', '%');
                    found = found25 + 1;
                }
            }
            else {
                value = value.replace('"%20"', ' ');
                found = found20 + 1;
            }
        }
        else {
            if (found25 !== notFound) {
                value = value.replace('"%25"', '%');
                found = found25 + 1;
            }
            else {
                break;
            }
        }
    }
    return value;
}
function hasRefTag(keywords) {
    return keywords.trim().startsWith(refLabel);
}
function hasCheckTag(keywords) {
    keywords = keywords.trim();
    return keywords === '#c' || keywords.startsWith('#c ') ||
        keywords === checkTag || keywords.startsWith(`${checkTag} `);
}
function hasReplaceTag(keywords) {
    keywords = keywords.trim();
    return keywords === '#r' || keywords.startsWith('#r ') ||
        keywords === replaceTag || keywords.startsWith(`${replaceTag} `);
}
function hasResetTag(keywords) {
    keywords = keywords.trim();
    return keywords === resetTag || keywords.startsWith(`${resetTag} `);
}
function hasMutualTag(keywords) {
    keywords = keywords.trim();
    return keywords === mutualTag || keywords.startsWith(`${mutualTag} `);
}
function hasNumberTag(keywords) {
    const numberRegularExpression = /^[0-9]+$/;
    keywords = keywords.trim();
    return keywords[0] === '#' && numberRegularExpression.test(keywords.substring(1));
}
function hasShellCommandSymbol(keywords) {
    return keywords[0] === programOptions.commandSymbol && keywords[1] === ' ';
}
function getNotSetTemplateIfTagVariableNames(settingKeys) {
    if (settingKeys.includes(templateIfYesKey)) {
        if (settingKeys.includes(templateIfNoKey)) {
            var notSetNames = '';
        }
        else {
            var notSetNames = templateIfNoKey;
        }
    }
    else {
        if (settingKeys.includes(templateIfNoKey)) {
            var notSetNames = templateIfYesKey;
        }
        else {
            var notSetNames = `${templateIfYesKey} ${translate('and')} ${templateIfNoKey}`;
        }
    }
    return notSetNames;
}
function parseTemplateTag(line, parser) {
    const tag = new TemplateTag(parser);
    tag.parseLine(line);
    return tag;
}
function parseKeyName(line) {
    const colon = line.indexOf(':');
    if (colon === notFound) {
        return '';
    }
    const lineHead = line.substring(0, colon).trim();
    if (lineHead[0] === '-') {
        var csv = lineHead.substring(1).trim(); // cut '-'
    }
    else {
        var csv = lineHead;
    }
    return csv;
}
// cutQuotation
// Example: 'abc' ⇨ abc, "abc" ⇨ abc, 'ab'c ⇨ 'ab'c
function cutQuotation(str) {
    if (str.startsWith("'") && str.endsWith("'")) {
        return str.substr(1, str.length - 2);
    }
    else if (str.startsWith('"') && str.endsWith('"')) {
        return str.substr(1, str.length - 2);
    }
    else {
        return str;
    }
}
function cutTag(line) {
    if (line[0] === '#') {
        var separatorIndex = line.indexOf(' ');
        if (separatorIndex === notFound) {
            separatorIndex = line.indexOf(':');
        }
        if (separatorIndex === notFound) {
            return '';
        }
        return line.substring(separatorIndex + 1).trim();
    }
    else {
        return line;
    }
}
// isBackSlashParameter
// Example:
//    ( '\na', 0 ) === false
//    ( '\na', 1 ) === true
//    ( '\na', 2 ) === false
// #keyword: isBackSlashParameter
function isBackSlashParameter(checkingString, index) {
    const startIndex = index;
    do {
        index -= 1;
        if (index < 0) {
            break;
        }
    } while (checkingString[index] === '\\');
    const backSlashCount = startIndex - index - 1;
    return (backSlashCount % 2 === 1);
}
var CommandEnum;
(function (CommandEnum) {
    CommandEnum[CommandEnum["unknown"] = 0] = "unknown";
    CommandEnum[CommandEnum["check"] = 1] = "check";
    CommandEnum[CommandEnum["replace"] = 2] = "replace";
    CommandEnum[CommandEnum["search"] = 3] = "search";
})(CommandEnum || (CommandEnum = {}));
class SettingsTree {
    constructor() {
        this.indices = new Map(); // e.g. { 1: "/",  4: "/1",  11: "/1/1",  14: "/1/2",  17: "/2" }
        this.indicesWithIf = new Map(); // e.g. { 1: "/",  3: "/1/a",  4: "/1",  7: "/1/a" }
        this.outOfFalseBlocks = new Map(); // #search: outOfFalseBlocks
        this.settings = {};
        this.settingsInformation = {};
        // current: current line moved by "moveToLine" method
        this.wasChanged = false;
        this.currentSettings = {};
        this.currentSettingIndex = '/';
        this.currentIsOutOfFalseBlock = true; // by settings before replaced
        this.outOfScopeSettingIndices = []; // This is set when previous line is in scope
        // next: next for "moveToLine" method
        this.nextSettingsLineNum = 1;
        this.nextLineNumIndex = 0;
        this.nextIfLineNumIndex = 0;
        this.nextIfLineNum = 1;
    }
    moveToLine(parser) {
        Object.assign(this, this.moveToLine_Immutably(parser));
    }
    moveToLine_Immutably(parser) {
        const settingsTree = this;
        const return_ = {
            outOfFalseBlocks: settingsTree.outOfFalseBlocks,
            wasChanged: false,
            currentSettings: settingsTree.currentSettings,
            currentSettingIndex: settingsTree.currentSettingIndex,
            currentIsOutOfFalseBlock: settingsTree.currentIsOutOfFalseBlock,
            outOfScopeSettingIndices: [],
            nextLineNumIndex: settingsTree.nextLineNumIndex,
            nextSettingsLineNum: settingsTree.nextSettingsLineNum,
            nextIfLineNumIndex: settingsTree.nextIfLineNumIndex,
            nextIfLineNum: settingsTree.nextIfLineNum,
        };
        const lineNum = parser.lineNum;
        var outOfFalseBlocks = settingsTree.outOfFalseBlocks;
        if (lineNum === 1 || lineNum === settingsTree.nextSettingsLineNum) {
            if (lineNum === 1) {
                var previousSettingIndex = '';
            }
            else {
                var previousSettingIndex = settingsTree.currentSettingIndex;
            }
            const currentSettingIndex = settingsTree.indices.get(parser.lineNum); // e.g. "/a/bc"
            const currentSettingIndexSlash = `${currentSettingIndex}/`; // e.g. "/a/bc/"
            return_.currentSettingIndex = currentSettingIndex;
            outOfFalseBlocks = new Map();
            var outOfScopeSettingIndices = [];
            var previousParentIndex = previousSettingIndex; // e.g. "/a/b/d/e"
            while (!currentSettingIndexSlash.startsWith(`${previousParentIndex}/`) && previousParentIndex !== '/') {
                // e.g. previousParentIndex == "/a", not "/a/b"
                // The last slash is in order not to match a part of folder name.
                outOfScopeSettingIndices.push(previousParentIndex);
                previousParentIndex = path.dirname(previousParentIndex);
            }
            return_.outOfScopeSettingIndices = outOfScopeSettingIndices;
            var currentSettings = {};
            var parentIndex = '/';
            var separatorPosition = 0;
            const parentIndices = [];
            for (;;) { // parentIndex loop
                parentIndices.push(parentIndex);
                separatorPosition = currentSettingIndex.indexOf('/', separatorPosition + 1);
                if (separatorPosition === notFound) {
                    break;
                }
                parentIndex = currentSettingIndex.substring(0, separatorPosition);
            }
            if (currentSettingIndex !== '/') {
                parentIndices.push(currentSettingIndex);
            }
            for (parentIndex of parentIndices) {
                const parentSetting = settingsTree.settings[parentIndex];
                currentSettings = { ...currentSettings, ...parentSetting };
                const r = settingsTree.addCurrentSettingsInIfTag_Immutably(parentIndex, currentSettings, parser);
                currentSettings = { ...currentSettings, ...r.currentSettings };
                outOfFalseBlocks = new Map([...outOfFalseBlocks, ...r.outOfFalseBlocks]);
            }
            return_.currentSettings = currentSettings;
            const startLineNums = Array.from(settingsTree.indices.keys());
            if (lineNum === 1) {
                return_.nextLineNumIndex = 0;
            }
            if (return_.nextLineNumIndex < startLineNums.length) {
                return_.nextLineNumIndex += 1;
                return_.nextSettingsLineNum = startLineNums[return_.nextLineNumIndex];
            }
            else {
                return_.nextSettingsLineNum = 0;
            }
            if (parser.verbose) {
                const indexLabel = `"${currentSettingIndex}"${currentSettingIndex === '/' ? ' (root)' : ''}`;
                console.log(`    Verbose: settings ${indexLabel}`);
                console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${lineNum}: settings: ${indexLabel}`);
                for (const [key, setting] of Object.entries(currentSettings)) {
                    console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${setting.lineNum}:     ${key}: ${setting.value}`);
                }
            }
            return_.wasChanged = true;
        }
        if (lineNum === 1 || lineNum === settingsTree.nextIfLineNum) {
            return_.currentIsOutOfFalseBlock = outOfFalseBlocks.get(lineNum);
            const startLineNums = Array.from(settingsTree.indicesWithIf.keys());
            if (lineNum === 1) {
                return_.nextIfLineNumIndex = 0;
            }
            if (return_.nextIfLineNumIndex < startLineNums.length) {
                return_.nextIfLineNumIndex += 1;
                return_.nextIfLineNum = startLineNums[return_.nextIfLineNumIndex];
            }
            else {
                return_.nextIfLineNum = 0;
            }
        }
        return_.outOfFalseBlocks = outOfFalseBlocks;
        return return_;
    }
    addCurrentSettingsInIfTag_Immutably(currentIndex, currentSettings, parser) {
        const settingsTree = this;
        const return_ = {
            currentSettings: currentSettings,
            outOfFalseBlocks: new Map(),
        };
        var currentSettings = currentSettings;
        const outOfFalseBlocks = new Map();
        const notVerboseParser = new Parser();
        Object.assign(notVerboseParser, { ...parser, verbose: false, ifTagErrorMessageIsEnabled: false });
        const ifTagParser = new IfTagParser(notVerboseParser);
        if (currentIndex === '/') {
            var currentIndexSlash = '/';
        }
        else {
            var currentIndexSlash = currentIndex + '/';
        }
        const disabledFalseIndex = '!'; // startsWith(falseIndex) returns false
        var falseIndex = disabledFalseIndex;
        var isInCurrentSetting = false;
        for (const [lineNumInBlock, indexInBlock] of Array.from(settingsTree.indicesWithIf.entries())) {
            // isInCurrentSetting = ( index === currentIndex + '/*' )
            if (!isInCurrentSetting) {
                if (indexInBlock === currentIndex) { // at current index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                }
                isInCurrentSetting = (path.dirname(indexInBlock) === currentIndex &&
                    lib.isAlphabetIndex(indexInBlock));
            }
            else {
                isInCurrentSetting = ((indexInBlock.startsWith(currentIndexSlash) &&
                    lib.isAlphabetIndex(indexInBlock.substr(currentIndexSlash.length, 1))));
                if (!isInCurrentSetting) { // at next index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                }
            }
            if (isInCurrentSetting) {
                const outOfFalseBock = !indexInBlock.startsWith(falseIndex);
                if (outOfFalseBock) {
                    var condition = settingsTree.settingsInformation[indexInBlock].condition;
                    if (condition === '') {
                        condition = 'true';
                    }
                    ifTagParser.setPosition(parser.filePath, condition, lineNumInBlock);
                    ifTagParser.evaluate(`#if: ${condition}`, currentSettings);
                    if (ifTagParser.thisIsOutOfFalseBlock) { // #if: true
                        currentSettings = { ...currentSettings, ...settingsTree.settings[indexInBlock] };
                        falseIndex = disabledFalseIndex;
                    }
                    else { // #if: false
                        falseIndex = indexInBlock + '/';
                    }
                }
                outOfFalseBlocks.set(lineNumInBlock, falseIndex == disabledFalseIndex);
            }
        }
        return_.currentSettings = currentSettings;
        return_.outOfFalseBlocks = outOfFalseBlocks;
        parser.errorCount = notVerboseParser.errorCount;
        parser.warningCount = notVerboseParser.warningCount;
        return return_;
    }
    moveToEndOfFile() {
        this.outOfScopeSettingIndices = [];
        const previousSettingIndex = this.currentSettingIndex;
        var previousParentIndex = previousSettingIndex;
        while (previousParentIndex !== '/') {
            this.outOfScopeSettingIndices.push(previousParentIndex);
            previousParentIndex = path.dirname(previousParentIndex);
        }
        this.outOfScopeSettingIndices.push('/');
        this.currentSettings = {};
        this.currentSettingIndex = '';
        this.nextSettingsLineNum = 0;
        this.nextLineNumIndex = 0;
    }
}
;
;
class ReplaceToTagTree {
    constructor() {
        this.replaceTo = {};
        this.outOfFalseBlocks = new Map();
        this.outOfFalseBlocksByOriginalTag = new Map();
        this.command = 'replace';
        // current: current line moved by "moveToLine" method
        this.currentNewSettings = {}; // to tag. It includes settings before replace
        this.currentNewSettingsByOriginalTag = {}; // original tag. It does not include other than original tag
        this.currentOldSettingsInIfBlock = {}; // before replaced in current if block out of settings
        this.currentNewSettingsInIfBlock = {}; // after  replaced in current if block out of settings
        this.currentIsOutOfFalseBlock = false; // true means that to replace is enabled
        this.currentNotFoundNameInSameAsTag = [];
        // next: next for "moveToLine" method
        this.nextLineNumIndex = 0;
        this.nextSettingsLineNum = 1;
        this.nextIfLineNumIndex = 0;
        this.nextIfLineNum = 1;
    }
    get replaceToLength() {
        return Object.values(this.replaceTo).reduce((sum, settings) => sum + Object.values(settings).length, 0);
    }
    moveToLine(parser, settingsTree) {
        Object.assign(this, this.moveToLine_Immutably(parser, settingsTree));
    }
    moveToLine_Immutably(parser, settingsTree) {
        // "settingsTree" must be called "moveToLine" method.
        const toTagTree = this;
        const return_ = {
            currentNewSettings: toTagTree.currentNewSettings,
            currentNewSettingsByOriginalTag: toTagTree.currentNewSettingsByOriginalTag,
            currentOldSettingsInIfBlock: toTagTree.currentOldSettingsInIfBlock,
            currentNewSettingsInIfBlock: toTagTree.currentNewSettingsInIfBlock,
            currentNotFoundNameInSameAsTag: toTagTree.currentNotFoundNameInSameAsTag,
            nextLineNumIndex: toTagTree.nextLineNumIndex,
            nextSettingsLineNum: toTagTree.nextSettingsLineNum,
            outOfFalseBlocks: toTagTree.outOfFalseBlocks,
            outOfFalseBlocksByOriginalTag: toTagTree.outOfFalseBlocksByOriginalTag,
            currentIsOutOfFalseBlock: toTagTree.currentIsOutOfFalseBlock,
            nextIfLineNumIndex: toTagTree.nextIfLineNumIndex,
            nextIfLineNum: toTagTree.nextIfLineNum,
        };
        const lineNum = parser.lineNum;
        var outOfFalseBlocks = toTagTree.outOfFalseBlocks;
        var outOfFalseBlocksByOriginalTag = toTagTree.outOfFalseBlocksByOriginalTag;
        // Set "currentNewSettings" or "currentNewSettingsByOriginalTag".
        if (lineNum === 1 || lineNum === toTagTree.nextSettingsLineNum) { // settingsTree.indices
            outOfFalseBlocks = new Map();
            outOfFalseBlocksByOriginalTag = new Map();
            const index = settingsTree.currentSettingIndex;
            var parentIndex = '/';
            var separatorPosition = 0;
            var currentNewSettings = {};
            var currentNewSettingsByOriginalTag = {};
            const parentIndices = [];
            for (;;) { // parentIndex loop
                parentIndices.push(parentIndex);
                separatorPosition = index.indexOf('/', separatorPosition + 1);
                if (separatorPosition === notFound) {
                    break;
                }
                parentIndex = index.substring(0, separatorPosition);
            }
            if (index !== '/') {
                parentIndices.push(index); // last node
            }
            for (parentIndex of parentIndices) {
                const parentSetting = settingsTree.settings[parentIndex];
                const parentToTags = toTagTree.replaceTo[parentIndex];
                if (this.command === 'replace') {
                    currentNewSettings = { ...currentNewSettings, ...parentSetting };
                    currentNewSettings = { ...currentNewSettings, ...parentToTags };
                }
                else { // if (this.command === 'reset') {
                    currentNewSettingsByOriginalTag = { ...currentNewSettingsByOriginalTag, ...parentSetting };
                    currentNewSettingsByOriginalTag = { ...currentNewSettingsByOriginalTag, ...parentToTags };
                }
                const r = toTagTree.addCurrentSettingsInIfBlock_Immutably(// out of if tag
                parentIndex, currentNewSettings, currentNewSettingsByOriginalTag, settingsTree, parser);
                if (this.command === 'replace') {
                    currentNewSettings = { ...currentNewSettings, ...r.currentNewSettings };
                    outOfFalseBlocks = new Map([...outOfFalseBlocks, ...r.outOfFalseBlocks]);
                }
                else { // if (this.command === 'reset') {
                    currentNewSettingsByOriginalTag = { ...currentNewSettingsByOriginalTag, ...r.currentNewSettingsByOriginalTag };
                    outOfFalseBlocksByOriginalTag = new Map([...outOfFalseBlocksByOriginalTag, ...r.outOfFalseBlocksByOriginalTag]);
                }
            }
            const variableNamesBefore = Object.keys(settingsTree.currentSettings);
            if (this.command === 'replace') {
                var variableNamesAfter = Object.keys(currentNewSettings);
            }
            else { // if (this.command === 'reset') {
                var variableNamesAfter = Object.keys(currentNewSettingsByOriginalTag);
            }
            const addedVariableNames = variableNamesAfter.filter((element) => (variableNamesBefore.indexOf(element) === -1));
            const removedVariableNames = variableNamesBefore.filter((element) => (variableNamesAfter.indexOf(element) === -1));
            if (addedVariableNames.length >= 1) {
                const settingsLineNum = settingsTree.settingsInformation[settingsTree.currentSettingIndex].lineNum;
                console.log('');
                console.log(`${getTestablePath(parser.filePath)}:${settingsLineNum}: settings`);
                console.log(`    ${translate('Error')}: ${translate('Defined variables are increased')}`);
                console.log(`    ${translate('New defined variables')}: ${addedVariableNames.join(', ')}`);
                parser.errorCount += 1;
            }
            if (removedVariableNames.length >= 1) {
                const settingsLineNum = settingsTree.settingsInformation[settingsTree.currentSettingIndex].lineNum;
                console.log('');
                console.log(`${getTestablePath(parser.filePath)}:${settingsLineNum}: settings`);
                console.log(`    ${translate('Error')}: ${translate('Defined variables are decreased')}`);
                console.log(`    ${translate('Not defined variables')}: ${removedVariableNames.join(', ')}`);
                parser.errorCount += 1;
            }
            return_.currentNewSettings = currentNewSettings;
            return_.currentNewSettingsByOriginalTag = currentNewSettingsByOriginalTag;
            const startLineNums = Array.from(settingsTree.indices.keys());
            if (lineNum === 1) {
                return_.nextLineNumIndex = 0;
            }
            if (return_.nextLineNumIndex < startLineNums.length) {
                return_.nextLineNumIndex += 1;
                return_.nextSettingsLineNum = startLineNums[return_.nextLineNumIndex];
            }
            else {
                return_.nextSettingsLineNum = 0;
            }
        }
        // Set "currentOldSettingsInIfBlock" and "currentNewSettingsInIfBlock".
        if (lineNum === 1 || lineNum === toTagTree.nextIfLineNum) { // settingsTree.indicesWithIf
            if (this.command === 'replace') {
                return_.currentIsOutOfFalseBlock = outOfFalseBlocks.get(lineNum);
            }
            else { // if (this.command === 'reset') {
                return_.currentIsOutOfFalseBlock = outOfFalseBlocksByOriginalTag.get(lineNum);
            }
            const currentIndexWithIf = settingsTree.indicesWithIf.get(lineNum); // e.g. /1/2/a/b
            if (!lib.isAlphabetIndex(currentIndexWithIf)) {
                return_.currentOldSettingsInIfBlock = settingsTree.currentSettings;
                if (this.command === 'replace') {
                    return_.currentNewSettingsInIfBlock = return_.currentNewSettings;
                }
                else { // if (this.command === 'reset') {
                    return_.currentNewSettingsInIfBlock = return_.currentNewSettingsByOriginalTag;
                }
            }
            else {
                var parentIndex = currentIndexWithIf;
                // Set "variablesInCondition"
                const variablesInCondition = [];
                while (lib.isAlphabetIndex(parentIndex)) { // parentIndex loop
                    const ifTag = settingsTree.settingsInformation[parentIndex];
                    if (ifTag.condition !== '' && !ifTag.inSettings) {
                        // e.g. $settings.__Stage__ == develop
                        // e.g. $settings.__Stage__ != develop
                        var match = /\$settings.([^ ]*) *(==|!=) *([^ ].*)/.exec(ifTag.condition);
                        if (match) {
                            variablesInCondition.push(match[1]);
                        }
                    }
                    parentIndex = path.dirname(parentIndex); // e.g. /1/2
                }
                // Set "currentSettingsInIfBlock"
                const currentSettingsInIfBlock = {};
                if (this.command === 'replace') {
                    for (const name of Object.keys(settingsTree.currentSettings)) {
                        if (variablesInCondition.includes(name)) {
                            currentSettingsInIfBlock[name] = toTagTree.currentNewSettings[name];
                        }
                        else {
                            currentSettingsInIfBlock[name] = settingsTree.currentSettings[name];
                        }
                    }
                }
                else { // if (this.command === 'reset') {
                    for (const name of Object.keys(settingsTree.currentSettings)) {
                        currentSettingsInIfBlock[name] = settingsTree.currentSettings[name];
                    }
                }
                // Set "toTagTreeInIfBlock"
                var toTagTreeInIfBlock = new ReplaceToTagTree();
                Object.assign(toTagTreeInIfBlock, toTagTree);
                toTagTreeInIfBlock.replaceTo = {};
                for (const index of Object.keys(settingsTree.settings)) {
                    toTagTreeInIfBlock.replaceTo[index] = {};
                    for (const name of Object.keys(settingsTree.settings[index])) {
                        if (this.command === 'replace') {
                            if (name in toTagTree.replaceTo[index]) {
                                if (variablesInCondition.includes(name)) {
                                    toTagTreeInIfBlock.replaceTo[index][name] = toTagTree.replaceTo[index][name];
                                }
                                else {
                                    toTagTreeInIfBlock.replaceTo[index][name] = settingsTree.settings[index][name];
                                }
                            }
                        }
                        else { // if (this.command === 'reset') {
                            if (variablesInCondition.includes(name)) {
                            }
                            else {
                                if (name in toTagTree.replaceTo[index]) {
                                    toTagTreeInIfBlock.replaceTo[index][name] = toTagTree.replaceTo[index][name];
                                }
                            }
                        }
                    }
                }
                // Set "currentOldSettingsInIfBlock" and "currentNewSettingsInIfBlock"
                if (this.command === 'replace') {
                    const r = toTagTreeInIfBlock.addCurrentSettingsInIfBlock_Immutably(// in if tag and out of if tag
                    settingsTree.currentSettingIndex, currentSettingsInIfBlock, {}, settingsTree, parser);
                    return_.currentOldSettingsInIfBlock = { ...r.currentNewSettings };
                    return_.currentNewSettingsInIfBlock = toTagTree.currentNewSettings;
                }
                else { // if (this.command === 'reset') {
                    const r = toTagTreeInIfBlock.addCurrentSettingsInIfBlock_Immutably(// in if tag and out of if tag
                    settingsTree.currentSettingIndex, {}, currentSettingsInIfBlock, settingsTree, parser);
                    return_.currentOldSettingsInIfBlock = settingsTree.currentSettings;
                    return_.currentNewSettingsInIfBlock = { ...r.currentNewSettingsByOriginalTag };
                }
            }
            // return_.nextIfLineNum = ...
            if (lineNum === 1) {
                return_.nextIfLineNumIndex = 0;
            }
            const startLineNums = Array.from(settingsTree.indicesWithIf.keys());
            if (return_.nextIfLineNumIndex < startLineNums.length) {
                return_.nextIfLineNumIndex += 1;
                return_.nextIfLineNum = startLineNums[return_.nextIfLineNumIndex];
            }
            else {
                return_.nextIfLineNum = 0;
            }
            const value = 1;
            return_.currentNotFoundNameInSameAsTag = [];
            const sameAsSettings = Object.entries(return_.currentNewSettings).filter(keyValue => keyValue[value].sameAs);
            for (const [settingName, setting] of sameAsSettings) {
                const r = SameAsTag.evaluateVariableName(setting.sameAs, return_.currentNewSettings);
                if (r.variableName in return_.currentNewSettings) {
                    return_.currentNewSettings[settingName] = return_.currentNewSettings[r.variableName];
                }
                else {
                    return_.currentNotFoundNameInSameAsTag.push({
                        settingName,
                        notFoundName: r.variableName,
                        referencedVariableNames: r.referencedVariableNames,
                    });
                }
            }
        }
        return_.outOfFalseBlocks = outOfFalseBlocks;
        return_.outOfFalseBlocksByOriginalTag = outOfFalseBlocksByOriginalTag;
        return return_;
    }
    addCurrentSettingsInIfBlock_Immutably(currentIndex, currentNewSettings, currentNewSettingsByOriginalTag, settingsTree, parser) {
        // Add setting in if blocks. e.g. Add settings in /1/a, /1/b.
        const toTagTree = this;
        const return_ = {
            currentNewSettings: currentNewSettings,
            currentNewSettingsByOriginalTag: currentNewSettingsByOriginalTag,
            outOfFalseBlocks: new Map(),
            outOfFalseBlocksByOriginalTag: new Map(),
        };
        var newSettings = currentNewSettings;
        var newSettingsByOriginalTag = { ...currentNewSettingsByOriginalTag };
        const outOfFalseBlocks = new Map();
        const outOfFalseBlocksByOriginalTag = new Map();
        const notVerboseParser = new Parser();
        Object.assign(notVerboseParser, { ...parser, verbose: false, ifTagErrorMessageIsEnabled: false });
        const ifTagParserForNewSettings = new IfTagParser(notVerboseParser);
        const ifTagParserForOldSettings = new IfTagParser(notVerboseParser);
        if (currentIndex === '/') {
            var currentIndexSlash = '/';
        }
        else {
            var currentIndexSlash = currentIndex + '/';
        }
        const disabledFalseIndex = '!'; // startsWith(falseIndex) returns false
        var falseIndexWhenOldSettings = disabledFalseIndex;
        var falseIndexWhenNewSettings = disabledFalseIndex;
        var isInCurrentSetting = false;
        for (const [lineNumInBlock, indexInBlock] of Array.from(settingsTree.indicesWithIf.entries())) {
            // If isInCurrentSetting == true  &&  currentIndex = '/1'
            // then  indexInBlock = [ '/1/a', '/1/b', '/1/c', ... ].
            // isInCurrentSetting = ( index === currentIndex + '/*' )
            if (!isInCurrentSetting) {
                if (indexInBlock === currentIndex) { // at current index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                    outOfFalseBlocksByOriginalTag.set(lineNumInBlock, true);
                }
                isInCurrentSetting = (path.dirname(indexInBlock) === currentIndex &&
                    lib.isAlphabetIndex(indexInBlock));
            }
            else {
                isInCurrentSetting = ((indexInBlock.startsWith(currentIndexSlash) &&
                    lib.isAlphabetIndex(indexInBlock.substr(currentIndexSlash.length, 1))));
                if (!isInCurrentSetting) { // at next index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                    outOfFalseBlocksByOriginalTag.set(lineNumInBlock, true);
                }
            }
            if (isInCurrentSetting) {
                if (this.command === 'replace') {
                    const outOfFalseBlock = !indexInBlock.startsWith(falseIndexWhenNewSettings);
                    if (outOfFalseBlock) {
                        // newSettings = ...
                        var condition = settingsTree.settingsInformation[indexInBlock].condition;
                        if (condition === '') {
                            condition = 'true';
                        }
                        var settingsForIf = newSettings;
                        ifTagParserForNewSettings.evaluate(`#if: ${condition}`, settingsForIf);
                        if (ifTagParserForNewSettings.thisIsOutOfFalseBlock) { // #if: true
                            newSettings = { ...newSettings, ...settingsTree.settings[indexInBlock] };
                            newSettings = { ...newSettings, ...toTagTree.replaceTo[indexInBlock] };
                            falseIndexWhenNewSettings = disabledFalseIndex;
                        }
                        else { // #if: false
                            if (toTagTree.command === 'replace') {
                                if (indexInBlock in toTagTree.replaceTo) {
                                    for (const toTag of Object.values(toTagTree.replaceTo[indexInBlock])) {
                                        if (toTag.tag === 'toInSettings') {
                                            console.log('');
                                            console.log(`Error: ${getTestablePath(parser.filePath)}:${toTag.lineNum}: ` +
                                                `"#to:" tag cannot write in false condition block. Write "#to:" tags to be true condition.`);
                                            parser.errorCount += 1;
                                        }
                                    }
                                }
                            }
                            falseIndexWhenNewSettings = indexInBlock + '/';
                        }
                    }
                    outOfFalseBlocks.set(lineNumInBlock, falseIndexWhenNewSettings === disabledFalseIndex);
                }
                if (this.command === 'reset') {
                    var condition = settingsTree.settingsInformation[indexInBlock].condition;
                    if (condition === '') {
                        condition = 'true';
                    }
                    const outOfFalseBlockWhenNewSettings = !indexInBlock.startsWith(falseIndexWhenNewSettings);
                    if (outOfFalseBlockWhenNewSettings) {
                        // newSettingsByOriginalTag = ...
                        var settingsForIf = newSettingsByOriginalTag;
                        ifTagParserForNewSettings.evaluate(`#if: ${condition}`, settingsForIf);
                        if (ifTagParserForNewSettings.thisIsOutOfFalseBlock) {
                            newSettingsByOriginalTag = { ...newSettingsByOriginalTag, ...settingsTree.settings[indexInBlock] };
                            newSettingsByOriginalTag = { ...newSettingsByOriginalTag, ...toTagTree.replaceTo[indexInBlock] };
                            falseIndexWhenNewSettings = disabledFalseIndex;
                        }
                        else {
                            falseIndexWhenNewSettings = indexInBlock + '/';
                        }
                    }
                    const outOfFalseBlockWhenOldSettings = !indexInBlock.startsWith(falseIndexWhenOldSettings);
                    if (outOfFalseBlockWhenOldSettings) {
                        // falseIndexWhenOldSettings = ...
                        const oldSettings = settingsTree.currentSettings;
                        var settingsForIf = oldSettings;
                        ifTagParserForOldSettings.evaluate(`#if: ${condition}`, settingsForIf);
                        if (ifTagParserForOldSettings.thisIsOutOfFalseBlock) {
                            falseIndexWhenOldSettings = disabledFalseIndex;
                        }
                        else {
                            if (indexInBlock in toTagTree.replaceTo) {
                                for (const originalTag of Object.values(toTagTree.replaceTo[indexInBlock])) {
                                    console.log('');
                                    console.log(`Warning: ${getTestablePath(parser.filePath)}:${originalTag.lineNum}: ` +
                                        `"#original: ${originalTag.tag}" tag will be remained.`);
                                    parser.warningCount += 1;
                                }
                            }
                            falseIndexWhenOldSettings = indexInBlock + '/';
                        }
                    }
                    outOfFalseBlocksByOriginalTag.set(lineNumInBlock, falseIndexWhenOldSettings === disabledFalseIndex);
                }
            }
        }
        return_.currentNewSettings = newSettings;
        return_.currentNewSettingsByOriginalTag = newSettingsByOriginalTag;
        return_.outOfFalseBlocks = outOfFalseBlocks;
        return_.outOfFalseBlocksByOriginalTag = outOfFalseBlocksByOriginalTag;
        return return_;
    }
}
;
;
function searchDefinedSettingIndices(variableName, currentSettingIndex, settingTree, parser) {
    var index = currentSettingIndex;
    for (;;) {
        const foundIndices = searchDefinedSettingIndexInCurrentLevel(variableName, index, settingTree, parser);
        if (foundIndices.length >= 1) {
            return foundIndices;
        }
        if (index === '/') {
            throw new Error(`Error of not found "${variableName}" in settings "${currentSettingIndex}"`);
        }
        index = path.dirname(index);
    }
}
function searchDefinedSettingIndexInCurrentLevel(variableName, indexWithoutIf, settingTree, parser) {
    if (variableName in settingTree.settings[indexWithoutIf]) {
        return [indexWithoutIf]; // e.g. '/1'
    }
    else { // Search in #if: tag block
        const foundIndices = [];
        if (indexWithoutIf === '/') {
            var targetIndexSlash = '/';
        }
        else {
            var targetIndexSlash = indexWithoutIf + '/';
        }
        for (const index of Object.keys(settingTree.settings)) {
            if (index.startsWith(targetIndexSlash)) {
                if (lib.isAlphabetIndex(index.substring(0, targetIndexSlash.length + 1))) {
                    if (variableName in settingTree.settings[index]) {
                        foundIndices.push(index); // e.g. '/1/a'
                    }
                }
            }
        }
        return foundIndices;
    }
}
class Thesaurus {
    constructor() {
        this.synonym = new Map(); // the value is the normalized word
        this.formalLowerCase = new Set();
        this.idiomWords = [];
        this.errorMessage = '';
    }
    get enabled() { return this.synonym.size !== 0; }
    async load(csvFilePath) {
        const promise = new Promise((resolveFunction, _rejectFunction) => {
            fs.createReadStream(csvFilePath)
                .pipe(csvParse.parse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',', relax_column_count: true }))
                .on('data', (columns) => {
                this.formalLowerCase.add(columns[0].toLowerCase());
                if (columns.length >= 2) {
                    const normalizedKeyword = columns[0];
                    columns.shift();
                    const synonyms = columns;
                    synonyms.forEach((synonym) => {
                        this.synonym.set(synonym.toLowerCase(), normalizedKeyword);
                    });
                }
                else if (columns.length === 1) {
                    this.idiomWords.push(columns[0]);
                }
            })
                .on('end', () => {
                resolveFunction();
            });
        });
        return promise;
    }
    // normalize:  #search: typrm thesaurus relation
    normalize(keyphrase, relationUntilFormalKeywordsLowerCase) {
        const words = keyphrase.split(' ');
        const foreignKeywords = new Set();
        for (let i = 0; i < words.length; i += 1) {
            var wordLowerCase = words[i].toLowerCase();
            if (!relationUntilFormalKeywordsLowerCase) {
                if (this.formalLowerCase.has(wordLowerCase)) {
                    continue;
                }
            }
            else {
                if (relationUntilFormalKeywordsLowerCase.includes(wordLowerCase)) {
                    continue;
                }
            }
            foreignKeywords.clear();
            while (this.synonym.has(wordLowerCase)) {
                words[i] = this.synonym.get(wordLowerCase);
                if (!relationUntilFormalKeywordsLowerCase) {
                    break;
                }
                wordLowerCase = words[i].toLowerCase();
                if (relationUntilFormalKeywordsLowerCase.includes(wordLowerCase)) {
                    break;
                }
                if (foreignKeywords.has(wordLowerCase)) {
                    this.errorMessage = `ERROR: thesaurus has infinite loop: ${Array.from(foreignKeywords)}`;
                    break;
                }
                foreignKeywords.add(wordLowerCase);
            }
        }
        const normalizedKeyphrase = words.join(' ');
        return normalizedKeyphrase;
    }
    getWords() {
        const words = [];
        for (const [key, value] of this.synonym.entries()) {
            words.push(key);
            words.push(value);
        }
        for (const word of this.idiomWords) {
            words.push(word);
        }
        return words;
    }
}
// FoundLine
// Found the keyword and matched part in the line
class FoundLine {
    constructor() {
        this.path = '';
        this.lineNum = 0;
        this.line = '';
        this.indentLength = 0;
        this.snippet = [];
        this.snippetDepth = 0;
        this.snippetIndentLengths = [];
        this.searchKeywordCount = 0;
        // keywords in search tag is prior than all words as keywords.
        // e.g. a b #search; c d
        //      in search tag ... 2
        //      all words ... 5
        this.searchKeyphrase = '';
        this.targetKeyphrase = '';
        this.matches = [];
        this.matchedSearchKeywordCount = 0; // hit count to search keyword
        this.superMatchedTargetKeywordCount = 0; // e.g. "str"   // hit count to target keyword
        this.semiMatchedTargetKeywordCount = 0; // e.g. "str."
        this.participleMatchedTargetKeywordCount = 0; // e.g. "strs", "stred", "string"
        this.semiOrParticipleMatchedTargetKeywordCount = 0; // semi or participle
        this.caseIgnoredSuperMatchedTargetKeywordCount = 0; // e.g. "STR"
        this.caseIgnoredSemiMatchedTargetKeywordCount = 0; // e.g. "STR."
        this.caseIgnoredParticipleMatchedTargetKeywordCount = 0; // e.g. "STRs"
        this.caseIgnoredSemiOrParticipleMatchedTargetKeywordCount = 0; // semi or participle
        this.partMatchedTargetKeywordCount = 0; // e.g. "stripe", "STRIPE", "STRS"
        this.targetWordCount = 0; // hit and not hit
        this.normalizedTargetsKeywords = []; // '' = not matched in "normalized" target words
        this.rightOfTargetKeywords = [];
        this.tagLabel = ''; // keywordLabel, searchLabel, glossaryLabel, find all
        this.score = 0;
    }
    toString() {
        const length_limit = 200;
        // colorParts = sort matched (this.matches) positions and merge overrlapping parts.
        const sortedParts = this.matches.sort((a, b) => {
            var diff = a.targetWordsIndex - b.targetWordsIndex;
            if (diff === 0) {
                const prior = -1;
                diff = (a.targetType === '' ? prior : 0) - (b.targetType === '' ? prior : 0);
                if (diff === 0) {
                    diff = a.position - b.position;
                }
            }
            return diff;
        });
        const colorParts = [];
        var previousPart = new MatchedPart();
        previousPart.position = -1;
        previousPart.length = 0;
        for (const part of sortedParts) {
            if (part.position + part.length >= length_limit) {
                // no push
            }
            else if (part.targetType === 'normalized') {
                colorParts.push(part);
                // previous: <------>
                // current:          <------>
            }
            else if (part.position >= previousPart.position + previousPart.length) {
                colorParts.push(part);
                // previous: <------>
                // current:  <--------->
            }
            else if (part.position + part.length > previousPart.position + previousPart.length) {
                const previousColorPart = colorParts[colorParts.length - 1];
                previousColorPart.length = part.position + part.length - previousColorPart.position;
                // previous: <------> | <------>
                // current:  <---->   | <------>
            }
            else {
                // no push
            }
            previousPart = { ...part };
        }
        // coloredLine = ...
        var coloredLine = '';
        var line = this.line;
        const terminator = '\n';
        var previousPosition = 0;
        var previousPositionInNormalized = 0;
        var inNormalizedWords = false;
        var normalizedTargetKeywords = '';
        if (line.length > length_limit) {
            line = line.substring(0, length_limit) + terminator + line.substring(length_limit + 1);
        }
        for (const match of colorParts) { // match is one of this.matches: MatchedPart[]
            if (match.targetType === 'normalized' && !inNormalizedWords) {
                inNormalizedWords = true;
                coloredLine += line.substring(previousPosition, this.rightOfTargetKeywords[match.targetWordsIndex]) +
                    ' (';
                previousPosition = this.rightOfTargetKeywords[match.targetWordsIndex];
                previousPositionInNormalized = 0;
                normalizedTargetKeywords = this.normalizedTargetsKeywords[match.targetWordsIndex];
            }
            else if (match.targetType !== 'normalized' && inNormalizedWords) {
                inNormalizedWords = false;
                coloredLine +=
                    normalizedTargetKeywords.substring(previousPositionInNormalized) +
                        ')';
                normalizedTargetKeywords = '';
            }
            if (!inNormalizedWords) {
                coloredLine +=
                    line.substring(previousPosition, match.position) +
                        matchedColor(line.substr(match.position, match.length));
                previousPosition = match.position + match.length;
            }
            else { // inNormalizedWords
                coloredLine +=
                    normalizedTargetKeywords.substring(previousPositionInNormalized, match.position) +
                        matchedColor(normalizedTargetKeywords.substr(match.position, match.length));
                previousPositionInNormalized = match.position + match.length;
            }
        }
        if (inNormalizedWords) {
            coloredLine +=
                normalizedTargetKeywords.substring(previousPositionInNormalized) +
                    ')';
        }
        coloredLine += line.substring(previousPosition);
        const terminatorPosition = coloredLine.indexOf(terminator);
        if (terminatorPosition !== notFound) {
            coloredLine = coloredLine.substring(0, terminatorPosition);
        }
        // ...
        var thereIsKeywordLabel = false;
        var thereIsSearchLabel = false;
        var thereIsRefLabel = false;
        for (const match of colorParts) {
            if (tagIndexOf(match.matchedString, keywordLabel) !== notFound) {
                thereIsKeywordLabel = true;
            }
            if (tagIndexOf(match.matchedString, searchLabel) !== notFound) {
                thereIsSearchLabel = true;
            }
            if (tagIndexOf(match.matchedString, refLabel) !== notFound) {
                thereIsRefLabel = true;
            }
        }
        // ref tag
        if (!thereIsRefLabel) {
            const refColor = chalk.yellow;
            const refIndex = coloredLine.indexOf(refLabel);
            if (refIndex !== notFound) {
                const commentIndex = coloredLine.indexOf(' #', refIndex + refLabel.length);
                if (commentIndex === notFound) {
                    var refTagAndParameter = coloredLine.substring(refIndex).trim();
                }
                else {
                    var refTagAndParameter = coloredLine.substring(refIndex, commentIndex).trim();
                }
                coloredLine =
                    coloredLine.substring(0, refIndex) +
                        refColor(refTagAndParameter) +
                        coloredLine.substring(refIndex + refTagAndParameter.length);
            }
        }
        // search tag
        if (this.tagLabel !== searchLabel && !thereIsSearchLabel) {
            const searchColor = chalk.yellow;
            const searchIndex = coloredLine.indexOf(searchLabel);
            if (searchIndex !== notFound) {
                const spaceCount = indentRegularExpression.exec(coloredLine.substr(searchIndex + searchLabel.length))[0].length;
                const parameterIndex = searchIndex + searchLabel.length + spaceCount;
                const commentIndex = coloredLine.indexOf(' #', parameterIndex);
                if (commentIndex === notFound) {
                    var searchKeyword = coloredLine.substring(parameterIndex).trim();
                }
                else {
                    var searchKeyword = coloredLine.substring(parameterIndex, commentIndex).trim();
                }
                coloredLine =
                    coloredLine.substring(0, parameterIndex) +
                        searchColor(searchKeyword) +
                        coloredLine.substring(parameterIndex + searchKeyword.length);
            }
        }
        // keyword tag, glossary tag
        if (this.tagLabel === keywordLabel || this.tagLabel === glossaryLabel) {
            const keywordLabelColor = chalk.gray;
            const keywordLabelIndex = coloredLine.indexOf(keywordLabel);
            if (keywordLabelIndex !== notFound && !thereIsKeywordLabel &&
                (keywordLabelIndex === 0 || coloredLine[keywordLabelIndex - 1] === ' ')) {
                coloredLine =
                    coloredLine.substring(0, keywordLabelIndex) +
                        keywordLabelColor(keywordLabel) +
                        coloredLine.substring(keywordLabelIndex + keywordLabel.length);
            }
            if (this.tagLabel === glossaryLabel) {
                coloredLine = keywordLabelColor(glossaryLabel) + ' ' + coloredLine;
            }
        }
        // if (debugSearchScore) {
        //     var  debugString = ` (score: ${this.score}, ` +
        //         `searchKeywordCount: ${this.searchKeywordCount}, ` +
        //         `targetWordCount: ${this.targetWordCount}, ` +
        //         `tag: ${this.tagLabel}, ` +
        //         `matchedSearchCount: ${this.matchedSearchKeywordCount}, ` +
        //         `superMatchedTargetCount: ${this.superMatchedTargetKeywordCount}, ` +
        //         `semi: ${this.semiMatchedTargetKeywordCount}, ` +
        //         `participle: ${this.participleMatchedTargetKeywordCount}, ` +
        //         `caseIgnoredSuper: ${this.caseIgnoredSuperMatchedTargetKeywordCount}, ` +
        //         `caseIgnoredParticiple: ${this.caseIgnoredParticipleMatchedTargetKeywordCount}, ` +
        //         `part: ${this.partMatchedTargetKeywordCount})`;
        // } else {
        var debugString = ``;
        // }
        // colored string
        return `${pathColor(getTestablePath(this.path))}${lineNumColor(`:${this.lineNum}:`)} ${coloredLine}${debugString}`;
    }
    evaluateSnippetDepthTag(line) {
        const snippetDepthIndex = tagIndexOf(line, snippetDepthLabel);
        if (snippetDepthIndex !== notFound) {
            const currentIndent = indentRegularExpression.exec(line)[0];
            this.snippetDepth = parseInt(getValue(line, snippetDepthIndex + snippetDepthLabel.length));
            this.snippetIndentLengths.push(currentIndent.length);
        }
    }
    isSnippetOver(line) {
        if (line.trim() === '') {
            return false;
        }
        const currentIndent = indentRegularExpression.exec(line)[0];
        const currentIndentLength = currentIndent.length;
        if (this.snippetDepth <= 0) {
            const depth0IndentLength = this.indentLength;
            return currentIndentLength <= depth0IndentLength;
        }
        else {
            var previousIndentLength = this.snippetIndentLengths[this.snippetIndentLengths.length - 1];
            const previousLineIndentIsDeeperOrEqual = (this.snippetIndentLengths.length >= this.snippetDepth + 1);
            if (currentIndentLength > previousIndentLength) {
                this.snippetIndentLengths.push(currentIndentLength);
            }
            else {
                while (currentIndentLength < previousIndentLength && this.snippetIndentLengths.length >= 2) {
                    this.snippetIndentLengths.pop();
                    previousIndentLength = this.snippetIndentLengths[this.snippetIndentLengths.length - 1];
                }
            }
            const currentLineIndentIsDeeperOrEqual = (this.snippetIndentLengths.length >= this.snippetDepth + 1);
            return previousLineIndentIsDeeperOrEqual && !currentLineIndentIsDeeperOrEqual;
        }
    }
}
class MatchedPart {
    constructor() {
        this.position = 0; // in line or in normalizedTargetKeywords (SearchTargetType=='normalized')
        this.length = 0;
        this.targetWordsIndex = -1;
        this.matchedString = '';
        this.targetType = '';
    }
}
class SearchKeyword {
    constructor() {
        this.keyword = '';
        this.startLineNum = 0;
        this.direction = Direction.Following;
    }
}
function splitFilePathAndKeyword(address, getter) {
    const verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
        console.log(`    Verbose: address in ref tag: ${address}`);
        console.log(`    Verbose: type: ${getter.type}`);
        console.log(`    Verbose: regularExpression: ${getter.regularExpression}`);
        console.log(`    Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
        console.log(`    Verbose: keywordRegularExpressionIndex: ${getter.keywordRegularExpressionIndex}`);
        console.log(`    Verbose: csvOptionRegularExpressionIndex: ${getter.csvOptionRegularExpressionIndex}`);
        console.log(`    Verbose: targetMatchIdRegularExpressionIndex: ${getter.targetMatchIdRegularExpressionIndex}`);
        console.log(`    Verbose: address: ${getter.address}`);
    }
    const parameters = (new RegExp(getter.regularExpression)).exec(address);
    if (!parameters) {
        throw new Error(`ERROR: regularExpression (${getter.regularExpression}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is not matched.` +
            `testing string is "${address}".`);
    }
    if (verboseMode) {
        console.log(`    Verbose: matched: [${parameters.join(', ')}]`);
    }
    if (getter.filePathRegularExpressionIndex > parameters.length - 1) {
        throw new Error(`ERROR: filePathRegularExpressionIndex (${getter.filePathRegularExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.keywordRegularExpressionIndex > parameters.length - 1) {
        throw new Error(`ERROR: keywordRegularExpressionIndex (${getter.keywordRegularExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    var csvOption = false;
    if (parameters.length >= getter.csvOptionRegularExpressionIndex) {
        if (parameters[getter.csvOptionRegularExpressionIndex]) {
            csvOption = true;
        }
    }
    return {
        filePath: parameters[getter.filePathRegularExpressionIndex],
        keyword: parameters[getter.keywordRegularExpressionIndex],
        csvOption,
    };
}
function getFilePathFromKeepGetter(address, getter) {
    const verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
        console.log(`    Verbose: address in ref tag: ${address}`);
        console.log(`    Verbose: type: ${getter.type}`);
        console.log(`    Verbose: regularExpression: ${getter.regularExpression}`);
    }
    const parameters = (new RegExp(getter.regularExpression)).exec(address);
    if (!parameters) {
        throw new Error(`ERROR: regularExpression (${getter.regularExpression}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is not matched.` +
            `testing string is "${address}".`);
    }
    if (verboseMode) {
        console.log(`    Verbose: matched: [${parameters.join(', ')}]`);
    }
    if (getter.filePathRegularExpressionIndex > parameters.length - 1) {
        throw new Error(`ERROR: filePathRegularExpressionIndex (${getter.filePathRegularExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    return parameters[getter.filePathRegularExpressionIndex];
}
async function searchAsText(getter, address) {
    const { filePath, keyword, csvOption } = splitFilePathAndKeyword(address, getter);
    if (!fs.existsSync(filePath)) {
        return { filePath, lineNum: notFound };
    }
    if (fs.lstatSync(filePath).isDirectory()) {
        return { filePath, lineNum: notSearchedInFile };
    }
    if (keyword) {
        var lineNum = await lib.searchAsTextSub({ input: fs.createReadStream(filePath) }, keyword, csvOption);
    }
    else {
        var lineNum = notSearchedInFile;
    }
    return { filePath, lineNum };
}
function parseFigureParameters(address, getter) {
    const verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
        console.log(`    Verbose: address: ${address}`);
        console.log(`    Verbose: regularExpression: ${getter.regularExpression}`);
        console.log(`    Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
        console.log(`    Verbose: xExpressionIndex: ${getter.xExpressionIndex}`);
        console.log(`    Verbose: yExpressionIndex: ${getter.yExpressionIndex}`);
        console.log(`    Verbose: nameExpressionIndex: ${getter.nameExpressionIndex}`);
        console.log(`    Verbose: pointerImage: ${getter.pointerImage}`);
        console.log(`    Verbose: outputFolder: ${getter.outputFolder}`);
    }
    const parameters = (new RegExp(getter.regularExpression)).exec(address);
    if (!parameters) {
        throw new Error(`ERROR: regularExpression (${getter.regularExpression}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is not matched.` +
            `testing string is "${address}".`);
    }
    if (verboseMode) {
        console.log(`    Verbose: matched: [${parameters.join(', ')}]`);
    }
    if (getter.filePathRegularExpressionIndex > parameters.length - 1) {
        throw new Error(`ERROR: filePathRegularExpressionIndex (${getter.filePathRegularExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.xExpressionIndex > parameters.length - 1) {
        throw new Error(`ERROR: xExpressionIndex (${getter.xExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.yExpressionIndex > parameters.length - 1) {
        throw new Error(`ERROR: yExpressionIndex (${getter.yExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.nameExpressionIndex > parameters.length - 1) {
        throw new Error(`ERROR: nameExpressionIndex (${getter.nameExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    return {
        filePath: parameters[getter.filePathRegularExpressionIndex],
        name: getter.nameExpressionIndex ? parameters[getter.nameExpressionIndex] : '',
        x: parseInt(parameters[getter.xExpressionIndex]),
        y: parseInt(parameters[getter.yExpressionIndex]),
    };
}
async function getPointedFigurePath(getter, address) {
    const { filePath, name, x, y } = parseFigureParameters(address, getter);
    const fileExists = fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
    if (!fileExists) {
        console.log(`ERROR: not found a file or folder at "${getTestablePath(lib.getFullPath(filePath, process.cwd()))}"`);
        return '(NotFound)';
    }
    const inputImage = path.parse(filePath);
    const outputImagePath = (name) ?
        `${getter.outputFolder}/${inputImage.name}_${name}_${x}_${y}${inputImage.ext}` :
        `${getter.outputFolder}/${inputImage.name}_${x}_${y}${inputImage.ext}`;
    fs.mkdirSync(getter.outputFolder, { recursive: true });
    try {
        const figureChain = sharp(filePath);
        const figure = await figureChain.metadata();
        const pointerChain = sharp(getter.pointerImage).resize(Math.floor(figure.width * 15 / 100), Math.floor(figure.height * 15 / 100), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
        const pointer = await pointerChain.toBuffer({ resolveWithObject: true });
        await figureChain
            .composite([{
                input: pointer.data,
                left: x - Math.floor(pointer.info.width / 2),
                top: y - Math.floor(pointer.info.height / 2),
            }])
            .toFile(outputImagePath);
    }
    catch (e) {
        console.log(e);
        return '';
    }
    return outputImagePath;
}
var VerbVariable;
(function (VerbVariable) {
    VerbVariable.ref = '${ref}';
    VerbVariable.windowsRef = '${windowsRef}';
    VerbVariable.file = '${file}';
    VerbVariable.windowsFile = '${windowsFile}';
    VerbVariable.existingAddress = '${existingAddress}';
    VerbVariable.windowsExistingAddress = '${windowsExistingAddress}';
    VerbVariable.fragment = '${fragment}';
    VerbVariable.lineNum = '${lineNum}';
})(VerbVariable || (VerbVariable = {}));
const verbVar = VerbVariable;
class FilePathLineNum {
    constructor() {
        this.filePath = '';
        this.lineNum = 0;
    }
}
class KeyValue {
    constructor() {
        this.key = '';
        this.value = '';
    }
}
function key(keyValue) {
    return keyValue[0];
}
function value(keyValue) {
    return keyValue[1];
}
var Direction;
(function (Direction) {
    Direction[Direction["Above"] = -1] = "Above";
    Direction[Direction["Following"] = 1] = "Following";
})(Direction || (Direction = {}));
class Parser {
    constructor() {
        this.command = CommandEnum.unknown;
        this.errorCount = 0;
        this.warningCount = 0;
        this.toTagError = false;
        this.templateCount = 0;
        this.verbose = false;
        this.filePath = '';
        this.lineNum = 0;
        this.line = '';
        this.ifTagErrorMessageIsEnabled = true;
        this.outputToTagList = false;
        this.toTagList = [];
        this.totalToTagCount = 0;
        this.originalTagList = [];
        this.flushedOriginalTagListCount = 0;
    }
    flushToTagList() {
        this.outputToTagList = true;
        if (this.originalTagList.length >= 1) {
            console.log('');
            for (const log of this.originalTagList) {
                if (this.flushedOriginalTagListCount < maxShownOriginalTagListCount) {
                    console.log(log);
                }
                this.flushedOriginalTagListCount += 1;
                if (this.flushedOriginalTagListCount === maxShownOriginalTagListCount) {
                    console.log(`...(${translate('Display of further original tags will be omitted')})`);
                }
            }
            this.originalTagList = [];
        }
        if (this.toTagList.length >= 1) {
            console.log('');
            for (const log of this.toTagList) {
                console.log(log);
            }
            this.toTagList = [];
        }
    }
}
class WriteBuffer {
    constructor(stream) {
        this.stream = stream;
        this.lineBuffer = [];
    }
    cutLastLF() {
        const lastLine = this.lineBuffer[this.lineBuffer.length - 1];
        if (lastLine.slice(-1) === '\n') {
            this.lineBuffer[this.lineBuffer.length - 1] = lastLine.substring(0, lastLine.length - 1);
        }
    }
    end() {
        for (const line of this.lineBuffer) {
            this.stream.write(line);
        }
        this.stream.end();
    }
    getAllLines() {
        return this.lineBuffer.join('');
    }
    on(event, callback) {
        this.stream.on(event, callback);
    }
    write(line) {
        this.lineBuffer.push(line);
    }
    replaceAboveLine(relativeLineNum, replacedLine) {
        const targetLineNum = this.lineBuffer.length + relativeLineNum;
        this.lineBuffer[targetLineNum] = replacedLine;
    }
    getWrittenLine(lineNum) {
        if (lineNum > this.lineBuffer.length) {
            throw new Error('The line is not written yet.');
        }
        return this.lineBuffer[lineNum];
    }
}
function cutLastLF(message) {
    if (message.slice(-1) === '\n') {
        message = message.substring(0, message.length - 1);
    }
    if (message.slice(-1) === '\r') {
        message = message.substring(0, message.length - 1);
    }
    return message;
}
// getStdOut
// Example:
//    var d = getStdOut();  // Set break point here and watch the variable d
function getStdOut() {
    return stdout.split('\n');
}
// println
// #keyword: println, console.log, consoleLog
// Output any text to standard output or buffer.
// delayedExpanding: The debugger or the browswr watch view expands objects
function println(message, delayedExpanding = false) {
    if (delayedExpanding) {
        consoleLog(message);
    }
    else {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        stdout += message.toString() + '\n';
        lib.pp(message.toString());
    }
}
const consoleLog = console.log;
// writeToStdout
// #keyword: writeToStdout
// Output any text to standard output or buffer.
function writeToStdout(message, a2, a3) {
    stdout += message.toString();
    lib.pp(message.toString());
    return true;
}
const processStdoutWrite = process.stdout.write;
export function startTestRedirect() {
    if (withJest || programOptions.stdoutBuffer) {
        console.log = println;
        process.stdout.write = writeToStdout;
        lib.setInputEchoBack(true);
    }
}
export function endTestRedirect() {
    if (withJest || programOptions.stdoutBuffer) {
        console.log = consoleLog;
        process.stdout.write = processStdoutWrite;
        lib.setInputEchoBack(false);
    }
}
function lastOf(array) {
    return array[array.length - 1];
}
// translate
// e.g. translate('english')
// e.g. translate`price = ${price}`  // ... taggedTemplate
function translate(englishLiterals, ...values) {
    var dictionary = undefined;
    const taggedTemplate = (typeof (englishLiterals) !== 'string');
    var english = englishLiterals;
    if (taggedTemplate) {
        english = '';
        for (let i = 0; i < englishLiterals.length; i += 1) {
            english += englishLiterals[i];
            if (i < values.length) {
                english += '${' + String(i) + '}';
            }
            // e.g. english = 'price = ${0}'
        }
    }
    if (locale === 'ja-JP') {
        dictionary = {
            "Error not same as file contents": "ファイルの内容と異なります",
            "YAML UTF-8 file path>": "YAML UTF-8 ファイル パス>",
            "Replace \"${0}\" to \"${1}\".": "\"${0}\" を \"${1}\" に置き換えてください。",
            "Press Enter key to retry checking.": "Enter キーを押すと再チェックします。",
            "The line number to replace the variable value >": "置き換える変数値がある行番号 >",
            "Enter only: finish to input setting": "Enter のみ：設定の入力を終わる",
            "The number of variable declarations has decreased": "変数宣言の数が減りました",
            "Defined variables are increased": "定義された変数が増えました",
            "Defined variables are decreased": "定義された変数が減りました",
            "Add variable declarations": "変数宣言を追加してください",
            "Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.": "複数の設定があるので、設定を特定できません。行番号のパラメーターを追加してください。",
            "Not found specified variable name.": "指定した変数名が見つかりません。",
            "Error of not found the file:": "エラー：ファイルが見つかりません",
            "Error of not found the file or folder at \"${verbNum}\"": "エラー：ファイルまたはフォルダーが見つかりません \"${0}\"",
            "Error of duplicated variable name:": "エラー：変数名が重複しています",
            "Error of not expected condition:": "エラー：予期しない条件です",
            "Error of expect tag syntax:": "エラー：expect タグの文法エラー",
            "Error of unexpected: The count of evalatedKeyValues is not increasing.": "予期しないエラー：evalatedKeyValues の数が増えていません。",
            "isReplacable may be not changed. Try typrm check command.": "isReplacable が変更されていません。 typrm check コマンドを試してください。",
            "${0}a quote is found inside a field${1}": "${0}フィールド内に引用符があります${1}",
            "Not found. To do full text search, press Enter key.": "見つかりません。全文検索するときは Enter キーを押してください。",
            "template target values after replace are conflicted.": "変数の値を置き換えた後のテンプレートのターゲットが矛盾しています",
            "You should add #to: tags at setting variables in other templates.": "他のテンプレートから参照されている設定の変数に #to: タグを追加してください",
            "To show more result, restart typrm with --found-count-max option": "もっと多くの結果を表示するときは --found-count-max オプションを指定して typrm を再起動します",
            "To run shell command, TYPRM_COMMAND_FOLDER environment variable or --command-folder option must be set.": "シェルのコマンドを実行するには、TYPRM_COMMAND_FOLDER 環境変数、または --command-folder オプションを設定してください。",
            'Envrironment variables defined in ".env" file are not inherit to child processes.': ".env ファイルに定義した環境変数は子プロセスに継承されません。",
            "Not same as #copy tag contents": "#copy タグの内容に違いがあります",
            "(out of copy tag block)": "（copy タグのブロックの外）",
            "Not found a variable name specified in the same-as tag.": "same-as タグに指定した変数名が見つかりません",
            "ref tag value \"${0}\" must be full path. Then you can specify the path with a variable.": "ref タグの値 \"${0}\" をフルパスに修正してください。その際、変数を指定できます。",
            "ERROR: not found a file or folder at": "エラー: ファイルまたはフォルダーが見つかりません",
            "Display of further original tags will be omitted": "これ以上の original タグの表示は割愛します",
            "The parameter count in #to tag:": "#to タグのパラメーターの数",
            "Variable count in the template tag:": "#template タグの中の変数の数:",
            "Value count in the to tag:": "#to タグの中の値の数:",
            "key: new_value>": "変数名: 新しい変数値>",
            "template count": "テンプレートの数",
            "in previous check": "前回のチェック",
            "Warning": "警告",
            "Error": "エラー",
            "ErrorLine": "エラー行",
            "Solution": "解決法",
            "Contents": "内容",
            "Expected": "期待",
            "Template": "雛形",
            "Before Editing": "編集前",
            "After  Editing": "編集後",
            "WarningLine": "警告行",
            "Found": "見つかったもの",
            "Setting": "設定",
            "Settings": "設定",
            "SettingIndex": "設定番号",
            "Not matched with the template.": "テンプレートと一致しません。",
            "Not found any replacing target.": "置き換える対象が見つかりません。",
            "Modify the template target to old or new value.": "テンプレートの対象を古い値または新しい値に修正してください。",
            "The parameter must be less than 0": "パラメーターは 0 より小さくしてください",
            "Not found \"${0}\" above": "上方向に「${0}」が見つかりません",
            "Not found \"${0}\" following": "下方向に「${0}」が見つかりません",
            "Not referenced:": "参照されていません：",
            "Error that verb number ${0} is not defined": "エラー：動詞番号 ${0} は定義されていません"
        };
    }
    var translated = english;
    if (dictionary) {
        if (english in dictionary) { // Full words match
            translated = dictionary[english];
        }
    }
    if (taggedTemplate) {
        for (let i = 0; i < englishLiterals.length; i += 1) {
            translated = translated.replace('${' + String(i) + '}', String(values[i]).replace(/\$/g, '$$'));
        }
        translated = translated.replace('$\\{', '${');
        // Replace the escape of ${n}
        // e.g. "$\\{price} = ${price}" => "${price} = 100"
    }
    return translated;
}
// callMainFromJest
// The process runs in global scope by each starting tests.
// This function is called by each tests.
export async function callMainFromJest(parameters, options) {
    withJest = true;
    stdout = '';
    if (parameters) {
        programArguments = parameters;
    }
    else {
        programArguments = [];
    }
    if (options) {
        programOptions = options;
    }
    else {
        programOptions = {};
    }
    if (!('foundCountMax' in programOptions)) {
        programOptions.foundCountMax = foundCountMaxDefault;
    }
    if (!('snippetLineCount' in programOptions)) {
        programOptions.snippetLineCount = snippetLineCountDefault;
    }
    if (!('wordSuperSeparators' in programOptions)) {
        programOptions.wordSuperSeparators = wordSuperSeparatorsDefault;
    }
    if (!('wordSeparators' in programOptions)) {
        programOptions.wordSeparators = wordSeparatorsDefault;
    }
    programOptionsWordSeparators = programOptions.wordSuperSeparators + programOptions.wordSeparators;
    try {
        startTestRedirect();
        await mainMain();
    }
    finally {
        endTestRedirect();
        // var    d = pp('');
        // const  s = getStdOut();
        // d = [];  // Set break point here and watch the variable d
    }
}
// private_
// For the unit test
export const private_ = {
    Parser,
    makeSettingTree,
    makeReplaceToTagTree,
};
if (process.env.windir) {
    var runningOS = 'Windows';
}
else {
    var runningOS = 'Linux';
}
// Tags
const settingLabel = /(^| )#settings:/;
const settingsDot = '$settings.';
const settingsDotRe = /{\$settings\.(.*?)}/g;
const originalLabel = "#original:";
const toLabel = "#to:"; // replace to tag
const checkTag = "#check:";
const replaceTag = "#replace:";
const resetTag = "#reset:";
const templateLabel = "#template:";
const templateAtStartLabel = "#template-at(";
const templateTagAndParameterRegExp = /( |^)+#template:[^#]*/;
const templateAtEndLabel = "):";
const templateIfLabel = "#template-if:";
const templateIfYesKey = "template-if(yes)";
const templateIfNoKey = "template-if(no)";
const fileTemplateLabel = "#file-template:";
const fileTemplateAnyLinesLabel = "#file-template-any-lines:";
const enableFileTemplateIfExistLabel = "#enable-file-template-if-exist:";
const keywordLabel = "#keyword:";
const keywordTagAndParameterRegExp = /( |^)#keyword:[^#]*/g;
const glossaryLabel = "#glossary:";
const mutualTag = "#mutual:";
const snippetDepthLabel = "#snippet-depth:";
const disableLabel = "#disable-tag-tool:";
const searchIfLabel = "#(search)if: false";
const scoreLabel = "#score:";
const ifLabel = "#if:";
const ifLabelRE = /(?<= |^)#if:/;
const expectLabel = "#expect:";
const searchLabel = "#search:";
const refLabel = "#ref:";
const copyDot = '$copy.';
const copyLabel = "#copy:";
const copyTemplateLabel = "#copy-template:";
const typrmEnvPrefix = 'TYPRM_';
const indentRegularExpression = /^( |¥t)*/;
const numberRegularExpression = /^[0-9]+$/;
const zenkakuAlphabetExpression = /[ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ！”＃＄％＆’（）＝＾〜＼｜＠｀「『；＋：＊」』、＜。＞・？＿]/;
const variablePattern = "\\$\\{[^\\}]+\\}"; // ${__Name__}
// Scores
const fullMatchScore = 10000;
const particpleFullMatchScore = 1000;
const caseIgnoredParticpleFullMatchScore = 500;
const keywordMatchScore = 7;
const wordsSuperMatchScore = 32;
const caseIgnoredWordSuperMatchScore = 30;
const wordsSemiMatchScore = 28;
const particpleWordMatchScore = 26;
const caseIgnoredFullMatchScore = 24;
const caseIgnoredWordsSemiMatchScore = 22;
const caseIgnoredParticpleWordMatchScore = 18;
const partMatchScore = 16;
const caseIgnoredPartMatchScore = 14;
const lineFullMatchScore = 1000;
const suffledLineFullMatchScore = 50;
const orderMatchScore = 2;
const notNormalizedScore = 1;
const glossaryMatchScore = 5;
// Others
const maxNumber = 999999999;
const pathColor = chalk.cyan;
const lineNumColor = chalk.keyword('gray');
const matchedColor = chalk.green.bold;
const notSearchedInFile = 0;
const notFoundInFile = -2;
const notFound = -1;
const jpsp = String.fromCodePoint(0x3000); // Japanese space
const foundCountSystemMax = 1000;
var inputFileParentPath = '';
var locale = '';
var withJest = false;
// Default Parameters
export const foundCountMaxDefault = "10";
export const snippetLineCountDefault = "5";
export const wordSuperSeparatorsDefault = " " + jpsp;
export const wordSeparatorsDefault = "~!^&*#()=+-[{]}\\|;:'\"`,.<>/?、。（）「」【】";
const maxShownOriginalTagListCount = 5;
// Parameters
export var stdout = '';
export var programArguments = [];
export var programOptions = {};
export var programOptionsWordSeparators = wordSuperSeparatorsDefault + wordSeparatorsDefault;
//# sourceMappingURL=main.js.map