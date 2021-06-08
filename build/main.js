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
Object.defineProperty(exports, "__esModule", { value: true });
exports.programOptions = exports.programArguments = exports.stdout = exports.callMainFromJest = exports.InputObject = exports.debugOut = exports.main = void 0;
var fs = require("fs"); // file system
var path = require("path"); // or path = require("path")
var globby = require("globby");
var readline = require("readline");
var stream = require("stream");
var csvParse = require("csv-parse");
var chalk = require("chalk");
process.env['typrm_aaa'] = 'aaa';
// main
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var checkingFilePath, inputFilePath, replacingLineNum, keyValues, inputFilePath, replacingLineNum;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    locale = Intl.NumberFormat().resolvedOptions().locale;
                    if ('locale' in exports.programOptions) {
                        locale = exports.programOptions.locale;
                    }
                    if (!(exports.programArguments.length === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkRoutine(true, '')];
                case 1:
                    _a.sent();
                    if (!exports.programOptions.test) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 14];
                case 4:
                    if (!(exports.programArguments.length >= 1)) return [3 /*break*/, 14];
                    if (!(exports.programArguments[0] === 's' || exports.programArguments[0] === 'search')) return [3 /*break*/, 6];
                    return [4 /*yield*/, search()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 6:
                    if (!(exports.programArguments[0] === 'c' || exports.programArguments[0] === 'check')) return [3 /*break*/, 8];
                    if (exports.programArguments.length >= 2) {
                        checkingFilePath = exports.programArguments[1];
                    }
                    return [4 /*yield*/, check(checkingFilePath)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 8:
                    if (!(exports.programArguments[0] === 'r' || exports.programArguments[0] === 'replace')) return [3 /*break*/, 10];
                    varidateUpdateCommandArguments();
                    inputFilePath = exports.programArguments[1];
                    replacingLineNum = parseInt(exports.programArguments[2]);
                    keyValues = exports.programArguments[3];
                    return [4 /*yield*/, replaceSettings(inputFilePath, replacingLineNum, keyValues)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 10:
                    if (!(exports.programArguments[0] === 'revert')) return [3 /*break*/, 12];
                    inputFilePath = exports.programArguments[1];
                    replacingLineNum = parseInt(exports.programArguments[2]);
                    return [4 /*yield*/, revertSettings(inputFilePath, replacingLineNum)];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 12: return [4 /*yield*/, search()];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14: return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
// checkRoutine
function checkRoutine(isModal, inputFilePath) {
    var inputFilePath;
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function () {
        var parentPath, previousTemplateCount, reader, isReadingSetting, setting, settingCount, settingIndentLength, lineNum, templateCount, fileTemplateTag, errorCount, warningCount, secretLabelCount, lines, keywords, ifTagParser, reader_1, reader_1_1, line1, line, previousIsReadingSetting, separator, key, value, parsed, condition, evaluatedContidion, templateTag, checkingLine, expected, checkingLineWithoutTemplate, checkingLineWithoutTemplate, continue_, checkPassed, _i, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, checkPassed, reader_2, reader_2_1, line1, line, _c, keywords_1, keyword, e_2_1, _d, keywords_2, keyword, loop, key, lineNum_1, replacingSettingIndex, keyValue, _e, _f, _g, key;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!isModal) return [3 /*break*/, 2];
                    return [4 /*yield*/, inputPath(translate('YAML UTF-8 file path>'))];
                case 1:
                    inputFilePath = _h.sent();
                    _h.label = 2;
                case 2:
                    parentPath = path.dirname(inputFilePath);
                    inputFileParentPath = parentPath;
                    previousTemplateCount = 0;
                    _h.label = 3;
                case 3:
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    isReadingSetting = false;
                    setting = {};
                    settingCount = 0;
                    settingIndentLength = 0;
                    lineNum = 0;
                    templateCount = 0;
                    fileTemplateTag = null;
                    errorCount = 0;
                    warningCount = 0;
                    secretLabelCount = 0;
                    lines = [];
                    keywords = [];
                    ifTagParser = new IfTagParser();
                    _h.label = 4;
                case 4:
                    _h.trys.push([4, 11, 12, 17]);
                    reader_1 = (e_1 = void 0, __asyncValues(reader));
                    _h.label = 5;
                case 5: return [4 /*yield*/, reader_1.next()];
                case 6:
                    if (!(reader_1_1 = _h.sent(), !reader_1_1.done)) return [3 /*break*/, 10];
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
                        settingIndentLength = indentRegularExpression.exec(line)[0].length;
                        // const  match = settingStartLabel.exec(line.trim());
                        // settingName = match[1];
                    }
                    else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                        isReadingSetting = false;
                    }
                    if (isReadingSetting && ifTagParser.thisIsOutOfFalseBlock) {
                        separator = line.indexOf(':');
                        if (separator !== notFound) {
                            key = line.substr(0, separator).trim();
                            value = getValue(line, separator);
                            if (value !== '' && key.length >= 1 && key[0] !== '#') {
                                if (key in setting) {
                                    console.log('');
                                    console.log('Error of duplicated variable name:');
                                    console.log("  " + translate('typrmFile') + ": " + getTestablePath(inputFilePath) + ":" + lineNum);
                                    console.log("  Contents: " + key + ": " + value);
                                    errorCount += 1;
                                }
                                setting[key] = { value: value, isReferenced: false, lineNum: lineNum };
                            }
                        }
                    }
                    parsed = ifTagParser.evaluate(line, setting);
                    if (parsed.errorCount >= 1) {
                        console.log('');
                        console.log('Error of if tag syntax:');
                        console.log("  " + translate('typrmFile') + ": " + getTestablePath(inputFilePath) + ":" + lineNum);
                        console.log("  Contents: " + parsed.condition);
                        errorCount += parsed.errorCount;
                    }
                    // Check the condition by "#expect:" tag.
                    if (line.includes(expectLabel) && ifTagParser.thisIsOutOfFalseBlock) {
                        condition = line.substr(line.indexOf(expectLabel) + expectLabel.length).trim();
                        evaluatedContidion = evaluateIfCondition(condition, setting);
                        if (typeof evaluatedContidion === 'boolean') {
                            if (!evaluatedContidion) {
                                console.log('');
                                console.log('Error of not expected condition:');
                                console.log("  " + translate('typrmFile') + ": " + getTestablePath(inputFilePath) + ":" + lineNum);
                                console.log("  Contents: " + condition);
                                errorCount += 1;
                            }
                        }
                        else {
                            console.log('');
                            console.log('Error of expect tag syntax:');
                            console.log("  " + translate('typrmFile') + ": " + getTestablePath(inputFilePath) + ":" + lineNum);
                            console.log("  Contents: " + condition);
                            errorCount += 1;
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
                        if (templateTag.lineNumOffset === 0) {
                            checkingLineWithoutTemplate = checkingLine.substr(0, templateTag.indexInLine);
                        }
                        else {
                            checkingLineWithoutTemplate = checkingLine;
                        }
                        if (!checkingLineWithoutTemplate.includes(expected) && ifTagParser.thisIsOutOfFalseBlock) {
                            console.log("");
                            console.log(translate('ErrorLine') + ": " + (lineNum + templateTag.lineNumOffset));
                            console.log("  " + translate('Contents') + ": " + checkingLine.trim());
                            console.log("  " + translate('Expected') + ": " + expected);
                            console.log("  " + translate('Template') + ": " + templateTag.template);
                            console.log("  " + translate('SettingIndex') + ": " + settingCount);
                            errorCount += 1;
                        }
                    }
                    if (!fileTemplateTag) return [3 /*break*/, 8];
                    continue_ = fileTemplateTag.onReadLine(line);
                    if (!!continue_) return [3 /*break*/, 8];
                    return [4 /*yield*/, fileTemplateTag.checkTargetFileContents(setting, inputFilePath, lineNum)];
                case 7:
                    checkPassed = _h.sent();
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    fileTemplateTag = null;
                    _h.label = 8;
                case 8:
                    if (templateTag.label === fileTemplateLabel && ifTagParser.thisIsOutOfFalseBlock) {
                        fileTemplateTag = templateTag;
                    }
                    // Check if there is not "#★Now:".
                    for (_i = 0, temporaryLabels_1 = temporaryLabels; _i < temporaryLabels_1.length; _i++) {
                        temporaryLabel = temporaryLabels_1[_i];
                        if (line.toLowerCase().includes(temporaryLabel.toLowerCase()) && ifTagParser.thisIsOutOfFalseBlock) {
                            console.log("");
                            console.log(translate('WarningLine') + ": " + lineNum);
                            console.log("  " + translate('Contents') + ": " + line.trim());
                            console.log("  " + translate('SettingIndex') + ": " + settingCount);
                            warningCount += 1;
                        }
                    }
                    // Check if there is not secret tag.
                    if (line.includes(secretLabel) || line.includes(secretLabelEn)) {
                        if (!line.includes(secretExamleLabel) && !line.includes(secretExamleLabelEn)) {
                            if (secretLabelCount === 0) { // Because there will be many secret data.
                                console.log("");
                                console.log(translate('WarningLine') + ": " + lineNum);
                                console.log("  " + translate('This is a secret value.'));
                                console.log('  ' + translate(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Replace \"", "\" to \"", "\".'"], ["Replace \"", "\" to \"", "\".'"])), secretLabelEn, secretExamleLabelEn));
                                console.log('  ' + translate(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Replace \"", "\" to \"", "\".'"], ["Replace \"", "\" to \"", "\".'"])), secretLabel, secretExamleLabel));
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
                    _h.label = 9;
                case 9: return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 17];
                case 11:
                    e_1_1 = _h.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 17];
                case 12:
                    _h.trys.push([12, , 15, 16]);
                    if (!(reader_1_1 && !reader_1_1.done && (_a = reader_1.return))) return [3 /*break*/, 14];
                    return [4 /*yield*/, _a.call(reader_1)];
                case 13:
                    _h.sent();
                    _h.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 16: return [7 /*endfinally*/];
                case 17:
                    if (settingCount >= 1) {
                        onEndOfSetting(setting);
                    }
                    if (!fileTemplateTag) return [3 /*break*/, 19];
                    fileTemplateTag.onReadLine(''); // Cut indent
                    return [4 /*yield*/, fileTemplateTag.checkTargetFileContents(setting, inputFilePath, lineNum + 1)];
                case 18:
                    checkPassed = _h.sent();
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    _h.label = 19;
                case 19:
                    // Check if there is the title above or following.
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    _h.label = 20;
                case 20:
                    _h.trys.push([20, 25, 26, 31]);
                    reader_2 = (e_2 = void 0, __asyncValues(reader));
                    _h.label = 21;
                case 21: return [4 /*yield*/, reader_2.next()];
                case 22:
                    if (!(reader_2_1 = _h.sent(), !reader_2_1.done)) return [3 /*break*/, 24];
                    line1 = reader_2_1.value;
                    line = line1;
                    lineNum += 1;
                    for (_c = 0, keywords_1 = keywords; _c < keywords_1.length; _c++) {
                        keyword = keywords_1[_c];
                        if (keyword.direction === Direction.Above) {
                            if (lineNum <= keyword.startLineNum) {
                                if (line.includes(keyword.keyword)) {
                                    keyword.startLineNum = foundForAbove;
                                }
                            }
                        }
                        else if (keyword.direction === Direction.Following) {
                            if (lineNum >= keyword.startLineNum) {
                                if (line.includes(keyword.keyword)) {
                                    keyword.startLineNum = foundForFollowing;
                                }
                            }
                        }
                    }
                    _h.label = 23;
                case 23: return [3 /*break*/, 21];
                case 24: return [3 /*break*/, 31];
                case 25:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 31];
                case 26:
                    _h.trys.push([26, , 29, 30]);
                    if (!(reader_2_1 && !reader_2_1.done && (_b = reader_2.return))) return [3 /*break*/, 28];
                    return [4 /*yield*/, _b.call(reader_2)];
                case 27:
                    _h.sent();
                    _h.label = 28;
                case 28: return [3 /*break*/, 30];
                case 29:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 30: return [7 /*endfinally*/];
                case 31:
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
                    if (!isModal) {
                        return [3 /*break*/, 43];
                    }
                    loop = true;
                    _h.label = 32;
                case 32:
                    if (!loop) return [3 /*break*/, 41];
                    console.log(translate('Press Enter key to retry checking.'));
                    return [4 /*yield*/, input(translate('The line number to replace the variable value >'))];
                case 33:
                    key = _h.sent();
                    errorCount = 0;
                    if (!(key === 'exit')) return [3 /*break*/, 34];
                    return [2 /*return*/];
                case 34:
                    if (!(key !== '')) return [3 /*break*/, 40];
                    lineNum_1 = parseInt(key);
                    return [4 /*yield*/, getSettingIndexFromLineNum(inputFilePath, lineNum_1)];
                case 35:
                    replacingSettingIndex = _h.sent();
                    console.log(translate('SettingIndex') + ": " + replacingSettingIndex);
                    console.log(translate('Enter only: finish to input setting'));
                    _h.label = 36;
                case 36: return [4 /*yield*/, input(translate('key: new_value>'))];
                case 37:
                    keyValue = _h.sent();
                    if (keyValue === '') {
                        return [3 /*break*/, 40];
                    }
                    _e = errorCount;
                    return [4 /*yield*/, replaceSettingsSub(inputFilePath, replacingSettingIndex, parseKeyValueLines(keyValue), true)];
                case 38:
                    errorCount = _e + _h.sent();
                    _h.label = 39;
                case 39: return [3 /*break*/, 36];
                case 40:
                    loop = (errorCount >= 1);
                    return [3 /*break*/, 32];
                case 41:
                    // Rescan
                    console.log('========================================');
                    previousTemplateCount = templateCount;
                    for (_f = 0, _g = Object.keys(setting); _f < _g.length; _f++) {
                        key = _g[_f];
                        setting[key].isReferenced = false;
                    }
                    _h.label = 42;
                case 42: return [3 /*break*/, 3];
                case 43: return [2 /*return*/];
            }
        });
    });
}
// replaceSettings
function replaceSettings(inputFilePath, replacingLineNum, keyValueLines) {
    return __awaiter(this, void 0, void 0, function () {
        var inputFileFullPath, errorCount, replacingSettingIndex, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getInputFileFullPath(inputFilePath)];
                case 1:
                    inputFileFullPath = _b.sent();
                    errorCount = 0;
                    if (!(inputFileFullPath === '')) return [3 /*break*/, 2];
                    errorCount += 1;
                    return [3 /*break*/, 5];
                case 2: return [4 /*yield*/, getSettingIndexFromLineNum(inputFileFullPath, replacingLineNum)];
                case 3:
                    replacingSettingIndex = _b.sent();
                    _a = errorCount;
                    return [4 /*yield*/, replaceSettingsSub(inputFileFullPath, replacingSettingIndex, parseKeyValueLines(keyValueLines), true)];
                case 4:
                    errorCount = _a + _b.sent();
                    _b.label = 5;
                case 5:
                    console.log('');
                    console.log(translate('Warning') + ": 0, " + translate('Error') + ": " + errorCount);
                    return [2 /*return*/];
            }
        });
    });
}
// revertSettings
function revertSettings(inputFilePath, replacingLineNum) {
    return __awaiter(this, void 0, void 0, function () {
        var inputFileFullPath, errorCount, replacingSettingIndex, revertSettings_2, _i, revertSettings_1, revertSetting, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getInputFileFullPath(inputFilePath)];
                case 1:
                    inputFileFullPath = _b.sent();
                    errorCount = 0;
                    if (!(inputFileFullPath === '')) return [3 /*break*/, 2];
                    errorCount += 1;
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, getSettingIndexFromLineNum(inputFileFullPath, replacingLineNum)];
                case 3:
                    replacingSettingIndex = _b.sent();
                    return [4 /*yield*/, makeRevertSettings(inputFileFullPath, replacingSettingIndex)];
                case 4:
                    revertSettings_2 = _b.sent();
                    _i = 0, revertSettings_1 = revertSettings_2;
                    _b.label = 5;
                case 5:
                    if (!(_i < revertSettings_1.length)) return [3 /*break*/, 8];
                    revertSetting = revertSettings_1[_i];
                    _a = errorCount;
                    return [4 /*yield*/, replaceSettingsSub(inputFileFullPath, replacingSettingIndex, parseKeyValueLines(revertSetting), false)];
                case 6:
                    errorCount = _a + _b.sent();
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 5];
                case 8:
                    console.log('');
                    console.log(translate('Warning') + ": 0, " + translate('Error') + ": " + errorCount);
                    return [2 /*return*/];
            }
        });
    });
}
// getInputFileFullPath
function getInputFileFullPath(inputFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var currentFolder, targetFolders, fileFullPaths, _i, targetFolders_1, folder, targetFolderFullPath, inputFileFullPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentFolder = process.cwd();
                    return [4 /*yield*/, parseCSVColumns(exports.programOptions.folder)];
                case 1:
                    targetFolders = _a.sent();
                    fileFullPaths = [];
                    for (_i = 0, targetFolders_1 = targetFolders; _i < targetFolders_1.length; _i++) {
                        folder = targetFolders_1[_i];
                        targetFolderFullPath = getFullPath(folder, currentFolder);
                        inputFileFullPath = getFullPath(inputFilePath, targetFolderFullPath);
                        if (fs.existsSync(inputFileFullPath)) {
                            fileFullPaths.push(inputFileFullPath);
                        }
                    }
                    if (fileFullPaths.length === 0) {
                        console.log('');
                        console.log("" + translate('Error of not found the specified file.'));
                        console.log("    FileName: " + inputFilePath);
                        console.log("    Folder: " + exports.programOptions.folder);
                        return [2 /*return*/, ''];
                    }
                    else if (fileFullPaths.length >= 2) {
                        console.log('');
                        console.log("" + translate('Error of same file name exists.'));
                        console.log("    FileName: " + inputFilePath);
                        console.log("    Folder: " + exports.programOptions.folder);
                        return [2 /*return*/, ''];
                    }
                    return [2 /*return*/, fileFullPaths[0]];
            }
        });
    });
}
// replaceSettingsSub
function replaceSettingsSub(inputFilePath, replacingSettingIndex, keyValues, addOriginalTag) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function () {
        var errorCount, replacingKeyValues, previousEvalatedKeys, oldFilePath, newFilePath, loop, verboseMode, _loop_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    errorCount = 0;
                    replacingKeyValues = keyValues;
                    previousEvalatedKeys = {};
                    oldFilePath = inputFilePath;
                    newFilePath = inputFilePath + ".new";
                    loop = true;
                    verboseMode = false;
                    if (verboseMode) {
                        console.log("verbose >> inputFilePath: " + inputFilePath);
                        console.log("verbose >> setting index: " + replacingSettingIndex);
                        console.log("verbose >> keyValues: " + JSON.stringify(keyValues));
                    }
                    _loop_1 = function () {
                        var writer, readStream, reader, lines, isReadingSetting, setting, settingCount, settingIndentLength, settingLineNum, oldSetting, lineNum, isReplacing, isAllReplacable, evalatedKeys, ifTagParser, oldIfTagParser, previousEvalatedKeysLength, reader_3, reader_3_1, line1, line, output, separator, key, oldValue, replacingKeys, replacedValue, commentIndex, comment, original, templateTag, replacingLine, expected, replaced, before, after, e_3_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    writer = new WriteBuffer(fs.createWriteStream(newFilePath));
                                    readStream = fs.createReadStream(oldFilePath);
                                    reader = readline.createInterface({
                                        input: readStream,
                                        crlfDelay: Infinity
                                    });
                                    lines = [];
                                    isReadingSetting = false;
                                    setting = {};
                                    settingCount = 0;
                                    settingIndentLength = 0;
                                    settingLineNum = -1;
                                    oldSetting = {};
                                    lineNum = 0;
                                    isReplacing = false;
                                    isAllReplacable = true;
                                    evalatedKeys = {};
                                    ifTagParser = new IfTagParser();
                                    oldIfTagParser = new IfTagParser();
                                    previousEvalatedKeysLength = Object.keys(previousEvalatedKeys).length;
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 6, 7, 12]);
                                    reader_3 = (e_3 = void 0, __asyncValues(reader));
                                    _c.label = 2;
                                case 2: return [4 /*yield*/, reader_3.next()];
                                case 3:
                                    if (!(reader_3_1 = _c.sent(), !reader_3_1.done)) return [3 /*break*/, 5];
                                    line1 = reader_3_1.value;
                                    line = line1;
                                    lines.push(line);
                                    lineNum += 1;
                                    output = false;
                                    // isReadingSetting = ...
                                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                                        isReadingSetting = true;
                                        setting = {};
                                        settingCount += 1;
                                        settingIndentLength = indentRegularExpression.exec(line)[0].length;
                                        settingLineNum = lineNum;
                                        oldSetting = {};
                                        if (replacingSettingIndex === allSetting) {
                                            isReplacing = true;
                                        }
                                        else {
                                            isReplacing = (settingCount === replacingSettingIndex);
                                        }
                                    }
                                    else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                                        isReadingSetting = false;
                                    }
                                    ifTagParser.evaluate(line, setting, Object.keys(previousEvalatedKeys));
                                    oldIfTagParser.evaluate(line, oldSetting, Object.keys(previousEvalatedKeys));
                                    if (isReplacing) {
                                        if (!ifTagParser.isReplacable) {
                                            isAllReplacable = false;
                                        }
                                        // In settings tag
                                        if (isReadingSetting) {
                                            separator = line.indexOf(':');
                                            if (separator !== notFound) {
                                                key = line.substr(0, separator).trim();
                                                oldValue = getValue(line, separator);
                                                if (ifTagParser.isReplacable && oldValue !== '') {
                                                    if (key in replacingKeyValues) {
                                                        evalatedKeys[key] = replacingKeyValues[key];
                                                    }
                                                    else {
                                                        evalatedKeys[key] = oldValue;
                                                    }
                                                }
                                                if (oldValue !== '' && oldIfTagParser.thisIsOutOfFalseBlock) {
                                                    oldSetting[key] = { value: oldValue, isReferenced: false, lineNum: lineNum };
                                                }
                                                if (ifTagParser.thisIsOutOfFalseBlock) {
                                                    replacingKeys = Object.keys(replacingKeyValues);
                                                    if (replacingKeys.includes(key) && ifTagParser.isReplacable) {
                                                        replacedValue = replacingKeyValues[key];
                                                        commentIndex = line.indexOf('#', separator);
                                                        comment = '';
                                                        if (commentIndex !== notFound && !replacedValue.includes('#')) {
                                                            comment = '  ' + line.substr(commentIndex);
                                                        }
                                                        original = '';
                                                        if (!line.includes(originalLabel)) {
                                                            if (addOriginalTag) {
                                                                original = "  " + originalLabel + " " + oldValue;
                                                            }
                                                        }
                                                        else {
                                                            if (!addOriginalTag) {
                                                                comment = comment.replace(new RegExp(" *" + originalLabel + " *" + escapeRegularExpression(replacedValue)), '');
                                                            }
                                                        }
                                                        writer.write(line.substr(0, separator + 1) + ' ' + replacedValue + original + comment + "\n");
                                                        output = true;
                                                        setting[key] = { value: replacedValue, isReferenced: false, lineNum: lineNum };
                                                        if (verboseMode && oldValue !== replacedValue) {
                                                            console.log("verbose >> replaced \"" + key + "\" value from \"" + oldValue + "\" to \"" + replacedValue + "\"");
                                                            console.log("verbose >>     at: " + inputFilePath + ":" + lineNum + ":");
                                                        }
                                                    }
                                                    else {
                                                        if (oldValue !== '') {
                                                            setting[key] = { value: oldValue, isReferenced: false, lineNum: lineNum };
                                                        }
                                                    }
                                                }
                                            }
                                            // Out of settings
                                        }
                                        else {
                                            templateTag = parseTemplateTag(line);
                                            if (templateTag.isFound && templateTag.includesKey(Object.keys(setting))
                                                && ifTagParser.thisIsOutOfFalseBlock && ifTagParser.isReplacable) {
                                                replacingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                                                expected = getExpectedLine(oldSetting, templateTag.template);
                                                replaced = getReplacedLine(setting, templateTag.template, replacingKeyValues);
                                                if (replacingLine.includes(expected)) {
                                                    before = expected;
                                                    after = replaced;
                                                    if (templateTag.lineNumOffset <= -1) {
                                                        writer.replaceAboveLine(templateTag.lineNumOffset, replacingLine.replace(before, after) + "\n");
                                                    }
                                                    else {
                                                        writer.write(line.replace(before, after) + "\n");
                                                        output = true;
                                                    }
                                                    if (verboseMode && before !== after) {
                                                        console.log("verbose >> replaced a line:");
                                                        console.log("verbose >>     from: " + before);
                                                        console.log("verbose >>     to:   " + after);
                                                        console.log("verbose >>     at: " + inputFilePath + ":" + (lineNum - templateTag.lineNumOffset) + ":");
                                                    }
                                                }
                                                else if (replacingLine.includes(replaced)) {
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
                                                        console.log("  " + translate('Setting') + ": " + getTestablePath(inputFilePath) + ":" + settingLineNum);
                                                        errorCount += 1;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (!output) {
                                        writer.write(line + "\n");
                                    }
                                    _c.label = 4;
                                case 4: return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_3_1 = _c.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _c.trys.push([7, , 10, 11]);
                                    if (!(reader_3_1 && !reader_3_1.done && (_a = reader_3.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _a.call(reader_3)];
                                case 8:
                                    _c.sent();
                                    _c.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12:
                                    // previousReplacedKeys = ...
                                    Object.keys(evalatedKeys).forEach(function (key) {
                                        previousEvalatedKeys[key] = evalatedKeys[key];
                                    });
                                    if (isAllReplacable) {
                                        loop = false;
                                    }
                                    else if (previousEvalatedKeysLength == Object.keys(previousEvalatedKeys).length) {
                                        console.log('');
                                        console.log('Error of unexpected');
                                        errorCount += 1;
                                        loop = false;
                                    }
                                    // ...
                                    writer.end();
                                    return [4 /*yield*/, new Promise(function (resolve) {
                                            writer.on('finish', function () {
                                                fs.copyFileSync(newFilePath, inputFilePath);
                                                deleteFileSync(newFilePath);
                                                resolve();
                                            });
                                        })];
                                case 13:
                                    _c.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b.label = 1;
                case 1:
                    if (!loop) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, errorCount];
            }
        });
    });
}
// makeRevertSettings
function makeRevertSettings(inputFilePath, replacingSettingIndex) {
    var e_4, _a;
    return __awaiter(this, void 0, void 0, function () {
        var readStream, reader, isReadingSetting, revertSettings, settingCount, settingIndentLength, lineNum, isReadingOriginal, ifTrueScanner, reader_4, reader_4_1, line1, line, separator, key, originalLabelSeparator, originalValue, revertSetting, revertSetting, e_4_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    readStream = fs.createReadStream(inputFilePath);
                    reader = readline.createInterface({
                        input: readStream,
                        crlfDelay: Infinity
                    });
                    isReadingSetting = false;
                    revertSettings = [];
                    settingCount = 0;
                    settingIndentLength = 0;
                    lineNum = 0;
                    isReadingOriginal = false;
                    ifTrueScanner = new IfTrueConditionScanner();
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
                    // setting = ...
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                        isReadingSetting = true;
                        settingCount += 1;
                        settingIndentLength = indentRegularExpression.exec(line)[0].length;
                        if (replacingSettingIndex === allSetting) {
                            isReadingOriginal = true;
                        }
                        else {
                            isReadingOriginal = (settingCount === replacingSettingIndex);
                        }
                    }
                    else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength
                        && isReadingSetting) {
                        isReadingSetting = false;
                        isReadingOriginal = false;
                    }
                    if (isReadingOriginal) {
                        ifTrueScanner.evaluate(line);
                        // Parse #original tag
                        if (line.includes(originalLabel)) {
                            separator = line.indexOf(':');
                            if (separator !== notFound) {
                                key = line.substr(0, separator).trim();
                                originalLabelSeparator = line.indexOf(originalLabel) + originalLabel.length - 1;
                                originalValue = getValue(line, originalLabelSeparator);
                                if (ifTrueScanner.condition === '') {
                                    revertSetting = key + ": " + originalValue;
                                }
                                else {
                                    revertSetting = ifTrueScanner.condition + '\n' + (key + ": " + originalValue);
                                }
                                revertSettings.push(revertSetting);
                            }
                        }
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
                    if (!(reader_4_1 && !reader_4_1.done && (_a = reader_4.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_4)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_4) throw e_4.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12: return [2 /*return*/, revertSettings.reverse()];
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
    TemplateTag.prototype.includesKey = function (keys) {
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            if (this.template.includes(key)) {
                return true;
            }
        }
        return false;
    };
    TemplateTag.prototype.checkTargetFileContents = function (setting, inputFilePath, templateEndLineNum) {
        var e_5, _a;
        return __awaiter(this, void 0, void 0, function () {
            var parentPath, targetFilePath, templateLineNum, targetFileReader, expectedFirstLine, templateLineIndex, targetLineNum, errorTemplateLineIndex, errorTargetLineNum, errorContents, errorExpected, errorTemplate, indent, Result, result, skipTo, skipToTemplate, skipFrom, skipStartLineNum, loop, exception, targetFileReader_1, targetFileReader_1_1, line1, targetLine, indentLength, expected, e_5_1, templateLineNum;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parentPath = path.dirname(inputFilePath);
                        targetFilePath = getFullPath(getExpectedLine(setting, this.template), parentPath);
                        if (!fs.existsSync(targetFilePath)) {
                            templateLineNum = templateEndLineNum - this.templateLines.length;
                            console.log("");
                            console.log("Error of not found the target file:");
                            console.log("  " + translate('NotFound') + ": " + targetFilePath);
                            console.log("  Template: " + inputFilePath + ":" + templateLineNum);
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
                        (function (Result) {
                            Result[Result["same"] = 0] = "same";
                            Result[Result["different"] = 1] = "different";
                            Result[Result["skipped"] = 2] = "skipped";
                        })(Result || (Result = {}));
                        ;
                        result = Result.same;
                        skipTo = '';
                        skipToTemplate = '';
                        skipFrom = '';
                        skipStartLineNum = 0;
                        loop = true;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 12]);
                        targetFileReader_1 = __asyncValues(targetFileReader);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, targetFileReader_1.next()];
                    case 3:
                        if (!(targetFileReader_1_1 = _b.sent(), !targetFileReader_1_1.done)) return [3 /*break*/, 5];
                        line1 = targetFileReader_1_1.value;
                        if (!loop) {
                            return [3 /*break*/, 4];
                        } // "reader" requests read all lines
                        try {
                            targetLine = line1;
                            targetLineNum += 1;
                            if (templateLineIndex === 0) {
                                indentLength = targetLine.indexOf(expectedFirstLine);
                                if (indentLength !== notFound && targetLine.trim() === expectedFirstLine) {
                                    result = Result.same;
                                    indent = targetLine.substr(0, indentLength);
                                }
                                else {
                                    result = Result.different;
                                }
                            }
                            else if (skipTo === '') { // lineIndex >= 1, not skipping
                                expected = getExpectedLineInFileTemplate(setting, this.templateLines[templateLineIndex]);
                                if (targetLine === indent + expected) {
                                    result = Result.same;
                                }
                                else if (expected.trim() === fileTemplateAnyLinesLabel) {
                                    result = Result.skipped;
                                    templateLineIndex += 1;
                                    skipToTemplate = this.templateLines[templateLineIndex];
                                    skipTo = getExpectedLineInFileTemplate(setting, this.templateLines[templateLineIndex]);
                                    skipFrom = targetLine;
                                    skipStartLineNum = targetLineNum;
                                }
                                else {
                                    result = Result.different;
                                    errorTemplateLineIndex = templateLineIndex;
                                    errorTargetLineNum = targetLineNum;
                                    errorContents = targetLine;
                                    errorExpected = indent + expected;
                                    errorTemplate = indent + this.templateLines[templateLineIndex];
                                }
                            }
                            else { // skipTo
                                if (targetLine === indent + skipTo) {
                                    result = Result.same;
                                }
                                else if (targetLine.startsWith(indent)) {
                                    result = Result.skipped;
                                }
                                else {
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
                                    loop = false; // return or break must not be written.
                                    // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                                }
                                skipTo = '';
                            }
                            else if (result === Result.skipped) {
                                // Do nothing
                            }
                            else { // Result.different
                                templateLineIndex = 0;
                                skipTo = '';
                            }
                        }
                        catch (e) {
                            exception = e;
                            loop = false;
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
                        if (!(targetFileReader_1_1 && !targetFileReader_1_1.done && (_a = targetFileReader_1.return))) return [3 /*break*/, 9];
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
                        if (exception) {
                            throw exception;
                        }
                        if (result !== Result.same) {
                            templateLineNum = 0;
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
                            console.log("" + translate('Error of not same as file contents:'));
                            console.log("  " + translate('typrmFile') + ": " + getTestablePath(inputFilePath) + ":" + templateLineNum);
                            console.log("  " + translate('ErrorFile') + ": " + getTestablePath(targetFilePath) + ":" + errorTargetLineNum);
                            console.log("  Template: " + errorTemplate);
                            console.log("  Expected: " + errorExpected);
                            console.log("  Contents: " + errorContents);
                        }
                        return [2 /*return*/, result === Result.same];
                }
            });
        });
    };
    return TemplateTag;
}());
// IfTagParser
var IfTagParser = /** @class */ (function () {
    function IfTagParser() {
        this.thisIsOutOfFalseBlock_ = true;
        this.indentLengthsOfIfTag = [
            { indentLength: -1, resultOfIf: true, enabled: true, isReplacable: true }
        ];
        this.isReplacable_ = true;
    }
    Object.defineProperty(IfTagParser.prototype, "thisIsOutOfFalseBlock", {
        get: function () { return this.thisIsOutOfFalseBlock_; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IfTagParser.prototype, "isReplacable", {
        get: function () { return this.isReplacable_; } // #search: typrm replace with if tag
        ,
        enumerable: false,
        configurable: true
    });
    // evaluate
    IfTagParser.prototype.evaluate = function (line, setting, previsousEvalatedKeys) {
        if (previsousEvalatedKeys === void 0) { previsousEvalatedKeys = []; }
        var expression = '';
        var errorCount = 0;
        var indentLength = indentRegularExpression.exec(line)[0].length;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {
                this.indentLengthsOfIfTag.pop();
                this.thisIsOutOfFalseBlock_ = lastOf(this.indentLengthsOfIfTag).enabled;
                this.isReplacable_ = lastOf(this.indentLengthsOfIfTag).isReplacable;
            }
        }
        if (line.includes(ifLabel)) {
            expression = line.substr(line.indexOf(ifLabel) + ifLabel.length).trim();
            var evaluatedContidion = evaluateIfCondition(expression, setting, previsousEvalatedKeys);
            if (typeof evaluatedContidion === 'boolean') {
                var resultOfIf = evaluatedContidion;
                var isReplacable = false;
            }
            else if (instanceOf.EvaluatedCondition(evaluatedContidion)) {
                var resultOfIf = evaluatedContidion.result;
                var isReplacable = evaluatedContidion.isReplacable;
            }
            else {
                errorCount += 1;
                var resultOfIf = true;
                var isReplacable = false;
            }
            if (this.thisIsOutOfFalseBlock && !resultOfIf) {
                this.thisIsOutOfFalseBlock_ = false;
            }
            this.indentLengthsOfIfTag.push({ indentLength: indentLength, resultOfIf: resultOfIf,
                enabled: this.thisIsOutOfFalseBlock, isReplacable: this.isReplacable_ });
            this.isReplacable_ = isReplacable;
        }
        return { condition: expression, errorCount: errorCount };
    };
    return IfTagParser;
}());
// IfTrueConditionScanner
var IfTrueConditionScanner = /** @class */ (function () {
    function IfTrueConditionScanner() {
        this.condition_ = '';
        this.isUpdated_ = false;
        this.indentLengthsOfIfTag = [
            { indentLength: -1, trueCondition: '' }
        ];
    }
    Object.defineProperty(IfTrueConditionScanner.prototype, "condition", {
        get: function () { return this.condition_; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(IfTrueConditionScanner.prototype, "isUpdated", {
        get: function () { return this.isUpdated_; },
        enumerable: false,
        configurable: true
    });
    // evaluate
    IfTrueConditionScanner.prototype.evaluate = function (line) {
        var indentLength = indentRegularExpression.exec(line)[0].length;
        this.isUpdated_ = false;
        if (line.trim() !== '') {
            while (indentLength <= lastOf(this.indentLengthsOfIfTag).indentLength) {
                var previousBlock = this.indentLengthsOfIfTag.pop();
                if (previousBlock && previousBlock.trueCondition) {
                    this.isUpdated_ = true;
                }
            }
        }
        if (line.includes(ifLabel)) {
            var expression = line.substr(line.indexOf(ifLabel) + ifLabel.length).trim();
            var trueCondition = getTrueCondition(expression);
            if (trueCondition) {
                this.isUpdated_ = true;
            }
            this.indentLengthsOfIfTag.push({ indentLength: indentLength, trueCondition: trueCondition });
        }
        if (this.isUpdated_) {
            this.condition_ = this.indentLengthsOfIfTag.map(function (block) { return (block.trueCondition); })
                .filter(function (trueCondition) { return (trueCondition); }).join('\n');
        }
    };
    return IfTrueConditionScanner;
}());
// check
function check(checkingFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var targetFolders, currentFolder, inputFileFullPaths, notFoundPaths, _i, targetFolders_2, folder, targetFolderFullPath, inputFileFullPath, filePaths, _loop_2, _a, targetFolders_3, folder, _b, inputFileFullPaths_1, inputFileFullPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, parseCSVColumns(exports.programOptions.folder)];
                case 1:
                    targetFolders = _c.sent();
                    currentFolder = process.cwd();
                    inputFileFullPaths = [];
                    notFoundPaths = [];
                    if (!checkingFilePath) return [3 /*break*/, 2];
                    for (_i = 0, targetFolders_2 = targetFolders; _i < targetFolders_2.length; _i++) {
                        folder = targetFolders_2[_i];
                        targetFolderFullPath = getFullPath(folder, currentFolder);
                        inputFileFullPath = getFullPath(checkingFilePath, targetFolderFullPath);
                        if (fs.existsSync(inputFileFullPath)) {
                            inputFileFullPaths.push(inputFileFullPath);
                            break;
                        }
                        else {
                            notFoundPaths.push(inputFileFullPath);
                        }
                    }
                    if (inputFileFullPaths.length === 0) {
                        throw new Error("Not found specified target file at \"" + JSON.stringify(notFoundPaths) + "\".");
                    }
                    filePaths = [checkingFilePath];
                    return [3 /*break*/, 7];
                case 2:
                    _loop_2 = function (folder) {
                        var targetFolderFullPath, scanedPaths;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    targetFolderFullPath = getFullPath(folder, currentFolder);
                                    if (!fs.existsSync(targetFolderFullPath)) {
                                        throw new Error("Not found target folder at \"" + targetFolderFullPath + "\".");
                                    }
                                    process.chdir(targetFolderFullPath);
                                    return [4 /*yield*/, globby(['**/*'])];
                                case 1:
                                    scanedPaths = _d.sent();
                                    scanedPaths.forEach(function (scanedPath) {
                                        inputFileFullPaths.push(getFullPath(scanedPath, targetFolderFullPath));
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a = 0, targetFolders_3 = targetFolders;
                    _c.label = 3;
                case 3:
                    if (!(_a < targetFolders_3.length)) return [3 /*break*/, 6];
                    folder = targetFolders_3[_a];
                    return [5 /*yield**/, _loop_2(folder)];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6:
                    process.chdir(currentFolder);
                    _c.label = 7;
                case 7:
                    _b = 0, inputFileFullPaths_1 = inputFileFullPaths;
                    _c.label = 8;
                case 8:
                    if (!(_b < inputFileFullPaths_1.length)) return [3 /*break*/, 11];
                    inputFileFullPath = inputFileFullPaths_1[_b];
                    return [4 /*yield*/, checkRoutine(false, inputFileFullPath)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10:
                    _b++;
                    return [3 /*break*/, 8];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// search
function search() {
    var e_6, _a;
    return __awaiter(this, void 0, void 0, function () {
        var startIndex, keyword, keywordDoubleQuoted, currentFolder, fileFullPaths, targetFolders, _loop_3, _i, targetFolders_4, folder, indentAtTag, indentPosition, indentAtFirstContents, inGlossary, foundLines, _loop_4, lineNum, _b, fileFullPaths_1, inputFileFullPath, keyphraseWordCount, _c, foundLines_1, foundLineInformation;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    startIndex = (exports.programArguments[0] === 's' || exports.programArguments[0] === 'search') ? 1 : 0;
                    keyword = exports.programArguments.slice(startIndex).join(' ');
                    keywordDoubleQuoted = keyword.replace(/"/g, '""');
                    currentFolder = process.cwd();
                    fileFullPaths = [];
                    return [4 /*yield*/, parseCSVColumns(exports.programOptions.folder)];
                case 1:
                    targetFolders = _d.sent();
                    _loop_3 = function (folder) {
                        var targetFolderFullPath, scanedPaths;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    targetFolderFullPath = getFullPath(folder, currentFolder);
                                    process.chdir(targetFolderFullPath);
                                    return [4 /*yield*/, globby(['**/*'])];
                                case 1:
                                    scanedPaths = _e.sent();
                                    scanedPaths.forEach(function (scanedPath) {
                                        fileFullPaths.push(getFullPath(scanedPath, targetFolderFullPath));
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, targetFolders_4 = targetFolders;
                    _d.label = 2;
                case 2:
                    if (!(_i < targetFolders_4.length)) return [3 /*break*/, 5];
                    folder = targetFolders_4[_i];
                    return [5 /*yield**/, _loop_3(folder)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    process.chdir(currentFolder);
                    indentAtTag = '';
                    indentPosition = -1;
                    indentAtFirstContents = '';
                    inGlossary = false;
                    foundLines = [];
                    _loop_4 = function (inputFileFullPath) {
                        var reader, reader_5, reader_5_1, line1, line, csv, columns, found, positionOfCSV, columnPositions, _f, _g, match, currentIndent, characterAtIndent, colonPosition, wordInGlossary, found, _h, _j, match, e_6_1;
                        return __generator(this, function (_k) {
                            switch (_k.label) {
                                case 0:
                                    reader = readline.createInterface({
                                        input: fs.createReadStream(inputFileFullPath),
                                        crlfDelay: Infinity
                                    });
                                    lineNum = 0;
                                    _k.label = 1;
                                case 1:
                                    _k.trys.push([1, 8, 9, 14]);
                                    reader_5 = (e_6 = void 0, __asyncValues(reader));
                                    _k.label = 2;
                                case 2: return [4 /*yield*/, reader_5.next()];
                                case 3:
                                    if (!(reader_5_1 = _k.sent(), !reader_5_1.done)) return [3 /*break*/, 7];
                                    line1 = reader_5_1.value;
                                    line = line1;
                                    lineNum += 1;
                                    if (!(line.includes(keywordLabel) && !line.includes(disableLabel))) return [3 /*break*/, 5];
                                    csv = line.substr(line.indexOf(keywordLabel) + keywordLabel.length);
                                    return [4 /*yield*/, parseCSVColumns(csv)
                                            .catch(function (e) {
                                            console.log("Warning: " + e.message + " in " + inputFileFullPath + ":" + lineNum + ": " + line);
                                            return [];
                                        })];
                                case 4:
                                    columns = _k.sent();
                                    found = getKeywordMatchingScore(columns, keyword);
                                    if (found.score >= 1) {
                                        positionOfCSV = line.length - csv.length;
                                        columnPositions = parseCSVColumnPositions(csv, columns);
                                        found.path = getTestablePath(inputFileFullPath);
                                        found.lineNum = lineNum;
                                        found.line = line;
                                        for (_f = 0, _g = found.matches; _f < _g.length; _f++) {
                                            match = _g[_f];
                                            match.position += positionOfCSV + columnPositions[match.testTargetIndex];
                                        }
                                        foundLines.push(found);
                                    }
                                    _k.label = 5;
                                case 5:
                                    // glossary tag
                                    if (line.includes(glossaryLabel)) {
                                        inGlossary = true;
                                        indentAtTag = indentRegularExpression.exec(line)[0];
                                        indentAtFirstContents = '';
                                    }
                                    else if (inGlossary) {
                                        currentIndent = indentRegularExpression.exec(line)[0];
                                        if (indentAtFirstContents === '') {
                                            indentAtFirstContents = currentIndent;
                                            indentPosition = indentAtFirstContents.length;
                                        }
                                        characterAtIndent = line[indentPosition];
                                        if (characterAtIndent === ' ' ||
                                            characterAtIndent === '\t' ||
                                            characterAtIndent === undefined) {
                                            // Skip this line
                                        }
                                        else {
                                            colonPosition = line.indexOf(':', currentIndent.length);
                                            wordInGlossary = line.substr(currentIndent.length, colonPosition - currentIndent.length);
                                            found = getKeywordMatchingScore([wordInGlossary], keyword);
                                            if (found.score >= 1 && colonPosition !== notFound) {
                                                found.path = getTestablePath(inputFileFullPath);
                                                found.lineNum = lineNum;
                                                found.line = line;
                                                for (_h = 0, _j = found.matches; _h < _j.length; _h++) {
                                                    match = _j[_h];
                                                    match.position += indentPosition;
                                                }
                                                foundLines.push(found);
                                            }
                                        }
                                        if (currentIndent.length <= indentAtTag.length) {
                                            inGlossary = false;
                                        }
                                    }
                                    _k.label = 6;
                                case 6: return [3 /*break*/, 2];
                                case 7: return [3 /*break*/, 14];
                                case 8:
                                    e_6_1 = _k.sent();
                                    e_6 = { error: e_6_1 };
                                    return [3 /*break*/, 14];
                                case 9:
                                    _k.trys.push([9, , 12, 13]);
                                    if (!(reader_5_1 && !reader_5_1.done && (_a = reader_5.return))) return [3 /*break*/, 11];
                                    return [4 /*yield*/, _a.call(reader_5)];
                                case 10:
                                    _k.sent();
                                    _k.label = 11;
                                case 11: return [3 /*break*/, 13];
                                case 12:
                                    if (e_6) throw e_6.error;
                                    return [7 /*endfinally*/];
                                case 13: return [7 /*endfinally*/];
                                case 14: return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, fileFullPaths_1 = fileFullPaths;
                    _d.label = 6;
                case 6:
                    if (!(_b < fileFullPaths_1.length)) return [3 /*break*/, 9];
                    inputFileFullPath = fileFullPaths_1[_b];
                    return [5 /*yield**/, _loop_4(inputFileFullPath)];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 6];
                case 9:
                    keyphraseWordCount = keyword.split(' ').length;
                    foundLines = foundLines.filter(function (found) { return (found.matchedKeywordCount >= keyphraseWordCount); });
                    foundLines.sort(function (a, b) {
                        // score
                        var different = a.score - b.score;
                        // testedWordCount
                        if (different === 0) {
                            different = b.testedWordCount - a.testedWordCount;
                        }
                        // path
                        if (different === 0) {
                            if (a.path < b.path) {
                                different = -1;
                            }
                            else if (a.path > b.path) {
                                different = +1;
                            }
                        }
                        // lineNum
                        if (different === 0) {
                            different = a.lineNum - b.lineNum;
                        }
                        return different;
                    });
                    for (_c = 0, foundLines_1 = foundLines; _c < foundLines_1.length; _c++) {
                        foundLineInformation = foundLines_1[_c];
                        console.log(foundLineInformation.toString());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// getKeywordMatchingScore
function getKeywordMatchingScore(testingStrings, keyphrase) {
    var lowerKeyphrase = keyphrase.toLowerCase();
    var found = new FoundLine();
    function subMain() {
        var score = testingStrings.reduce(function (maxScore, aTestingString, stringIndex) {
            var keywords = keyphrase.split(' ');
            var thisScore = 0;
            var result = getSubMatchedScore(aTestingString, keyphrase, lowerKeyphrase, stringIndex);
            if (result.score !== 0) {
                thisScore = result.score * keywords.length * phraseMatchScoreWeight;
                found.matchedKeywordCount = keywords.length;
                found.testedWordCount = aTestingString.split(' ').length;
            }
            else {
                var previousPosition = -1;
                for (var _i = 0, keywords_3 = keywords; _i < keywords_3.length; _i++) {
                    var keyword = keywords_3[_i];
                    if (keyword === '') {
                        continue;
                    }
                    var result_1 = getSubMatchedScore(aTestingString, keyword, keyword.toLowerCase(), stringIndex);
                    if (result_1.position > previousPosition) {
                        thisScore += result_1.score * orderMatchScoreWeight;
                    }
                    else {
                        thisScore += result_1.score;
                    }
                    if (result_1.score !== 0) {
                        found.matchedKeywordCount += 1;
                    }
                    if (result_1.position !== notFound) {
                        previousPosition = result_1.position;
                    }
                }
            }
            maxScore = Math.max(maxScore, thisScore);
            return maxScore;
        }, 0);
        return score;
    }
    function getSubMatchedScore(testingString, keyword, lowerKeyword, stringIndex) {
        var score = 0;
        var position = notFound;
        if ((position = testingString.indexOf(keyword)) !== notFound) {
            if (testingString.length === keyword.length) {
                score = fullMatchScore;
            }
            else {
                if (testingString[position - 1] === ' ' || testingString[keyword.length] === ' ') {
                    score = wordsMatchScore;
                }
                else {
                    score = partMatchScore;
                }
            }
        }
        else if ((position = testingString.toLowerCase().indexOf(lowerKeyword)) !== notFound) {
            if (testingString.length === lowerKeyword.length) {
                score = caseIgnoredFullMatchScore;
            }
            else {
                score = caseIgnoredPartMatchScore;
            }
        }
        if (position !== notFound) {
            var matched = new MatchedPart();
            matched.position = position;
            matched.length = keyword.replace(/"/g, '""').length;
            matched.testTargetIndex = stringIndex;
            found.matches.push(matched);
        }
        return { score: score, position: position };
    }
    var score = subMain();
    found.score = score;
    return found;
}
// varidateUpdateCommandArguments
function varidateUpdateCommandArguments() {
    if (exports.programArguments.length < 4) {
        throw new Error('Error: Too few argurments. Usage: typrm replace  __FilePath__  __LineNum__  "__KeyColonValue__"');
    }
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
// evaluateIfCondition
function evaluateIfCondition(expression, setting, previsousEvalatedKeys) {
    if (previsousEvalatedKeys === void 0) { previsousEvalatedKeys = []; }
    if (expression === 'true') {
        return true;
    }
    else if (expression === 'false') {
        return false;
    }
    var settingsDot = '$settings.';
    var envDot = '$env.';
    var match = null;
    var parent = '';
    if (expression.startsWith(settingsDot)) {
        parent = settingsDot;
        // e.g. $settings.__Stage__ == develop
        // e.g. $settings.__Stage__ != develop
        match = /\$settings.([^ ]*) *(==|!=) *([^ ].*)/.exec(expression);
    }
    else if (expression.startsWith(envDot)) {
        parent = envDot;
        // e.g. $env.typrm_aaa == aaa
        // e.g. $env.typrm_aaa != aaa
        // e.g. $env.typrm_aaa == ""
        // e.g. $env.typrm_aaa != ""
        match = /\$env.([^ ]*) *(==|!=) *([^ ]*)/.exec(expression);
    }
    if (match && parent) {
        var name_1 = match[1];
        var operator = match[2];
        var rightValue = match[3];
        if (parent === settingsDot) {
            if (name_1 in setting) {
                var leftValue = setting[name_1].value;
                setting[name_1].isReferenced = true;
            }
            else {
                return new Error("not found " + name_1 + " in the settings");
            }
        }
        else if (parent === envDot) {
            var envValue = process.env[name_1];
            if (envValue) {
                var leftValue = envValue;
            }
            else {
                var leftValue = '';
            }
        }
        else { // if no parent
            var leftValue = '';
        }
        if (rightValue === '""') {
            rightValue = '';
        }
        var result;
        if (operator === '==') {
            result = (leftValue === rightValue);
        }
        else if (operator === '!=') {
            result = (leftValue !== rightValue);
        }
        if (result !== undefined) {
            if (previsousEvalatedKeys.length === 0) {
                return result;
            }
            else {
                return {
                    result: result,
                    isReplacable: previsousEvalatedKeys.includes(name_1),
                };
            }
        }
    }
    return new Error('syntax error');
}
var EvaluatedCondition = /** @class */ (function () {
    function EvaluatedCondition() {
        this.result = false;
        this.isReplacable = false;
    }
    return EvaluatedCondition;
}());
var instanceOf;
(function (instanceOf) {
    function EvaluatedCondition(object) {
        return object.hasOwnProperty('isReplacable');
    }
    instanceOf.EvaluatedCondition = EvaluatedCondition;
})(instanceOf || (instanceOf = {}));
// getTrueCondition
function getTrueCondition(expression) {
    var settingsDot = '$settings.';
    if (expression.startsWith(settingsDot)) {
        // e.g. $settings.__Stage__ == develop
        // e.g. $settings.__Stage__ != develop
        var match = /\$settings.([^ ]*) *(==|!=) *([^ ].*)/.exec(expression);
        if (match) {
            var name_2 = match[1];
            var operator = match[2];
            var rightValue = match[3];
            if (rightValue !== '') {
                var trueCondition;
                if (operator === '==') {
                    trueCondition = name_2 + ": " + rightValue;
                }
                else if (operator === '!=') {
                    trueCondition = name_2 + ": __not_" + rightValue;
                }
                if (trueCondition) {
                    return trueCondition;
                }
            }
        }
    }
    return '';
}
// getSettingIndexFromLineNum
function getSettingIndexFromLineNum(inputFilePath, targetLineNum) {
    var e_7, _a;
    return __awaiter(this, void 0, void 0, function () {
        var reader, settingCount, lineNum, loop, exception, reader_6, reader_6_1, line1, line, e_7_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    settingCount = 0;
                    lineNum = 0;
                    loop = true;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    reader_6 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_6.next()];
                case 3:
                    if (!(reader_6_1 = _b.sent(), !reader_6_1.done)) return [3 /*break*/, 5];
                    line1 = reader_6_1.value;
                    if (!loop) {
                        return [3 /*break*/, 4];
                    } // "reader" requests read all lines
                    try {
                        line = line1;
                        lineNum += 1;
                        if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                            settingCount += 1;
                        }
                        if (lineNum === targetLineNum) {
                            loop = false; // return or break must not be written.
                            // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                        }
                    }
                    catch (e) {
                        exception = e;
                        loop = false;
                    }
                    _b.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_7_1 = _b.sent();
                    e_7 = { error: e_7_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(reader_6_1 && !reader_6_1.done && (_a = reader_6.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_6)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_7) throw e_7.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    if (exception) {
                        throw exception;
                    }
                    return [2 /*return*/, settingCount];
            }
        });
    });
}
// getFullPath
function getFullPath(relativePath, basePath) {
    var fullPath = '';
    var slashRelativePath = relativePath.replace(/\\/g, '/');
    var colonSlashIndex = slashRelativePath.indexOf(':/');
    var slashFirstIndex = slashRelativePath.indexOf('/');
    var withProtocol = (colonSlashIndex + 1 === slashFirstIndex); // e.g.) C:/, http://
    if (relativePath.substr(0, 1) === '/') {
        fullPath = relativePath;
    }
    else if (relativePath.substr(0, 1) === '~') {
        fullPath = relativePath.replace('~', getHomePath());
    }
    else if (withProtocol) {
        fullPath = relativePath;
    }
    else {
        fullPath = path.join(basePath, relativePath);
    }
    return fullPath;
}
// getHomePath
function getHomePath() {
    if (process.env.HOME) {
        return process.env.HOME;
    }
    else {
        return process.env.USERPROFILE;
    }
}
// getTestablePath
function getTestablePath(path_) {
    if ('test' in exports.programOptions) {
        var home = getHomePath();
        if (path_.startsWith(home)) {
            return '${HOME}' + path_.substr(home.length).replace(/\\/g, '/');
        }
        else if (path_.startsWith(inputFileParentPath + path.sep)) {
            return '${inputFileParentPath}/' + path_.substr(inputFileParentPath.length + 1).replace(/\\/g, '/');
        }
        else {
            return path_;
        }
    }
    else {
        return path_;
    }
}
// deleteFile
function deleteFileSync(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// getExpectedLine
function getExpectedLine(setting, template) {
    return getExpectedLineAndEvaluationLog(setting, template, false).expected;
}
// getExpectedLineAndEvaluationLog
function getExpectedLineAndEvaluationLog(setting, template, withLog) {
    var expected = template;
    var log = [];
    for (var _i = 0, _a = Object.keys(setting); _i < _a.length; _i++) {
        var key = _a[_i];
        var re = new RegExp(escapeRegularExpression(key), "gi");
        var expectedAfter = expected.replace(re, setting[key].value);
        if (expectedAfter !== expected) {
            setting[key].isReferenced = true;
            log.push({ before: key, after: setting[key].value });
        }
        expected = expectedAfter;
    }
    return { expected: expected, log: log };
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
// getReplacedLine
function getReplacedLine(setting, template, replacedValues) {
    var replacedSetting = {};
    for (var _i = 0, _a = Object.keys(setting); _i < _a.length; _i++) {
        var key = _a[_i];
        if (key in replacedValues) {
            // var  value = replacedValues[key];
            var value = setting[key].value;
        }
        else {
            var value = setting[key].value;
        }
        replacedSetting[key] = { value: value, lineNum: 0 /*dummy*/, isReferenced: true /*dummy*/ };
    }
    return getExpectedLine(replacedSetting, template);
}
// parseKeyValues
function parseKeyValueLines(keyValueLines) {
    var keyValues = {};
    for (var _i = 0, _a = keyValueLines.split('\n'); _i < _a.length; _i++) {
        var keyValueString = _a[_i];
        var separator = keyValueString.indexOf(':');
        var key = keyValueString.substr(0, separator).trim();
        var value = getValue(keyValueString, separator);
        keyValues[key] = value;
    }
    return keyValues;
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
// parseCSVColumns
function parseCSVColumns(columns) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolveFunction, rejectFunction) {
                    var columnArray = [];
                    stream.Readable.from(columns)
                        .pipe(csvParse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' }))
                        .on('data', function (columns) {
                        columnArray = columns;
                    })
                        .on('end', function () {
                        resolveFunction(columnArray);
                    })
                        .on('error', function (e) {
                        rejectFunction(e);
                    });
                })];
        });
    });
}
// parseCSVColumnPositions
function parseCSVColumnPositions(csv, columns) {
    var positions = [];
    var searchPosition = 0;
    for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
        var column = columns_1[_i];
        var columnPosition = csv.indexOf(column.replace(/\"/g, '""'), searchPosition);
        positions.push(columnPosition);
        searchPosition = csv.indexOf(',', columnPosition + column.length) + 1;
    }
    return positions;
}
// escapeRegularExpression
function escapeRegularExpression(expression) {
    return expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
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
// FoundLine
// Found the keyword and matched part in the line
var FoundLine = /** @class */ (function () {
    function FoundLine() {
        this.path = '';
        this.lineNum = 0;
        this.line = '';
        this.matches = [];
        this.matchedKeywordCount = 0;
        this.testedWordCount = 0;
        this.score = 0;
    }
    FoundLine.prototype.toString = function () {
        // colorParts = sort matched positions and merge overrlapping parts.
        var colorParts = [];
        var sortedParts = this.matches.sort(function (a, b) { return (a.position - b.position); });
        var previousPart = new MatchedPart();
        previousPart.position = -1;
        previousPart.length = 0;
        for (var _i = 0, sortedParts_1 = sortedParts; _i < sortedParts_1.length; _i++) {
            var part = sortedParts_1[_i];
            if (part.position === previousPart.position) {
            }
            else {
                colorParts.push(part);
            }
        }
        // coloredLine = ...
        var coloredLine = '';
        var matchedColor = chalk.green.bold;
        var line = this.line;
        var previousPosition = 0;
        for (var _a = 0, colorParts_1 = colorParts; _a < colorParts_1.length; _a++) {
            var match = colorParts_1[_a];
            coloredLine +=
                line.substr(previousPosition, match.position - previousPosition) +
                    matchedColor(line.substr(match.position, match.length));
            previousPosition = match.position + match.length;
        }
        coloredLine += line.substr(previousPosition);
        return "" + chalk.cyan(this.path) + chalk.keyword('gray')(":" + this.lineNum + ":") + " " + coloredLine;
    };
    return FoundLine;
}());
// MatchedPart
var MatchedPart = /** @class */ (function () {
    function MatchedPart() {
        this.position = 0;
        this.length = 0;
        this.testTargetIndex = -1;
    }
    return MatchedPart;
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
// getStdOut
// Example:
//    var d = getStdOut();  // Set break point here and watch the variable d
function getStdOut() {
    return exports.stdout.split('\n');
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
function pp(message) {
    if (message === void 0) { message = ''; }
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    exports.debugOut.push(message.toString());
    return exports.debugOut;
}
exports.debugOut = [];
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
function cc(targetCount, label) {
    if (targetCount === void 0) { targetCount = 9999999; }
    if (label === void 0) { label = '0'; }
    if (!(label in gCount)) {
        gCount[label] = 0;
    }
    gCount[label] += 1;
    pp(label + ":countThrough[" + label + "] = " + gCount[label]);
    var isTarget = (gCount[label] === targetCount);
    if (isTarget) {
        pp('    **** It is before the target! ****');
    }
    return { isTarget: isTarget, debugOut: exports.debugOut };
}
var gCount = {};
// println
// #keyword: println, console.log, consoleLog
// Output any text to standard output.
function println(message, delayedExpanding) {
    if (delayedExpanding === void 0) { delayedExpanding = false; }
    if (typeof message === 'object' && !delayedExpanding) {
        message = JSON.stringify(message);
    }
    if (withJest && !delayedExpanding) {
        exports.stdout += message.toString() + '\n';
        pp(message.toString());
    }
    else {
        consoleLog(message);
    }
}
var consoleLog = console.log;
console.log = println;
// lastOf
function lastOf(array) {
    return array[array.length - 1];
}
// StandardInputBuffer
var StandardInputBuffer = /** @class */ (function () {
    function StandardInputBuffer() {
        this.inputBuffer = [];
        this.inputResolver = undefined;
    }
    StandardInputBuffer.prototype.delayedConstructor = function () {
        var _this = this;
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
    };
    StandardInputBuffer.prototype.input = function (guide) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.readlines) {
                    this.delayedConstructor();
                }
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
        if (this.readlines) {
            this.readlines.close();
        }
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
    testBaseFolder +`____.yaml`,
    String.raw `file`,
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
            return [2 /*return*/, exports.InputObject.input(guide)];
        });
    });
}
exports.InputObject = new StandardInputBuffer();
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
    // Replace separators to OS format
    path_ = path.resolve(path_);
    return path_;
}
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
            "Error not same as file contents": "ファイルの内容と異なります",
            "YAML UTF-8 file path>": "YAML UTF-8 ファイル パス>",
            "This is a secret value.": "これは秘密の値です。",
            "Replace \"${0}\" to \"${1}\".": "\"${0}\" を \"${1}\" に置き換えてください。",
            "Press Enter key to retry checking.": "Enter キーを押すと再チェックします。",
            "The line number to replace the variable value >": "置き換える変数値がある行番号 >",
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
// callMainFromJest
function callMainFromJest(parameters, options) {
    return __awaiter(this, void 0, void 0, function () {
        var d, s;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    withJest = true;
                    exports.stdout = '';
                    if (parameters) {
                        exports.programArguments = parameters;
                    }
                    else {
                        exports.programArguments = [];
                    }
                    if (options) {
                        exports.programOptions = options;
                    }
                    else {
                        exports.programOptions = {};
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, main()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    d = pp('');
                    s = getStdOut();
                    d = []; // Set break point here and watch the variable d
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.callMainFromJest = callMainFromJest;
var settingStartLabel = /^設定(\(|（[^\)]*\)|）)?:$/;
var settingStartLabelEn = /^settings(\([^\)]*\))?:$/;
var originalLabel = "#original:";
var templateLabel = "#template:";
var templateAtStartLabel = "#template-at(";
var templateAtEndLabel = "):";
var fileTemplateLabel = "#file-template:";
var fileTemplateAnyLinesLabel = "#file-template-any-lines:";
var keywordLabel = "#keyword:";
var glossaryLabel = "#glossary:";
var disableLabel = "#disable-tag-tool:";
var ifLabel = "#if:";
var expectLabel = "#expect:";
var temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
var secretLabel = "#★秘密";
var secretLabelEn = "#secret";
var secretExamleLabel = "#★秘密:仮";
var secretExamleLabelEn = "#secret:example";
var referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
var indentRegularExpression = /^( |¥t)*/;
var fullMatchScore = 100;
var caseIgnoredFullMatchScore = 8;
var wordsMatchScore = 7;
var partMatchScore = 5;
var caseIgnoredPartMatchScore = 3;
var phraseMatchScoreWeight = 4;
var orderMatchScoreWeight = 2;
var minLineNum = 0;
var maxLineNum = 999999999;
var maxNumber = 999999999;
var foundForAbove = minLineNum;
var foundForFollowing = maxLineNum;
var notFound = -1;
var allSetting = 0;
var noSeparator = -1;
var inputFileParentPath = '';
var locale = '';
var withJest = false;
exports.stdout = '';
exports.programArguments = [];
exports.programOptions = {};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=main.js.map