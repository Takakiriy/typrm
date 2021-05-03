import * as fs from 'fs'; // file system
import * as path from "path";  // or path = require("path")
import * as globby from 'globby';
import * as readline from 'readline';
import * as stream from 'stream';
import * as csvParse from 'csv-parse';

// main
export async function  main() {
	locale = Intl.NumberFormat().resolvedOptions().locale;
	if ('locale' in programOptions) {
		locale = programOptions.locale;
	}

	if (programArguments.length === 0) {
		await oldMain(true, '');

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
			varidateUpdateCommandArguments();
			const  inputFilePath = programArguments[1];
			const  changingLineNum = parseInt(programArguments[2]);
			const  keyValues = programArguments[3];

			await replaceSettings(inputFilePath, changingLineNum, keyValues);
		}
		else {
			println(`Unknown command "${programArguments[0]}".`);
		}
	}
}

// oldMain
async function  oldMain(isModal: boolean, inputFilePath: string) {
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
		let  lineNum = 0;
		let  templateCount = 0;
		let  fileTemplateTag: TemplateTag | null = null;
		let  errorCount = 0;
		let  warningCount = 0;
		let  secretLabelCount = 0;
		const  lines = [];
		const  keywords: SearchKeyword[] = [];

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
				// const  match = settingStartLabel.exec(line.trim());
				// settingName = match[1];
			} else if (isEndOfSetting(line, isReadingSetting)) {
				isReadingSetting = false;
			}
			if (isReadingSetting) {
				const  separator = line.indexOf(':');
				if (separator !== notFound) {
					const  key = line.substr(0, separator).trim();
					const  value = getValue(line, separator);
					if (value !== '') {

						setting[key] = {value, isReferenced: false, lineNum};
					} else if (!settingStartLabel.test(key + ':')  &&  !settingStartLabelEn.test(key + ':')) {
						isReadingSetting = false;
					}
				}
			}

			// Check if previous line has "template" replaced contents.
			const  templateTag = parseTemplateTag(line);
			if (templateTag.lineNumOffset >= 1  &&  templateTag.isFound) {
				println("");
				println(`${translate('ErrorLine')}: ${lineNum}`);
				println(`  ${translate('Contents')}: ${line.trim()}`);
				println(`  ${translate('Error')}: ${translate('The parameter must be less than 0')}`);
				templateTag.isFound = false;
				templateCount += 1;
				errorCount += 1;
			}
			if (templateTag.isFound) {
				templateCount += 1;
				const  checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
				const  expected = getExpectedLine(setting, templateTag.template);

				if (checkingLine.indexOf(expected) === notFound) {
					println("");
					println(`${translate('ErrorLine')}: ${lineNum + templateTag.lineNumOffset}`);
					println(`  ${translate('Contents')}: ${checkingLine.trim()}`);
					println(`  ${translate('Expected')}: ${expected}`);
					println(`  ${translate('Template')}: ${templateTag.template}`);
					println(`  ${translate('SettingIndex')}: ${settingCount}`);
					errorCount += 1;
				}
			}

			// Check target file contents by "#file-template:" tag.
			if (fileTemplateTag) {
				const continue_ = fileTemplateTag.onReadLine(line);
				if (!continue_) {

					const  checkPassed = await fileTemplateTag.checkTargetContents(
						setting, inputFilePath, lineNum);
					if (!checkPassed) {
						errorCount += 1;
					}
					fileTemplateTag = null;
				}
			}
			if (templateTag.label === fileTemplateLabel) {
				fileTemplateTag = templateTag;
			}

			// Check if there is not "#★Now:".
			for (let temporaryLabel of temporaryLabels) {
				if (line.toLowerCase().indexOf(temporaryLabel.toLowerCase()) !== notFound) {
					println("");
					println(`${translate('WarningLine')}: ${lineNum}`);
					println(`  ${translate('Contents')}: ${line.trim()}`);
					println(`  ${translate('SettingIndex')}: ${settingCount}`);
					warningCount += 1;
				}
			}

			// Check if there is not secret tag.
			if (line.indexOf( secretLabel ) !== notFound  ||  line.indexOf( secretLabelEn ) !== notFound) {
				if (line.indexOf( secretExamleLabel ) === notFound  &&  line.indexOf( secretExamleLabelEn ) === notFound) {
					if (secretLabelCount === 0) {  // Because there will be many secret data.
						println("");
						println(`${translate('WarningLine')}: ${lineNum}`);
						println(`  ${translate('This is a secret value.')}`);
						println('  '+ translate`Change "${secretLabelEn}" to "${secretExamleLabelEn}".'`);
						println('  '+ translate`Change "${secretLabel}" to "${secretExamleLabel}".'`);
						println(`  ${translate('SettingIndex')}: ${settingCount}`);
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

			const  checkPassed = await fileTemplateTag.checkTargetContents(
				setting, inputFilePath, lineNum);
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

						if (line.indexOf(keyword.keyword) !== notFound) {
							keyword.startLineNum = foundForAbove;
						}
					}
				} else if (keyword.direction === Direction.Following) {
					if (lineNum >= keyword.startLineNum) {

						if (line.indexOf(keyword.keyword) !== notFound) {
							keyword.startLineNum = foundForFollowing;
						}
					}
				}
			}
		}
		for (const keyword of keywords) {
			if (keyword.direction === Direction.Above) {
				if (keyword.startLineNum !== foundForAbove) {
					println('');
					println(`${translate('ErrorLine')}: ${keyword.startLineNum + 1}`);
					println('  ' + translate`Not found "${keyword.keyword}" above`);
					errorCount += 1;
				}
			} else if (keyword.direction === Direction.Following) {
				if (keyword.startLineNum !== foundForFollowing) {
					println('');
					println(`${translate('ErrorLine')}: ${keyword.startLineNum - 1}`);
					println('  ' + translate`Not found "${keyword.keyword}" following`);
					errorCount += 1;
				}
			}
		}

		// Show the result
		println('');
		println(`${translate('Warning')}: ${warningCount}, ${translate('Error')}: ${errorCount}`);
		if (previousTemplateCount) {
			println(`${translate('template count')} = ${previousTemplateCount} (${translate('in previous check')})`);
		}
		println(`${translate('template count')} = ${templateCount}`);

		if (!isModal) {
			break;
		}

		// Rescan or change a value
		let  loop = true;
		while (loop) {
			println(translate('Press Enter key to retry checking.'));

			const  key = await input(translate('The line number to change the variable value >'));
			errorCount = 0;
			if (key === 'exit') {
				return;
			} else if (key !== '') {
				const  lineNum = parseInt(key);
				const  changingSettingIndex = await getSettingIndexFromLineNum(inputFilePath, lineNum);
				println(`${translate('SettingIndex')}: ${changingSettingIndex}`);
				println(translate('Enter only: finish to input setting'));
				for (;;) {
					const  keyValue = await input(translate('key: new_value>'));
					if (keyValue === '') {
						break;
					}
					errorCount += await changeSettingByKeyValueOld(inputFilePath, changingSettingIndex, keyValue);
				}
			}
			loop = (errorCount >= 1);
		}

		// Rescan
		println('========================================');
		previousTemplateCount = templateCount
		for (const key of Object.keys(setting)) {
			setting[key].isReferenced = false;
		}
	}
}

