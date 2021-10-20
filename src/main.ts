import * as fs from 'fs'; // file system
import * as path from "path";  // or path = require("path")
import * as globby from 'globby';
import * as readline from 'readline';
import * as csvParse from 'csv-parse';
import * as chalk from 'chalk';
import * as yaml from 'js-yaml';
import * as child_process from 'child_process';
import * as lib from "./lib";
import { pp } from "./lib";

// main
export async function  main() {
    locale = Intl.NumberFormat().resolvedOptions().locale;
    if ('locale' in programOptions) {
        locale = programOptions.locale;
    }
    const  verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        printConfig();
    }

    if (programArguments.length === 0) {
        if (programOptions.replaceMode) {

            await checkRoutine(true, '');
            if (programOptions.test) {  // Scan last input command line for the test
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } else {

            await  search();
        }
    } else if (programArguments.length >= 1 ) {

        if (programArguments[0] === 's'  ||  programArguments[0] === 'search') {
            if (verboseMode) {
                console.log('Verbose: typrm command: search');
            }
            await  search();
        }
        else if (programArguments[0] === 'f'  ||  programArguments[0] === 'find') {
            if (verboseMode) {
                console.log('Verbose: typrm command: find');
            }
            await  find();
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
            if (programArguments.length <= 2) {
                if (programArguments.length === 1) {
                    var  inputFilePath = '';
                } else {
                    var  inputFilePath = programArguments[1];
                }

                await  replace(inputFilePath);
            } else {
                varidateReplaceCommandArguments();
                if (programArguments.length === 3) {
                    var  inputFilePath = programArguments[1];
                    var  replacingLineNum = '';  // isOneSetting
                    var  keyValues = programArguments[2];
                } else {
                    var  inputFilePath = programArguments[1];
                    var  replacingLineNum = programArguments[2];
                    var  keyValues = programArguments[3];
                }

                await  replaceSettings(inputFilePath, replacingLineNum, keyValues, {}, false);
            }
        }
        else if (programArguments[0] === 'revert') {
            if (programArguments.length <= 2) {
                if (programArguments.length === 1) {
                    var  inputFilePath = '';
                } else {
                    var  inputFilePath = programArguments[1];
                }

                await  revert(inputFilePath);
            } else {
                varidateRevertCommandArguments();
                const  inputFilePath = programArguments[1];
                const  replacingLineNum = programArguments[2];

                await  revertSettings(inputFilePath, replacingLineNum);
            }
        }
        else if (programArguments[0] === 'where') {
            const  variableName = programArguments[1];
            var  inputFilePath = '';
            var  lineNum = 0;
            if (programArguments.length >= 3) {
                inputFilePath = programArguments[2];
            }
            if (programArguments.length >= 4) {
                lineNum = parseInt(programArguments[3]);
            }

            await  lookUpVariable(variableName, inputFilePath, lineNum);
        }
        else {
            await  search();
        }
    }

    // debug
    if (false) {
        var d = pp('');
        d=d;
        // If exception was raised, this code does not execute.
        // Set a break point at the catch block of calling "main.main"
    }
}

// checkRoutine
async function  checkRoutine(isModal: boolean, inputFilePath: string) {
    if (isModal) {
        var  inputFilePath = await lib.inputPath( translate('YAML UTF-8 file path>') );
    }
pp('checkRoutine')
    const  parentPath = path.dirname(inputFilePath);
    inputFileParentPath = parentPath;
    var  previousTemplateCount = 0;
    for(;;) {
        const  settingTree = await makeSettingTree(inputFilePath);
        var  reader = readline.createInterface({
            input: fs.createReadStream(inputFilePath),
            crlfDelay: Infinity
        });
        var  isReadingSetting = false;
        var  setting: Settings = {};
        var  settingCount = 0;
        var  settingLineNum = 0;
        var  settingIndentLength = 0;
        var  lineNum = 0;
        var  templateCount = 0;
        var  fileTemplateTag: TemplateTag | null = null;
        var  errorCount = settingTree.errorCount;
        var  warningCount = 0;
        var  secretLabelCount = 0;
        const  parser = new Parser();
        const  lines = [];
        const  keywords: SearchKeyword[] = [];
        const  ifTagParser = new IfTagParser(parser);
        parser.command = CommandEnum.check;
        parser.verbose = ('verbose' in programOptions);
        parser.filePath = inputFilePath;

        for await (const line1 of reader) {
            const  line: string = line1;
            lines.push(line);
            lineNum += 1;
            parser.lineNum = lineNum;
var d = pp(`- ${lineNum} ${line}`);

            // Set condition by "#if:" tag.
            const  parsed = ifTagParser.evaluate(line, setting);
            if (parsed.errorCount >= 1) {
                console.log('');
                console.log('Error of if tag syntax:');
                console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                console.log(`  Contents: ${parsed.condition}`);
                errorCount += parsed.errorCount;
            }

            // setting = ...
            if (newCode) {

                settingTree.moveToLine(lineNum);
                setting = settingTree.currentSettings;

                if (settingTree.outOfScopeSettingIndices.length >= 1) {
                    onEndOfSettingScope(settingTree.settings[settingTree.outOfScopeSettingIndices[0]],
                        inputFilePath);
                }
            } else {
                if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                    if (settingCount >= 1) {
                        onEndOfSettingScope(setting, inputFilePath);
                    }
                    if (parser.verbose) {
                        console.log(`Verbose: ${getTestablePath(inputFilePath)}:${lineNum}: settings`);
                    }
                    isReadingSetting = true;

                    setting = {};
                    settingCount += 1;
                    settingLineNum = lineNum;
                    settingIndentLength = indentRegularExpression.exec(line)![0].length;
                } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isReadingSetting) {
                    isReadingSetting = false;
                }
                if (isReadingSetting  &&  ifTagParser.thisIsOutOfFalseBlock) {
                    const  separator = line.indexOf(':');
                    if (separator !== notFound) {
                        const  key = line.substr(0, separator).trim();
                        const  value = getValue(line, separator);
                        if (value !== ''  &&  key.length >= 1  &&  key[0] !== '#') {
                            if (key in setting) {
                                const  previous = setting[key];
                                console.log('');
                                console.log(translate('Error of duplicated variable name:'));
                                console.log(`  ${translate('typrmFile')}A: ${getTestablePath(inputFilePath)}:${previous.lineNum}`);
                                console.log(`  ContentsA: ${key}: ${previous.value}`);
                                console.log(`  ${translate('typrmFile')}B: ${getTestablePath(inputFilePath)}:${lineNum}`);
                                console.log(`  ContentsB: ${key}: ${value}`);
                                errorCount += 1;
                            }
                            if (parser.verbose) {
                                console.log(`Verbose: ${getTestablePath(inputFilePath)}:${lineNum}:     ${key}: ${value}`);
                            }

                            setting[key] = {value, isReferenced: false, lineNum: [lineNum]};
                        }
                    }
                }
            }

            // Check the condition by "#expect:" tag.
            if (line.includes(expectLabel)  &&  ifTagParser.thisIsOutOfFalseBlock) {
                const  condition = line.substr(line.indexOf(expectLabel) + expectLabel.length).trim();

                const  evaluatedContidion = evaluateIfCondition(condition, setting, parser);
                if (typeof evaluatedContidion === 'boolean') {
                    if ( ! evaluatedContidion) {
                        console.log('');
                        console.log(translate('Error of not expected condition:'));
                        console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                        console.log(`  Contents: ${condition}`);
                        errorCount += 1;
                    }
                } else {
                    console.log('');
                    console.log('Error of expect tag syntax:');
                    console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                    console.log(`  Contents: ${condition}`);
                    errorCount += 1;
                }
            }

            // Check if previous line has "template" replaced contents.
            const  templateTag = parseTemplateTag(line, parser);
            if (templateTag.lineNumOffset >= 1  &&  templateTag.isFound) {
                console.log("");
                console.log(`${translate('ErrorLine')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                console.log(`  ${translate('Contents')}: ${line.trim()}`);
                console.log(`  ${translate('Error')}: ${translate('The parameter must be less than 0')}`);
                templateTag.isFound = false;
                templateCount += 1;
                errorCount += 1;
            }
            if (templateTag.isFound) {
                templateCount += 1;
                const  checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                const  commonCase = (templateTag.label !== templateIfLabel);
                if (commonCase) {
                    var  expected = getExpectedLine(setting, templateTag.template);
                } else { // if (templateTag.label === templateIfLabel)
                    templateTag.evaluate(setting);
                    var  expected = getExpectedLine(setting, templateTag.newTemplate);
                }
                if (templateTag.lineNumOffset === 0) {
                    var  checkingLineWithoutTemplate = checkingLine.substr(0, templateTag.indexInLine);
                } else {
                    var  checkingLineWithoutTemplate = checkingLine;
                }
if (lineNum === 6){
d=d;
}

                if ( ! checkingLineWithoutTemplate.includes(expected)  &&  ifTagParser.thisIsOutOfFalseBlock) {
                    console.log("");
                    console.log(`${translate('ErrorLine')}: ${getTestablePath(inputFilePath)}:${lineNum + templateTag.lineNumOffset}`);
                    if (templateTag.lineNumOffset <= -2) {
                        console.log(`${translate('Template')}:  ${getTestablePath(inputFilePath)}:${lineNum}`);
                    }
                    console.log(`  ${translate('Contents')}: ${checkingLine.trim()}`);
                    console.log(`  ${translate('Expected')}: ${expected}`);
                    if (commonCase) {
                        console.log(`  ${translate('Template')}: ${templateTag.template}`);
                    } else { // if (templateTag.label === templateIfLabel)
                        console.log(`  ${translate('Expression')}: ${templateTag.template}`);
                    }
                    errorCount += 1;
                }
            }

            // Check target file contents by "#file-template:" tag.
            if (fileTemplateTag) {
                const continue_ = fileTemplateTag.onReadLine(line);
                if (!continue_) {

                    const  checkPassed = await fileTemplateTag.checkTargetFileContents(
                        setting, inputFilePath, lineNum);
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    fileTemplateTag = null;
                }
            }
            if (templateTag.label === fileTemplateLabel  &&  ifTagParser.thisIsOutOfFalseBlock) {
                fileTemplateTag = templateTag;
            }

            // Check if there is not "#★Now:".
            for (let temporaryLabel of temporaryLabels) {
                if (line.toLowerCase().includes(temporaryLabel.toLowerCase())  &&  ifTagParser.thisIsOutOfFalseBlock) {
                    console.log("");
                    console.log(`${translate('WarningLine')}: ${lineNum}`);
                    console.log(`  ${translate('Contents')}: ${line.trim()}`);
                    console.log(`  ${translate('Setting')}: ${getTestablePath(inputFilePath)}:${settingLineNum}`);
                    warningCount += 1;
                }
            }

            // Check if there is not secret tag.
            if (line.includes( secretLabel )  ||  line.includes( secretLabelEn )) {
                if ( ! line.includes( secretExamleLabel )  &&  ! line.includes( secretExamleLabelEn )) {
                    if (secretLabelCount === 0) {  // Because there will be many secret data.
                        console.log("");
                        console.log(`${translate('WarningLine')}: ${lineNum}`);
                        console.log(`  ${translate('This is a secret value.')}`);
                        console.log('  '+ translate`Replace "${secretLabelEn}" to "${secretExamleLabelEn}".'`);
                        console.log('  '+ translate`Replace "${secretLabel}" to "${secretExamleLabel}".'`);
                        warningCount += 1;
                    }
                    secretLabelCount += 1;
                }
            }

            // Get titles above or following.
            var  match: RegExpExecArray | null;
            referPattern.lastIndex = 0;

            while ( (match = referPattern.exec( line )) !== null ) {
                const  keyword = new SearchKeyword();
                const  label = match[1];
                keyword.keyword = match[3];
                if (label === "上記"  ||  label === "above") {
                    keyword.startLineNum = lineNum - 1;
                    keyword.direction = Direction.Above;
                } else if (label === "下記"  ||  label === "following") {
                    keyword.startLineNum = lineNum + 1;
                    keyword.direction = Direction.Following;
                }
                keywords.push(keyword);
            }
        }
        if (newCode) {
            settingTree.moveToEndOfFile();
            if (settingTree.outOfScopeSettingIndices.length >= 1) {
                onEndOfSettingScope(settingTree.settings[settingTree.outOfScopeSettingIndices[0]],
                    inputFilePath);
            }
        } else {
            if (settingCount >= 1) {
                onEndOfSettingScope(setting, inputFilePath);
            }
        }

        // Check target file contents by "#file-template:" tag (2).
        if (fileTemplateTag) {
            fileTemplateTag.onReadLine('');  // Cut indent

            const  checkPassed = await fileTemplateTag.checkTargetFileContents(
                setting, inputFilePath, lineNum + 1);
            if (!checkPassed) {
                errorCount += 1;
            }
        }

        // Check if there is the title above or following.
        reader = readline.createInterface({
            input: fs.createReadStream(inputFilePath),
            crlfDelay: Infinity
        });
        lineNum = 0;

        for await (const line1 of reader) {
            const  line: string = line1;
            lineNum += 1;

            for (const keyword of keywords) {
                if (keyword.direction === Direction.Above) {
                    if (lineNum <= keyword.startLineNum) {

                        if (line.includes(keyword.keyword)) {
                            keyword.startLineNum = foundForAbove;
                        }
                    }
                } else if (keyword.direction === Direction.Following) {
                    if (lineNum >= keyword.startLineNum) {

                        if (line.includes(keyword.keyword)) {
                            keyword.startLineNum = foundForFollowing;
                        }
                    }
                }
            }
        }
        for (const keyword of keywords) {
            if (keyword.direction === Direction.Above) {
                if (keyword.startLineNum !== foundForAbove) {
                    console.log('');
                    console.log(`${translate('ErrorLine')}: ${keyword.startLineNum + 1}`);
                    console.log('  ' + translate`Not found "${keyword.keyword}" above`);
                    errorCount += 1;
                }
            } else if (keyword.direction === Direction.Following) {
                if (keyword.startLineNum !== foundForFollowing) {
                    console.log('');
                    console.log(`${translate('ErrorLine')}: ${keyword.startLineNum - 1}`);
                    console.log('  ' + translate`Not found "${keyword.keyword}" following`);
                    errorCount += 1;
                }
            }
        }

        // Show the result
        console.log('');
        console.log(`${translate('Warning')}: ${warningCount}, ${translate('Error')}: ${errorCount}`);
        if (previousTemplateCount) {
            console.log(`${translate('template count')} = ${previousTemplateCount} (${translate('in previous check')})`);
        }
        console.log(`${translate('template count')} = ${templateCount}`);

        if (!isModal) {
            break;
        }

        // Rescan or replace a value
        var  loop = true;
        while (loop) {
            console.log(translate('Press Enter key to retry checking.'));

            const  key = await lib.input(translate('The line number to replace the variable value >'));
            errorCount = 0;
            if (key === 'exit') {
                return;
            } else if (key !== '') {
                const  settingNameOrLineNum = key;
                const  replacingSettingIndex = await getSettingIndexFromLineNum(inputFilePath, settingNameOrLineNum);
                if ( ! replacingSettingIndex) {
                    console.log('');
                    console.log(`${translate(`Error of not found specified setting name`)}: ${settingNameOrLineNum}`);
                    errorCount += 1;
                } else {
                    console.log(`${translate('SettingIndex')}: ${replacingSettingIndex}`);
                    console.log(translate('Enter only: finish to input setting'));
                    for (;;) {
                        const  keyValue = await lib.input(translate('key: new_value>'));
                        if (keyValue === '') {
                            break;
                        }
                        errorCount += await replaceSettingsSub(
                            inputFilePath, replacingSettingIndex, parseKeyValueLines(keyValue), {}, true, false, false);
                    }
                }
            }
            loop = (errorCount >= 1);
        }

        // Rescan
        console.log('========================================');
        previousTemplateCount = templateCount
        for (const key of Object.keys(setting)) {
            setting[key].isReferenced = false;
        }
    }
}

