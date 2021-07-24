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
var yaml = require("js-yaml");
var child_process = require("child_process");
var lib = require("./lib");
// main
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var verboseMode, checkingFilePath, inputFilePath, replacingLineNum, keyValues, inputFilePath, replacingLineNum, keyValues, inputFilePath, replacingLineNum, inputFilePath, replacingLineNum;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    locale = Intl.NumberFormat().resolvedOptions().locale;
                    if ('locale' in exports.programOptions) {
                        locale = exports.programOptions.locale;
                    }
                    verboseMode = 'verbose' in exports.programOptions;
                    if (verboseMode) {
                        printConfig();
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
                    varidateReplaceCommandArguments();
                    if (exports.programArguments.length === 3) {
                        inputFilePath = exports.programArguments[1];
                        replacingLineNum = '';
                        keyValues = exports.programArguments[2];
                    }
                    else {
                        inputFilePath = exports.programArguments[1];
                        replacingLineNum = exports.programArguments[2];
                        keyValues = exports.programArguments[3];
                    }
                    return [4 /*yield*/, replaceSettings(inputFilePath, replacingLineNum, keyValues)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 10:
                    if (!(exports.programArguments[0] === 'revert')) return [3 /*break*/, 12];
                    varidateRevertCommandArguments();
                    if (exports.programArguments.length === 2) {
                        inputFilePath = exports.programArguments[1];
                        replacingLineNum = '';
                    }
                    else {
                        inputFilePath = exports.programArguments[1];
                        replacingLineNum = exports.programArguments[2];
                    }
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
        var parentPath, previousTemplateCount, reader, isReadingSetting, setting, settingCount, settingIndentLength, lineNum, templateCount, fileTemplateTag, errorCount, warningCount, secretLabelCount, lines, keywords, ifTagParser, reader_1, reader_1_1, line1, line, previousIsReadingSetting, parsed, _i, _c, _d, key, value, separator, key, value, previous, condition, evaluatedContidion, templateTag, checkingLine, commonCase, expected, expected, checkingLineWithoutTemplate, checkingLineWithoutTemplate, continue_, checkPassed, _e, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, checkPassed, reader_2, reader_2_1, line1, line, _f, keywords_1, keyword, e_2_1, _g, keywords_2, keyword, loop, key, settingNameOrLineNum, replacingSettingIndex, keyValue, _h, _j, _k, key;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    if (!isModal) return [3 /*break*/, 2];
                    return [4 /*yield*/, inputPath(translate('YAML UTF-8 file path>'))];
                case 1:
                    inputFilePath = _l.sent();
                    _l.label = 2;
                case 2:
                    parentPath = path.dirname(inputFilePath);
                    inputFileParentPath = parentPath;
                    previousTemplateCount = 0;
                    _l.label = 3;
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
                    _l.label = 4;
                case 4:
                    _l.trys.push([4, 11, 12, 17]);
                    reader_1 = (e_1 = void 0, __asyncValues(reader));
                    _l.label = 5;
                case 5: return [4 /*yield*/, reader_1.next()];
                case 6:
                    if (!(reader_1_1 = _l.sent(), !reader_1_1.done)) return [3 /*break*/, 10];
                    line1 = reader_1_1.value;
                    line = line1;
                    lines.push(line);
                    lineNum += 1;
                    previousIsReadingSetting = isReadingSetting;
                    parsed = ifTagParser.evaluate(line, setting);
                    if (parsed.errorCount >= 1) {
                        console.log('');
                        console.log('Error of if tag syntax:');
                        console.log("  " + translate('typrmFile') + ": " + getTestablePath(inputFilePath) + ":" + lineNum);
                        console.log("  Contents: " + parsed.condition);
                        errorCount += parsed.errorCount;
                    }
                    // setting = ...
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                        if (settingCount >= 1) {
                            onEndOfSettingScope(setting);
                        }
                        isReadingSetting = true;
                        setting = {};
                        settingCount += 1;
                        settingIndentLength = indentRegularExpression.exec(line)[0].length;
                    }
                    else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                        isReadingSetting = false;
                        if ('verbose' in exports.programOptions) {
                            console.log("verbose: " + inputFilePath + ": settings");
                            for (_i = 0, _c = Object.entries(setting); _i < _c.length; _i++) {
                                _d = _c[_i], key = _d[0], value = _d[1];
                                console.log("verbose: " + inputFilePath + ":" + value.lineNum + ":     " + key + ": " + value.value);
                            }
                        }
                    }
                    if (isReadingSetting && ifTagParser.thisIsOutOfFalseBlock) {
                        separator = line.indexOf(':');
                        if (separator !== notFound) {
                            key = line.substr(0, separator).trim();
                            value = getValue(line, separator);
                            if (value !== '' && key.length >= 1 && key[0] !== '#') {
                                if (key in setting) {
                                    previous = setting[key];
                                    console.log('');
                                    console.log('Error of duplicated variable name:');
                                    console.log("  " + translate('typrmFile') + "A: " + getTestablePath(inputFilePath) + ":" + previous.lineNum);
                                    console.log("  ContentsA: " + key + ": " + previous.value);
                                    console.log("  " + translate('typrmFile') + "B: " + getTestablePath(inputFilePath) + ":" + lineNum);
                                    console.log("  ContentsB: " + key + ": " + value);
                                    errorCount += 1;
                                }
                                setting[key] = { value: value, isReferenced: false, lineNum: lineNum };
                            }
                        }
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
                        commonCase = (templateTag.label !== templateIfLabel);
                        if (commonCase) {
                            expected = getExpectedLine(setting, templateTag.template);
                        }
                        else { // if (templateTag.label === templateIfLabel)
                            templateTag.evaluate(setting);
                            expected = getExpectedLine(setting, templateTag.newTemplate);
                        }
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
                            if (commonCase) {
                                console.log("  " + translate('Template') + ": " + templateTag.template);
                            }
                            else { // if (templateTag.label === templateIfLabel)
                                console.log("  " + translate('Expression') + ": " + templateTag.template);
                            }
                            console.log("  " + translate('SettingIndex') + ": " + settingCount);
                            errorCount += 1;
                        }
                    }
                    if (!fileTemplateTag) return [3 /*break*/, 8];
                    continue_ = fileTemplateTag.onReadLine(line);
                    if (!!continue_) return [3 /*break*/, 8];
                    return [4 /*yield*/, fileTemplateTag.checkTargetFileContents(setting, inputFilePath, lineNum)];
                case 7:
                    checkPassed = _l.sent();
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    fileTemplateTag = null;
                    _l.label = 8;
                case 8:
                    if (templateTag.label === fileTemplateLabel && ifTagParser.thisIsOutOfFalseBlock) {
                        fileTemplateTag = templateTag;
                    }
                    // Check if there is not "#★Now:".
                    for (_e = 0, temporaryLabels_1 = temporaryLabels; _e < temporaryLabels_1.length; _e++) {
                        temporaryLabel = temporaryLabels_1[_e];
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
                    _l.label = 9;
                case 9: return [3 /*break*/, 5];
                case 10: return [3 /*break*/, 17];
                case 11:
                    e_1_1 = _l.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 17];
                case 12:
                    _l.trys.push([12, , 15, 16]);
                    if (!(reader_1_1 && !reader_1_1.done && (_a = reader_1.return))) return [3 /*break*/, 14];
                    return [4 /*yield*/, _a.call(reader_1)];
                case 13:
                    _l.sent();
                    _l.label = 14;
                case 14: return [3 /*break*/, 16];
                case 15:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 16: return [7 /*endfinally*/];
                case 17:
                    if (settingCount >= 1) {
                        onEndOfSettingScope(setting);
                    }
                    if (!fileTemplateTag) return [3 /*break*/, 19];
                    fileTemplateTag.onReadLine(''); // Cut indent
                    return [4 /*yield*/, fileTemplateTag.checkTargetFileContents(setting, inputFilePath, lineNum + 1)];
                case 18:
                    checkPassed = _l.sent();
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    _l.label = 19;
                case 19:
                    // Check if there is the title above or following.
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    _l.label = 20;
                case 20:
                    _l.trys.push([20, 25, 26, 31]);
                    reader_2 = (e_2 = void 0, __asyncValues(reader));
                    _l.label = 21;
                case 21: return [4 /*yield*/, reader_2.next()];
                case 22:
                    if (!(reader_2_1 = _l.sent(), !reader_2_1.done)) return [3 /*break*/, 24];
                    line1 = reader_2_1.value;
                    line = line1;
                    lineNum += 1;
                    for (_f = 0, keywords_1 = keywords; _f < keywords_1.length; _f++) {
                        keyword = keywords_1[_f];
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
                    _l.label = 23;
                case 23: return [3 /*break*/, 21];
                case 24: return [3 /*break*/, 31];
                case 25:
                    e_2_1 = _l.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 31];
                case 26:
                    _l.trys.push([26, , 29, 30]);
                    if (!(reader_2_1 && !reader_2_1.done && (_b = reader_2.return))) return [3 /*break*/, 28];
                    return [4 /*yield*/, _b.call(reader_2)];
                case 27:
                    _l.sent();
                    _l.label = 28;
                case 28: return [3 /*break*/, 30];
                case 29:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 30: return [7 /*endfinally*/];
                case 31:
                    for (_g = 0, keywords_2 = keywords; _g < keywords_2.length; _g++) {
                        keyword = keywords_2[_g];
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
                        return [3 /*break*/, 44];
                    }
                    loop = true;
                    _l.label = 32;
                case 32:
                    if (!loop) return [3 /*break*/, 42];
                    console.log(translate('Press Enter key to retry checking.'));
                    return [4 /*yield*/, input(translate('The line number to replace the variable value >'))];
                case 33:
                    key = _l.sent();
                    errorCount = 0;
                    if (!(key === 'exit')) return [3 /*break*/, 34];
                    return [2 /*return*/];
                case 34:
                    if (!(key !== '')) return [3 /*break*/, 41];
                    settingNameOrLineNum = key;
                    return [4 /*yield*/, getSettingIndexFromLineNum(inputFilePath, settingNameOrLineNum)];
                case 35:
                    replacingSettingIndex = _l.sent();
                    if (!!replacingSettingIndex) return [3 /*break*/, 36];
                    console.log('');
                    console.log(translate("Error of not found specified setting name") + ": " + settingNameOrLineNum);
                    errorCount += 1;
                    return [3 /*break*/, 41];
                case 36:
                    console.log(translate('SettingIndex') + ": " + replacingSettingIndex);
                    console.log(translate('Enter only: finish to input setting'));
                    _l.label = 37;
                case 37: return [4 /*yield*/, input(translate('key: new_value>'))];
                case 38:
                    keyValue = _l.sent();
                    if (keyValue === '') {
                        return [3 /*break*/, 41];
                    }
                    _h = errorCount;
                    return [4 /*yield*/, replaceSettingsSub(inputFilePath, replacingSettingIndex, parseKeyValueLines(keyValue), true)];
                case 39:
                    errorCount = _h + _l.sent();
                    _l.label = 40;
                case 40: return [3 /*break*/, 37];
                case 41:
                    loop = (errorCount >= 1);
                    return [3 /*break*/, 32];
                case 42:
                    // Rescan
                    console.log('========================================');
                    previousTemplateCount = templateCount;
                    for (_j = 0, _k = Object.keys(setting); _j < _k.length; _j++) {
                        key = _k[_j];
                        setting[key].isReferenced = false;
                    }
                    _l.label = 43;
                case 43: return [3 /*break*/, 3];
                case 44: return [2 /*return*/];
            }
        });
    });
}
// replaceSettings
function replaceSettings(inputFilePath, settingNameOrLineNum, keyValueLines) {
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
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, getSettingIndexFromLineNum(inputFileFullPath, settingNameOrLineNum)];
                case 3:
                    replacingSettingIndex = _b.sent();
                    if (!!replacingSettingIndex) return [3 /*break*/, 4];
                    console.log('');
                    console.log(translate("Error of not found specified setting name") + ": " + settingNameOrLineNum);
                    errorCount += 1;
                    return [3 /*break*/, 6];
                case 4:
                    _a = errorCount;
                    return [4 /*yield*/, replaceSettingsSub(inputFileFullPath, replacingSettingIndex, parseKeyValueLines(keyValueLines), true)];
                case 5:
                    errorCount = _a + _b.sent();
                    _b.label = 6;
                case 6:
                    console.log('');
                    console.log(translate('Warning') + ": 0, " + translate('Error') + ": " + errorCount);
                    return [2 /*return*/];
            }
        });
    });
}
// revertSettings
function revertSettings(inputFilePath, settingNameOrLineNum) {
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
                    return [3 /*break*/, 9];
                case 2: return [4 /*yield*/, getSettingIndexFromLineNum(inputFileFullPath, settingNameOrLineNum)];
                case 3:
                    replacingSettingIndex = _b.sent();
                    if (!!replacingSettingIndex) return [3 /*break*/, 4];
                    console.log('');
                    console.log(translate("Error of not found specified setting name") + ": " + settingNameOrLineNum);
                    errorCount += 1;
                    return [3 /*break*/, 9];
                case 4: return [4 /*yield*/, makeRevertSettings(inputFileFullPath, replacingSettingIndex)];
                case 5:
                    revertSettings_2 = _b.sent();
                    _i = 0, revertSettings_1 = revertSettings_2;
                    _b.label = 6;
                case 6:
                    if (!(_i < revertSettings_1.length)) return [3 /*break*/, 9];
                    revertSetting = revertSettings_1[_i];
                    _a = errorCount;
                    return [4 /*yield*/, replaceSettingsSub(inputFileFullPath, replacingSettingIndex, parseKeyValueLines(revertSetting), false)];
                case 7:
                    errorCount = _a + _b.sent();
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
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
                        targetFolderFullPath = lib.getFullPath(folder, currentFolder);
                        inputFileFullPath = lib.getFullPath(inputFilePath, targetFolderFullPath);
                        if (fs.existsSync(inputFileFullPath)) {
                            fileFullPaths.push(inputFileFullPath);
                        }
                    }
                    if (fileFullPaths.length === 0) {
                        console.log('');
                        console.log("" + translate('Error of not found the specified file.'));
                        console.log("    FileName: " + getTestablePath(inputFilePath));
                        console.log("    Folder: " + getTestablePath(exports.programOptions.folder));
                        return [2 /*return*/, ''];
                    }
                    else if (fileFullPaths.length >= 2) {
                        console.log('');
                        console.log("" + translate('Error of same file name exists.'));
                        console.log("    FileName: " + getTestablePath(inputFilePath));
                        console.log("    Folder: " + getTestablePath(exports.programOptions.folder));
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
        var errorCount, replacingKeyValues, previousEvalatedKeys, oldFilePath, newFilePath, reducedErrorWasOccurred, loop, verboseMode, _loop_1, d, expected, replaced, expected, replaced;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    errorCount = 0;
                    replacingKeyValues = keyValues;
                    previousEvalatedKeys = {};
                    oldFilePath = inputFilePath;
                    newFilePath = inputFilePath + ".new";
                    reducedErrorWasOccurred = false;
                    loop = true;
                    verboseMode = 'verbose' in exports.programOptions;
                    if (verboseMode) {
                        console.log("verbose >> inputFilePath: " + inputFilePath);
                        console.log("verbose >> setting index: " + replacingSettingIndex);
                        console.log("verbose >> keyValues: " + JSON.stringify(keyValues));
                    }
                    _loop_1 = function () {
                        var writer, readStream, reader, lines, isReadingSetting, setting, settingCount, settingIndentLength, settingLineNum, oldSetting, lineNum, isReplacing, isAllReplacable, isCheckingTemplateIfKey, templateIfKeyError, evalatedKeys, ifTagParser, oldIfTagParser, previousEvalatedKeysLength, reader_3, reader_3_1, line1, line, output, settingNames_1, oldSettingNames, undefinedVariableNames, separator, key, oldValue, replacingKeys, replacedValue, commentIndex, comment, original, templateTag, replacingLine, commonCase, before, after, necessaryVariableNames, e_3_1;
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
                                    isCheckingTemplateIfKey = false;
                                    templateIfKeyError = false;
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
                                    if (verboseMode) {
                                        d = pp(lineNum + " " + line);
                                    }
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
                                        if (!templateIfKeyError) {
                                            isCheckingTemplateIfKey = true;
                                        }
                                    }
                                    else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                                        isReadingSetting = false;
                                        if (!reducedErrorWasOccurred) {
                                            settingNames_1 = Object.keys(setting);
                                            oldSettingNames = Object.keys(oldSetting);
                                            undefinedVariableNames = oldSettingNames.filter(function (oldName) { return (!settingNames_1.includes(oldName)); });
                                            if (undefinedVariableNames.length >= 1) {
                                                console.log('');
                                                console.log(translate('ErrorLine') + ": " + lineNum);
                                                console.log("  " + translate('Error') + ": " + translate('The number of variable declarations has decreased'));
                                                console.log("  " + translate('Solution') + ": " + translate('Add variable declarations'));
                                                console.log("  " + translate('Variables') + ": " + undefinedVariableNames);
                                                reducedErrorWasOccurred = true;
                                                errorCount += 1;
                                            }
                                        }
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
                                                                comment = comment.replace(new RegExp(" *" + originalLabel + " *" + escapeRegularExpression(replacedValue).replace(/\$/g, '$$')), '');
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
                                                commonCase = (templateTag.label !== templateIfLabel);
                                                if (commonCase) {
                                                    expected = getExpectedLine(oldSetting, templateTag.template);
                                                    replaced = getReplacedLine(setting, templateTag.template, replacingKeyValues);
                                                }
                                                else { // if (templateTag.label === templateIfLabel)
                                                    templateTag.evaluate(setting);
                                                    expected = getExpectedLine(oldSetting, templateTag.oldTemplate);
                                                    replaced = getReplacedLine(setting, templateTag.newTemplate, replacingKeyValues);
                                                }
                                                if (replacingLine.includes(expected)) {
                                                    before = expected;
                                                    after = replaced;
                                                    if (templateTag.lineNumOffset <= -1) {
                                                        writer.replaceAboveLine(templateTag.lineNumOffset, replacingLine.replace(before, after.replace(/\$/g, '$$')) + "\n");
                                                    }
                                                    else {
                                                        writer.write(line.replace(before, after.replace(/\$/g, '$$')) + "\n");
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
                                            else {
                                                if (isCheckingTemplateIfKey && templateTag.label === templateIfLabel) {
                                                    isCheckingTemplateIfKey = false;
                                                    necessaryVariableNames = getNotSetTemplateIfTagVariableNames(Object.keys(setting));
                                                    if (necessaryVariableNames !== '') {
                                                        console.log('');
                                                        console.log(translate('ErrorLine') + ": " + lineNum);
                                                        console.log("  " + translate('Error') + ": " + translate('template-if tag related settings are not defined'));
                                                        console.log("  " + translate('Solution') + ": " + translate('Set the variable') + " " + necessaryVariableNames);
                                                        console.log("  " + translate('Setting') + ": " + getTestablePath(inputFilePath) + ":" + settingLineNum);
                                                        errorCount += 1;
                                                        templateIfKeyError = true;
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
                                                if (errorCount === 0) {
                                                    fs.copyFileSync(newFilePath, inputFilePath);
                                                }
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
        // template-at tag
        this.oldTemplate = '';
        this.newTemplate = '';
        // for file-template tag
        this.templateLines = [];
        this.indentAtTag = '';
        this.minIndentLength = 0;
    }
    // parseLine
    TemplateTag.prototype.parseLine = function (line) {
        var disabled = (line.indexOf(disableLabel) !== notFound);
        this.label = templateLabel;
        this.indexInLine = line.indexOf(templateLabel);
        if (this.indexInLine === notFound) {
            this.label = fileTemplateLabel;
            this.indexInLine = line.indexOf(fileTemplateLabel);
        }
        if (this.indexInLine === notFound) {
            this.label = templateIfLabel;
            this.indexInLine = line.indexOf(templateIfLabel);
        }
        if (this.indexInLine !== notFound && !disabled) {
            this.isFound = true;
            var leftOfTemplate = line.substr(0, this.indexInLine).trim();
            if (this.label === fileTemplateLabel) {
                this.onFileTemplateTagReading(line);
            }
            this.template = line.substr(this.indexInLine + this.label.length).trim();
            if (this.label == templateIfLabel) {
                this.template = getValue(this.template);
            }
            if (leftOfTemplate === '') {
                this.lineNumOffset = -1;
            }
            else {
                this.lineNumOffset = 0;
            }
            return;
        }
        this.label = templateAtStartLabel;
        this.startIndexInLine = line.indexOf(templateAtStartLabel);
        if (this.startIndexInLine !== notFound && !disabled) {
            this.isFound = true;
            this.endIndexInLine = line.indexOf(templateAtEndLabel, this.startIndexInLine);
            if (this.endIndexInLine !== notFound) {
                this.template = line.substr(this.endIndexInLine + templateAtEndLabel.length).trim();
                this.lineNumOffset = parseInt(line.substring(this.startIndexInLine + templateAtStartLabel.length, this.endIndexInLine));
                return;
            }
        }
        this.isFound = false;
        this.label = '';
        this.template = '';
        this.lineNumOffset = 0;
    };
    TemplateTag.prototype.onFileTemplateTagReading = function (line) {
        this.indentAtTag = indentRegularExpression.exec(line)[0];
        this.minIndentLength = maxNumber;
    };
    TemplateTag.prototype.onReadLine = function (line) {
        var _this = this;
        var currentIndent = indentRegularExpression.exec(line)[0];
        var readingNext = true;
        if (currentIndent.length > this.indentAtTag.length && line.startsWith(this.indentAtTag)) {
            var skip = (this.templateLines.length === 0 && line.trim() === fileTemplateAnyLinesLabel);
            if (!skip) {
                this.templateLines.push(line);
            }
            this.minIndentLength = Math.min(this.minIndentLength, currentIndent.length);
        }
        else {
            this.templateLines = this.templateLines.map(function (line) { return (line.substr(_this.minIndentLength)); });
            readingNext = false;
        }
        return readingNext;
    };
    // includesKey
    TemplateTag.prototype.includesKey = function (keys) {
        var commonCase = (this.label !== templateIfLabel);
        if (commonCase) {
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (this.template.includes(key)) {
                    return true;
                }
            }
            return false;
        }
        else { // if (this.label === templateIfLabel)
            return keys.includes(templateIfYesKey) && keys.includes(templateIfNoKey);
        }
    };
    // evaluate
    TemplateTag.prototype.evaluate = function (setting) {
        if (this.label !== templateIfLabel) {
            return new Error();
        }
        var expression = this.template;
        var evaluatedContidion = evaluateIfCondition(expression, setting);
        if (typeof evaluatedContidion === 'boolean') {
            if (evaluatedContidion) {
                this.oldTemplate = templateIfNoKey;
                this.newTemplate = templateIfYesKey;
            }
            else {
                this.oldTemplate = templateIfYesKey;
                this.newTemplate = templateIfNoKey;
            }
            return evaluatedContidion;
        }
        else if (instanceOf.EvaluatedCondition(evaluatedContidion)) {
            return new Error();
        }
        else {
            return evaluatedContidion;
        }
    };
    // checkTargetFileContents
    TemplateTag.prototype.checkTargetFileContents = function (setting, inputFilePath, templateEndLineNum) {
        var e_5, _a;
        return __awaiter(this, void 0, void 0, function () {
            var parentPath, targetFilePath, templateLineNum, targetFileReader, expectedFirstLine, templateLineIndex, targetLineNum, errorTemplateLineIndex, errorTargetLineNum, errorContents, errorExpected, errorTemplate, indent, Result, result, skipTo, skipToTemplate, skipFrom, skipStartLineNum, loop, exception, targetFileReader_1, targetFileReader_1_1, line1, targetLine, indentLength, expected, e_5_1, templateLineNum;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parentPath = path.dirname(inputFilePath);
                        targetFilePath = lib.getFullPath(getExpectedLine(setting, this.template), parentPath);
                        if (!fs.existsSync(targetFilePath)) {
                            templateLineNum = templateEndLineNum - this.templateLines.length;
                            console.log("");
                            console.log("Error of not found the target file:");
                            console.log("  " + translate('NotFound') + ": " + getTestablePath(targetFilePath));
                            console.log("  Template: " + getTestablePath(inputFilePath) + ":" + templateLineNum);
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
                                if (indentLength !== notFound && targetLine.trim() === expectedFirstLine.trim()) {
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
                                else if (targetLine.trim() === '' || targetLine.startsWith(indent)) {
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
// WordPositions
var WordPositions = /** @class */ (function () {
    function WordPositions() {
        this.wordPositions = [];
    }
    Object.defineProperty(WordPositions.prototype, "length", {
        get: function () { return this.wordPositions.length; },
        enumerable: false,
        configurable: true
    });
    WordPositions.prototype.setPhrase = function (phrase) {
        var words = phrase.split(' ');
        var wordIndex = 0;
        var position = 0;
        for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
            var word = words_1[_i];
            this.wordPositions.push(position);
            wordIndex += 1;
            position += word.length + 1;
        }
    };
    WordPositions.prototype.getWordIndex = function (phrasePosition) {
        var wordIndex = -1;
        for (var _i = 0, _a = this.wordPositions; _i < _a.length; _i++) {
            var wordPosition = _a[_i];
            if (phrasePosition < wordPosition) {
                break; // wordIndex = .
            }
            wordIndex += 1;
        }
        if (wordIndex >= this.wordPositions.length) {
            wordIndex = this.wordPositions.length - 1;
        }
        return wordIndex;
    };
    return WordPositions;
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
                    targetFolders.push(currentFolder);
                    for (_i = 0, targetFolders_2 = targetFolders; _i < targetFolders_2.length; _i++) {
                        folder = targetFolders_2[_i];
                        targetFolderFullPath = lib.getFullPath(folder, currentFolder);
                        inputFileFullPath = lib.getFullPath(checkingFilePath, targetFolderFullPath);
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
                                    targetFolderFullPath = lib.getFullPath(folder, currentFolder);
                                    if (!fs.existsSync(targetFolderFullPath)) {
                                        throw new Error("Not found target folder at \"" + targetFolderFullPath + "\".");
                                    }
                                    process.chdir(targetFolderFullPath);
                                    return [4 /*yield*/, globby(['**/*'])];
                                case 1:
                                    scanedPaths = _d.sent();
                                    scanedPaths.forEach(function (scanedPath) {
                                        inputFileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath));
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
    return __awaiter(this, void 0, void 0, function () {
        var startIndex, keyword, cSearch, cPrintRef, cRunVerb, lastWord, hasVerb, command, keywordWithoudVerb, ref, previousPrint, prompt, prompt, keyword_1, command, verbNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startIndex = (exports.programArguments[0] === 's' || exports.programArguments[0] === 'search') ? 1 : 0;
                    keyword = exports.programArguments.slice(startIndex).join(' ');
                    cSearch = 1;
                    cPrintRef = 2;
                    cRunVerb = 3;
                    if (!(keyword !== '')) return [3 /*break*/, 7];
                    lastWord = exports.programArguments.length === 0 ? '' : exports.programArguments[exports.programArguments.length - 1];
                    hasVerb = numberRegularExpression.test(lastWord);
                    command = cSearch;
                    if (hasRefTag(keyword)) {
                        if (hasVerb) {
                            command = cRunVerb;
                        }
                        else {
                            command = cPrintRef;
                        }
                    }
                    if (!(command === cSearch)) return [3 /*break*/, 2];
                    return [4 /*yield*/, searchSub(keyword)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 2:
                    if (!(command === cPrintRef)) return [3 /*break*/, 4];
                    return [4 /*yield*/, printRef(keyword)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    if (!(command === cRunVerb)) return [3 /*break*/, 6];
                    keywordWithoudVerb = exports.programArguments.slice(startIndex, exports.programArguments.length - 1).join(' ');
                    return [4 /*yield*/, printRef(keywordWithoudVerb, { print: false })];
                case 5:
                    ref = _a.sent();
                    runVerb(ref.verbs, ref.address, lastWord);
                    _a.label = 6;
                case 6: return [3 /*break*/, 17];
                case 7:
                    inputSkip(startIndex);
                    previousPrint = getEmptyOfPrintRefResult();
                    _a.label = 8;
                case 8:
                    prompt = 'keyword:';
                    if (previousPrint.hasVerbMenu) {
                        prompt = 'keyword or number:';
                    }
                    return [4 /*yield*/, input(chalk.yellow(prompt) + ' ')];
                case 9:
                    keyword_1 = _a.sent();
                    if (!(keyword_1 === 'exit()')) return [3 /*break*/, 10];
                    return [3 /*break*/, 17];
                case 10:
                    if (!(keyword_1 === '')) return [3 /*break*/, 11];
                    previousPrint.hasVerbMenu = false;
                    return [3 /*break*/, 16];
                case 11:
                    command = cSearch;
                    if (previousPrint.hasVerbMenu && numberRegularExpression.test(keyword_1)) {
                        command = cRunVerb;
                    }
                    else if (hasRefTag(keyword_1)) {
                        command = cPrintRef;
                    }
                    if (!(command === cSearch)) return [3 /*break*/, 13];
                    return [4 /*yield*/, searchSub(keyword_1)];
                case 12:
                    _a.sent();
                    previousPrint.hasVerbMenu = false;
                    return [3 /*break*/, 16];
                case 13:
                    if (!(command === cPrintRef)) return [3 /*break*/, 15];
                    return [4 /*yield*/, printRef(keyword_1)];
                case 14:
                    previousPrint = _a.sent();
                    return [3 /*break*/, 16];
                case 15:
                    if (command === cRunVerb) {
                        verbNumber = keyword_1;
                        runVerb(previousPrint.verbs, previousPrint.address, verbNumber);
                    }
                    _a.label = 16;
                case 16: return [3 /*break*/, 8];
                case 17: return [2 /*return*/];
            }
        });
    });
}
// searchSub
function searchSub(keyword) {
    var e_6, _a;
    return __awaiter(this, void 0, void 0, function () {
        var _i, ignoredKeywords_1, ignoredKeyword, currentFolder, fileFullPaths, targetFolders, _loop_3, _b, targetFolders_4, folder, glossaryTags, foundLines, _loop_4, lineNum, csv, withParameter, withParameter, positionOfCSV, positionOfCSV, glossaryTag, glossaryWords, _c, fileFullPaths_1, inputFileFullPath, keyphraseWordCount, _d, foundLines_1, foundLineInformation;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    for (_i = 0, ignoredKeywords_1 = ignoredKeywords; _i < ignoredKeywords_1.length; _i++) {
                        ignoredKeyword = ignoredKeywords_1[_i];
                        keyword = keyword.replace(ignoredKeyword, '');
                    }
                    keyword = keyword.trim();
                    currentFolder = process.cwd();
                    fileFullPaths = [];
                    return [4 /*yield*/, parseCSVColumns(exports.programOptions.folder)];
                case 1:
                    targetFolders = _e.sent();
                    _loop_3 = function (folder) {
                        var targetFolderFullPath, scanedPaths;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    targetFolderFullPath = lib.getFullPath(folder, currentFolder);
                                    process.chdir(targetFolderFullPath);
                                    return [4 /*yield*/, globby(['**/*'])];
                                case 1:
                                    scanedPaths = _f.sent();
                                    scanedPaths.forEach(function (scanedPath) {
                                        fileFullPaths.push(lib.getFullPath(scanedPath, targetFolderFullPath));
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _b = 0, targetFolders_4 = targetFolders;
                    _e.label = 2;
                case 2:
                    if (!(_b < targetFolders_4.length)) return [3 /*break*/, 5];
                    folder = targetFolders_4[_b];
                    return [5 /*yield**/, _loop_3(folder)];
                case 3:
                    _e.sent();
                    _e.label = 4;
                case 4:
                    _b++;
                    return [3 /*break*/, 2];
                case 5:
                    process.chdir(currentFolder);
                    glossaryTags = [];
                    foundLines = [];
                    _loop_4 = function (inputFileFullPath) {
                        var reader, reader_5, reader_5_1, line1, line, columns, found, columnPositions, _g, _h, match, currentIndent, characterAtIndent, isGlossaryIndentLevel, isComment, colonPosition, wordInGlossary, found, _j, _k, match, _l, _m, match, e_6_1;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    reader = readline.createInterface({
                                        input: fs.createReadStream(inputFileFullPath),
                                        crlfDelay: Infinity
                                    });
                                    lineNum = 0;
                                    _o.label = 1;
                                case 1:
                                    _o.trys.push([1, 8, 9, 14]);
                                    reader_5 = (e_6 = void 0, __asyncValues(reader));
                                    _o.label = 2;
                                case 2: return [4 /*yield*/, reader_5.next()];
                                case 3:
                                    if (!(reader_5_1 = _o.sent(), !reader_5_1.done)) return [3 /*break*/, 7];
                                    line1 = reader_5_1.value;
                                    line = line1;
                                    lineNum += 1;
                                    if (!(line.includes(keywordLabel) && !line.includes(disableLabel))) return [3 /*break*/, 5];
                                    csv = getValue(line, line.indexOf(keywordLabel) + keywordLabel.length);
                                    if (csv !== '') {
                                        withParameter = true;
                                    }
                                    else {
                                        withParameter = false;
                                        csv = parseKeyName(line);
                                    }
                                    return [4 /*yield*/, parseCSVColumns(csv)
                                            .catch(function (e) {
                                            console.log("Warning: " + e.message + " in " + inputFileFullPath + ":" + lineNum + ": " + line);
                                            return [];
                                        })];
                                case 4:
                                    columns = _o.sent();
                                    found = getKeywordMatchingScore(columns, keyword);
                                    if (found.matchedKeywordCount >= 1) {
                                        if (withParameter) {
                                            positionOfCSV = line.indexOf(csv, line.indexOf(keywordLabel) + keywordLabel.length); // line.length - csv.length;
                                        }
                                        else {
                                            positionOfCSV = line.indexOf(csv);
                                        }
                                        columnPositions = parseCSVColumnPositions(csv, columns);
                                        found.score += keywordMatchScore;
                                        found.path = getTestablePath(inputFileFullPath);
                                        found.lineNum = lineNum;
                                        found.line = line;
                                        for (_g = 0, _h = found.matches; _g < _h.length; _g++) {
                                            match = _h[_g];
                                            match.position += positionOfCSV + columnPositions[match.testTargetIndex];
                                        }
                                        foundLines.push(found);
                                    }
                                    _o.label = 5;
                                case 5:
                                    // glossary tag
                                    glossaryTag = undefined;
                                    if (line.trim() !== '') {
                                        if (glossaryTags.length >= 1) {
                                            glossaryTag = glossaryTags[glossaryTags.length - 1];
                                        }
                                        currentIndent = indentRegularExpression.exec(line)[0];
                                        if (glossaryTag) {
                                            if (currentIndent.length <= glossaryTag.indentAtTag.length) {
                                                glossaryTags.pop();
                                                if (glossaryTags.length >= 1) {
                                                    glossaryTag = glossaryTags[glossaryTags.length - 1];
                                                }
                                                else {
                                                    glossaryTag = undefined;
                                                }
                                            }
                                            else {
                                                if (glossaryTag.indentAtFirstContents === '') {
                                                    glossaryTag.indentAtFirstContents = currentIndent;
                                                    glossaryTag.indentPosition = glossaryTag.indentAtFirstContents.length;
                                                }
                                            }
                                        }
                                        if (line.includes(glossaryLabel)) {
                                            glossaryWords = getValue(line, line.indexOf(glossaryLabel) + glossaryLabel.length);
                                            if (glossaryWords !== '') {
                                                glossaryWords += ':'; // ':' is not included in the word in glossary
                                            }
                                            glossaryTags.push({
                                                indentPosition: -1,
                                                glossaryWords: glossaryWords,
                                                indentAtTag: indentRegularExpression.exec(line)[0],
                                                indentAtFirstContents: '',
                                            });
                                        }
                                        if (glossaryTag) {
                                            characterAtIndent = line[glossaryTag.indentPosition];
                                            isGlossaryIndentLevel = (characterAtIndent !== ' ' &&
                                                characterAtIndent !== '\t' &&
                                                characterAtIndent !== undefined);
                                            isComment = (characterAtIndent === '#');
                                            if (!isGlossaryIndentLevel || isComment) {
                                                // Skip this line
                                            }
                                            else {
                                                colonPosition = line.indexOf(':', currentIndent.length);
                                                wordInGlossary = glossaryTag.glossaryWords +
                                                    line.substr(currentIndent.length, colonPosition - currentIndent.length);
                                                found = getKeywordMatchingScore([wordInGlossary], keyword);
                                                if (found.matchedKeywordCount >= 1 && colonPosition !== notFound) {
                                                    found.score += glossaryMatchScore;
                                                    found.path = getTestablePath(inputFileFullPath);
                                                    found.lineNum = lineNum;
                                                    if (glossaryTag.glossaryWords === '') {
                                                        found.line = line;
                                                        for (_j = 0, _k = found.matches; _j < _k.length; _j++) {
                                                            match = _k[_j];
                                                            match.position += glossaryTag.indentPosition;
                                                        }
                                                    }
                                                    else {
                                                        found.line = glossaryTag.glossaryWords + line;
                                                        for (_l = 0, _m = found.matches; _l < _m.length; _l++) {
                                                            match = _m[_l];
                                                            if (match.position >= glossaryTag.glossaryWords.length) {
                                                                match.position += glossaryTag.indentPosition;
                                                            }
                                                        }
                                                    }
                                                    foundLines.push(found);
                                                }
                                            }
                                        }
                                    }
                                    _o.label = 6;
                                case 6: return [3 /*break*/, 2];
                                case 7: return [3 /*break*/, 14];
                                case 8:
                                    e_6_1 = _o.sent();
                                    e_6 = { error: e_6_1 };
                                    return [3 /*break*/, 14];
                                case 9:
                                    _o.trys.push([9, , 12, 13]);
                                    if (!(reader_5_1 && !reader_5_1.done && (_a = reader_5.return))) return [3 /*break*/, 11];
                                    return [4 /*yield*/, _a.call(reader_5)];
                                case 10:
                                    _o.sent();
                                    _o.label = 11;
                                case 11: return [3 /*break*/, 13];
                                case 12:
                                    if (e_6) throw e_6.error;
                                    return [7 /*endfinally*/];
                                case 13: return [7 /*endfinally*/];
                                case 14: return [2 /*return*/];
                            }
                        });
                    };
                    _c = 0, fileFullPaths_1 = fileFullPaths;
                    _e.label = 6;
                case 6:
                    if (!(_c < fileFullPaths_1.length)) return [3 /*break*/, 9];
                    inputFileFullPath = fileFullPaths_1[_c];
                    return [5 /*yield**/, _loop_4(inputFileFullPath)];
                case 7:
                    _e.sent();
                    _e.label = 8;
                case 8:
                    _c++;
                    return [3 /*break*/, 6];
                case 9:
                    keyphraseWordCount = keyword.split(' ').length;
                    foundLines = foundLines.filter(function (found) { return (found.matchedKeywordCount >= keyphraseWordCount); });
                    foundLines.sort(compareScore);
                    for (_d = 0, foundLines_1 = foundLines; _d < foundLines_1.length; _d++) {
                        foundLineInformation = foundLines_1[_d];
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
    function subMain() {
        var bestFound = testingStrings.reduce(function (bestFound, aTestingString, stringIndex) {
            var keywords = keyphrase.split(' ');
            var found = new FoundLine();
            var result = getSubMatchedScore(aTestingString, keyphrase, lowerKeyphrase, stringIndex, found);
            if (result.score !== 0) {
                found.score = result.score * keywords.length * phraseMatchScoreWeight +
                    keyphrase.length - aTestingString.length;
                found.matchedKeywordCount = keywords.length;
                found.matchedTargetKeywordCount = keywords.length;
                found.testedWordCount = aTestingString.split(' ').length;
            }
            else {
                var previousPosition = -1;
                var wordPositions = new WordPositions();
                wordPositions.setPhrase(aTestingString);
                var matchedCountsByWord = new Array(wordPositions.length).fill(0);
                for (var _i = 0, keywords_3 = keywords; _i < keywords_3.length; _i++) {
                    var keyword = keywords_3[_i];
                    if (keyword === '') {
                        continue;
                    }
                    var result_1 = getSubMatchedScore(aTestingString, keyword, keyword.toLowerCase(), stringIndex, found);
                    if (result_1.score !== 0) {
                        if (result_1.position > previousPosition) {
                            found.score += result_1.score * orderMatchScoreWeight;
                        }
                        else {
                            found.score += result_1.score;
                        }
                        found.matchedKeywordCount += 1;
                    }
                    if (result_1.position !== notFound) {
                        matchedCountsByWord[wordPositions.getWordIndex(result_1.position)] += 1;
                        previousPosition = result_1.position;
                    }
                }
                if (found.score !== 0) {
                    found.score += keyphrase.length - aTestingString.length;
                    found.testedWordCount = aTestingString.split(' ').length;
                    found.matchedTargetKeywordCount = matchedCountsByWord.filter(function (count) { return (count >= 1); }).length;
                }
            }
            var matches = bestFound.matches.concat(found.matches);
            if (compareScore(bestFound, found) < 0) {
                bestFound = found;
            }
            bestFound.matches = matches;
            return bestFound;
        }, new FoundLine());
        return bestFound;
    }
    function getSubMatchedScore(testingString, keyword, lowerKeyword, stringIndex, found) {
        var score = 0;
        var position = notFound;
        if ((position = testingString.indexOf(keyword)) !== notFound) {
            if (testingString.length === keyword.length) {
                score = fullMatchScore;
            }
            else {
                if ((position === 0 || testingString[position - 1] === ' ') &&
                    (position + keyword.length === testingString.length || testingString[position + keyword.length] === ' ')) {
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
                if ((position === 0 || testingString[position - 1] === ' ') &&
                    (position + keyword.length === testingString.length || testingString[position + keyword.length] === ' ')) {
                    score = caseIgnoredWordMatchScore;
                }
                else {
                    score = caseIgnoredPartMatchScore;
                }
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
    var found = subMain();
    return found;
}
// compareScore
function compareScore(a, b) {
    var different = 0;
    // matchedTargetKeywordCount
    if (different === 0) {
        different = a.matchedTargetKeywordCount - b.matchedTargetKeywordCount;
    }
    // testedWordCount
    if (different === 0) {
        different = b.testedWordCount - a.testedWordCount;
    }
    // score
    if (different === 0) {
        var different = a.score - b.score;
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
}
// printRefOptionDefault
var printRefOptionDefault = {
    print: true,
};
// getEmptyOfPrintRefResult
function getEmptyOfPrintRefResult() {
    return {
        hasVerbMenu: false,
        verbs: [],
        address: '',
    };
}
// printRef
function printRef(refTagAndAddress, option) {
    if (option === void 0) { option = printRefOptionDefault; }
    return __awaiter(this, void 0, void 0, function () {
        var addressBefore, variableRe, variables, variable, address, _loop_5, _i, _a, variable, linkableAddress, getter, recommended, lowerCaseDriveRegExp, upperCaseDriveRegExp, sortedEnvronmentVariables, _b, _c, _d, envName, envValue, variableName, value, _e, sortedEnvronmentVariables_1, variable, verbs, verbMenu;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    addressBefore = refTagAndAddress.trim().substr(refLabel.length).trim();
                    variableRe = new RegExp(variablePattern, 'g');
                    variables = {};
                    variableRe.lastIndex = 0;
                    for (;;) {
                        variable = variableRe.exec(addressBefore);
                        if (variable === null) {
                            break;
                        }
                        variables[variable[0]] = undefined;
                    }
                    address = addressBefore;
                    if (!address.startsWith("\\\\")) {
                        address = address.replace(/(\\+)([^\$\\ ]|$)/g, function (match, backSlashes, nextCharacter, offset) {
                            return backSlashes.replace(/\\/g, '/') + nextCharacter; // replace \\ to /
                        });
                    }
                    address = cutQuotation(address);
                    if (variables) {
                        _loop_5 = function (variable) {
                            var variableName = variable.substr('${'.length, variable.length - '${}'.length);
                            var value = process.env["" + typrmEnvPrefix + variableName];
                            if (value) {
                                var variableRegExp = new RegExp('\\\\?' + escapeRegularExpression(variable), 'g');
                                address = address.replace(variableRegExp, function (match, offset) {
                                    var startsBackSlash = (match.substr(0, 1) === '\\');
                                    if (startsBackSlash) {
                                        var dollarOffset = offset + 1;
                                    }
                                    else {
                                        var dollarOffset = offset;
                                    }
                                    var replacing = !isBackSlashParameter(address, dollarOffset);
                                    if (replacing) {
                                        if (startsBackSlash) {
                                            return '\\' + value.replace(/\$/g, '$$').replace('\\', '/');
                                        }
                                        else {
                                            return value.replace(/\$/g, '$$').replace('\\', '/');
                                        }
                                    }
                                    else {
                                        return variable.replace(/\$/g, '$$');
                                        // If startsBackSlash === true, cut \ character.
                                    }
                                });
                            }
                        };
                        for (_i = 0, _a = Object.keys(variables); _i < _a.length; _i++) {
                            variable = _a[_i];
                            _loop_5(variable);
                        }
                    }
                    if (address.startsWith('~')) {
                        address = lib.getHomePath() + address.substr(1);
                    }
                    linkableAddress = address;
                    getter = getRelatedLineNumGetter(address);
                    if (!(getter.type === 'text')) return [3 /*break*/, 2];
                    return [4 /*yield*/, searchAsText(getter, address)];
                case 1:
                    linkableAddress = _f.sent();
                    _f.label = 2;
                case 2:
                    recommended = address;
                    recommended = recommended.replace(/\$/g, '\\$');
                    lowerCaseDriveRegExp = /^[a-z]:/;
                    upperCaseDriveRegExp = /^[A-Z]:/;
                    sortedEnvronmentVariables = [];
                    for (_b = 0, _c = Object.entries(process.env); _b < _c.length; _b++) {
                        _d = _c[_b], envName = _d[0], envValue = _d[1];
                        if (envName.startsWith(typrmEnvPrefix) && envValue) {
                            variableName = envName.substr(typrmEnvPrefix.length);
                            value = envValue.replace(/\\/g, '/');
                            sortedEnvronmentVariables.push({ key: variableName, value: value });
                            if (lowerCaseDriveRegExp.test(value)) {
                                sortedEnvronmentVariables.push({ key: variableName, value: value.substr(0, 1).toUpperCase() + value.substr(1) });
                            }
                            else if (upperCaseDriveRegExp.test(value)) {
                                sortedEnvronmentVariables.push({ key: variableName, value: value.substr(0, 1).toLowerCase() + value.substr(1) });
                            }
                        }
                    }
                    sortedEnvronmentVariables.sort(function (a, b) {
                        return b.value.length - a.value.length; // descending order
                    });
                    for (_e = 0, sortedEnvronmentVariables_1 = sortedEnvronmentVariables; _e < sortedEnvronmentVariables_1.length; _e++) {
                        variable = sortedEnvronmentVariables_1[_e];
                        recommended = recommended.replace(new RegExp(escapeRegularExpression(variable.value.replace('\\', '\\\\')), 'g'), '${' + variable.key + '}'); // Change the address to an address with variables
                    }
                    if (recommended.replace(/\\/g, '/').startsWith(lib.getHomePath().replace(/\\/g, '/'))) {
                        recommended = '~' + recommended.substr(lib.getHomePath().length);
                    }
                    // print the address
                    if (option.print) {
                        if (recommended !== addressBefore) {
                            console.log('Recommend: #ref: ' + recommended);
                        }
                        console.log(linkableAddress);
                    }
                    verbs = getRelatedVerbs(address);
                    verbMenu = verbs.map(function (verb) { return (verb.label); }).join(', ');
                    if (verbMenu !== '' && option.print) {
                        console.log('    ' + verbMenu);
                    }
                    return [2 /*return*/, {
                            hasVerbMenu: (verbMenu !== ''),
                            verbs: verbs,
                            address: address,
                        }];
            }
        });
    });
}
// getRelatedLineNumGetter
function getRelatedLineNumGetter(address) {
    if (process.env.TYPRM_LINE_NUM_GETTER) {
        var searchConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof searchConfig === 'object' && searchConfig) {
            var searchs = searchConfig;
            for (var _i = 0, searchs_1 = searchs; _i < searchs_1.length; _i++) {
                var search_1 = searchs_1[_i];
                if (new RegExp(search_1.regularExpression).test(address)) {
                    return search_1;
                }
            }
        }
    }
    var verboseMode = 'verbose' in exports.programOptions;
    if (verboseMode) {
        console.log("Verbose: Not matched address \"" + address + "\". Check TYPRM_LINE_NUM_GETTER environment variable.");
    }
    return {
        regularExpression: '.*',
        type: '',
        filePathRegularExpressionIndex: 0,
        keywordRegularExpressionIndex: 0,
        address: address,
    };
}
// getRelatedVerbs
function getRelatedVerbs(address) {
    var relatedVerbs = [];
    if (process.env.TYPRM_VERB) {
        var verbConfig = yaml.load(process.env.TYPRM_VERB);
        if (typeof verbConfig === 'object' && verbConfig) {
            var verbs = verbConfig;
            for (var _i = 0, verbs_1 = verbs; _i < verbs_1.length; _i++) {
                var verb = verbs_1[_i];
                if (new RegExp(verb.regularExpression).test(address)) {
                    relatedVerbs.push(verb);
                }
            }
        }
    }
    if (runningOS === 'Windows') {
        var command = "explorer /select, \"" + verbVar.windowsFile + "\"";
    }
    else {
        var command = "open -R \"" + verbVar.file + "\"";
        // Open the folder by Finder and select the file
    }
    relatedVerbs.push({
        regularExpression: '.*',
        label: '0.Folder',
        number: '0',
        echo: '',
        command: command,
    });
    return relatedVerbs;
}
// runVerb
function runVerb(verbs, address, verbNum) {
    var command = '';
    var matchesVerbs = verbs.filter(function (verb) { return (verb.number.toString() === verbNum); });
    if (matchesVerbs.length >= 1) {
        var verb = matchesVerbs[0];
        var fragmentIndex = address.indexOf('#');
        if (fragmentIndex === notFound) {
            command = verb.command
                .replace(verbVar.ref, address)
                .replace(verbVar.windowsRef, address.replace(/\//g, '\\'))
                .replace(verbVar.file, address)
                .replace(verbVar.windowsFile, address.replace(/\//g, '\\'))
                .replace(verbVar.fragment, '');
        }
        else {
            command = verb.command
                .replace(verbVar.ref, address)
                .replace(verbVar.windowsRef, address.substr(0, fragmentIndex).replace(/\//g, '\\') + address.substr(fragmentIndex))
                .replace(verbVar.file, address.substr(0, fragmentIndex))
                .replace(verbVar.windowsFile, address.substr(0, fragmentIndex).replace(/\//g, '\\'))
                .replace(verbVar.fragment, address.substr(fragmentIndex + 1));
        }
    }
    if (command !== '') {
        var stdout_ = '';
        try {
            if ('verbose' in exports.programOptions) {
                console.log("Verbose: command: " + command);
            }
            stdout_ = child_process.execSync(command).toString();
            if (runningOS === 'Windows') {
                stdout_ = stdout_.substr(0, stdout_.length - 2); // Cut last '\r\n'
            }
            else {
                stdout_ = stdout_.substr(0, stdout_.length - 1); // Cut last '\n'
            }
        }
        catch (e) {
            stdout_ = e.toString();
        }
        console.log(stdout_);
    }
    else {
        console.log(translate(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Error that verb number ", " is not defined"], ["Error that verb number ", " is not defined"])), verbNum));
    }
}
// printConfig
function printConfig() {
    for (var _i = 0, _a = Object.entries(process.env); _i < _a.length; _i++) {
        var _b = _a[_i], envName = _b[0], envValue = _b[1];
        if (envName.startsWith('TYPRM_') && envName !== 'TYPRM_LINE_NUM_GETTER' && envName !== 'TYPRM_VERB') {
            console.log("Verbose: " + envName + " = " + envValue);
        }
    }
    if (process.env.TYPRM_LINE_NUM_GETTER) {
        var getterConfig = yaml.load(process.env.TYPRM_LINE_NUM_GETTER);
        if (typeof getterConfig === 'object' && getterConfig) {
            var getters = getterConfig;
            var index = 0;
            for (var _c = 0, getters_1 = getters; _c < getters_1.length; _c++) {
                var getter = getters_1[_c];
                console.log("Verbose: TYPRM_LINE_NUM_GETTER[" + index + "]:");
                console.log("Verbose:     regularExpression: " + getter.regularExpression);
                console.log("Verbose:     type: " + getter.type);
                console.log("Verbose:     filePathRegularExpressionIndex: " + getter.filePathRegularExpressionIndex);
                console.log("Verbose:     keywordRegularExpressionIndex: " + getter.keywordRegularExpressionIndex);
                console.log("Verbose:     address: " + getter.address);
                index += 1;
            }
        }
    }
    if (process.env.TYPRM_VERB) {
        var verbConfig = yaml.load(process.env.TYPRM_VERB);
        if (typeof verbConfig === 'object' && verbConfig) {
            var verbs = verbConfig;
            var index = 0;
            for (var _d = 0, verbs_2 = verbs; _d < verbs_2.length; _d++) {
                var verb = verbs_2[_d];
                console.log("Verbose: TYPRM_VERB[" + index + "]:");
                console.log("Verbose:     regularExpression: " + verb.regularExpression);
                console.log("Verbose:     label: " + verb.label);
                console.log("Verbose:     number: " + verb.number);
                console.log("Verbose:     command: " + verb.command);
                index += 1;
            }
        }
    }
}
// varidateUpdateCommandArguments
function varidateReplaceCommandArguments() {
    if (exports.programArguments.length < 3) {
        throw new Error('Error: Too few argurments.\n' +
            'Parameters1: typrm replace  __FilePath__  "__KeyColonValue__"\n' +
            'Parameters2: typrm replace  __FilePath__  __NearbyLineNumOrSettingName__  "__KeyColonValue__"');
    }
}
// varidateRevertCommandArguments
function varidateRevertCommandArguments() {
    if (exports.programArguments.length < 2) {
        throw new Error('Error: Too few argurments.\n' +
            'Parameters1: typrm revert  __FilePath__\n' +
            'Parameters2: typrm revert  __FilePath__  __NearbyLineNumOrSettingName__');
    }
}
// onEndOfSetting
function onEndOfSettingScope(setting) {
    for (var _i = 0, _a = Object.keys(setting); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!setting[key].isReferenced) {
            console.log(translate(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Not referenced: ", " in line ", ""], ["Not referenced: ", " in line ", ""])), key, setting[key].lineNum));
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
function getSettingIndexFromLineNum(inputFilePath, settingNameOrLineNum) {
    var e_7, _a;
    return __awaiter(this, void 0, void 0, function () {
        var reader, settingCount, lineNum, breaking, isFound, exception, targetLineNum, targetSettingName, isOneSetting, reader_6, reader_6_1, line1, line, currentSettingName, e_7_1, settingIndex;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    settingCount = 0;
                    lineNum = 0;
                    breaking = false;
                    isFound = false;
                    isOneSetting = (settingNameOrLineNum === '');
                    if (numberRegularExpression.test(settingNameOrLineNum)) {
                        targetLineNum = parseInt(settingNameOrLineNum);
                    }
                    else {
                        targetSettingName = (targetLineNum) ? undefined : settingNameOrLineNum;
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, 7, 12]);
                    reader_6 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_6.next()];
                case 3:
                    if (!(reader_6_1 = _b.sent(), !reader_6_1.done)) return [3 /*break*/, 5];
                    line1 = reader_6_1.value;
                    if (breaking) {
                        return [3 /*break*/, 4];
                    } // "reader" requests read all lines
                    try {
                        line = line1;
                        lineNum += 1;
                        currentSettingName = undefined;
                        if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                            settingCount += 1;
                            if (settingStartLabel.test(line.trim())) {
                                currentSettingName = settingStartLabel.exec(line.trim())[3];
                                // If setting name is empty, currentSettingName = undefined;
                            }
                            else {
                                currentSettingName = settingStartLabelEn.exec(line.trim())[3];
                            }
                        }
                        if (lineNum === targetLineNum) {
                            breaking = true; // return or break must not be written.
                            // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                            isFound = true;
                        }
                        if (targetSettingName && currentSettingName === targetSettingName) {
                            breaking = true; // return or break must not be written.
                            isFound = true;
                        }
                    }
                    catch (e) {
                        exception = e;
                        breaking = true;
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
                    settingIndex = null;
                    if (isOneSetting) {
                        settingIndex = 1;
                        if (settingCount !== 1) {
                            throw new Error(translate('Settings cannot be identified, because the file has 2 or more settings. ' +
                                'Add line number parameter.'));
                        }
                    }
                    else {
                        if (isFound) {
                            if (settingCount >= 1) {
                                settingIndex = settingCount;
                            }
                            else {
                                settingIndex = 1;
                            }
                        }
                        else if (targetLineNum !== undefined && targetLineNum < lineNum) {
                            settingIndex = 1;
                        }
                        else if (targetLineNum !== undefined && targetLineNum >= lineNum) {
                            settingIndex = settingCount;
                        }
                        else {
                            settingIndex = null;
                        }
                    }
                    return [2 /*return*/, settingIndex];
            }
        });
    });
}
// getTestablePath
function getTestablePath(path_) {
    if ('test' in exports.programOptions) {
        var home = lib.getHomePath();
        if (path_.startsWith(home)) {
            return '${HOME}' + path_.substr(home.length).replace(/\\/g, '/');
        }
        else if (path_.startsWith(inputFileParentPath + path.sep)) {
            return '${inputFileParentPath}/' + path_.substr(inputFileParentPath.length + 1).replace(/\\/g, '/');
        }
        else {
            return path_.replace(/\\/g, '/');
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
        var expectedAfter = expected.replace(re, setting[key].value.replace(/\$/g, '$$'));
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
    if (separatorIndex === void 0) { separatorIndex = -1; }
    var value = line.substr(separatorIndex + 1).trim();
    var comment = value.indexOf('#');
    if (comment !== notFound) {
        value = value.substr(0, comment).trim();
    }
    return value;
}
// hasRefTag
function hasRefTag(keywords) {
    return keywords.trim().startsWith(refLabel);
}
// getNotSetTemplateIfTagVariableNames
function getNotSetTemplateIfTagVariableNames(settingKeys) {
    if (settingKeys.includes(templateIfYesKey)) {
        if (settingKeys.includes(templateIfNoKey)) {
            var notSetNames = '';
        }
        else {
            var notSetNames = templateIfNoKey;
        }
    }
    else {
        if (settingKeys.includes(templateIfNoKey)) {
            var notSetNames = templateIfYesKey;
        }
        else {
            var notSetNames = templateIfYesKey + " " + translate('and') + " " + templateIfNoKey;
        }
    }
    return notSetNames;
}
// parseTemplateTag
function parseTemplateTag(line) {
    var tag = new TemplateTag();
    tag.parseLine(line);
    return tag;
}
// parseCSVColumns
function parseCSVColumns(columns) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!columns) {
                return [2 /*return*/, []]; // stream.Readable.from(undefined) occurs an error
            }
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
// parseKeyName
function parseKeyName(line) {
    var colon = line.indexOf(':');
    if (colon === notFound) {
        return '';
    }
    var lineHead = line.substr(0, colon).trim();
    if (lineHead[0] === '-') {
        var csv = lineHead.substr(1).trim(); // cut '-'
    }
    else {
        var csv = lineHead;
    }
    return csv;
}
// cutQuotation
// Example: 'abc' ⇨ abc, "abc" ⇨ abc, 'ab'c ⇨ 'ab'c
function cutQuotation(str) {
    if (str.startsWith("'") && str.endsWith("'")) {
        return str.substr(1, str.length - 2);
    }
    else if (str.startsWith('"') && str.endsWith('"')) {
        return str.substr(1, str.length - 2);
    }
    else {
        return str;
    }
}
// escapeRegularExpression
function escapeRegularExpression(expression) {
    return expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}
// isBackSlashParameter
// Example:
//    ( '\na', 0 ) === false
//    ( '\na', 1 ) === true
//    ( '\na', 2 ) === false
// #keyword: isBackSlashParameter
function isBackSlashParameter(checkingString, index) {
    var startIndex = index;
    do {
        index -= 1;
        if (index < 0) {
            break;
        }
    } while (checkingString[index] === '\\');
    var backSlashCount = startIndex - index - 1;
    return (backSlashCount % 2 === 1);
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
        this.matchedTargetKeywordCount = 0;
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
        var refColor = chalk.yellow;
        var refIndex = coloredLine.indexOf(refLabel);
        if (refIndex !== notFound) {
            var commentIndex = coloredLine.indexOf(' #', refIndex + refLabel.length);
            if (commentIndex === notFound) {
                var refTagAndParameter = coloredLine.substr(refIndex).trim();
            }
            else {
                var refTagAndParameter = coloredLine.substr(refIndex, commentIndex - refIndex).trim();
            }
            coloredLine =
                coloredLine.substr(0, refIndex) +
                    refColor(refTagAndParameter) +
                    coloredLine.substr(refIndex + refTagAndParameter.length);
        }
        var searchColor = chalk.yellow;
        var searchIndex = coloredLine.indexOf(searchLabel);
        if (searchIndex !== notFound) {
            var spaceCount = indentRegularExpression.exec(coloredLine.substr(searchIndex + searchLabel.length))[0].length;
            var parameterIndex = searchIndex + searchLabel.length + spaceCount;
            var commentIndex = coloredLine.indexOf(' #', parameterIndex);
            if (commentIndex === notFound) {
                var searchKeyword = coloredLine.substr(parameterIndex).trim();
            }
            else {
                var searchKeyword = coloredLine.substr(parameterIndex, commentIndex - parameterIndex).trim();
            }
            coloredLine =
                coloredLine.substr(0, parameterIndex) +
                    searchColor(searchKeyword) +
                    coloredLine.substr(parameterIndex + searchKeyword.length);
        }
        if (false) {
            var debugString = " (score: " + this.score + ", wordCount: " + this.testedWordCount + ", matchedCount: " + this.matchedTargetKeywordCount + ")";
        }
        else {
            var debugString = "";
        }
        // colored string
        return "" + chalk.cyan(this.path) + chalk.keyword('gray')(":" + this.lineNum + ":") + " " + coloredLine + debugString;
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
// splitFilePathAndKeyword
function splitFilePathAndKeyword(address, regularExpression, filePathRegularExpressionIndex, keywordRegularExpressionIndex) {
    var verboseMode = 'verbose' in exports.programOptions;
    if (verboseMode) {
        console.log("Verbose: Parsed by TYPRM_LINE_NUM_GETTER:");
        console.log("Verbose:     address: " + address);
        console.log("Verbose:     regularExpression: " + regularExpression);
        console.log("Verbose:     filePathRegularExpressionIndex: " + filePathRegularExpressionIndex);
        console.log("Verbose:     keywordRegularExpressionIndex: " + keywordRegularExpressionIndex);
    }
    var parameters = (new RegExp(regularExpression)).exec(address);
    if (!parameters) {
        throw new Error("ERROR: regularExpression (" + regularExpression + ") of regularExpression " +
            ("\"" + regularExpression + "\" in TYPRM_LINE_NUM_GETTER is not matched.") +
            ("testing string is \"" + address + "\"."));
    }
    if (verboseMode) {
        console.log("Verbose:     matched: [" + parameters.join(', ') + "]");
    }
    if (filePathRegularExpressionIndex > parameters.length - 1) {
        throw new Error("ERROR: filePathRegularExpressionIndex (" + filePathRegularExpressionIndex + ") of regularExpression " +
            ("\"" + regularExpression + "\" in TYPRM_LINE_NUM_GETTER is out of range.") +
            ("testing string is \"" + address + "\"."));
    }
    if (keywordRegularExpressionIndex > parameters.length - 1) {
        throw new Error("ERROR: keywordRegularExpressionIndex (" + keywordRegularExpressionIndex + ") of regularExpression " +
            ("\"" + regularExpression + "\" in TYPRM_LINE_NUM_GETTER is out of range.") +
            ("testing string is \"" + address + "\"."));
    }
    return {
        filePath: parameters[filePathRegularExpressionIndex],
        keyword: parameters[keywordRegularExpressionIndex],
    };
}
// searchAsText
function searchAsText(getter, address) {
    var e_8, _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b, filePath, keyword, reader, lineNum, breaking, exception, reader_7, reader_7_1, line1, line, e_8_1, linkableAddress;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = splitFilePathAndKeyword(address, getter.regularExpression, getter.filePathRegularExpressionIndex, getter.keywordRegularExpressionIndex), filePath = _b.filePath, keyword = _b.keyword;
                    reader = readline.createInterface({
                        input: fs.createReadStream(filePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    breaking = false;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 12]);
                    reader_7 = __asyncValues(reader);
                    _c.label = 2;
                case 2: return [4 /*yield*/, reader_7.next()];
                case 3:
                    if (!(reader_7_1 = _c.sent(), !reader_7_1.done)) return [3 /*break*/, 5];
                    line1 = reader_7_1.value;
                    if (breaking) {
                        return [3 /*break*/, 4];
                    } // "reader" requests read all lines
                    try {
                        line = line1;
                        lineNum += 1;
                        if (line.includes(keyword)) {
                            breaking = true; // return or break must not be written.
                            // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                        }
                    }
                    catch (e) {
                        exception = e;
                        breaking = true;
                    }
                    _c.label = 4;
                case 4: return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_8_1 = _c.sent();
                    e_8 = { error: e_8_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _c.trys.push([7, , 10, 11]);
                    if (!(reader_7_1 && !reader_7_1.done && (_a = reader_7.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_7)];
                case 8:
                    _c.sent();
                    _c.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_8) throw e_8.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    if (exception) {
                        throw exception;
                    }
                    if (!breaking) {
                        lineNum = 0;
                    }
                    linkableAddress = getter.address
                        .replace(verbVar.file, filePath.replace(/\\/g, '/'))
                        .replace(verbVar.windowsFile, filePath.replace(/\//g, '\\'))
                        .replace(verbVar.lineNum, lineNum.toString())
                        .replace(verbVar.fragment, '');
                    return [2 /*return*/, linkableAddress];
            }
        });
    });
}
// verbVar
var VerbVariable;
(function (VerbVariable) {
    VerbVariable.ref = '${ref}';
    VerbVariable.windowsRef = '${windowsRef}';
    VerbVariable.file = '${file}';
    VerbVariable.windowsFile = '${windowsFile}';
    VerbVariable.fragment = '${fragment}';
    VerbVariable.lineNum = '${lineNum}';
})(VerbVariable || (VerbVariable = {}));
var verbVar = VerbVariable;
// KeyValue
var KeyValue = /** @class */ (function () {
    function KeyValue() {
        this.key = '';
        this.value = '';
    }
    return KeyValue;
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
// isSameArrayOf
// T: string, nunmber
function isSameArrayOf(log, answer) {
    var matched = log.filter(function (item) { return answer.includes(item); });
    var isSame = (matched.length === answer.length && log.length === answer.length);
    return isSame;
}
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
                    this.inputResolver(line); // inputResolver() is resolve() in input()
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
var testBaseFolder = String.raw(templateObject_7 || (templateObject_7 = __makeTemplateObject(["R:homemem_cacheMyDocsrcTypeScript\typrm\test_data"], ["R:\\home\\mem_cache\\MyDoc\\src\\TypeScript\\typrm\\test_data"]))) + '\\';
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
// inputSkip
function inputSkip(count) {
    inputOption.nextParameterIndex += count;
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
            "The number of variable declarations has decreased": "変数宣言の数が減りました",
            "Add variable declarations": "変数宣言を追加してください",
            "Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.": "複数の設定があるので、設定を特定できません。行番号のパラメーターを追加してください。",
            "Error of not found specified setting name.": "エラー：指定した設定名が見つかりません。",
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
            "Error that verb number ${0} is not defined": "エラー：動詞番号 ${0} は定義されていません"
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
            translated = translated.replace('${' + String(i) + '}', String(values[i]).replace(/\$/g, '$$'));
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
if (process.env.windir) {
    var runningOS = 'Windows';
}
else {
    var runningOS = 'Linux';
}
var settingStartLabel = /^設定((\(|（)([^\)]*)(\)|）))?:( |\t)*(#.*)?$/;
var settingStartLabelEn = /^settings((\()([^\)]*)(\)))?:( |\t)*(#.*)?$/;
var originalLabel = "#original:";
var templateLabel = "#template:";
var templateAtStartLabel = "#template-at(";
var templateAtEndLabel = "):";
var templateIfLabel = "#template-if:";
var templateIfYesKey = "template-if(yes)";
var templateIfNoKey = "template-if(no)";
var fileTemplateLabel = "#file-template:";
var fileTemplateAnyLinesLabel = "#file-template-any-lines:";
var keywordLabel = "#keyword:";
var glossaryLabel = "#glossary:";
var disableLabel = "#disable-tag-tool:";
var ifLabel = "#if:";
var expectLabel = "#expect:";
var ignoredKeywords = [/#keyword:/g, /#search:/g];
var searchLabel = "#search:";
var refLabel = "#ref:";
var temporaryLabels = ["#★Now:", "#now:", "#★書きかけ", "#★未確認"];
var typrmEnvPrefix = 'TYPRM_';
var secretLabel = "#★秘密";
var secretLabelEn = "#secret";
var secretExamleLabel = "#★秘密:仮";
var secretExamleLabelEn = "#secret:example";
var referPattern = /(上記|下記|above|following)(「|\[)([^」]*)(」|\])/g;
var indentRegularExpression = /^( |¥t)*/;
var numberRegularExpression = /^[0-9]+$/;
var variablePattern = "\\$\\{[^\\}]+\\}"; // ${__Name__}
var fullMatchScore = 100;
var keywordMatchScore = 7;
var glossaryMatchScore = 1;
var caseIgnoredFullMatchScore = 8;
var wordsMatchScore = 7;
var partMatchScore = 5;
var caseIgnoredWordMatchScore = 6;
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
//# sourceMappingURL=main.js.map