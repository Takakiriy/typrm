import * as fs from 'fs'; // file system
import * as path from "path";  // or path = require("path")
import * as globby from 'globby';
import * as readline from 'readline';
import * as stream from 'stream';
import * as csvParse from 'csv-parse';
import * as chalk from 'chalk';
import { parse } from 'commander';
process.env['typrm_aaa'] = 'aaa';

// main
export async function  main() {
    locale = Intl.NumberFormat().resolvedOptions().locale;
    if ('locale' in programOptions) {
        locale = programOptions.locale;
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

            // setting = ...
            if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                if (settingCount >= 1) {
                    onEndOfSetting(setting);
                }
                isReadingSetting = true;

                setting = {};
                settingCount += 1;
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
                            console.log('');
                            console.log('Error of duplicated variable name:');
                            console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                            console.log(`  Contents: ${key}: ${value}`);
                            errorCount += 1;
                        }

                        setting[key] = {value, isReferenced: false, lineNum};
                    }
                }
            }

            // Set condition by "#if:" tag.
            const  parsed = ifTagParser.evaluate(line, setting);
            if (parsed.errorCount >= 1) {
                console.log('');
                console.log('Error of if tag syntax:');
                console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
                console.log(`  Contents: ${parsed.condition}`);
                errorCount += parsed.errorCount;
            }

            // Check the condition by "#expect:" tag.
            if (line.includes(expectLabel)  &&  ifTagParser.thisIsOutOfFalseBlock) {
                const  condition = line.substr(line.indexOf(expectLabel) + expectLabel.length).trim();

                const  evaluatedContidion = evaluateIfCondition(condition, setting);
                if (typeof evaluatedContidion === 'boolean') {
                    if ( ! evaluatedContidion) {
                        console.log('');
                        console.log('Error of not expected condition:');
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
                console.log(`${translate('ErrorLine')}: ${lineNum}`);
                console.log(`  ${translate('Contents')}: ${line.trim()}`);
                console.log(`  ${translate('Error')}: ${translate('The parameter must be less than 0')}`);
                templateTag.isFound = false;
                templateCount += 1;
                errorCount += 1;
            }
            if (templateTag.isFound) {
                templateCount += 1;
                const  checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                const  expected = getExpectedLine(setting, templateTag.template);
                if (templateTag.lineNumOffset === 0) {
                    var  checkingLineWithoutTemplate = checkingLine.substr(0, templateTag.indexInLine);
                } else {
                    var  checkingLineWithoutTemplate = checkingLine;
                }

                if ( ! checkingLineWithoutTemplate.includes(expected)  &&  ifTagParser.thisIsOutOfFalseBlock) {
                    console.log("");
                    console.log(`${translate('ErrorLine')}: ${lineNum + templateTag.lineNumOffset}`);
                    console.log(`  ${translate('Contents')}: ${checkingLine.trim()}`);
                    console.log(`  ${translate('Expected')}: ${expected}`);
                    console.log(`  ${translate('Template')}: ${templateTag.template}`);
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
            onEndOfSetting(setting);
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
    for (const folder of targetFolders) {
        const  targetFolderFullPath = getFullPath(folder, currentFolder);
        const  inputFileFullPath = getFullPath(inputFilePath, targetFolderFullPath);
        if (fs.existsSync(inputFileFullPath)) {
            fileFullPaths.push(inputFileFullPath);
        }
    }
    if (fileFullPaths.length === 0) {
        console.log('');
        console.log(`${translate('Error of not found the specified file.')}`);
        console.log(`    FileName: ${inputFilePath}`);
        console.log(`    Folder: ${programOptions.folder}`);
        return  '';
    } else if (fileFullPaths.length >= 2) {
        console.log('');
        console.log(`${translate('Error of same file name exists.')}`);
        console.log(`    FileName: ${inputFilePath}`);
        console.log(`    Folder: ${programOptions.folder}`);
        return  '';
    }

    return  fileFullPaths[0];
}

// replaceSettingsSub
async function  replaceSettingsSub(inputFilePath: string, replacingSettingIndex: number,
        keyValues: {[key: string]: string}, addOriginalTag: boolean): Promise<number>/*errorCount*/ {
    var    errorCount = 0;
    var    replacingKeyValues = keyValues;
    var    previousEvalatedKeys: {[key: string]: string} = {};
    const  oldFilePath = inputFilePath;
    const  newFilePath = inputFilePath +".new";
    var    reducedErrorWasOccurred = false;
    var    loop = true;
    const  verboseMode = 'verbose' in programOptions;
    if (verboseMode) {
        console.log(`verbose >> inputFilePath: ${inputFilePath}`);
        console.log(`verbose >> setting index: ${replacingSettingIndex}`)
        console.log(`verbose >> keyValues: ${JSON.stringify(keyValues)}`);
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
        const  evalatedKeys: {[key: string]: string} = {};
        const  ifTagParser = new IfTagParser();
        const  oldIfTagParser = new IfTagParser();
        const  previousEvalatedKeysLength = Object.keys(previousEvalatedKeys).length;

        for await (const line1 of reader) {
            const  line: string = line1;
            lines.push(line);
            lineNum += 1;
            let  output = false;
            if (verboseMode) {
                var d = pp(`${lineNum} ${line}`)
            }

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
            ifTagParser.evaluate(line, setting, Object.keys(previousEvalatedKeys));
            oldIfTagParser.evaluate(line, oldSetting, Object.keys(previousEvalatedKeys));

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
                                evalatedKeys[key] = replacingKeyValues[key];
                            } else {
                                evalatedKeys[key] = oldValue;
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
                                            ` *${originalLabel} *${escapeRegularExpression(replacedValue)}`), '');
                                    }
                                }

                                writer.write(line.substr(0, separator + 1) +' '+ replacedValue + original + comment + "\n");
                                output = true;
                                setting[key] = {value: replacedValue, isReferenced: false, lineNum};
                                if (verboseMode  &&  oldValue !== replacedValue) {
                                    console.log(`verbose >> replaced "${key}" value from "${oldValue}" to "${replacedValue}"`);
                                    console.log(`verbose >>     at: ${inputFilePath}:${lineNum}:`);
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
                        const  expected = getExpectedLine(oldSetting, templateTag.template);
                        const  replaced = getReplacedLine(setting, templateTag.template, replacingKeyValues);

                        if (replacingLine.includes(expected)) {
                            const  before = expected;
                            const  after = replaced;
                            if (templateTag.lineNumOffset <= -1) {
                                writer.replaceAboveLine(templateTag.lineNumOffset,
                                    replacingLine.replace(before, after)+"\n");
                            } else {

                                writer.write(line.replace(before, after) +"\n");
                                output = true;
                            }
                            if (verboseMode  &&  before !== after) {
                                console.log(`verbose >> replaced a line:`);
                                console.log(`verbose >>     from: ${before}`);
                                console.log(`verbose >>     to:   ${after}`);
                                console.log(`verbose >>     at: ${inputFilePath}:${lineNum - templateTag.lineNumOffset}:`);
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
                    }
                }
            }
            if (!output) {
                writer.write(line +"\n");
            }
        }

        // previousReplacedKeys = ...
        Object.keys(evalatedKeys).forEach((key: string) => {
            previousEvalatedKeys[key] = evalatedKeys[key]; });
        if (isAllReplacable) {
            loop = false;
        } else if (previousEvalatedKeysLength == Object.keys(previousEvalatedKeys).length) {
            console.log('')
            console.log('Error of unexpected')
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

    // for file-template tag
    templateLines: string[] = [];
    indentAtTag = '';
    minIndentLength = 0;

    onFileTemplateTagReading(line: string) {
        this.indentAtTag = indentRegularExpression.exec(line)![0];
        this.minIndentLength = maxNumber;
    }
    onReadLine(line: string): boolean {
        const  currentIndent = indentRegularExpression.exec(line)![0];
        let  readingNext = true;
        if (currentIndent.length > this.indentAtTag.length  &&  line.startsWith(this.indentAtTag)) {

            this.templateLines.push(line);
            this.minIndentLength = Math.min(this.minIndentLength, currentIndent.length);
        } else {
            this.templateLines = this.templateLines.map((line)=>(
                line.substr(this.minIndentLength)));
            readingNext = false;
        }
        return  readingNext;
    }
    includesKey(keys: string[]): boolean {
        for (const key of keys) {
            if (this.template.includes(key)) {
                return  true;
            }
        }
        return  false;
    }
    async  checkTargetFileContents(setting: Settings, inputFilePath: string, templateEndLineNum: number): Promise<boolean> {
        const  parentPath = path.dirname(inputFilePath);
        const  targetFilePath = getFullPath(getExpectedLine(setting, this.template), parentPath);
        if (!fs.existsSync(targetFilePath)) {
            const  templateLineNum = templateEndLineNum - this.templateLines.length;
            console.log("");
            console.log(`Error of not found the target file:`);
            console.log(`  ${translate('NotFound')}: ${targetFilePath}`);
            console.log(`  Template: ${inputFilePath}:${templateLineNum}`);
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
                    if (indentLength !== notFound  &&  targetLine.trim() === expectedFirstLine) {
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
    evaluate(line: string, setting: Settings, previsousEvalatedKeys: string[] = []): IfTagParserResult {
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

            const  evaluatedContidion = evaluateIfCondition(expression, setting, previsousEvalatedKeys);
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
        var  wordIndex = 0;
        for (const wordPosition of this.wordPositions) {

            if (phrasePosition >= wordPosition) {
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
    }
    if (checkingFilePath) {
        for (const folder of targetFolders) {
            const  targetFolderFullPath = getFullPath(folder, currentFolder);

            const  inputFileFullPath = getFullPath(checkingFilePath, targetFolderFullPath);
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
            const  targetFolderFullPath = getFullPath(folder, currentFolder);
            if (!fs.existsSync(targetFolderFullPath)) {
                throw new Error(`Not found target folder at "${targetFolderFullPath}".`);
            }
            process.chdir(targetFolderFullPath);
            const scanedPaths = await globby(['**/*']);
            scanedPaths.forEach((scanedPath) => {

                inputFileFullPaths.push(getFullPath(scanedPath, targetFolderFullPath))
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

    if (keyword !== '') {

        await  searchSub(keyword);
    } else {
        inputSkip(startIndex);
        for (;;) {
            const  keyword = await input(chalk.yellow('keyword:')+' ');
            if (keyword === 'exit()') {
                break;
            } else if (keyword !== '') {
                await  searchSub(keyword);
            }
        }
    }
}

// searchSub
async function  searchSub(keyword: string) {
    for (const ignoredKeyword of ignoredKeywords) {
        keyword = keyword.replace(ignoredKeyword, '')
    }
    keyword = keyword.trim();
    const  currentFolder = process.cwd();
    const  fileFullPaths: string[] = [];
    const  targetFolders = await parseCSVColumns(programOptions.folder);
    for (const folder of targetFolders) {
        const  targetFolderFullPath = getFullPath(folder, currentFolder);
        process.chdir(targetFolderFullPath);
        const scanedPaths = await globby(['**/*']);
        scanedPaths.forEach((scanedPath) => {

            fileFullPaths.push(getFullPath(scanedPath, targetFolderFullPath))
        });
    }
    process.chdir(currentFolder);
    var  indentAtTag = '';
    var  indentPosition = -1;
    var  indentAtFirstContents = '';
    var  inGlossary = false;
    var  foundLines: FoundLine[] = [];

    for (const inputFileFullPath of fileFullPaths) {
        const  reader = readline.createInterface({
            input: fs.createReadStream(inputFileFullPath),
            crlfDelay: Infinity
        });
        var  lineNum = 0;

        for await (const line1 of reader) {
            const  line: string = line1;
            lineNum += 1;

            // keyword tag
            if (line.includes(keywordLabel)  &&  ! line.includes(disableLabel)) {
                var  csv = line.substr(line.indexOf(keywordLabel) + keywordLabel.length);
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

                const  found = getKeywordMatchingScore(columns, keyword);
                if (found.matchedKeywordCount >= 1) {
                    if (withParameter) {
                        var  positionOfCSV = line.length - csv.length;
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
            if (line.includes(glossaryLabel)) {
                inGlossary = true;
                indentAtTag = indentRegularExpression.exec(line)![0];
                indentAtFirstContents = '';
            } else if (inGlossary) {
                const  currentIndent = indentRegularExpression.exec(line)![0];
                if (indentAtFirstContents === '') {
                    indentAtFirstContents = currentIndent;
                    indentPosition = indentAtFirstContents.length;
                }
                const  characterAtIndent = line[indentPosition];
                if (
                    characterAtIndent === ' '  ||
                    characterAtIndent === '\t'  ||
                    characterAtIndent === undefined)
                {
                    // Skip this line
                } else {
                    const  colonPosition = line.indexOf(':', currentIndent.length);
                    const  wordInGlossary = line.substr(currentIndent.length, colonPosition - currentIndent.length);

                    const  found = getKeywordMatchingScore([wordInGlossary], keyword);
                    if (found.matchedKeywordCount >= 1  &&  colonPosition !== notFound) {

                        found.score += glossaryMatchScore;
                        found.path = getTestablePath(inputFileFullPath);
                        found.lineNum = lineNum;
                        found.line = line;
                        for (const match of found.matches) {
                            match.position += indentPosition;
                        }
                        foundLines.push(found);
                    }
                }
                if (currentIndent.length <= indentAtTag.length  &&  line.trim() !== '') {
                    inGlossary = false;
                }
            }
        }
    }
    const  keyphraseWordCount = keyword.split(' ').length;

    foundLines = foundLines.filter((found) => (found.matchedKeywordCount >= keyphraseWordCount));

    foundLines.sort( (a, b) => {
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
    });
    for (const foundLineInformation of foundLines) {

        console.log(foundLineInformation.toString());
    }
}

// getKeywordMatchingScore
function  getKeywordMatchingScore(testingStrings: string[], keyphrase: string): FoundLine {
    const  lowerKeyphrase = keyphrase.toLowerCase();
    const  found = new FoundLine();

    function  subMain() {
        const  score = testingStrings.reduce(
            (maxScore: number, aTestingString: string, stringIndex: number) => {
                const  keywords = keyphrase.split(' ');
                let  thisScore = 0;

                const  result = getSubMatchedScore(aTestingString, keyphrase, lowerKeyphrase, stringIndex);
                if (result.score !== 0) {
                    thisScore = result.score * keywords.length * phraseMatchScoreWeight +
                        keyphrase.length - aTestingString.length;
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

                        const  result = getSubMatchedScore(aTestingString, keyword, keyword.toLowerCase(), stringIndex);
                        if (result.score !== 0) {
                            if (result.position > previousPosition) {
                                thisScore += result.score * orderMatchScoreWeight;
                            } else {
                                thisScore += result.score;
                            }
                            found.matchedKeywordCount += 1;
                        }
                        if (result.position !== notFound) {
                            matchedCountsByWord[wordPositions.getWordIndex(result.position)] += 1;
                            previousPosition = result.position;
                        }
                    }
                    if (thisScore !== 0) {
                        thisScore += keyphrase.length - aTestingString.length;
                        found.testedWordCount = aTestingString.split(' ').length;
                        found.matchedTargetKeywordCount = matchedCountsByWord.filter((count)=>(count >= 1)).length;
                    }
                }
                maxScore = Math.max(maxScore, thisScore);
                return maxScore;
            }, 0);

        return  score;
    }

    interface  Result {
        score: number;
        position: number;
    }

    function  getSubMatchedScore(testingString: string, keyword: string, lowerKeyword: string, stringIndex: number): Result {
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

    const  score = subMain();
    found.score = score;
    return  found;
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
function onEndOfSetting(setting: Settings) {
    for (const key of Object.keys(setting)) {
        if (!setting[key].isReferenced) {
            console.log(translate`Not referenced: ${key} in line ${setting[key].lineNum}`);
        }
    }
}

// evaluateIfCondition
function  evaluateIfCondition(expression: string, setting: Settings,
        previsousEvalatedKeys: string[] = [])
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
            if (previsousEvalatedKeys.length === 0) {

                return  result;
            } else　{
                return  {
                    result,
                    isReplacable: previsousEvalatedKeys.includes(name),
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

// getFullPath
function  getFullPath(relativePath: string, basePath: string): string {
    var    fullPath = '';
    const  slashRelativePath = relativePath.replace(/\\/g,'/');
    const  colonSlashIndex = slashRelativePath.indexOf(':/');
    const  slashFirstIndex = slashRelativePath.indexOf('/');
    const  withProtocol = (colonSlashIndex + 1 === slashFirstIndex);  // e.g.) C:/, http://

    if (relativePath.substr(0,1) === '/') {
        fullPath = relativePath;
    } else if (relativePath.substr(0,1) === '~') {
        fullPath = relativePath.replace('~', getHomePath() );
    } else if (withProtocol) {
        fullPath = relativePath;
    } else {
        fullPath = path.join(basePath, relativePath);
    }
    return  fullPath;
}

// getHomePath
function  getHomePath(): string {
    if (process.env.HOME) {
        return  process.env.HOME;
    } else {
        return  process.env.USERPROFILE!;
    }
}

// getTestablePath
function  getTestablePath(path_: string) {
    if ('test' in programOptions) {
        const  home = getHomePath();

        if (path_.startsWith(home)) {
            return  '${HOME}' + path_.substr(home.length).replace(/\\/g, '/');
        } else if (path_.startsWith(inputFileParentPath + path.sep)) {
            return  '${inputFileParentPath}/' + path_.substr(inputFileParentPath.length + 1).replace(/\\/g, '/');
        } else {
            return  path_;
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
function  getExpectedLineAndEvaluationLog(setting: Settings, template: string, withLog: boolean): {expected: string, log: EvaluationLog[]} {
    let  expected = template;
    const  log: EvaluationLog[] = [];

    for (const key of Object.keys(setting)) {
        const  re = new RegExp( escapeRegularExpression(key), "gi" );

        const  expectedAfter = expected.replace(re, setting[key].value);
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
function  getReplacedLine(setting: Settings, template: string, replacedValues: {[key:string]: string}) {
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
function  getValue(line: string, separatorIndex: number) {
    let    value = line.substr(separatorIndex + 1).trim();
    const  comment = value.indexOf('#');
    if (comment !== notFound) {
        value = value.substr(0, comment).trim();
    }
    return  value;
}

// parseTemplateTag
function  parseTemplateTag(line: string): TemplateTag {
    const  tag = new TemplateTag();

    tag.label = templateLabel;
    tag.indexInLine = line.indexOf(templateLabel);
    if (tag.indexInLine === notFound) {
        tag.label = fileTemplateLabel;
        tag.indexInLine = line.indexOf(fileTemplateLabel);
    }
    if (tag.indexInLine !== notFound) {
        tag.isFound = true;
        const  leftOfTemplate = line.substr(0, tag.indexInLine).trim();
        if (tag.label === fileTemplateLabel) {
            tag.onFileTemplateTagReading(line);
        }

        tag.template = line.substr(tag.indexInLine + tag.label.length).trim();
        if (leftOfTemplate === '') {
            tag.lineNumOffset = -1;
        } else {
            tag.lineNumOffset = 0;
        }
        return  tag;
    }

    tag.label = templateAtStartLabel;
    tag.startIndexInLine = line.indexOf(templateAtStartLabel);
    if (tag.startIndexInLine !== notFound) {
        tag.isFound = true;
        tag.endIndexInLine =  line.indexOf(templateAtEndLabel, tag.startIndexInLine);
        if (tag.endIndexInLine !== notFound) {

            tag.template = line.substr(tag.endIndexInLine + templateAtEndLabel.length).trim();
            tag.lineNumOffset = parseInt(line.substring(
                tag.startIndexInLine + templateAtStartLabel.length,
                tag.endIndexInLine ));
            return  tag;
        }
    }

    tag.label = '';
    tag.template = '';
    tag.lineNumOffset = 0;
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

// escapeRegularExpression
function  escapeRegularExpression(expression: string) {
    return  expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

// Setting
type Settings = {[name: string]: Setting}

// Setting
class Setting {
    value: string = '';
    lineNum: number = 0;
    isReferenced: boolean = false;
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
                line.substr(previousPosition, match.position - previousPosition) +
                matchedColor( line.substr(match.position, match.length) );
            previousPosition = match.position + match.length;
        }
        coloredLine += line.substr(previousPosition);
        if (false) {
            var  debugString = ` (score: ${this.score}, wordCount: ${this.testedWordCount})`;
        } else {
            var  debugString = ``;
        }

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

// Direction
enum Direction {
    Above = -1,
    Following = +1,
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

// pp
// Debug print.
// #keyword: pp
// Example:
//    pp(var);
// Example:
//    var d = pp(var);
//    d = d;  // Set break point here and watch the variable d
// Example:
//    try {
//
//        await main();
//    } catch (e) {
//        var d = pp(e);
//        throw e;  // Set break point here and watch the variable d
//    }
function  pp(message: any = '') {
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    debugOut.push(message.toString());
    return debugOut;
}
export const  debugOut: string[] = [];

// cc
// Through counter.
// #keyword: cc
// Example:
//   cc();
// Example:
//   var c = cc().debugOut;  // Set break point here and watch the variable c
// Example:
//   if ( cc(2).isTarget )
//   var d = pp('');  // Set break point here and watch the variable d
function  cc( targetCount: number = 9999999, label: string = '0' ) {
    if (!(label in gCount)) {
        gCount[label] = 0;
    }

    gCount[label] += 1;
    pp( `${label}:countThrough[${label}] = ${gCount[label]}` );
    const isTarget = ( gCount[label] === targetCount );

    if (isTarget) {
        pp( '    **** It is before the target! ****' );
    }
    return  { isTarget, debugOut };
}
const  gCount: {[name: string]: number} = {};

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
                this.inputResolver(line);
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
            translated = translated.replace( '${'+String(i)+'}', String(values[i]) );
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

const  settingStartLabel = /^設定((\(|（)([^\)]*)(\)|）))?:( |\t)*(#.*)?$/;
const  settingStartLabelEn = /^settings((\()([^\)]*)(\)))?:( |\t)*(#.*)?$/;
const  originalLabel = "#original:";
const  templateLabel = "#template:";
const  templateAtStartLabel = "#template-at(";
const  templateAtEndLabel = "):";
const  fileTemplateLabel = "#file-template:";
const  fileTemplateAnyLinesLabel = "#file-template-any-lines:";
const  keywordLabel = "#keyword:";
const  glossaryLabel = "#glossary:";
const  disableLabel = "#disable-tag-tool:";
const  ifLabel = "#if:";
const  expectLabel = "#expect:";
const  ignoredKeywords = [ /#keyword:/g, /#search:/g ];
const  temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
const  secretLabel = "#★秘密";
const  secretLabelEn = "#secret";
const  secretExamleLabel = "#★秘密:仮";
const  secretExamleLabelEn = "#secret:example";
const  referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
const  indentRegularExpression = /^( |¥t)*/;
const  numberRegularExpression = /^[0-9]*$/;
const  fullMatchScore = 100;
const  keywordMatchScore = 7;
const  glossaryMatchScore = 1;
const  caseIgnoredFullMatchScore = 8;
const  wordsMatchScore = 7;
const  partMatchScore = 5;
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