// replaceSettings
async function  replaceSettings(inputFilePath: string, settingNameOrLineNum: string,
        keyValueLines: string, toTagLines: {[key: string]: number[]}, cutReplaceToTagEnabled: boolean) {
    const  inputFileFullPath = await getInputFileFullPath(inputFilePath);
    var  errorCount = 0;
    if (inputFileFullPath === '') {
        errorCount += 1;
    } else {
        const  replacingSettingIndex = await getSettingIndexFromLineNum(inputFileFullPath, settingNameOrLineNum);
        if ( ! replacingSettingIndex) {
            console.log('');
            console.log(`${translate(`Error of not found specified setting name`)}: ${settingNameOrLineNum}`);
            errorCount += 1;
        } else {

            errorCount += await replaceSettingsSub(
                inputFileFullPath, replacingSettingIndex, parseKeyValueLines(keyValueLines), toTagLines, true, false, cutReplaceToTagEnabled);
        }
    }
    console.log('');
    console.log(`${translate('Warning')}: 0, ${translate('Error')}: ${errorCount}`);
}

// revertSettings
async function  revertSettings(inputFilePath: string, settingNameOrLineNum: string) {
    const  inputFileFullPath = await getInputFileFullPath(inputFilePath);
    var  errorCount = 0;
    if (inputFileFullPath === '') {
        errorCount += 1;
    } else {
        const  replacingSettingIndex = await getSettingIndexFromLineNum(inputFileFullPath, settingNameOrLineNum);
        if ( ! replacingSettingIndex) {
            console.log('');
            console.log(`${translate(`Error of not found specified setting name`)}: ${settingNameOrLineNum}`);
            errorCount += 1;
        } else {

            const  revertSettings_ = await makeRevertSettings(inputFileFullPath, replacingSettingIndex);
            for (const revertSetting of revertSettings_) {
            
                errorCount += await replaceSettingsSub(inputFileFullPath, replacingSettingIndex,
                    parseKeyValueLines(revertSetting), {}, false, true, false);
            }
        }
    }
    console.log('');
    console.log(`${translate('Warning')}: 0, ${translate('Error')}: ${errorCount}`);
}

// getInputFileFullPath
async function  getInputFileFullPath(inputFilePath: string): Promise<string> {
    const  currentFolder = process.cwd();
    const  targetFolders = await lib.parseCSVColumns(programOptions.folder);
    const  fileFullPaths: string[] = [];
    if (lib.isFullPath(inputFilePath)) {
        const  inputFileFullPath = inputFilePath;
        if (fs.existsSync(inputFileFullPath)) {
            fileFullPaths.push(inputFileFullPath);
        }
    } else if (targetFolders.length === 0) {
        const  inputFileFullPath = lib.getFullPath(inputFilePath, currentFolder);
        if (fs.existsSync(inputFileFullPath)) {
            fileFullPaths.push(inputFileFullPath);
        }
    } else {
        for (const folder of targetFolders) {
            const  targetFolderFullPath = lib.getFullPath(folder, currentFolder);
            const  inputFileFullPath = lib.getFullPath(inputFilePath, targetFolderFullPath);
            if (fs.existsSync(inputFileFullPath)) {
                fileFullPaths.push(inputFileFullPath);
            }
        }
    }
    if (fileFullPaths.length === 0) {
        console.log('');
        console.log(`${translate('Error of not found the specified file.')}`);
        console.log(`    FileName: ${getTestablePath(inputFilePath)}`);
        console.log(`    Folder: ${getTestablePath(programOptions.folder)}`);
        return  '';
    } else if (fileFullPaths.length >= 2) {
        console.log('');
        console.log(`${translate('Error of same file name exists.')}`);
        console.log(`    FileName: ${getTestablePath(inputFilePath)}`);
        console.log(`    Folder: ${getTestablePath(programOptions.folder)}`);
        return  '';
    }

    return  fileFullPaths[0];
}

// replaceSettingsSub
async function  replaceSettingsSub(inputFilePath: string, replacingSettingIndex: number,
        keyValues: {[key: string]: string},  toTagLines: {[key: string]: number[]},
        addOriginalTag: boolean, cutOriginalTag: boolean, cutReplaceToTagEnabled: boolean
): Promise<number>/*errorCount*/ {
    var    errorCount = 0;
    var    replacingKeyValues = keyValues;
    var    previousEvalatedKeyValues: {[key: string]: string} = {};
    var    reducedErrorWasOccurred = false;
    var    loop = true;
    var    loopCount = 0;
    const  updatingFilePath = inputFilePath +".updating";
    const  previousUpdatingFilePath = inputFilePath +".previous.updating";
    const  conflictErrors: {[lineNum: number]: string} = {};
    const  replacedKeys: string[] = [];
    const  parser = new Parser();
    parser.command = CommandEnum.replace;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = inputFilePath;
    if (parser.verbose) {
        console.log(`Verbose: replaceSettingsSub:`);
        console.log(`Verbose:     inputFilePath: ${getTestablePath(inputFilePath)}`);
        console.log(`Verbose:     replacingSettingIndex: ${replacingSettingIndex}`)
        console.log(`Verbose:     keyValues: ${JSON.stringify(keyValues)}`);
    }
    try {
        while (loop) {
            loopCount += 1;
            const  oldFilePath = (loopCount === 1) ? inputFilePath : previousUpdatingFilePath;
            const  writer = new WriteBuffer(fs.createWriteStream(updatingFilePath));
            const  readStream = fs.createReadStream(oldFilePath);
            const  reader = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity
            });
            const  lines = [];
            var  isReadingSetting = false;
            var  setting: Settings = {};
            var  settingCount = 0;
            var  settingIndentLength = 0;
            var  settingLineNum = -1;
            var  oldSetting: Settings = {};
            var  lineNum = 0;
            var  isReplacing = false;
            var  isAllReplacable = true;
            var  isCheckingTemplateIfKey = false;
            var  templateIfKeyError = false;
            const  checkedTemplateTags: {[lineNum: number]: CheckedTemplateTag[]} = {};
            const  evalatedKeyValues: {[key: string]: string} = {};
            const  ifTagParser = new IfTagParser(parser);
            const  oldIfTagParser = new IfTagParser(parser);
            const  previousEvalatedKeyValuesLength = Object.keys(previousEvalatedKeyValues).length;
            if (parser.verbose) {
                console.log(`Verbose: loopCount: ${loopCount}`);
                console.log(`Verbose: previousEvalatedKeyValuesLength: ${previousEvalatedKeyValuesLength}`);
            }

            for await (const line1 of reader) {
                const  line: string = line1;
                lines.push(line);
                lineNum += 1;
                var  output = false;
                parser.lineNum = lineNum;

                // isReadingSetting = ...
                if (settingStartLabel.test(line.trim())  ||  settingStartLabelEn.test(line.trim())) {
                    isReadingSetting = true;
                    setting = {};
                    settingCount += 1;
                    settingIndentLength = indentRegularExpression.exec(line)![0].length;
                    settingLineNum = lineNum;
                    oldSetting = {};
                    if (replacingSettingIndex === allSetting) {
                        isReplacing = true;
                    } else {
                        isReplacing = (settingCount === replacingSettingIndex);
                    }
                    if ( ! templateIfKeyError) {
                        isCheckingTemplateIfKey = true;
                    }
                } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isReadingSetting) {

                    isReadingSetting = false;
                    if ( ! reducedErrorWasOccurred) {
                        const  settingNames = Object.keys(setting);
                        const  oldSettingNames = Object.keys(oldSetting);
                        const  undefinedVariableNames = oldSettingNames.filter((oldName)=>( ! settingNames.includes(oldName)));
                        if (undefinedVariableNames.length >= 1) {
                            console.log('');
                            console.log(`${translate('ErrorLine')}: ${lineNum}`);
                            console.log(`  ${translate('Error')}: ${translate('The number of variable declarations has decreased')}`);
                            console.log(`  ${translate('Solution')}: ${translate('Add variable declarations')}`);
                            console.log(`  ${translate('Variables')}: ${undefinedVariableNames}`);
                            reducedErrorWasOccurred = true;
                            errorCount += 1;
                        }
                    }
                }
                ifTagParser.evaluate(line, setting, Object.keys(previousEvalatedKeyValues));
                oldIfTagParser.evaluate(line, oldSetting, Object.keys(previousEvalatedKeyValues));

                if (isReplacing) {
                    if ( ! ifTagParser.isReplacable) {
                        isAllReplacable = false;
                    }

                    // In settings tag
                    if (isReadingSetting) {
                        const  separator = line.indexOf(':');
                        if (separator !== notFound) {
                            const  key = line.substr(0, separator).trim();
                            const  oldValue = getValue(line, separator);
                            if (ifTagParser.isReplacable  &&  oldValue !== '') {
                                if (key in replacingKeyValues) {
                                    evalatedKeyValues[key] = replacingKeyValues[key];
                                } else {
                                    evalatedKeyValues[key] = oldValue;
                                }
                                if (parser.verbose) {
                                    if ( ! replacedKeys.includes(key)) {
                                        replacedKeys.push(key)
                                        console.log(`Verbose:     evaluated setting: ${key}`)
                                    }
                                }
                            }

                            if (oldValue !== ''  &&  oldIfTagParser.thisIsOutOfFalseBlock) {

                                oldSetting[key] = {value: oldValue, isReferenced: false, lineNum: [lineNum]};
                            }
                            if (ifTagParser.thisIsOutOfFalseBlock) {
                                const  replacingKeys = Object.keys(replacingKeyValues);
                                if (replacingKeys.includes(key)  &&  ifTagParser.isReplacable) {
                                    const  replacedValue = replacingKeyValues[key];

                                    const  {original, spaceAndComment} = getReplacedLineInSettings(
                                        line, separator, oldValue, replacedValue, addOriginalTag, cutOriginalTag, cutReplaceToTagEnabled);

                                    writer.write(line.substr(0, separator + 1) +' '+ replacedValue + original + spaceAndComment + "\n");
                                    output = true;
                                    setting[key] = {value: replacedValue, isReferenced: false, lineNum: [lineNum]};
                                    if (parser.verbose  &&  oldValue !== replacedValue) {
                                        console.log(`Verbose: replaced "${key}" value from "${oldValue}" to "${replacedValue}"`);
                                        console.log(`Verbose:     at: ${inputFilePath}:${lineNum}:`);
                                    }
                                }
                                else {
                                    if (oldValue !== '') {
                                        setting[key] = {value: oldValue, isReferenced: false, lineNum: [lineNum]};
                                    }
                                }
                            } else {
                                if (loopCount === 1  &&  key in toTagLines) {
                                    if (toTagLines[key].includes(lineNum)) {
                                        console.log(`\nError: ${getTestablePath(inputFilePath)}:${lineNum}: "#to:" tag cannot write in false condition block. Write "#to:" tags to be true condition.`);
                                        errorCount += 1;
                                    }
                                }
                            }
                        }

                    // Out of settings
                    } else {
                        const  templateTag = parseTemplateTag(line, parser);
                        if (templateTag.isFound  &&  templateTag.includesKey(Object.keys(setting))
                                &&  ifTagParser.thisIsOutOfFalseBlock  &&  ifTagParser.isReplacable) {
                            var  replacingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                            const  commonCase = (templateTag.label !== templateIfLabel);
                            if (commonCase) {
                                var  expected = getExpectedLine(oldSetting, templateTag.template);
                                var  replaced = getReplacedLine(setting, templateTag.template, replacingKeyValues);
                            } else { // if (templateTag.label === templateIfLabel)
                                templateTag.evaluate(setting);
                                var  expected = getExpectedLine(oldSetting, templateTag.oldTemplate);
                                var  replaced = getReplacedLine(setting, templateTag.newTemplate, replacingKeyValues);
                            }

                            if (replacingLine.includes(expected)) {
                                const  before = expected;
                                const  after = replaced;
                                if (templateTag.lineNumOffset === 0) {
                                    var  replacedLine = line.replace(new RegExp(lib.escapeRegularExpression(before),'g'), after.replace(/\$/g,'$$'));
                                    if (cutReplaceToTagEnabled) {
                                        replacedLine = cutReplaceToTag(replacedLine);
                                    }

                                    writer.write(replacedLine +"\n");
                                    output = true;
                                    checkedTemplateTags[lineNum] = [];
                                    checkedTemplateTags[lineNum].push({
                                        templateLineNum: lineNum,
                                        template: templateTag.template,
                                        targetLineNum: lineNum + templateTag.lineNumOffset,
                                        expected: before,
                                        replaced: after.replace(/\$/g,'$$')
                                    })
                                } else if (templateTag.lineNumOffset <= -1) {
                                    const  targetLineNum = lineNum + templateTag.lineNumOffset;
                                    if ( !(targetLineNum in checkedTemplateTags)) {
                                        checkedTemplateTags[targetLineNum] = [];
                                    }
                                    checkedTemplateTags[targetLineNum].push({
                                        templateLineNum: lineNum,
                                        template: templateTag.template,
                                        targetLineNum,
                                        expected: before,
                                        replaced: after.replace(/\$/g,'$$')
                                    });
                                    var  lengthSortedTemplates = checkedTemplateTags[targetLineNum].slice();
                                    lengthSortedTemplates = lengthSortedTemplates.sort( (b, a) => (a.expected.length - b.expected.length) ); 
                                    var  replacedLine = replacingLine;
                                    var  maskedLine = replacingLine;
                                    const  mask = '\n';
                                    const  conflictedTemplates: CheckedTemplateTag[] = [];
                                    for (const template of lengthSortedTemplates) {
                                        var  i = 0;
                                        if ( ! maskedLine.includes(template.expected)) {
                                            if ( ! replacedLine.includes(template.replaced)) {
                                                conflictedTemplates.push(template);
                                            }
                                        } else {
                                            for (;;) {
                                                i = maskedLine.indexOf(template.expected, i);
                                                if (i === notFound) {
                                                    break;
                                                }

                                                replacedLine = replacedLine.substr(0, i) + template.replaced + replacedLine.substr(i + template.expected.length);
                                                maskedLine = maskedLine.substr(0, i) + mask.repeat(template.replaced.length) + maskedLine.substr(i + template.expected.length);
                                                i += template.expected.length;
                                            }
                                        }
                                    }

                                    writer.replaceAboveLine(templateTag.lineNumOffset, replacedLine +"\n");
                                    if (conflictedTemplates.length >= 1) {
                                        var  errorMessage = '';
                                        errorMessage += '\n';
                                        errorMessage += `${translate('ErrorIn')}: ${getTestablePath(inputFilePath)}:${targetLineNum}\n`;
                                        errorMessage += `  ${translate('Error')}: ${translate('template values after replace are conflicted.')}\n`;
                                        errorMessage += `  ${translate('Contents')}: ${replacingLine.trim()}\n`;
                                        for (const template of checkedTemplateTags[targetLineNum]) {
                                            errorMessage += `  ${translate('in ')}: ${getTestablePath(inputFilePath)}:${template.templateLineNum}\n`;
                                            errorMessage += `    ${translate('Before Editing')}: ${template.expected.trim()}\n`;
                                            errorMessage += `    ${translate('After  Editing')}: ${template.replaced.trim()}\n`;
                                            errorMessage += `    ${translate('Template')}: ${template.template.trim()}\n`;
                                        }
                                        errorMessage += `  ${translate('Setting')}: ${getTestablePath(inputFilePath)}:${settingLineNum}`;
                                        conflictErrors[targetLineNum] = errorMessage;
                                    }
                                }
                                if (parser.verbose  &&  before !== after) {
                                    console.log(`Verbose: replaced a line:`);
                                    console.log(`Verbose:     from: ${before}`);
                                    console.log(`Verbose:     to:   ${after}`);
                                    console.log(`Verbose:     at: ${inputFilePath}:${lineNum - templateTag.lineNumOffset}:`);
                                }
                            } else if (replacingLine.includes(replaced)) {
                                // Do nothing
                            } else {
                                if (errorCount === 0) { // Since only one old value can be replaced at a time
                                    console.log('');
                                    console.log(`${translate('ErrorLine')}: ${lineNum}`);
                                    console.log(`  ${translate('Error')}: ${translate('Not found any replacing target')}`);
                                    console.log(`  ${translate('Solution')}: ${translate('Set old value at settings in the replacing file')}`);
                                    console.log(`  ${translate('Contents')}: ${line.trim()}`);
                                    console.log(`  ${translate('Expected')}: ${expected.trim()}`);
                                    console.log(`  ${translate('Template')}: ${templateTag.template.trim()}`);
                                    console.log(`  ${translate('Setting')}: ${getTestablePath(inputFilePath)}:${settingLineNum}`);
                                    errorCount += 1;
                                }
                            }
                        } else {
                            if (isCheckingTemplateIfKey  &&  templateTag.label === templateIfLabel) {
                                isCheckingTemplateIfKey = false;
                                const  necessaryVariableNames = getNotSetTemplateIfTagVariableNames(Object.keys(setting));
                                if (necessaryVariableNames !== '') {
                                    console.log('');
                                    console.log(`${translate('ErrorLine')}: ${lineNum}`);
                                    console.log(`  ${translate('Error')}: ${translate('template-if tag related settings are not defined')}`);
                                    console.log(`  ${translate('Solution')}: ${translate('Set the variable')} ${necessaryVariableNames}`);
                                    console.log(`  ${translate('Setting')}: ${getTestablePath(inputFilePath)}:${settingLineNum}`);
                                    errorCount += 1;
                                    templateIfKeyError = true;
                                }
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
                                lines.pop();  // for template-at tag
                            } else {
                                writer.write(cutLine +"\n");
                            }
                        }
                    }
                }
            }
            for (const conflictError of Object.values(conflictErrors)) {
                console.log(conflictError);
                errorCount += 1;
            }

            // previousReplacedKeys = ...
            Object.keys(evalatedKeyValues).forEach((key: string) => {
                previousEvalatedKeyValues[key] = evalatedKeyValues[key]; });
            if (isAllReplacable) {
                loop = false;
            } else if (previousEvalatedKeyValuesLength == Object.keys(evalatedKeyValues).length) {
                console.log('');
                console.log(translate`Error of unexpected: The count of evalatedKeyValues is not increasing.' +
                    ' isReplacable may be not changed. Try typrm check command.`);
                errorCount += 1;
                loop = false;
            }

            // ...
            writer.end();
            await new Promise( (resolve) => {
                writer.on('finish', () => {
                    if (errorCount === 0) {
                        if (loop) {
                            fs.copyFileSync(updatingFilePath, previousUpdatingFilePath);
                        } else {
                            fs.copyFileSync(updatingFilePath, inputFilePath);
                        }
                    } else {
                        loop = false;
                    }
                    resolve(errorCount);
                });
            });
        }
    } finally {
        deleteFileSync(previousUpdatingFilePath);
        deleteFileSync(updatingFilePath);
    }
    return  errorCount;
}

