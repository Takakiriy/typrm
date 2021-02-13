"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs")); // file system
const path_1 = __importDefault(require("path")); // or path = require("path")
const commander_1 = require("commander");
const readline_1 = __importDefault(require("readline"));
const settingStartLabel = "設定:";
const settingStartLabelEn = "settings:";
const templateLabel = "#template:";
const templateAtStartLabel = "#template-at(";
const templateAtEndLabel = "):";
const temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
const secretLabel = "#★秘密";
const secretLabelEn = "#secret";
const secretExamleLabel = "#★秘密:仮";
const secretExamleLabelEn = "#secret:example";
const referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
function main() {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const inputFilePath = yield inputPath(translate('YAML UTF-8 file path>'));
        let previousTemplateCount = 0;
        for (;;) {
            let reader = readline_1.default.createInterface({
                input: fs_1.default.createReadStream(inputFilePath),
                crlfDelay: Infinity
            });
            let isReadingSetting = false;
            let setting = {};
            let settingCount = 0;
            let previousLine = '';
            let lineNum = 0;
            let templateCount = 0;
            let errorCount = 0;
            let warningCount = 0;
            let secretLabelCount = 0;
            const lines = [];
            const keywords = [];
            try {
                for (var reader_1 = (e_1 = void 0, __asyncValues(reader)), reader_1_1; reader_1_1 = yield reader_1.next(), !reader_1_1.done;) {
                    const line1 = reader_1_1.value;
                    const line = line1;
                    lines.push(line);
                    lineNum += 1;
                    const previousIsReadingSetting = isReadingSetting;
                    // setting = ...
                    if (line.trim() === settingStartLabel) {
                        if (settingCount >= 1) {
                            onEndOfSetting(setting);
                        }
                        isReadingSetting = true;
                        setting = {};
                        settingCount += 1;
                    }
                    else if (isEndOfSetting(line, isReadingSetting)) {
                        isReadingSetting = false;
                    }
                    if (isReadingSetting) {
                        const separator = line.indexOf(':');
                        if (separator !== notFound) {
                            const key = line.substr(0, separator).trim();
                            const value = getValue(line, separator);
                            if (value !== '') {
                                setting[key] = { value, isReferenced: false, lineNum };
                            }
                            else if (key + ':' !== settingStartLabel && key + ':' !== settingStartLabelEn) {
                                isReadingSetting = false;
                            }
                        }
                    }
                    // Check if "previousLine" has "template" replaced contents.
                    const templateTag = parseTemplateTag(line);
                    if (templateTag.lineNumOffset >= 1 && templateTag.isFound) {
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
                        const checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                        const expected = getExpected(setting, templateTag.template);
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
                    if (line.indexOf(secretLabel) !== notFound || line.indexOf(secretLabelEn) !== notFound) {
                        if (line.indexOf(secretExamleLabel) === notFound && line.indexOf(secretExamleLabelEn) === notFound) {
                            if (secretLabelCount === 0) { // Because there will be many secret data.
                                console.log("");
                                console.log(`${translate('WarningLine')}: ${lineNum}`);
                                console.log(`  ${translate('This is a secret value.')}`);
                                console.log('  ' + translate `Change "${secretLabelEn}" to "${secretExamleLabelEn}".'`);
                                console.log('  ' + translate `Change "${secretLabel}" to "${secretExamleLabel}".'`);
                                console.log(`  ${translate('SettingIndex')}: ${settingCount}`);
                                warningCount += 1;
                            }
                            secretLabelCount += 1;
                        }
                    }
                    // Get titles above or following.
                    let match;
                    referPattern.lastIndex = 0;
                    while ((match = referPattern.exec(line)) !== null) {
                        const keyword = new SearchKeyword();
                        const label = match[1];
                        keyword.keyword = match[3];
                        if (label === "上記" || label === "above") {
                            keyword.startLineNum = lineNum - 1;
                            keyword.direction = Direction.Above;
                        }
                        else if (label === "下記" || label === "following") {
                            keyword.startLineNum = lineNum + 1;
                            keyword.direction = Direction.Following;
                        }
                        keywords.push(keyword);
                    }
                    previousLine = line;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (reader_1_1 && !reader_1_1.done && (_a = reader_1.return)) yield _a.call(reader_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (settingCount >= 1) {
                onEndOfSetting(setting);
            }
            // Check if there is the title above or following.
            reader = readline_1.default.createInterface({
                input: fs_1.default.createReadStream(inputFilePath),
                crlfDelay: Infinity
            });
            lineNum = 0;
            try {
                for (var reader_2 = (e_2 = void 0, __asyncValues(reader)), reader_2_1; reader_2_1 = yield reader_2.next(), !reader_2_1.done;) {
                    const line1 = reader_2_1.value;
                    const line = line1;
                    lineNum += 1;
                    for (const keyword of keywords) {
                        if (keyword.direction === Direction.Above) {
                            if (lineNum <= keyword.startLineNum) {
                                if (line.indexOf(keyword.keyword) !== notFound) {
                                    keyword.startLineNum = foundForAbove;
                                }
                            }
                        }
                        else if (keyword.direction === Direction.Following) {
                            if (lineNum >= keyword.startLineNum) {
                                if (line.indexOf(keyword.keyword) !== notFound) {
                                    keyword.startLineNum = foundForFollowing;
                                }
                            }
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (reader_2_1 && !reader_2_1.done && (_b = reader_2.return)) yield _b.call(reader_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            for (const keyword of keywords) {
                if (keyword.direction === Direction.Above) {
                    if (keyword.startLineNum !== foundForAbove) {
                        console.log('');
                        console.log(`${translate('ErrorLine')}: ${keyword.startLineNum + 1}`);
                        console.log('  ' + translate `Not found "${keyword.keyword}" above`);
                        errorCount += 1;
                    }
                }
                else if (keyword.direction === Direction.Following) {
                    if (keyword.startLineNum !== foundForFollowing) {
                        console.log('');
                        console.log(`${translate('ErrorLine')}: ${keyword.startLineNum - 1}`);
                        console.log('  ' + translate `Not found "${keyword.keyword}" following`);
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
            let loop = true;
            while (loop) {
                console.log(translate('Press Enter key to retry checking.'));
                const key = yield input(translate('The line number to change the variable value >'));
                errorCount = 0;
                if (key === 'exit') {
                    return;
                }
                else if (key !== '') {
                    const lineNum = parseInt(key);
                    const changingSettingIndex = yield getSettingIndexFromLineNum(inputFilePath, lineNum);
                    console.log(`${translate('SettingIndex')}: ${changingSettingIndex}`);
                    console.log(translate('Enter only: finish to input setting'));
                    for (;;) {
                        const keyValue = yield input(translate('key: new_value>'));
                        if (keyValue === '') {
                            break;
                        }
                        errorCount += yield changeSettingByKeyValue(inputFilePath, changingSettingIndex, keyValue);
                    }
                }
                loop = (errorCount >= 1);
            }
            // Rescan
            console.log('========================================');
            previousTemplateCount = templateCount;
            for (const key of Object.keys(setting)) {
                setting[key].isReferenced = false;
            }
        }
    });
}
// onEndOfSetting
function onEndOfSetting(setting) {
    for (const key of Object.keys(setting)) {
        if (!setting[key].isReferenced) {
            console.log(translate `Not referenced: ${key} in line ${setting[key].lineNum}`);
        }
    }
}
// getSettingIndexFromLineNum
function getSettingIndexFromLineNum(inputFilePath, targetLineNum) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const reader = readline_1.default.createInterface({
            input: fs_1.default.createReadStream(inputFilePath),
            crlfDelay: Infinity
        });
        let settingCount = 0;
        let lineNum = 0;
        try {
            for (var reader_3 = __asyncValues(reader), reader_3_1; reader_3_1 = yield reader_3.next(), !reader_3_1.done;) {
                const line1 = reader_3_1.value;
                const line = line1;
                lineNum += 1;
                if (line.trim() === settingStartLabel || line.trim() === settingStartLabelEn) {
                    settingCount += 1;
                }
                if (lineNum === targetLineNum) {
                    return settingCount;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (reader_3_1 && !reader_3_1.done && (_a = reader_3.return)) yield _a.call(reader_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return 0;
    });
}
// changeSettingByKeyValue
function changeSettingByKeyValue(inputFilePath, changingSettingIndex, keyValue) {
    return __awaiter(this, void 0, void 0, function* () {
        const separator = keyValue.indexOf(':');
        if (separator !== notFound) {
            const key = keyValue.substr(0, separator).trim();
            const value = getValue(keyValue, separator);
            return changeSetting(inputFilePath, changingSettingIndex, key, value);
        }
        else {
            return 1;
        }
    });
}
// changeSetting
function changeSetting(inputFilePath, changingSettingIndex, changingKey, changedValueAndComment) {
    var e_4, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const backUpFilePath = inputFilePath + ".backup";
        if (!fs_1.default.existsSync(backUpFilePath)) {
            fs_1.default.copyFileSync(inputFilePath, backUpFilePath);
        }
        const oldFilePath = inputFilePath;
        const newFilePath = inputFilePath + ".new";
        const writer = new WriteBuffer(fs_1.default.createWriteStream(newFilePath));
        const reader = readline_1.default.createInterface({
            input: fs_1.default.createReadStream(oldFilePath),
            crlfDelay: Infinity
        });
        const lines = [];
        let isReadingSetting = false;
        let setting = {};
        let settingCount = 0;
        let previousLine = '';
        let changedValue = getChangedValue(changedValueAndComment);
        let lineNum = 0;
        let errorCount = 0;
        let isChanging = false;
        try {
            for (var reader_4 = __asyncValues(reader), reader_4_1; reader_4_1 = yield reader_4.next(), !reader_4_1.done;) {
                const line1 = reader_4_1.value;
                const line = line1;
                lines.push(line);
                lineNum += 1;
                let output = false;
                // setting = ...
                if (line.trim() === settingStartLabel || line.trim() === settingStartLabelEn) {
                    isReadingSetting = true;
                    setting = {};
                    settingCount += 1;
                    if (changingSettingIndex === allSetting) {
                        isChanging = true;
                    }
                    else {
                        isChanging = (settingCount === changingSettingIndex);
                    }
                }
                else if (isEndOfSetting(line, isReadingSetting)) {
                    isReadingSetting = false;
                }
                if (isChanging) {
                    if (isReadingSetting) {
                        const separator = line.indexOf(':');
                        if (separator !== notFound) {
                            const key = line.substr(0, separator).trim();
                            const value = getValue(line, separator);
                            if (value !== '') {
                                setting[key] = { value, isReferenced: false, lineNum };
                            }
                            else if (key + ':' !== settingStartLabel && key + ':' !== settingStartLabelEn) {
                                isReadingSetting = false;
                            }
                            if (key === changingKey) {
                                const commentIndex = line.indexOf('#', separator);
                                let comment = '';
                                if (commentIndex !== notFound && changedValueAndComment.indexOf('#') === notFound) {
                                    comment = '  ' + line.substr(commentIndex);
                                }
                                writer.write(line.substr(0, separator + 1) + ' ' + changedValueAndComment + comment + "\n");
                                output = true;
                            }
                        }
                        // Out of settings
                    }
                    else {
                        const templateTag = parseTemplateTag(line);
                        if (templateTag.isFound) {
                            const checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                            const expected = getExpected(setting, templateTag.template);
                            if (checkingLine.indexOf(expected) !== notFound) {
                                const before = expected;
                                const changingValue = setting[changingKey].value;
                                setting[changingKey].value = changedValue;
                                const after = getExpected(setting, templateTag.template);
                                setting[changingKey].value = changingValue;
                                if (templateTag.lineNumOffset <= -1) {
                                    const aboveLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                                    writer.replaceAboveLine(templateTag.lineNumOffset, aboveLine.replace(before, after) + "\n");
                                }
                                else {
                                    writer.write(line.replace(before, after) + "\n");
                                    output = true;
                                }
                            }
                            else {
                                if (errorCount === 0) { // Since only one old value can be replaced at a time
                                    console.log('');
                                    console.log(`${translate('ErrorLine')}: ${lineNum}`);
                                    console.log(`  ${translate('Error')}: ${translate('Not found any replacing target')}`);
                                    console.log(`  ${translate('Solution')}: ${translate('Set old value at settings in the replacing file')}`);
                                    console.log(`  ${translate('Contents')}: ${line.trim()}`);
                                    console.log(`  ${translate('Expected')}: ${expected.trim()}`);
                                    console.log(`  ${translate('Template')}: ${templateTag.template.trim()}`);
                                    console.log(`  ${translate('SettingIndex')}: ${settingCount}`);
                                    errorCount += 1;
                                }
                            }
                        }
                    }
                }
                if (!output) {
                    writer.write(line + "\n");
                }
                previousLine = line;
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (reader_4_1 && !reader_4_1.done && (_a = reader_4.return)) yield _a.call(reader_4);
            }
            finally { if (e_4) throw e_4.error; }
        }
        writer.end();
        return new Promise((resolve) => {
            writer.on('finish', () => {
                fs_1.default.copyFileSync(newFilePath, inputFilePath);
                deleteFile(newFilePath);
                resolve(errorCount);
            });
        });
    });
}
// isEndOfSetting
function isEndOfSetting(line, isReadingSetting) {
    let returnValue = false;
    if (isReadingSetting) {
        const comment = line.indexOf('#');
        let leftOfComment;
        if (comment !== notFound) {
            leftOfComment = line.substr(0, line.indexOf('#')).trim();
        }
        else {
            leftOfComment = line.trim();
        }
        if (leftOfComment.indexOf(':') === notFound && leftOfComment !== '') {
            returnValue = true;
        }
        else if (leftOfComment.substr(-1) === '|') {
            returnValue = true;
        }
    }
    return returnValue;
}
// deleteFile
function deleteFile(path) {
    if (fs_1.default.existsSync(path)) {
        fs_1.default.unlinkSync(path);
    }
}
// getValue
function getValue(line, separatorIndex) {
    let value = line.substr(separatorIndex + 1).trim();
    const comment = value.indexOf('#');
    if (comment !== notFound) {
        value = value.substr(0, comment).trim();
    }
    return value;
}
// getExpected
function getExpected(setting, template) {
    let expected = template;
    for (const key of Object.keys(setting)) {
        const re = new RegExp(escapeRegularExpression(key), "gi");
        const expectedAfter = expected.replace(re, setting[key].value);
        if (expectedAfter !== expected) {
            setting[key].isReferenced = true;
        }
        expected = expectedAfter;
    }
    return expected;
}
// getChangedValue
function getChangedValue(changedValueAndComment) {
    const commentIndex = changedValueAndComment.indexOf('#');
    let changedValue;
    if (commentIndex !== notFound) {
        changedValue = changedValueAndComment.substr(0, commentIndex).trim();
    }
    else {
        changedValue = changedValueAndComment;
    }
    return changedValue;
}
// parseTemplateTag
function parseTemplateTag(line) {
    const tag = new TemplateTag();
    tag.indexInLine = line.indexOf(templateLabel);
    if (tag.indexInLine !== notFound) {
        tag.isFound = true;
        const leftOfTemplate = line.substr(0, tag.indexInLine).trim();
        tag.template = line.substr(tag.indexInLine + templateLabel.length).trim();
        if (leftOfTemplate === '') {
            tag.lineNumOffset = -1;
        }
        else {
            tag.lineNumOffset = 0;
        }
        return tag;
    }
    tag.startIndexInLine = line.indexOf(templateAtStartLabel);
    if (tag.startIndexInLine !== notFound) {
        tag.isFound = true;
        tag.endIndexInLine = line.indexOf(templateAtEndLabel, tag.startIndexInLine);
        if (tag.endIndexInLine !== notFound) {
            tag.template = line.substr(tag.endIndexInLine + templateAtEndLabel.length).trim();
            tag.lineNumOffset = parseInt(line.substring(tag.startIndexInLine + templateAtStartLabel.length, tag.endIndexInLine));
            return tag;
        }
    }
    tag.template = undefined;
    tag.lineNumOffset = 0;
    return tag;
}
// TemplateTag
class TemplateTag {
    constructor() {
        this.template = '';
        this.isFound = false;
        // template tag
        this.indexInLine = notFound;
        // template-at tag
        this.lineNumOffset = 0;
        this.startIndexInLine = notFound;
        this.endIndexInLine = notFound;
    }
}
// escapeRegularExpression
function escapeRegularExpression(expression) {
    return expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}
// StandardInputBuffer
class StandardInputBuffer {
    constructor() {
        this.inputBuffer = [];
        this.inputResolver = undefined;
        this.readlines = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.readlines.on('line', (line) => __awaiter(this, void 0, void 0, function* () {
            if (this.inputResolver) {
                this.inputResolver(line);
                this.inputResolver = undefined;
            }
            else {
                this.inputBuffer.push(line);
            }
        }));
        this.readlines.setPrompt('');
        this.readlines.prompt();
    }
    input(guide) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const nextLine = this.inputBuffer.shift();
                if (nextLine) {
                    console.log(guide + nextLine);
                    resolve(nextLine);
                }
                else {
                    process.stdout.write(guide);
                    this.inputResolver = resolve;
                }
            });
        });
    }
}
// InputOption
class InputOption {
    constructor(inputLines) {
        this.inputLines = inputLines;
        this.nextLineIndex = 0;
    }
}
const testBaseFolder = String.raw `R:\home\mem_cache\MyDoc\src\TypeScript\typrm\test_data` + '\\';
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
function input(guide) {
    return __awaiter(this, void 0, void 0, function* () {
        // Input emulation
        if (inputOption.inputLines) {
            if (inputOption.nextLineIndex < inputOption.inputLines.length) {
                const value = inputOption.inputLines[inputOption.nextLineIndex];
                inputOption.nextLineIndex += 1;
                console.log(guide + value);
                return value;
            }
        }
        // input
        return InputObject.input(guide);
    });
}
const InputObject = new StandardInputBuffer();
// inputPath
// Example: const name = await input('What is your name? ');
function inputPath(guide) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = yield input(guide);
        return pathResolve(key);
    });
}
// pathResolve
function pathResolve(path_) {
    // '/c/home' format to current OS format
    if (path_.length >= 3) {
        if (path_[0] === '/' && path_[2] === '/') {
            path_ = path_[1] + ':' + path_.substr(2);
        }
    }
    // Change separators to OS format
    path_ = path_1.default.resolve(path_);
    return path_;
}
// Setting
class Setting {
    constructor() {
        this.value = '';
        this.lineNum = 0;
        this.isReferenced = false;
    }
}
// SearchKeyword
class SearchKeyword {
    constructor() {
        this.keyword = '';
        this.startLineNum = 0;
        this.direction = Direction.Following;
    }
}
// Direction
var Direction;
(function (Direction) {
    Direction[Direction["Above"] = -1] = "Above";
    Direction[Direction["Following"] = 1] = "Following";
})(Direction || (Direction = {}));
// WriteBuffer
class WriteBuffer {
    constructor(stream) {
        this.stream = stream;
        this.lineBuffer = [];
    }
    end() {
        for (const line of this.lineBuffer) {
            this.stream.write(line);
        }
        this.stream.end();
    }
    on(event, callback) {
        this.stream.on(event, callback);
    }
    write(line) {
        this.lineBuffer.push(line);
    }
    replaceAboveLine(relativeLineNum, line) {
        this.lineBuffer[this.lineBuffer.length + relativeLineNum] = line;
    }
}
// translate
// e.g. translate('english')
// e.g. translate`price = ${price}`  // ... taggedTemplate
function translate(englishLiterals, ...values) {
    let dictionary = undefined;
    const taggedTemplate = (typeof (englishLiterals) !== 'string');
    let english = englishLiterals;
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
    let translated = english;
    if (dictionary) {
        if (english in dictionary) {
            translated = dictionary[english];
        }
    }
    if (taggedTemplate) {
        for (let i = 0; i < englishLiterals.length; i += 1) {
            translated = translated.replace('${' + String(i) + '}', String(values[i]));
        }
        translated = translated.replace('$\\{', '${');
        // Replace the escape of ${n}
        // e.g. "$\\{price} = ${price}" => "${price} = 100"
    }
    return translated;
}
const minLineNum = 0;
const maxLineNum = 999999999;
const foundForAbove = minLineNum;
const foundForFollowing = maxLineNum;
const notFound = -1;
const allSetting = 0;
const noSeparator = -1;
let locale;
const programOptions = commander_1.program.opts();
function exitFromCommander(e) {
    console.log(e.message);
}
function callMain() {
    return __awaiter(this, void 0, void 0, function* () {
        commander_1.program.version('0.1.1').exitOverride(exitFromCommander)
            .option("-l, --locale <s>")
            .option("-t, --test")
            .parse(process.argv);
        locale = Intl.NumberFormat().resolvedOptions().locale;
        if (programOptions.locale) {
            locale = programOptions.locale;
        }
        try {
            yield main();
        }
        catch (e) {
            if (programOptions.test) {
                throw e;
            }
            else {
                console.log(`ERROR: ${e.message}`);
                yield new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    });
}
callMain();
//# sourceMappingURL=typrm.js.map