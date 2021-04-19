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
                    if (!fileTemplateTag) return [3 /*break*/, 18];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVCQUF5QixDQUFDLGNBQWM7QUFDeEMsMkJBQTZCLENBQUUsNEJBQTRCO0FBQzNELHVDQUFvRDtBQUNwRCxtQ0FBcUM7QUFFckMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUV2QixTQUFnQixJQUFJOzs7Ozs7d0JBQ0kscUJBQU0sU0FBUyxDQUFFLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFFLEVBQUE7O29CQUFyRSxhQUFhLEdBQUcsU0FBcUQ7b0JBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoRCxtQkFBbUIsR0FBRyxVQUFVLENBQUM7b0JBQzVCLHFCQUFxQixHQUFHLENBQUMsQ0FBQzs7O29CQUV6QixNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzt3QkFDdEMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7d0JBQ3pDLFNBQVMsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7b0JBQ0UsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO29CQUN6QixPQUFPLEdBQWEsRUFBRSxDQUFDO29CQUN2QixZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLGVBQWUsR0FBdUIsSUFBSSxDQUFDO29CQUMzQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNmLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFnQixHQUFHLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxRQUFRLEdBQW9CLEVBQUUsQ0FBQzs7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QUFDLE1BQU0sQ0FBQztxQkFDL0I7b0JBRUQscUJBQU8sSUFBSSxFQUFFLENBQ1gsT0FBSyxDQUFBLENBQUUsVUFBQyxDQUFDOzRCQUNULElBQUksY0FBYyxDQUFDLElBQUksRUFBRTtnQ0FDeEIsTUFBTSxDQUFDLENBQUM7NkJBQ1I7aUNBQU07Z0NBRU4sT0FBTyxDQUFDLEdBQUcsQ0FBRSxZQUFVLENBQUMsQ0FBQyxPQUFTLENBQUUsQ0FBQztnQ0FDckMsSUFBTyxRQUFRLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQ0FDN0IsUUFBUSxDQUFDLFVBQVUsQ0FBRSxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFFLENBQUM7Z0NBRWpELE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFO2lDQUNuRDs2QkFDRDt3QkFDRixDQUFDLENBQUMsQ0FDRCxTQUFPLENBQUEsQ0FBQzs0QkFDUixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3JCLENBQUMsQ0FBQyxFQUFBOztvQkFoQkgsU0FnQkcsQ0FBQzs7Ozs7Q0FDSjtBQUNELFFBQVEsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnOyAvLyBmaWxlIHN5c3RlbVxyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7ICAvLyBvciBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcclxuaW1wb3J0IHsgcHJvZ3JhbSwgQ29tbWFuZGVyRXJyb3IgfSBmcm9tICdjb21tYW5kZXInO1xyXG5pbXBvcnQgKiBhcyByZWFkbGluZSBmcm9tICdyZWFkbGluZSc7XHJcbmltcG9ydCB7IERlZmF1bHREZXNlcmlhbGl6ZXIgfSBmcm9tICd2OCc7XHJcbmNvbnN0IGRkID0gY29uc29sZS5sb2c7XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgbWFpbigpIHtcclxuXHRjb25zdCAgaW5wdXRGaWxlUGF0aCA9IGF3YWl0IGlucHV0UGF0aCggdHJhbnNsYXRlKCdZQU1MIFVURi04IGZpbGUgcGF0aD4nKSApO1xyXG5cdGNvbnN0ICBwYXJlbnRQYXRoID0gcGF0aC5kaXJuYW1lKGlucHV0RmlsZVBhdGgpO1xyXG5cdGlucHV0RmlsZVBhcmVudFBhdGggPSBwYXJlbnRQYXRoO1xyXG5cdGxldCAgcHJldmlvdXNUZW1wbGF0ZUNvdW50ID0gMDtcclxuXHRmb3IoOzspIHtcclxuXHRcdGxldCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5wdXRGaWxlUGF0aCksXHJcblx0XHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHRcdH0pO1xyXG5cdFx0bGV0ICBpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRsZXQgIHNldHRpbmc6IFNldHRpbmdzID0ge307XHJcblx0XHRsZXQgIHNldHRpbmdDb3VudCA9IDA7XHJcblx0XHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cdFx0bGV0ICB0ZW1wbGF0ZUNvdW50ID0gMDtcclxuXHRcdGxldCAgZmlsZVRlbXBsYXRlVGFnOiBUZW1wbGF0ZVRhZyB8IG51bGwgPSBudWxsO1xyXG5cdFx0bGV0ICBlcnJvckNvdW50ID0gMDtcclxuXHRcdGxldCAgd2FybmluZ0NvdW50ID0gMDtcclxuXHRcdGxldCAgc2VjcmV0TGFiZWxDb3VudCA9IDA7XHJcblx0XHRjb25zdCAgbGluZXMgPSBbXTtcclxuXHRcdGNvbnN0ICBrZXl3b3JkczogU2VhcmNoS2V5d29yZFtdID0gW107XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0XHRsaW5lcy5wdXNoKGxpbmUpO1xyXG5cdFx0XHRsaW5lTnVtICs9IDE7XHJcblx0XHRcdGNvbnN0ICBwcmV2aW91c0lzUmVhZGluZ1NldHRpbmcgPSBpc1JlYWRpbmdTZXR0aW5nO1xyXG5cclxuXHRcdFx0Ly8gc2V0dGluZyA9IC4uLlxyXG5cdFx0XHRpZiAobGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsICB8fCAgbGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0XHRpZiAoc2V0dGluZ0NvdW50ID49IDEpIHtcclxuXHRcdFx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlzRW5kT2ZTZXR0aW5nKGxpbmUsIGlzUmVhZGluZ1NldHRpbmcpKSB7XHJcblx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRcdFx0Y29uc3QgIHNlcGFyYXRvciA9IGxpbmUuaW5kZXhPZignOicpO1xyXG5cdFx0XHRcdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5ID0gbGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShsaW5lLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0dGluZ1trZXldID0ge3ZhbHVlLCBpc1JlZmVyZW5jZWQ6IGZhbHNlLCBsaW5lTnVtfTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbCAgJiYgIGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiBwcmV2aW91cyBsaW5lIGhhcyBcInRlbXBsYXRlXCIgcmVwbGFjZWQgY29udGVudHMuXHJcblx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0ID49IDEgICYmICB0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke3RyYW5zbGF0ZSgnVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwJyl9YCk7XHJcblx0XHRcdFx0dGVtcGxhdGVUYWcuaXNGb3VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRlbXBsYXRlQ291bnQgKz0gMTtcclxuXHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUNvdW50ICs9IDE7XHJcblx0XHRcdFx0Y29uc3QgIGNoZWNraW5nTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoZXhwZWN0ZWQpID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldH1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtjaGVja2luZ0xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0V4cGVjdGVkJyl9OiAke2V4cGVjdGVkfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayB0YXJnZXQgZmlsZSBjb250ZW50cyBieSBcIiNmaWxlLXRlbXBsYXRlOlwiIHRhZy5cclxuXHRcdFx0aWYgKGZpbGVUZW1wbGF0ZVRhZykge1xyXG5cdFx0XHRcdGNvbnN0IGNvbnRpbnVlXyA9IGZpbGVUZW1wbGF0ZVRhZy5vblJlYWRMaW5lKGxpbmUpO1xyXG5cdFx0XHRcdGlmICghY29udGludWVfKSB7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgIGNoZWNrUGFzc2VkID0gYXdhaXQgZmlsZVRlbXBsYXRlVGFnLmNoZWNrVGFyZ2V0Q29udGVudHMoXHJcblx0XHRcdFx0XHRcdHNldHRpbmcsIGlucHV0RmlsZVBhdGgsIGxpbmVOdW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFjaGVja1Bhc3NlZCkge1xyXG5cdFx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmaWxlVGVtcGxhdGVUYWcgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGVtcGxhdGVUYWcubGFiZWwgPT09IGZpbGVUZW1wbGF0ZUxhYmVsKSB7XHJcblx0XHRcdFx0ZmlsZVRlbXBsYXRlVGFnID0gdGVtcGxhdGVUYWc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIG5vdCBcIiPimIVOb3c6XCIuXHJcblx0XHRcdGZvciAobGV0IHRlbXBvcmFyeUxhYmVsIG9mIHRlbXBvcmFyeUxhYmVscykge1xyXG5cdFx0XHRcdGlmIChsaW5lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZW1wb3JhcnlMYWJlbC50b0xvd2VyQ2FzZSgpKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHR3YXJuaW5nQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIG5vdCBzZWNyZXQgdGFnLlxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKCBzZWNyZXRMYWJlbCApICE9PSBub3RGb3VuZCAgfHwgIGxpbmUuaW5kZXhPZiggc2VjcmV0TGFiZWxFbiApICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdGlmIChsaW5lLmluZGV4T2YoIHNlY3JldEV4YW1sZUxhYmVsICkgPT09IG5vdEZvdW5kICAmJiAgbGluZS5pbmRleE9mKCBzZWNyZXRFeGFtbGVMYWJlbEVuICkgPT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VjcmV0TGFiZWxDb3VudCA9PT0gMCkgeyAgLy8gQmVjYXVzZSB0aGVyZSB3aWxsIGJlIG1hbnkgc2VjcmV0IGRhdGEuXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1dhcm5pbmdMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdUaGlzIGlzIGEgc2VjcmV0IHZhbHVlLicpfWApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnKyB0cmFuc2xhdGVgQ2hhbmdlIFwiJHtzZWNyZXRMYWJlbEVufVwiIHRvIFwiJHtzZWNyZXRFeGFtbGVMYWJlbEVufVwiLidgKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJysgdHJhbnNsYXRlYENoYW5nZSBcIiR7c2VjcmV0TGFiZWx9XCIgdG8gXCIke3NlY3JldEV4YW1sZUxhYmVsfVwiLidgKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRcdHdhcm5pbmdDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c2VjcmV0TGFiZWxDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gR2V0IHRpdGxlcyBhYm92ZSBvciBmb2xsb3dpbmcuXHJcblx0XHRcdGxldCAgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XHJcblx0XHRcdHJlZmVyUGF0dGVybi5sYXN0SW5kZXggPSAwO1xyXG5cclxuXHRcdFx0d2hpbGUgKCAobWF0Y2ggPSByZWZlclBhdHRlcm4uZXhlYyggbGluZSApKSAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHRjb25zdCAga2V5d29yZCA9IG5ldyBTZWFyY2hLZXl3b3JkKCk7XHJcblx0XHRcdFx0Y29uc3QgIGxhYmVsID0gbWF0Y2hbMV07XHJcblx0XHRcdFx0a2V5d29yZC5rZXl3b3JkID0gbWF0Y2hbM107XHJcblx0XHRcdFx0aWYgKGxhYmVsID09PSBcIuS4iuiomFwiICB8fCAgbGFiZWwgPT09IFwiYWJvdmVcIikge1xyXG5cdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBsaW5lTnVtIC0gMTtcclxuXHRcdFx0XHRcdGtleXdvcmQuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkFib3ZlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobGFiZWwgPT09IFwi5LiL6KiYXCIgIHx8ICBsYWJlbCA9PT0gXCJmb2xsb3dpbmdcIikge1xyXG5cdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBsaW5lTnVtICsgMTtcclxuXHRcdFx0XHRcdGtleXdvcmQuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkZvbGxvd2luZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0a2V5d29yZHMucHVzaChrZXl3b3JkKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHNldHRpbmdDb3VudCA+PSAxKSB7XHJcblx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIHRhcmdldCBmaWxlIGNvbnRlbnRzIGJ5IFwiI2ZpbGUtdGVtcGxhdGU6XCIgdGFnICgyKS5cclxuXHRcdGlmIChmaWxlVGVtcGxhdGVUYWcpIHtcclxuXHJcblx0XHRcdGNvbnN0ICBjaGVja1Bhc3NlZCA9IGF3YWl0IGZpbGVUZW1wbGF0ZVRhZy5jaGVja1RhcmdldENvbnRlbnRzKFxyXG5cdFx0XHRcdHNldHRpbmcsIGlucHV0RmlsZVBhdGgsIGxpbmVOdW0pO1xyXG5cdFx0XHRpZiAoIWNoZWNrUGFzc2VkKSB7XHJcblx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgaXMgdGhlIHRpdGxlIGFib3ZlIG9yIGZvbGxvd2luZy5cclxuXHRcdHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGxpbmVOdW0gPSAwO1xyXG5cclxuXHRcdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRcdGNvbnN0ICBsaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdFx0bGluZU51bSArPSAxO1xyXG5cclxuXHRcdFx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIGtleXdvcmRzKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uQWJvdmUpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5lTnVtIDw9IGtleXdvcmQuc3RhcnRMaW5lTnVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAobGluZS5pbmRleE9mKGtleXdvcmQua2V5d29yZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBmb3VuZEZvckFib3ZlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkZvbGxvd2luZykge1xyXG5cdFx0XHRcdFx0aWYgKGxpbmVOdW0gPj0ga2V5d29yZC5zdGFydExpbmVOdW0pIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChsaW5lLmluZGV4T2Yoa2V5d29yZC5rZXl3b3JkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0XHRrZXl3b3JkLnN0YXJ0TGluZU51bSA9IGZvdW5kRm9yRm9sbG93aW5nO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGNvbnN0IGtleXdvcmQgb2Yga2V5d29yZHMpIHtcclxuXHRcdFx0aWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uQWJvdmUpIHtcclxuXHRcdFx0XHRpZiAoa2V5d29yZC5zdGFydExpbmVOdW0gIT09IGZvdW5kRm9yQWJvdmUpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2tleXdvcmQuc3RhcnRMaW5lTnVtICsgMX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcgKyB0cmFuc2xhdGVgTm90IGZvdW5kIFwiJHtrZXl3b3JkLmtleXdvcmR9XCIgYWJvdmVgKTtcclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Gb2xsb3dpbmcpIHtcclxuXHRcdFx0XHRpZiAoa2V5d29yZC5zdGFydExpbmVOdW0gIT09IGZvdW5kRm9yRm9sbG93aW5nKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtrZXl3b3JkLnN0YXJ0TGluZU51bSAtIDF9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnICsgdHJhbnNsYXRlYE5vdCBmb3VuZCBcIiR7a2V5d29yZC5rZXl3b3JkfVwiIGZvbGxvd2luZ2ApO1xyXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNob3cgdGhlIHJlc3VsdFxyXG5cdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nJyl9OiAke3dhcm5pbmdDb3VudH0sICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHtlcnJvckNvdW50fWApO1xyXG5cdFx0aWYgKHByZXZpb3VzVGVtcGxhdGVDb3VudCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3RlbXBsYXRlIGNvdW50Jyl9ID0gJHtwcmV2aW91c1RlbXBsYXRlQ291bnR9ICgke3RyYW5zbGF0ZSgnaW4gcHJldmlvdXMgY2hlY2snKX0pYCk7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3RlbXBsYXRlIGNvdW50Jyl9ID0gJHt0ZW1wbGF0ZUNvdW50fWApO1xyXG5cclxuXHRcdC8vIFJlc2NhbiBvciBjaGFuZ2UgYSB2YWx1ZVxyXG5cdFx0bGV0ICBsb29wID0gdHJ1ZTtcclxuXHRcdHdoaWxlIChsb29wKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRyYW5zbGF0ZSgnUHJlc3MgRW50ZXIga2V5IHRvIHJldHJ5IGNoZWNraW5nLicpKTtcclxuXHJcblx0XHRcdGNvbnN0ICBrZXkgPSBhd2FpdCBpbnB1dCh0cmFuc2xhdGUoJ1RoZSBsaW5lIG51bWJlciB0byBjaGFuZ2UgdGhlIHZhcmlhYmxlIHZhbHVlID4nKSk7XHJcblx0XHRcdGVycm9yQ291bnQgPSAwO1xyXG5cdFx0XHRpZiAoa2V5ID09PSAnZXhpdCcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSBpZiAoa2V5ICE9PSAnJykge1xyXG5cdFx0XHRcdGNvbnN0ICBsaW5lTnVtID0gcGFyc2VJbnQoa2V5KTtcclxuXHRcdFx0XHRjb25zdCAgY2hhbmdpbmdTZXR0aW5nSW5kZXggPSBhd2FpdCBnZXRTZXR0aW5nSW5kZXhGcm9tTGluZU51bShpbnB1dEZpbGVQYXRoLCBsaW5lTnVtKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtjaGFuZ2luZ1NldHRpbmdJbmRleH1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGUoJ0VudGVyIG9ubHk6IGZpbmlzaCB0byBpbnB1dCBzZXR0aW5nJykpO1xyXG5cdFx0XHRcdGZvciAoOzspIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBrZXlWYWx1ZSA9IGF3YWl0IGlucHV0KHRyYW5zbGF0ZSgna2V5OiBuZXdfdmFsdWU+JykpO1xyXG5cdFx0XHRcdFx0aWYgKGtleVZhbHVlID09PSAnJykge1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gYXdhaXQgY2hhbmdlU2V0dGluZ0J5S2V5VmFsdWUoaW5wdXRGaWxlUGF0aCwgY2hhbmdpbmdTZXR0aW5nSW5kZXgsIGtleVZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0bG9vcCA9IChlcnJvckNvdW50ID49IDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlc2NhblxyXG5cdFx0Y29uc29sZS5sb2coJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcclxuXHRcdHByZXZpb3VzVGVtcGxhdGVDb3VudCA9IHRlbXBsYXRlQ291bnRcclxuXHRcdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRcdHNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vIGNoYW5nZVNldHRpbmdCeUtleVZhbHVlXHJcbmFzeW5jIGZ1bmN0aW9uICBjaGFuZ2VTZXR0aW5nQnlLZXlWYWx1ZShpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIGNoYW5naW5nU2V0dGluZ0luZGV4OiBudW1iZXIsXHJcblx0XHRrZXlWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+LyplcnJvckNvdW50Ki8ge1xyXG5cclxuXHRjb25zdCAgc2VwYXJhdG9yID0ga2V5VmFsdWUuaW5kZXhPZignOicpO1xyXG5cdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRjb25zdCAga2V5ID0ga2V5VmFsdWUuc3Vic3RyKDAsIHNlcGFyYXRvcikudHJpbSgpO1xyXG5cdFx0Y29uc3QgIHZhbHVlID0gZ2V0VmFsdWUoa2V5VmFsdWUsIHNlcGFyYXRvcik7XHJcblxyXG5cdFx0cmV0dXJuICBjaGFuZ2VTZXR0aW5nKGlucHV0RmlsZVBhdGgsIGNoYW5naW5nU2V0dGluZ0luZGV4LCBrZXksIHZhbHVlKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICAxO1xyXG5cdH1cclxufVxyXG5cclxuLy8gY2hhbmdlU2V0dGluZ1xyXG5hc3luYyBmdW5jdGlvbiAgY2hhbmdlU2V0dGluZyhpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIGNoYW5naW5nU2V0dGluZ0luZGV4OiBudW1iZXIsXHJcblx0XHRjaGFuZ2luZ0tleTogc3RyaW5nLCBjaGFuZ2VkVmFsdWVBbmRDb21tZW50OiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4vKmVycm9yQ291bnQqLyB7XHJcblxyXG5cdGNvbnN0ICBiYWNrVXBGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGggK1wiLmJhY2t1cFwiO1xyXG5cdGlmICghZnMuZXhpc3RzU3luYyhiYWNrVXBGaWxlUGF0aCkpIHtcclxuXHRcdGZzLmNvcHlGaWxlU3luYyhpbnB1dEZpbGVQYXRoLCBiYWNrVXBGaWxlUGF0aCk7XHJcblx0fVxyXG5cclxuXHRjb25zdCAgb2xkRmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoO1xyXG5cdGNvbnN0ICBuZXdGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGggK1wiLm5ld1wiO1xyXG5cdGNvbnN0ICB3cml0ZXIgPSBuZXcgV3JpdGVCdWZmZXIoZnMuY3JlYXRlV3JpdGVTdHJlYW0obmV3RmlsZVBhdGgpKTtcclxuXHRjb25zdCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKG9sZEZpbGVQYXRoKSxcclxuXHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHR9KTtcclxuXHRjb25zdCAgbGluZXMgPSBbXTtcclxuXHRsZXQgIGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRsZXQgIHNldHRpbmc6IFNldHRpbmdzID0ge307XHJcblx0bGV0ICBzZXR0aW5nQ291bnQgPSAwO1xyXG5cdGxldCAgY2hhbmdlZFZhbHVlID0gZ2V0Q2hhbmdlZFZhbHVlKGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQpO1xyXG5cdGxldCAgbGluZU51bSA9IDA7XHJcblx0bGV0ICBlcnJvckNvdW50ID0gMDtcclxuXHRsZXQgIGlzQ2hhbmdpbmcgPSBmYWxzZTtcclxuXHRcclxuXHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0bGluZXMucHVzaChsaW5lKTtcclxuXHRcdGxpbmVOdW0gKz0gMTtcclxuXHRcdGxldCAgb3V0cHV0ID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gc2V0dGluZyA9IC4uLlxyXG5cdFx0aWYgKGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbCAgfHwgIGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbEVuKSB7XHJcblx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSB0cnVlO1xyXG5cdFx0XHRzZXR0aW5nID0ge307XHJcblx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0XHRpZiAoY2hhbmdpbmdTZXR0aW5nSW5kZXggPT09IGFsbFNldHRpbmcpIHtcclxuXHRcdFx0XHRpc0NoYW5naW5nID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpc0NoYW5naW5nID0gKHNldHRpbmdDb3VudCA9PT0gY2hhbmdpbmdTZXR0aW5nSW5kZXgpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGlzRW5kT2ZTZXR0aW5nKGxpbmUsIGlzUmVhZGluZ1NldHRpbmcpKSB7XHJcblx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0NoYW5naW5nKSB7XHJcblxyXG5cdFx0XHRpZiAoaXNSZWFkaW5nU2V0dGluZykge1xyXG5cdFx0XHRcdGNvbnN0ICBzZXBhcmF0b3IgPSBsaW5lLmluZGV4T2YoJzonKTtcclxuXHRcdFx0XHRpZiAoc2VwYXJhdG9yICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgIGtleSA9IGxpbmUuc3Vic3RyKDAsIHNlcGFyYXRvcikudHJpbSgpO1xyXG5cdFx0XHRcdFx0Y29uc3QgIHZhbHVlID0gZ2V0VmFsdWUobGluZSwgc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gJycpIHtcclxuXHJcblx0XHRcdFx0XHRcdHNldHRpbmdba2V5XSA9IHt2YWx1ZSwgaXNSZWZlcmVuY2VkOiBmYWxzZSwgbGluZU51bX07XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWwgICYmICBrZXkgKyAnOicgIT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChrZXkgPT09IGNoYW5naW5nS2V5KSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0ICBjb21tZW50SW5kZXggPSBsaW5lLmluZGV4T2YoJyMnLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0XHRsZXQgIGNvbW1lbnQ9ICcnO1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWVudEluZGV4ICE9PSBub3RGb3VuZCAgJiYgIGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuaW5kZXhPZignIycpID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbW1lbnQgPSAnICAnICsgbGluZS5zdWJzdHIoY29tbWVudEluZGV4KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0d3JpdGVyLndyaXRlKGxpbmUuc3Vic3RyKDAsIHNlcGFyYXRvciArIDEpICsnICcrIGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQgKyBjb21tZW50ICsgXCJcXG5cIik7XHJcblx0XHRcdFx0XHRcdG91dHB1dCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gT3V0IG9mIHNldHRpbmdzXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc3QgIHRlbXBsYXRlVGFnID0gcGFyc2VUZW1wbGF0ZVRhZyhsaW5lKTtcclxuXHRcdFx0XHRpZiAodGVtcGxhdGVUYWcuaXNGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgIGNoZWNraW5nTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRcdGNvbnN0ICBleHBlY3RlZCA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZVRhZy50ZW1wbGF0ZSk7XHJcblx0XHRcdFx0XHRjb25zdCAgY2hhbmdlZCA9IGdldENoYW5nZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlVGFnLnRlbXBsYXRlLCBjaGFuZ2luZ0tleSwgY2hhbmdlZFZhbHVlKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoZXhwZWN0ZWQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgYmVmb3JlID0gZXhwZWN0ZWQ7XHJcblx0XHRcdFx0XHRcdGNvbnN0ICBhZnRlciA9IGNoYW5nZWQ7XHJcblx0XHRcdFx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0IDw9IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgIGFib3ZlTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRcdFx0XHR3cml0ZXIucmVwbGFjZUFib3ZlTGluZSh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0LFxyXG5cdFx0XHRcdFx0XHRcdFx0YWJvdmVMaW5lLnJlcGxhY2UoYmVmb3JlLCBhZnRlcikrXCJcXG5cIik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHdyaXRlci53cml0ZShsaW5lLnJlcGxhY2UoYmVmb3JlLCBhZnRlcikgK1wiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdG91dHB1dCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoY2hhbmdlZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdC8vIERvIG5vdGhpbmdcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChlcnJvckNvdW50ID09PSAwKSB7IC8vIFNpbmNlIG9ubHkgb25lIG9sZCB2YWx1ZSBjYW4gYmUgcmVwbGFjZWQgYXQgYSB0aW1lXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke3RyYW5zbGF0ZSgnTm90IGZvdW5kIGFueSByZXBsYWNpbmcgdGFyZ2V0Jyl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NvbHV0aW9uJyl9OiAke3RyYW5zbGF0ZSgnU2V0IG9sZCB2YWx1ZSBhdCBzZXR0aW5ncyBpbiB0aGUgcmVwbGFjaW5nIGZpbGUnKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0V4cGVjdGVkJyl9OiAke2V4cGVjdGVkLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnVGVtcGxhdGUnKX06ICR7dGVtcGxhdGVUYWcudGVtcGxhdGUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCFvdXRwdXQpIHtcclxuXHRcdFx0d3JpdGVyLndyaXRlKGxpbmUgK1wiXFxuXCIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHR3cml0ZXIuZW5kKCk7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSkgPT4ge1xyXG5cdFx0d3JpdGVyLm9uKCdmaW5pc2gnLCAoKSA9PiB7XHJcblx0XHRcdGZzLmNvcHlGaWxlU3luYyhuZXdGaWxlUGF0aCwgaW5wdXRGaWxlUGF0aCk7XHJcblx0XHRcdGRlbGV0ZUZpbGUobmV3RmlsZVBhdGgpO1xyXG5cdFx0XHRyZXNvbHZlKGVycm9yQ291bnQpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIFRlbXBsYXRlVGFnXHJcbmNsYXNzICBUZW1wbGF0ZVRhZyB7XHJcblxyXG5cdGxhYmVsID0gJyc7XHJcblx0dGVtcGxhdGUgPSAnJztcclxuXHRpc0ZvdW5kID0gZmFsc2U7XHJcblxyXG5cdC8vIHRlbXBsYXRlIHRhZ1xyXG5cdGluZGV4SW5MaW5lID0gbm90Rm91bmQ7XHJcblxyXG5cdC8vIHRlbXBsYXRlLWF0IHRhZ1xyXG5cdGxpbmVOdW1PZmZzZXQgPSAwOyAgXHJcblx0c3RhcnRJbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cdGVuZEluZGV4SW5MaW5lID0gbm90Rm91bmQ7XHJcblxyXG5cdC8vIGZvciBmaWxlLXRlbXBsYXRlIHRhZ1xyXG5cdHRlbXBsYXRlTGluZXM6IHN0cmluZ1tdID0gW107XHJcblx0aW5kZW50QXRUYWcgPSAnJztcclxuXHRtaW5JbmRlbnRMZW5ndGggPSAwO1xyXG5cclxuXHRvbkZpbGVUZW1wbGF0ZVRhZ1JlYWRpbmcobGluZTogc3RyaW5nKSB7XHJcblx0XHR0aGlzLmluZGVudEF0VGFnID0gaW5kZW50UmVndWxhckV4cHJlc3Npb24uZXhlYyhsaW5lKSFbMF07XHJcblx0XHR0aGlzLm1pbkluZGVudExlbmd0aCA9IG1heE51bWJlcjtcclxuXHR9XHJcblx0b25SZWFkTGluZShsaW5lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGNvbnN0ICBjdXJyZW50SW5kZW50ID0gaW5kZW50UmVndWxhckV4cHJlc3Npb24uZXhlYyhsaW5lKSFbMF07XHJcblx0XHRsZXQgIHJlYWRpbmdOZXh0ID0gdHJ1ZTtcclxuXHRcdGlmIChjdXJyZW50SW5kZW50Lmxlbmd0aCA+IHRoaXMuaW5kZW50QXRUYWcubGVuZ3RoICAmJiAgbGluZS5zdGFydHNXaXRoKHRoaXMuaW5kZW50QXRUYWcpKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlTGluZXMucHVzaChsaW5lKTtcclxuXHRcdFx0dGhpcy5taW5JbmRlbnRMZW5ndGggPSBNYXRoLm1pbih0aGlzLm1pbkluZGVudExlbmd0aCwgY3VycmVudEluZGVudC5sZW5ndGgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy50ZW1wbGF0ZUxpbmVzID0gdGhpcy50ZW1wbGF0ZUxpbmVzLm1hcCgobGluZSk9PihcclxuXHRcdFx0XHRsaW5lLnN1YnN0cih0aGlzLm1pbkluZGVudExlbmd0aCkpKTtcclxuXHRcdFx0cmVhZGluZ05leHQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAgcmVhZGluZ05leHQ7XHJcblx0fVxyXG5cdGFzeW5jICBjaGVja1RhcmdldENvbnRlbnRzKHNldHRpbmc6IFNldHRpbmdzLCBpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIHRlbXBsYXRlRW5kTGluZU51bTogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XHJcblx0XHRjb25zdCAgcGFyZW50UGF0aCA9IHBhdGguZGlybmFtZShpbnB1dEZpbGVQYXRoKTtcclxuXHRcdGNvbnN0ICB0YXJnZXRGaWxlUGF0aCA9IGdldEZ1bGxQYXRoKGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0aGlzLnRlbXBsYXRlKSwgcGFyZW50UGF0aCk7XHJcblx0XHRpZiAoIWZzLmV4aXN0c1N5bmModGFyZ2V0RmlsZVBhdGgpKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgRXJyb3I6ICR7dHJhbnNsYXRlKCdOb3RGb3VuZCcpfTogJHt0YXJnZXRGaWxlUGF0aH1gKTtcclxuXHRcdFx0cmV0dXJuICBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGNvbnN0ICB0YXJnZXRGaWxlUmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGFyZ2V0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGlmICh0aGlzLnRlbXBsYXRlTGluZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHJldHVybiAgZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCAgZXhwZWN0ZWRGaXJzdExpbmUgPSBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZShzZXR0aW5nLCB0aGlzLnRlbXBsYXRlTGluZXNbMF0pO1xyXG5cdFx0bGV0ICB0ZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRsZXQgIHRhcmdldExpbmVOdW0gPSAwO1xyXG5cdFx0bGV0ICBlcnJvclRlbXBsYXRlTGluZUluZGV4ID0gMDtcclxuXHRcdGxldCAgZXJyb3JUYXJnZXRMaW5lTnVtID0gMDtcclxuXHRcdGxldCAgZXJyb3JDb250ZW50cyA9ICcnO1xyXG5cdFx0bGV0ICBlcnJvckV4cGVjdGVkID0gJyc7XHJcblx0XHRsZXQgIGVycm9yVGVtcGxhdGUgPSAnJztcclxuXHRcdGxldCAgaW5kZW50ID0gJyc7XHJcblx0XHRsZXQgIHNhbWUgPSBmYWxzZTtcclxuXHJcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHRhcmdldEZpbGVSZWFkZXIpIHtcclxuXHRcdFx0Y29uc3QgIHRhcmdldExpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0XHR0YXJnZXRMaW5lTnVtICs9IDE7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZUxpbmVJbmRleCA9PT0gMCkge1xyXG5cclxuXHRcdFx0XHRjb25zdCAgaW5kZW50TGVuZ3RoID0gdGFyZ2V0TGluZS5pbmRleE9mKGV4cGVjdGVkRmlyc3RMaW5lKTtcclxuXHRcdFx0XHRpZiAoaW5kZW50TGVuZ3RoID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0c2FtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzYW1lID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGluZGVudCA9IHRhcmdldExpbmUuc3Vic3RyKDAsIGluZGVudExlbmd0aCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgeyAvLyBsaW5lSW5kZXggPj0gMVxyXG5cdFx0XHRcdGNvbnN0ICBleHBlY3RlZCA9IGdldEV4cGVjdGVkTGluZUluRmlsZVRlbXBsYXRlKFxyXG5cdFx0XHRcdFx0c2V0dGluZywgdGhpcy50ZW1wbGF0ZUxpbmVzW3RlbXBsYXRlTGluZUluZGV4XSk7XHJcblxyXG5cdFx0XHRcdHNhbWUgPSAodGFyZ2V0TGluZSA9PT0gaW5kZW50ICsgZXhwZWN0ZWQpO1xyXG5cdFx0XHRcdGlmICghc2FtZSkge1xyXG5cdFx0XHRcdFx0ZXJyb3JUZW1wbGF0ZUxpbmVJbmRleCA9IHRlbXBsYXRlTGluZUluZGV4O1xyXG5cdFx0XHRcdFx0ZXJyb3JUYXJnZXRMaW5lTnVtID0gdGFyZ2V0TGluZU51bTtcclxuXHRcdFx0XHRcdGVycm9yQ29udGVudHMgPSB0YXJnZXRMaW5lO1xyXG5cdFx0XHRcdFx0ZXJyb3JFeHBlY3RlZCA9IGluZGVudCArIGV4cGVjdGVkO1xyXG5cdFx0XHRcdFx0ZXJyb3JUZW1wbGF0ZSA9IGluZGVudCArIHRoaXMudGVtcGxhdGVMaW5lc1t0ZW1wbGF0ZUxpbmVJbmRleF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzYW1lKSB7XHJcblx0XHRcdFx0dGVtcGxhdGVMaW5lSW5kZXggKz0gMTtcclxuXHRcdFx0XHRpZiAodGVtcGxhdGVMaW5lSW5kZXggPj0gdGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRlbXBsYXRlTGluZUluZGV4ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCFzYW1lKSB7XHJcblx0XHRcdGNvbnN0ICB0ZW1wbGF0ZUxpbmVOdW0gPSB0ZW1wbGF0ZUVuZExpbmVOdW0gLSB0aGlzLnRlbXBsYXRlTGluZXMubGVuZ3RoICsgZXJyb3JUZW1wbGF0ZUxpbmVJbmRleDtcclxuXHRcdFx0aWYgKGVycm9yQ29udGVudHMgPT09ICcnKSB7XHJcblx0XHRcdFx0ZXJyb3JDb250ZW50cyA9ICcoTm90IGZvdW5kKSc7XHJcblx0XHRcdFx0ZXJyb3JFeHBlY3RlZCA9IGV4cGVjdGVkRmlyc3RMaW5lO1xyXG5cdFx0XHRcdGVycm9yVGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlTGluZXNbMF07XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgndHlwcm1GaWxlJyl9OiAke2dldFRlc3RhYmxlKGlucHV0RmlsZVBhdGgpfToke3RlbXBsYXRlTGluZU51bX1gKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckZpbGUnKX06ICR7Z2V0VGVzdGFibGUodGFyZ2V0RmlsZVBhdGgpfToke2Vycm9yVGFyZ2V0TGluZU51bX1gKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYCAgQ29udGVudHM6ICR7ZXJyb3JDb250ZW50c31gKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYCAgRXhwZWN0ZWQ6ICR7ZXJyb3JFeHBlY3RlZH1gKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYCAgVGVtcGxhdGU6ICR7ZXJyb3JUZW1wbGF0ZX1gKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAgc2FtZTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIG9uRW5kT2ZTZXR0aW5nXHJcbmZ1bmN0aW9uIG9uRW5kT2ZTZXR0aW5nKHNldHRpbmc6IFNldHRpbmdzKSB7XHJcblx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZykpIHtcclxuXHRcdGlmICghc2V0dGluZ1trZXldLmlzUmVmZXJlbmNlZCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGVgTm90IHJlZmVyZW5jZWQ6ICR7a2V5fSBpbiBsaW5lICR7c2V0dGluZ1trZXldLmxpbmVOdW19YCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBnZXRTZXR0aW5nSW5kZXhGcm9tTGluZU51bVxyXG5hc3luYyBmdW5jdGlvbiAgZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW0oaW5wdXRGaWxlUGF0aDogc3RyaW5nLCB0YXJnZXRMaW5lTnVtOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4ge1xyXG5cdGNvbnN0ICByZWFkZXIgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5wdXRGaWxlUGF0aCksXHJcblx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0fSk7XHJcblx0bGV0ICBzZXR0aW5nQ291bnQgPSAwO1xyXG5cdGxldCAgbGluZU51bSA9IDA7XHJcblxyXG5cdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRsaW5lTnVtICs9IDE7XHJcblxyXG5cdFx0aWYgKGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbCAgfHwgIGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbEVuKSB7XHJcblx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChsaW5lTnVtID09PSB0YXJnZXRMaW5lTnVtKSB7XHJcblx0XHRcdHJldHVybiAgc2V0dGluZ0NvdW50O1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gIDA7XHJcbn1cclxuXHJcbi8vIGlzRW5kT2ZTZXR0aW5nXHJcbmZ1bmN0aW9uICBpc0VuZE9mU2V0dGluZyhsaW5lOiBzdHJpbmcsIGlzUmVhZGluZ1NldHRpbmc6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuXHRsZXQgIHJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0aWYgKGlzUmVhZGluZ1NldHRpbmcpIHtcclxuXHRcdGNvbnN0IGNvbW1lbnQgPSBsaW5lLmluZGV4T2YoJyMnKTtcclxuXHRcdGxldCBsZWZ0T2ZDb21tZW50OiBzdHJpbmc7XHJcblx0XHRpZiAoY29tbWVudCAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0bGVmdE9mQ29tbWVudCA9IGxpbmUuc3Vic3RyKDAsIGxpbmUuaW5kZXhPZignIycpKS50cmltKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bGVmdE9mQ29tbWVudCA9IGxpbmUudHJpbSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChsZWZ0T2ZDb21tZW50LmluZGV4T2YoJzonKSA9PT0gbm90Rm91bmQgICYmICBsZWZ0T2ZDb21tZW50ICE9PSAnJykge1xyXG5cdFx0XHRyZXR1cm5WYWx1ZSA9IHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKGxlZnRPZkNvbW1lbnQuc3Vic3RyKC0xKSA9PT0gJ3wnKSB7XHJcblx0XHRcdHJldHVyblZhbHVlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICByZXR1cm5WYWx1ZTtcclxufVxyXG5cclxuLy8gZ2V0RnVsbFBhdGhcclxuZnVuY3Rpb24gIGdldEZ1bGxQYXRoKHJlbGF0aXZlUGF0aDogc3RyaW5nLCBiYXNlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuXHR2YXIgIGZ1bGxQYXRoID0gJyc7XHJcblx0aWYgKHJlbGF0aXZlUGF0aC5zdWJzdHIoMCwxKSA9PT0gJy8nKSB7XHJcblx0XHRmdWxsUGF0aCA9IHJlbGF0aXZlUGF0aDtcclxuXHR9IGVsc2UgaWYgKHJlbGF0aXZlUGF0aC5zdWJzdHIoMCwxKSA9PT0gJ34nKSB7XHJcblx0XHRmdWxsUGF0aCA9IHJlbGF0aXZlUGF0aC5yZXBsYWNlKCd+JywgcHJvY2Vzcy5lbnYuSE9NRSEpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRmdWxsUGF0aCA9IHBhdGguam9pbihiYXNlUGF0aCwgcmVsYXRpdmVQYXRoKTtcclxuXHR9XHJcblx0cmV0dXJuICBmdWxsUGF0aDtcclxufVxyXG5cclxuLy8gZGVsZXRlRmlsZVxyXG5mdW5jdGlvbiAgZGVsZXRlRmlsZShwYXRoOiBzdHJpbmcpIHtcclxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGgpKSB7XHJcbiAgICAgICAgZnMudW5saW5rU3luYyhwYXRoKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gZ2V0VmFsdWVcclxuZnVuY3Rpb24gIGdldFZhbHVlKGxpbmU6IHN0cmluZywgc2VwYXJhdG9ySW5kZXg6IG51bWJlcikge1xyXG5cdGxldCAgICB2YWx1ZSA9IGxpbmUuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xyXG5cdGNvbnN0ICBjb21tZW50ID0gdmFsdWUuaW5kZXhPZignIycpO1xyXG5cdGlmIChjb21tZW50ICE9PSBub3RGb3VuZCkge1xyXG5cdFx0dmFsdWUgPSB2YWx1ZS5zdWJzdHIoMCwgY29tbWVudCkudHJpbSgpO1xyXG5cdH1cclxuXHRyZXR1cm4gIHZhbHVlO1xyXG59XHJcblxyXG4vLyBnZXRFeHBlY3RlZExpbmVcclxuZnVuY3Rpb24gIGdldEV4cGVjdGVkTGluZShzZXR0aW5nOiBTZXR0aW5ncywgdGVtcGxhdGU6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0bGV0ICBleHBlY3RlZCA9IHRlbXBsYXRlO1xyXG5cclxuXHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzZXR0aW5nKSkge1xyXG5cdFx0Y29uc3QgIHJlID0gbmV3IFJlZ0V4cCggZXNjYXBlUmVndWxhckV4cHJlc3Npb24oa2V5KSwgXCJnaVwiICk7XHJcblxyXG5cdFx0Y29uc3QgIGV4cGVjdGVkQWZ0ZXIgPSBleHBlY3RlZC5yZXBsYWNlKHJlLCBzZXR0aW5nW2tleV0udmFsdWUpO1xyXG5cdFx0aWYgKGV4cGVjdGVkQWZ0ZXIgIT09IGV4cGVjdGVkKSB7XHJcblx0XHRcdHNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0ZXhwZWN0ZWQgPSBleHBlY3RlZEFmdGVyO1xyXG5cdH1cclxuXHRyZXR1cm4gIGV4cGVjdGVkO1xyXG59XHJcblxyXG4vLyBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZVxyXG5mdW5jdGlvbiAgZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGUoc2V0dGluZzogU2V0dGluZ3MsIHRlbXBsYXRlOiBzdHJpbmcpIHtcclxuXHJcblx0bGV0ICBleHBlY3RlZCA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0Y29uc3QgIHRlbXBsYXRlSW5kZXggPSBleHBlY3RlZC5pbmRleE9mKHRlbXBsYXRlTGFiZWwpO1xyXG5cdGlmICh0ZW1wbGF0ZUluZGV4ICE9PSBub3RGb3VuZCkge1xyXG5cclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWQuc3Vic3RyKDAsIHRlbXBsYXRlSW5kZXgpO1xyXG5cdFx0ZXhwZWN0ZWQgPSBleHBlY3RlZC50cmltUmlnaHQoKTtcclxuXHR9XHJcblx0cmV0dXJuICBleHBlY3RlZDtcclxufVxyXG5cclxuLy8gZ2V0Q2hhbmdlZExpbmVcclxuZnVuY3Rpb24gIGdldENoYW5nZWRMaW5lKHNldHRpbmc6IFNldHRpbmdzLCB0ZW1wbGF0ZTogc3RyaW5nLCBjaGFuZ2luZ0tleTogc3RyaW5nLCBjaGFuZ2VkVmFsdWU6IHN0cmluZykge1xyXG5cdGxldCAgY2hhbmdlZExpbmUgPSAnJztcclxuXHRpZiAoY2hhbmdpbmdLZXkgaW4gc2V0dGluZykge1xyXG5cdFx0Y29uc3QgIGNoYW5naW5nVmFsdWUgPSBzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZTtcclxuXHJcblx0XHRzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZSA9IGNoYW5nZWRWYWx1ZTtcclxuXHJcblx0XHRjaGFuZ2VkTGluZSA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0XHRzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZSA9IGNoYW5naW5nVmFsdWU7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNoYW5nZWRMaW5lID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlKTtcclxuXHR9XHJcblx0cmV0dXJuICBjaGFuZ2VkTGluZTtcclxufVxyXG5cclxuLy8gZ2V0Q2hhbmdlZFZhbHVlXHJcbmZ1bmN0aW9uICBnZXRDaGFuZ2VkVmFsdWUoY2hhbmdlZFZhbHVlQW5kQ29tbWVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRjb25zdCAgY29tbWVudEluZGV4ID0gY2hhbmdlZFZhbHVlQW5kQ29tbWVudC5pbmRleE9mKCcjJyk7XHJcblx0bGV0ICBjaGFuZ2VkVmFsdWU6IHN0cmluZztcclxuXHRpZiAoY29tbWVudEluZGV4ICE9PSBub3RGb3VuZCkge1xyXG5cclxuXHRcdGNoYW5nZWRWYWx1ZSA9IGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuc3Vic3RyKDAsIGNvbW1lbnRJbmRleCkudHJpbSgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGFuZ2VkVmFsdWUgPSBjaGFuZ2VkVmFsdWVBbmRDb21tZW50O1xyXG5cdH1cclxuXHRyZXR1cm4gIGNoYW5nZWRWYWx1ZTtcclxufVxyXG5cclxuLy8gcGFyc2VUZW1wbGF0ZVRhZ1xyXG5mdW5jdGlvbiAgcGFyc2VUZW1wbGF0ZVRhZyhsaW5lOiBzdHJpbmcpOiBUZW1wbGF0ZVRhZyB7XHJcblx0Y29uc3QgIHRhZyA9IG5ldyBUZW1wbGF0ZVRhZygpO1xyXG5cclxuXHR0YWcubGFiZWwgPSB0ZW1wbGF0ZUxhYmVsO1xyXG5cdHRhZy5pbmRleEluTGluZSA9IGxpbmUuaW5kZXhPZih0ZW1wbGF0ZUxhYmVsKTtcclxuXHRpZiAodGFnLmluZGV4SW5MaW5lID09PSBub3RGb3VuZCkge1xyXG5cdFx0dGFnLmxhYmVsID0gZmlsZVRlbXBsYXRlTGFiZWw7XHJcblx0XHR0YWcuaW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YoZmlsZVRlbXBsYXRlTGFiZWwpO1xyXG5cdH1cclxuXHRpZiAodGFnLmluZGV4SW5MaW5lICE9PSBub3RGb3VuZCkge1xyXG5cdFx0dGFnLmlzRm91bmQgPSB0cnVlO1xyXG5cdFx0Y29uc3QgIGxlZnRPZlRlbXBsYXRlID0gbGluZS5zdWJzdHIoMCwgdGFnLmluZGV4SW5MaW5lKS50cmltKCk7XHJcblx0XHRpZiAodGFnLmxhYmVsID09PSBmaWxlVGVtcGxhdGVMYWJlbCkge1xyXG5cdFx0XHR0YWcub25GaWxlVGVtcGxhdGVUYWdSZWFkaW5nKGxpbmUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRhZy50ZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKHRhZy5pbmRleEluTGluZSArIHRhZy5sYWJlbC5sZW5ndGgpLnRyaW0oKTtcclxuXHRcdGlmIChsZWZ0T2ZUZW1wbGF0ZSA9PT0gJycpIHtcclxuXHRcdFx0dGFnLmxpbmVOdW1PZmZzZXQgPSAtMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRhZy5saW5lTnVtT2Zmc2V0ID0gMDtcclxuXHRcdH1cclxuXHRcdHJldHVybiAgdGFnO1xyXG5cdH1cclxuXHJcblx0dGFnLmxhYmVsID0gdGVtcGxhdGVBdFN0YXJ0TGFiZWw7XHJcblx0dGFnLnN0YXJ0SW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YodGVtcGxhdGVBdFN0YXJ0TGFiZWwpO1xyXG5cdGlmICh0YWcuc3RhcnRJbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5pc0ZvdW5kID0gdHJ1ZTtcclxuXHRcdHRhZy5lbmRJbmRleEluTGluZSA9ICBsaW5lLmluZGV4T2YodGVtcGxhdGVBdEVuZExhYmVsLCB0YWcuc3RhcnRJbmRleEluTGluZSk7XHJcblx0XHRpZiAodGFnLmVuZEluZGV4SW5MaW5lICE9PSBub3RGb3VuZCkge1xyXG5cclxuXHRcdFx0dGFnLnRlbXBsYXRlID0gbGluZS5zdWJzdHIodGFnLmVuZEluZGV4SW5MaW5lICsgdGVtcGxhdGVBdEVuZExhYmVsLmxlbmd0aCkudHJpbSgpO1xyXG5cdFx0XHR0YWcubGluZU51bU9mZnNldCA9IHBhcnNlSW50KGxpbmUuc3Vic3RyaW5nKFxyXG5cdFx0XHRcdHRhZy5zdGFydEluZGV4SW5MaW5lICsgdGVtcGxhdGVBdFN0YXJ0TGFiZWwubGVuZ3RoLFxyXG5cdFx0XHRcdHRhZy5lbmRJbmRleEluTGluZSApKTtcclxuXHRcdFx0cmV0dXJuICB0YWc7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR0YWcubGFiZWwgPSAnJztcclxuXHR0YWcudGVtcGxhdGUgPSAnJztcclxuXHR0YWcubGluZU51bU9mZnNldCA9IDA7XHJcblx0cmV0dXJuICB0YWc7XHJcbn1cclxuXHJcbi8vIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uXHJcbmZ1bmN0aW9uICBlc2NhcGVSZWd1bGFyRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gIGV4cHJlc3Npb24ucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKTtcclxufVxyXG5cclxuLy8gU3RhbmRhcmRJbnB1dEJ1ZmZlclxyXG5jbGFzcyAgU3RhbmRhcmRJbnB1dEJ1ZmZlciB7XHJcblx0cmVhZGxpbmVzOiByZWFkbGluZS5JbnRlcmZhY2U7XHJcblx0aW5wdXRCdWZmZXI6IHN0cmluZ1tdID0gW107XHJcblx0aW5wdXRSZXNvbHZlcj86IChhbnN3ZXI6c3RyaW5nKT0+dm9pZCA9IHVuZGVmaW5lZDtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnJlYWRsaW5lcyA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBwcm9jZXNzLnN0ZGluLFxyXG5cdFx0XHRvdXRwdXQ6IHByb2Nlc3Muc3Rkb3V0XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucmVhZGxpbmVzLm9uKCdsaW5lJywgYXN5bmMgKGxpbmU6IHN0cmluZykgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5pbnB1dFJlc29sdmVyKSB7XHJcblx0XHRcdFx0dGhpcy5pbnB1dFJlc29sdmVyKGxpbmUpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlciA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmlucHV0QnVmZmVyLnB1c2gobGluZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMucmVhZGxpbmVzLnNldFByb21wdCgnJyk7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5wcm9tcHQoKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jICBpbnB1dChndWlkZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdHJldHVybiAgbmV3IFByb21pc2UoXHJcblx0XHRcdChyZXNvbHZlOiAoYW5zd2VyOnN0cmluZyk9PnZvaWQsICByZWplY3Q6IChhbnN3ZXI6c3RyaW5nKT0+dm9pZCApID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0ICBuZXh0TGluZSA9IHRoaXMuaW5wdXRCdWZmZXIuc2hpZnQoKTtcclxuXHRcdFx0aWYgKG5leHRMaW5lKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZ3VpZGUgKyBuZXh0TGluZSk7XHJcblx0XHRcdFx0cmVzb2x2ZShuZXh0TGluZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cHJvY2Vzcy5zdGRvdXQud3JpdGUoZ3VpZGUpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlciA9IHJlc29sdmU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Y2xvc2UoKSB7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5jbG9zZSgpO1xyXG5cdH1cclxufVxyXG5cclxuLy8gSW5wdXRPcHRpb25cclxuY2xhc3MgSW5wdXRPcHRpb24ge1xyXG5cdGlucHV0TGluZXM6IHN0cmluZ1tdO1xyXG5cdG5leHRMaW5lSW5kZXg6IG51bWJlcjtcclxuXHRuZXh0UGFyYW1ldGVySW5kZXg6IG51bWJlcjsgIC8vIFRoZSBpbmRleCBvZiB0aGUgc3RhcnRpbmcgcHJvY2VzcyBwYXJhbWV0ZXJzXHJcblxyXG5cdGNvbnN0cnVjdG9yKGlucHV0TGluZXM6IHN0cmluZ1tdKSB7XHJcblx0XHR0aGlzLmlucHV0TGluZXMgPSBpbnB1dExpbmVzO1xyXG5cdFx0dGhpcy5uZXh0TGluZUluZGV4ID0gMDtcclxuXHRcdHRoaXMubmV4dFBhcmFtZXRlckluZGV4ID0gMjtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0ICB0ZXN0QmFzZUZvbGRlciA9IFN0cmluZy5yYXcgYFI6XFxob21lXFxtZW1fY2FjaGVcXE15RG9jXFxzcmNcXFR5cGVTY3JpcHRcXHR5cHJtXFx0ZXN0X2RhdGFgKydcXFxcJztcclxuXHJcbi8vIGlucHV0T3B0aW9uXHJcbmNvbnN0IGlucHV0T3B0aW9uID0gbmV3IElucHV0T3B0aW9uKFtcclxuLypcclxuXHR0ZXN0QmFzZUZvbGRlciArYGNoYW5nZV9zZXRfLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYGZpbGVgLFxyXG5cdHRlc3RCYXNlRm9sZGVyICtgY2hhbmdlX3NldF9zZXR0aW5nLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYENoYW5nZWRgLFxyXG4qL1xyXG5dKTtcclxuXHJcbi8vIGlucHV0XHJcbi8vIEV4YW1wbGU6IGNvbnN0IG5hbWUgPSBhd2FpdCBpbnB1dCgnV2hhdCBpcyB5b3VyIG5hbWU/ICcpO1xyXG5hc3luYyBmdW5jdGlvbiAgaW5wdXQoIGd1aWRlOiBzdHJpbmcgKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHQvLyBJbnB1dCBlbXVsYXRpb25cclxuXHRpZiAoaW5wdXRPcHRpb24uaW5wdXRMaW5lcykge1xyXG5cdFx0aWYgKGlucHV0T3B0aW9uLm5leHRMaW5lSW5kZXggPCBpbnB1dE9wdGlvbi5pbnB1dExpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCAgdmFsdWUgPSBpbnB1dE9wdGlvbi5pbnB1dExpbmVzW2lucHV0T3B0aW9uLm5leHRMaW5lSW5kZXhdO1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4ICs9IDE7XHJcblx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgdmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuICB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJlYWQgdGhlIHN0YXJ0aW5nIHByb2Nlc3MgcGFyYW1ldGVyc1xyXG5cdHdoaWxlIChpbnB1dE9wdGlvbi5uZXh0UGFyYW1ldGVySW5kZXggPCBwcm9jZXNzLmFyZ3YubGVuZ3RoKSB7XHJcblx0XHRjb25zdCAgdmFsdWUgPSBwcm9jZXNzLmFyZ3ZbaW5wdXRPcHRpb24ubmV4dFBhcmFtZXRlckluZGV4XTtcclxuXHRcdGlucHV0T3B0aW9uLm5leHRQYXJhbWV0ZXJJbmRleCArPSAxO1xyXG5cdFx0aWYgKHZhbHVlLnN1YnN0cigwLDEpICE9PSAnLScpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZ3VpZGUgKyB2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHZhbHVlICE9PSAnLS10ZXN0Jykge1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0UGFyYW1ldGVySW5kZXggKz0gMTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGlucHV0XHJcblx0cmV0dXJuICBJbnB1dE9iamVjdC5pbnB1dChndWlkZSk7XHJcbn1cclxuY29uc3QgIElucHV0T2JqZWN0ID0gbmV3IFN0YW5kYXJkSW5wdXRCdWZmZXIoKTtcclxuXHJcbi8vIGlucHV0UGF0aFxyXG4vLyBFeGFtcGxlOiBjb25zdCBuYW1lID0gYXdhaXQgaW5wdXQoJ1doYXQgaXMgeW91ciBuYW1lPyAnKTtcclxuYXN5bmMgZnVuY3Rpb24gIGlucHV0UGF0aCggZ3VpZGU6IHN0cmluZyApIHtcclxuXHRjb25zdCAga2V5ID0gYXdhaXQgaW5wdXQoZ3VpZGUpO1xyXG5cdHJldHVybiAgcGF0aFJlc29sdmUoa2V5KTtcclxufVxyXG5cclxuLy8gcGF0aFJlc29sdmVcclxuZnVuY3Rpb24gIHBhdGhSZXNvbHZlKHBhdGhfOiBzdHJpbmcpIHtcclxuXHJcblx0Ly8gJy9jL2hvbWUnIGZvcm1hdCB0byBjdXJyZW50IE9TIGZvcm1hdFxyXG5cdGlmIChwYXRoXy5sZW5ndGggPj0gMykge1xyXG5cdFx0aWYgKHBhdGhfWzBdID09PSAnLycgICYmICBwYXRoX1syXSA9PT0gJy8nKSB7XHJcblx0XHRcdHBhdGhfID0gcGF0aF9bMV0gKyc6JysgcGF0aF8uc3Vic3RyKDIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gQ2hhbmdlIHNlcGFyYXRvcnMgdG8gT1MgZm9ybWF0XHJcblx0cGF0aF8gPSBwYXRoLnJlc29sdmUocGF0aF8pO1xyXG5cclxuXHRyZXR1cm4gcGF0aF9cclxufVxyXG5cclxuLy8gU2V0dGluZ1xyXG50eXBlIFNldHRpbmdzID0ge1tuYW1lOiBzdHJpbmddOiBTZXR0aW5nfVxyXG5cclxuLy8gU2V0dGluZ1xyXG5jbGFzcyBTZXR0aW5nIHtcclxuXHR2YWx1ZTogc3RyaW5nID0gJyc7XHJcblx0bGluZU51bTogbnVtYmVyID0gMDtcclxuXHRpc1JlZmVyZW5jZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuLy8gU2VhcmNoS2V5d29yZFxyXG5jbGFzcyBTZWFyY2hLZXl3b3JkIHtcclxuXHRrZXl3b3JkOiBzdHJpbmcgPSAnJztcclxuXHRzdGFydExpbmVOdW06IG51bWJlciA9IDA7XHJcblx0ZGlyZWN0aW9uOiBEaXJlY3Rpb24gPSBEaXJlY3Rpb24uRm9sbG93aW5nO1xyXG59XHJcblxyXG4vLyBEaXJlY3Rpb25cclxuZW51bSBEaXJlY3Rpb24ge1xyXG5cdEFib3ZlID0gLTEsXHJcblx0Rm9sbG93aW5nID0gKzEsXHJcbn1cclxuXHJcbi8vIFdyaXRlQnVmZmVyXHJcbmNsYXNzICBXcml0ZUJ1ZmZlciB7XHJcblx0c3RyZWFtOiBmcy5Xcml0ZVN0cmVhbTtcclxuXHRsaW5lQnVmZmVyOiBzdHJpbmdbXTtcclxuXHJcblx0Y29uc3RydWN0b3Ioc3RyZWFtOiBmcy5Xcml0ZVN0cmVhbSkge1xyXG5cdFx0dGhpcy5zdHJlYW0gPSBzdHJlYW07XHJcblx0XHR0aGlzLmxpbmVCdWZmZXIgPSBbXTtcclxuXHR9XHJcblxyXG5cdGVuZCgpIHtcclxuXHRcdGZvciAoY29uc3QgbGluZSAgb2YgIHRoaXMubGluZUJ1ZmZlcikge1xyXG5cdFx0XHR0aGlzLnN0cmVhbS53cml0ZShsaW5lKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3RyZWFtLmVuZCgpO1xyXG4gICAgfVxyXG5cclxuXHRvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG5cdFx0dGhpcy5zdHJlYW0ub24oZXZlbnQsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHdyaXRlKGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5saW5lQnVmZmVyLnB1c2gobGluZSk7XHJcblx0fVxyXG5cclxuXHRyZXBsYWNlQWJvdmVMaW5lKHJlbGF0aXZlTGluZU51bTogbnVtYmVyLCBsaW5lOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMubGluZUJ1ZmZlclt0aGlzLmxpbmVCdWZmZXIubGVuZ3RoICsgcmVsYXRpdmVMaW5lTnVtXSA9IGxpbmU7XHJcblx0fVxyXG59XHJcblxyXG4vLyB0cmFuc2xhdGVcclxuLy8gZS5nLiB0cmFuc2xhdGUoJ2VuZ2xpc2gnKVxyXG4vLyBlLmcuIHRyYW5zbGF0ZWBwcmljZSA9ICR7cHJpY2V9YCAgLy8gLi4uIHRhZ2dlZFRlbXBsYXRlXHJcbmZ1bmN0aW9uICB0cmFuc2xhdGUoZW5nbGlzaExpdGVyYWxzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSB8IHN0cmluZywgIC4uLnZhbHVlczogYW55W10pOiBzdHJpbmcge1xyXG5cdGxldCAgICBkaWN0aW9uYXJ5OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblx0Y29uc3QgIHRhZ2dlZFRlbXBsYXRlID0gKHR5cGVvZihlbmdsaXNoTGl0ZXJhbHMpICE9PSAnc3RyaW5nJyk7XHJcblxyXG5cdGxldCAgZW5nbGlzaCA9IGVuZ2xpc2hMaXRlcmFscyBhcyBzdHJpbmc7XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRlbmdsaXNoID0gJyc7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRlbmdsaXNoICs9IGVuZ2xpc2hMaXRlcmFsc1tpXTtcclxuXHRcdFx0aWYgKGkgPCB2YWx1ZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0ZW5nbGlzaCArPSAnJHsnICsgU3RyaW5nKGkpICsnfSc7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZS5nLiBlbmdsaXNoID0gJ3ByaWNlID0gJHswfSdcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChsb2NhbGUgPT09ICdqYS1KUCcpIHtcclxuXHRcdGRpY3Rpb25hcnkgPSB7XHJcblx0XHRcdFwiWUFNTCBVVEYtOCBmaWxlIHBhdGg+XCI6IFwiWUFNTCBVVEYtOCDjg5XjgqHjgqTjg6sg44OR44K5PlwiLFxyXG5cdFx0XHRcIlRoaXMgaXMgYSBzZWNyZXQgdmFsdWUuXCI6IFwi44GT44KM44Gv56eY5a+G44Gu5YCk44Gn44GZ44CCXCIsXHJcblx0XHRcdFwiQ2hhbmdlIFxcXCIkezB9XFxcIiB0byBcXFwiJHsxfVxcXCIuXCI6IFwiXFxcIiR7MH1cXFwiIOOCkiBcXFwiJHsxfVxcXCIg44Gr5aSJ5pu044GX44Gm44GP44Gg44GV44GE44CCXCIsXHJcblx0XHRcdFwiUHJlc3MgRW50ZXIga2V5IHRvIHJldHJ5IGNoZWNraW5nLlwiOiBcIkVudGVyIOOCreODvOOCkuaKvOOBmeOBqOWGjeODgeOCp+ODg+OCr+OBl+OBvuOBmeOAglwiLFxyXG5cdFx0XHRcIlRoZSBsaW5lIG51bWJlciB0byBjaGFuZ2UgdGhlIHZhcmlhYmxlIHZhbHVlID5cIjogXCLlpInmm7TjgZnjgovlpInmlbDlgKTjgYzjgYLjgovooYznlarlj7cgPlwiLFxyXG5cdFx0XHRcIkVudGVyIG9ubHk6IGZpbmlzaCB0byBpbnB1dCBzZXR0aW5nXCI6IFwiRW50ZXIg44Gu44G/77ya6Kit5a6a44Gu5YWl5Yqb44KS57WC44KP44KLXCIsXHJcblx0XHRcdFwia2V5OiBuZXdfdmFsdWU+XCI6IFwi5aSJ5pWw5ZCNOiDmlrDjgZfjgYTlpInmlbDlgKQ+XCIsXHJcblx0XHRcdFwidGVtcGxhdGUgY291bnRcIjogXCLjg4bjg7Pjg5fjg6zjg7zjg4jjga7mlbBcIixcclxuXHRcdFx0XCJpbiBwcmV2aW91cyBjaGVja1wiOiBcIuWJjeWbnuOBruODgeOCp+ODg+OCr1wiLFxyXG5cdFx0XHRcIldhcm5pbmdcIjogXCLorablkYpcIixcclxuXHRcdFx0XCJFcnJvclwiOiBcIuOCqOODqeODvFwiLFxyXG5cdFx0XHRcIkVycm9yTGluZVwiOiBcIuOCqOODqeODvOihjFwiLFxyXG5cdFx0XHRcIlNvbHV0aW9uXCI6IFwi6Kej5rG65rOVXCIsXHJcblx0XHRcdFwiQ29udGVudHNcIjogXCLlhoXlrrlcIixcclxuXHRcdFx0XCJFeHBlY3RlZFwiOiBcIuacn+W+hVwiLFxyXG5cdFx0XHRcIlRlbXBsYXRlXCI6IFwi6Zub5b2iXCIsXHJcblx0XHRcdFwiV2FybmluZ0xpbmVcIjogXCLorablkYrooYxcIixcclxuXHRcdFx0XCJGb3VuZFwiOiBcIuimi+OBpOOBi+OBo+OBn+OCguOBrlwiLFxyXG5cdFx0XHRcIlNldHRpbmdJbmRleFwiOiBcIuioreWumueVquWPt1wiLFxyXG5cdFx0XHRcIk5vdCBmb3VuZCBhbnkgcmVwbGFjaW5nIHRhcmdldFwiOiBcIue9ruOBjeaPm+OBiOOCi+WvvuixoeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIlNldCBvbGQgdmFsdWUgYXQgc2V0dGluZ3MgaW4gdGhlIHJlcGxhY2luZyBmaWxlXCI6IFwi572u44GN5o+b44GI44KL44OV44Kh44Kk44Or44Gu5Lit44Gu6Kit5a6a44Gr5Y+k44GE5YCk44KS6Kit5a6a44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwXCI6IFwi44OR44Op44Oh44O844K/44O844GvIDAg44KI44KK5bCP44GV44GP44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiTm90IGZvdW5kIFxcXCIkezB9XFxcIiBhYm92ZVwiOiBcIuS4iuaWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgZm91bmQgXFxcIiR7MH1cXFwiIGZvbGxvd2luZ1wiOiBcIuS4i+aWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgcmVmZXJlbmNlZDogJHswfSBpbiBsaW5lICR7MX1cIjogXCLlj4LnhafjgZXjgozjgabjgYTjgb7jgZvjgpPvvJogJHswfSDvvIgkezF96KGM55uu77yJXCIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHRsZXQgIHRyYW5zbGF0ZWQgPSBlbmdsaXNoO1xyXG5cdGlmIChkaWN0aW9uYXJ5KSB7XHJcblx0XHRpZiAoZW5nbGlzaCBpbiBkaWN0aW9uYXJ5KSB7XHJcblxyXG5cdFx0XHR0cmFuc2xhdGVkID0gZGljdGlvbmFyeVtlbmdsaXNoXTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJHsnK1N0cmluZyhpKSsnfScsIFN0cmluZyh2YWx1ZXNbaV0pICk7XHJcblx0XHR9XHJcblx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJFxcXFx7JywgJyR7JyApO1xyXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBlc2NhcGUgb2YgJHtufVxyXG5cdFx0XHQvLyBlLmcuIFwiJFxcXFx7cHJpY2V9ID0gJHtwcmljZX1cIiA9PiBcIiR7cHJpY2V9ID0gMTAwXCJcclxuXHR9XHJcblx0cmV0dXJuICB0cmFuc2xhdGVkO1xyXG59XHJcblxyXG5jb25zdCAgc2V0dGluZ1N0YXJ0TGFiZWwgPSBcIuioreWumjpcIjtcclxuY29uc3QgIHNldHRpbmdTdGFydExhYmVsRW4gPSBcInNldHRpbmdzOlwiO1xyXG5jb25zdCAgdGVtcGxhdGVMYWJlbCA9IFwiI3RlbXBsYXRlOlwiO1xyXG5jb25zdCAgdGVtcGxhdGVBdFN0YXJ0TGFiZWwgPSBcIiN0ZW1wbGF0ZS1hdChcIjtcclxuY29uc3QgIHRlbXBsYXRlQXRFbmRMYWJlbCA9IFwiKTpcIjtcclxuY29uc3QgIGZpbGVUZW1wbGF0ZUxhYmVsID0gXCIjZmlsZS10ZW1wbGF0ZTpcIjtcclxuY29uc3QgIHRlbXBvcmFyeUxhYmVscyA9IFtcIiPimIVOb3c6XCIsIFwiI25vdzpcIiwgXCIj4piF5pu444GN44GL44GRXCIsIFwiI+KYheacqueiuuiqjVwiXTtcclxuY29uc3QgIHNlY3JldExhYmVsID0gXCIj4piF56eY5a+GXCI7XHJcbmNvbnN0ICBzZWNyZXRMYWJlbEVuID0gXCIjc2VjcmV0XCI7XHJcbmNvbnN0ICBzZWNyZXRFeGFtbGVMYWJlbCA9IFwiI+KYheenmOWvhjrku65cIjtcclxuY29uc3QgIHNlY3JldEV4YW1sZUxhYmVsRW4gPSBcIiNzZWNyZXQ6ZXhhbXBsZVwiO1xyXG5jb25zdCAgcmVmZXJQYXR0ZXJuID0gLyjkuIroqJh85LiL6KiYfGFib3ZlfGZvbGxvd2luZyko44CMfFxcWykoW17jgI1dKiko44CNfFxcXSkvZztcclxuY29uc3QgIGluZGVudFJlZ3VsYXJFeHByZXNzaW9uID0gL14oIHzCpXQpKi87XHJcbmNvbnN0ICBtaW5MaW5lTnVtID0gMDtcclxuY29uc3QgIG1heExpbmVOdW0gPSA5OTk5OTk5OTk7XHJcbmNvbnN0ICBtYXhOdW1iZXIgPSA5OTk5OTk5OTk7XHJcbmNvbnN0ICBmb3VuZEZvckFib3ZlID0gbWluTGluZU51bTtcclxuY29uc3QgIGZvdW5kRm9yRm9sbG93aW5nID0gbWF4TGluZU51bTtcclxuY29uc3QgIG5vdEZvdW5kID0gLTE7XHJcbmNvbnN0ICBhbGxTZXR0aW5nID0gMDtcclxuY29uc3QgIG5vU2VwYXJhdG9yID0gLTE7XHJcbmxldCAgICBsb2NhbGU6IHN0cmluZztcclxuY29uc3QgIHByb2dyYW1PcHRpb25zID0gcHJvZ3JhbS5vcHRzKCk7XHJcbmZ1bmN0aW9uICBleGl0RnJvbUNvbW1hbmRlcihlOiBDb21tYW5kZXJFcnJvcikge1xyXG5cdGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XHJcbn1cclxuZnVuY3Rpb24gIGdldFRlc3RhYmxlKHBhdGg6IHN0cmluZykge1xyXG5cdGlmIChwcm9ncmFtT3B0aW9ucy50ZXN0KSB7XHJcblx0XHRpZiAocGF0aC5zdGFydHNXaXRoKGlucHV0RmlsZVBhcmVudFBhdGgpKSB7XHJcblx0XHRcdHJldHVybiAgJyR7aW5wdXRGaWxlUGFyZW50UGF0aH0nICsgcGF0aC5zdWJzdHIoaW5wdXRGaWxlUGFyZW50UGF0aC5sZW5ndGgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuICBwYXRoO1xyXG5cdFx0fVxyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gIHBhdGg7XHJcblx0fVxyXG59XHJcbmxldCAgaW5wdXRGaWxlUGFyZW50UGF0aCA9ICcnO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gIGNhbGxNYWluKCkge1xyXG5cdHByb2dyYW0udmVyc2lvbignMC4xLjEnKS5leGl0T3ZlcnJpZGUoZXhpdEZyb21Db21tYW5kZXIpXHJcblx0XHQub3B0aW9uKFwiLWwsIC0tbG9jYWxlIDxzPlwiKVxyXG5cdFx0Lm9wdGlvbihcIi10LCAtLXRlc3RcIilcclxuXHRcdC5wYXJzZShwcm9jZXNzLmFyZ3YpO1xyXG5cdFxyXG5cdGxvY2FsZSA9IEludGwuTnVtYmVyRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkubG9jYWxlO1xyXG5cdGlmIChwcm9ncmFtT3B0aW9ucy5sb2NhbGUpIHtcclxuXHRcdGxvY2FsZSA9IHByb2dyYW1PcHRpb25zLmxvY2FsZTtcclxuXHR9XHJcblxyXG5cdGF3YWl0ICBtYWluKClcclxuXHRcdC5jYXRjaCggKGUpPT57XHJcblx0XHRcdGlmIChwcm9ncmFtT3B0aW9ucy50ZXN0KSB7XHJcblx0XHRcdFx0dGhyb3cgZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0Y29uc29sZS5sb2coIGBFUlJPUjogJHtlLm1lc3NhZ2V9YCApO1xyXG5cdFx0XHRcdGNvbnN0ICB0aW1lT3ZlciA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0dGltZU92ZXIuc2V0U2Vjb25kcyggdGltZU92ZXIuZ2V0U2Vjb25kcygpICsgNSApO1xyXG5cclxuXHRcdFx0XHR3aGlsZSAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSA8IHRpbWVPdmVyLmdldFRpbWUoKSkge1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5maW5hbGx5KCgpPT57XHJcblx0XHRcdElucHV0T2JqZWN0LmNsb3NlKCk7XHJcblx0XHR9KTtcclxufVxyXG5jYWxsTWFpbigpO1xyXG4iXX0=