// makeSettingTree
async function  makeSettingTree(inputFilePath: string): Promise<SettingsTree> {
    const  tree = new SettingsTree();
    const  parser = new Parser();
    const  indentStack: {lineNum: number, indent: string}[] = [
        {lineNum: 0, indent: ''}
    ];
    const  settingStack:
            {lineNum: number, index: string, startLineNum: number, indentLevel: number, parentIndentLevel: number}[] = [
        {lineNum: 0, index: '/',  startLineNum: 1, indentLevel: 0, parentIndentLevel: -1},
        {lineNum: 0, index: '/1', startLineNum: 0, indentLevel: 1, parentIndentLevel: 0}
        // "parentIndentLevel" is a parent indent of a settings tag. It is not a indent of a settings tag.
    ];
    const  ifTagParser = new IfTagParser(parser);
    var  reader = readline.createInterface({
        input: fs.createReadStream(inputFilePath),
        crlfDelay: Infinity
    });
    var  isReadingSetting = false;
    var  setting: Settings = {};
    var  currentSettingIndex = '/';
    var  lineNum = 0;
    var  settingIndentLength = 0;
    var  errorCount = 0;
    parser.verbose = ('verbose' in programOptions);
    tree.indices[1] = '/';
    tree.settings = {};
pp('makeSettingTree')

    for await (const line1 of reader) {
        const  line: string = line1;
        lineNum += 1;
var d = pp(`${lineNum}: ${line}`);
if (lineNum === 5) {
d=d;
}

        // indentStack = ...
        const  indent = indentRegularExpression.exec(line)![0];
        if (line !== '') {

            // pop
            while ( ! indent.startsWith(indentStack[indentStack.length - 1].indent)) {
                indentStack.pop();
            }
            const  indentLevel = indentStack.length - 1;
            const  previousIndent = indentStack[indentStack.length - 1];
            while (indentLevel <= settingStack[settingStack.length - 2].parentIndentLevel) {
                settingStack.pop();

                const  setting_ = settingStack[settingStack.length - 1];
                if ( ! (currentSettingIndex in tree.settings)) {
                    tree.settings[currentSettingIndex] = setting;
                    tree.indices[setting_.startLineNum] = currentSettingIndex;
                    tree.settingsInformation[currentSettingIndex] = {
                        index: currentSettingIndex,
                        lineNum: setting_.lineNum
                    };
                }
                setting = {}

                currentSettingIndex = settingStack[settingStack.length - 2].index;
                tree.indices[lineNum] = currentSettingIndex;

                const  nextSetting = setting_;
                const  parentSettingIndex = path.dirname(nextSetting.index);
                const  usedNumber = parseInt(path.basename(nextSetting.index));
                nextSetting.lineNum = 0;
                if (parentSettingIndex === '/') {
                    nextSetting.index = `/${usedNumber + 1}`;
                } else {
                    nextSetting.index = `${parentSettingIndex}/${usedNumber + 1}`;
                }
            }

            // push
            if (indent === previousIndent.indent) {
                previousIndent.lineNum = lineNum;
            } else {
                indentStack.push({ lineNum, indent });
            }
        }

        // Set condition by "#if:" tag.
        const  parsed = ifTagParser.evaluate(line, setting);
// ToDo: check with parent settings
        if (parsed.errorCount >= 1) {
            if (newCode) {
                console.log('');
                console.log('Error of if tag syntax:');
                console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                console.log(`  Contents: ${parsed.condition}`);
                errorCount += parsed.errorCount;
            }
        }

        // setting = ...
        if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
            isReadingSetting = true;

            setting = {};
            settingIndentLength = indent.length;
            if (indent === '') {
                settingStack[0].lineNum = lineNum;
                currentSettingIndex = '/';
            } else {
                const  setting_ = settingStack[settingStack.length - 1];
                setting_.lineNum = lineNum;
                setting_.startLineNum = indentStack[indentStack.length - 2].lineNum;
                setting_.indentLevel = settingIndentLength;
                setting_.parentIndentLevel = indentStack.length - 2;
                currentSettingIndex = setting_.index;
                settingStack.push({
                    lineNum: 0,
                    index: setting_.index + '/1',
                    startLineNum: 0,
                    indentLevel: 0,
                    parentIndentLevel: -1
                });
            }
            if (parser.verbose) {
                console.log(`Verbose: settings ${currentSettingIndex}`);
                console.log(`Verbose: ${getTestablePath(inputFilePath)}:${lineNum}: settings`);
            }
// ToDo: if (index in tree.settings) { error }
        } else if (indent.length <= settingIndentLength  &&  isReadingSetting) {
            isReadingSetting = false;
            const  setting_ = settingStack[settingStack.length - 2];
            if ( ! (currentSettingIndex in tree.settings)) {

                tree.settings[currentSettingIndex] = setting;
                tree.indices[setting_.startLineNum] = currentSettingIndex;
                tree.settingsInformation[currentSettingIndex] = {
                    index: currentSettingIndex,
                    lineNum: setting_.lineNum
                };
            }
        }
        if (isReadingSetting  &&  ifTagParser.thisIsOutOfFalseBlock) {
            const  separator = line.indexOf(':');
            if (separator !== notFound) {
                const  key = line.substr(0, separator).trim();
                const  value = getValue(line, separator);
                if (value !== ''  &&  key.length >= 1  &&  key[0] !== '#') {
                    if (key in setting) {
// ToDo: check with parent settings
                        if (newCode) {
                            const  previous = setting[key];
                            console.log('');
                            console.log(translate('Error of duplicated variable name:'));
                            console.log(`  ${translate('typrmFile')}A: ${getTestablePath(inputFilePath)}:${previous.lineNum}`);
                            console.log(`  ContentsA: ${key}: ${previous.value}`);
                            console.log(`  ${translate('typrmFile')}B: ${getTestablePath(inputFilePath)}:${lineNum}`);
                            console.log(`  ContentsB: ${key}: ${value}`);
                            errorCount += 1;
                        }
                    }
                    if (parser.verbose) {
                        console.log(`Verbose: ${getTestablePath(inputFilePath)}:${lineNum}:     ${key}: ${value}`);
                    }

                    setting[key] = {value, isReferenced: false, lineNum: [lineNum]};
                }
            }
        }
    }
    if (isReadingSetting) {
        const  setting_ = settingStack[settingStack.length - 2];
        tree.settings[currentSettingIndex] = setting;
        tree.indices[setting_.startLineNum] = currentSettingIndex;
        tree.settingsInformation[currentSettingIndex] = {
            index: currentSettingIndex,
            lineNum : setting_.lineNum
        };
    }
    if ( ! ('/' in tree.settings)) {
        tree.settings = {};
    }
    for (const index of Object.values(tree.indices)) {
        if ( ! (index in tree.settings)) {
            throw new Error('parse error in makeSettingTree');
        }
    }
    tree.errorCount = errorCount;
