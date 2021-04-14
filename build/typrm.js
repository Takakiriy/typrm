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
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function () {
        var reader, settingCount, lineNum, reader_3, reader_3_1, line1, line, e_3_1;
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
                    reader_3 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_3.next()];
                case 3:
                    if (!(reader_3_1 = _b.sent(), !reader_3_1.done)) return [3 /*break*/, 5];
                    line1 = reader_3_1.value;
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
                case 12: return [2 /*return*/, 0];
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
    var e_4, _a;
    return __awaiter(this, void 0, void 0, function () {
        var backUpFilePath, oldFilePath, newFilePath, writer, reader, lines, isReadingSetting, setting, settingCount, changedValue, lineNum, errorCount, isChanging, reader_4, reader_4_1, line1, line, output, separator, key, value, commentIndex, comment, templateTag, checkingLine, expected, changed, before, after, aboveLine, e_4_1;
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
                    reader_4 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_4.next()];
                case 3:
                    if (!(reader_4_1 = _b.sent(), !reader_4_1.done)) return [3 /*break*/, 5];
                    line1 = reader_4_1.value;
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
                    e_4_1 = _b.sent();
                    e_4 = { error: e_4_1 };
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
                    if (e_4) throw e_4.error;
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
    if (!template) {
        return template;
    }
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
            this.templateLines.push(line.substr(this.indentAtTag.length));
            this.minIndentLength = Math.min(this.minIndentLength, currentIndent.length);
        }
        else {
            this.templateLines = this.templateLines.map(function (line) { return (line.substr(_this.minIndentLength)); });
            readingNext = false;
        }
        return readingNext;
    };
    TemplateTag.prototype.checkTargetContents = function (setting, inputFilePath, templateEndLineNum) {
        var e_5, _a;
        return __awaiter(this, void 0, void 0, function () {
            var parentPath, targetFilePath, targetFileReader, expectedFirstLine, templateLineIndex, targetLineNum, errorTemplateLineIndex, errorTargetLineNum, errorContents, errorExpected, errorTemplate, indent, same, targetFileReader_1, targetFileReader_1_1, line1, targetLine, indentLength, expected, e_5_1, templateLineNum;
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
                        e_5_1 = _b.sent();
                        e_5 = { error: e_5_1 };
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
                        if (e_5) throw e_5.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        if (!same) {
                            templateLineNum = templateEndLineNum - this.templateLines.length + errorTemplateLineIndex;
                            console.log("");
                            console.log(translate('ErrorFile') + ": " + getTestable(targetFilePath) + ":" + errorTargetLineNum);
                            console.log(translate('typrmFile') + ": " + getTestable(inputFilePath) + ":" + templateLineNum);
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
        var value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVCQUF5QixDQUFDLGNBQWM7QUFDeEMsMkJBQTZCLENBQUUsNEJBQTRCO0FBQzNELHVDQUFvRDtBQUNwRCxtQ0FBcUM7QUFFckMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUN2QixJQUFPLGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUNqQyxJQUFPLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztBQUN6QyxJQUFPLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDcEMsSUFBTyxvQkFBb0IsR0FBRyxlQUFlLENBQUM7QUFDOUMsSUFBTyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7QUFDakMsSUFBTyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUM3QyxJQUFPLGVBQWUsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hFLElBQU8sV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUM1QixJQUFPLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDakMsSUFBTyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7QUFDcEMsSUFBTyxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQztBQUMvQyxJQUFPLFlBQVksR0FBRyw2Q0FBNkMsQ0FBQztBQUVwRSxTQUFnQixJQUFJOzs7Ozs7d0JBQ0kscUJBQU0sU0FBUyxDQUFFLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFFLEVBQUE7O29CQUFyRSxhQUFhLEdBQUcsU0FBcUQ7b0JBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoRCxtQkFBbUIsR0FBRyxVQUFVLENBQUM7b0JBQzVCLHFCQUFxQixHQUFHLENBQUMsQ0FBQzs7O29CQUV6QixNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzt3QkFDdEMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7d0JBQ3pDLFNBQVMsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7b0JBQ0UsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO29CQUN6QixPQUFPLEdBQWEsRUFBRSxDQUFDO29CQUN2QixZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLGFBQWEsR0FBRyxDQUFDLENBQUM7b0JBQ2xCLGVBQWUsR0FBdUIsSUFBSSxDQUFDO29CQUMzQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNmLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLGdCQUFnQixHQUFHLENBQUMsQ0FBQztvQkFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDWCxRQUFRLEdBQW9CLEVBQUUsQ0FBQzs7OztvQkFFWiwwQkFBQSxjQUFBLE1BQU0sQ0FBQSxDQUFBOzs7OztvQkFBZixLQUFLLG1CQUFBLENBQUE7b0JBQ2QsSUFBSSxHQUFXLEtBQUssQ0FBQztvQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakIsT0FBTyxJQUFJLENBQUMsQ0FBQztvQkFDTix3QkFBd0IsR0FBRyxnQkFBZ0IsQ0FBQztvQkFFbkQsZ0JBQWdCO29CQUNoQixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxpQkFBaUIsSUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssbUJBQW1CLEVBQUU7d0JBQy9FLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTs0QkFDdEIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUN4Qjt3QkFDRCxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7d0JBRXhCLE9BQU8sR0FBRyxFQUFFLENBQUM7d0JBQ2IsWUFBWSxJQUFJLENBQUMsQ0FBQztxQkFDbEI7eUJBQU0sSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLEVBQUU7d0JBQ2xELGdCQUFnQixHQUFHLEtBQUssQ0FBQztxQkFDekI7b0JBQ0QsSUFBSSxnQkFBZ0IsRUFBRTt3QkFDZCxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxTQUFTLEtBQUssUUFBUSxFQUFFOzRCQUNwQixHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ3ZDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDOzRCQUN6QyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7Z0NBRWpCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLEtBQUssT0FBQSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQzs2QkFDckQ7aUNBQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLGlCQUFpQixJQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssbUJBQW1CLEVBQUU7Z0NBQ2xGLGdCQUFnQixHQUFHLEtBQUssQ0FBQzs2QkFDekI7eUJBQ0Q7cUJBQ0Q7b0JBR00sV0FBVyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxJQUFJLFdBQVcsQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFNLFdBQVcsQ0FBQyxPQUFPLEVBQUU7d0JBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFLLE9BQVMsQ0FBQyxDQUFDO3dCQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLElBQUksQ0FBQyxJQUFJLEVBQUksQ0FBQyxDQUFDO3dCQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFLLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBRyxDQUFDLENBQUM7d0JBQzFGLFdBQVcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO3dCQUM1QixhQUFhLElBQUksQ0FBQyxDQUFDO3dCQUNuQixVQUFVLElBQUksQ0FBQyxDQUFDO3FCQUNoQjtvQkFDRCxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7d0JBQ3hCLGFBQWEsSUFBSSxDQUFDLENBQUM7d0JBQ1osWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ25FLFFBQVEsR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFFakUsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsRUFBRTs0QkFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsV0FBVyxDQUFDLFdBQUssT0FBTyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUUsQ0FBQyxDQUFDOzRCQUNqRixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFlBQVksQ0FBQyxJQUFJLEVBQUksQ0FBQyxDQUFDOzRCQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFFBQVUsQ0FBQyxDQUFDOzRCQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFdBQVcsQ0FBQyxRQUFVLENBQUMsQ0FBQzs0QkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxjQUFjLENBQUMsVUFBSyxZQUFjLENBQUMsQ0FBQzs0QkFDL0QsVUFBVSxJQUFJLENBQUMsQ0FBQzt5QkFDaEI7cUJBQ0Q7eUJBR0csZUFBZSxFQUFmLHdCQUFlO29CQUNaLFNBQVMsR0FBRyxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO3lCQUMvQyxDQUFDLFNBQVMsRUFBVix3QkFBVTtvQkFFUSxxQkFBTSxlQUFlLENBQUMsbUJBQW1CLENBQzdELE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLEVBQUE7O29CQUQxQixXQUFXLEdBQUcsU0FDWTtvQkFDakMsSUFBSSxDQUFDLFdBQVcsRUFBRTt3QkFDakIsVUFBVSxJQUFJLENBQUMsQ0FBQztxQkFDaEI7b0JBQ0QsZUFBZSxHQUFHLElBQUksQ0FBQzs7O29CQUd6QixJQUFJLFdBQVcsQ0FBQyxLQUFLLEtBQUssaUJBQWlCLEVBQUU7d0JBQzVDLGVBQWUsR0FBRyxXQUFXLENBQUM7cUJBQzlCO29CQUVELGtDQUFrQztvQkFDbEMsV0FBMEMsRUFBZixtQ0FBZSxFQUFmLDZCQUFlLEVBQWYsSUFBZSxFQUFFO3dCQUFuQyxjQUFjO3dCQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssUUFBUSxFQUFFOzRCQUMxRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBSyxPQUFTLENBQUMsQ0FBQzs0QkFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBSyxJQUFJLENBQUMsSUFBSSxFQUFJLENBQUMsQ0FBQzs0QkFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxjQUFjLENBQUMsVUFBSyxZQUFjLENBQUMsQ0FBQzs0QkFDL0QsWUFBWSxJQUFJLENBQUMsQ0FBQzt5QkFDbEI7cUJBQ0Q7b0JBRUQsb0NBQW9DO29CQUNwQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsV0FBVyxDQUFFLEtBQUssUUFBUSxJQUFNLElBQUksQ0FBQyxPQUFPLENBQUUsYUFBYSxDQUFFLEtBQUssUUFBUSxFQUFFO3dCQUM3RixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUUsaUJBQWlCLENBQUUsS0FBSyxRQUFRLElBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBRSxtQkFBbUIsQ0FBRSxLQUFLLFFBQVEsRUFBRTs0QkFDekcsSUFBSSxnQkFBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRywwQ0FBMEM7Z0NBQ3hFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFLLE9BQVMsQ0FBQyxDQUFDO2dDQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLHlCQUF5QixDQUFHLENBQUMsQ0FBQztnQ0FDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUUsU0FBUyxrR0FBQSxXQUFXLEVBQWEsVUFBUyxFQUFtQixNQUFLLEtBQTlDLGFBQWEsRUFBUyxtQkFBbUIsQ0FBSyxDQUFDLENBQUM7Z0NBQ3RGLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFFLFNBQVMsa0dBQUEsV0FBVyxFQUFXLFVBQVMsRUFBaUIsTUFBSyxLQUExQyxXQUFXLEVBQVMsaUJBQWlCLENBQUssQ0FBQyxDQUFDO2dDQUNsRixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFLLFlBQWMsQ0FBQyxDQUFDO2dDQUMvRCxZQUFZLElBQUksQ0FBQyxDQUFDOzZCQUNsQjs0QkFDRCxnQkFBZ0IsSUFBSSxDQUFDLENBQUM7eUJBQ3RCO3FCQUNEO29CQUdJLEtBQUssU0FBd0IsQ0FBQztvQkFDbkMsWUFBWSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7b0JBRTNCLE9BQVEsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBRSxJQUFJLENBQUUsQ0FBQyxLQUFLLElBQUksRUFBRzt3QkFDL0MsT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7d0JBQzlCLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3hCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLEtBQUssS0FBSyxJQUFJLElBQU0sS0FBSyxLQUFLLE9BQU8sRUFBRTs0QkFDMUMsT0FBTyxDQUFDLFlBQVksR0FBRyxPQUFPLEdBQUcsQ0FBQyxDQUFDOzRCQUNuQyxPQUFPLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUM7eUJBQ3BDOzZCQUFNLElBQUksS0FBSyxLQUFLLElBQUksSUFBTSxLQUFLLEtBQUssV0FBVyxFQUFFOzRCQUNyRCxPQUFPLENBQUMsWUFBWSxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7NEJBQ25DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQzt5QkFDeEM7d0JBQ0QsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDdkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFRixJQUFJLFlBQVksSUFBSSxDQUFDLEVBQUU7d0JBQ3RCLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDeEI7b0JBRUQsa0RBQWtEO29CQUNsRCxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzt3QkFDakMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7d0JBQ3pDLFNBQVMsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7b0JBQ0gsT0FBTyxHQUFHLENBQUMsQ0FBQzs7OztvQkFFYywwQkFBQSxjQUFBLE1BQU0sQ0FBQSxDQUFBOzs7OztvQkFBZixLQUFLLG1CQUFBLENBQUE7b0JBQ2QsSUFBSSxHQUFXLEtBQUssQ0FBQztvQkFDNUIsT0FBTyxJQUFJLENBQUMsQ0FBQztvQkFFYixXQUE4QixFQUFSLHFCQUFRLEVBQVIsc0JBQVEsRUFBUixJQUFRLEVBQUU7d0JBQXJCLE9BQU87d0JBQ2pCLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFOzRCQUMxQyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO2dDQUVwQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQ0FDL0MsT0FBTyxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUM7aUNBQ3JDOzZCQUNEO3lCQUNEOzZCQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsU0FBUyxFQUFFOzRCQUNyRCxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFO2dDQUVwQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQ0FDL0MsT0FBTyxDQUFDLFlBQVksR0FBRyxpQkFBaUIsQ0FBQztpQ0FDekM7NkJBQ0Q7eUJBQ0Q7cUJBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFFRixXQUE4QixFQUFSLHFCQUFRLEVBQVIsc0JBQVEsRUFBUixJQUFRLEVBQUU7d0JBQXJCLE9BQU87d0JBQ2pCLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFOzRCQUMxQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssYUFBYSxFQUFFO2dDQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dDQUNoQixPQUFPLENBQUMsR0FBRyxDQUFJLFNBQVMsQ0FBQyxXQUFXLENBQUMsV0FBSyxPQUFPLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBRSxDQUFDLENBQUM7Z0NBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLFNBQVMsNkZBQUEsY0FBYyxFQUFlLFVBQVMsS0FBeEIsT0FBTyxDQUFDLE9BQU8sQ0FBUyxDQUFDLENBQUM7Z0NBQ3BFLFVBQVUsSUFBSSxDQUFDLENBQUM7NkJBQ2hCO3lCQUNEOzZCQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsU0FBUyxFQUFFOzRCQUNyRCxJQUFJLE9BQU8sQ0FBQyxZQUFZLEtBQUssaUJBQWlCLEVBQUU7Z0NBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxXQUFLLE9BQU8sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBQztnQ0FDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxpR0FBQSxjQUFjLEVBQWUsY0FBYSxLQUE1QixPQUFPLENBQUMsT0FBTyxDQUFhLENBQUMsQ0FBQztnQ0FDeEUsVUFBVSxJQUFJLENBQUMsQ0FBQzs2QkFDaEI7eUJBQ0Q7cUJBQ0Q7b0JBRUQsa0JBQWtCO29CQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNoQixPQUFPLENBQUMsR0FBRyxDQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBSyxZQUFZLFVBQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFLLFVBQVksQ0FBQyxDQUFDO29CQUM5RixJQUFJLHFCQUFxQixFQUFFO3dCQUMxQixPQUFPLENBQUMsR0FBRyxDQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFNLHFCQUFxQixVQUFLLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFHLENBQUMsQ0FBQztxQkFDN0c7b0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsZ0JBQWdCLENBQUMsV0FBTSxhQUFlLENBQUMsQ0FBQztvQkFHNUQsSUFBSSxHQUFHLElBQUksQ0FBQzs7O3lCQUNWLElBQUk7b0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxDQUFDO29CQUVoRCxxQkFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLGdEQUFnRCxDQUFDLENBQUMsRUFBQTs7b0JBQTlFLEdBQUcsR0FBRyxTQUF3RTtvQkFDckYsVUFBVSxHQUFHLENBQUMsQ0FBQzt5QkFDWCxDQUFBLEdBQUcsS0FBSyxNQUFNLENBQUEsRUFBZCx5QkFBYztvQkFDakIsc0JBQU87O3lCQUNHLENBQUEsR0FBRyxLQUFLLEVBQUUsQ0FBQSxFQUFWLHlCQUFVO29CQUNiLFlBQVUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNELHFCQUFNLDBCQUEwQixDQUFDLGFBQWEsRUFBRSxTQUFPLENBQUMsRUFBQTs7b0JBQS9FLG9CQUFvQixHQUFHLFNBQXdEO29CQUN0RixPQUFPLENBQUMsR0FBRyxDQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsVUFBSyxvQkFBc0IsQ0FBQyxDQUFDO29CQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7O3lCQUUzQyxxQkFBTSxLQUFLLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBQTs7b0JBQXBELFFBQVEsR0FBRyxTQUF5QztvQkFDM0QsSUFBSSxRQUFRLEtBQUssRUFBRSxFQUFFO3dCQUNwQix5QkFBTTtxQkFDTjtvQkFDRCxLQUFBLFVBQVUsQ0FBQTtvQkFBSSxxQkFBTSx1QkFBdUIsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLEVBQUUsUUFBUSxDQUFDLEVBQUE7O29CQUExRixVQUFVLEdBQVYsS0FBYyxTQUE0RSxDQUFDOzs7O29CQUc3RixJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUM7OztvQkFHMUIsU0FBUztvQkFDVCxPQUFPLENBQUMsR0FBRyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7b0JBQ3hELHFCQUFxQixHQUFHLGFBQWEsQ0FBQTtvQkFDckMsV0FBc0MsRUFBcEIsS0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFwQixjQUFvQixFQUFwQixJQUFvQixFQUFFO3dCQUE3QixHQUFHO3dCQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO3FCQUNsQzs7Ozs7OztDQUVGO0FBRUQsaUJBQWlCO0FBQ2pCLFNBQVMsY0FBYyxDQUFDLE9BQWlCO0lBQ3hDLEtBQWtCLFVBQW9CLEVBQXBCLEtBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0IsRUFBRTtRQUFuQyxJQUFNLEdBQUcsU0FBQTtRQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxzR0FBQSxrQkFBbUIsRUFBRyxXQUFZLEVBQW9CLEVBQUUsS0FBckMsR0FBRyxFQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUcsQ0FBQztTQUMvRTtLQUNEO0FBQ0YsQ0FBQztBQUVELDZCQUE2QjtBQUM3QixTQUFnQiwwQkFBMEIsQ0FBQyxhQUFxQixFQUFFLGFBQXFCOzs7Ozs7O29CQUMvRSxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzt3QkFDeEMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7d0JBQ3pDLFNBQVMsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7b0JBQ0UsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDakIsT0FBTyxHQUFHLENBQUMsQ0FBQzs7OztvQkFFUyxXQUFBLGNBQUEsTUFBTSxDQUFBOzs7OztvQkFBZixLQUFLLG1CQUFBLENBQUE7b0JBQ2QsSUFBSSxHQUFXLEtBQUssQ0FBQztvQkFDNUIsT0FBTyxJQUFJLENBQUMsQ0FBQztvQkFFYixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxpQkFBaUIsSUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssbUJBQW1CLEVBQUU7d0JBQy9FLFlBQVksSUFBSSxDQUFDLENBQUM7cUJBQ2xCO29CQUVELElBQUksT0FBTyxLQUFLLGFBQWEsRUFBRTt3QkFDOUIsc0JBQVEsWUFBWSxFQUFDO3FCQUNyQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBRUYsc0JBQVEsQ0FBQyxFQUFDOzs7O0NBQ1Y7QUFFRCwwQkFBMEI7QUFDMUIsU0FBZ0IsdUJBQXVCLENBQUMsYUFBcUIsRUFBRSxvQkFBNEIsRUFDekYsUUFBZ0I7Ozs7WUFFVixTQUFTLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN6QyxJQUFJLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3BCLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDM0MsS0FBSyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBRTdDLHNCQUFRLGFBQWEsQ0FBQyxhQUFhLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFDO2FBQ3ZFO2lCQUFNO2dCQUNOLHNCQUFRLENBQUMsRUFBQzthQUNWOzs7O0NBQ0Q7QUFFRCxnQkFBZ0I7QUFDaEIsU0FBZ0IsYUFBYSxDQUFDLGFBQXFCLEVBQUUsb0JBQTRCLEVBQy9FLFdBQW1CLEVBQUUsc0JBQThCOzs7Ozs7O29CQUU3QyxjQUFjLEdBQUcsYUFBYSxHQUFFLFNBQVMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLEVBQUU7d0JBQ25DLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO3FCQUMvQztvQkFFTSxXQUFXLEdBQUcsYUFBYSxDQUFDO29CQUM1QixXQUFXLEdBQUcsYUFBYSxHQUFFLE1BQU0sQ0FBQztvQkFDcEMsTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQzt3QkFDeEMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUM7d0JBQ3ZDLFNBQVMsRUFBRSxRQUFRO3FCQUNuQixDQUFDLENBQUM7b0JBQ0ksS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDYixnQkFBZ0IsR0FBRyxLQUFLLENBQUM7b0JBQ3pCLE9BQU8sR0FBYSxFQUFFLENBQUM7b0JBQ3ZCLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLFlBQVksR0FBRyxlQUFlLENBQUMsc0JBQXNCLENBQUMsQ0FBQztvQkFDdkQsT0FBTyxHQUFHLENBQUMsQ0FBQztvQkFDWixVQUFVLEdBQUcsQ0FBQyxDQUFDO29CQUNmLFVBQVUsR0FBRyxLQUFLLENBQUM7Ozs7b0JBRUUsV0FBQSxjQUFBLE1BQU0sQ0FBQTs7Ozs7b0JBQWYsS0FBSyxtQkFBQSxDQUFBO29CQUNkLElBQUksR0FBVyxLQUFLLENBQUM7b0JBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2pCLE9BQU8sSUFBSSxDQUFDLENBQUM7b0JBQ1IsTUFBTSxHQUFHLEtBQUssQ0FBQztvQkFFcEIsZ0JBQWdCO29CQUNoQixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxpQkFBaUIsSUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssbUJBQW1CLEVBQUU7d0JBQy9FLGdCQUFnQixHQUFHLElBQUksQ0FBQzt3QkFDeEIsT0FBTyxHQUFHLEVBQUUsQ0FBQzt3QkFDYixZQUFZLElBQUksQ0FBQyxDQUFDO3dCQUNsQixJQUFJLG9CQUFvQixLQUFLLFVBQVUsRUFBRTs0QkFDeEMsVUFBVSxHQUFHLElBQUksQ0FBQzt5QkFDbEI7NkJBQU07NEJBQ04sVUFBVSxHQUFHLENBQUMsWUFBWSxLQUFLLG9CQUFvQixDQUFDLENBQUM7eUJBQ3JEO3FCQUNEO3lCQUFNLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFO3dCQUNsRCxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7cUJBQ3pCO29CQUNELElBQUksVUFBVSxFQUFFO3dCQUVmLElBQUksZ0JBQWdCLEVBQUU7NEJBQ2QsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ3JDLElBQUksU0FBUyxLQUFLLFFBQVEsRUFBRTtnQ0FDcEIsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dDQUN2QyxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztnQ0FDekMsSUFBSSxLQUFLLEtBQUssRUFBRSxFQUFFO29DQUVqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBQyxLQUFLLE9BQUEsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE9BQU8sU0FBQSxFQUFDLENBQUM7aUNBQ3JEO3FDQUFNLElBQUksR0FBRyxHQUFHLEdBQUcsS0FBSyxpQkFBaUIsSUFBTSxHQUFHLEdBQUcsR0FBRyxLQUFLLG1CQUFtQixFQUFFO29DQUNsRixnQkFBZ0IsR0FBRyxLQUFLLENBQUM7aUNBQ3pCO2dDQUVELElBQUksR0FBRyxLQUFLLFdBQVcsRUFBRTtvQ0FDakIsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO29DQUM5QyxPQUFPLEdBQUUsRUFBRSxDQUFDO29DQUNqQixJQUFJLFlBQVksS0FBSyxRQUFRLElBQU0sc0JBQXNCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTt3Q0FDcEYsT0FBTyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FDQUMzQztvQ0FFRCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLENBQUMsR0FBRSxHQUFHLEdBQUUsc0JBQXNCLEdBQUcsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDO29DQUMxRixNQUFNLEdBQUcsSUFBSSxDQUFDO2lDQUNkOzZCQUNEOzRCQUVGLGtCQUFrQjt5QkFDakI7NkJBQU07NEJBQ0MsV0FBVyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUM1QyxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7Z0NBQ2pCLFlBQVksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dDQUNuRSxRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7Z0NBQzFELE9BQU8sR0FBRyxjQUFjLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO2dDQUUxRixJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUSxFQUFFO29DQUN6QyxNQUFNLEdBQUcsUUFBUSxDQUFDO29DQUNsQixLQUFLLEdBQUcsT0FBTyxDQUFDO29DQUN2QixJQUFJLFdBQVcsQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDLEVBQUU7d0NBQzdCLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dDQUN2RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFDaEQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUMsSUFBSSxDQUFDLENBQUM7cUNBQ3hDO3lDQUFNO3dDQUVOLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEdBQUUsSUFBSSxDQUFDLENBQUM7d0NBQ2hELE1BQU0sR0FBRyxJQUFJLENBQUM7cUNBQ2Q7aUNBQ0Q7cUNBQU0sSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQ0FDdEQsYUFBYTtpQ0FDYjtxQ0FBTTtvQ0FDTixJQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUUsRUFBRSxxREFBcUQ7d0NBQzVFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7d0NBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFLLE9BQVMsQ0FBQyxDQUFDO3dDQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFLLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBRyxDQUFDLENBQUM7d0NBQ3ZGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBSyxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQUssU0FBUyxDQUFDLGlEQUFpRCxDQUFHLENBQUMsQ0FBQzt3Q0FDM0csT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBSyxJQUFJLENBQUMsSUFBSSxFQUFJLENBQUMsQ0FBQzt3Q0FDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBSyxRQUFRLENBQUMsSUFBSSxFQUFJLENBQUMsQ0FBQzt3Q0FDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBSyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksRUFBSSxDQUFDLENBQUM7d0NBQzFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBSyxTQUFTLENBQUMsY0FBYyxDQUFDLFVBQUssWUFBYyxDQUFDLENBQUM7d0NBQy9ELFVBQVUsSUFBSSxDQUFDLENBQUM7cUNBQ2hCO2lDQUNEOzZCQUNEO3lCQUNEO3FCQUNEO29CQUNELElBQUksQ0FBQyxNQUFNLEVBQUU7d0JBQ1osTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ3pCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRUYsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUNiLHNCQUFPLElBQUksT0FBTyxDQUFFLFVBQUMsT0FBTzs0QkFDM0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0NBQ25CLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dDQUM1QyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7Z0NBQ3hCLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzs0QkFDckIsQ0FBQyxDQUFDLENBQUM7d0JBQ0osQ0FBQyxDQUFDLEVBQUM7Ozs7Q0FDSDtBQUVELGlCQUFpQjtBQUNqQixTQUFVLGNBQWMsQ0FBQyxJQUFZLEVBQUUsZ0JBQXlCO0lBQy9ELElBQUssV0FBVyxHQUFHLEtBQUssQ0FBQztJQUN6QixJQUFJLGdCQUFnQixFQUFFO1FBQ3JCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsSUFBSSxhQUFhLFNBQVEsQ0FBQztRQUMxQixJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDekIsYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN6RDthQUNJO1lBQ0osYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1QjtRQUVELElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLElBQU0sYUFBYSxLQUFLLEVBQUUsRUFBRTtZQUN0RSxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ25CO2FBQU0sSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQzVDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDbkI7S0FDRDtJQUNELE9BQVEsV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxhQUFhO0FBQ2IsU0FBVSxVQUFVLENBQUMsSUFBWTtJQUM3QixJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDckIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN2QjtBQUNMLENBQUM7QUFFRCxXQUFXO0FBQ1gsU0FBVSxRQUFRLENBQUMsSUFBWSxFQUFFLGNBQXNCO0lBQ3RELElBQU8sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RELElBQU8sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEMsSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO1FBQ3pCLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN4QztJQUNELE9BQVEsS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELGtCQUFrQjtBQUNsQixTQUFVLGVBQWUsQ0FBQyxPQUFpQixFQUFFLFFBQWdCO0lBQzVELElBQUssUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMxQixJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ2YsT0FBTyxRQUFRLENBQUM7S0FDZjtJQUVBLEtBQWtCLFVBQW9CLEVBQXBCLEtBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0IsRUFBRTtRQUFuQyxJQUFNLEdBQUcsU0FBQTtRQUNiLElBQU8sRUFBRSxHQUFHLElBQUksTUFBTSxDQUFFLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBRSxDQUFDO1FBRTdELElBQU8sYUFBYSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxJQUFJLGFBQWEsS0FBSyxRQUFRLEVBQUU7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDakM7UUFDRCxRQUFRLEdBQUcsYUFBYSxDQUFDO0tBQ3pCO0lBQ0QsT0FBUSxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUVELGdDQUFnQztBQUNoQyxTQUFVLDZCQUE2QixDQUFDLE9BQWlCLEVBQUUsUUFBZ0I7SUFFMUUsSUFBSyxRQUFRLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRCxJQUFPLGFBQWEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3ZELElBQUksYUFBYSxLQUFLLFFBQVEsRUFBRTtRQUUvQixRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDN0MsUUFBUSxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztLQUNoQztJQUNELE9BQVEsUUFBUSxDQUFDO0FBQ2xCLENBQUM7QUFFRCxpQkFBaUI7QUFDakIsU0FBVSxjQUFjLENBQUMsT0FBaUIsRUFBRSxRQUFnQixFQUFFLFdBQW1CLEVBQUUsWUFBb0I7SUFDdEcsSUFBSyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLElBQUksV0FBVyxJQUFJLE9BQU8sRUFBRTtRQUMzQixJQUFPLGFBQWEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBRWxELE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO1FBRTFDLFdBQVcsR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0tBQzNDO1NBQU07UUFDTixXQUFXLEdBQUcsZUFBZSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNqRDtJQUNELE9BQVEsV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxrQkFBa0I7QUFDbEIsU0FBVSxlQUFlLENBQUMsc0JBQThCO0lBQ3ZELElBQU8sWUFBWSxHQUFHLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxRCxJQUFLLFlBQW9CLENBQUM7SUFDMUIsSUFBSSxZQUFZLEtBQUssUUFBUSxFQUFFO1FBRTlCLFlBQVksR0FBRyxzQkFBc0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3JFO1NBQU07UUFDTixZQUFZLEdBQUcsc0JBQXNCLENBQUM7S0FDdEM7SUFDRCxPQUFRLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBRUQsbUJBQW1CO0FBQ25CLFNBQVUsZ0JBQWdCLENBQUMsSUFBWTtJQUN0QyxJQUFPLEdBQUcsR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBRS9CLEdBQUcsQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO0lBQzFCLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5QyxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ2pDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsaUJBQWlCLENBQUM7UUFDOUIsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDbEQ7SUFDRCxJQUFJLEdBQUcsQ0FBQyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ2pDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQU8sY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMvRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssaUJBQWlCLEVBQUU7WUFDcEMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO1FBRUQsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUN0RSxJQUFJLGNBQWMsS0FBSyxFQUFFLEVBQUU7WUFDMUIsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ04sR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7U0FDdEI7UUFDRCxPQUFRLEdBQUcsQ0FBQztLQUNaO0lBRUQsR0FBRyxDQUFDLEtBQUssR0FBRyxvQkFBb0IsQ0FBQztJQUNqQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFELElBQUksR0FBRyxDQUFDLGdCQUFnQixLQUFLLFFBQVEsRUFBRTtRQUN0QyxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNuQixHQUFHLENBQUMsY0FBYyxHQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDN0UsSUFBSSxHQUFHLENBQUMsY0FBYyxLQUFLLFFBQVEsRUFBRTtZQUVwQyxHQUFHLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsRixHQUFHLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUMxQyxHQUFHLENBQUMsZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUMsTUFBTSxFQUNsRCxHQUFHLENBQUMsY0FBYyxDQUFFLENBQUMsQ0FBQztZQUN2QixPQUFRLEdBQUcsQ0FBQztTQUNaO0tBQ0Q7SUFFRCxHQUFHLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLEdBQUcsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLE9BQVEsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUVELGNBQWM7QUFDZDtJQUFBO1FBQ0MsVUFBSyxHQUFHLEVBQUUsQ0FBQztRQUNYLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFDZCxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBRWhCLGVBQWU7UUFDZixnQkFBVyxHQUFHLFFBQVEsQ0FBQztRQUV2QixrQkFBa0I7UUFDbEIsa0JBQWEsR0FBRyxDQUFDLENBQUM7UUFDbEIscUJBQWdCLEdBQUcsUUFBUSxDQUFDO1FBQzVCLG1CQUFjLEdBQUcsUUFBUSxDQUFDO1FBRTFCLHdCQUF3QjtRQUN4QixrQkFBYSxHQUFhLEVBQUUsQ0FBQztRQUM3QixnQkFBVyxHQUFHLEVBQUUsQ0FBQztRQUNqQixvQkFBZSxHQUFHLENBQUMsQ0FBQztJQTJGckIsQ0FBQztJQXpGQSw4Q0FBd0IsR0FBeEIsVUFBeUIsSUFBWTtRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsZ0NBQVUsR0FBVixVQUFXLElBQVk7UUFBdkIsaUJBYUM7UUFaQSxJQUFPLGFBQWEsR0FBRyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBSyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUUxRixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5RCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUU7YUFBTTtZQUNOLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsVUFBQyxJQUFJLElBQUcsT0FBQSxDQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxFQURpQixDQUNqQixDQUFDLENBQUM7WUFDckMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUNwQjtRQUNELE9BQVEsV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFDTSx5Q0FBbUIsR0FBMUIsVUFBMkIsT0FBaUIsRUFBRSxhQUFxQixFQUFFLGtCQUEwQjs7Ozs7Ozt3QkFDdkYsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ3pDLGNBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN2RixJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRTs0QkFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFVLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBSyxjQUFnQixDQUFDLENBQUM7NEJBQ2xFLHNCQUFRLEtBQUssRUFBQzt5QkFDZDt3QkFDTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDOzRCQUNsRCxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQzs0QkFDMUMsU0FBUyxFQUFFLFFBQVE7eUJBQ25CLENBQUMsQ0FBQzt3QkFDSCxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs0QkFDcEMsc0JBQVEsS0FBSyxFQUFDO3lCQUNkO3dCQUNNLGlCQUFpQixHQUFHLDZCQUE2QixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3BGLGlCQUFpQixHQUFHLENBQUMsQ0FBQzt3QkFDdEIsYUFBYSxHQUFHLENBQUMsQ0FBQzt3QkFDbEIsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO3dCQUMzQixrQkFBa0IsR0FBRyxDQUFDLENBQUM7d0JBQ3ZCLGFBQWEsR0FBRyxFQUFFLENBQUM7d0JBQ25CLGFBQWEsR0FBRyxFQUFFLENBQUM7d0JBQ25CLGFBQWEsR0FBRyxFQUFFLENBQUM7d0JBQ25CLE1BQU0sR0FBRyxFQUFFLENBQUM7d0JBQ1osSUFBSSxHQUFHLEtBQUssQ0FBQzs7Ozt3QkFFUSxxQkFBQSxjQUFBLGdCQUFnQixDQUFBOzs7Ozt3QkFBekIsS0FBSyw2QkFBQSxDQUFBO3dCQUNkLFVBQVUsR0FBVyxLQUFLLENBQUM7d0JBQ2xDLGFBQWEsSUFBSSxDQUFDLENBQUM7d0JBQ25CLElBQUksaUJBQWlCLEtBQUssQ0FBQyxFQUFFOzRCQUVyQixZQUFZLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOzRCQUM1RCxJQUFJLFlBQVksS0FBSyxRQUFRLEVBQUU7Z0NBQzlCLElBQUksR0FBRyxLQUFLLENBQUM7NkJBQ2I7aUNBQU07Z0NBQ04sSUFBSSxHQUFHLElBQUksQ0FBQztnQ0FDWixNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7NkJBQzVDO3lCQUNEOzZCQUFNLEVBQUUsaUJBQWlCOzRCQUNsQixRQUFRLEdBQUcsNkJBQTZCLENBQzlDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQzs0QkFFakQsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQzs0QkFDMUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQ0FDVixzQkFBc0IsR0FBRyxpQkFBaUIsQ0FBQztnQ0FDM0Msa0JBQWtCLEdBQUcsYUFBYSxDQUFDO2dDQUNuQyxhQUFhLEdBQUcsVUFBVSxDQUFDO2dDQUMzQixhQUFhLEdBQUcsTUFBTSxHQUFHLFFBQVEsQ0FBQztnQ0FDbEMsYUFBYSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7NkJBQy9EO3lCQUNEO3dCQUNELElBQUksSUFBSSxFQUFFOzRCQUNULGlCQUFpQixJQUFJLENBQUMsQ0FBQzs0QkFDdkIsSUFBSSxpQkFBaUIsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtnQ0FDbkQsd0JBQU07NkJBQ047eUJBQ0Q7NkJBQU07NEJBQ04saUJBQWlCLEdBQUcsQ0FBQyxDQUFDO3lCQUN0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQUVGLElBQUksQ0FBQyxJQUFJLEVBQUU7NEJBQ0gsZUFBZSxHQUFHLGtCQUFrQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLHNCQUFzQixDQUFDOzRCQUNqRyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDOzRCQUNoQixPQUFPLENBQUMsR0FBRyxDQUFJLFNBQVMsQ0FBQyxXQUFXLENBQUMsVUFBSyxXQUFXLENBQUMsY0FBYyxDQUFDLFNBQUksa0JBQW9CLENBQUMsQ0FBQzs0QkFDL0YsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQUssV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFJLGVBQWlCLENBQUMsQ0FBQzs0QkFDM0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBZSxhQUFlLENBQUMsQ0FBQzs0QkFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBZSxhQUFlLENBQUMsQ0FBQzs0QkFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBZSxhQUFlLENBQUMsQ0FBQzt5QkFDNUM7d0JBQ0Qsc0JBQVEsSUFBSSxFQUFDOzs7O0tBQ2I7SUFDRixrQkFBQztBQUFELENBQUMsQUEzR0QsSUEyR0M7QUFFRCwwQkFBMEI7QUFDMUIsU0FBVSx1QkFBdUIsQ0FBQyxVQUFrQjtJQUNuRCxPQUFRLFVBQVUsQ0FBQyxPQUFPLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVELHNCQUFzQjtBQUN0QjtJQUtDO1FBQUEsaUJBZ0JDO1FBbkJELGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQzNCLGtCQUFhLEdBQTJCLFNBQVMsQ0FBQztRQUdqRCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUM7WUFDekMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO1lBQ3BCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtTQUN0QixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBTyxJQUFZOztnQkFDNUMsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUN2QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztpQkFDL0I7cUJBQU07b0JBQ04sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzVCOzs7YUFDRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTSxtQ0FBSyxHQUFaLFVBQWEsS0FBYTs7OztnQkFDekIsc0JBQVEsSUFBSSxPQUFPLENBQ2xCLFVBQUMsT0FBOEIsRUFBRyxNQUE2Qjt3QkFFL0QsSUFBTyxRQUFRLEdBQUcsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDM0MsSUFBSSxRQUFRLEVBQUU7NEJBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUM7NEJBQzlCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzt5QkFDbEI7NkJBQU07NEJBQ04sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7NEJBQzVCLEtBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDO3lCQUM3QjtvQkFDRixDQUFDLENBQUMsRUFBQzs7O0tBQ0g7SUFFRCxtQ0FBSyxHQUFMO1FBQ0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBQ0YsMEJBQUM7QUFBRCxDQUFDLEFBekNELElBeUNDO0FBRUQsY0FBYztBQUNkO0lBSUMscUJBQVksVUFBb0I7UUFDL0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7UUFDN0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUNGLGtCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRCxJQUFPLGNBQWMsR0FBRyxNQUFNLENBQUMsR0FBRyxzSEFBQywrREFBd0QsT0FBQyxJQUFJLENBQUM7QUFFakcsY0FBYztBQUNkLElBQU0sV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDO0FBQ3BDOzs7OztFQUtFO0NBQ0QsQ0FBQyxDQUFDO0FBRUgsUUFBUTtBQUNSLDREQUE0RDtBQUM1RCxTQUFnQixLQUFLLENBQUUsS0FBYTs7OztZQUNuQyxrQkFBa0I7WUFDbEIsSUFBSSxXQUFXLENBQUMsVUFBVSxFQUFFO2dCQUMzQixJQUFJLFdBQVcsQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7b0JBQ3ZELEtBQUssR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDakUsV0FBVyxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUM7b0JBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO29CQUMzQixzQkFBUSxLQUFLLEVBQUM7aUJBQ2Q7YUFDRDtZQUVELFFBQVE7WUFDUixzQkFBUSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFDOzs7Q0FDakM7QUFDRCxJQUFPLFdBQVcsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7QUFFL0MsWUFBWTtBQUNaLDREQUE0RDtBQUM1RCxTQUFnQixTQUFTLENBQUUsS0FBYTs7Ozs7d0JBQzFCLHFCQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBQTs7b0JBQXhCLEdBQUcsR0FBRyxTQUFrQjtvQkFDL0Isc0JBQVEsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFDOzs7O0NBQ3pCO0FBRUQsY0FBYztBQUNkLFNBQVUsV0FBVyxDQUFDLEtBQWE7SUFFbEMsd0NBQXdDO0lBQ3hDLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDdEIsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDM0MsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRSxHQUFHLEdBQUUsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QztLQUNEO0lBRUQsaUNBQWlDO0lBQ2pDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTVCLE9BQU8sS0FBSyxDQUFBO0FBQ2IsQ0FBQztBQUtELFVBQVU7QUFDVjtJQUFBO1FBQ0MsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQUNuQixZQUFPLEdBQVcsQ0FBQyxDQUFDO1FBQ3BCLGlCQUFZLEdBQVksS0FBSyxDQUFDO0lBQy9CLENBQUM7SUFBRCxjQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRCxnQkFBZ0I7QUFDaEI7SUFBQTtRQUNDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFDckIsaUJBQVksR0FBVyxDQUFDLENBQUM7UUFDekIsY0FBUyxHQUFjLFNBQVMsQ0FBQyxTQUFTLENBQUM7SUFDNUMsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRCxZQUFZO0FBQ1osSUFBSyxTQUdKO0FBSEQsV0FBSyxTQUFTO0lBQ2IsNENBQVUsQ0FBQTtJQUNWLG1EQUFjLENBQUE7QUFDZixDQUFDLEVBSEksU0FBUyxLQUFULFNBQVMsUUFHYjtBQUVELGNBQWM7QUFDZDtJQUlDLHFCQUFZLE1BQXNCO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCx5QkFBRyxHQUFIO1FBQ0MsS0FBcUIsVUFBZSxFQUFmLEtBQUEsSUFBSSxDQUFDLFVBQVUsRUFBZixjQUFlLEVBQWYsSUFBZSxFQUFFO1lBQWpDLElBQU0sSUFBSSxTQUFBO1lBQ2QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7UUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFSix3QkFBRSxHQUFGLFVBQUcsS0FBYSxFQUFFLFFBQW9CO1FBQ3JDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQsMkJBQUssR0FBTCxVQUFNLElBQVk7UUFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELHNDQUFnQixHQUFoQixVQUFpQixlQUF1QixFQUFFLElBQVk7UUFDckQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDbEUsQ0FBQztJQUNGLGtCQUFDO0FBQUQsQ0FBQyxBQTNCRCxJQTJCQztBQUVELFlBQVk7QUFDWiw0QkFBNEI7QUFDNUIsMERBQTBEO0FBQzFELFNBQVUsU0FBUyxDQUFDLGVBQThDO0lBQUcsZ0JBQWdCO1NBQWhCLFVBQWdCLEVBQWhCLHFCQUFnQixFQUFoQixJQUFnQjtRQUFoQiwrQkFBZ0I7O0lBQ3BGLElBQU8sVUFBVSxHQUF5QyxTQUFTLENBQUM7SUFDcEUsSUFBTyxjQUFjLEdBQUcsQ0FBQyxPQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUM7SUFFL0QsSUFBSyxPQUFPLEdBQUcsZUFBeUIsQ0FBQztJQUN6QyxJQUFJLGNBQWMsRUFBRTtRQUNuQixPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2IsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRTtZQUM3QyxPQUFPLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3RCLE9BQU8sSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFFLEdBQUcsQ0FBQzthQUNqQztZQUNELGdDQUFnQztTQUNoQztLQUNEO0lBRUQsSUFBSSxNQUFNLEtBQUssT0FBTyxFQUFFO1FBQ3ZCLFVBQVUsR0FBRztZQUNaLHVCQUF1QixFQUFFLHFCQUFxQjtZQUM5Qyx5QkFBeUIsRUFBRSxZQUFZO1lBQ3ZDLDhCQUE4QixFQUFFLGdDQUFnQztZQUNoRSxvQ0FBb0MsRUFBRSx1QkFBdUI7WUFDN0QsZ0RBQWdELEVBQUUsaUJBQWlCO1lBQ25FLHFDQUFxQyxFQUFFLG9CQUFvQjtZQUMzRCxpQkFBaUIsRUFBRSxjQUFjO1lBQ2pDLGdCQUFnQixFQUFFLFVBQVU7WUFDNUIsbUJBQW1CLEVBQUUsU0FBUztZQUM5QixTQUFTLEVBQUUsSUFBSTtZQUNmLE9BQU8sRUFBRSxLQUFLO1lBQ2QsV0FBVyxFQUFFLE1BQU07WUFDbkIsVUFBVSxFQUFFLEtBQUs7WUFDakIsVUFBVSxFQUFFLElBQUk7WUFDaEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsT0FBTyxFQUFFLFNBQVM7WUFDbEIsY0FBYyxFQUFFLE1BQU07WUFDdEIsZ0NBQWdDLEVBQUUsaUJBQWlCO1lBQ25ELGlEQUFpRCxFQUFFLDZCQUE2QjtZQUNoRixtQ0FBbUMsRUFBRSx1QkFBdUI7WUFDNUQsMEJBQTBCLEVBQUUsb0JBQW9CO1lBQ2hELDhCQUE4QixFQUFFLG9CQUFvQjtZQUNwRCxtQ0FBbUMsRUFBRSwwQkFBMEI7U0FDL0QsQ0FBQztLQUNGO0lBQ0QsSUFBSyxVQUFVLEdBQUcsT0FBTyxDQUFDO0lBQzFCLElBQUksVUFBVSxFQUFFO1FBQ2YsSUFBSSxPQUFPLElBQUksVUFBVSxFQUFFO1lBRTFCLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDakM7S0FDRDtJQUNELElBQUksY0FBYyxFQUFFO1FBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBRSxDQUFDLEVBQUU7WUFDN0MsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUUsSUFBSSxHQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7U0FDekU7UUFDRCxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBRSxNQUFNLEVBQUUsSUFBSSxDQUFFLENBQUM7UUFDL0MsNkJBQTZCO1FBQzdCLG1EQUFtRDtLQUNwRDtJQUNELE9BQVEsVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFFRCxJQUFPLHVCQUF1QixHQUFHLFVBQVUsQ0FBQztBQUM1QyxJQUFPLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDdEIsSUFBTyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzlCLElBQU8sU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUM3QixJQUFPLGFBQWEsR0FBRyxVQUFVLENBQUM7QUFDbEMsSUFBTyxpQkFBaUIsR0FBRyxVQUFVLENBQUM7QUFDdEMsSUFBTyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckIsSUFBTyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLElBQU8sV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLElBQU8sTUFBYyxDQUFDO0FBQ3RCLElBQU8sY0FBYyxHQUFHLG1CQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDdkMsU0FBVSxpQkFBaUIsQ0FBQyxDQUFpQjtJQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBQ0QsU0FBVSxXQUFXLENBQUMsSUFBWTtJQUNqQyxJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUU7UUFDeEIsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7WUFDekMsT0FBUSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNFO2FBQU07WUFDTixPQUFRLElBQUksQ0FBQztTQUNiO0tBQ0Q7U0FBTTtRQUNOLE9BQVEsSUFBSSxDQUFDO0tBQ2I7QUFDRixDQUFDO0FBQ0QsSUFBSyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7QUFFOUIsU0FBZ0IsUUFBUTs7Ozs7b0JBQ3ZCLG1CQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQzt5QkFDdEQsTUFBTSxDQUFDLGtCQUFrQixDQUFDO3lCQUMxQixNQUFNLENBQUMsWUFBWSxDQUFDO3lCQUNwQixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUV0QixNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxDQUFDLE1BQU0sQ0FBQztvQkFDdEQsSUFBSSxjQUFjLENBQUMsTUFBTSxFQUFFO3dCQUMxQixNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQztxQkFDL0I7b0JBRUQscUJBQU8sSUFBSSxFQUFFLENBQ1gsT0FBSyxDQUFBLENBQUUsVUFBQyxDQUFDOzRCQUNULElBQUksY0FBYyxDQUFDLElBQUksRUFBRTtnQ0FDeEIsTUFBTSxDQUFDLENBQUM7NkJBQ1I7aUNBQU07Z0NBRU4sT0FBTyxDQUFDLEdBQUcsQ0FBRSxZQUFVLENBQUMsQ0FBQyxPQUFTLENBQUUsQ0FBQztnQ0FDckMsSUFBTyxRQUFRLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQ0FDN0IsUUFBUSxDQUFDLFVBQVUsQ0FBRSxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFFLENBQUM7Z0NBRWpELE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFO2lDQUNuRDs2QkFDRDt3QkFDRixDQUFDLENBQUMsQ0FDRCxTQUFPLENBQUEsQ0FBQzs0QkFDUixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3JCLENBQUMsQ0FBQyxFQUFBOztvQkFoQkgsU0FnQkcsQ0FBQzs7Ozs7Q0FDSjtBQUNELFFBQVEsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnOyAvLyBmaWxlIHN5c3RlbVxyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7ICAvLyBvciBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcclxuaW1wb3J0IHsgcHJvZ3JhbSwgQ29tbWFuZGVyRXJyb3IgfSBmcm9tICdjb21tYW5kZXInO1xyXG5pbXBvcnQgKiBhcyByZWFkbGluZSBmcm9tICdyZWFkbGluZSc7XHJcbmltcG9ydCB7IERlZmF1bHREZXNlcmlhbGl6ZXIgfSBmcm9tICd2OCc7XHJcbmNvbnN0IGRkID0gY29uc29sZS5sb2c7XHJcbmNvbnN0ICBzZXR0aW5nU3RhcnRMYWJlbCA9IFwi6Kit5a6aOlwiO1xyXG5jb25zdCAgc2V0dGluZ1N0YXJ0TGFiZWxFbiA9IFwic2V0dGluZ3M6XCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUxhYmVsID0gXCIjdGVtcGxhdGU6XCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUF0U3RhcnRMYWJlbCA9IFwiI3RlbXBsYXRlLWF0KFwiO1xyXG5jb25zdCAgdGVtcGxhdGVBdEVuZExhYmVsID0gXCIpOlwiO1xyXG5jb25zdCAgZmlsZVRlbXBsYXRlTGFiZWwgPSBcIiNmaWxlLXRlbXBsYXRlOlwiO1xyXG5jb25zdCAgdGVtcG9yYXJ5TGFiZWxzID0gW1wiI+KYhU5vdzpcIiwgXCIjbm93OlwiLCBcIiPimIXmm7jjgY3jgYvjgZFcIiwgXCIj4piF5pyq56K66KqNXCJdO1xyXG5jb25zdCAgc2VjcmV0TGFiZWwgPSBcIiPimIXnp5jlr4ZcIjtcclxuY29uc3QgIHNlY3JldExhYmVsRW4gPSBcIiNzZWNyZXRcIjtcclxuY29uc3QgIHNlY3JldEV4YW1sZUxhYmVsID0gXCIj4piF56eY5a+GOuS7rlwiO1xyXG5jb25zdCAgc2VjcmV0RXhhbWxlTGFiZWxFbiA9IFwiI3NlY3JldDpleGFtcGxlXCI7XHJcbmNvbnN0ICByZWZlclBhdHRlcm4gPSAvKOS4iuiomHzkuIvoqJh8YWJvdmV8Zm9sbG93aW5nKSjjgIx8XFxbKShbXuOAjV0qKSjjgI18XFxdKS9nO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gIG1haW4oKSB7XHJcblx0Y29uc3QgIGlucHV0RmlsZVBhdGggPSBhd2FpdCBpbnB1dFBhdGgoIHRyYW5zbGF0ZSgnWUFNTCBVVEYtOCBmaWxlIHBhdGg+JykgKTtcclxuXHRjb25zdCAgcGFyZW50UGF0aCA9IHBhdGguZGlybmFtZShpbnB1dEZpbGVQYXRoKTtcclxuXHRpbnB1dEZpbGVQYXJlbnRQYXRoID0gcGFyZW50UGF0aDtcclxuXHRsZXQgIHByZXZpb3VzVGVtcGxhdGVDb3VudCA9IDA7XHJcblx0Zm9yKDs7KSB7XHJcblx0XHRsZXQgIHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGxldCAgaXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0bGV0ICBzZXR0aW5nOiBTZXR0aW5ncyA9IHt9O1xyXG5cdFx0bGV0ICBzZXR0aW5nQ291bnQgPSAwO1xyXG5cdFx0bGV0ICBsaW5lTnVtID0gMDtcclxuXHRcdGxldCAgdGVtcGxhdGVDb3VudCA9IDA7XHJcblx0XHRsZXQgIGZpbGVUZW1wbGF0ZVRhZzogVGVtcGxhdGVUYWcgfCBudWxsID0gbnVsbDtcclxuXHRcdGxldCAgZXJyb3JDb3VudCA9IDA7XHJcblx0XHRsZXQgIHdhcm5pbmdDb3VudCA9IDA7XHJcblx0XHRsZXQgIHNlY3JldExhYmVsQ291bnQgPSAwO1xyXG5cdFx0Y29uc3QgIGxpbmVzID0gW107XHJcblx0XHRjb25zdCAga2V5d29yZHM6IFNlYXJjaEtleXdvcmRbXSA9IFtdO1xyXG5cclxuXHRcdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRcdGNvbnN0ICBsaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdFx0bGluZXMucHVzaChsaW5lKTtcclxuXHRcdFx0bGluZU51bSArPSAxO1xyXG5cdFx0XHRjb25zdCAgcHJldmlvdXNJc1JlYWRpbmdTZXR0aW5nID0gaXNSZWFkaW5nU2V0dGluZztcclxuXHJcblx0XHRcdC8vIHNldHRpbmcgPSAuLi5cclxuXHRcdFx0aWYgKGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbCAgfHwgIGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbEVuKSB7XHJcblx0XHRcdFx0aWYgKHNldHRpbmdDb3VudCA+PSAxKSB7XHJcblx0XHRcdFx0XHRvbkVuZE9mU2V0dGluZyhzZXR0aW5nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IHRydWU7XHJcblxyXG5cdFx0XHRcdHNldHRpbmcgPSB7fTtcclxuXHRcdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdFx0fSBlbHNlIGlmIChpc0VuZE9mU2V0dGluZyhsaW5lLCBpc1JlYWRpbmdTZXR0aW5nKSkge1xyXG5cdFx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoaXNSZWFkaW5nU2V0dGluZykge1xyXG5cdFx0XHRcdGNvbnN0ICBzZXBhcmF0b3IgPSBsaW5lLmluZGV4T2YoJzonKTtcclxuXHRcdFx0XHRpZiAoc2VwYXJhdG9yICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgIGtleSA9IGxpbmUuc3Vic3RyKDAsIHNlcGFyYXRvcikudHJpbSgpO1xyXG5cdFx0XHRcdFx0Y29uc3QgIHZhbHVlID0gZ2V0VmFsdWUobGluZSwgc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gJycpIHtcclxuXHJcblx0XHRcdFx0XHRcdHNldHRpbmdba2V5XSA9IHt2YWx1ZSwgaXNSZWZlcmVuY2VkOiBmYWxzZSwgbGluZU51bX07XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWwgICYmICBrZXkgKyAnOicgIT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgaWYgcHJldmlvdXMgbGluZSBoYXMgXCJ0ZW1wbGF0ZVwiIHJlcGxhY2VkIGNvbnRlbnRzLlxyXG5cdFx0XHRjb25zdCAgdGVtcGxhdGVUYWcgPSBwYXJzZVRlbXBsYXRlVGFnKGxpbmUpO1xyXG5cdFx0XHRpZiAodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCA+PSAxICAmJiAgdGVtcGxhdGVUYWcuaXNGb3VuZCkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHt0cmFuc2xhdGUoJ1RoZSBwYXJhbWV0ZXIgbXVzdCBiZSBsZXNzIHRoYW4gMCcpfWApO1xyXG5cdFx0XHRcdHRlbXBsYXRlVGFnLmlzRm91bmQgPSBmYWxzZTtcclxuXHRcdFx0XHR0ZW1wbGF0ZUNvdW50ICs9IDE7XHJcblx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0dGVtcGxhdGVDb3VudCArPSAxO1xyXG5cdFx0XHRcdGNvbnN0ICBjaGVja2luZ0xpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0Y29uc3QgIGV4cGVjdGVkID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlVGFnLnRlbXBsYXRlKTtcclxuXHJcblx0XHRcdFx0aWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGV4cGVjdGVkKSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bSArIHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXR9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7Y2hlY2tpbmdMaW5lLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFeHBlY3RlZCcpfTogJHtleHBlY3RlZH1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdUZW1wbGF0ZScpfTogJHt0ZW1wbGF0ZVRhZy50ZW1wbGF0ZX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgdGFyZ2V0IGZpbGUgY29udGVudHMgYnkgXCIjZmlsZS10ZW1wbGF0ZTpcIiB0YWcuXHJcblx0XHRcdGlmIChmaWxlVGVtcGxhdGVUYWcpIHtcclxuXHRcdFx0XHRjb25zdCBjb250aW51ZV8gPSBmaWxlVGVtcGxhdGVUYWcub25SZWFkTGluZShsaW5lKTtcclxuXHRcdFx0XHRpZiAoIWNvbnRpbnVlXykge1xyXG5cclxuXHRcdFx0XHRcdGNvbnN0ICBjaGVja1Bhc3NlZCA9IGF3YWl0IGZpbGVUZW1wbGF0ZVRhZy5jaGVja1RhcmdldENvbnRlbnRzKFxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nLCBpbnB1dEZpbGVQYXRoLCBsaW5lTnVtKTtcclxuXHRcdFx0XHRcdGlmICghY2hlY2tQYXNzZWQpIHtcclxuXHRcdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZmlsZVRlbXBsYXRlVGFnID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRlbXBsYXRlVGFnLmxhYmVsID09PSBmaWxlVGVtcGxhdGVMYWJlbCkge1xyXG5cdFx0XHRcdGZpbGVUZW1wbGF0ZVRhZyA9IHRlbXBsYXRlVGFnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBub3QgXCIj4piFTm93OlwiLlxyXG5cdFx0XHRmb3IgKGxldCB0ZW1wb3JhcnlMYWJlbCBvZiB0ZW1wb3JhcnlMYWJlbHMpIHtcclxuXHRcdFx0XHRpZiAobGluZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVtcG9yYXJ5TGFiZWwudG9Mb3dlckNhc2UoKSkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnV2FybmluZ0xpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtsaW5lLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0d2FybmluZ0NvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBub3Qgc2VjcmV0IHRhZy5cclxuXHRcdFx0aWYgKGxpbmUuaW5kZXhPZiggc2VjcmV0TGFiZWwgKSAhPT0gbm90Rm91bmQgIHx8ICBsaW5lLmluZGV4T2YoIHNlY3JldExhYmVsRW4gKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRpZiAobGluZS5pbmRleE9mKCBzZWNyZXRFeGFtbGVMYWJlbCApID09PSBub3RGb3VuZCAgJiYgIGxpbmUuaW5kZXhPZiggc2VjcmV0RXhhbWxlTGFiZWxFbiApID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlY3JldExhYmVsQ291bnQgPT09IDApIHsgIC8vIEJlY2F1c2UgdGhlcmUgd2lsbCBiZSBtYW55IHNlY3JldCBkYXRhLlxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnVGhpcyBpcyBhIHNlY3JldCB2YWx1ZS4nKX1gKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJysgdHJhbnNsYXRlYENoYW5nZSBcIiR7c2VjcmV0TGFiZWxFbn1cIiB0byBcIiR7c2VjcmV0RXhhbWxlTGFiZWxFbn1cIi4nYCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcrIHRyYW5zbGF0ZWBDaGFuZ2UgXCIke3NlY3JldExhYmVsfVwiIHRvIFwiJHtzZWNyZXRFeGFtbGVMYWJlbH1cIi4nYCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0XHR3YXJuaW5nQ291bnQgKz0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNlY3JldExhYmVsQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEdldCB0aXRsZXMgYWJvdmUgb3IgZm9sbG93aW5nLlxyXG5cdFx0XHRsZXQgIG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xyXG5cdFx0XHRyZWZlclBhdHRlcm4ubGFzdEluZGV4ID0gMDtcclxuXHJcblx0XHRcdHdoaWxlICggKG1hdGNoID0gcmVmZXJQYXR0ZXJuLmV4ZWMoIGxpbmUgKSkgIT09IG51bGwgKSB7XHJcblx0XHRcdFx0Y29uc3QgIGtleXdvcmQgPSBuZXcgU2VhcmNoS2V5d29yZCgpO1xyXG5cdFx0XHRcdGNvbnN0ICBsYWJlbCA9IG1hdGNoWzFdO1xyXG5cdFx0XHRcdGtleXdvcmQua2V5d29yZCA9IG1hdGNoWzNdO1xyXG5cdFx0XHRcdGlmIChsYWJlbCA9PT0gXCLkuIroqJhcIiAgfHwgIGxhYmVsID09PSBcImFib3ZlXCIpIHtcclxuXHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gbGluZU51bSAtIDE7XHJcblx0XHRcdFx0XHRrZXl3b3JkLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5BYm92ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGxhYmVsID09PSBcIuS4i+iomFwiICB8fCAgbGFiZWwgPT09IFwiZm9sbG93aW5nXCIpIHtcclxuXHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gbGluZU51bSArIDE7XHJcblx0XHRcdFx0XHRrZXl3b3JkLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5Gb2xsb3dpbmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGtleXdvcmRzLnB1c2goa2V5d29yZCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChzZXR0aW5nQ291bnQgPj0gMSkge1xyXG5cdFx0XHRvbkVuZE9mU2V0dGluZyhzZXR0aW5nKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyB0aGUgdGl0bGUgYWJvdmUgb3IgZm9sbG93aW5nLlxyXG5cdFx0cmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5wdXRGaWxlUGF0aCksXHJcblx0XHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHRcdH0pO1xyXG5cdFx0bGluZU51bSA9IDA7XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0XHRsaW5lTnVtICs9IDE7XHJcblxyXG5cdFx0XHRmb3IgKGNvbnN0IGtleXdvcmQgb2Yga2V5d29yZHMpIHtcclxuXHRcdFx0XHRpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5BYm92ZSkge1xyXG5cdFx0XHRcdFx0aWYgKGxpbmVOdW0gPD0ga2V5d29yZC5zdGFydExpbmVOdW0pIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChsaW5lLmluZGV4T2Yoa2V5d29yZC5rZXl3b3JkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0XHRrZXl3b3JkLnN0YXJ0TGluZU51bSA9IGZvdW5kRm9yQWJvdmU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uRm9sbG93aW5nKSB7XHJcblx0XHRcdFx0XHRpZiAobGluZU51bSA+PSBrZXl3b3JkLnN0YXJ0TGluZU51bSkge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihrZXl3b3JkLmtleXdvcmQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gZm91bmRGb3JGb2xsb3dpbmc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAoY29uc3Qga2V5d29yZCBvZiBrZXl3b3Jkcykge1xyXG5cdFx0XHRpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5BYm92ZSkge1xyXG5cdFx0XHRcdGlmIChrZXl3b3JkLnN0YXJ0TGluZU51bSAhPT0gZm91bmRGb3JBYm92ZSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7a2V5d29yZC5zdGFydExpbmVOdW0gKyAxfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJyArIHRyYW5zbGF0ZWBOb3QgZm91bmQgXCIke2tleXdvcmQua2V5d29yZH1cIiBhYm92ZWApO1xyXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkZvbGxvd2luZykge1xyXG5cdFx0XHRcdGlmIChrZXl3b3JkLnN0YXJ0TGluZU51bSAhPT0gZm91bmRGb3JGb2xsb3dpbmcpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2tleXdvcmQuc3RhcnRMaW5lTnVtIC0gMX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcgKyB0cmFuc2xhdGVgTm90IGZvdW5kIFwiJHtrZXl3b3JkLmtleXdvcmR9XCIgZm9sbG93aW5nYCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2hvdyB0aGUgcmVzdWx0XHJcblx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1dhcm5pbmcnKX06ICR7d2FybmluZ0NvdW50fSwgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke2Vycm9yQ291bnR9YCk7XHJcblx0XHRpZiAocHJldmlvdXNUZW1wbGF0ZUNvdW50KSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgndGVtcGxhdGUgY291bnQnKX0gPSAke3ByZXZpb3VzVGVtcGxhdGVDb3VudH0gKCR7dHJhbnNsYXRlKCdpbiBwcmV2aW91cyBjaGVjaycpfSlgKTtcclxuXHRcdH1cclxuXHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgndGVtcGxhdGUgY291bnQnKX0gPSAke3RlbXBsYXRlQ291bnR9YCk7XHJcblxyXG5cdFx0Ly8gUmVzY2FuIG9yIGNoYW5nZSBhIHZhbHVlXHJcblx0XHRsZXQgIGxvb3AgPSB0cnVlO1xyXG5cdFx0d2hpbGUgKGxvb3ApIHtcclxuXHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlKCdQcmVzcyBFbnRlciBrZXkgdG8gcmV0cnkgY2hlY2tpbmcuJykpO1xyXG5cclxuXHRcdFx0Y29uc3QgIGtleSA9IGF3YWl0IGlucHV0KHRyYW5zbGF0ZSgnVGhlIGxpbmUgbnVtYmVyIHRvIGNoYW5nZSB0aGUgdmFyaWFibGUgdmFsdWUgPicpKTtcclxuXHRcdFx0ZXJyb3JDb3VudCA9IDA7XHJcblx0XHRcdGlmIChrZXkgPT09ICdleGl0Jykge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBlbHNlIGlmIChrZXkgIT09ICcnKSB7XHJcblx0XHRcdFx0Y29uc3QgIGxpbmVOdW0gPSBwYXJzZUludChrZXkpO1xyXG5cdFx0XHRcdGNvbnN0ICBjaGFuZ2luZ1NldHRpbmdJbmRleCA9IGF3YWl0IGdldFNldHRpbmdJbmRleEZyb21MaW5lTnVtKGlucHV0RmlsZVBhdGgsIGxpbmVOdW0pO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnU2V0dGluZ0luZGV4Jyl9OiAke2NoYW5naW5nU2V0dGluZ0luZGV4fWApO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHRyYW5zbGF0ZSgnRW50ZXIgb25seTogZmluaXNoIHRvIGlucHV0IHNldHRpbmcnKSk7XHJcblx0XHRcdFx0Zm9yICg7Oykge1xyXG5cdFx0XHRcdFx0Y29uc3QgIGtleVZhbHVlID0gYXdhaXQgaW5wdXQodHJhbnNsYXRlKCdrZXk6IG5ld192YWx1ZT4nKSk7XHJcblx0XHRcdFx0XHRpZiAoa2V5VmFsdWUgPT09ICcnKSB7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCArPSBhd2FpdCBjaGFuZ2VTZXR0aW5nQnlLZXlWYWx1ZShpbnB1dEZpbGVQYXRoLCBjaGFuZ2luZ1NldHRpbmdJbmRleCwga2V5VmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRsb29wID0gKGVycm9yQ291bnQgPj0gMSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVzY2FuXHJcblx0XHRjb25zb2xlLmxvZygnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xyXG5cdFx0cHJldmlvdXNUZW1wbGF0ZUNvdW50ID0gdGVtcGxhdGVDb3VudFxyXG5cdFx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZykpIHtcclxuXHRcdFx0c2V0dGluZ1trZXldLmlzUmVmZXJlbmNlZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy8gb25FbmRPZlNldHRpbmdcclxuZnVuY3Rpb24gb25FbmRPZlNldHRpbmcoc2V0dGluZzogU2V0dGluZ3MpIHtcclxuXHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzZXR0aW5nKSkge1xyXG5cdFx0aWYgKCFzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRyYW5zbGF0ZWBOb3QgcmVmZXJlbmNlZDogJHtrZXl9IGluIGxpbmUgJHtzZXR0aW5nW2tleV0ubGluZU51bX1gKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vIGdldFNldHRpbmdJbmRleEZyb21MaW5lTnVtXHJcbmFzeW5jIGZ1bmN0aW9uICBnZXRTZXR0aW5nSW5kZXhGcm9tTGluZU51bShpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIHRhcmdldExpbmVOdW06IG51bWJlcik6IFByb21pc2U8bnVtYmVyPiB7XHJcblx0Y29uc3QgIHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShpbnB1dEZpbGVQYXRoKSxcclxuXHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHR9KTtcclxuXHRsZXQgIHNldHRpbmdDb3VudCA9IDA7XHJcblx0bGV0ICBsaW5lTnVtID0gMDtcclxuXHJcblx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdGNvbnN0ICBsaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdGxpbmVOdW0gKz0gMTtcclxuXHJcblx0XHRpZiAobGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsICB8fCAgbGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0c2V0dGluZ0NvdW50ICs9IDE7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGxpbmVOdW0gPT09IHRhcmdldExpbmVOdW0pIHtcclxuXHRcdFx0cmV0dXJuICBzZXR0aW5nQ291bnQ7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAgMDtcclxufVxyXG5cclxuLy8gY2hhbmdlU2V0dGluZ0J5S2V5VmFsdWVcclxuYXN5bmMgZnVuY3Rpb24gIGNoYW5nZVNldHRpbmdCeUtleVZhbHVlKGlucHV0RmlsZVBhdGg6IHN0cmluZywgY2hhbmdpbmdTZXR0aW5nSW5kZXg6IG51bWJlcixcclxuXHRcdGtleVZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4vKmVycm9yQ291bnQqLyB7XHJcblxyXG5cdGNvbnN0ICBzZXBhcmF0b3IgPSBrZXlWYWx1ZS5pbmRleE9mKCc6Jyk7XHJcblx0aWYgKHNlcGFyYXRvciAhPT0gbm90Rm91bmQpIHtcclxuXHRcdGNvbnN0ICBrZXkgPSBrZXlWYWx1ZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShrZXlWYWx1ZSwgc2VwYXJhdG9yKTtcclxuXHJcblx0XHRyZXR1cm4gIGNoYW5nZVNldHRpbmcoaW5wdXRGaWxlUGF0aCwgY2hhbmdpbmdTZXR0aW5nSW5kZXgsIGtleSwgdmFsdWUpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gIDE7XHJcblx0fVxyXG59XHJcblxyXG4vLyBjaGFuZ2VTZXR0aW5nXHJcbmFzeW5jIGZ1bmN0aW9uICBjaGFuZ2VTZXR0aW5nKGlucHV0RmlsZVBhdGg6IHN0cmluZywgY2hhbmdpbmdTZXR0aW5nSW5kZXg6IG51bWJlcixcclxuXHRcdGNoYW5naW5nS2V5OiBzdHJpbmcsIGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQ6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPi8qZXJyb3JDb3VudCovIHtcclxuXHJcblx0Y29uc3QgIGJhY2tVcEZpbGVQYXRoID0gaW5wdXRGaWxlUGF0aCArXCIuYmFja3VwXCI7XHJcblx0aWYgKCFmcy5leGlzdHNTeW5jKGJhY2tVcEZpbGVQYXRoKSkge1xyXG5cdFx0ZnMuY29weUZpbGVTeW5jKGlucHV0RmlsZVBhdGgsIGJhY2tVcEZpbGVQYXRoKTtcclxuXHR9XHJcblxyXG5cdGNvbnN0ICBvbGRGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGg7XHJcblx0Y29uc3QgIG5ld0ZpbGVQYXRoID0gaW5wdXRGaWxlUGF0aCArXCIubmV3XCI7XHJcblx0Y29uc3QgIHdyaXRlciA9IG5ldyBXcml0ZUJ1ZmZlcihmcy5jcmVhdGVXcml0ZVN0cmVhbShuZXdGaWxlUGF0aCkpO1xyXG5cdGNvbnN0ICByZWFkZXIgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0ob2xkRmlsZVBhdGgpLFxyXG5cdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdH0pO1xyXG5cdGNvbnN0ICBsaW5lcyA9IFtdO1xyXG5cdGxldCAgaXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdGxldCAgc2V0dGluZzogU2V0dGluZ3MgPSB7fTtcclxuXHRsZXQgIHNldHRpbmdDb3VudCA9IDA7XHJcblx0bGV0ICBjaGFuZ2VkVmFsdWUgPSBnZXRDaGFuZ2VkVmFsdWUoY2hhbmdlZFZhbHVlQW5kQ29tbWVudCk7XHJcblx0bGV0ICBsaW5lTnVtID0gMDtcclxuXHRsZXQgIGVycm9yQ291bnQgPSAwO1xyXG5cdGxldCAgaXNDaGFuZ2luZyA9IGZhbHNlO1xyXG5cdFxyXG5cdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRsaW5lcy5wdXNoKGxpbmUpO1xyXG5cdFx0bGluZU51bSArPSAxO1xyXG5cdFx0bGV0ICBvdXRwdXQgPSBmYWxzZTtcclxuXHJcblx0XHQvLyBzZXR0aW5nID0gLi4uXHJcblx0XHRpZiAobGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsICB8fCAgbGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IHRydWU7XHJcblx0XHRcdHNldHRpbmcgPSB7fTtcclxuXHRcdFx0c2V0dGluZ0NvdW50ICs9IDE7XHJcblx0XHRcdGlmIChjaGFuZ2luZ1NldHRpbmdJbmRleCA9PT0gYWxsU2V0dGluZykge1xyXG5cdFx0XHRcdGlzQ2hhbmdpbmcgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlzQ2hhbmdpbmcgPSAoc2V0dGluZ0NvdW50ID09PSBjaGFuZ2luZ1NldHRpbmdJbmRleCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoaXNFbmRPZlNldHRpbmcobGluZSwgaXNSZWFkaW5nU2V0dGluZykpIHtcclxuXHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzQ2hhbmdpbmcpIHtcclxuXHJcblx0XHRcdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRcdFx0Y29uc3QgIHNlcGFyYXRvciA9IGxpbmUuaW5kZXhPZignOicpO1xyXG5cdFx0XHRcdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5ID0gbGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShsaW5lLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0dGluZ1trZXldID0ge3ZhbHVlLCBpc1JlZmVyZW5jZWQ6IGZhbHNlLCBsaW5lTnVtfTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbCAgJiYgIGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gY2hhbmdpbmdLZXkpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgIGNvbW1lbnRJbmRleCA9IGxpbmUuaW5kZXhPZignIycsIHNlcGFyYXRvcik7XHJcblx0XHRcdFx0XHRcdGxldCAgY29tbWVudD0gJyc7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tZW50SW5kZXggIT09IG5vdEZvdW5kICAmJiAgY2hhbmdlZFZhbHVlQW5kQ29tbWVudC5pbmRleE9mKCcjJykgPT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29tbWVudCA9ICcgICcgKyBsaW5lLnN1YnN0cihjb21tZW50SW5kZXgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR3cml0ZXIud3JpdGUobGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yICsgMSkgKycgJysgY2hhbmdlZFZhbHVlQW5kQ29tbWVudCArIGNvbW1lbnQgKyBcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBPdXQgb2Ygc2V0dGluZ3NcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zdCAgdGVtcGxhdGVUYWcgPSBwYXJzZVRlbXBsYXRlVGFnKGxpbmUpO1xyXG5cdFx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAgY2hlY2tpbmdMaW5lID0gbGluZXNbbGluZXMubGVuZ3RoIC0gMSArIHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXRdO1xyXG5cdFx0XHRcdFx0Y29uc3QgIGV4cGVjdGVkID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlVGFnLnRlbXBsYXRlKTtcclxuXHRcdFx0XHRcdGNvbnN0ICBjaGFuZ2VkID0gZ2V0Q2hhbmdlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUsIGNoYW5naW5nS2V5LCBjaGFuZ2VkVmFsdWUpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjaGVja2luZ0xpbmUuaW5kZXhPZihleHBlY3RlZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0ICBiZWZvcmUgPSBleHBlY3RlZDtcclxuXHRcdFx0XHRcdFx0Y29uc3QgIGFmdGVyID0gY2hhbmdlZDtcclxuXHRcdFx0XHRcdFx0aWYgKHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXQgPD0gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCAgYWJvdmVMaW5lID0gbGluZXNbbGluZXMubGVuZ3RoIC0gMSArIHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXRdO1xyXG5cdFx0XHRcdFx0XHRcdHdyaXRlci5yZXBsYWNlQWJvdmVMaW5lKHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXQsXHJcblx0XHRcdFx0XHRcdFx0XHRhYm92ZUxpbmUucmVwbGFjZShiZWZvcmUsIGFmdGVyKStcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0d3JpdGVyLndyaXRlKGxpbmUucmVwbGFjZShiZWZvcmUsIGFmdGVyKSArXCJcXG5cIik7XHJcblx0XHRcdFx0XHRcdFx0b3V0cHV0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjaGVja2luZ0xpbmUuaW5kZXhPZihjaGFuZ2VkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRG8gbm90aGluZ1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKGVycm9yQ291bnQgPT09IDApIHsgLy8gU2luY2Ugb25seSBvbmUgb2xkIHZhbHVlIGNhbiBiZSByZXBsYWNlZCBhdCBhIHRpbWVcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnRXJyb3InKX06ICR7dHJhbnNsYXRlKCdOb3QgZm91bmQgYW55IHJlcGxhY2luZyB0YXJnZXQnKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnU29sdXRpb24nKX06ICR7dHJhbnNsYXRlKCdTZXQgb2xkIHZhbHVlIGF0IHNldHRpbmdzIGluIHRoZSByZXBsYWNpbmcgZmlsZScpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtsaW5lLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnRXhwZWN0ZWQnKX06ICR7ZXhwZWN0ZWQudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdUZW1wbGF0ZScpfTogJHt0ZW1wbGF0ZVRhZy50ZW1wbGF0ZS50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIW91dHB1dCkge1xyXG5cdFx0XHR3cml0ZXIud3JpdGUobGluZSArXCJcXG5cIik7XHJcblx0XHR9XHJcblx0fVxyXG5cdHdyaXRlci5lbmQoKTtcclxuXHRyZXR1cm4gbmV3IFByb21pc2UoIChyZXNvbHZlKSA9PiB7XHJcblx0XHR3cml0ZXIub24oJ2ZpbmlzaCcsICgpID0+IHtcclxuXHRcdFx0ZnMuY29weUZpbGVTeW5jKG5ld0ZpbGVQYXRoLCBpbnB1dEZpbGVQYXRoKTtcclxuXHRcdFx0ZGVsZXRlRmlsZShuZXdGaWxlUGF0aCk7XHJcblx0XHRcdHJlc29sdmUoZXJyb3JDb3VudCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG5cclxuLy8gaXNFbmRPZlNldHRpbmdcclxuZnVuY3Rpb24gIGlzRW5kT2ZTZXR0aW5nKGxpbmU6IHN0cmluZywgaXNSZWFkaW5nU2V0dGluZzogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG5cdGxldCAgcmV0dXJuVmFsdWUgPSBmYWxzZTtcclxuXHRpZiAoaXNSZWFkaW5nU2V0dGluZykge1xyXG5cdFx0Y29uc3QgY29tbWVudCA9IGxpbmUuaW5kZXhPZignIycpO1xyXG5cdFx0bGV0IGxlZnRPZkNvbW1lbnQ6IHN0cmluZztcclxuXHRcdGlmIChjb21tZW50ICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRsZWZ0T2ZDb21tZW50ID0gbGluZS5zdWJzdHIoMCwgbGluZS5pbmRleE9mKCcjJykpLnRyaW0oKTtcclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRsZWZ0T2ZDb21tZW50ID0gbGluZS50cmltKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGxlZnRPZkNvbW1lbnQuaW5kZXhPZignOicpID09PSBub3RGb3VuZCAgJiYgIGxlZnRPZkNvbW1lbnQgIT09ICcnKSB7XHJcblx0XHRcdHJldHVyblZhbHVlID0gdHJ1ZTtcclxuXHRcdH0gZWxzZSBpZiAobGVmdE9mQ29tbWVudC5zdWJzdHIoLTEpID09PSAnfCcpIHtcclxuXHRcdFx0cmV0dXJuVmFsdWUgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gIHJldHVyblZhbHVlO1xyXG59XHJcblxyXG4vLyBkZWxldGVGaWxlXHJcbmZ1bmN0aW9uICBkZWxldGVGaWxlKHBhdGg6IHN0cmluZykge1xyXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aCkpIHtcclxuICAgICAgICBmcy51bmxpbmtTeW5jKHBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBnZXRWYWx1ZVxyXG5mdW5jdGlvbiAgZ2V0VmFsdWUobGluZTogc3RyaW5nLCBzZXBhcmF0b3JJbmRleDogbnVtYmVyKSB7XHJcblx0bGV0ICAgIHZhbHVlID0gbGluZS5zdWJzdHIoc2VwYXJhdG9ySW5kZXggKyAxKS50cmltKCk7XHJcblx0Y29uc3QgIGNvbW1lbnQgPSB2YWx1ZS5pbmRleE9mKCcjJyk7XHJcblx0aWYgKGNvbW1lbnQgIT09IG5vdEZvdW5kKSB7XHJcblx0XHR2YWx1ZSA9IHZhbHVlLnN1YnN0cigwLCBjb21tZW50KS50cmltKCk7XHJcblx0fVxyXG5cdHJldHVybiAgdmFsdWU7XHJcbn1cclxuXHJcbi8vIGdldEV4cGVjdGVkTGluZVxyXG5mdW5jdGlvbiAgZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmc6IFNldHRpbmdzLCB0ZW1wbGF0ZTogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRsZXQgIGV4cGVjdGVkID0gdGVtcGxhdGU7XHJcbmlmICghdGVtcGxhdGUpIHtcclxucmV0dXJuIHRlbXBsYXRlO1xyXG59XHJcblxyXG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRjb25zdCAgcmUgPSBuZXcgUmVnRXhwKCBlc2NhcGVSZWd1bGFyRXhwcmVzc2lvbihrZXkpLCBcImdpXCIgKTtcclxuXHJcblx0XHRjb25zdCAgZXhwZWN0ZWRBZnRlciA9IGV4cGVjdGVkLnJlcGxhY2UocmUsIHNldHRpbmdba2V5XS52YWx1ZSk7XHJcblx0XHRpZiAoZXhwZWN0ZWRBZnRlciAhPT0gZXhwZWN0ZWQpIHtcclxuXHRcdFx0c2V0dGluZ1trZXldLmlzUmVmZXJlbmNlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRleHBlY3RlZCA9IGV4cGVjdGVkQWZ0ZXI7XHJcblx0fVxyXG5cdHJldHVybiAgZXhwZWN0ZWQ7XHJcbn1cclxuXHJcbi8vIGdldEV4cGVjdGVkTGluZUluRmlsZVRlbXBsYXRlXHJcbmZ1bmN0aW9uICBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZShzZXR0aW5nOiBTZXR0aW5ncywgdGVtcGxhdGU6IHN0cmluZykge1xyXG5cclxuXHRsZXQgIGV4cGVjdGVkID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlKTtcclxuXHRjb25zdCAgdGVtcGxhdGVJbmRleCA9IGV4cGVjdGVkLmluZGV4T2YodGVtcGxhdGVMYWJlbCk7XHJcblx0aWYgKHRlbXBsYXRlSW5kZXggIT09IG5vdEZvdW5kKSB7XHJcblxyXG5cdFx0ZXhwZWN0ZWQgPSBleHBlY3RlZC5zdWJzdHIoMCwgdGVtcGxhdGVJbmRleCk7XHJcblx0XHRleHBlY3RlZCA9IGV4cGVjdGVkLnRyaW1SaWdodCgpO1xyXG5cdH1cclxuXHRyZXR1cm4gIGV4cGVjdGVkO1xyXG59XHJcblxyXG4vLyBnZXRDaGFuZ2VkTGluZVxyXG5mdW5jdGlvbiAgZ2V0Q2hhbmdlZExpbmUoc2V0dGluZzogU2V0dGluZ3MsIHRlbXBsYXRlOiBzdHJpbmcsIGNoYW5naW5nS2V5OiBzdHJpbmcsIGNoYW5nZWRWYWx1ZTogc3RyaW5nKSB7XHJcblx0bGV0ICBjaGFuZ2VkTGluZSA9ICcnO1xyXG5cdGlmIChjaGFuZ2luZ0tleSBpbiBzZXR0aW5nKSB7XHJcblx0XHRjb25zdCAgY2hhbmdpbmdWYWx1ZSA9IHNldHRpbmdbY2hhbmdpbmdLZXldLnZhbHVlO1xyXG5cclxuXHRcdHNldHRpbmdbY2hhbmdpbmdLZXldLnZhbHVlID0gY2hhbmdlZFZhbHVlO1xyXG5cclxuXHRcdGNoYW5nZWRMaW5lID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlKTtcclxuXHRcdHNldHRpbmdbY2hhbmdpbmdLZXldLnZhbHVlID0gY2hhbmdpbmdWYWx1ZTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y2hhbmdlZExpbmUgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGUpO1xyXG5cdH1cclxuXHRyZXR1cm4gIGNoYW5nZWRMaW5lO1xyXG59XHJcblxyXG4vLyBnZXRDaGFuZ2VkVmFsdWVcclxuZnVuY3Rpb24gIGdldENoYW5nZWRWYWx1ZShjaGFuZ2VkVmFsdWVBbmRDb21tZW50OiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdGNvbnN0ICBjb21tZW50SW5kZXggPSBjaGFuZ2VkVmFsdWVBbmRDb21tZW50LmluZGV4T2YoJyMnKTtcclxuXHRsZXQgIGNoYW5nZWRWYWx1ZTogc3RyaW5nO1xyXG5cdGlmIChjb21tZW50SW5kZXggIT09IG5vdEZvdW5kKSB7XHJcblxyXG5cdFx0Y2hhbmdlZFZhbHVlID0gY2hhbmdlZFZhbHVlQW5kQ29tbWVudC5zdWJzdHIoMCwgY29tbWVudEluZGV4KS50cmltKCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNoYW5nZWRWYWx1ZSA9IGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQ7XHJcblx0fVxyXG5cdHJldHVybiAgY2hhbmdlZFZhbHVlO1xyXG59XHJcblxyXG4vLyBwYXJzZVRlbXBsYXRlVGFnXHJcbmZ1bmN0aW9uICBwYXJzZVRlbXBsYXRlVGFnKGxpbmU6IHN0cmluZyk6IFRlbXBsYXRlVGFnIHtcclxuXHRjb25zdCAgdGFnID0gbmV3IFRlbXBsYXRlVGFnKCk7XHJcblxyXG5cdHRhZy5sYWJlbCA9IHRlbXBsYXRlTGFiZWw7XHJcblx0dGFnLmluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKHRlbXBsYXRlTGFiZWwpO1xyXG5cdGlmICh0YWcuaW5kZXhJbkxpbmUgPT09IG5vdEZvdW5kKSB7XHJcblx0XHR0YWcubGFiZWwgPSBmaWxlVGVtcGxhdGVMYWJlbDtcclxuXHRcdHRhZy5pbmRleEluTGluZSA9IGxpbmUuaW5kZXhPZihmaWxlVGVtcGxhdGVMYWJlbCk7XHJcblx0fVxyXG5cdGlmICh0YWcuaW5kZXhJbkxpbmUgIT09IG5vdEZvdW5kKSB7XHJcblx0XHR0YWcuaXNGb3VuZCA9IHRydWU7XHJcblx0XHRjb25zdCAgbGVmdE9mVGVtcGxhdGUgPSBsaW5lLnN1YnN0cigwLCB0YWcuaW5kZXhJbkxpbmUpLnRyaW0oKTtcclxuXHRcdGlmICh0YWcubGFiZWwgPT09IGZpbGVUZW1wbGF0ZUxhYmVsKSB7XHJcblx0XHRcdHRhZy5vbkZpbGVUZW1wbGF0ZVRhZ1JlYWRpbmcobGluZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dGFnLnRlbXBsYXRlID0gbGluZS5zdWJzdHIodGFnLmluZGV4SW5MaW5lICsgdGFnLmxhYmVsLmxlbmd0aCkudHJpbSgpO1xyXG5cdFx0aWYgKGxlZnRPZlRlbXBsYXRlID09PSAnJykge1xyXG5cdFx0XHR0YWcubGluZU51bU9mZnNldCA9IC0xO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGFnLmxpbmVOdW1PZmZzZXQgPSAwO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICB0YWc7XHJcblx0fVxyXG5cclxuXHR0YWcubGFiZWwgPSB0ZW1wbGF0ZUF0U3RhcnRMYWJlbDtcclxuXHR0YWcuc3RhcnRJbmRleEluTGluZSA9IGxpbmUuaW5kZXhPZih0ZW1wbGF0ZUF0U3RhcnRMYWJlbCk7XHJcblx0aWYgKHRhZy5zdGFydEluZGV4SW5MaW5lICE9PSBub3RGb3VuZCkge1xyXG5cdFx0dGFnLmlzRm91bmQgPSB0cnVlO1xyXG5cdFx0dGFnLmVuZEluZGV4SW5MaW5lID0gIGxpbmUuaW5kZXhPZih0ZW1wbGF0ZUF0RW5kTGFiZWwsIHRhZy5zdGFydEluZGV4SW5MaW5lKTtcclxuXHRcdGlmICh0YWcuZW5kSW5kZXhJbkxpbmUgIT09IG5vdEZvdW5kKSB7XHJcblxyXG5cdFx0XHR0YWcudGVtcGxhdGUgPSBsaW5lLnN1YnN0cih0YWcuZW5kSW5kZXhJbkxpbmUgKyB0ZW1wbGF0ZUF0RW5kTGFiZWwubGVuZ3RoKS50cmltKCk7XHJcblx0XHRcdHRhZy5saW5lTnVtT2Zmc2V0ID0gcGFyc2VJbnQobGluZS5zdWJzdHJpbmcoXHJcblx0XHRcdFx0dGFnLnN0YXJ0SW5kZXhJbkxpbmUgKyB0ZW1wbGF0ZUF0U3RhcnRMYWJlbC5sZW5ndGgsXHJcblx0XHRcdFx0dGFnLmVuZEluZGV4SW5MaW5lICkpO1xyXG5cdFx0XHRyZXR1cm4gIHRhZztcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHRhZy5sYWJlbCA9ICcnO1xyXG5cdHRhZy50ZW1wbGF0ZSA9ICcnO1xyXG5cdHRhZy5saW5lTnVtT2Zmc2V0ID0gMDtcclxuXHRyZXR1cm4gIHRhZztcclxufVxyXG5cclxuLy8gVGVtcGxhdGVUYWdcclxuY2xhc3MgIFRlbXBsYXRlVGFnIHtcclxuXHRsYWJlbCA9ICcnO1xyXG5cdHRlbXBsYXRlID0gJyc7XHJcblx0aXNGb3VuZCA9IGZhbHNlO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZSB0YWdcclxuXHRpbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZS1hdCB0YWdcclxuXHRsaW5lTnVtT2Zmc2V0ID0gMDsgIFxyXG5cdHN0YXJ0SW5kZXhJbkxpbmUgPSBub3RGb3VuZDtcclxuXHRlbmRJbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cclxuXHQvLyBmb3IgZmlsZS10ZW1wbGF0ZSB0YWdcclxuXHR0ZW1wbGF0ZUxpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdGluZGVudEF0VGFnID0gJyc7XHJcblx0bWluSW5kZW50TGVuZ3RoID0gMDtcclxuXHJcblx0b25GaWxlVGVtcGxhdGVUYWdSZWFkaW5nKGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5pbmRlbnRBdFRhZyA9IGluZGVudFJlZ3VsYXJFeHByZXNzaW9uLmV4ZWMobGluZSkhWzBdO1xyXG5cdFx0dGhpcy5taW5JbmRlbnRMZW5ndGggPSBtYXhOdW1iZXI7XHJcblx0fVxyXG5cdG9uUmVhZExpbmUobGluZTogc3RyaW5nKTogYm9vbGVhbiB7XHJcblx0XHRjb25zdCAgY3VycmVudEluZGVudCA9IGluZGVudFJlZ3VsYXJFeHByZXNzaW9uLmV4ZWMobGluZSkhWzBdO1xyXG5cdFx0bGV0ICByZWFkaW5nTmV4dCA9IHRydWU7XHJcblx0XHRpZiAoY3VycmVudEluZGVudC5sZW5ndGggPiB0aGlzLmluZGVudEF0VGFnLmxlbmd0aCAgJiYgIGxpbmUuc3RhcnRzV2l0aCh0aGlzLmluZGVudEF0VGFnKSkge1xyXG5cclxuXHRcdFx0dGhpcy50ZW1wbGF0ZUxpbmVzLnB1c2gobGluZS5zdWJzdHIodGhpcy5pbmRlbnRBdFRhZy5sZW5ndGgpKTtcclxuXHRcdFx0dGhpcy5taW5JbmRlbnRMZW5ndGggPSBNYXRoLm1pbih0aGlzLm1pbkluZGVudExlbmd0aCwgY3VycmVudEluZGVudC5sZW5ndGgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy50ZW1wbGF0ZUxpbmVzID0gdGhpcy50ZW1wbGF0ZUxpbmVzLm1hcCgobGluZSk9PihcclxuXHRcdFx0XHRsaW5lLnN1YnN0cih0aGlzLm1pbkluZGVudExlbmd0aCkpKTtcclxuXHRcdFx0cmVhZGluZ05leHQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAgcmVhZGluZ05leHQ7XHJcblx0fVxyXG5cdGFzeW5jICBjaGVja1RhcmdldENvbnRlbnRzKHNldHRpbmc6IFNldHRpbmdzLCBpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIHRlbXBsYXRlRW5kTGluZU51bTogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XHJcblx0XHRjb25zdCAgcGFyZW50UGF0aCA9IHBhdGguZGlybmFtZShpbnB1dEZpbGVQYXRoKTtcclxuXHRcdGNvbnN0ICB0YXJnZXRGaWxlUGF0aCA9IHBhdGguam9pbihwYXJlbnRQYXRoLCBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGhpcy50ZW1wbGF0ZSkpO1xyXG5cdFx0aWYgKCFmcy5leGlzdHNTeW5jKHRhcmdldEZpbGVQYXRoKSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYEVycm9yOiAke3RyYW5zbGF0ZSgnTm90Rm91bmQnKX06ICR7dGFyZ2V0RmlsZVBhdGh9YCk7XHJcblx0XHRcdHJldHVybiAgZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCAgdGFyZ2V0RmlsZVJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKHRhcmdldEZpbGVQYXRoKSxcclxuXHRcdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdFx0fSk7XHJcblx0XHRpZiAodGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgIGV4cGVjdGVkRmlyc3RMaW5lID0gZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGUoc2V0dGluZywgdGhpcy50ZW1wbGF0ZUxpbmVzWzBdKTtcclxuXHRcdGxldCAgdGVtcGxhdGVMaW5lSW5kZXggPSAwO1xyXG5cdFx0bGV0ICB0YXJnZXRMaW5lTnVtID0gMDtcclxuXHRcdGxldCAgZXJyb3JUZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRsZXQgIGVycm9yVGFyZ2V0TGluZU51bSA9IDA7XHJcblx0XHRsZXQgIGVycm9yQ29udGVudHMgPSAnJztcclxuXHRcdGxldCAgZXJyb3JFeHBlY3RlZCA9ICcnO1xyXG5cdFx0bGV0ICBlcnJvclRlbXBsYXRlID0gJyc7XHJcblx0XHRsZXQgIGluZGVudCA9ICcnO1xyXG5cdFx0bGV0ICBzYW1lID0gZmFsc2U7XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiB0YXJnZXRGaWxlUmVhZGVyKSB7XHJcblx0XHRcdGNvbnN0ICB0YXJnZXRMaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdFx0dGFyZ2V0TGluZU51bSArPSAxO1xyXG5cdFx0XHRpZiAodGVtcGxhdGVMaW5lSW5kZXggPT09IDApIHtcclxuXHJcblx0XHRcdFx0Y29uc3QgIGluZGVudExlbmd0aCA9IHRhcmdldExpbmUuaW5kZXhPZihleHBlY3RlZEZpcnN0TGluZSk7XHJcblx0XHRcdFx0aWYgKGluZGVudExlbmd0aCA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdHNhbWUgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2FtZSA9IHRydWU7XHJcblx0XHRcdFx0XHRpbmRlbnQgPSB0YXJnZXRMaW5lLnN1YnN0cigwLCBpbmRlbnRMZW5ndGgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHsgLy8gbGluZUluZGV4ID49IDFcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZShcclxuXHRcdFx0XHRcdHNldHRpbmcsIHRoaXMudGVtcGxhdGVMaW5lc1t0ZW1wbGF0ZUxpbmVJbmRleF0pO1xyXG5cclxuXHRcdFx0XHRzYW1lID0gKHRhcmdldExpbmUgPT09IGluZGVudCArIGV4cGVjdGVkKTtcclxuXHRcdFx0XHRpZiAoIXNhbWUpIHtcclxuXHRcdFx0XHRcdGVycm9yVGVtcGxhdGVMaW5lSW5kZXggPSB0ZW1wbGF0ZUxpbmVJbmRleDtcclxuXHRcdFx0XHRcdGVycm9yVGFyZ2V0TGluZU51bSA9IHRhcmdldExpbmVOdW07XHJcblx0XHRcdFx0XHRlcnJvckNvbnRlbnRzID0gdGFyZ2V0TGluZTtcclxuXHRcdFx0XHRcdGVycm9yRXhwZWN0ZWQgPSBpbmRlbnQgKyBleHBlY3RlZDtcclxuXHRcdFx0XHRcdGVycm9yVGVtcGxhdGUgPSBpbmRlbnQgKyB0aGlzLnRlbXBsYXRlTGluZXNbdGVtcGxhdGVMaW5lSW5kZXhdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2FtZSkge1xyXG5cdFx0XHRcdHRlbXBsYXRlTGluZUluZGV4ICs9IDE7XHJcblx0XHRcdFx0aWYgKHRlbXBsYXRlTGluZUluZGV4ID49IHRoaXMudGVtcGxhdGVMaW5lcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghc2FtZSkge1xyXG5cdFx0XHRjb25zdCAgdGVtcGxhdGVMaW5lTnVtID0gdGVtcGxhdGVFbmRMaW5lTnVtIC0gdGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCArIGVycm9yVGVtcGxhdGVMaW5lSW5kZXg7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yRmlsZScpfTogJHtnZXRUZXN0YWJsZSh0YXJnZXRGaWxlUGF0aCl9OiR7ZXJyb3JUYXJnZXRMaW5lTnVtfWApO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3R5cHJtRmlsZScpfTogJHtnZXRUZXN0YWJsZShpbnB1dEZpbGVQYXRoKX06JHt0ZW1wbGF0ZUxpbmVOdW19YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIENvbnRlbnRzOiAke2Vycm9yQ29udGVudHN9YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIEV4cGVjdGVkOiAke2Vycm9yRXhwZWN0ZWR9YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAgIFRlbXBsYXRlOiAke2Vycm9yVGVtcGxhdGV9YCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHNhbWU7XHJcblx0fVxyXG59XHJcblxyXG4vLyBlc2NhcGVSZWd1bGFyRXhwcmVzc2lvblxyXG5mdW5jdGlvbiAgZXNjYXBlUmVndWxhckV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKSB7XHJcblx0cmV0dXJuICBleHByZXNzaW9uLnJlcGxhY2UoL1tcXFxcXiQuKis/KClbXFxde318XS9nLCAnXFxcXCQmJyk7XHJcbn1cclxuXHJcbi8vIFN0YW5kYXJkSW5wdXRCdWZmZXJcclxuY2xhc3MgIFN0YW5kYXJkSW5wdXRCdWZmZXIge1xyXG5cdHJlYWRsaW5lczogcmVhZGxpbmUuSW50ZXJmYWNlO1xyXG5cdGlucHV0QnVmZmVyOiBzdHJpbmdbXSA9IFtdO1xyXG5cdGlucHV0UmVzb2x2ZXI/OiAoYW5zd2VyOnN0cmluZyk9PnZvaWQgPSB1bmRlZmluZWQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5yZWFkbGluZXMgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0XHRpbnB1dDogcHJvY2Vzcy5zdGRpbixcclxuXHRcdFx0b3V0cHV0OiBwcm9jZXNzLnN0ZG91dFxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5vbignbGluZScsIGFzeW5jIChsaW5lOiBzdHJpbmcpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMuaW5wdXRSZXNvbHZlcikge1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlcihsaW5lKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0UmVzb2x2ZXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5pbnB1dEJ1ZmZlci5wdXNoKGxpbmUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnJlYWRsaW5lcy5zZXRQcm9tcHQoJycpO1xyXG5cdFx0dGhpcy5yZWFkbGluZXMucHJvbXB0KCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyAgaW5wdXQoZ3VpZGU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0XHRyZXR1cm4gIG5ldyBQcm9taXNlKFxyXG5cdFx0XHQocmVzb2x2ZTogKGFuc3dlcjpzdHJpbmcpPT52b2lkLCAgcmVqZWN0OiAoYW5zd2VyOnN0cmluZyk9PnZvaWQgKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCAgbmV4dExpbmUgPSB0aGlzLmlucHV0QnVmZmVyLnNoaWZ0KCk7XHJcblx0XHRcdGlmIChuZXh0TGluZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgbmV4dExpbmUpO1xyXG5cdFx0XHRcdHJlc29sdmUobmV4dExpbmUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHByb2Nlc3Muc3Rkb3V0LndyaXRlKGd1aWRlKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0UmVzb2x2ZXIgPSByZXNvbHZlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGNsb3NlKCkge1xyXG5cdFx0dGhpcy5yZWFkbGluZXMuY2xvc2UoKTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIElucHV0T3B0aW9uXHJcbmNsYXNzIElucHV0T3B0aW9uIHtcclxuXHRpbnB1dExpbmVzOiBzdHJpbmdbXTtcclxuXHRuZXh0TGluZUluZGV4OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGlucHV0TGluZXM6IHN0cmluZ1tdKSB7XHJcblx0XHR0aGlzLmlucHV0TGluZXMgPSBpbnB1dExpbmVzO1xyXG5cdFx0dGhpcy5uZXh0TGluZUluZGV4ID0gMDtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0ICB0ZXN0QmFzZUZvbGRlciA9IFN0cmluZy5yYXcgYFI6XFxob21lXFxtZW1fY2FjaGVcXE15RG9jXFxzcmNcXFR5cGVTY3JpcHRcXHR5cHJtXFx0ZXN0X2RhdGFgKydcXFxcJztcclxuXHJcbi8vIGlucHV0T3B0aW9uXHJcbmNvbnN0IGlucHV0T3B0aW9uID0gbmV3IElucHV0T3B0aW9uKFtcclxuLypcclxuXHR0ZXN0QmFzZUZvbGRlciArYGNoYW5nZV9zZXRfLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYGZpbGVgLFxyXG5cdHRlc3RCYXNlRm9sZGVyICtgY2hhbmdlX3NldF9zZXR0aW5nLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYENoYW5nZWRgLFxyXG4qL1xyXG5dKTtcclxuXHJcbi8vIGlucHV0XHJcbi8vIEV4YW1wbGU6IGNvbnN0IG5hbWUgPSBhd2FpdCBpbnB1dCgnV2hhdCBpcyB5b3VyIG5hbWU/ICcpO1xyXG5hc3luYyBmdW5jdGlvbiAgaW5wdXQoIGd1aWRlOiBzdHJpbmcgKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHQvLyBJbnB1dCBlbXVsYXRpb25cclxuXHRpZiAoaW5wdXRPcHRpb24uaW5wdXRMaW5lcykge1xyXG5cdFx0aWYgKGlucHV0T3B0aW9uLm5leHRMaW5lSW5kZXggPCBpbnB1dE9wdGlvbi5pbnB1dExpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCAgdmFsdWUgPSBpbnB1dE9wdGlvbi5pbnB1dExpbmVzW2lucHV0T3B0aW9uLm5leHRMaW5lSW5kZXhdO1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4ICs9IDE7XHJcblx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgdmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gIHZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gaW5wdXRcclxuXHRyZXR1cm4gIElucHV0T2JqZWN0LmlucHV0KGd1aWRlKTtcclxufVxyXG5jb25zdCAgSW5wdXRPYmplY3QgPSBuZXcgU3RhbmRhcmRJbnB1dEJ1ZmZlcigpO1xyXG5cclxuLy8gaW5wdXRQYXRoXHJcbi8vIEV4YW1wbGU6IGNvbnN0IG5hbWUgPSBhd2FpdCBpbnB1dCgnV2hhdCBpcyB5b3VyIG5hbWU/ICcpO1xyXG5hc3luYyBmdW5jdGlvbiAgaW5wdXRQYXRoKCBndWlkZTogc3RyaW5nICkge1xyXG5cdGNvbnN0ICBrZXkgPSBhd2FpdCBpbnB1dChndWlkZSk7XHJcblx0cmV0dXJuICBwYXRoUmVzb2x2ZShrZXkpO1xyXG59XHJcblxyXG4vLyBwYXRoUmVzb2x2ZVxyXG5mdW5jdGlvbiAgcGF0aFJlc29sdmUocGF0aF86IHN0cmluZykge1xyXG5cclxuXHQvLyAnL2MvaG9tZScgZm9ybWF0IHRvIGN1cnJlbnQgT1MgZm9ybWF0XHJcblx0aWYgKHBhdGhfLmxlbmd0aCA+PSAzKSB7XHJcblx0XHRpZiAocGF0aF9bMF0gPT09ICcvJyAgJiYgIHBhdGhfWzJdID09PSAnLycpIHtcclxuXHRcdFx0cGF0aF8gPSBwYXRoX1sxXSArJzonKyBwYXRoXy5zdWJzdHIoMik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBDaGFuZ2Ugc2VwYXJhdG9ycyB0byBPUyBmb3JtYXRcclxuXHRwYXRoXyA9IHBhdGgucmVzb2x2ZShwYXRoXyk7XHJcblxyXG5cdHJldHVybiBwYXRoX1xyXG59XHJcblxyXG4vLyBTZXR0aW5nXHJcbnR5cGUgU2V0dGluZ3MgPSB7W25hbWU6IHN0cmluZ106IFNldHRpbmd9XHJcblxyXG4vLyBTZXR0aW5nXHJcbmNsYXNzIFNldHRpbmcge1xyXG5cdHZhbHVlOiBzdHJpbmcgPSAnJztcclxuXHRsaW5lTnVtOiBudW1iZXIgPSAwO1xyXG5cdGlzUmVmZXJlbmNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcblxyXG4vLyBTZWFyY2hLZXl3b3JkXHJcbmNsYXNzIFNlYXJjaEtleXdvcmQge1xyXG5cdGtleXdvcmQ6IHN0cmluZyA9ICcnO1xyXG5cdHN0YXJ0TGluZU51bTogbnVtYmVyID0gMDtcclxuXHRkaXJlY3Rpb246IERpcmVjdGlvbiA9IERpcmVjdGlvbi5Gb2xsb3dpbmc7XHJcbn1cclxuXHJcbi8vIERpcmVjdGlvblxyXG5lbnVtIERpcmVjdGlvbiB7XHJcblx0QWJvdmUgPSAtMSxcclxuXHRGb2xsb3dpbmcgPSArMSxcclxufVxyXG5cclxuLy8gV3JpdGVCdWZmZXJcclxuY2xhc3MgIFdyaXRlQnVmZmVyIHtcclxuXHRzdHJlYW06IGZzLldyaXRlU3RyZWFtO1xyXG5cdGxpbmVCdWZmZXI6IHN0cmluZ1tdO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihzdHJlYW06IGZzLldyaXRlU3RyZWFtKSB7XHJcblx0XHR0aGlzLnN0cmVhbSA9IHN0cmVhbTtcclxuXHRcdHRoaXMubGluZUJ1ZmZlciA9IFtdO1xyXG5cdH1cclxuXHJcblx0ZW5kKCkge1xyXG5cdFx0Zm9yIChjb25zdCBsaW5lICBvZiAgdGhpcy5saW5lQnVmZmVyKSB7XHJcblx0XHRcdHRoaXMuc3RyZWFtLndyaXRlKGxpbmUpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zdHJlYW0uZW5kKCk7XHJcbiAgICB9XHJcblxyXG5cdG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XHJcblx0XHR0aGlzLnN0cmVhbS5vbihldmVudCwgY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0d3JpdGUobGluZTogc3RyaW5nKSB7XHJcblx0XHR0aGlzLmxpbmVCdWZmZXIucHVzaChsaW5lKTtcclxuXHR9XHJcblxyXG5cdHJlcGxhY2VBYm92ZUxpbmUocmVsYXRpdmVMaW5lTnVtOiBudW1iZXIsIGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5saW5lQnVmZmVyW3RoaXMubGluZUJ1ZmZlci5sZW5ndGggKyByZWxhdGl2ZUxpbmVOdW1dID0gbGluZTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIHRyYW5zbGF0ZVxyXG4vLyBlLmcuIHRyYW5zbGF0ZSgnZW5nbGlzaCcpXHJcbi8vIGUuZy4gdHJhbnNsYXRlYHByaWNlID0gJHtwcmljZX1gICAvLyAuLi4gdGFnZ2VkVGVtcGxhdGVcclxuZnVuY3Rpb24gIHRyYW5zbGF0ZShlbmdsaXNoTGl0ZXJhbHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5IHwgc3RyaW5nLCAgLi4udmFsdWVzOiBhbnlbXSk6IHN0cmluZyB7XHJcblx0bGV0ICAgIGRpY3Rpb25hcnk6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHRjb25zdCAgdGFnZ2VkVGVtcGxhdGUgPSAodHlwZW9mKGVuZ2xpc2hMaXRlcmFscykgIT09ICdzdHJpbmcnKTtcclxuXHJcblx0bGV0ICBlbmdsaXNoID0gZW5nbGlzaExpdGVyYWxzIGFzIHN0cmluZztcclxuXHRpZiAodGFnZ2VkVGVtcGxhdGUpIHtcclxuXHRcdGVuZ2xpc2ggPSAnJztcclxuXHRcdGZvciAobGV0IGk9MDsgaTxlbmdsaXNoTGl0ZXJhbHMubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdGVuZ2xpc2ggKz0gZW5nbGlzaExpdGVyYWxzW2ldO1xyXG5cdFx0XHRpZiAoaSA8IHZhbHVlcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRlbmdsaXNoICs9ICckeycgKyBTdHJpbmcoaSkgKyd9JztcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBlLmcuIGVuZ2xpc2ggPSAncHJpY2UgPSAkezB9J1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKGxvY2FsZSA9PT0gJ2phLUpQJykge1xyXG5cdFx0ZGljdGlvbmFyeSA9IHtcclxuXHRcdFx0XCJZQU1MIFVURi04IGZpbGUgcGF0aD5cIjogXCJZQU1MIFVURi04IOODleOCoeOCpOODqyDjg5Hjgrk+XCIsXHJcblx0XHRcdFwiVGhpcyBpcyBhIHNlY3JldCB2YWx1ZS5cIjogXCLjgZPjgozjga/np5jlr4bjga7lgKTjgafjgZnjgIJcIixcclxuXHRcdFx0XCJDaGFuZ2UgXFxcIiR7MH1cXFwiIHRvIFxcXCIkezF9XFxcIi5cIjogXCJcXFwiJHswfVxcXCIg44KSIFxcXCIkezF9XFxcIiDjgavlpInmm7TjgZfjgabjgY/jgaDjgZXjgYTjgIJcIixcclxuXHRcdFx0XCJQcmVzcyBFbnRlciBrZXkgdG8gcmV0cnkgY2hlY2tpbmcuXCI6IFwiRW50ZXIg44Kt44O844KS5oq844GZ44Go5YaN44OB44Kn44OD44Kv44GX44G+44GZ44CCXCIsXHJcblx0XHRcdFwiVGhlIGxpbmUgbnVtYmVyIHRvIGNoYW5nZSB0aGUgdmFyaWFibGUgdmFsdWUgPlwiOiBcIuWkieabtOOBmeOCi+WkieaVsOWApOOBjOOBguOCi+ihjOeVquWPtyA+XCIsXHJcblx0XHRcdFwiRW50ZXIgb25seTogZmluaXNoIHRvIGlucHV0IHNldHRpbmdcIjogXCJFbnRlciDjga7jgb/vvJroqK3lrprjga7lhaXlipvjgpLntYLjgo/jgotcIixcclxuXHRcdFx0XCJrZXk6IG5ld192YWx1ZT5cIjogXCLlpInmlbDlkI06IOaWsOOBl+OBhOWkieaVsOWApD5cIixcclxuXHRcdFx0XCJ0ZW1wbGF0ZSBjb3VudFwiOiBcIuODhuODs+ODl+ODrOODvOODiOOBruaVsFwiLFxyXG5cdFx0XHRcImluIHByZXZpb3VzIGNoZWNrXCI6IFwi5YmN5Zue44Gu44OB44Kn44OD44KvXCIsXHJcblx0XHRcdFwiV2FybmluZ1wiOiBcIuitpuWRilwiLFxyXG5cdFx0XHRcIkVycm9yXCI6IFwi44Ko44Op44O8XCIsXHJcblx0XHRcdFwiRXJyb3JMaW5lXCI6IFwi44Ko44Op44O86KGMXCIsXHJcblx0XHRcdFwiU29sdXRpb25cIjogXCLop6Pmsbrms5VcIixcclxuXHRcdFx0XCJDb250ZW50c1wiOiBcIuWGheWuuVwiLFxyXG5cdFx0XHRcIkV4cGVjdGVkXCI6IFwi5pyf5b6FXCIsXHJcblx0XHRcdFwiVGVtcGxhdGVcIjogXCLpm5vlvaJcIixcclxuXHRcdFx0XCJXYXJuaW5nTGluZVwiOiBcIuitpuWRiuihjFwiLFxyXG5cdFx0XHRcIkZvdW5kXCI6IFwi6KaL44Gk44GL44Gj44Gf44KC44GuXCIsXHJcblx0XHRcdFwiU2V0dGluZ0luZGV4XCI6IFwi6Kit5a6a55Wq5Y+3XCIsXHJcblx0XHRcdFwiTm90IGZvdW5kIGFueSByZXBsYWNpbmcgdGFyZ2V0XCI6IFwi572u44GN5o+b44GI44KL5a++6LGh44GM6KaL44Gk44GL44KK44G+44Gb44KTXCIsXHJcblx0XHRcdFwiU2V0IG9sZCB2YWx1ZSBhdCBzZXR0aW5ncyBpbiB0aGUgcmVwbGFjaW5nIGZpbGVcIjogXCLnva7jgY3mj5vjgYjjgovjg5XjgqHjgqTjg6vjga7kuK3jga7oqK3lrprjgavlj6TjgYTlgKTjgpLoqK3lrprjgZfjgabjgY/jgaDjgZXjgYRcIixcclxuXHRcdFx0XCJUaGUgcGFyYW1ldGVyIG11c3QgYmUgbGVzcyB0aGFuIDBcIjogXCLjg5Hjg6njg6Hjg7zjgr/jg7zjga8gMCDjgojjgorlsI/jgZXjgY/jgZfjgabjgY/jgaDjgZXjgYRcIixcclxuXHRcdFx0XCJOb3QgZm91bmQgXFxcIiR7MH1cXFwiIGFib3ZlXCI6IFwi5LiK5pa55ZCR44Gr44CMJHswfeOAjeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIk5vdCBmb3VuZCBcXFwiJHswfVxcXCIgZm9sbG93aW5nXCI6IFwi5LiL5pa55ZCR44Gr44CMJHswfeOAjeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIk5vdCByZWZlcmVuY2VkOiAkezB9IGluIGxpbmUgJHsxfVwiOiBcIuWPgueFp+OBleOCjOOBpuOBhOOBvuOBm+OCk++8miAkezB9IO+8iCR7MX3ooYznm67vvIlcIixcclxuXHRcdH07XHJcblx0fVxyXG5cdGxldCAgdHJhbnNsYXRlZCA9IGVuZ2xpc2g7XHJcblx0aWYgKGRpY3Rpb25hcnkpIHtcclxuXHRcdGlmIChlbmdsaXNoIGluIGRpY3Rpb25hcnkpIHtcclxuXHJcblx0XHRcdHRyYW5zbGF0ZWQgPSBkaWN0aW9uYXJ5W2VuZ2xpc2hdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAodGFnZ2VkVGVtcGxhdGUpIHtcclxuXHRcdGZvciAobGV0IGk9MDsgaTxlbmdsaXNoTGl0ZXJhbHMubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdHRyYW5zbGF0ZWQgPSB0cmFuc2xhdGVkLnJlcGxhY2UoICckeycrU3RyaW5nKGkpKyd9JywgU3RyaW5nKHZhbHVlc1tpXSkgKTtcclxuXHRcdH1cclxuXHRcdHRyYW5zbGF0ZWQgPSB0cmFuc2xhdGVkLnJlcGxhY2UoICckXFxcXHsnLCAnJHsnICk7XHJcblx0XHRcdC8vIFJlcGxhY2UgdGhlIGVzY2FwZSBvZiAke259XHJcblx0XHRcdC8vIGUuZy4gXCIkXFxcXHtwcmljZX0gPSAke3ByaWNlfVwiID0+IFwiJHtwcmljZX0gPSAxMDBcIlxyXG5cdH1cclxuXHRyZXR1cm4gIHRyYW5zbGF0ZWQ7XHJcbn1cclxuXHJcbmNvbnN0ICBpbmRlbnRSZWd1bGFyRXhwcmVzc2lvbiA9IC9eKCB8wqV0KSovO1xyXG5jb25zdCAgbWluTGluZU51bSA9IDA7XHJcbmNvbnN0ICBtYXhMaW5lTnVtID0gOTk5OTk5OTk5O1xyXG5jb25zdCAgbWF4TnVtYmVyID0gOTk5OTk5OTk5O1xyXG5jb25zdCAgZm91bmRGb3JBYm92ZSA9IG1pbkxpbmVOdW07XHJcbmNvbnN0ICBmb3VuZEZvckZvbGxvd2luZyA9IG1heExpbmVOdW07XHJcbmNvbnN0ICBub3RGb3VuZCA9IC0xO1xyXG5jb25zdCAgYWxsU2V0dGluZyA9IDA7XHJcbmNvbnN0ICBub1NlcGFyYXRvciA9IC0xO1xyXG5sZXQgICAgbG9jYWxlOiBzdHJpbmc7XHJcbmNvbnN0ICBwcm9ncmFtT3B0aW9ucyA9IHByb2dyYW0ub3B0cygpO1xyXG5mdW5jdGlvbiAgZXhpdEZyb21Db21tYW5kZXIoZTogQ29tbWFuZGVyRXJyb3IpIHtcclxuXHRjb25zb2xlLmxvZyhlLm1lc3NhZ2UpO1xyXG59XHJcbmZ1bmN0aW9uICBnZXRUZXN0YWJsZShwYXRoOiBzdHJpbmcpIHtcclxuXHRpZiAocHJvZ3JhbU9wdGlvbnMudGVzdCkge1xyXG5cdFx0aWYgKHBhdGguc3RhcnRzV2l0aChpbnB1dEZpbGVQYXJlbnRQYXRoKSkge1xyXG5cdFx0XHRyZXR1cm4gICcke2lucHV0RmlsZVBhcmVudFBhdGh9JyArIHBhdGguc3Vic3RyKGlucHV0RmlsZVBhcmVudFBhdGgubGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiAgcGF0aDtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICBwYXRoO1xyXG5cdH1cclxufVxyXG5sZXQgIGlucHV0RmlsZVBhcmVudFBhdGggPSAnJztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uICBjYWxsTWFpbigpIHtcclxuXHRwcm9ncmFtLnZlcnNpb24oJzAuMS4xJykuZXhpdE92ZXJyaWRlKGV4aXRGcm9tQ29tbWFuZGVyKVxyXG5cdFx0Lm9wdGlvbihcIi1sLCAtLWxvY2FsZSA8cz5cIilcclxuXHRcdC5vcHRpb24oXCItdCwgLS10ZXN0XCIpXHJcblx0XHQucGFyc2UocHJvY2Vzcy5hcmd2KTtcclxuXHRcclxuXHRsb2NhbGUgPSBJbnRsLk51bWJlckZvcm1hdCgpLnJlc29sdmVkT3B0aW9ucygpLmxvY2FsZTtcclxuXHRpZiAocHJvZ3JhbU9wdGlvbnMubG9jYWxlKSB7XHJcblx0XHRsb2NhbGUgPSBwcm9ncmFtT3B0aW9ucy5sb2NhbGU7XHJcblx0fVxyXG5cclxuXHRhd2FpdCAgbWFpbigpXHJcblx0XHQuY2F0Y2goIChlKT0+e1xyXG5cdFx0XHRpZiAocHJvZ3JhbU9wdGlvbnMudGVzdCkge1xyXG5cdFx0XHRcdHRocm93IGU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCBgRVJST1I6ICR7ZS5tZXNzYWdlfWAgKTtcclxuXHRcdFx0XHRjb25zdCAgdGltZU92ZXIgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0XHRcdHRpbWVPdmVyLnNldFNlY29uZHMoIHRpbWVPdmVyLmdldFNlY29uZHMoKSArIDUgKTtcclxuXHJcblx0XHRcdFx0d2hpbGUgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgPCB0aW1lT3Zlci5nZXRUaW1lKCkpIHtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0XHQuZmluYWxseSgoKT0+e1xyXG5cdFx0XHRJbnB1dE9iamVjdC5jbG9zZSgpO1xyXG5cdFx0fSk7XHJcbn1cclxuY2FsbE1haW4oKTtcclxuIl19