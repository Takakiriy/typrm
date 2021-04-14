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
var temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
var secretLabel = "#★秘密";
var secretLabelEn = "#secret";
var secretExamleLabel = "#★秘密:仮";
var secretExamleLabelEn = "#secret:example";
var referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
function main() {
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function () {
        var inputFilePath, previousTemplateCount, reader, isReadingSetting, setting, settingCount, previousLine, lineNum, templateCount, errorCount, warningCount, secretLabelCount, lines, keywords, reader_1, reader_1_1, line1, line, previousIsReadingSetting, separator, key, value, templateTag, checkingLine, expected, _i, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, reader_2, reader_2_1, line1, line, _c, keywords_1, keyword, e_2_1, _d, keywords_2, keyword, loop, key, lineNum_1, changingSettingIndex, keyValue, _e, _f, _g, key;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, inputPath(translate('YAML UTF-8 file path>'))];
                case 1:
                    inputFilePath = _h.sent();
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
                    _h.trys.push([3, 8, 9, 14]);
                    reader_1 = (e_1 = void 0, __asyncValues(reader));
                    _h.label = 4;
                case 4: return [4 /*yield*/, reader_1.next()];
                case 5:
                    if (!(reader_1_1 = _h.sent(), !reader_1_1.done)) return [3 /*break*/, 7];
                    line1 = reader_1_1.value;
                    line = line1;
                    lines.push(line);
                    lineNum += 1;
                    previousIsReadingSetting = isReadingSetting;
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
                    _h.label = 6;
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _h.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _h.trys.push([9, , 12, 13]);
                    if (!(reader_1_1 && !reader_1_1.done && (_a = reader_1["return"]))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(reader_1)];
                case 10:
                    _h.sent();
                    _h.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14:
                    if (settingCount >= 1) {
                        onEndOfSetting(setting);
                    }
                    // Check if there is the title above or following.
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    _h.label = 15;
                case 15:
                    _h.trys.push([15, 20, 21, 26]);
                    reader_2 = (e_2 = void 0, __asyncValues(reader));
                    _h.label = 16;
                case 16: return [4 /*yield*/, reader_2.next()];
                case 17:
                    if (!(reader_2_1 = _h.sent(), !reader_2_1.done)) return [3 /*break*/, 19];
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
                    _h.label = 18;
                case 18: return [3 /*break*/, 16];
                case 19: return [3 /*break*/, 26];
                case 20:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 26];
                case 21:
                    _h.trys.push([21, , 24, 25]);
                    if (!(reader_2_1 && !reader_2_1.done && (_b = reader_2["return"]))) return [3 /*break*/, 23];
                    return [4 /*yield*/, _b.call(reader_2)];
                case 22:
                    _h.sent();
                    _h.label = 23;
                case 23: return [3 /*break*/, 25];
                case 24:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 25: return [7 /*endfinally*/];
                case 26:
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
                    _h.label = 27;
                case 27:
                    if (!loop) return [3 /*break*/, 36];
                    console.log(translate('Press Enter key to retry checking.'));
                    return [4 /*yield*/, input(translate('The line number to change the variable value >'))];
                case 28:
                    key = _h.sent();
                    errorCount = 0;
                    if (!(key === 'exit')) return [3 /*break*/, 29];
                    return [2 /*return*/];
                case 29:
                    if (!(key !== '')) return [3 /*break*/, 35];
                    lineNum_1 = parseInt(key);
                    return [4 /*yield*/, getSettingIndexFromLineNum(inputFilePath, lineNum_1)];
                case 30:
                    changingSettingIndex = _h.sent();
                    console.log(translate('SettingIndex') + ": " + changingSettingIndex);
                    console.log(translate('Enter only: finish to input setting'));
                    _h.label = 31;
                case 31: return [4 /*yield*/, input(translate('key: new_value>'))];
                case 32:
                    keyValue = _h.sent();
                    if (keyValue === '') {
                        return [3 /*break*/, 35];
                    }
                    _e = errorCount;
                    return [4 /*yield*/, changeSettingByKeyValue(inputFilePath, changingSettingIndex, keyValue)];
                case 33:
                    errorCount = _e + _h.sent();
                    _h.label = 34;
                case 34: return [3 /*break*/, 31];
                case 35:
                    loop = (errorCount >= 1);
                    return [3 /*break*/, 27];
                case 36:
                    // Rescan
                    console.log('========================================');
                    previousTemplateCount = templateCount;
                    for (_f = 0, _g = Object.keys(setting); _f < _g.length; _f++) {
                        key = _g[_f];
                        setting[key].isReferenced = false;
                    }
                    _h.label = 37;
                case 37: return [3 /*break*/, 2];
                case 38: return [2 /*return*/];
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
    tag.indexInLine = line.indexOf(templateLabel);
    if (tag.indexInLine !== notFound) {
        tag.isFound = true;
        var leftOfTemplate = line.substr(0, tag.indexInLine).trim();
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
    tag.template = '';
    tag.lineNumOffset = 0;
    return tag;
}
// TemplateTag
var TemplateTag = /** @class */ (function () {
    function TemplateTag() {
        this.template = '';
        this.isFound = false;
        // template tag
        this.indexInLine = notFound;
        // template-at tag
        this.lineNumOffset = 0;
        this.startIndexInLine = notFound;
        this.endIndexInLine = notFound;
    }
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
var minLineNum = 0;
var maxLineNum = 999999999;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm0uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVCQUF5QixDQUFDLGNBQWM7QUFDeEMsMkJBQTZCLENBQUUsNEJBQTRCO0FBQzNELHVDQUFvRDtBQUNwRCxtQ0FBcUM7QUFDckMsSUFBTyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDakMsSUFBTyxtQkFBbUIsR0FBRyxXQUFXLENBQUM7QUFDekMsSUFBTyxhQUFhLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLElBQU8sb0JBQW9CLEdBQUcsZUFBZSxDQUFDO0FBQzlDLElBQU8sa0JBQWtCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLElBQU8sZUFBZSxHQUFHLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDaEUsSUFBTyxXQUFXLEdBQUcsTUFBTSxDQUFDO0FBQzVCLElBQU8sYUFBYSxHQUFHLFNBQVMsQ0FBQztBQUNqQyxJQUFPLGlCQUFpQixHQUFHLFFBQVEsQ0FBQztBQUNwQyxJQUFPLG1CQUFtQixHQUFHLGlCQUFpQixDQUFDO0FBQy9DLElBQU8sWUFBWSxHQUFHLDZDQUE2QyxDQUFDO0FBRXBFLFNBQWdCLElBQUk7Ozs7Ozt3QkFDSSxxQkFBTSxTQUFTLENBQUUsU0FBUyxDQUFDLHVCQUF1QixDQUFDLENBQUUsRUFBQTs7b0JBQXJFLGFBQWEsR0FBRyxTQUFxRDtvQkFDdkUscUJBQXFCLEdBQUcsQ0FBQyxDQUFDOzs7b0JBRXpCLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO3dCQUN0QyxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQzt3QkFDekMsU0FBUyxFQUFFLFFBQVE7cUJBQ25CLENBQUMsQ0FBQztvQkFDRSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7b0JBQ3pCLE9BQU8sR0FBYSxFQUFFLENBQUM7b0JBQ3ZCLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ2pCLFlBQVksR0FBRyxFQUFFLENBQUM7b0JBQ2xCLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBQ1osYUFBYSxHQUFHLENBQUMsQ0FBQztvQkFDbEIsVUFBVSxHQUFHLENBQUMsQ0FBQztvQkFDZixZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixnQkFBZ0IsR0FBRyxDQUFDLENBQUM7b0JBQ25CLEtBQUssR0FBRyxFQUFFLENBQUM7b0JBQ1gsUUFBUSxHQUFvQixFQUFFLENBQUM7Ozs7b0JBRVosMEJBQUEsY0FBQSxNQUFNLENBQUEsQ0FBQTs7Ozs7b0JBQWYsS0FBSyxtQkFBQSxDQUFBO29CQUNkLElBQUksR0FBVyxLQUFLLENBQUM7b0JBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2pCLE9BQU8sSUFBSSxDQUFDLENBQUM7b0JBQ04sd0JBQXdCLEdBQUcsZ0JBQWdCLENBQUM7b0JBRW5ELGdCQUFnQjtvQkFDaEIsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssaUJBQWlCLEVBQUU7d0JBQ3RDLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTs0QkFDdEIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUN4Qjt3QkFDRCxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7d0JBRXhCLE9BQU8sR0FBRyxFQUFFLENBQUM7d0JBQ2IsWUFBWSxJQUFJLENBQUMsQ0FBQztxQkFDbEI7eUJBQU0sSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLEVBQUU7d0JBQ2xELGdCQUFnQixHQUFHLEtBQUssQ0FBQztxQkFDekI7b0JBQ0QsSUFBSSxnQkFBZ0IsRUFBRTt3QkFDZCxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDckMsSUFBSSxTQUFTLEtBQUssUUFBUSxFQUFFOzRCQUNwQixHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ3ZDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDOzRCQUN6QyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7Z0NBRWpCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLEtBQUssT0FBQSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQzs2QkFDckQ7aUNBQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLGlCQUFpQixJQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssbUJBQW1CLEVBQUU7Z0NBQ2xGLGdCQUFnQixHQUFHLEtBQUssQ0FBQzs2QkFDekI7eUJBQ0Q7cUJBQ0Q7b0JBR00sV0FBVyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxJQUFJLFdBQVcsQ0FBQyxhQUFhLElBQUksQ0FBQyxJQUFNLFdBQVcsQ0FBQyxPQUFPLEVBQUU7d0JBQzVELE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxVQUFLLE9BQVMsQ0FBQyxDQUFDO3dCQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLElBQUksQ0FBQyxJQUFJLEVBQUksQ0FBQyxDQUFDO3dCQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFLLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBRyxDQUFDLENBQUM7d0JBQzFGLFdBQVcsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO3dCQUM1QixhQUFhLElBQUksQ0FBQyxDQUFDO3dCQUNuQixVQUFVLElBQUksQ0FBQyxDQUFDO3FCQUNoQjtvQkFDRCxJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUU7d0JBQ3hCLGFBQWEsSUFBSSxDQUFDLENBQUM7d0JBQ1osWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7d0JBQ25FLFFBQVEsR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzt3QkFFakUsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLFFBQVEsRUFBRTs0QkFDaEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsV0FBVyxDQUFDLFdBQUssT0FBTyxHQUFHLFdBQVcsQ0FBQyxhQUFhLENBQUUsQ0FBQyxDQUFDOzRCQUNqRixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFlBQVksQ0FBQyxJQUFJLEVBQUksQ0FBQyxDQUFDOzRCQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFFBQVUsQ0FBQyxDQUFDOzRCQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFdBQVcsQ0FBQyxRQUFVLENBQUMsQ0FBQzs0QkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxjQUFjLENBQUMsVUFBSyxZQUFjLENBQUMsQ0FBQzs0QkFDL0QsVUFBVSxJQUFJLENBQUMsQ0FBQzt5QkFDaEI7cUJBQ0Q7b0JBRUQsa0NBQWtDO29CQUNsQyxXQUEwQyxFQUFmLG1DQUFlLEVBQWYsNkJBQWUsRUFBZixJQUFlLEVBQUU7d0JBQW5DLGNBQWM7d0JBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLENBQUMsS0FBSyxRQUFRLEVBQUU7NEJBQzFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7NEJBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFLLE9BQVMsQ0FBQyxDQUFDOzRCQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLElBQUksQ0FBQyxJQUFJLEVBQUksQ0FBQyxDQUFDOzRCQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFLLFlBQWMsQ0FBQyxDQUFDOzRCQUMvRCxZQUFZLElBQUksQ0FBQyxDQUFDO3lCQUNsQjtxQkFDRDtvQkFFRCxvQ0FBb0M7b0JBQ3BDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBRSxXQUFXLENBQUUsS0FBSyxRQUFRLElBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBRSxhQUFhLENBQUUsS0FBSyxRQUFRLEVBQUU7d0JBQzdGLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBRSxpQkFBaUIsQ0FBRSxLQUFLLFFBQVEsSUFBTSxJQUFJLENBQUMsT0FBTyxDQUFFLG1CQUFtQixDQUFFLEtBQUssUUFBUSxFQUFFOzRCQUN6RyxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRSxFQUFHLDBDQUEwQztnQ0FDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQUssT0FBUyxDQUFDLENBQUM7Z0NBQ3ZELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBSyxTQUFTLENBQUMseUJBQXlCLENBQUcsQ0FBQyxDQUFDO2dDQUN6RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRSxTQUFTLGtHQUFBLFdBQVcsRUFBYSxVQUFTLEVBQW1CLE1BQUssS0FBOUMsYUFBYSxFQUFTLG1CQUFtQixDQUFLLENBQUMsQ0FBQztnQ0FDdEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUUsU0FBUyxrR0FBQSxXQUFXLEVBQVcsVUFBUyxFQUFpQixNQUFLLEtBQTFDLFdBQVcsRUFBUyxpQkFBaUIsQ0FBSyxDQUFDLENBQUM7Z0NBQ2xGLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBSyxTQUFTLENBQUMsY0FBYyxDQUFDLFVBQUssWUFBYyxDQUFDLENBQUM7Z0NBQy9ELFlBQVksSUFBSSxDQUFDLENBQUM7NkJBQ2xCOzRCQUNELGdCQUFnQixJQUFJLENBQUMsQ0FBQzt5QkFDdEI7cUJBQ0Q7b0JBR0ksS0FBSyxTQUF3QixDQUFDO29CQUNuQyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFFM0IsT0FBUSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBRSxDQUFDLEtBQUssSUFBSSxFQUFHO3dCQUMvQyxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQzt3QkFDOUIsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzNCLElBQUksS0FBSyxLQUFLLElBQUksSUFBTSxLQUFLLEtBQUssT0FBTyxFQUFFOzRCQUMxQyxPQUFPLENBQUMsWUFBWSxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7NEJBQ25DLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQzt5QkFDcEM7NkJBQU0sSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFNLEtBQUssS0FBSyxXQUFXLEVBQUU7NEJBQ3JELE9BQU8sQ0FBQyxZQUFZLEdBQUcsT0FBTyxHQUFHLENBQUMsQ0FBQzs0QkFDbkMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDO3lCQUN4Qzt3QkFDRCxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN2QjtvQkFFRCxZQUFZLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRXJCLElBQUksWUFBWSxJQUFJLENBQUMsRUFBRTt3QkFDdEIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3FCQUN4QjtvQkFFRCxrREFBa0Q7b0JBQ2xELE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO3dCQUNqQyxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQzt3QkFDekMsU0FBUyxFQUFFLFFBQVE7cUJBQ25CLENBQUMsQ0FBQztvQkFDSCxPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7O29CQUVjLDBCQUFBLGNBQUEsTUFBTSxDQUFBLENBQUE7Ozs7O29CQUFmLEtBQUssbUJBQUEsQ0FBQTtvQkFDZCxJQUFJLEdBQVcsS0FBSyxDQUFDO29CQUM1QixPQUFPLElBQUksQ0FBQyxDQUFDO29CQUViLFdBQThCLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVEsRUFBRTt3QkFBckIsT0FBTzt3QkFDakIsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxLQUFLLEVBQUU7NEJBQzFDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7Z0NBRXBDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO29DQUMvQyxPQUFPLENBQUMsWUFBWSxHQUFHLGFBQWEsQ0FBQztpQ0FDckM7NkJBQ0Q7eUJBQ0Q7NkJBQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxTQUFTLEVBQUU7NEJBQ3JELElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7Z0NBRXBDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO29DQUMvQyxPQUFPLENBQUMsWUFBWSxHQUFHLGlCQUFpQixDQUFDO2lDQUN6Qzs2QkFDRDt5QkFDRDtxQkFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUVGLFdBQThCLEVBQVIscUJBQVEsRUFBUixzQkFBUSxFQUFSLElBQVEsRUFBRTt3QkFBckIsT0FBTzt3QkFDakIsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxLQUFLLEVBQUU7NEJBQzFDLElBQUksT0FBTyxDQUFDLFlBQVksS0FBSyxhQUFhLEVBQUU7Z0NBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7Z0NBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLFdBQVcsQ0FBQyxXQUFLLE9BQU8sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFFLENBQUMsQ0FBQztnQ0FDdEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyw2RkFBQSxjQUFjLEVBQWUsVUFBUyxLQUF4QixPQUFPLENBQUMsT0FBTyxDQUFTLENBQUMsQ0FBQztnQ0FDcEUsVUFBVSxJQUFJLENBQUMsQ0FBQzs2QkFDaEI7eUJBQ0Q7NkJBQU0sSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxTQUFTLEVBQUU7NEJBQ3JELElBQUksT0FBTyxDQUFDLFlBQVksS0FBSyxpQkFBaUIsRUFBRTtnQ0FDL0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQ0FDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsV0FBVyxDQUFDLFdBQUssT0FBTyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUUsQ0FBQyxDQUFDO2dDQUN0RSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxTQUFTLGlHQUFBLGNBQWMsRUFBZSxjQUFhLEtBQTVCLE9BQU8sQ0FBQyxPQUFPLENBQWEsQ0FBQyxDQUFDO2dDQUN4RSxVQUFVLElBQUksQ0FBQyxDQUFDOzZCQUNoQjt5QkFDRDtxQkFDRDtvQkFFRCxrQkFBa0I7b0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFLLFlBQVksVUFBSyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUssVUFBWSxDQUFDLENBQUM7b0JBQzlGLElBQUkscUJBQXFCLEVBQUU7d0JBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLGdCQUFnQixDQUFDLFdBQU0scUJBQXFCLFVBQUssU0FBUyxDQUFDLG1CQUFtQixDQUFDLE1BQUcsQ0FBQyxDQUFDO3FCQUM3RztvQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFJLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFNLGFBQWUsQ0FBQyxDQUFDO29CQUc1RCxJQUFJLEdBQUcsSUFBSSxDQUFDOzs7eUJBQ1YsSUFBSTtvQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLENBQUM7b0JBRWhELHFCQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsZ0RBQWdELENBQUMsQ0FBQyxFQUFBOztvQkFBOUUsR0FBRyxHQUFHLFNBQXdFO29CQUNyRixVQUFVLEdBQUcsQ0FBQyxDQUFDO3lCQUNYLENBQUEsR0FBRyxLQUFLLE1BQU0sQ0FBQSxFQUFkLHlCQUFjO29CQUNqQixzQkFBTzs7eUJBQ0csQ0FBQSxHQUFHLEtBQUssRUFBRSxDQUFBLEVBQVYseUJBQVU7b0JBQ2IsWUFBVSxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ0QscUJBQU0sMEJBQTBCLENBQUMsYUFBYSxFQUFFLFNBQU8sQ0FBQyxFQUFBOztvQkFBL0Usb0JBQW9CLEdBQUcsU0FBd0Q7b0JBQ3RGLE9BQU8sQ0FBQyxHQUFHLENBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxVQUFLLG9CQUFzQixDQUFDLENBQUM7b0JBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLHFDQUFxQyxDQUFDLENBQUMsQ0FBQzs7eUJBRTNDLHFCQUFNLEtBQUssQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFBOztvQkFBcEQsUUFBUSxHQUFHLFNBQXlDO29CQUMzRCxJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7d0JBQ3BCLHlCQUFNO3FCQUNOO29CQUNELEtBQUEsVUFBVSxDQUFBO29CQUFJLHFCQUFNLHVCQUF1QixDQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxRQUFRLENBQUMsRUFBQTs7b0JBQTFGLFVBQVUsR0FBVixLQUFjLFNBQTRFLENBQUM7Ozs7b0JBRzdGLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7O29CQUcxQixTQUFTO29CQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztvQkFDeEQscUJBQXFCLEdBQUcsYUFBYSxDQUFBO29CQUNyQyxXQUFzQyxFQUFwQixLQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQXBCLGNBQW9CLEVBQXBCLElBQW9CLEVBQUU7d0JBQTdCLEdBQUc7d0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7cUJBQ2xDOzs7Ozs7O0NBRUY7QUFFRCxpQkFBaUI7QUFDakIsU0FBUyxjQUFjLENBQUMsT0FBaUI7SUFDeEMsS0FBa0IsVUFBb0IsRUFBcEIsS0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFwQixjQUFvQixFQUFwQixJQUFvQixFQUFFO1FBQW5DLElBQU0sR0FBRyxTQUFBO1FBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUU7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLHNHQUFBLGtCQUFtQixFQUFHLFdBQVksRUFBb0IsRUFBRSxLQUFyQyxHQUFHLEVBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRyxDQUFDO1NBQy9FO0tBQ0Q7QUFDRixDQUFDO0FBRUQsNkJBQTZCO0FBQzdCLFNBQWdCLDBCQUEwQixDQUFDLGFBQXFCLEVBQUUsYUFBcUI7Ozs7Ozs7b0JBQy9FLE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO3dCQUN4QyxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQzt3QkFDekMsU0FBUyxFQUFFLFFBQVE7cUJBQ25CLENBQUMsQ0FBQztvQkFDRSxZQUFZLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixPQUFPLEdBQUcsQ0FBQyxDQUFDOzs7O29CQUVTLFdBQUEsY0FBQSxNQUFNLENBQUE7Ozs7O29CQUFmLEtBQUssbUJBQUEsQ0FBQTtvQkFDZCxJQUFJLEdBQVcsS0FBSyxDQUFDO29CQUM1QixPQUFPLElBQUksQ0FBQyxDQUFDO29CQUViLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLGlCQUFpQixJQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxtQkFBbUIsRUFBRTt3QkFDL0UsWUFBWSxJQUFJLENBQUMsQ0FBQztxQkFDbEI7b0JBRUQsSUFBSSxPQUFPLEtBQUssYUFBYSxFQUFFO3dCQUM5QixzQkFBUSxZQUFZLEVBQUM7cUJBQ3JCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFFRixzQkFBUSxDQUFDLEVBQUM7Ozs7Q0FDVjtBQUVELDBCQUEwQjtBQUMxQixTQUFnQix1QkFBdUIsQ0FBQyxhQUFxQixFQUFFLG9CQUE0QixFQUN6RixRQUFnQjs7OztZQUVWLFNBQVMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pDLElBQUksU0FBUyxLQUFLLFFBQVEsRUFBRTtnQkFDcEIsR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMzQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFFN0Msc0JBQVEsYUFBYSxDQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUM7YUFDdkU7aUJBQU07Z0JBQ04sc0JBQVEsQ0FBQyxFQUFDO2FBQ1Y7Ozs7Q0FDRDtBQUVELGdCQUFnQjtBQUNoQixTQUFnQixhQUFhLENBQUMsYUFBcUIsRUFBRSxvQkFBNEIsRUFDL0UsV0FBbUIsRUFBRSxzQkFBOEI7Ozs7Ozs7b0JBRTdDLGNBQWMsR0FBRyxhQUFhLEdBQUUsU0FBUyxDQUFDO29CQUNqRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRTt3QkFDbkMsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7cUJBQy9DO29CQUVNLFdBQVcsR0FBRyxhQUFhLENBQUM7b0JBQzVCLFdBQVcsR0FBRyxhQUFhLEdBQUUsTUFBTSxDQUFDO29CQUNwQyxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7b0JBQzVELE1BQU0sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDO3dCQUN4QyxLQUFLLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQzt3QkFDdkMsU0FBUyxFQUFFLFFBQVE7cUJBQ25CLENBQUMsQ0FBQztvQkFDSSxLQUFLLEdBQUcsRUFBRSxDQUFDO29CQUNiLGdCQUFnQixHQUFHLEtBQUssQ0FBQztvQkFDekIsT0FBTyxHQUFhLEVBQUUsQ0FBQztvQkFDdkIsWUFBWSxHQUFHLENBQUMsQ0FBQztvQkFDakIsWUFBWSxHQUFHLEVBQUUsQ0FBQztvQkFDbEIsWUFBWSxHQUFHLGVBQWUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO29CQUN2RCxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNaLFVBQVUsR0FBRyxDQUFDLENBQUM7b0JBQ2YsVUFBVSxHQUFHLEtBQUssQ0FBQzs7OztvQkFFRSxXQUFBLGNBQUEsTUFBTSxDQUFBOzs7OztvQkFBZixLQUFLLG1CQUFBLENBQUE7b0JBQ2QsSUFBSSxHQUFXLEtBQUssQ0FBQztvQkFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDakIsT0FBTyxJQUFJLENBQUMsQ0FBQztvQkFDUixNQUFNLEdBQUcsS0FBSyxDQUFDO29CQUVwQixnQkFBZ0I7b0JBQ2hCLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLGlCQUFpQixJQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxtQkFBbUIsRUFBRTt3QkFDL0UsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO3dCQUN4QixPQUFPLEdBQUcsRUFBRSxDQUFDO3dCQUNiLFlBQVksSUFBSSxDQUFDLENBQUM7d0JBQ2xCLElBQUksb0JBQW9CLEtBQUssVUFBVSxFQUFFOzRCQUN4QyxVQUFVLEdBQUcsSUFBSSxDQUFDO3lCQUNsQjs2QkFBTTs0QkFDTixVQUFVLEdBQUcsQ0FBQyxZQUFZLEtBQUssb0JBQW9CLENBQUMsQ0FBQzt5QkFDckQ7cUJBQ0Q7eUJBQU0sSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLEVBQUU7d0JBQ2xELGdCQUFnQixHQUFHLEtBQUssQ0FBQztxQkFDekI7b0JBQ0QsSUFBSSxVQUFVLEVBQUU7d0JBRWYsSUFBSSxnQkFBZ0IsRUFBRTs0QkFDZCxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDckMsSUFBSSxTQUFTLEtBQUssUUFBUSxFQUFFO2dDQUNwQixHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0NBQ3ZDLEtBQUssR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dDQUN6QyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7b0NBRWpCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFDLEtBQUssT0FBQSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxTQUFBLEVBQUMsQ0FBQztpQ0FDckQ7cUNBQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxLQUFLLGlCQUFpQixJQUFNLEdBQUcsR0FBRyxHQUFHLEtBQUssbUJBQW1CLEVBQUU7b0NBQ2xGLGdCQUFnQixHQUFHLEtBQUssQ0FBQztpQ0FDekI7Z0NBRUQsSUFBSSxHQUFHLEtBQUssV0FBVyxFQUFFO29DQUNqQixZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7b0NBQzlDLE9BQU8sR0FBRSxFQUFFLENBQUM7b0NBQ2pCLElBQUksWUFBWSxLQUFLLFFBQVEsSUFBTSxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxFQUFFO3dDQUNwRixPQUFPLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7cUNBQzNDO29DQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxHQUFHLENBQUMsQ0FBQyxHQUFFLEdBQUcsR0FBRSxzQkFBc0IsR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7b0NBQzFGLE1BQU0sR0FBRyxJQUFJLENBQUM7aUNBQ2Q7NkJBQ0Q7NEJBRUYsa0JBQWtCO3lCQUNqQjs2QkFBTTs0QkFDQyxXQUFXLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzVDLElBQUksV0FBVyxDQUFDLE9BQU8sRUFBRTtnQ0FDakIsWUFBWSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7Z0NBQ25FLFFBQVEsR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQ0FDMUQsT0FBTyxHQUFHLGNBQWMsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0NBRTFGLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxRQUFRLEVBQUU7b0NBQ3pDLE1BQU0sR0FBRyxRQUFRLENBQUM7b0NBQ2xCLEtBQUssR0FBRyxPQUFPLENBQUM7b0NBQ3ZCLElBQUksV0FBVyxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsRUFBRTt3Q0FDN0IsU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7d0NBQ3ZFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUNoRCxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBQyxJQUFJLENBQUMsQ0FBQztxQ0FDeEM7eUNBQU07d0NBRU4sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsR0FBRSxJQUFJLENBQUMsQ0FBQzt3Q0FDaEQsTUFBTSxHQUFHLElBQUksQ0FBQztxQ0FDZDtpQ0FDRDtxQ0FBTSxJQUFJLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO29DQUN0RCxhQUFhO2lDQUNiO3FDQUFNO29DQUNOLElBQUksVUFBVSxLQUFLLENBQUMsRUFBRSxFQUFFLHFEQUFxRDt3Q0FDNUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQzt3Q0FDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBSSxTQUFTLENBQUMsV0FBVyxDQUFDLFVBQUssT0FBUyxDQUFDLENBQUM7d0NBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBSyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUssU0FBUyxDQUFDLGdDQUFnQyxDQUFHLENBQUMsQ0FBQzt3Q0FDdkYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBSyxTQUFTLENBQUMsaURBQWlELENBQUcsQ0FBQyxDQUFDO3dDQUMzRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLElBQUksQ0FBQyxJQUFJLEVBQUksQ0FBQyxDQUFDO3dDQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFFBQVEsQ0FBQyxJQUFJLEVBQUksQ0FBQyxDQUFDO3dDQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQUssU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFLLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFJLENBQUMsQ0FBQzt3Q0FDMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFLLFNBQVMsQ0FBQyxjQUFjLENBQUMsVUFBSyxZQUFjLENBQUMsQ0FBQzt3Q0FDL0QsVUFBVSxJQUFJLENBQUMsQ0FBQztxQ0FDaEI7aUNBQ0Q7NkJBQ0Q7eUJBQ0Q7cUJBQ0Q7b0JBQ0QsSUFBSSxDQUFDLE1BQU0sRUFBRTt3QkFDWixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRSxJQUFJLENBQUMsQ0FBQztxQkFDekI7b0JBQ0QsWUFBWSxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUVyQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ2Isc0JBQU8sSUFBSSxPQUFPLENBQUUsVUFBQyxPQUFPOzRCQUMzQixNQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRTtnQ0FDbkIsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0NBQzVDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQ0FDeEIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzRCQUNyQixDQUFDLENBQUMsQ0FBQzt3QkFDSixDQUFDLENBQUMsRUFBQzs7OztDQUNIO0FBRUQsaUJBQWlCO0FBQ2pCLFNBQVUsY0FBYyxDQUFDLElBQVksRUFBRSxnQkFBeUI7SUFDL0QsSUFBSyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLElBQUksZ0JBQWdCLEVBQUU7UUFDckIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFJLGFBQWEsU0FBUSxDQUFDO1FBQzFCLElBQUksT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUN6QixhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3pEO2FBQ0k7WUFDSixhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzVCO1FBRUQsSUFBSSxhQUFhLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBTSxhQUFhLEtBQUssRUFBRSxFQUFFO1lBQ3RFLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDbkI7YUFBTSxJQUFJLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDNUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUNuQjtLQUNEO0lBQ0QsT0FBUSxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELGFBQWE7QUFDYixTQUFVLFVBQVUsQ0FBQyxJQUFZO0lBQzdCLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNyQixFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCO0FBQ0wsQ0FBQztBQUVELFdBQVc7QUFDWCxTQUFVLFFBQVEsQ0FBQyxJQUFZLEVBQUUsY0FBc0I7SUFDdEQsSUFBTyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDdEQsSUFBTyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwQyxJQUFJLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDekIsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3hDO0lBQ0QsT0FBUSxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsa0JBQWtCO0FBQ2xCLFNBQVUsZUFBZSxDQUFDLE9BQWlCLEVBQUUsUUFBZ0I7SUFDNUQsSUFBSyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBRXpCLEtBQWtCLFVBQW9CLEVBQXBCLEtBQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBcEIsY0FBb0IsRUFBcEIsSUFBb0IsRUFBRTtRQUFuQyxJQUFNLEdBQUcsU0FBQTtRQUNiLElBQU8sRUFBRSxHQUFHLElBQUksTUFBTSxDQUFFLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBRSxDQUFDO1FBRTdELElBQU8sYUFBYSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxJQUFJLGFBQWEsS0FBSyxRQUFRLEVBQUU7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDakM7UUFDRCxRQUFRLEdBQUcsYUFBYSxDQUFDO0tBQ3pCO0lBQ0QsT0FBUSxRQUFRLENBQUM7QUFDbEIsQ0FBQztBQUVELGlCQUFpQjtBQUNqQixTQUFVLGNBQWMsQ0FBQyxPQUFpQixFQUFFLFFBQWdCLEVBQUUsV0FBbUIsRUFBRSxZQUFvQjtJQUN0RyxJQUFLLFdBQVcsR0FBRyxFQUFFLENBQUM7SUFDdEIsSUFBSSxXQUFXLElBQUksT0FBTyxFQUFFO1FBQzNCLElBQU8sYUFBYSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFFbEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7UUFFMUMsV0FBVyxHQUFHLGVBQWUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUM7S0FDM0M7U0FBTTtRQUNOLFdBQVcsR0FBRyxlQUFlLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2pEO0lBQ0QsT0FBUSxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELGtCQUFrQjtBQUNsQixTQUFVLGVBQWUsQ0FBQyxzQkFBOEI7SUFDdkQsSUFBTyxZQUFZLEdBQUcsc0JBQXNCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFELElBQUssWUFBb0IsQ0FBQztJQUMxQixJQUFJLFlBQVksS0FBSyxRQUFRLEVBQUU7UUFFOUIsWUFBWSxHQUFHLHNCQUFzQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDckU7U0FBTTtRQUNOLFlBQVksR0FBRyxzQkFBc0IsQ0FBQztLQUN0QztJQUNELE9BQVEsWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUFFRCxtQkFBbUI7QUFDbkIsU0FBVSxnQkFBZ0IsQ0FBQyxJQUFZO0lBQ3RDLElBQU8sR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7SUFFL0IsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQzlDLElBQUksR0FBRyxDQUFDLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDakMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBTyxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRS9ELEdBQUcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMxRSxJQUFJLGNBQWMsS0FBSyxFQUFFLEVBQUU7WUFDMUIsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUN2QjthQUFNO1lBQ04sR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7U0FDdEI7UUFDRCxPQUFRLEdBQUcsQ0FBQztLQUNaO0lBRUQsR0FBRyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQztJQUMxRCxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsS0FBSyxRQUFRLEVBQUU7UUFDdEMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDbkIsR0FBRyxDQUFDLGNBQWMsR0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzdFLElBQUksR0FBRyxDQUFDLGNBQWMsS0FBSyxRQUFRLEVBQUU7WUFFcEMsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEYsR0FBRyxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FDMUMsR0FBRyxDQUFDLGdCQUFnQixHQUFHLG9CQUFvQixDQUFDLE1BQU0sRUFDbEQsR0FBRyxDQUFDLGNBQWMsQ0FBRSxDQUFDLENBQUM7WUFDdkIsT0FBUSxHQUFHLENBQUM7U0FDWjtLQUNEO0lBRUQsR0FBRyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDbEIsR0FBRyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7SUFDdEIsT0FBUSxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsY0FBYztBQUNkO0lBQUE7UUFDQyxhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsWUFBTyxHQUFHLEtBQUssQ0FBQztRQUVoQixlQUFlO1FBQ2YsZ0JBQVcsR0FBRyxRQUFRLENBQUM7UUFFdkIsa0JBQWtCO1FBQ2xCLGtCQUFhLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLHFCQUFnQixHQUFHLFFBQVEsQ0FBQztRQUM1QixtQkFBYyxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQUVELDBCQUEwQjtBQUMxQixTQUFVLHVCQUF1QixDQUFDLFVBQWtCO0lBQ25ELE9BQVEsVUFBVSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzRCxDQUFDO0FBRUQsc0JBQXNCO0FBQ3RCO0lBS0M7UUFBQSxpQkFnQkM7UUFuQkQsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFDM0Isa0JBQWEsR0FBMkIsU0FBUyxDQUFDO1FBR2pELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztZQUN6QyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUs7WUFDcEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1NBQ3RCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFPLElBQVk7O2dCQUM1QyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3ZCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO2lCQUMvQjtxQkFBTTtvQkFDTixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDNUI7OzthQUNELENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVNLG1DQUFLLEdBQVosVUFBYSxLQUFhOzs7O2dCQUN6QixzQkFBUSxJQUFJLE9BQU8sQ0FDbEIsVUFBQyxPQUE4QixFQUFHLE1BQTZCO3dCQUUvRCxJQUFPLFFBQVEsR0FBRyxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUMzQyxJQUFJLFFBQVEsRUFBRTs0QkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQzs0QkFDOUIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3lCQUNsQjs2QkFBTTs0QkFDTixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDNUIsS0FBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7eUJBQzdCO29CQUNGLENBQUMsQ0FBQyxFQUFDOzs7S0FDSDtJQUVELG1DQUFLLEdBQUw7UUFDQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFDRiwwQkFBQztBQUFELENBQUMsQUF6Q0QsSUF5Q0M7QUFFRCxjQUFjO0FBQ2Q7SUFJQyxxQkFBWSxVQUFvQjtRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztRQUM3QixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ0Ysa0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVELElBQU8sY0FBYyxHQUFHLE1BQU0sQ0FBQyxHQUFHLHNIQUFDLCtEQUF3RCxPQUFDLElBQUksQ0FBQztBQUVqRyxjQUFjO0FBQ2QsSUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUM7QUFDcEM7Ozs7O0VBS0U7Q0FDRCxDQUFDLENBQUM7QUFFSCxRQUFRO0FBQ1IsNERBQTREO0FBQzVELFNBQWdCLEtBQUssQ0FBRSxLQUFhOzs7O1lBQ25DLGtCQUFrQjtZQUNsQixJQUFJLFdBQVcsQ0FBQyxVQUFVLEVBQUU7Z0JBQzNCLElBQUksV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtvQkFDdkQsS0FBSyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUNqRSxXQUFXLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQztvQkFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUM7b0JBQzNCLHNCQUFRLEtBQUssRUFBQztpQkFDZDthQUNEO1lBRUQsUUFBUTtZQUNSLHNCQUFRLFdBQVcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUM7OztDQUNqQztBQUNELElBQU8sV0FBVyxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztBQUUvQyxZQUFZO0FBQ1osNERBQTREO0FBQzVELFNBQWdCLFNBQVMsQ0FBRSxLQUFhOzs7Ozt3QkFDMUIscUJBQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFBOztvQkFBeEIsR0FBRyxHQUFHLFNBQWtCO29CQUMvQixzQkFBUSxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUM7Ozs7Q0FDekI7QUFFRCxjQUFjO0FBQ2QsU0FBVSxXQUFXLENBQUMsS0FBYTtJQUVsQyx3Q0FBd0M7SUFDeEMsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUN0QixJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUMzQyxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFFLEdBQUcsR0FBRSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Q7SUFFRCxpQ0FBaUM7SUFDakMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFNUIsT0FBTyxLQUFLLENBQUE7QUFDYixDQUFDO0FBS0QsVUFBVTtBQUNWO0lBQUE7UUFDQyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBQ25CLFlBQU8sR0FBVyxDQUFDLENBQUM7UUFDcEIsaUJBQVksR0FBWSxLQUFLLENBQUM7SUFDL0IsQ0FBQztJQUFELGNBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVELGdCQUFnQjtBQUNoQjtJQUFBO1FBQ0MsWUFBTyxHQUFXLEVBQUUsQ0FBQztRQUNyQixpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUN6QixjQUFTLEdBQWMsU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUM1QyxDQUFDO0lBQUQsb0JBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVELFlBQVk7QUFDWixJQUFLLFNBR0o7QUFIRCxXQUFLLFNBQVM7SUFDYiw0Q0FBVSxDQUFBO0lBQ1YsbURBQWMsQ0FBQTtBQUNmLENBQUMsRUFISSxTQUFTLEtBQVQsU0FBUyxRQUdiO0FBRUQsY0FBYztBQUNkO0lBSUMscUJBQVksTUFBc0I7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELHlCQUFHLEdBQUg7UUFDQyxLQUFxQixVQUFlLEVBQWYsS0FBQSxJQUFJLENBQUMsVUFBVSxFQUFmLGNBQWUsRUFBZixJQUFlLEVBQUU7WUFBakMsSUFBTSxJQUFJLFNBQUE7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QjtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVKLHdCQUFFLEdBQUYsVUFBRyxLQUFhLEVBQUUsUUFBb0I7UUFDckMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCwyQkFBSyxHQUFMLFVBQU0sSUFBWTtRQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsc0NBQWdCLEdBQWhCLFVBQWlCLGVBQXVCLEVBQUUsSUFBWTtRQUNyRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNsRSxDQUFDO0lBQ0Ysa0JBQUM7QUFBRCxDQUFDLEFBM0JELElBMkJDO0FBRUQsWUFBWTtBQUNaLDRCQUE0QjtBQUM1QiwwREFBMEQ7QUFDMUQsU0FBVSxTQUFTLENBQUMsZUFBOEM7SUFBRyxnQkFBZ0I7U0FBaEIsVUFBZ0IsRUFBaEIscUJBQWdCLEVBQWhCLElBQWdCO1FBQWhCLCtCQUFnQjs7SUFDcEYsSUFBTyxVQUFVLEdBQXlDLFNBQVMsQ0FBQztJQUNwRSxJQUFPLGNBQWMsR0FBRyxDQUFDLE9BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQztJQUUvRCxJQUFLLE9BQU8sR0FBRyxlQUF5QixDQUFDO0lBQ3pDLElBQUksY0FBYyxFQUFFO1FBQ25CLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDYixLQUFLLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUUsQ0FBQyxFQUFFO1lBQzdDLE9BQU8sSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDdEIsT0FBTyxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUUsR0FBRyxDQUFDO2FBQ2pDO1lBQ0QsZ0NBQWdDO1NBQ2hDO0tBQ0Q7SUFFRCxJQUFJLE1BQU0sS0FBSyxPQUFPLEVBQUU7UUFDdkIsVUFBVSxHQUFHO1lBQ1osdUJBQXVCLEVBQUUscUJBQXFCO1lBQzlDLHlCQUF5QixFQUFFLFlBQVk7WUFDdkMsOEJBQThCLEVBQUUsZ0NBQWdDO1lBQ2hFLG9DQUFvQyxFQUFFLHVCQUF1QjtZQUM3RCxnREFBZ0QsRUFBRSxpQkFBaUI7WUFDbkUscUNBQXFDLEVBQUUsb0JBQW9CO1lBQzNELGlCQUFpQixFQUFFLGNBQWM7WUFDakMsZ0JBQWdCLEVBQUUsVUFBVTtZQUM1QixtQkFBbUIsRUFBRSxTQUFTO1lBQzlCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsTUFBTTtZQUNuQixVQUFVLEVBQUUsS0FBSztZQUNqQixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsSUFBSTtZQUNoQixVQUFVLEVBQUUsSUFBSTtZQUNoQixhQUFhLEVBQUUsS0FBSztZQUNwQixPQUFPLEVBQUUsU0FBUztZQUNsQixjQUFjLEVBQUUsTUFBTTtZQUN0QixnQ0FBZ0MsRUFBRSxpQkFBaUI7WUFDbkQsaURBQWlELEVBQUUsNkJBQTZCO1lBQ2hGLG1DQUFtQyxFQUFFLHVCQUF1QjtZQUM1RCwwQkFBMEIsRUFBRSxvQkFBb0I7WUFDaEQsOEJBQThCLEVBQUUsb0JBQW9CO1lBQ3BELG1DQUFtQyxFQUFFLDBCQUEwQjtTQUMvRCxDQUFDO0tBQ0Y7SUFDRCxJQUFLLFVBQVUsR0FBRyxPQUFPLENBQUM7SUFDMUIsSUFBSSxVQUFVLEVBQUU7UUFDZixJQUFJLE9BQU8sSUFBSSxVQUFVLEVBQUU7WUFFMUIsVUFBVSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNqQztLQUNEO0lBQ0QsSUFBSSxjQUFjLEVBQUU7UUFDbkIsS0FBSyxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFFLENBQUMsRUFBRTtZQUM3QyxVQUFVLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBRSxJQUFJLEdBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUUsQ0FBQztTQUN6RTtRQUNELFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFFLE1BQU0sRUFBRSxJQUFJLENBQUUsQ0FBQztRQUMvQyw2QkFBNkI7UUFDN0IsbURBQW1EO0tBQ3BEO0lBQ0QsT0FBUSxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQUVELElBQU8sVUFBVSxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFPLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDOUIsSUFBTyxhQUFhLEdBQUcsVUFBVSxDQUFDO0FBQ2xDLElBQU8saUJBQWlCLEdBQUcsVUFBVSxDQUFDO0FBQ3RDLElBQU8sUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLElBQU8sVUFBVSxHQUFHLENBQUMsQ0FBQztBQUN0QixJQUFPLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4QixJQUFPLE1BQWMsQ0FBQztBQUN0QixJQUFPLGNBQWMsR0FBRyxtQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ3ZDLFNBQVUsaUJBQWlCLENBQUMsQ0FBaUI7SUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUNELFNBQWdCLFFBQVE7Ozs7OztvQkFDdkIsbUJBQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDO3lCQUN0RCxNQUFNLENBQUMsa0JBQWtCLENBQUM7eUJBQzFCLE1BQU0sQ0FBQyxZQUFZLENBQUM7eUJBQ3BCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBRXRCLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLENBQUMsTUFBTSxDQUFDO29CQUN0RCxJQUFJLGNBQWMsQ0FBQyxNQUFNLEVBQUU7d0JBQzFCLE1BQU0sR0FBRyxjQUFjLENBQUMsTUFBTSxDQUFDO3FCQUMvQjtvQkFFRCxxQkFBTyxJQUFJLEVBQUUsQ0FDWCxPQUFLLENBQUEsQ0FBRSxVQUFPLENBQUM7OztnQ0FDZixJQUFJLGNBQWMsQ0FBQyxJQUFJLEVBQUU7b0NBQ3hCLE1BQU0sQ0FBQyxDQUFDO2lDQUNSO3FDQUFNO29DQUVOLE9BQU8sQ0FBQyxHQUFHLENBQUUsWUFBVSxDQUFDLENBQUMsT0FBUyxDQUFFLENBQUM7b0NBQzlCLFFBQVEsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO29DQUM3QixRQUFRLENBQUMsVUFBVSxDQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUUsQ0FBQztvQ0FFakQsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUU7cUNBQ25EO2lDQUNEOzs7NkJBQ0QsQ0FBQyxDQUNELFNBQU8sQ0FBQSxDQUFDOzRCQUNSLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDckIsQ0FBQyxDQUFDLEVBQUE7O29CQWhCSCxTQWdCRyxDQUFDOzs7OztDQUNKO0FBQ0QsUUFBUSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7IC8vIGZpbGUgc3lzdGVtXHJcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjsgIC8vIG9yIHBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxyXG5pbXBvcnQgeyBwcm9ncmFtLCBDb21tYW5kZXJFcnJvciB9IGZyb20gJ2NvbW1hbmRlcic7XHJcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcclxuY29uc3QgIHNldHRpbmdTdGFydExhYmVsID0gXCLoqK3lrpo6XCI7XHJcbmNvbnN0ICBzZXR0aW5nU3RhcnRMYWJlbEVuID0gXCJzZXR0aW5nczpcIjtcclxuY29uc3QgIHRlbXBsYXRlTGFiZWwgPSBcIiN0ZW1wbGF0ZTpcIjtcclxuY29uc3QgIHRlbXBsYXRlQXRTdGFydExhYmVsID0gXCIjdGVtcGxhdGUtYXQoXCI7XHJcbmNvbnN0ICB0ZW1wbGF0ZUF0RW5kTGFiZWwgPSBcIik6XCI7XHJcbmNvbnN0ICB0ZW1wb3JhcnlMYWJlbHMgPSBbXCIj4piFTm93OlwiLCBcIiNub3c6XCIsIFwiI+KYheabuOOBjeOBi+OBkVwiLCBcIiPimIXmnKrnorroqo1cIl07XHJcbmNvbnN0ICBzZWNyZXRMYWJlbCA9IFwiI+KYheenmOWvhlwiO1xyXG5jb25zdCAgc2VjcmV0TGFiZWxFbiA9IFwiI3NlY3JldFwiO1xyXG5jb25zdCAgc2VjcmV0RXhhbWxlTGFiZWwgPSBcIiPimIXnp5jlr4Y65LuuXCI7XHJcbmNvbnN0ICBzZWNyZXRFeGFtbGVMYWJlbEVuID0gXCIjc2VjcmV0OmV4YW1wbGVcIjtcclxuY29uc3QgIHJlZmVyUGF0dGVybiA9IC8o5LiK6KiYfOS4i+iomHxhYm92ZXxmb2xsb3dpbmcpKOOAjHxcXFspKFte44CNXSopKOOAjXxcXF0pL2c7XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgbWFpbigpIHtcclxuXHRjb25zdCAgaW5wdXRGaWxlUGF0aCA9IGF3YWl0IGlucHV0UGF0aCggdHJhbnNsYXRlKCdZQU1MIFVURi04IGZpbGUgcGF0aD4nKSApO1xyXG5cdGxldCAgcHJldmlvdXNUZW1wbGF0ZUNvdW50ID0gMDtcclxuXHRmb3IoOzspIHtcclxuXHRcdGxldCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5wdXRGaWxlUGF0aCksXHJcblx0XHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHRcdH0pO1xyXG5cdFx0bGV0ICBpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRsZXQgIHNldHRpbmc6IFNldHRpbmdzID0ge307XHJcblx0XHRsZXQgIHNldHRpbmdDb3VudCA9IDA7XHJcblx0XHRsZXQgIHByZXZpb3VzTGluZSA9ICcnO1xyXG5cdFx0bGV0ICBsaW5lTnVtID0gMDtcclxuXHRcdGxldCAgdGVtcGxhdGVDb3VudCA9IDA7XHJcblx0XHRsZXQgIGVycm9yQ291bnQgPSAwO1xyXG5cdFx0bGV0ICB3YXJuaW5nQ291bnQgPSAwO1xyXG5cdFx0bGV0ICBzZWNyZXRMYWJlbENvdW50ID0gMDtcclxuXHRcdGNvbnN0ICBsaW5lcyA9IFtdO1xyXG5cdFx0Y29uc3QgIGtleXdvcmRzOiBTZWFyY2hLZXl3b3JkW10gPSBbXTtcclxuXHJcblx0XHRmb3IgYXdhaXQgKGNvbnN0IGxpbmUxIG9mIHJlYWRlcikge1xyXG5cdFx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRcdGxpbmVzLnB1c2gobGluZSk7XHJcblx0XHRcdGxpbmVOdW0gKz0gMTtcclxuXHRcdFx0Y29uc3QgIHByZXZpb3VzSXNSZWFkaW5nU2V0dGluZyA9IGlzUmVhZGluZ1NldHRpbmc7XHJcblxyXG5cdFx0XHQvLyBzZXR0aW5nID0gLi4uXHJcblx0XHRcdGlmIChsaW5lLnRyaW0oKSA9PT0gc2V0dGluZ1N0YXJ0TGFiZWwpIHtcclxuXHRcdFx0XHRpZiAoc2V0dGluZ0NvdW50ID49IDEpIHtcclxuXHRcdFx0XHRcdG9uRW5kT2ZTZXR0aW5nKHNldHRpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0c2V0dGluZyA9IHt9O1xyXG5cdFx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGlzRW5kT2ZTZXR0aW5nKGxpbmUsIGlzUmVhZGluZ1NldHRpbmcpKSB7XHJcblx0XHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRcdFx0Y29uc3QgIHNlcGFyYXRvciA9IGxpbmUuaW5kZXhPZignOicpO1xyXG5cdFx0XHRcdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5ID0gbGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShsaW5lLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0dGluZ1trZXldID0ge3ZhbHVlLCBpc1JlZmVyZW5jZWQ6IGZhbHNlLCBsaW5lTnVtfTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbCAgJiYgIGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiBcInByZXZpb3VzTGluZVwiIGhhcyBcInRlbXBsYXRlXCIgcmVwbGFjZWQgY29udGVudHMuXHJcblx0XHRcdGNvbnN0ICB0ZW1wbGF0ZVRhZyA9IHBhcnNlVGVtcGxhdGVUYWcobGluZSk7XHJcblx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0ID49IDEgICYmICB0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnQ29udGVudHMnKX06ICR7bGluZS50cmltKCl9YCk7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0Vycm9yJyl9OiAke3RyYW5zbGF0ZSgnVGhlIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiAwJyl9YCk7XHJcblx0XHRcdFx0dGVtcGxhdGVUYWcuaXNGb3VuZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRlbXBsYXRlQ291bnQgKz0gMTtcclxuXHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRlbXBsYXRlVGFnLmlzRm91bmQpIHtcclxuXHRcdFx0XHR0ZW1wbGF0ZUNvdW50ICs9IDE7XHJcblx0XHRcdFx0Y29uc3QgIGNoZWNraW5nTGluZSA9IGxpbmVzW2xpbmVzLmxlbmd0aCAtIDEgKyB0ZW1wbGF0ZVRhZy5saW5lTnVtT2Zmc2V0XTtcclxuXHRcdFx0XHRjb25zdCAgZXhwZWN0ZWQgPSBnZXRFeHBlY3RlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUpO1xyXG5cclxuXHRcdFx0XHRpZiAoY2hlY2tpbmdMaW5lLmluZGV4T2YoZXhwZWN0ZWQpID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJcIik7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtsaW5lTnVtICsgdGVtcGxhdGVUYWcubGluZU51bU9mZnNldH1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtjaGVja2luZ0xpbmUudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ0V4cGVjdGVkJyl9OiAke2V4cGVjdGVkfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1RlbXBsYXRlJyl9OiAke3RlbXBsYXRlVGFnLnRlbXBsYXRlfWApO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRlcnJvckNvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBub3QgXCIj4piFTm93OlwiLlxyXG5cdFx0XHRmb3IgKGxldCB0ZW1wb3JhcnlMYWJlbCBvZiB0ZW1wb3JhcnlMYWJlbHMpIHtcclxuXHRcdFx0XHRpZiAobGluZS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGVtcG9yYXJ5TGFiZWwudG9Mb3dlckNhc2UoKSkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnV2FybmluZ0xpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtsaW5lLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0d2FybmluZ0NvdW50ICs9IDE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBDaGVjayBpZiB0aGVyZSBpcyBub3Qgc2VjcmV0IHRhZy5cclxuXHRcdFx0aWYgKGxpbmUuaW5kZXhPZiggc2VjcmV0TGFiZWwgKSAhPT0gbm90Rm91bmQgIHx8ICBsaW5lLmluZGV4T2YoIHNlY3JldExhYmVsRW4gKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRpZiAobGluZS5pbmRleE9mKCBzZWNyZXRFeGFtbGVMYWJlbCApID09PSBub3RGb3VuZCAgJiYgIGxpbmUuaW5kZXhPZiggc2VjcmV0RXhhbWxlTGFiZWxFbiApID09PSBub3RGb3VuZCkge1xyXG5cdFx0XHRcdFx0aWYgKHNlY3JldExhYmVsQ291bnQgPT09IDApIHsgIC8vIEJlY2F1c2UgdGhlcmUgd2lsbCBiZSBtYW55IHNlY3JldCBkYXRhLlxyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIlwiKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nTGluZScpfTogJHtsaW5lTnVtfWApO1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnVGhpcyBpcyBhIHNlY3JldCB2YWx1ZS4nKX1gKTtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJyAgJysgdHJhbnNsYXRlYENoYW5nZSBcIiR7c2VjcmV0TGFiZWxFbn1cIiB0byBcIiR7c2VjcmV0RXhhbWxlTGFiZWxFbn1cIi4nYCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcrIHRyYW5zbGF0ZWBDaGFuZ2UgXCIke3NlY3JldExhYmVsfVwiIHRvIFwiJHtzZWNyZXRFeGFtbGVMYWJlbH1cIi4nYCk7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdTZXR0aW5nSW5kZXgnKX06ICR7c2V0dGluZ0NvdW50fWApO1xyXG5cdFx0XHRcdFx0XHR3YXJuaW5nQ291bnQgKz0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdHNlY3JldExhYmVsQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEdldCB0aXRsZXMgYWJvdmUgb3IgZm9sbG93aW5nLlxyXG5cdFx0XHRsZXQgIG1hdGNoOiBSZWdFeHBFeGVjQXJyYXkgfCBudWxsO1xyXG5cdFx0XHRyZWZlclBhdHRlcm4ubGFzdEluZGV4ID0gMDtcclxuXHJcblx0XHRcdHdoaWxlICggKG1hdGNoID0gcmVmZXJQYXR0ZXJuLmV4ZWMoIGxpbmUgKSkgIT09IG51bGwgKSB7XHJcblx0XHRcdFx0Y29uc3QgIGtleXdvcmQgPSBuZXcgU2VhcmNoS2V5d29yZCgpO1xyXG5cdFx0XHRcdGNvbnN0ICBsYWJlbCA9IG1hdGNoWzFdO1xyXG5cdFx0XHRcdGtleXdvcmQua2V5d29yZCA9IG1hdGNoWzNdO1xyXG5cdFx0XHRcdGlmIChsYWJlbCA9PT0gXCLkuIroqJhcIiAgfHwgIGxhYmVsID09PSBcImFib3ZlXCIpIHtcclxuXHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gbGluZU51bSAtIDE7XHJcblx0XHRcdFx0XHRrZXl3b3JkLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5BYm92ZTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGxhYmVsID09PSBcIuS4i+iomFwiICB8fCAgbGFiZWwgPT09IFwiZm9sbG93aW5nXCIpIHtcclxuXHRcdFx0XHRcdGtleXdvcmQuc3RhcnRMaW5lTnVtID0gbGluZU51bSArIDE7XHJcblx0XHRcdFx0XHRrZXl3b3JkLmRpcmVjdGlvbiA9IERpcmVjdGlvbi5Gb2xsb3dpbmc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGtleXdvcmRzLnB1c2goa2V5d29yZCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHByZXZpb3VzTGluZSA9IGxpbmU7XHJcblx0XHR9XHJcblx0XHRpZiAoc2V0dGluZ0NvdW50ID49IDEpIHtcclxuXHRcdFx0b25FbmRPZlNldHRpbmcoc2V0dGluZyk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlcmUgaXMgdGhlIHRpdGxlIGFib3ZlIG9yIGZvbGxvd2luZy5cclxuXHRcdHJlYWRlciA9IHJlYWRsaW5lLmNyZWF0ZUludGVyZmFjZSh7XHJcblx0XHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKGlucHV0RmlsZVBhdGgpLFxyXG5cdFx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0XHR9KTtcclxuXHRcdGxpbmVOdW0gPSAwO1xyXG5cclxuXHRcdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRcdGNvbnN0ICBsaW5lOiBzdHJpbmcgPSBsaW5lMTtcclxuXHRcdFx0bGluZU51bSArPSAxO1xyXG5cclxuXHRcdFx0Zm9yIChjb25zdCBrZXl3b3JkIG9mIGtleXdvcmRzKSB7XHJcblx0XHRcdFx0aWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uQWJvdmUpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5lTnVtIDw9IGtleXdvcmQuc3RhcnRMaW5lTnVtKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAobGluZS5pbmRleE9mKGtleXdvcmQua2V5d29yZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0a2V5d29yZC5zdGFydExpbmVOdW0gPSBmb3VuZEZvckFib3ZlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChrZXl3b3JkLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkZvbGxvd2luZykge1xyXG5cdFx0XHRcdFx0aWYgKGxpbmVOdW0gPj0ga2V5d29yZC5zdGFydExpbmVOdW0pIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmIChsaW5lLmluZGV4T2Yoa2V5d29yZC5rZXl3b3JkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0XHRrZXl3b3JkLnN0YXJ0TGluZU51bSA9IGZvdW5kRm9yRm9sbG93aW5nO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmb3IgKGNvbnN0IGtleXdvcmQgb2Yga2V5d29yZHMpIHtcclxuXHRcdFx0aWYgKGtleXdvcmQuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uQWJvdmUpIHtcclxuXHRcdFx0XHRpZiAoa2V5d29yZC5zdGFydExpbmVOdW0gIT09IGZvdW5kRm9yQWJvdmUpIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcnKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGAke3RyYW5zbGF0ZSgnRXJyb3JMaW5lJyl9OiAke2tleXdvcmQuc3RhcnRMaW5lTnVtICsgMX1gKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCcgICcgKyB0cmFuc2xhdGVgTm90IGZvdW5kIFwiJHtrZXl3b3JkLmtleXdvcmR9XCIgYWJvdmVgKTtcclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoa2V5d29yZC5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Gb2xsb3dpbmcpIHtcclxuXHRcdFx0XHRpZiAoa2V5d29yZC5zdGFydExpbmVOdW0gIT09IGZvdW5kRm9yRm9sbG93aW5nKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ0Vycm9yTGluZScpfTogJHtrZXl3b3JkLnN0YXJ0TGluZU51bSAtIDF9YCk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnICAnICsgdHJhbnNsYXRlYE5vdCBmb3VuZCBcIiR7a2V5d29yZC5rZXl3b3JkfVwiIGZvbGxvd2luZ2ApO1xyXG5cdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNob3cgdGhlIHJlc3VsdFxyXG5cdFx0Y29uc29sZS5sb2coJycpO1xyXG5cdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdXYXJuaW5nJyl9OiAke3dhcm5pbmdDb3VudH0sICR7dHJhbnNsYXRlKCdFcnJvcicpfTogJHtlcnJvckNvdW50fWApO1xyXG5cdFx0aWYgKHByZXZpb3VzVGVtcGxhdGVDb3VudCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3RlbXBsYXRlIGNvdW50Jyl9ID0gJHtwcmV2aW91c1RlbXBsYXRlQ291bnR9ICgke3RyYW5zbGF0ZSgnaW4gcHJldmlvdXMgY2hlY2snKX0pYCk7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ3RlbXBsYXRlIGNvdW50Jyl9ID0gJHt0ZW1wbGF0ZUNvdW50fWApO1xyXG5cclxuXHRcdC8vIFJlc2NhbiBvciBjaGFuZ2UgYSB2YWx1ZVxyXG5cdFx0bGV0ICBsb29wID0gdHJ1ZTtcclxuXHRcdHdoaWxlIChsb29wKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKHRyYW5zbGF0ZSgnUHJlc3MgRW50ZXIga2V5IHRvIHJldHJ5IGNoZWNraW5nLicpKTtcclxuXHJcblx0XHRcdGNvbnN0ICBrZXkgPSBhd2FpdCBpbnB1dCh0cmFuc2xhdGUoJ1RoZSBsaW5lIG51bWJlciB0byBjaGFuZ2UgdGhlIHZhcmlhYmxlIHZhbHVlID4nKSk7XHJcblx0XHRcdGVycm9yQ291bnQgPSAwO1xyXG5cdFx0XHRpZiAoa2V5ID09PSAnZXhpdCcpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0gZWxzZSBpZiAoa2V5ICE9PSAnJykge1xyXG5cdFx0XHRcdGNvbnN0ICBsaW5lTnVtID0gcGFyc2VJbnQoa2V5KTtcclxuXHRcdFx0XHRjb25zdCAgY2hhbmdpbmdTZXR0aW5nSW5kZXggPSBhd2FpdCBnZXRTZXR0aW5nSW5kZXhGcm9tTGluZU51bShpbnB1dEZpbGVQYXRoLCBsaW5lTnVtKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtjaGFuZ2luZ1NldHRpbmdJbmRleH1gKTtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGUoJ0VudGVyIG9ubHk6IGZpbmlzaCB0byBpbnB1dCBzZXR0aW5nJykpO1xyXG5cdFx0XHRcdGZvciAoOzspIHtcclxuXHRcdFx0XHRcdGNvbnN0ICBrZXlWYWx1ZSA9IGF3YWl0IGlucHV0KHRyYW5zbGF0ZSgna2V5OiBuZXdfdmFsdWU+JykpO1xyXG5cdFx0XHRcdFx0aWYgKGtleVZhbHVlID09PSAnJykge1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVycm9yQ291bnQgKz0gYXdhaXQgY2hhbmdlU2V0dGluZ0J5S2V5VmFsdWUoaW5wdXRGaWxlUGF0aCwgY2hhbmdpbmdTZXR0aW5nSW5kZXgsIGtleVZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0bG9vcCA9IChlcnJvckNvdW50ID49IDEpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFJlc2NhblxyXG5cdFx0Y29uc29sZS5sb2coJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcclxuXHRcdHByZXZpb3VzVGVtcGxhdGVDb3VudCA9IHRlbXBsYXRlQ291bnRcclxuXHRcdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNldHRpbmcpKSB7XHJcblx0XHRcdHNldHRpbmdba2V5XS5pc1JlZmVyZW5jZWQgPSBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vIG9uRW5kT2ZTZXR0aW5nXHJcbmZ1bmN0aW9uIG9uRW5kT2ZTZXR0aW5nKHNldHRpbmc6IFNldHRpbmdzKSB7XHJcblx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZykpIHtcclxuXHRcdGlmICghc2V0dGluZ1trZXldLmlzUmVmZXJlbmNlZCkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0cmFuc2xhdGVgTm90IHJlZmVyZW5jZWQ6ICR7a2V5fSBpbiBsaW5lICR7c2V0dGluZ1trZXldLmxpbmVOdW19YCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBnZXRTZXR0aW5nSW5kZXhGcm9tTGluZU51bVxyXG5hc3luYyBmdW5jdGlvbiAgZ2V0U2V0dGluZ0luZGV4RnJvbUxpbmVOdW0oaW5wdXRGaWxlUGF0aDogc3RyaW5nLCB0YXJnZXRMaW5lTnVtOiBudW1iZXIpOiBQcm9taXNlPG51bWJlcj4ge1xyXG5cdGNvbnN0ICByZWFkZXIgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0aW5wdXQ6IGZzLmNyZWF0ZVJlYWRTdHJlYW0oaW5wdXRGaWxlUGF0aCksXHJcblx0XHRjcmxmRGVsYXk6IEluZmluaXR5XHJcblx0fSk7XHJcblx0bGV0ICBzZXR0aW5nQ291bnQgPSAwO1xyXG5cdGxldCAgbGluZU51bSA9IDA7XHJcblxyXG5cdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRsaW5lTnVtICs9IDE7XHJcblxyXG5cdFx0aWYgKGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbCAgfHwgIGxpbmUudHJpbSgpID09PSBzZXR0aW5nU3RhcnRMYWJlbEVuKSB7XHJcblx0XHRcdHNldHRpbmdDb3VudCArPSAxO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChsaW5lTnVtID09PSB0YXJnZXRMaW5lTnVtKSB7XHJcblx0XHRcdHJldHVybiAgc2V0dGluZ0NvdW50O1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gIDA7XHJcbn1cclxuXHJcbi8vIGNoYW5nZVNldHRpbmdCeUtleVZhbHVlXHJcbmFzeW5jIGZ1bmN0aW9uICBjaGFuZ2VTZXR0aW5nQnlLZXlWYWx1ZShpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIGNoYW5naW5nU2V0dGluZ0luZGV4OiBudW1iZXIsXHJcblx0XHRrZXlWYWx1ZTogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+LyplcnJvckNvdW50Ki8ge1xyXG5cclxuXHRjb25zdCAgc2VwYXJhdG9yID0ga2V5VmFsdWUuaW5kZXhPZignOicpO1xyXG5cdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRjb25zdCAga2V5ID0ga2V5VmFsdWUuc3Vic3RyKDAsIHNlcGFyYXRvcikudHJpbSgpO1xyXG5cdFx0Y29uc3QgIHZhbHVlID0gZ2V0VmFsdWUoa2V5VmFsdWUsIHNlcGFyYXRvcik7XHJcblxyXG5cdFx0cmV0dXJuICBjaGFuZ2VTZXR0aW5nKGlucHV0RmlsZVBhdGgsIGNoYW5naW5nU2V0dGluZ0luZGV4LCBrZXksIHZhbHVlKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuICAxO1xyXG5cdH1cclxufVxyXG5cclxuLy8gY2hhbmdlU2V0dGluZ1xyXG5hc3luYyBmdW5jdGlvbiAgY2hhbmdlU2V0dGluZyhpbnB1dEZpbGVQYXRoOiBzdHJpbmcsIGNoYW5naW5nU2V0dGluZ0luZGV4OiBudW1iZXIsXHJcblx0XHRjaGFuZ2luZ0tleTogc3RyaW5nLCBjaGFuZ2VkVmFsdWVBbmRDb21tZW50OiBzdHJpbmcpOiBQcm9taXNlPG51bWJlcj4vKmVycm9yQ291bnQqLyB7XHJcblxyXG5cdGNvbnN0ICBiYWNrVXBGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGggK1wiLmJhY2t1cFwiO1xyXG5cdGlmICghZnMuZXhpc3RzU3luYyhiYWNrVXBGaWxlUGF0aCkpIHtcclxuXHRcdGZzLmNvcHlGaWxlU3luYyhpbnB1dEZpbGVQYXRoLCBiYWNrVXBGaWxlUGF0aCk7XHJcblx0fVxyXG5cclxuXHRjb25zdCAgb2xkRmlsZVBhdGggPSBpbnB1dEZpbGVQYXRoO1xyXG5cdGNvbnN0ICBuZXdGaWxlUGF0aCA9IGlucHV0RmlsZVBhdGggK1wiLm5ld1wiO1xyXG5cdGNvbnN0ICB3cml0ZXIgPSBuZXcgV3JpdGVCdWZmZXIoZnMuY3JlYXRlV3JpdGVTdHJlYW0obmV3RmlsZVBhdGgpKTtcclxuXHRjb25zdCAgcmVhZGVyID0gcmVhZGxpbmUuY3JlYXRlSW50ZXJmYWNlKHtcclxuXHRcdGlucHV0OiBmcy5jcmVhdGVSZWFkU3RyZWFtKG9sZEZpbGVQYXRoKSxcclxuXHRcdGNybGZEZWxheTogSW5maW5pdHlcclxuXHR9KTtcclxuXHRjb25zdCAgbGluZXMgPSBbXTtcclxuXHRsZXQgIGlzUmVhZGluZ1NldHRpbmcgPSBmYWxzZTtcclxuXHRsZXQgIHNldHRpbmc6IFNldHRpbmdzID0ge307XHJcblx0bGV0ICBzZXR0aW5nQ291bnQgPSAwO1xyXG5cdGxldCAgcHJldmlvdXNMaW5lID0gJyc7XHJcblx0bGV0ICBjaGFuZ2VkVmFsdWUgPSBnZXRDaGFuZ2VkVmFsdWUoY2hhbmdlZFZhbHVlQW5kQ29tbWVudCk7XHJcblx0bGV0ICBsaW5lTnVtID0gMDtcclxuXHRsZXQgIGVycm9yQ291bnQgPSAwO1xyXG5cdGxldCAgaXNDaGFuZ2luZyA9IGZhbHNlO1xyXG5cdFxyXG5cdGZvciBhd2FpdCAoY29uc3QgbGluZTEgb2YgcmVhZGVyKSB7XHJcblx0XHRjb25zdCAgbGluZTogc3RyaW5nID0gbGluZTE7XHJcblx0XHRsaW5lcy5wdXNoKGxpbmUpO1xyXG5cdFx0bGluZU51bSArPSAxO1xyXG5cdFx0bGV0ICBvdXRwdXQgPSBmYWxzZTtcclxuXHJcblx0XHQvLyBzZXR0aW5nID0gLi4uXHJcblx0XHRpZiAobGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsICB8fCAgbGluZS50cmltKCkgPT09IHNldHRpbmdTdGFydExhYmVsRW4pIHtcclxuXHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IHRydWU7XHJcblx0XHRcdHNldHRpbmcgPSB7fTtcclxuXHRcdFx0c2V0dGluZ0NvdW50ICs9IDE7XHJcblx0XHRcdGlmIChjaGFuZ2luZ1NldHRpbmdJbmRleCA9PT0gYWxsU2V0dGluZykge1xyXG5cdFx0XHRcdGlzQ2hhbmdpbmcgPSB0cnVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlzQ2hhbmdpbmcgPSAoc2V0dGluZ0NvdW50ID09PSBjaGFuZ2luZ1NldHRpbmdJbmRleCk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAoaXNFbmRPZlNldHRpbmcobGluZSwgaXNSZWFkaW5nU2V0dGluZykpIHtcclxuXHRcdFx0aXNSZWFkaW5nU2V0dGluZyA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlzQ2hhbmdpbmcpIHtcclxuXHJcblx0XHRcdGlmIChpc1JlYWRpbmdTZXR0aW5nKSB7XHJcblx0XHRcdFx0Y29uc3QgIHNlcGFyYXRvciA9IGxpbmUuaW5kZXhPZignOicpO1xyXG5cdFx0XHRcdGlmIChzZXBhcmF0b3IgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAga2V5ID0gbGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yKS50cmltKCk7XHJcblx0XHRcdFx0XHRjb25zdCAgdmFsdWUgPSBnZXRWYWx1ZShsaW5lLCBzZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlICE9PSAnJykge1xyXG5cclxuXHRcdFx0XHRcdFx0c2V0dGluZ1trZXldID0ge3ZhbHVlLCBpc1JlZmVyZW5jZWQ6IGZhbHNlLCBsaW5lTnVtfTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoa2V5ICsgJzonICE9PSBzZXR0aW5nU3RhcnRMYWJlbCAgJiYgIGtleSArICc6JyAhPT0gc2V0dGluZ1N0YXJ0TGFiZWxFbikge1xyXG5cdFx0XHRcdFx0XHRpc1JlYWRpbmdTZXR0aW5nID0gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKGtleSA9PT0gY2hhbmdpbmdLZXkpIHtcclxuXHRcdFx0XHRcdFx0Y29uc3QgIGNvbW1lbnRJbmRleCA9IGxpbmUuaW5kZXhPZignIycsIHNlcGFyYXRvcik7XHJcblx0XHRcdFx0XHRcdGxldCAgY29tbWVudD0gJyc7XHJcblx0XHRcdFx0XHRcdGlmIChjb21tZW50SW5kZXggIT09IG5vdEZvdW5kICAmJiAgY2hhbmdlZFZhbHVlQW5kQ29tbWVudC5pbmRleE9mKCcjJykgPT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdFx0Y29tbWVudCA9ICcgICcgKyBsaW5lLnN1YnN0cihjb21tZW50SW5kZXgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR3cml0ZXIud3JpdGUobGluZS5zdWJzdHIoMCwgc2VwYXJhdG9yICsgMSkgKycgJysgY2hhbmdlZFZhbHVlQW5kQ29tbWVudCArIGNvbW1lbnQgKyBcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0b3V0cHV0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBPdXQgb2Ygc2V0dGluZ3NcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zdCAgdGVtcGxhdGVUYWcgPSBwYXJzZVRlbXBsYXRlVGFnKGxpbmUpO1xyXG5cdFx0XHRcdGlmICh0ZW1wbGF0ZVRhZy5pc0ZvdW5kKSB7XHJcblx0XHRcdFx0XHRjb25zdCAgY2hlY2tpbmdMaW5lID0gbGluZXNbbGluZXMubGVuZ3RoIC0gMSArIHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXRdO1xyXG5cdFx0XHRcdFx0Y29uc3QgIGV4cGVjdGVkID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlVGFnLnRlbXBsYXRlKTtcclxuXHRcdFx0XHRcdGNvbnN0ICBjaGFuZ2VkID0gZ2V0Q2hhbmdlZExpbmUoc2V0dGluZywgdGVtcGxhdGVUYWcudGVtcGxhdGUsIGNoYW5naW5nS2V5LCBjaGFuZ2VkVmFsdWUpO1xyXG5cclxuXHRcdFx0XHRcdGlmIChjaGVja2luZ0xpbmUuaW5kZXhPZihleHBlY3RlZCkgIT09IG5vdEZvdW5kKSB7XHJcblx0XHRcdFx0XHRcdGNvbnN0ICBiZWZvcmUgPSBleHBlY3RlZDtcclxuXHRcdFx0XHRcdFx0Y29uc3QgIGFmdGVyID0gY2hhbmdlZDtcclxuXHRcdFx0XHRcdFx0aWYgKHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXQgPD0gLTEpIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zdCAgYWJvdmVMaW5lID0gbGluZXNbbGluZXMubGVuZ3RoIC0gMSArIHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXRdO1xyXG5cdFx0XHRcdFx0XHRcdHdyaXRlci5yZXBsYWNlQWJvdmVMaW5lKHRlbXBsYXRlVGFnLmxpbmVOdW1PZmZzZXQsXHJcblx0XHRcdFx0XHRcdFx0XHRhYm92ZUxpbmUucmVwbGFjZShiZWZvcmUsIGFmdGVyKStcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0d3JpdGVyLndyaXRlKGxpbmUucmVwbGFjZShiZWZvcmUsIGFmdGVyKSArXCJcXG5cIik7XHJcblx0XHRcdFx0XHRcdFx0b3V0cHV0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjaGVja2luZ0xpbmUuaW5kZXhPZihjaGFuZ2VkKSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0XHRcdFx0Ly8gRG8gbm90aGluZ1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKGVycm9yQ291bnQgPT09IDApIHsgLy8gU2luY2Ugb25seSBvbmUgb2xkIHZhbHVlIGNhbiBiZSByZXBsYWNlZCBhdCBhIHRpbWVcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnJyk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCR7dHJhbnNsYXRlKCdFcnJvckxpbmUnKX06ICR7bGluZU51bX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnRXJyb3InKX06ICR7dHJhbnNsYXRlKCdOb3QgZm91bmQgYW55IHJlcGxhY2luZyB0YXJnZXQnKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnU29sdXRpb24nKX06ICR7dHJhbnNsYXRlKCdTZXQgb2xkIHZhbHVlIGF0IHNldHRpbmdzIGluIHRoZSByZXBsYWNpbmcgZmlsZScpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdDb250ZW50cycpfTogJHtsaW5lLnRyaW0oKX1gKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhgICAke3RyYW5zbGF0ZSgnRXhwZWN0ZWQnKX06ICR7ZXhwZWN0ZWQudHJpbSgpfWApO1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGAgICR7dHJhbnNsYXRlKCdUZW1wbGF0ZScpfTogJHt0ZW1wbGF0ZVRhZy50ZW1wbGF0ZS50cmltKCl9YCk7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coYCAgJHt0cmFuc2xhdGUoJ1NldHRpbmdJbmRleCcpfTogJHtzZXR0aW5nQ291bnR9YCk7XHJcblx0XHRcdFx0XHRcdFx0ZXJyb3JDb3VudCArPSAxO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIW91dHB1dCkge1xyXG5cdFx0XHR3cml0ZXIud3JpdGUobGluZSArXCJcXG5cIik7XHJcblx0XHR9XHJcblx0XHRwcmV2aW91c0xpbmUgPSBsaW5lO1xyXG5cdH1cclxuXHR3cml0ZXIuZW5kKCk7XHJcblx0cmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSkgPT4ge1xyXG5cdFx0d3JpdGVyLm9uKCdmaW5pc2gnLCAoKSA9PiB7XHJcblx0XHRcdGZzLmNvcHlGaWxlU3luYyhuZXdGaWxlUGF0aCwgaW5wdXRGaWxlUGF0aCk7XHJcblx0XHRcdGRlbGV0ZUZpbGUobmV3RmlsZVBhdGgpO1xyXG5cdFx0XHRyZXNvbHZlKGVycm9yQ291bnQpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIGlzRW5kT2ZTZXR0aW5nXHJcbmZ1bmN0aW9uICBpc0VuZE9mU2V0dGluZyhsaW5lOiBzdHJpbmcsIGlzUmVhZGluZ1NldHRpbmc6IGJvb2xlYW4pOiBib29sZWFuIHtcclxuXHRsZXQgIHJldHVyblZhbHVlID0gZmFsc2U7XHJcblx0aWYgKGlzUmVhZGluZ1NldHRpbmcpIHtcclxuXHRcdGNvbnN0IGNvbW1lbnQgPSBsaW5lLmluZGV4T2YoJyMnKTtcclxuXHRcdGxldCBsZWZ0T2ZDb21tZW50OiBzdHJpbmc7XHJcblx0XHRpZiAoY29tbWVudCAhPT0gbm90Rm91bmQpIHtcclxuXHRcdFx0bGVmdE9mQ29tbWVudCA9IGxpbmUuc3Vic3RyKDAsIGxpbmUuaW5kZXhPZignIycpKS50cmltKCk7XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bGVmdE9mQ29tbWVudCA9IGxpbmUudHJpbSgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChsZWZ0T2ZDb21tZW50LmluZGV4T2YoJzonKSA9PT0gbm90Rm91bmQgICYmICBsZWZ0T2ZDb21tZW50ICE9PSAnJykge1xyXG5cdFx0XHRyZXR1cm5WYWx1ZSA9IHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKGxlZnRPZkNvbW1lbnQuc3Vic3RyKC0xKSA9PT0gJ3wnKSB7XHJcblx0XHRcdHJldHVyblZhbHVlID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuICByZXR1cm5WYWx1ZTtcclxufVxyXG5cclxuLy8gZGVsZXRlRmlsZVxyXG5mdW5jdGlvbiAgZGVsZXRlRmlsZShwYXRoOiBzdHJpbmcpIHtcclxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGgpKSB7XHJcbiAgICAgICAgZnMudW5saW5rU3luYyhwYXRoKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gZ2V0VmFsdWVcclxuZnVuY3Rpb24gIGdldFZhbHVlKGxpbmU6IHN0cmluZywgc2VwYXJhdG9ySW5kZXg6IG51bWJlcikge1xyXG5cdGxldCAgICB2YWx1ZSA9IGxpbmUuc3Vic3RyKHNlcGFyYXRvckluZGV4ICsgMSkudHJpbSgpO1xyXG5cdGNvbnN0ICBjb21tZW50ID0gdmFsdWUuaW5kZXhPZignIycpO1xyXG5cdGlmIChjb21tZW50ICE9PSBub3RGb3VuZCkge1xyXG5cdFx0dmFsdWUgPSB2YWx1ZS5zdWJzdHIoMCwgY29tbWVudCkudHJpbSgpO1xyXG5cdH1cclxuXHRyZXR1cm4gIHZhbHVlO1xyXG59XHJcblxyXG4vLyBnZXRFeHBlY3RlZExpbmVcclxuZnVuY3Rpb24gIGdldEV4cGVjdGVkTGluZShzZXR0aW5nOiBTZXR0aW5ncywgdGVtcGxhdGU6IHN0cmluZykge1xyXG5cdGxldCAgZXhwZWN0ZWQgPSB0ZW1wbGF0ZTtcclxuXHJcblx0Zm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZykpIHtcclxuXHRcdGNvbnN0ICByZSA9IG5ldyBSZWdFeHAoIGVzY2FwZVJlZ3VsYXJFeHByZXNzaW9uKGtleSksIFwiZ2lcIiApO1xyXG5cclxuXHRcdGNvbnN0ICBleHBlY3RlZEFmdGVyID0gZXhwZWN0ZWQucmVwbGFjZShyZSwgc2V0dGluZ1trZXldLnZhbHVlKTtcclxuXHRcdGlmIChleHBlY3RlZEFmdGVyICE9PSBleHBlY3RlZCkge1xyXG5cdFx0XHRzZXR0aW5nW2tleV0uaXNSZWZlcmVuY2VkID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGV4cGVjdGVkID0gZXhwZWN0ZWRBZnRlcjtcclxuXHR9XHJcblx0cmV0dXJuICBleHBlY3RlZDtcclxufVxyXG5cclxuLy8gZ2V0Q2hhbmdlZExpbmVcclxuZnVuY3Rpb24gIGdldENoYW5nZWRMaW5lKHNldHRpbmc6IFNldHRpbmdzLCB0ZW1wbGF0ZTogc3RyaW5nLCBjaGFuZ2luZ0tleTogc3RyaW5nLCBjaGFuZ2VkVmFsdWU6IHN0cmluZykge1xyXG5cdGxldCAgY2hhbmdlZExpbmUgPSAnJztcclxuXHRpZiAoY2hhbmdpbmdLZXkgaW4gc2V0dGluZykge1xyXG5cdFx0Y29uc3QgIGNoYW5naW5nVmFsdWUgPSBzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZTtcclxuXHJcblx0XHRzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZSA9IGNoYW5nZWRWYWx1ZTtcclxuXHJcblx0XHRjaGFuZ2VkTGluZSA9IGdldEV4cGVjdGVkTGluZShzZXR0aW5nLCB0ZW1wbGF0ZSk7XHJcblx0XHRzZXR0aW5nW2NoYW5naW5nS2V5XS52YWx1ZSA9IGNoYW5naW5nVmFsdWU7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNoYW5nZWRMaW5lID0gZ2V0RXhwZWN0ZWRMaW5lKHNldHRpbmcsIHRlbXBsYXRlKTtcclxuXHR9XHJcblx0cmV0dXJuICBjaGFuZ2VkTGluZTtcclxufVxyXG5cclxuLy8gZ2V0Q2hhbmdlZFZhbHVlXHJcbmZ1bmN0aW9uICBnZXRDaGFuZ2VkVmFsdWUoY2hhbmdlZFZhbHVlQW5kQ29tbWVudDogc3RyaW5nKTogc3RyaW5nIHtcclxuXHRjb25zdCAgY29tbWVudEluZGV4ID0gY2hhbmdlZFZhbHVlQW5kQ29tbWVudC5pbmRleE9mKCcjJyk7XHJcblx0bGV0ICBjaGFuZ2VkVmFsdWU6IHN0cmluZztcclxuXHRpZiAoY29tbWVudEluZGV4ICE9PSBub3RGb3VuZCkge1xyXG5cclxuXHRcdGNoYW5nZWRWYWx1ZSA9IGNoYW5nZWRWYWx1ZUFuZENvbW1lbnQuc3Vic3RyKDAsIGNvbW1lbnRJbmRleCkudHJpbSgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRjaGFuZ2VkVmFsdWUgPSBjaGFuZ2VkVmFsdWVBbmRDb21tZW50O1xyXG5cdH1cclxuXHRyZXR1cm4gIGNoYW5nZWRWYWx1ZTtcclxufVxyXG5cclxuLy8gcGFyc2VUZW1wbGF0ZVRhZ1xyXG5mdW5jdGlvbiAgcGFyc2VUZW1wbGF0ZVRhZyhsaW5lOiBzdHJpbmcpOiBUZW1wbGF0ZVRhZyB7XHJcblx0Y29uc3QgIHRhZyA9IG5ldyBUZW1wbGF0ZVRhZygpO1xyXG5cclxuXHR0YWcuaW5kZXhJbkxpbmUgPSBsaW5lLmluZGV4T2YodGVtcGxhdGVMYWJlbCk7XHJcblx0aWYgKHRhZy5pbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHRcdHRhZy5pc0ZvdW5kID0gdHJ1ZTtcclxuXHRcdGNvbnN0ICBsZWZ0T2ZUZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKDAsIHRhZy5pbmRleEluTGluZSkudHJpbSgpO1xyXG5cclxuXHRcdHRhZy50ZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKHRhZy5pbmRleEluTGluZSArIHRlbXBsYXRlTGFiZWwubGVuZ3RoKS50cmltKCk7XHJcblx0XHRpZiAobGVmdE9mVGVtcGxhdGUgPT09ICcnKSB7XHJcblx0XHRcdHRhZy5saW5lTnVtT2Zmc2V0ID0gLTE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0YWcubGluZU51bU9mZnNldCA9IDA7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIHRhZztcclxuXHR9XHJcblxyXG5cdHRhZy5zdGFydEluZGV4SW5MaW5lID0gbGluZS5pbmRleE9mKHRlbXBsYXRlQXRTdGFydExhYmVsKTtcclxuXHRpZiAodGFnLnN0YXJ0SW5kZXhJbkxpbmUgIT09IG5vdEZvdW5kKSB7XHJcblx0XHR0YWcuaXNGb3VuZCA9IHRydWU7XHJcblx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgPSAgbGluZS5pbmRleE9mKHRlbXBsYXRlQXRFbmRMYWJlbCwgdGFnLnN0YXJ0SW5kZXhJbkxpbmUpO1xyXG5cdFx0aWYgKHRhZy5lbmRJbmRleEluTGluZSAhPT0gbm90Rm91bmQpIHtcclxuXHJcblx0XHRcdHRhZy50ZW1wbGF0ZSA9IGxpbmUuc3Vic3RyKHRhZy5lbmRJbmRleEluTGluZSArIHRlbXBsYXRlQXRFbmRMYWJlbC5sZW5ndGgpLnRyaW0oKTtcclxuXHRcdFx0dGFnLmxpbmVOdW1PZmZzZXQgPSBwYXJzZUludChsaW5lLnN1YnN0cmluZyhcclxuXHRcdFx0XHR0YWcuc3RhcnRJbmRleEluTGluZSArIHRlbXBsYXRlQXRTdGFydExhYmVsLmxlbmd0aCxcclxuXHRcdFx0XHR0YWcuZW5kSW5kZXhJbkxpbmUgKSk7XHJcblx0XHRcdHJldHVybiAgdGFnO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dGFnLnRlbXBsYXRlID0gJyc7XHJcblx0dGFnLmxpbmVOdW1PZmZzZXQgPSAwO1xyXG5cdHJldHVybiAgdGFnO1xyXG59XHJcblxyXG4vLyBUZW1wbGF0ZVRhZ1xyXG5jbGFzcyAgVGVtcGxhdGVUYWcge1xyXG5cdHRlbXBsYXRlID0gJyc7XHJcblx0aXNGb3VuZCA9IGZhbHNlO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZSB0YWdcclxuXHRpbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG5cclxuXHQvLyB0ZW1wbGF0ZS1hdCB0YWdcclxuXHRsaW5lTnVtT2Zmc2V0ID0gMDsgIFxyXG5cdHN0YXJ0SW5kZXhJbkxpbmUgPSBub3RGb3VuZDtcclxuXHRlbmRJbmRleEluTGluZSA9IG5vdEZvdW5kO1xyXG59XHJcblxyXG4vLyBlc2NhcGVSZWd1bGFyRXhwcmVzc2lvblxyXG5mdW5jdGlvbiAgZXNjYXBlUmVndWxhckV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nKSB7XHJcblx0cmV0dXJuICBleHByZXNzaW9uLnJlcGxhY2UoL1tcXFxcXiQuKis/KClbXFxde318XS9nLCAnXFxcXCQmJyk7XHJcbn1cclxuXHJcbi8vIFN0YW5kYXJkSW5wdXRCdWZmZXJcclxuY2xhc3MgIFN0YW5kYXJkSW5wdXRCdWZmZXIge1xyXG5cdHJlYWRsaW5lczogcmVhZGxpbmUuSW50ZXJmYWNlO1xyXG5cdGlucHV0QnVmZmVyOiBzdHJpbmdbXSA9IFtdO1xyXG5cdGlucHV0UmVzb2x2ZXI/OiAoYW5zd2VyOnN0cmluZyk9PnZvaWQgPSB1bmRlZmluZWQ7XHJcblxyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5yZWFkbGluZXMgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xyXG5cdFx0XHRpbnB1dDogcHJvY2Vzcy5zdGRpbixcclxuXHRcdFx0b3V0cHV0OiBwcm9jZXNzLnN0ZG91dFxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnJlYWRsaW5lcy5vbignbGluZScsIGFzeW5jIChsaW5lOiBzdHJpbmcpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMuaW5wdXRSZXNvbHZlcikge1xyXG5cdFx0XHRcdHRoaXMuaW5wdXRSZXNvbHZlcihsaW5lKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0UmVzb2x2ZXIgPSB1bmRlZmluZWQ7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5pbnB1dEJ1ZmZlci5wdXNoKGxpbmUpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHR0aGlzLnJlYWRsaW5lcy5zZXRQcm9tcHQoJycpO1xyXG5cdFx0dGhpcy5yZWFkbGluZXMucHJvbXB0KCk7XHJcblx0fVxyXG5cclxuXHRhc3luYyAgaW5wdXQoZ3VpZGU6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nPiB7XHJcblx0XHRyZXR1cm4gIG5ldyBQcm9taXNlKFxyXG5cdFx0XHQocmVzb2x2ZTogKGFuc3dlcjpzdHJpbmcpPT52b2lkLCAgcmVqZWN0OiAoYW5zd2VyOnN0cmluZyk9PnZvaWQgKSA9PlxyXG5cdFx0e1xyXG5cdFx0XHRjb25zdCAgbmV4dExpbmUgPSB0aGlzLmlucHV0QnVmZmVyLnNoaWZ0KCk7XHJcblx0XHRcdGlmIChuZXh0TGluZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgbmV4dExpbmUpO1xyXG5cdFx0XHRcdHJlc29sdmUobmV4dExpbmUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHByb2Nlc3Muc3Rkb3V0LndyaXRlKGd1aWRlKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0UmVzb2x2ZXIgPSByZXNvbHZlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGNsb3NlKCkge1xyXG5cdFx0dGhpcy5yZWFkbGluZXMuY2xvc2UoKTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIElucHV0T3B0aW9uXHJcbmNsYXNzIElucHV0T3B0aW9uIHtcclxuXHRpbnB1dExpbmVzOiBzdHJpbmdbXTtcclxuXHRuZXh0TGluZUluZGV4OiBudW1iZXI7XHJcblxyXG5cdGNvbnN0cnVjdG9yKGlucHV0TGluZXM6IHN0cmluZ1tdKSB7XHJcblx0XHR0aGlzLmlucHV0TGluZXMgPSBpbnB1dExpbmVzO1xyXG5cdFx0dGhpcy5uZXh0TGluZUluZGV4ID0gMDtcclxuXHR9XHJcbn1cclxuXHJcbmNvbnN0ICB0ZXN0QmFzZUZvbGRlciA9IFN0cmluZy5yYXcgYFI6XFxob21lXFxtZW1fY2FjaGVcXE15RG9jXFxzcmNcXFR5cGVTY3JpcHRcXHR5cHJtXFx0ZXN0X2RhdGFgKydcXFxcJztcclxuXHJcbi8vIGlucHV0T3B0aW9uXHJcbmNvbnN0IGlucHV0T3B0aW9uID0gbmV3IElucHV0T3B0aW9uKFtcclxuLypcclxuXHR0ZXN0QmFzZUZvbGRlciArYGNoYW5nZV9zZXRfLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYGZpbGVgLFxyXG5cdHRlc3RCYXNlRm9sZGVyICtgY2hhbmdlX3NldF9zZXR0aW5nLnlhbWxgLFxyXG5cdFN0cmluZy5yYXcgYENoYW5nZWRgLFxyXG4qL1xyXG5dKTtcclxuXHJcbi8vIGlucHV0XHJcbi8vIEV4YW1wbGU6IGNvbnN0IG5hbWUgPSBhd2FpdCBpbnB1dCgnV2hhdCBpcyB5b3VyIG5hbWU/ICcpO1xyXG5hc3luYyBmdW5jdGlvbiAgaW5wdXQoIGd1aWRlOiBzdHJpbmcgKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuXHQvLyBJbnB1dCBlbXVsYXRpb25cclxuXHRpZiAoaW5wdXRPcHRpb24uaW5wdXRMaW5lcykge1xyXG5cdFx0aWYgKGlucHV0T3B0aW9uLm5leHRMaW5lSW5kZXggPCBpbnB1dE9wdGlvbi5pbnB1dExpbmVzLmxlbmd0aCkge1xyXG5cdFx0XHRjb25zdCAgdmFsdWUgPSBpbnB1dE9wdGlvbi5pbnB1dExpbmVzW2lucHV0T3B0aW9uLm5leHRMaW5lSW5kZXhdO1xyXG5cdFx0XHRpbnB1dE9wdGlvbi5uZXh0TGluZUluZGV4ICs9IDE7XHJcblx0XHRcdGNvbnNvbGUubG9nKGd1aWRlICsgdmFsdWUpO1xyXG5cdFx0XHRyZXR1cm4gIHZhbHVlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Ly8gaW5wdXRcclxuXHRyZXR1cm4gIElucHV0T2JqZWN0LmlucHV0KGd1aWRlKTtcclxufVxyXG5jb25zdCAgSW5wdXRPYmplY3QgPSBuZXcgU3RhbmRhcmRJbnB1dEJ1ZmZlcigpO1xyXG5cclxuLy8gaW5wdXRQYXRoXHJcbi8vIEV4YW1wbGU6IGNvbnN0IG5hbWUgPSBhd2FpdCBpbnB1dCgnV2hhdCBpcyB5b3VyIG5hbWU/ICcpO1xyXG5hc3luYyBmdW5jdGlvbiAgaW5wdXRQYXRoKCBndWlkZTogc3RyaW5nICkge1xyXG5cdGNvbnN0ICBrZXkgPSBhd2FpdCBpbnB1dChndWlkZSk7XHJcblx0cmV0dXJuICBwYXRoUmVzb2x2ZShrZXkpO1xyXG59XHJcblxyXG4vLyBwYXRoUmVzb2x2ZVxyXG5mdW5jdGlvbiAgcGF0aFJlc29sdmUocGF0aF86IHN0cmluZykge1xyXG5cclxuXHQvLyAnL2MvaG9tZScgZm9ybWF0IHRvIGN1cnJlbnQgT1MgZm9ybWF0XHJcblx0aWYgKHBhdGhfLmxlbmd0aCA+PSAzKSB7XHJcblx0XHRpZiAocGF0aF9bMF0gPT09ICcvJyAgJiYgIHBhdGhfWzJdID09PSAnLycpIHtcclxuXHRcdFx0cGF0aF8gPSBwYXRoX1sxXSArJzonKyBwYXRoXy5zdWJzdHIoMik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLyBDaGFuZ2Ugc2VwYXJhdG9ycyB0byBPUyBmb3JtYXRcclxuXHRwYXRoXyA9IHBhdGgucmVzb2x2ZShwYXRoXyk7XHJcblxyXG5cdHJldHVybiBwYXRoX1xyXG59XHJcblxyXG4vLyBTZXR0aW5nXHJcbnR5cGUgU2V0dGluZ3MgPSB7W25hbWU6IHN0cmluZ106IFNldHRpbmd9XHJcblxyXG4vLyBTZXR0aW5nXHJcbmNsYXNzIFNldHRpbmcge1xyXG5cdHZhbHVlOiBzdHJpbmcgPSAnJztcclxuXHRsaW5lTnVtOiBudW1iZXIgPSAwO1xyXG5cdGlzUmVmZXJlbmNlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcblxyXG4vLyBTZWFyY2hLZXl3b3JkXHJcbmNsYXNzIFNlYXJjaEtleXdvcmQge1xyXG5cdGtleXdvcmQ6IHN0cmluZyA9ICcnO1xyXG5cdHN0YXJ0TGluZU51bTogbnVtYmVyID0gMDtcclxuXHRkaXJlY3Rpb246IERpcmVjdGlvbiA9IERpcmVjdGlvbi5Gb2xsb3dpbmc7XHJcbn1cclxuXHJcbi8vIERpcmVjdGlvblxyXG5lbnVtIERpcmVjdGlvbiB7XHJcblx0QWJvdmUgPSAtMSxcclxuXHRGb2xsb3dpbmcgPSArMSxcclxufVxyXG5cclxuLy8gV3JpdGVCdWZmZXJcclxuY2xhc3MgIFdyaXRlQnVmZmVyIHtcclxuXHRzdHJlYW06IGZzLldyaXRlU3RyZWFtO1xyXG5cdGxpbmVCdWZmZXI6IHN0cmluZ1tdO1xyXG5cclxuXHRjb25zdHJ1Y3RvcihzdHJlYW06IGZzLldyaXRlU3RyZWFtKSB7XHJcblx0XHR0aGlzLnN0cmVhbSA9IHN0cmVhbTtcclxuXHRcdHRoaXMubGluZUJ1ZmZlciA9IFtdO1xyXG5cdH1cclxuXHJcblx0ZW5kKCkge1xyXG5cdFx0Zm9yIChjb25zdCBsaW5lICBvZiAgdGhpcy5saW5lQnVmZmVyKSB7XHJcblx0XHRcdHRoaXMuc3RyZWFtLndyaXRlKGxpbmUpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zdHJlYW0uZW5kKCk7XHJcbiAgICB9XHJcblxyXG5cdG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XHJcblx0XHR0aGlzLnN0cmVhbS5vbihldmVudCwgY2FsbGJhY2spO1xyXG5cdH1cclxuXHJcblx0d3JpdGUobGluZTogc3RyaW5nKSB7XHJcblx0XHR0aGlzLmxpbmVCdWZmZXIucHVzaChsaW5lKTtcclxuXHR9XHJcblxyXG5cdHJlcGxhY2VBYm92ZUxpbmUocmVsYXRpdmVMaW5lTnVtOiBudW1iZXIsIGxpbmU6IHN0cmluZykge1xyXG5cdFx0dGhpcy5saW5lQnVmZmVyW3RoaXMubGluZUJ1ZmZlci5sZW5ndGggKyByZWxhdGl2ZUxpbmVOdW1dID0gbGluZTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIHRyYW5zbGF0ZVxyXG4vLyBlLmcuIHRyYW5zbGF0ZSgnZW5nbGlzaCcpXHJcbi8vIGUuZy4gdHJhbnNsYXRlYHByaWNlID0gJHtwcmljZX1gICAvLyAuLi4gdGFnZ2VkVGVtcGxhdGVcclxuZnVuY3Rpb24gIHRyYW5zbGF0ZShlbmdsaXNoTGl0ZXJhbHM6IFRlbXBsYXRlU3RyaW5nc0FycmF5IHwgc3RyaW5nLCAgLi4udmFsdWVzOiBhbnlbXSk6IHN0cmluZyB7XHJcblx0bGV0ICAgIGRpY3Rpb25hcnk6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHRjb25zdCAgdGFnZ2VkVGVtcGxhdGUgPSAodHlwZW9mKGVuZ2xpc2hMaXRlcmFscykgIT09ICdzdHJpbmcnKTtcclxuXHJcblx0bGV0ICBlbmdsaXNoID0gZW5nbGlzaExpdGVyYWxzIGFzIHN0cmluZztcclxuXHRpZiAodGFnZ2VkVGVtcGxhdGUpIHtcclxuXHRcdGVuZ2xpc2ggPSAnJztcclxuXHRcdGZvciAobGV0IGk9MDsgaTxlbmdsaXNoTGl0ZXJhbHMubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdGVuZ2xpc2ggKz0gZW5nbGlzaExpdGVyYWxzW2ldO1xyXG5cdFx0XHRpZiAoaSA8IHZhbHVlcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRlbmdsaXNoICs9ICckeycgKyBTdHJpbmcoaSkgKyd9JztcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBlLmcuIGVuZ2xpc2ggPSAncHJpY2UgPSAkezB9J1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aWYgKGxvY2FsZSA9PT0gJ2phLUpQJykge1xyXG5cdFx0ZGljdGlvbmFyeSA9IHtcclxuXHRcdFx0XCJZQU1MIFVURi04IGZpbGUgcGF0aD5cIjogXCJZQU1MIFVURi04IOODleOCoeOCpOODqyDjg5Hjgrk+XCIsXHJcblx0XHRcdFwiVGhpcyBpcyBhIHNlY3JldCB2YWx1ZS5cIjogXCLjgZPjgozjga/np5jlr4bjga7lgKTjgafjgZnjgIJcIixcclxuXHRcdFx0XCJDaGFuZ2UgXFxcIiR7MH1cXFwiIHRvIFxcXCIkezF9XFxcIi5cIjogXCJcXFwiJHswfVxcXCIg44KSIFxcXCIkezF9XFxcIiDjgavlpInmm7TjgZfjgabjgY/jgaDjgZXjgYTjgIJcIixcclxuXHRcdFx0XCJQcmVzcyBFbnRlciBrZXkgdG8gcmV0cnkgY2hlY2tpbmcuXCI6IFwiRW50ZXIg44Kt44O844KS5oq844GZ44Go5YaN44OB44Kn44OD44Kv44GX44G+44GZ44CCXCIsXHJcblx0XHRcdFwiVGhlIGxpbmUgbnVtYmVyIHRvIGNoYW5nZSB0aGUgdmFyaWFibGUgdmFsdWUgPlwiOiBcIuWkieabtOOBmeOCi+WkieaVsOWApOOBjOOBguOCi+ihjOeVquWPtyA+XCIsXHJcblx0XHRcdFwiRW50ZXIgb25seTogZmluaXNoIHRvIGlucHV0IHNldHRpbmdcIjogXCJFbnRlciDjga7jgb/vvJroqK3lrprjga7lhaXlipvjgpLntYLjgo/jgotcIixcclxuXHRcdFx0XCJrZXk6IG5ld192YWx1ZT5cIjogXCLlpInmlbDlkI06IOaWsOOBl+OBhOWkieaVsOWApD5cIixcclxuXHRcdFx0XCJ0ZW1wbGF0ZSBjb3VudFwiOiBcIuODhuODs+ODl+ODrOODvOODiOOBruaVsFwiLFxyXG5cdFx0XHRcImluIHByZXZpb3VzIGNoZWNrXCI6IFwi5YmN5Zue44Gu44OB44Kn44OD44KvXCIsXHJcblx0XHRcdFwiV2FybmluZ1wiOiBcIuitpuWRilwiLFxyXG5cdFx0XHRcIkVycm9yXCI6IFwi44Ko44Op44O8XCIsXHJcblx0XHRcdFwiRXJyb3JMaW5lXCI6IFwi44Ko44Op44O86KGMXCIsXHJcblx0XHRcdFwiU29sdXRpb25cIjogXCLop6Pmsbrms5VcIixcclxuXHRcdFx0XCJDb250ZW50c1wiOiBcIuWGheWuuVwiLFxyXG5cdFx0XHRcIkV4cGVjdGVkXCI6IFwi5pyf5b6FXCIsXHJcblx0XHRcdFwiVGVtcGxhdGVcIjogXCLpm5vlvaJcIixcclxuXHRcdFx0XCJXYXJuaW5nTGluZVwiOiBcIuitpuWRiuihjFwiLFxyXG5cdFx0XHRcIkZvdW5kXCI6IFwi6KaL44Gk44GL44Gj44Gf44KC44GuXCIsXHJcblx0XHRcdFwiU2V0dGluZ0luZGV4XCI6IFwi6Kit5a6a55Wq5Y+3XCIsXHJcblx0XHRcdFwiTm90IGZvdW5kIGFueSByZXBsYWNpbmcgdGFyZ2V0XCI6IFwi572u44GN5o+b44GI44KL5a++6LGh44GM6KaL44Gk44GL44KK44G+44Gb44KTXCIsXHJcblx0XHRcdFwiU2V0IG9sZCB2YWx1ZSBhdCBzZXR0aW5ncyBpbiB0aGUgcmVwbGFjaW5nIGZpbGVcIjogXCLnva7jgY3mj5vjgYjjgovjg5XjgqHjgqTjg6vjga7kuK3jga7oqK3lrprjgavlj6TjgYTlgKTjgpLoqK3lrprjgZfjgabjgY/jgaDjgZXjgYRcIixcclxuXHRcdFx0XCJUaGUgcGFyYW1ldGVyIG11c3QgYmUgbGVzcyB0aGFuIDBcIjogXCLjg5Hjg6njg6Hjg7zjgr/jg7zjga8gMCDjgojjgorlsI/jgZXjgY/jgZfjgabjgY/jgaDjgZXjgYRcIixcclxuXHRcdFx0XCJOb3QgZm91bmQgXFxcIiR7MH1cXFwiIGFib3ZlXCI6IFwi5LiK5pa55ZCR44Gr44CMJHswfeOAjeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIk5vdCBmb3VuZCBcXFwiJHswfVxcXCIgZm9sbG93aW5nXCI6IFwi5LiL5pa55ZCR44Gr44CMJHswfeOAjeOBjOimi+OBpOOBi+OCiuOBvuOBm+OCk1wiLFxyXG5cdFx0XHRcIk5vdCByZWZlcmVuY2VkOiAkezB9IGluIGxpbmUgJHsxfVwiOiBcIuWPgueFp+OBleOCjOOBpuOBhOOBvuOBm+OCk++8miAkezB9IO+8iCR7MX3ooYznm67vvIlcIixcclxuXHRcdH07XHJcblx0fVxyXG5cdGxldCAgdHJhbnNsYXRlZCA9IGVuZ2xpc2g7XHJcblx0aWYgKGRpY3Rpb25hcnkpIHtcclxuXHRcdGlmIChlbmdsaXNoIGluIGRpY3Rpb25hcnkpIHtcclxuXHJcblx0XHRcdHRyYW5zbGF0ZWQgPSBkaWN0aW9uYXJ5W2VuZ2xpc2hdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAodGFnZ2VkVGVtcGxhdGUpIHtcclxuXHRcdGZvciAobGV0IGk9MDsgaTxlbmdsaXNoTGl0ZXJhbHMubGVuZ3RoOyBpKz0xKSB7XHJcblx0XHRcdHRyYW5zbGF0ZWQgPSB0cmFuc2xhdGVkLnJlcGxhY2UoICckeycrU3RyaW5nKGkpKyd9JywgU3RyaW5nKHZhbHVlc1tpXSkgKTtcclxuXHRcdH1cclxuXHRcdHRyYW5zbGF0ZWQgPSB0cmFuc2xhdGVkLnJlcGxhY2UoICckXFxcXHsnLCAnJHsnICk7XHJcblx0XHRcdC8vIFJlcGxhY2UgdGhlIGVzY2FwZSBvZiAke259XHJcblx0XHRcdC8vIGUuZy4gXCIkXFxcXHtwcmljZX0gPSAke3ByaWNlfVwiID0+IFwiJHtwcmljZX0gPSAxMDBcIlxyXG5cdH1cclxuXHRyZXR1cm4gIHRyYW5zbGF0ZWQ7XHJcbn1cclxuXHJcbmNvbnN0ICBtaW5MaW5lTnVtID0gMDtcclxuY29uc3QgIG1heExpbmVOdW0gPSA5OTk5OTk5OTk7XHJcbmNvbnN0ICBmb3VuZEZvckFib3ZlID0gbWluTGluZU51bTtcclxuY29uc3QgIGZvdW5kRm9yRm9sbG93aW5nID0gbWF4TGluZU51bTtcclxuY29uc3QgIG5vdEZvdW5kID0gLTE7XHJcbmNvbnN0ICBhbGxTZXR0aW5nID0gMDtcclxuY29uc3QgIG5vU2VwYXJhdG9yID0gLTE7XHJcbmxldCAgICBsb2NhbGU6IHN0cmluZztcclxuY29uc3QgIHByb2dyYW1PcHRpb25zID0gcHJvZ3JhbS5vcHRzKCk7XHJcbmZ1bmN0aW9uICBleGl0RnJvbUNvbW1hbmRlcihlOiBDb21tYW5kZXJFcnJvcikge1xyXG5cdGNvbnNvbGUubG9nKGUubWVzc2FnZSk7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gIGNhbGxNYWluKCkge1xyXG5cdHByb2dyYW0udmVyc2lvbignMC4xLjEnKS5leGl0T3ZlcnJpZGUoZXhpdEZyb21Db21tYW5kZXIpXHJcblx0XHQub3B0aW9uKFwiLWwsIC0tbG9jYWxlIDxzPlwiKVxyXG5cdFx0Lm9wdGlvbihcIi10LCAtLXRlc3RcIilcclxuXHRcdC5wYXJzZShwcm9jZXNzLmFyZ3YpO1xyXG5cdFxyXG5cdGxvY2FsZSA9IEludGwuTnVtYmVyRm9ybWF0KCkucmVzb2x2ZWRPcHRpb25zKCkubG9jYWxlO1xyXG5cdGlmIChwcm9ncmFtT3B0aW9ucy5sb2NhbGUpIHtcclxuXHRcdGxvY2FsZSA9IHByb2dyYW1PcHRpb25zLmxvY2FsZTtcclxuXHR9XHJcblxyXG5cdGF3YWl0ICBtYWluKClcclxuXHRcdC5jYXRjaCggYXN5bmMgKGUpPT57XHJcblx0XHRcdGlmIChwcm9ncmFtT3B0aW9ucy50ZXN0KSB7XHJcblx0XHRcdFx0dGhyb3cgZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0Y29uc29sZS5sb2coIGBFUlJPUjogJHtlLm1lc3NhZ2V9YCApO1xyXG5cdFx0XHRcdGNvbnN0ICB0aW1lT3ZlciA9IG5ldyBEYXRlKCk7XHJcblx0XHRcdFx0dGltZU92ZXIuc2V0U2Vjb25kcyggdGltZU92ZXIuZ2V0U2Vjb25kcygpICsgNSApO1xyXG5cclxuXHRcdFx0XHR3aGlsZSAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSA8IHRpbWVPdmVyLmdldFRpbWUoKSkge1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHRcdC5maW5hbGx5KCgpPT57XHJcblx0XHRcdElucHV0T2JqZWN0LmNsb3NlKCk7XHJcblx0XHR9KTtcclxufVxyXG5jYWxsTWFpbigpO1xyXG4iXX0=