import fs from "fs"; // file system
import path from "path";  // or path = require("path")
import { program, CommanderError } from 'commander'
import readline from 'readline';
const  settingStartLabel = "設定:";
const  templateLabel = "#template:";
const  templateAtStartLabel = "#template-at(";
const  templateAtEndLabel = "):";
const  temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
const  secretLabel = "#★秘密";
const  secretExamleLabel = "#★秘密:仮";
const  referPattern = /(上記|下記)「([^」]*)」/g;

async function  main() {
	const  inputFilePath = await inputPath( translate('YAML UTF-8 file path>') );
	let  previousTemplateCount = 0;
	for(;;) {
		let  reader = readline.createInterface({
			input: fs.createReadStream(inputFilePath),
			crlfDelay: Infinity
		});
		let  isReadingSetting = false;
		let  setting: Settings = {};
		let  settingCount = 0;
		let  previousLine = '';
		let  lineNum = 0;
		let  templateCount = 0;
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
			if (line.trim() === settingStartLabel) {
				if (settingCount >= 1) {
					onEndOfSetting(setting);
				}
				isReadingSetting = true;

				setting = {};
				settingCount += 1;
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
					} else if (key + ':' !== settingStartLabel) {
						isReadingSetting = false;
					}
				}
			}

			// Check if "previousLine" has "template" replaced contents.
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
				const  expected = getExpected(setting, templateTag.template, -1);

				if (checkingLine.indexOf(expected) === notFound) {
					console.log("");
					console.log(`${translate('ErrorLine')}: ${lineNum + templateTag.lineNumOffset}`);
					console.log(`  ${translate('Contents')}: ${checkingLine.trim()}`);
					console.log(`  ${translate('Expected')}: ${expected}`);
					console.log(`  ${translate('Template')}: ${templateTag.template}`);
					console.log(`  ${translate('SettingIndex')}: ${settingCount}`);
					errorCount += 1;
				}
			}

			// Check if there is not "#★Now:".
			for (let temporaryLabel of temporaryLabels) {
				if (line.toLowerCase().indexOf(temporaryLabel.toLowerCase()) !== notFound) {
					console.log("");
					console.log(`${translate('WarningLine')}: ${lineNum}`);
					console.log(`  ${translate('Contents')}: ${line.trim()}`);
					console.log(`  ${translate('SettingIndex')}: ${settingCount}`);
					warningCount += 1;
				}
			}

			// Check if there is not secret tag.
			if (line.indexOf( secretLabel ) !== notFound) {
				if (line.indexOf( secretExamleLabel ) === notFound) {
					if (secretLabelCount === 0) {  // Because there will be many secret data.
						console.log("");
						console.log(`${translate('WarningLine')}: ${lineNum}`);
						console.log(`  ${translate('This is a secret value. Change "#★秘密" to "#★秘密:仮".')}`);
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
				keyword.keyword = match[2];
				if (label === "上記") {
					keyword.startLineNum = lineNum - 1;
					keyword.direction = Direction.Above;
				} else if (label === "下記") {
					keyword.startLineNum = lineNum + 1;
					keyword.direction = Direction.Following;
				}
				keywords.push(keyword);
			}

			previousLine = line;
		}
		if (settingCount >= 1) {
			onEndOfSetting(setting);
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

		// Rescan or change a value
		let  loop = true;
		while (loop) {
			console.log(translate('Press Enter key to retry checking.'));

			const  key = await input(translate('The line number to change the variable value >'));
			errorCount = 0;
			if (key === 'exit') {
				return;
			} else if (key.substr(0,1).toUpperCase() === 'I') {
				const  changingSettingIndex = parseInt(key.substr(1));
				if (changingSettingIndex >= 1) {
					const  changingKey = await input('key>');
					const  changedValue = await input('new value>');
					errorCount= await changeSetting(inputFilePath, changingSettingIndex, changingKey, changedValue);
				}
			} else if (key === 'file') {
				await printSettingLines(inputFilePath);
				console.log('');
				const  settingFilePath = await inputPath('setting UTF-8 file path>');
				const  targetSettingsName = await input('target settings name >');
				errorCount = await changeSettings(inputFilePath, settingFilePath, targetSettingsName);
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

// onEndOfSetting
function onEndOfSetting(setting: Settings) {
	for (const key of Object.keys(setting)) {
		if (!setting[key].isReferenced) {
			console.log(translate`Not referenced: ${key} in line ${setting[key].lineNum}`);
		}
	}
}

// printSettingLines
async function  printSettingLines(inputFilePath: string) {
	const  reader = readline.createInterface({
		input: fs.createReadStream(inputFilePath),
		crlfDelay: Infinity
	});
	let  settingCount = 0;
	let  lineNum = 0;

	for await (const line1 of reader) {
		const  line: string = line1;
		lineNum += 1;

		if (line.trim() === settingStartLabel) {
			settingCount += 1;
			console.log(`${settingStartLabel} SettingIndex: ${settingCount}, Line: ${lineNum}`)
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

	for await (const line1 of reader) {
		const  line: string = line1;
		lineNum += 1;

		if (line.trim() === settingStartLabel) {
			settingCount += 1;
		}

		if (lineNum === targetLineNum) {
			return  settingCount;
		}
	}
	return  0;
}

// changeSettings
async function  changeSettings(inputFilePath: string, settingFilePath: string,
		targetSettingsName: string): Promise<number>/*errorCount*/ {

	const  settingReader = readline.createInterface({
		input: fs.createReadStream(settingFilePath),
		crlfDelay: Infinity
	});
	let  setting: Settings = {};
	let  settingCount = 0;
	let  usedSettingCount = 0;
	let  errorCount = 0;
	let  lineNum = 0;

	for await (const line1 of settingReader) {
		const  line: string = line1;
		lineNum += 1;

		// setting = ...
		if (line.trim() === settingStartLabel) {
			if (settingCount >= 1) {
				if ('Name' in setting  &&  getValue( setting['Name'].value, noSeparator)
						=== targetSettingsName) {
					errorCount += await callChangeSetting(inputFilePath, setting);
					usedSettingCount += 1;
				}
			}
			setting = {};
			settingCount += 1;
		} else {
			const  separator = line.indexOf(':');
			if (separator !== notFound) {
				const  key = line.substr(0, separator).trim();
				const  value = line.substr(separator + 1).trim();
				if (value !== '') {

					setting[key] = {value, isReferenced: false, lineNum};
				}
			}
		}
	}

	if ('Name' in setting  &&  setting['Name'].value === targetSettingsName) {
		errorCount += await callChangeSetting(inputFilePath, setting);
		usedSettingCount += 1;
	} else {
		if (usedSettingCount === 0) {
			console.log(``);
			console.log(`Error: Not found Name: ${targetSettingsName}`);
			errorCount += 1;
		}
	}
	return errorCount;
}

// callChangeSetting
async function  callChangeSetting(inputFilePath: string, setting: Settings): Promise<number>/*errorCount*/ {
	let  changingSettingIndex: number;
	if (!('SettingIndex' in setting)) {
		throw new Error("Not found SettingIndex in setting file");
	}
	const  settingIndex = getValue( setting['SettingIndex'].value, noSeparator);
	if (settingIndex.toLowerCase() === "all") {
		changingSettingIndex = allSetting;
	} else {
		changingSettingIndex = parseInt(settingIndex, 10);
	}
	delete  setting['Name'];
	delete  setting['SettingIndex'];
	let  errorCount = 0;
	for (const key of Object.keys(setting)) {
		
		errorCount += await changeSetting(
			inputFilePath, changingSettingIndex,
			key, setting[key].value
		);
	}
	return errorCount;
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

	const  backUpFilePath = inputFilePath +".backup";
	if (!fs.existsSync(backUpFilePath)) {
		fs.copyFileSync(inputFilePath, backUpFilePath);
	}

	const  oldFilePath = inputFilePath;
	const  newFilePath = inputFilePath +".new";
	const  writer = new WriteBuffer(fs.createWriteStream(newFilePath));
	const  reader = readline.createInterface({
		input: fs.createReadStream(oldFilePath),
		crlfDelay: Infinity
	});
	const  lines = [];
	let  isReadingSetting = false;
	let  setting: Settings = {};
	let  settingCount = 0;
	let  previousLine = '';
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
		if (line.trim() === settingStartLabel) {
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
					} else if (key + ':' !== settingStartLabel) {
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
				const  templateTagIndex = line.indexOf(templateLabel);
				let    templateAt = parseTemplateAtTag(line);
				if (templateTagIndex !== notFound  ||  templateAt !== undefined) {
					let  template = '';
					let  expected = '';
					if (templateTagIndex !== notFound) {
						template = line.substr(templateTagIndex + templateLabel.length).trim();
						expected = getExpected(setting, template, templateTagIndex);
					} else { // templateAt
						template = line.substr(templateAt.endIndexInLine + templateAtEndLabel.length).trim();
						expected = getExpected(setting, template, templateAt.startIndexInLine);
					}
						
					if (template.indexOf(changingKey) !== notFound) {
						const  leftOfTemplate = line.substr(0, templateTagIndex).trim();
						let  checkingLine: string;
						if (templateAt) {
							checkingLine = lines[lines.length - 1 + templateAt.lineNumOffset];
						} else if (leftOfTemplate === '') {
							checkingLine = previousLine.trim();
						} else {
							checkingLine = leftOfTemplate;
						}

						if (checkingLine.indexOf(expected) !== notFound) {
							const  changingValue = setting[changingKey].value;
							setting[changingKey].value = changedValue;
							const  before = expected;
							const  after = getExpected(setting, template, templateTagIndex);
							setting[changingKey].value = changingValue;
							if (templateAt) {
								const  aboveLine = lines[lines.length - 1 + templateAt.lineNumOffset];
								writer.replaceAboveLine(templateAt.lineNumOffset,
									aboveLine.replace(before, after)+"\n");
							} else if (leftOfTemplate === '') {
								writer.replaceAboveLine(-1,
									previousLine.replace(before, after)+"\n");
							} else {

								writer.write(line.replace(before, after) +"\n");
								output = true;
							}
						} else {
							if (errorCount === 0) { // Since only one old value can be replaced at a time
								console.log('');
								console.log(`ErrorLine: ${lineNum}`);
								console.log(`  Error: Not found any replacing target`);
								console.log(`  Solution: Set old value at setting in replacing file`);
								console.log(`  Contents: ${line.trim()}`);
								console.log(`  Expected: ${expected.trim()}`);
								console.log(`  Template: ${template.trim()}`);
								console.log(`  SettingIndex: ${settingCount}`);
								errorCount += 1;
							}
						}
					}
				}
			}
		}
		if (!output) {
			writer.write(line +"\n");
		}
		previousLine = line;
	}
	writer.end();
	return new Promise( (resolve) => {
		writer.on('finish', () => {
			fs.copyFileSync(newFilePath, inputFilePath);
			deleteFile(newFilePath);
			resolve(errorCount);
		});
	});
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

// deleteFile
function  deleteFile(path: string) {
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

// getExpected
function  getExpected(setting: Settings, template: string, templateTagIndex: number) {
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
function  parseTemplateTag(line: string): TemplateTag | undefined {
	const  tag = new TemplateTag();

	tag.indexInLine = line.indexOf(templateLabel);
	if (tag.indexInLine !== notFound) {
		tag.isFound = true;
		const  leftOfTemplate = line.substr(0, tag.indexInLine).trim();

		tag.template = line.substr(tag.indexInLine + templateLabel.length).trim();
		if (leftOfTemplate === '') {
			tag.lineNumOffset = -1;
		} else {
			tag.lineNumOffset = 0;
		}
		return  tag;
	}

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

	tag.template = undefined;
	tag.lineNumOffset = 0;
	return  tag;
}

// parseTemplateAtTag
function  parseTemplateAtTag(line: string): TemplateAtTag | undefined {
	const  tag = new TemplateAtTag();

	tag.startIndexInLine = line.indexOf(templateAtStartLabel);
	if (tag.startIndexInLine !== notFound) {
		tag.endIndexInLine =  line.indexOf(templateAtEndLabel, tag.startIndexInLine);
		if (tag.endIndexInLine !== notFound) {

			tag.lineNumOffset = parseInt(line.substring(
				tag.startIndexInLine + templateAtStartLabel.length,
				tag.endIndexInLine ));
			return  tag;
		}
	}
	return  undefined;
}

// TemplateTag
class  TemplateTag {
	template = '';
	isFound = false;

	// template tag
	indexInLine = notFound;

	// template-at tag
	lineNumOffset = 0;  
	startIndexInLine = notFound;
	endIndexInLine = notFound;
}

// TemplateAtTag
class  TemplateAtTag {
	lineNumOffset = 0;
	template = '';
	startIndexInLine = 0;
	endIndexInLine = 0;
}

// escapeRegularExpression
function  escapeRegularExpression(expression: string) {
	return  expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
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
				console.log(guide + nextLine);
				resolve(nextLine);
			} else {
				process.stdout.write(guide);
				this.inputResolver = resolve;
			}
		});
	}
}

// InputOption
class InputOption {
	inputLines: string[];
	nextLineIndex: number;

	constructor(inputLines: string[]) {
		this.inputLines = inputLines;
		this.nextLineIndex = 0;
	}
}

const  testBaseFolder = String.raw `R:\home\mem_cache\MyDoc\src\TypeScript\check_template_line\test_data`+'\\';

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

	// input
	return  InputObject.input(guide);
}
const  InputObject = new StandardInputBuffer();

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
			"This is a secret value. Change \"#★秘密\" to \"#★秘密:仮\".": "これは秘密の値です。\"#★秘密\" を \"#★秘密:仮 に変更してください\"",
			"Press Enter key to retry checking.": "Enter キーを押すと再チェックします。",
			"The line number to change the variable value >": "変更する変数値がある行番号 >",
			"Enter only: finish to input setting": "Enter のみ：設定の入力を終わる",
			"key: new_value>": "変数名: 新しい変数値>",
			"template count": "テンプレートの数",
			"in previous check": "前回のチェック",
			"Warning": "警告",
			"Error": "エラー",
			"ErrorLine": "エラー行",
			"Contents": "内容",
			"Expected": "期待",
			"Template": "雛形",
			"WarningLine": "警告行",
			"Found": "見つかったもの",
			"SettingIndex": "設定番号",
			"The parameter must be less than 0": "パラメーターは 0 より小さくしてください",
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

const  minLineNum = 0;
const  maxLineNum = 999999999;
const  foundForAbove = minLineNum;
const  foundForFollowing = maxLineNum;
const  notFound = -1;
const  allSetting = 0;
const  noSeparator = -1;
let    locale: string;
const  programOptions = program.opts();
function  exitFromCommander(e: CommanderError) {
	console.log(e.message);
}
async function  callMain() {
	program.version('0.1.1').exitOverride(exitFromCommander)
		.option("-e, --english")
		.parse(process.argv);
	
	locale = Intl.NumberFormat().resolvedOptions().locale;
	if (programOptions.english) {
		locale = "en-US";
	}
	try {
		await  main();
	} catch (e) {
		if (process.argv[2] == '--test'){
			throw e;
		} else {
			console.log( `ERROR: ${e.message}` );
			await new Promise(resolve => setTimeout(resolve, 5000));
		}
	}
}
callMain();
