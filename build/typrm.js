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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVCQUF5QixDQUFDLGNBQWM7QUFDeEMsMkJBQTZCLENBQUUsNEJBQTRCO0FBQzNELHVDQUFvRDtBQUNwRCxtQ0FBcUM7QUFFckMsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUN2QixJQUFPLGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUNqQyxJQUFPLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztBQUN6QyxJQUFPLGFBQWEsR0FBRyxZQUFZLENBQUM7QUFDcEMsSUFBTyxvQkFBb0IsR0FBRyxlQUFlLENBQUM7QUFDOUMsSUFBTyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7QUFDakMsSUFBTyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztBQUM3QyxJQUFPLGVBQWUsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2hFLElBQU8sV0FBVyxHQUFHLE1BQU0sQ0FBQztBQUM1QixJQUFPLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDakMsSUFBTyxpQkFBaUIsR0FBRyxRQUFRLENBQUM7QUFDcEMsSUFBTyxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQztBQUMvQyxJQUFPLFlBQVksR0FBRyw2Q0FBNkMsQ0FBQztBQUVwRSxTQUFnQixJQUFJOzs7Ozs7d0JBQ0kscUJBQU0sU0FBUyxDQUFFLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFFLEVBQUE7O29CQUFyRSxhQUFhLEdBQUcsU0FBcUQ7b0JBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNoRCxtQkFBbUIsR0FBRyxVQUFVLENBQUM7b0JBQzVCLHFCQUFxQixHQUFHLENBQUMs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QUFDLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDO3lCQUN0RCxNQUFNLENBQUMsa0JBQWtCLENBQUM7eUJBQzFCLE1BQU0sQ0FBQyxZQUFZLENBQUM7eUJBQ3BCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXRCLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUN0RCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUU7d0JBQzFCLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO3FCQUMvQjtvQkFFRCxxQkFBTyxJQUFJLEVBQUUsQ0FDWCxPQUFLLENBQUEsQ0FBRSxVQUFDLENBQUM7NEJBQ1QsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFO2dDQUN4QixNQUFNLENBQUMsQ0FBQzs2QkFDUjtpQ0FBTTtnQ0FFTixPQUFPLENBQUMsR0FBRyxDQUFFLFlBQVUsQ0FBQyxDQUFDLE9BQVMsQ0FBRSxDQUFDO2dDQUNyQyxJQUFPLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO2dDQUM3QixRQUFRLENBQUMsVUFBVSxDQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUUsQ0FBQztnQ0FFakQsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUU7aUNBQ25EOzZCQUNEO3dCQUNGLENBQUMsQ0FBQyxDQUNELFNBQU8sQ0FBQSxDQUFDOzRCQUNSLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDckIsQ0FBQyxDQUFDLEVBQUE7O29CQWhCSCxTQWdCRyxDQUFDOzs7OztDQUNKO0FBQ0QsUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7IC8vIGZpbGUgc3lzdGVtXHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjsgIC8vIG9yIHBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxyXG5pbXBvcnQgeyBwcm9ncmFtLCBDb21tYW5kZXJFcnJvciB9IGZyb20gJ2NvbW1hbmRlcic7XHJcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcclxuaW1wb3J0IHsgRGVmYXVsdERlc2VyaWFsaXplciB9IGZyb20gJ3Y4JztcclxuY29uc3QgZGQgPSBjb25zb2xlLmxvZztcclxuY29uc3QgIHNldHRpbmdTdGFydExhYmVsID0gXCLoqK3lrpo6XCI7XHJcbmNvbnN0ICBzZXR0aW5nU3RhcnRMYWJlbEVuID0gXCJzZXR0aW5nczpcIjtcclxuY29uc3QgIHRlbXBsYXRlTGFiZWwgPSBcIiN0ZW1wbGF0ZTpcIjtcclxuY29uc3QgIHRlbXBsYXRlQXRTdGFydExhYmVsID0gXCIjdGVtcGxhdGUtYXQoXCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUF0RW5kTGFiZWwgPSBcIik6XCI7XHJcbmNvbnN0ICBmaWxlVGVtcGxhdGVMYWJlbCA9IFwiI2ZpbGUtdGVtcGxhdGU6XCI7XHJcbmNvbnN0ICB0ZW1wb3JhcnlMYWJlbHMgPSBbXCIj4piFTm93OlwiLCBcIiNub3c6XCIsIFwiI+KYheabuOOBjeOBi+OBkVwiLCBcIiPimIXmnKrnorroqo1cIl07XHJcbmNvbnN0ICBzZWNyZXRMYWJlbCA9IFwiI+KYheenmOWvhlwiO1xyXG5jb25zdCAgc2VjcmV0TGFiZWxFbiA9IFwiI3NlY3JldFwiO1xyXG5jb25zdCAgc2VjcmV0RXhhbWxlTGFiZWwgPSBcIiPimIXnp5jlr4Y65LuuXCI7XHJcbmNvbnN0ICBzZWNyZXRFeGFtbGVMYWJlbEVuID0gXCIjc2VjcmV0OmV4YW1wbGVcIjtcclxuY29uc3QgIHJlZmVyUGF0dGVybiA9IC8o5LiK6KiYfOS4i+iomHxhYm92ZXxmb2xsb3dpbmcpKOOAjHxcXFspKFte44CNXSopKOOAjXxcXF0pL2c7XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgbWFpbigpIHtcclxuXHRjb25zdCAgaW5wdXRGaWxlUGF0aCA9IGF3YWl0IGlucHV0UGF0aCggdHJhbnNsYXRlKCdZQU1MIFVURi04IGZpbGUgcGF0aD4nKSApO1xyXG5cdGNvbnN0ICBwYXJlbnRQYXRoID0gcGF0aC5kaXJuYW1lKGlucHV0RmlsZVBhdGgpO1xyXG5cdGlucHV0RmlsZVBhcmVudFBhdGggPSBwYXJlbnRQYXRoO1xyXG5cdGxldCAgcHJldmlvdXNUZW1wbGF0ZUNvdW50ID0gMDtcclxuXHRmb3IoOzspIHtcclxuXHRcdGxldCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5wdXRGaWxlUGF0aCksXHJcblx0XHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHRcdH0pO1xyXG5cdFx0bGV0ICBpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRsZXQgIHNldHRpbmc6IFNldHRpbmdzID0ge307XHJcblx0XHRsZXQgIHNldHRpbmdDb3VudCA9IDA7XHJcblx0XHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cdFx0bGV0ICB0ZW1wbGF0ZUNvdW50ID0gMDtcclxuXHRcdGxldCAgZmlsZVRlbXBsYXRlVGFnOiBUZW1wbGF0ZVRhZyB8IG51bGwgPSBudWxsO1xyXG5cdFx0bGV0ICBlcnJvckNvdW50ID0gMDtcclxuXHRcdGxldCAgd2FybmluZ0NvdW50ID0gMDtcclxuXHRcdGxldCAgc2VjcmV0TGFiZWxDb3VudCA9IDA7XHJcblx0XHRjb25zdCAgbGluZXMgPSBbXTtcclxuXHRcdGNvbnN0ICBrZXl3b3JkczogU2VhcmNoS2V5d29yZFtdID0gW107XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0XHRsaW5lcy5wdXNoKGxpbmUpO1xyXG5cdFx0XHRsaW5lTnVtICs9IDE7XHJcblx0XHRcdGNvbnN0ICBwcmV2aW91c0lzUmVhZGluZ1NldHRpbmcgPSBpc1JlYWRpbmdTZXR0aW5nO1xyXG5cclxuXHRcdFx0Ly8gc2V0dGluZyA9IC4uLlxyXG5cdFx0XHRpZiAobGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsICB8fCAgbGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0XHRpZiAoc2V0dGluZ0NvdW50ID49IDEpIHtcclxuXHRcdFx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlzRW5kT2ZTZXR0aW5nKGxpbmUsIGlzUmVhZGluZ1NldHRpbmcpKSB7XHJcblx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRcdFx0Y29uc3QgIHNlcGFyYXRvciA9IGxpbmUuaW5kZXhPZignOicpO1xyXG5cdFx0XHRcdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5ID0gbGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShsaW5lLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0dGluZ1trZXldID0ge3ZhbHVlLCBpc1JlZmVyZW5jZWQ6IGZhbHNlLCBsaW5lTnVtfTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbCAgJiYgIGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiBwcmV2aW91cyBsaW5lIGhhcyBcInRlbXBsYXRlXCIgcmVwbGFjZWQgY29udGVudHMuXHJcblx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0ID49IDEgICYmICB0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke3RyYW5zbGF0ZSgnVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwJyl9YCk7XHJcblx0XHRcdFx0dGVtcGxhdGVUYWcuaXNGb3VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRlbXBsYXRlQ291bnQgKz0gMTtcclxuXHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUNvdW50ICs9IDE7XHJcblx0XHRcdFx0Y29uc3QgIGNoZWNraW5nTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoZXhwZWN0ZWQpID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldH1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtjaGVja2luZ0xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0V4cGVjdGVkJyl9OiAke2V4cGVjdGVkfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayB0YXJnZXQgZmlsZSBjb250ZW50cyBieSBcIiNmaWxlLXRlbXBsYXRlOlwiIHRhZy5cclxuXHRcdFx0aWYgKGZpbGVUZW1wbGF0ZVRhZykge1xyXG5cdFx0XHRcdGNvbnN0IGNvbnRpbnVlXyA9IGZpbGVUZW1wbGF0ZVRhZy5vblJlYWRMaW5lKGxpbmUpO1xyXG5cdFx0XHRcdGlmICghY29udGludWVfKSB7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgIGNoZWNrUGFzc2VkID0gYXdhaXQgZmlsZVRlbXBsYXRlVGFnLmNoZWNrVGFyZ2V0Q29udGVudHMoXHJcblx0XHRcdFx0XHRcdHNldHRpbmcsIGlucHV0RmlsZVBhdGgsIGxpbmVOdW0pO1xyXG5cdFx0XHRcdFx0aWYgKCFjaGVja1Bhc3NlZCkge1xyXG5cdFx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRmaWxlVGVtcGxhdGVUYWcgPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodGVtcGxhdGVUYWcubGFiZWwgPT09IGZpbGVUZW1wbGF0ZUxhYmVsKSB7XHJcblx0XHRcdFx0ZmlsZVRlbXBsYXRlVGFnID0gdGVtcGxhdGVUYWc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIG5vdCBcIiPimIVOb3c6XCIuXHJcblx0XHRcdGZvciAobGV0IHRlbXBvcmFyeUxhYmVsIG9mIHRlbXBvcmFyeUxhYmVscykge1xyXG5cdFx0XHRcdGlmIChsaW5lLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0ZW1wb3JhcnlMYWJlbC50b0xvd2VyQ2FzZSgpKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHR3YXJuaW5nQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIG5vdCBzZWNyZXQgdGFnLlxyXG5cdFx0XHRpZiAobGluZS5pbmRleE9mKCBzZWNyZXRMYWJlbCApICE9PSBub3RGb3VuZCAgfHwgIGxpbmUuaW5kZXhPZiggc2VjcmV0TGFiZWxFbiApICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdGlmIChsaW5lLmluZGV4T2YoIHNlY3JldEV4YW1sZUxhYmVsICkgPT09IG5vdEZvdW5kICAmJiAgbGluZS5pbmRleE9mKCBzZWNyZXRFeGFtbGVMYWJlbEVuICkgPT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRpZiAoc2VjcmV0TGFiZWxDb3VudCA9PT0gMCkgeyAgLy8gQmVjYXVzZSB0aGVyZSB3aWxsIGJlIG1hbnkgc2VjcmV0IGRhdGEuXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1dhcm5pbmdMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdUaGlzIGlzIGEgc2VjcmV0IHZhbHVlLicpfWApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnKyB0cmFuc2xhdGVgQ2hhbmdlIFwiJHtzZWNyZXRMYWJlbEVufVwiIHRvIFwiJHtzZWNyZXRFeGFtbGVMYWJlbEVufVwiLidgKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJysgdHJhbnNsYXRlYENoYW5nZSBcIiR7c2VjcmV0TGFiZWx9XCIgdG8gXCIke3NlY3JldEV4YW1sZUxhYmVsfVwiLidgKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRcdHdhcm5pbmdDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c2VjcmV0TGFiZWxDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gR2V0IHRpdGxlcyBhYm92ZSBvciBmb2xsb3dpbmcuXHJcblx0XHRcdGxldCAgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGw7XHJcblx0XHRcdHJlZmVyUGF0dGVybi5sYXN0SW5kZXggPSAwO1xyXG5cclxuXHRcdFx0d2hpbGUgKCAobWF0Y2ggPSByZWZlclBhdHRlcm4uZXhlYyggbGluZSApKSAhPT0gbnVsbCApIHtcclxuXHRcdFx0XHRjb25zdCAga2V5d29yZCA9IG5ldyBTZWFyY2hLZXl3b3JkKCk7XHJcblx0XHRcdFx0Y29uc3QgIGxhYmVsID0gbWF0Y2hbMV07XHJcblx0XHRcdFx0a2V5d29yZC5rZXl3b3JkID0gbWF0Y2hbM107XHJcblx0XHRcdFx0aWYgKGxhYmVsID09PSBcIuS4iuiomFwiICB8fCAgbGFiZWwgPT09IFwiYWJvdmVcIikge1xyXG5cdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBsaW5lTnVtIC0gMTtcclxuXHRcdFx0XHRcdGtleXdvcmQuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkFib3ZlO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobGFiZWwgPT09IFwi5LiL6KiYXCIgIHx8ICBsYWJlbCA9PT0gXCJmb2xsb3dpbmdcIikge1xyXG5cdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBsaW5lTnVtICsgMTtcclxuXHRcdFx0XHRcdGtleXdvcmQuZGlyZWN0aW9uID0gRGlyZWN0aW9uLkZvbGxvd2luZztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0a2V5d29yZHMucHVzaChrZXl3b3JkKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKHNldHRpbmdDb3VudCA+PSAxKSB7XHJcblx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIHRoZSB0aXRsZSBhYm92ZSBvciBmb2xsb3dpbmcuXHJcblx0XHRyZWFkZXIgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShpbnB1dEZpbGVQYXRoKSxcclxuXHRcdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdFx0fSk7XHJcblx0XHRsaW5lTnVtID0gMDtcclxuXHJcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRcdGxpbmVOdW0gKz0gMTtcclxuXHJcblx0XHRcdGZvciAoY29uc3Qga2V5d29yZCBvZiBrZXl3b3Jkcykge1xyXG5cdFx0XHRcdGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkFib3ZlKSB7XHJcblx0XHRcdFx0XHRpZiAobGluZU51bSA8PSBrZXl3b3JkLnN0YXJ0TGluZU51bSkge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihrZXl3b3JkLmtleXdvcmQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gZm91bmRGb3JBYm92ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Gb2xsb3dpbmcpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5lTnVtID49IGtleXdvcmQuc3RhcnRMaW5lTnVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAobGluZS5pbmRleE9mKGtleXdvcmQua2V5d29yZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBmb3VuZEZvckZvbGxvd2luZztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIGtleXdvcmRzKSB7XHJcblx0XHRcdGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkFib3ZlKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuc3RhcnRMaW5lTnVtICE9PSBmb3VuZEZvckFib3ZlKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtrZXl3b3JkLnN0YXJ0TGluZU51bSArIDF9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnICsgdHJhbnNsYXRlYE5vdCBmb3VuZCBcIiR7a2V5d29yZC5rZXl3b3JkfVwiIGFib3ZlYCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uRm9sbG93aW5nKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuc3RhcnRMaW5lTnVtICE9PSBmb3VuZEZvckZvbGxvd2luZykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7a2V5d29yZC5zdGFydExpbmVOdW0gLSAxfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJyArIHRyYW5zbGF0ZWBOb3QgZm91bmQgXCIke2tleXdvcmQua2V5d29yZH1cIiBmb2xsb3dpbmdgKTtcclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTaG93IHRoZSByZXN1bHRcclxuXHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnV2FybmluZycpfTogJHt3YXJuaW5nQ291bnR9LCAke3RyYW5zbGF0ZSgnRXJyb3InKX06ICR7ZXJyb3JDb3VudH1gKTtcclxuXHRcdGlmIChwcmV2aW91c1RlbXBsYXRlQ291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCd0ZW1wbGF0ZSBjb3VudCcpfSA9ICR7cHJldmlvdXNUZW1wbGF0ZUNvdW50fSAoJHt0cmFuc2xhdGUoJ2luIHByZXZpb3VzIGNoZWNrJyl9KWApO1xyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCd0ZW1wbGF0ZSBjb3VudCcpfSA9ICR7dGVtcGxhdGVDb3VudH1gKTtcclxuXHJcblx0XHQvLyBSZXNjYW4gb3IgY2hhbmdlIGEgdmFsdWVcclxuXHRcdGxldCAgbG9vcCA9IHRydWU7XHJcblx0XHR3aGlsZSAobG9vcCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGUoJ1ByZXNzIEVudGVyIGtleSB0byByZXRyeSBjaGVja2luZy4nKSk7XHJcblxyXG5cdFx0XHRjb25zdCAga2V5ID0gYXdhaXQgaW5wdXQodHJhbnNsYXRlKCdUaGUgbGluZSBudW1iZXIgdG8gY2hhbmdlIHRoZSB2YXJpYWJsZSB2YWx1ZSA+JykpO1xyXG5cdFx0XHRlcnJvckNvdW50ID0gMDtcclxuXHRcdFx0aWYgKGtleSA9PT0gJ2V4aXQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGtleSAhPT0gJycpIHtcclxuXHRcdFx0XHRjb25zdCAgbGluZU51bSA9IHBhcnNlSW50KGtleSk7XHJcblx0XHRcdFx0Y29uc3QgIGNoYW5naW5nU2V0dGluZ0luZGV4ID0gYXdhaXQgZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW0oaW5wdXRGaWxlUGF0aCwgbGluZU51bSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7Y2hhbmdpbmdTZXR0aW5nSW5kZXh9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlKCdFbnRlciBvbmx5OiBmaW5pc2ggdG8gaW5wdXQgc2V0dGluZycpKTtcclxuXHRcdFx0XHRmb3IgKDs7KSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5VmFsdWUgPSBhd2FpdCBpbnB1dCh0cmFuc2xhdGUoJ2tleTogbmV3X3ZhbHVlPicpKTtcclxuXHRcdFx0XHRcdGlmIChrZXlWYWx1ZSA9PT0gJycpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IGF3YWl0IGNoYW5nZVNldHRpbmdCeUtleVZhbHVlKGlucHV0RmlsZVBhdGgsIGNoYW5naW5nU2V0dGluZ0luZGV4LCBrZXlWYWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxvb3AgPSAoZXJyb3JDb3VudCA+PSAxKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXNjYW5cclxuXHRcdGNvbnNvbGUubG9nKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XHJcblx0XHRwcmV2aW91c1RlbXBsYXRlQ291bnQgPSB0ZW1wbGF0ZUNvdW50XHJcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzZXR0aW5nKSkge1xyXG5cdFx0XHRzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBvbkVuZE9mU2V0dGluZ1xyXG5mdW5jdGlvbiBvbkVuZE9mU2V0dGluZyhzZXR0aW5nOiBTZXR0aW5ncykge1xyXG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRpZiAoIXNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlYE5vdCByZWZlcmVuY2VkOiAke2tleX0gaW4gbGluZSAke3NldHRpbmdba2V5XS5saW5lTnVtfWApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy8gZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW1cclxuYXN5bmMgZnVuY3Rpb24gIGdldFNldHRpbmdJbmRleEZyb21MaW5lTnVtKGlucHV0RmlsZVBhdGg6IHN0cmluZywgdGFyZ2V0TGluZU51bTogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuXHRjb25zdCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdH0pO1xyXG5cdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cclxuXHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0bGluZU51bSArPSAxO1xyXG5cclxuXHRcdGlmIChsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWwgIHx8ICBsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobGluZU51bSA9PT0gdGFyZ2V0TGluZU51bSkge1xyXG5cdFx0XHRyZXR1cm4gIHNldHRpbmdDb3VudDtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICAwO1xyXG59XHJcblxyXG4vLyBjaGFuZ2VTZXR0aW5nQnlLZXlWYWx1ZVxyXG5hc3luYyBmdW5jdGlvbiAgY2hhbmdlU2V0dGluZ0J5S2V5VmFsdWUoaW5wdXRGaWxlUGF0aDogc3RyaW5nLCBjaGFuZ2luZ1NldHRpbmdJbmRleDogbnVtYmVyLFxyXG5cdFx0a2V5VmFsdWU6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPi8qZXJyb3JDb3VudCovIHtcclxuXHJcblx0Y29uc3QgIHNlcGFyYXRvciA9IGtleVZhbHVlLmluZGV4T2YoJzonKTtcclxuXHRpZiAoc2VwYXJhdG9yICE9PSBub3RGb3VuZCkge1xyXG5cdFx0Y29uc3QgIGtleSA9IGtleVZhbHVlLnN1YnN0cigwLCBzZXBhcmF0b3IpLnRyaW0oKTtcclxuXHRcdGNvbnN0ICB2YWx1ZSA9IGdldFZhbHVlKGtleVZhbHVlLCBzZXBhcmF0b3IpO1xyXG5cclxuXHRcdHJldHVybiAgY2hhbmdlU2V0dGluZyhpbnB1dEZpbGVQYXRoLCBjaGFuZ2luZ1NldHRpbmdJbmRleCwga2V5LCB2YWx1ZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAgMTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGNoYW5nZVNldHRpbmdcclxuYXN5bmMgZnVuY3Rpb24gIGNoYW5nZVNldHRpbmcoaW5wdXRGaWxlUGF0aDogc3RyaW5nLCBjaGFuZ2luZ1NldHRpbmdJbmRleDogbnVtYmVyLFxyXG5cdFx0Y2hhbmdpbmdLZXk6IHN0cmluZywgY2hhbmdlZFZhbHVlQW5kQ29tbWVudDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+LyplcnJvckNvdW50Ki8ge1xyXG5cclxuXHRjb25zdCAgYmFja1VwRmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoICtcIi5iYWNrdXBcIjtcclxuXHRpZiAoIWZzLmV4aXN0c1N5bmMoYmFja1VwRmlsZVBhdGgpKSB7XHJcblx0XHRmcy5jb3B5RmlsZVN5bmMoaW5wdXRGaWxlUGF0aCwgYmFja1VwRmlsZVBhdGgpO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgIG9sZEZpbGVQYXRoID0gaW5wdXRGaWxlUGF0aDtcclxuXHRjb25zdCAgbmV3RmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoICtcIi5uZXdcIjtcclxuXHRjb25zdCAgd3JpdGVyID0gbmV3IFdyaXRlQnVmZmVyKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKG5ld0ZpbGVQYXRoKSk7XHJcblx0Y29uc3QgIHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShvbGRGaWxlUGF0aCksXHJcblx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0fSk7XHJcblx0Y29uc3QgIGxpbmVzID0gW107XHJcblx0bGV0ICBpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0bGV0ICBzZXR0aW5nOiBTZXR0aW5ncyA9IHt9O1xyXG5cdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRsZXQgIGNoYW5nZWRWYWx1ZSA9IGdldENoYW5nZWRWYWx1ZShjaGFuZ2VkVmFsdWVBbmRDb21tZW50KTtcclxuXHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cdGxldCAgZXJyb3JDb3VudCA9IDA7XHJcblx0bGV0ICBpc0NoYW5naW5nID0gZmFsc2U7XHJcblx0XHJcblx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdGNvbnN0ICBsaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdGxpbmVzLnB1c2gobGluZSk7XHJcblx0XHRsaW5lTnVtICs9IDE7XHJcblx0XHRsZXQgIG91dHB1dCA9IGZhbHNlO1xyXG5cclxuXHRcdC8vIHNldHRpbmcgPSAuLi5cclxuXHRcdGlmIChsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWwgIHx8ICBsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdFx0aWYgKGNoYW5naW5nU2V0dGluZ0luZGV4ID09PSBhbGxTZXR0aW5nKSB7XHJcblx0XHRcdFx0aXNDaGFuZ2luZyA9IHRydWU7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aXNDaGFuZ2luZyA9IChzZXR0aW5nQ291bnQgPT09IGNoYW5naW5nU2V0dGluZ0luZGV4KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmIChpc0VuZE9mU2V0dGluZyhsaW5lLCBpc1JlYWRpbmdTZXR0aW5nKSkge1xyXG5cdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAoaXNDaGFuZ2luZykge1xyXG5cclxuXHRcdFx0aWYgKGlzUmVhZGluZ1NldHRpbmcpIHtcclxuXHRcdFx0XHRjb25zdCAgc2VwYXJhdG9yID0gbGluZS5pbmRleE9mKCc6Jyk7XHJcblx0XHRcdFx0aWYgKHNlcGFyYXRvciAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBrZXkgPSBsaW5lLnN1YnN0cigwLCBzZXBhcmF0b3IpLnRyaW0oKTtcclxuXHRcdFx0XHRcdGNvbnN0ICB2YWx1ZSA9IGdldFZhbHVlKGxpbmUsIHNlcGFyYXRvcik7XHJcblx0XHRcdFx0XHRpZiAodmFsdWUgIT09ICcnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRzZXR0aW5nW2tleV0gPSB7dmFsdWUsIGlzUmVmZXJlbmNlZDogZmFsc2UsIGxpbmVOdW19O1xyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChrZXkgKyAnOicgIT09IHNldHRpbmdTdGFydExhYmVsICAmJiAga2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbEVuKSB7XHJcblx0XHRcdFx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoa2V5ID09PSBjaGFuZ2luZ0tleSkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgY29tbWVudEluZGV4ID0gbGluZS5pbmRleE9mKCcjJywgc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdFx0bGV0ICBjb21tZW50PSAnJztcclxuXHRcdFx0XHRcdFx0aWYgKGNvbW1lbnRJbmRleCAhPT0gbm90Rm91bmQgICYmICBjaGFuZ2VkVmFsdWVBbmRDb21tZW50LmluZGV4T2YoJyMnKSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0XHRjb21tZW50ID0gJyAgJyArIGxpbmUuc3Vic3RyKGNvbW1lbnRJbmRleCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHdyaXRlci53cml0ZShsaW5lLnN1YnN0cigwLCBzZXBhcmF0b3IgKyAxKSArJyAnKyBjaGFuZ2VkVmFsdWVBbmRDb21tZW50ICsgY29tbWVudCArIFwiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE91dCBvZiBzZXR0aW5nc1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBjaGVja2luZ0xpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cdFx0XHRcdFx0Y29uc3QgIGNoYW5nZWQgPSBnZXRDaGFuZ2VkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZVRhZy50ZW1wbGF0ZSwgY2hhbmdpbmdLZXksIGNoYW5nZWRWYWx1ZSk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGV4cGVjdGVkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgIGJlZm9yZSA9IGV4cGVjdGVkO1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgYWZ0ZXIgPSBjaGFuZ2VkO1xyXG5cdFx0XHRcdFx0XHRpZiAodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCA8PSAtMSkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnN0ICBhYm92ZUxpbmUgPSBsaW5lc1tsaW5lcy5sZW5ndGggLSAxICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldF07XHJcblx0XHRcdFx0XHRcdFx0d3JpdGVyLnJlcGxhY2VBYm92ZUxpbmUodGVtcGxhdGVUYWcubGluZU51bU9mZnNldCxcclxuXHRcdFx0XHRcdFx0XHRcdGFib3ZlTGluZS5yZXBsYWNlKGJlZm9yZSwgYWZ0ZXIpK1wiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0XHR3cml0ZXIud3JpdGUobGluZS5yZXBsYWNlKGJlZm9yZSwgYWZ0ZXIpICtcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGNoZWNraW5nTGluZS5pbmRleE9mKGNoYW5nZWQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHQvLyBEbyBub3RoaW5nXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZiAoZXJyb3JDb3VudCA9PT0gMCkgeyAvLyBTaW5jZSBvbmx5IG9uZSBvbGQgdmFsdWUgY2FuIGJlIHJlcGxhY2VkIGF0IGEgdGltZVxyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHt0cmFuc2xhdGUoJ05vdCBmb3VuZCBhbnkgcmVwbGFjaW5nIHRhcmdldCcpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTb2x1dGlvbicpfTogJHt0cmFuc2xhdGUoJ1NldCBvbGQgdmFsdWUgYXQgc2V0dGluZ3MgaW4gdGhlIHJlcGxhY2luZyBmaWxlJyl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0NvbnRlbnRzJyl9OiAke2xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdFeHBlY3RlZCcpfTogJHtleHBlY3RlZC50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnU2V0dGluZ0luZGV4Jyl9OiAke3NldHRpbmdDb3VudH1gKTtcclxuXHRcdFx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghb3V0cHV0KSB7XHJcblx0XHRcdHdyaXRlci53cml0ZShsaW5lICtcIlxcblwiKTtcclxuXHRcdH1cclxuXHR9XHJcblx0d3JpdGVyLmVuZCgpO1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUpID0+IHtcclxuXHRcdHdyaXRlci5vbignZmluaXNoJywgKCkgPT4ge1xyXG5cdFx0XHRmcy5jb3B5RmlsZVN5bmMobmV3RmlsZVBhdGgsIGlucHV0RmlsZVBhdGgpO1xyXG5cdFx0XHRkZWxldGVGaWxlKG5ld0ZpbGVQYXRoKTtcclxuXHRcdFx0cmVzb2x2ZShlcnJvckNvdW50KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vLyBpc0VuZE9mU2V0dGluZ1xyXG5mdW5jdGlvbiAgaXNFbmRPZlNldHRpbmcobGluZTogc3RyaW5nLCBpc1JlYWRpbmdTZXR0aW5nOiBib29sZWFuKTogYm9vbGVhbiB7XHJcblx0bGV0ICByZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRjb25zdCBjb21tZW50ID0gbGluZS5pbmRleE9mKCcjJyk7XHJcblx0XHRsZXQgbGVmdE9mQ29tbWVudDogc3RyaW5nO1xyXG5cdFx0aWYgKGNvbW1lbnQgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdGxlZnRPZkNvbW1lbnQgPSBsaW5lLnN1YnN0cigwLCBsaW5lLmluZGV4T2YoJyMnKSkudHJpbSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGxlZnRPZkNvbW1lbnQgPSBsaW5lLnRyaW0oKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobGVmdE9mQ29tbWVudC5pbmRleE9mKCc6JykgPT09IG5vdEZvdW5kICAmJiAgbGVmdE9mQ29tbWVudCAhPT0gJycpIHtcclxuXHRcdFx0cmV0dXJuVmFsdWUgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmIChsZWZ0T2ZDb21tZW50LnN1YnN0cigtMSkgPT09ICd8Jykge1xyXG5cdFx0XHRyZXR1cm5WYWx1ZSA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAgcmV0dXJuVmFsdWU7XHJcbn1cclxuXHJcbi8vIGRlbGV0ZUZpbGVcclxuZnVuY3Rpb24gIGRlbGV0ZUZpbGUocGF0aDogc3RyaW5nKSB7XHJcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoKSkge1xyXG4gICAgICAgIGZzLnVubGlua1N5bmMocGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGdldFZhbHVlXHJcbmZ1bmN0aW9uICBnZXRWYWx1ZShsaW5lOiBzdHJpbmcsIHNlcGFyYXRvckluZGV4OiBudW1iZXIpIHtcclxuXHRsZXQgICAgdmFsdWUgPSBsaW5lLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpLnRyaW0oKTtcclxuXHRjb25zdCAgY29tbWVudCA9IHZhbHVlLmluZGV4T2YoJyMnKTtcclxuXHRpZiAoY29tbWVudCAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyKDAsIGNvbW1lbnQpLnRyaW0oKTtcclxuXHR9XHJcblx0cmV0dXJuICB2YWx1ZTtcclxufVxyXG5cclxuLy8gZ2V0RXhwZWN0ZWRMaW5lXHJcbmZ1bmN0aW9uICBnZXRFeHBlY3RlZExpbmUoc2V0dGluZzogU2V0dGluZ3MsIHRlbXBsYXRlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdGxldCAgZXhwZWN0ZWQgPSB0ZW1wbGF0ZTtcclxuaWYgKCF0ZW1wbGF0ZSkge1xyXG5yZXR1cm4gdGVtcGxhdGU7XHJcbn1cclxuXHJcblx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZykpIHtcclxuXHRcdGNvbnN0ICByZSA9IG5ldyBSZWdFeHAoIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uKGtleSksIFwiZ2lcIiApO1xyXG5cclxuXHRcdGNvbnN0ICBleHBlY3RlZEFmdGVyID0gZXhwZWN0ZWQucmVwbGFjZShyZSwgc2V0dGluZ1trZXldLnZhbHVlKTtcclxuXHRcdGlmIChleHBlY3RlZEFmdGVyICE9PSBleHBlY3RlZCkge1xyXG5cdFx0XHRzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWRBZnRlcjtcclxuXHR9XHJcblx0cmV0dXJuICBleHBlY3RlZDtcclxufVxyXG5cclxuLy8gZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGVcclxuZnVuY3Rpb24gIGdldEV4cGVjdGVkTGluZUluRmlsZVRlbXBsYXRlKHNldHRpbmc6IFNldHRpbmdzLCB0ZW1wbGF0ZTogc3RyaW5nKSB7XHJcblxyXG5cdGxldCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGUpO1xyXG5cdGNvbnN0ICB0ZW1wbGF0ZUluZGV4ID0gZXhwZWN0ZWQuaW5kZXhPZih0ZW1wbGF0ZUxhYmVsKTtcclxuXHRpZiAodGVtcGxhdGVJbmRleCAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRleHBlY3RlZCA9IGV4cGVjdGVkLnN1YnN0cigwLCB0ZW1wbGF0ZUluZGV4KTtcclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWQudHJpbVJpZ2h0KCk7XHJcblx0fVxyXG5cdHJldHVybiAgZXhwZWN0ZWQ7XHJcbn1cclxuXHJcbi8vIGdldENoYW5nZWRMaW5lXHJcbmZ1bmN0aW9uICBnZXRDaGFuZ2VkTGluZShzZXR0aW5nOiBTZXR0aW5ncywgdGVtcGxhdGU6IHN0cmluZywgY2hhbmdpbmdLZXk6IHN0cmluZywgY2hhbmdlZFZhbHVlOiBzdHJpbmcpIHtcclxuXHRsZXQgIGNoYW5nZWRMaW5lID0gJyc7XHJcblx0aWYgKGNoYW5naW5nS2V5IGluIHNldHRpbmcpIHtcclxuXHRcdGNvbnN0ICBjaGFuZ2luZ1ZhbHVlID0gc2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWU7XHJcblxyXG5cdFx0c2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWUgPSBjaGFuZ2VkVmFsdWU7XHJcblxyXG5cdFx0Y2hhbmdlZExpbmUgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGUpO1xyXG5cdFx0c2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWUgPSBjaGFuZ2luZ1ZhbHVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGFuZ2VkTGluZSA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0fVxyXG5cdHJldHVybiAgY2hhbmdlZExpbmU7XHJcbn1cclxuXHJcbi8vIGdldENoYW5nZWRWYWx1ZVxyXG5mdW5jdGlvbiAgZ2V0Q2hhbmdlZFZhbHVlKGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0Y29uc3QgIGNvbW1lbnRJbmRleCA9IGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuaW5kZXhPZignIycpO1xyXG5cdGxldCAgY2hhbmdlZFZhbHVlOiBzdHJpbmc7XHJcblx0aWYgKGNvbW1lbnRJbmRleCAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRjaGFuZ2VkVmFsdWUgPSBjaGFuZ2VkVmFsdWVBbmRDb21tZW50LnN1YnN0cigwLCBjb21tZW50SW5kZXgpLnRyaW0oKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y2hhbmdlZFZhbHVlID0gY2hhbmdlZFZhbHVlQW5kQ29tbWVudDtcclxuXHR9XHJcblx0cmV0dXJuICBjaGFuZ2VkVmFsdWU7XHJcbn1cclxuXHJcbi8vIHBhcnNlVGVtcGxhdGVUYWdcclxuZnVuY3Rpb24gIHBhcnNlVGVtcGxhdGVUYWcobGluZTogc3RyaW5nKTogVGVtcGxhdGVUYWcge1xyXG5cdGNvbnN0ICB0YWcgPSBuZXcgVGVtcGxhdGVUYWcoKTtcclxuXHJcblx0dGFnLmxhYmVsID0gdGVtcGxhdGVMYWJlbDtcclxuXHR0YWcuaW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YodGVtcGxhdGVMYWJlbCk7XHJcblx0aWYgKHRhZy5pbmRleEluTGluZSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5sYWJlbCA9IGZpbGVUZW1wbGF0ZUxhYmVsO1xyXG5cdFx0dGFnLmluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKGZpbGVUZW1wbGF0ZUxhYmVsKTtcclxuXHR9XHJcblx0aWYgKHRhZy5pbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5pc0ZvdW5kID0gdHJ1ZTtcclxuXHRcdGNvbnN0ICBsZWZ0T2ZUZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKDAsIHRhZy5pbmRleEluTGluZSkudHJpbSgpO1xyXG5cdFx0aWYgKHRhZy5sYWJlbCA9PT0gZmlsZVRlbXBsYXRlTGFiZWwpIHtcclxuXHRcdFx0dGFnLm9uRmlsZVRlbXBsYXRlVGFnUmVhZGluZyhsaW5lKTtcclxuXHRcdH1cclxuXHJcblx0XHR0YWcudGVtcGxhdGUgPSBsaW5lLnN1YnN0cih0YWcuaW5kZXhJbkxpbmUgKyB0YWcubGFiZWwubGVuZ3RoKS50cmltKCk7XHJcblx0XHRpZiAobGVmdE9mVGVtcGxhdGUgPT09ICcnKSB7XHJcblx0XHRcdHRhZy5saW5lTnVtT2Zmc2V0ID0gLTE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YWcubGluZU51bU9mZnNldCA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHRhZztcclxuXHR9XHJcblxyXG5cdHRhZy5sYWJlbCA9IHRlbXBsYXRlQXRTdGFydExhYmVsO1xyXG5cdHRhZy5zdGFydEluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKHRlbXBsYXRlQXRTdGFydExhYmVsKTtcclxuXHRpZiAodGFnLnN0YXJ0SW5kZXhJbkxpbmUgIT09IG5vdEZvdW5kKSB7XHJcblx0XHR0YWcuaXNGb3VuZCA9IHRydWU7XHJcblx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgPSAgbGluZS5pbmRleE9mKHRlbXBsYXRlQXRFbmRMYWJlbCwgdGFnLnN0YXJ0SW5kZXhJbkxpbmUpO1xyXG5cdFx0aWYgKHRhZy5lbmRJbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRcdHRhZy50ZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKHRhZy5lbmRJbmRleEluTGluZSArIHRlbXBsYXRlQXRFbmRMYWJlbC5sZW5ndGgpLnRyaW0oKTtcclxuXHRcdFx0dGFnLmxpbmVOdW1PZmZzZXQgPSBwYXJzZUludChsaW5lLnN1YnN0cmluZyhcclxuXHRcdFx0XHR0YWcuc3RhcnRJbmRleEluTGluZSArIHRlbXBsYXRlQXRTdGFydExhYmVsLmxlbmd0aCxcclxuXHRcdFx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgKSk7XHJcblx0XHRcdHJldHVybiAgdGFnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGFnLmxhYmVsID0gJyc7XHJcblx0dGFnLnRlbXBsYXRlID0gJyc7XHJcblx0dGFnLmxpbmVOdW1PZmZzZXQgPSAwO1xyXG5cdHJldHVybiAgdGFnO1xyXG59XHJcblxyXG4vLyBUZW1wbGF0ZVRhZ1xyXG5jbGFzcyAgVGVtcGxhdGVUYWcge1xyXG5cdGxhYmVsID0gJyc7XHJcblx0dGVtcGxhdGUgPSAnJztcclxuXHRpc0ZvdW5kID0gZmFsc2U7XHJcblxyXG5cdC8vIHRlbXBsYXRlIHRhZ1xyXG5cdGluZGV4SW5MaW5lID0gbm90Rm91bmQ7XHJcblxyXG5cdC8vIHRlbXBsYXRlLWF0IHRhZ1xyXG5cdGxpbmVOdW1PZmZzZXQgPSAwOyAgXHJcblx0c3RhcnRJbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cdGVuZEluZGV4SW5MaW5lID0gbm90Rm91bmQ7XHJcblxyXG5cdC8vIGZvciBmaWxlLXRlbXBsYXRlIHRhZ1xyXG5cdHRlbXBsYXRlTGluZXM6IHN0cmluZ1tdID0gW107XHJcblx0aW5kZW50QXRUYWcgPSAnJztcclxuXHRtaW5JbmRlbnRMZW5ndGggPSAwO1xyXG5cclxuXHRvbkZpbGVUZW1wbGF0ZVRhZ1JlYWRpbmcobGluZTogc3RyaW5nKSB7XHJcblx0XHR0aGlzLmluZGVudEF0VGFnID0gaW5kZW50UmVndWxhckV4cHJlc3Npb24uZXhlYyhsaW5lKSFbMF07XHJcblx0XHR0aGlzLm1pbkluZGVudExlbmd0aCA9IG1heE51bWJlcjtcclxuXHR9XHJcblx0b25SZWFkTGluZShsaW5lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGNvbnN0ICBjdXJyZW50SW5kZW50ID0gaW5kZW50UmVndWxhckV4cHJlc3Npb24uZXhlYyhsaW5lKSFbMF07XHJcblx0XHRsZXQgIHJlYWRpbmdOZXh0ID0gdHJ1ZTtcclxuXHRcdGlmIChjdXJyZW50SW5kZW50Lmxlbmd0aCA+IHRoaXMuaW5kZW50QXRUYWcubGVuZ3RoICAmJiAgbGluZS5zdGFydHNXaXRoKHRoaXMuaW5kZW50QXRUYWcpKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlTGluZXMucHVzaChsaW5lLnN1YnN0cih0aGlzLmluZGVudEF0VGFnLmxlbmd0aCkpO1xyXG5cdFx0XHR0aGlzLm1pbkluZGVudExlbmd0aCA9IE1hdGgubWluKHRoaXMubWluSW5kZW50TGVuZ3RoLCBjdXJyZW50SW5kZW50Lmxlbmd0aCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnRlbXBsYXRlTGluZXMgPSB0aGlzLnRlbXBsYXRlTGluZXMubWFwKChsaW5lKT0+KFxyXG5cdFx0XHRcdGxpbmUuc3Vic3RyKHRoaXMubWluSW5kZW50TGVuZ3RoKSkpO1xyXG5cdFx0XHRyZWFkaW5nTmV4dCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICByZWFkaW5nTmV4dDtcclxuXHR9XHJcblx0YXN5bmMgIGNoZWNrVGFyZ2V0Q29udGVudHMoc2V0dGluZzogU2V0dGluZ3MsIGlucHV0RmlsZVBhdGg6IHN0cmluZywgdGVtcGxhdGVFbmRMaW5lTnVtOiBudW1iZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcclxuXHRcdGNvbnN0ICBwYXJlbnRQYXRoID0gcGF0aC5kaXJuYW1lKGlucHV0RmlsZVBhdGgpO1xyXG5cdFx0Y29uc3QgIHRhcmdldEZpbGVQYXRoID0gcGF0aC5qb2luKHBhcmVudFBhdGgsIGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0aGlzLnRlbXBsYXRlKSk7XHJcblx0XHRpZiAoIWZzLmV4aXN0c1N5bmModGFyZ2V0RmlsZVBhdGgpKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgRXJyb3I6ICR7dHJhbnNsYXRlKCdOb3RGb3VuZCcpfTogJHt0YXJnZXRGaWxlUGF0aH1gKTtcclxuXHRcdFx0cmV0dXJuICBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGNvbnN0ICB0YXJnZXRGaWxlUmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGFyZ2V0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGlmICh0aGlzLnRlbXBsYXRlTGluZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHJldHVybiAgZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCAgZXhwZWN0ZWRGaXJzdExpbmUgPSBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZShzZXR0aW5nLCB0aGlzLnRlbXBsYXRlTGluZXNbMF0pO1xyXG5cdFx0bGV0ICB0ZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRsZXQgIHRhcmdldExpbmVOdW0gPSAwO1xyXG5cdFx0bGV0ICBlcnJvclRlbXBsYXRlTGluZUluZGV4ID0gMDtcclxuXHRcdGxldCAgZXJyb3JUYXJnZXRMaW5lTnVtID0gMDtcclxuXHRcdGxldCAgZXJyb3JDb250ZW50cyA9ICcnO1xyXG5cdFx0bGV0ICBlcnJvckV4cGVjdGVkID0gJyc7XHJcblx0XHRsZXQgIGVycm9yVGVtcGxhdGUgPSAnJztcclxuXHRcdGxldCAgaW5kZW50ID0gJyc7XHJcblx0XHRsZXQgIHNhbWUgPSBmYWxzZTtcclxuXHJcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHRhcmdldEZpbGVSZWFkZXIpIHtcclxuXHRcdFx0Y29uc3QgIHRhcmdldExpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0XHR0YXJnZXRMaW5lTnVtICs9IDE7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZUxpbmVJbmRleCA9PT0gMCkge1xyXG5cclxuXHRcdFx0XHRjb25zdCAgaW5kZW50TGVuZ3RoID0gdGFyZ2V0TGluZS5pbmRleE9mKGV4cGVjdGVkRmlyc3RMaW5lKTtcclxuXHRcdFx0XHRpZiAoaW5kZW50TGVuZ3RoID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0c2FtZSA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzYW1lID0gdHJ1ZTtcclxuXHRcdFx0XHRcdGluZGVudCA9IHRhcmdldExpbmUuc3Vic3RyKDAsIGluZGVudExlbmd0aCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgeyAvLyBsaW5lSW5kZXggPj0gMVxyXG5cdFx0XHRcdGNvbnN0ICBleHBlY3RlZCA9IGdldEV4cGVjdGVkTGluZUluRmlsZVRlbXBsYXRlKFxyXG5cdFx0XHRcdFx0c2V0dGluZywgdGhpcy50ZW1wbGF0ZUxpbmVzW3RlbXBsYXRlTGluZUluZGV4XSk7XHJcblxyXG5cdFx0XHRcdHNhbWUgPSAodGFyZ2V0TGluZSA9PT0gaW5kZW50ICsgZXhwZWN0ZWQpO1xyXG5cdFx0XHRcdGlmICghc2FtZSkge1xyXG5cdFx0XHRcdFx0ZXJyb3JUZW1wbGF0ZUxpbmVJbmRleCA9IHRlbXBsYXRlTGluZUluZGV4O1xyXG5cdFx0XHRcdFx0ZXJyb3JUYXJnZXRMaW5lTnVtID0gdGFyZ2V0TGluZU51bTtcclxuXHRcdFx0XHRcdGVycm9yQ29udGVudHMgPSB0YXJnZXRMaW5lO1xyXG5cdFx0XHRcdFx0ZXJyb3JFeHBlY3RlZCA9IGluZGVudCArIGV4cGVjdGVkO1xyXG5cdFx0XHRcdFx0ZXJyb3JUZW1wbGF0ZSA9IGluZGVudCArIHRoaXMudGVtcGxhdGVMaW5lc1t0ZW1wbGF0ZUxpbmVJbmRleF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzYW1lKSB7XHJcblx0XHRcdFx0dGVtcGxhdGVMaW5lSW5kZXggKz0gMTtcclxuXHRcdFx0XHRpZiAodGVtcGxhdGVMaW5lSW5kZXggPj0gdGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRlbXBsYXRlTGluZUluZGV4ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCFzYW1lKSB7XHJcblx0XHRcdGNvbnN0ICB0ZW1wbGF0ZUxpbmVOdW0gPSB0ZW1wbGF0ZUVuZExpbmVOdW0gLSB0aGlzLnRlbXBsYXRlTGluZXMubGVuZ3RoICsgZXJyb3JUZW1wbGF0ZUxpbmVJbmRleDtcclxuXHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JGaWxlJyl9OiAke2dldFRlc3RhYmxlKHRhcmdldEZpbGVQYXRoKX06JHtlcnJvclRhcmdldExpbmVOdW19YCk7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgndHlwcm1GaWxlJyl9OiAke2dldFRlc3RhYmxlKGlucHV0RmlsZVBhdGgpfToke3RlbXBsYXRlTGluZU51bX1gKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYCAgQ29udGVudHM6ICR7ZXJyb3JDb250ZW50c31gKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYCAgRXhwZWN0ZWQ6ICR7ZXJyb3JFeHBlY3RlZH1gKTtcclxuXHRcdFx0Y29uc29sZS5sb2coYCAgVGVtcGxhdGU6ICR7ZXJyb3JUZW1wbGF0ZX1gKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAgc2FtZTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uXHJcbmZ1bmN0aW9uICBlc2NhcGVSZWd1bGFyRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcpIHtcclxuXHRyZXR1cm4gIGV4cHJlc3Npb24ucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKTtcclxufVxyXG5cclxuLy8gU3RhbmRhcmRJbnB1dEJ1ZmZlclxyXG5jbGFzcyAgU3RhbmRhcmRJbnB1dEJ1ZmZlciB7XHJcblx0cmVhZGxpbmVzOiByZWFkbGluZS5JbnRlcmZhY2U7XHJcblx0aW5wdXRCdWZmZXI6IHN0cmluZ1tdID0gW107XHJcblx0aW5wdXRSZXNvbHZlcj86IChhbnN3ZXI6c3RyaW5nKT0+dm9pZCA9IHVuZGVmaW5lZDtcclxuXHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLnJlYWRsaW5lcyA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBwcm9jZXNzLnN0ZGluLFxyXG5cdFx0XHRvdXRwdXQ6IHByb2Nlc3Muc3Rkb3V0XHJcblx0XHR9KTtcclxuXHRcdHRoaXMucmVhZGxpbmVzLm9uKCdsaW5lJywgYXN5bmMgKGxpbmU6IHN0cmluZykgPT4ge1xyXG5cdFx0XHRpZiAodGhpcy5pbnB1dFJlc29sdmVyKSB7XHJcblx0XHRcdFx0dGhpcy5pbnB1dFJlc29sdmVyKGxpbmUpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlciA9IHVuZGVmaW5lZDtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLmlucHV0QnVmZmVyLnB1c2gobGluZSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHRoaXMucmVhZGxpbmVzLnNldFByb21wdCgnJyk7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5wcm9tcHQoKTtcclxuXHR9XHJcblxyXG5cdGFzeW5jICBpbnB1dChndWlkZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHRcdHJldHVybiAgbmV3IFByb21pc2UoXHJcblx0XHRcdChyZXNvbHZlOiAoYW5zd2VyOnN0cmluZyk9PnZvaWQsICByZWplY3Q6IChhbnN3ZXI6c3RyaW5nKT0+dm9pZCApID0+XHJcblx0XHR7XHJcblx0XHRcdGNvbnN0ICBuZXh0TGluZSA9IHRoaXMuaW5wdXRCdWZmZXIuc2hpZnQoKTtcclxuXHRcdFx0aWYgKG5leHRMaW5lKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coZ3VpZGUgKyBuZXh0TGluZSk7XHJcblx0XHRcdFx0cmVzb2x2ZShuZXh0TGluZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cHJvY2Vzcy5zdGRvdXQud3JpdGUoZ3VpZGUpO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlciA9IHJlc29sdmU7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Y2xvc2UoKSB7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5jbG9zZSgpO1xyXG5cdH1cclxufVxyXG5cclxuLy8gSW5wdXRPcHRpb25cclxuY2xhc3MgSW5wdXRPcHRpb24ge1xyXG5cdGlucHV0TGluZXM6IHN0cmluZ1tdO1xyXG5cdG5leHRMaW5lSW5kZXg6IG51bWJlcjtcclxuXHRuZXh0UGFyYW1ldGVySW5kZXg6IG51bWJlcjsgIC8vIFRoZSBpbmRleCBvZiB0aGUgc3RhcnRpbmcgcHJvY2VzcyBwYXJhbWV0ZXJzXHJcblxyXG5cdGNvbnN0cnVjdG9yKGlucHV0TGluZXM6IHN0cmluZ1tdKSB7XHJcblx0XHR0aGlzLmlucHV0TGluZXMgPSBpbnB1dExpbmVzO1xyXG5cdFx0dGhpcy5uZXh0TGluZUluZGV4ID0gMDtcclxuXHRcdHRoaXMubmV4dFBhcmFtZXRlckluZGV4ID0gMjtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0ICB0ZXN0QmFzZUZvbGRlciA9IFN0cmluZy5yYXcgYFI6XFxob21lXFxtZW1fY2FjaGVcXE15RG9jXFxzcmNcXFR5cGVTY3JpcHRcXHR5cHJtXFx0ZXN0X2RhdGFgKydcXFxcJztcclxuXHJcbi8vIGlucHV0T3B0aW9uXHJcbmNvbnN0IGlucHV0T3B0aW9uID0gbmV3IElucHV0T3B0aW9uKFtcclxuLypcclxuXHR0ZXN0QmFzZUZvbGRlciArYGNoYW5nZV9zZXRfLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYGZpbGVgLFxyXG5cdHRlc3RCYXNlRm9sZGVyICtgY2hhbmdlX3NldF9zZXR0aW5nLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYENoYW5nZWRgLFxyXG4qL1xyXG5dKTtcclxuXHJcbi8vIGlucHV0XHJcbi8vIEV4YW1wbGU6IGNvbnN0IG5hbWUgPSBhd2FpdCBpbnB1dCgnV2hhdCBpcyB5b3VyIG5hbWU/ICcpO1xyXG5hc3luYyBmdW5jdGlvbiAgaW5wdXQoIGd1aWRlOiBzdHJpbmcgKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHQvLyBJbnB1dCBlbXVsYXRpb25cclxuXHRpZiAoaW5wdXRPcHRpb24uaW5wdXRMaW5lcykge1xyXG5cdFx0aWYgKGlucHV0T3B0aW9uLm5leHRMaW5lSW5kZXggPCBpbnB1dE9wdGlvbi5pbnB1dExpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCAgdmFsdWUgPSBpbnB1dE9wdGlvbi5pbnB1dExpbmVzW2lucHV0T3B0aW9uLm5leHRMaW5lSW5kZXhdO1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4ICs9IDE7XHJcblx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgdmFsdWUpO1xyXG5cclxuXHRcdFx0cmV0dXJuICB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIFJlYWQgdGhlIHN0YXJ0aW5nIHByb2Nlc3MgcGFyYW1ldGVyc1xyXG5cdHdoaWxlIChpbnB1dE9wdGlvbi5uZXh0UGFyYW1ldGVySW5kZXggPCBwcm9jZXNzLmFyZ3YubGVuZ3RoKSB7XHJcblx0XHRjb25zdCAgdmFsdWUgPSBwcm9jZXNzLmFyZ3ZbaW5wdXRPcHRpb24ubmV4dFBhcmFtZXRlckluZGV4XTtcclxuXHRcdGlucHV0T3B0aW9uLm5leHRQYXJhbWV0ZXJJbmRleCArPSAxO1xyXG5cdFx0aWYgKHZhbHVlLnN1YnN0cigwLDEpICE9PSAnLScpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZ3VpZGUgKyB2YWx1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHZhbHVlICE9PSAnLS10ZXN0Jykge1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0UGFyYW1ldGVySW5kZXggKz0gMTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGlucHV0XHJcblx0cmV0dXJuICBJbnB1dE9iamVjdC5pbnB1dChndWlkZSk7XHJcbn1cclxuY29uc3QgIElucHV0T2JqZWN0ID0gbmV3IFN0YW5kYXJkSW5wdXRCdWZmZXIoKTtcclxuXHJcbi8vIGlucHV0UGF0aFxyXG4vLyBFeGFtcGxlOiBjb25zdCBuYW1lID0gYXdhaXQgaW5wdXQoJ1doYXQgaXMgeW91ciBuYW1lPyAnKTtcclxuYXN5bmMgZnVuY3Rpb24gIGlucHV0UGF0aCggZ3VpZGU6IHN0cmluZyApIHtcclxuXHRjb25zdCAga2V5ID0gYXdhaXQgaW5wdXQoZ3VpZGUpO1xyXG5cdHJldHVybiAgcGF0aFJlc29sdmUoa2V5KTtcclxufVxyXG5cclxuLy8gcGF0aFJlc29sdmVcclxuZnVuY3Rpb24gIHBhdGhSZXNvbHZlKHBhdGhfOiBzdHJpbmcpIHtcclxuXHJcblx0Ly8gJy9jL2hvbWUnIGZvcm1hdCB0byBjdXJyZW50IE9TIGZvcm1hdFxyXG5cdGlmIChwYXRoXy5sZW5ndGggPj0gMykge1xyXG5cdFx0aWYgKHBhdGhfWzBdID09PSAnLycgICYmICBwYXRoX1syXSA9PT0gJy8nKSB7XHJcblx0XHRcdHBhdGhfID0gcGF0aF9bMV0gKyc6JysgcGF0aF8uc3Vic3RyKDIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gQ2hhbmdlIHNlcGFyYXRvcnMgdG8gT1MgZm9ybWF0XHJcblx0cGF0aF8gPSBwYXRoLnJlc29sdmUocGF0aF8pO1xyXG5cclxuXHRyZXR1cm4gcGF0aF9cclxufVxyXG5cclxuLy8gU2V0dGluZ1xyXG50eXBlIFNldHRpbmdzID0ge1tuYW1lOiBzdHJpbmddOiBTZXR0aW5nfVxyXG5cclxuLy8gU2V0dGluZ1xyXG5jbGFzcyBTZXR0aW5nIHtcclxuXHR2YWx1ZTogc3RyaW5nID0gJyc7XHJcblx0bGluZU51bTogbnVtYmVyID0gMDtcclxuXHRpc1JlZmVyZW5jZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuLy8gU2VhcmNoS2V5d29yZFxyXG5jbGFzcyBTZWFyY2hLZXl3b3JkIHtcclxuXHRrZXl3b3JkOiBzdHJpbmcgPSAnJztcclxuXHRzdGFydExpbmVOdW06IG51bWJlciA9IDA7XHJcblx0ZGlyZWN0aW9uOiBEaXJlY3Rpb24gPSBEaXJlY3Rpb24uRm9sbG93aW5nO1xyXG59XHJcblxyXG4vLyBEaXJlY3Rpb25cclxuZW51bSBEaXJlY3Rpb24ge1xyXG5cdEFib3ZlID0gLTEsXHJcblx0Rm9sbG93aW5nID0gKzEsXHJcbn1cclxuXHJcbi8vIFdyaXRlQnVmZmVyXHJcbmNsYXNzICBXcml0ZUJ1ZmZlciB7XHJcblx0c3RyZWFtOiBmcy5Xcml0ZVN0cmVhbTtcclxuXHRsaW5lQnVmZmVyOiBzdHJpbmdbXTtcclxuXHJcblx0Y29uc3RydWN0b3Ioc3RyZWFtOiBmcy5Xcml0ZVN0cmVhbSkge1xyXG5cdFx0dGhpcy5zdHJlYW0gPSBzdHJlYW07XHJcblx0XHR0aGlzLmxpbmVCdWZmZXIgPSBbXTtcclxuXHR9XHJcblxyXG5cdGVuZCgpIHtcclxuXHRcdGZvciAoY29uc3QgbGluZSAgb2YgIHRoaXMubGluZUJ1ZmZlcikge1xyXG5cdFx0XHR0aGlzLnN0cmVhbS53cml0ZShsaW5lKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3RyZWFtLmVuZCgpO1xyXG4gICAgfVxyXG5cclxuXHRvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG5cdFx0dGhpcy5zdHJlYW0ub24oZXZlbnQsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHdyaXRlKGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5saW5lQnVmZmVyLnB1c2gobGluZSk7XHJcblx0fVxyXG5cclxuXHRyZXBsYWNlQWJvdmVMaW5lKHJlbGF0aXZlTGluZU51bTogbnVtYmVyLCBsaW5lOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMubGluZUJ1ZmZlclt0aGlzLmxpbmVCdWZmZXIubGVuZ3RoICsgcmVsYXRpdmVMaW5lTnVtXSA9IGxpbmU7XHJcblx0fVxyXG59XHJcblxyXG4vLyB0cmFuc2xhdGVcclxuLy8gZS5nLiB0cmFuc2xhdGUoJ2VuZ2xpc2gnKVxyXG4vLyBlLmcuIHRyYW5zbGF0ZWBwcmljZSA9ICR7cHJpY2V9YCAgLy8gLi4uIHRhZ2dlZFRlbXBsYXRlXHJcbmZ1bmN0aW9uICB0cmFuc2xhdGUoZW5nbGlzaExpdGVyYWxzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSB8IHN0cmluZywgIC4uLnZhbHVlczogYW55W10pOiBzdHJpbmcge1xyXG5cdGxldCAgICBkaWN0aW9uYXJ5OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblx0Y29uc3QgIHRhZ2dlZFRlbXBsYXRlID0gKHR5cGVvZihlbmdsaXNoTGl0ZXJhbHMpICE9PSAnc3RyaW5nJyk7XHJcblxyXG5cdGxldCAgZW5nbGlzaCA9IGVuZ2xpc2hMaXRlcmFscyBhcyBzdHJpbmc7XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRlbmdsaXNoID0gJyc7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRlbmdsaXNoICs9IGVuZ2xpc2hMaXRlcmFsc1tpXTtcclxuXHRcdFx0aWYgKGkgPCB2YWx1ZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0ZW5nbGlzaCArPSAnJHsnICsgU3RyaW5nKGkpICsnfSc7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZS5nLiBlbmdsaXNoID0gJ3ByaWNlID0gJHswfSdcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChsb2NhbGUgPT09ICdqYS1KUCcpIHtcclxuXHRcdGRpY3Rpb25hcnkgPSB7XHJcblx0XHRcdFwiWUFNTCBVVEYtOCBmaWxlIHBhdGg+XCI6IFwiWUFNTCBVVEYtOCDjg5XjgqHjgqTjg6sg44OR44K5PlwiLFxyXG5cdFx0XHRcIlRoaXMgaXMgYSBzZWNyZXQgdmFsdWUuXCI6IFwi44GT44KM44Gv56eY5a+G44Gu5YCk44Gn44GZ44CCXCIsXHJcblx0XHRcdFwiQ2hhbmdlIFxcXCIkezB9XFxcIiB0byBcXFwiJHsxfVxcXCIuXCI6IFwiXFxcIiR7MH1cXFwiIOOCkiBcXFwiJHsxfVxcXCIg44Gr5aSJ5pu044GX44Gm44GP44Gg44GV44GE44CCXCIsXHJcblx0XHRcdFwiUHJlc3MgRW50ZXIga2V5IHRvIHJldHJ5IGNoZWNraW5nLlwiOiBcIkVudGVyIOOCreODvOOCkuaKvOOBmeOBqOWGjeODgeOCp+ODg+OCr+OBl+OBvuOBmeOAglwiLFxyXG5cdFx0XHRcIlRoZSBsaW5lIG51bWJlciB0byBjaGFuZ2UgdGhlIHZhcmlhYmxlIHZhbHVlID5cIjogXCLlpInmm7TjgZnjgovlpInmlbDlgKTjgYzjgYLjgovooYznlarlj7cgPlwiLFxyXG5cdFx0XHRcIkVudGVyIG9ubHk6IGZpbmlzaCB0byBpbnB1dCBzZXR0aW5nXCI6IFwiRW50ZXIg44Gu44G/77ya6Kit5a6a44Gu5YWl5Yqb44KS57WC44KP44KLXCIsXHJcblx0XHRcdFwia2V5OiBuZXdfdmFsdWU+XCI6IFwi5aSJ5pWw5ZCNOiDmlrDjgZfjgYTlpInmlbDlgKQ+XCIsXHJcblx0XHRcdFwidGVtcGxhdGUgY291bnRcIjogXCLjg4bjg7Pjg5fjg6zjg7zjg4jjga7mlbBcIixcclxuXHRcdFx0XCJpbiBwcmV2aW91cyBjaGVja1wiOiBcIuWJjeWbnuOBruODgeOCp+ODg+OCr1wiLFxyXG5cdFx0XHRcIldhcm5pbmdcIjogXCLorablkYpcIixcclxuXHRcdFx0XCJFcnJvclwiOiBcIuOCqOODqeODvFwiLFxyXG5cdFx0XHRcIkVycm9yTGluZVwiOiBcIuOCqOODqeODvOihjFwiLFxyXG5cdFx0XHRcIlNvbHV0aW9uXCI6IFwi6Kej5rG65rOVXCIsXHJcblx0XHRcdFwiQ29udGVudHNcIjogXCLlhoXlrrlcIixcclxuXHRcdFx0XCJFeHBlY3RlZFwiOiBcIuacn+W+hVwiLFxyXG5cdFx0XHRcIlRlbXBsYXRlXCI6IFwi6Zub5b2iXCIsXHJcblx0XHRcdFwiV2FybmluZ0xpbmVcIjogXCLorablkYrooYxcIixcclxuXHRcdFx0XCJGb3VuZFwiOiBcIuimi+OBpOOBi+OBo+OBn+OCguOBrlwiLFxyXG5cdFx0XHRcIlNldHRpbmdJbmRleFwiOiBcIuioreWumueVquWPt1wiLFxyXG5cdFx0XHRcIk5vdCBmb3VuZCBhbnkgcmVwbGFjaW5nIHRhcmdldFwiOiBcIue9ruOBjeaPm+OBiOOCi+WvvuixoeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIlNldCBvbGQgdmFsdWUgYXQgc2V0dGluZ3MgaW4gdGhlIHJlcGxhY2luZyBmaWxlXCI6IFwi572u44GN5o+b44GI44KL44OV44Kh44Kk44Or44Gu5Lit44Gu6Kit5a6a44Gr5Y+k44GE5YCk44KS6Kit5a6a44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwXCI6IFwi44OR44Op44Oh44O844K/44O844GvIDAg44KI44KK5bCP44GV44GP44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiTm90IGZvdW5kIFxcXCIkezB9XFxcIiBhYm92ZVwiOiBcIuS4iuaWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgZm91bmQgXFxcIiR7MH1cXFwiIGZvbGxvd2luZ1wiOiBcIuS4i+aWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgcmVmZXJlbmNlZDogJHswfSBpbiBsaW5lICR7MX1cIjogXCLlj4LnhafjgZXjgozjgabjgYTjgb7jgZvjgpPvvJogJHswfSDvvIgkezF96KGM55uu77yJXCIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHRsZXQgIHRyYW5zbGF0ZWQgPSBlbmdsaXNoO1xyXG5cdGlmIChkaWN0aW9uYXJ5KSB7XHJcblx0XHRpZiAoZW5nbGlzaCBpbiBkaWN0aW9uYXJ5KSB7XHJcblxyXG5cdFx0XHR0cmFuc2xhdGVkID0gZGljdGlvbmFyeVtlbmdsaXNoXTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJHsnK1N0cmluZyhpKSsnfScsIFN0cmluZyh2YWx1ZXNbaV0pICk7XHJcblx0XHR9XHJcblx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJFxcXFx7JywgJyR7JyApO1xyXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBlc2NhcGUgb2YgJHtufVxyXG5cdFx0XHQvLyBlLmcuIFwiJFxcXFx7cHJpY2V9ID0gJHtwcmljZX1cIiA9PiBcIiR7cHJpY2V9ID0gMTAwXCJcclxuXHR9XHJcblx0cmV0dXJuICB0cmFuc2xhdGVkO1xyXG59XHJcblxyXG5jb25zdCAgaW5kZW50UmVndWxhckV4cHJlc3Npb24gPSAvXiggfMKldCkqLztcclxuY29uc3QgIG1pbkxpbmVOdW0gPSAwO1xyXG5jb25zdCAgbWF4TGluZU51bSA9IDk5OTk5OTk5OTtcclxuY29uc3QgIG1heE51bWJlciA9IDk5OTk5OTk5OTtcclxuY29uc3QgIGZvdW5kRm9yQWJvdmUgPSBtaW5MaW5lTnVtO1xyXG5jb25zdCAgZm91bmRGb3JGb2xsb3dpbmcgPSBtYXhMaW5lTnVtO1xyXG5jb25zdCAgbm90Rm91bmQgPSAtMTtcclxuY29uc3QgIGFsbFNldHRpbmcgPSAwO1xyXG5jb25zdCAgbm9TZXBhcmF0b3IgPSAtMTtcclxubGV0ICAgIGxvY2FsZTogc3RyaW5nO1xyXG5jb25zdCAgcHJvZ3JhbU9wdGlvbnMgPSBwcm9ncmFtLm9wdHMoKTtcclxuZnVuY3Rpb24gIGV4aXRGcm9tQ29tbWFuZGVyKGU6IENvbW1hbmRlckVycm9yKSB7XHJcblx0Y29uc29sZS5sb2coZS5tZXNzYWdlKTtcclxufVxyXG5mdW5jdGlvbiAgZ2V0VGVzdGFibGUocGF0aDogc3RyaW5nKSB7XHJcblx0aWYgKHByb2dyYW1PcHRpb25zLnRlc3QpIHtcclxuXHRcdGlmIChwYXRoLnN0YXJ0c1dpdGgoaW5wdXRGaWxlUGFyZW50UGF0aCkpIHtcclxuXHRcdFx0cmV0dXJuICAnJHtpbnB1dEZpbGVQYXJlbnRQYXRofScgKyBwYXRoLnN1YnN0cihpbnB1dEZpbGVQYXJlbnRQYXRoLmxlbmd0aCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gIHBhdGg7XHJcblx0XHR9XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAgcGF0aDtcclxuXHR9XHJcbn1cclxubGV0ICBpbnB1dEZpbGVQYXJlbnRQYXRoID0gJyc7XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgY2FsbE1haW4oKSB7XHJcblx0cHJvZ3JhbS52ZXJzaW9uKCcwLjEuMScpLmV4aXRPdmVycmlkZShleGl0RnJvbUNvbW1hbmRlcilcclxuXHRcdC5vcHRpb24oXCItbCwgLS1sb2NhbGUgPHM+XCIpXHJcblx0XHQub3B0aW9uKFwiLXQsIC0tdGVzdFwiKVxyXG5cdFx0LnBhcnNlKHByb2Nlc3MuYXJndik7XHJcblx0XHJcblx0bG9jYWxlID0gSW50bC5OdW1iZXJGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS5sb2NhbGU7XHJcblx0aWYgKHByb2dyYW1PcHRpb25zLmxvY2FsZSkge1xyXG5cdFx0bG9jYWxlID0gcHJvZ3JhbU9wdGlvbnMubG9jYWxlO1xyXG5cdH1cclxuXHJcblx0YXdhaXQgIG1haW4oKVxyXG5cdFx0LmNhdGNoKCAoZSk9PntcclxuXHRcdFx0aWYgKHByb2dyYW1PcHRpb25zLnRlc3QpIHtcclxuXHRcdFx0XHR0aHJvdyBlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyggYEVSUk9SOiAke2UubWVzc2FnZX1gICk7XHJcblx0XHRcdFx0Y29uc3QgIHRpbWVPdmVyID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHR0aW1lT3Zlci5zZXRTZWNvbmRzKCB0aW1lT3Zlci5nZXRTZWNvbmRzKCkgKyA1ICk7XHJcblxyXG5cdFx0XHRcdHdoaWxlICgobmV3IERhdGUoKSkuZ2V0VGltZSgpIDwgdGltZU92ZXIuZ2V0VGltZSgpKSB7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LmZpbmFsbHkoKCk9PntcclxuXHRcdFx0SW5wdXRPYmplY3QuY2xvc2UoKTtcclxuXHRcdH0pO1xyXG59XHJcbmNhbGxNYWluKCk7XHJcbiJdfQ==