printSettingTree(tree);

    return  tree;
}

function  printSettingTree(tree: SettingsTree) {
pp('-------------------------------------------------')
pp('end of makeSettingTree')
for (const [index, settings] of Object.entries(tree.settings)) {
    pp(`index = ${index}`);
    for (const [name, setting] of Object.entries(settings)) {
        pp(`${lib.getObjectID(setting)}: ${name} ${setting.isReferenced}`);
    }
}
pp('-------------------------------------------------')
}

// getReplacedLineInSettings
function  getReplacedLineInSettings(
        line: string, separator: number, oldValue: string, replacedValue: string,
        addOriginalTag: boolean, cutOriginalTag: boolean, cutReplaceToTagEnabled: boolean
): ReplacedLineInSettings {

    // spaceAndComment
    // __SettingB__: SetB
    // __SettingB__: SetB  #// comment
    // __SettingB__: SetB      #to: NewSetB   #// SetBB....
    //                   ^ spaceAndCommentIndex
    var  spaceAndComment = '';
    const  commentMatch = / +#.*/.exec(line.substr(separator));
    if (commentMatch) {
        var  spaceAndCommentIndex = separator + commentMatch.index;
        spaceAndComment = line.substr(spaceAndCommentIndex);
    } else {
        var  spaceAndCommentIndex = notFound;
    }
    var  original = '';
    const  lineIncludesOriginalLabel = line.includes(originalLabel);

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
                        line.substr(commentIndex, toLabelIndex - commentIndex).trimRight();
                } else {
                    nextCommentIndex += 1;
                    if (line[toLabelIndex - 2] !== ' '  &&  line[nextCommentIndex - 2] !== ' ') {

                        // before: __SettingB__: SetB    #// comment1 #to: NewSetB #// comment2
                        //                               ^ commentIndex            ^ nextCommentIndex
                        //      spaceAndCommentIndex ^                ^ toLabelIndex 
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1 #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substr(commentIndex, toLabelIndex - commentIndex) +
                            line.substr(nextCommentIndex);
                    } else {
                        const  commentMatch2 = / +#.*/.exec(line.substr(toLabelIndex))!;
                        const  spaceAndCommentIndex2 = toLabelIndex + commentMatch2.index;

                        // before: __SettingB__: SetB    #// comment1     #to: NewSetB___      #// comment2
                        //                               ^ commentIndex   ^ toLabelIndex       ^ nextCommentIndex
                        //                           ^ spaceAndCommentIndex              ^ spaceAndCommentIndex2
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1         #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substr(commentIndex, toLabelIndex - commentIndex - 1) +
                            line.substr(spaceAndCommentIndex2 + 1);
                    }
                }
            } else {
                var  nextCommentIndex = notFound;
                if (toLabelIndex !== notFound) {
                    const  nextCommentMatch = / +#.*/.exec(line.substr(commentIndex))
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

                        original = ' '.repeat(spaceCountAfterToTag) + `${originalLabel} ${oldValue}`;
                        spaceAndComment = ' '.repeat(spaceCountBeforeToTag) + line.substr(nextCommentIndex + spaceCountAfterToTag)
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
            line = line.substr(0, toLabelIndex) + line.substr(commentIndex + 1);
        } else {

            // added tag: SetB    #to: NewSetB
            // replaced:  NewSetB
            // reverted:  SetB
            line = line.substr(0, toLabelIndex).trimRight();
        }
    }
    return  line;
}

// makeRevertSettings
async function  makeRevertSettings(inputFilePath: string, replacingSettingIndex: number
        ): /* "key: value\n" */ Promise<string[]> {

    const  readStream = fs.createReadStream(inputFilePath);
    const  reader = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });
    var  isReadingSetting = false;
    var  revertKeyValues: string = '';
    var  revertKeyValuesWithCondition: {[condition: string]: string} = {};
    var  settingCount = 0;
    var  settingIndentLength = 0;
    var  lineNum = 0;
    var  isReadingOriginal = false;
    const  ifTrueScanner = new IfTrueConditionScanner();

    for await (const line1 of reader) {
        const  line: string = line1;
        lineNum += 1;

        // setting = ...
        if (settingStartLabel.test(line.trim())  ||  settingStartLabelEn.test(line.trim())) {
            isReadingSetting = true;
            settingCount += 1;
            settingIndentLength = indentRegularExpression.exec(line)![0].length;
            if (replacingSettingIndex === allSetting) {
                isReadingOriginal = true;
            } else {
                isReadingOriginal = (settingCount === replacingSettingIndex);
            }
        } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength
                &&  isReadingSetting) {
            isReadingSetting = false;
            isReadingOriginal = false;
        }

        if (isReadingOriginal) {
            ifTrueScanner.evaluate(line);

            // Parse #original tag
            if (line.includes(originalLabel)) {
                const  separator = line.indexOf(':');
                if (separator !== notFound) {
                    const  key = line.substr(0, separator).trim();
                    const  originalLabelSeparator = line.indexOf(originalLabel) + originalLabel.length - 1;
                    const  originalValue = getValue(line, originalLabelSeparator);
                    if (ifTrueScanner.condition === '') {

                        revertKeyValues += `${key}: ${originalValue}\n`;
                    } else {
                        if ( ! (ifTrueScanner.condition in revertKeyValuesWithCondition)) {
                            revertKeyValuesWithCondition[ifTrueScanner.condition] = '';
                        }
                        revertKeyValuesWithCondition[ifTrueScanner.condition] += `${key}: ${originalValue}\n`;
                    }
                    console.log(`${getTestablePath(inputFilePath)}:${lineNum}: ${line}`);
                }
            }
        }
    }

    const  revertSettings: string[] = [];
    for (const [condition, revertKeyValues_] of Object.entries(revertKeyValuesWithCondition)) {
        revertSettings.push(`${condition}\n${revertKeyValues_}`);
    }
    revertSettings.push(revertKeyValues);
    return  revertSettings;
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
            const  leftOfTemplate = cutReplaceToTag(line.substr(0, this.indexInLine).trim());
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
            const  skip = (this.templateLines.length === 0  &&  line.trim() === fileTemplateAnyLinesLabel);
            if ( ! skip ) {

                this.templateLines.push(line);
            }
            this.minIndentLength = Math.min(this.minIndentLength, currentIndent.length);
        } else {
            this.templateLines = this.templateLines.map((line)=>(
                line.substr(this.minIndentLength)));
            readingNext = false;
        }
        return  readingNext;
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

    // scanKeyValues
    async  scanKeyValues(toValue: string, allKeys: string[], parser: Parser, hasTestTag: boolean
            ):  Promise<{[name: string]: Setting}> {
        const  keysSortedByLength: string[] = allKeys.slice(); // copy
        keysSortedByLength.sort((b,a)=>(a.length, b.length));
        const  foundIndices: {[index: number]: string} = [];
        const  verboseMode = parser.verbose || hasTestTag;
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

                foundIndices[index] = key;
                template =
                    template.substr(0, index) +
                    ' '.repeat(key.length) +
                    template.substr(index + key.length);
                    // erase the key
                index += 1;
            }
        }
        const  indices = Object.keys(foundIndices).map((v)=>(parseInt(v))).sort((a,b)=>(a-b));
        const  keys = indices.map((index)=>( foundIndices[index] ));
        const  placeholder = '\n';
        var    templatePattern = this.template;
        for (let i = indices.length - 1;  i >= 0;  i -= 1 ) {
            templatePattern =
                templatePattern.substr(0, indices[i]) +
                placeholder +
                templatePattern.substr(indices[i] + keys[i].length)
        }
        const  templateRegularExpression = lib.escapeRegularExpression(templatePattern).replace(new RegExp( placeholder, "g"), '(.*)');
        const  toValueIsMatchedWithTemplate = new RegExp( templateRegularExpression ).exec( toValue );
        const  keyValues: {[name: string]: string} = {};
        if (verboseMode) {
            console.log(`Verbose:         template: ${this.template}`);
            console.log(`Verbose:         templatePattern: ${templatePattern.replace(new RegExp( placeholder, "g"), '*')}`);
            console.log(`Verbose:         toValue: ${toValue}`);
            console.log(`Verbose:         toValueIsMatchedWithTemplate: ${toValueIsMatchedWithTemplate != null}`);
        }

        if (toValueIsMatchedWithTemplate) {

            // Case that "#to:" tag is pattern of template
            //     (A:B)  #to: (a:b)  #template: (__A__:__B__)
            for (let i = 1;  i < toValueIsMatchedWithTemplate.length;  i += 1 ) {
                checkLineNoConfilict(keyValues, keys[i-1], toValueIsMatchedWithTemplate[i], parser);

                keyValues[keys[i-1]] = toValueIsMatchedWithTemplate[i];
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
        const  returnKeyValues = {} as {[name: string]: Setting};
        for (const key of Object.keys(keyValues)) {
            returnKeyValues[key] =  {
                value: keyValues[key],
                lineNum: [parser.lineNum],
            } as Setting;
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
    async  checkTargetFileContents(setting: Settings, inputFilePath: string, templateEndLineNum: number): Promise<boolean> {
        const  parentPath = path.dirname(inputFilePath);
        const  targetFilePath = lib.getFullPath(getExpectedLine(setting, this.template), parentPath);
        if (!fs.existsSync(targetFilePath)) {
            const  templateLineNum = templateEndLineNum - this.templateLines.length;
            console.log("");
            console.log(`Error of not found the target file:`);
            console.log(`  ${translate('NotFound')}: ${getTestablePath(targetFilePath)}`);
            console.log(`  Template: ${getTestablePath(inputFilePath)}:${templateLineNum}`);
            return  false;
        }
        const  targetFileReader = readline.createInterface({
            input: fs.createReadStream(targetFilePath),
            crlfDelay: Infinity
        });
        if (this.templateLines.length === 0) {
            return  false;
        }
        const  expectedFirstLine = getExpectedLineInFileTemplate(setting, this.templateLines[0]);
        var  templateLineIndex = 0;
        var  targetLineNum = 0;
        var  errorTemplateLineIndex = 0;
        var  errorTargetLineNum = 0;
        var  errorContents = '';
        var  errorExpected = '';
        var  errorTemplate = '';
        var  indent = '';
        enum Result { same, different, skipped };
        var  result = Result.same;
        var  skipTo = '';
        var  skipToTemplate = '';
        var  skipFrom = '';
        var  skipStartLineNum = 0;
        var  loop = true;
        var  exception: any;

        for await (const line1 of targetFileReader) {
            if (!loop) {continue;}  // "reader" requests read all lines
            try {
                const  targetLine: string = line1;
                targetLineNum += 1;
                if (templateLineIndex === 0) {

                    const  indentLength = targetLine.indexOf(expectedFirstLine);
                    if (indentLength !== notFound  &&  targetLine.trim() === expectedFirstLine.trim()) {
                        result = Result.same;
                        indent = targetLine.substr(0, indentLength);
                    } else {
                        result = Result.different;
                    }
                } else if (skipTo === '') { // lineIndex >= 1, not skipping
                    const  expected = getExpectedLineInFileTemplate(
                        setting, this.templateLines[templateLineIndex]);

                    if (targetLine === indent + expected) {
                        result = Result.same;
                    } else if (expected.trim() === fileTemplateAnyLinesLabel) {
                        result = Result.skipped;
                        templateLineIndex += 1;
                        skipToTemplate = this.templateLines[templateLineIndex];
                        skipTo = getExpectedLineInFileTemplate(
                            setting, this.templateLines[templateLineIndex]);
                        skipFrom = targetLine;
                        skipStartLineNum = targetLineNum;
                    } else {
                        result = Result.different;
                        errorTemplateLineIndex = templateLineIndex;
                        errorTargetLineNum = targetLineNum;
                        errorContents = targetLine;
                        errorExpected = indent + expected;
                        errorTemplate = indent + this.templateLines[templateLineIndex];
                    }
                } else { // skipTo
                    if (targetLine === indent + skipTo) {
                        result = Result.same;
                    } else if (targetLine.trim() === ''  ||  targetLine.startsWith(indent)) {
                        result = Result.skipped;
                    } else {
                        result = Result.different;
                        errorTemplateLineIndex = templateLineIndex;
                        errorTargetLineNum = skipStartLineNum;
                        errorContents = skipFrom;
                        errorExpected = skipTo;
                        errorTemplate = skipToTemplate;
                    }
                }

                if (result === Result.same) {
                    templateLineIndex += 1;
                    if (templateLineIndex >= this.templateLines.length) {
                        loop = false;  // return or break must not be written.
                        // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                    }
                    skipTo = '';
                } else if (result === Result.skipped) {
                    // Do nothing
                } else {  // Result.different
                    templateLineIndex = 0;
                    skipTo = '';
                }
            } catch (e) {
                exception = e;
                loop = false;
            }
        }
        if (exception) {
            throw exception;
        }
        if (result !== Result.same) {
            var  templateLineNum = 0;
            if (result === Result.different) {
                templateLineNum = templateEndLineNum - this.templateLines.length + errorTemplateLineIndex;
            }
            if (result === Result.skipped) {
                templateLineNum = templateEndLineNum - this.templateLines.length + templateLineIndex;
                errorContents = skipFrom;
                errorExpected = skipTo;
                errorTemplate = skipToTemplate;
                errorTargetLineNum = skipStartLineNum;
            }
            if (errorContents === '') {
                errorContents = '(Not found)';
                errorExpected = expectedFirstLine;
                errorTemplate = this.templateLines[0];
            }
            console.log('');
            console.log(`${translate('Error of not same as file contents:')}`);
            console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${templateLineNum}`);
            console.log(`  ${translate('ErrorFile')}: ${getTestablePath(targetFilePath)}:${errorTargetLineNum}`);
            console.log(`  Template: ${errorTemplate}`);
            console.log(`  Expected: ${errorExpected}`);
            console.log(`  Contents: ${errorContents}`);
        }
        return  result === Result.same;
    }
}

// CheckedTemplateTag
interface  CheckedTemplateTag {
    templateLineNum: number;
    template: string;
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
    evaluate(line: string, setting: Settings, previsousEvalatedKeys: string[] = []): IfTagParserResult {
        var    expression = '';
        var    errorCount = 0;
        const  indentLength = indentRegularExpression.exec(line)![0].length;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {

                this.indentLengthsOfIfTag.pop();
                this.thisIsOutOfFalseBlock_ = lastOf(this.indentLengthsOfIfTag).enabled;
                this.isReplacable_          = lastOf(this.indentLengthsOfIfTag).isReplacable;
                if (this.parser.verbose) {
                    console.log(`Verbose: ${getTestablePath(this.parser.filePath)}:${this.parser.lineNum - 1}: end #if:`);
                }
            }
        }

        if (line.includes(ifLabel)) {
            expression = line.substr(line.indexOf(ifLabel) + ifLabel.length).trim();

            const  evaluatedContidion = evaluateIfCondition(expression, setting, this.parser, previsousEvalatedKeys);
            if (typeof evaluatedContidion === 'boolean') {
                var  resultOfIf = evaluatedContidion;
                var  isReplacable = false;
            } else if (instanceOf.EvaluatedCondition(evaluatedContidion)) {
                var  resultOfIf = evaluatedContidion.result;
                var  isReplacable = evaluatedContidion.isReplacable;
            } else {
                errorCount += 1;
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
        return  { condition: expression, errorCount };
    }
}

// IfTagParserResult
interface  IfTagParserResult {
    condition: string;
    errorCount: number;
}

// IfTrueConditionScanner
class  IfTrueConditionScanner {
    get       condition(): string {return this.condition_;}
    private   condition_: string = '';
    get       isUpdated(): boolean {return this.isUpdated_;}
    private   isUpdated_: boolean = false;
    readonly  indentLengthsOfIfTag: IfTagForConditionScanner[] = [
        {indentLength: -1, trueCondition: ''}
    ];

    // evaluate
    evaluate(line: string) {
        const  indentLength = indentRegularExpression.exec(line)![0].length;
        this.isUpdated_ = false;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {

                const  previousBlock = this.indentLengthsOfIfTag.pop();
                if (previousBlock  &&  previousBlock.trueCondition) {
                    this.isUpdated_ = true;
                }
            }
        }
        if (line.includes(ifLabel)) {
            const  expression = line.substr(line.indexOf(ifLabel) + ifLabel.length).trim();

            const  trueCondition = getTrueCondition(expression);
            if (trueCondition) {
                this.isUpdated_ = true;
            }
            this.indentLengthsOfIfTag.push({indentLength, trueCondition});
        }
        if (this.isUpdated_) {
            this.condition_ = this.indentLengthsOfIfTag.map((block)=>(block.trueCondition))
                .filter((trueCondition)=>(trueCondition)).join('\n');
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
async function  replace(inputFilePath: string) {
    for (const inputFileFullPath of await listUpFilePaths(inputFilePath)) {

        const  replaceKeyValuesSet = await makeReplaceSettingsFromToTags(inputFileFullPath);
        for (const replaceKeyValues of replaceKeyValuesSet) {
            if ( ! replaceKeyValues.testMode) {
                const  toTagLines: {[key: string]: number[]} = {};
                for (const [key, value] of Object.entries( replaceKeyValues.keyValues )) {
                    toTagLines[key] = value.lineNum.slice(); // copy
                    for (const lineNum of value.lineNum) {
                        console.log(`${getTestablePath(inputFileFullPath)}:${lineNum}: ${toLabel} ${key}: ${value.value}`);
                    }
                }

                await  replaceSettings(inputFileFullPath,
                    replaceKeyValues.settingNameOrLineNum, replaceKeyValues.keyValueLines, toTagLines, true);
            }
        }
    }
}

// revert
async function  revert(inputFilePath: string) {
    for (const inputFileFullPath of await listUpFilePaths(inputFilePath)) {
        const  text = fs.readFileSync(inputFileFullPath, "utf-8");
        if (text.includes(originalLabel)) {
            const  readStream = fs.createReadStream(inputFileFullPath);
            const  reader = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity
            });
            var  lineNum = 0;
            var  reverted = false;

            for await (const line1 of reader) {
                const  line: string = line1;
                lineNum += 1;
                if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                    reverted = false;
                }
                if (line.includes(originalLabel)  &&  ! reverted) {

                    await  revertSettings(inputFileFullPath, lineNum.toString());
                    reverted = true;
                }
            }
        }
    }
}

// check
async function  check(checkingFilePath?: string) {
    for (const inputFileFullPath of await listUpFilePaths(checkingFilePath)) {

        await checkRoutine(false, inputFileFullPath);
    }
}

// listUpFilePaths
async function  listUpFilePaths(checkingFilePath?: string) {
    const  targetFolders = await lib.parseCSVColumns(programOptions.folder);
    const  currentFolder = process.cwd();
    const  inputFileFullPaths: string[] = [];
    const  notFoundPaths: string[] = [];
    if (checkingFilePath) {
        targetFolders.push(currentFolder);

        for (const folder of targetFolders) {
            const  targetFolderFullPath = lib.getFullPath(folder, currentFolder);

            const  inputFileFullPath = lib.getFullPath(checkingFilePath, targetFolderFullPath);
            if (fs.existsSync(inputFileFullPath)) {
                inputFileFullPaths.push(inputFileFullPath);
                break;
            } else {
                notFoundPaths.push(inputFileFullPath);
            }
        }
        if (inputFileFullPaths.length === 0) {
            throw new Error(`Not found specified target file at "${JSON.stringify(notFoundPaths)}".`);
        }
    } else {

        for (const folder of targetFolders) {
            const { targetFolderFullPath, wildcard } = lib.getGlobbyParameters(folder, currentFolder)
            if (!fs.existsSync(targetFolderFullPath)) {
                throw new Error(`Not found target folder at "${targetFolderFullPath}".`);
            }
            process.chdir(targetFolderFullPath);
            const scanedPaths = await globby([`**/${wildcard}`]);
            scanedPaths.forEach((scanedPath) => {

                inputFileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath))
            });
        }
        process.chdir(currentFolder);
    }

    return  inputFileFullPaths;
}

