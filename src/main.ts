import * as fs from 'fs'; // file system
import * as path from "path";  // or path = require("path")
import * as globby from 'globby';
import * as readline from 'readline';
import * as stream from 'stream';
import * as csvParse from 'csv-parse';
import * as chalk from 'chalk';
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
			varidateUpdateCommandArguments();
			const  inputFilePath = programArguments[1];
			const  changingLineNum = parseInt(programArguments[2]);
			const  keyValues = programArguments[3];

			await replaceSettings(inputFilePath, changingLineNum, keyValues);
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
		let  lineNum = 0;
		let  templateCount = 0;
		let  fileTemplateTag: TemplateTag | null = null;
		let  enabled = true;
		let  errorCount = 0;
		let  warningCount = 0;
		let  secretLabelCount = 0;
		const  lines = [];
		const  keywords: SearchKeyword[] = [];
		const  indentLengthsOfIfTag: IfTag[] = [
			{indentLength: -1, resultOfIf: true, enabled: true}
		];

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

			// Set condition by "#if:" tag.
			const  indentLength = indentRegularExpression.exec(line)![0].length;
			if (line.trim() !== '') {
				while (indentLength <= lastOf(indentLengthsOfIfTag).indentLength) {

					indentLengthsOfIfTag.pop();
					enabled = lastOf(indentLengthsOfIfTag).enabled;
				}
			}
			if (line.includes(ifLabel)) {
				const  condition = line.substr(line.indexOf(ifLabel) + ifLabel.length).trim();

				const  evaluatedContidion = evaluateIfCondition(condition, setting);
				if (typeof evaluatedContidion === 'boolean') {
					var  resultOfIf = evaluatedContidion;
				} else {
					console.log('');
					console.log('Error of if tag syntax:');
					console.log(`  ${translate('typrmFile')}: ${getTestablePath(inputFilePath)}:${lineNum}`);
					console.log(`  Contents: ${condition}`);
					var  resultOfIf = true;
				}
				if (enabled && !resultOfIf) {
					enabled = false;
				}
				indentLengthsOfIfTag.push({indentLength, resultOfIf, enabled});
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

				if ( ! checkingLine.includes(expected)  &&  enabled) {
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
			if (templateTag.label === fileTemplateLabel  &&  enabled) {
				fileTemplateTag = templateTag;
			}

			// Check if there is not "#★Now:".
			for (let temporaryLabel of temporaryLabels) {
				if (line.toLowerCase().includes(temporaryLabel.toLowerCase())  &&  enabled) {
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
						console.log('  '+ translate`Change "${secretLabelEn}" to "${secretExamleLabelEn}".'`);
						console.log('  '+ translate`Change "${secretLabel}" to "${secretExamleLabel}".'`);
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

		// Rescan or change a value
		let  loop = true;
		while (loop) {
			console.log(translate('Press Enter key to retry checking.'));

			const  key = await input(translate('The line number to change the variable value >'));
			errorCount = 0;
			if (key === 'exit') {
				return;
			} else if (key !== '') {
				const  lineNum = parseInt(key);
				const  changingSettingIndex = await getSettingIndexFromLineNum(inputFilePath, lineNum);
				console.log(`${translate('SettingIndex')}: ${changingSettingIndex}`);
				console.log(translate('Enter only: finish to input setting'));
				for (;;) {
					const  keyValue = await input(translate('key: new_value>'));
					if (keyValue === '') {
						break;
					}
					errorCount += await changeSettingByKeyValue(inputFilePath, changingSettingIndex, keyValue);
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
async function  replaceSettings(inputFilePath: string, changingLineNum: number, keyValues: string) {
	const  targetFolder = programOptions.folder;
	const  currentFolder = process.cwd();
	const  targetFolders = await parseCSVColumns(programOptions.folder);
	const  fileFullPaths: string[] = [];
	var  errorCount = 0;
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
		errorCount += 1;
	} else if (fileFullPaths.length >= 2) {
		console.log('');
		console.log(`${translate('Error of same file name exists.')}`);
		console.log(`    FileName: ${inputFilePath}`);
		console.log(`    Folder: ${programOptions.folder}`);
		errorCount += 1;
	}
	else {
		const  inputFileFullPath = fileFullPaths[0];
		const  changingSettingIndex = await getSettingIndexFromLineNum(inputFileFullPath, changingLineNum);

		for (const keyValue of keyValues.split('\n')) {

			errorCount += await changeSettingByKeyValue(inputFileFullPath, changingSettingIndex, keyValue);
		}
	}
	console.log('');
	console.log(`${translate('Warning')}: 0, ${translate('Error')}: ${errorCount}`);
}

// changeSettingByKeyValue
async function  changeSettingByKeyValue(inputFilePath: string, changingSettingIndex: number,
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
	let  settingLineNum = -1;
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
			settingLineNum = lineNum;
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
						let  original = '';
						if ( ! line.includes(originalLabel)) {
							original = `  ${originalLabel} ${value}`;
						}
						const  commentIndex = line.indexOf('#', separator);
						let  comment= '';
						if (commentIndex !== notFound  &&  ! changedValueAndComment.includes('#')) {
							comment = '  ' + line.substr(commentIndex);
						}

						writer.write(line.substr(0, separator + 1) +' '+ changedValueAndComment + original + comment + "\n");
						output = true;
					}
				}

			// Out of settings
			} else {
				const  templateTag = parseTemplateTag(line);
				if (templateTag.isFound  &&  templateTag.template.includes(changingKey)) {
					const  checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
					const  expected = getExpectedLine(setting, templateTag.template);
					const  changed = getChangedLine(setting, templateTag.template, changingKey, changedValue);

					if (checkingLine.includes(expected)) {
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
					} else if (checkingLine.includes(changed)) {
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
					} else if (expected === fileTemplateAnyLinesLabel) {
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
					} else if (targetLine.startsWith(indent)) {
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

// check
async function  check(checkingFilePath?: string) {
	const  targetFolders = await parseCSVColumns(programOptions.folder);
	const  currentFolder = process.cwd();
	const  inputFileFullPaths: string[] = [];
	const  notFoundPaths: string[] = [];
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
	const  keywordDoubleQuoted = keyword.replace(/"/g, '""');
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
	const  foundLines: FoundLine[] = [];

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
				const  csv = line.substr(line.indexOf(keywordLabel) + keywordLabel.length);
				const  columns = await parseCSVColumns(csv)
					.catch((e: Error) => {
						console.log(`Warning: ${e.message} in ${inputFileFullPath}:${lineNum}: ${line}`);
						return [];
					});

				const  found = getKeywordMatchingScore(columns, keyword);
				if (found.score >= 1) {
					const  positionOfCSV = line.length - csv.length;
					const  columnPositions = parseCSVColumnPositions(csv, columns);

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
					if (found.score >= 1  &&  colonPosition !== notFound) {

						found.path = getTestablePath(inputFileFullPath);
						found.lineNum = lineNum;
						found.line = line;
						for (const match of found.matches) {
							match.position += indentPosition;
						}
						foundLines.push(found);
					}
				}
				if (currentIndent.length <= indentAtTag.length) {
					inGlossary = false;
				}
			}
		}
	}

	foundLines.sort( (a, b) => {
		var  different = a.score - b.score;
		if (different === 0) {
			if (a.path < b.path) {
				different = -1;
			} else if (a.path > b.path) {
				different = +1;
			} else {
				different = a.lineNum - b.lineNum;
			}
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
			(score: number, aTestingString: string, stringIndex: number) => {
				const  keywords = keyphrase.split(' ');
				let  thisScore = 0;

				const  result = getSubMatchedScore(aTestingString, keyphrase, lowerKeyphrase, stringIndex);
				if (result.score !== 0) {
					thisScore = result.score * keywords.length * phraseMatchScoreWeight;
				} else {
					let  previousPosition = -1;

					for (const keyword of keywords) {
						if (keyword === '') {continue;}

						const  result = getSubMatchedScore(aTestingString, keyword, keyword.toLowerCase(), stringIndex);
						if (result.position > previousPosition) {
							thisScore += result.score * orderMatchScoreWeight;
						} else {
							thisScore += result.score;
						}
						if (result.position !== notFound) {
							previousPosition = result.position;
						}
					}
				}
				return score + thisScore;
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
				score = partMatchScore;
			}
		} else if ((position = testingString.toLowerCase().indexOf(lowerKeyword)) !== notFound) {
			if (testingString.length === lowerKeyword.length) {
				score = caseIgnoredFullMatchScore;
			} else {
				score = caseIgnoredPartMatchScore;
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
function  varidateUpdateCommandArguments() {
	if (programArguments.length < 4) {
		throw new Error('Error: Too few argurments. Usage: typrm replace  __FilePath__  __LineNum__  "__KeyColonValue__"')
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
function   evaluateIfCondition(condition: string, setting: Settings): boolean | Error {

	if (condition === 'true') {
		return  true;
	} else if (condition === 'false') {
		return  false;
	}
	const  settingsDot = '$settings.';
	const  envDot = '$env.';
	let    match: RegExpExecArray | null = null;
	let    parent = '';
	if (condition.startsWith(settingsDot)) {
		parent = settingsDot;

		// e.g. $settings.__Stage__ == develop
		// e.g. $settings.__Stage__ != develop
		match = /\$settings.([^ ]*) *(==|!=) *([^ ].*)/.exec(condition);
	}
	else if (condition.startsWith(envDot)) {
		parent = envDot;

		// e.g. $env.typrm_aaa == aaa
		// e.g. $env.typrm_aaa != aaa
		// e.g. $env.typrm_aaa == ""
		// e.g. $env.typrm_aaa != ""
		match = /\$env.([^ ]*) *(==|!=) *([^ ]*)/.exec(condition);
	}
	if (match && parent) {
		const  name = match[1];
		const  operator = match[2];
		let    rightValue = match[3];
		if (parent === settingsDot) {
			if (name in setting) {
				var  leftValue = setting[name].value;
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

		if (operator === '==') {
			return  leftValue === rightValue;
		} else if (operator === '!=') {
			return  leftValue !== rightValue;
		}
	}
	return  new Error('syntax error');
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
				loop = false;  // return or break must not be written.
				// https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
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

		if ( ! leftOfComment.includes(':')  &&  leftOfComment !== '') {
			returnValue = true;
		} else if (leftOfComment.substr(-1) === '|') {
			returnValue = true;
		}
	}
	return  returnValue;
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

		return `${this.path}:${this.lineNum}: ${coloredLine}`;
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
			"Error not same as file contents": "ファイルの内容と異なります",
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

const  settingStartLabel = /^設定(\(|（[^\)]*\)|）)?:$/;
const  settingStartLabelEn = /^settings(\([^\)]*\))?:$/;
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
const  temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
const  secretLabel = "#★秘密";
const  secretLabelEn = "#secret";
const  secretExamleLabel = "#★秘密:仮";
const  secretExamleLabelEn = "#secret:example";
const  referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
const  indentRegularExpression = /^( |¥t)*/;
const  fullMatchScore = 100;
const  caseIgnoredFullMatchScore = 8;
const  partMatchScore = 5;
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
