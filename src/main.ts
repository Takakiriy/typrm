import * as fs from 'fs'; // file system
import * as path from "path";  // or path = require("path")
import * as globby from 'globby';
import * as readline from 'readline';
import * as stream from 'stream';
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
        await checkRoutine(true, '');

        if (programOptions.test) {  // Scan last input command line for the test
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    } else if (programArguments.length >= 1 ) {

        if (programArguments[0] === 's'  ||  programArguments[0] === 'search') {
            await search();
        }
        else if (programArguments[0] === 'c'  ||  programArguments[0] === 'check') {
            var  checkingFilePath: string | undefined;
            if (programArguments.length >= 2) {
                checkingFilePath = programArguments[1];
            }

            await check(checkingFilePath);
        }
        else if (programArguments[0] === 'r'  ||  programArguments[0] === 'replace') {
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

            await replaceSettings(inputFilePath, replacingLineNum, keyValues);
        }
        else if (programArguments[0] === 'revert') {
            varidateRevertCommandArguments();
            if (programArguments.length === 2) {
                var  inputFilePath = programArguments[1];
                var  replacingLineNum = '';  // isOneSetting
            } else {
                var  inputFilePath = programArguments[1];
                var  replacingLineNum = programArguments[2];
            }

            await revertSettings(inputFilePath, replacingLineNum);
        }
        else {
            await search();
        }
    }
}

// checkRoutine
async function  checkRoutine(isModal: boolean, inputFilePath: string) {
    if (isModal) {
        var  inputFilePath = await inputPath( translate('YAML UTF-8 file path>') );
    }
    const  parentPath = path.dirname(inputFilePath);
    inputFileParentPath = parentPath;
    let  previousTemplateCount = 0;
    for(;;) {
        let  reader = readline.createInterface({
            input: fs.createReadStream(inputFilePath),
            crlfDelay: Infinity
        });
        let  isReadingSetting = false;
        let  setting: Settings = {};
        let  settingCount = 0;
        let  settingIndentLength = 0;
        let  lineNum = 0;
        let  templateCount = 0;
        let  fileTemplateTag: TemplateTag | null = null;
        let  errorCount = 0;
        let  warningCount = 0;
        let  secretLabelCount = 0;
        const  lines = [];
        const  keywords: SearchKeyword[] = [];
        const  ifTagParser = new IfTagParser();

        for await (const line1 of reader) {
            const  line: string = line1;
            lines.push(line);
            lineNum += 1;
            const  previousIsReadingSetting = isReadingSetting;

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
            if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                if (settingCount >= 1) {
                    onEndOfSettingScope(setting);
                }
                isReadingSetting = true;

                setting = {};
                settingCount += 1;
                settingIndentLength = indentRegularExpression.exec(line)![0].length;
            } else if (indentRegularExpression.exec(line)![0].length <= settingIndentLength  &&  isReadingSetting) {
                isReadingSetting = false;
                if ('verbose' in programOptions) {
                    console.log(`verbose: ${inputFilePath}: settings`);
                    for (const [key, value] of Object.entries(setting))  {
                        console.log(`verbose: ${inputFilePath}:${value.lineNum}:     ${key}: ${value.value}`);
                    }
                }
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

                        setting[key] = {value, isReferenced: false, lineNum};
                    }
                }
            }

            // Check the condition by "#expect:" tag.
            if (line.includes(expectLabel)  &&  ifTagParser.thisIsOutOfFalseBlock) {
                const  condition = line.substr(line.indexOf(expectLabel) + expectLabel.length).trim();

                const  evaluatedContidion = evaluateIfCondition(condition, setting);
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
            const  templateTag = parseTemplateTag(line);
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
                    console.log(`  ${translate('SettingIndex')}: ${settingCount}`);
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
                    console.log(`  ${translate('SettingIndex')}: ${settingCount}`);
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
                        console.log(`  ${translate('SettingIndex')}: ${settingCount}`);
                        warningCount += 1;
                    }
                    secretLabelCount += 1;
                }
            }

            // Get titles above or following.
            let  match: RegExpExecArray | null;
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
        if (settingCount >= 1) {
            onEndOfSettingScope(setting);
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
        let  loop = true;
        while (loop) {
            console.log(translate('Press Enter key to retry checking.'));

            const  key = await input(translate('The line number to replace the variable value >'));
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
                        const  keyValue = await input(translate('key: new_value>'));
                        if (keyValue === '') {
                            break;
                        }
                        errorCount += await replaceSettingsSub(
                            inputFilePath, replacingSettingIndex, parseKeyValueLines(keyValue), true);
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
async function  replaceSettings(inputFilePath: string, settingNameOrLineNum: string, keyValueLines: string) {
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
                inputFileFullPath, replacingSettingIndex, parseKeyValueLines(keyValueLines), true);
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
            const  revertSettings = await makeRevertSettings(inputFileFullPath, replacingSettingIndex);
            for (const revertSetting of revertSettings) {

                errorCount += await replaceSettingsSub(inputFileFullPath, replacingSettingIndex,
                    parseKeyValueLines(revertSetting), false);
            }
        }
    }
    console.log('');
    console.log(`${translate('Warning')}: 0, ${translate('Error')}: ${errorCount}`);
}