// makeReplaceSettingsFromToTags
async function  makeReplaceSettingsFromToTags(inputFilePath: string): Promise<ReplaceKeyValues[]> {
    const  reader = readline.createInterface({
        input: fs.createReadStream(inputFilePath),
        crlfDelay: Infinity
    });
    var  lineNum = 0;
    var  isReadingSetting = false;
    var  setting: Settings = {};
    var  settingCount = 0;
    var  settingIndentLength = 0;
    var  key = '';
    var  previousTemplateTag: TemplateTag | null = null;
    var  replaceKeyValues = new ReplaceKeyValues();
    var  errorCount = 0;
    var  replaceKeyValuesSet: ReplaceKeyValues[] = [];
    const  parser = new Parser();
    parser.command = CommandEnum.replace;
    parser.verbose = ('verbose' in programOptions);
    parser.filePath = inputFilePath;
    if (parser.verbose) {
        console.log(`Verbose: makeReplaceSettingsFromToTags:`);
    }

    for await (const line1 of reader) {
        const  line: string = line1;
        lineNum += 1;
        parser.line = line;
        parser.lineNum = lineNum;

        // setting = ...
        if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
            isReadingSetting = true;

            setting = {};
            settingCount += 1;
            settingIndentLength = indentRegularExpression.exec(line)![0].length;
            previousTemplateTag = null;
            replaceKeyValues = new ReplaceKeyValues();
            replaceKeyValues.settingNameOrLineNum = lineNum.toString();
            replaceKeyValuesSet.push(replaceKeyValues);
        } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isReadingSetting) {
            isReadingSetting = false;
            key = '';
        }
        if (isReadingSetting) {
            const  separator = line.indexOf(':');
            if (separator !== notFound) {
                const  keyOrNot = line.substr(0, separator).trim();
                if (keyOrNot[0] !== '#') {

                    key = keyOrNot;
                    const  value = getValue(line, separator);
                    setting[key] = {value, isReferenced: false, lineNum: [lineNum]};
                }
            }
        }
        var  toLabelIndex = line.indexOf(toLabel)
        if (toLabelIndex !== notFound) {
            var  toValue = getValue(line, toLabelIndex + toLabel.length - 1);
        } else {
            toLabelIndex = line.indexOf(toTestLabel);
            if (toLabelIndex !== notFound) {
                var  toValue = getValue(line, toLabelIndex + toTestLabel.length - 1);
            } else {
                var  toValue = '';
            }
        }
        const  templateTag = parseTemplateTag(line, parser);
        if (templateTag.isFound) {
            previousTemplateTag = templateTag;
        }

        if (toValue) {
            const  hasTestTag = (line.indexOf(toTestLabel) !== notFound);
            if (hasTestTag) {
                replaceKeyValues.testMode = true;
            }

            // #to: tag in the settings
            if (isReadingSetting) {
                if (parser.verbose || hasTestTag) {
                    console.log(`Verbose:     ${getTestablePath(inputFilePath)}:${lineNum}:`);
                    console.log(`Verbose:         ${key}: ${toValue}`);
                }

                replaceKeyValues.pushKeyValue(key, {
                        value: toValue,
                        lineNum: [lineNum],
                    } as Setting);
            } else {

                // #to: tag after the #template:
                if (previousTemplateTag) {
                    if (parser.verbose || hasTestTag) {
                        console.log(`Verbose:     ${getTestablePath(inputFilePath)}:${lineNum}:`);
                    }
                    const  newKeyValues = await previousTemplateTag.scanKeyValues(toValue, Object.keys(setting), parser, hasTestTag);
                    errorCount += checkNoConfilict(replaceKeyValues.keyValues, newKeyValues, inputFilePath);
                    if (parser.verbose || hasTestTag) {
                        for (const [key_, newValue] of Object.entries(newKeyValues)) {
                            console.log(`Verbose:         ${key_}: ${newValue.value}`);
                        }
                    }
                    for (const [key_, newValue] of Object.entries(newKeyValues)) {

                        replaceKeyValues.pushKeyValue(key_, newValue);
                    }
                    previousTemplateTag = null;
                }
            }
        }
    }
    errorCount += parser.errorCount;
    if (errorCount >= 1) {
        replaceKeyValuesSet = [];
    } else {
        replaceKeyValuesSet = replaceKeyValuesSet.filter((replaceKeyValues)=>(Object.keys(replaceKeyValues.keyValues).length >= 1));
    }
    return  replaceKeyValuesSet;
}

// checkNoConfilict
function  checkNoConfilict(
        keyValueA: {[key: string]: Setting},
        keyValueB: {[key: string]: Setting},
        filePath: string): number /* error count */ {
    const  commonKeys = lib.getCommonElements(Object.keys( keyValueA ), Object.keys( keyValueB ));
    var  errorCount = 0;

    for (const key of commonKeys) {
        if (keyValueA[key].value !== keyValueB[key].value) {
            console.log('');
            console.log('Error of conflict #to: tag:');
            console.log(`    key: ${key}`);
            console.log(`    valueA: ${keyValueA[key].value} in ${getTestablePath(filePath)}:${keyValueA[key].lineNum}`);
            console.log(`    valueB: ${keyValueB[key].value} in ${getTestablePath(filePath)}:${keyValueB[key].lineNum}`);
            errorCount += 1;
        }
    }
    return  errorCount;
}

// checkLineNoConfilict
function  checkLineNoConfilict(keyValue: {[key: string]: string}, key: string, newValue: string, parser: Parser) {
    if (key in keyValue) {
        if (keyValue[key] !== newValue) {
            console.log('');
            console.log('Error of conflict #to: tag:');
            console.log(`    key: ${key}`);
            console.log(`    valueA: ${keyValue[key]} in ${getTestablePath(parser.filePath)}:${parser.lineNum}`);
            console.log(`    valueB: ${newValue} in ${getTestablePath(parser.filePath)}:${parser.lineNum}`);
            parser.errorCount += 1;
        }
    }
}

// search
async function  search() {
    const  startIndex = (programArguments[0] === 's'  ||  programArguments[0] === 'search') ? 1 : 0;
    const  keyword = programArguments.slice(startIndex).join(' ');
    const  cSearch = 1;
    const  cPrintRef = 2;
    const  cRunVerb = 3;

    if (keyword !== '') {
        const  lastWord = programArguments.length === 0 ? '' :  programArguments[programArguments.length - 1];
        const  hasVerb = numberRegularExpression.test(lastWord);
        var  command = cSearch;
        if (hasRefTag(keyword)) {
            if (hasVerb) {
                command = cRunVerb;
            } else {
                command = cPrintRef;
            }
        }
        if (command === cSearch) {

            await  searchSub(keyword, false);
        } else if (command === cPrintRef) {

            await  printRef(keyword);
        } else if (command === cRunVerb){
            const  keywordWithoutVerb = programArguments.slice(startIndex, programArguments.length - 1).join(' ');
            const  ref = await printRef(keywordWithoutVerb, {print: false});

            runVerb(ref.verbs, ref.address, ref.addressLineNum, lastWord);
        }
    } else {  // keyword === ''
        lib.inputSkip(startIndex);
        var  previousPrint = getEmptyOfPrintRefResult();
        for (;;) {
            var  prompt = 'keyword:';
            if (previousPrint.hasVerbMenu) {
                var  prompt = 'keyword or number:';
            }

            const  keyword = await lib.input(chalk.yellow( prompt ) + ' ');
            if (keyword === 'exit()') {
                break;
            } else if (keyword === '') {
                if (previousPrint.hasFindMenu) {
                    await  findSub(previousPrint.previousKeyword);
                }
                previousPrint.hasVerbMenu = false;
                previousPrint.hasFindMenu = false;
            } else {
                var  command = cSearch;
                if (previousPrint.hasVerbMenu  &&  numberRegularExpression.test(keyword)) {
                    command = cRunVerb;
                } else if (hasRefTag(keyword)) {
                    command = cPrintRef;
                }
                if (command === cSearch) {

                    previousPrint = await searchSub(keyword, false);
                    if (previousPrint.hasFindMenu) {
                        console.log(translate`Not found. To do full text search, press Enter key.`);
                    }
                } else if (command === cPrintRef) {

                    previousPrint = await printRef(keyword);
                } else if (command === cRunVerb) {
                    const  verbNumber = keyword;

                    runVerb(previousPrint.verbs, previousPrint.address, previousPrint.addressLineNum, verbNumber);
                }
            }
        }
    }
}

