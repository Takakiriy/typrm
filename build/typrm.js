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
        var inputFilePath, parentPath, fileTemplateTag, previousTemplateCount, reader, isReadingSetting, setting, settingCount, previousLine, lineNum, templateCount, errorCount, warningCount, secretLabelCount, lines, keywords, reader_1, reader_1_1, line1, line, previousIsReadingSetting, separator, key, value, templateTag, checkingLine, expected, continue_, checkPassed, _i, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, reader_2, reader_2_1, line1, line, _c, keywords_1, keyword, e_2_1, _d, keywords_2, keyword, loop, key, lineNum_1, changingSettingIndex, keyValue, _e, _f, _g, key;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, inputPath(translate('YAML UTF-8 file path>'))];
                case 1:
                    inputFilePath = _h.sent();
                    parentPath = path.dirname(inputFilePath);
                    fileTemplateTag = null;
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
                    previousLine = '';
                    lineNum = 0;
                    templateCount = 0;
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
                    return [4 /*yield*/, fileTemplateTag.checkTargetContents(setting, parentPath)];
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
                    previousLine = line;
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
        var backUpFilePath, oldFilePath, newFilePath, writer, reader, lines, isReadingSetting, setting, settingCount, previousLine, changedValue, lineNum, errorCount, isChanging, reader_4, reader_4_1, line1, line, output, separator, key, value, commentIndex, comment, templateTag, checkingLine, expected, changed, before, after, aboveLine, e_4_1;
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
                    previousLine = '';
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
                    previousLine = line;
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
    TemplateTag.prototype.checkTargetContents = function (setting, parentPath) {
        var e_5, _a;
        return __awaiter(this, void 0, void 0, function () {
            var targetFilePath, targetFileReader, expectedFirstLine, templateLineIndex, targetLineNum, indent, same, targetFileReader_1, targetFileReader_1_1, line1, targetLine, indentLength, expected, e_5_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
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
                            console.log("");
                            console.log(translate('Error') + ":");
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
function callMain() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
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
                    return [4 /*yield*/, main()["catch"](function (e) { return __awaiter(_this, void 0, void 0, function () {
                            var timeOver;
                            return __generator(this, function (_a) {
                                if (programOptions.test) {
                                    throw e;
                                }
                                else {
                                    console.log("ERROR: " + e.message);
                                    timeOver = new Date();
                                    timeOver.setSeconds(timeOver.getSeconds() + 5);
                                    while ((new Date()).getTime() < timeOver.getTime()) {
                                    }
                                }
                                return [2 /*return*/];
                            });
                        }); })["finally"](function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVCQUF5QixDQUFDLGNBQWM7QUFDeEMsMkJBQTZCLENBQUUsNEJBQTRCO0FBQzNELHVDQUFvRDtBQUNwRCxtQ0FBcUM7QUFDckMsSUFBTyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDakMsSUFBTyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7QUFDekMsSUFBTyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLElBQU8sb0JBQW9CLEdBQUcsZUFBZSxDQUFDO0FBQzlDLElBQU8sa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQU8saUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7QUFDN0MsSUFBTyxlQUFlLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNoRSxJQUFPLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFDNUIsSUFBTyxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLElBQU8saUJBQWlCLEdBQUcsUUFBUSxDQUFDO0FBQ3BDLElBQU8sbUJBQW1CLEdBQUcsaUJBQWlCLENBQUM7QUFDL0MsSUFBTyxZQUFZLEdBQUcsNkNBQTZDLENBQUM7QUFFcEUsU0FBZ0IsSUFBSTs7Ozs7O3dCQUNJLHFCQUFNLFNBQVMsQ0FBRSxTQUFTLENBQUMsdUJBQXVCLENBQUMsQ0FBRSxFQUFBOztvQkFBckUsYUFBYSxHQUFHLFNBQXFEO29CQUNyRSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDM0MsZUFBZSxHQUF1QixJQUFJLENBQUM7b0JBQzNDLHFCQUFxQixHQUFHLENBQUMsQ0FBQzs7O29CQUV6QixNQUFNLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FB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QUFJLElBQUksRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFO3FDQUNuRDtpQ0FDRDs7OzZCQUNELENBQUMsQ0FDRCxTQUFPLENBQUEsQ0FBQzs0QkFDUixXQUFXLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQ3JCLENBQUMsQ0FBQyxFQUFBOztvQkFoQkgsU0FnQkcsQ0FBQzs7Ozs7Q0FDSjtBQUNELFFBQVEsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnOyAvLyBmaWxlIHN5c3RlbVxyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7ICAvLyBvciBwYXRoID0gcmVxdWlyZShcInBhdGhcIilcclxuaW1wb3J0IHsgcHJvZ3JhbSwgQ29tbWFuZGVyRXJyb3IgfSBmcm9tICdjb21tYW5kZXInO1xyXG5pbXBvcnQgKiBhcyByZWFkbGluZSBmcm9tICdyZWFkbGluZSc7XHJcbmNvbnN0ICBzZXR0aW5nU3RhcnRMYWJlbCA9IFwi6Kit5a6aOlwiO1xyXG5jb25zdCAgc2V0dGluZ1N0YXJ0TGFiZWxFbiA9IFwic2V0dGluZ3M6XCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUxhYmVsID0gXCIjdGVtcGxhdGU6XCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUF0U3RhcnRMYWJlbCA9IFwiI3RlbXBsYXRlLWF0KFwiO1xyXG5jb25zdCAgdGVtcGxhdGVBdEVuZExhYmVsID0gXCIpOlwiO1xyXG5jb25zdCAgZmlsZVRlbXBsYXRlTGFiZWwgPSBcIiNmaWxlLXRlbXBsYXRlOlwiO1xyXG5jb25zdCAgdGVtcG9yYXJ5TGFiZWxzID0gW1wiI+KYhU5vdzpcIiwgXCIjbm93OlwiLCBcIiPimIXmm7jjgY3jgYvjgZFcIiwgXCIj4piF5pyq56K66KqNXCJdO1xyXG5jb25zdCAgc2VjcmV0TGFiZWwgPSBcIiPimIXnp5jlr4ZcIjtcclxuY29uc3QgIHNlY3JldExhYmVsRW4gPSBcIiNzZWNyZXRcIjtcclxuY29uc3QgIHNlY3JldEV4YW1sZUxhYmVsID0gXCIj4piF56eY5a+GOuS7rlwiO1xyXG5jb25zdCAgc2VjcmV0RXhhbWxlTGFiZWxFbiA9IFwiI3NlY3JldDpleGFtcGxlXCI7XHJcbmNvbnN0ICByZWZlclBhdHRlcm4gPSAvKOS4iuiomHzkuIvoqJh8YWJvdmV8Zm9sbG93aW5nKSjjgIx8XFxbKShbXuOAjV0qKSjjgI18XFxdKS9nO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gIG1haW4oKSB7XHJcblx0Y29uc3QgIGlucHV0RmlsZVBhdGggPSBhd2FpdCBpbnB1dFBhdGgoIHRyYW5zbGF0ZSgnWUFNTCBVVEYtOCBmaWxlIHBhdGg+JykgKTtcclxuXHRjb25zdCAgcGFyZW50UGF0aCA9IHBhdGguZGlybmFtZShpbnB1dEZpbGVQYXRoKTtcclxuXHRsZXQgIGZpbGVUZW1wbGF0ZVRhZzogVGVtcGxhdGVUYWcgfCBudWxsID0gbnVsbDtcclxuXHRsZXQgIHByZXZpb3VzVGVtcGxhdGVDb3VudCA9IDA7XHJcblx0Zm9yKDs7KSB7XHJcblx0XHRsZXQgIHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGxldCAgaXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0bGV0ICBzZXR0aW5nOiBTZXR0aW5ncyA9IHt9O1xyXG5cdFx0bGV0ICBzZXR0aW5nQ291bnQgPSAwO1xyXG5cdFx0bGV0ICBwcmV2aW91c0xpbmUgPSAnJztcclxuXHRcdGxldCAgbGluZU51bSA9IDA7XHJcblx0XHRsZXQgIHRlbXBsYXRlQ291bnQgPSAwO1xyXG5cdFx0bGV0ICBlcnJvckNvdW50ID0gMDtcclxuXHRcdGxldCAgd2FybmluZ0NvdW50ID0gMDtcclxuXHRcdGxldCAgc2VjcmV0TGFiZWxDb3VudCA9IDA7XHJcblx0XHRjb25zdCAgbGluZXMgPSBbXTtcclxuXHRcdGNvbnN0ICBrZXl3b3JkczogU2VhcmNoS2V5d29yZFtdID0gW107XHJcblxyXG5cdFx0Zm9yIGF3YWl0IChjb25zdCBsaW5lMSBvZiByZWFkZXIpIHtcclxuXHRcdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0XHRsaW5lcy5wdXNoKGxpbmUpO1xyXG5cdFx0XHRsaW5lTnVtICs9IDE7XHJcblx0XHRcdGNvbnN0ICBwcmV2aW91c0lzUmVhZGluZ1NldHRpbmcgPSBpc1JlYWRpbmdTZXR0aW5nO1xyXG5cclxuXHRcdFx0Ly8gc2V0dGluZyA9IC4uLlxyXG5cdFx0XHRpZiAobGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsICB8fCAgbGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0XHRpZiAoc2V0dGluZ0NvdW50ID49IDEpIHtcclxuXHRcdFx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlzRW5kT2ZTZXR0aW5nKGxpbmUsIGlzUmVhZGluZ1NldHRpbmcpKSB7XHJcblx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRcdFx0Y29uc3QgIHNlcGFyYXRvciA9IGxpbmUuaW5kZXhPZignOicpO1xyXG5cdFx0XHRcdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5ID0gbGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShsaW5lLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0dGluZ1trZXldID0ge3ZhbHVlLCBpc1JlZmVyZW5jZWQ6IGZhbHNlLCBsaW5lTnVtfTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbCAgJiYgIGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiBcInByZXZpb3VzTGluZVwiIGhhcyBcInRlbXBsYXRlXCIgcmVwbGFjZWQgY29udGVudHMuXHJcblx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0ID49IDEgICYmICB0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke3RyYW5zbGF0ZSgnVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwJyl9YCk7XHJcblx0XHRcdFx0dGVtcGxhdGVUYWcuaXNGb3VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRlbXBsYXRlQ291bnQgKz0gMTtcclxuXHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUNvdW50ICs9IDE7XHJcblx0XHRcdFx0Y29uc3QgIGNoZWNraW5nTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoZXhwZWN0ZWQpID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldH1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtjaGVja2luZ0xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0V4cGVjdGVkJyl9OiAke2V4cGVjdGVkfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayB0YXJnZXQgZmlsZSBjb250ZW50cyBieSBcIiNmaWxlLXRlbXBsYXRlOlwiIHRhZy5cclxuXHRcdFx0aWYgKGZpbGVUZW1wbGF0ZVRhZykge1xyXG5cdFx0XHRcdGNvbnN0IGNvbnRpbnVlXyA9IGZpbGVUZW1wbGF0ZVRhZy5vblJlYWRMaW5lKGxpbmUpO1xyXG5cdFx0XHRcdGlmICghY29udGludWVfKSB7XHJcblxyXG5cdFx0XHRcdFx0Y29uc3QgIGNoZWNrUGFzc2VkID0gYXdhaXQgZmlsZVRlbXBsYXRlVGFnLmNoZWNrVGFyZ2V0Q29udGVudHMoc2V0dGluZywgcGFyZW50UGF0aCk7XHJcblx0XHRcdFx0XHRpZiAoIWNoZWNrUGFzc2VkKSB7XHJcblx0XHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZpbGVUZW1wbGF0ZVRhZyA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5sYWJlbCA9PT0gZmlsZVRlbXBsYXRlTGFiZWwpIHtcclxuXHRcdFx0XHRmaWxlVGVtcGxhdGVUYWcgPSB0ZW1wbGF0ZVRhZztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgaXMgbm90IFwiI+KYhU5vdzpcIi5cclxuXHRcdFx0Zm9yIChsZXQgdGVtcG9yYXJ5TGFiZWwgb2YgdGVtcG9yYXJ5TGFiZWxzKSB7XHJcblx0XHRcdFx0aWYgKGxpbmUudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRlbXBvcmFyeUxhYmVsLnRvTG93ZXJDYXNlKCkpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1dhcm5pbmdMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnU2V0dGluZ0luZGV4Jyl9OiAke3NldHRpbmdDb3VudH1gKTtcclxuXHRcdFx0XHRcdHdhcm5pbmdDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgaXMgbm90IHNlY3JldCB0YWcuXHJcblx0XHRcdGlmIChsaW5lLmluZGV4T2YoIHNlY3JldExhYmVsICkgIT09IG5vdEZvdW5kICB8fCAgbGluZS5pbmRleE9mKCBzZWNyZXRMYWJlbEVuICkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZiggc2VjcmV0RXhhbWxlTGFiZWwgKSA9PT0gbm90Rm91bmQgICYmICBsaW5lLmluZGV4T2YoIHNlY3JldEV4YW1sZUxhYmVsRW4gKSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdGlmIChzZWNyZXRMYWJlbENvdW50ID09PSAwKSB7ICAvLyBCZWNhdXNlIHRoZXJlIHdpbGwgYmUgbWFueSBzZWNyZXQgZGF0YS5cclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnV2FybmluZ0xpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RoaXMgaXMgYSBzZWNyZXQgdmFsdWUuJyl9YCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcrIHRyYW5zbGF0ZWBDaGFuZ2UgXCIke3NlY3JldExhYmVsRW59XCIgdG8gXCIke3NlY3JldEV4YW1sZUxhYmVsRW59XCIuJ2ApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnKyB0cmFuc2xhdGVgQ2hhbmdlIFwiJHtzZWNyZXRMYWJlbH1cIiB0byBcIiR7c2VjcmV0RXhhbWxlTGFiZWx9XCIuJ2ApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnU2V0dGluZ0luZGV4Jyl9OiAke3NldHRpbmdDb3VudH1gKTtcclxuXHRcdFx0XHRcdFx0d2FybmluZ0NvdW50ICs9IDE7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzZWNyZXRMYWJlbENvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBHZXQgdGl0bGVzIGFib3ZlIG9yIGZvbGxvd2luZy5cclxuXHRcdFx0bGV0ICBtYXRjaDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcclxuXHRcdFx0cmVmZXJQYXR0ZXJuLmxhc3RJbmRleCA9IDA7XHJcblxyXG5cdFx0XHR3aGlsZSAoIChtYXRjaCA9IHJlZmVyUGF0dGVybi5leGVjKCBsaW5lICkpICE9PSBudWxsICkge1xyXG5cdFx0XHRcdGNvbnN0ICBrZXl3b3JkID0gbmV3IFNlYXJjaEtleXdvcmQoKTtcclxuXHRcdFx0XHRjb25zdCAgbGFiZWwgPSBtYXRjaFsxXTtcclxuXHRcdFx0XHRrZXl3b3JkLmtleXdvcmQgPSBtYXRjaFszXTtcclxuXHRcdFx0XHRpZiAobGFiZWwgPT09IFwi5LiK6KiYXCIgIHx8ICBsYWJlbCA9PT0gXCJhYm92ZVwiKSB7XHJcblx0XHRcdFx0XHRrZXl3b3JkLnN0YXJ0TGluZU51bSA9IGxpbmVOdW0gLSAxO1xyXG5cdFx0XHRcdFx0a2V5d29yZC5kaXJlY3Rpb24gPSBEaXJlY3Rpb24uQWJvdmU7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChsYWJlbCA9PT0gXCLkuIvoqJhcIiAgfHwgIGxhYmVsID09PSBcImZvbGxvd2luZ1wiKSB7XHJcblx0XHRcdFx0XHRrZXl3b3JkLnN0YXJ0TGluZU51bSA9IGxpbmVOdW0gKyAxO1xyXG5cdFx0XHRcdFx0a2V5d29yZC5kaXJlY3Rpb24gPSBEaXJlY3Rpb24uRm9sbG93aW5nO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRrZXl3b3Jkcy5wdXNoKGtleXdvcmQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwcmV2aW91c0xpbmUgPSBsaW5lO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHNldHRpbmdDb3VudCA+PSAxKSB7XHJcblx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIHRoZXJlIGlzIHRoZSB0aXRsZSBhYm92ZSBvciBmb2xsb3dpbmcuXHJcblx0XHRyZWFkZXIgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShpbnB1dEZpbGVQYXRoKSxcclxuXHRcdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdFx0fSk7XHJcblx0XHRsaW5lTnVtID0gMDtcclxuXHJcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRcdGxpbmVOdW0gKz0gMTtcclxuXHJcblx0XHRcdGZvciAoY29uc3Qga2V5d29yZCBvZiBrZXl3b3Jkcykge1xyXG5cdFx0XHRcdGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkFib3ZlKSB7XHJcblx0XHRcdFx0XHRpZiAobGluZU51bSA8PSBrZXl3b3JkLnN0YXJ0TGluZU51bSkge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKGxpbmUuaW5kZXhPZihrZXl3b3JkLmtleXdvcmQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gZm91bmRGb3JBYm92ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Gb2xsb3dpbmcpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5lTnVtID49IGtleXdvcmQuc3RhcnRMaW5lTnVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAobGluZS5pbmRleE9mKGtleXdvcmQua2V5d29yZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBmb3VuZEZvckZvbGxvd2luZztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIGtleXdvcmRzKSB7XHJcblx0XHRcdGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkFib3ZlKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuc3RhcnRMaW5lTnVtICE9PSBmb3VuZEZvckFib3ZlKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtrZXl3b3JkLnN0YXJ0TGluZU51bSArIDF9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnICsgdHJhbnNsYXRlYE5vdCBmb3VuZCBcIiR7a2V5d29yZC5rZXl3b3JkfVwiIGFib3ZlYCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uRm9sbG93aW5nKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuc3RhcnRMaW5lTnVtICE9PSBmb3VuZEZvckZvbGxvd2luZykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7a2V5d29yZC5zdGFydExpbmVOdW0gLSAxfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJyArIHRyYW5zbGF0ZWBOb3QgZm91bmQgXCIke2tleXdvcmQua2V5d29yZH1cIiBmb2xsb3dpbmdgKTtcclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBTaG93IHRoZSByZXN1bHRcclxuXHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnV2FybmluZycpfTogJHt3YXJuaW5nQ291bnR9LCAke3RyYW5zbGF0ZSgnRXJyb3InKX06ICR7ZXJyb3JDb3VudH1gKTtcclxuXHRcdGlmIChwcmV2aW91c1RlbXBsYXRlQ291bnQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCd0ZW1wbGF0ZSBjb3VudCcpfSA9ICR7cHJldmlvdXNUZW1wbGF0ZUNvdW50fSAoJHt0cmFuc2xhdGUoJ2luIHByZXZpb3VzIGNoZWNrJyl9KWApO1xyXG5cdFx0fVxyXG5cdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCd0ZW1wbGF0ZSBjb3VudCcpfSA9ICR7dGVtcGxhdGVDb3VudH1gKTtcclxuXHJcblx0XHQvLyBSZXNjYW4gb3IgY2hhbmdlIGEgdmFsdWVcclxuXHRcdGxldCAgbG9vcCA9IHRydWU7XHJcblx0XHR3aGlsZSAobG9vcCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGUoJ1ByZXNzIEVudGVyIGtleSB0byByZXRyeSBjaGVja2luZy4nKSk7XHJcblxyXG5cdFx0XHRjb25zdCAga2V5ID0gYXdhaXQgaW5wdXQodHJhbnNsYXRlKCdUaGUgbGluZSBudW1iZXIgdG8gY2hhbmdlIHRoZSB2YXJpYWJsZSB2YWx1ZSA+JykpO1xyXG5cdFx0XHRlcnJvckNvdW50ID0gMDtcclxuXHRcdFx0aWYgKGtleSA9PT0gJ2V4aXQnKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGtleSAhPT0gJycpIHtcclxuXHRcdFx0XHRjb25zdCAgbGluZU51bSA9IHBhcnNlSW50KGtleSk7XHJcblx0XHRcdFx0Y29uc3QgIGNoYW5naW5nU2V0dGluZ0luZGV4ID0gYXdhaXQgZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW0oaW5wdXRGaWxlUGF0aCwgbGluZU51bSk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7Y2hhbmdpbmdTZXR0aW5nSW5kZXh9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlKCdFbnRlciBvbmx5OiBmaW5pc2ggdG8gaW5wdXQgc2V0dGluZycpKTtcclxuXHRcdFx0XHRmb3IgKDs7KSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5VmFsdWUgPSBhd2FpdCBpbnB1dCh0cmFuc2xhdGUoJ2tleTogbmV3X3ZhbHVlPicpKTtcclxuXHRcdFx0XHRcdGlmIChrZXlWYWx1ZSA9PT0gJycpIHtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IGF3YWl0IGNoYW5nZVNldHRpbmdCeUtleVZhbHVlKGlucHV0RmlsZVBhdGgsIGNoYW5naW5nU2V0dGluZ0luZGV4LCBrZXlWYWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxvb3AgPSAoZXJyb3JDb3VudCA+PSAxKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZXNjYW5cclxuXHRcdGNvbnNvbGUubG9nKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XHJcblx0XHRwcmV2aW91c1RlbXBsYXRlQ291bnQgPSB0ZW1wbGF0ZUNvdW50XHJcblx0XHRmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhzZXR0aW5nKSkge1xyXG5cdFx0XHRzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBvbkVuZE9mU2V0dGluZ1xyXG5mdW5jdGlvbiBvbkVuZE9mU2V0dGluZyhzZXR0aW5nOiBTZXR0aW5ncykge1xyXG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRpZiAoIXNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2codHJhbnNsYXRlYE5vdCByZWZlcmVuY2VkOiAke2tleX0gaW4gbGluZSAke3NldHRpbmdba2V5XS5saW5lTnVtfWApO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy8gZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW1cclxuYXN5bmMgZnVuY3Rpb24gIGdldFNldHRpbmdJbmRleEZyb21MaW5lTnVtKGlucHV0RmlsZVBhdGg6IHN0cmluZywgdGFyZ2V0TGluZU51bTogbnVtYmVyKTogUHJvbWlzZTxudW1iZXI+IHtcclxuXHRjb25zdCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0Y3JsZkRlbGF5OiBJbmZpbml0eVxyXG5cdH0pO1xyXG5cdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRsZXQgIGxpbmVOdW0gPSAwO1xyXG5cclxuXHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0bGluZU51bSArPSAxO1xyXG5cclxuXHRcdGlmIChsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWwgIHx8ICBsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRzZXR0aW5nQ291bnQgKz0gMTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobGluZU51bSA9PT0gdGFyZ2V0TGluZU51bSkge1xyXG5cdFx0XHRyZXR1cm4gIHNldHRpbmdDb3VudDtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICAwO1xyXG59XHJcblxyXG4vLyBjaGFuZ2VTZXR0aW5nQnlLZXlWYWx1ZVxyXG5hc3luYyBmdW5jdGlvbiAgY2hhbmdlU2V0dGluZ0J5S2V5VmFsdWUoaW5wdXRGaWxlUGF0aDogc3RyaW5nLCBjaGFuZ2luZ1NldHRpbmdJbmRleDogbnVtYmVyLFxyXG5cdFx0a2V5VmFsdWU6IHN0cmluZyk6IFByb21pc2U8bnVtYmVyPi8qZXJyb3JDb3VudCovIHtcclxuXHJcblx0Y29uc3QgIHNlcGFyYXRvciA9IGtleVZhbHVlLmluZGV4T2YoJzonKTtcclxuXHRpZiAoc2VwYXJhdG9yICE9PSBub3RGb3VuZCkge1xyXG5cdFx0Y29uc3QgIGtleSA9IGtleVZhbHVlLnN1YnN0cigwLCBzZXBhcmF0b3IpLnRyaW0oKTtcclxuXHRcdGNvbnN0ICB2YWx1ZSA9IGdldFZhbHVlKGtleVZhbHVlLCBzZXBhcmF0b3IpO1xyXG5cclxuXHRcdHJldHVybiAgY2hhbmdlU2V0dGluZyhpbnB1dEZpbGVQYXRoLCBjaGFuZ2luZ1NldHRpbmdJbmRleCwga2V5LCB2YWx1ZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAgMTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGNoYW5nZVNldHRpbmdcclxuYXN5bmMgZnVuY3Rpb24gIGNoYW5nZVNldHRpbmcoaW5wdXRGaWxlUGF0aDogc3RyaW5nLCBjaGFuZ2luZ1NldHRpbmdJbmRleDogbnVtYmVyLFxyXG5cdFx0Y2hhbmdpbmdLZXk6IHN0cmluZywgY2hhbmdlZFZhbHVlQW5kQ29tbWVudDogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+LyplcnJvckNvdW50Ki8ge1xyXG5cclxuXHRjb25zdCAgYmFja1VwRmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoICtcIi5iYWNrdXBcIjtcclxuXHRpZiAoIWZzLmV4aXN0c1N5bmMoYmFja1VwRmlsZVBhdGgpKSB7XHJcblx0XHRmcy5jb3B5RmlsZVN5bmMoaW5wdXRGaWxlUGF0aCwgYmFja1VwRmlsZVBhdGgpO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgIG9sZEZpbGVQYXRoID0gaW5wdXRGaWxlUGF0aDtcclxuXHRjb25zdCAgbmV3RmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoICtcIi5uZXdcIjtcclxuXHRjb25zdCAgd3JpdGVyID0gbmV3IFdyaXRlQnVmZmVyKGZzLmNyZWF0ZVdyaXRlU3RyZWFtKG5ld0ZpbGVQYXRoKSk7XHJcblx0Y29uc3QgIHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRpbnB1dDogZnMuY3JlYXRlUmVhZFN0cmVhbShvbGRGaWxlUGF0aCksXHJcblx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0fSk7XHJcblx0Y29uc3QgIGxpbmVzID0gW107XHJcblx0bGV0ICBpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0bGV0ICBzZXR0aW5nOiBTZXR0aW5ncyA9IHt9O1xyXG5cdGxldCAgc2V0dGluZ0NvdW50ID0gMDtcclxuXHRsZXQgIHByZXZpb3VzTGluZSA9ICcnO1xyXG5cdGxldCAgY2hhbmdlZFZhbHVlID0gZ2V0Q2hhbmdlZFZhbHVlKGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQpO1xyXG5cdGxldCAgbGluZU51bSA9IDA7XHJcblx0bGV0ICBlcnJvckNvdW50ID0gMDtcclxuXHRsZXQgIGlzQ2hhbmdpbmcgPSBmYWxzZTtcclxuXHRcclxuXHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0Y29uc3QgIGxpbmU6IHN0cmluZyA9IGxpbmUxO1xyXG5cdFx0bGluZXMucHVzaChsaW5lKTtcclxuXHRcdGxpbmVOdW0gKz0gMTtcclxuXHRcdGxldCAgb3V0cHV0ID0gZmFsc2U7XHJcblxyXG5cdFx0Ly8gc2V0dGluZyA9IC4uLlxyXG5cdFx0aWYgKGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbCAgfHwgIGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbEVuKSB7XHJcblx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSB0cnVlO1xyXG5cdFx0XHRzZXR0aW5nID0ge307XHJcblx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0XHRpZiAoY2hhbmdpbmdTZXR0aW5nSW5kZXggPT09IGFsbFNldHRpbmcpIHtcclxuXHRcdFx0XHRpc0NoYW5naW5nID0gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpc0NoYW5naW5nID0gKHNldHRpbmdDb3VudCA9PT0gY2hhbmdpbmdTZXR0aW5nSW5kZXgpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKGlzRW5kT2ZTZXR0aW5nKGxpbmUsIGlzUmVhZGluZ1NldHRpbmcpKSB7XHJcblx0XHRcdGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmIChpc0NoYW5naW5nKSB7XHJcblxyXG5cdFx0XHRpZiAoaXNSZWFkaW5nU2V0dGluZykge1xyXG5cdFx0XHRcdGNvbnN0ICBzZXBhcmF0b3IgPSBsaW5lLmluZGV4T2YoJzonKTtcclxuXHRcdFx0XHRpZiAoc2VwYXJhdG9yICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgIGtleSA9IGxpbmUuc3Vic3RyKDAsIHNlcGFyYXRvcikudHJpbSgpO1xyXG5cdFx0XHRcdFx0Y29uc3QgIHZhbHVlID0gZ2V0VmFsdWUobGluZSwgc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdGlmICh2YWx1ZSAhPT0gJycpIHtcclxuXHJcblx0XHRcdFx0XHRcdHNldHRpbmdba2V5XSA9IHt2YWx1ZSwgaXNSZWZlcmVuY2VkOiBmYWxzZSwgbGluZU51bX07XHJcblx0XHRcdFx0XHR9IGVsc2UgaWYgKGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWwgICYmICBrZXkgKyAnOicgIT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGlmIChrZXkgPT09IGNoYW5naW5nS2V5KSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0ICBjb21tZW50SW5kZXggPSBsaW5lLmluZGV4T2YoJyMnLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0XHRsZXQgIGNvbW1lbnQ9ICcnO1xyXG5cdFx0XHRcdFx0XHRpZiAoY29tbWVudEluZGV4ICE9PSBub3RGb3VuZCAgJiYgIGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuaW5kZXhPZignIycpID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbW1lbnQgPSAnICAnICsgbGluZS5zdWJzdHIoY29tbWVudEluZGV4KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0d3JpdGVyLndyaXRlKGxpbmUuc3Vic3RyKDAsIHNlcGFyYXRvciArIDEpICsnICcrIGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQgKyBjb21tZW50ICsgXCJcXG5cIik7XHJcblx0XHRcdFx0XHRcdG91dHB1dCA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gT3V0IG9mIHNldHRpbmdzXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc3QgIHRlbXBsYXRlVGFnID0gcGFyc2VUZW1wbGF0ZVRhZyhsaW5lKTtcclxuXHRcdFx0XHRpZiAodGVtcGxhdGVUYWcuaXNGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc3QgIGNoZWNraW5nTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRcdGNvbnN0ICBleHBlY3RlZCA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZVRhZy50ZW1wbGF0ZSk7XHJcblx0XHRcdFx0XHRjb25zdCAgY2hhbmdlZCA9IGdldENoYW5nZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlVGFnLnRlbXBsYXRlLCBjaGFuZ2luZ0tleSwgY2hhbmdlZFZhbHVlKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoZXhwZWN0ZWQpICE9PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0XHRjb25zdCAgYmVmb3JlID0gZXhwZWN0ZWQ7XHJcblx0XHRcdFx0XHRcdGNvbnN0ICBhZnRlciA9IGNoYW5nZWQ7XHJcblx0XHRcdFx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0IDw9IC0xKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc3QgIGFib3ZlTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRcdFx0XHR3cml0ZXIucmVwbGFjZUFib3ZlTGluZSh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0LFxyXG5cdFx0XHRcdFx0XHRcdFx0YWJvdmVMaW5lLnJlcGxhY2UoYmVmb3JlLCBhZnRlcikrXCJcXG5cIik7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHdyaXRlci53cml0ZShsaW5lLnJlcGxhY2UoYmVmb3JlLCBhZnRlcikgK1wiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHRcdG91dHB1dCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoY2hhbmdlZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdC8vIERvIG5vdGhpbmdcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGlmIChlcnJvckNvdW50ID09PSAwKSB7IC8vIFNpbmNlIG9ubHkgb25lIG9sZCB2YWx1ZSBjYW4gYmUgcmVwbGFjZWQgYXQgYSB0aW1lXHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2xpbmVOdW19YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke3RyYW5zbGF0ZSgnTm90IGZvdW5kIGFueSByZXBsYWNpbmcgdGFyZ2V0Jyl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NvbHV0aW9uJyl9OiAke3RyYW5zbGF0ZSgnU2V0IG9sZCB2YWx1ZSBhdCBzZXR0aW5ncyBpbiB0aGUgcmVwbGFjaW5nIGZpbGUnKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0V4cGVjdGVkJyl9OiAke2V4cGVjdGVkLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnVGVtcGxhdGUnKX06ICR7dGVtcGxhdGVUYWcudGVtcGxhdGUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCFvdXRwdXQpIHtcclxuXHRcdFx0d3JpdGVyLndyaXRlKGxpbmUgK1wiXFxuXCIpO1xyXG5cdFx0fVxyXG5cdFx0cHJldmlvdXNMaW5lID0gbGluZTtcclxuXHR9XHJcblx0d3JpdGVyLmVuZCgpO1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZSggKHJlc29sdmUpID0+IHtcclxuXHRcdHdyaXRlci5vbignZmluaXNoJywgKCkgPT4ge1xyXG5cdFx0XHRmcy5jb3B5RmlsZVN5bmMobmV3RmlsZVBhdGgsIGlucHV0RmlsZVBhdGgpO1xyXG5cdFx0XHRkZWxldGVGaWxlKG5ld0ZpbGVQYXRoKTtcclxuXHRcdFx0cmVzb2x2ZShlcnJvckNvdW50KTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vLyBpc0VuZE9mU2V0dGluZ1xyXG5mdW5jdGlvbiAgaXNFbmRPZlNldHRpbmcobGluZTogc3RyaW5nLCBpc1JlYWRpbmdTZXR0aW5nOiBib29sZWFuKTogYm9vbGVhbiB7XHJcblx0bGV0ICByZXR1cm5WYWx1ZSA9IGZhbHNlO1xyXG5cdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRjb25zdCBjb21tZW50ID0gbGluZS5pbmRleE9mKCcjJyk7XHJcblx0XHRsZXQgbGVmdE9mQ29tbWVudDogc3RyaW5nO1xyXG5cdFx0aWYgKGNvbW1lbnQgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdGxlZnRPZkNvbW1lbnQgPSBsaW5lLnN1YnN0cigwLCBsaW5lLmluZGV4T2YoJyMnKSkudHJpbSgpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGxlZnRPZkNvbW1lbnQgPSBsaW5lLnRyaW0oKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAobGVmdE9mQ29tbWVudC5pbmRleE9mKCc6JykgPT09IG5vdEZvdW5kICAmJiAgbGVmdE9mQ29tbWVudCAhPT0gJycpIHtcclxuXHRcdFx0cmV0dXJuVmFsdWUgPSB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmIChsZWZ0T2ZDb21tZW50LnN1YnN0cigtMSkgPT09ICd8Jykge1xyXG5cdFx0XHRyZXR1cm5WYWx1ZSA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiAgcmV0dXJuVmFsdWU7XHJcbn1cclxuXHJcbi8vIGRlbGV0ZUZpbGVcclxuZnVuY3Rpb24gIGRlbGV0ZUZpbGUocGF0aDogc3RyaW5nKSB7XHJcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoKSkge1xyXG4gICAgICAgIGZzLnVubGlua1N5bmMocGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIGdldFZhbHVlXHJcbmZ1bmN0aW9uICBnZXRWYWx1ZShsaW5lOiBzdHJpbmcsIHNlcGFyYXRvckluZGV4OiBudW1iZXIpIHtcclxuXHRsZXQgICAgdmFsdWUgPSBsaW5lLnN1YnN0cihzZXBhcmF0b3JJbmRleCArIDEpLnRyaW0oKTtcclxuXHRjb25zdCAgY29tbWVudCA9IHZhbHVlLmluZGV4T2YoJyMnKTtcclxuXHRpZiAoY29tbWVudCAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyKDAsIGNvbW1lbnQpLnRyaW0oKTtcclxuXHR9XHJcblx0cmV0dXJuICB2YWx1ZTtcclxufVxyXG5cclxuLy8gZ2V0RXhwZWN0ZWRMaW5lXHJcbmZ1bmN0aW9uICBnZXRFeHBlY3RlZExpbmUoc2V0dGluZzogU2V0dGluZ3MsIHRlbXBsYXRlOiBzdHJpbmcpOiBzdHJpbmcge1xyXG5cdGxldCAgZXhwZWN0ZWQgPSB0ZW1wbGF0ZTtcclxuaWYgKCF0ZW1wbGF0ZSkge1xyXG5yZXR1cm4gdGVtcGxhdGU7XHJcbn1cclxuXHJcblx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZykpIHtcclxuXHRcdGNvbnN0ICByZSA9IG5ldyBSZWdFeHAoIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uKGtleSksIFwiZ2lcIiApO1xyXG5cclxuXHRcdGNvbnN0ICBleHBlY3RlZEFmdGVyID0gZXhwZWN0ZWQucmVwbGFjZShyZSwgc2V0dGluZ1trZXldLnZhbHVlKTtcclxuXHRcdGlmIChleHBlY3RlZEFmdGVyICE9PSBleHBlY3RlZCkge1xyXG5cdFx0XHRzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWRBZnRlcjtcclxuXHR9XHJcblx0cmV0dXJuICBleHBlY3RlZDtcclxufVxyXG5cclxuLy8gZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGVcclxuZnVuY3Rpb24gIGdldEV4cGVjdGVkTGluZUluRmlsZVRlbXBsYXRlKHNldHRpbmc6IFNldHRpbmdzLCB0ZW1wbGF0ZTogc3RyaW5nKSB7XHJcblxyXG5cdGxldCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGUpO1xyXG5cdGNvbnN0ICB0ZW1wbGF0ZUluZGV4ID0gZXhwZWN0ZWQuaW5kZXhPZih0ZW1wbGF0ZUxhYmVsKTtcclxuXHRpZiAodGVtcGxhdGVJbmRleCAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRleHBlY3RlZCA9IGV4cGVjdGVkLnN1YnN0cigwLCB0ZW1wbGF0ZUluZGV4KTtcclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWQudHJpbVJpZ2h0KCk7XHJcblx0fVxyXG5cdHJldHVybiAgZXhwZWN0ZWQ7XHJcbn1cclxuXHJcbi8vIGdldENoYW5nZWRMaW5lXHJcbmZ1bmN0aW9uICBnZXRDaGFuZ2VkTGluZShzZXR0aW5nOiBTZXR0aW5ncywgdGVtcGxhdGU6IHN0cmluZywgY2hhbmdpbmdLZXk6IHN0cmluZywgY2hhbmdlZFZhbHVlOiBzdHJpbmcpIHtcclxuXHRsZXQgIGNoYW5nZWRMaW5lID0gJyc7XHJcblx0aWYgKGNoYW5naW5nS2V5IGluIHNldHRpbmcpIHtcclxuXHRcdGNvbnN0ICBjaGFuZ2luZ1ZhbHVlID0gc2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWU7XHJcblxyXG5cdFx0c2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWUgPSBjaGFuZ2VkVmFsdWU7XHJcblxyXG5cdFx0Y2hhbmdlZExpbmUgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGUpO1xyXG5cdFx0c2V0dGluZ1tjaGFuZ2luZ0tleV0udmFsdWUgPSBjaGFuZ2luZ1ZhbHVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGFuZ2VkTGluZSA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0fVxyXG5cdHJldHVybiAgY2hhbmdlZExpbmU7XHJcbn1cclxuXHJcbi8vIGdldENoYW5nZWRWYWx1ZVxyXG5mdW5jdGlvbiAgZ2V0Q2hhbmdlZFZhbHVlKGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQ6IHN0cmluZyk6IHN0cmluZyB7XHJcblx0Y29uc3QgIGNvbW1lbnRJbmRleCA9IGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuaW5kZXhPZignIycpO1xyXG5cdGxldCAgY2hhbmdlZFZhbHVlOiBzdHJpbmc7XHJcblx0aWYgKGNvbW1lbnRJbmRleCAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRjaGFuZ2VkVmFsdWUgPSBjaGFuZ2VkVmFsdWVBbmRDb21tZW50LnN1YnN0cigwLCBjb21tZW50SW5kZXgpLnRyaW0oKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0Y2hhbmdlZFZhbHVlID0gY2hhbmdlZFZhbHVlQW5kQ29tbWVudDtcclxuXHR9XHJcblx0cmV0dXJuICBjaGFuZ2VkVmFsdWU7XHJcbn1cclxuXHJcbi8vIHBhcnNlVGVtcGxhdGVUYWdcclxuZnVuY3Rpb24gIHBhcnNlVGVtcGxhdGVUYWcobGluZTogc3RyaW5nKTogVGVtcGxhdGVUYWcge1xyXG5cdGNvbnN0ICB0YWcgPSBuZXcgVGVtcGxhdGVUYWcoKTtcclxuXHJcblx0dGFnLmxhYmVsID0gdGVtcGxhdGVMYWJlbDtcclxuXHR0YWcuaW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YodGVtcGxhdGVMYWJlbCk7XHJcblx0aWYgKHRhZy5pbmRleEluTGluZSA9PT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5sYWJlbCA9IGZpbGVUZW1wbGF0ZUxhYmVsO1xyXG5cdFx0dGFnLmluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKGZpbGVUZW1wbGF0ZUxhYmVsKTtcclxuXHR9XHJcblx0aWYgKHRhZy5pbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5pc0ZvdW5kID0gdHJ1ZTtcclxuXHRcdGNvbnN0ICBsZWZ0T2ZUZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKDAsIHRhZy5pbmRleEluTGluZSkudHJpbSgpO1xyXG5cdFx0aWYgKHRhZy5sYWJlbCA9PT0gZmlsZVRlbXBsYXRlTGFiZWwpIHtcclxuXHRcdFx0dGFnLm9uRmlsZVRlbXBsYXRlVGFnUmVhZGluZyhsaW5lKTtcclxuXHRcdH1cclxuXHJcblx0XHR0YWcudGVtcGxhdGUgPSBsaW5lLnN1YnN0cih0YWcuaW5kZXhJbkxpbmUgKyB0YWcubGFiZWwubGVuZ3RoKS50cmltKCk7XHJcblx0XHRpZiAobGVmdE9mVGVtcGxhdGUgPT09ICcnKSB7XHJcblx0XHRcdHRhZy5saW5lTnVtT2Zmc2V0ID0gLTE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YWcubGluZU51bU9mZnNldCA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHRhZztcclxuXHR9XHJcblxyXG5cdHRhZy5sYWJlbCA9IHRlbXBsYXRlQXRTdGFydExhYmVsO1xyXG5cdHRhZy5zdGFydEluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKHRlbXBsYXRlQXRTdGFydExhYmVsKTtcclxuXHRpZiAodGFnLnN0YXJ0SW5kZXhJbkxpbmUgIT09IG5vdEZvdW5kKSB7XHJcblx0XHR0YWcuaXNGb3VuZCA9IHRydWU7XHJcblx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgPSAgbGluZS5pbmRleE9mKHRlbXBsYXRlQXRFbmRMYWJlbCwgdGFnLnN0YXJ0SW5kZXhJbkxpbmUpO1xyXG5cdFx0aWYgKHRhZy5lbmRJbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRcdHRhZy50ZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKHRhZy5lbmRJbmRleEluTGluZSArIHRlbXBsYXRlQXRFbmRMYWJlbC5sZW5ndGgpLnRyaW0oKTtcclxuXHRcdFx0dGFnLmxpbmVOdW1PZmZzZXQgPSBwYXJzZUludChsaW5lLnN1YnN0cmluZyhcclxuXHRcdFx0XHR0YWcuc3RhcnRJbmRleEluTGluZSArIHRlbXBsYXRlQXRTdGFydExhYmVsLmxlbmd0aCxcclxuXHRcdFx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgKSk7XHJcblx0XHRcdHJldHVybiAgdGFnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGFnLmxhYmVsID0gJyc7XHJcblx0dGFnLnRlbXBsYXRlID0gJyc7XHJcblx0dGFnLmxpbmVOdW1PZmZzZXQgPSAwO1xyXG5cdHJldHVybiAgdGFnO1xyXG59XHJcblxyXG4vLyBUZW1wbGF0ZVRhZ1xyXG5jbGFzcyAgVGVtcGxhdGVUYWcge1xyXG5cdGxhYmVsID0gJyc7XHJcblx0dGVtcGxhdGUgPSAnJztcclxuXHRpc0ZvdW5kID0gZmFsc2U7XHJcblxyXG5cdC8vIHRlbXBsYXRlIHRhZ1xyXG5cdGluZGV4SW5MaW5lID0gbm90Rm91bmQ7XHJcblxyXG5cdC8vIHRlbXBsYXRlLWF0IHRhZ1xyXG5cdGxpbmVOdW1PZmZzZXQgPSAwOyAgXHJcblx0c3RhcnRJbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cdGVuZEluZGV4SW5MaW5lID0gbm90Rm91bmQ7XHJcblxyXG5cdC8vIGZvciBmaWxlLXRlbXBsYXRlIHRhZ1xyXG5cdHRlbXBsYXRlTGluZXM6IHN0cmluZ1tdID0gW107XHJcblx0aW5kZW50QXRUYWcgPSAnJztcclxuXHRtaW5JbmRlbnRMZW5ndGggPSAwO1xyXG5cclxuXHRvbkZpbGVUZW1wbGF0ZVRhZ1JlYWRpbmcobGluZTogc3RyaW5nKSB7XHJcblx0XHR0aGlzLmluZGVudEF0VGFnID0gaW5kZW50UmVndWxhckV4cHJlc3Npb24uZXhlYyhsaW5lKSFbMF07XHJcblx0XHR0aGlzLm1pbkluZGVudExlbmd0aCA9IG1heE51bWJlcjtcclxuXHR9XHJcblx0b25SZWFkTGluZShsaW5lOiBzdHJpbmcpOiBib29sZWFuIHtcclxuXHRcdGNvbnN0ICBjdXJyZW50SW5kZW50ID0gaW5kZW50UmVndWxhckV4cHJlc3Npb24uZXhlYyhsaW5lKSFbMF07XHJcblx0XHRsZXQgIHJlYWRpbmdOZXh0ID0gdHJ1ZTtcclxuXHRcdGlmIChjdXJyZW50SW5kZW50Lmxlbmd0aCA+IHRoaXMuaW5kZW50QXRUYWcubGVuZ3RoICAmJiAgbGluZS5zdGFydHNXaXRoKHRoaXMuaW5kZW50QXRUYWcpKSB7XHJcblxyXG5cdFx0XHR0aGlzLnRlbXBsYXRlTGluZXMucHVzaChsaW5lLnN1YnN0cih0aGlzLmluZGVudEF0VGFnLmxlbmd0aCkpO1xyXG5cdFx0XHR0aGlzLm1pbkluZGVudExlbmd0aCA9IE1hdGgubWluKHRoaXMubWluSW5kZW50TGVuZ3RoLCBjdXJyZW50SW5kZW50Lmxlbmd0aCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnRlbXBsYXRlTGluZXMgPSB0aGlzLnRlbXBsYXRlTGluZXMubWFwKChsaW5lKT0+KFxyXG5cdFx0XHRcdGxpbmUuc3Vic3RyKHRoaXMubWluSW5kZW50TGVuZ3RoKSkpO1xyXG5cdFx0XHRyZWFkaW5nTmV4dCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICByZWFkaW5nTmV4dDtcclxuXHR9XHJcblx0YXN5bmMgIGNoZWNrVGFyZ2V0Q29udGVudHMoc2V0dGluZzogU2V0dGluZ3MsIHBhcmVudFBhdGg6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xyXG5cdFx0Y29uc3QgIHRhcmdldEZpbGVQYXRoID0gcGF0aC5qb2luKHBhcmVudFBhdGgsIGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0aGlzLnRlbXBsYXRlKSk7XHJcblx0XHRpZiAoIWZzLmV4aXN0c1N5bmModGFyZ2V0RmlsZVBhdGgpKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgRXJyb3I6ICR7dHJhbnNsYXRlKCdOb3RGb3VuZCcpfTogJHt0YXJnZXRGaWxlUGF0aH1gKTtcclxuXHRcdFx0cmV0dXJuICBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGNvbnN0ICB0YXJnZXRGaWxlUmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0odGFyZ2V0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGlmICh0aGlzLnRlbXBsYXRlTGluZXMubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHJldHVybiAgZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCAgZXhwZWN0ZWRGaXJzdExpbmUgPSBnZXRFeHBlY3RlZExpbmVJbkZpbGVUZW1wbGF0ZShzZXR0aW5nLCB0aGlzLnRlbXBsYXRlTGluZXNbMF0pO1xyXG5cdFx0bGV0ICB0ZW1wbGF0ZUxpbmVJbmRleCA9IDA7XHJcblx0XHRsZXQgIHRhcmdldExpbmVOdW0gPSAwO1xyXG5cdFx0bGV0ICBpbmRlbnQgPSAnJztcclxuXHRcdGxldCAgc2FtZSA9IGZhbHNlO1xyXG5cclxuXHRcdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgdGFyZ2V0RmlsZVJlYWRlcikge1xyXG5cdFx0XHRjb25zdCAgdGFyZ2V0TGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRcdHRhcmdldExpbmVOdW0gKz0gMTtcclxuXHRcdFx0aWYgKHRlbXBsYXRlTGluZUluZGV4ID09PSAwKSB7XHJcblxyXG5cdFx0XHRcdGNvbnN0ICBpbmRlbnRMZW5ndGggPSB0YXJnZXRMaW5lLmluZGV4T2YoZXhwZWN0ZWRGaXJzdExpbmUpO1xyXG5cdFx0XHRcdGlmIChpbmRlbnRMZW5ndGggPT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRzYW1lID0gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNhbWUgPSB0cnVlO1xyXG5cdFx0XHRcdFx0aW5kZW50ID0gdGFyZ2V0TGluZS5zdWJzdHIoMCwgaW5kZW50TGVuZ3RoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7IC8vIGxpbmVJbmRleCA+PSAxXHJcblx0XHRcdFx0Y29uc3QgIGV4cGVjdGVkID0gZ2V0RXhwZWN0ZWRMaW5lSW5GaWxlVGVtcGxhdGUoc2V0dGluZywgdGhpcy50ZW1wbGF0ZUxpbmVzW3RlbXBsYXRlTGluZUluZGV4XSk7XHJcblxyXG5cdFx0XHRcdHNhbWUgPSAodGFyZ2V0TGluZSA9PT0gaW5kZW50ICsgZXhwZWN0ZWQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzYW1lKSB7XHJcblx0XHRcdFx0dGVtcGxhdGVMaW5lSW5kZXggKz0gMTtcclxuXHRcdFx0XHRpZiAodGVtcGxhdGVMaW5lSW5kZXggPj0gdGhpcy50ZW1wbGF0ZUxpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRlbXBsYXRlTGluZUluZGV4ID0gMDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCFzYW1lKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiXCIpO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OmApO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICBzYW1lO1xyXG5cdH1cclxufVxyXG5cclxuLy8gZXNjYXBlUmVndWxhckV4cHJlc3Npb25cclxuZnVuY3Rpb24gIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uKGV4cHJlc3Npb246IHN0cmluZykge1xyXG5cdHJldHVybiAgZXhwcmVzc2lvbi5yZXBsYWNlKC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZywgJ1xcXFwkJicpO1xyXG59XHJcblxyXG4vLyBTdGFuZGFyZElucHV0QnVmZmVyXHJcbmNsYXNzICBTdGFuZGFyZElucHV0QnVmZmVyIHtcclxuXHRyZWFkbGluZXM6IHJlYWRsaW5lLkludGVyZmFjZTtcclxuXHRpbnB1dEJ1ZmZlcjogc3RyaW5nW10gPSBbXTtcclxuXHRpbnB1dFJlc29sdmVyPzogKGFuc3dlcjpzdHJpbmcpPT52b2lkID0gdW5kZWZpbmVkO1xyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMucmVhZGxpbmVzID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IHByb2Nlc3Muc3RkaW4sXHJcblx0XHRcdG91dHB1dDogcHJvY2Vzcy5zdGRvdXRcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5yZWFkbGluZXMub24oJ2xpbmUnLCBhc3luYyAobGluZTogc3RyaW5nKSA9PiB7XHJcblx0XHRcdGlmICh0aGlzLmlucHV0UmVzb2x2ZXIpIHtcclxuXHRcdFx0XHR0aGlzLmlucHV0UmVzb2x2ZXIobGluZSk7XHJcblx0XHRcdFx0dGhpcy5pbnB1dFJlc29sdmVyID0gdW5kZWZpbmVkO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRCdWZmZXIucHVzaChsaW5lKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0dGhpcy5yZWFkbGluZXMuc2V0UHJvbXB0KCcnKTtcclxuXHRcdHRoaXMucmVhZGxpbmVzLnByb21wdCgpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgIGlucHV0KGd1aWRlOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xyXG5cdFx0cmV0dXJuICBuZXcgUHJvbWlzZShcclxuXHRcdFx0KHJlc29sdmU6IChhbnN3ZXI6c3RyaW5nKT0+dm9pZCwgIHJlamVjdDogKGFuc3dlcjpzdHJpbmcpPT52b2lkICkgPT5cclxuXHRcdHtcclxuXHRcdFx0Y29uc3QgIG5leHRMaW5lID0gdGhpcy5pbnB1dEJ1ZmZlci5zaGlmdCgpO1xyXG5cdFx0XHRpZiAobmV4dExpbmUpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhndWlkZSArIG5leHRMaW5lKTtcclxuXHRcdFx0XHRyZXNvbHZlKG5leHRMaW5lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwcm9jZXNzLnN0ZG91dC53cml0ZShndWlkZSk7XHJcblx0XHRcdFx0dGhpcy5pbnB1dFJlc29sdmVyID0gcmVzb2x2ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjbG9zZSgpIHtcclxuXHRcdHRoaXMucmVhZGxpbmVzLmNsb3NlKCk7XHJcblx0fVxyXG59XHJcblxyXG4vLyBJbnB1dE9wdGlvblxyXG5jbGFzcyBJbnB1dE9wdGlvbiB7XHJcblx0aW5wdXRMaW5lczogc3RyaW5nW107XHJcblx0bmV4dExpbmVJbmRleDogbnVtYmVyO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihpbnB1dExpbmVzOiBzdHJpbmdbXSkge1xyXG5cdFx0dGhpcy5pbnB1dExpbmVzID0gaW5wdXRMaW5lcztcclxuXHRcdHRoaXMubmV4dExpbmVJbmRleCA9IDA7XHJcblx0fVxyXG59XHJcblxyXG5jb25zdCAgdGVzdEJhc2VGb2xkZXIgPSBTdHJpbmcucmF3IGBSOlxcaG9tZVxcbWVtX2NhY2hlXFxNeURvY1xcc3JjXFxUeXBlU2NyaXB0XFx0eXBybVxcdGVzdF9kYXRhYCsnXFxcXCc7XHJcblxyXG4vLyBpbnB1dE9wdGlvblxyXG5jb25zdCBpbnB1dE9wdGlvbiA9IG5ldyBJbnB1dE9wdGlvbihbXHJcbi8qXHJcblx0dGVzdEJhc2VGb2xkZXIgK2BjaGFuZ2Vfc2V0Xy55YW1sYCxcclxuXHRTdHJpbmcucmF3IGBmaWxlYCxcclxuXHR0ZXN0QmFzZUZvbGRlciArYGNoYW5nZV9zZXRfc2V0dGluZy55YW1sYCxcclxuXHRTdHJpbmcucmF3IGBDaGFuZ2VkYCxcclxuKi9cclxuXSk7XHJcblxyXG4vLyBpbnB1dFxyXG4vLyBFeGFtcGxlOiBjb25zdCBuYW1lID0gYXdhaXQgaW5wdXQoJ1doYXQgaXMgeW91ciBuYW1lPyAnKTtcclxuYXN5bmMgZnVuY3Rpb24gIGlucHV0KCBndWlkZTogc3RyaW5nICk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0Ly8gSW5wdXQgZW11bGF0aW9uXHJcblx0aWYgKGlucHV0T3B0aW9uLmlucHV0TGluZXMpIHtcclxuXHRcdGlmIChpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4IDwgaW5wdXRPcHRpb24uaW5wdXRMaW5lcy5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgIHZhbHVlID0gaW5wdXRPcHRpb24uaW5wdXRMaW5lc1tpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4XTtcclxuXHRcdFx0aW5wdXRPcHRpb24ubmV4dExpbmVJbmRleCArPSAxO1xyXG5cdFx0XHRjb25zb2xlLmxvZyhndWlkZSArIHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuICB2YWx1ZTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdC8vIGlucHV0XHJcblx0cmV0dXJuICBJbnB1dE9iamVjdC5pbnB1dChndWlkZSk7XHJcbn1cclxuY29uc3QgIElucHV0T2JqZWN0ID0gbmV3IFN0YW5kYXJkSW5wdXRCdWZmZXIoKTtcclxuXHJcbi8vIGlucHV0UGF0aFxyXG4vLyBFeGFtcGxlOiBjb25zdCBuYW1lID0gYXdhaXQgaW5wdXQoJ1doYXQgaXMgeW91ciBuYW1lPyAnKTtcclxuYXN5bmMgZnVuY3Rpb24gIGlucHV0UGF0aCggZ3VpZGU6IHN0cmluZyApIHtcclxuXHRjb25zdCAga2V5ID0gYXdhaXQgaW5wdXQoZ3VpZGUpO1xyXG5cdHJldHVybiAgcGF0aFJlc29sdmUoa2V5KTtcclxufVxyXG5cclxuLy8gcGF0aFJlc29sdmVcclxuZnVuY3Rpb24gIHBhdGhSZXNvbHZlKHBhdGhfOiBzdHJpbmcpIHtcclxuXHJcblx0Ly8gJy9jL2hvbWUnIGZvcm1hdCB0byBjdXJyZW50IE9TIGZvcm1hdFxyXG5cdGlmIChwYXRoXy5sZW5ndGggPj0gMykge1xyXG5cdFx0aWYgKHBhdGhfWzBdID09PSAnLycgICYmICBwYXRoX1syXSA9PT0gJy8nKSB7XHJcblx0XHRcdHBhdGhfID0gcGF0aF9bMV0gKyc6JysgcGF0aF8uc3Vic3RyKDIpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gQ2hhbmdlIHNlcGFyYXRvcnMgdG8gT1MgZm9ybWF0XHJcblx0cGF0aF8gPSBwYXRoLnJlc29sdmUocGF0aF8pO1xyXG5cclxuXHRyZXR1cm4gcGF0aF9cclxufVxyXG5cclxuLy8gU2V0dGluZ1xyXG50eXBlIFNldHRpbmdzID0ge1tuYW1lOiBzdHJpbmddOiBTZXR0aW5nfVxyXG5cclxuLy8gU2V0dGluZ1xyXG5jbGFzcyBTZXR0aW5nIHtcclxuXHR2YWx1ZTogc3RyaW5nID0gJyc7XHJcblx0bGluZU51bTogbnVtYmVyID0gMDtcclxuXHRpc1JlZmVyZW5jZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG5cclxuLy8gU2VhcmNoS2V5d29yZFxyXG5jbGFzcyBTZWFyY2hLZXl3b3JkIHtcclxuXHRrZXl3b3JkOiBzdHJpbmcgPSAnJztcclxuXHRzdGFydExpbmVOdW06IG51bWJlciA9IDA7XHJcblx0ZGlyZWN0aW9uOiBEaXJlY3Rpb24gPSBEaXJlY3Rpb24uRm9sbG93aW5nO1xyXG59XHJcblxyXG4vLyBEaXJlY3Rpb25cclxuZW51bSBEaXJlY3Rpb24ge1xyXG5cdEFib3ZlID0gLTEsXHJcblx0Rm9sbG93aW5nID0gKzEsXHJcbn1cclxuXHJcbi8vIFdyaXRlQnVmZmVyXHJcbmNsYXNzICBXcml0ZUJ1ZmZlciB7XHJcblx0c3RyZWFtOiBmcy5Xcml0ZVN0cmVhbTtcclxuXHRsaW5lQnVmZmVyOiBzdHJpbmdbXTtcclxuXHJcblx0Y29uc3RydWN0b3Ioc3RyZWFtOiBmcy5Xcml0ZVN0cmVhbSkge1xyXG5cdFx0dGhpcy5zdHJlYW0gPSBzdHJlYW07XHJcblx0XHR0aGlzLmxpbmVCdWZmZXIgPSBbXTtcclxuXHR9XHJcblxyXG5cdGVuZCgpIHtcclxuXHRcdGZvciAoY29uc3QgbGluZSAgb2YgIHRoaXMubGluZUJ1ZmZlcikge1xyXG5cdFx0XHR0aGlzLnN0cmVhbS53cml0ZShsaW5lKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuc3RyZWFtLmVuZCgpO1xyXG4gICAgfVxyXG5cclxuXHRvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCkge1xyXG5cdFx0dGhpcy5zdHJlYW0ub24oZXZlbnQsIGNhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHdyaXRlKGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5saW5lQnVmZmVyLnB1c2gobGluZSk7XHJcblx0fVxyXG5cclxuXHRyZXBsYWNlQWJvdmVMaW5lKHJlbGF0aXZlTGluZU51bTogbnVtYmVyLCBsaW5lOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMubGluZUJ1ZmZlclt0aGlzLmxpbmVCdWZmZXIubGVuZ3RoICsgcmVsYXRpdmVMaW5lTnVtXSA9IGxpbmU7XHJcblx0fVxyXG59XHJcblxyXG4vLyB0cmFuc2xhdGVcclxuLy8gZS5nLiB0cmFuc2xhdGUoJ2VuZ2xpc2gnKVxyXG4vLyBlLmcuIHRyYW5zbGF0ZWBwcmljZSA9ICR7cHJpY2V9YCAgLy8gLi4uIHRhZ2dlZFRlbXBsYXRlXHJcbmZ1bmN0aW9uICB0cmFuc2xhdGUoZW5nbGlzaExpdGVyYWxzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSB8IHN0cmluZywgIC4uLnZhbHVlczogYW55W10pOiBzdHJpbmcge1xyXG5cdGxldCAgICBkaWN0aW9uYXJ5OiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XHJcblx0Y29uc3QgIHRhZ2dlZFRlbXBsYXRlID0gKHR5cGVvZihlbmdsaXNoTGl0ZXJhbHMpICE9PSAnc3RyaW5nJyk7XHJcblxyXG5cdGxldCAgZW5nbGlzaCA9IGVuZ2xpc2hMaXRlcmFscyBhcyBzdHJpbmc7XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRlbmdsaXNoID0gJyc7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHRlbmdsaXNoICs9IGVuZ2xpc2hMaXRlcmFsc1tpXTtcclxuXHRcdFx0aWYgKGkgPCB2YWx1ZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0ZW5nbGlzaCArPSAnJHsnICsgU3RyaW5nKGkpICsnfSc7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZS5nLiBlbmdsaXNoID0gJ3ByaWNlID0gJHswfSdcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGlmIChsb2NhbGUgPT09ICdqYS1KUCcpIHtcclxuXHRcdGRpY3Rpb25hcnkgPSB7XHJcblx0XHRcdFwiWUFNTCBVVEYtOCBmaWxlIHBhdGg+XCI6IFwiWUFNTCBVVEYtOCDjg5XjgqHjgqTjg6sg44OR44K5PlwiLFxyXG5cdFx0XHRcIlRoaXMgaXMgYSBzZWNyZXQgdmFsdWUuXCI6IFwi44GT44KM44Gv56eY5a+G44Gu5YCk44Gn44GZ44CCXCIsXHJcblx0XHRcdFwiQ2hhbmdlIFxcXCIkezB9XFxcIiB0byBcXFwiJHsxfVxcXCIuXCI6IFwiXFxcIiR7MH1cXFwiIOOCkiBcXFwiJHsxfVxcXCIg44Gr5aSJ5pu044GX44Gm44GP44Gg44GV44GE44CCXCIsXHJcblx0XHRcdFwiUHJlc3MgRW50ZXIga2V5IHRvIHJldHJ5IGNoZWNraW5nLlwiOiBcIkVudGVyIOOCreODvOOCkuaKvOOBmeOBqOWGjeODgeOCp+ODg+OCr+OBl+OBvuOBmeOAglwiLFxyXG5cdFx0XHRcIlRoZSBsaW5lIG51bWJlciB0byBjaGFuZ2UgdGhlIHZhcmlhYmxlIHZhbHVlID5cIjogXCLlpInmm7TjgZnjgovlpInmlbDlgKTjgYzjgYLjgovooYznlarlj7cgPlwiLFxyXG5cdFx0XHRcIkVudGVyIG9ubHk6IGZpbmlzaCB0byBpbnB1dCBzZXR0aW5nXCI6IFwiRW50ZXIg44Gu44G/77ya6Kit5a6a44Gu5YWl5Yqb44KS57WC44KP44KLXCIsXHJcblx0XHRcdFwia2V5OiBuZXdfdmFsdWU+XCI6IFwi5aSJ5pWw5ZCNOiDmlrDjgZfjgYTlpInmlbDlgKQ+XCIsXHJcblx0XHRcdFwidGVtcGxhdGUgY291bnRcIjogXCLjg4bjg7Pjg5fjg6zjg7zjg4jjga7mlbBcIixcclxuXHRcdFx0XCJpbiBwcmV2aW91cyBjaGVja1wiOiBcIuWJjeWbnuOBruODgeOCp+ODg+OCr1wiLFxyXG5cdFx0XHRcIldhcm5pbmdcIjogXCLorablkYpcIixcclxuXHRcdFx0XCJFcnJvclwiOiBcIuOCqOODqeODvFwiLFxyXG5cdFx0XHRcIkVycm9yTGluZVwiOiBcIuOCqOODqeODvOihjFwiLFxyXG5cdFx0XHRcIlNvbHV0aW9uXCI6IFwi6Kej5rG65rOVXCIsXHJcblx0XHRcdFwiQ29udGVudHNcIjogXCLlhoXlrrlcIixcclxuXHRcdFx0XCJFeHBlY3RlZFwiOiBcIuacn+W+hVwiLFxyXG5cdFx0XHRcIlRlbXBsYXRlXCI6IFwi6Zub5b2iXCIsXHJcblx0XHRcdFwiV2FybmluZ0xpbmVcIjogXCLorablkYrooYxcIixcclxuXHRcdFx0XCJGb3VuZFwiOiBcIuimi+OBpOOBi+OBo+OBn+OCguOBrlwiLFxyXG5cdFx0XHRcIlNldHRpbmdJbmRleFwiOiBcIuioreWumueVquWPt1wiLFxyXG5cdFx0XHRcIk5vdCBmb3VuZCBhbnkgcmVwbGFjaW5nIHRhcmdldFwiOiBcIue9ruOBjeaPm+OBiOOCi+WvvuixoeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIlNldCBvbGQgdmFsdWUgYXQgc2V0dGluZ3MgaW4gdGhlIHJlcGxhY2luZyBmaWxlXCI6IFwi572u44GN5o+b44GI44KL44OV44Kh44Kk44Or44Gu5Lit44Gu6Kit5a6a44Gr5Y+k44GE5YCk44KS6Kit5a6a44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwXCI6IFwi44OR44Op44Oh44O844K/44O844GvIDAg44KI44KK5bCP44GV44GP44GX44Gm44GP44Gg44GV44GEXCIsXHJcblx0XHRcdFwiTm90IGZvdW5kIFxcXCIkezB9XFxcIiBhYm92ZVwiOiBcIuS4iuaWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgZm91bmQgXFxcIiR7MH1cXFwiIGZvbGxvd2luZ1wiOiBcIuS4i+aWueWQkeOBq+OAjCR7MH3jgI3jgYzopovjgaTjgYvjgorjgb7jgZvjgpNcIixcclxuXHRcdFx0XCJOb3QgcmVmZXJlbmNlZDogJHswfSBpbiBsaW5lICR7MX1cIjogXCLlj4LnhafjgZXjgozjgabjgYTjgb7jgZvjgpPvvJogJHswfSDvvIgkezF96KGM55uu77yJXCIsXHJcblx0XHR9O1xyXG5cdH1cclxuXHRsZXQgIHRyYW5zbGF0ZWQgPSBlbmdsaXNoO1xyXG5cdGlmIChkaWN0aW9uYXJ5KSB7XHJcblx0XHRpZiAoZW5nbGlzaCBpbiBkaWN0aW9uYXJ5KSB7XHJcblxyXG5cdFx0XHR0cmFuc2xhdGVkID0gZGljdGlvbmFyeVtlbmdsaXNoXTtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKHRhZ2dlZFRlbXBsYXRlKSB7XHJcblx0XHRmb3IgKGxldCBpPTA7IGk8ZW5nbGlzaExpdGVyYWxzLmxlbmd0aDsgaSs9MSkge1xyXG5cdFx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJHsnK1N0cmluZyhpKSsnfScsIFN0cmluZyh2YWx1ZXNbaV0pICk7XHJcblx0XHR9XHJcblx0XHR0cmFuc2xhdGVkID0gdHJhbnNsYXRlZC5yZXBsYWNlKCAnJFxcXFx7JywgJyR7JyApO1xyXG5cdFx0XHQvLyBSZXBsYWNlIHRoZSBlc2NhcGUgb2YgJHtufVxyXG5cdFx0XHQvLyBlLmcuIFwiJFxcXFx7cHJpY2V9ID0gJHtwcmljZX1cIiA9PiBcIiR7cHJpY2V9ID0gMTAwXCJcclxuXHR9XHJcblx0cmV0dXJuICB0cmFuc2xhdGVkO1xyXG59XHJcblxyXG5jb25zdCAgaW5kZW50UmVndWxhckV4cHJlc3Npb24gPSAvXiggfMKldCkqLztcclxuY29uc3QgIG1pbkxpbmVOdW0gPSAwO1xyXG5jb25zdCAgbWF4TGluZU51bSA9IDk5OTk5OTk5OTtcclxuY29uc3QgIG1heE51bWJlciA9IDk5OTk5OTk5OTtcclxuY29uc3QgIGZvdW5kRm9yQWJvdmUgPSBtaW5MaW5lTnVtO1xyXG5jb25zdCAgZm91bmRGb3JGb2xsb3dpbmcgPSBtYXhMaW5lTnVtO1xyXG5jb25zdCAgbm90Rm91bmQgPSAtMTtcclxuY29uc3QgIGFsbFNldHRpbmcgPSAwO1xyXG5jb25zdCAgbm9TZXBhcmF0b3IgPSAtMTtcclxubGV0ICAgIGxvY2FsZTogc3RyaW5nO1xyXG5jb25zdCAgcHJvZ3JhbU9wdGlvbnMgPSBwcm9ncmFtLm9wdHMoKTtcclxuZnVuY3Rpb24gIGV4aXRGcm9tQ29tbWFuZGVyKGU6IENvbW1hbmRlckVycm9yKSB7XHJcblx0Y29uc29sZS5sb2coZS5tZXNzYWdlKTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiAgY2FsbE1haW4oKSB7XHJcblx0cHJvZ3JhbS52ZXJzaW9uKCcwLjEuMScpLmV4aXRPdmVycmlkZShleGl0RnJvbUNvbW1hbmRlcilcclxuXHRcdC5vcHRpb24oXCItbCwgLS1sb2NhbGUgPHM+XCIpXHJcblx0XHQub3B0aW9uKFwiLXQsIC0tdGVzdFwiKVxyXG5cdFx0LnBhcnNlKHByb2Nlc3MuYXJndik7XHJcblx0XHJcblx0bG9jYWxlID0gSW50bC5OdW1iZXJGb3JtYXQoKS5yZXNvbHZlZE9wdGlvbnMoKS5sb2NhbGU7XHJcblx0aWYgKHByb2dyYW1PcHRpb25zLmxvY2FsZSkge1xyXG5cdFx0bG9jYWxlID0gcHJvZ3JhbU9wdGlvbnMubG9jYWxlO1xyXG5cdH1cclxuXHJcblx0YXdhaXQgIG1haW4oKVxyXG5cdFx0LmNhdGNoKCBhc3luYyAoZSk9PntcclxuXHRcdFx0aWYgKHByb2dyYW1PcHRpb25zLnRlc3QpIHtcclxuXHRcdFx0XHR0aHJvdyBlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRjb25zb2xlLmxvZyggYEVSUk9SOiAke2UubWVzc2FnZX1gICk7XHJcblx0XHRcdFx0Y29uc3QgIHRpbWVPdmVyID0gbmV3IERhdGUoKTtcclxuXHRcdFx0XHR0aW1lT3Zlci5zZXRTZWNvbmRzKCB0aW1lT3Zlci5nZXRTZWNvbmRzKCkgKyA1ICk7XHJcblxyXG5cdFx0XHRcdHdoaWxlICgobmV3IERhdGUoKSkuZ2V0VGltZSgpIDwgdGltZU92ZXIuZ2V0VGltZSgpKSB7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LmZpbmFsbHkoKCk9PntcclxuXHRcdFx0SW5wdXRPYmplY3QuY2xvc2UoKTtcclxuXHRcdH0pO1xyXG59XHJcbmNhbGxNYWluKCk7XHJcbiJdfQ==