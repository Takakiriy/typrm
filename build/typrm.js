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
        var inputFilePath, parentPath, previousTemplateCount, reader, isReadingSetting, setting, settingCount, lineNum, templateCount, fileTemplateTag, errorCount, warningCount, secretLabelCount, lines, keywords, reader_1, reader_1_1, line1, line, previousIsReadingSetting, separator, key, value, templateTag, checkingLine, expected, continue_, checkPassed, _i, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, reader_2, reader_2_1, line1, line, _c, keywords_1, keyword, e_2_1, _d, keywords_2, keyword, loop, key, lineNum_1, changingSettingIndex, keyValue, _e, _f, _g, key;
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
                    if (line.trim() === settingStartLabel || line.trim() === settingStartLabelEn) {
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
                            else if (key + ':' !== settingStartLabel && key + ':' !== settingStartLabelEn) {
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
                    // Check if there is the title above or following.
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    _h.label = 17;
                case 17:
                    _h.trys.push([17, 22, 23, 28]);
                    reader_2 = (e_2 = void 0, __asyncValues(reader));
                    _h.label = 18;
                case 18: return [4 /*yield*/, reader_2.next()];
                case 19:
                    if (!(reader_2_1 = _h.sent(), !reader_2_1.done)) return [3 /*break*/, 21];
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
                    _h.label = 20;
                case 20: return [3 /*break*/, 18];
                case 21: return [3 /*break*/, 28];
                case 22:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 28];
                case 23:
                    _h.trys.push([23, , 26, 27]);
                    if (!(reader_2_1 && !reader_2_1.done && (_b = reader_2["return"]))) return [3 /*break*/, 25];
                    return [4 /*yield*/, _b.call(reader_2)];
                case 24:
                    _h.sent();
                    _h.label = 25;
                case 25: return [3 /*break*/, 27];
                case 26:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 27: return [7 /*endfinally*/];
                case 28:
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
                    _h.label = 29;
                case 29:
                    if (!loop) return [3 /*break*/, 38];
                    console.log(translate('Press Enter key to retry checking.'));
                    return [4 /*yield*/, input(translate('The line number to change the variable value >'))];
                case 30:
                    key = _h.sent();
                    errorCount = 0;
                    if (!(key === 'exit')) return [3 /*break*/, 31];
                    return [2 /*return*/];
                case 31:
                    if (!(key !== '')) return [3 /*break*/, 37];
                    lineNum_1 = parseInt(key);
                    return [4 /*yield*/, getSettingIndexFromLineNum(inputFilePath, lineNum_1)];
                case 32:
                    changingSettingIndex = _h.sent();
                    console.log(translate('SettingIndex') + ": " + changingSettingIndex);
                    console.log(translate('Enter only: finish to input setting'));
                    _h.label = 33;
                case 33: return [4 /*yield*/, input(translate('key: new_value>'))];
                case 34:
                    keyValue = _h.sent();
                    if (keyValue === '') {
                        return [3 /*break*/, 37];
                    }
                    _e = errorCount;
                    return [4 /*yield*/, changeSettingByKeyValue(inputFilePath, changingSettingIndex, keyValue)];
                case 35:
                    errorCount = _e + _h.sent();
                    _h.label = 36;
                case 36: return [3 /*break*/, 33];
                case 37:
                    loop = (errorCount >= 1);
                    return [3 /*break*/, 29];
                case 38:
                    // Rescan
                    console.log('========================================');
                    previousTemplateCount = templateCount;
                    for (_f = 0, _g = Object.keys(setting); _f < _g.length; _f++) {
                        key = _g[_f];
                        setting[key].isReferenced = false;
                    }
                    _h.label = 39;
                case 39: return [3 /*break*/, 2];
                case 40: return [2 /*return*/];
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
                            separator = line.indexOf(':');
                            if (separator !== notFound) {
                                key = line.substr(0, separator).trim();
                                value = getValue(line, separator);
                                if (value !== '') {
                                    setting[key] = { value: value, isReferenced: false, lineNum: lineNum };
                                }
                                else if (key + ':' !== settingStartLabel && key + ':' !== settingStartLabelEn) {
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
                        targetFilePath = path.join(parentPath, getExpectedLine(setting, this.template));
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
                    if (line.trim() === settingStartLabel || line.trim() === settingStartLabelEn) {
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
var settingStartLabel = "設定:";
var settingStartLabelEn = "settings:";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVCQUF5QixDQUFDLGNBQWM7QUFDeEMsMkJBQTZCLENBQUUsNEJBQTRCO0FBQzNELHVDQUFvRDtBQUNwRCxtQ0FBcUM7QUFFckMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUV2QixTQUFnQixJQUFJOzs7Ozs7d0JBQ0kscUJBQU0sU0FBUyxDQUFFLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFFLEVBQUE7O29CQUFyRSxhQUFhLEdBQUcsU0FBcUQ7b0JBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoRCxtQkFBbUIsR0FBRyxVQUFVLENBQUM7b0JBQzVCLHFCQUFxQixHQUFHLENBQUMsQ0FBQzs7O29CQUV6QixNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzt3QkFDdEMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7d0JBQ3pDLFNBQVMsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7b0JBQ0UsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO29CQUN6QixPQUFPLEdBQWEsRUFBRSxDQUFDO29CQUN2QixZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLGVBQWUsR0FBdUIsSUFBSSxDQUFDO29CQUMzQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNmLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFnQixHQUFHLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxRQUFRLEdBQW9CLEVBQUUsQ0FBQzs7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QUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV0QixNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDdEQsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFO3dCQUMxQixNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztxQkFDL0I7b0JBRUQscUJBQU8sSUFBSSxFQUFFLENBQ1gsT0FBSyxDQUFBLENBQUUsVUFBQyxDQUFDOzRCQUNULElBQUksY0FBYyxDQUFDLElBQUksRUFBRTtnQ0FDeEIsTUFBTSxDQUFDLENBQUM7NkJBQ1I7aUNBQU07Z0NBRU4sT0FBTyxDQUFDLEdBQUcsQ0FBRSxZQUFVLENBQUMsQ0FBQyxPQUFTLENBQUUsQ0FBQztnQ0FDckMsSUFBTyxRQUFRLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQ0FDN0IsUUFBUSxDQUFDLFVBQVUsQ0FBRSxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFFLENBQUM7Z0NBRWpELE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFO2lDQUNuRDs2QkFDRDt3QkFDRixDQUFDLENBQUMsQ0FDRCxTQUFPLENBQUEsQ0FBQzs0QkFDUixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3JCLENBQUMsQ0FBQyxFQUFBOztvQkFoQkgsU0FnQkcsQ0FBQzs7Ozs7Q0FDSjtBQUNELFFBQVEsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnOyAvLyBmaWxlIHN5c3RlbVxyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7ICAvLyBvciBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcclxuaW1wb3J0IHsgcHJvZ3JhbSwgQ29tbWFuZGVyRXJyb3IgfSBmcm9tICdjb21tYW5kZXInO1xyXG5pbXBvcnQgKiBhcyByZWFkbGluZSBmcm9tICdyZWFkbGluZSc7XHJcbmltcG9ydCB7IERlZmF1bHREZXNlcmlhbGl6ZXIgfSBmcm9tICd2OCc7XHJcbmNvbnN0IGRkID0gY29uc29sZS5sb2c7XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgbWFpbigpIHtcclxuXHRjb25zdCAgaW5wdXRGaWxlUGF0aCA9IGF3YWl0IGlucHV0UGF0aCggdHJhbnNsYXRlKCdZQU1MIFVURi04IGZpbGUgcGF0aD4nKSApO1xyXG5cdGNvbnN0ICBwYXJlbnRQYXRoID0gcGF0aC5kaXJuYW1lKGlucHV0RmlsZVBhdGgpO1xyXG5cdGlucHV0RmlsZVBhcmVudFBhdGggPSBwYXJlbnRQYXRoO1xyXG5cdGxldCAgcHJldmlvdXNUZW1wbGF0ZUNvdW50ID0gMDtcclxuXHRmb3IoOzspIHtcclxuXHRcdGxldCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5wdXRGaWxlUGF0aCksXHJcblx0XHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHRcdH0pO1xyXG5cdFx0bGV0ICBpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRsZXQgIHNldHRpbmc6IFNldHRpbmdzID0ge307XHJcblx0XHRsZXQgIHNldHRpbmdDb3VudCA9IDA7XHJcblx0XHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cdFx0bGV0ICB0ZW1wbGF0ZUNvdW50ID0gMDtcclxuXHRcdGxldCAgZmlsZVRlbXBsYXRlVGFnOiBUZW1wbGF0ZVRhZyB8IG51bGwgPSBudWxsO1xyXG5cdFx0bGV0ICBlcnJvckNvdW50ID0gMDtcclxuXHRcdGxldCAgd2FybmluZ0NvdW50ID0gMDtcclxuXHRcdGxldCAgc2VjcmV0TGFiZWxDb3VudCA9IDA7XHJcblx0XHRjb25zdCAgbGluZXMgPSBbXTtcclxuXHRcdGNvbnN0ICBrZXl3b3JkczogU2VhcmNoS2V5d29yZFtdID0gW107XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0XHRsaW5lcy5wdXNoKGxpbmUpO1xyXG5cdFx0XHRsaW5lTnVtICs9IDE7XHJcblx0XHRcdGNvbnN0ICBwcmV2aW91c0lzUmVhZGluZ1NldHRpbmcgPSBpc1JlYWRpbmdTZXR0aW5nO1xyXG5cclxuXHRcdFx0Ly8gc2V0dGluZyA9IC4uLlxyXG5cdFx0XHRpZiAobGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsICB8fCAgbGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0XHRpZiAoc2V0dGluZ0NvdW50ID49IDEpIHtcclxuXHRcdFx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlzRW5kT2ZTZXR0aW5nKGxpbmUsIGlzUmVhZGluZ1NldHRpbmcpKSB7XHJcblx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRcdFx0Y29uc3QgIHNlcGFyYXRvciA9IGxpbmUuaW5kZXhPZignOicpO1xyXG5cdFx0XHRcdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5ID0gbGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShsaW5lLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0dGluZ1trZXldID0ge3ZhbHVlLCBpc1JlZmVyZW5jZWQ6IGZhbHNlLCBsaW5lTnVtfTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbCAgJiYgIGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiBwcmV2aW91cyBsaW5lIGhhcyBcInRlbXBsYXRlXCIgcmVwbGFjZWQgY29udGVudHMuXHJcblx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0ID49IDEgICYmICB0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke3RyYW5zbGF0ZSgnVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwJyl9YCk7XHJcblx0XHRcdFx0dGVtcGxhdGVUYWcuaXNGb3VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRlbXBsYXRlQ291bnQgKz0gMTtcclxuXHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUNvdW50ICs9IDE7XHJcblx0XHRcdFx0Y29uc3QgIGNoZWNraW5nTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoZXhwZWN0ZWQpID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldH1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtjaGVja2luZ0xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0V4cGVjdGVkJyl9OiAke2V4cGVjdGVkfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayB0YXJnZXQgZmlsZSBjb250ZW50cyBieSBcIiNmaWxlLXRlbXBsYXRlOlwiIHRhZy5cclxuXHRcdFx0aWYgKGZpbGVUZW1wbGF0ZVRhZykge1xyXG5cdFx0XHRcdGNvbnN0IGNvbnRpbnVlXyA9IGZpbGVUZW1wbGF0ZVRhZy5vblJlYWRMaW5lKGxpbmUpO1xyXG5cdFx0XHRcdGlmICghY29udGludWVfKSB7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgIGNoZWNrUGFzc2VkID0gYXdhaXQgZmlsZVRlbXBsYXRlVGFnLmNoZWNrVGFyZ2V0Q29udGVudHMoXHJcblx0XHRcdFx0XHRcdHNldHRpbmcsIGlucHV0RmlsZVBhdGgsIGxpbmVOdW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFjaGVja1Bhc3NlZCkge1xyXG5cdFx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmaWxlVGVtcGxhdGVUYWcgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGVtcGxhdGVUYWcubGFiZWwgPT09IGZpbGVUZW1wbGF0ZUxhYmVsKSB7XHJcblx0XHRcdFx0ZmlsZVRlbXBsYXRlVGFnID0gdGVtcGxhdGVUYWc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIG5vdCBcIiPimIVOb3c6XCIuXHJcblx0XHRcdGZvciAobGV0IHRlbXBvcmFyeUxhYmVsIG9mIHRlbXBvcmFyeUxhYmVscykge1xyXG5cdFx0XHRcdGlmIChsaW5lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZW1wb3JhcnlMYWJlbC50b0xvd2VyQ2FzZSgpKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHR3YXJuaW5nQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIG5vdCBzZWNyZXQgdGFnLlxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKCBzZWNyZXRMYWJlbCApICE9PSBub3RGb3VuZCAgfHwgIGxpbmUuaW5kZXhPZiggc2VjcmV0TGFiZWxFbiApICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdGlmIChsaW5lLmluZGV4T2YoIHNlY3JldEV4YW1sZUxhYmVsICkgPT09IG5vdEZvdW5kICAmJiAgbGluZS5pbmRleE9mKCBzZWNyZXRFeGFtbGVMYWJlbEVuICkgPT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VjcmV0TGFiZWxDb3VudCA9PT0gMCkgeyAgLy8gQmVjYXVzZSB0aGVyZSB3aWxsIGJlIG1hbnkgc2VjcmV0IGRhdGEuXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1dhcm5pbmdMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdUaGlzIGlzIGEgc2VjcmV0IHZhbHVlLicpfWApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnKyB0cmFuc2xhdGVgQ2hhbmdlIFwiJHtzZWNyZXRMYWJlbEVufVwiIHRvIFwiJHtzZWNyZXRFeGFtbGVMYWJlbEVufVwiLidgKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJysgdHJhbnNsYXRlYENoYW5nZSBcIiR7c2VjcmV0TGFiZWx9XCIgdG8gXCIke3NlY3JldEV4YW1sZUxhYmVsfVwiLidgKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRcdHdhcm5pbmdDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c2VjcmV0TGFiZWxDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gR2V0IHRpdGxlcyBhYm92ZSBvciBmb2xsb3dpbmcuXHJcblx0XHRcdGxldCAgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XHJcblx0XHRcdHJlZmVyUGF0dGVybi5sYXN0SW5kZXggPSAwO1xyXG5cclxuXHRcdFx0d2hpbGUgKCAobWF0Y2ggPSByZWZlclBhdHRlcm4uZXhlYyggbGluZSApKSAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHRjb25zdCAga2V5d29yZCA9IG5ldyBTZWFyY2hLZXl3b3JkKCk7XHJcblx0XHRcdFx0Y29uc3QgIGxhYmVsID0gbWF0Y2hbMV07XHJcblx0XHRcdFx0a2V5d29yZC5rZXl3b3JkID0gbWF0Y2hbM107XHJcblx0XHRcdFx0aWYgKGxhYmVsID09PSBcIuS4iuiomFwiICB8fCAgbGFiZWwgPT09IFwiYWJvdmVcIikge1xyXG5cdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBsaW5lTnVtIC0gMTtcclxuXHRcdFx0XHRcdGtleXdvcmQuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkFib3ZlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobGFiZWwgPT09IFwi5LiL6KiYXCIgIHx8ICBsYWJlbCA9PT0gXCJmb2xsb3dpbmdcIikge1xyXG5cdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBsaW5lTnVtICsgMTtcclxuXHRcdFx0XHRcdGtleXdvcmQuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkZvbGxvd2luZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0a2V5d29yZHMucHVzaChrZXl3b3JkKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHNldHRpbmdDb3VudCA+PSAxKSB7XHJcblx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIHRoZSB0aXRsZSBhYm92ZSBvciBmb2xsb3dpbmcuXHJcblx0XHRyZWFkZXIgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShpbnB1dEZpbGVQYXRoKSxcclxuXHRcdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdFx0fSk7XHJcblx0XHRsaW5lTnVtID0gMDtcclxuXHJcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRcdGxpbmVOdW0gKz0gMTtcclxuXHJcblx0XHRcdGZvciAoY29uc3Qga2V5d29yZCBvZiBrZXl3b3Jkcykge1xyXG5cdFx0XHRcdGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkFib3ZlKSB7XHJcblx0XHRcdFx0XHRpZiAobGluZU51bSA8PSBrZXl3b3JkLnN0YXJ0TGluZU51bSkge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihrZXl3b3JkLmtleXdvcmQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gZm91bmRGb3JBYm92ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Gb2xsb3dpbmcpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5lTnVtID49IGtleXdvcmQuc3RhcnRMaW5lTnVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAobGluZS5pbmRleE9mKGtleXdvcmQua2V5d29yZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBmb3VuZEZvckZvbGxvd2luZztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIGtleXdvcmRzKSB7XHJcblx0XHRcdGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkFib3ZlKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuc3RhcnRMaW5lTnVtICE9PSBmb3VuZEZvckFib3ZlKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtrZXl3b3JkLnN0YXJ0TGluZU51bSArIDF9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnICsgdHJhbnNsYXRlYE5vdCBmb3VuZCBcIiR7a2V5d29yZC5rZXl3b3JkfVwiIGFib3ZlYCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uRm9sbG93aW5nKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuc3RhcnRMaW5lTnVtICE9PSBmb3VuZEZvckZvbGxvd2luZykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7a2V5d29yZC5zdGFydExpbmVOdW0gLSAxfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJyArIHRyYW5zbGF0ZWBOb3QgZm91bmQgXCIke2tleXdvcmQua2V5d29yZH1cIiBmb2xsb3dpbmdgKTtcclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTaG93IHRoZSByZXN1bHRcclxuXHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnV2FybmluZycpfTogJHt3YXJuaW5nQ291bnR9LCAke3RyYW5zbGF0ZSgnRXJyb3InKX06ICR7ZXJyb3JDb3VudH1gKTtcclxuXHRcdGlmIChwcmV2aW91c1RlbXBsYXRlQ291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCd0ZW1wbGF0ZSBjb3VudCcpfSA9ICR7cHJldmlvdXNUZW1wbGF0ZUNvdW50fSAoJHt0cmFuc2xhdGUoJ2luIHByZXZpb3VzIGNoZWNrJyl9KWApO1xyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCd0ZW1wbGF0ZSBjb3VudCcpfSA9ICR7dGVtcGxhdGVDb3VudH1gKTtcclxuXHJcblx0XHQvLyBSZXNjYW4gb3IgY2hhbmdlIGEgdmFsdWVcclxuXHRcdGxldCAgbG9vcCA9IHRydWU7XHJcblx0XHR3aGlsZSAobG9vcCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGUoJ1ByZXNzIEVudGVyIGtleSB0byByZXRyeSBjaGVja2luZy4nKSk7XHJcblxyXG5cdFx0XHRjb25zdCAga2V5ID0gYXdhaXQgaW5wdXQodHJhbnNsYXRlKCdUaGUgbGluZSBudW1iZXIgdG8gY2hhbmdlIHRoZSB2YXJpYWJsZSB2YWx1ZSA+JykpO1xyXG5cdFx0XHRlcnJvckNvdW50ID0gMDtcclxuXHRcdFx0aWYgKGtleSA9PT0gJ2V4aXQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGtleSAhPT0gJycpIHtcclxuXHRcdFx0XHRjb25zdCAgbGluZU51bSA9IHBhcnNlSW50KGtleSk7XHJcblx0XHRcdFx0Y29uc3QgIGNoYW5naW5nU2V0dGluZ0luZGV4ID0gYXdhaXQgZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW0oaW5wdXRGaWxlUGF0aCwgbGluZU51bSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7Y2hhbmdpbmdTZXR0aW5nSW5kZXh9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlKCdFbnRlciBvbmx5OiBmaW5pc2ggdG8gaW5wdXQgc2V0dGluZycpKTtcclxuXHRcdFx0XHRmb3IgKDs7KSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5VmFsdWUgPSBhd2FpdCBpbnB1dCh0cmFuc2xhdGUoJ2tleTogbmV3X3ZhbHVlPicpKTtcclxuXHRcdFx0XHRcdGlmIChrZXlWYWx1ZSA9PT0gJycpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IGF3YWl0IGNoYW5nZVNldHRpbmdCeUtleVZhbHVlKGlucHV0RmlsZVBhdGgsIGNoYW5naW5nU2V0dGluZ0luZGV4LCBrZXlWYWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxvb3AgPSAoZXJyb3JDb3VudCA+PSAxKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXNjYW5cclxuXHRcdGNvbnNvbGUubG9nKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XHJcblx0XHRwcmV2aW91c1RlbXBsYXRlQ291bnQgPSB0ZW1wbGF0ZUNvdW50XHJcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzZXR0aW5nKSkge1xyXG5cdFx0XHRzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBjaGFuZ2VTZXR0aW5nQnlLZXlWYWx1ZVxyXG5hc3luYyBmdW5jdGlvbiAgY2hhbmdlU2V0dGluZ0J5S2V5VmFsdWUoaW5wdXRGaWxlUGF0aDogc3RyaW5nLCBjaGFuZ2luZ1NldHRpbmdJbmRleDogbnVtYmVyLFxyXG5cdFx0a2V5VmFsdWU6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPi8qZXJyb3JDb3VudCovIHtcclxuXHJcblx0Y29uc3QgIHNlcGFyYXRvciA9IGtleVZhbHVlLmluZGV4T2YoJzonKTtcclxuXHRpZiAoc2VwYXJhdG9yICE9PSBub3RGb3VuZCkge1xyXG5cdFx0Y29uc3QgIGtleSA9IGtleVZhbHVlLnN1YnN0cigwLCBzZXBhcmF0b3IpLnRyaW0oKTtcclxuXHRcdGNvbnN0ICB2YWx1ZSA9IGdldFZhbHVlKGtleVZhbHVlLCBzZXBhcmF0b3IpO1xyXG5cclxuXHRcdHJldHVybiAgY2hhbmdlU2V0dGluZyhpbnB1dEZpbGVQYXRoLCBjaGFuZ2luZ1NldHRpbmdJbmRleCwga2V5LCB2YWx1ZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAgMTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGNoYW5nZVNldHRpbmdcclxuYXN5bmMgZnVuY3Rpb24gIGNoYW5nZVNldHRpbmcoaW5wdXRGaWxlUGF0aDogc3RyaW5nLCBjaGFuZ2luZ1NldHRpbmdJbmRleDogbnVtYmVyLFxyXG5cdFx0Y2hhbmdpbmdLZXk6IHN0cmluZywgY2hhbmdlZFZhbHVlQW5kQ29tbWVudDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+LyplcnJvckNvdW50Ki8ge1xyXG5cclxuXHRjb25zdCAgYmFja1VwRmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoICtcIi5iYWNrdXBcIjtcclxuXHRpZiAoIWZzLmV4aXN0c1N5bmMoYmFja1VwRmlsZVBhdGgpKSB7XHJcblx0XHRmcy5jb3B5RmlsZVN5bmMoaW5wdXRGaWxlUGF0aCwgYmFja1VwRmlsZVBhdGgpO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgIG9sZEZpbGVQYXRoID0gaW5wdXRGaWxlUGF0aDtcclxuXHRjb25zdCAgbmV3RmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoICtcIi5uZXdcIjtcclxuXHRjb25zdCAgd3JpdGVyID0gbmV3IFdyaXRlQnVmZmVyKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKG5ld0ZpbGVQYXRoKSk7XHJcblx0Y29uc3QgIHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShvbGRGaWxlUGF0aCksXHJcblx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0fSk7XHJcblx0Y29uc3QgIGxpbmVzID0gW107XHJcblx0bGV0ICBpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0bGV0ICBzZXR0aW5nOiBTZXR0aW5ncyA9IHt9O1xyXG5cdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRsZXQgIGNoYW5nZWRWYWx1ZSA9IGdldENoYW5nZWRWYWx1ZShjaGFuZ2VkVmFsdWVBbmRDb21tZW50KTtcclxuXHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cdGxldCAgZXJyb3JDb3VudCA9IDA7XHJcblx0bGV0ICBpc0NoYW5naW5nID0gZmFsc2U7XHJcblx0XHJcblx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdGNvbnN0ICBsaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdGxpbmVzLnB1c2gobGluZSk7XHJcblx0XHRsaW5lTnVtICs9IDE7XHJcblx0XHRsZXQgIG91dHB1dCA9IGZhbHNlO1xyXG5cclxuXHRcdC8vIHNldHRpbmcgPSAuLi5cclxuXHRcdGlmIChsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWwgIHx8ICBsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdFx0aWYgKGNoYW5naW5nU2V0dGluZ0luZGV4ID09PSBhbGxTZXR0aW5nKSB7XHJcblx0XHRcdFx0aXNDaGFuZ2luZyA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aXNDaGFuZ2luZyA9IChzZXR0aW5nQ291bnQgPT09IGNoYW5naW5nU2V0dGluZ0luZGV4KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChpc0VuZE9mU2V0dGluZyhsaW5lLCBpc1JlYWRpbmdTZXR0aW5nKSkge1xyXG5cdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNDaGFuZ2luZykge1xyXG5cclxuXHRcdFx0aWYgKGlzUmVhZGluZ1NldHRpbmcpIHtcclxuXHRcdFx0XHRjb25zdCAgc2VwYXJhdG9yID0gbGluZS5pbmRleE9mKCc6Jyk7XHJcblx0XHRcdFx0aWYgKHNlcGFyYXRvciAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBrZXkgPSBsaW5lLnN1YnN0cigwLCBzZXBhcmF0b3IpLnRyaW0oKTtcclxuXHRcdFx0XHRcdGNvbnN0ICB2YWx1ZSA9IGdldFZhbHVlKGxpbmUsIHNlcGFyYXRvcik7XHJcblx0XHRcdFx0XHRpZiAodmFsdWUgIT09ICcnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nW2tleV0gPSB7dmFsdWUsIGlzUmVmZXJlbmNlZDogZmFsc2UsIGxpbmVOdW19O1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChrZXkgKyAnOicgIT09IHNldHRpbmdTdGFydExhYmVsICAmJiAga2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbEVuKSB7XHJcblx0XHRcdFx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoa2V5ID09PSBjaGFuZ2luZ0tleSkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgY29tbWVudEluZGV4ID0gbGluZS5pbmRleE9mKCcjJywgc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdFx0bGV0ICBjb21tZW50PSAnJztcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1lbnRJbmRleCAhPT0gbm90Rm91bmQgICYmICBjaGFuZ2VkVmFsdWVBbmRDb21tZW50LmluZGV4T2YoJyMnKSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0XHRjb21tZW50ID0gJyAgJyArIGxpbmUuc3Vic3RyKGNvbW1lbnRJbmRleCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHdyaXRlci53cml0ZShsaW5lLnN1YnN0cigwLCBzZXBhcmF0b3IgKyAxKSArJyAnKyBjaGFuZ2VkVmFsdWVBbmRDb21tZW50ICsgY29tbWVudCArIFwiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE91dCBvZiBzZXR0aW5nc1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBjaGVja2luZ0xpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cdFx0XHRcdFx0Y29uc3QgIGNoYW5nZWQgPSBnZXRDaGFuZ2VkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZVRhZy50ZW1wbGF0ZSwgY2hhbmdpbmdLZXksIGNoYW5nZWRWYWx1ZSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGV4cGVjdGVkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgIGJlZm9yZSA9IGV4cGVjdGVkO1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgYWZ0ZXIgPSBjaGFuZ2VkO1xyXG5cdFx0XHRcdFx0XHRpZiAodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCA8PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0ICBhYm92ZUxpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0XHRcdFx0d3JpdGVyLnJlcGxhY2VBYm92ZUxpbmUodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCxcclxuXHRcdFx0XHRcdFx0XHRcdGFib3ZlTGluZS5yZXBsYWNlKGJlZm9yZSwgYWZ0ZXIpK1wiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0XHR3cml0ZXIud3JpdGUobGluZS5yZXBsYWNlKGJlZm9yZSwgYWZ0ZXIpICtcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGNoYW5nZWQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHQvLyBEbyBub3RoaW5nXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoZXJyb3JDb3VudCA9PT0gMCkgeyAvLyBTaW5jZSBvbmx5IG9uZSBvbGQgdmFsdWUgY2FuIGJlIHJlcGxhY2VkIGF0IGEgdGltZVxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHt0cmFuc2xhdGUoJ05vdCBmb3VuZCBhbnkgcmVwbGFjaW5nIHRhcmdldCcpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTb2x1dGlvbicpfTogJHt0cmFuc2xhdGUoJ1NldCBvbGQgdmFsdWUgYXQgc2V0dGluZ3MgaW4gdGhlIHJlcGxhY2luZyBmaWxlJyl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFeHBlY3RlZCcpfTogJHtleHBlY3RlZC50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnU2V0dGluZ0luZGV4Jyl9OiAke3NldHRpbmdDb3VudH1gKTtcclxuXHRcdFx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghb3V0cHV0KSB7XHJcblx0XHRcdHdyaXRlci53cml0ZShsaW5lICtcIlxcblwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0d3JpdGVyLmVuZCgpO1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUpID0+IHtcclxuXHRcdHdyaXRlci5vbignZmluaXNoJywgKCkgPT4ge1xyXG5cdFx0XHRmcy5jb3B5RmlsZVN5bmMobmV3RmlsZVBhdGgsIGlucHV0RmlsZVBhdGgpO1xyXG5cdFx0XHRkZWxldGVGaWxlKG5ld0ZpbGVQYXRoKTtcclxuXHRcdFx0cmVzb2x2ZShlcnJvckNvdW50KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vLyBUZW1wbGF0ZVRhZ1xyXG5jbGFzcyAgVGVtcGxhdGVUYWcge1xyXG5cclxuXHRsYWJlbCA9ICcnO1xyXG5cdHRlbXBsYXRlID0gJyc7XHJcblx0aXNGb3VuZCA9IGZhbHNlO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZSB0YWdcclxuXHRpbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZS1hdCB0YWdcclxuXHRsaW5lTnVtT2Zmc2V0ID0gMDsgIFxyXG5cdHN0YXJ0SW5kZXhJbkxpbmUgPSBub3RGb3VuZDtcclxuXHRlbmRJbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cclxuXHQvLyBmb3IgZmlsZS10ZW1wbGF0ZSB0YWdcclxuXHR0ZW1wbGF0ZUxpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdGluZGVudEF0VGFnID0gJyc7XHJcblx0bWluSW5kZW50TGVuZ3RoID0gMDtcclxuXHJcblx0b25GaWxlVGVtcGxhdGVUYWdSZWFkaW5nKGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5pbmRlbnRBdFRhZyA9IGluZGVudFJlZ3VsYXJFeHByZXNzaW9uLmV4ZWMobGluZSkhWzBdO1xyXG5cdFx0dGhpcy5taW5JbmRlbnRMZW5ndGggPSBtYXhOdW1iZXI7XHJcblx0fVxyXG5cdG9uUmVhZExpbmUobGluZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcblx0XHRjb25zdCAgY3VycmVudEluZGVudCA9IGluZGVudFJlZ3VsYXJFeHByZXNzaW9uLmV4ZWMobGluZSkhWzBdO1xyXG5cdFx0bGV0ICByZWFkaW5nTmV4dCA9IHRydWU7XHJcblx0XHRpZiAoY3VycmVudEluZGVudC5sZW5ndGggPiB0aGlzLmluZGVudEF0VGFnLmxlbmd0aCAgJiYgIGxpbmUuc3RhcnRzV2l0aCh0aGlzLmluZGVudEF0VGFnKSkge1xyXG5cclxuXHRcdFx0dGhpcy50ZW1wbGF0ZUxpbmVzLnB1c2gobGluZSk7XHJcblx0XHRcdHRoaXMubWluSW5kZW50TGVuZ3RoID0gTWF0aC5taW4odGhpcy5taW5JbmRlbnRMZW5ndGgsIGN1cnJlbnRJbmRlbnQubGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMudGVtcGxhdGVMaW5lcyA9IHRoaXMudGVtcGxhdGVMaW5lcy5tYXAoKGxpbmUpPT4oXHJcblx0XHRcdFx0bGluZS5zdWJzdHIodGhpcy5taW5JbmRlbnRMZW5ndGgpKSk7XHJcblx0XHRcdHJlYWRpbmdOZXh0ID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHJlYWRpbmdOZXh0O1xyXG5cdH1cclxuXHRhc3luYyAgY2hlY2tUYXJnZXRDb250ZW50cyhzZXR0aW5nOiBTZXR0aW5ncywgaW5wdXRGaWxlUGF0aDogc3RyaW5nLCB0ZW1wbGF0ZUVuZExpbmVOdW06IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG5cclxuXHRcdC8vIFRPRE86IOOCpOODs+ODh+ODs+ODiOOCkuOCueODnuODvOODiOOBq+aPg+OBiOOCi1xyXG5cdFx0Ly8g44Gp44GG44KE44Gj44Gm77yfXHJcblx0XHJcblx0XHRjb25zdCAgcGFyZW50UGF0aCA9IHBhdGguZGlybmFtZShpbnB1dEZpbGVQYXRoKTtcclxuXHRcdGNvbnN0ICB0YXJnZXRGaWxlUGF0aCA9IHBhdGguam9pbihwYXJlbnRQYXRoLCBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGhpcy50ZW1wbGF0ZSkpO1xyXG5cdFx0aWYgKCFmcy5leGlzdHNTeW5jKHRhcmdldEZpbGVQYXRoKSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYEVycm9yOiAke3RyYW5zbGF0ZSgnTm90Rm91bmQnKX06ICR7dGFyZ2V0RmlsZVBhdGh9YCk7XHJcblx0XHRcdHJldHVybiAgZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCAgdGFyZ2V0RmlsZVJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKHRhcmdldEZpbGVQYXRoKSxcclxuXHRcdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdFx0fSk7XHJcblx0XHRpZiAodGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgIGV4cGVjdGVkRmlyc3RMaW5lID0gZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGUoc2V0dGluZywgdGhpcy50ZW1wbGF0ZUxpbmVzWzBdKTtcclxuXHRcdGxldCAgdGVtcGxhdGVMaW5lSW5kZXggPSAwO1xyXG5cdFx0bGV0ICB0YXJnZXRMaW5lTnVtID0gMDtcclxuXHRcdGxldCAgZXJyb3JUZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRsZXQgIGVycm9yVGFyZ2V0TGluZU51bSA9IDA7XHJcblx0XHRsZXQgIGVycm9yQ29udGVudHMgPSAnJztcclxuXHRcdGxldCAgZXJyb3JFeHBlY3RlZCA9ICcnO1xyXG5cdFx0bGV0ICBlcnJvclRlbXBsYXRlID0gJyc7XHJcblx0XHRsZXQgIGluZGVudCA9ICcnO1xyXG5cdFx0bGV0ICBzYW1lID0gZmFsc2U7XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiB0YXJnZXRGaWxlUmVhZGVyKSB7XHJcblx0XHRcdGNvbnN0ICB0YXJnZXRMaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdFx0dGFyZ2V0TGluZU51bSArPSAxO1xyXG5cdFx0XHRpZiAodGVtcGxhdGVMaW5lSW5kZXggPT09IDApIHtcclxuXHJcblx0XHRcdFx0Y29uc3QgIGluZGVudExlbmd0aCA9IHRhcmdldExpbmUuaW5kZXhPZihleHBlY3RlZEZpcnN0TGluZSk7XHJcblx0XHRcdFx0aWYgKGluZGVudExlbmd0aCA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdHNhbWUgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2FtZSA9IHRydWU7XHJcblx0XHRcdFx0XHRpbmRlbnQgPSB0YXJnZXRMaW5lLnN1YnN0cigwLCBpbmRlbnRMZW5ndGgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHsgLy8gbGluZUluZGV4ID49IDFcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZShcclxuXHRcdFx0XHRcdHNldHRpbmcsIHRoaXMudGVtcGxhdGVMaW5lc1t0ZW1wbGF0ZUxpbmVJbmRleF0pO1xyXG5cclxuXHRcdFx0XHRzYW1lID0gKHRhcmdldExpbmUgPT09IGluZGVudCArIGV4cGVjdGVkKTtcclxuXHRcdFx0XHRpZiAoIXNhbWUpIHtcclxuXHRcdFx0XHRcdGVycm9yVGVtcGxhdGVMaW5lSW5kZXggPSB0ZW1wbGF0ZUxpbmVJbmRleDtcclxuXHRcdFx0XHRcdGVycm9yVGFyZ2V0TGluZU51bSA9IHRhcmdldExpbmVOdW07XHJcblx0XHRcdFx0XHRlcnJvckNvbnRlbnRzID0gdGFyZ2V0TGluZTtcclxuXHRcdFx0XHRcdGVycm9yRXhwZWN0ZWQgPSBpbmRlbnQgKyBleHBlY3RlZDtcclxuXHRcdFx0XHRcdGVycm9yVGVtcGxhdGUgPSBpbmRlbnQgKyB0aGlzLnRlbXBsYXRlTGluZXNbdGVtcGxhdGVMaW5lSW5kZXhdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2FtZSkge1xyXG5cdFx0XHRcdHRlbXBsYXRlTGluZUluZGV4ICs9IDE7XHJcblx0XHRcdFx0aWYgKHRlbXBsYXRlTGluZUluZGV4ID49IHRoaXMudGVtcGxhdGVMaW5lcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghc2FtZSkge1xyXG5cdFx0XHRjb25zdCAgdGVtcGxhdGVMaW5lTnVtID0gdGVtcGxhdGVFbmRMaW5lTnVtIC0gdGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCArIGVycm9yVGVtcGxhdGVMaW5lSW5kZXg7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3R5cHJtRmlsZScpfTogJHtnZXRUZXN0YWJsZShpbnB1dEZpbGVQYXRoKX06JHt0ZW1wbGF0ZUxpbmVOdW19YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JGaWxlJyl9OiAke2dldFRlc3RhYmxlKHRhcmdldEZpbGVQYXRoKX06JHtlcnJvclRhcmdldExpbmVOdW19YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIENvbnRlbnRzOiAke2Vycm9yQ29udGVudHN9YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIEV4cGVjdGVkOiAke2Vycm9yRXhwZWN0ZWR9YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIFRlbXBsYXRlOiAke2Vycm9yVGVtcGxhdGV9YCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHNhbWU7XHJcblx0fVxyXG59XHJcblxyXG4vLyBvbkVuZE9mU2V0dGluZ1xyXG5mdW5jdGlvbiBvbkVuZE9mU2V0dGluZyhzZXR0aW5nOiBTZXR0aW5ncykge1xyXG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRpZiAoIXNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlYE5vdCByZWZlcmVuY2VkOiAke2tleX0gaW4gbGluZSAke3NldHRpbmdba2V5XS5saW5lTnVtfWApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy8gZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW1cclxuYXN5bmMgZnVuY3Rpb24gIGdldFNldHRpbmdJbmRleEZyb21MaW5lTnVtKGlucHV0RmlsZVBhdGg6IHN0cmluZywgdGFyZ2V0TGluZU51bTogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuXHRjb25zdCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdH0pO1xyXG5cdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cclxuXHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0bGluZU51bSArPSAxO1xyXG5cclxuXHRcdGlmIChsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWwgIHx8ICBsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobGluZU51bSA9PT0gdGFyZ2V0TGluZU51bSkge1xyXG5cdFx0XHRyZXR1cm4gIHNldHRpbmdDb3VudDtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICAwO1xyXG59XHJcblxyXG4vLyBpc0VuZE9mU2V0dGluZ1xyXG5mdW5jdGlvbiAgaXNFbmRPZlNldHRpbmcobGluZTogc3RyaW5nLCBpc1JlYWRpbmdTZXR0aW5nOiBib29sZWFuKTogYm9vbGVhbiB7XHJcblx0bGV0ICByZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRjb25zdCBjb21tZW50ID0gbGluZS5pbmRleE9mKCcjJyk7XHJcblx0XHRsZXQgbGVmdE9mQ29tbWVudDogc3RyaW5nO1xyXG5cdFx0aWYgKGNvbW1lbnQgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdGxlZnRPZkNvbW1lbnQgPSBsaW5lLnN1YnN0cigwLCBsaW5lLmluZGV4T2YoJyMnKSkudHJpbSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGxlZnRPZkNvbW1lbnQgPSBsaW5lLnRyaW0oKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobGVmdE9mQ29tbWVudC5pbmRleE9mKCc6JykgPT09IG5vdEZvdW5kICAmJiAgbGVmdE9mQ29tbWVudCAhPT0gJycpIHtcclxuXHRcdFx0cmV0dXJuVmFsdWUgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmIChsZWZ0T2ZDb21tZW50LnN1YnN0cigtMSkgPT09ICd8Jykge1xyXG5cdFx0XHRyZXR1cm5WYWx1ZSA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAgcmV0dXJuVmFsdWU7XHJcbn1cclxuXHJcbi8vIGRlbGV0ZUZpbGVcclxuZnVuY3Rpb24gIGRlbGV0ZUZpbGUocGF0aDogc3RyaW5nKSB7XHJcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoKSkge1xyXG4gICAgICAgIGZzLnVubGlua1N5bmMocGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGdldFZhbHVlXHJcbmZ1bmN0aW9uICBnZXRWYWx1ZShsaW5lOiBzdHJpbmcsIHNlcGFyYXRvckluZGV4OiBudW1iZXIpIHtcclxuXHRsZXQgICAgdmFsdWUgPSBsaW5lLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpLnRyaW0oKTtcclxuXHRjb25zdCAgY29tbWVudCA9IHZhbHVlLmluZGV4T2YoJyMnKTtcclxuXHRpZiAoY29tbWVudCAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyKDAsIGNvbW1lbnQpLnRyaW0oKTtcclxuXHR9XHJcblx0cmV0dXJuICB2YWx1ZTtcclxufVxyXG5cclxuLy8gZ2V0RXhwZWN0ZWRMaW5lXHJcbmZ1bmN0aW9uICBnZXRFeHBlY3RlZExpbmUoc2V0dGluZzogU2V0dGluZ3MsIHRlbXBsYXRlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdGxldCAgZXhwZWN0ZWQgPSB0ZW1wbGF0ZTtcclxuXHJcblx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZykpIHtcclxuXHRcdGNvbnN0ICByZSA9IG5ldyBSZWdFeHAoIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uKGtleSksIFwiZ2lcIiApO1xyXG5cclxuXHRcdGNvbnN0ICBleHBlY3RlZEFmdGVyID0gZXhwZWN0ZWQucmVwbGFjZShyZSwgc2V0dGluZ1trZXldLnZhbHVlKTtcclxuXHRcdGlmIChleHBlY3RlZEFmdGVyICE9PSBleHBlY3RlZCkge1xyXG5cdFx0XHRzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWRBZnRlcjtcclxuXHR9XHJcblx0cmV0dXJuICBleHBlY3RlZDtcclxufVxyXG5cclxuLy8gZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGVcclxuZnVuY3Rpb24gIGdldEV4cGVjdGVkTGluZUluRmlsZVRlbXBsYXRlKHNldHRpbmc6IFNldHRpbmdzLCB0ZW1wbGF0ZTogc3RyaW5nKSB7XHJcblxyXG5cdGxldCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGUpO1xyXG5cdGNvbnN0ICB0ZW1wbGF0ZUluZGV4ID0gZXhwZWN0ZWQuaW5kZXhPZih0ZW1wbGF0ZUxhYmVsKTtcclxuXHRpZiAodGVtcGxhdGVJbmRleCAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRleHBlY3RlZCA9IGV4cGVjdGVkLnN1YnN0cigwLCB0ZW1wbGF0ZUluZGV4KTtcclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWQudHJpbVJpZ2h0KCk7XHJcblx0fVxyXG5cdHJldHVybiAgZXhwZWN0ZWQ7XHJcbn1cclxuXHJcbi8vIGdldENoYW5nZWRMaW5lXHJcbmZ1bmN0aW9uICBnZXRDaGFuZ2VkTGluZShzZXR0aW5nOiBTZXR0aW5ncywgdGVtcGxhdGU6IHN0cmluZywgY2hhbmdpbmdLZXk6IHN0cmluZywgY2hhbmdlZFZhbHVlOiBzdHJpbmcpIHtcclxuXHRsZXQgIGNoYW5nZWRMaW5lID0gJyc7XHJcblx0aWYgKGNoYW5naW5nS2V5IGluIHNldHRpbmcpIHtcclxuXHRcdGNvbnN0ICBjaGFuZ2luZ1ZhbHVlID0gc2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWU7XHJcblxyXG5cdFx0c2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWUgPSBjaGFuZ2VkVmFsdWU7XHJcblxyXG5cdFx0Y2hhbmdlZExpbmUgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGUpO1xyXG5cdFx0c2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWUgPSBjaGFuZ2luZ1ZhbHVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGFuZ2VkTGluZSA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0fVxyXG5cdHJldHVybiAgY2hhbmdlZExpbmU7XHJcbn1cclxuXHJcbi8vIGdldENoYW5nZWRWYWx1ZVxyXG5mdW5jdGlvbiAgZ2V0Q2hhbmdlZFZhbHVlKGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0Y29uc3QgIGNvbW1lbnRJbmRleCA9IGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuaW5kZXhPZignIycpO1xyXG5cdGxldCAgY2hhbmdlZFZhbHVlOiBzdHJpbmc7XHJcblx0aWYgKGNvbW1lbnRJbmRleCAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRjaGFuZ2VkVmFsdWUgPSBjaGFuZ2VkVmFsdWVBbmRDb21tZW50LnN1YnN0cigwLCBjb21tZW50SW5kZXgpLnRyaW0oKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y2hhbmdlZFZhbHVlID0gY2hhbmdlZFZhbHVlQW5kQ29tbWVudDtcclxuXHR9XHJcblx0cmV0dXJuICBjaGFuZ2VkVmFsdWU7XHJcbn1cclxuXHJcbi8vIHBhcnNlVGVtcGxhdGVUYWdcclxuZnVuY3Rpb24gIHBhcnNlVGVtcGxhdGVUYWcobGluZTogc3RyaW5nKTogVGVtcGxhdGVUYWcge1xyXG5cdGNvbnN0ICB0YWcgPSBuZXcgVGVtcGxhdGVUYWcoKTtcclxuXHJcblx0dGFnLmxhYmVsID0gdGVtcGxhdGVMYWJlbDtcclxuXHR0YWcuaW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YodGVtcGxhdGVMYWJlbCk7XHJcblx0aWYgKHRhZy5pbmRleEluTGluZSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5sYWJlbCA9IGZpbGVUZW1wbGF0ZUxhYmVsO1xyXG5cdFx0dGFnLmluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKGZpbGVUZW1wbGF0ZUxhYmVsKTtcclxuXHR9XHJcblx0aWYgKHRhZy5pbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5pc0ZvdW5kID0gdHJ1ZTtcclxuXHRcdGNvbnN0ICBsZWZ0T2ZUZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKDAsIHRhZy5pbmRleEluTGluZSkudHJpbSgpO1xyXG5cdFx0aWYgKHRhZy5sYWJlbCA9PT0gZmlsZVRlbXBsYXRlTGFiZWwpIHtcclxuXHRcdFx0dGFnLm9uRmlsZVRlbXBsYXRlVGFnUmVhZGluZyhsaW5lKTtcclxuXHRcdH1cclxuXHJcblx0XHR0YWcudGVtcGxhdGUgPSBsaW5lLnN1YnN0cih0YWcuaW5kZXhJbkxpbmUgKyB0YWcubGFiZWwubGVuZ3RoKS50cmltKCk7XHJcblx0XHRpZiAobGVmdE9mVGVtcGxhdGUgPT09ICcnKSB7XHJcblx0XHRcdHRhZy5saW5lTnVtT2Zmc2V0ID0gLTE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YWcubGluZU51bU9mZnNldCA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHRhZztcclxuXHR9XHJcblxyXG5cdHRhZy5sYWJlbCA9IHRlbXBsYXRlQXRTdGFydExhYmVsO1xyXG5cdHRhZy5zdGFydEluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKHRlbXBsYXRlQXRTdGFydExhYmVsKTtcclxuXHRpZiAodGFnLnN0YXJ0SW5kZXhJbkxpbmUgIT09IG5vdEZvdW5kKSB7XHJcblx0XHR0YWcuaXNGb3VuZCA9IHRydWU7XHJcblx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgPSAgbGluZS5pbmRleE9mKHRlbXBsYXRlQXRFbmRMYWJlbCwgdGFnLnN0YXJ0SW5kZXhJbkxpbmUpO1xyXG5cdFx0aWYgKHRhZy5lbmRJbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRcdHRhZy50ZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKHRhZy5lbmRJbmRleEluTGluZSArIHRlbXBsYXRlQXRFbmRMYWJlbC5sZW5ndGgpLnRyaW0oKTtcclxuXHRcdFx0dGFnLmxpbmVOdW1PZmZzZXQgPSBwYXJzZUludChsaW5lLnN1YnN0cmluZyhcclxuXHRcdFx0XHR0YWcuc3RhcnRJbmRleEluTGluZSArIHRlbXBsYXRlQXRTdGFydExhYmVsLmxlbmd0aCxcclxuXHRcdFx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgKSk7XHJcblx0XHRcdHJldHVybiAgdGFnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGFnLmxhYmVsID0gJyc7XHJcblx0dGFnLnRlbXBsYXRlID0gJyc7XHJcblx0dGFnLmxpbmVOdW1PZmZzZXQgPSAwO1xyXG5cdHJldHVybiAgdGFnO1xyXG59XHJcblxyXG4vLyBlc2NhcGVSZWd1bGFyRXhwcmVzc2lvblxyXG5mdW5jdGlvbiAgZXNjYXBlUmVndWxhckV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKSB7XHJcblx0cmV0dXJuICBleHByZXNzaW9uLnJlcGxhY2UoL1tcXFxcXiQuKis/KClbXFxde318XS9nLCAnXFxcXCQmJyk7XHJcbn1cclxuXHJcbi8vIFN0YW5kYXJkSW5wdXRCdWZmZXJcclxuY2xhc3MgIFN0YW5kYXJkSW5wdXRCdWZmZXIge1xyXG5cdHJlYWRsaW5lczogcmVhZGxpbmUuSW50ZXJmYWNlO1xyXG5cdGlucHV0QnVmZmVyOiBzdHJpbmdbXSA9IFtdO1xyXG5cdGlucHV0UmVzb2x2ZXI/OiAoYW5zd2VyOnN0cmluZyk9PnZvaWQgPSB1bmRlZmluZWQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5yZWFkbGluZXMgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0XHRpbnB1dDogcHJvY2Vzcy5zdGRpbixcclxuXHRcdFx0b3V0cHV0OiBwcm9jZXNzLnN0ZG91dFxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5vbignbGluZScsIGFzeW5jIChsaW5lOiBzdHJpbmcpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMuaW5wdXRSZXNvbHZlcikge1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlcihsaW5lKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0UmVzb2x2ZXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5pbnB1dEJ1ZmZlci5wdXNoKGxpbmUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnJlYWRsaW5lcy5zZXRQcm9tcHQoJycpO1xyXG5cdFx0dGhpcy5yZWFkbGluZXMucHJvbXB0KCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyAgaW5wdXQoZ3VpZGU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0XHRyZXR1cm4gIG5ldyBQcm9taXNlKFxyXG5cdFx0XHQocmVzb2x2ZTogKGFuc3dlcjpzdHJpbmcpPT52b2lkLCAgcmVqZWN0OiAoYW5zd2VyOnN0cmluZyk9PnZvaWQgKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCAgbmV4dExpbmUgPSB0aGlzLmlucHV0QnVmZmVyLnNoaWZ0KCk7XHJcblx0XHRcdGlmIChuZXh0TGluZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgbmV4dExpbmUpO1xyXG5cdFx0XHRcdHJlc29sdmUobmV4dExpbmUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHByb2Nlc3Muc3Rkb3V0LndyaXRlKGd1aWRlKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0UmVzb2x2ZXIgPSByZXNvbHZlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGNsb3NlKCkge1xyXG5cdFx0dGhpcy5yZWFkbGluZXMuY2xvc2UoKTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIElucHV0T3B0aW9uXHJcbmNsYXNzIElucHV0T3B0aW9uIHtcclxuXHRpbnB1dExpbmVzOiBzdHJpbmdbXTtcclxuXHRuZXh0TGluZUluZGV4OiBudW1iZXI7XHJcblx0bmV4dFBhcmFtZXRlckluZGV4OiBudW1iZXI7ICAvLyBUaGUgaW5kZXggb2YgdGhlIHN0YXJ0aW5nIHByb2Nlc3MgcGFyYW1ldGVyc1xyXG5cclxuXHRjb25zdHJ1Y3RvcihpbnB1dExpbmVzOiBzdHJpbmdbXSkge1xyXG5cdFx0dGhpcy5pbnB1dExpbmVzID0gaW5wdXRMaW5lcztcclxuXHRcdHRoaXMubmV4dExpbmVJbmRleCA9IDA7XHJcblx0XHR0aGlzLm5leHRQYXJhbWV0ZXJJbmRleCA9IDI7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCAgdGVzdEJhc2VGb2xkZXIgPSBTdHJpbmcucmF3IGBSOlxcaG9tZVxcbWVtX2NhY2hlXFxNeURvY1xcc3JjXFxUeXBlU2NyaXB0XFx0eXBybVxcdGVzdF9kYXRhYCsnXFxcXCc7XHJcblxyXG4vLyBpbnB1dE9wdGlvblxyXG5jb25zdCBpbnB1dE9wdGlvbiA9IG5ldyBJbnB1dE9wdGlvbihbXHJcbi8qXHJcblx0dGVzdEJhc2VGb2xkZXIgK2BjaGFuZ2Vfc2V0Xy55YW1sYCxcclxuXHRTdHJpbmcucmF3IGBmaWxlYCxcclxuXHR0ZXN0QmFzZUZvbGRlciArYGNoYW5nZV9zZXRfc2V0dGluZy55YW1sYCxcclxuXHRTdHJpbmcucmF3IGBDaGFuZ2VkYCxcclxuKi9cclxuXSk7XHJcblxyXG4vLyBpbnB1dFxyXG4vLyBFeGFtcGxlOiBjb25zdCBuYW1lID0gYXdhaXQgaW5wdXQoJ1doYXQgaXMgeW91ciBuYW1lPyAnKTtcclxuYXN5bmMgZnVuY3Rpb24gIGlucHV0KCBndWlkZTogc3RyaW5nICk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0Ly8gSW5wdXQgZW11bGF0aW9uXHJcblx0aWYgKGlucHV0T3B0aW9uLmlucHV0TGluZXMpIHtcclxuXHRcdGlmIChpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4IDwgaW5wdXRPcHRpb24uaW5wdXRMaW5lcy5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgIHZhbHVlID0gaW5wdXRPcHRpb24uaW5wdXRMaW5lc1tpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4XTtcclxuXHRcdFx0aW5wdXRPcHRpb24ubmV4dExpbmVJbmRleCArPSAxO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhndWlkZSArIHZhbHVlKTtcclxuXHJcblx0XHRcdHJldHVybiAgdmFsdWU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBSZWFkIHRoZSBzdGFydGluZyBwcm9jZXNzIHBhcmFtZXRlcnNcclxuXHR3aGlsZSAoaW5wdXRPcHRpb24ubmV4dFBhcmFtZXRlckluZGV4IDwgcHJvY2Vzcy5hcmd2Lmxlbmd0aCkge1xyXG5cdFx0Y29uc3QgIHZhbHVlID0gcHJvY2Vzcy5hcmd2W2lucHV0T3B0aW9uLm5leHRQYXJhbWV0ZXJJbmRleF07XHJcblx0XHRpbnB1dE9wdGlvbi5uZXh0UGFyYW1ldGVySW5kZXggKz0gMTtcclxuXHRcdGlmICh2YWx1ZS5zdWJzdHIoMCwxKSAhPT0gJy0nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgdmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuICB2YWx1ZTtcclxuXHRcdH1cclxuXHRcdGlmICh2YWx1ZSAhPT0gJy0tdGVzdCcpIHtcclxuXHRcdFx0aW5wdXRPcHRpb24ubmV4dFBhcmFtZXRlckluZGV4ICs9IDE7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBpbnB1dFxyXG5cdHJldHVybiAgSW5wdXRPYmplY3QuaW5wdXQoZ3VpZGUpO1xyXG59XHJcbmNvbnN0ICBJbnB1dE9iamVjdCA9IG5ldyBTdGFuZGFyZElucHV0QnVmZmVyKCk7XHJcblxyXG4vLyBpbnB1dFBhdGhcclxuLy8gRXhhbXBsZTogY29uc3QgbmFtZSA9IGF3YWl0IGlucHV0KCdXaGF0IGlzIHlvdXIgbmFtZT8gJyk7XHJcbmFzeW5jIGZ1bmN0aW9uICBpbnB1dFBhdGgoIGd1aWRlOiBzdHJpbmcgKSB7XHJcblx0Y29uc3QgIGtleSA9IGF3YWl0IGlucHV0KGd1aWRlKTtcclxuXHRyZXR1cm4gIHBhdGhSZXNvbHZlKGtleSk7XHJcbn1cclxuXHJcbi8vIHBhdGhSZXNvbHZlXHJcbmZ1bmN0aW9uICBwYXRoUmVzb2x2ZShwYXRoXzogc3RyaW5nKSB7XHJcblxyXG5cdC8vICcvYy9ob21lJyBmb3JtYXQgdG8gY3VycmVudCBPUyBmb3JtYXRcclxuXHRpZiAocGF0aF8ubGVuZ3RoID49IDMpIHtcclxuXHRcdGlmIChwYXRoX1swXSA9PT0gJy8nICAmJiAgcGF0aF9bMl0gPT09ICcvJykge1xyXG5cdFx0XHRwYXRoXyA9IHBhdGhfWzFdICsnOicrIHBhdGhfLnN1YnN0cigyKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIENoYW5nZSBzZXBhcmF0b3JzIHRvIE9TIGZvcm1hdFxyXG5cdHBhdGhfID0gcGF0aC5yZXNvbHZlKHBhdGhfKTtcclxuXHJcblx0cmV0dXJuIHBhdGhfXHJcbn1cclxuXHJcbi8vIFNldHRpbmdcclxudHlwZSBTZXR0aW5ncyA9IHtbbmFtZTogc3RyaW5nXTogU2V0dGluZ31cclxuXHJcbi8vIFNldHRpbmdcclxuY2xhc3MgU2V0dGluZyB7XHJcblx0dmFsdWU6IHN0cmluZyA9ICcnO1xyXG5cdGxpbmVOdW06IG51bWJlciA9IDA7XHJcblx0aXNSZWZlcmVuY2VkOiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuXHJcbi8vIFNlYXJjaEtleXdvcmRcclxuY2xhc3MgU2VhcmNoS2V5d29yZCB7XHJcblx0a2V5d29yZDogc3RyaW5nID0gJyc7XHJcblx0c3RhcnRMaW5lTnVtOiBudW1iZXIgPSAwO1xyXG5cdGRpcmVjdGlvbjogRGlyZWN0aW9uID0gRGlyZWN0aW9uLkZvbGxvd2luZztcclxufVxyXG5cclxuLy8gRGlyZWN0aW9uXHJcbmVudW0gRGlyZWN0aW9uIHtcclxuXHRBYm92ZSA9IC0xLFxyXG5cdEZvbGxvd2luZyA9ICsxLFxyXG59XHJcblxyXG4vLyBXcml0ZUJ1ZmZlclxyXG5jbGFzcyAgV3JpdGVCdWZmZXIge1xyXG5cdHN0cmVhbTogZnMuV3JpdGVTdHJlYW07XHJcblx0bGluZUJ1ZmZlcjogc3RyaW5nW107XHJcblxyXG5cdGNvbnN0cnVjdG9yKHN0cmVhbTogZnMuV3JpdGVTdHJlYW0pIHtcclxuXHRcdHRoaXMuc3RyZWFtID0gc3RyZWFtO1xyXG5cdFx0dGhpcy5saW5lQnVmZmVyID0gW107XHJcblx0fVxyXG5cclxuXHRlbmQoKSB7XHJcblx0XHRmb3IgKGNvbnN0IGxpbmUgIG9mICB0aGlzLmxpbmVCdWZmZXIpIHtcclxuXHRcdFx0dGhpcy5zdHJlYW0ud3JpdGUobGluZSk7XHJcblx0XHR9XHJcblx0XHR0aGlzLnN0cmVhbS5lbmQoKTtcclxuICAgIH1cclxuXHJcblx0b24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcclxuXHRcdHRoaXMuc3RyZWFtLm9uKGV2ZW50LCBjYWxsYmFjayk7XHJcblx0fVxyXG5cclxuXHR3cml0ZShsaW5lOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMubGluZUJ1ZmZlci5wdXNoKGxpbmUpO1xyXG5cdH1cclxuXHJcblx0cmVwbGFjZUFib3ZlTGluZShyZWxhdGl2ZUxpbmVOdW06IG51bWJlciwgbGluZTogc3RyaW5nKSB7XHJcblx0XHR0aGlzLmxpbmVCdWZmZXJbdGhpcy5saW5lQnVmZmVyLmxlbmd0aCArIHJlbGF0aXZlTGluZU51bV0gPSBsaW5lO1xyXG5cdH1cclxufVxyXG5cclxuLy8gdHJhbnNsYXRlXHJcbi8vIGUuZy4gdHJhbnNsYXRlKCdlbmdsaXNoJylcclxuLy8gZS5nLiB0cmFuc2xhdGVgcHJpY2UgPSAke3ByaWNlfWAgIC8vIC4uLiB0YWdnZWRUZW1wbGF0ZVxyXG5mdW5jdGlvbiAgdHJhbnNsYXRlKGVuZ2xpc2hMaXRlcmFsczogVGVtcGxhdGVTdHJpbmdzQXJyYXkgfCBzdHJpbmcsICAuLi52YWx1ZXM6IGFueVtdKTogc3RyaW5nIHtcclxuXHRsZXQgICAgZGljdGlvbmFyeToge1tuYW1lOiBzdHJpbmddOiBzdHJpbmd9IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xyXG5cdGNvbnN0ICB0YWdnZWRUZW1wbGF0ZSA9ICh0eXBlb2YoZW5nbGlzaExpdGVyYWxzKSAhPT0gJ3N0cmluZycpO1xyXG5cclxuXHRsZXQgIGVuZ2xpc2ggPSBlbmdsaXNoTGl0ZXJhbHMgYXMgc3RyaW5nO1xyXG5cdGlmICh0YWdnZWRUZW1wbGF0ZSkge1xyXG5cdFx0ZW5nbGlzaCA9ICcnO1xyXG5cdFx0Zm9yIChsZXQgaT0wOyBpPGVuZ2xpc2hMaXRlcmFscy5sZW5ndGg7IGkrPTEpIHtcclxuXHRcdFx0ZW5nbGlzaCArPSBlbmdsaXNoTGl0ZXJhbHNbaV07XHJcblx0XHRcdGlmIChpIDwgdmFsdWVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdGVuZ2xpc2ggKz0gJyR7JyArIFN0cmluZyhpKSArJ30nO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIGUuZy4gZW5nbGlzaCA9ICdwcmljZSA9ICR7MH0nXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRpZiAobG9jYWxlID09PSAnamEtSlAnKSB7XHJcblx0XHRkaWN0aW9uYXJ5ID0ge1xyXG5cdFx0XHRcIllBTUwgVVRGLTggZmlsZSBwYXRoPlwiOiBcIllBTUwgVVRGLTgg44OV44Kh44Kk44OrIOODkeOCuT5cIixcclxuXHRcdFx0XCJUaGlzIGlzIGEgc2VjcmV0IHZhbHVlLlwiOiBcIuOBk+OCjOOBr+enmOWvhuOBruWApOOBp+OBmeOAglwiLFxyXG5cdFx0XHRcIkNoYW5nZSBcXFwiJHswfVxcXCIgdG8gXFxcIiR7MX1cXFwiLlwiOiBcIlxcXCIkezB9XFxcIiDjgpIgXFxcIiR7MX1cXFwiIOOBq+WkieabtOOBl+OBpuOBj+OBoOOBleOBhOOAglwiLFxyXG5cdFx0XHRcIlByZXNzIEVudGVyIGtleSB0byByZXRyeSBjaGVja2luZy5cIjogXCJFbnRlciDjgq3jg7zjgpLmirzjgZnjgajlho3jg4Hjgqfjg4Pjgq/jgZfjgb7jgZnjgIJcIixcclxuXHRcdFx0XCJUaGUgbGluZSBudW1iZXIgdG8gY2hhbmdlIHRoZSB2YXJpYWJsZSB2YWx1ZSA+XCI6IFwi5aSJ5pu044GZ44KL5aSJ5pWw5YCk44GM44GC44KL6KGM55Wq5Y+3ID5cIixcclxuXHRcdFx0XCJFbnRlciBvbmx5OiBmaW5pc2ggdG8gaW5wdXQgc2V0dGluZ1wiOiBcIkVudGVyIOOBruOBv++8muioreWumuOBruWFpeWKm+OCkue1guOCj+OCi1wiLFxyXG5cdFx0XHRcImtleTogbmV3X3ZhbHVlPlwiOiBcIuWkieaVsOWQjTog5paw44GX44GE5aSJ5pWw5YCkPlwiLFxyXG5cdFx0XHRcInRlbXBsYXRlIGNvdW50XCI6IFwi44OG44Oz44OX44Os44O844OI44Gu5pWwXCIsXHJcblx0XHRcdFwiaW4gcHJldmlvdXMgY2hlY2tcIjogXCLliY3lm57jga7jg4Hjgqfjg4Pjgq9cIixcclxuXHRcdFx0XCJXYXJuaW5nXCI6IFwi6K2m5ZGKXCIsXHJcblx0XHRcdFwiRXJyb3JcIjogXCLjgqjjg6njg7xcIixcclxuXHRcdFx0XCJFcnJvckxpbmVcIjogXCLjgqjjg6njg7zooYxcIixcclxuXHRcdFx0XCJTb2x1dGlvblwiOiBcIuino+axuuazlVwiLFxyXG5cdFx0XHRcIkNvbnRlbnRzXCI6IFwi5YaF5a65XCIsXHJcblx0XHRcdFwiRXhwZWN0ZWRcIjogXCLmnJ/lvoVcIixcclxuXHRcdFx0XCJUZW1wbGF0ZVwiOiBcIumbm+W9olwiLFxyXG5cdFx0XHRcIldhcm5pbmdMaW5lXCI6IFwi6K2m5ZGK6KGMXCIsXHJcblx0XHRcdFwiRm91bmRcIjogXCLopovjgaTjgYvjgaPjgZ/jgoLjga5cIixcclxuXHRcdFx0XCJTZXR0aW5nSW5kZXhcIjogXCLoqK3lrprnlarlj7dcIixcclxuXHRcdFx0XCJOb3QgZm91bmQgYW55IHJlcGxhY2luZyB0YXJnZXRcIjogXCLnva7jgY3mj5vjgYjjgovlr77osaHjgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJTZXQgb2xkIHZhbHVlIGF0IHNldHRpbmdzIGluIHRoZSByZXBsYWNpbmcgZmlsZVwiOiBcIue9ruOBjeaPm+OBiOOCi+ODleOCoeOCpOODq+OBruS4reOBruioreWumuOBq+WPpOOBhOWApOOCkuioreWumuOBl+OBpuOBj+OBoOOBleOBhFwiLFxyXG5cdFx0XHRcIlRoZSBwYXJhbWV0ZXIgbXVzdCBiZSBsZXNzIHRoYW4gMFwiOiBcIuODkeODqeODoeODvOOCv+ODvOOBryAwIOOCiOOCiuWwj+OBleOBj+OBl+OBpuOBj+OBoOOBleOBhFwiLFxyXG5cdFx0XHRcIk5vdCBmb3VuZCBcXFwiJHswfVxcXCIgYWJvdmVcIjogXCLkuIrmlrnlkJHjgavjgIwkezB944CN44GM6KaL44Gk44GL44KK44G+44Gb44KTXCIsXHJcblx0XHRcdFwiTm90IGZvdW5kIFxcXCIkezB9XFxcIiBmb2xsb3dpbmdcIjogXCLkuIvmlrnlkJHjgavjgIwkezB944CN44GM6KaL44Gk44GL44KK44G+44Gb44KTXCIsXHJcblx0XHRcdFwiTm90IHJlZmVyZW5jZWQ6ICR7MH0gaW4gbGluZSAkezF9XCI6IFwi5Y+C54Wn44GV44KM44Gm44GE44G+44Gb44KT77yaICR7MH0g77yIJHsxfeihjOebru+8iVwiLFxyXG5cdFx0fTtcclxuXHR9XHJcblx0bGV0ICB0cmFuc2xhdGVkID0gZW5nbGlzaDtcclxuXHRpZiAoZGljdGlvbmFyeSkge1xyXG5cdFx0aWYgKGVuZ2xpc2ggaW4gZGljdGlvbmFyeSkge1xyXG5cclxuXHRcdFx0dHJhbnNsYXRlZCA9IGRpY3Rpb25hcnlbZW5nbGlzaF07XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmICh0YWdnZWRUZW1wbGF0ZSkge1xyXG5cdFx0Zm9yIChsZXQgaT0wOyBpPGVuZ2xpc2hMaXRlcmFscy5sZW5ndGg7IGkrPTEpIHtcclxuXHRcdFx0dHJhbnNsYXRlZCA9IHRyYW5zbGF0ZWQucmVwbGFjZSggJyR7JytTdHJpbmcoaSkrJ30nLCBTdHJpbmcodmFsdWVzW2ldKSApO1xyXG5cdFx0fVxyXG5cdFx0dHJhbnNsYXRlZCA9IHRyYW5zbGF0ZWQucmVwbGFjZSggJyRcXFxceycsICckeycgKTtcclxuXHRcdFx0Ly8gUmVwbGFjZSB0aGUgZXNjYXBlIG9mICR7bn1cclxuXHRcdFx0Ly8gZS5nLiBcIiRcXFxce3ByaWNlfSA9ICR7cHJpY2V9XCIgPT4gXCIke3ByaWNlfSA9IDEwMFwiXHJcblx0fVxyXG5cdHJldHVybiAgdHJhbnNsYXRlZDtcclxufVxyXG5cclxuY29uc3QgIHNldHRpbmdTdGFydExhYmVsID0gXCLoqK3lrpo6XCI7XHJcbmNvbnN0ICBzZXR0aW5nU3RhcnRMYWJlbEVuID0gXCJzZXR0aW5nczpcIjtcclxuY29uc3QgIHRlbXBsYXRlTGFiZWwgPSBcIiN0ZW1wbGF0ZTpcIjtcclxuY29uc3QgIHRlbXBsYXRlQXRTdGFydExhYmVsID0gXCIjdGVtcGxhdGUtYXQoXCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUF0RW5kTGFiZWwgPSBcIik6XCI7XHJcbmNvbnN0ICBmaWxlVGVtcGxhdGVMYWJlbCA9IFwiI2ZpbGUtdGVtcGxhdGU6XCI7XHJcbmNvbnN0ICB0ZW1wb3JhcnlMYWJlbHMgPSBbXCIj4piFTm93OlwiLCBcIiNub3c6XCIsIFwiI+KYheabuOOBjeOBi+OBkVwiLCBcIiPimIXmnKrnorroqo1cIl07XHJcbmNvbnN0ICBzZWNyZXRMYWJlbCA9IFwiI+KYheenmOWvhlwiO1xyXG5jb25zdCAgc2VjcmV0TGFiZWxFbiA9IFwiI3NlY3JldFwiO1xyXG5jb25zdCAgc2VjcmV0RXhhbWxlTGFiZWwgPSBcIiPimIXnp5jlr4Y65LuuXCI7XHJcbmNvbnN0ICBzZWNyZXRFeGFtbGVMYWJlbEVuID0gXCIjc2VjcmV0OmV4YW1wbGVcIjtcclxuY29uc3QgIHJlZmVyUGF0dGVybiA9IC8o5LiK6KiYfOS4i+iomHxhYm92ZXxmb2xsb3dpbmcpKOOAjHxcXFspKFte44CNXSopKOOAjXxcXF0pL2c7XHJcbmNvbnN0ICBpbmRlbnRSZWd1bGFyRXhwcmVzc2lvbiA9IC9eKCB8wqV0KSovO1xyXG5jb25zdCAgbWluTGluZU51bSA9IDA7XHJcbmNvbnN0ICBtYXhMaW5lTnVtID0gOTk5OTk5OTk5O1xyXG5jb25zdCAgbWF4TnVtYmVyID0gOTk5OTk5OTk5O1xyXG5jb25zdCAgZm91bmRGb3JBYm92ZSA9IG1pbkxpbmVOdW07XHJcbmNvbnN0ICBmb3VuZEZvckZvbGxvd2luZyA9IG1heExpbmVOdW07XHJcbmNvbnN0ICBub3RGb3VuZCA9IC0xO1xyXG5jb25zdCAgYWxsU2V0dGluZyA9IDA7XHJcbmNvbnN0ICBub1NlcGFyYXRvciA9IC0xO1xyXG5sZXQgICAgbG9jYWxlOiBzdHJpbmc7XHJcbmNvbnN0ICBwcm9ncmFtT3B0aW9ucyA9IHByb2dyYW0ub3B0cygpO1xyXG5mdW5jdGlvbiAgZXhpdEZyb21Db21tYW5kZXIoZTogQ29tbWFuZGVyRXJyb3IpIHtcclxuXHRjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xyXG59XHJcbmZ1bmN0aW9uICBnZXRUZXN0YWJsZShwYXRoOiBzdHJpbmcpIHtcclxuXHRpZiAocHJvZ3JhbU9wdGlvbnMudGVzdCkge1xyXG5cdFx0aWYgKHBhdGguc3RhcnRzV2l0aChpbnB1dEZpbGVQYXJlbnRQYXRoKSkge1xyXG5cdFx0XHRyZXR1cm4gICcke2lucHV0RmlsZVBhcmVudFBhdGh9JyArIHBhdGguc3Vic3RyKGlucHV0RmlsZVBhcmVudFBhdGgubGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiAgcGF0aDtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICBwYXRoO1xyXG5cdH1cclxufVxyXG5sZXQgIGlucHV0RmlsZVBhcmVudFBhdGggPSAnJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uICBjYWxsTWFpbigpIHtcclxuXHRwcm9ncmFtLnZlcnNpb24oJzAuMS4xJykuZXhpdE92ZXJyaWRlKGV4aXRGcm9tQ29tbWFuZGVyKVxyXG5cdFx0Lm9wdGlvbihcIi1sLCAtLWxvY2FsZSA8cz5cIilcclxuXHRcdC5vcHRpb24oXCItdCwgLS10ZXN0XCIpXHJcblx0XHQucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuXHRcclxuXHRsb2NhbGUgPSBJbnRsLk51bWJlckZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLmxvY2FsZTtcclxuXHRpZiAocHJvZ3JhbU9wdGlvbnMubG9jYWxlKSB7XHJcblx0XHRsb2NhbGUgPSBwcm9ncmFtT3B0aW9ucy5sb2NhbGU7XHJcblx0fVxyXG5cclxuXHRhd2FpdCAgbWFpbigpXHJcblx0XHQuY2F0Y2goIChlKT0+e1xyXG5cdFx0XHRpZiAocHJvZ3JhbU9wdGlvbnMudGVzdCkge1xyXG5cdFx0XHRcdHRocm93IGU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCBgRVJST1I6ICR7ZS5tZXNzYWdlfWAgKTtcclxuXHRcdFx0XHRjb25zdCAgdGltZU92ZXIgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdHRpbWVPdmVyLnNldFNlY29uZHMoIHRpbWVPdmVyLmdldFNlY29uZHMoKSArIDUgKTtcclxuXHJcblx0XHRcdFx0d2hpbGUgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgPCB0aW1lT3Zlci5nZXRUaW1lKCkpIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuZmluYWxseSgoKT0+e1xyXG5cdFx0XHRJbnB1dE9iamVjdC5jbG9zZSgpO1xyXG5cdFx0fSk7XHJcbn1cclxuY2FsbE1haW4oKTtcclxuIl19