// searchSub
async function  searchSub(keyword: string, isMutual: boolean): Promise<PrintRefResult> {
    for (const ignoredKeyword of ignoredKeywords) {
        keyword = keyword.replace(ignoredKeyword, '')
    }
    keyword = keyword.trim();
    const  currentFolder = process.cwd();
    const  fileFullPaths: string[] = [];
    const  targetFolders = await lib.parseCSVColumns(programOptions.folder);
    for (const folder of targetFolders) {
        const { targetFolderFullPath, wildcard } = lib.getGlobbyParameters(folder, currentFolder)
        if (!fs.existsSync(targetFolderFullPath)) {
            throw new Error(`Not found target folder at "${targetFolderFullPath}".`);
        }
        process.chdir(targetFolderFullPath);
        const scanedPaths = await globby([`**/${wildcard}`]);
        scanedPaths.forEach((scanedPath) => {

            fileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath))
        });
    }
    process.chdir(currentFolder);
    const  thesaurus = new Thesaurus();
    const  glossaryTags: GlossaryTag[] = [];
    var  foundLines: FoundLine[] = [];
    if ('thesaurus' in programOptions) {
        const  thesaurusFilePath = programOptions.thesaurus;
        if ( ! fs.existsSync(thesaurusFilePath)) {
            throw  new Error(`not found the thesaurus file "${lib.getFullPath(thesaurusFilePath, process.cwd())}"`);
        }
        await  thesaurus.load(thesaurusFilePath);
    }

    for (const inputFileFullPath of fileFullPaths) {
        const  reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        const  blockDisable = new BlockDisableTagParser();
        var  lineNum = 0;

        for await (const line1 of reader) {
            const  line: string = line1;
            lineNum += 1;
            blockDisable.evaluate(line);
            const  indexOfKeywordLabel = line.indexOf(keywordLabel);
            const  indexOfSearchLabelIfMutual = (isMutual) ? line.indexOf(searchLabel) : notFound;

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

                const  found = getKeywordMatchingScore(columns, keyword, thesaurus);
                if (found.matchedKeywordCount >= 1) {
                    const  unescapedLine = unscapePercentByte(line);
                    if (withParameter) {
                        var  positionOfCSV = unescapedLine.indexOf(csv, unescapedLine.indexOf(label) + labelLength);
                    } else {
                        var  positionOfCSV = unescapedLine.indexOf(csv);
                    }
                    const  columnPositions = lib.parseCSVColumnPositions(csv, columns);

                    found.score += keywordMatchScore;
                    found.path = getTestablePath(inputFileFullPath);
                    found.lineNum = lineNum;
                    found.line = unescapedLine;
                    found.tagLabel = label;
                    for (const match of found.matches) {
                        match.position += positionOfCSV + columnPositions[match.testTargetIndex];
                    }
                    foundLines.push(found);
                }
            }

            // glossary tag
            var  glossaryTag: GlossaryTag | undefined = undefined;
            if (line.trim() !== '') {
                if (glossaryTags.length >= 1) {
                    glossaryTag = glossaryTags[glossaryTags.length - 1];
                }
                const  currentIndent = indentRegularExpression.exec(line)![0];
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

                        const  found = getKeywordMatchingScore([wordInGlossary], keyword, thesaurus);
                        if (found.matchedKeywordCount >= 1  &&  colonPosition !== notFound) {

                            found.score += glossaryMatchScore;
                            found.path = getTestablePath(inputFileFullPath);
                            found.lineNum = lineNum;
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
                            foundLines.push(found);
                        }
                    }
                }
            }
        }
    }
    const  keyphraseWordCount = keyword.split(' ').length;

    foundLines = foundLines.filter((found) => (found.matchedKeywordCount >= keyphraseWordCount));

    foundLines.sort(compareScore);
    for (const foundLineInformation of foundLines) {

        console.log(foundLineInformation.toString());
    }

    if (foundLines.length >= 1  &&  lastOf(foundLines).line.includes(refLabel)) {
        const  foundLine = lastOf(foundLines).line;
        const  refTagPosition = foundLine.indexOf(refLabel);
        const  nextTagPosition = foundLine.indexOf(' #', refTagPosition + 1);
        if (nextTagPosition === notFound) {
            var  refTagAndAddress = foundLine.substr(refTagPosition);
        } else {
            var  refTagAndAddress = foundLine.substr(refTagPosition,  nextTagPosition - refTagPosition);
        }

        return  await printRef(refTagAndAddress);
    } else {
        const  normalReturn = getEmptyOfPrintRefResult();
        if (foundLines.length === 0) {
            normalReturn.previousKeyword = keyword;
            normalReturn.hasFindMenu = true;
        }
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
                            found.score += result.score + orderMatchScoreWeight;
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
                                found.score += result.score * orderMatchScoreWeight;
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
                    found.score += 2 * (keyphrase.length - aTestingString.length);  // 2 is double score from the score of different (upper/loser) case
                    found.testedWordCount = aTestingString.split(' ').length;
                    found.matchedTargetKeywordCount = matchedCountsByWord.filter((count)=>(count >= 1)).length;
                }
                const  matches = bestFound.matches.concat(found.matches);
                if (compareScore(bestFound, found) < 0) {

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

// compareScore
function  compareScore(a: FoundLine, b: FoundLine) {
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

// find
async function  find() {
    const  keyword = programArguments.slice(1).join(' ');
    if (keyword === '') {
        search();
    } else {
        await  findSub(keyword);
    }
}

// findSub
async function  findSub(keyword: string) {
    const  keywordLowerCase = keyword.toLowerCase();
    for (const inputFileFullPath of await listUpFilePaths()) {
        const  reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        var  lineNum = 0;

        for await (const line1 of reader) {
            const  line: string = line1;
            lineNum += 1;

            const  keywordIndex = line.toLowerCase().indexOf(keywordLowerCase);
            if (keywordIndex !== notFound) {

                console.log(`${pathColor(getTestablePath(inputFileFullPath))}${lineNumColor(`:${lineNum}:`)} ` +
                    line.substr(0, keywordIndex) +
                    matchedColor(line.substr(keywordIndex, keyword.length)) +
                    line.substr(keywordIndex + keyword.length));
            }
        }
    }
}

// mutualSearch
async function  mutualSearch() {
    const  keyword = programArguments.slice(1).join(' ');

    await  searchSub(keyword, true);
}

// lookUpVariable
async function  lookUpVariable(variableName: string, inputFilePath: string, referenceLineNum: number) {
    const  valueColor = chalk.yellow;
    for (const inputFileFullPath of await listUpFilePaths(inputFilePath)) {
        const  reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        var  lineNum = 0;
        var  isReferenceFound = false;
        var  isReadingSetting = false;
        var  settingIndentLength = 0;
        var  foundLine = '';

        for await (const line1 of reader) {
            const  line: string = line1;
            lineNum += 1;

            // setting = ...
            if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                isReadingSetting = true;
                settingIndentLength = indentRegularExpression.exec(line)![0].length;
                foundLine = '';
            } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isReadingSetting) {
                isReadingSetting = false;
                isReferenceFound = false;
            }
            if (isReadingSetting) {
                const  separator = line.indexOf(':');
                if (separator !== notFound) {
                    const  keyOrNot = line.substr(0, separator).trim();
                    if (keyOrNot[0] !== '#') {
                        const  key = keyOrNot;

                        if (key === variableName) {
                            const  value = getValue(line, separator);
                            const  valueIndex = line.indexOf(value, separator);

                            foundLine = `${pathColor(getTestablePath(inputFileFullPath))}${lineNumColor(`:${lineNum}:`)} ` +
                                line.substr(0, valueIndex) + valueColor(value) + line.substr(valueIndex + value.length);
                            if (referenceLineNum === 0  ||  isReferenceFound) {
                                console.log(foundLine);
                            }
                        }
                    }
                }
            }
            if (lineNum === referenceLineNum) {
                if (foundLine) {
                    console.log(foundLine);
                } else if (isReadingSetting) {
                    isReferenceFound = true;
                }
            }
        }
    }
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
    hasVerbMenu: boolean;
    verbs: Verb[];
    address: string;
    addressLineNum: number;
    hasFindMenu: boolean;
    previousKeyword: string;
}

// getEmptyOfPrintRefResult
function  getEmptyOfPrintRefResult(): PrintRefResult {
    return  {
        hasVerbMenu: false,
        verbs: [],
        address: '',
        addressLineNum: 0,
        hasFindMenu: false,
        previousKeyword: '',
    }
}

