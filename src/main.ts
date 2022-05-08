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
import { pp } from "./lib";

// main
export async function  main() {
    startTestRedirect();
    try {
        await  mainMain();
    }
    finally {
        endTestRedirect();
        if (programOptions.stdoutBuffer) {
            process.stdout.write(stdout);
        }

        // debug
        if (true) {
            var d = pp('');
            d=d;
            // If exception was raised, this code does not execute.
            // Set a break point at the catch block of calling "main.main"
        }
    }
}

// mainMain
export async function  mainMain() {

    lib.loadDotEnvSecrets(programOptions.inheritDotenv);
    locale = Intl.NumberFormat().resolvedOptions().locale;
    if ('locale' in programOptions) {
        locale = programOptions.locale;
    }
    const  verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        printConfig();
    }
    if ('input' in programOptions) {
        lib.setInputOption(new lib.InputOption( programOptions.input.split('\n') ));
    }

    if (programArguments.length === 0) {

        await  search();
    } else if (programArguments.length >= 1 ) {

        if (programArguments[0] === 's'  ||  programArguments[0] === 'search') {
            if (verboseMode) {
                console.log('Verbose: typrm command: search');
            }
            await  search();
        }
        else if (programArguments[0] === 'm'  ||  programArguments[0] === 'mutual-search') {
            varidateMutualSearchCommandArguments();
            if (verboseMode) {
                console.log('Verbose: typrm command: mutual-search');
            }
            await  mutualSearch();
        }
        else if (programArguments[0] === 'c'  ||  programArguments[0] === 'check') {
            if (verboseMode) {
                console.log('Verbose: typrm command: check');
            }
            var  checkingFilePath: string | undefined;
            if (programArguments.length >= 2) {
                checkingFilePath = programArguments[1];
            }

            await  check(checkingFilePath);
        }
        else if (programArguments[0] === 'r'  ||  programArguments[0] === 'replace') {
            if (verboseMode) {
                console.log('Verbose: typrm command: replace');
            }
            if (programArguments.length === 1) {
                var  inputFilePath = '';
            } else {
                var  inputFilePath = programArguments[1];
            }

            await  replace(inputFilePath);
        }
        else if (programArguments[0] === 'reset') {
            if (programArguments.length === 1) {
                var  inputFilePath = '';
            } else {
                var  inputFilePath = programArguments[1];
            }

            await  reset(inputFilePath);
        }
        else {
            await  search();
        }
    }
}

