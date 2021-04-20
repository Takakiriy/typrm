"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
var fs = require("fs"); // file system
var path = require("path"); // or path = require("path")
var commander_1 = require("commander");
var readline = require("readline");
var dd = console.log;
function main() {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function () {
        var inputFilePath, parentPath, previousTemplateCount, reader, isReadingSetting, setting, settingCount, lineNum, templateCount, fileTemplateTag, errorCount, warningCount, secretLabelCount, lines, keywords, reader_1, reader_1_1, line1, line, previousIsReadingSetting, separator, key, value, templateTag, checkingLine, expected, continue_, checkPassed, _i, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, checkPassed, reader_2, reader_2_1, line1, line, _c, keywords_1, keyword, e_2_1, _d, keywords_2, keyword, loop, key, lineNum_1, changingSettingIndex, keyValue, _e, _f, _g, key;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, inputPath(translate('YAML UTF-8 file path>'))];
                case 1:
                    inputFilePath = _h.sent();
                    parentPath = path.dirname(inputFilePath);
                    inputFileParentPath = parentPath;
                    previousTemplateCount = 0;
                    _h.label = 2;
                case 2:
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    isReadingSetting = false;
                    setting = {};
                    settingCount = 0;
                    lineNum = 0;
                    templateCount = 0;
                    fileTemplateTag = null;
                    errorCount = 0;
                    warningCount = 0;
                    secretLabelCount = 0;
                    lines = [];
                    keywords = [];
                    _h.label = 3;
                case 3:
                    _h.trys.push([3, 10, 11, 16]);
                    reader_1 = (e_1 = void 0, __asyncValues(reader));
                    _h.label = 4;
                case 4: return [4 /*yield*/, reader_1.next()];
                case 5:
                    if (!(reader_1_1 = _h.sent(), !reader_1_1.done)) return [3 /*break*/, 9];
                    line1 = reader_1_1.value;
                    line = line1;
                    lines.push(line);
                    lineNum += 1;
                    previousIsReadingSetting = isReadingSetting;
                    // setting = ...
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
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
                        separator = line.indexOf(':');
                        if (separator !== notFound) {
                            key = line.substr(0, separator).trim();
                            value = getValue(line, separator);
                            if (value !== '') {
                                setting[key] = { value: value, isReferenced: false, lineNum: lineNum };
                            }
                            else if (!settingStartLabel.test(key + ':') && !settingStartLabelEn.test(key + ':')) {
                                isReadingSetting = false;
                            }
                        }
                    }
                    templateTag = parseTemplateTag(line);
                    if (templateTag.lineNumOffset >= 1 && templateTag.isFound) {
                        console.log("");
                        console.log(translate('ErrorLine') + ": " + lineNum);
                        console.log("  " + translate('Contents') + ": " + line.trim());
                        console.log("  " + translate('Error') + ": " + translate('The parameter must be less than 0'));
                        templateTag.isFound = false;
                        templateCount += 1;
                        errorCount += 1;
                    }
                    if (templateTag.isFound) {
                        templateCount += 1;
                        checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                        expected = getExpectedLine(setting, templateTag.template);
                        if (checkingLine.indexOf(expected) === notFound) {
                            console.log("");
                            console.log(translate('ErrorLine') + ": " + (lineNum + templateTag.lineNumOffset));
                            console.log("  " + translate('Contents') + ": " + checkingLine.trim());
                            console.log("  " + translate('Expected') + ": " + expected);
                            console.log("  " + translate('Template') + ": " + templateTag.template);
                            console.log("  " + translate('SettingIndex') + ": " + settingCount);
                            errorCount += 1;
                        }
                    }
                    if (!fileTemplateTag) return [3 /*break*/, 7];
                    continue_ = fileTemplateTag.onReadLine(line);
                    if (!!continue_) return [3 /*break*/, 7];
                    return [4 /*yield*/, fileTemplateTag.checkTargetContents(setting, inputFilePath, lineNum)];
                case 6:
                    checkPassed = _h.sent();
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    fileTemplateTag = null;
                    _h.label = 7;
                case 7:
                    if (templateTag.label === fileTemplateLabel) {
                        fileTemplateTag = templateTag;
                    }
                    // Check if there is not "#★Now:".
                    for (_i = 0, temporaryLabels_1 = temporaryLabels; _i < temporaryLabels_1.length; _i++) {
                        temporaryLabel = temporaryLabels_1[_i];
                        if (line.toLowerCase().indexOf(temporaryLabel.toLowerCase()) !== notFound) {
                            console.log("");
                            console.log(translate('WarningLine') + ": " + lineNum);
                            console.log("  " + translate('Contents') + ": " + line.trim());
                            console.log("  " + translate('SettingIndex') + ": " + settingCount);
                            warningCount += 1;
                        }
                    }
                    // Check if there is not secret tag.
                    if (line.indexOf(secretLabel) !== notFound || line.indexOf(secretLabelEn) !== notFound) {
                        if (line.indexOf(secretExamleLabel) === notFound && line.indexOf(secretExamleLabelEn) === notFound) {
                            if (secretLabelCount === 0) { // Because there will be many secret data.
                                console.log("");
                                console.log(translate('WarningLine') + ": " + lineNum);
                                console.log("  " + translate('This is a secret value.'));
                                console.log('  ' + translate(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Change \"", "\" to \"", "\".'"], ["Change \"", "\" to \"", "\".'"])), secretLabelEn, secretExamleLabelEn));
                                console.log('  ' + translate(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Change \"", "\" to \"", "\".'"], ["Change \"", "\" to \"", "\".'"])), secretLabel, secretExamleLabel));
                                console.log("  " + translate('SettingIndex') + ": " + settingCount);
                                warningCount += 1;
                            }
                            secretLabelCount += 1;
                        }
                    }
                    match = void 0;
                    referPattern.lastIndex = 0;
                    while ((match = referPattern.exec(line)) !== null) {
                        keyword = new SearchKeyword();
                        label = match[1];
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
                    _h.label = 8;
                case 8: return [3 /*break*/, 4];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _h.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _h.trys.push([11, , 14, 15]);
                    if (!(reader_1_1 && !reader_1_1.done && (_a = reader_1["return"]))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _a.call(reader_1)];
                case 12:
                    _h.sent();
                    _h.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16:
                    if (settingCount >= 1) {
                        onEndOfSetting(setting);
                    }
                    if (!fileTemplateTag) return [3 /*break*/, 18];
                    fileTemplateTag.onReadLine(''); // Cut indent
                    return [4 /*yield*/, fileTemplateTag.checkTargetContents(setting, inputFilePath, lineNum)];
                case 17:
                    checkPassed = _h.sent();
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    _h.label = 18;
                case 18:
                    // Check if there is the title above or following.
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    _h.label = 19;
                case 19:
                    _h.trys.push([19, 24, 25, 30]);
                    reader_2 = (e_2 = void 0, __asyncValues(reader));
                    _h.label = 20;
                case 20: return [4 /*yield*/, reader_2.next()];
                case 21:
                    if (!(reader_2_1 = _h.sent(), !reader_2_1.done)) return [3 /*break*/, 23];
                    line1 = reader_2_1.value;
                    line = line1;
                    lineNum += 1;
                    for (_c = 0, keywords_1 = keywords; _c < keywords_1.length; _c++) {
                        keyword = keywords_1[_c];
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
                    _h.label = 22;
                case 22: return [3 /*break*/, 20];
                case 23: return [3 /*break*/, 30];
                case 24:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 30];
                case 25:
                    _h.trys.push([25, , 28, 29]);
                    if (!(reader_2_1 && !reader_2_1.done && (_b = reader_2["return"]))) return [3 /*break*/, 27];
                    return [4 /*yield*/, _b.call(reader_2)];
                case 26:
                    _h.sent();
                    _h.label = 27;
                case 27: return [3 /*break*/, 29];
                case 28:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 29: return [7 /*endfinally*/];
                case 30:
                    for (_d = 0, keywords_2 = keywords; _d < keywords_2.length; _d++) {
                        keyword = keywords_2[_d];
                        if (keyword.direction === Direction.Above) {
                            if (keyword.startLineNum !== foundForAbove) {
                                console.log('');
                                console.log(translate('ErrorLine') + ": " + (keyword.startLineNum + 1));
                                console.log('  ' + translate(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Not found \"", "\" above"], ["Not found \"", "\" above"])), keyword.keyword));
                                errorCount += 1;
                            }
                        }
                        else if (keyword.direction === Direction.Following) {
                            if (keyword.startLineNum !== foundForFollowing) {
                                console.log('');
                                console.log(translate('ErrorLine') + ": " + (keyword.startLineNum - 1));
                                console.log('  ' + translate(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Not found \"", "\" following"], ["Not found \"", "\" following"])), keyword.keyword));
                                errorCount += 1;
                            }
                        }
                    }
                    // Show the result
                    console.log('');
                    console.log(translate('Warning') + ": " + warningCount + ", " + translate('Error') + ": " + errorCount);
                    if (previousTemplateCount) {
                        console.log(translate('template count') + " = " + previousTemplateCount + " (" + translate('in previous check') + ")");
                    }
                    console.log(translate('template count') + " = " + templateCount);
                    loop = true;
                    _h.label = 31;
                case 31:
                    if (!loop) return [3 /*break*/, 40];
                    console.log(translate('Press Enter key to retry checking.'));
                    return [4 /*yield*/, input(translate('The line number to change the variable value >'))];
                case 32:
                    key = _h.sent();
                    errorCount = 0;
                    if (!(key === 'exit')) return [3 /*break*/, 33];
                    return [2 /*return*/];
                case 33:
                    if (!(key !== '')) return [3 /*break*/, 39];
                    lineNum_1 = parseInt(key);
                    return [4 /*yield*/, getSettingIndexFromLineNum(inputFilePath, lineNum_1)];
                case 34:
                    changingSettingIndex = _h.sent();
                    console.log(translate('SettingIndex') + ": " + changingSettingIndex);
                    console.log(translate('Enter only: finish to input setting'));
                    _h.label = 35;
                case 35: return [4 /*yield*/, input(translate('key: new_value>'))];
                case 36:
                    keyValue = _h.sent();
                    if (keyValue === '') {
                        return [3 /*break*/, 39];
                    }
                    _e = errorCount;
                    return [4 /*yield*/, changeSettingByKeyValue(inputFilePath, changingSettingIndex, keyValue)];
                case 37:
                    errorCount = _e + _h.sent();
                    _h.label = 38;
                case 38: return [3 /*break*/, 35];
                case 39:
                    loop = (errorCount >= 1);
                    return [3 /*break*/, 31];
                case 40:
                    // Rescan
                    console.log('========================================');
                    previousTemplateCount = templateCount;
                    for (_f = 0, _g = Object.keys(setting); _f < _g.length; _f++) {
                        key = _g[_f];
                        setting[key].isReferenced = false;
                    }
                    _h.label = 41;
                case 41: return [3 /*break*/, 2];
                case 42: return [2 /*return*/];
            }
        });
    });
}
// changeSettingByKeyValue
function changeSettingByKeyValue(inputFilePath, changingSettingIndex, keyValue) {
    return __awaiter(this, void 0, void 0, function () {
        var separator, key, value;
        return __generator(this, function (_a) {
            separator = keyValue.indexOf(':');
            if (separator !== notFound) {
                key = keyValue.substr(0, separator).trim();
                value = getValue(keyValue, separator);
                return [2 /*return*/, changeSetting(inputFilePath, changingSettingIndex, key, value)];
            }
            else {
                return [2 /*return*/, 1];
            }
            return [2 /*return*/];
        });
    });
}
// changeSetting
function changeSetting(inputFilePath, changingSettingIndex, changingKey, changedValueAndComment) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function () {
        var backUpFilePath, oldFilePath, newFilePath, writer, reader, lines, isReadingSetting, setting, settingCount, changedValue, lineNum, errorCount, isChanging, reader_3, reader_3_1, line1, line, output, separator, key, value, commentIndex, comment, templateTag, checkingLine, expected, changed, before, after, aboveLine, e_3_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    backUpFilePath = inputFilePath + ".backup";
                    if (!fs.existsSync(backUpFilePath)) {
                        fs.copyFileSync(inputFilePath, backUpFilePath);
                    }
                    oldFilePath = inputFilePath;
                    newFilePath = inputFilePath + ".new";
                    writer = new WriteBuffer(fs.createWriteStream(newFilePath));
                    reader = readline.createInterface({
                        input: fs.createReadStream(oldFilePath),
                        crlfDelay: Infinity
                    });
                    lines = [];
                    isReadingSetting = false;
                    setting = {};
                    settingCount = 0;
                    changedValue = getChangedValue(changedValueAndComment);
                    lineNum = 0;
                    errorCount = 0;
                    isChanging = false;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    reader_3 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_3.next()];
                case 3:
                    if (!(reader_3_1 = _b.sent(), !reader_3_1.done)) return [3 /*break*/, 5];
                    line1 = reader_3_1.value;
                    line = line1;
                    lines.push(line);
                    lineNum += 1;
                    output = false;
                    // setting = ...
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
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
                            separator = line.indexOf(':');
                            if (separator !== notFound) {
                                key = line.substr(0, separator).trim();
                                value = getValue(line, separator);
                                if (value !== '') {
                                    setting[key] = { value: value, isReferenced: false, lineNum: lineNum };
                                }
                                else if (!settingStartLabel.test(key + ':') && !settingStartLabelEn.test(key + ':')) {
                                    isReadingSetting = false;
                                }
                                if (key === changingKey) {
                                    commentIndex = line.indexOf('#', separator);
                                    comment = '';
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
                            templateTag = parseTemplateTag(line);
                            if (templateTag.isFound) {
                                checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                                expected = getExpectedLine(setting, templateTag.template);
                                changed = getChangedLine(setting, templateTag.template, changingKey, changedValue);
                                if (checkingLine.indexOf(expected) !== notFound) {
                                    before = expected;
                                    after = changed;
                                    if (templateTag.lineNumOffset <= -1) {
                                        aboveLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                                        writer.replaceAboveLine(templateTag.lineNumOffset, aboveLine.replace(before, after) + "\n");
                                    }
                                    else {
                                        writer.write(line.replace(before, after) + "\n");
                                        output = true;
                                    }
                                }
                                else if (checkingLine.indexOf(changed) !== notFound) {
                                    // Do nothing
                                }
                                else {
                                    if (errorCount === 0) { // Since only one old value can be replaced at a time
                                        console.log('');
                                        console.log(translate('ErrorLine') + ": " + lineNum);
                                        console.log("  " + translate('Error') + ": " + translate('Not found any replacing target'));
                                        console.log("  " + translate('Solution') + ": " + translate('Set old value at settings in the replacing file'));
                                        console.log("  " + translate('Contents') + ": " + line.trim());
                                        console.log("  " + translate('Expected') + ": " + expected.trim());
                                        console.log("  " + translate('Template') + ": " + templateTag.template.trim());
                                        console.log("  " + translate('SettingIndex') + ": " + settingCount);
                                        errorCount += 1;
                                    }
                                }
                            }
                        }
                    }
                    if (!output) {
                        writer.write(line + "\n");
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_3_1 = _b.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(reader_3_1 && !reader_3_1.done && (_a = reader_3["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_3)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    writer.end();
                    return [2 /*return*/, new Promise(function (resolve) {
                            writer.on('finish', function () {
                                fs.copyFileSync(newFilePath, inputFilePath);
                                deleteFile(newFilePath);
                                resolve(errorCount);
                            });
                        })];
            }
        });
    });
}
// TemplateTag
var TemplateTag = /** @class */ (function () {
    function TemplateTag() {
        this.label = '';
        this.template = '';
        this.isFound = false;
        // template tag
        this.indexInLine = notFound;
        // template-at tag
        this.lineNumOffset = 0;
        this.startIndexInLine = notFound;
        this.endIndexInLine = notFound;
        // for file-template tag
        this.templateLines = [];
        this.indentAtTag = '';
        this.minIndentLength = 0;
    }
    TemplateTag.prototype.onFileTemplateTagReading = function (line) {
        this.indentAtTag = indentRegularExpression.exec(line)[0];
        this.minIndentLength = maxNumber;
    };
    TemplateTag.prototype.onReadLine = function (line) {
        var _this = this;
        var currentIndent = indentRegularExpression.exec(line)[0];
        var readingNext = true;
        if (currentIndent.length > this.indentAtTag.length && line.startsWith(this.indentAtTag)) {
            this.templateLines.push(line);
            this.minIndentLength = Math.min(this.minIndentLength, currentIndent.length);
        }
        else {
            this.templateLines = this.templateLines.map(function (line) { return (line.substr(_this.minIndentLength)); });
            readingNext = false;
        }
        return readingNext;
    };
    TemplateTag.prototype.checkTargetContents = function (setting, inputFilePath, templateEndLineNum) {
        var e_4, _a;
        return __awaiter(this, void 0, void 0, function () {
            var parentPath, targetFilePath, targetFileReader, expectedFirstLine, templateLineIndex, targetLineNum, errorTemplateLineIndex, errorTargetLineNum, errorContents, errorExpected, errorTemplate, indent, same, targetFileReader_1, targetFileReader_1_1, line1, targetLine, indentLength, expected, e_4_1, templateLineNum;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parentPath = path.dirname(inputFilePath);
                        targetFilePath = getFullPath(getExpectedLine(setting, this.template), parentPath);
                        if (!fs.existsSync(targetFilePath)) {
                            console.log("");
                            console.log("Error: " + translate('NotFound') + ": " + targetFilePath);
                            return [2 /*return*/, false];
                        }
                        targetFileReader = readline.createInterface({
                            input: fs.createReadStream(targetFilePath),
                            crlfDelay: Infinity
                        });
                        if (this.templateLines.length === 0) {
                            return [2 /*return*/, false];
                        }
                        expectedFirstLine = getExpectedLineInFileTemplate(setting, this.templateLines[0]);
                        templateLineIndex = 0;
                        targetLineNum = 0;
                        errorTemplateLineIndex = 0;
                        errorTargetLineNum = 0;
                        errorContents = '';
                        errorExpected = '';
                        errorTemplate = '';
                        indent = '';
                        same = false;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        targetFileReader_1 = __asyncValues(targetFileReader);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, targetFileReader_1.next()];
                    case 3:
                        if (!(targetFileReader_1_1 = _b.sent(), !targetFileReader_1_1.done)) return [3 /*break*/, 5];
                        line1 = targetFileReader_1_1.value;
                        targetLine = line1;
                        targetLineNum += 1;
                        if (templateLineIndex === 0) {
                            indentLength = targetLine.indexOf(expectedFirstLine);
                            if (indentLength === notFound) {
                                same = false;
                            }
                            else {
                                same = true;
                                indent = targetLine.substr(0, indentLength);
                            }
                        }
                        else { // lineIndex >= 1
                            expected = getExpectedLineInFileTemplate(setting, this.templateLines[templateLineIndex]);
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
                                return [3 /*break*/, 5];
                            }
                        }
                        else {
                            templateLineIndex = 0;
                        }
                        _b.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_4_1 = _b.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _b.trys.push([7, , 10, 11]);
                        if (!(targetFileReader_1_1 && !targetFileReader_1_1.done && (_a = targetFileReader_1["return"]))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _a.call(targetFileReader_1)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_4) throw e_4.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        if (!same) {
                            templateLineNum = templateEndLineNum - this.templateLines.length + errorTemplateLineIndex;
                            if (errorContents === '') {
                                errorContents = '(Not found)';
                                errorExpected = expectedFirstLine;
                                errorTemplate = this.templateLines[0];
                            }
                            console.log("");
                            console.log(translate('typrmFile') + ": " + getTestable(inputFilePath) + ":" + templateLineNum);
                            console.log(translate('ErrorFile') + ": " + getTestable(targetFilePath) + ":" + errorTargetLineNum);
                            console.log("  Contents: " + errorContents);
                            console.log("  Expected: " + errorExpected);
                            console.log("  Template: " + errorTemplate);
                        }
                        return [2 /*return*/, same];
                }
            });
        });
    };
    return TemplateTag;
}());
// onEndOfSetting
function onEndOfSetting(setting) {
    for (var _i = 0, _a = Object.keys(setting); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!setting[key].isReferenced) {
            console.log(translate(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Not referenced: ", " in line ", ""], ["Not referenced: ", " in line ", ""])), key, setting[key].lineNum));
        }
    }
}
// getSettingIndexFromLineNum
function getSettingIndexFromLineNum(inputFilePath, targetLineNum) {
    var e_5, _a;
    return __awaiter(this, void 0, void 0, function () {
        var reader, settingCount, lineNum, reader_4, reader_4_1, line1, line, e_5_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    settingCount = 0;
                    lineNum = 0;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    reader_4 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_4.next()];
                case 3:
                    if (!(reader_4_1 = _b.sent(), !reader_4_1.done)) return [3 /*break*/, 5];
                    line1 = reader_4_1.value;
                    line = line1;
                    lineNum += 1;
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                        settingCount += 1;
                    }
                    if (lineNum === targetLineNum) {
                        return [2 /*return*/, settingCount];
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_5_1 = _b.sent();
                    e_5 = { error: e_5_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(reader_4_1 && !reader_4_1.done && (_a = reader_4["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_4)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_5) throw e_5.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, 0];
            }
        });
    });
}
// isEndOfSetting
function isEndOfSetting(line, isReadingSetting) {
    var returnValue = false;
    if (isReadingSetting) {
        var comment = line.indexOf('#');
        var leftOfComment = void 0;
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
// getFullPath
function getFullPath(relativePath, basePath) {
    var fullPath = '';
    if (relativePath.substr(0, 1) === '/') {
        fullPath = relativePath;
    }
    else if (relativePath.substr(0, 1) === '~') {
        fullPath = relativePath.replace('~', process.env.HOME);
    }
    else {
        fullPath = path.join(basePath, relativePath);
    }
    return fullPath;
}
// deleteFile
function deleteFile(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// getValue
function getValue(line, separatorIndex) {
    var value = line.substr(separatorIndex + 1).trim();
    var comment = value.indexOf('#');
    if (comment !== notFound) {
        value = value.substr(0, comment).trim();
    }
    return value;
}
// getExpectedLine
function getExpectedLine(setting, template) {
    var expected = template;
    for (var _i = 0, _a = Object.keys(setting); _i < _a.length; _i++) {
        var key = _a[_i];
        var re = new RegExp(escapeRegularExpression(key), "gi");
        var expectedAfter = expected.replace(re, setting[key].value);
        if (expectedAfter !== expected) {
            setting[key].isReferenced = true;
        }
        expected = expectedAfter;
    }
    return expected;
}
// getExpectedLineInFileTemplate
function getExpectedLineInFileTemplate(setting, template) {
    var expected = getExpectedLine(setting, template);
    var templateIndex = expected.indexOf(templateLabel);
    if (templateIndex !== notFound) {
        expected = expected.substr(0, templateIndex);
        expected = expected.trimRight();
    }
    return expected;
}
// getChangedLine
function getChangedLine(setting, template, changingKey, changedValue) {
    var changedLine = '';
    if (changingKey in setting) {
        var changingValue = setting[changingKey].value;
        setting[changingKey].value = changedValue;
        changedLine = getExpectedLine(setting, template);
        setting[changingKey].value = changingValue;
    }
    else {
        changedLine = getExpectedLine(setting, template);
    }
    return changedLine;
}
// getChangedValue
function getChangedValue(changedValueAndComment) {
    var commentIndex = changedValueAndComment.indexOf('#');
    var changedValue;
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
    var tag = new TemplateTag();
    tag.label = templateLabel;
    tag.indexInLine = line.indexOf(templateLabel);
    if (tag.indexInLine === notFound) {
        tag.label = fileTemplateLabel;
        tag.indexInLine = line.indexOf(fileTemplateLabel);
    }
    if (tag.indexInLine !== notFound) {
        tag.isFound = true;
        var leftOfTemplate = line.substr(0, tag.indexInLine).trim();
        if (tag.label === fileTemplateLabel) {
            tag.onFileTemplateTagReading(line);
        }
        tag.template = line.substr(tag.indexInLine + tag.label.length).trim();
        if (leftOfTemplate === '') {
            tag.lineNumOffset = -1;
        }
        else {
            tag.lineNumOffset = 0;
        }
        return tag;
    }
    tag.label = templateAtStartLabel;
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
    tag.label = '';
    tag.template = '';
    tag.lineNumOffset = 0;
    return tag;
}
// escapeRegularExpression
function escapeRegularExpression(expression) {
    return expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}
// StandardInputBuffer
var StandardInputBuffer = /** @class */ (function () {
    function StandardInputBuffer() {
        var _this = this;
        this.inputBuffer = [];
        this.inputResolver = undefined;
        this.readlines = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.readlines.on('line', function (line) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.inputResolver) {
                    this.inputResolver(line);
                    this.inputResolver = undefined;
                }
                else {
                    this.inputBuffer.push(line);
                }
                return [2 /*return*/];
            });
        }); });
        this.readlines.setPrompt('');
        this.readlines.prompt();
    }
    StandardInputBuffer.prototype.input = function (guide) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var nextLine = _this.inputBuffer.shift();
                        if (nextLine) {
                            console.log(guide + nextLine);
                            resolve(nextLine);
                        }
                        else {
                            process.stdout.write(guide);
                            _this.inputResolver = resolve;
                        }
                    })];
            });
        });
    };
    StandardInputBuffer.prototype.close = function () {
        this.readlines.close();
    };
    return StandardInputBuffer;
}());
// InputOption
var InputOption = /** @class */ (function () {
    function InputOption(inputLines) {
        this.inputLines = inputLines;
        this.nextLineIndex = 0;
        this.nextParameterIndex = 2;
    }
    return InputOption;
}());
var testBaseFolder = String.raw(templateObject_6 || (templateObject_6 = __makeTemplateObject(["R:homemem_cacheMyDocsrcTypeScript\typrm\test_data"], ["R:\\home\\mem_cache\\MyDoc\\src\\TypeScript\\typrm\\test_data"]))) + '\\';
// inputOption
var inputOption = new InputOption([
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
    return __awaiter(this, void 0, void 0, function () {
        var value, value;
        return __generator(this, function (_a) {
            // Input emulation
            if (inputOption.inputLines) {
                if (inputOption.nextLineIndex < inputOption.inputLines.length) {
                    value = inputOption.inputLines[inputOption.nextLineIndex];
                    inputOption.nextLineIndex += 1;
                    console.log(guide + value);
                    return [2 /*return*/, value];
                }
            }
            // Read the starting process parameters
            while (inputOption.nextParameterIndex < process.argv.length) {
                value = process.argv[inputOption.nextParameterIndex];
                inputOption.nextParameterIndex += 1;
                if (value.substr(0, 1) !== '-') {
                    console.log(guide + value);
                    return [2 /*return*/, value];
                }
                if (value !== '--test') {
                    inputOption.nextParameterIndex += 1;
                }
            }
            // input
            return [2 /*return*/, InputObject.input(guide)];
        });
    });
}
var InputObject = new StandardInputBuffer();
// inputPath
// Example: const name = await input('What is your name? ');
function inputPath(guide) {
    return __awaiter(this, void 0, void 0, function () {
        var key;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, input(guide)];
                case 1:
                    key = _a.sent();
                    return [2 /*return*/, pathResolve(key)];
            }
        });
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
    path_ = path.resolve(path_);
    return path_;
}
// Setting
var Setting = /** @class */ (function () {
    function Setting() {
        this.value = '';
        this.lineNum = 0;
        this.isReferenced = false;
    }
    return Setting;
}());
// SearchKeyword
var SearchKeyword = /** @class */ (function () {
    function SearchKeyword() {
        this.keyword = '';
        this.startLineNum = 0;
        this.direction = Direction.Following;
    }
    return SearchKeyword;
}());
// Direction
var Direction;
(function (Direction) {
    Direction[Direction["Above"] = -1] = "Above";
    Direction[Direction["Following"] = 1] = "Following";
})(Direction || (Direction = {}));
// WriteBuffer
var WriteBuffer = /** @class */ (function () {
    function WriteBuffer(stream) {
        this.stream = stream;
        this.lineBuffer = [];
    }
    WriteBuffer.prototype.end = function () {
        for (var _i = 0, _a = this.lineBuffer; _i < _a.length; _i++) {
            var line = _a[_i];
            this.stream.write(line);
        }
        this.stream.end();
    };
    WriteBuffer.prototype.on = function (event, callback) {
        this.stream.on(event, callback);
    };
    WriteBuffer.prototype.write = function (line) {
        this.lineBuffer.push(line);
    };
    WriteBuffer.prototype.replaceAboveLine = function (relativeLineNum, line) {
        this.lineBuffer[this.lineBuffer.length + relativeLineNum] = line;
    };
    return WriteBuffer;
}());
// translate
// e.g. translate('english')
// e.g. translate`price = ${price}`  // ... taggedTemplate
function translate(englishLiterals) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    var dictionary = undefined;
    var taggedTemplate = (typeof (englishLiterals) !== 'string');
    var english = englishLiterals;
    if (taggedTemplate) {
        english = '';
        for (var i = 0; i < englishLiterals.length; i += 1) {
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
            "Not referenced: ${0} in line ${1}": "参照されていません： ${0} （${1}行目）"
        };
    }
    var translated = english;
    if (dictionary) {
        if (english in dictionary) {
            translated = dictionary[english];
        }
    }
    if (taggedTemplate) {
        for (var i = 0; i < englishLiterals.length; i += 1) {
            translated = translated.replace('${' + String(i) + '}', String(values[i]));
        }
        translated = translated.replace('$\\{', '${');
        // Replace the escape of ${n}
        // e.g. "$\\{price} = ${price}" => "${price} = 100"
    }
    return translated;
}
var settingStartLabel = /^設定(\(|（[^\)]*\)|）)?:$/;
var settingStartLabelEn = /^settings(\([^\)]*\))?:$/;
var templateLabel = "#template:";
var templateAtStartLabel = "#template-at(";
var templateAtEndLabel = "):";
var fileTemplateLabel = "#file-template:";
var temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
var secretLabel = "#★秘密";
var secretLabelEn = "#secret";
var secretExamleLabel = "#★秘密:仮";
var secretExamleLabelEn = "#secret:example";
var referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
var indentRegularExpression = /^( |¥t)*/;
var minLineNum = 0;
var maxLineNum = 999999999;
var maxNumber = 999999999;
var foundForAbove = minLineNum;
var foundForFollowing = maxLineNum;
var notFound = -1;
var allSetting = 0;
var noSeparator = -1;
var locale;
var programOptions = commander_1.program.opts();
function exitFromCommander(e) {
    console.log(e.message);
}
function getTestable(path) {
    if (programOptions.test) {
        if (path.startsWith(inputFileParentPath)) {
            return '${inputFileParentPath}' + path.substr(inputFileParentPath.length);
        }
        else {
            return path;
        }
    }
    else {
        return path;
    }
}
var inputFileParentPath = '';
function callMain() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commander_1.program.version('0.1.1').exitOverride(exitFromCommander)
                        .option("-l, --locale <s>")
                        .option("-t, --test")
                        .parse(process.argv);
                    locale = Intl.NumberFormat().resolvedOptions().locale;
                    if (programOptions.locale) {
                        locale = programOptions.locale;
                    }
                    return [4 /*yield*/, main()["catch"](function (e) {
                            if (programOptions.test) {
                                throw e;
                            }
                            else {
                                console.log("ERROR: " + e.message);
                                var timeOver = new Date();
                                timeOver.setSeconds(timeOver.getSeconds() + 5);
                                while ((new Date()).getTime() < timeOver.getTime()) {
                                }
                            }
                        })["finally"](function () {
                            InputObject.close();
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
callMain();
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVCQUF5QixDQUFDLGNBQWM7QUFDeEMsMkJBQTZCLENBQUUsNEJBQTRCO0FBQzNELHVDQUFvRDtBQUNwRCxtQ0FBcUM7QUFFckMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUV2QixTQUFnQixJQUFJOzs7Ozs7d0JBQ0kscUJBQU0sU0FBUyxDQUFFLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFFLEVBQUE7O29CQUFyRSxhQUFhLEdBQUcsU0FBcUQ7b0JBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoRCxtQkFBbUIsR0FBRyxVQUFVLENBQUM7b0JBQzVCLHFCQUFxQixHQUFHLENBQUMsQ0FBQzs7O29CQUV6QixNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzt3QkFDdEMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7d0JBQ3pDLFNBQVMsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7b0JBQ0UsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO29CQUN6QixPQUFPLEdBQWEsRUFBRSxDQUFDO29CQUN2QixZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLGVBQWUsR0FBdUIsSUFBSSxDQUFDO29CQUMzQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNmLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFnQixHQUFHLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxRQUFRLEdBQW9CLEVBQUUsQ0FBQzs7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QixDQUFDO3lCQUN0RCxNQUFNLENBQUMsa0JBQWtCLENBQUM7eUJBQzFCLE1BQU0sQ0FBQyxZQUFZLENBQUM7eUJBQ3BCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXRCLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUN0RCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUU7d0JBQzFCLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO3FCQUMvQjtvQkFFRCxxQkFBTyxJQUFJLEVBQUUsQ0FDWCxPQUFLLENBQUEsQ0FBRSxVQUFDLENBQUM7NEJBQ1QsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFO2dDQUN4QixNQUFNLENBQUMsQ0FBQzs2QkFDUjtpQ0FBTTtnQ0FFTixPQUFPLENBQUMsR0FBRyxDQUFFLFlBQVUsQ0FBQyxDQUFDLE9BQVMsQ0FBRSxDQUFDO2dDQUNyQyxJQUFPLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO2dDQUM3QixRQUFRLENBQUMsVUFBVSxDQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUUsQ0FBQztnQ0FFakQsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUU7aUNBQ25EOzZCQUNEO3dCQUNGLENBQUMsQ0FBQyxDQUNELFNBQU8sQ0FBQSxDQUFDOzRCQUNSLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDckIsQ0FBQyxDQUFDLEVBQUE7O29CQWhCSCxTQWdCRyxDQUFDOzs7OztDQUNKO0FBQ0QsUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7IC8vIGZpbGUgc3lzdGVtXHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjsgIC8vIG9yIHBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxyXG5pbXBvcnQgeyBwcm9ncmFtLCBDb21tYW5kZXJFcnJvciB9IGZyb20gJ2NvbW1hbmRlcic7XHJcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcclxuaW1wb3J0IHsgRGVmYXVsdERlc2VyaWFsaXplciB9IGZyb20gJ3Y4JztcclxuY29uc3QgZGQgPSBjb25zb2xlLmxvZztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uICBtYWluKCkge1xyXG5cdGNvbnN0ICBpbnB1dEZpbGVQYXRoID0gYXdhaXQgaW5wdXRQYXRoKCB0cmFuc2xhdGUoJ1lBTUwgVVRGLTggZmlsZSBwYXRoPicpICk7XHJcblx0Y29uc3QgIHBhcmVudFBhdGggPSBwYXRoLmRpcm5hbWUoaW5wdXRGaWxlUGF0aCk7XHJcblx0aW5wdXRGaWxlUGFyZW50UGF0aCA9IHBhcmVudFBhdGg7XHJcblx0bGV0ICBwcmV2aW91c1RlbXBsYXRlQ291bnQgPSAwO1xyXG5cdGZvcig7Oykge1xyXG5cdFx0bGV0ICByZWFkZXIgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShpbnB1dEZpbGVQYXRoKSxcclxuXHRcdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdFx0fSk7XHJcblx0XHRsZXQgIGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdGxldCAgc2V0dGluZzogU2V0dGluZ3MgPSB7fTtcclxuXHRcdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRcdGxldCAgbGluZU51bSA9IDA7XHJcblx0XHRsZXQgIHRlbXBsYXRlQ291bnQgPSAwO1xyXG5cdFx0bGV0ICBmaWxlVGVtcGxhdGVUYWc6IFRlbXBsYXRlVGFnIHwgbnVsbCA9IG51bGw7XHJcblx0XHRsZXQgIGVycm9yQ291bnQgPSAwO1xyXG5cdFx0bGV0ICB3YXJuaW5nQ291bnQgPSAwO1xyXG5cdFx0bGV0ICBzZWNyZXRMYWJlbENvdW50ID0gMDtcclxuXHRcdGNvbnN0ICBsaW5lcyA9IFtdO1xyXG5cdFx0Y29uc3QgIGtleXdvcmRzOiBTZWFyY2hLZXl3b3JkW10gPSBbXTtcclxuXHJcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRcdGxpbmVzLnB1c2gobGluZSk7XHJcblx0XHRcdGxpbmVOdW0gKz0gMTtcclxuXHRcdFx0Y29uc3QgIHByZXZpb3VzSXNSZWFkaW5nU2V0dGluZyA9IGlzUmVhZGluZ1NldHRpbmc7XHJcblxyXG5cdFx0XHQvLyBzZXR0aW5nID0gLi4uXHJcblx0XHRcdGlmIChzZXR0aW5nU3RhcnRMYWJlbC50ZXN0KGxpbmUudHJpbSgpKSB8fCBzZXR0aW5nU3RhcnRMYWJlbEVuLnRlc3QobGluZS50cmltKCkpKSB7XHJcblx0XHRcdFx0aWYgKHNldHRpbmdDb3VudCA+PSAxKSB7XHJcblx0XHRcdFx0XHRvbkVuZE9mU2V0dGluZyhzZXR0aW5nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IHRydWU7XHJcblxyXG5cdFx0XHRcdHNldHRpbmcgPSB7fTtcclxuXHRcdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdFx0fSBlbHNlIGlmIChpc0VuZE9mU2V0dGluZyhsaW5lLCBpc1JlYWRpbmdTZXR0aW5nKSkge1xyXG5cdFx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaXNSZWFkaW5nU2V0dGluZykge1xyXG5cdFx0XHRcdGNvbnN0ICBzZXBhcmF0b3IgPSBsaW5lLmluZGV4T2YoJzonKTtcclxuXHRcdFx0XHRpZiAoc2VwYXJhdG9yICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgIGtleSA9IGxpbmUuc3Vic3RyKDAsIHNlcGFyYXRvcikudHJpbSgpO1xyXG5cdFx0XHRcdFx0Y29uc3QgIHZhbHVlID0gZ2V0VmFsdWUobGluZSwgc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gJycpIHtcclxuXHJcblx0XHRcdFx0XHRcdHNldHRpbmdba2V5XSA9IHt2YWx1ZSwgaXNSZWZlcmVuY2VkOiBmYWxzZSwgbGluZU51bX07XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKCFzZXR0aW5nU3RhcnRMYWJlbC50ZXN0KGtleSArICc6JykgICYmICAhc2V0dGluZ1N0YXJ0TGFiZWxFbi50ZXN0KGtleSArICc6JykpIHtcclxuXHRcdFx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgaWYgcHJldmlvdXMgbGluZSBoYXMgXCJ0ZW1wbGF0ZVwiIHJlcGxhY2VkIGNvbnRlbnRzLlxyXG5cdFx0XHRjb25zdCAgdGVtcGxhdGVUYWcgPSBwYXJzZVRlbXBsYXRlVGFnKGxpbmUpO1xyXG5cdFx0XHRpZiAodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCA+PSAxICAmJiAgdGVtcGxhdGVUYWcuaXNGb3VuZCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHt0cmFuc2xhdGUoJ1RoZSBwYXJhbWV0ZXIgbXVzdCBiZSBsZXNzIHRoYW4gMCcpfWApO1xyXG5cdFx0XHRcdHRlbXBsYXRlVGFnLmlzRm91bmQgPSBmYWxzZTtcclxuXHRcdFx0XHR0ZW1wbGF0ZUNvdW50ICs9IDE7XHJcblx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0dGVtcGxhdGVDb3VudCArPSAxO1xyXG5cdFx0XHRcdGNvbnN0ICBjaGVja2luZ0xpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0Y29uc3QgIGV4cGVjdGVkID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlVGFnLnRlbXBsYXRlKTtcclxuXHJcblx0XHRcdFx0aWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGV4cGVjdGVkKSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bSArIHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXR9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7Y2hlY2tpbmdMaW5lLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFeHBlY3RlZCcpfTogJHtleHBlY3RlZH1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdUZW1wbGF0ZScpfTogJHt0ZW1wbGF0ZVRhZy50ZW1wbGF0ZX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgdGFyZ2V0IGZpbGUgY29udGVudHMgYnkgXCIjZmlsZS10ZW1wbGF0ZTpcIiB0YWcuXHJcblx0XHRcdGlmIChmaWxlVGVtcGxhdGVUYWcpIHtcclxuXHRcdFx0XHRjb25zdCBjb250aW51ZV8gPSBmaWxlVGVtcGxhdGVUYWcub25SZWFkTGluZShsaW5lKTtcclxuXHRcdFx0XHRpZiAoIWNvbnRpbnVlXykge1xyXG5cclxuXHRcdFx0XHRcdGNvbnN0ICBjaGVja1Bhc3NlZCA9IGF3YWl0IGZpbGVUZW1wbGF0ZVRhZy5jaGVja1RhcmdldENvbnRlbnRzKFxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nLCBpbnB1dEZpbGVQYXRoLCBsaW5lTnVtKTtcclxuXHRcdFx0XHRcdGlmICghY2hlY2tQYXNzZWQpIHtcclxuXHRcdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZmlsZVRlbXBsYXRlVGFnID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRlbXBsYXRlVGFnLmxhYmVsID09PSBmaWxlVGVtcGxhdGVMYWJlbCkge1xyXG5cdFx0XHRcdGZpbGVUZW1wbGF0ZVRhZyA9IHRlbXBsYXRlVGFnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBub3QgXCIj4piFTm93OlwiLlxyXG5cdFx0XHRmb3IgKGxldCB0ZW1wb3JhcnlMYWJlbCBvZiB0ZW1wb3JhcnlMYWJlbHMpIHtcclxuXHRcdFx0XHRpZiAobGluZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVtcG9yYXJ5TGFiZWwudG9Mb3dlckNhc2UoKSkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnV2FybmluZ0xpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtsaW5lLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0d2FybmluZ0NvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBub3Qgc2VjcmV0IHRhZy5cclxuXHRcdFx0aWYgKGxpbmUuaW5kZXhPZiggc2VjcmV0TGFiZWwgKSAhPT0gbm90Rm91bmQgIHx8ICBsaW5lLmluZGV4T2YoIHNlY3JldExhYmVsRW4gKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRpZiAobGluZS5pbmRleE9mKCBzZWNyZXRFeGFtbGVMYWJlbCApID09PSBub3RGb3VuZCAgJiYgIGxpbmUuaW5kZXhPZiggc2VjcmV0RXhhbWxlTGFiZWxFbiApID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlY3JldExhYmVsQ291bnQgPT09IDApIHsgIC8vIEJlY2F1c2UgdGhlcmUgd2lsbCBiZSBtYW55IHNlY3JldCBkYXRhLlxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnVGhpcyBpcyBhIHNlY3JldCB2YWx1ZS4nKX1gKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJysgdHJhbnNsYXRlYENoYW5nZSBcIiR7c2VjcmV0TGFiZWxFbn1cIiB0byBcIiR7c2VjcmV0RXhhbWxlTGFiZWxFbn1cIi4nYCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcrIHRyYW5zbGF0ZWBDaGFuZ2UgXCIke3NlY3JldExhYmVsfVwiIHRvIFwiJHtzZWNyZXRFeGFtbGVMYWJlbH1cIi4nYCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0XHR3YXJuaW5nQ291bnQgKz0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNlY3JldExhYmVsQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEdldCB0aXRsZXMgYWJvdmUgb3IgZm9sbG93aW5nLlxyXG5cdFx0XHRsZXQgIG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xyXG5cdFx0XHRyZWZlclBhdHRlcm4ubGFzdEluZGV4ID0gMDtcclxuXHJcblx0XHRcdHdoaWxlICggKG1hdGNoID0gcmVmZXJQYXR0ZXJuLmV4ZWMoIGxpbmUgKSkgIT09IG51bGwgKSB7XHJcblx0XHRcdFx0Y29uc3QgIGtleXdvcmQgPSBuZXcgU2VhcmNoS2V5d29yZCgpO1xyXG5cdFx0XHRcdGNvbnN0ICBsYWJlbCA9IG1hdGNoWzFdO1xyXG5cdFx0XHRcdGtleXdvcmQua2V5d29yZCA9IG1hdGNoWzNdO1xyXG5cdFx0XHRcdGlmIChsYWJlbCA9PT0gXCLkuIroqJhcIiAgfHwgIGxhYmVsID09PSBcImFib3ZlXCIpIHtcclxuXHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gbGluZU51bSAtIDE7XHJcblx0XHRcdFx0XHRrZXl3b3JkLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5BYm92ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGxhYmVsID09PSBcIuS4i+iomFwiICB8fCAgbGFiZWwgPT09IFwiZm9sbG93aW5nXCIpIHtcclxuXHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gbGluZU51bSArIDE7XHJcblx0XHRcdFx0XHRrZXl3b3JkLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5Gb2xsb3dpbmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGtleXdvcmRzLnB1c2goa2V5d29yZCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChzZXR0aW5nQ291bnQgPj0gMSkge1xyXG5cdFx0XHRvbkVuZE9mU2V0dGluZyhzZXR0aW5nKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayB0YXJnZXQgZmlsZSBjb250ZW50cyBieSBcIiNmaWxlLXRlbXBsYXRlOlwiIHRhZyAoMikuXHJcblx0XHRpZiAoZmlsZVRlbXBsYXRlVGFnKSB7XHJcblx0XHRcdGZpbGVUZW1wbGF0ZVRhZy5vblJlYWRMaW5lKCcnKTsgIC8vIEN1dCBpbmRlbnRcclxuXHJcblx0XHRcdGNvbnN0ICBjaGVja1Bhc3NlZCA9IGF3YWl0IGZpbGVUZW1wbGF0ZVRhZy5jaGVja1RhcmdldENvbnRlbnRzKFxyXG5cdFx0XHRcdHNldHRpbmcsIGlucHV0RmlsZVBhdGgsIGxpbmVOdW0pO1xyXG5cdFx0XHRpZiAoIWNoZWNrUGFzc2VkKSB7XHJcblx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgaXMgdGhlIHRpdGxlIGFib3ZlIG9yIGZvbGxvd2luZy5cclxuXHRcdHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGxpbmVOdW0gPSAwO1xyXG5cclxuXHRcdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRcdGNvbnN0ICBsaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdFx0bGluZU51bSArPSAxO1xyXG5cclxuXHRcdFx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIGtleXdvcmRzKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uQWJvdmUpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5lTnVtIDw9IGtleXdvcmQuc3RhcnRMaW5lTnVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAobGluZS5pbmRleE9mKGtleXdvcmQua2V5d29yZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBmb3VuZEZvckFib3ZlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkZvbGxvd2luZykge1xyXG5cdFx0XHRcdFx0aWYgKGxpbmVOdW0gPj0ga2V5d29yZC5zdGFydExpbmVOdW0pIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChsaW5lLmluZGV4T2Yoa2V5d29yZC5rZXl3b3JkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0XHRrZXl3b3JkLnN0YXJ0TGluZU51bSA9IGZvdW5kRm9yRm9sbG93aW5nO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGNvbnN0IGtleXdvcmQgb2Yga2V5d29yZHMpIHtcclxuXHRcdFx0aWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uQWJvdmUpIHtcclxuXHRcdFx0XHRpZiAoa2V5d29yZC5zdGFydExpbmVOdW0gIT09IGZvdW5kRm9yQWJvdmUpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2tleXdvcmQuc3RhcnRMaW5lTnVtICsgMX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcgKyB0cmFuc2xhdGVgTm90IGZvdW5kIFwiJHtrZXl3b3JkLmtleXdvcmR9XCIgYWJvdmVgKTtcclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Gb2xsb3dpbmcpIHtcclxuXHRcdFx0XHRpZiAoa2V5d29yZC5zdGFydExpbmVOdW0gIT09IGZvdW5kRm9yRm9sbG93aW5nKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtrZXl3b3JkLnN0YXJ0TGluZU51bSAtIDF9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnICsgdHJhbnNsYXRlYE5vdCBmb3VuZCBcIiR7a2V5d29yZC5rZXl3b3JkfVwiIGZvbGxvd2luZ2ApO1xyXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNob3cgdGhlIHJlc3VsdFxyXG5cdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nJyl9OiAke3dhcm5pbmdDb3VudH0sICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHtlcnJvckNvdW50fWApO1xyXG5cdFx0aWYgKHByZXZpb3VzVGVtcGxhdGVDb3VudCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3RlbXBsYXRlIGNvdW50Jyl9ID0gJHtwcmV2aW91c1RlbXBsYXRlQ291bnR9ICgke3RyYW5zbGF0ZSgnaW4gcHJldmlvdXMgY2hlY2snKX0pYCk7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3RlbXBsYXRlIGNvdW50Jyl9ID0gJHt0ZW1wbGF0ZUNvdW50fWApO1xyXG5cclxuXHRcdC8vIFJlc2NhbiBvciBjaGFuZ2UgYSB2YWx1ZVxyXG5cdFx0bGV0ICBsb29wID0gdHJ1ZTtcclxuXHRcdHdoaWxlIChsb29wKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRyYW5zbGF0ZSgnUHJlc3MgRW50ZXIga2V5IHRvIHJldHJ5IGNoZWNraW5nLicpKTtcclxuXHJcblx0XHRcdGNvbnN0ICBrZXkgPSBhd2FpdCBpbnB1dCh0cmFuc2xhdGUoJ1RoZSBsaW5lIG51bWJlciB0byBjaGFuZ2UgdGhlIHZhcmlhYmxlIHZhbHVlID4nKSk7XHJcblx0XHRcdGVycm9yQ291bnQgPSAwO1xyXG5cdFx0XHRpZiAoa2V5ID09PSAnZXhpdCcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSBpZiAoa2V5ICE9PSAnJykge1xyXG5cdFx0XHRcdGNvbnN0ICBsaW5lTnVtID0gcGFyc2VJbnQoa2V5KTtcclxuXHRcdFx0XHRjb25zdCAgY2hhbmdpbmdTZXR0aW5nSW5kZXggPSBhd2FpdCBnZXRTZXR0aW5nSW5kZXhGcm9tTGluZU51bShpbnB1dEZpbGVQYXRoLCBsaW5lTnVtKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtjaGFuZ2luZ1NldHRpbmdJbmRleH1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGUoJ0VudGVyIG9ubHk6IGZpbmlzaCB0byBpbnB1dCBzZXR0aW5nJykpO1xyXG5cdFx0XHRcdGZvciAoOzspIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBrZXlWYWx1ZSA9IGF3YWl0IGlucHV0KHRyYW5zbGF0ZSgna2V5OiBuZXdfdmFsdWU+JykpO1xyXG5cdFx0XHRcdFx0aWYgKGtleVZhbHVlID09PSAnJykge1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gYXdhaXQgY2hhbmdlU2V0dGluZ0J5S2V5VmFsdWUoaW5wdXRGaWxlUGF0aCwgY2hhbmdpbmdTZXR0aW5nSW5kZXgsIGtleVZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0bG9vcCA9IChlcnJvckNvdW50ID49IDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlc2NhblxyXG5cdFx0Y29uc29sZS5sb2coJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcclxuXHRcdHByZXZpb3VzVGVtcGxhdGVDb3VudCA9IHRlbXBsYXRlQ291bnRcclxuXHRcdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRcdHNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vIGNoYW5nZVNldHRpbmdCeUtleVZhbHVlXHJcbmFzeW5jIGZ1bmN0aW9uICBjaGFuZ2VTZXR0aW5nQnlLZXlWYWx1ZShpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIGNoYW5naW5nU2V0dGluZ0luZGV4OiBudW1iZXIsXHJcblx0XHRrZXlWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+LyplcnJvckNvdW50Ki8ge1xyXG5cclxuXHRjb25zdCAgc2VwYXJhdG9yID0ga2V5VmFsdWUuaW5kZXhPZignOicpO1xyXG5cdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRjb25zdCAga2V5ID0ga2V5VmFsdWUuc3Vic3RyKDAsIHNlcGFyYXRvcikudHJpbSgpO1xyXG5cdFx0Y29uc3QgIHZhbHVlID0gZ2V0VmFsdWUoa2V5VmFsdWUsIHNlcGFyYXRvcik7XHJcblxyXG5cdFx0cmV0dXJuICBjaGFuZ2VTZXR0aW5nKGlucHV0RmlsZVBhdGgsIGNoYW5naW5nU2V0dGluZ0luZGV4LCBrZXksIHZhbHVlKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICAxO1xyXG5cdH1cclxufVxyXG5cclxuLy8gY2hhbmdlU2V0dGluZ1xyXG5hc3luYyBmdW5jdGlvbiAgY2hhbmdlU2V0dGluZyhpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIGNoYW5naW5nU2V0dGluZ0luZGV4OiBudW1iZXIsXHJcblx0XHRjaGFuZ2luZ0tleTogc3RyaW5nLCBjaGFuZ2VkVmFsdWVBbmRDb21tZW50OiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4vKmVycm9yQ291bnQqLyB7XHJcblxyXG5cdGNvbnN0ICBiYWNrVXBGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGggK1wiLmJhY2t1cFwiO1xyXG5cdGlmICghZnMuZXhpc3RzU3luYyhiYWNrVXBGaWxlUGF0aCkpIHtcclxuXHRcdGZzLmNvcHlGaWxlU3luYyhpbnB1dEZpbGVQYXRoLCBiYWNrVXBGaWxlUGF0aCk7XHJcblx0fVxyXG5cclxuXHRjb25zdCAgb2xkRmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoO1xyXG5cdGNvbnN0ICBuZXdGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGggK1wiLm5ld1wiO1xyXG5cdGNvbnN0ICB3cml0ZXIgPSBuZXcgV3JpdGVCdWZmZXIoZnMuY3JlYXRlV3JpdGVTdHJlYW0obmV3RmlsZVBhdGgpKTtcclxuXHRjb25zdCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKG9sZEZpbGVQYXRoKSxcclxuXHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHR9KTtcclxuXHRjb25zdCAgbGluZXMgPSBbXTtcclxuXHRsZXQgIGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRsZXQgIHNldHRpbmc6IFNldHRpbmdzID0ge307XHJcblx0bGV0ICBzZXR0aW5nQ291bnQgPSAwO1xyXG5cdGxldCAgY2hhbmdlZFZhbHVlID0gZ2V0Q2hhbmdlZFZhbHVlKGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQpO1xyXG5cdGxldCAgbGluZU51bSA9IDA7XHJcblx0bGV0ICBlcnJvckNvdW50ID0gMDtcclxuXHRsZXQgIGlzQ2hhbmdpbmcgPSBmYWxzZTtcclxuXHRcclxuXHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0bGluZXMucHVzaChsaW5lKTtcclxuXHRcdGxpbmVOdW0gKz0gMTtcclxuXHRcdGxldCAgb3V0cHV0ID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gc2V0dGluZyA9IC4uLlxyXG5cdFx0aWYgKHNldHRpbmdTdGFydExhYmVsLnRlc3QobGluZS50cmltKCkpICB8fCAgc2V0dGluZ1N0YXJ0TGFiZWxFbi50ZXN0KGxpbmUudHJpbSgpKSkge1xyXG5cdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdFx0aWYgKGNoYW5naW5nU2V0dGluZ0luZGV4ID09PSBhbGxTZXR0aW5nKSB7XHJcblx0XHRcdFx0aXNDaGFuZ2luZyA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aXNDaGFuZ2luZyA9IChzZXR0aW5nQ291bnQgPT09IGNoYW5naW5nU2V0dGluZ0luZGV4KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChpc0VuZE9mU2V0dGluZyhsaW5lLCBpc1JlYWRpbmdTZXR0aW5nKSkge1xyXG5cdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNDaGFuZ2luZykge1xyXG5cclxuXHRcdFx0aWYgKGlzUmVhZGluZ1NldHRpbmcpIHtcclxuXHRcdFx0XHRjb25zdCAgc2VwYXJhdG9yID0gbGluZS5pbmRleE9mKCc6Jyk7XHJcblx0XHRcdFx0aWYgKHNlcGFyYXRvciAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBrZXkgPSBsaW5lLnN1YnN0cigwLCBzZXBhcmF0b3IpLnRyaW0oKTtcclxuXHRcdFx0XHRcdGNvbnN0ICB2YWx1ZSA9IGdldFZhbHVlKGxpbmUsIHNlcGFyYXRvcik7XHJcblx0XHRcdFx0XHRpZiAodmFsdWUgIT09ICcnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nW2tleV0gPSB7dmFsdWUsIGlzUmVmZXJlbmNlZDogZmFsc2UsIGxpbmVOdW19O1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmICghc2V0dGluZ1N0YXJ0TGFiZWwudGVzdChrZXkgKyAnOicpICAmJiAgIXNldHRpbmdTdGFydExhYmVsRW4udGVzdChrZXkgKyAnOicpKSB7XHJcblx0XHRcdFx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoa2V5ID09PSBjaGFuZ2luZ0tleSkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgY29tbWVudEluZGV4ID0gbGluZS5pbmRleE9mKCcjJywgc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdFx0bGV0ICBjb21tZW50PSAnJztcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1lbnRJbmRleCAhPT0gbm90Rm91bmQgICYmICBjaGFuZ2VkVmFsdWVBbmRDb21tZW50LmluZGV4T2YoJyMnKSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0XHRjb21tZW50ID0gJyAgJyArIGxpbmUuc3Vic3RyKGNvbW1lbnRJbmRleCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHdyaXRlci53cml0ZShsaW5lLnN1YnN0cigwLCBzZXBhcmF0b3IgKyAxKSArJyAnKyBjaGFuZ2VkVmFsdWVBbmRDb21tZW50ICsgY29tbWVudCArIFwiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE91dCBvZiBzZXR0aW5nc1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBjaGVja2luZ0xpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cdFx0XHRcdFx0Y29uc3QgIGNoYW5nZWQgPSBnZXRDaGFuZ2VkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZVRhZy50ZW1wbGF0ZSwgY2hhbmdpbmdLZXksIGNoYW5nZWRWYWx1ZSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGV4cGVjdGVkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgIGJlZm9yZSA9IGV4cGVjdGVkO1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgYWZ0ZXIgPSBjaGFuZ2VkO1xyXG5cdFx0XHRcdFx0XHRpZiAodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCA8PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0ICBhYm92ZUxpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0XHRcdFx0d3JpdGVyLnJlcGxhY2VBYm92ZUxpbmUodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCxcclxuXHRcdFx0XHRcdFx0XHRcdGFib3ZlTGluZS5yZXBsYWNlKGJlZm9yZSwgYWZ0ZXIpK1wiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0XHR3cml0ZXIud3JpdGUobGluZS5yZXBsYWNlKGJlZm9yZSwgYWZ0ZXIpICtcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGNoYW5nZWQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHQvLyBEbyBub3RoaW5nXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoZXJyb3JDb3VudCA9PT0gMCkgeyAvLyBTaW5jZSBvbmx5IG9uZSBvbGQgdmFsdWUgY2FuIGJlIHJlcGxhY2VkIGF0IGEgdGltZVxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHt0cmFuc2xhdGUoJ05vdCBmb3VuZCBhbnkgcmVwbGFjaW5nIHRhcmdldCcpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTb2x1dGlvbicpfTogJHt0cmFuc2xhdGUoJ1NldCBvbGQgdmFsdWUgYXQgc2V0dGluZ3MgaW4gdGhlIHJlcGxhY2luZyBmaWxlJyl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFeHBlY3RlZCcpfTogJHtleHBlY3RlZC50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnU2V0dGluZ0luZGV4Jyl9OiAke3NldHRpbmdDb3VudH1gKTtcclxuXHRcdFx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghb3V0cHV0KSB7XHJcblx0XHRcdHdyaXRlci53cml0ZShsaW5lICtcIlxcblwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0d3JpdGVyLmVuZCgpO1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUpID0+IHtcclxuXHRcdHdyaXRlci5vbignZmluaXNoJywgKCkgPT4ge1xyXG5cdFx0XHRmcy5jb3B5RmlsZVN5bmMobmV3RmlsZVBhdGgsIGlucHV0RmlsZVBhdGgpO1xyXG5cdFx0XHRkZWxldGVGaWxlKG5ld0ZpbGVQYXRoKTtcclxuXHRcdFx0cmVzb2x2ZShlcnJvckNvdW50KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vLyBUZW1wbGF0ZVRhZ1xyXG5jbGFzcyAgVGVtcGxhdGVUYWcge1xyXG5cclxuXHRsYWJlbCA9ICcnO1xyXG5cdHRlbXBsYXRlID0gJyc7XHJcblx0aXNGb3VuZCA9IGZhbHNlO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZSB0YWdcclxuXHRpbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZS1hdCB0YWdcclxuXHRsaW5lTnVtT2Zmc2V0ID0gMDsgIFxyXG5cdHN0YXJ0SW5kZXhJbkxpbmUgPSBub3RGb3VuZDtcclxuXHRlbmRJbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cclxuXHQvLyBmb3IgZmlsZS10ZW1wbGF0ZSB0YWdcclxuXHR0ZW1wbGF0ZUxpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdGluZGVudEF0VGFnID0gJyc7XHJcblx0bWluSW5kZW50TGVuZ3RoID0gMDtcclxuXHJcblx0b25GaWxlVGVtcGxhdGVUYWdSZWFkaW5nKGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5pbmRlbnRBdFRhZyA9IGluZGVudFJlZ3VsYXJFeHByZXNzaW9uLmV4ZWMobGluZSkhWzBdO1xyXG5cdFx0dGhpcy5taW5JbmRlbnRMZW5ndGggPSBtYXhOdW1iZXI7XHJcblx0fVxyXG5cdG9uUmVhZExpbmUobGluZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcblx0XHRjb25zdCAgY3VycmVudEluZGVudCA9IGluZGVudFJlZ3VsYXJFeHByZXNzaW9uLmV4ZWMobGluZSkhWzBdO1xyXG5cdFx0bGV0ICByZWFkaW5nTmV4dCA9IHRydWU7XHJcblx0XHRpZiAoY3VycmVudEluZGVudC5sZW5ndGggPiB0aGlzLmluZGVudEF0VGFnLmxlbmd0aCAgJiYgIGxpbmUuc3RhcnRzV2l0aCh0aGlzLmluZGVudEF0VGFnKSkge1xyXG5cclxuXHRcdFx0dGhpcy50ZW1wbGF0ZUxpbmVzLnB1c2gobGluZSk7XHJcblx0XHRcdHRoaXMubWluSW5kZW50TGVuZ3RoID0gTWF0aC5taW4odGhpcy5taW5JbmRlbnRMZW5ndGgsIGN1cnJlbnRJbmRlbnQubGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMudGVtcGxhdGVMaW5lcyA9IHRoaXMudGVtcGxhdGVMaW5lcy5tYXAoKGxpbmUpPT4oXHJcblx0XHRcdFx0bGluZS5zdWJzdHIodGhpcy5taW5JbmRlbnRMZW5ndGgpKSk7XHJcblx0XHRcdHJlYWRpbmdOZXh0ID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHJlYWRpbmdOZXh0O1xyXG5cdH1cclxuXHRhc3luYyAgY2hlY2tUYXJnZXRDb250ZW50cyhzZXR0aW5nOiBTZXR0aW5ncywgaW5wdXRGaWxlUGF0aDogc3RyaW5nLCB0ZW1wbGF0ZUVuZExpbmVOdW06IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG5cdFx0Y29uc3QgIHBhcmVudFBhdGggPSBwYXRoLmRpcm5hbWUoaW5wdXRGaWxlUGF0aCk7XHJcblx0XHRjb25zdCAgdGFyZ2V0RmlsZVBhdGggPSBnZXRGdWxsUGF0aChnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGhpcy50ZW1wbGF0ZSksIHBhcmVudFBhdGgpO1xyXG5cdFx0aWYgKCFmcy5leGlzdHNTeW5jKHRhcmdldEZpbGVQYXRoKSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYEVycm9yOiAke3RyYW5zbGF0ZSgnTm90Rm91bmQnKX06ICR7dGFyZ2V0RmlsZVBhdGh9YCk7XHJcblx0XHRcdHJldHVybiAgZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCAgdGFyZ2V0RmlsZVJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKHRhcmdldEZpbGVQYXRoKSxcclxuXHRcdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdFx0fSk7XHJcblx0XHRpZiAodGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgIGV4cGVjdGVkRmlyc3RMaW5lID0gZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGUoc2V0dGluZywgdGhpcy50ZW1wbGF0ZUxpbmVzWzBdKTtcclxuXHRcdGxldCAgdGVtcGxhdGVMaW5lSW5kZXggPSAwO1xyXG5cdFx0bGV0ICB0YXJnZXRMaW5lTnVtID0gMDtcclxuXHRcdGxldCAgZXJyb3JUZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRsZXQgIGVycm9yVGFyZ2V0TGluZU51bSA9IDA7XHJcblx0XHRsZXQgIGVycm9yQ29udGVudHMgPSAnJztcclxuXHRcdGxldCAgZXJyb3JFeHBlY3RlZCA9ICcnO1xyXG5cdFx0bGV0ICBlcnJvclRlbXBsYXRlID0gJyc7XHJcblx0XHRsZXQgIGluZGVudCA9ICcnO1xyXG5cdFx0bGV0ICBzYW1lID0gZmFsc2U7XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiB0YXJnZXRGaWxlUmVhZGVyKSB7XHJcblx0XHRcdGNvbnN0ICB0YXJnZXRMaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdFx0dGFyZ2V0TGluZU51bSArPSAxO1xyXG5cdFx0XHRpZiAodGVtcGxhdGVMaW5lSW5kZXggPT09IDApIHtcclxuXHJcblx0XHRcdFx0Y29uc3QgIGluZGVudExlbmd0aCA9IHRhcmdldExpbmUuaW5kZXhPZihleHBlY3RlZEZpcnN0TGluZSk7XHJcblx0XHRcdFx0aWYgKGluZGVudExlbmd0aCA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdHNhbWUgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2FtZSA9IHRydWU7XHJcblx0XHRcdFx0XHRpbmRlbnQgPSB0YXJnZXRMaW5lLnN1YnN0cigwLCBpbmRlbnRMZW5ndGgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHsgLy8gbGluZUluZGV4ID49IDFcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZShcclxuXHRcdFx0XHRcdHNldHRpbmcsIHRoaXMudGVtcGxhdGVMaW5lc1t0ZW1wbGF0ZUxpbmVJbmRleF0pO1xyXG5cclxuXHRcdFx0XHRzYW1lID0gKHRhcmdldExpbmUgPT09IGluZGVudCArIGV4cGVjdGVkKTtcclxuXHRcdFx0XHRpZiAoIXNhbWUpIHtcclxuXHRcdFx0XHRcdGVycm9yVGVtcGxhdGVMaW5lSW5kZXggPSB0ZW1wbGF0ZUxpbmVJbmRleDtcclxuXHRcdFx0XHRcdGVycm9yVGFyZ2V0TGluZU51bSA9IHRhcmdldExpbmVOdW07XHJcblx0XHRcdFx0XHRlcnJvckNvbnRlbnRzID0gdGFyZ2V0TGluZTtcclxuXHRcdFx0XHRcdGVycm9yRXhwZWN0ZWQgPSBpbmRlbnQgKyBleHBlY3RlZDtcclxuXHRcdFx0XHRcdGVycm9yVGVtcGxhdGUgPSBpbmRlbnQgKyB0aGlzLnRlbXBsYXRlTGluZXNbdGVtcGxhdGVMaW5lSW5kZXhdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2FtZSkge1xyXG5cdFx0XHRcdHRlbXBsYXRlTGluZUluZGV4ICs9IDE7XHJcblx0XHRcdFx0aWYgKHRlbXBsYXRlTGluZUluZGV4ID49IHRoaXMudGVtcGxhdGVMaW5lcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghc2FtZSkge1xyXG5cdFx0XHRjb25zdCAgdGVtcGxhdGVMaW5lTnVtID0gdGVtcGxhdGVFbmRMaW5lTnVtIC0gdGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCArIGVycm9yVGVtcGxhdGVMaW5lSW5kZXg7XHJcblx0XHRcdGlmIChlcnJvckNvbnRlbnRzID09PSAnJykge1xyXG5cdFx0XHRcdGVycm9yQ29udGVudHMgPSAnKE5vdCBmb3VuZCknO1xyXG5cdFx0XHRcdGVycm9yRXhwZWN0ZWQgPSBleHBlY3RlZEZpcnN0TGluZTtcclxuXHRcdFx0XHRlcnJvclRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZUxpbmVzWzBdO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3R5cHJtRmlsZScpfTogJHtnZXRUZXN0YWJsZShpbnB1dEZpbGVQYXRoKX06JHt0ZW1wbGF0ZUxpbmVOdW19YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JGaWxlJyl9OiAke2dldFRlc3RhYmxlKHRhcmdldEZpbGVQYXRoKX06JHtlcnJvclRhcmdldExpbmVOdW19YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIENvbnRlbnRzOiAke2Vycm9yQ29udGVudHN9YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIEV4cGVjdGVkOiAke2Vycm9yRXhwZWN0ZWR9YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIFRlbXBsYXRlOiAke2Vycm9yVGVtcGxhdGV9YCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHNhbWU7XHJcblx0fVxyXG59XHJcblxyXG4vLyBvbkVuZE9mU2V0dGluZ1xyXG5mdW5jdGlvbiBvbkVuZE9mU2V0dGluZyhzZXR0aW5nOiBTZXR0aW5ncykge1xyXG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRpZiAoIXNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlYE5vdCByZWZlcmVuY2VkOiAke2tleX0gaW4gbGluZSAke3NldHRpbmdba2V5XS5saW5lTnVtfWApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy8gZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW1cclxuYXN5bmMgZnVuY3Rpb24gIGdldFNldHRpbmdJbmRleEZyb21MaW5lTnVtKGlucHV0RmlsZVBhdGg6IHN0cmluZywgdGFyZ2V0TGluZU51bTogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuXHRjb25zdCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdH0pO1xyXG5cdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cclxuXHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0bGluZU51bSArPSAxO1xyXG5cclxuXHRcdGlmIChzZXR0aW5nU3RhcnRMYWJlbC50ZXN0KGxpbmUudHJpbSgpKSB8fCBzZXR0aW5nU3RhcnRMYWJlbEVuLnRlc3QobGluZS50cmltKCkpKSB7XHJcblx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChsaW5lTnVtID09PSB0YXJnZXRMaW5lTnVtKSB7XHJcblx0XHRcdHJldHVybiAgc2V0dGluZ0NvdW50O1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gIDA7XHJcbn1cclxuXHJcbi8vIGlzRW5kT2ZTZXR0aW5nXHJcbmZ1bmN0aW9uICBpc0VuZE9mU2V0dGluZyhsaW5lOiBzdHJpbmcsIGlzUmVhZGluZ1NldHRpbmc6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuXHRsZXQgIHJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0aWYgKGlzUmVhZGluZ1NldHRpbmcpIHtcclxuXHRcdGNvbnN0IGNvbW1lbnQgPSBsaW5lLmluZGV4T2YoJyMnKTtcclxuXHRcdGxldCBsZWZ0T2ZDb21tZW50OiBzdHJpbmc7XHJcblx0XHRpZiAoY29tbWVudCAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0bGVmdE9mQ29tbWVudCA9IGxpbmUuc3Vic3RyKDAsIGxpbmUuaW5kZXhPZignIycpKS50cmltKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bGVmdE9mQ29tbWVudCA9IGxpbmUudHJpbSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChsZWZ0T2ZDb21tZW50LmluZGV4T2YoJzonKSA9PT0gbm90Rm91bmQgICYmICBsZWZ0T2ZDb21tZW50ICE9PSAnJykge1xyXG5cdFx0XHRyZXR1cm5WYWx1ZSA9IHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKGxlZnRPZkNvbW1lbnQuc3Vic3RyKC0xKSA9PT0gJ3wnKSB7XHJcblx0XHRcdHJldHVyblZhbHVlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICByZXR1cm5WYWx1ZTtcclxufVxyXG5cclxuLy8gZ2V0RnVsbFBhdGhcclxuZnVuY3Rpb24gIGdldEZ1bGxQYXRoKHJlbGF0aXZlUGF0aDogc3RyaW5nLCBiYXNlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuXHR2YXIgIGZ1bGxQYXRoID0gJyc7XHJcblx0aWYgKHJlbGF0aXZlUGF0aC5zdWJzdHIoMCwxKSA9PT0gJy8nKSB7XHJcblx0XHRmdWxsUGF0aCA9IHJlbGF0aXZlUGF0aDtcclxuXHR9IGVsc2UgaWYgKHJlbGF0aXZlUGF0aC5zdWJzdHIoMCwxKSA9PT0gJ34nKSB7XHJcblx0XHRmdWxsUGF0aCA9IHJlbGF0aXZlUGF0aC5yZXBsYWNlKCd+JywgcHJvY2Vzcy5lbnYuSE9NRSEpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRmdWxsUGF0aCA9IHBhdGguam9pbihiYXNlUGF0aCwgcmVsYXRpdmVQYXRoKTtcclxuXHR9XHJcblx0cmV0dXJuICBmdWxsUGF0aDtcclxufVxyXG5cclxuLy8gZGVsZXRlRmlsZVxyXG5mdW5jdGlvbiAgZGVsZXRlRmlsZShwYXRoOiBzdHJpbmcpIHtcclxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGgpKSB7XHJcbiAgICAgICAgZnMudW5saW5rU3luYyhwYXRoKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gZ2V0VmFsdWVcclxuZnVuY3Rpb24gIGdldFZhbHVlKGxpbmU6IHN0cmluZywgc2VwYXJhdG9ySW5kZXg6IG51bWJlcikge1xyXG5cdGxldCAgICB2YWx1ZSA9IGxpbmUuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xyXG5cdGNvbnN0ICBjb21tZW50ID0gdmFsdWUuaW5kZXhPZignIycpO1xyXG5cdGlmIChjb21tZW50ICE9PSBub3RGb3VuZCkge1xyXG5cdFx0dmFsdWUgPSB2YWx1ZS5zdWJzdHIoMCwgY29tbWVudCkudHJpbSgpO1xyXG5cdH1cclxuXHRyZXR1cm4gIHZhbHVlO1xyXG59XHJcblxyXG4vLyBnZXRFeHBlY3RlZExpbmVcclxuZnVuY3Rpb24gIGdldEV4cGVjdGVkTGluZShzZXR0aW5nOiBTZXR0aW5ncywgdGVtcGxhdGU6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0bGV0ICBleHBlY3RlZCA9IHRlbXBsYXRlO1xyXG5cclxuXHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzZXR0aW5nKSkge1xyXG5cdFx0Y29uc3QgIHJlID0gbmV3IFJlZ0V4cCggZXNjYXBlUmVndWxhckV4cHJlc3Npb24oa2V5KSwgXCJnaVwiICk7XHJcblxyXG5cdFx0Y29uc3QgIGV4cGVjdGVkQWZ0ZXIgPSBleHBlY3RlZC5yZXBsYWNlKHJlLCBzZXR0aW5nW2tleV0udmFsdWUpO1xyXG5cdFx0aWYgKGV4cGVjdGVkQWZ0ZXIgIT09IGV4cGVjdGVkKSB7XHJcblx0XHRcdHNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZXhwZWN0ZWQgPSBleHBlY3RlZEFmdGVyO1xyXG5cdH1cclxuXHRyZXR1cm4gIGV4cGVjdGVkO1xyXG59XHJcblxyXG4vLyBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZVxyXG5mdW5jdGlvbiAgZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGUoc2V0dGluZzogU2V0dGluZ3MsIHRlbXBsYXRlOiBzdHJpbmcpIHtcclxuXHJcblx0bGV0ICBleHBlY3RlZCA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0Y29uc3QgIHRlbXBsYXRlSW5kZXggPSBleHBlY3RlZC5pbmRleE9mKHRlbXBsYXRlTGFiZWwpO1xyXG5cdGlmICh0ZW1wbGF0ZUluZGV4ICE9PSBub3RGb3VuZCkge1xyXG5cclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWQuc3Vic3RyKDAsIHRlbXBsYXRlSW5kZXgpO1xyXG5cdFx0ZXhwZWN0ZWQgPSBleHBlY3RlZC50cmltUmlnaHQoKTtcclxuXHR9XHJcblx0cmV0dXJuICBleHBlY3RlZDtcclxufVxyXG5cclxuLy8gZ2V0Q2hhbmdlZExpbmVcclxuZnVuY3Rpb24gIGdldENoYW5nZWRMaW5lKHNldHRpbmc6IFNldHRpbmdzLCB0ZW1wbGF0ZTogc3RyaW5nLCBjaGFuZ2luZ0tleTogc3RyaW5nLCBjaGFuZ2VkVmFsdWU6IHN0cmluZykge1xyXG5cdGxldCAgY2hhbmdlZExpbmUgPSAnJztcclxuXHRpZiAoY2hhbmdpbmdLZXkgaW4gc2V0dGluZykge1xyXG5cdFx0Y29uc3QgIGNoYW5naW5nVmFsdWUgPSBzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZTtcclxuXHJcblx0XHRzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZSA9IGNoYW5nZWRWYWx1ZTtcclxuXHJcblx0XHRjaGFuZ2VkTGluZSA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0XHRzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZSA9IGNoYW5naW5nVmFsdWU7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNoYW5nZWRMaW5lID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlKTtcclxuXHR9XHJcblx0cmV0dXJuICBjaGFuZ2VkTGluZTtcclxufVxyXG5cclxuLy8gZ2V0Q2hhbmdlZFZhbHVlXHJcbmZ1bmN0aW9uICBnZXRDaGFuZ2VkVmFsdWUoY2hhbmdlZFZhbHVlQW5kQ29tbWVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRjb25zdCAgY29tbWVudEluZGV4ID0gY2hhbmdlZFZhbHVlQW5kQ29tbWVudC5pbmRleE9mKCcjJyk7XHJcblx0bGV0ICBjaGFuZ2VkVmFsdWU6IHN0cmluZztcclxuXHRpZiAoY29tbWVudEluZGV4ICE9PSBub3RGb3VuZCkge1xyXG5cclxuXHRcdGNoYW5nZWRWYWx1ZSA9IGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuc3Vic3RyKDAsIGNvbW1lbnRJbmRleCkudHJpbSgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGFuZ2VkVmFsdWUgPSBjaGFuZ2VkVmFsdWVBbmRDb21tZW50O1xyXG5cdH1cclxuXHRyZXR1cm4gIGNoYW5nZWRWYWx1ZTtcclxufVxyXG5cclxuLy8gcGFyc2VUZW1wbGF0ZVRhZ1xyXG5mdW5jdGlvbiAgcGFyc2VUZW1wbGF0ZVRhZyhsaW5lOiBzdHJpbmcpOiBUZW1wbGF0ZVRhZyB7XHJcblx0Y29uc3QgIHRhZyA9IG5ldyBUZW1wbGF0ZVRhZygpO1xyXG5cclxuXHR0YWcubGFiZWwgPSB0ZW1wbGF0ZUxhYmVsO1xyXG5cdHRhZy5pbmRleEluTGluZSA9IGxpbmUuaW5kZXhPZih0ZW1wbGF0ZUxhYmVsKTtcclxuXHRpZiAodGFnLmluZGV4SW5MaW5lID09PSBub3RGb3VuZCkge1xyXG5cdFx0dGFnLmxhYmVsID0gZmlsZVRlbXBsYXRlTGFiZWw7XHJcblx0XHR0YWcuaW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YoZmlsZVRlbXBsYXRlTGFiZWwpO1xyXG5cdH1cclxuXHRpZiAodGFnLmluZGV4SW5MaW5lICE9PSBub3RGb3VuZCkge1xyXG5cdFx0dGFnLmlzRm91bmQgPSB0cnVlO1xyXG5cdFx0Y29uc3QgIGxlZnRPZlRlbXBsYXRlID0gbGluZS5zdWJzdHIoMCwgdGFnLmluZGV4SW5MaW5lKS50cmltKCk7XHJcblx0XHRpZiAodGFnLmxhYmVsID09PSBmaWxlVGVtcGxhdGVMYWJlbCkge1xyXG5cdFx0XHR0YWcub25GaWxlVGVtcGxhdGVUYWdSZWFkaW5nKGxpbmUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRhZy50ZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKHRhZy5pbmRleEluTGluZSArIHRhZy5sYWJlbC5sZW5ndGgpLnRyaW0oKTtcclxuXHRcdGlmIChsZWZ0T2ZUZW1wbGF0ZSA9PT0gJycpIHtcclxuXHRcdFx0dGFnLmxpbmVOdW1PZmZzZXQgPSAtMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhZy5saW5lTnVtT2Zmc2V0ID0gMDtcclxuXHRcdH1cclxuXHRcdHJldHVybiAgdGFnO1xyXG5cdH1cclxuXHJcblx0dGFnLmxhYmVsID0gdGVtcGxhdGVBdFN0YXJ0TGFiZWw7XHJcblx0dGFnLnN0YXJ0SW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YodGVtcGxhdGVBdFN0YXJ0TGFiZWwpO1xyXG5cdGlmICh0YWcuc3RhcnRJbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5pc0ZvdW5kID0gdHJ1ZTtcclxuXHRcdHRhZy5lbmRJbmRleEluTGluZSA9ICBsaW5lLmluZGV4T2YodGVtcGxhdGVBdEVuZExhYmVsLCB0YWcuc3RhcnRJbmRleEluTGluZSk7XHJcblx0XHRpZiAodGFnLmVuZEluZGV4SW5MaW5lICE9PSBub3RGb3VuZCkge1xyXG5cclxuXHRcdFx0dGFnLnRlbXBsYXRlID0gbGluZS5zdWJzdHIodGFnLmVuZEluZGV4SW5MaW5lICsgdGVtcGxhdGVBdEVuZExhYmVsLmxlbmd0aCkudHJpbSgpO1xyXG5cdFx0XHR0YWcubGluZU51bU9mZnNldCA9IHBhcnNlSW50KGxpbmUuc3Vic3RyaW5nKFxyXG5cdFx0XHRcdHRhZy5zdGFydEluZGV4SW5MaW5lICsgdGVtcGxhdGVBdFN0YXJ0TGFiZWwubGVuZ3RoLFxyXG5cdFx0XHRcdHRhZy5lbmRJbmRleEluTGluZSApKTtcclxuXHRcdFx0cmV0dXJuICB0YWc7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0YWcubGFiZWwgPSAnJztcclxuXHR0YWcudGVtcGxhdGUgPSAnJztcclxuXHR0YWcubGluZU51bU9mZnNldCA9IDA7XHJcblx0cmV0dXJuICB0YWc7XHJcbn1cclxuXHJcbi8vIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uXHJcbmZ1bmN0aW9uICBlc2NhcGVSZWd1bGFyRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gIGV4cHJlc3Npb24ucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKTtcclxufVxyXG5cclxuLy8gU3RhbmRhcmRJbnB1dEJ1ZmZlclxyXG5jbGFzcyAgU3RhbmRhcmRJbnB1dEJ1ZmZlciB7XHJcblx0cmVhZGxpbmVzOiByZWFkbGluZS5JbnRlcmZhY2U7XHJcblx0aW5wdXRCdWZmZXI6IHN0cmluZ1tdID0gW107XHJcblx0aW5wdXRSZXNvbHZlcj86IChhbnN3ZXI6c3RyaW5nKT0+dm9pZCA9IHVuZGVmaW5lZDtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnJlYWRsaW5lcyA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBwcm9jZXNzLnN0ZGluLFxyXG5cdFx0XHRvdXRwdXQ6IHByb2Nlc3Muc3Rkb3V0XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucmVhZGxpbmVzLm9uKCdsaW5lJywgYXN5bmMgKGxpbmU6IHN0cmluZykgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5pbnB1dFJlc29sdmVyKSB7XHJcblx0XHRcdFx0dGhpcy5pbnB1dFJlc29sdmVyKGxpbmUpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlciA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmlucHV0QnVmZmVyLnB1c2gobGluZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMucmVhZGxpbmVzLnNldFByb21wdCgnJyk7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5wcm9tcHQoKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jICBpbnB1dChndWlkZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdHJldHVybiAgbmV3IFByb21pc2UoXHJcblx0XHRcdChyZXNvbHZlOiAoYW5zd2VyOnN0cmluZyk9PnZvaWQsICByZWplY3Q6IChhbnN3ZXI6c3RyaW5nKT0+dm9pZCApID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0ICBuZXh0TGluZSA9IHRoaXMuaW5wdXRCdWZmZXIuc2hpZnQoKTtcclxuXHRcdFx0aWYgKG5leHRMaW5lKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZ3VpZGUgKyBuZXh0TGluZSk7XHJcblx0XHRcdFx0cmVzb2x2ZShuZXh0TGluZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cHJvY2Vzcy5zdGRvdXQud3JpdGUoZ3VpZGUpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlciA9IHJlc29sdmU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Y2xvc2UoKSB7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5jbG9zZSgpO1xyXG5cdH1cclxufVxyXG5cclxuLy8gSW5wdXRPcHRpb25cclxuY2xhc3MgSW5wdXRPcHRpb24ge1xyXG5cdGlucHV0TGluZXM6IHN0cmluZ1tdO1xyXG5cdG5leHRMaW5lSW5kZXg6IG51bWJlcjtcclxuXHRuZXh0UGFyYW1ldGVySW5kZXg6IG51bWJlcjsgIC8vIFRoZSBpbmRleCBvZiB0aGUgc3RhcnRpbmcgcHJvY2VzcyBwYXJhbWV0ZXJzXHJcblxyXG5cdGNvbnN0cnVjdG9yKGlucHV0TGluZXM6IHN0cmluZ1tdKSB7XHJcblx0XHR0aGlzLmlucHV0TGluZXMgPSBpbnB1dExpbmVzO1xyXG5cdFx0dGhpcy5uZXh0TGluZUluZGV4ID0gMDtcclxuXHRcdHRoaXMubmV4dFBhcmFtZXRlckluZGV4ID0gMjtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0ICB0ZXN0QmFzZUZvbGRlciA9IFN0cmluZy5yYXcgYFI6XFxob21lXFxtZW1fY2FjaGVcXE15RG9jXFxzcmNcXFR5cGVTY3JpcHRcXHR5cHJtXFx0ZXN0X2RhdGFgKydcXFxcJztcclxuXHJcbi8vIGlucHV0T3B0aW9uXHJcbmNvbnN0IGlucHV0T3B0aW9uID0gbmV3IElucHV0T3B0aW9uKFtcclxuLypcclxuXHR0ZXN0QmFzZUZvbGRlciArYGNoYW5nZV9zZXRfLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYGZpbGVgLFxyXG5cdHRlc3RCYXNlRm9sZGVyICtgY2hhbmdlX3NldF9zZXR0aW5nLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYENoYW5nZWRgLFxyXG4qL1xyXG5dKTtcclxuXHJcbi8vIGlucHV0XHJcbi8vIEV4YW1wbGU6IGNvbnN0IG5hbWUgPSBhd2FpdCBpbnB1dCgnV2hhdCBpcyB5b3VyIG5hbWU/ICcpO1xyXG5hc3luYyBmdW5jdGlvbiAgaW5wdXQoIGd1aWRlOiBzdHJpbmcgKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHQvLyBJbnB1dCBlbXVsYXRpb25cclxuXHRpZiAoaW5wdXRPcHRpb24uaW5wdXRMaW5lcykge1xyXG5cdFx0aWYgKGlucHV0T3B0aW9uLm5leHRMaW5lSW5kZXggPCBpbnB1dE9wdGlvbi5pbnB1dExpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCAgdmFsdWUgPSBpbnB1dE9wdGlvbi5pbnB1dExpbmVzW2lucHV0T3B0aW9uLm5leHRMaW5lSW5kZXhdO1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4ICs9IDE7XHJcblx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgdmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuICB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJlYWQgdGhlIHN0YXJ0aW5nIHByb2Nlc3MgcGFyYW1ldGVyc1xyXG5cdHdoaWxlIChpbnB1dE9wdGlvbi5uZXh0UGFyYW1ldGVySW5kZXggPCBwcm9jZXNzLmFyZ3YubGVuZ3RoKSB7XHJcblx0XHRjb25zdCAgdmFsdWUgPSBwcm9jZXNzLmFyZ3ZbaW5wdXRPcHRpb24ubmV4dFBhcmFtZXRlckluZGV4XTtcclxuXHRcdGlucHV0T3B0aW9uLm5leHRQYXJhbWV0ZXJJbmRleCArPSAxO1xyXG5cdFx0aWYgKHZhbHVlLnN1YnN0cigwLDEpICE9PSAnLScpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZ3VpZGUgKyB2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHZhbHVlICE9PSAnLS10ZXN0Jykge1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0UGFyYW1ldGVySW5kZXggKz0gMTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGlucHV0XHJcblx0cmV0dXJuICBJbnB1dE9iamVjdC5pbnB1dChndWlkZSk7XHJcbn1cclxuY29uc3QgIElucHV0T2JqZWN0ID0gbmV3IFN0YW5kYXJkSW5wdXRCdWZmZXIoKTtcclxuXHJcbi8vIGlucHV0UGF0aFxyXG4vLyBFeGFtcGxlOiBjb25zdCBuYW1lID0gYXdhaXQgaW5wdXQoJ1doYXQgaXMgeW91ciBuYW1lPyAnKTtcclxuYXN5bmMgZnVuY3Rpb24gIGlucHV0UGF0aCggZ3VpZGU6IHN0cmluZyApIHtcclxuXHRjb25zdCAga2V5ID0gYXdhaXQgaW5wdXQoZ3VpZGUpO1xyXG5cdHJldHVybiAgcGF0aFJlc29sdmUoa2V5KTtcclxufVxyXG5cclxuLy8gcGF0aFJlc29sdmVcclxuZnVuY3Rpb24gIHBhdGhSZXNvbHZlKHBhdGhfOiBzdHJpbmcpIHtcclxuXHJcblx0Ly8gJy9jL2hvbWUnIGZvcm1hdCB0byBjdXJyZW50IE9TIGZvcm1hdFxyXG5cdGlmIChwYXRoXy5sZW5ndGggPj0gMykge1xyXG5cdFx0aWYgKHBhdGhfWzBdID09PSAnLycgICYmICBwYXRoX1syXSA9PT0gJy8nKSB7XHJcblx0XHRcdHBhdGhfID0gcGF0aF9bMV0gKyc6JysgcGF0aF8uc3Vic3RyKDIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gQ2hhbmdlIHNlcGFyYXRvcnMgdG8gT1MgZm9ybWF0XHJcblx0cGF0aF8gPSBwYXRoLnJlc29sdmUocGF0aF8pO1xyXG5cclxuXHRyZXR1cm4gcGF0aF9cclxufVxyXG5cclxuLy8gU2V0dGluZ1xyXG50eXBlIFNldHRpbmdzID0ge1tuYW1lOiBzdHJpbmddOiBTZXR0aW5nfVxyXG5cclxuLy8gU2V0dGluZ1xyXG5jbGFzcyBTZXR0aW5nIHtcclxuXHR2YWx1ZTogc3RyaW5nID0gJyc7XHJcblx0bGluZU51bTogbnVtYmVyID0gMDtcclxuXHRpc1JlZmVyZW5jZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuLy8gU2VhcmNoS2V5d29yZFxyXG5jbGFzcyBTZWFyY2hLZXl3b3JkIHtcclxuXHRrZXl3b3JkOiBzdHJpbmcgPSAnJztcclxuXHRzdGFydExpbmVOdW06IG51bWJlciA9IDA7XHJcblx0ZGlyZWN0aW9uOiBEaXJlY3Rpb24gPSBEaXJlY3Rpb24uRm9sbG93aW5nO1xyXG59XHJcblxyXG4vLyBEaXJlY3Rpb25cclxuZW51bSBEaXJlY3Rpb24ge1xyXG5cdEFib3ZlID0gLTEsXHJcblx0Rm9sbG93aW5nID0gKzEsXHJcbn1cclxuXHJcbi8vIFdyaXRlQnVmZmVyXHJcbmNsYXNzICBXcml0ZUJ1ZmZlciB7XHJcblx0c3RyZWFtOiBmcy5Xcml0ZVN0cmVhbTtcclxuXHRsaW5lQnVmZmVyOiBzdHJpbmdbXTtcclxuXHJcblx0Y29uc3RydWN0b3Ioc3RyZWFtOiBmcy5Xcml0ZVN0cmVhbSkge1xyXG5cdFx0dGhpcy5zdHJlYW0gPSBzdHJlYW07XHJcblx0XHR0aGlzLmxpbmVCdWZmZXIgPSBbXTtcclxuXHR9XHJcblxyXG5cdGVuZCgpIHtcclxuXHRcdGZvciAoY29uc3QgbGluZSAgb2YgIHRoaXMubGluZUJ1ZmZlcikge1xyXG5cdFx0XHR0aGlzLnN0cmVhbS53cml0ZShsaW5lKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3RyZWFtLmVuZCgpO1xyXG4gICAgfVxyXG5cclxuXHRvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG5cdFx0dGhpcy5zdHJlYW0ub24oZXZlbnQsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHdyaXRlKGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5saW5lQnVmZmVyLnB1c2gobGluZSk7XHJcblx0fVxyXG5cclxuXHRyZXBsYWNlQWJvdmVMaW5lKHJlbGF0aXZlTGluZU51bTogbnVtYmVyLCBsaW5lOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMubGluZUJ1ZmZlclt0aGlzLmxpbmVCdWZmZXIubGVuZ3RoICsgcmVsYXRpdmVMaW5lTnVtXSA9IGxpbmU7XHJcblx0fVxyXG59XHJcblxyXG4vLyB0cmFuc2xhdGVcclxuLy8gZS5nLiB0cmFuc2xhdGUoJ2VuZ2xpc2gnKVxyXG4vLyBlLmcuIHRyYW5zbGF0ZWBwcmljZSA9ICR7cHJpY2V9YCAgLy8gLi4uIHRhZ2dlZFRlbXBsYXRlXHJcbmZ1bmN0aW9uICB0cmFuc2xhdGUoZW5nbGlzaExpdGVyYWxzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSB8IHN0cmluZywgIC4uLnZhbHVlczogYW55W10pOiBzdHJpbmcge1xyXG5cdGxldCAgICBkaWN0aW9uYXJ5OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblx0Y29uc3QgIHRhZ2dlZFRlbXBsYXRlID0gKHR5cGVvZihlbmdsaXNoTGl0ZXJhbHMpICE9PSAnc3RyaW5nJyk7XHJcblxyXG5cdGxldCAgZW5nbGlzaCA9IGVuZ2xpc2hMaXRlcmFscyBhcyBzdHJpbmc7XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRlbmdsaXNoID0gJyc7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRlbmdsaXNoICs9IGVuZ2xpc2hMaXRlcmFsc1tpXTtcclxuXHRcdFx0aWYgKGkgPCB2YWx1ZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0ZW5nbGlzaCArPSAnJHsnICsgU3RyaW5nKGkpICsnfSc7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZS5nLiBlbmdsaXNoID0gJ3ByaWNlID0gJHswfSdcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChsb2NhbGUgPT09ICdqYS1KUCcpIHtcclxuXHRcdGRpY3Rpb25hcnkgPSB7XHJcblx0XHRcdFwiWUFNTCBVVEYtOCBmaWxlIHBhdGg+XCI6IFwiWUFNTCBVVEYtOCDjg5XjgqHjgqTjg6sg44OR44K5PlwiLFxyXG5cdFx0XHRcIlRoaXMgaXMgYSBzZWNyZXQgdmFsdWUuXCI6IFwi44GT44KM44Gv56eY5a+G44Gu5YCk44Gn44GZ44CCXCIsXHJcblx0XHRcdFwiQ2hhbmdlIFxcXCIkezB9XFxcIiB0byBcXFwiJHsxfVxcXCIuXCI6IFwiXFxcIiR7MH1cXFwiIOOCkiBcXFwiJHsxfVxcXCIg44Gr5aSJ5pu044GX44Gm44GP44Gg44GV44GE44CCXCIsXHJcblx0XHRcdFwiUHJlc3MgRW50ZXIga2V5IHRvIHJldHJ5IGNoZWNraW5nLlwiOiBcIkVudGVyIOOCreODvOOCkuaKvOOBmeOBqOWGjeODgeOCp+ODg+OCr+OBl+OBvuOBmeOAglwiLFxyXG5cdFx0XHRcIlRoZSBsaW5lIG51bWJlciB0byBjaGFuZ2UgdGhlIHZhcmlhYmxlIHZhbHVlID5cIjogXCLlpInmm7TjgZnjgovlpInmlbDlgKTjgYzjgYLjgovooYznlarlj7cgPlwiLFxyXG5cdFx0XHRcIkVudGVyIG9ubHk6IGZpbmlzaCB0byBpbnB1dCBzZXR0aW5nXCI6IFwiRW50ZXIg44Gu44G/77ya6Kit5a6a44Gu5YWl5Yqb44KS57WC44KP44KLXCIsXHJcblx0XHRcdFwia2V5OiBuZXdfdmFsdWU+XCI6IFwi5aSJ5pWw5ZCNOiDmlrDjgZfjgYTlpInmlbDlgKQ+XCIsXHJcblx0XHRcdFwidGVtcGxhdGUgY291bnRcIjogXCLjg4bjg7Pjg5fjg6zjg7zjg4jjga7mlbBcIixcclxuXHRcdFx0XCJpbiBwcmV2aW91cyBjaGVja1wiOiBcIuWJjeWbnuOBruODgeOCp+ODg+OCr1wiLFxyXG5cdFx0XHRcIldhcm5pbmdcIjogXCLorablkYpcIixcclxuXHRcdFx0XCJFcnJvclwiOiBcIuOCqOODqeODvFwiLFxyXG5cdFx0XHRcIkVycm9yTGluZVwiOiBcIuOCqOODqeODvOihjFwiLFxyXG5cdFx0XHRcIlNvbHV0aW9uXCI6IFwi6Kej5rG65rOVXCIsXHJcblx0XHRcdFwiQ29udGVudHNcIjogXCLlhoXlrrlcIixcclxuXHRcdFx0XCJFeHBlY3RlZFwiOiBcIuacn+W+hVwiLFxyXG5cdFx0XHRcIlRlbXBsYXRlXCI6IFwi6Zub5b2iXCIsXHJcblx0XHRcdFwiV2FybmluZ0xpbmVcIjogXCLorablkYrooYxcIixcclxuXHRcdFx0XCJGb3VuZFwiOiBcIuimi+OBpOOBi+OBo+OBn+OCguOBrlwiLFxyXG5cdFx0XHRcIlNldHRpbmdJbmRleFwiOiBcIuioreWumueVquWPt1wiLFxyXG5cdFx0XHRcIk5vdCBmb3VuZCBhbnkgcmVwbGFjaW5nIHRhcmdldFwiOiBcIue9ruOBjeaPm+OBiOOCi+WvvuixoeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIlNldCBvbGQgdmFsdWUgYXQgc2V0dGluZ3MgaW4gdGhlIHJlcGxhY2luZyBmaWxlXCI6IFwi572u44GN5o+b44GI44KL44OV44Kh44Kk44Or44Gu5Lit44Gu6Kit5a6a44Gr5Y+k44GE5YCk44KS6Kit5a6a44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwXCI6IFwi44OR44Op44Oh44O844K/44O844GvIDAg44KI44KK5bCP44GV44GP44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiTm90IGZvdW5kIFxcXCIkezB9XFxcIiBhYm92ZVwiOiBcIuS4iuaWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgZm91bmQgXFxcIiR7MH1cXFwiIGZvbGxvd2luZ1wiOiBcIuS4i+aWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgcmVmZXJlbmNlZDogJHswfSBpbiBsaW5lICR7MX1cIjogXCLlj4LnhafjgZXjgozjgabjgYTjgb7jgZvjgpPvvJogJHswfSDvvIgkezF96KGM55uu77yJXCIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHRsZXQgIHRyYW5zbGF0ZWQgPSBlbmdsaXNoO1xyXG5cdGlmIChkaWN0aW9uYXJ5KSB7XHJcblx0XHRpZiAoZW5nbGlzaCBpbiBkaWN0aW9uYXJ5KSB7XHJcblxyXG5cdFx0XHR0cmFuc2xhdGVkID0gZGljdGlvbmFyeVtlbmdsaXNoXTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJHsnK1N0cmluZyhpKSsnfScsIFN0cmluZyh2YWx1ZXNbaV0pICk7XHJcblx0XHR9XHJcblx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJFxcXFx7JywgJyR7JyApO1xyXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBlc2NhcGUgb2YgJHtufVxyXG5cdFx0XHQvLyBlLmcuIFwiJFxcXFx7cHJpY2V9ID0gJHtwcmljZX1cIiA9PiBcIiR7cHJpY2V9ID0gMTAwXCJcclxuXHR9XHJcblx0cmV0dXJuICB0cmFuc2xhdGVkO1xyXG59XHJcblxyXG5jb25zdCAgc2V0dGluZ1N0YXJ0TGFiZWwgPSAvXuioreWumihcXCh877yIW15cXCldKlxcKXzvvIkpPzokLztcclxuY29uc3QgIHNldHRpbmdTdGFydExhYmVsRW4gPSAvXnNldHRpbmdzKFxcKFteXFwpXSpcXCkpPzokLztcclxuY29uc3QgIHRlbXBsYXRlTGFiZWwgPSBcIiN0ZW1wbGF0ZTpcIjtcclxuY29uc3QgIHRlbXBsYXRlQXRTdGFydExhYmVsID0gXCIjdGVtcGxhdGUtYXQoXCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUF0RW5kTGFiZWwgPSBcIik6XCI7XHJcbmNvbnN0ICBmaWxlVGVtcGxhdGVMYWJlbCA9IFwiI2ZpbGUtdGVtcGxhdGU6XCI7XHJcbmNvbnN0ICB0ZW1wb3JhcnlMYWJlbHMgPSBbXCIj4piFTm93OlwiLCBcIiNub3c6XCIsIFwiI+KYheabuOOBjeOBi+OBkVwiLCBcIiPimIXmnKrnorroqo1cIl07XHJcbmNvbnN0ICBzZWNyZXRMYWJlbCA9IFwiI+KYheenmOWvhlwiO1xyXG5jb25zdCAgc2VjcmV0TGFiZWxFbiA9IFwiI3NlY3JldFwiO1xyXG5jb25zdCAgc2VjcmV0RXhhbWxlTGFiZWwgPSBcIiPimIXnp5jlr4Y65LuuXCI7XHJcbmNvbnN0ICBzZWNyZXRFeGFtbGVMYWJlbEVuID0gXCIjc2VjcmV0OmV4YW1wbGVcIjtcclxuY29uc3QgIHJlZmVyUGF0dGVybiA9IC8o5LiK6KiYfOS4i+iomHxhYm92ZXxmb2xsb3dpbmcpKOOAjHxcXFspKFte44CNXSopKOOAjXxcXF0pL2c7XHJcbmNvbnN0ICBpbmRlbnRSZWd1bGFyRXhwcmVzc2lvbiA9IC9eKCB8wqV0KSovO1xyXG5jb25zdCAgbWluTGluZU51bSA9IDA7XHJcbmNvbnN0ICBtYXhMaW5lTnVtID0gOTk5OTk5OTk5O1xyXG5jb25zdCAgbWF4TnVtYmVyID0gOTk5OTk5OTk5O1xyXG5jb25zdCAgZm91bmRGb3JBYm92ZSA9IG1pbkxpbmVOdW07XHJcbmNvbnN0ICBmb3VuZEZvckZvbGxvd2luZyA9IG1heExpbmVOdW07XHJcbmNvbnN0ICBub3RGb3VuZCA9IC0xO1xyXG5jb25zdCAgYWxsU2V0dGluZyA9IDA7XHJcbmNvbnN0ICBub1NlcGFyYXRvciA9IC0xO1xyXG5sZXQgICAgbG9jYWxlOiBzdHJpbmc7XHJcbmNvbnN0ICBwcm9ncmFtT3B0aW9ucyA9IHByb2dyYW0ub3B0cygpO1xyXG5mdW5jdGlvbiAgZXhpdEZyb21Db21tYW5kZXIoZTogQ29tbWFuZGVyRXJyb3IpIHtcclxuXHRjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xyXG59XHJcbmZ1bmN0aW9uICBnZXRUZXN0YWJsZShwYXRoOiBzdHJpbmcpIHtcclxuXHRpZiAocHJvZ3JhbU9wdGlvbnMudGVzdCkge1xyXG5cdFx0aWYgKHBhdGguc3RhcnRzV2l0aChpbnB1dEZpbGVQYXJlbnRQYXRoKSkge1xyXG5cdFx0XHRyZXR1cm4gICcke2lucHV0RmlsZVBhcmVudFBhdGh9JyArIHBhdGguc3Vic3RyKGlucHV0RmlsZVBhcmVudFBhdGgubGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiAgcGF0aDtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICBwYXRoO1xyXG5cdH1cclxufVxyXG5sZXQgIGlucHV0RmlsZVBhcmVudFBhdGggPSAnJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uICBjYWxsTWFpbigpIHtcclxuXHRwcm9ncmFtLnZlcnNpb24oJzAuMS4xJykuZXhpdE92ZXJyaWRlKGV4aXRGcm9tQ29tbWFuZGVyKVxyXG5cdFx0Lm9wdGlvbihcIi1sLCAtLWxvY2FsZSA8cz5cIilcclxuXHRcdC5vcHRpb24oXCItdCwgLS10ZXN0XCIpXHJcblx0XHQucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuXHRcclxuXHRsb2NhbGUgPSBJbnRsLk51bWJlckZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLmxvY2FsZTtcclxuXHRpZiAocHJvZ3JhbU9wdGlvbnMubG9jYWxlKSB7XHJcblx0XHRsb2NhbGUgPSBwcm9ncmFtT3B0aW9ucy5sb2NhbGU7XHJcblx0fVxyXG5cclxuXHRhd2FpdCAgbWFpbigpXHJcblx0XHQuY2F0Y2goIChlKT0+e1xyXG5cdFx0XHRpZiAocHJvZ3JhbU9wdGlvbnMudGVzdCkge1xyXG5cdFx0XHRcdHRocm93IGU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCBgRVJST1I6ICR7ZS5tZXNzYWdlfWAgKTtcclxuXHRcdFx0XHRjb25zdCAgdGltZU92ZXIgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdHRpbWVPdmVyLnNldFNlY29uZHMoIHRpbWVPdmVyLmdldFNlY29uZHMoKSArIDUgKTtcclxuXHJcblx0XHRcdFx0d2hpbGUgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgPCB0aW1lT3Zlci5nZXRUaW1lKCkpIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuZmluYWxseSgoKT0+e1xyXG5cdFx0XHRJbnB1dE9iamVjdC5jbG9zZSgpO1xyXG5cdFx0fSk7XHJcbn1cclxuY2FsbE1haW4oKTtcclxuIl19