// printRef
async function  printRef(refTagAndAddress: string, option = printRefOptionDefault): Promise<PrintRefResult> {
    const  addressBefore = refTagAndAddress.trim().substr(refLabel.length).trim();
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
                    const  startsBackSlash = (match.substr(0,1) === '\\');
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
        address = lib.getHomePath() + address.substr(1);
    }

    // linkableAddress = ...
    var  linkableAddress = address;
    var  addressLineNum = 0;
    const  getter = getRelatedLineNumGetter(address);
    if (getter.type === 'text') {
        const  { filePath, lineNum } = await searchAsText(getter, address);

        linkableAddress = getter.address
            .replace(verbVar.file, filePath.replace(/\\/g, '/'))
            .replace(verbVar.windowsFile, filePath.replace(/\//g, '\\'))
            .replace(verbVar.fragment, '')
            .replace(verbVar.lineNum, lineNum.toString());
            // This format is hyperlinkable in the Visual Studio Code Terminal
        addressLineNum = lineNum;
    }

    // recommended = ...
    var  recommended = address;
    recommended = recommended.replace(/\$/g,'\\$');
    const  lowerCaseDriveRegExp = /^[a-z]:/;
    const  upperCaseDriveRegExp = /^[A-Z]:/;
    const  sortedEnvronmentVariables: KeyValue[] = [];
    const  reservedNames = ['TYPRM_FOLDER'];
    for (const [envName, envValue] of Object.entries(process.env)) {
        if (envName.startsWith(typrmEnvPrefix)  &&  ! reservedNames.includes(envName)  &&  envValue) {
            const  variableName = envName.substr(typrmEnvPrefix.length);
            const  value = envValue!.replace(/\\/g,'/');

            sortedEnvronmentVariables.push({key: variableName, value});
            if (lowerCaseDriveRegExp.test(value)) {
                sortedEnvronmentVariables.push({key: variableName, value:
                    value.substr(0,1).toUpperCase() + value.substr(1)});
            } else if (upperCaseDriveRegExp.test(value)) {
                sortedEnvronmentVariables.push({key: variableName, value:
                    value.substr(0,1).toLowerCase() + value.substr(1)});
            }
        }
    }
    sortedEnvronmentVariables.sort((a: KeyValue, b: KeyValue) => {
        return  b.value.length - a.value.length;  // descending order
    });

    for (const variable of sortedEnvronmentVariables) {

        recommended = recommended.replace(
            new RegExp(lib.escapeRegularExpression( variable.value.replace('\\','\\\\')), 'g'),
            '${'+ variable.key +'}');  // Change the address to an address with variables
    }
    if (recommended.replace(/\\/g,'/').startsWith(lib.getHomePath().replace(/\\/g,'/'))) {
        recommended = '~' + recommended.substr(lib.getHomePath().length);
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
function  getRelatedLineNumGetter(address: string): LineNumGetter {
    if (process.env.TYPRM_LINE_NUM_GETTER) {

        const  searchConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof searchConfig === 'object'  &&  searchConfig) {
            const  searchs = searchConfig as LineNumGetter[];
            for (const search of searchs) {

                if (new RegExp(search.regularExpression).test(address)) {
                    return  search;
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
        var stdout_ = '';
        try {
            if ('verbose' in programOptions) {
                console.log(`Verbose: command: ${command}`);
            }

            stdout_ = child_process.execSync( command ).toString();
            if (runningOS === 'Windows') {
                stdout_ = stdout_.substr(0, stdout_.length - 2);  // Cut last '\r\n'
            } else {
                stdout_ = stdout_.substr(0, stdout_.length - 1);  // Cut last '\n'
            }
        } catch (e: any) {
            stdout_ = e.toString();
        }
        console.log(stdout_);
    } else {
        console.log(translate`Error that verb number ${verbNum} is not defined`);
    }
}

// printConfig
function  printConfig() {
    if ('folder' in programOptions) {
        console.log(`Verbose: --folder, TYPRM_FOLDER: ${programOptions.folder}`);
    }
    if ('thesaurus' in programOptions) {
        console.log(`Verbose: --thesaurus, TYPRM_THESAURUS: ${programOptions.thesaurus}`);
    }
    for (const [envName, envValue] of Object.entries(process.env)) {
        if (envName.startsWith('TYPRM_')  &&  envName !== 'TYPRM_LINE_NUM_GETTER'  &&  envName !== 'TYPRM_VERB') {

            console.log(`Verbose: ${envName} = ${envValue}`);
        }
    }
    if (process.env.TYPRM_LINE_NUM_GETTER) {
        const  getterConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof getterConfig === 'object'  &&  getterConfig) {
            const  getters = getterConfig as LineNumGetter[];
            var  index = 0;
            for (const getter of getters) {

                console.log(`Verbose: TYPRM_LINE_NUM_GETTER[${index}]:`);
                console.log(`Verbose:     regularExpression: ${getter.regularExpression}`);
                console.log(`Verbose:     type: ${getter.type}`);
                console.log(`Verbose:     filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
                console.log(`Verbose:     keywordRegularExpressionIndex: ${getter.keywordRegularExpressionIndex}`);
                console.log(`Verbose:     csvOptionRegularExpressionIndex: ${getter.csvOptionRegularExpressionIndex}`);
                console.log(`Verbose:     targetMatchIdRegularExpressionIndex: ${getter.targetMatchIdRegularExpressionIndex}`);
                console.log(`Verbose:     address: ${getter.address}`);
                index += 1;
            }
        }
    }
    if (process.env.TYPRM_VERB) {
        const  verbConfig = yaml.load(process.env.TYPRM_VERB);
        if (typeof verbConfig === 'object'  &&  verbConfig) {
            const  verbs = verbConfig as Verb[];
            var  index = 0;
            for (const verb of verbs) {

                console.log(`Verbose: TYPRM_VERB[${index}]:`);
                console.log(`Verbose:     regularExpression: ${verb.regularExpression}`);
                console.log(`Verbose:     label: ${verb.label}`);
                console.log(`Verbose:     number: ${verb.number}`);
                console.log(`Verbose:     command: ${verb.command}`);
                index += 1;
            }
        }
    }
}

// varidateMutualSearchCommandArguments
function  varidateMutualSearchCommandArguments() {
    if (programArguments.length < 2) {
        throw new Error('Error: Too few argurments.\n' +
            'typrm mutual-search  __Keywords__"')
    }
}

// varidateUpdateCommandArguments
function  varidateReplaceCommandArguments() {
    if (programArguments.length < 2) {
        throw new Error('Error: Too few argurments.\n' +
            'Parameters1: typrm replace  __FilePath__  "__KeyColonValue__"\n' +
            'Parameters2: typrm replace  __FilePath__  __NearbyLineNumOrSettingName__  "__KeyColonValue__"')
    }
}

// varidateRevertCommandArguments
function  varidateRevertCommandArguments() {
    if (programArguments.length < 2) {
        throw new Error('Error: Too few argurments.\n' +
            'Parameters1: typrm revert  __FilePath__\n' +
            'Parameters2: typrm revert  __FilePath__  __NearbyLineNumOrSettingName__')
    }
}

// onEndOfSettingScope
function onEndOfSettingScope(setting: Settings, inputFilePath: string) {
var d = pp('onEndOfSettingScope')
pp(setting)
    for (const key of Object.keys(setting)) {
pp(`${lib.getObjectID(setting[key])}: ${key} .isReferenced: ${setting[key].isReferenced}`);
        if (!setting[key].isReferenced) {
            console.log('');
            console.log(translate`Error: ${getTestablePath(inputFilePath)} ${setting[key].lineNum}`);
            console.log(translate`  Not referenced: ${key}`);
        }
    }
pp('')
}

// evaluateIfCondition
function  evaluateIfCondition(expression: string, setting: Settings, parser: Parser,
        previsousEvalatedKeyValues: string[] = [])
        : boolean | Error | EvaluatedCondition {
pp('evaluateIfCondition')

    if (expression === 'true') {
        if (parser.verbose) {
            console.log(`Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: true`);
        }
        return  true;
    } else if (expression === 'false') {
        if (parser.verbose) {
            console.log(`Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: false`);
        }
        return  false;
    }
    const  settingsDot = '$settings.';
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
pp(`a) ${lib.getObjectID(setting[name])}: ${name} .isReferenced = true`);
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
                        console.log(`Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: skipped evaluation: #if: ${expression}`);
                    } else if (parser.command == CommandEnum.check) {
                        console.log(`Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: ${expression}  (${result}, ${name} = ${leftValue})`);
                    }
                }

                return  result;
            } else　{
                const  isReplacable = previsousEvalatedKeyValues.includes(name)  ||  parent !== settingsDot;
                if (parser.verbose) {
                    if ( ! isReplacable) {
                        console.log(`Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: skipped evaluation: #if: ${expression}`);
                    } else {
                        console.log(`Verbose: ${getTestablePath(parser.filePath)}:${parser.lineNum}: #if: ${expression}  (${result}, ${name} = ${leftValue})`);
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

// getTrueCondition
function  getTrueCondition(expression: string): /* '' or 'key: value' */ string {
    const  settingsDot = '$settings.';
    if (expression.startsWith(settingsDot)) {

        // e.g. $settings.__Stage__ == develop
        // e.g. $settings.__Stage__ != develop
        const  match = /\$settings.([^ ]*) *(==|!=) *([^ ].*)/.exec(expression);
        if (match) {
            const  name = match[1];
            const  operator = match[2];
            const  rightValue = match[3];
            if (rightValue !== '') {
                var  trueCondition: string | undefined;
                if (operator === '==') {

                    trueCondition = `${name}: ${rightValue}`;
                } else if (operator === '!=') {
                    trueCondition = `${name}: __not_${rightValue}`;
                }
                if (trueCondition) {

                    return  trueCondition;
                }
            }
        }
    }
    return  '';
}

// getSettingIndexFromLineNum
async function  getSettingIndexFromLineNum(inputFilePath: string, settingNameOrLineNum: string): Promise<number | null> {
    const  reader = readline.createInterface({
        input: fs.createReadStream(inputFilePath),
        crlfDelay: Infinity
    });
    var  settingCount = 0;
    var  lineNum = 0;
    var  breaking = false;
    var  isFound = false;
    var  exception: any;
    var  targetLineNum: number | undefined;
    var  targetSettingName: string | undefined;
    const  isOneSetting = (settingNameOrLineNum === '');
    if (numberRegularExpression.test(settingNameOrLineNum)) {
        targetLineNum = parseInt(settingNameOrLineNum);
    } else {
        targetSettingName = (targetLineNum) ? undefined : settingNameOrLineNum;
    }

    for await (const line1 of reader) {
        if (breaking) {continue;}  // "reader" requests read all lines
        try {
            const  line: string = line1;
            lineNum += 1;
            var  currentSettingName: string | undefined = undefined;

            if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                settingCount += 1;
                if (settingStartLabel.test(line.trim())) {
                    currentSettingName = settingStartLabel.exec(line.trim())![3];
                        // If setting name is empty, currentSettingName = undefined;
                } else {
                    currentSettingName = settingStartLabelEn.exec(line.trim())![3];
                }
            }

            if (lineNum === targetLineNum) {
                breaking = true;  // return or break must not be written.
                    // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                isFound = true;
            }
            if (targetSettingName  &&  currentSettingName === targetSettingName) {
                breaking = true;  // return or break must not be written.
                isFound = true;
            }
        } catch (e) {
            exception = e;
            breaking = true;
        }
    }
    if (exception) {
        throw exception;
    }
    var  settingIndex: number | null = null;
    if (isOneSetting) {
        settingIndex = 1;
        if (settingCount !== 1) {
            throw  new Error(translate('Settings cannot be identified, because the file has 2 or more settings. ' +
                'Add line number parameter.'))
        }
    } else {
        if (isFound) {
            if (settingCount >= 1) {
                settingIndex = settingCount;
            } else {
                settingIndex = 1;
            }
        } else if (targetLineNum !== undefined  &&  targetLineNum < lineNum) {
            settingIndex = 1;
        } else if (targetLineNum !== undefined  &&  targetLineNum >= lineNum) {
            settingIndex = settingCount;
        } else {
            settingIndex = null;
        }
    }
    return  settingIndex;
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
function  getExpectedLine(setting: Settings, template: string): string {
    return  getExpectedLineAndEvaluationLog(setting, template, false).expected;
}

// getExpectedLineAndEvaluationLog
function  getExpectedLineAndEvaluationLog(setting: Settings, template: string, withLog: boolean
        ): {expected: string, log: EvaluationLog[]} {
    var  expected = template;
    const  log: EvaluationLog[] = [];

    for (const key of Object.keys(setting)) {
        const  re = new RegExp(lib.escapeRegularExpression( key ), "gi" );

        const  expectedAfter = expected.replace(re, setting[key].value.replace(/\$/g,'$$'));
        if (expectedAfter !== expected) {
pp(`b) ${lib.getObjectID(setting[key])}: ${key} .isReferenced = true`);
            setting[key].isReferenced = true;
            log.push({before: key, after: setting[key].value});
        }
        expected = expectedAfter;
    }
    return  {expected, log};
}

// getExpectedLineInFileTemplate
function  getExpectedLineInFileTemplate(setting: Settings, template: string) {

    var  expected = getExpectedLine(setting, template);
    const  templateIndex = expected.indexOf(templateLabel);
    if (templateIndex !== notFound) {

        expected = expected.substr(0, templateIndex);
        expected = expected.trimRight();
    }
    return  expected;
}

// getReplacedLine
function  getReplacedLine(setting: Settings, template: string, replacedValues: {[key:string]: string}): string {
    const  replacedSetting: Settings = {};
    for (const key of Object.keys(setting)) {
        if (key in replacedValues) {

            // var  value = replacedValues[key];
            var  value = setting[key].value;
        } else {
            var  value = setting[key].value;
        }
        replacedSetting[key] = { value, lineNum: [] /*dummy*/,  isReferenced: true /*dummy*/ };
    }

    return  getExpectedLine(replacedSetting, template);
}

// parseKeyValues
function  parseKeyValueLines(keyValueLines: string): {[key:string]: string} {
    const  keyValues: {[key:string]: string} = {};
    for (const keyValueString of keyValueLines.split('\n')) {
        const  separator = keyValueString.indexOf(':');
        const  key = keyValueString.substr(0, separator).trim();
        const  value = getValue(keyValueString, separator);

        keyValues[key] = value;
    }
    return  keyValues;
}

// getValue
function  getValue(line: string, separatorIndex: number = -1) {

    var  value = line.substr(separatorIndex + 1).trim();
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
    indices: {[startLineNum: number]: string} = {};  // e.g. { 1: "/",  4: "/1",  11: "/1/1",  14: "/1/2",  17: "/2" }
    settings: {[indices: string]: {[name: string]: Setting}} = {};
    settingsInformation: {[indices: string]: SettingsInformation} = {};
    errorCount: number = 0;

    currentSettings: {[name: string]: Setting} = {};
    currentSettingIndex = '';
    nextSettingsLineNum = 1;
    nextLineNumIndex = 0;
    outOfScopeSettingIndices: string[] = [];

    moveToLine(lineNum: number) {

        // If compatible mode
        if (lineNum === this.nextSettingsLineNum) {
            const  index = this.indices[lineNum];  // e.g. "/a/b"

            if (this.currentSettingIndex) {
                this.outOfScopeSettingIndices = [ this.currentSettingIndex ];
            }
            this.currentSettings = this.settings[index];
            this.currentSettingIndex = index;
            const  startLineNums = Object.keys(this.indices);
            if (this.nextLineNumIndex < startLineNums.length) {
                this.nextLineNumIndex += 1;

                this.nextSettingsLineNum = parseInt(startLineNums[this.nextLineNumIndex]);
            } else {
                this.nextSettingsLineNum = 0;
            }
        } else {
            this.outOfScopeSettingIndices = [];
        }

        return  this.currentSettings;

        // // If tree mode
        // if (lineNum === this.nextSettingLineNum) {
        //     const  index = this.indices[lineNum];  // e.g. "/a/b"
        //     var    parentIndex = '/';
        //     var    separatorPosition = 0;
        // 
        //     this.currentSettings = {};
        //     for (;;) {
        //         const  parentSetting = this.settings[parentIndex];
        // 
        //         this.currentSettings = { ...this.currentSettings, ...parentSetting };
        //         separatorPosition = index.indexOf('/', separatorPosition + 1);
        //         if (separatorPosition === notFound) {
        //             break;
        //         }
        //         parentIndex = index.substr(0, separatorPosition);
        //     }
        //     const  startLineNums = Object.keys(this.indices);
        //     if (this.nextLineNumIndex < startLineNums.length) {
        //         this.nextLineNumIndex += 1;
        // 
        //         this.nextSettingLineNum = parseInt(startLineNums[this.nextLineNumIndex]);
        //     } else {
        //         this.nextSettingLineNum = 0;
        //     }
        // outOfScopeSettingIndices
        // }
        // 
        // return  this.currentSettings;
    }

    moveToEndOfFile() {

        // If compatible mode
        this.outOfScopeSettingIndices = [ this.currentSettingIndex ];
        this.currentSettings = {};
        this.currentSettingIndex = '';
        this.nextSettingsLineNum = 0;
        this.nextLineNumIndex = 0;

        // If tree mode
        // Not implemeted yet
    }
}

// SettingsInformation
interface SettingsInformation {
    index: string;
    lineNum: number;
}

// Settings
type Settings = {[name: string]: Setting}

// Setting
interface Setting {
//(ToDo)    name?: string;
    value: string;
    lineNum: number[];  // This count is the same as #to: tag count
//(ToDo)
//    StartLineNum?: number;
//    LastLineNum?: number;
    isReferenced: boolean;
}

// ReplaceKeyValues
class ReplaceKeyValues {

    settingNameOrLineNum: string = '';
    keyValues: {[name: string]: Setting} = {};
    testMode: boolean = false;

    get  keyValueLines(): string {
        var  lines = '';
        for (const [key, setting] of Object.entries(this.keyValues)) {
            lines += `${key}: ${setting.value}\n`;
        }
        return  lines;
    }

    pushKeyValue(key: string, keyValue: Setting) {
        if ( ! (key in this.keyValues)) {
            this.keyValues[key] = keyValue;
        } else {
            this.keyValues[key].lineNum.push(keyValue.lineNum[0]);
        }
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
                    csvParse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',', relax_column_count: true }))
                .on('data',
                    (columns) => {
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
    matches: MatchedPart[] = [];
    matchedKeywordCount: number = 0;
    matchedTargetKeywordCount: number = 0;
    testedWordCount: number = 0;
    tagLabel: string = '';  // keywordLabel, searchLabel
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
                line.substr(previousPosition,  match.position - previousPosition) +
                matchedColor( line.substr(match.position, match.length) );
            previousPosition = match.position + match.length;
        }
        coloredLine += line.substr(previousPosition);

        const  refColor = chalk.yellow;
        const  refIndex = coloredLine.indexOf(refLabel);
        if (refIndex !== notFound) {
            const  commentIndex = coloredLine.indexOf(' #', refIndex + refLabel.length);
            if (commentIndex === notFound) {
                var  refTagAndParameter = coloredLine.substr(refIndex).trim();
            } else {
                var  refTagAndParameter = coloredLine.substr(refIndex,  commentIndex - refIndex).trim();
            }
            coloredLine =
                coloredLine.substr(0, refIndex) +
                refColor( refTagAndParameter ) +
                coloredLine.substr(refIndex + refTagAndParameter.length);
        }

        if (this.tagLabel !== searchLabel) {
            const  searchColor = chalk.yellow;
            const  searchIndex = coloredLine.indexOf(searchLabel);
            if (searchIndex !== notFound) {
                const  spaceCount = indentRegularExpression.exec(coloredLine.substr(searchIndex + searchLabel.length))![0].length;
                const  parameterIndex = searchIndex + searchLabel.length + spaceCount;
                const  commentIndex = coloredLine.indexOf(' #', parameterIndex);
                if (commentIndex === notFound) {
                    var  searchKeyword = coloredLine.substr(parameterIndex).trim();
                } else {
                    var  searchKeyword = coloredLine.substr(parameterIndex,  commentIndex - parameterIndex).trim();
                }
                coloredLine =
                    coloredLine.substr(0, parameterIndex) +
                    searchColor( searchKeyword ) +
                    coloredLine.substr(parameterIndex + searchKeyword.length);
            }
        }
        if (false) {
            var  debugString = ` (score: ${this.score}, wordCount: ${this.testedWordCount}, matchedCount: ${this.matchedTargetKeywordCount})`;
        } else {
            var  debugString = ``;
        }

        // colored string
        return `${pathColor(this.path)}${lineNumColor(`:${this.lineNum}:`)} ${coloredLine}${debugString}`;
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

// LineNumGetter
interface  LineNumGetter {
    regularExpression: string;
    type: string;
    filePathRegularExpressionIndex: number;
    keywordRegularExpressionIndex: number;
    csvOptionRegularExpressionIndex: number;
    targetMatchIdRegularExpressionIndex: number;
    address: string;
}

// FilePathAndKeyword
interface  FilePathAndKeyword {
    filePath: string;
    keyword: string;
    csvOption: boolean;
    targetMatchID: number;
}

// splitFilePathAndKeyword
function  splitFilePathAndKeyword(address: string, getter: LineNumGetter): FilePathAndKeyword {

    const  verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
        console.log(`Verbose:     address: ${address}`);
        console.log(`Verbose:     regularExpression: ${getter.regularExpression}`);
        console.log(`Verbose:     filePathRegularExpressionIndex: ${getter.filePathRegularExpressionIndex}`);
        console.log(`Verbose:     keywordRegularExpressionIndex: ${getter.keywordRegularExpressionIndex}`);
        console.log(`Verbose:     csvOptionRegularExpressionIndex: ${getter.csvOptionRegularExpressionIndex}`);
        console.log(`Verbose:     targetMatchIdRegularExpressionIndex: ${getter.targetMatchIdRegularExpressionIndex}`);
    }

    const  parameters = (new RegExp(getter.regularExpression)).exec(address);
    if ( ! parameters) {
        throw  new Error(`ERROR: regularExpression (${getter.regularExpression}) of regularExpression ` +
            `"${getter.regularExpression}" in TYPRM_LINE_NUM_GETTER is not matched.` +
            `testing string is "${address}".`);
    }
    if (verboseMode) {
        console.log(`Verbose:     matched: [${parameters.join(', ')}]`);
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

    var  targetMatchID = 1;
    if (parameters.length >= getter.targetMatchIdRegularExpressionIndex) {
        targetMatchID = parseInt(parameters[getter.targetMatchIdRegularExpressionIndex]);
        if ( ! targetMatchID  ||  targetMatchID < 1) {
            targetMatchID = 1;
        }
    }

    return {
        filePath: parameters[getter.filePathRegularExpressionIndex],
        keyword:  parameters[getter.keywordRegularExpressionIndex],
        csvOption,
        targetMatchID,
    } as FilePathAndKeyword;
}

// searchAsText
async function  searchAsText(getter: LineNumGetter, address: string): /* linkableAddress */ Promise<FilePathLineNum> {
    const  { filePath, keyword, csvOption, targetMatchID } = splitFilePathAndKeyword(address,  getter);
    if ( ! fs.existsSync(filePath)) {
        console.log(`ERROR: not found a file at "${getTestablePath(lib.getFullPath(filePath, process.cwd()))}"`);
        return  { filePath, lineNum: notFound };
    }
    if (csvOption) {
        var    keywords = await lib.parseCSVColumns(keyword);
        const  firstKeyword = keywords.shift();
        if ( ! firstKeyword) {
            console.log(`ERROR: no keywords at "${getTestablePath(lib.getFullPath(filePath, process.cwd()))}"`);
            return  { filePath, lineNum: notFound };
        }
        if (targetMatchID !== 1) {
            console.log(`ERROR: both csvOption and targetMatchID must not be specified at "${getTestablePath(lib.getFullPath(filePath, process.cwd()))}"`);
            return  { filePath, lineNum: notFound };
        }
        var  currentKeyword = firstKeyword;
    } else {
        var  keywords = [keyword];
        var  currentKeyword = keyword;
    }

    const  reader = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    var  lineNum = 0;
    var  breaking = false;
    var  exception: any;
    var  foundCount = 0;

    for await (const line1 of reader) {
        if (breaking) {continue;}  // "reader" requests read all lines
        try {
            const  line: string = line1;
            lineNum += 1;

            if (line.includes(currentKeyword)) {
                if ( ! csvOption) {
                    foundCount += 1;
                    if (foundCount >= targetMatchID) { // targetMatchID
                        breaking = true;  // return or break must not be written.
                        // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                    }
                } else { // csvOption
                    const  nextKeyword = keywords.shift();
                    if ( ! nextKeyword) {
                        breaking = true;  // return or break must not be written.
                        currentKeyword = '';
                    } else {
                        currentKeyword = nextKeyword;
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
    if ( ! breaking) {
        lineNum = 0;
    }

    return  { filePath, lineNum };
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

// EvaluationLog
interface  EvaluationLog {
    before: string;
    after: string;
}

// Parser
class  Parser {
    command = CommandEnum.unknown;
    errorCount = 0;
    verbose = false;
    filePath = '';
    lineNum = 0;
    line = '';
}

// WriteBuffer
class  WriteBuffer {
    stream: fs.WriteStream;
    lineBuffer: string[];

    constructor(stream: fs.WriteStream) {
        this.stream = stream;
        this.lineBuffer = [];
    }

    end() {
        for (const line  of  this.lineBuffer) {
            this.stream.write(line);
        }
        this.stream.end();
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
}

// isSameArrayOf
// T: string, nunmber
function isSameArrayOf<T>(log: T[], answer: T[]): boolean {
  const matched = log.filter( (item) => answer.includes( item ) );
  const isSame = (matched.length === answer.length && log.length === answer.length);
  return isSame;
}

// getStdOut
// Example:
//    var d = getStdOut();  // Set break point here and watch the variable d
function  getStdOut(): string[] {
    return  stdout.split('\n');
}

// println
// #keyword: println, console.log, consoleLog
// Output any text to standard output.
function  println(message: any, delayedExpanding: boolean = false) {
    if (typeof message === 'object' && !delayedExpanding) {
        message = JSON.stringify(message);
    }
    if (withJest && !delayedExpanding) {
        stdout += message.toString() + '\n';
        pp(message.toString());
    } else {
        consoleLog(message);
    }
}
const  consoleLog = console.log;
console.log = println;

// lastOf
function  lastOf<T>(array: Array<T>): T {
    return  array[array.length - 1];
}

// pathResolve
function  pathResolve(path_: string) {

    // '/c/home' format to current OS format
    if (path_.length >= 3) {
        if (path_[0] === '/'  &&  path_[2] === '/') {
            path_ = path_[1] +':'+ path_.substr(2);
        }
    }

    // Replace separators to OS format
    path_ = path.resolve(path_);

    return path_
}

// translate
// e.g. translate('english')
// e.g. translate`price = ${price}`  // ... taggedTemplate
function  translate(englishLiterals: TemplateStringsArray | string,  ...values: any[]): string {
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
            "This is a secret value.": "これは秘密の値です。",
            "Replace \"${0}\" to \"${1}\".": "\"${0}\" を \"${1}\" に置き換えてください。",
            "Press Enter key to retry checking.": "Enter キーを押すと再チェックします。",
            "The line number to replace the variable value >": "置き換える変数値がある行番号 >",
            "Enter only: finish to input setting": "Enter のみ：設定の入力を終わる",
            "The number of variable declarations has decreased": "変数宣言の数が減りました",
            "Add variable declarations": "変数宣言を追加してください",
            "Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.":
                "複数の設定があるので、設定を特定できません。行番号のパラメーターを追加してください。",
            "Error of not found specified setting name.": "エラー：指定した設定名が見つかりません。",
            "Error of not found the file or folder at \"${verbNum}\"": "エラー：ファイルまたはフォルダーが見つかりません \"${0}\"",
            "Error of duplicated variable name:": "エラー：変数名が重複しています",
            "Error of not expected condition:": "エラー：予期しない条件です",
            "Error of expect tag syntax:": "エラー：expect タグの文法エラー",
            "Error of unexpected: The count of evalatedKeyValues is not increasing.": "予期しないエラー：evalatedKeyValues の数が増えていません。",
            "isReplacable may be not changed. Try typrm check command.": "isReplacable が変更されていません。 typrm check コマンドを試してください。",
            "${0}a quote is found inside a field${1}": "${0}フィールド内に引用符があります${1}",
            "Not found. To do full text search, press Enter key.": "見つかりません。全文検索するときは Enter キーを押してください。",

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
            "SettingIndex": "設定番号",
            "Not found any replacing target": "置き換える対象が見つかりません",
            "Set old value at settings in the replacing file": "置き換えるファイルの中の設定に古い値を設定してください",
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
    try {

        await main();
    } finally {
        var d = pp('');
        var s = getStdOut();
        d = [];  // Set break point here and watch the variable d
    }
}

const  newSpecification = false;
const  newCode = true;
if (process.env.windir) {
    var  runningOS = 'Windows';
} else {
    var  runningOS = 'Linux';
}
const  settingStartLabel = /^設定((\(|（)([^\)]*)(\)|）))?:( |\t)*(#.*)?$/;
const  settingStartLabelEn = /^settings((\()([^\)]*)(\)))?:( |\t)*(#.*)?$/;
const  originalLabel = "#original:";
const  toLabel = "#to:";  // replace to tag
const  toTestLabel = "#to-test:";
const  templateLabel = "#template:";
const  templateAtStartLabel = "#template-at(";
const  templateAtEndLabel = "):";
const  templateIfLabel = "#template-if:";
const  templateIfYesKey = "template-if(yes)";
const  templateIfNoKey  = "template-if(no)";
const  fileTemplateLabel = "#file-template:";
const  fileTemplateAnyLinesLabel = "#file-template-any-lines:";
const  keywordLabel = "#keyword:";
const  glossaryLabel = "#glossary:";
const  disableLabel = "#disable-tag-tool:";
const  searchIfLabel = "#(search)if: false";
const  ifLabel = "#if:";
const  expectLabel = "#expect:";
const  ignoredKeywords = [ /#search:/g, /: +#keyword:/g, /#keyword:/g ];
const  searchLabel = "#search:";
const  refLabel = "#ref:";
const  temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
const  typrmEnvPrefix = 'TYPRM_';
const  secretLabel = "#★秘密";
const  secretLabelEn = "#secret";
const  secretExamleLabel = "#★秘密:仮";
const  secretExamleLabelEn = "#secret:example";
const  referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
const  indentRegularExpression = /^( |¥t)*/;
const  numberRegularExpression = /^[0-9]+$/;
const  variablePattern = "\\$\\{[^\\}]+\\}";  // ${__Name__}
const  fullMatchScore = 100;
const  keywordMatchScore = 7;
const  glossaryMatchScore = 1;
const  caseIgnoredFullMatchScore = 8;
const  wordsMatchScore = 17;
const  partMatchScore = 15;
const  notNormalizedScore = 1;
const  caseIgnoredWordMatchScore = 16;
const  caseIgnoredPartMatchScore = 14;
const  orderMatchScoreWeight = 2;
const  minLineNum = 0;
const  maxLineNum = 999999999;
const  maxNumber = 999999999;
const  foundForAbove = minLineNum;
const  foundForFollowing = maxLineNum;
const  pathColor = chalk.cyan;
const  lineNumColor = chalk.keyword('gray');
const  matchedColor = chalk.green.bold;
const  notFound = -1;
const  allSetting = 0;
var    inputFileParentPath = '';
var    locale = '';
var    withJest = false;
export var  stdout = '';
export var  programArguments: string[] = [];
export var  programOptions: {[key: string]: any} = {};