// checkRoutine
async function  checkRoutine(inputFilePath: string, copyTags: CopyTag.Properties[], parser: Parser) {
    const  parentPath = path.dirname(inputFilePath);
    inputFileParentPath = parentPath;
    parser.command = CommandEnum.check;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = inputFilePath;

    const  settingTree = await makeSettingTree(parser);

    // List up original tag
    const  originalTagTree = await makeOriginalTagTree(parser, settingTree);
    for (const index of Object.keys(originalTagTree.replaceTo)) {
        for (const [name, replace] of Object.entries(originalTagTree.replaceTo[index])) {
            const  log = `${getTestablePath(inputFilePath)}:${replace.lineNum}: ` +
                `#original: ${name}: ${settingTree.settings[index][name].value} => ${replace.value}`;
            parser.originalTagList.push(log);
        }
    }

    // List up to tag
    const  toTagTree = await makeReplaceToTagTree(parser, settingTree);
    for (const index of Object.keys(toTagTree.replaceTo)) {
        for (const [name, replace] of Object.entries(toTagTree.replaceTo[index])) {
            const  log = `${getTestablePath(inputFilePath)}:${replace.lineNum}: ` +
                `#to: ${name}: ${settingTree.settings[index][name].value} => ${replace.value}`;
            parser.toTagList.push(log);
        }
    }
    if (parser.outputToTagList) {
        parser.flushToTagList();
    }

    // Check template
    if (parser.verbose) {
        console.log(`Verbose: Phase 3: check ...`);
    }
    var  reader = readline.createInterface({
        input: fs.createReadStream(inputFilePath),
        crlfDelay: Infinity
    });
    parser.lineNum = 0;
    parser.line = '';
    const  verbose = parser.verbose;
    var  setting: Settings = {};
    var  lineNum = 0;
    var  fileTemplateTags: TemplateTag[] = [];
    var  previousLineIncludesFileTemplate = false;
    const  copyTagParser = new CopyTag.CheckParser()
    const  lines: string[] = [];
    const  ifTagParser = new IfTagParser(parser);
    const  enableFileTemplateParser = new EnableFileTemplateParser(parser);
    for await (const line1 of reader) {
        const  line: string = line1;
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
                const  lineNumInSetting = setting[variableName].lineNum;
                if (variable.sameAs  &&  ! variable.sameAsWasChecked) {
                    variable.sameAsWasChecked = true;
                    var  expectedVariableName = variable.sameAs;
                    var  errorInSameAsTag = false;

                    const  r = SameAsTag.evaluateVariableName(expectedVariableName, setting);
                    expectedVariableName = r.variableName;
                    var  variableNames = r.referencedVariableNames;
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
                    } else {
                        if ( ! errorInSameAsTag) {
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
        if (line.includes(expectLabel)  &&  ifTagParser.thisIsOutOfFalseBlock) {
            const  condition = line.substring(line.indexOf(expectLabel) + expectLabel.length).trim();

            const  evaluatedContidion = evaluateIfCondition(condition, setting, parser);
            if (typeof evaluatedContidion === 'boolean') {
                if ( ! evaluatedContidion) {
                    parser.flushToTagList();
                    console.log('');
                    console.log(translate('Error of not expected condition:'));
                    console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                    console.log(`  Contents: ${condition}`);
                    parser.errorCount += 1;
                }
            } else {
                parser.flushToTagList();
                console.log('');
                console.log('Error of expect tag syntax:');
                console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                console.log(`  Contents: ${condition}`);
                parser.errorCount += 1;
            }
        }

        // Check if previous line has "template" replaced contents.
        const  templateTag = parseTemplateTag(line, parser);
        if (templateTag.lineNumOffset >= 1  &&  templateTag.isFound) {
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
            const  checkingLine = lines[lineNum - 1 + templateTag.lineNumOffset];
            const  commonCase = (templateTag.label !== templateIfLabel);
            const  settingForTemplate = (copyTagParser.parsingCopyTag) ? copyTagParser.settingAndCopyTagParameters : setting;
            if (commonCase) {
                var  expected = getExpectedLine(settingForTemplate, templateTag.template);
            } else { // if (templateTag.label === templateIfLabel)
                templateTag.evaluate(settingForTemplate);
                var  expected = getExpectedLine(settingForTemplate, templateTag.newTemplate, {relatedReferenced: true});
            }
            if (templateTag.lineNumOffset === 0) {
                var  checkingLineWithoutTemplate = checkingLine.substring(0, templateTag.indexInLine);
            } else {
                var  checkingLineWithoutTemplate = checkingLine;
            }

            if ( ! checkingLineWithoutTemplate.includes(expected)  &&  ifTagParser.thisIsOutOfFalseBlock) {
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
            if (templateTag.label === fileTemplateLabel  &&  ifTagParser.thisIsOutOfFalseBlock  &&
                    previousLineIncludesFileTemplate) {
                fileTemplateTag.indentAtTag = templateTag.indentAtTag;
            } else {
                const continue_ = fileTemplateTag.onReadLine(line);
                if (!continue_) {

                    await fileTemplateTag.checkTargetFileContents(setting, parser);
                    fileTemplateTags = fileTemplateTags.filter(object => (object !== fileTemplateTag));
                }
            }
        }
        if (templateTag.label === fileTemplateLabel  &&  ifTagParser.thisIsOutOfFalseBlock  &&
                enableFileTemplateParser.isEnabled) {
            fileTemplateTags.push(templateTag);
            previousLineIncludesFileTemplate = true;
        } else {
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

// getErrorMessageOfNotMatchedWithTemplate
function  getErrorMessageOfNotMatchedWithTemplate(
        templateTag: TemplateTag, settingTree: SettingsTree, lines: string[]): string {
    var  errorMessage = '';
    const  variableNames = templateTag.scanKeys(Object.keys(settingTree.currentSettings));
    const  parser = templateTag.parser;

    errorMessage += getVariablesForErrorMessage('', variableNames, settingTree, lines, parser.filePath) +'\n';

    const  targetLineNum = parser.lineNum + templateTag.lineNumOffset;
    errorMessage += `${getTestablePath(parser.filePath)}:${targetLineNum}: ${lines[targetLineNum - 1]}\n`;  // target line
    if (templateTag.lineNumOffset !== 0) {
        errorMessage += `${getTestablePath(parser.filePath)}:${parser.lineNum}: ${lines[parser.lineNum - 1]}\n`;  // template
    }
    return  lib.cutLast( errorMessage, '\n');
}

// getVariablesForErrorMessage
function  getVariablesForErrorMessage(indent: string, variableNames: string[], settingTree: SettingsTree, lines: string[], inputFilePath: string): string {
    var  errorMessage = '';
    var  settingIndices: string[] = [];
    for (let settingIndex = settingTree.currentSettingIndex;  settingIndex !== '/';  settingIndex = path.dirname(settingIndex)) {
        settingIndices.push(settingIndex);
    }
    settingIndices.push('/');
    settingIndices = settingIndices.reverse();

    for (const parentSettingIndex of settingIndices) {
        if (parentSettingIndex in settingTree.settingsInformation) {
            const  settings = settingTree.settingsInformation[parentSettingIndex];
            if (settings.lineNum !== 0) {
                const  variableMessages: {lineNum: number, message: string}[] = [];
                for (const variableName of variableNames) {
                    const  variable = settingTree.currentSettings[variableName];
                    if (lib.cutAlphabetInIndex(variable.settingsIndex) === parentSettingIndex) {
                        variableMessages.push({
                            lineNum: variable.lineNum,
                            message: `${getTestablePath(inputFilePath)}:${variable.lineNum}: ${lines[variable.lineNum - 1]}\n`,
                        });
                    }
                }
                variableMessages.sort((a,b)=>( a.lineNum - b.lineNum ));

                errorMessage += indent + `${getTestablePath(inputFilePath)}:${settings.lineNum}: ${lines[settings.lineNum - 1]}\n`;  // settings
                for (const variableMessage of variableMessages) {
                    errorMessage += indent + variableMessage.message;  // variable
                }
            }
        }
    }
    return  lib.cutLast( errorMessage, '\n');
}

// makeSettingTree
async function  makeSettingTree(parser: Parser): Promise<SettingsTree> {
    const  tree = new SettingsTree();
    const  indentStack: {lineNum: number, indent: string}[] = [
        {lineNum: 1, indent: ''}
    ];
    const  settingStack:  // #search: settingStack of typrm makeSettingTree
            {lineNum: number, index: string, nextNumberIndex: number, nextAlphabetIndex: string, indent: string, startLineNum: number, startIndentLevel: number}[] = [
        {lineNum: 0, index: '/',  nextNumberIndex: 0, nextAlphabetIndex: 'a', indent: '', startLineNum: 1, startIndentLevel: -1},
        {lineNum: 0, index: '/1', nextNumberIndex: 1, nextAlphabetIndex: 'a', indent: '', startLineNum: 0, startIndentLevel: 0}
        // "parentIndentLevel" is a parent indent of a settings tag. It is not a indent of a settings tag.
    ];
    var  reader = readline.createInterface({
        input: fs.createReadStream(parser.filePath),
        crlfDelay: Infinity
    });
    var  isReadingSetting = false;
    var  setting: Settings = {};
    var  currentSettingIndex = '/';
    var  lineNum = 0;
    var  settingIndentLength = 0;
    tree.indices.set(1, '/');
    tree.indicesWithIf.set(1, '/');
    tree.settings = {};
    if (parser.verbose) {
        console.log(`Verbose: Phase 1: parse settings ...  ${getTestablePath(parser.filePath)}`);
    }

    for await (const line1 of reader) {
        const  line: string = line1;
        lineNum += 1;
        parser.line = line;
        parser.lineNum = lineNum;

        // indentStack = ...
        const  indent = indentRegularExpression.exec(line)![0];
        if (line !== '') {

            // Pop "indentStack"
            while ( ! indent.startsWith(indentStack[indentStack.length - 1].indent)) {
                indentStack.pop();
            }

            // ...
            const  currentIndentStackIndex = indentStack.length - 1;
            var    currentSettingStackIndex = settingStack.length - 2;
            const  previousIndent = indentStack[currentIndentStackIndex];
            const  inIfBlock = lib.isAlphabetIndex(currentSettingIndex);

            // Pop "settingStack" in #if: block
            if (inIfBlock) {

                while (indent.length <= settingStack[currentSettingStackIndex].indent.length) {
                    const  parentSettingStackIndex = currentSettingStackIndex - 1;
                    const  lastEndIf = ! lib.isAlphabetIndex(settingStack[parentSettingStackIndex].index);

                    if (isReadingSetting) {
                        tree.settings[currentSettingIndex] = {... tree.settings[currentSettingIndex], ... setting};
                    }

                    currentSettingStackIndex -= 1;

                    setting = {}
                    settingStack.pop();
                    if (parser.verbose) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${lineNum - 1}: end #if:`);
                    }

                    const  nextSetting = settingStack[settingStack.length - 1];
                    const  parentSettingIndex = path.dirname(nextSetting.index);
                    const  usedNumber = lib.fromAlphabetIndex(path.basename(nextSetting.index));
                    nextSetting.lineNum = 0;
                    if (parentSettingIndex === '/') {
                        nextSetting.index = `/${lib.getAlphabetIndex(usedNumber + 1)}`;
                    } else {
                        nextSetting.index = `${parentSettingIndex}/${lib.getAlphabetIndex(usedNumber + 1)}`;
                    }
                    currentSettingIndex = settingStack[currentSettingStackIndex].index;
                    tree.indicesWithIf.set(lineNum, currentSettingIndex);
                    if (lastEndIf) {
                        if (indent.length <= settingStack[currentSettingStackIndex + 1].indent.length) {
                            nextSetting.nextAlphabetIndex = path.basename(nextSetting.index);
                            if (parentSettingIndex === '/') {
                                nextSetting.index = `/${nextSetting.nextNumberIndex}`;
                            } else {
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

                const  setting_ = settingStack[settingStack.length - 1];
                if ( ! (currentSettingIndex in tree.settings)) {
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
                } else {
                    tree.settings[currentSettingIndex] = {... tree.settings[currentSettingIndex], ... setting};
                }
                setting = {}

                currentSettingIndex = settingStack[currentSettingStackIndex].index;
                tree.indices.set(lineNum, currentSettingIndex);
                tree.indicesWithIf.set(lineNum, currentSettingIndex);

                const  nextSetting = setting_;
                const  parentSettingIndex = path.dirname(nextSetting.index);
                const  usedNumber = parseInt(path.basename(nextSetting.index));
                nextSetting.lineNum = 0;
                if (parentSettingIndex === '/') {
                    nextSetting.index = `/${usedNumber + 1}`;
                } else {
                    nextSetting.index = `${parentSettingIndex}/${usedNumber + 1}`;
                }
                nextSetting.nextNumberIndex += 1;
            }

            // push "indentStack"
            if (indent === previousIndent.indent) {
                previousIndent.lineNum = lineNum;
            } else {
                indentStack.push({ lineNum, indent });
            }
        }

        // setting = ...
        if (settingLabel.test(line)  &&  ! line.includes(disableLabel)) {
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
                    var  isNewSettings = false;
                } else {
                    var  isNewSettings = true;
                }
            } else {
                const  currentSetting = settingStack[settingStack.length - 2];
                if (currentSetting.indent.length === indent.length) {
                    console.log('');
                    console.log(`${getTestablePath(parser.filePath)}:${lineNum}`);
                    console.log(`    Warning: double settings are not supported.`);
                    console.log(`    First settings at: ${getTestablePath(parser.filePath)}:` +
                        `${tree.settingsInformation[currentSettingIndex].lineNum}`);
                    parser.warningCount += 1;
                    var  isNewSettings = false;
                } else {
                    const  parentSetting = currentSetting;
                    const  parentIndex = parentSetting.index;
                    const  setting_ = settingStack[settingStack.length - 1];
                    if (parentIndex === '/') {
                        var  previousIndex = `/1`;
                    } else {
                        var  previousIndex = `${parentIndex}/1`;
                    }
                    var  previousIndentIsDeeper = false;
                    if (previousIndex in tree.settingsInformation) {
                        var  previousIndentIsDeeper = 
                            tree.settingsInformation[previousIndex].indent.length > indent.length;
                    }

                    // insert parent settings
                    if (previousIndentIsDeeper) {
                        const  ceilingLineNum = indentStack[indentStack.length - 2].lineNum;
                        const  shiftingIndices: string[] = [];
                        for (const [index, settingsInformation] of Object.entries(tree.settingsInformation)) {
                            if (settingsInformation.lineNum > ceilingLineNum ) {
                                shiftingIndices.push(index);
                            }
                        }
                        if (shiftingIndices.length >= 1) {
                            const  firstShiftingIndex = shiftingIndices[0];
                            shiftingIndices.sort((a,b)=>(b.length - a.length));

                            for (const [lineNum_, index] of tree.indices.entries()) {
                                if (lineNum_ > ceilingLineNum) {
                                    const  indexBefore = index;

                                    const  indexAfter = insertParentIndexNum(indexBefore, firstShiftingIndex);
                                    tree.indices.set(lineNum_, indexAfter);
                                }
                            }
                            var  lastIndexAfter = '';
                            for (const [lineNum_, index] of tree.indicesWithIf.entries()) {
                                if (lineNum_ > ceilingLineNum) {
                                    const  indexBefore = index;
                                    const  indexAfter = insertParentIndexNum(indexBefore, firstShiftingIndex);
                                    lastIndexAfter = indexAfter;
                                    tree.indicesWithIf.set(lineNum_, indexAfter);
                                }
                            }
                            var  lastSettingIndexAfter = '';
                            for (const shiftingIndex of shiftingIndices) {
                                const  indexBefore = shiftingIndex;
                                const  indexAfter = insertParentIndexNum(indexBefore, firstShiftingIndex);
                                lastSettingIndexAfter = indexAfter;
                                tree.settings[indexAfter] = tree.settings[indexBefore];
                                delete  tree.settings[indexBefore];
                                for (const settings of Object.values(tree.settings[indexAfter])) {
                                    settings.settingsIndex = indexAfter;
                                }
                                tree.settingsInformation[indexAfter] = tree.settingsInformation[indexBefore];
                                tree.settingsInformation[indexAfter].index = indexAfter;
                                delete  tree.settingsInformation[indexBefore];
                            }
                            currentSettingIndex = firstShiftingIndex;
                            if (lastIndexAfter !== currentSettingIndex) {
                                tree.indices.set(lineNum, `${currentSettingIndex}`);
                                tree.indicesWithIf.set(lineNum, `${currentSettingIndex}`);
                            }
                            settingStack[settingStack.length - 1].index = currentSettingIndex;
                            var  nextNestedIndex = currentSettingIndex + '/' +
                                (parseInt(lastSettingIndexAfter.substring(currentSettingIndex.length + 1)) + 1).toString();
                        } else {
                            var  nextNestedIndex = setting_.index + '/1';
                        }
                    } else {
                        var  nextNestedIndex = setting_.index + '/1';
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
                    tree.indices = new Map([... tree.indices.entries()].sort(([key1,_item1], [key2,_item2]) => key1 - key2));
                    tree.indicesWithIf = new Map([... tree.indicesWithIf.entries()].sort(([key1,_item1], [key2,_item2]) => key1 - key2));
                    var  isNewSettings = true;
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
        } else if (indent.length <= settingIndentLength  &&  isReadingSetting) {
            isReadingSetting = false;

            tree.settings[currentSettingIndex] = {... tree.settings[currentSettingIndex], ... setting};
        }
        if (isReadingSetting) {
            const  separator = line.indexOf(':');
            if (separator !== notFound) {
                const  key = line.substring(0, separator).trim();
                const  value = getValue(line, separator);
                if (value !== ''  &&  key.length >= 1  &&  key[0] !== '#') {
                    const  previous = setting[key];
                    if (key in setting  &&  value !== previous.value) {
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
                    const  currentSetting = settingStack[settingStack.length - 2];
                    const  sameAsIndex = line.indexOf(' ' + SameAsTag.label);
                    if (sameAsIndex != notFound) {
                        var  sameAs = getValue(line, sameAsIndex + SameAsTag.label.length + 1);
                    } else {
                        var  sameAs = '';
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
        const  ifPosition = ifLabelRE.exec(line);
        if (ifPosition  &&  ! line.includes(disableLabel)) {
            const  condition = getValue(line, ifPosition.index + ifPosition[0].length);

            tree.settings[currentSettingIndex] = {... tree.settings[currentSettingIndex], ... setting};
            setting = {};
            const  setting_    = settingStack[settingStack.length - 2];
            const  nextSetting = settingStack[settingStack.length - 1];
            const  inIfBlock      = lib.isAlphabetIndex(setting_.index);
            const  childIsIfBlock = lib.isAlphabetIndex(nextSetting.index);

            nextSetting.lineNum = lineNum;
            if ( ! inIfBlock  &&  ! childIsIfBlock) {
                if (setting_.index === '/') {
                    nextSetting.index = '/' + nextSetting.nextAlphabetIndex;
                } else {
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
        const  setting_ = settingStack[settingStack.length - 2];
        tree.settings[currentSettingIndex] = {... tree.settings[currentSettingIndex], ... setting};
        if ( ! (currentSettingIndex in tree.settingsInformation)) {
            tree.settingsInformation[currentSettingIndex] = {
                index: currentSettingIndex,
                lineNum : setting_.lineNum,
                indent: setting_.indent,
                condition: '',
                inSettings: isReadingSetting,
            };
        }
    }
    if ( ! ('/' in tree.settings)) {
        tree.settings['/'] = {};
    }
    if ( ! ('/' in tree.settingsInformation)) {
        tree.settingsInformation['/'] = {
            index: '/', lineNum: 0, indent: '', condition: '', inSettings: false,
        };
    }
    for (const index of Object.values(tree.indices)) {
        if ( ! (index in tree.settings)) {
            throw  new Error('parse error in makeSettingTree');
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

    return  tree;
}

// insertParentIndexNum
function  insertParentIndexNum(indexBefore: string, firstShiftingIndex: string): string {
    if (indexBefore === '/') {
        return  firstShiftingIndex;
    }

    // e.g. indexBefore = '/2/6/7', firstShiftingIndex = '/2/3'
    const  rightOfInsert = indexBefore.substring(firstShiftingIndex.length);  // e.g. '/7'
    const  minus = parseInt(path.basename(firstShiftingIndex)) - 1;  // e.g. 2
    const  beforeMinus = parseInt(path.basename(indexBefore.substring(0, indexBefore.length - rightOfInsert.length))); // e.g. 6

    return  `${firstShiftingIndex}/${beforeMinus - minus}${rightOfInsert}`;  // e.g. '/2/3/4/7'
}

// makeReplaceToTagTree
async function  makeReplaceToTagTree(parser: Parser, settingTree: Readonly<SettingsTree>): Promise<ReplaceToTagTree>  {
    const  toTagTree = new ReplaceToTagTree();
    const  verbose = parser.verbose;
    var  reader = readline.createInterface({
        input: fs.createReadStream(parser.filePath),
        crlfDelay: Infinity
    });
    var  isReadingSetting = false;
    var  settingIndentLength = 0;
    var  variableName = '';
    var  value = '';
    var  previousTemplateTag: TemplateTag | null = null;
    var  currentSettingIndex = '';
    var  blockStartLineNums = Array.from(settingTree.indicesWithIf.keys());
    var  nextBlockIndex = 0;
    var  nextBlockLineNum = 1;
    let  breaking = false;
    let  exception: any;
    if (parser.verbose) {
        console.log(`Verbose: Phase 2: parse "#to:" tags ...`);
    }
    toTagTree.replaceTo['/'] = {};

    var  lineNum = 0;
    for await (const line1 of reader) {
        if (breaking) {continue;}  // "reader" requests read all lines
        try {
            const  line: string = line1;
            lineNum += 1;
            parser.line = line;
            parser.lineNum = lineNum;
            parser.verbose = false;

            settingTree.moveToLine(parser);
            parser.verbose = verbose;
            if (lineNum === nextBlockLineNum) {
                currentSettingIndex = settingTree.indicesWithIf.get(lineNum)!;
                nextBlockIndex += 1;
                nextBlockLineNum = blockStartLineNums[nextBlockIndex];
            }
            if ( ! (currentSettingIndex in toTagTree.replaceTo)) {
                toTagTree.replaceTo[currentSettingIndex] = {};
            }

            // setting = ...
            if (settingLabel.test(line)  &&  ! line.includes(disableLabel)) {
                isReadingSetting = true;
                settingIndentLength = indentRegularExpression.exec(line)![0].length;
                previousTemplateTag = null;
            } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isReadingSetting) {
                isReadingSetting = false;
                variableName = '';
                value = '';
            }
            if (isReadingSetting) {
                const  separator = line.indexOf(':');
                if (separator !== notFound) {
                    const  keyOrNot = line.substr(0, separator).trim();
                    if (keyOrNot[0] !== '#') {

                        variableName = keyOrNot;
                        value = getValue(line, separator);
                    }
                }
            }
            var  toLabelIndex = line.indexOf(toLabel);
            if (toLabelIndex !== notFound) {
                var  toValue = getValue(line, toLabelIndex + toLabel.length - 1);
            } else {
                var  toValue = '';
            }
            const  templateTag = parseTemplateTag(line, parser);
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
                        const  variable = toTagTree.replaceTo[currentSettingIndex][variableName];
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
                } else {
                    if (previousTemplateTag) {
                        if (parser.verbose) {
                            console.log(`    Verbose: ${getTestablePath(parser.filePath)}:${lineNum}:`);
                        }
                        const  newKeyValues = await previousTemplateTag.scanKeyValues(
                            toValue, settingTree.currentSettings, parser);
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
                            const  indices = searchDefinedSettingIndices(variableName, currentSettingIndex, settingTree, parser);
                            for (const index of indices) {
                                if (variableName in toTagTree.replaceTo[index]) {
                                    const  variable = toTagTree.replaceTo[index][variableName];
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
                                } else {
                                    const  newValueCopy: Setting = Object.assign({}, newValue);
                                    newValueCopy.settingsIndex = index;

                                    toTagTree.replaceTo[index][variableName] = newValueCopy;
                                }
                            }
                            if (parser.command !== CommandEnum.check) {
                                console.log(`${getTestablePath(parser.filePath)}:${lineNum}: #to: ${variableName}: ${newValue.value}`);
                            }
                        }
                        previousTemplateTag = null;
                    }
                }
            }
        } catch (e) {
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
                const  setting = settingTree.settingsInformation[index];
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

    return  toTagTree;
}

// makeOriginalTagTree
async function  makeOriginalTagTree(parser: Parser, settingTree: Readonly<SettingsTree>): Promise<ReplaceToTagTree>  {
    const  toTagTree = new ReplaceToTagTree();
    var  reader = readline.createInterface({
        input: fs.createReadStream(parser.filePath),
        crlfDelay: Infinity
    });
    var  isReadingSetting = false;
    var  settingIndentLength = 0;
    var  currentSettingIndex = '';
    var  blockStartLineNums = Array.from(settingTree.indicesWithIf.keys());
    var  nextBlockIndex = 0;
    var  nextBlockLineNum = 1;
    let  breaking = false;
    let  exception: any;
    if (parser.verbose) {
        console.log(`Verbose: Phase 2: parse "original" tags ...`);
    }

    var  lineNum = 0;
    for await (const line1 of reader) {
        if (breaking) {continue;}  // "reader" requests read all lines
        try {
            const  line: string = line1;
            lineNum += 1;
            parser.line = line;
            parser.lineNum = lineNum;

            settingTree.moveToLine(parser);
            if (lineNum === nextBlockLineNum) {
                currentSettingIndex = settingTree.indicesWithIf.get(lineNum)!;
                nextBlockIndex += 1;
                nextBlockLineNum = blockStartLineNums[nextBlockIndex];
            }
            if ( ! (currentSettingIndex in toTagTree.replaceTo)) {
                toTagTree.replaceTo[currentSettingIndex] = {};
            }

            // setting = ...
            if (settingLabel.test(line)  &&  ! line.includes(disableLabel)) {
                isReadingSetting = true;
                settingIndentLength = indentRegularExpression.exec(line)![0].length;
            } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isReadingSetting) {
                isReadingSetting = false;
            }
            if (isReadingSetting) {
                const  separator = line.indexOf(':');
                const  originalLabelIndex = line.indexOf(originalLabel);
                var    variableName = '';
                if (separator !== notFound) {
                    const  keyOrNot = line.substr(0, separator).trim();
                    if (keyOrNot[0] !== '#') {
                        variableName = keyOrNot;
                    }
                }

                if (variableName !== ''  &&  originalLabelIndex != notFound) {
                    var  originalValue = getValue(line, originalLabelIndex + originalLabel.length - 1);
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
        } catch (e) {
            exception = e;
            breaking = true;
        }
    }
    if (exception) {
        throw exception;
    }

    toTagTree.command = 'reset';
    return  toTagTree;
}

// makeTemplatesInCopyTag
async function  makeTemplatesInCopyTag(replacingLines: string[]): Promise<CopyTag.Template[]> {
    const  templatesInCopyTag: CopyTag.Template[] = [];
    const  copyTagRe = new RegExp(' #copy(-template)?: *([^,]*),[^\\$]*(\\$settings\..*)}');
    const  copyTemplateTagRe = new RegExp(' #copy-template: *([^,]*),(.*)');
    const  settingsRe = new RegExp('\\$settings\\.([^ ,}]*)', 'g');

    const  variableNames: {[copyTagName: string]: Set<string>} = {}
    for (const line of replacingLines) {

        const  matchedCopyTag = copyTagRe.exec(line);
        if (matchedCopyTag) {
            const  name = matchedCopyTag[2];
            const  parameters = matchedCopyTag[3];
            const  templateVariableNames = new Set<string>();
            var  settingsMatch: RegExpExecArray | null = null;
            settingsRe.lastIndex = 0;
            variableNames[name] = templateVariableNames;

            while ( (settingsMatch = settingsRe.exec(parameters)) !== null ) {
                templateVariableNames.add(settingsMatch[1].trimRight());
            }
        }
    }

    for (const inputFileFullPath of await listUpFilePaths('')) {
        var  reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        var  lineNum = 0;
        var  copyTagIndent = '';
        var  copyTagName = '';
        var  copyTagLineNum = 0;
        var  copyTagParameterNames: string[] = [];

        for await (const line1 of reader) {
            const  line: string = line1;
            lineNum += 1;

            if (copyTagIndent) {
                if (line.startsWith(copyTagIndent)) {

                    const  templateIndex = line.indexOf(' ' + templateLabel);
                    if (templateIndex !== notFound) {
                        const  template = getValue(line, templateIndex + templateLabel.length + 1);

                        templatesInCopyTag.push({
                            copyTagName,
                            lineNumOffset: lineNum - copyTagLineNum,
                            template,
                        });
                    }
                } else if (line.trim() === '') {
                } else {
                    copyTagIndent = '';
                }
            }
            if ( ! copyTagIndent) {

                const  matchedCopyTag = copyTemplateTagRe.exec(line);
                if (matchedCopyTag) {
                    copyTagName = matchedCopyTag[1];
                    if (copyTagName in variableNames) {

                        copyTagIndent = indentRegularExpression.exec(line)![0] + ' ';
                        copyTagLineNum = lineNum;
                    } else {
                        copyTagName = '';
                    }
                }
            }
        }
    }
    return  templatesInCopyTag;
}

// getReplacedLineInSettings
function  getReplacedLineInSettings(
        line: string, separator: number, oldValue: string, replacedValue: string,
        addOriginalTag: boolean, cutOriginalTag: boolean, cutReplaceToTagEnabled: boolean
): ReplacedLineInSettings {

    // spaceAndComment
    // __SettingB__: SetB
    // __SettingB__: SetB  #// comment
    // __SettingB__: SetB      #to: NewSetB   #// SetBB...
    //                   ^ spaceAndCommentIndex
    var  spaceAndComment = '';
    const  commentMatch = / +#.*/.exec(line.substring(separator));
    if (commentMatch) {
        var  spaceAndCommentIndex = separator + commentMatch.index;
        spaceAndComment = line.substring(spaceAndCommentIndex);
    } else {
        var  spaceAndCommentIndex = notFound;
    }
    const  originalLabelIndex = line.indexOf(originalLabel);
    const  lineIncludesOriginalLabel = (originalLabelIndex !== notFound);
    if (addOriginalTag  &&  lineIncludesOriginalLabel) {
        const  originalValue = getValue(line, originalLabelIndex + originalLabel.length - 1);

        if (replacedValue === originalValue) {
            cutOriginalTag = true;
        }
    }
    var  original = '';

    // addOriginalTag
    if (addOriginalTag) {

        // before: __SettingB__: SetB
        // after:  __SettingB__: NewSetB  #original: SetB
        if (! lineIncludesOriginalLabel) {
            original = `  ${originalLabel} ${oldValue}`;
        } else {
            original = '';
        }

        // cutReplaceToTag
        if (cutReplaceToTagEnabled  &&  spaceAndComment !== '') {
            const  commentIndex = line.indexOf('#', spaceAndCommentIndex);
            const  toLabelIndex = line.indexOf(toLabel, commentIndex);
            if (toLabelIndex > commentIndex) {
                var  nextCommentIndex = line.indexOf(' #', toLabelIndex + 1);
                if (nextCommentIndex === notFound) {

                    // before: __SettingB__: SetB    #// comment1     #to: NewSetB
                    //                               ^ commentIndex   ^ toLabelIndex
                    // after:  __SettingB__: NewSetB  #original: SetB    #// comment1
                    spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                        line.substring(commentIndex, toLabelIndex).trimRight();
                } else {
                    nextCommentIndex += 1;
                    if (line[toLabelIndex - 2] !== ' '  &&  line[nextCommentIndex - 2] !== ' ') {

                        // before: __SettingB__: SetB    #// comment1 #to: NewSetB #// comment2
                        //                               ^ commentIndex            ^ nextCommentIndex
                        //      spaceAndCommentIndex ^                ^ toLabelIndex 
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1 #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substring(commentIndex, toLabelIndex) +
                            line.substring(nextCommentIndex);
                    } else {
                        const  commentMatch2 = / +#.*/.exec(line.substr(toLabelIndex))!;
                        const  spaceAndCommentIndex2 = toLabelIndex + commentMatch2.index;

                        // before: __SettingB__: SetB    #// comment1     #to: NewSetB___      #// comment2
                        //                               ^ commentIndex   ^ toLabelIndex       ^ nextCommentIndex
                        //                           ^ spaceAndCommentIndex              ^ spaceAndCommentIndex2
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1         #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substring(commentIndex, toLabelIndex - 1) +
                            line.substring(spaceAndCommentIndex2 + 1);
                    }
                }
            } else {
                var  nextCommentIndex = notFound;
                if (toLabelIndex !== notFound) {
                    const  nextCommentMatch = / +#.*/.exec(line.substring(commentIndex))
                    if (nextCommentMatch) {
                        nextCommentIndex = commentIndex + nextCommentMatch.index;
                    }
                }

                if (toLabelIndex === notFound) {

                    // before: __SettingB__: SetB   #// comment
                    // after:  __SettingB__: NewSetB  #original: SetB   #// comment
                    // Do nothing
                } else {
                    if (nextCommentIndex === notFound) {

                        // before: __SettingB__: SetB  #to: NewSetB
                        //                             ^ commentIndex == toLabelIndex
                        // after:  __SettingB__: NewSetB  #original: SetB
                        spaceAndComment = '';
                    } else {

                        // before: __SettingB__: SetB      #to: NewSetB   #// next comment
                        //    commentIndex == toLabelIndex ^           ^ nextCommentIndex
                        // after:  __SettingB__: NewSetB   #original: SetB      #// next comment
                        const  spaceCountBeforeToTag = line.indexOf('#', spaceAndCommentIndex) - spaceAndCommentIndex;
                        const  spaceCountAfterToTag  = line.indexOf('#', nextCommentIndex) - nextCommentIndex;
                        const  originalExists = (line.indexOf(originalLabel) !== notFound);

                        if ( ! lineIncludesOriginalLabel) {
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
    if (cutOriginalTag  &&  lineIncludesOriginalLabel) {
        const  replacedValuePattern = lib.escapeRegularExpression(replacedValue).replace(/\$/g,'$$');

        spaceAndComment = spaceAndComment.replace(
            new RegExp(` *${originalLabel} *${replacedValuePattern}`),
            '');
    }

    return { original, spaceAndComment } as ReplacedLineInSettings;
}

// ReplacedLineInSettings
interface  ReplacedLineInSettings {
    original: string;
    spaceAndComment: string;
}

// cutReplaceToTag
function  cutReplaceToTag(line: string): string {
    const  toLabelIndex = line.indexOf(toLabel);
    if (toLabelIndex !== notFound) {
        const  commentIndex = line.indexOf(' #', toLabelIndex);
        if (commentIndex !== notFound) {

            // added tag: SetB    #to: NewSetB  #template: __B__
            // replaced:  NewSetB    #template: __B__
            // reverted:  SetB    #template: __B__
            line = line.substring(0, toLabelIndex) + line.substring(commentIndex + 1);
        } else {

            // added tag: SetB    #to: NewSetB
            // replaced:  NewSetB
            // reverted:  SetB
            line = line.substring(0, toLabelIndex).trimRight();
        }
    }
    return  line;
}

// TemplateTag
class  TemplateTag {

    label = '';
    template = '';
    isFound = false;
    parser: Parser;

    // template tag
    indexInLine = notFound;

    // template-at tag
    lineNumOffset = 0;  
    startIndexInLine = notFound;
    endIndexInLine = notFound;

    // template-if tag
    oldTemplate = '';
    newTemplate = '';

    // for file-template tag
    templateLines: string[] = [];
    indentAtTag = '';
    minIndentLength = 0;

    // constructor
    constructor(parser: Parser) {
        this.parser = parser;
    }

    // parseLine
    parseLine(line: string) {
        const  disabled = (line.indexOf(disableLabel) !== notFound);

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
        if (this.indexInLine !== notFound  &&  ! disabled) {
            this.isFound = true;
            const  leftOfTemplate = cutReplaceToTag(line.substring(0, this.indexInLine).trim());
            if (this.label === fileTemplateLabel) {
                this.onFileTemplateTagReading(line);
            }

            this.template = line.substr(this.indexInLine + this.label.length).trim();
            this.template = getValue(this.template);
            if (leftOfTemplate === '') {
                this.lineNumOffset = -1;
            } else {
                this.lineNumOffset = 0;
            }
            return;
        }

        this.label = templateAtStartLabel;
        this.startIndexInLine = line.indexOf(templateAtStartLabel);
        if (this.startIndexInLine !== notFound  &&  ! disabled) {
            this.isFound = true;
            this.endIndexInLine =  line.indexOf(templateAtEndLabel, this.startIndexInLine);
            if (this.endIndexInLine !== notFound) {

                this.template = cutReplaceToTag(
                    line.substr(this.endIndexInLine + templateAtEndLabel.length).trim());
                this.lineNumOffset = parseInt(line.substring(
                    this.startIndexInLine + templateAtStartLabel.length,
                    this.endIndexInLine ));
                return;
            }
        }

        this.isFound = false;
        this.label = '';
        this.template = '';
        this.lineNumOffset = 0;
    }

    onFileTemplateTagReading(line: string) {
        this.indentAtTag = indentRegularExpression.exec(line)![0];
        this.minIndentLength = maxNumber;
    }

    onReadLine(line: string): boolean {
        const  currentIndent = indentRegularExpression.exec(line)![0];
        var  readingNext = true;
        if (currentIndent.length > this.indentAtTag.length  &&  line.startsWith(this.indentAtTag)) {

            this.templateLines.push(line);
            this.minIndentLength = Math.min(this.minIndentLength, currentIndent.length);
        } else if (line.trim() === '') {
            this.templateLines.push(line);
        } else {
            this.onEndOfFile();
            readingNext = false;
        }
        return  readingNext;
    }

    onEndOfFile() {
        this.templateLines = this.templateLines.map((line)=>(
            line.substring(this.minIndentLength)));
    }

    // includesKey
    includesKey(keys: string[]): boolean {
        const  commonCase = (this.label !== templateIfLabel);
        if (commonCase) {
            for (const key of keys) {
                if (this.template.includes(key)) {
                    return  true;
                }
            }
            return  false;
        } else { // if (this.label === templateIfLabel)
            return  keys.includes(templateIfYesKey) && keys.includes(templateIfNoKey);
        }
    }

    // scanKeys
    scanKeys(allKeys: string[]): string[] {
        const  keysSortedByLength: string[] = allKeys.slice(); // copy
        keysSortedByLength.sort((b,a)=>(a.length, b.length));
        const  scanedKeys: string[] = [];
        const  replaced = '\n';
        var  template = this.template;
        for (const key of keysSortedByLength) {
            const  keyRE = new RegExp(lib.escapeRegularExpression(key),'g');

            if (keyRE.test(template)) {
                scanedKeys.push(key);
                template = template.replace(keyRE, replaced);
            }
        }

        return  scanedKeys;
    }

    // scanKeyValues
    async  scanKeyValues(toValue: string, allKeys: {[name: string]: Setting}, parser: Parser
            ):  Promise<{[name: string]: Setting}> {
        const  keysSortedByLength: string[] = Object.keys(allKeys).slice(); // copy
        keysSortedByLength.sort((b,a)=>(a.length, b.length));
        const  foundIndices = new Map</*index*/ number, string>();
        const  verboseMode = parser.verbose;
        var  template = this.template;

        // Set variable names to "key" from "#template:" tag's value
        //     key = [ __A__, __B__ ]
        //     #template: (__A__:__B__)
        for (const key of keysSortedByLength) {
            var  index = 0;
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
        const  indices = Array.from(foundIndices.keys()).sort((a,b)=>(a-b));
        const  keys = indices.map((index)=>( foundIndices.get(index)! ));
        const  placeholder = '\n';
        var    templatePattern = this.template;
        for (let i = indices.length - 1;  i >= 0;  i -= 1 ) {
            templatePattern =
                templatePattern.substring(0, indices[i]) +
                placeholder +
                templatePattern.substring(indices[i] + keys[i].length)
        }
        const  templateRegularExpression = lib.escapeRegularExpression(templatePattern).replace(new RegExp( placeholder, "g"), '(.*)');
        const  toValueIsMatchedWithTemplate = new RegExp( templateRegularExpression ).exec( toValue );
        const  keyValues: {[name: string]: string} = {};
        if (verboseMode) {
            console.log(`        Verbose: scanKeyValues:`);
            console.log(`            Verbose: template: ${this.template}`);
            console.log(`            Verbose: templatePattern: ${templatePattern.replace(new RegExp( placeholder, "g"), '*')}`);
            console.log(`            Verbose: toValue: ${toValue}`);
            console.log(`            Verbose: toValueIsMatchedWithTemplate: ${toValueIsMatchedWithTemplate != null}`);
        }

        if (toValueIsMatchedWithTemplate) {

            // Case that "#to:" tag is pattern of template
            //     (A:B)  #to: (a:b)  #template: (__A__:__B__)
            for (let i = 1;  i < toValueIsMatchedWithTemplate.length;  i += 1 ) {
                const  value = toValueIsMatchedWithTemplate[i].trim();
                checkLineNoConfilict(keyValues, keys[i-1], value, parser);

                keyValues[keys[i-1]] = value;
            }
        } else {

            // Case that "#to:" tag is CSV
            //     (A:B)  #to: a, b  #template: (__A__:__B__)
            const  toValues = await lib.parseCSVColumns( toValue );
            if (toValues.length !== keys.length) {
                console.log('');
                console.log('Error of the value count in #to tag:');
                console.log(`    To tag: ${getTestablePath(parser.filePath)}:${parser.lineNum}:${parser.line}`);
                console.log(`    Variable count in the template tag: ${keys.length}`);
                console.log(`    Variable count in the to tag: ${toValues.length}`);
                parser.errorCount += 1;
            }
            for (let i = 0;  i < keys.length;  i += 1 ) {
                if (i < toValues.length  &&  toValues[i]) {
                    checkLineNoConfilict(keyValues, keys[i], toValues[i], parser);

                    keyValues[keys[i]] = toValues[i];
                }
            }
        }
        const  returnKeyValues: {[name: string]: Setting} = {};
        for (const key of Object.keys(keyValues)) {
            returnKeyValues[key] =  {
                value: keyValues[key],
                lineNum: parser.lineNum,
                settingsIndex: allKeys[key].settingsIndex,
                tag: 'toAfterTemplate',
                isReferenced: false,
            };
        }

        return  returnKeyValues;
    }

    // evaluate
    evaluate(setting: Settings): boolean | Error {
        if (this.label !== templateIfLabel) {
            return new Error();
        }
        const  expression = this.template;

        const  evaluatedContidion = evaluateIfCondition(expression, setting, this.parser);
        if (typeof evaluatedContidion === 'boolean') {
            if (evaluatedContidion) {
                this.oldTemplate = templateIfNoKey;
                this.newTemplate = templateIfYesKey;
            } else {
                this.oldTemplate = templateIfYesKey;
                this.newTemplate = templateIfNoKey;
            }
            return  evaluatedContidion;
        } else if (instanceOf.EvaluatedCondition(evaluatedContidion)) {
            return new Error();
        } else {
            return  evaluatedContidion;
        }
    }

    // checkTargetFileContents
    async  checkTargetFileContents(setting: Settings, parser: Parser): Promise<boolean> {
        const  parentPath = path.dirname(parser.filePath);
        const  targetFilePath = lib.getFullPath(getExpectedLine(setting, this.template), parentPath);
        const  templateEndLineNum = parser.lineNum;
        if (parser.verbose) {
            console.log(`        Verbose: checkTargetFileContents: ${getTestablePath(parser.filePath)}`)
        }
        if ( ! fs.existsSync(targetFilePath)) {
            const  templateLineNum = templateEndLineNum - this.templateLines.length;
            console.log("");
            console.log(`Error of not found the target file:`);
            console.log(`  ${translate('NotFound')}: ${getTestablePath(targetFilePath)}`);
            console.log(`  Template: ${getTestablePath(parser.filePath)}:${templateLineNum}`);
            parser.errorCount += 1;
            return  false;
        }
        const  targetFileReader = readline.createInterface({
            input: fs.createReadStream(targetFilePath),
            crlfDelay: Infinity
        });
        if (this.templateLines.length === 0) {
            return  false;
        }

        const  testingContents: string[] = [];
        for await (const line1 of targetFileReader) {
            const  line: string = line1;
            testingContents.push(line);
        }

        var  expectedParts: string[] = [];
        var  lastEmptyLineCount = 0;
        for (const line of this.templateLines) {
            expectedParts.push(getExpectedLineInFileTemplate(setting, line, parser));
            lastEmptyLineCount = (line.trim() === '') ? (lastEmptyLineCount + 1) : 0;
        }
        expectedParts.splice(expectedParts.length - lastEmptyLineCount, expectedParts.length);
        const  indent = ' '.repeat(this.minIndentLength);

        const  unexpectedLine = lib.checkExpectedTextContents(testingContents, expectedParts, fileTemplateAnyLinesLabel);
        if (unexpectedLine) {
            console.log('');
            console.log(`${getTestablePath(parser.filePath)}:${parser.lineNum - this.templateLines.length + unexpectedLine.partsLineNum - 1}: ` +
                `${indent + this.templateLines[unexpectedLine.partsLineNum - 1]}`);
            console.log(`${getTestablePath(targetFilePath)}:${unexpectedLine.contentsLineNum}: ${unexpectedLine.contentsLine  || '(Not found)'}`);
            console.log(`    ${translate('Warning')}: ${translate('Not same as file contents')}`);
            console.log(`    ${translate('Expected')}: ${unexpectedLine.partsLine}`);
            parser.warningCount += 1;
            return  false;
        }

        return  true;
    }
}

// CheckedTemplateTag
interface  CheckedTemplateTag {
    templateLineNum: number;
    template: string;
    variableNames: string[];
    targetLineNum: number;
    expected: string;
    replaced: string;
}

// IfTagParser
class  IfTagParser {
    readonly  parser: Parser;
    get       thisIsOutOfFalseBlock(): boolean {return this.thisIsOutOfFalseBlock_;}
    private   thisIsOutOfFalseBlock_: boolean = true;
    readonly  indentLengthsOfIfTag: IfTag[] = [
        {indentLength: -1, resultOfIf: true, enabled: true, isReplacable: true}
    ];
    get      isReplacable(): boolean {return this.isReplacable_;}  // #search: typrm replace with if tag
    private  isReplacable_: boolean = true;

    // constructor
    constructor(parser: Parser) {
        this.parser = parser;
    }

    // evaluate
    evaluate(line: string, setting: Settings, previsousEvalatedKeys: string[] = []) {
        var    expression = '';
        const  indentLength = indentRegularExpression.exec(line)![0].length;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {

                this.indentLengthsOfIfTag.pop();
                this.thisIsOutOfFalseBlock_ = lastOf(this.indentLengthsOfIfTag).enabled;
                this.isReplacable_          = lastOf(this.indentLengthsOfIfTag).isReplacable;
                if (this.parser.verbose) {
                    console.log(`        Verbose: ${getTestablePath(this.parser.filePath)}:${this.parser.lineNum - 1}: end #if:`);
                }
            }
        }

        if (ifLabelRE.exec(line)  &&  ! line.includes(disableLabel)) {
            expression = line.substring(line.indexOf(ifLabel) + ifLabel.length).trim();

            const  evaluatedContidion = evaluateIfCondition(expression, setting, this.parser, previsousEvalatedKeys);
            if (typeof evaluatedContidion === 'boolean') {
                var  resultOfIf = evaluatedContidion;
                var  isReplacable = false;
            } else if (instanceOf.EvaluatedCondition(evaluatedContidion)) {
                var  resultOfIf = evaluatedContidion.result;
                var  isReplacable = evaluatedContidion.isReplacable;
            } else {
                if (this.parser.ifTagErrorMessageIsEnabled) {
                    console.log('');
                    console.log(`${getTestablePath(this.parser.filePath)}:${this.parser.lineNum}: ${line}`);
                    console.log(`    ${translate('Error')}: ${translate('if tag syntax')}`);
                    this.parser.errorCount += 1;
                }
                var  resultOfIf = true;
                var  isReplacable = false;
            }
            if (this.thisIsOutOfFalseBlock && !resultOfIf) {
                this.thisIsOutOfFalseBlock_ = false;
            }
            this.indentLengthsOfIfTag.push({indentLength, resultOfIf,
                enabled: this.thisIsOutOfFalseBlock, isReplacable: this.isReplacable_});
            this.isReplacable_ = isReplacable;
        }
    }

    // setPosition
    setPosition(filePath: string, line: string, lineNum: number) {
        this.parser.filePath = filePath;
        this.parser.lineNum = lineNum;
        this.parser.line = line;
    }
}

// EnableFileTemplateParser
class  EnableFileTemplateParser {
    readonly  parser: Parser;
    readonly  indentLengthsOfIfTag: EnableFileTemplateIfExistTag[] = [
        {indentLength: -1, resultOfIf: true}
    ];
    get      isEnabled(): boolean {return this.isEnabled_;}
    private  isEnabled_: boolean = true;

    constructor(parser: Parser) {
        this.parser = parser;
    }

    evaluate(line: string, setting: Settings) {
        const  indentLength = indentRegularExpression.exec(line)![0].length;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {

                this.indentLengthsOfIfTag.pop();
                this.isEnabled_ = lastOf(this.indentLengthsOfIfTag).resultOfIf;
            }
        }
        if (line.includes(enableFileTemplateIfExistLabel)  &&  ! line.includes(disableLabel)) {
            const  tagLabel = enableFileTemplateIfExistLabel;
            const  basePath = path.parse( this.parser.filePath ).dir;
            const  pathParameter = line.substring(line.indexOf(tagLabel) + tagLabel.length).trim();
            const  fullPathParameter = lib.getFullPath(pathParameter, basePath);

            var  resultOfIf = fs.existsSync(fullPathParameter);
            this.indentLengthsOfIfTag.push({indentLength, resultOfIf});
            this.isEnabled_ = resultOfIf;
        }
    }
}

// BlockDisableTagParser
class  BlockDisableTagParser {
    previousLineHasTag: boolean = false;
    isInBlock_: boolean = false;
    blockIndentLength: number = 0;
    get  isInBlock() { return this.isInBlock_; }

    evaluate(line: string) {
        if (line.trim() === '') {
            return;
        }
        const  indentLength = indentRegularExpression.exec(line)![0].length;
        if (this.isInBlock_) {
            if (indentLength <= this.blockIndentLength) {
                this.blockIndentLength = 0;
                this.isInBlock_ = false;
            }
        } else {
            this.isInBlock_ = this.previousLineHasTag;
        }

        if (line.includes(searchIfLabel)) {
            this.blockIndentLength = indentLength;
            this.previousLineHasTag = true;
        } else {
            this.previousLineHasTag = false;
        }
    }
}

// WordPositions
class  WordPositions {
    wordPositions: number[] = [];
    get  length() { return this.wordPositions.length; }

    setPhrase(phrase: string) {
        const  words = phrase.split(' ');
        var  wordIndex = 0;
        var  position = 0;
        for (const word of words) {

            this.wordPositions.push(position);
            wordIndex += 1;
            position += word.length + 1;
        }
    }

    getWordIndex(phrasePosition: number) {
        var  wordIndex = -1;
        for (const wordPosition of this.wordPositions) {

            if (phrasePosition < wordPosition) {
                break;  // wordIndex = .
            }
            wordIndex += 1;
        }
        if (wordIndex >= this.wordPositions.length) {
            wordIndex = this.wordPositions.length - 1;
        }
        return  wordIndex;
    }
}

// replace
async function  replace(inputFileOrFolderPath: string) {
    await  replaceMain(inputFileOrFolderPath, 'replace');
}

// reset
async function  reset(inputFileOrFolderPath: string) {
    await  replaceMain(inputFileOrFolderPath, 'reset');
}

// replaceMain
async function  replaceMain(inputFileOrFolderPath: string, command: 'replace' | 'reset') {
    const  parser = new Parser();
    const  currentFolderBackUp = process.cwd();
    try {
        for await (const inputFilePath of await listUpFilePaths(inputFileOrFolderPath)) {

            await replaceSub(inputFilePath, parser, command);
        }
    } catch (e: any) {
        console.log('');
        console.log('Exception: ' + e.toString());
        parser.errorCount += 1;
    } finally {
        process.chdir(currentFolderBackUp);
    }
    console.log('');
    console.log(`${translate('Warning')}: ${parser.warningCount}, ${translate('Error')}: ${parser.errorCount}`);
}

// replaceSub
async function  replaceSub(inputFilePath: string, parser: Parser, command: 'replace' | 'reset') {
    parser.command = CommandEnum.replace;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = inputFilePath;
    if (parser.verbose) {
        console.log(`    Verbose: replaceSub:`);
        console.log(`        Verbose: inputFilePath: ${getTestablePath(inputFilePath)}`);
    }

    const  settingTree = await makeSettingTree(parser);
    if (command === 'replace') {
        var  toTagTree = await makeReplaceToTagTree(parser, settingTree);
        var  addOriginalTag = true
        var  cutOriginalTag = false
        var  cutReplaceToTagEnabled = true
    } else {  // if (command === 'reset') {
        var  toTagTree = await makeOriginalTagTree(parser, settingTree);
        var  addOriginalTag = false
        var  cutOriginalTag = true
        var  cutReplaceToTagEnabled = false
    }
    if (toTagTree.replaceToLength === 0) {
        return
    }
    if (parser.verbose) {
        console.log(`Verbose: Phase 3: replace ...`);
    }
    const  verbose = parser.verbose;
    const  conflictErrors: {[lineNum: number]: string} = {};
    var    isSetting = false;
    var    replacingKeys: string[] = [];
    var    replacingKeyValues: {[key: string]: string} = {};
    const  updatingFilePath = inputFilePath +".updating";
    const  writer = new WriteBuffer(fs.createWriteStream(updatingFilePath));
    const  fileContents = fs.readFileSync(inputFilePath, 'utf-8');
    const  hasLastLF = (fileContents.slice(-1) === '\n');
    const  lines: string[] = fileContents.split('\n');
    if (hasLastLF) {
        lines.pop();  // cut last empty line
    }
    const  linesWithoutToTagOnlyLine: string[] = [];
    var  settingIndentLength = 0;
    var  lineNum = 0;
    var  isCheckingTemplateIfKey = false;
    var  templateIfKeyError = false;
    var  copyTagIndent = '';
    var  copyTagLineNum = 0;
    var  oldSettingAndCopyTagParameters: Settings = {};
    var  newSettingAndCopyTagParameters: Settings = {};
    const  checkedTemplateTags: {[lineNum: number]: CheckedTemplateTag[]} = {};
    var    templatesInCopyTag: CopyTag.Template[] = [];
    const  templatesInCopyTagAll = await makeTemplatesInCopyTag(lines);
    try {
        for (const line of lines) {
            var  output = false;
            lineNum += 1;
            parser.lineNum = lineNum;
            linesWithoutToTagOnlyLine.push(line);
            parser.verbose = false;

            settingTree.moveToLine(parser);
            parser.verbose = verbose;
            toTagTree.moveToLine(parser, settingTree);
            const  oldSetting = toTagTree.currentOldSettingsInIfBlock;  // not settingTree.currentSettings
            const  newSetting = toTagTree.currentNewSettingsInIfBlock;
            if (settingTree.wasChanged) {
                replacingKeys = Object.keys(oldSetting);
                replacingKeyValues = {};
                for (const [key, value] of Object.entries(newSetting)) {
                    replacingKeyValues[key] = value.value;
                }
                for (const error of toTagTree.currentNotFoundNameInSameAsTag) {
                    const  settingNames = error.referencedVariableNames.concat([error.settingName]);
                    console.log('');
                    console.log(`${getVariablesForErrorMessage('', settingNames, settingTree, lines, parser.filePath)}`);
                    console.log(`    ${translate('Warning')}: ${translate('Not found a variable name.')}`);
                    console.log(`    Same as: ${error.notFoundName}`);
                    parser.errorCount += 1;
                }
            }

            // #copy tag
            if (copyTagIndent) {
                if ( ! line.startsWith(copyTagIndent)  &&  line.trim() !== '') {
                    copyTagIndent = '';
                    copyTagLineNum = 0;
                    replacingKeys = Object.keys(oldSetting);
                    templatesInCopyTag = [];
                    oldSettingAndCopyTagParameters = {};
                    newSettingAndCopyTagParameters = {};
                }
            }
            if (line.includes('#copy')) {
                const  copyTagIndex = tagIndexOf(line, copyLabel);
                const  copyTemplateTagIndex = tagIndexOf(line, copyTemplateLabel);
                if (copyTagIndex !== notFound  ||  copyTemplateTagIndex !== notFound) {
                    if (copyTagIndex !== notFound) { // if copyTagIndex
                        var  copyTagValue = getValue(line, copyTagIndex + copyLabel.length);
                    } else { // if copyTemplateTagIndex
                        var  copyTagValue = getValue(line, copyTemplateTagIndex + copyTemplateLabel.length);
                    }
                    const  firstCommaIndex = copyTagValue.indexOf(',');
                    if (firstCommaIndex !== notFound) {
                        const  copyTagName = copyTagValue.substring(0, firstCommaIndex);
                        const  parameters = yaml.load(copyTagValue.substring(firstCommaIndex + 1)) as {[name: string]: string};
                        const  values = Object.entries( parameters ).filter(keyValue => ! keyValue[1].startsWith(settingsDot))
                            .map(keyValue=>[keyValue[0], {
                                value: keyValue[1].toString(), lineNum, settingsIndex: '', tag: 'copyArgument', isReferenced: true,
                            }]);
                        const  variables = Object.entries( parameters ).filter(keyValue => keyValue[1].startsWith(settingsDot))
                            .map(keyValue=>[keyValue[0], keyValue[1].toString().substring(settingsDot.length)]);
                        const  copyTagParameters = variables.filter(keyValue => (keyValue[1] in oldSetting));

                        copyTagIndent = indentRegularExpression.exec(line)![0] + ' ';
                        copyTagLineNum = lineNum;
                        templatesInCopyTag = templatesInCopyTagAll.filter(item => item.copyTagName === copyTagName);
                        oldSettingAndCopyTagParameters = {
                            ... oldSetting,
                            ... Object.fromEntries( values ),
                            ... Object.fromEntries( copyTagParameters.map(keyValue => [keyValue[0], oldSetting[keyValue[1]]]))
                        };
                        newSettingAndCopyTagParameters = {
                            ... newSetting,
                            ... Object.fromEntries( values ),
                            ... Object.fromEntries( copyTagParameters.map(keyValue => [keyValue[0], newSetting[keyValue[1]]]))
                        };
                        replacingKeys = Object.keys(oldSettingAndCopyTagParameters);
                        if (copyTagParameters.length < variables.length) {
                            const  foundVaraibleNames = copyTagParameters.map(keyValue => keyValue[1]);
                            const  notFoundVariables = variables.filter(keyValue => ! foundVaraibleNames.includes(keyValue[1]))
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

            // #settings tag
            if (settingLabel.test(line)  &&  ! line.includes(disableLabel)) {
                isSetting = true;
                settingIndentLength = indentRegularExpression.exec(line)![0].length;
                if ( ! templateIfKeyError) {
                    isCheckingTemplateIfKey = true;
                }
            } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isSetting) {
                isSetting = false;
            }

            // In settings
            if (isSetting) {
                const  separator = line.indexOf(':');
                if (separator !== notFound) {
                    const  key = line.substring(0, separator).trim();
                    if (command === 'replace') {
                        var  currentIsOutOfFalse = toTagTree.currentIsOutOfFalseBlock;
                    } else {  // command === 'reset'
                        var  currentIsOutOfFalse = settingTree.currentIsOutOfFalseBlock;
                    }
                    if (key in oldSetting  &&  replacingKeys.includes(key)  &&  currentIsOutOfFalse) {
                        const  oldValue = getValue(line, separator);
                            // This is not "oldSetting[key].value", because it adds bad #original tag in #if tag block.
                        var  newValue = newSetting[key].value;
                        if (newValue !== oldValue) {
                            if (parser.verbose) {
                                console.log(`    Verbose: replace a setting: ${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                                console.log(`    Verbose:     replace from: ${oldValue}`);
                                console.log(`    Verbose:     replace to  : ${newValue}`);
                            }

                            // Change a settings value
                            const  {original, spaceAndComment} = getReplacedLineInSettings(
                                line, separator, oldValue, newValue,
                                addOriginalTag, cutOriginalTag, cutReplaceToTagEnabled);

                            const  newLine = line.substring(0, separator + 1) +' '+ newValue + original + spaceAndComment;
                            writer.write(newLine + "\n");
                            output = true;
                            if (parser.verbose) {
                                console.log(`    Verbose: ${getTestablePath(inputFilePath)}:${lineNum}: ${newLine}`);
                            }
                        }
                    }
                }

            // Out of settings
            } else {
                const  templateTag = parseTemplateTag(line, parser);
                if (templateTag.isFound) {
                    parser.templateCount += 1;
                } else {
                    if (copyTagIndent) {
                        const  templateInCopyTag = templatesInCopyTag.find(item => item.lineNumOffset === lineNum - copyTagLineNum);
                        if (templateInCopyTag) {
                            templateTag.isFound = true;
                            templateTag.template = templateInCopyTag.template;
                            templateTag.label = templateLabel;
                            templateTag.lineNumOffset = 0;
                        }
                    }
                }
                if (templateTag.isFound  &&  templateTag.includesKey(replacingKeys)
                &&  toTagTree.currentIsOutOfFalseBlock) {
                    const  replacingLine = linesWithoutToTagOnlyLine[linesWithoutToTagOnlyLine.length - 1 + templateTag.lineNumOffset];
                    const  commonCase = (templateTag.label !== templateIfLabel);
                    if ( ! copyTagIndent) {  // if common case
                        if (commonCase) {
                            var  expected = getExpectedLine(oldSetting, templateTag.template);
                            var  replaced = getReplacedLine(newSetting, templateTag.template);
                        } else { // if (templateTag.label === templateIfLabel)
                            templateTag.evaluate(newSetting);
                            var  expected = getExpectedLine(oldSetting, templateTag.oldTemplate);
                            var  replaced = getReplacedLine(newSetting, templateTag.newTemplate);
                        }
                    } else {  // if copyTagIndent
                        if (commonCase) {
                            var  expected = getExpectedLine(oldSettingAndCopyTagParameters, templateTag.template);
                            var  replaced = getReplacedLine(newSettingAndCopyTagParameters, templateTag.template);
                        } else { // if (templateTag.label === templateIfLabel)
                            templateTag.evaluate(newSetting);
                            var  expected = getExpectedLine(oldSettingAndCopyTagParameters, templateTag.oldTemplate);
                            var  replaced = getReplacedLine(newSettingAndCopyTagParameters, templateTag.newTemplate);
                        }
                    }

                    if (replacingLine.includes(expected)) {
                        const  before = expected;
                        const  after = replaced;
                        if (parser.verbose  &&  before !== after) {
                            if (templateTag.lineNumOffset === 0) {
                                console.log(`    Verbose: replace template variables`);
                            } else {
                                console.log(`    Verbose: replace template-at(${templateTag.lineNumOffset}) variables`);
                            }
                            console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                            console.log(`        Verbose:     replace from: ${before}`);
                            console.log(`        Verbose:     replace to  : ${after}`);
                        }
                        if (templateTag.lineNumOffset === 0) {
                            var  replacedLine = line.replace(new RegExp(lib.escapeRegularExpression(before),'g'), after.replace(/\$/g,'$$'));
                            if (cutReplaceToTagEnabled) {
                                replacedLine = cutReplaceToTag(replacedLine);
                            }

                            writer.write(replacedLine +"\n");
                            output = true;
                            const  outputTargetLineNum = writer.lineBuffer.length
                            checkedTemplateTags[outputTargetLineNum] = [];
                            checkedTemplateTags[outputTargetLineNum].push({
                                templateLineNum: lineNum,
                                template: templateTag.template,
                                variableNames: templateTag.scanKeys(Object.keys(settingTree.currentSettings)),
                                targetLineNum: lineNum,
                                expected: before,
                                replaced: after.replace(/\$/g,'$$')
                            })
                            if (parser.verbose) {
                                if (before !== after) {
                                    console.log(`    Verbose: replaced`);
                                    console.log(`        Verbose: before: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${line}`);
                                    console.log(`        Verbose: after:  ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${replacedLine}`);
                                } else {
                                    console.log(`    Verbose: not replaced`);
                                    console.log(`        Verbose: after:  ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${replacedLine}`);
                                }
                            }
                        } else if (templateTag.lineNumOffset <= -1) {
                            const  outputTargetLineNum = writer.lineBuffer.length + 1 + templateTag.lineNumOffset;
                            if ( !(outputTargetLineNum in checkedTemplateTags)) {
                                checkedTemplateTags[outputTargetLineNum] = [];
                            }
                            checkedTemplateTags[outputTargetLineNum].push({
                                templateLineNum: lineNum,
                                template: templateTag.template,
                                variableNames: templateTag.scanKeys(Object.keys(settingTree.currentSettings)),
                                targetLineNum: lineNum + templateTag.lineNumOffset,
                                expected: before,
                                replaced: after.replace(/\$/g,'$$')
                            });
                            var  lengthSortedTemplates = checkedTemplateTags[outputTargetLineNum].slice();
                            lengthSortedTemplates = lengthSortedTemplates.sort( (b, a) => (a.expected.length - b.expected.length) ); 
                            let  replacingLine = linesWithoutToTagOnlyLine[linesWithoutToTagOnlyLine.length + templateTag.lineNumOffset - 1];
                            var  maskedLine = replacingLine;
                            const  mask = '\n';
                            var  conflictedTemplates: CheckedTemplateTag[] = [];
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
                                            var  wasReplaced = false;
                                        } else {
                                            var  wasReplaced = replacingLine.includes(replaced);
                                        }
                                    } else if (template.replaced.includes(template.expected)) {
                                        // e.g. expected == 'some', replaced = 'something'
                                        var  wasReplaced = replacingLine.includes(template.replaced);
                                    } else {
                                        // e.g. expected == 'anything', replaced = 'something'
                                        var  wasReplaced = replacingLine.includes(template.replaced);
                                    }

                                    var  i = 0;
                                    if (wasReplaced) {
                                        if (parser.verbose) {
                                            console.log(`        Verbose: wasReplaced = true`);
                                        }
                                    } else {
                                        if ( ! maskedLine.includes(template.expected)) {
                                            conflictedTemplates.push(template);
                                        } else {
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
                                if ( ! replacingLine.includes(template.replaced)) {
                                    conflictedTemplates.push(template);
                                }
                            }
                            conflictedTemplates = lib.cutSameItems(conflictedTemplates);

                            writer.replaceAboveLine(templateTag.lineNumOffset, replacingLine +"\n");
                            if (conflictedTemplates.length >= 1  ||  outputTargetLineNum in conflictErrors) {
                                var  variableNames: string[] = [];
                                for (const template of checkedTemplateTags[outputTargetLineNum]) {
                                    variableNames.push(... template.variableNames);
                                }
                                variableNames = lib.cutSameItems(variableNames);

                                var  errorMessage = '';
                                errorMessage += '\n';
                                errorMessage += `${getTestablePath(inputFilePath)}:${outputTargetLineNum}: ${lines[outputTargetLineNum - 1]}\n`;
                                errorMessage += `    ${translate('Error')}: ${translate('template target values after replace are conflicted.')}` +
                                    ` ${translate('You should add #to: tags at setting variables in other templates.')}\n`;
                                errorMessage += getVariablesForErrorMessage('    ', variableNames, settingTree, lines, parser.filePath) +'\n';
                                var  templateNum = 0;
                                for (const template of checkedTemplateTags[outputTargetLineNum]) {
                                    const  replacedLine = lines[outputTargetLineNum - 1].replace(new RegExp(lib.escapeRegularExpression(template.expected), 'g'), template.replaced);
                                    templateNum += 1;

                                    errorMessage += `    replaced (${templateNum}): ${replacedLine.trim()}\n`;
                                    errorMessage += `        ${getTestablePath(inputFilePath)}:${template.templateLineNum}: ${lines[template.templateLineNum - 1]}\n`;
                                    errorMessage += `        ${getTestablePath(inputFilePath)}:${outputTargetLineNum}: ${lines[outputTargetLineNum - 1]}\n`;
                                    errorMessage += `            ${translate('Before Replacing')}: ${template.expected.trim()}\n`;
                                    errorMessage += `            ${translate('After  Replacing')}: ${template.replaced.trim()}\n`;
                                    errorMessage += `        ${getTestablePath(inputFilePath)}:${outputTargetLineNum}: ${replacedLine}\n`;
                                }
                                conflictErrors[outputTargetLineNum] = lib.cutLast( errorMessage, '\n');
                            }
                            if (parser.verbose) {
                                const  replacedLine = replacingLine;
                                if (before !== after) {
                                    console.log(`    Verbose: replaced`);
                                    console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length + templateTag.lineNumOffset}: ${replacedLine}`);
                                    console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${line}`);
                                } else {
                                    console.log(`    Verbose: not replaced`);
                                    console.log(`        Verbose: ${getTestablePath(inputFilePath)}:${linesWithoutToTagOnlyLine.length}: ${replacedLine}`);
                                }
                            }
                        }
                    } else if (replacingLine.includes(replaced)) {
                        // Do nothing
                    } else {
                        if (parser.errorCount === 0) { // Since only one old value can be replaced at a time
                            console.log('');
                            console.log(getErrorMessageOfNotMatchedWithTemplate(templateTag, settingTree, lines));
                            if (expected === replaced) {
                                console.log(`    ${translate('Warning')}: ${translate('Not matched with the template.')}`);
                                parser.warningCount += 1;
                            } else {
                                console.log(`    ${translate('Error')}: ${translate('Not found any replacing target.')} ` +
                                    `${translate('Modify the template target to old or new value.')}`);
                                parser.errorCount += 1;
                            }
                            console.log(`    ${translate('Expected')}: ${expected.trim()}`);
                        }
                    }
                } else {
                    if (isCheckingTemplateIfKey  &&  templateTag.label === templateIfLabel) {
                        isCheckingTemplateIfKey = false;
                        const  necessaryVariableNames = getNotSetTemplateIfTagVariableNames(replacingKeys);
                        if (necessaryVariableNames !== '') {
                            console.log('');
                            console.log(`${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                            console.log(`  ${translate('Error')}: ${translate('template-if tag related settings are not defined')}`);
                            console.log(`  ${translate('Solution')}: ${translate('Set the variable')} ${necessaryVariableNames}`);
                            console.log(`  ${translate('Setting')}: ${getTestablePath(inputFilePath)}:${
                                settingTree.settingsInformation[settingTree.currentSettingIndex].lineNum}`);
                            parser.errorCount += 1;
                            templateIfKeyError = true;
                        }
                    }
                }
            }
            if (!output) {
                if ( ! cutReplaceToTagEnabled) {

                    writer.write(line +"\n");
                } else {
                    if (line.trim() === '') {
                        writer.write(line +"\n");
                    } else {
                        const  cutLine = cutReplaceToTag(line);
                        if (cutLine.trim() === '') {
                            linesWithoutToTagOnlyLine.pop();  // for template-at tag
                        } else {
                            writer.write(cutLine +"\n");
                        }
                    }
                }
            }
        }
        for (const conflictError of Object.values(conflictErrors)) {
            console.log(conflictError);
            parser.errorCount += 1;
        }

        if ( ! hasLastLF) {
            writer.cutLastLF();
        }
        writer.end();
        await new Promise( (resolve) => {
            writer.on('finish', () => {
                if (parser.errorCount === 0) {
                    const  newFileContents = writer.getAllLines();
                    const  oldFileContents = fileContents;
                    if (newFileContents !== oldFileContents) {

                        fs.copyFileSync(updatingFilePath, inputFilePath);
                    }
                }
                resolve(parser.errorCount);
            });
        });
    } finally {
        deleteFileSync(updatingFilePath);
    }
}

// check
async function  check(checkingFilePath?: string) {
    const  parser = new Parser();
    const  currentFolderBackUp = process.cwd();
    const  copyTags: CopyTag.Properties[] = await CopyTag.scanAllTemplate(checkingFilePath);
    var    fileCount = 0;
    try {
        for (const inputFileFullPath of await listUpFilePaths(checkingFilePath)) {
            fileCount += 1;

            await checkRoutine(inputFileFullPath, copyTags, parser);
        }
        parser.flushToTagList();
    } catch (e: any) {
        console.log('');
        console.log('Exception: ' + e.toString());
        parser.errorCount += 1;
    } finally {
        process.chdir(currentFolderBackUp);
    }

    CopyTag.check(copyTags, parser);

    console.log('');
    console.log(`${translate('Warning')}: ${parser.warningCount}, ${translate('Error')}: ${parser.errorCount}`);
    console.log(`checked file count = ${fileCount}, template count = ${parser.templateCount}`);
}

namespace CopyTag {

    // CopyTag.Properties
    export interface  Properties {
        filePath: string;
        lineNum: number;
        line: string;
        tagName: string;
        value: string;
        copyName: string;
        contents: string[];
        arguments: {[name: string]: string};
        argumentNames: {[name: string]: string};
    }

    // CopyTag.Template
    export interface  Template {
        copyTagName: string;
        lineNumOffset: number;
        template: string;
    }

    // CopyTag.CheckParser
    export class  CheckParser {
        parsingCopyTag: CopyTag.Properties | undefined = undefined;
        copyTemplateTag: CopyTag.Properties | undefined = undefined;
        copyTagIndent = '';
        settingAndCopyTagParameters: Settings = {};
        comparableDollers: Settings = {};

        // CheckParser.evaluate
        evaluate(line: string, copyTags: CopyTag.Properties[], templateTag: TemplateTag, setting: Settings, parser: Parser) {
            this._evaluateCopyTagContents(line, copyTags, templateTag, setting, parser);
            this._evaluateCopyTagStart(line, copyTags, templateTag, setting, parser);
        }

        _evaluateCopyTagStart(line: string, copyTags: CopyTag.Properties[], templateTag: TemplateTag, setting: Settings, parser: Parser) {
            if ( ! this.parsingCopyTag) {
                const  copyTagIndex = tagIndexOf(line, copyLabel);
                const  copyTemplateTagIndex = tagIndexOf(line, copyTemplateLabel);
                if (copyTagIndex !== notFound  ||  copyTemplateTagIndex !== notFound) {

                    // if copyLabel
                    if (copyTagIndex !== notFound) {
                        const  value = getValue(line, copyTagIndex + copyLabel.length);
                        const  firstCommaIndex = value.indexOf(',');
                        if (firstCommaIndex === notFound) {
                            var  copyName = value;
                        } else {
                            var  copyName = value.substring(0, firstCommaIndex).trim();
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
                        this.copyTemplateTag = copyTags.find(item => (item.copyName === copyName  &&  item.tagName === copyTemplateLabel));
                        copyTags.push(this.parsingCopyTag);

                    // if copyTemplateLabel
                    } else {
                        const  value = getValue(line, copyTemplateTagIndex + copyTemplateLabel.length);
                        const  firstCommaIndex = value.indexOf(',');
                        if (firstCommaIndex === notFound) {
                            var  copyName = value;
                        } else {
                            var  copyName = value.substring(0, firstCommaIndex).trim();
                        }

                        this.parsingCopyTag = copyTags.find(item => (item.copyName === copyName))!;
                        this.parsingCopyTag.contents = [];
                        this.copyTemplateTag = undefined;
                    }
                    const  {evaluated: evaluatedCopyTagValue, isError} = evaluateSettingsDotVariable(this.parsingCopyTag.value, setting);
                    if (isError) {
                        console.log('');
                        console.log(`${getTestablePath(parser.filePath)}:${parser.lineNum}: ${line}`);
                        console.log('    Error: undefined variable');
                        parser.errorCount += 1;
                    } else {
                        this.parsingCopyTag.value = evaluatedCopyTagValue;
                        const  firstCommaIndex = this.parsingCopyTag.value.indexOf(',');
                        this.copyTagIndent = indentRegularExpression.exec(line)![0] + ' ';
                        this.settingAndCopyTagParameters = {... setting};
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
                            const  specifiedCopyArguments = yaml.load(this.parsingCopyTag.value.substring(firstCommaIndex + 1)) as {[name: string]: string};
                            if (this.copyTemplateTag) {
                                const  defaultArguments = yaml.load(this.copyTemplateTag.value.substring(firstCommaIndex + 1)) as {[name: string]: string};
                                var  copyArguments = Object.entries({... defaultArguments, ... specifiedCopyArguments});
                            } else {
                                var  copyArguments = Object.entries(specifiedCopyArguments);
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

        _evaluateCopyTagContents(line: string, copyTags: CopyTag.Properties[], templateTag: TemplateTag, setting: Settings, parser: Parser) {
            if (this.parsingCopyTag) {
                if (line.startsWith(this.copyTagIndent) || line.trim() === '') {
                    if (this.copyTemplateTag) {
                        const  lineNumOffset = this.parsingCopyTag.contents.length;
                        const  lineInTemplate = this.copyTemplateTag.contents[lineNumOffset];
                        var  sourceTemplateTag = parseTemplateTag(lineInTemplate, parser);
                    } else {
                        var  sourceTemplateTag = templateTag;
                    }
                    if (sourceTemplateTag.isFound) {
                        const  {expected: expectedText,  log: variablesInTemplate} =
                            getExpectedLineAndEvaluationLog(this.settingAndCopyTagParameters, sourceTemplateTag.template);
                        const  replacedTextContainsDoller = getReplacedLine(this.comparableDollers, sourceTemplateTag.template);
                        const  templateIndex = (templateTag.indexInLine !== notFound) ? templateTag.indexInLine : line.length;
                        const  checkingLineWithoutTemplate = line.substring(0, templateIndex);

                        var  comparableLine = checkingLineWithoutTemplate.replace(expectedText, replacedTextContainsDoller) +
                            line.substring(templateIndex);
                    } else {
                        var  comparableLine = line;
                    }

                    this.parsingCopyTag.contents.push(comparableLine);
                } else {
                    this.parsingCopyTag = undefined;
                    this.copyTemplateTag = undefined;
                    this.settingAndCopyTagParameters = {};
                }
            }
        }
    }

    // CopyTag.scanAllTemplate
    export async function  scanAllTemplate(checkingFilePath?: string): Promise<CopyTag.Properties[]> {
        const  copyTags: CopyTag.Properties[] = [];
        var    copyTag: CopyTag.Properties | undefined = undefined;
        const  filePaths = await listUpFilePaths();
        if (checkingFilePath  &&  ! filePaths.some(item => item.endsWith(checkingFilePath))) {
            if (fs.existsSync(checkingFilePath)) {
                filePaths.push(lib.getFullPath( checkingFilePath, process.cwd()));
            }
        }

        for (const inputFileFullPath of filePaths) {
            var  reader = readline.createInterface({
                input: fs.createReadStream(inputFileFullPath),
                crlfDelay: Infinity
            });
            var  lineNum = 0;
            var  copyTagIndent = '';

            for await (const line1 of reader) {
                lineNum += 1;
                const  line: string = line1;

                if (copyTag) {
                    if (line.startsWith(copyTagIndent)) {
                        copyTag.contents.push(line);
                    } else {
                        copyTag = undefined;
                    }
                }

                if (line.includes(copyTemplateLabel)  &&  ! copyTag) {
                    const  copyTagIndex = line.indexOf(copyTemplateLabel);
                    const  firstCommaIndex = line.indexOf(',', copyTagIndex);
                    if (firstCommaIndex === notFound) {
                        var  copyName = line.substring(copyTagIndex + copyTemplateLabel.length).trim();
                    } else {
                        var  copyName = line.substring(copyTagIndex + copyTemplateLabel.length, firstCommaIndex).trim();
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
                    copyTagIndent = indentRegularExpression.exec(line)![0] + ' ';
                }
            }
        }
        return  copyTags;
    }

    // CopyTag.check
    export function  check(copyTags: CopyTag.Properties[], parser: Parser) {

        // copyTags = ...
        for (const copyTag of copyTags) {
            copyTag.contents = copyTag.contents.map(contents => contents.replace(keywordTagAndParameterRegExp, '$1').trimRight());
        }
        const  copyNames = Array.from(new Set<string>(copyTags.map(t => t.copyName)));
        const  copyTemplateTags = new Map<string, CopyTag.Properties>(copyTags.filter(t=>t.tagName === copyTemplateLabel).map(t=>[t.copyName, t]));

        // checkExpectedTextContents()
        for (const copyName of copyNames) {
            const  copyGroup = copyTags.filter(t => t.copyName === copyName);
            if (copyTemplateTags.has(copyName)) {
                var  sourceCopyTag = copyTemplateTags.get(copyName)!;
            } else {
                var  sourceCopyTag = copyGroup[0];
            }

            for (const copyTag of copyGroup) {
                if (copyTag === sourceCopyTag) {
                    continue;
                }
                const  sourceCopyTagDollerContents = getReplacedCopyTagContents(sourceCopyTag, sourceCopyTag, sourceCopyTag.arguments);
                const  copyTagDollerContents = getReplacedCopyTagContents(copyTag, sourceCopyTag, copyTag.arguments);
                if (copyTag.contents.length > sourceCopyTagDollerContents.length) {
                    var  errorMessage = translate(`(out of copy tag block)`);
                    while (copyTag.contents.includes(errorMessage)) {
                        errorMessage += '_';
                    }
                    sourceCopyTagDollerContents[sourceCopyTagDollerContents.length] = errorMessage;
                }
                for (let lineNumOffset = 0;  lineNumOffset < sourceCopyTagDollerContents.length;  lineNumOffset += 1) {
                    const  templateRegExp = templateTagAndParameterRegExp;
                    const  sourceLine = sourceCopyTagDollerContents[lineNumOffset];
                    var    targetLine = copyTagDollerContents[lineNumOffset];
                    const  templateInSourceLine = templateRegExp.exec(sourceLine);
                    const  templateInTargetLine = templateRegExp.exec(targetLine);

                    if (templateInSourceLine  &&  ! templateInTargetLine) {

                        targetLine = targetLine.trimRight() + templateInSourceLine[0];
                        copyTagDollerContents[lineNumOffset] = targetLine;
                    }
                }

                const  unexpectedLine = lib.checkExpectedTextContents(copyTagDollerContents, sourceCopyTagDollerContents, fileTemplateAnyLinesLabel);
                if (unexpectedLine) {
                    const  foundFirstLine = (unexpectedLine.contentsLineNum >= 1);
                    if (foundFirstLine) {
                        var  sourceCopyLine = sourceCopyTagDollerContents[unexpectedLine.partsLineNum - 1];
                        var  copyLine = unexpectedLine.contentsLine;
                    } else {
                        var  sourceCopyLine = sourceCopyTagDollerContents[0];
                        var  copyLine = copyTagDollerContents[0];
                    }
                    if (sourceCopyLine.includes('(out of copy tag block)')) {
                        var  diff = {greenLine: translate(sourceCopyLine), redLine: copyLine};
                    } else {
                        if (foundFirstLine) {
                            var  copyIndentLength = unexpectedLine.contentsIndentLength;
                            var  sourceCopyIndentLength = unexpectedLine.partsIndentLength;
                            if (unexpectedLine.indentDiff > 0) {
                                copyIndentLength += unexpectedLine.indentDiff;
                            } else {
                                sourceCopyIndentLength -= unexpectedLine.indentDiff;
                            }
                            var  diff = lib.coloredDiff(copyLine, sourceCopyLine, copyIndentLength, sourceCopyIndentLength);
                        } else {
                            const  copyIndentLength = indentRegularExpression.exec( copyLine )![0].length;
                            const  sourceCopyIndentLength = indentRegularExpression.exec( sourceCopyLine )![0].length;
                            var  diff = lib.coloredDiff(copyLine, sourceCopyLine, copyIndentLength, sourceCopyIndentLength);
                        }
                    }

                    console.log('');
                    console.log(`${getTestablePath(sourceCopyTag.filePath)}:${sourceCopyTag.lineNum + unexpectedLine.partsLineNum}: ` +
                        `${diff.greenLine}`);
                    console.log(`${getTestablePath(copyTag.filePath)}:` +
                        `${unexpectedLine.contentsLineNum  ?  copyTag.lineNum + unexpectedLine.contentsLineNum  :  copyTag.lineNum + 1}: ` +
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
}

namespace SameAsTag {

    // SameAsTag.label
    export const  label = "#same-as:";

    // evaluateVariableName
    export function  evaluateVariableName(variableName: string, setting: Settings): returnOfEvaluateVariableName
    {
        const  return_: returnOfEvaluateVariableName = {
            variableName,
            referencedVariableNames: [],
            errorVariableNames: [],
        };
        var  matchedVariable: RegExpExecArray | null = null;
        settingsDotRe.lastIndex = 0;

        while ( (matchedVariable = settingsDotRe.exec(variableName)) !== null ) {
            const  referencingVariableName = matchedVariable[1];
            if (referencingVariableName in setting) {

                return_.variableName = return_.variableName.replace(
                    matchedVariable[0], `${setting[referencingVariableName].value}`);
                setting[referencingVariableName].isReferenced = true;
                return_.referencedVariableNames.push(referencingVariableName);
            } else {
                return_.errorVariableNames.push(referencingVariableName);
            }
        }
        return  return_;
    }

    export interface returnOfEvaluateVariableName {
        variableName: string;
        referencedVariableNames: string[];
        errorVariableNames: string[];
    }
}

// listUpFilePaths
async function  listUpFilePaths(checkingFilePath?: string): Promise<string[]> {
    const  currentFolder = process.cwd();
    const  inputFileFullPaths: string[] = [];
    const  notFoundPaths: string[] = [];
    var    targetFolders = await lib.parseCSVColumns(programOptions.folder);
    targetFolders = targetFolders.map((path)=>(lib.pathResolve(path)));  // Normalize path separators
    if (checkingFilePath) {
        if (lib.isFullPath(checkingFilePath)) {
            inputFileFullPaths.push(checkingFilePath);
        } else {
            if ( ! targetFolders.includes(currentFolder)) {
                targetFolders.push(currentFolder);
            }

            for (const folder of targetFolders) {
                const  targetFolderFullPath = lib.getFullPath(folder, currentFolder);

                const  inputFileFullPath = lib.getFullPath(checkingFilePath, targetFolderFullPath);
                if (fs.existsSync(inputFileFullPath)) {
                    inputFileFullPaths.push(inputFileFullPath);
                } else {
                    notFoundPaths.push(getTestablePath(inputFileFullPath));
                }
            }
            if (inputFileFullPaths.length === 0) {
                throw  new Error(`Not found specified target file at "${JSON.stringify(notFoundPaths)}".`);
            } else if (inputFileFullPaths.length >= 2) {
                console.log('');
                console.log(`${translate('Error')}: ${translate('same file name exists.')}`);
                console.log(`    FileName: ${getTestablePath(checkingFilePath)}`);
                console.log(`    Folder: ${getTestablePath(programOptions.folder)}`);
                throw  new Error(`same file name exists "${checkingFilePath}".`);
            }
        }
    } else {

        for (const folder of targetFolders) {
            const { targetFolderFullPath, wildcard } = lib.getGlobbyParameters(folder, currentFolder);
            if (!fs.existsSync(targetFolderFullPath)) {
                throw  new Error(`Not found target folder at "${getTestablePath(targetFolderFullPath)}".`);
            }
            process.chdir(targetFolderFullPath);
            const scanedPaths = await globby([`**/${wildcard}`]);
            scanedPaths.forEach((scanedPath: string) => {

                inputFileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath))
            });
        }
        process.chdir(currentFolder);
    }

    return  inputFileFullPaths;
}

// checkLineNoConfilict
function  checkLineNoConfilict(keyValue: {[key: string]: string}, key: string, newValue: string, parser: Parser) {
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

// runShellCommand
function  runShellCommand(keyword: string) {
    if ( ! programOptions.commandSymbol) {
        console.log(`${translate('Error')}: ${translate(`To run shell command, TYPRM_COMMAND_SYMBOL environment variable must be set.`)}`);
        return;
    }
    if ( ! keyword.startsWith(programOptions.commandSymbol)) {
        console.log(`${translate('Error')}: ${translate(`Not found command prefix "${programOptions.commandSymbol} ".`)}`);
        return;
    }
    const  command = keyword.substring(programOptions.commandSymbol.length + 1);

    execShellCommand(command);
}

// execShellCommand
function  execShellCommand(command: string) {
    if ( ! programOptions.commandFolder) {
        console.log(`${translate('Error')}: ${translate('To run shell command, TYPRM_COMMAND_FOLDER environment variable or --command-folder option must be set.')}`);
        return;
    }
    const  currentFolder = process.cwd();
    var    stdout_ = '';
    try {
        if ('verbose' in programOptions) {
            console.log(`Verbose: current folder: ${getTestablePath(programOptions.commandFolder)}`);
            console.log(`Verbose: command: ${command}`);
        }
        process.chdir(programOptions.commandFolder);

        const  stdoutBuffer = child_process.execSync( command );
        stdout_ = cutLastLF(stdoutBuffer.toString());
    } catch (e: any) {
        stdout_ = e.toString();
    }
    if (stdout_) {
        console.log(stdout_);
    }
    process.chdir(currentFolder);
}

// search
async function  search() {
    const  startIndex = (programArguments[0] === 's'  ||  programArguments[0] === 'search') ? 1 : 0;
    const  keyword = programArguments.slice(startIndex).join(' ');
    enum Command { search, openDocument, printRef, runVerb, check, replace, reset, mutualSearch, shellCommand };

    if (keyword !== '') {
        const  lastWord = programArguments.length === 0 ? '' :  programArguments[programArguments.length - 1];
        const  hasVerb = numberRegularExpression.test(lastWord);
        var  command = Command.search;
        if (hasRefTag(keyword)) {
            if (hasVerb) {
                command = Command.runVerb;
            } else {
                command = Command.printRef;
            }
        } else if (hasMutualTag(keyword)) {
            command = Command.mutualSearch;
        }

        if (command === Command.search) {

            await  searchSub(keyword, false);
        } else if (command === Command.mutualSearch) {

            await  searchSub(keyword.replace(mutualTag, ''), true);
        } else if (command === Command.printRef) {

            await  printRef(keyword);
        } else if (command === Command.runVerb){
            const  keywordWithoutVerb = programArguments.slice(startIndex, programArguments.length - 1).join(' ');
            const  ref = await printRef(keywordWithoutVerb, {print: false});

            runVerb(ref.verbs, ref.address, ref.addressLineNum, lastWord);
        }
    } else {  // if keyword === ''
        lib.inputSkip(startIndex);
        var  previousPrint = getEmptyOfPrintRefResult();
        for (;;) {
            var  prompt = `keyword${programOptions.commandSymbol || ''}:`;
            if (previousPrint.hasVerbMenu) {
                var  prompt = `keyword or number${programOptions.commandSymbol || ''}:`;
            }

            // typrm shell
            const  keyword = await lib.input(chalk.gray('typrm') + ' ' + chalk.yellow( prompt ) + ' ');
            if (keyword === 'exit()') {
                break;
            } else if (keyword === '') {
                previousPrint.hasVerbMenu = false;
            } else {
                var  command = Command.search;
                if (previousPrint.hasVerbMenu  &&  numberRegularExpression.test(keyword)) {
                    command = Command.runVerb;
                } else if (hasNumberTag(keyword)) {
                    command = Command.openDocument;
                } else if (hasRefTag(keyword)) {
                    command = Command.printRef;
                } else if (hasCheckTag(keyword)) {
                    command = Command.check;
                } else if (hasReplaceTag(keyword)) {
                    command = Command.replace;
                } else if (hasResetTag(keyword)) {
                    command = Command.reset;
                } else if (hasMutualTag(keyword)) {
                    command = Command.mutualSearch;
                } else if (hasShellCommandSymbol(keyword)) {
                    command = Command.shellCommand;
                }

                if (command === Command.search) {

                    previousPrint = await searchSub(keyword, false);
                } else if (command === Command.mutualSearch) {

                    await searchSub(cutTag(keyword), true);
                } else if (command === Command.openDocument) {
                    const  foundLines = previousPrint.foundLines;
                    const  foundIndex = parseInt( keyword.substring(1) );
                    if (foundIndex >= 1  &&  foundIndex <= foundLines.length) {
                        const  foundLine = foundLines[foundLines.length - foundIndex];

                        openDocument(`${foundLine.path}:${foundLine.lineNum}`);
                    }
                } else if (command === Command.printRef) {

                    previousPrint = await printRef(keyword);
                } else if (command === Command.runVerb) {
                    const  verbNumber = keyword;

                    runVerb(previousPrint.verbs, previousPrint.address, previousPrint.addressLineNum, verbNumber);
                } else if (command === Command.check) {
                    const  filePath = cutTag(keyword);

                    await  check(filePath);
                } else if (command === Command.replace) {
                    const  filePath = cutTag(keyword);

                    await  replace(filePath);
                } else if (command === Command.reset) {
                    const  filePath = cutTag(keyword);

                    await  reset(filePath);
                } else if (command === Command.shellCommand) {

                    runShellCommand(keyword);
                }
            }

            if (keyword === 'q' || keyword === 'quit' || keyword === 'exit') {
                console.log('Use exit() or Ctrl-C to exit')
            }
        }
    }
}

// searchSub
async function  searchSub(keyword: string, isMutual: boolean): Promise<PrintRefResult> {
    keyword = keyword.trim();

    // keywordWithTag = ...
    const  searchTagIndex = tagIndexOf(keyword, searchLabel);
    if (searchTagIndex !== notFound) {
        var  keywordWithTag = getValue(keyword, searchTagIndex + searchLabel.length);
    } else {
        const  keywordTagIndex = tagIndexOf(keyword, keywordLabel);
        if (keywordTagIndex !== notFound) {
            var  keywordWithTag = getValue(keyword, keywordTagIndex + keywordLabel.length);
            if (keywordWithTag === '') {
                const  colonIndex = keyword.indexOf(':');
                if (colonIndex !== notFound) {
                    keywordWithTag = keyword.substring(0, colonIndex);
                    if (keywordWithTag.startsWith('- ')) {
                        keywordWithTag = keywordWithTag.substring(2);
                    }
                } else {
                    keywordWithTag = '';
                }
            }
        } else {
            var  keywordWithTag = keyword;
        }
    }

    // fileFullPaths = ...
    const  currentFolder = process.cwd();
    const  fileFullPaths: string[] = [];
    const  targetFolders = await lib.parseCSVColumns(programOptions.folder);
    for (const folder of targetFolders) {
        const { targetFolderFullPath, wildcard } = lib.getGlobbyParameters(folder, currentFolder)
        if (!fs.existsSync(targetFolderFullPath)) {
            throw  new Error(`Not found target folder at "${targetFolderFullPath}".`);
        }
        process.chdir(targetFolderFullPath);
        const scanedPaths = await globby([`**/${wildcard}`]);
        scanedPaths.forEach((scanedPath: string) => {

            fileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath))
        });
    }
    process.chdir(currentFolder);

    // ...
    var  foundLines: FoundLine[] = [];
    const  thesaurus = new Thesaurus();
    if ('thesaurus' in programOptions) {
        const  thesaurusFilePath = programOptions.thesaurus;
        if ( ! fs.existsSync(thesaurusFilePath)) {
            throw  new Error(`not found the thesaurus file "${lib.getFullPath(thesaurusFilePath, process.cwd())}"`);
        }
        await  thesaurus.load(thesaurusFilePath);
    }

    // search
    for (const inputFileFullPath of fileFullPaths) {
        const  reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        const  glossaryTags: GlossaryTag[] = [];
        const  scoreTags: ScoreTag[] = [];
        const  blockDisable = new BlockDisableTagParser();
        const  snippetScaning: FoundLine[] = [];
        var  lineNum = 0;
        var  plusScore = 0;

        for await (const line1 of reader) {
            const  line: string = line1;
            lineNum += 1;
            blockDisable.evaluate(line);
            const  currentIndent = indentRegularExpression.exec(line)![0];
            const  currentIndentLength = currentIndent.length;
            const  indexOfKeywordLabel = line.indexOf(keywordLabel);
            const  indexOfSearchLabelIfMutual = (isMutual) ? line.indexOf(searchLabel) : notFound;

            // score tag
            if (line !== '') {
                var  scoreChaging = false;
                while (scoreTags.length >= 1) {
                    var  deepestScoreTag = scoreTags[scoreTags.length - 1];
                    if (currentIndentLength < deepestScoreTag.indentPosition) {

                        scoreTags.pop();
                        scoreChaging = true;
                    } else {
                        break;
                    }
                }

                const  scoreTagIndex = tagIndexOf(line, scoreLabel);
                if (scoreTagIndex !== notFound) {
                    const scoreTag: ScoreTag = {
                        indentPosition: scoreTagIndex,
                        plusScore: parseInt(getValue(line, scoreTagIndex + scoreLabel.length)),
                    };
                    scoreTags.push(scoreTag);
                    scoreChaging = true;
                }
                if (scoreChaging) {
                    plusScore = scoreTags.reduce((previousReturnValue, scoreTag) => {
                        return  previousReturnValue + scoreTag.plusScore;
                    },0);
                }
            }

            // keyword tag
            if ((indexOfKeywordLabel !== notFound  ||  indexOfSearchLabelIfMutual !== notFound)
                    &&  ! line.includes(disableLabel)  &&  ! blockDisable.isInBlock) {
                if (indexOfKeywordLabel !== notFound) {
                    var  label = keywordLabel;
                    var  indexOfLabel = indexOfKeywordLabel;
                    var  labelLength = keywordLabel.length;
                } else {
                    var  label = searchLabel;
                    var  indexOfLabel = indexOfSearchLabelIfMutual;
                    var  labelLength = searchLabel.length;
                }

                var  csv = getValue(line, indexOfLabel + labelLength);
                if (csv !== '') {
                    var  withParameter = true;
                } else {
                    var  withParameter = false;
                    csv = parseKeyName(line);
                }
                const  columns = await lib.parseCSVColumns(csv)
                    .catch((e: Error) => {
                        console.log(`Warning: ${e.message} in ${inputFileFullPath}:${lineNum}: ${line}`);
                        return [];
                    });

                const  found = getKeywordMatchingScore(columns, keywordWithTag, thesaurus);
                if (found.matchedKeywordCount >= 1) {
                    const  unescapedLine = unscapePercentByte(line);
                    if (withParameter) {
                        var  positionOfCSV = unescapedLine.indexOf(csv, unescapedLine.indexOf(label) + labelLength);
                    } else {
                        var  positionOfCSV = unescapedLine.indexOf(csv);
                    }
                    const  columnPositions = lib.parseCSVColumnPositions(csv, columns);

                    found.score += keywordMatchScore + plusScore;
                    found.path = inputFileFullPath;
                    found.lineNum = lineNum;
                    found.line = unescapedLine;
                    found.indentLength = indentRegularExpression.exec(line)![0].length;
                    found.tagLabel = label;
                    for (const match of found.matches) {
                        match.position += positionOfCSV + columnPositions[match.testTargetIndex];
                    }
                    found.evaluateSnippetDepthTag(line);
                    foundLines.push(found);
                    snippetScaning.push(found);
                }
            }

            // glossary tag
            var  glossaryTag: GlossaryTag | undefined = undefined;
            if (line.trim() !== '') {
                if (glossaryTags.length >= 1) {
                    glossaryTag = glossaryTags[glossaryTags.length - 1];
                }
                if (glossaryTag) {
                    if (currentIndent.length <= glossaryTag.indentAtTag.length) {

                        glossaryTags.pop();
                        if (glossaryTags.length >= 1) {
                            glossaryTag = glossaryTags[glossaryTags.length - 1];
                        } else {
                            glossaryTag = undefined;
                        }
                    } else {
                        if (glossaryTag.indentAtFirstContents === '') {
                            glossaryTag.indentAtFirstContents = currentIndent;
                            glossaryTag.indentPosition = glossaryTag.indentAtFirstContents.length;
                        }
                    }
                }

                if (line.includes(glossaryLabel)  &&  ! line.includes(disableLabel)  &&  ! blockDisable.isInBlock) {
                    var  glossaryWords = getValue(line, line.indexOf(glossaryLabel) + glossaryLabel.length);
                    if (glossaryWords !== '') {
                        glossaryWords += ' ';  // ' ' is a word separator
                    }

                    glossaryTags.push({
                        indentPosition: -1,
                        glossaryWords,
                        indentAtTag: indentRegularExpression.exec(line)![0],
                        indentAtFirstContents: '',
                    });
                }

                if (glossaryTag) {
                    const  characterAtIndent = line[glossaryTag.indentPosition];
                    const  isGlossaryIndentLevel = (
                        characterAtIndent !== ' '  &&
                        characterAtIndent !== '\t'  &&
                        characterAtIndent !== undefined
                    );
                    const  isComment = (characterAtIndent === '#');

                    if ( ! isGlossaryIndentLevel  ||  isComment) {
                        // Skip this line
                    } else {
                        const  colonPosition = line.indexOf(':', currentIndent.length);
                        const  wordInGlossary = glossaryTag.glossaryWords +
                            line.substr(currentIndent.length, colonPosition - currentIndent.length);

                        const  found = getKeywordMatchingScore([wordInGlossary], keywordWithTag, thesaurus);
                        if (found.matchedKeywordCount >= 1  &&  colonPosition !== notFound) {

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
                            } else {
                                found.line = glossaryTag.glossaryWords.trim() +':'+ line;
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
                } else {
                    const  endsOfSnippets: FoundLine[] = [];
                    for (const found of snippetScaning) {
                        if (lineNum > found.lineNum) {
                            var  endOfSnippet = false;
                            if ( ! found.isSnippetOver(line)) {
                                if (found.snippetDepth >= 1  ||  found.snippet.length < parseInt(programOptions.snippetLineCount)) {
                                    var  snippetLine = line.substring(found.indentLength);

                                    found.snippet.push(snippetLine);
                                } else {
                                    found.snippet.pop();
                                    found.snippet.push('    ....');
                                    endOfSnippet = true;
                                }
                            } else {
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
    const  keyphraseWordCount = keywordWithTag.split(' ').length;

    // searchWithoutTags (find all)
    foundLines = foundLines.filter((found) => (found.matchedKeywordCount >= keyphraseWordCount));
    foundLines.sort(compareScoreAndSoOn);
    if ( ! ('disableFindAll' in programOptions)  &&  ! isMutual) {

        const  foundLineWithoutTags = await searchWithoutTags(keyword);
        // const  foundLineHasScore = foundLineWithoutTags.filter((found)=>(found.score >= 2));
        // foundLines = [... foundLineHasScore, ... foundLines];
        // foundLines.sort(compareScoreAndSoOn);
        foundLineWithoutTags.sort(compareScoreAndSoOn);
        foundLines = [... foundLineWithoutTags, ... foundLines];
        foundLines = foundLines.filter(lib.lastUniqueFilterFunction((found1, found2) =>
            found1.path == found2.path  &&  found1.lineNum == found2.lineNum));
    }

    // console.log(foundLineInformation)
    const  foundCountMax = parseInt(programOptions.foundCountMax);
    if (foundLines.length > foundCountMax) {
        console.log(`... (` + translate(`To show more result, restart typrm with --found-count-max option`) + ')');
        var  startFoundIndex = foundLines.length - foundCountMax;
    } else {
        var  startFoundIndex = 0;
    }
    var  foundCount = 0;
    for (const foundLineInformation of foundLines) {
        if (foundCount >= startFoundIndex) {

            console.log(foundLineInformation.toString());
        }
        foundCount += 1;
    }

    // console.log(snippet)
    if (foundLines.length >= 1  &&  foundLines[foundLines.length - 1].snippet.length >= 1) {
        const  found = foundLines[foundLines.length - 1];
        const  snippet = (await evaluateEnvironmentVariable(found.snippet, found.path, found.lineNum)).join('\n');
        const  snippetColor = chalk.rgb(144,144,160);

        console.log(snippetColor(snippet));
    }

    // printRef
    if (foundLines.length >= 1  &&  lastOf(foundLines).line.includes(refLabel)) {
        const  foundLine = lastOf(foundLines).line;
        const  refTagPosition = foundLine.indexOf(refLabel);
        const  nextTagPosition = foundLine.indexOf(' #', refTagPosition + 1);
        if (nextTagPosition === notFound) {
            var  refTagAndAddress = foundLine.substring(refTagPosition);
        } else {
            var  refTagAndAddress = foundLine.substring(refTagPosition,  nextTagPosition);
        }

        const  verbReturn = await printRef(refTagAndAddress);
        verbReturn.foundLines = foundLines;
        return  verbReturn;
    } else {
        const  normalReturn = getEmptyOfPrintRefResult();
        if (foundLines.length === 0) {
            normalReturn.previousKeyword = keyword;
        }
        normalReturn.foundLines = foundLines;
        return  normalReturn;
    }
}

// getKeywordMatchingScore
function  getKeywordMatchingScore(testingStrings: string[], keyphrase: string, thesaurus: Thesaurus): FoundLine {

    function  subMain() {
        const  bestFound = testingStrings.reduce(
            (bestFound: FoundLine, aTestingString: string, stringIndex: number) => {
                const  keywords = keyphrase.split(' ');
                const  found = new FoundLine();

                var    previousPosition = -1;
                const  wordPositions = new WordPositions();
                wordPositions.setPhrase(aTestingString);
                const  matchedCountsByWord: number[] = new Array<number>(wordPositions.length).fill( 0 )

                for (const keyword of keywords) {
                    if (keyword === '') {continue;}

                    const  result = getSubMatchedScore(aTestingString, keyword, keyword.toLowerCase(), stringIndex, found);
                    if (result.score !== 0) {
                        if (result.position > previousPosition) {
                            found.score += result.score + orderMatchScore;
                        } else {
                            found.score += result.score;
                        }
                        found.score += notNormalizedScore;
                        found.matchedKeywordCount += 1;
                    }
                    if (result.position !== notFound) {
                        matchedCountsByWord[wordPositions.getWordIndex(result.position)] += 1;
                        previousPosition = result.position;
                    }
                    const  useThesaurus = (result.score === 0  &&  result.position === notFound  &&  thesaurus.enabled);
                    if (useThesaurus) {
                        const  normalizedTestingString = thesaurus.normalize(aTestingString);
                        const  normalizedKeyword = thesaurus.normalize(keyword);

                        const  result = getSubMatchedScore(normalizedTestingString,
                            normalizedKeyword, normalizedKeyword.toLowerCase(), stringIndex, found);
                        if (result.score !== 0) {
                            if (result.position > previousPosition) {
                                found.score += result.score * orderMatchScore;
                            } else {
                                found.score += result.score;
                            }
                            found.matchedKeywordCount += 1;
                        }
                        if (result.position !== notFound) {
                            matchedCountsByWord[wordPositions.getWordIndex(result.position)] += 1;
                            previousPosition = result.position;
                        }
                    }
                }
                if (found.matchedKeywordCount < keywords.length) {
                    found.score = 0;
                }
                if (found.score !== 0) {
                    // e.g.
                    // keyphrase = "aa bbb ccc"
                    // aTestingString = "aabbb ccc dd ee"
                    // score += character count
                    // matchedKeywordCount = 3;
                    // matchedTargetKeywordCount = 2
                    // testedWordCount = 4
                    found.score += 2 * (keyphrase.length - aTestingString.length);  // 2 is double score from the score of different (upper/loser) case
                    found.matchedTargetKeywordCount = matchedCountsByWord.filter((count)=>(count >= 1)).length;
                    found.testedWordCount = aTestingString.split(' ').length;
                }
                const  matches = bestFound.matches.concat(found.matches);
                if (compareScoreAndSoOn(bestFound, found) < 0) {

                    bestFound = found;
                }
                bestFound.matches = matches;
                return bestFound;
            }, new FoundLine());

        return  bestFound;
    }

    interface  Result {
        score: number;
        position: number;
    }

    function  getSubMatchedScore(testingString: string, keyword: string,
            lowerKeyword: string, stringIndex: number, found: FoundLine): Result {
        var  score = 0;
        var  position = notFound;

        if ((position = testingString.indexOf(keyword)) !== notFound) {
            if (testingString.length === keyword.length) {
                score = fullMatchScore;
            } else {
                if (
                    (position === 0  ||  testingString[position - 1] === ' ' ) &&
                    (position + keyword.length === testingString.length  ||  testingString[position + keyword.length] === ' ')
                ) {
                    score = wordsMatchScore;
                } else {
                    score = partMatchScore;
                }
            }
        } else if ((position = testingString.toLowerCase().indexOf(lowerKeyword)) !== notFound) {
            if (testingString.length === lowerKeyword.length) {
                score = caseIgnoredFullMatchScore;
            } else {
                if (
                    (position === 0  ||  testingString[position - 1] === ' ' ) &&
                    (position + keyword.length === testingString.length  ||  testingString[position + keyword.length] === ' ')
                ) {
                    score = caseIgnoredWordMatchScore;
                } else {
                    score = caseIgnoredPartMatchScore;
                }
            }
        }
        if (position !== notFound) {
            const  matched = new MatchedPart();
            matched.position = position;
            matched.length = keyword.replace(/"/g, '""').length;
            matched.testTargetIndex = stringIndex;
            matched.matchedString = testingString.substr(position, matched.length);
            found.matches.push(matched);
        }
        return { score, position };
    }

    const  found = subMain();
    return  found;
}

// compareScoreAndSoOn
function  compareScoreAndSoOn(a: FoundLine, b: FoundLine) {
    var  different = 0;

    // matchedTargetKeywordCount
    if (different === 0) {
        different = a.matchedTargetKeywordCount - b.matchedTargetKeywordCount;
    }

    // testedWordCount
    if (different === 0) {
        different = b.testedWordCount - a.testedWordCount;
    }

    // score
    if (different === 0) {
        var  different = a.score - b.score;
    }

    // path
    if (different === 0) {
        if (a.path < b.path) {
            different = -1;
        } else if (a.path > b.path) {
            different = +1;
        }
    }

    // lineNum
    if (different === 0) {
        different = a.lineNum - b.lineNum;
    }

    return  different;
}

// searchWithoutTags
async function  searchWithoutTags(keywords: string): Promise<FoundLine[]> {
    const  foundLines: FoundLine[] = [];
    const  keywordCount = keywords.split(' ').filter((keyword)=>(keyword !== '')).length;
    const  keywordsLowerCase = Array.from(new Set(
        keywords.replace(/\u{3000}/ug,' ').toLowerCase()
        .split(' ').filter((keyword)=>(keyword !== ''))));
        // '\u{3000}': Japanese space
    const  keyword1LowerCase = keywordsLowerCase[0];
    const  keywords2LowerCase = keywordsLowerCase.slice(1);
    var  fullMatchKeywords = keywords;
    if (tagIndexOf(fullMatchKeywords, searchLabel) !== notFound) {
        fullMatchKeywords = fullMatchKeywords.replace(searchLabel, keywordLabel);
    }
    fullMatchKeywords = lib.cutLast(fullMatchKeywords.trim(), ':').trimRight();
    var  matchCount = 0;
    var  fullMatchCount = 0;
    function  isFullMatch(line: string, fullMatchKeywords: string): boolean {
        if (line.trimStart().startsWith(fullMatchKeywords)) {
            if (line.trim() === fullMatchKeywords) {
                return  true;
            }
            const  lineTrimR = line.trimRight();
            if (lineTrimR.substring(lineTrimR.length - 1) === ':') {
                return  true;
            }
        }
        return  false;
    }

    for (const inputFileFullPath of await listUpFilePaths()) {
        const  reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        var  lineNum = 0;
        let  breaking = false;
        let  exception: any;

        for await (const line1 of reader) {
            if (breaking) {continue;}  // "reader" requests read all lines
            try {
                const  line: string = line1;
                lineNum += 1;

                // full match
                if (fullMatchCount < programOptions.foundCountMax  &&  isFullMatch(line, fullMatchKeywords)) {
                    fullMatchCount += 1;
                    const  found = new FoundLine();
                    found.path = inputFileFullPath;
                    found.lineNum = lineNum;
                    found.line = line;
                    found.matches.push({
                        position: line.indexOf(fullMatchKeywords),
                        length: fullMatchKeywords.length,
                        testTargetIndex: -1,
                        matchedString: fullMatchKeywords,
                    });
                    found.matchedKeywordCount = keywordCount;
                    found.matchedTargetKeywordCount = keywordCount;  // not keywordsLowerCase.length
                    found.testedWordCount = line.split(' ').filter((keyword)=>(keyword !== '')).length;
                    found.tagLabel = 'find all';
                    found.score = (wordsMatchScore + orderMatchScore + notNormalizedScore) * found.matchedKeywordCount +
                        lineFullMatchScore + keywords.trim().length - line.trim().length;
                    foundLines.push(found);
                }

                // shuffled keywords match
                else if (matchCount < programOptions.foundCountMax) {

                    var  keywordIndex = line.toLowerCase().indexOf(keyword1LowerCase);
                    if (keywordIndex !== notFound) {

                        const  found = new FoundLine();
                        found.path = inputFileFullPath;
                        found.lineNum = lineNum;
                        found.line = line;
                        found.matches.push({
                            position: keywordIndex,
                            length: keyword1LowerCase.length,
                            testTargetIndex: -1,
                            matchedString: line.substr(keywordIndex, keyword1LowerCase.length),
                        });
                        found.matchedKeywordCount = keywordCount;
                        found.matchedTargetKeywordCount = keywordsLowerCase.length;
                        found.testedWordCount = line.split(' ').filter((keyword)=>(keyword !== '')).length;
                        found.tagLabel = 'find all';
                        found.score = (wordsMatchScore + orderMatchScore + notNormalizedScore) * found.matchedKeywordCount +
                            suffledLineFullMatchScore + keywords.trim().length - line.trim().length;

                        for (const keywordLowerCase of keywords2LowerCase) {
                            const  previousKeywordIndex = keywordIndex;

                            keywordIndex = line.toLowerCase().indexOf(keywordLowerCase);
                            if (keywordIndex === notFound) {
                                break;
                            }
                            found.matches.push({
                                position: keywordIndex,
                                length: keywordLowerCase.length,
                                testTargetIndex: -1,
                                matchedString: line.substr(keywordIndex, keywordLowerCase.length),
                            });
                            if (keywordIndex < previousKeywordIndex) {
                                found.score -= 1;
                            }
                        }
                        if (keywordIndex !== notFound) {
                            matchCount += 1;

                            foundLines.push(found);
                        }
                    }
                }
            } catch (e) {
                exception = e;
                breaking = true;
            }
        }
        if (exception) {
            throw exception;
        }
    }
    return  foundLines;
}

// mutualSearch
async function  mutualSearch() {
    const  keyword = programArguments.slice(1).join(' ');

    await  searchSub(keyword, true);
}

// PrintRefOption
interface  PrintRefOption {
    print: boolean | undefined; 
}

// printRefOptionDefault
const  printRefOptionDefault = {
    print: true,
} as PrintRefOption;

// PrintRefResult
interface  PrintRefResult {
    foundLines: FoundLine[];
    hasVerbMenu: boolean;
    verbs: Verb[];
    address: string;
    addressLineNum: number;
    previousKeyword: string;
}

// getEmptyOfPrintRefResult
function  getEmptyOfPrintRefResult(): PrintRefResult {
    return  {
        foundLines: [],
        hasVerbMenu: false,
        verbs: [],
        address: '',
        addressLineNum: 0,
        previousKeyword: '',
    }
}

// openDocument
function  openDocument(ref: string) {
    if ( ! process.env.TYPRM_OPEN_DOCUMENT) {
        console.log(`${translate('Error')}: ${translate('Not defined TYPRM_OPEN_DOCUMENT environment variable.')}`);
        return;
    }

    const  command = process.env.TYPRM_OPEN_DOCUMENT.replace('${ref}', ref);
    execShellCommand(command);
}

// printRef
async function  printRef(refTagAndAddress: string, option = printRefOptionDefault): Promise<PrintRefResult> {
    const  addressBefore = refTagAndAddress.trim().substring(refLabel.length).trim();
    const  variableRe = new RegExp(variablePattern, 'g');  // variableRegularExpression
    const  variables: {[key: string]: undefined} = {};
    variableRe.lastIndex = 0;
    for (;;) {
        const  variable = variableRe.exec(addressBefore);
        if (variable === null) {
            break;
        }
        variables[variable[0]] = undefined;
    }

    // address = ...
    var  address = addressBefore;
    if ( ! address.startsWith("\\\\")) {
        address = address.replace(/(\\+)([^\$\\ ]|$)/g, (match, backSlashes, nextCharacter, offset) => {

            return  backSlashes.replace(/\\/g,'/') + nextCharacter;  // replace \\ to /
        });
    }
    address = cutQuotation(address);
    if (variables) {
        for (const variable of Object.keys(variables)) {
            const  variableName = variable.substr('${'.length, variable.length - '${}'.length);
            const  value = process.env[`${typrmEnvPrefix}${variableName}`];
            if (value) {
                const  variableRegExp = new RegExp('\\\\?'+ lib.escapeRegularExpression( variable ), 'g');

                address = address.replace(variableRegExp, (match, offset) => {
                    const  startsBackSlash = (match.substring(0,1) === '\\');
                    if (startsBackSlash) {
                        var  dollarOffset = offset + 1;
                    } else {
                        var  dollarOffset = offset;
                    }
                    const  replacing = ! isBackSlashParameter(address, dollarOffset);

                    if (replacing) {
                        if (startsBackSlash) {
                            return  '\\' + value.replace(/\$/g,'$$').replace('\\','/');
                        } else {
                            return  value.replace(/\$/g,'$$').replace('\\','/');
                        }
                    } else {
                        return  variable.replace(/\$/g,'$$');
                            // If startsBackSlash === true, cut \ character.
                    }
                });
            }
        }
    }
    if (address.startsWith('~')) {
        address = lib.getHomePath() + address.substring(1);
    }

    // linkableAddress = ...
    var  linkableAddress = address;
    var  addressLineNum = 0;
    const  getter = getRelatedLineNumGetter(address);
    if (getter.type === 'text') {
        const  lineNumGetter = getter as LineNumGetter;
        const  { filePath, lineNum } = await searchAsText(lineNumGetter, address);

        linkableAddress = lineNumGetter.address
            .replace(verbVar.file, filePath.replace(/\\/g, '/'))
            .replace(verbVar.windowsFile, filePath.replace(/\//g, '\\'))
            .replace(verbVar.fragment, '')
            .replace(verbVar.lineNum, lineNum.toString());
            // This format is hyperlinkable in the Visual Studio Code Terminal
        addressLineNum = lineNum;
    }
    else if (getter.type === 'figure') {
        const  figurePointGetter = getter as FigurePointGetter;
        linkableAddress = await getPointedFigurePath(figurePointGetter, address);
    }

    // recommended = ...
    var  recommended = address;
    recommended = recommended.replace(/\$/g,'\\$');  // not expanded $ by address.replace()
    const  lowerCaseDriveRegExp = /^[a-z]:/;
    const  upperCaseDriveRegExp = /^[A-Z]:/;
    const  sortedEnvronmentVariables: KeyValue[] = [];
    const  reservedNames = ['TYPRM_FOLDER'];
    for (const [envName, envValue] of Object.entries(process.env)) {
        if (envName.startsWith(typrmEnvPrefix)  &&  ! reservedNames.includes(envName)  &&  envValue) {
            const  variableName = envName.substring(typrmEnvPrefix.length);
            const  value = envValue!.replace(/\\/g,'/');

            sortedEnvronmentVariables.push({key: variableName, value});
            if (lowerCaseDriveRegExp.test(value)) {
                sortedEnvronmentVariables.push({key: variableName, value:
                    value.substring(0,1).toUpperCase() + value.substring(1)});
            } else if (upperCaseDriveRegExp.test(value)) {
                sortedEnvronmentVariables.push({key: variableName, value:
                    value.substring(0,1).toLowerCase() + value.substring(1)});
            }
        }
    }
    sortedEnvronmentVariables.sort((a: KeyValue, b: KeyValue) => {
        return  b.value.length - a.value.length;  // descending order
    });

    recommended = lib.unexpandVariable(recommended,
        sortedEnvronmentVariables.map((variable) => [`\${${variable.key}}`, variable.value]));
    if (recommended.replace(/\\/g,'/').startsWith(lib.getHomePath().replace(/\\/g,'/'))) {
        recommended = '~' + recommended.substring(lib.getHomePath().length);
    }

    // print the address
    if (option.print  &&  addressLineNum !== notFound) {
        if (recommended !== addressBefore) {
            console.log('Recommend: #ref: ' + recommended);
        }
        console.log(linkableAddress);
    }

    // print the verb menu
    if (addressLineNum !== notFound) {
        var  verbs = getRelatedVerbs(address);
        var  verbMenu = verbs.map((verb) => (verb.label)).join(', ');
        if (verbMenu !== ''  &&  option.print) {
            console.log('    ' + verbMenu);
        }
    } else {
        var  verbs: Verb[] = [];
        var  verbMenu = '';
    }

    return  {
        hasVerbMenu: (verbMenu !== ''),
        verbs,
        address,
        addressLineNum,
    } as PrintRefResult;
}

// getRelatedLineNumGetter
function  getRelatedLineNumGetter(address: string): AbstractLineNumGetter {
    if (process.env.TYPRM_LINE_NUM_GETTER) {

        const  getterConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof getterConfig === 'object'  &&  getterConfig) {
            const  getters = getterConfig as AbstractLineNumGetter[];
            for (const getter of getters) {

                if (new RegExp(getter.regularExpression).test(address)) {
                    return  getter;
                }
            }
        }
    }
    const  verboseMode = 'verbose' in programOptions;

    if (verboseMode) {
        console.log(`Verbose: Not matched address "${address}". Check TYPRM_LINE_NUM_GETTER environment variable.`)
    }
    return  {
        regularExpression: '.*',
        type: '',
        filePathRegularExpressionIndex: 0,
        keywordRegularExpressionIndex: 0,
        address,
    } as LineNumGetter;
}

// getRelatedVerbs
function  getRelatedVerbs(address: string): Verb[] {
    const  relatedVerbs: Verb[] = [];
    if (process.env.TYPRM_VERB) {

        const  verbConfig = yaml.load(process.env.TYPRM_VERB);
        if (typeof verbConfig === 'object'  &&  verbConfig) {
            const  verbs = verbConfig as Verb[];
            for (const verb of verbs) {

                if (new RegExp(verb.regularExpression).test(address)) {
                    relatedVerbs.push(verb);
                }
            }
        }
    }

    if (runningOS === 'Windows') {
        var  command = `explorer /select, "${verbVar.windowsFile}"`;
    } else {
        var  command = `open -R "${verbVar.file}"`;
            // Open the folder by Finder and select the file
    }
    relatedVerbs.push({
        regularExpression: '.*',
        label: '0.Folder',
        number: '0',
        echo: '',
        command,
    } as Verb);

    return  relatedVerbs;
}

// runVerb
function  runVerb(verbs: Verb[], address: string, lineNum: number, verbNum: string) {
    var  command = '';
    const  matchesVerbs = verbs.filter((verb) => (verb.number.toString() === verbNum));
    if (matchesVerbs.length >= 1) {
        const  verb = matchesVerbs[0];
        const  fragmentIndex = address.indexOf('#');
        if (fragmentIndex === notFound) {

            command = verb.command
                .replace(verbVar.ref, address)
                .replace(verbVar.windowsRef, address.replace(/\//g, '\\'))
                .replace(verbVar.file, address)
                .replace(verbVar.windowsFile, address.replace(/\//g, '\\'))
                .replace(verbVar.fragment, '')
                .replace(verbVar.lineNum, lineNum.toString());
            var  fileOrFolderPath = address;
        } else {
            command = verb.command
                .replace(verbVar.ref, address)
                .replace(verbVar.windowsRef,  address.substr(0, fragmentIndex).replace(/\//g, '\\') + address.substr(fragmentIndex))
                .replace(verbVar.file,        address.substr(0, fragmentIndex))
                .replace(verbVar.windowsFile, address.substr(0, fragmentIndex).replace(/\//g, '\\'))
                .replace(verbVar.fragment,    address.substr(fragmentIndex + 1))
                .replace(verbVar.lineNum,     lineNum.toString());
            var  fileOrFolderPath = address.substr(0, fragmentIndex);
        }
        if (runningOS === 'Windows') {
            fileOrFolderPath = fileOrFolderPath.replace(/\//g, '\\');
        }
        fileOrFolderPath = lib.getFullPath(fileOrFolderPath, process.cwd());

        if ( ! fs.existsSync(fileOrFolderPath)) {
            console.log(translate`Error of not found the file or folder at "${getTestablePath(fileOrFolderPath)}"`);
            return
        }
    }
    if (command !== '') {
        execShellCommand(command);
    } else {
        console.log(translate`Error that verb number ${verbNum} is not defined`);
    }
}

// printConfig
function  printConfig() {
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
    for (const [envName, envValue] of Object.entries(process.env)) {
        if (envName.startsWith('TYPRM_')  &&  envName !== 'TYPRM_LINE_NUM_GETTER'  &&  envName !== 'TYPRM_VERB') {

            console.log(`    Verbose: ${envName} = ${envValue}`);
        }
    }
    if (process.env.TYPRM_LINE_NUM_GETTER) {
        const  getterConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof getterConfig === 'object'  &&  getterConfig) {
            const  getters = getterConfig as AbstractLineNumGetter[];
            var  index = 0;
            for (const getter1 of getters) {
                if (getter1.type === 'text') {
                    const  getter = getter1 as LineNumGetter;

                    console.log(`    Verbose: TYPRM_LINE_NUM_GETTER[${index}]:`);
                    console.log(`        Verbose: regularExpression: ${getter.regularExpression}`);
                    console.log(`        Verbose: type: ${getter.type}`);
                    console.log(`        Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
                    console.log(`        Verbose: keywordRegularExpressionIndex: ${getter.keywordRegularExpressionIndex}`);
                    console.log(`        Verbose: csvOptionRegularExpressionIndex: ${getter.csvOptionRegularExpressionIndex}`);
                    console.log(`        Verbose: targetMatchIdRegularExpressionIndex: ${getter.targetMatchIdRegularExpressionIndex}`);
                    console.log(`        Verbose: address: ${getter.address}`);
                    index += 1;
                } else if (getter1.type === 'figure') {
                    const  getter = getter1 as FigurePointGetter;

                    console.log(`    Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
                    console.log(`        Verbose: regularExpression: ${getter.regularExpression}`);
                    console.log(`        Verbose: type: ${getter.type}`);
                    console.log(`        Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
                    console.log(`        Verbose: xExpressionIndex: ${getter.xExpressionIndex}`);
                    console.log(`        Verbose: yExpressionIndex: ${getter.yExpressionIndex}`);
                    console.log(`        Verbose: nameExpressionIndex: ${getter.nameExpressionIndex}`);
                    console.log(`        Verbose: pointerImage: ${getter.pointerImage}`);
                    console.log(`        Verbose: outputFolder: ${getter.outputFolder}`);
                } else {
                    const  getter = getter1;
                    console.log(`    Verbose: TYPRM_LINE_NUM_GETTER[${index}]:`);
                    console.log(`        Verbose: regularExpression: ${getter.regularExpression}`);
                    console.log(`        Verbose: type: ${getter.type} (unknown)`);
                }
            }
        }
    }
    if (process.env.TYPRM_VERB) {
        const  verbConfig = yaml.load(process.env.TYPRM_VERB);
        if (typeof verbConfig === 'object'  &&  verbConfig) {
            const  verbs = verbConfig as Verb[];
            var  index = 0;
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
    const  secretEnvNames = Object.keys(lib.getDotEnvSecrets());
    if (secretEnvNames.length >= 1) {
        for (const envName of secretEnvNames) {
            console.log(`    Verbose: (.env) ${envName} = (secret)`);
        }
        console.log(`    Verbose: ${translate`Envrironment variables defined in ".env" file are not inherit to child processes.`}`);
    }
}

// varidateMutualSearchCommandArguments
function  varidateMutualSearchCommandArguments() {
    if (programArguments.length < 2) {
        throw  new Error('Error: Too few argurments.\n' +
            'typrm mutual-search  __Keywords__"')
    }
}

// onEndOfSettingScope
function  onEndOfSettingScope(setting: Settings, parser: Parser) {
    for (const key of Object.keys(setting)) {
        if ( ! setting[key].isReferenced) {
            parser.flushToTagList();
            console.log('');
            console.log(translate`Warning: ${getTestablePath(parser.filePath)}:${setting[key].lineNum}`);
            console.log(translate`  Not referenced: ${key}`);
            parser.warningCount += 1;
        }
    }
}

// evaluateIfCondition
function  evaluateIfCondition(expression: string, setting: Settings, parser: Parser,
        previsousEvalatedKeyValues: string[] = [])
        : boolean | Error | EvaluatedCondition {

    if (expression === 'true') {
        if (parser.verbose) {
            console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: true`);
        }
        return  true;
    } else if (expression === 'false') {
        if (parser.verbose) {
            console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: false`);
        }
        return  false;
    }
    const  envDot = '$env.';
    var    match: RegExpExecArray | null = null;
    var    parent = '';
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
        const  name = match[1];
        const  operator = match[2];
        var    rightValue = match[3];
        if (parent === settingsDot) {
            if (name in setting) {

                var  leftValue = setting[name].value;
                setting[name].isReferenced = true;
            } else {
                return  new Error(`not found ${name} in the settings`);
            }
        } else if (parent === envDot) {
            const  envValue = process.env[name];
            if (envValue) {

                var  leftValue = envValue;
            } else {
                var  leftValue = '';
            }
        } else { // if no parent
            var  leftValue = '';
        }
        if (rightValue === '""') {
            rightValue = '';
        }

        var  result: boolean | undefined;
        if (operator === '==') {
            result = (leftValue === rightValue);
        } else if (operator === '!=') {
            result = (leftValue !== rightValue);
        }
        if (result !== undefined) {
            if (previsousEvalatedKeyValues.length === 0) {
                if (parser.verbose) {
                    if (parser.command == CommandEnum.replace) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: skipped evaluation: #if: ${expression}`);
                    } else if (parser.command == CommandEnum.check) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: ${expression}  (${result}, ${name} = ${leftValue})`);
                    }
                }

                return  result;
            } else {
                const  isReplacable = previsousEvalatedKeyValues.includes(name)  ||  parent !== settingsDot;
                if (parser.verbose) {
                    if ( ! isReplacable) {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: skipped evaluation: #if: ${expression}`);
                    } else {
                        console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: ${expression}  (${result}, ${name} = ${leftValue})`);
                    }
                }

                return  {
                    result,
                    isReplacable,
                };
            }
        }
    }
    return  new Error('syntax error');
}

class  EvaluatedCondition {
    result: boolean = false;
    isReplacable: boolean = false;
}

namespace  instanceOf {
    export function  EvaluatedCondition(object: any): object is EvaluatedCondition {
        return  object.hasOwnProperty('isReplacable');
    }
}

// getTestablePath
function  getTestablePath(path_: string) {
    if ('test' in programOptions) {
        const  home = lib.getHomePath();

        if (path_.startsWith(home)) {
            return  '${HOME}' + path_.substr(home.length).replace(/\\/g, '/');
        } else if (path_.startsWith(inputFileParentPath + path.sep)  &&  inputFileParentPath !== '') {
            return  '${inputFileParentPath}/' + path_.substr(inputFileParentPath.length + 1).replace(/\\/g, '/');
        } else {
            return  path_.replace(/\\/g, '/');
        }
    } else {
        return  path_;
    }
}

// deleteFile
function  deleteFileSync(path: string) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

// getExpectedLine
function  getExpectedLine(setting: Settings, template: string, options: OptionOfGetExpectedLine = {}): string {
    return  getExpectedLineAndEvaluationLog(setting, template, false, options).expected;
}

// getExpectedLineAndEvaluationLog
function  getExpectedLineAndEvaluationLog(setting: Settings, template: string, withLog: boolean = false,
        options: OptionOfGetExpectedLine  = {}): {expected: string, log: EvaluationLog[]} {
    var  expected = template;
    const  log: EvaluationLog[] = [];

    for (const key of Object.keys(setting).sort((a,b)=>(b.length - a.length))) {
        const  keyRe = new RegExp(lib.escapeRegularExpression( key ), 'g' );
        const  value = setting[key].value.replace(/\$/g,'$$');

        if (keyRe.test(expected)) {
            const  expectedAfter = expected.replace(keyRe, value);

            setting[key].isReferenced = true;
            if ('relatedReferenced' in options) {
                const  relatedKey = getRelatedKey(key);
                if (relatedKey in setting) {
                    setting[relatedKey].isReferenced = true;
                }
            }

            expected = expectedAfter;
            log.push({before: key, after: setting[key].value});
        }
    }
    return  {expected, log};

    function  getRelatedKey(key: string): string {
        if (key.endsWith('(yes)')) {
            var  relatedKey = key.slice(0, -'(yes)'.length) + '(no)';
        } else if (key.endsWith('(no)')) {
            var  relatedKey = key.slice(0, -'(no)'.length) + '(yes)';
        } else {
            var  relatedKey = '';
        }
        return  relatedKey;
    }
}

interface OptionOfGetExpectedLine {
    relatedReferenced?: boolean;
}


// getExpectedLineInFileTemplate
function  getExpectedLineInFileTemplate(setting: Settings, lineInTemplate: string, parser: Parser): string {
    const  templateTag = parseTemplateTag(lineInTemplate, parser);
    if (templateTag.isFound) {
        const  settingWithSecrets = mergeSecretEnvironmentVariable(setting);
        const  before = getExpectedLine(setting, templateTag.template);
        const  after = getExpectedLine(settingWithSecrets, templateTag.template);

        var  expected = lineInTemplate.substring(0, templateTag.indexInLine).replace(before, after).trimRight();
    } else {
        var  expected = lineInTemplate;
    }
    return  expected;
}

// getReplacedLine
function  getReplacedLine(setting: Settings, template: string): string {
    const  replacedSetting: Settings = {};
    for (const key of Object.keys(setting)) {
        var  value = setting[key].value;
        replacedSetting[key] = { value,  isReferenced: true /*dummy*/,  tag: 'toAfterTemplate',
            lineNum: 0 /*dummy*/,  settingsIndex: '' };
    }

    return  getExpectedLine(replacedSetting, template);
}

// evaluateSettingsDotVariable
// e.g.
// this.parsingCopyTag.value = 'copyName, {argument: $settings.var}'
// replacedCopyTagValue = 'copyName, {argument: value}'
function  evaluateSettingsDotVariable(expression: string, setting: Settings): {evaluated: string, isError: boolean} {
    const  dollerSettingsIndex = expression.indexOf(settingsDot);
    if (dollerSettingsIndex === notFound) {
        return  {evaluated: expression, isError: false};
    }
    const  variableNameIndex = dollerSettingsIndex + settingsDot.length;

    for (const variableName of Object.keys(setting).sort((a,b)=>(b.length - a.length))) {
        if (expression.indexOf(variableName, variableNameIndex) !== notFound) {
            setting[variableName].isReferenced = true;

            return  {
                evaluated: expression.replace(`${settingsDot}${variableName}`, setting[variableName].value),
                isError: false
            };
        }
    }
    return  {evaluated: expression, isError: true};
}

// getReplacedCopyTagContents
// copyTag.contents.
function  getReplacedCopyTagContents(copyTag: CopyTag.Properties, sourceCopyTag: CopyTag.Properties, parameters: {[name: string]: string}): string[] {
    if (Object.keys(copyTag.arguments).length === 0) {

        return  copyTag.contents;
    } else {
        const  emptySetting = {lineNum: 0, settingsIndex: '', tag: 'copyArgument', isReferenced: true};
        const  replacedContents: string[] = [];
        const  parser = new Parser();
        const  replacingKeys = Object.keys(sourceCopyTag.arguments);
        const  key = 0, value = 1;
        function  toSetting(value: string): Setting {
            return  {... {value}, ... emptySetting} as Setting;
        }
        const  oldSetting = Object.fromEntries(Object.entries
            ( sourceCopyTag.arguments ).map(keyValue=>[ keyValue[key], toSetting(keyValue[value]) ]));
        const  newSetting = Object.fromEntries(Object.entries
            ( {... sourceCopyTag.arguments, ... parameters} ).map(keyValue=>[ keyValue[key], toSetting(keyValue[value]) ]));

        for (let lineNum = 1;  lineNum <= sourceCopyTag.contents.length;  lineNum += 1) {
            const  sourceLine = sourceCopyTag.contents[lineNum - 1];
            const  replacingLine = copyTag.contents[lineNum - 1];
            const  templateTag = parseTemplateTag(sourceLine, parser);
            if (templateTag.isFound  &&  templateTag.includesKey(replacingKeys)) {
                var  expected = getExpectedLine(oldSetting, templateTag.template);
                var  replaced = getReplacedLine(newSetting, templateTag.template);
                if (replacingLine.includes(expected)) {

                    var    replacedLine = replacingLine.replace(new RegExp(lib.escapeRegularExpression(expected),'g'), replaced.replace(/\$/g,'$$'));
                    const  templateTagIndex = tagIndexOf(replacedLine, templateLabel);
                    replacedLine = replacedLine.substring(0, templateTagIndex).trimRight();

                    replacedContents.push(replacedLine);
                } else {
                    replacedContents.push(replacingLine);
                }
            } else {
                replacedContents.push(sourceLine);
            }
        }

        return  replacedContents;
    }
}

// mergeSecretEnvironmentVariable
function  mergeSecretEnvironmentVariable(settings: Settings): Settings {
    const  settingsAndEnv = Object.assign({}, settings);

    for (const [envName, envValue] of Object.entries(lib.getProcessEnvAndDotEnvSecrets())) {
        const  value: Setting = {
            value: envValue || '(no_value)',
            lineNum: 0,
            settingsIndex: '/',
            tag: 'env',
            isReferenced: true,
        };

        settingsAndEnv[`$env.{${envName}}`] = value;
        settingsAndEnv[`$env.${envName}`] = value;
    }

    return  settingsAndEnv;
}

// evaluateEnvironmentVariable
async function  evaluateEnvironmentVariable(lines: string[], filePath: string, linesLineNum: number): Promise<string[]> {
    const  evaluatedLines: string[] = [];
    const  parser = new Parser();
    parser.command = CommandEnum.search;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = filePath;

    const  settingsTree = await makeSettingTree(parser);
    const  reader = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    parser.lineNum = 0;

    for await (const line1 of reader) {
        parser.lineNum += 1;
        settingsTree.moveToLine(parser);

        if (parser.lineNum == linesLineNum) {
            for (const replacingLine of lines) {

                evaluatedLines.push(getExpectedLineInFileTemplate(
                    settingsTree.currentSettings, replacingLine, parser));
            }
        }
    }

    return  evaluatedLines;
}

// tagIndexOf
// /(^| )tag/
function  tagIndexOf(line: string, tag: string): number {
    var  index = -1;
    for (;;) {
        index = line.indexOf(tag, index + 1);
        if (index <= 0  ||  line[index - 1] === ' ') {
            return  index;
        }
    }
}

// getValue
function  getValue(line: string, separatorIndex: number = -1) {

    var  value = line.substring(separatorIndex + 1).trim();
    if (value[0] === '#') {
        var  comment = 0;
    } else {
        var  comment = value.indexOf(' #');
    }
    if (comment !== notFound) {

        value = value.substr(0, comment).trim();
    }

    value = unscapePercentByte(value);
    return  value;
}

// unscapePercentByte
function  unscapePercentByte(value: string): string {
    var  found = 0;
    for (;;) {
        const  found20 = value.indexOf('"%20"', found);
        const  found25 = value.indexOf('"%25"', found);
        if (found20 !== notFound) {
            if (found25 !== notFound) {
                if (found20 < found25) {
                    value = value.replace('"%20"', ' ');
                    found = found20 + 1;
                } else {
                    value = value.replace('"%25"', '%');
                    found = found25 + 1;
                }
            } else {
                value = value.replace('"%20"', ' ');
                found = found20 + 1;
            }
        } else {
            if (found25 !== notFound) {
                value = value.replace('"%25"', '%');
                found = found25 + 1;
            } else {
                break;
            }
        }
    }
    return  value;
}

// hasRefTag
function  hasRefTag(keywords: string) {
    return  keywords.trim().startsWith(refLabel);
}

// hasCheckTag
function  hasCheckTag(keywords: string) {
    keywords = keywords.trim();
    return  keywords === '#c'  ||  keywords.startsWith('#c ')  ||
        keywords === checkTag  ||  keywords.startsWith(`${checkTag} `);
}

// hasReplaceTag
function  hasReplaceTag(keywords: string) {
    keywords = keywords.trim();
    return  keywords === '#r'  ||  keywords.startsWith('#r ')  ||
        keywords === replaceTag  ||  keywords.startsWith(`${replaceTag} `);
}

// hasResetTag
function  hasResetTag(keywords: string) {
    keywords = keywords.trim();
    return  keywords === resetTag  ||  keywords.startsWith(`${resetTag} `);
}

// hasMutualTag
function  hasMutualTag(keywords: string) {
    keywords = keywords.trim();
    return  keywords === mutualTag  ||  keywords.startsWith(`${mutualTag} `);
}

// hasNumberTag
function  hasNumberTag(keywords: string) {
    const  numberRegularExpression = /^[0-9]+$/;
    keywords = keywords.trim();

    return  keywords[0] === '#'  &&  numberRegularExpression.test( keywords.substring(1) );
}

// hasCommandSymbol
function  hasShellCommandSymbol(keywords: string) {
    return  keywords[0] === programOptions.commandSymbol  &&  keywords[1] === ' ';
}

// getNotSetTemplateIfTagVariableNames
function  getNotSetTemplateIfTagVariableNames(settingKeys: string[]) {
    if (settingKeys.includes(templateIfYesKey)) {
        if (settingKeys.includes(templateIfNoKey)) {
            var  notSetNames = '';
        } else {
            var  notSetNames = templateIfNoKey;
        }
    } else {
        if (settingKeys.includes(templateIfNoKey)) {
            var  notSetNames = templateIfYesKey;
        } else {
            var  notSetNames = `${templateIfYesKey} ${translate('and')} ${templateIfNoKey}`;
        }
    }
    return  notSetNames;
}

// parseTemplateTag
function  parseTemplateTag(line: string, parser: Parser): TemplateTag {
    const  tag = new TemplateTag(parser);
    tag.parseLine(line);
    return  tag;
}

// parseKeyName
function  parseKeyName(line: string): string {

    const  colon = line.indexOf(':');
    if (colon === notFound) {
        return  '';
    }
    const  lineHead = line.substr(0, colon).trim();
    if (lineHead[0] === '-') {
        var  csv = lineHead.substr(1).trim();  // cut '-'
    } else {
        var  csv = lineHead;
    }

    return  csv;
}

// cutQuotation
// Example: 'abc' ⇨ abc, "abc" ⇨ abc, 'ab'c ⇨ 'ab'c
function  cutQuotation(str: string) {
    if (str.startsWith("'") && str.endsWith("'")) {
        return  str.substr(1, str.length - 2);
    } else if (str.startsWith('"') && str.endsWith('"')) {
        return  str.substr(1, str.length - 2);
    } else {
        return  str;
    }
}

// cutTag
function  cutTag(line: string): string {
    if (line[0] === '#') {
        var  separatorIndex = line.indexOf(' ');
        if (separatorIndex === notFound) {
            separatorIndex = line.indexOf(':');
        }
        if (separatorIndex === notFound) {
            return  '';
        }

        return  line.substring(separatorIndex + 1).trim();
    } else {
        return  line;
    }
}

// isBackSlashParameter
// Example:
//    ( '\na', 0 ) === false
//    ( '\na', 1 ) === true
//    ( '\na', 2 ) === false
// #keyword: isBackSlashParameter
function  isBackSlashParameter(checkingString: string, index: number): boolean {
    const  startIndex = index;
    do {
        index -= 1;
        if (index < 0) {
            break;
        }
    } while (checkingString[index] === '\\');
    const  backSlashCount = startIndex - index - 1;

    return  (backSlashCount % 2 === 1);
}

// CommandEnum
enum CommandEnum {
    unknown,
    check,
    replace,
    search,
}

// SettingsTree
class SettingsTree {
    indices = new Map</*startLineNum*/ number, string>();  // e.g. { 1: "/",  4: "/1",  11: "/1/1",  14: "/1/2",  17: "/2" }
    indicesWithIf = new Map</*startLineNum*/ number, string>();  // e.g. { 1: "/",  3: "/1/a",  4: "/1",  7: "/1/a" }
    outOfFalseBlocks = new Map</*lineNum*/ number, boolean>();  // #search: outOfFalseBlocks
    settings: {[index: string]: {[name: string]: Setting}} = {};
    settingsInformation: {[index: string]: SettingsInformation} = {};

    // current: current line moved by "moveToLine" method
    wasChanged = false;
    currentSettings: {[name: string]: Setting} = {};
    currentSettingIndex = '/';
    currentIsOutOfFalseBlock: boolean = true;  // by settings before replaced
    outOfScopeSettingIndices: string[] = [];  // This is set when previous line is in scope

    // next: next for "moveToLine" method
    nextSettingsLineNum = 1;
    nextLineNumIndex = 0;
    nextIfLineNumIndex: number = 0;
    nextIfLineNum: number = 1;

    moveToLine(parser: Parser) {
        Object.assign(this, this.moveToLine_Immutably(parser));
    }
    moveToLine_Immutably(parser: Readonly<Parser>): SettingsTree_for_moveToLine {
        const  settingsTree = this as Readonly<SettingsTree>;
        const  return_: SettingsTree_for_moveToLine = {
            outOfFalseBlocks:    settingsTree.outOfFalseBlocks,
            wasChanged:          false,
            currentSettings:     settingsTree.currentSettings,
            currentSettingIndex: settingsTree.currentSettingIndex,
            currentIsOutOfFalseBlock: settingsTree.currentIsOutOfFalseBlock,
            outOfScopeSettingIndices: [],
            nextLineNumIndex:    settingsTree.nextLineNumIndex,
            nextSettingsLineNum: settingsTree.nextSettingsLineNum,
            nextIfLineNumIndex:  settingsTree.nextIfLineNumIndex,
            nextIfLineNum:       settingsTree.nextIfLineNum,
        };
        const  lineNum = parser.lineNum;

        var  outOfFalseBlocks: Map</*lineNum*/ number, boolean> = settingsTree.outOfFalseBlocks;

        if (lineNum === 1  ||  lineNum === settingsTree.nextSettingsLineNum) {
            if (lineNum === 1) {
                var  previousSettingIndex = '';
            } else {
                var  previousSettingIndex = settingsTree.currentSettingIndex;
            }
            const  currentSettingIndex = settingsTree.indices.get(parser.lineNum)!;  // e.g. "/a/bc"
            const  currentSettingIndexSlash = `${currentSettingIndex}/`;  // e.g. "/a/bc/"
            return_.currentSettingIndex = currentSettingIndex;
            outOfFalseBlocks = new Map</*lineNum*/ number, boolean>();

            var  outOfScopeSettingIndices = [];
            var  previousParentIndex = previousSettingIndex;  // e.g. "/a/b/d/e"
            while ( ! currentSettingIndexSlash.startsWith(`${previousParentIndex}/`)  &&  previousParentIndex !== '/') {
                    // e.g. previousParentIndex == "/a", not "/a/b"
                    // The last slash is in order not to match a part of folder name.

                outOfScopeSettingIndices.push(previousParentIndex);
                previousParentIndex = path.dirname(previousParentIndex);
            }
            return_.outOfScopeSettingIndices = outOfScopeSettingIndices;

            var  currentSettings: {[name: string]: Setting} = {};
            var  parentIndex = '/';
            var  separatorPosition = 0;
            const  parentIndices: string[] = [];
            for (;;) {  // parentIndex loop
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
                const  parentSetting = settingsTree.settings[parentIndex];

                currentSettings = { ... currentSettings, ... parentSetting };

                const  r = settingsTree.addCurrentSettingsInIfTag_Immutably(
                    parentIndex, currentSettings, parser);
                currentSettings = { ... currentSettings, ... r.currentSettings };
                outOfFalseBlocks = new Map([... outOfFalseBlocks, ... r.outOfFalseBlocks]);
            }
            return_.currentSettings = currentSettings;
            const  startLineNums = Array.from(settingsTree.indices.keys());
            if (lineNum === 1) {
                return_.nextLineNumIndex = 0;
            }
            if (return_.nextLineNumIndex < startLineNums.length) {
                return_.nextLineNumIndex += 1;

                return_.nextSettingsLineNum = startLineNums[return_.nextLineNumIndex];
            } else {
                return_.nextSettingsLineNum = 0;
            }
            if (parser.verbose) {
                const  indexLabel = `"${currentSettingIndex}"${currentSettingIndex === '/' ? ' (root)' : ''}`;
                console.log(`    Verbose: settings ${indexLabel}`);
                console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${lineNum}: settings: ${indexLabel}`);
                for (const [key, setting] of Object.entries(currentSettings)) {
                    console.log(`        Verbose: ${getTestablePath(parser.filePath)}:${setting.lineNum}:     ${key}: ${setting.value}`);
                }
            }
            return_.wasChanged = true;
        }
        if (lineNum === 1  ||  lineNum === settingsTree.nextIfLineNum) {

            return_.currentIsOutOfFalseBlock = outOfFalseBlocks.get(lineNum)!;
            const  startLineNums = Array.from(settingsTree.indicesWithIf.keys());
            if (lineNum === 1) {
                return_.nextIfLineNumIndex = 0;
            }
            if (return_.nextIfLineNumIndex < startLineNums.length) {
                return_.nextIfLineNumIndex += 1;

                return_.nextIfLineNum = startLineNums[return_.nextIfLineNumIndex];
            } else {
                return_.nextIfLineNum = 0;
            }
        }
        return_.outOfFalseBlocks = outOfFalseBlocks;

        return  return_;
    }

    addCurrentSettingsInIfTag_Immutably(
        currentIndex: string,
        currentSettings: Readonly<{[name: string]: Setting}>,
        parser: Parser)
    : SettingsTree_addCurrentSettingsInIfTag {
        const  settingsTree = this as Readonly<SettingsTree>;
        const  return_: SettingsTree_addCurrentSettingsInIfTag = {
            currentSettings: currentSettings,
            outOfFalseBlocks: new Map</*lineNum*/ number, boolean>(),
        };
        var    currentSettings = currentSettings;
        const  outOfFalseBlocks = new Map</*lineNum*/ number, boolean>();
        const  notVerboseParser = new Parser();
        Object.assign(notVerboseParser, {... parser, verbose: false, ifTagErrorMessageIsEnabled: false});
        const  ifTagParser = new IfTagParser(notVerboseParser);
        if (currentIndex === '/') {
            var  currentIndexSlash = '/';
        } else {
            var  currentIndexSlash = currentIndex + '/';
        }
        const  disabledFalseIndex = '!';  // startsWith(falseIndex) returns false
        var    falseIndex = disabledFalseIndex;
        var    isInCurrentSetting = false;
        for (const [lineNumInBlock, indexInBlock] of Array.from(settingsTree.indicesWithIf.entries())) {

            // isInCurrentSetting = ( index === currentIndex + '/*' )
            if ( ! isInCurrentSetting) {
                if (indexInBlock === currentIndex) {  // at current index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                }
                isInCurrentSetting = (path.dirname(indexInBlock) === currentIndex  &&
                    lib.isAlphabetIndex(indexInBlock));
            } else {
                isInCurrentSetting = (
                    (
                        indexInBlock.startsWith(currentIndexSlash)  &&
                        lib.isAlphabetIndex(indexInBlock.substr(currentIndexSlash.length, 1))
                    )
                );
                if ( ! isInCurrentSetting) {  // at next index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                }
            }
            if (isInCurrentSetting) {
                const  outOfFalseBock = ! indexInBlock.startsWith(falseIndex);
                if (outOfFalseBock) {
                    var  condition = settingsTree.settingsInformation[indexInBlock].condition;
                    if (condition === '') {
                        condition = 'true';
                    }
                    ifTagParser.setPosition(parser.filePath, condition, lineNumInBlock);

                    ifTagParser.evaluate(`#if: ${condition}`, currentSettings);
                    if (ifTagParser.thisIsOutOfFalseBlock) {  // #if: true
                        currentSettings = {... currentSettings, ... settingsTree.settings[indexInBlock]};
                        falseIndex = disabledFalseIndex;
                    } else {  // #if: false
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
        return  return_;
    }

    moveToEndOfFile() {
        this.outOfScopeSettingIndices = [];
        const  previousSettingIndex = this.currentSettingIndex;
        var    previousParentIndex = previousSettingIndex;
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
interface  SettingsTree_for_moveToLine {
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
    wasChanged: boolean;
    currentSettings: {[name: string]: Setting};
    currentSettingIndex: string;
    currentIsOutOfFalseBlock: boolean;
    outOfScopeSettingIndices: string[];
    nextLineNumIndex: number;
    nextSettingsLineNum: number;
    nextIfLineNumIndex: number;
    nextIfLineNum: number;
};
interface  SettingsTree_addCurrentSettingsInIfTag {
    currentSettings: {[name: string]: Setting},
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
};

// ReplaceToTagTree
class  ReplaceToTagTree {
    replaceTo: {[index: string]: {[name: string]: Setting}} = {};
    outOfFalseBlocks = new Map</*lineNum*/ number, boolean>();
    outOfFalseBlocksByOriginalTag = new Map</*lineNum*/ number, boolean>();
    command: 'replace' | 'reset' = 'replace';
    get replaceToLength(): number {
        return  Object.values(this.replaceTo).reduce((sum, settings) => sum + Object.values(settings).length,  0);
    }

    // current: current line moved by "moveToLine" method
    currentNewSettings:  {[name: string]: Setting} = {};  // to tag. It includes settings before replace
    currentNewSettingsByOriginalTag:  {[name: string]: Setting} = {};  // original tag. It does not include other than original tag
    currentOldSettingsInIfBlock: {[name: string]: Setting} = {};  // before replaced in current if block out of settings
    currentNewSettingsInIfBlock: {[name: string]: Setting} = {};  // after  replaced in current if block out of settings
    currentIsOutOfFalseBlock: boolean = false;  // true means that to replace is enabled
    currentNotFoundNameInSameAsTag: NotFoundNameInSameAsTag[] = [];

    // next: next for "moveToLine" method
    nextLineNumIndex: number = 0;
    nextSettingsLineNum: number = 1;
    nextIfLineNumIndex: number = 0;
    nextIfLineNum: number = 1;

    moveToLine(parser: Parser, settingsTree: SettingsTree) {
        Object.assign(this, this.moveToLine_Immutably(parser, settingsTree));
    }
    moveToLine_Immutably(parser: Parser, settingsTree: Readonly<SettingsTree>): ReplaceToTagTree_for_moveToLine {
        // "settingsTree" must be called "moveToLine" method.
        const  toTagTree: Readonly<ReplaceToTagTree> = this;
        const  return_: ReplaceToTagTree_for_moveToLine = {
            currentNewSettings:               toTagTree.currentNewSettings,
            currentNewSettingsByOriginalTag:  toTagTree.currentNewSettingsByOriginalTag,
            currentOldSettingsInIfBlock:      toTagTree.currentOldSettingsInIfBlock,
            currentNewSettingsInIfBlock:      toTagTree.currentNewSettingsInIfBlock,
            currentNotFoundNameInSameAsTag:   toTagTree.currentNotFoundNameInSameAsTag,
            nextLineNumIndex:               toTagTree.nextLineNumIndex,
            nextSettingsLineNum:            toTagTree.nextSettingsLineNum,
            outOfFalseBlocks:               toTagTree.outOfFalseBlocks,
            outOfFalseBlocksByOriginalTag:  toTagTree.outOfFalseBlocksByOriginalTag,
            currentIsOutOfFalseBlock:       toTagTree.currentIsOutOfFalseBlock,
            nextIfLineNumIndex:             toTagTree.nextIfLineNumIndex,
            nextIfLineNum:                  toTagTree.nextIfLineNum,
        };
        const  lineNum = parser.lineNum;
        var    outOfFalseBlocks: Map</*lineNum*/ number, boolean> = toTagTree.outOfFalseBlocks;
        var    outOfFalseBlocksByOriginalTag: Map</*lineNum*/ number, boolean> = toTagTree.outOfFalseBlocksByOriginalTag;

        // Set "currentNewSettings" or "currentNewSettingsByOriginalTag".
        if (lineNum === 1  ||  lineNum === toTagTree.nextSettingsLineNum) {  // settingsTree.indices

            outOfFalseBlocks = new Map</*lineNum*/ number, boolean>();
            outOfFalseBlocksByOriginalTag = new Map</*lineNum*/ number, boolean>();
            const  index = settingsTree.currentSettingIndex;
            var    parentIndex = '/';
            var    separatorPosition = 0;
            var    currentNewSettings: {[name: string]: Setting} = {}
            var    currentNewSettingsByOriginalTag: {[name: string]: Setting} = {}
            const  parentIndices: string[] = [];
            for (;;) {  // parentIndex loop
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
                const  parentSetting = settingsTree.settings[parentIndex];
                const  parentToTags = toTagTree.replaceTo[parentIndex];

                if (this.command === 'replace') {
                    currentNewSettings = { ... currentNewSettings, ... parentSetting };
                    currentNewSettings = { ... currentNewSettings, ... parentToTags };
                } else {  // if (this.command === 'reset') {
                    currentNewSettingsByOriginalTag = { ... currentNewSettingsByOriginalTag, ... parentSetting };
                    currentNewSettingsByOriginalTag = { ... currentNewSettingsByOriginalTag, ... parentToTags };
                }

                const  r = toTagTree.addCurrentSettingsInIfBlock_Immutably(　// out of if tag
                    parentIndex, currentNewSettings, currentNewSettingsByOriginalTag, settingsTree, parser);
                if (this.command === 'replace') {
                    currentNewSettings = { ... currentNewSettings, ... r.currentNewSettings };
                    outOfFalseBlocks = new Map([... outOfFalseBlocks, ... r.outOfFalseBlocks]);
                } else {  // if (this.command === 'reset') {
                    currentNewSettingsByOriginalTag = { ... currentNewSettingsByOriginalTag, ... r.currentNewSettingsByOriginalTag };
                    outOfFalseBlocksByOriginalTag = new Map([... outOfFalseBlocksByOriginalTag, ... r.outOfFalseBlocksByOriginalTag]);
                }
            }
            const  variableNamesBefore = Object.keys(settingsTree.currentSettings);
            if (this.command === 'replace') {
                var  variableNamesAfter = Object.keys(currentNewSettings);
            } else {  // if (this.command === 'reset') {
                var  variableNamesAfter = Object.keys(currentNewSettingsByOriginalTag);
            }
            const  addedVariableNames = variableNamesAfter.filter((element) => (variableNamesBefore.indexOf(element) === -1))
            const  removedVariableNames = variableNamesBefore.filter((element) => (variableNamesAfter.indexOf(element) === -1))

            if (addedVariableNames.length >= 1) {
                const  settingsLineNum = settingsTree.settingsInformation[settingsTree.currentSettingIndex].lineNum;
                console.log('');
                console.log(`${getTestablePath(parser.filePath)}:${settingsLineNum}: settings`);
                console.log(`    ${translate('Error')}: ${translate('Defined variables are increased')}`);
                console.log(`    ${translate('New defined variables')}: ${addedVariableNames.join(', ')}`);
                parser.errorCount += 1;
            }
            if (removedVariableNames.length >= 1) {
                const  settingsLineNum = settingsTree.settingsInformation[settingsTree.currentSettingIndex].lineNum;
                console.log('');
                console.log(`${getTestablePath(parser.filePath)}:${settingsLineNum}: settings`);
                console.log(`    ${translate('Error')}: ${translate('Defined variables are decreased')}`);
                console.log(`    ${translate('Not defined variables')}: ${removedVariableNames.join(', ')}`);
                parser.errorCount += 1;
            }
            return_.currentNewSettings = currentNewSettings;
            return_.currentNewSettingsByOriginalTag = currentNewSettingsByOriginalTag;
            const  startLineNums = Array.from(settingsTree.indices.keys());
            if (lineNum === 1) {
                return_.nextLineNumIndex = 0;
            }
            if (return_.nextLineNumIndex < startLineNums.length) {
                return_.nextLineNumIndex += 1;

                return_.nextSettingsLineNum = startLineNums[return_.nextLineNumIndex];
            } else {
                return_.nextSettingsLineNum = 0;
            }
        }

        // Set "currentOldSettingsInIfBlock" and "currentNewSettingsInIfBlock".
        if (lineNum === 1  ||  lineNum === toTagTree.nextIfLineNum) {  // settingsTree.indicesWithIf

            if (this.command === 'replace') {
                return_.currentIsOutOfFalseBlock = outOfFalseBlocks.get(lineNum)!;
            } else {  // if (this.command === 'reset') {
                return_.currentIsOutOfFalseBlock = outOfFalseBlocksByOriginalTag.get(lineNum)!;
            }

            const  currentIndexWithIf = settingsTree.indicesWithIf.get(lineNum)!;  // e.g. /1/2/a/b
            if ( ! lib.isAlphabetIndex(currentIndexWithIf)) {

                return_.currentOldSettingsInIfBlock = settingsTree.currentSettings;
                if (this.command === 'replace') {
                    return_.currentNewSettingsInIfBlock = return_.currentNewSettings;
                } else {  // if (this.command === 'reset') {
                    return_.currentNewSettingsInIfBlock = return_.currentNewSettingsByOriginalTag;
                }
            } else {
                var    parentIndex = currentIndexWithIf;

                // Set "variablesInCondition"
                const  variablesInCondition: string[] = []
                while (lib.isAlphabetIndex(parentIndex)) {  // parentIndex loop
                    const  ifTag = settingsTree.settingsInformation[parentIndex];
                    if (ifTag.condition !== ''  &&  ! ifTag.inSettings) {
                        // e.g. $settings.__Stage__ == develop
                        // e.g. $settings.__Stage__ != develop
                        var  match: RegExpExecArray | null = /\$settings.([^ ]*) *(==|!=) *([^ ].*)/.exec(ifTag.condition);
                        if (match) {

                            variablesInCondition.push(match[1]);
                        }
                    }
                    parentIndex = path.dirname(parentIndex);  // e.g. /1/2
                }

                // Set "currentSettingsInIfBlock"
                const  currentSettingsInIfBlock: {[name: string]: Setting} = {};
                if (this.command === 'replace') {
                    for (const name of Object.keys(settingsTree.currentSettings)) {
                        if (variablesInCondition.includes(name)) {
                            currentSettingsInIfBlock[name] = toTagTree.currentNewSettings[name];
                        } else {
                            currentSettingsInIfBlock[name] = settingsTree.currentSettings[name];
                        }
                    }
                } else {  // if (this.command === 'reset') {
                    for (const name of Object.keys(settingsTree.currentSettings)) {
                        currentSettingsInIfBlock[name] = settingsTree.currentSettings[name];
                    }
                }

                // Set "toTagTreeInIfBlock"
                var  toTagTreeInIfBlock = new ReplaceToTagTree();
                Object.assign(toTagTreeInIfBlock, toTagTree);
                toTagTreeInIfBlock.replaceTo = {};
                for (const index of Object.keys(settingsTree.settings)) {
                    toTagTreeInIfBlock.replaceTo[index] = {};
                    for (const name of Object.keys(settingsTree.settings[index])) {

                        if (this.command === 'replace') {
                            if (name in toTagTree.replaceTo[index]) {
                                if (variablesInCondition.includes(name)) {
                                    toTagTreeInIfBlock.replaceTo[index][name] = toTagTree.replaceTo[index][name];
                                } else {
                                    toTagTreeInIfBlock.replaceTo[index][name] = settingsTree.settings[index][name];
                                }
                            }
                        } else {  // if (this.command === 'reset') {
                            if (variablesInCondition.includes(name)) {
                            } else {
                                if (name in toTagTree.replaceTo[index]) {
                                    toTagTreeInIfBlock.replaceTo[index][name] = toTagTree.replaceTo[index][name];
                                }
                            }
                        }
                    }
                }

                // Set "currentOldSettingsInIfBlock" and "currentNewSettingsInIfBlock"
                if (this.command === 'replace') {
                    const  r = toTagTreeInIfBlock.addCurrentSettingsInIfBlock_Immutably(　// in if tag and out of if tag
                        settingsTree.currentSettingIndex, currentSettingsInIfBlock, {},
                        settingsTree, parser);
                    return_.currentOldSettingsInIfBlock = {... r.currentNewSettings };
                    return_.currentNewSettingsInIfBlock = toTagTree.currentNewSettings;
                } else {  // if (this.command === 'reset') {
                    const  r = toTagTreeInIfBlock.addCurrentSettingsInIfBlock_Immutably(　// in if tag and out of if tag
                        settingsTree.currentSettingIndex, {}, currentSettingsInIfBlock,
                        settingsTree, parser);
                    return_.currentOldSettingsInIfBlock = settingsTree.currentSettings;
                    return_.currentNewSettingsInIfBlock = {... r.currentNewSettingsByOriginalTag };
                }
            }

            // return_.nextIfLineNum = ...
            if (lineNum === 1) {
                return_.nextIfLineNumIndex = 0;
            }
            const  startLineNums = Array.from(settingsTree.indicesWithIf.keys());
            if (return_.nextIfLineNumIndex < startLineNums.length) {
                return_.nextIfLineNumIndex += 1;

                return_.nextIfLineNum = startLineNums[return_.nextIfLineNumIndex];
            } else {
                return_.nextIfLineNum = 0;
            }
            const  value = 1;
            return_.currentNotFoundNameInSameAsTag = [];

            const  sameAsSettings = Object.entries
                (return_.currentNewSettings).filter(keyValue => keyValue[value].sameAs);
            for (const [settingName, setting] of sameAsSettings) {
                const  r = SameAsTag.evaluateVariableName(setting.sameAs!, return_.currentNewSettings);
                if (r.variableName in return_.currentNewSettings) {

                    return_.currentNewSettings[settingName] = return_.currentNewSettings[r.variableName];
                } else {
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
        return  return_;
    }

    addCurrentSettingsInIfBlock_Immutably(
        currentIndex: string,
        currentNewSettings: Readonly<{[name: string]: Setting}>,
        currentNewSettingsByOriginalTag: Readonly<{[name: string]: Setting}>,
        settingsTree: Readonly<SettingsTree>,
        parser: Parser)
    : ReplaceToTagTree_for_addCurrentSettingsInIfBlock {
    // Add setting in if blocks. e.g. Add settings in /1/a, /1/b.
        const  toTagTree: Readonly<ReplaceToTagTree> = this;
        const  return_: ReplaceToTagTree_for_addCurrentSettingsInIfBlock = {
            currentNewSettings: currentNewSettings,
            currentNewSettingsByOriginalTag: currentNewSettingsByOriginalTag,
            outOfFalseBlocks: new Map</*lineNum*/ number, boolean>(),
            outOfFalseBlocksByOriginalTag: new Map</*lineNum*/ number, boolean>(),
        };
        var    newSettings = currentNewSettings;
        var    newSettingsByOriginalTag = {... currentNewSettingsByOriginalTag };
        const  outOfFalseBlocks = new Map</*lineNum*/ number, boolean>();
        const  outOfFalseBlocksByOriginalTag = new Map</*lineNum*/ number, boolean>();
        const  notVerboseParser = new Parser();
        Object.assign(notVerboseParser, {... parser, verbose: false, ifTagErrorMessageIsEnabled: false});
        const  ifTagParserForNewSettings = new IfTagParser(notVerboseParser);
        const  ifTagParserForOldSettings = new IfTagParser(notVerboseParser);
        if (currentIndex === '/') {
            var  currentIndexSlash = '/';
        } else {
            var  currentIndexSlash = currentIndex + '/';
        }
        const  disabledFalseIndex = '!';  // startsWith(falseIndex) returns false
        var    falseIndexWhenOldSettings = disabledFalseIndex;
        var    falseIndexWhenNewSettings = disabledFalseIndex;
        var    isInCurrentSetting = false;

        for (const [lineNumInBlock, indexInBlock] of Array.from(settingsTree.indicesWithIf.entries())) {
            // If isInCurrentSetting == true  &&  currentIndex = '/1'
            // then  indexInBlock = [ '/1/a', '/1/b', '/1/c', ... ].

            // isInCurrentSetting = ( index === currentIndex + '/*' )
            if ( ! isInCurrentSetting) {
                if (indexInBlock === currentIndex) {  // at current index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                    outOfFalseBlocksByOriginalTag.set(lineNumInBlock, true);
                }
                isInCurrentSetting = (path.dirname(indexInBlock) === currentIndex  &&
                    lib.isAlphabetIndex(indexInBlock));
            } else {
                isInCurrentSetting = (
                    (
                        indexInBlock.startsWith(currentIndexSlash)  &&
                        lib.isAlphabetIndex(indexInBlock.substr(currentIndexSlash.length, 1))
                    )
                );
                if ( ! isInCurrentSetting) {  // at next index without alphabet
                    outOfFalseBlocks.set(lineNumInBlock, true);
                    outOfFalseBlocksByOriginalTag.set(lineNumInBlock, true);
                }
            }
            if (isInCurrentSetting) {
                if (this.command === 'replace') {
                    const  outOfFalseBlock = ! indexInBlock.startsWith(falseIndexWhenNewSettings);
                    if (outOfFalseBlock) {

                        // newSettings = ...
                        var  condition = settingsTree.settingsInformation[indexInBlock].condition;
                        if (condition === '') {
                            condition = 'true';
                        }
                        var  settingsForIf = newSettings;

                        ifTagParserForNewSettings.evaluate(`#if: ${condition}`, settingsForIf);
                        if (ifTagParserForNewSettings.thisIsOutOfFalseBlock) {  // #if: true

                            newSettings = {... newSettings, ... settingsTree.settings[indexInBlock]};
                            newSettings = {... newSettings, ... toTagTree.replaceTo[indexInBlock]};
                            falseIndexWhenNewSettings = disabledFalseIndex;
                        } else {  // #if: false
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
                    var  condition = settingsTree.settingsInformation[indexInBlock].condition;
                    if (condition === '') {
                        condition = 'true';
                    }

                    const  outOfFalseBlockWhenNewSettings = ! indexInBlock.startsWith(falseIndexWhenNewSettings);
                    if (outOfFalseBlockWhenNewSettings) {

                        // newSettingsByOriginalTag = ...
                        var  settingsForIf: Readonly<{[name: string]: Setting}> = newSettingsByOriginalTag;

                        ifTagParserForNewSettings.evaluate(`#if: ${condition}`, settingsForIf);
                        if (ifTagParserForNewSettings.thisIsOutOfFalseBlock) {

                            newSettingsByOriginalTag = {... newSettingsByOriginalTag, ... settingsTree.settings[indexInBlock]};
                            newSettingsByOriginalTag = {... newSettingsByOriginalTag, ... toTagTree.replaceTo[indexInBlock]};
                            falseIndexWhenNewSettings = disabledFalseIndex;
                        } else {
                            falseIndexWhenNewSettings = indexInBlock + '/';
                        }
                    }

                    const  outOfFalseBlockWhenOldSettings = ! indexInBlock.startsWith(falseIndexWhenOldSettings);
                    if (outOfFalseBlockWhenOldSettings) {

                        // falseIndexWhenOldSettings = ...
                        const  oldSettings: Readonly<{[name: string]: Setting}> = settingsTree.currentSettings;
                        var  settingsForIf = oldSettings;

                        ifTagParserForOldSettings.evaluate(`#if: ${condition}`, settingsForIf);
                        if (ifTagParserForOldSettings.thisIsOutOfFalseBlock) {

                            falseIndexWhenOldSettings = disabledFalseIndex;
                        } else {
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
        return  return_;
    }
};
interface  ReplaceToTagTree_for_moveToLine {
    currentNewSettings: {[name: string]: Setting};
    currentNewSettingsByOriginalTag: {[name: string]: Setting};
    currentOldSettingsInIfBlock: {[name: string]: Setting};
    currentNewSettingsInIfBlock: {[name: string]: Setting};
    currentNotFoundNameInSameAsTag: NotFoundNameInSameAsTag[];
    nextLineNumIndex: number;
    nextSettingsLineNum: number;
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
    outOfFalseBlocksByOriginalTag: Map</*lineNum*/ number, boolean>;
    currentIsOutOfFalseBlock: boolean;
    nextIfLineNumIndex: number;
    nextIfLineNum: number;
}
interface  ReplaceToTagTree_for_addCurrentSettingsInIfBlock {
    currentNewSettings: {[name: string]: Setting};
    currentNewSettingsByOriginalTag: {[name: string]: Setting};
    outOfFalseBlocks: Map</*lineNum*/ number, boolean>;
    outOfFalseBlocksByOriginalTag: Map</*lineNum*/ number, boolean>;
};

interface NotFoundNameInSameAsTag {
    settingName: string;
    notFoundName: string;
    referencedVariableNames: string[];
}

// SettingsInformation
interface SettingsInformation {
    index: string;
    lineNum: number;
    indent: string;
    condition: string;
    inSettings: boolean;
}

// Settings
type Settings = {[name: string]: Setting}

// Setting
interface Setting {
    value: string;
    lineNum: number;  // This count is the same as #to: tag count
    settingsIndex: string;
    tag: 'settings' | 'toInSettings' | 'toAfterTemplate' | 'original' | 'copyArgument' | 'env';
    isReferenced: boolean;
    sameAs?: string;
    sameAsWasChecked?: boolean;
}

// searchDefinedSettingIndices
function  searchDefinedSettingIndices(
    variableName: string,
    currentSettingIndex: string,
    settingTree: SettingsTree,
    parser: Parser,
): /* definedSettingIndex */ string[] {
    var  index = currentSettingIndex;
    for (;;) {
        const  foundIndices = searchDefinedSettingIndexInCurrentLevel(variableName, index, settingTree, parser);
        if (foundIndices.length >= 1) {
            return  foundIndices;
        }
        if (index === '/') {
            throw  new Error(`Error of not found "${variableName}" in settings "${currentSettingIndex}"`);
        }
        index = path.dirname(index);
    }
}

// searchDefinedSettingIndexInCurrentLevel
function  searchDefinedSettingIndexInCurrentLevel(
    variableName: string,
    indexWithoutIf: string,
    settingTree: SettingsTree,
    parser: Parser,
): string[] {

    if (variableName in settingTree.settings[indexWithoutIf]) {
        return  [indexWithoutIf];  // e.g. '/1'
    } else {  // Search in #if: tag block
        const  foundIndices: string[] = [];
        if (indexWithoutIf === '/') {
            var  targetIndexSlash = '/';
        } else {
            var  targetIndexSlash = indexWithoutIf + '/';
        }
        for (const index of Object.keys(settingTree.settings)) {

            if (index.startsWith(targetIndexSlash)) {
                if (lib.isAlphabetIndex(index.substring(0, targetIndexSlash.length + 1))) {
                    if (variableName in settingTree.settings[index]) {

                        foundIndices.push(index);  // e.g. '/1/a'
                    }
                }
            }
        }
        return  foundIndices;
    }
}

// Thesaurus
class Thesaurus {
    synonym: {[word: string]: string} = {};  // the value is the normalized word
    get  enabled(): boolean { return Object.keys(this.synonym).length !== 0; }

    async  load(csvFilePath: string): Promise<void> {
        const  promise = new Promise<void>((resolveFunction, _rejectFunction) => {

            fs.createReadStream(csvFilePath)
                .pipe(
                    csvParse.parse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',', relax_column_count: true }))
                .on('data',
                    (columns: string[]) => {
                        if (columns.length >= 1) {
                            const  normalizedKeyword = columns[0];
                            columns.shift();
                            const  synonyms = columns;
                            synonyms.forEach( (synonym: string) => {

                                this.synonym[synonym.toLowerCase()] = normalizedKeyword;
                            });
                        }
                    })
                .on('end', () => {
                    resolveFunction();
                });
        });
        return  promise;
    }

    normalize(keyphrase: string): string {
        const  words = keyphrase.split(' ');
        for (let i = 0;  i < words.length;  i+=1) {
            const  word = words[i].toLowerCase();
            if (word in this.synonym) {

                words[i] = this.synonym[word];
            }
        }
        const   normalizedKeyphrase = words.join(' ');
        return  normalizedKeyphrase;
    }
}

// FoundLine
// Found the keyword and matched part in the line
class FoundLine {
    path: string = '';
    lineNum: number = 0;
    line: string = '';
    indentLength: number = 0;
    snippet: string[] = [];
    snippetDepth: number = 0;
    snippetIndentLengths: number[] = [];
    matches: MatchedPart[] = [];
    matchedKeywordCount: number = 0;
    matchedTargetKeywordCount: number = 0;
    testedWordCount: number = 0;
    tagLabel: string = '';  // keywordLabel, searchLabel, glossaryLabel, find all
    score: number = 0;

    toString(): string {

        // colorParts = sort matched positions and merge overrlapping parts.
        const  colorParts: MatchedPart[] = [];
        const  sortedParts: MatchedPart[] = this.matches.sort((a, b) => (a.position - b.position));
        var  previousPart = new MatchedPart();
        previousPart.position = -1;
        previousPart.length = 0;
        for (const part of sortedParts) {
            if (part.position === previousPart.position) {
            } else {
                colorParts.push(part);
            }
        }

        // coloredLine = ...
        var    coloredLine = '';
        const  line = this.line;
        var    previousPosition = 0;
        for (const match of colorParts) {

            coloredLine +=
                line.substring(previousPosition,  match.position) +
                matchedColor( line.substr(match.position, match.length) );
            previousPosition = match.position + match.length;
        }
        coloredLine += line.substring(previousPosition);

        // ...
        var  thereIsKeywordLabel = false;
        var  thereIsSearchLabel = false;
        var  thereIsRefLabel = false;
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
        if ( ! thereIsRefLabel) {
            const  refColor = chalk.yellow;
            const  refIndex = coloredLine.indexOf(refLabel);
            if (refIndex !== notFound) {
                const  commentIndex = coloredLine.indexOf(' #', refIndex + refLabel.length);
                if (commentIndex === notFound) {
                    var  refTagAndParameter = coloredLine.substring(refIndex).trim();
                } else {
                    var  refTagAndParameter = coloredLine.substring(refIndex,  commentIndex).trim();
                }
                coloredLine =
                    coloredLine.substring(0, refIndex) +
                    refColor( refTagAndParameter ) +
                    coloredLine.substring(refIndex + refTagAndParameter.length);
            }
        }

        // search tag
        if (this.tagLabel !== searchLabel  &&  ! thereIsSearchLabel) {
            const  searchColor = chalk.yellow;
            const  searchIndex = coloredLine.indexOf(searchLabel);
            if (searchIndex !== notFound) {
                const  spaceCount = indentRegularExpression.exec(coloredLine.substr(searchIndex + searchLabel.length))![0].length;
                const  parameterIndex = searchIndex + searchLabel.length + spaceCount;
                const  commentIndex = coloredLine.indexOf(' #', parameterIndex);
                if (commentIndex === notFound) {
                    var  searchKeyword = coloredLine.substring(parameterIndex).trim();
                } else {
                    var  searchKeyword = coloredLine.substring(parameterIndex,  commentIndex).trim();
                }
                coloredLine =
                    coloredLine.substring(0, parameterIndex) +
                    searchColor( searchKeyword ) +
                    coloredLine.substring(parameterIndex + searchKeyword.length);
            }
        }

        // keyword tag, glossary tag
        if (this.tagLabel === keywordLabel  ||  this.tagLabel === glossaryLabel) {
            const  keywordLabelColor = chalk.gray;
            const  keywordLabelIndex = coloredLine.indexOf(keywordLabel);
            if (keywordLabelIndex !== notFound  &&  ! thereIsKeywordLabel  &&
                    (keywordLabelIndex === 0  ||  coloredLine[keywordLabelIndex - 1] === ' ')) {
                coloredLine =
                    coloredLine.substring(0, keywordLabelIndex) +
                    keywordLabelColor( keywordLabel ) +
                    coloredLine.substring(keywordLabelIndex + keywordLabel.length);
            }
            if (this.tagLabel === glossaryLabel) {
                coloredLine = keywordLabelColor( glossaryLabel ) +' '+ coloredLine;
            }
        }
        if (false) {
            var  debugString = ` (score: ${this.score}, wordCount: ${this.testedWordCount}, matchedCount: ${this.matchedTargetKeywordCount})`;
        } else {
            var  debugString = ``;
        }

        // colored string
        return `${pathColor(getTestablePath(this.path))}${lineNumColor(`:${this.lineNum}:`)} ${coloredLine}${debugString}`;
    }

    evaluateSnippetDepthTag(line: string) {
        const  snippetDepthIndex = tagIndexOf(line, snippetDepthLabel);
        if (snippetDepthIndex !== notFound) {
            const  currentIndent = indentRegularExpression.exec(line)![0];
            this.snippetDepth = parseInt(getValue(line, snippetDepthIndex + snippetDepthLabel.length));
            this.snippetIndentLengths.push(currentIndent.length);
        }
    }

    isSnippetOver(line: string): boolean {
        if (line.trim() === '') {
            return  false;
        }
        const  currentIndent = indentRegularExpression.exec(line)![0];
        const  currentIndentLength = currentIndent.length;

        if (this.snippetDepth <= 0) {
            const  depth0IndentLength = this.indentLength;

            return  currentIndentLength <= depth0IndentLength;
        } else {
            var    previousIndentLength = this.snippetIndentLengths[this.snippetIndentLengths.length - 1];
            const  previousLineIndentIsDeeperOrEqual = (this.snippetIndentLengths.length >= this.snippetDepth + 1);
            if (currentIndentLength > previousIndentLength) {
                this.snippetIndentLengths.push(currentIndentLength);
            } else {
                while (currentIndentLength < previousIndentLength  &&  this.snippetIndentLengths.length >= 2) {
                    this.snippetIndentLengths.pop();
                    previousIndentLength = this.snippetIndentLengths[this.snippetIndentLengths.length - 1];
                }
            }
            const  currentLineIndentIsDeeperOrEqual = (this.snippetIndentLengths.length >= this.snippetDepth + 1);

            return  previousLineIndentIsDeeperOrEqual  &&  ! currentLineIndentIsDeeperOrEqual;
        }
    }
}

// MatchedPart
class MatchedPart {
    position: number = 0;
    length: number = 0;
    testTargetIndex: number = -1;
    matchedString: string = '';
}

// SearchKeyword
class SearchKeyword {
    keyword: string = '';
    startLineNum: number = 0;
    direction: Direction = Direction.Following;
}

// AbstractLineNumGetter
interface  AbstractLineNumGetter {
    regularExpression: string;
    type: string;
}

// LineNumGetter
interface  LineNumGetter  extends AbstractLineNumGetter {
    regularExpression: string;
    type: string;
    filePathRegularExpressionIndex: number;
    keywordRegularExpressionIndex: number;
    csvOptionRegularExpressionIndex: number;
    targetMatchIdRegularExpressionIndex: number;
    address: string;
}

// FigurePointGetter
interface  FigurePointGetter  extends AbstractLineNumGetter {
    regularExpression: string;
    type: string;
    filePathRegularExpressionIndex: number;
    xExpressionIndex: number;
    yExpressionIndex: number;
    nameExpressionIndex: number;
    pointerImage: string;
    outputFolder: string;
}

// FilePathAndKeyword
interface  FilePathAndKeyword {
    filePath: string;
    keyword: string;
    csvOption: boolean;
}

// splitFilePathAndKeyword
function  splitFilePathAndKeyword(address: string, getter: LineNumGetter): FilePathAndKeyword {

    const  verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
        console.log(`    Verbose: address: ${address}`);
        console.log(`    Verbose: regularExpression: ${getter.regularExpression}`);
        console.log(`    Verbose: filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
        console.log(`    Verbose: keywordRegularExpressionIndex: ${getter.keywordRegularExpressionIndex}`);
        console.log(`    Verbose: csvOptionRegularExpressionIndex: ${getter.csvOptionRegularExpressionIndex}`);
        console.log(`    Verbose: targetMatchIdRegularExpressionIndex: ${getter.targetMatchIdRegularExpressionIndex}`);
    }

    const  parameters = (new RegExp(getter.regularExpression)).exec(address);
    if ( ! parameters) {
        throw  new Error(`ERROR: regularExpression (${getter.regularExpression}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is not matched.` +
            `testing string is "${address}".`);
    }
    if (verboseMode) {
        console.log(`    Verbose: matched: [${parameters.join(', ')}]`);
    }
    if (getter.filePathRegularExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: filePathRegularExpressionIndex (${getter.filePathRegularExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.keywordRegularExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: keywordRegularExpressionIndex (${getter.keywordRegularExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }

    var  csvOption = false;
    if (parameters.length >= getter.csvOptionRegularExpressionIndex) {
        if (parameters[getter.csvOptionRegularExpressionIndex]) {
            csvOption = true;
        }
    }

    return {
        filePath: parameters[getter.filePathRegularExpressionIndex],
        keyword:  parameters[getter.keywordRegularExpressionIndex],
        csvOption,
    } as FilePathAndKeyword;
}

// searchAsText
async function  searchAsText(getter: LineNumGetter, address: string): /* linkableAddress */ Promise<FilePathLineNum> {
    const  { filePath, keyword, csvOption } = splitFilePathAndKeyword(address,  getter);
    if ( ! fs.existsSync(filePath)) {
        console.log(`ERROR: not found a file at "${getTestablePath(lib.getFullPath(filePath, process.cwd()))}"`);
        return  { filePath, lineNum: notFound };
    }

    const  lineNum = await lib.searchAsTextSub({input: fs.createReadStream(filePath)}, keyword, csvOption);
    return  { filePath, lineNum };
}

// FigurePoint
interface  FigurePoint {
    filePath: string;
    name: string;
    x: number;
    y: number;
}

// parseFigureParameters
function  parseFigureParameters(address: string, getter: FigurePointGetter): FigurePoint {

    const  verboseMode = 'verbose' in programOptions;
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

    const  parameters = (new RegExp(getter.regularExpression)).exec(address);
    if ( ! parameters) {
        throw  new Error(`ERROR: regularExpression (${getter.regularExpression}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is not matched.` +
            `testing string is "${address}".`);
    }
    if (verboseMode) {
        console.log(`    Verbose: matched: [${parameters.join(', ')}]`);
    }
    if (getter.filePathRegularExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: filePathRegularExpressionIndex (${getter.filePathRegularExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.xExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: xExpressionIndex (${getter.xExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.yExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: yExpressionIndex (${getter.yExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (getter.nameExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: nameExpressionIndex (${getter.nameExpressionIndex}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }

    return {
        filePath: parameters[getter.filePathRegularExpressionIndex],
        name: getter.nameExpressionIndex ? parameters[getter.nameExpressionIndex] : '',
        x: parseInt(parameters[getter.xExpressionIndex]),
        y: parseInt(parameters[getter.yExpressionIndex]),
    } as FigurePoint;
}

// getPointedFigurePath
async function  getPointedFigurePath(getter: FigurePointGetter, address: string): /* linkableAddress */ Promise<string> {
    const  { filePath, name, x, y } = parseFigureParameters(address,  getter);
    const  inputImage = path.parse(filePath);
    const  outputImagePath = (name) ?
        `${getter.outputFolder}/${inputImage.name}_${name}_${x}_${y}${inputImage.ext}` :
        `${getter.outputFolder}/${inputImage.name}_${x}_${y}${inputImage.ext}`;
    fs.mkdirSync(getter.outputFolder, {recursive: true});
    try {
        const  figureChain = sharp(filePath);
        const  figure = await figureChain.metadata();
        const  pointerChain = sharp(getter.pointerImage).resize(
            Math.floor(figure.width! * 15/100), Math.floor(figure.height! * 15/100),
            {fit: 'contain', background: {r:0,g:0,b:0,alpha:0}});
        const  pointer = await pointerChain.toBuffer({ resolveWithObject: true });

        await figureChain
            .composite([{
                input: pointer.data,
                left: x - Math.floor(pointer.info.width! / 2),
                top:  y - Math.floor(pointer.info.height! / 2),
            }])
            .toFile(outputImagePath);
    } catch (e) {
        console.log(e);
        return  '';
    }

    return  outputImagePath;
}

// Verb
interface Verb {
    regularExpression: string;
    label: string;
    number: string;
    command: string;  // This can contain "verbVar"
}

// verbVar
namespace VerbVariable {
    export const  ref = '${ref}';
    export const  windowsRef = '${windowsRef}';
    export const  file = '${file}';
    export const  windowsFile = '${windowsFile}';
    export const  fragment = '${fragment}';
    export const  lineNum = '${lineNum}';
}
const  verbVar = VerbVariable;

// FilePathLineNum
class FilePathLineNum {
    filePath: string = '';
    lineNum: number = 0;
}

// KeyValue
class KeyValue {
    key: string = '';
    value: string = '';
}

function  key(keyValue: any[]) {
    return  keyValue[0];
}
function  value(keyValue: any[]) {
    return  keyValue[1];
}

// Direction
enum Direction {
    Above = -1,
    Following = +1,
}

// GlossaryTag
interface GlossaryTag {
    indentPosition: number;
    indentAtTag: string;
    indentAtFirstContents: string;
    glossaryWords: string;
}

// ScoreTag
interface ScoreTag {
    indentPosition: number;
    plusScore: number;
}

// IfTag
interface  IfTag {
    indentLength: number;
    resultOfIf: boolean;
    enabled: boolean;
    isReplacable: boolean;
}

// IfTagForConditionScanner
interface  IfTagForConditionScanner {
    indentLength: number;
    trueCondition: string;
}

// EnableFileTemplateIfExistTag
interface  EnableFileTemplateIfExistTag {
    indentLength: number;
    resultOfIf: boolean;
}

// EvaluationLog
interface  EvaluationLog {
    before: string;
    after: string;
}

// Parser
class  Parser {
    command = CommandEnum.unknown;
    errorCount = 0;
    warningCount = 0;
    templateCount = 0;
    verbose = false;
    filePath = '';
    lineNum = 0;
    line = '';
    ifTagErrorMessageIsEnabled = true;
    outputToTagList = false;
    toTagList: string[] = [];
    originalTagList: string[] = [];

    flushToTagList() {
        this.outputToTagList = true;

        if (this.originalTagList.length >= 1) {
            console.log('');
            for (const log of this.originalTagList) {
                console.log(log);
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

// WriteBuffer
class  WriteBuffer {
    stream: fs.WriteStream;
    lineBuffer: string[];

    constructor(stream: fs.WriteStream) {
        this.stream = stream;
        this.lineBuffer = [];
    }

    cutLastLF() {
        const  lastLine = this.lineBuffer[this.lineBuffer.length-1];
        if (lastLine.slice(-1) === '\n') {
            this.lineBuffer[this.lineBuffer.length-1] = lastLine.substring(0, lastLine.length - 1);
        }
    }

    end() {
        for (const line  of  this.lineBuffer) {
            this.stream.write(line);
        }
        this.stream.end();
    }

    getAllLines(): string {
        return  this.lineBuffer.join('');
    }

    on(event: string, callback: () => void) {
        this.stream.on(event, callback);
    }

    write(line: string) {
        this.lineBuffer.push(line);
    }

    replaceAboveLine(relativeLineNum: number, replacedLine: string) {
        const  targetLineNum = this.lineBuffer.length + relativeLineNum;

        this.lineBuffer[targetLineNum] = replacedLine;
    }

    getWrittenLine(lineNum: number): string {
        if (lineNum > this.lineBuffer.length) {
            throw  new Error('The line is not written yet.');
        }

        return  this.lineBuffer[lineNum];
    }
}

// cutLastLF
function  cutLastLF(message: string) {
    if (message.slice(-1) === '\n') {
        message = message.substring(0, message.length - 1);
    }
    if (message.slice(-1) === '\r') {
        message = message.substring(0, message.length - 1);
    }
    return  message;
}

// getStdOut
// Example:
//    var d = getStdOut();  // Set break point here and watch the variable d
function  getStdOut(): string[] {
    return  stdout.split('\n');
}

// println
// #keyword: println, console.log, consoleLog
// Output any text to standard output or buffer.
// delayedExpanding: The debugger or the browswr watch view expands objects
function  println(message: any, delayedExpanding: boolean = false) {
    if (delayedExpanding) {
        consoleLog(message);
    } else {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }

        stdout += message.toString() + '\n';
        pp(message.toString());
    }
}
const  consoleLog = console.log;

// writeToStdout
// #keyword: writeToStdout
// Output any text to standard output or buffer.
function  writeToStdout(message: string, a2?: any, a3?: any) {
    stdout += message.toString();
    pp(message.toString());
    return  true;
}
const  processStdoutWrite = process.stdout.write;

// startTestRedirect
export function  startTestRedirect() {
    if (withJest  ||  programOptions.stdoutBuffer) {
        console.log = println;
        process.stdout.write = writeToStdout;
        lib.setInputEchoBack(true);
    }
}

// endTestRedirect
export function  endTestRedirect() {
    if (withJest  ||  programOptions.stdoutBuffer) {
        console.log = consoleLog;
        process.stdout.write = processStdoutWrite;
        lib.setInputEchoBack(false);
    }
}

// lastOf
function  lastOf<T>(array: Array<T>): T {
    return  array[array.length - 1];
}

// translate
// e.g. translate('english')
// e.g. translate`price = ${price}`  // ... taggedTemplate
function  translate(englishLiterals: TemplateStringsArray | string,  ... values: any[]): string {
    var    dictionary: {[name: string]: string} | undefined = undefined;
    const  taggedTemplate = (typeof(englishLiterals) !== 'string');

    var  english = englishLiterals as string;
    if (taggedTemplate) {
        english = '';
        for (let i=0; i<englishLiterals.length; i+=1) {
            english += englishLiterals[i];
            if (i < values.length) {
                english += '${' + String(i) +'}';
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
            "Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.":
                "複数の設定があるので、設定を特定できません。行番号のパラメーターを追加してください。",
            "Not found specified variable name.": "指定した変数名が見つかりません。",
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
    var  translated = english;
    if (dictionary) {
        if (english in dictionary) {

            translated = dictionary[english];
        }
    }
    if (taggedTemplate) {
        for (let i=0; i<englishLiterals.length; i+=1) {
            translated = translated.replace( '${'+String(i)+'}', String(values[i]).replace(/\$/g,'$$') );
        }
        translated = translated.replace( '$\\{', '${' );
            // Replace the escape of ${n}
            // e.g. "$\\{price} = ${price}" => "${price} = 100"
    }
    return  translated;
}

// callMainFromJest
// The process runs in global scope by each starting tests.
// This function is called by each tests.
export async function  callMainFromJest(parameters?: string[], options?: {[name: string]: string}) {
    withJest = true;
    stdout = '';
    if (parameters) {
        programArguments = parameters;
    } else {
        programArguments = [];
    }
    if (options) {
        programOptions = options;
    } else {
        programOptions = {};
    }
    if ( ! ('foundCountMax' in programOptions)) {
        programOptions.foundCountMax = foundCountMaxDefault;
    }
    if ( ! ('snippetLineCount' in programOptions)) {
        programOptions.snippetLineCount = snippetLineCountDefault;
    }
    try {
        startTestRedirect();

        await mainMain();
    } finally {
        endTestRedirect();

        var    d = pp('');
        const  s = getStdOut();
        d = [];  // Set break point here and watch the variable d
    }
}

// private_
// For the unit test
export const  private_ = {
    Parser,
    makeSettingTree,
    makeReplaceToTagTree,
};

if (process.env.windir) {
    var  runningOS = 'Windows';
} else {
    var  runningOS = 'Linux';
}
const  settingLabel = /(^| )#settings:/;
const  settingsDot = '$settings.';
const  settingsDotRe = /{\$settings\.(.*?)}/g;
const  originalLabel = "#original:";
const  toLabel = "#to:";  // replace to tag
const  checkTag = "#check:";
const  replaceTag = "#replace:";
const  resetTag = "#reset:";
const  templateLabel = "#template:";
const  templateAtStartLabel = "#template-at(";
const  templateTagAndParameterRegExp = /( |^)+#template:[^#]*/;
const  templateAtEndLabel = "):";
const  templateIfLabel = "#template-if:";
const  templateIfYesKey = "template-if(yes)";
const  templateIfNoKey  = "template-if(no)";
const  fileTemplateLabel = "#file-template:";
const  fileTemplateAnyLinesLabel = "#file-template-any-lines:";
const  enableFileTemplateIfExistLabel = "#enable-file-template-if-exist:";
const  keywordLabel = "#keyword:";
const  keywordTagAndParameterRegExp = /( |^)#keyword:[^#]*/g;
const  glossaryLabel = "#glossary:";
const  mutualTag = "#mutual:";
const  snippetDepthLabel = "#snippet-depth:"
const  disableLabel = "#disable-tag-tool:";
const  searchIfLabel = "#(search)if: false";
const  scoreLabel = "#score:";
const  ifLabel = "#if:";
const  ifLabelRE = /(?<= |^)#if:/;
const  expectLabel = "#expect:";
const  searchLabel = "#search:";
const  refLabel = "#ref:";
const  copyDot = '$copy.';
const  copyLabel = "#copy:";
const  copyTemplateLabel = "#copy-template:";
const  typrmEnvPrefix = 'TYPRM_';
const  indentRegularExpression = /^( |¥t)*/;
const  numberRegularExpression = /^[0-9]+$/;
const  variablePattern = "\\$\\{[^\\}]+\\}";  // ${__Name__}
const  lineFullMatchScore = 3;
const  suffledLineFullMatchScore = 1;
const  fullMatchScore = 100;
const  keywordMatchScore = 7;
const  glossaryMatchScore = 5;
const  caseIgnoredFullMatchScore = 8;
const  wordsMatchScore = 17;
const  partMatchScore = 15;
const  notNormalizedScore = 1;
const  caseIgnoredWordMatchScore = 16;
const  caseIgnoredPartMatchScore = 14;
const  orderMatchScore = 2;
const  maxNumber = 999999999;
const  pathColor = chalk.cyan;
const  lineNumColor = chalk.keyword('gray');
const  matchedColor = chalk.green.bold;
const  notFound = -1;
var    inputFileParentPath = '';
var    locale = '';
var    withJest = false;
export var  stdout = '';
export var  programArguments: string[] = [];
export var  programOptions: {[key: string]: any} = {};
export const  foundCountMaxDefault = "10";
export const  snippetLineCountDefault = "5";