// updateParameters
async function  replaceSettings(inputFilePath: string, changingLineNum: number, keyValues: string) {
	var    errorCount = 0;
	const  changingSettingIndex = await getSettingIndexFromLineNum(inputFilePath, changingLineNum);
	for (const keyValue of keyValues.split('\n')) {

		errorCount += await changeSettingByKeyValueOld(inputFilePath, changingSettingIndex, keyValue);
	}
	println('');
	println(`${translate('Warning')}: 0, ${translate('Error')}: ${errorCount}`);
}

// changeSettingByKeyValue
async function  changeSettingByKeyValueOld(inputFilePath: string, changingSettingIndex: number,
		keyValue: string): Promise<number>/*errorCount*/ {

	const  separator = keyValue.indexOf(':');
	if (separator !== notFound) {
		const  key = keyValue.substr(0, separator).trim();
		const  value = getValue(keyValue, separator);

		return  changeSetting(inputFilePath, changingSettingIndex, key, value);
	} else {
		return  1;
	}
}

// changeSetting
async function  changeSetting(inputFilePath: string, changingSettingIndex: number,
		changingKey: string, changedValueAndComment: string): Promise<number>/*errorCount*/ {

	if (false) {
		const  backUpFilePath = inputFilePath +".backup";
		if (!fs.existsSync(backUpFilePath)) {
			fs.copyFileSync(inputFilePath, backUpFilePath);
		}
	}

	const  oldFilePath = inputFilePath;
	const  newFilePath = inputFilePath +".new";
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
	let  changedValue = getChangedValue(changedValueAndComment);
	let  lineNum = 0;
	let  errorCount = 0;
	let  isChanging = false;
	
	for await (const line1 of reader) {
		const  line: string = line1;
		lines.push(line);
		lineNum += 1;
		let  output = false;

		// setting = ...
		if (settingStartLabel.test(line.trim())  ||  settingStartLabelEn.test(line.trim())) {
			isReadingSetting = true;
			setting = {};
			settingCount += 1;
			if (changingSettingIndex === allSetting) {
				isChanging = true;
			} else {
				isChanging = (settingCount === changingSettingIndex);
			}
		} else if (isEndOfSetting(line, isReadingSetting)) {
			isReadingSetting = false;
		}
		if (isChanging) {

			if (isReadingSetting) {
				const  separator = line.indexOf(':');
				if (separator !== notFound) {
					const  key = line.substr(0, separator).trim();
					const  value = getValue(line, separator);
					if (value !== '') {

						setting[key] = {value, isReferenced: false, lineNum};
					} else if (!settingStartLabel.test(key + ':')  &&  !settingStartLabelEn.test(key + ':')) {
						isReadingSetting = false;
					}

					if (key === changingKey) {
						const  commentIndex = line.indexOf('#', separator);
						let  comment= '';
						if (commentIndex !== notFound  &&  changedValueAndComment.indexOf('#') === notFound) {
							comment = '  ' + line.substr(commentIndex);
						}

						writer.write(line.substr(0, separator + 1) +' '+ changedValueAndComment + comment + "\n");
						output = true;
					}
				}

			// Out of settings
			} else {
				const  templateTag = parseTemplateTag(line);
				if (templateTag.isFound  &&  templateTag.template.indexOf(changingKey) !== notFound) {
					const  checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
					const  expected = getExpectedLine(setting, templateTag.template);
					const  changed = getChangedLine(setting, templateTag.template, changingKey, changedValue);

					if (checkingLine.indexOf(expected) !== notFound) {
						const  before = expected;
						const  after = changed;
						if (templateTag.lineNumOffset <= -1) {
							const  aboveLine = lines[lines.length - 1 + templateTag.lineNumOffset];
							writer.replaceAboveLine(templateTag.lineNumOffset,
								aboveLine.replace(before, after)+"\n");
						} else {

							writer.write(line.replace(before, after) +"\n");
							output = true;
						}
					} else if (checkingLine.indexOf(changed) !== notFound) {
						// Do nothing
					} else {
						if (errorCount === 0) { // Since only one old value can be replaced at a time
							println('');
							println(`${translate('ErrorLine')}: ${lineNum}`);
							println(`  ${translate('Error')}: ${translate('Not found any replacing target')}`);
							println(`  ${translate('Solution')}: ${translate('Set old value at settings in the replacing file')}`);
							println(`  ${translate('Contents')}: ${line.trim()}`);
							println(`  ${translate('Expected')}: ${expected.trim()}`);
							println(`  ${translate('Template')}: ${templateTag.template.trim()}`);
							println(`  ${translate('SettingIndex')}: ${settingCount}`);
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
	writer.end();
	return new Promise( (resolve) => {
		writer.on('finish', () => {
			fs.copyFileSync(newFilePath, inputFilePath);
			deleteFileSync(newFilePath);
			resolve(errorCount);
		});
	});
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
	async  checkTargetContents(setting: Settings, inputFilePath: string, templateEndLineNum: number): Promise<boolean> {
		const  parentPath = path.dirname(inputFilePath);
		const  targetFilePath = getFullPath(getExpectedLine(setting, this.template), parentPath);
		if (!fs.existsSync(targetFilePath)) {
			const  templateLineNum = templateEndLineNum - this.templateLines.length;
			println("");
			println(`Error:`);
			println(`  ${translate('NotFound')}: ${targetFilePath}`);
			println(`  Template: ${inputFilePath}:${templateLineNum}`);
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
		let  same = false;

		for await (const line1 of targetFileReader) {
			const  targetLine: string = line1;
			targetLineNum += 1;
			if (templateLineIndex === 0) {

				const  indentLength = targetLine.indexOf(expectedFirstLine);
				if (indentLength === notFound) {
					same = false;
				} else {
					same = true;
					indent = targetLine.substr(0, indentLength);
				}
			} else { // lineIndex >= 1
				const  expected = getExpectedLineInFileTemplate(
					setting, this.templateLines[templateLineIndex]);

				same = (targetLine === indent + expected);
				if (!same) {
					errorTemplateLineIndex = templateLineIndex;
					errorTargetLineNum = targetLineNum;
					errorContents = targetLine;
					errorExpected = indent + expected;
					errorTemplate = indent + this.templateLines[templateLineIndex];
				}
			}
			if (same) {
				templateLineIndex += 1;
				if (templateLineIndex >= this.templateLines.length) {
					break;
				}
			} else {
				templateLineIndex = 0;
			}
		}
		if (!same) {
			const  templateLineNum = templateEndLineNum - this.templateLines.length + errorTemplateLineIndex;
			if (errorContents === '') {
				errorContents = '(Not found)';
				errorExpected = expectedFirstLine;
				errorTemplate = this.templateLines[0];
			}
			println("");
			println(`${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${templateLineNum}`);
			println(`${translate('ErrorFile')}: ${getTestablePath(targetFilePath)}:${errorTargetLineNum}`);
			println(`  Contents: ${errorContents}`);
			println(`  Expected: ${errorExpected}`);
			println(`  Template: ${errorTemplate}`);
		}
		return  same;
	}
}

// check
async function  check(checkingFilePath?: string) {
	const  targetFolder = programOptions.folder;
	const  targetFolderFullPath = getFullPath(targetFolder, process.cwd());
	if (checkingFilePath) {
		const  inputFileFullPath = targetFolderFullPath + path.sep + checkingFilePath;
		if (!fs.existsSync(inputFileFullPath)) {
			throw new Error(`Not found specified target file at "${inputFileFullPath}".`);
		}

		var  filePaths = [checkingFilePath];
	} else {
		const  oldCurrentFoldderPath = process.cwd();
		if (!fs.existsSync(targetFolderFullPath)) {
			throw new Error(`Not found target folder at "${targetFolderFullPath}".`);
		}
		process.chdir(targetFolder);

		var  filePaths: string[] = await globby(['**/*']);
		process.chdir(oldCurrentFoldderPath);
	}

	for (const inputFilePath of filePaths) {
		const  inputFileFullPath = targetFolderFullPath + path.sep + inputFilePath;

		await oldMain(false, inputFileFullPath);
	}
}

// search
async function  search() {
	const  keyword = programArguments[1].replace('"', '""');
	const  targetFolder = programOptions.folder;
	const  targetFolderFullPath = getFullPath(targetFolder, process.cwd());
	const  oldCurrentFoldderPath = process.cwd();
	process.chdir(targetFolder);
	const  filePaths: string[] = await globby(['**/*']);
	process.chdir(oldCurrentFoldderPath);
	var  indentAtStart = '';
	var  inGlossary = false;

	for (const inputFilePath of filePaths) {
		const  inputFileFullPath = targetFolderFullPath + path.sep + inputFilePath;
		const  reader = readline.createInterface({
			input: fs.createReadStream(inputFileFullPath),
			crlfDelay: Infinity
		});
		var  lineNum = 0;

		for await (const line1 of reader) {
			const  line: string = line1;
			lineNum += 1;

			// keyword tag
			if (line.indexOf(keywordLabel) !== notFound) {
				if (line.indexOf(keyword) !== notFound) {
					const  csv = line.substr(line.indexOf(keywordLabel) + keywordLabel.length);
					const  columns = await parseCSVColumns(csv);
					if (columns.indexOf(keyword.replace('""','"')) !== notFound) {

						println(`${getTestablePath(inputFileFullPath)}:${lineNum}: ${line}`);
					}
				}
			}

			// glossary tag
			if (line.indexOf(glossaryLabel) !== notFound) {
				inGlossary = true;
				indentAtStart = indentRegularExpression.exec(line)![0];
			}
			else if (inGlossary) {
				const  currentIndent = indentRegularExpression.exec(line)![0];

				if (line.indexOf(keyword) === currentIndent.length) {
					if (line[currentIndent.length + keyword.length] === ':') {
						println(`${getTestablePath(inputFileFullPath)}:${lineNum}: ${line}`);
					}
				}
				if (currentIndent.length <= indentAtStart.length) {
					inGlossary = false;
				}
			}
		}
	}
}

// varidateUpdateCommandArguments
function  varidateUpdateCommandArguments() {
	if (programArguments.length < 4) {
		throw new Error('Error: Too few argurments. Usage: typrm replace  __FilePath__  __LineNum__  __KeyColonValue__')
	}
}

// onEndOfSetting
function onEndOfSetting(setting: Settings) {
	for (const key of Object.keys(setting)) {
		if (!setting[key].isReferenced) {
			println(translate`Not referenced: ${key} in line ${setting[key].lineNum}`);
		}
	}
}

// getSettingIndexFromLineNum
async function  getSettingIndexFromLineNum(inputFilePath: string, targetLineNum: number): Promise<number> {
	const  reader = readline.createInterface({
		input: fs.createReadStream(inputFilePath),
		crlfDelay: Infinity
	});
	let  settingCount = 0;
	let  lineNum = 0;
	let  loop = true;
	let  exception: any;

	for await (const line1 of reader) {
		if (!loop) {continue;}  // "reader" requests read all lines
		try {
			const  line: string = line1;
			lineNum += 1;

			if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
				settingCount += 1;
			}

			if (lineNum === targetLineNum) {
				loop = false;
			}
		} catch (e) {
			exception = e;
			loop = false;
		}
	}
	if (exception) {
		throw exception;
	}
	return  settingCount;
}

// isEndOfSetting
function  isEndOfSetting(line: string, isReadingSetting: boolean): boolean {
	let  returnValue = false;
	if (isReadingSetting) {
		const comment = line.indexOf('#');
		let leftOfComment: string;
		if (comment !== notFound) {
			leftOfComment = line.substr(0, line.indexOf('#')).trim();
		}
		else {
			leftOfComment = line.trim();
		}

		if (leftOfComment.indexOf(':') === notFound  &&  leftOfComment !== '') {
			returnValue = true;
		} else if (leftOfComment.substr(-1) === '|') {
			returnValue = true;
		}
	}
	return  returnValue;
}

// getFullPath
function  getFullPath(relativePath: string, basePath: string): string {
	var  fullPath = '';
	if (relativePath.substr(0,1) === '/') {
		fullPath = relativePath;
	} else if (relativePath.substr(0,1) === '~') {
		fullPath = relativePath.replace('~', getHomePath() );
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

// getValue
function  getValue(line: string, separatorIndex: number) {
	let    value = line.substr(separatorIndex + 1).trim();
	const  comment = value.indexOf('#');
	if (comment !== notFound) {
		value = value.substr(0, comment).trim();
	}
	return  value;
}

// getExpectedLine
function  getExpectedLine(setting: Settings, template: string): string {
	let  expected = template;

	for (const key of Object.keys(setting)) {
		const  re = new RegExp( escapeRegularExpression(key), "gi" );

		const  expectedAfter = expected.replace(re, setting[key].value);
		if (expectedAfter !== expected) {
			setting[key].isReferenced = true;
		}
		expected = expectedAfter;
	}
	return  expected;
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

// getChangedLine
function  getChangedLine(setting: Settings, template: string, changingKey: string, changedValue: string) {
	let  changedLine = '';
	if (changingKey in setting) {
		const  changingValue = setting[changingKey].value;

		setting[changingKey].value = changedValue;

		changedLine = getExpectedLine(setting, template);
		setting[changingKey].value = changingValue;
	} else {
		changedLine = getExpectedLine(setting, template);
	}
	return  changedLine;
}

// getChangedValue
function  getChangedValue(changedValueAndComment: string): string {
	const  commentIndex = changedValueAndComment.indexOf('#');
	let  changedValue: string;
	if (commentIndex !== notFound) {

		changedValue = changedValueAndComment.substr(0, commentIndex).trim();
	} else {
		changedValue = changedValueAndComment;
	}
	return  changedValue;
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
            });
    });
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

// dd
// debugOut の内容が見えないときは、 const debugOut_ = debugOut; を書いて debugOut_ の内容を見ます。
function  dd(message: any) {
	if (typeof message === 'object') {
		message = JSON.stringify(message);
	}
	debugOut.push(message.toString());
}
export const  debugOut: string[] = [];

// watchPrint
function  watchPrint() {
	const  s = stdout;
	const  debugOut_ = stdout.split('\n');
	return;  // Set break point here
}

// println
function  println(message: any) {
	if (typeof message === 'object') {
		message = JSON.stringify(message);
	}
	if (withJest) {
		stdout += message.toString() + '\n';
	} else {
		console.log(message);
	}
}

// StandardInputBuffer
class  StandardInputBuffer {
	readlines: readline.Interface;
	inputBuffer: string[] = [];
	inputResolver?: (answer:string)=>void = undefined;

	constructor() {
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
		return  new Promise(
			(resolve: (answer:string)=>void,  reject: (answer:string)=>void ) =>
		{
			const  nextLine = this.inputBuffer.shift();
			if (nextLine) {
				println(guide + nextLine);
				resolve(nextLine);
			} else {
				process.stdout.write(guide);
				this.inputResolver = resolve;
			}
		});
	}

	close() {
		this.readlines.close();
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
	testBaseFolder +`change_set_.yaml`,
	String.raw `file`,
	testBaseFolder +`change_set_setting.yaml`,
	String.raw `Changed`,
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
			println(guide + value);

			return  value;
		}
	}

	// Read the starting process parameters
	while (inputOption.nextParameterIndex < process.argv.length) {
		const  value = process.argv[inputOption.nextParameterIndex];
		inputOption.nextParameterIndex += 1;
		if (value.substr(0,1) !== '-') {
			println(guide + value);

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

// pathResolve
function  pathResolve(path_: string) {

	// '/c/home' format to current OS format
	if (path_.length >= 3) {
		if (path_[0] === '/'  &&  path_[2] === '/') {
			path_ = path_[1] +':'+ path_.substr(2);
		}
	}

	// Change separators to OS format
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
			"YAML UTF-8 file path>": "YAML UTF-8 ファイル パス>",
			"This is a secret value.": "これは秘密の値です。",
			"Change \"${0}\" to \"${1}\".": "\"${0}\" を \"${1}\" に変更してください。",
			"Press Enter key to retry checking.": "Enter キーを押すと再チェックします。",
			"The line number to change the variable value >": "変更する変数値がある行番号 >",
			"Enter only: finish to input setting": "Enter のみ：設定の入力を終わる",
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

    await main();
}

const  settingStartLabel = /^設定(\(|（[^\)]*\)|）)?:$/;
const  settingStartLabelEn = /^settings(\([^\)]*\))?:$/;
const  templateLabel = "#template:";
const  templateAtStartLabel = "#template-at(";
const  templateAtEndLabel = "):";
const  fileTemplateLabel = "#file-template:";
const  keywordLabel = "#keyword:";
const  glossaryLabel = "#glossary:";
const  temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
const  secretLabel = "#★秘密";
const  secretLabelEn = "#secret";
const  secretExamleLabel = "#★秘密:仮";
const  secretExamleLabelEn = "#secret:example";
const  referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
const  indentRegularExpression = /^( |¥t)*/;
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