// getInputFileFullPath
async function  getInputFileFullPath(inputFilePath: string): Promise<string> {
    const  currentFolder = process.cwd();
    const  targetFolders = await parseCSVColumns(programOptions.folder);
    const  fileFullPaths: string[] = [];
    if (targetFolders.length === 0) {
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
        keyValues: {[key: string]: string}, addOriginalTag: boolean): Promise<number>/*errorCount*/ {
    var    errorCount = 0;
    var    replacingKeyValues = keyValues;
    var    previousEvalatedKeyValues: {[key: string]: string} = {};
    const  oldFilePath = inputFilePath;
    const  newFilePath = inputFilePath +".new";
    var    reducedErrorWasOccurred = false;
    var    loop = true;
    var    loopCount = 0;
    const  replacedKeys: string[] = [];
    const  verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: inputFilePath: ${inputFilePath}`);
        console.log(`Verbose: setting index: ${replacingSettingIndex}`)
        console.log(`Verbose: keyValues: ${JSON.stringify(keyValues)}`);
    }

    while (loop) {
        const  writer = new WriteBuffer(fs.createWriteStream(newFilePath));
        const  readStream = fs.createReadStream(oldFilePath);
        const  reader = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });
        const  lines = [];
        let  isReadingSetting = false;
        let  setting: Settings = {};
        let  settingCount = 0;
        let  settingIndentLength = 0;
        let  settingLineNum = -1;
        let  oldSetting: Settings = {};
        let  lineNum = 0;
        let  isReplacing = false;
        let  isAllReplacable = true;
        let  isCheckingTemplateIfKey = false;
        let  templateIfKeyError = false;
        const  evalatedKeyValues: {[key: string]: string} = {};
        const  ifTagParser = new IfTagParser();
        const  oldIfTagParser = new IfTagParser();
        const  previousEvalatedKeyValuesLength = Object.keys(previousEvalatedKeyValues).length;
        loopCount += 1;
        if (verboseMode) {
            console.log(`Verbose: loopCount: ${loopCount}`);
            console.log(`Verbose: previousEvalatedKeyValuesLength: ${previousEvalatedKeyValuesLength}`);
        }

        for await (const line1 of reader) {
            const  line: string = line1;
            lines.push(line);
            lineNum += 1;
            let  output = false;

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
            ifTagParser.evaluate(line, setting, Object.keys(previousEvalatedKeyValues), verboseMode);
            oldIfTagParser.evaluate(line, oldSetting, Object.keys(previousEvalatedKeyValues), false);

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
                            if (verboseMode) {
                                if ( ! replacedKeys.includes(key)) {
                                    replacedKeys.push(key)
                                    console.log(`Verbose: evaluated setting: ${key}`)
                                }
                            }
                        }

                        if (oldValue !== ''  &&  oldIfTagParser.thisIsOutOfFalseBlock) {

                            oldSetting[key] = {value: oldValue, isReferenced: false, lineNum};
                        }
                        if (ifTagParser.thisIsOutOfFalseBlock) {
                            const  replacingKeys = Object.keys(replacingKeyValues);

                            if (replacingKeys.includes(key)  &&  ifTagParser.isReplacable) {
                                const  replacedValue = replacingKeyValues[key];
                                const  commentIndex = line.indexOf('#', separator);
                                let    comment= '';
                                if (commentIndex !== notFound  &&  ! replacedValue.includes('#')) {
                                    comment = '  ' + line.substr(commentIndex);
                                }
                                let  original = '';
                                if ( ! line.includes(originalLabel)) {
                                    if (addOriginalTag) {
                                        original = `  ${originalLabel} ${oldValue}`;
                                    }
                                } else {
                                    if ( ! addOriginalTag) {
                                        comment = comment.replace(new RegExp(
                                            ` *${originalLabel} *${escapeRegularExpression(replacedValue).replace(/\$/g,'$$')}`), '');
                                    }
                                }

                                writer.write(line.substr(0, separator + 1) +' '+ replacedValue + original + comment + "\n");
                                output = true;
                                setting[key] = {value: replacedValue, isReferenced: false, lineNum};
                                if (verboseMode  &&  oldValue !== replacedValue) {
                                    console.log(`Verbose: replaced "${key}" value from "${oldValue}" to "${replacedValue}"`);
                                    console.log(`Verbose:     at: ${inputFilePath}:${lineNum}:`);
                                }
                            }
                            else {
                                if (oldValue !== '') {
                                    setting[key] = {value: oldValue, isReferenced: false, lineNum};
                                }
                            }
                        }
                    }

                // Out of settings
                } else {
                    const  templateTag = parseTemplateTag(line);
                    if (templateTag.isFound  &&  templateTag.includesKey(Object.keys(setting))
                            &&  ifTagParser.thisIsOutOfFalseBlock  &&  ifTagParser.isReplacable) {
                        const  replacingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
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
                            if (templateTag.lineNumOffset <= -1) {
                                writer.replaceAboveLine(templateTag.lineNumOffset,
                                    replacingLine.replace(before, after.replace(/\$/g,'$$'))+"\n");
                            } else {

                                writer.write(line.replace(before, after.replace(/\$/g,'$$')) +"\n");
                                output = true;
                            }
                            if (verboseMode  &&  before !== after) {
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
                writer.write(line +"\n");
            }
        }

        // previousReplacedKeys = ...
        Object.keys(evalatedKeyValues).forEach((key: string) => {
            previousEvalatedKeyValues[key] = evalatedKeyValues[key]; });
        if (isAllReplacable) {
            loop = false;
        } else if (previousEvalatedKeyValuesLength == Object.keys(evalatedKeyValues).length) {
            console.log('');
            console.log('Error of unexpected: The count of evalatedKeyValues is not increasing.' +
                ' isReplacable may be not changed');
            errorCount += 1;
            loop = false;
        }

        // ...
        writer.end();
        await new Promise( (resolve) => {
            writer.on('finish', () => {
                if (errorCount === 0) {
                    fs.copyFileSync(newFilePath, inputFilePath);
                }
                deleteFileSync(newFilePath);
                resolve();
            });
        });
    }
    return  errorCount;
}

// makeRevertSettings
async function  makeRevertSettings(inputFilePath: string, replacingSettingIndex: number
        ): /* "key: value\n" */ Promise<string[]> {

    const  readStream = fs.createReadStream(inputFilePath);
    const  reader = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });
    let  isReadingSetting = false;
    let  revertSettings: string[] = [];
    let  settingCount = 0;
    let  settingIndentLength = 0;
    let  lineNum = 0;
    let  isReadingOriginal = false;
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

                        var  revertSetting = `${key}: ${originalValue}`;
                    } else {
                        var  revertSetting = ifTrueScanner.condition + '\n' + `${key}: ${originalValue}`;
                    }

                    revertSettings.push(revertSetting);
                }
            }
        }
    }
    return  revertSettings.reverse();
}

// TemplateTag
class  TemplateTag {

    label = '';
    template = '';
    isFound = false;

    // template tag
    indexInLine = notFound;

    // template-at tag
    lineNumOffset = 0;  
    startIndexInLine = notFound;
    endIndexInLine = notFound;

    // template-at tag
    oldTemplate = '';
    newTemplate = '';

    // for file-template tag
    templateLines: string[] = [];
    indentAtTag = '';
    minIndentLength = 0;

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
            const  leftOfTemplate = line.substr(0, this.indexInLine).trim();
            if (this.label === fileTemplateLabel) {
                this.onFileTemplateTagReading(line);
            }

            this.template = line.substr(this.indexInLine + this.label.length).trim();
            if (this.label == templateIfLabel) {
                this.template = getValue(this.template);
            }
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

                this.template = line.substr(this.endIndexInLine + templateAtEndLabel.length).trim();
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
        let  readingNext = true;
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

    // evaluate
    evaluate(setting: Settings): boolean | Error {
        if (this.label !== templateIfLabel) {
            return new Error();
        }
        const  expression = this.template;

        const  evaluatedContidion = evaluateIfCondition(expression, setting);
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
        let  templateLineIndex = 0;
        let  targetLineNum = 0;
        let  errorTemplateLineIndex = 0;
        let  errorTargetLineNum = 0;
        let  errorContents = '';
        let  errorExpected = '';
        let  errorTemplate = '';
        let  indent = '';
        enum Result { same, different, skipped };
        let  result = Result.same;
        let  skipTo = '';
        let  skipToTemplate = '';
        let  skipFrom = '';
        let  skipStartLineNum = 0;
        let  loop = true;
        let  exception: any;

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
            let  templateLineNum = 0;
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

// IfTagParser
class  IfTagParser {
    get       thisIsOutOfFalseBlock(): boolean {return this.thisIsOutOfFalseBlock_;}
    private   thisIsOutOfFalseBlock_: boolean = true;
    readonly  indentLengthsOfIfTag: IfTag[] = [
        {indentLength: -1, resultOfIf: true, enabled: true, isReplacable: true}
    ];
    get      isReplacable(): boolean {return this.isReplacable_;}  // #search: typrm replace with if tag
    private  isReplacable_: boolean = true;

    // evaluate
    evaluate(line: string, setting: Settings, previsousEvalatedKeys: string[] = [],
            verboseMode: boolean = false): IfTagParserResult {
        var    expression = '';
        var    errorCount = 0;
        const  indentLength = indentRegularExpression.exec(line)![0].length;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {

                this.indentLengthsOfIfTag.pop();
                this.thisIsOutOfFalseBlock_ = lastOf(this.indentLengthsOfIfTag).enabled;
                this.isReplacable_          = lastOf(this.indentLengthsOfIfTag).isReplacable;
            }
        }

        if (line.includes(ifLabel)) {
            expression = line.substr(line.indexOf(ifLabel) + ifLabel.length).trim();

            const  evaluatedContidion = evaluateIfCondition(expression, setting, previsousEvalatedKeys, verboseMode);
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

// check
async function  check(checkingFilePath?: string) {
    const  targetFolders = await parseCSVColumns(programOptions.folder);
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

        var  filePaths = [checkingFilePath];
    } else {
        for (const folder of targetFolders) {
            const  targetFolderFullPath = lib.getFullPath(folder, currentFolder);
            if (!fs.existsSync(targetFolderFullPath)) {
                throw new Error(`Not found target folder at "${targetFolderFullPath}".`);
            }
            process.chdir(targetFolderFullPath);
            const scanedPaths = await globby(['**/*']);
            scanedPaths.forEach((scanedPath) => {

                inputFileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath))
            });
        }
        process.chdir(currentFolder);
    }

    for (const inputFileFullPath of inputFileFullPaths) {

        await checkRoutine(false, inputFileFullPath);
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

            await  searchSub(keyword);
        } else if (command === cPrintRef) {

            await  printRef(keyword);
        } else if (command === cRunVerb){
            const  keywordWithoutVerb = programArguments.slice(startIndex, programArguments.length - 1).join(' ');
            const  ref = await printRef(keywordWithoutVerb, {print: false});

            runVerb(ref.verbs, ref.address, ref.addressLineNum, lastWord);
        }
    } else {  // keyword === ''
        inputSkip(startIndex);
        var  previousPrint = getEmptyOfPrintRefResult();
        for (;;) {
            var  prompt = 'keyword:';
            if (previousPrint.hasVerbMenu) {
                var  prompt = 'keyword or number:';
            }

            const  keyword = await input(chalk.yellow( prompt ) + ' ');
            if (keyword === 'exit()') {
                break;
            } else if (keyword === '') {
                previousPrint.hasVerbMenu = false;
            } else {
                var  command = cSearch;
                if (previousPrint.hasVerbMenu  &&  numberRegularExpression.test(keyword)) {
                    command = cRunVerb;
                } else if (hasRefTag(keyword)) {
                    command = cPrintRef;
                }
                if (command === cSearch) {

                    previousPrint = await searchSub(keyword);
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
async function  searchSub(keyword: string): Promise<PrintRefResult> {
    for (const ignoredKeyword of ignoredKeywords) {
        keyword = keyword.replace(ignoredKeyword, '')
    }
    keyword = keyword.trim();
    const  currentFolder = process.cwd();
    const  fileFullPaths: string[] = [];
    const  targetFolders = await parseCSVColumns(programOptions.folder);
    for (const folder of targetFolders) {
        const  targetFullPath = lib.getFullPath(folder, currentFolder);
        const  fileName = path.basename(targetFullPath);
        if (fileName.includes('*')) {
            var  targetFolderFullPath = path.dirname(targetFullPath);
            var  wildcard = fileName;
        } else {
            var  targetFolderFullPath = targetFullPath;
            var  wildcard = '*';
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

            // keyword tag
            if (line.includes(keywordLabel)  &&  ! line.includes(disableLabel)  &&  ! blockDisable.isInBlock) {
                var  csv = getValue(line, line.indexOf(keywordLabel) + keywordLabel.length);
                if (csv !== '') {
                    var  withParameter = true;
                } else {
                    var  withParameter = false;
                    csv = parseKeyName(line);
                }
                const  columns = await parseCSVColumns(csv)
                    .catch((e: Error) => {
                        console.log(`Warning: ${e.message} in ${inputFileFullPath}:${lineNum}: ${line}`);
                        return [];
                    });

                const  found = getKeywordMatchingScore(columns, keyword, thesaurus);
                if (found.matchedKeywordCount >= 1) {
                    if (withParameter) {
                        var  positionOfCSV = line.indexOf(csv, line.indexOf(keywordLabel) + keywordLabel.length);// line.length - csv.length;
                    } else {
                        var  positionOfCSV = line.indexOf(csv);
                    }
                    const  columnPositions = parseCSVColumnPositions(csv, columns);

                    found.score += keywordMatchScore;
                    found.path = getTestablePath(inputFileFullPath);
                    found.lineNum = lineNum;
                    found.line = line;
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
                        glossaryWords += ':';  // ':' is not included in the word in glossary
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
                            if (glossaryTag.glossaryWords === '') {
                                found.line = line;
                                for (const match of found.matches) {
                                    match.position += glossaryTag.indentPosition;
                                }
                            } else {
                                found.line = glossaryTag.glossaryWords + line;
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
        const   normalReturn = getEmptyOfPrintRefResult();
        return  normalReturn;
    }
}

// getKeywordMatchingScore
function  getKeywordMatchingScore(testingStrings: string[], keyphrase: string, thesaurus: Thesaurus): FoundLine {
    const  lowerKeyphrase = keyphrase.toLowerCase();

    function  subMain() {
        const  bestFound = testingStrings.reduce(
            (bestFound: FoundLine, aTestingString: string, stringIndex: number) => {
                const  keywords = keyphrase.split(' ');
                const  found = new FoundLine();

                const  result = getSubMatchedScore(aTestingString, keyphrase, lowerKeyphrase, stringIndex, found);
                if (result.score !== 0) {
                    found.score = result.score * keywords.length * phraseMatchScoreWeight +
                        keyphrase.length - aTestingString.length +
                        notNormalizedScore * keywords.length;
                    found.matchedKeywordCount = keywords.length;
                    found.matchedTargetKeywordCount = keywords.length;
                    found.testedWordCount = aTestingString.split(' ').length;
                } else {
                    let    previousPosition = -1;
                    const  wordPositions = new WordPositions();
                    wordPositions.setPhrase(aTestingString);
                    const  matchedCountsByWord: number[] = new Array<number>(wordPositions.length).fill( 0 )

                    for (const keyword of keywords) {
                        if (keyword === '') {continue;}

                        const  result = getSubMatchedScore(aTestingString, keyword, keyword.toLowerCase(), stringIndex, found);
                        if (result.score !== 0) {
                            if (result.position > previousPosition) {
                                found.score += result.score * orderMatchScoreWeight;
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
                        found.score += keyphrase.length - aTestingString.length;
                        found.testedWordCount = aTestingString.split(' ').length;
                        found.matchedTargetKeywordCount = matchedCountsByWord.filter((count)=>(count >= 1)).length;
                    }
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
        let  score = 0;
        let  position = notFound;

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
}

// getEmptyOfPrintRefResult
function  getEmptyOfPrintRefResult(): PrintRefResult {
    return  {
        hasVerbMenu: false,
        verbs: [],
        address: '',
        addressLineNum: 0,
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
                const  variableRegExp = new RegExp('\\\\?'+ escapeRegularExpression( variable ), 'g');

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
            new RegExp(escapeRegularExpression( variable.value.replace('\\','\\\\')), 'g'),
            '${'+ variable.key +'}');  // Change the address to an address with variables
    }
    if (recommended.replace(/\\/g,'/').startsWith(lib.getHomePath().replace(/\\/g,'/'))) {
        recommended = '~' + recommended.substr(lib.getHomePath().length);
    }

    // print the address
    if (option.print) {
        if (recommended !== addressBefore) {
            console.log('Recommend: #ref: ' + recommended);
        }
        console.log(linkableAddress);
    }

    // print the verb menu
    const  verbs = getRelatedVerbs(address);
    var  verbMenu = verbs.map((verb) => (verb.label)).join(', ');
    if (verbMenu !== ''  &&  option.print) {
        console.log('    ' + verbMenu);
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

// varidateUpdateCommandArguments
function  varidateReplaceCommandArguments() {
    if (programArguments.length < 3) {
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

// onEndOfSetting
function onEndOfSettingScope(setting: Settings) {
    for (const key of Object.keys(setting)) {
        if (!setting[key].isReferenced) {
            console.log(translate`Not referenced: ${key} in line ${setting[key].lineNum}`);
        }
    }
}

// evaluateIfCondition
function  evaluateIfCondition(expression: string, setting: Settings,
        previsousEvalatedKeyValues: string[] = [],
        verboseMode: boolean = false)
        : boolean | Error | EvaluatedCondition {

    if (expression === 'true') {
        return  true;
    } else if (expression === 'false') {
        return  false;
    }
    const  settingsDot = '$settings.';
    const  envDot = '$env.';
    let    match: RegExpExecArray | null = null;
    let    parent = '';
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
        let    rightValue = match[3];
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
                if (verboseMode) {
                    console.log(`Verbose: skipped evaluation: #if: ${expression}`);
                }

                return  result;
            } else　{
                const  isReplacable = previsousEvalatedKeyValues.includes(name)  ||  parent !== settingsDot;
                if (verboseMode) {
                    if ( ! isReplacable) {
                        console.log(`Verbose: skipped evaluation: #if: ${expression}`);
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
    let  settingCount = 0;
    let  lineNum = 0;
    let  breaking = false;
    let  isFound = false;
    let  exception: any;
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
        } else if (path_.startsWith(inputFileParentPath + path.sep)) {
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
    let  expected = template;
    const  log: EvaluationLog[] = [];

    for (const key of Object.keys(setting)) {
        const  re = new RegExp(escapeRegularExpression( key ), "gi" );

        const  expectedAfter = expected.replace(re, setting[key].value.replace(/\$/g,'$$'));
        if (expectedAfter !== expected) {
            setting[key].isReferenced = true;
            log.push({before: key, after: setting[key].value});
        }
        expected = expectedAfter;
    }
    return  {expected, log};
}

// getExpectedLineInFileTemplate
function  getExpectedLineInFileTemplate(setting: Settings, template: string) {

    let  expected = getExpectedLine(setting, template);
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
        replacedSetting[key] = { value, lineNum: 0 /*dummy*/,  isReferenced: true /*dummy*/ };
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
    let    value = line.substr(separatorIndex + 1).trim();
    const  comment = value.indexOf('#');
    if (comment !== notFound) {
        value = value.substr(0, comment).trim();
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
function  parseTemplateTag(line: string): TemplateTag {
    const  tag = new TemplateTag();
    tag.parseLine(line);
    return  tag;
}

// parseCSVColumns
async function  parseCSVColumns(columns: string): Promise<string[]> {
    if (!columns) {
        return  [];  // stream.Readable.from(undefined) occurs an error
    }
    return new Promise((resolveFunction, rejectFunction) => {
        let  columnArray: string[] = [];

        stream.Readable.from(columns)
            .pipe(
                csvParse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' })
            )
            .on('data', (columns) => {
                columnArray = columns;
            })
            .on('end', () => {
                resolveFunction(columnArray);
            })
            .on('error', (e: Error) => {
                rejectFunction(e);
            });
    });
}

// parseCSVColumnPositions
function  parseCSVColumnPositions(csv: string, columns: string[]): number[] {
    const  positions: number[] = [];
    var  searchPosition = 0;
    for (const column of columns) {
        const  columnPosition = csv.indexOf(column.replace(/\"/g, '""'), searchPosition);

        positions.push(columnPosition);
        searchPosition = csv.indexOf(',', columnPosition + column.length) + 1;
    }
    return  positions;
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

// escapeRegularExpression
function  escapeRegularExpression(expression: string) {
    return  expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
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

// Setting
type Settings = {[name: string]: Setting}

// Setting
class Setting {
    value: string = '';
    lineNum: number = 0;
    isReferenced: boolean = false;
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

                                this.synonym[synonym] = normalizedKeyword;
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
            if (words[i] in this.synonym) {
                words[i] = this.synonym[words[i]];
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
    score: number = 0;

    toString(): string {

        // colorParts = sort matched positions and merge overrlapping parts.
        const  colorParts: MatchedPart[] = [];
        const  sortedParts: MatchedPart[] = this.matches.sort((a, b) => (a.position - b.position));
        let  previousPart = new MatchedPart();
        previousPart.position = -1;
        previousPart.length = 0;
        for (const part of sortedParts) {
            if (part.position === previousPart.position) {
            } else {
                colorParts.push(part);
            }
        }

        // coloredLine = ...
        let    coloredLine = '';
        const  matchedColor = chalk.green.bold;
        const  line = this.line;
        let    previousPosition = 0;
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
        if (false) {
            var  debugString = ` (score: ${this.score}, wordCount: ${this.testedWordCount}, matchedCount: ${this.matchedTargetKeywordCount})`;
        } else {
            var  debugString = ``;
        }

        // colored string
        return `${chalk.cyan(this.path)}${chalk.keyword('gray')(`:${this.lineNum}:`)} ${coloredLine}${debugString}`;
    }
}

// MatchedPart
class MatchedPart {
    position: number = 0;
    length: number = 0;
    testTargetIndex: number = -1;
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
    address: string;
}

// FilePathAndKeyword
interface  FilePathAndKeyword {
    filePath: string;
    keyword: string;
}

// splitFilePathAndKeyword
function  splitFilePathAndKeyword(address: string, regularExpression: string,
        filePathRegularExpressionIndex: number,  keywordRegularExpressionIndex: number ): FilePathAndKeyword {

    const  verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`Verbose: Parsed by TYPRM_LINE_NUM_GETTER:`);
        console.log(`Verbose:     address: ${address}`);
        console.log(`Verbose:     regularExpression: ${regularExpression}`);
        console.log(`Verbose:     filePathRegularExpressionIndex: ${filePathRegularExpressionIndex}`);
        console.log(`Verbose:     keywordRegularExpressionIndex: ${keywordRegularExpressionIndex}`);
    }

    const  parameters = (new RegExp(regularExpression)).exec(address);
    if ( ! parameters) {
        throw  new Error(`ERROR: regularExpression (${regularExpression}) of regularExpression ` +
            `"${regularExpression}" in TYPRM_LINE_NUM_GETTER is not matched.` +
            `testing string is "${address}".`);
    }
    if (verboseMode) {
        console.log(`Verbose:     matched: [${parameters.join(', ')}]`);
    }
    if (filePathRegularExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: filePathRegularExpressionIndex (${filePathRegularExpressionIndex}) of regularExpression ` +
            `"${regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }
    if (keywordRegularExpressionIndex > parameters.length - 1) {
        throw  new Error(`ERROR: keywordRegularExpressionIndex (${keywordRegularExpressionIndex}) of regularExpression ` +
            `"${regularExpression}" in TYPRM_LINE_NUM_GETTER is out of range.` +
            `testing string is "${address}".`);
    }

    return {
        filePath: parameters[filePathRegularExpressionIndex],
        keyword:  parameters[keywordRegularExpressionIndex],
    } as FilePathAndKeyword;
}

// searchAsText
async function  searchAsText(getter: LineNumGetter, address: string): /* linkableAddress */ Promise<FilePathLineNum> {
    const  { filePath, keyword } = splitFilePathAndKeyword(address,  getter.regularExpression,
        getter.filePathRegularExpressionIndex,  getter.keywordRegularExpressionIndex);
    if ( ! fs.existsSync(filePath)) {
        console.log(`ERROR: not found a file at "${getTestablePath(lib.getFullPath(filePath, process.cwd()))}"`);
        return  { filePath, lineNum: 0 };
    }

    const  reader = readline.createInterface({
        input: fs.createReadStream(filePath),
        crlfDelay: Infinity
    });
    let  lineNum = 0;
    let  breaking = false;
    let  exception: any;

    for await (const line1 of reader) {
        if (breaking) {continue;}  // "reader" requests read all lines
        try {
            const  line: string = line1;
            lineNum += 1;

            if (line.includes(keyword)) {
                breaking = true;  // return or break must not be written.
                // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
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

    replaceAboveLine(relativeLineNum: number, line: string) {
        this.lineBuffer[this.lineBuffer.length + relativeLineNum] = line;
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

// StandardInputBuffer
class  StandardInputBuffer {
    readlines: readline.Interface | undefined;
    inputBuffer: string[] = [];
    inputResolver?: (answer:string)=>void = undefined;

    delayedConstructor() {  // It is not constructor, because "createInterface" stops the program, if stdin was not used.
        this.readlines = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.readlines.on('line', async (line: string) => {
            if (this.inputResolver) {
                this.inputResolver(line);  // inputResolver() is resolve() in input()
                this.inputResolver = undefined;
            } else {
                this.inputBuffer.push(line);
            }
        });

        this.readlines.setPrompt('');
        this.readlines.prompt();
    }

    async  input(guide: string): Promise<string> {
        if (!this.readlines) {
            this.delayedConstructor();
        }

        return  new Promise(
            (resolve: (answer:string)=>void,  reject: (answer:string)=>void ) =>
        {
            const  nextLine = this.inputBuffer.shift();
            if (nextLine) {
                console.log(guide + nextLine);
                resolve(nextLine);
            } else {
                process.stdout.write(guide);
                this.inputResolver = resolve;
            }
        });
    }

    close() {
        if (this.readlines) {
            this.readlines.close();
        }
    }
}

// InputOption
class InputOption {
    inputLines: string[];
    nextLineIndex: number;
    nextParameterIndex: number;  // The index of the starting process parameters

    constructor(inputLines: string[]) {
        this.inputLines = inputLines;
        this.nextLineIndex = 0;
        this.nextParameterIndex = 2;
    }
}

const  testBaseFolder = String.raw `R:\home\mem_cache\MyDoc\src\TypeScript\typrm\test_data`+'\\';

// inputOption
const inputOption = new InputOption([
/*
    testBaseFolder +`____.yaml`,
    String.raw `file`,
*/
]);

// input
// Example: const name = await input('What is your name? ');
async function  input( guide: string ): Promise<string> {
    // Input emulation
    if (inputOption.inputLines) {
        if (inputOption.nextLineIndex < inputOption.inputLines.length) {
            const  value = inputOption.inputLines[inputOption.nextLineIndex];
            inputOption.nextLineIndex += 1;
            console.log(guide + value);

            return  value;
        }
    }

    // Read the starting process parameters
    while (inputOption.nextParameterIndex < process.argv.length) {
        const  value = process.argv[inputOption.nextParameterIndex];
        inputOption.nextParameterIndex += 1;
        if (value.substr(0,1) !== '-') {
            console.log(guide + value);

            return  value;
        }
        if (value !== '--test') {
            inputOption.nextParameterIndex += 1;
        }
    }

    // input
    return  InputObject.input(guide);
}
export const  InputObject = new StandardInputBuffer();

// inputPath
// Example: const name = await input('What is your name? ');
async function  inputPath( guide: string ) {
    const  key = await input(guide);
    return  pathResolve(key);
}

// inputSkip
function  inputSkip(count: number) {
    inputOption.nextParameterIndex += count;
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
    let    dictionary: {[name: string]: string} | undefined = undefined;
    const  taggedTemplate = (typeof(englishLiterals) !== 'string');

    let  english = englishLiterals as string;
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
            "WarningLine": "警告行",
            "Found": "見つかったもの",
            "Setting": "設定",
            "SettingIndex": "設定番号",
            "Not found any replacing target": "置き換える対象が見つかりません",
            "Set old value at settings in the replacing file": "置き換えるファイルの中の設定に古い値を設定してください",
            "The parameter must be less than 0": "パラメーターは 0 より小さくしてください",
            "Not found \"${0}\" above": "上方向に「${0}」が見つかりません",
            "Not found \"${0}\" following": "下方向に「${0}」が見つかりません",
            "Not referenced: ${0} in line ${1}": "参照されていません： ${0} （${1}行目）",
            "Error that verb number ${0} is not defined": "エラー：動詞番号 ${0} は定義されていません"
        };
    }
    let  translated = english;
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

if (process.env.windir) {
    var  runningOS = 'Windows';
} else {
    var  runningOS = 'Linux';
}
const  settingStartLabel = /^設定((\(|（)([^\)]*)(\)|）))?:( |\t)*(#.*)?$/;
const  settingStartLabelEn = /^settings((\()([^\)]*)(\)))?:( |\t)*(#.*)?$/;
const  originalLabel = "#original:";
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
const  ignoredKeywords = [ /#keyword:/g, /#search:/g ];
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
const  wordsMatchScore = 7;
const  partMatchScore = 5;
const  notNormalizedScore = 1;
const  caseIgnoredWordMatchScore = 6;
const  caseIgnoredPartMatchScore = 3;
const  phraseMatchScoreWeight = 4;
const  orderMatchScoreWeight = 2;
const  minLineNum = 0;
const  maxLineNum = 999999999;
const  maxNumber = 999999999;
const  foundForAbove = minLineNum;
const  foundForFollowing = maxLineNum;
const  notFound = -1;
const  allSetting = 0;
const  noSeparator = -1;
var    inputFileParentPath = '';
var    locale = '';
var    withJest = false;
export var  stdout = '';
export var  programArguments: string[] = [];
export var  programOptions: {[key: string]: any} = {};
