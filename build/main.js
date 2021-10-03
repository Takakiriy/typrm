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
exports.programOptions = exports.programArguments = exports.stdout = exports.callMainFromJest = exports.main = void 0;
var fs = require("fs"); // file system
var path = require("path"); // or path = require("path")
var globby = require("globby");
var readline = require("readline");
var csvParse = require("csv-parse");
var chalk = require("chalk");
var yaml = require("js-yaml");
var child_process = require("child_process");
var lib = require("./lib");
var lib_1 = require("./lib");
// main
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var verboseMode, checkingFilePath, inputFilePath, inputFilePath, inputFilePath, replacingLineNum, keyValues, inputFilePath, replacingLineNum, keyValues, inputFilePath, inputFilePath, inputFilePath_1, replacingLineNum_1, variableName, inputFilePath, lineNum, d;
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
                    if (!(exports.programArguments.length === 0)) return [3 /*break*/, 7];
                    if (!exports.programOptions.replaceMode) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkRoutine(true, '')];
                case 1:
                    _a.sent();
                    if (!exports.programOptions.test) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, search()];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 29];
                case 7:
                    if (!(exports.programArguments.length >= 1)) return [3 /*break*/, 29];
                    if (!(exports.programArguments[0] === 's' || exports.programArguments[0] === 'search')) return [3 /*break*/, 9];
                    if (verboseMode) {
                        console.log('Verbose: typrm command: search');
                    }
                    return [4 /*yield*/, search()];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 29];
                case 9:
                    if (!(exports.programArguments[0] === 'f' || exports.programArguments[0] === 'find')) return [3 /*break*/, 11];
                    if (verboseMode) {
                        console.log('Verbose: typrm command: find');
                    }
                    return [4 /*yield*/, find()];
                case 10:
                    _a.sent();
                    return [3 /*break*/, 29];
                case 11:
                    if (!(exports.programArguments[0] === 'm' || exports.programArguments[0] === 'mutual-search')) return [3 /*break*/, 13];
                    varidateMutualSearchCommandArguments();
                    if (verboseMode) {
                        console.log('Verbose: typrm command: mutual-search');
                    }
                    return [4 /*yield*/, mutualSearch()];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 29];
                case 13:
                    if (!(exports.programArguments[0] === 'c' || exports.programArguments[0] === 'check')) return [3 /*break*/, 15];
                    if (verboseMode) {
                        console.log('Verbose: typrm command: check');
                    }
                    if (exports.programArguments.length >= 2) {
                        checkingFilePath = exports.programArguments[1];
                    }
                    return [4 /*yield*/, check(checkingFilePath)];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 29];
                case 15:
                    if (!(exports.programArguments[0] === 'r' || exports.programArguments[0] === 'replace')) return [3 /*break*/, 20];
                    if (verboseMode) {
                        console.log('Verbose: typrm command: replace');
                    }
                    if (!(exports.programArguments.length <= 2)) return [3 /*break*/, 17];
                    if (exports.programArguments.length === 1) {
                        inputFilePath = '';
                    }
                    else {
                        inputFilePath = exports.programArguments[1];
                    }
                    return [4 /*yield*/, replace(inputFilePath)];
                case 16:
                    _a.sent();
                    return [3 /*break*/, 19];
                case 17:
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
                    return [4 /*yield*/, replaceSettings(inputFilePath, replacingLineNum, keyValues, {}, false)];
                case 18:
                    _a.sent();
                    _a.label = 19;
                case 19: return [3 /*break*/, 29];
                case 20:
                    if (!(exports.programArguments[0] === 'revert')) return [3 /*break*/, 25];
                    if (!(exports.programArguments.length <= 2)) return [3 /*break*/, 22];
                    if (exports.programArguments.length === 1) {
                        inputFilePath = '';
                    }
                    else {
                        inputFilePath = exports.programArguments[1];
                    }
                    return [4 /*yield*/, revert(inputFilePath)];
                case 21:
                    _a.sent();
                    return [3 /*break*/, 24];
                case 22:
                    varidateRevertCommandArguments();
                    inputFilePath_1 = exports.programArguments[1];
                    replacingLineNum_1 = exports.programArguments[2];
                    return [4 /*yield*/, revertSettings(inputFilePath_1, replacingLineNum_1)];
                case 23:
                    _a.sent();
                    _a.label = 24;
                case 24: return [3 /*break*/, 29];
                case 25:
                    if (!(exports.programArguments[0] === 'where')) return [3 /*break*/, 27];
                    variableName = exports.programArguments[1];
                    inputFilePath = '';
                    lineNum = 0;
                    if (exports.programArguments.length >= 3) {
                        inputFilePath = exports.programArguments[2];
                    }
                    if (exports.programArguments.length >= 4) {
                        lineNum = parseInt(exports.programArguments[3]);
                    }
                    return [4 /*yield*/, lookUpVariable(variableName, inputFilePath, lineNum)];
                case 26:
                    _a.sent();
                    return [3 /*break*/, 29];
                case 27: return [4 /*yield*/, search()];
                case 28:
                    _a.sent();
                    _a.label = 29;
                case 29:
                    // debug
                    if (false) {
                        d = lib_1.pp('');
                        d = d;
                        // If exception was raised, this code does not execute. Set a break point at the catch block of calling main.main
                    }
                    return [2 /*return*/];
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
        var parentPath, previousTemplateCount, reader, isReadingSetting, setting, settingCount, settingLineNum, settingIndentLength, lineNum, templateCount, fileTemplateTag, errorCount, warningCount, secretLabelCount, parser, lines, keywords, ifTagParser, reader_1, reader_1_1, line1, line, parsed, separator, key, value, previous, condition, evaluatedContidion, templateTag, checkingLine, commonCase, expected, expected, checkingLineWithoutTemplate, checkingLineWithoutTemplate, continue_, checkPassed, _i, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, checkPassed, reader_2, reader_2_1, line1, line, _c, keywords_1, keyword, e_2_1, _d, keywords_2, keyword, loop, key, settingNameOrLineNum, replacingSettingIndex, keyValue, _e, _f, _g, key;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    if (!isModal) return [3 /*break*/, 2];
                    return [4 /*yield*/, lib.inputPath(translate('YAML UTF-8 file path>'))];
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
                    settingLineNum = 0;
                    settingIndentLength = 0;
                    lineNum = 0;
                    templateCount = 0;
                    fileTemplateTag = null;
                    errorCount = 0;
                    warningCount = 0;
                    secretLabelCount = 0;
                    parser = new Parser();
                    lines = [];
                    keywords = [];
                    ifTagParser = new IfTagParser(parser);
                    parser.command = CommandEnum.check;
                    parser.verbose = ('verbose' in exports.programOptions);
                    parser.filePath = inputFilePath;
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
                    parser.lineNum = lineNum;
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
                            onEndOfSettingScope(setting, inputFilePath);
                        }
                        if (parser.verbose) {
                            console.log("Verbose: " + getTestablePath(inputFilePath) + ":" + lineNum + ": settings");
                        }
                        isReadingSetting = true;
                        setting = {};
                        settingCount += 1;
                        settingLineNum = lineNum;
                        settingIndentLength = indentRegularExpression.exec(line)[0].length;
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
                                    previous = setting[key];
                                    console.log('');
                                    console.log(translate('Error of duplicated variable name:'));
                                    console.log("  " + translate('typrmFile') + "A: " + getTestablePath(inputFilePath) + ":" + previous.lineNum);
                                    console.log("  ContentsA: " + key + ": " + previous.value);
                                    console.log("  " + translate('typrmFile') + "B: " + getTestablePath(inputFilePath) + ":" + lineNum);
                                    console.log("  ContentsB: " + key + ": " + value);
                                    errorCount += 1;
                                }
                                if (parser.verbose) {
                                    console.log("Verbose: " + getTestablePath(inputFilePath) + ":" + lineNum + ":     " + key + ": " + value);
                                }
                                setting[key] = { value: value, isReferenced: false, lineNum: [lineNum] };
                            }
                        }
                    }
                    // Check the condition by "#expect:" tag.
                    if (line.includes(expectLabel) && ifTagParser.thisIsOutOfFalseBlock) {
                        condition = line.substr(line.indexOf(expectLabel) + expectLabel.length).trim();
                        evaluatedContidion = evaluateIfCondition(condition, setting, parser);
                        if (typeof evaluatedContidion === 'boolean') {
                            if (!evaluatedContidion) {
                                console.log('');
                                console.log(translate('Error of not expected condition:'));
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
                    templateTag = parseTemplateTag(line, parser);
                    if (templateTag.lineNumOffset >= 1 && templateTag.isFound) {
                        console.log("");
                        console.log(translate('ErrorLine') + ": " + getTestablePath(inputFilePath) + ":" + lineNum);
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
                            console.log(translate('ErrorLine') + ": " + getTestablePath(inputFilePath) + ":" + (lineNum + templateTag.lineNumOffset));
                            if (templateTag.lineNumOffset <= -2) {
                                console.log(translate('Template') + ":  " + getTestablePath(inputFilePath) + ":" + lineNum);
                            }
                            console.log("  " + translate('Contents') + ": " + checkingLine.trim());
                            console.log("  " + translate('Expected') + ": " + expected);
                            if (commonCase) {
                                console.log("  " + translate('Template') + ": " + templateTag.template);
                            }
                            else { // if (templateTag.label === templateIfLabel)
                                console.log("  " + translate('Expression') + ": " + templateTag.template);
                            }
                            console.log("  " + translate('Setting') + ": " + getTestablePath(inputFilePath) + ":" + settingLineNum);
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
                            console.log("  " + translate('Setting') + ": " + getTestablePath(inputFilePath) + ":" + settingLineNum);
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
                                console.log("  " + translate('Setting') + ": " + getTestablePath(inputFilePath) + ":" + settingLineNum);
                                warningCount += 1;
                            }
                            secretLabelCount += 1;
                        }
                    }
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
                        onEndOfSettingScope(setting, inputFilePath);
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
                        return [3 /*break*/, 44];
                    }
                    loop = true;
                    _h.label = 32;
                case 32:
                    if (!loop) return [3 /*break*/, 42];
                    console.log(translate('Press Enter key to retry checking.'));
                    return [4 /*yield*/, lib.input(translate('The line number to replace the variable value >'))];
                case 33:
                    key = _h.sent();
                    errorCount = 0;
                    if (!(key === 'exit')) return [3 /*break*/, 34];
                    return [2 /*return*/];
                case 34:
                    if (!(key !== '')) return [3 /*break*/, 41];
                    settingNameOrLineNum = key;
                    return [4 /*yield*/, getSettingIndexFromLineNum(inputFilePath, settingNameOrLineNum)];
                case 35:
                    replacingSettingIndex = _h.sent();
                    if (!!replacingSettingIndex) return [3 /*break*/, 36];
                    console.log('');
                    console.log(translate("Error of not found specified setting name") + ": " + settingNameOrLineNum);
                    errorCount += 1;
                    return [3 /*break*/, 41];
                case 36:
                    console.log(translate('SettingIndex') + ": " + replacingSettingIndex);
                    console.log(translate('Enter only: finish to input setting'));
                    _h.label = 37;
                case 37: return [4 /*yield*/, lib.input(translate('key: new_value>'))];
                case 38:
                    keyValue = _h.sent();
                    if (keyValue === '') {
                        return [3 /*break*/, 41];
                    }
                    _e = errorCount;
                    return [4 /*yield*/, replaceSettingsSub(inputFilePath, replacingSettingIndex, parseKeyValueLines(keyValue), {}, true, false, false)];
                case 39:
                    errorCount = _e + _h.sent();
                    _h.label = 40;
                case 40: return [3 /*break*/, 37];
                case 41:
                    loop = (errorCount >= 1);
                    return [3 /*break*/, 32];
                case 42:
                    // Rescan
                    console.log('========================================');
                    previousTemplateCount = templateCount;
                    for (_f = 0, _g = Object.keys(setting); _f < _g.length; _f++) {
                        key = _g[_f];
                        setting[key].isReferenced = false;
                    }
                    _h.label = 43;
                case 43: return [3 /*break*/, 3];
                case 44: return [2 /*return*/];
            }
        });
    });
}
// replaceSettings
function replaceSettings(inputFilePath, settingNameOrLineNum, keyValueLines, toTagLines, cutReplaceToTagEnabled) {
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
                    return [4 /*yield*/, replaceSettingsSub(inputFileFullPath, replacingSettingIndex, parseKeyValueLines(keyValueLines), toTagLines, true, false, cutReplaceToTagEnabled)];
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
                    return [4 /*yield*/, replaceSettingsSub(inputFileFullPath, replacingSettingIndex, parseKeyValueLines(revertSetting), {}, false, true, false)];
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
        var currentFolder, targetFolders, fileFullPaths, inputFileFullPath, inputFileFullPath, _i, targetFolders_1, folder, targetFolderFullPath, inputFileFullPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentFolder = process.cwd();
                    return [4 /*yield*/, lib.parseCSVColumns(exports.programOptions.folder)];
                case 1:
                    targetFolders = _a.sent();
                    fileFullPaths = [];
                    if (lib.isFullPath(inputFilePath)) {
                        inputFileFullPath = inputFilePath;
                        if (fs.existsSync(inputFileFullPath)) {
                            fileFullPaths.push(inputFileFullPath);
                        }
                    }
                    else if (targetFolders.length === 0) {
                        inputFileFullPath = lib.getFullPath(inputFilePath, currentFolder);
                        if (fs.existsSync(inputFileFullPath)) {
                            fileFullPaths.push(inputFileFullPath);
                        }
                    }
                    else {
                        for (_i = 0, targetFolders_1 = targetFolders; _i < targetFolders_1.length; _i++) {
                            folder = targetFolders_1[_i];
                            targetFolderFullPath = lib.getFullPath(folder, currentFolder);
                            inputFileFullPath = lib.getFullPath(inputFilePath, targetFolderFullPath);
                            if (fs.existsSync(inputFileFullPath)) {
                                fileFullPaths.push(inputFileFullPath);
                            }
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
function replaceSettingsSub(inputFilePath, replacingSettingIndex, keyValues, toTagLines, addOriginalTag, cutOriginalTag, cutReplaceToTagEnabled) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function () {
        var errorCount, replacingKeyValues, previousEvalatedKeyValues, oldFilePath, newFilePath, reducedErrorWasOccurred, loop, loopCount, conflictErrors, replacedKeys, parser, _loop_1, isReadingSetting, setting, settingCount, settingIndentLength, settingLineNum, oldSetting, lineNum, isReplacing, isAllReplacable, isCheckingTemplateIfKey, templateIfKeyError, output, replacingLine, expected, replaced, expected, replaced, replacedLine, lengthSortedTemplates, replacedLine, maskedLine, i, errorMessage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    errorCount = 0;
                    replacingKeyValues = keyValues;
                    previousEvalatedKeyValues = {};
                    oldFilePath = inputFilePath;
                    newFilePath = inputFilePath + ".new";
                    reducedErrorWasOccurred = false;
                    loop = true;
                    loopCount = 0;
                    conflictErrors = {};
                    replacedKeys = [];
                    parser = new Parser();
                    parser.command = CommandEnum.replace;
                    parser.verbose = ('verbose' in exports.programOptions);
                    parser.filePath = inputFilePath;
                    if (parser.verbose) {
                        console.log("Verbose: replaceSettingsSub:");
                        console.log("Verbose:     inputFilePath: " + getTestablePath(inputFilePath));
                        console.log("Verbose:     replacingSettingIndex: " + replacingSettingIndex);
                        console.log("Verbose:     keyValues: " + JSON.stringify(keyValues));
                    }
                    _loop_1 = function () {
                        var writer, readStream, reader, lines, checkedTemplateTags, evalatedKeyValues, ifTagParser, oldIfTagParser, previousEvalatedKeyValuesLength, reader_3, reader_3_1, line1, line, settingNames_1, oldSettingNames, undefinedVariableNames, separator, key, oldValue, replacingKeys, replacedValue, _c, original, spaceAndComment, templateTag, commonCase, before, after, targetLineNum, mask, conflictedTemplates, _i, lengthSortedTemplates_1, template, _d, _e, template, necessaryVariableNames, cutLine, e_3_1, _f, _g, conflictError;
                        return __generator(this, function (_h) {
                            switch (_h.label) {
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
                                    checkedTemplateTags = {};
                                    evalatedKeyValues = {};
                                    ifTagParser = new IfTagParser(parser);
                                    oldIfTagParser = new IfTagParser(parser);
                                    previousEvalatedKeyValuesLength = Object.keys(previousEvalatedKeyValues).length;
                                    loopCount += 1;
                                    if (parser.verbose) {
                                        console.log("Verbose: loopCount: " + loopCount);
                                        console.log("Verbose: previousEvalatedKeyValuesLength: " + previousEvalatedKeyValuesLength);
                                    }
                                    _h.label = 1;
                                case 1:
                                    _h.trys.push([1, 6, 7, 12]);
                                    reader_3 = (e_3 = void 0, __asyncValues(reader));
                                    _h.label = 2;
                                case 2: return [4 /*yield*/, reader_3.next()];
                                case 3:
                                    if (!(reader_3_1 = _h.sent(), !reader_3_1.done)) return [3 /*break*/, 5];
                                    line1 = reader_3_1.value;
                                    line = line1;
                                    lines.push(line);
                                    lineNum += 1;
                                    output = false;
                                    parser.lineNum = lineNum;
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
                                    ifTagParser.evaluate(line, setting, Object.keys(previousEvalatedKeyValues));
                                    oldIfTagParser.evaluate(line, oldSetting, Object.keys(previousEvalatedKeyValues));
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
                                                        evalatedKeyValues[key] = replacingKeyValues[key];
                                                    }
                                                    else {
                                                        evalatedKeyValues[key] = oldValue;
                                                    }
                                                    if (parser.verbose) {
                                                        if (!replacedKeys.includes(key)) {
                                                            replacedKeys.push(key);
                                                            console.log("Verbose:     evaluated setting: " + key);
                                                        }
                                                    }
                                                }
                                                if (oldValue !== '' && oldIfTagParser.thisIsOutOfFalseBlock) {
                                                    oldSetting[key] = { value: oldValue, isReferenced: false, lineNum: [lineNum] };
                                                }
                                                if (ifTagParser.thisIsOutOfFalseBlock) {
                                                    replacingKeys = Object.keys(replacingKeyValues);
                                                    if (replacingKeys.includes(key) && ifTagParser.isReplacable) {
                                                        replacedValue = replacingKeyValues[key];
                                                        _c = getReplacedLineInSettings(line, separator, oldValue, replacedValue, addOriginalTag, cutOriginalTag, cutReplaceToTagEnabled), original = _c.original, spaceAndComment = _c.spaceAndComment;
                                                        writer.write(line.substr(0, separator + 1) + ' ' + replacedValue + original + spaceAndComment + "\n");
                                                        output = true;
                                                        setting[key] = { value: replacedValue, isReferenced: false, lineNum: [lineNum] };
                                                        if (parser.verbose && oldValue !== replacedValue) {
                                                            console.log("Verbose: replaced \"" + key + "\" value from \"" + oldValue + "\" to \"" + replacedValue + "\"");
                                                            console.log("Verbose:     at: " + inputFilePath + ":" + lineNum + ":");
                                                        }
                                                    }
                                                    else {
                                                        if (oldValue !== '') {
                                                            setting[key] = { value: oldValue, isReferenced: false, lineNum: [lineNum] };
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (loopCount === 1 && key in toTagLines) {
                                                        if (toTagLines[key].includes(lineNum)) {
                                                            console.log("\nError: " + getTestablePath(inputFilePath) + ":" + lineNum + ": \"#to:\" tag cannot write in false condition block. Write \"#to:\" tags to be true condition.");
                                                        }
                                                    }
                                                }
                                            }
                                            // Out of settings
                                        }
                                        else {
                                            templateTag = parseTemplateTag(line, parser);
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
                                                    if (templateTag.lineNumOffset === 0) {
                                                        replacedLine = line.replace(new RegExp(lib.escapeRegularExpression(before), 'g'), after.replace(/\$/g, '$$'));
                                                        if (cutReplaceToTagEnabled) {
                                                            replacedLine = cutReplaceToTag(replacedLine);
                                                        }
                                                        writer.write(replacedLine + "\n");
                                                        output = true;
                                                        checkedTemplateTags[lineNum] = [];
                                                        checkedTemplateTags[lineNum].push({
                                                            templateLineNum: lineNum,
                                                            template: templateTag.template,
                                                            targetLineNum: lineNum + templateTag.lineNumOffset,
                                                            expected: before,
                                                            replaced: after.replace(/\$/g, '$$')
                                                        });
                                                    }
                                                    else if (templateTag.lineNumOffset <= -1) {
                                                        targetLineNum = lineNum + templateTag.lineNumOffset;
                                                        if (!(targetLineNum in checkedTemplateTags)) {
                                                            checkedTemplateTags[targetLineNum] = [];
                                                        }
                                                        checkedTemplateTags[targetLineNum].push({
                                                            templateLineNum: lineNum,
                                                            template: templateTag.template,
                                                            targetLineNum: targetLineNum,
                                                            expected: before,
                                                            replaced: after.replace(/\$/g, '$$')
                                                        });
                                                        lengthSortedTemplates = checkedTemplateTags[targetLineNum].slice();
                                                        lengthSortedTemplates = lengthSortedTemplates.sort(function (b, a) { return (a.expected.length - b.expected.length); });
                                                        replacedLine = replacingLine;
                                                        maskedLine = replacingLine;
                                                        mask = '\n';
                                                        conflictedTemplates = [];
                                                        for (_i = 0, lengthSortedTemplates_1 = lengthSortedTemplates; _i < lengthSortedTemplates_1.length; _i++) {
                                                            template = lengthSortedTemplates_1[_i];
                                                            i = 0;
                                                            if (!maskedLine.includes(template.expected)) {
                                                                if (!replacedLine.includes(template.replaced)) {
                                                                    conflictedTemplates.push(template);
                                                                }
                                                            }
                                                            else {
                                                                for (;;) {
                                                                    i = maskedLine.indexOf(template.expected, i);
                                                                    if (i === notFound) {
                                                                        break;
                                                                    }
                                                                    replacedLine = replacedLine.substr(0, i) + template.replaced + replacedLine.substr(i + template.expected.length);
                                                                    maskedLine = maskedLine.substr(0, i) + mask.repeat(template.replaced.length) + maskedLine.substr(i + template.expected.length);
                                                                    i += template.expected.length;
                                                                }
                                                            }
                                                        }
                                                        writer.replaceAboveLine(templateTag.lineNumOffset, replacedLine + "\n");
                                                        if (conflictedTemplates.length >= 1) {
                                                            errorMessage = '';
                                                            errorMessage += '\n';
                                                            errorMessage += translate('ErrorIn') + ": " + getTestablePath(inputFilePath) + ":" + targetLineNum + "\n";
                                                            errorMessage += "  " + translate('Error') + ": " + translate('template values are conflicted.') + "\n";
                                                            errorMessage += "  " + translate('Contents') + ": " + replacingLine.trim() + "\n";
                                                            for (_d = 0, _e = checkedTemplateTags[targetLineNum]; _d < _e.length; _d++) {
                                                                template = _e[_d];
                                                                errorMessage += "  " + translate('in ') + ": " + getTestablePath(inputFilePath) + ":" + template.templateLineNum + "\n";
                                                                errorMessage += "    " + translate('Before Editing') + ": " + template.expected.trim() + "\n";
                                                                errorMessage += "    " + translate('After  Editing') + ": " + template.replaced.trim() + "\n";
                                                                errorMessage += "    " + translate('Template') + ": " + template.template.trim() + "\n";
                                                            }
                                                            errorMessage += "  " + translate('Setting') + ": " + getTestablePath(inputFilePath) + ":" + settingLineNum;
                                                            conflictErrors[targetLineNum] = errorMessage;
                                                        }
                                                    }
                                                    if (parser.verbose && before !== after) {
                                                        console.log("Verbose: replaced a line:");
                                                        console.log("Verbose:     from: " + before);
                                                        console.log("Verbose:     to:   " + after);
                                                        console.log("Verbose:     at: " + inputFilePath + ":" + (lineNum - templateTag.lineNumOffset) + ":");
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
                                        if (!cutReplaceToTagEnabled) {
                                            writer.write(line + "\n");
                                        }
                                        else {
                                            if (line.trim() === '') {
                                                writer.write(line + "\n");
                                            }
                                            else {
                                                cutLine = cutReplaceToTag(line);
                                                if (cutLine.trim() === '') {
                                                    lines.pop(); // for template-at tag
                                                }
                                                else {
                                                    writer.write(cutLine + "\n");
                                                }
                                            }
                                        }
                                    }
                                    _h.label = 4;
                                case 4: return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 12];
                                case 6:
                                    e_3_1 = _h.sent();
                                    e_3 = { error: e_3_1 };
                                    return [3 /*break*/, 12];
                                case 7:
                                    _h.trys.push([7, , 10, 11]);
                                    if (!(reader_3_1 && !reader_3_1.done && (_a = reader_3.return))) return [3 /*break*/, 9];
                                    return [4 /*yield*/, _a.call(reader_3)];
                                case 8:
                                    _h.sent();
                                    _h.label = 9;
                                case 9: return [3 /*break*/, 11];
                                case 10:
                                    if (e_3) throw e_3.error;
                                    return [7 /*endfinally*/];
                                case 11: return [7 /*endfinally*/];
                                case 12:
                                    for (_f = 0, _g = Object.values(conflictErrors); _f < _g.length; _f++) {
                                        conflictError = _g[_f];
                                        console.log(conflictError);
                                        errorCount += 1;
                                    }
                                    // previousReplacedKeys = ...
                                    Object.keys(evalatedKeyValues).forEach(function (key) {
                                        previousEvalatedKeyValues[key] = evalatedKeyValues[key];
                                    });
                                    if (isAllReplacable) {
                                        loop = false;
                                    }
                                    else if (previousEvalatedKeyValuesLength == Object.keys(evalatedKeyValues).length) {
                                        console.log('');
                                        console.log(translate(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Error of unexpected: The count of evalatedKeyValues is not increasing.' +\n                ' isReplacable may be not changed. Try typrm check command."], ["Error of unexpected: The count of evalatedKeyValues is not increasing.' +\n                ' isReplacable may be not changed. Try typrm check command."]))));
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
                                    _h.sent();
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
// getReplacedLineInSettings
function getReplacedLineInSettings(line, separator, oldValue, replacedValue, addOriginalTag, cutOriginalTag, cutReplaceToTagEnabled) {
    // spaceAndComment
    // __SettingB__: SetB
    // __SettingB__: SetB  #// comment
    // __SettingB__: SetB      #to: NewSetB   #// SetBB....
    //                   ^ spaceAndCommentIndex
    var spaceAndComment = '';
    var commentMatch = / +#.*/.exec(line.substr(separator));
    if (commentMatch) {
        var spaceAndCommentIndex = separator + commentMatch.index;
        spaceAndComment = line.substr(spaceAndCommentIndex);
    }
    else {
        var spaceAndCommentIndex = notFound;
    }
    var original = '';
    var lineIncludesOriginalLabel = line.includes(originalLabel);
    // addOriginalTag
    if (addOriginalTag && !lineIncludesOriginalLabel) {
        // before: __SettingB__: SetB
        // after:  __SettingB__: NewSetB  #original: SetB
        original = "  " + originalLabel + " " + oldValue;
        // cutReplaceToTag
        if (cutReplaceToTagEnabled && spaceAndComment !== '') {
            var commentIndex = line.indexOf('#', spaceAndCommentIndex);
            var toLabelIndex = line.indexOf(toLabel, commentIndex);
            if (toLabelIndex > commentIndex) {
                var nextCommentIndex = line.indexOf(' #', toLabelIndex + 1);
                if (nextCommentIndex === notFound) {
                    // before: __SettingB__: SetB    #// comment1     #to: NewSetB
                    //                               ^ commentIndex   ^ toLabelIndex
                    // after:  __SettingB__: NewSetB  #original: SetB    #// comment1
                    spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                        line.substr(commentIndex, toLabelIndex - commentIndex).trimRight();
                }
                else {
                    nextCommentIndex += 1;
                    if (line[toLabelIndex - 2] !== ' ' && line[nextCommentIndex - 2] !== ' ') {
                        // before: __SettingB__: SetB    #// comment1 #to: NewSetB #// comment2
                        //                               ^ commentIndex            ^ nextCommentIndex
                        //      spaceAndCommentIndex ^                ^ toLabelIndex 
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1 #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substr(commentIndex, toLabelIndex - commentIndex) +
                            line.substr(nextCommentIndex);
                    }
                    else {
                        var commentMatch2 = / +#.*/.exec(line.substr(toLabelIndex));
                        var spaceAndCommentIndex2 = toLabelIndex + commentMatch2.index;
                        // before: __SettingB__: SetB    #// comment1     #to: NewSetB___      #// comment2
                        //                               ^ commentIndex   ^ toLabelIndex       ^ nextCommentIndex
                        //                           ^ spaceAndCommentIndex              ^ spaceAndCommentIndex2
                        // after:  __SettingB__: NewSetB  #original: SetB    #// comment1         #// comment2
                        spaceAndComment = ' '.repeat(commentIndex - spaceAndCommentIndex) +
                            line.substr(commentIndex, toLabelIndex - commentIndex - 1) +
                            line.substr(spaceAndCommentIndex2 + 1);
                    }
                }
            }
            else {
                var nextCommentIndex = notFound;
                if (toLabelIndex !== notFound) {
                    var nextCommentMatch = / +#.*/.exec(line.substr(commentIndex));
                    if (nextCommentMatch) {
                        nextCommentIndex = commentIndex + nextCommentMatch.index;
                    }
                }
                if (toLabelIndex === notFound) {
                    // before: __SettingB__: SetB   #// comment
                    // after:  __SettingB__: NewSetB  #original: SetB   #// comment
                    // Do nothing
                }
                else {
                    if (nextCommentIndex === notFound) {
                        // before: __SettingB__: SetB  #to: NewSetB
                        //                             ^ commentIndex == toLabelIndex
                        // after:  __SettingB__: NewSetB  #original: SetB
                        spaceAndComment = '';
                    }
                    else {
                        // before: __SettingB__: SetB      #to: NewSetB   #// next comment
                        //    commentIndex == toLabelIndex ^           ^ nextCommentIndex
                        // after:  __SettingB__: NewSetB   #original: SetB      #// next comment
                        var spaceCountBeforeToTag = line.indexOf('#', spaceAndCommentIndex) - spaceAndCommentIndex;
                        var spaceCountAfterToTag = line.indexOf('#', nextCommentIndex) - nextCommentIndex;
                        original = ' '.repeat(spaceCountAfterToTag) + (originalLabel + " " + oldValue);
                        spaceAndComment = ' '.repeat(spaceCountBeforeToTag) + line.substr(nextCommentIndex + spaceCountAfterToTag);
                    }
                }
            }
        }
    }
    // cutOriginalTag
    if (cutOriginalTag && lineIncludesOriginalLabel) {
        var replacedValuePattern = lib.escapeRegularExpression(replacedValue).replace(/\$/g, '$$');
        spaceAndComment = spaceAndComment.replace(new RegExp(" *" + originalLabel + " *" + replacedValuePattern), '');
    }
    return { original: original, spaceAndComment: spaceAndComment };
}
// cutReplaceToTag
function cutReplaceToTag(line) {
    var toLabelIndex = line.indexOf(toLabel);
    if (toLabelIndex !== notFound) {
        var commentIndex = line.indexOf(' #', toLabelIndex);
        if (commentIndex !== notFound) {
            // added tag: SetB    #to: NewSetB  #template: __B__
            // replaced:  NewSetB    #template: __B__
            // reverted:  SetB    #template: __B__
            line = line.substr(0, toLabelIndex) + line.substr(commentIndex + 1);
        }
        else {
            // added tag: SetB    #to: NewSetB
            // replaced:  NewSetB
            // reverted:  SetB
            line = line.substr(0, toLabelIndex).trimRight();
        }
    }
    return line;
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
                                console.log(getTestablePath(inputFilePath) + ":" + lineNum + ": " + line);
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
    // constructor
    function TemplateTag(parser) {
        this.label = '';
        this.template = '';
        this.isFound = false;
        // template tag
        this.indexInLine = notFound;
        // template-at tag
        this.lineNumOffset = 0;
        this.startIndexInLine = notFound;
        this.endIndexInLine = notFound;
        // template-if tag
        this.oldTemplate = '';
        this.newTemplate = '';
        // for file-template tag
        this.templateLines = [];
        this.indentAtTag = '';
        this.minIndentLength = 0;
        this.parser = parser;
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
            var leftOfTemplate = cutReplaceToTag(line.substr(0, this.indexInLine).trim());
            if (this.label === fileTemplateLabel) {
                this.onFileTemplateTagReading(line);
            }
            this.template = line.substr(this.indexInLine + this.label.length).trim();
            this.template = getValue(this.template);
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
    // scanKeyValues
    TemplateTag.prototype.scanKeyValues = function (toValue, allKeys, lineNum, parser, hasTestTag) {
        return __awaiter(this, void 0, void 0, function () {
            var keysSortedByLength, foundIndices, verboseMode, template, _i, keysSortedByLength_1, key, index, indices, keys, placeholder, templatePattern, i, templateRegularExpression, toValueIsMatchedWithTemplate, keyValues, i, toValues, i, returnKeyValues, _a, _b, key;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        keysSortedByLength = allKeys.slice();
                        keysSortedByLength.sort(function (b, a) { return (a.length, b.length); });
                        foundIndices = [];
                        verboseMode = parser.verbose || hasTestTag;
                        template = this.template;
                        // Set variable names to "key" from "#template:" tag's value
                        //     key = [ __A__, __B__ ]
                        //     #template: (__A__:__B__)
                        for (_i = 0, keysSortedByLength_1 = keysSortedByLength; _i < keysSortedByLength_1.length; _i++) {
                            key = keysSortedByLength_1[_i];
                            index = 0;
                            for (;;) {
                                index = template.indexOf(key, index);
                                if (index === notFound) {
                                    break;
                                }
                                foundIndices[index] = key;
                                template =
                                    template.substr(0, index) +
                                        ' '.repeat(key.length) +
                                        template.substr(index + key.length);
                                // erase the key
                                index += 1;
                            }
                        }
                        indices = Object.keys(foundIndices).map(function (v) { return (parseInt(v)); }).sort(function (a, b) { return (a - b); });
                        keys = indices.map(function (index) { return (foundIndices[index]); });
                        placeholder = '\n';
                        templatePattern = this.template;
                        for (i = indices.length - 1; i >= 0; i -= 1) {
                            templatePattern =
                                templatePattern.substr(0, indices[i]) +
                                    placeholder +
                                    templatePattern.substr(indices[i] + keys[i].length);
                        }
                        templateRegularExpression = lib.escapeRegularExpression(templatePattern).replace(new RegExp(placeholder, "g"), '(.*)');
                        toValueIsMatchedWithTemplate = new RegExp(templateRegularExpression).exec(toValue);
                        keyValues = {};
                        if (verboseMode) {
                            console.log("Verbose:         template: " + this.template);
                            console.log("Verbose:         templatePattern: " + templatePattern.replace(new RegExp(placeholder, "g"), '*'));
                            console.log("Verbose:         toValue: " + toValue);
                            console.log("Verbose:         toValueIsMatchedWithTemplate: " + (toValueIsMatchedWithTemplate != null));
                        }
                        if (!toValueIsMatchedWithTemplate) return [3 /*break*/, 1];
                        // Case that "#to:" tag is pattern of template
                        //     (A:B)  #to: (a:b)  #template: (__A__:__B__)
                        for (i = 1; i < toValueIsMatchedWithTemplate.length; i += 1) {
                            keyValues[keys[i - 1]] = toValueIsMatchedWithTemplate[i];
                        }
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, lib.parseCSVColumns(toValue)];
                    case 2:
                        toValues = _c.sent();
                        for (i = 0; i < keys.length; i += 1) {
                            if (i < toValues.length && toValues[i]) {
                                keyValues[keys[i]] = toValues[i];
                            }
                        }
                        _c.label = 3;
                    case 3:
                        returnKeyValues = {};
                        for (_a = 0, _b = Object.keys(keyValues); _a < _b.length; _a++) {
                            key = _b[_a];
                            returnKeyValues[key] = {
                                value: keyValues[key],
                                lineNum: [lineNum],
                            };
                        }
                        return [2 /*return*/, returnKeyValues];
                }
            });
        });
    };
    // evaluate
    TemplateTag.prototype.evaluate = function (setting) {
        if (this.label !== templateIfLabel) {
            return new Error();
        }
        var expression = this.template;
        var evaluatedContidion = evaluateIfCondition(expression, setting, this.parser);
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
            var parentPath, targetFilePath, templateLineNum_1, targetFileReader, expectedFirstLine, templateLineIndex, targetLineNum, errorTemplateLineIndex, errorTargetLineNum, errorContents, errorExpected, errorTemplate, indent, Result, result, skipTo, skipToTemplate, skipFrom, skipStartLineNum, loop, exception, targetFileReader_1, targetFileReader_1_1, line1, targetLine, indentLength, expected, e_5_1, templateLineNum;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parentPath = path.dirname(inputFilePath);
                        targetFilePath = lib.getFullPath(getExpectedLine(setting, this.template), parentPath);
                        if (!fs.existsSync(targetFilePath)) {
                            templateLineNum_1 = templateEndLineNum - this.templateLines.length;
                            console.log("");
                            console.log("Error of not found the target file:");
                            console.log("  " + translate('NotFound') + ": " + getTestablePath(targetFilePath));
                            console.log("  Template: " + getTestablePath(inputFilePath) + ":" + templateLineNum_1);
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
    // constructor
    function IfTagParser(parser) {
        this.thisIsOutOfFalseBlock_ = true;
        this.indentLengthsOfIfTag = [
            { indentLength: -1, resultOfIf: true, enabled: true, isReplacable: true }
        ];
        this.isReplacable_ = true;
        this.parser = parser;
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
                if (this.parser.verbose) {
                    console.log("Verbose: " + getTestablePath(this.parser.filePath) + ":" + (this.parser.lineNum - 1) + ": end #if:");
                }
            }
        }
        if (line.includes(ifLabel)) {
            expression = line.substr(line.indexOf(ifLabel) + ifLabel.length).trim();
            var evaluatedContidion = evaluateIfCondition(expression, setting, this.parser, previsousEvalatedKeys);
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
// BlockDisableTagParser
var BlockDisableTagParser = /** @class */ (function () {
    function BlockDisableTagParser() {
        this.previousLineHasTag = false;
        this.isInBlock_ = false;
        this.blockIndentLength = 0;
    }
    Object.defineProperty(BlockDisableTagParser.prototype, "isInBlock", {
        get: function () { return this.isInBlock_; },
        enumerable: false,
        configurable: true
    });
    BlockDisableTagParser.prototype.evaluate = function (line) {
        if (line.trim() === '') {
            return;
        }
        var indentLength = indentRegularExpression.exec(line)[0].length;
        if (this.isInBlock_) {
            if (indentLength <= this.blockIndentLength) {
                this.blockIndentLength = 0;
                this.isInBlock_ = false;
            }
        }
        else {
            this.isInBlock_ = this.previousLineHasTag;
        }
        if (line.includes(searchIfLabel)) {
            this.blockIndentLength = indentLength;
            this.previousLineHasTag = true;
        }
        else {
            this.previousLineHasTag = false;
        }
    };
    return BlockDisableTagParser;
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
// replace
function replace(inputFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, inputFileFullPath, replaceKeyValuesSet, _b, replaceKeyValuesSet_1, replaceKeyValues, toTagLines, _c, _d, _e, key, value, _f, _g, lineNum;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    _i = 0;
                    return [4 /*yield*/, listUpFilePaths(inputFilePath)];
                case 1:
                    _a = _h.sent();
                    _h.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    inputFileFullPath = _a[_i];
                    return [4 /*yield*/, makeReplaceSettingsFromToTags(inputFileFullPath)];
                case 3:
                    replaceKeyValuesSet = _h.sent();
                    _b = 0, replaceKeyValuesSet_1 = replaceKeyValuesSet;
                    _h.label = 4;
                case 4:
                    if (!(_b < replaceKeyValuesSet_1.length)) return [3 /*break*/, 7];
                    replaceKeyValues = replaceKeyValuesSet_1[_b];
                    if (!!replaceKeyValues.testMode) return [3 /*break*/, 6];
                    toTagLines = {};
                    for (_c = 0, _d = Object.entries(replaceKeyValues.keyValues); _c < _d.length; _c++) {
                        _e = _d[_c], key = _e[0], value = _e[1];
                        toTagLines[key] = value.lineNum.slice(); // copy
                        for (_f = 0, _g = value.lineNum; _f < _g.length; _f++) {
                            lineNum = _g[_f];
                            console.log(getTestablePath(inputFileFullPath) + ":" + lineNum + ": " + toLabel + " " + key + ": " + value.value);
                        }
                    }
                    return [4 /*yield*/, replaceSettings(inputFileFullPath, replaceKeyValues.settingNameOrLineNum, replaceKeyValues.keyValueLines, toTagLines, true)];
                case 5:
                    _h.sent();
                    _h.label = 6;
                case 6:
                    _b++;
                    return [3 /*break*/, 4];
                case 7:
                    _i++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// revert
function revert(inputFilePath) {
    var e_6, _a;
    return __awaiter(this, void 0, void 0, function () {
        var _i, _b, inputFileFullPath, text, readStream, reader, lineNum, reverted, reader_5, reader_5_1, line1, line, e_6_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _i = 0;
                    return [4 /*yield*/, listUpFilePaths(inputFilePath)];
                case 1:
                    _b = _c.sent();
                    _c.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 16];
                    inputFileFullPath = _b[_i];
                    text = fs.readFileSync(inputFileFullPath, "utf-8");
                    if (!text.includes(originalLabel)) return [3 /*break*/, 15];
                    readStream = fs.createReadStream(inputFileFullPath);
                    reader = readline.createInterface({
                        input: readStream,
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    reverted = false;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 9, 10, 15]);
                    reader_5 = (e_6 = void 0, __asyncValues(reader));
                    _c.label = 4;
                case 4: return [4 /*yield*/, reader_5.next()];
                case 5:
                    if (!(reader_5_1 = _c.sent(), !reader_5_1.done)) return [3 /*break*/, 8];
                    line1 = reader_5_1.value;
                    line = line1;
                    lineNum += 1;
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                        reverted = false;
                    }
                    if (!(line.includes(originalLabel) && !reverted)) return [3 /*break*/, 7];
                    return [4 /*yield*/, revertSettings(inputFileFullPath, lineNum.toString())];
                case 6:
                    _c.sent();
                    reverted = true;
                    _c.label = 7;
                case 7: return [3 /*break*/, 4];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_6_1 = _c.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _c.trys.push([10, , 13, 14]);
                    if (!(reader_5_1 && !reader_5_1.done && (_a = reader_5.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _a.call(reader_5)];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_6) throw e_6.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15:
                    _i++;
                    return [3 /*break*/, 2];
                case 16: return [2 /*return*/];
            }
        });
    });
}
// check
function check(checkingFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, inputFileFullPath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0;
                    return [4 /*yield*/, listUpFilePaths(checkingFilePath)];
                case 1:
                    _a = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    inputFileFullPath = _a[_i];
                    return [4 /*yield*/, checkRoutine(false, inputFileFullPath)];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// listUpFilePaths
function listUpFilePaths(checkingFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var targetFolders, currentFolder, inputFileFullPaths, notFoundPaths, _i, targetFolders_2, folder, targetFolderFullPath, inputFileFullPath, _loop_2, _a, targetFolders_3, folder;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, lib.parseCSVColumns(exports.programOptions.folder)];
                case 1:
                    targetFolders = _b.sent();
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
                    return [3 /*break*/, 7];
                case 2:
                    _loop_2 = function (folder) {
                        var _c, targetFolderFullPath, wildcard, scanedPaths;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _c = lib.getGlobbyParameters(folder, currentFolder), targetFolderFullPath = _c.targetFolderFullPath, wildcard = _c.wildcard;
                                    if (!fs.existsSync(targetFolderFullPath)) {
                                        throw new Error("Not found target folder at \"" + targetFolderFullPath + "\".");
                                    }
                                    process.chdir(targetFolderFullPath);
                                    return [4 /*yield*/, globby(["**/" + wildcard])];
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
                    _b.label = 3;
                case 3:
                    if (!(_a < targetFolders_3.length)) return [3 /*break*/, 6];
                    folder = targetFolders_3[_a];
                    return [5 /*yield**/, _loop_2(folder)];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _a++;
                    return [3 /*break*/, 3];
                case 6:
                    process.chdir(currentFolder);
                    _b.label = 7;
                case 7: return [2 /*return*/, inputFileFullPaths];
            }
        });
    });
}
// makeReplaceSettingsFromToTags
function makeReplaceSettingsFromToTags(inputFilePath) {
    var e_7, _a;
    return __awaiter(this, void 0, void 0, function () {
        var reader, lineNum, isReadingSetting, setting, settingCount, settingIndentLength, key, previousTemplateTag, replaceKeyValues, errorCount, replaceKeyValuesSet, parser, reader_6, reader_6_1, line1, line, separator, keyOrNot, value, toLabelIndex, toValue, toValue, toValue, templateTag, hasTestTag, newKeyValues, _i, _b, _c, key_, newValue, _d, _e, _f, key_, newValue, e_7_1;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFilePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    isReadingSetting = false;
                    setting = {};
                    settingCount = 0;
                    settingIndentLength = 0;
                    key = '';
                    previousTemplateTag = null;
                    replaceKeyValues = new ReplaceKeyValues();
                    errorCount = 0;
                    replaceKeyValuesSet = [];
                    parser = new Parser();
                    parser.command = CommandEnum.replace;
                    parser.verbose = ('verbose' in exports.programOptions);
                    parser.filePath = inputFilePath;
                    if (parser.verbose) {
                        console.log("Verbose: makeReplaceSettingsFromToTags:");
                    }
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 8, 9, 14]);
                    reader_6 = __asyncValues(reader);
                    _g.label = 2;
                case 2: return [4 /*yield*/, reader_6.next()];
                case 3:
                    if (!(reader_6_1 = _g.sent(), !reader_6_1.done)) return [3 /*break*/, 7];
                    line1 = reader_6_1.value;
                    line = line1;
                    lineNum += 1;
                    // setting = ...
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                        isReadingSetting = true;
                        setting = {};
                        settingCount += 1;
                        settingIndentLength = indentRegularExpression.exec(line)[0].length;
                        previousTemplateTag = null;
                        replaceKeyValues = new ReplaceKeyValues();
                        replaceKeyValues.settingNameOrLineNum = lineNum.toString();
                        replaceKeyValuesSet.push(replaceKeyValues);
                    }
                    else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                        isReadingSetting = false;
                        key = '';
                    }
                    if (isReadingSetting) {
                        separator = line.indexOf(':');
                        if (separator !== notFound) {
                            keyOrNot = line.substr(0, separator).trim();
                            if (keyOrNot[0] !== '#') {
                                key = keyOrNot;
                                value = getValue(line, separator);
                                setting[key] = { value: value, isReferenced: false, lineNum: [lineNum] };
                            }
                        }
                    }
                    toLabelIndex = line.indexOf(toLabel);
                    if (toLabelIndex !== notFound) {
                        toValue = getValue(line, toLabelIndex + toLabel.length - 1);
                    }
                    else {
                        toLabelIndex = line.indexOf(toTestLabel);
                        if (toLabelIndex !== notFound) {
                            toValue = getValue(line, toLabelIndex + toTestLabel.length - 1);
                        }
                        else {
                            toValue = '';
                        }
                    }
                    templateTag = parseTemplateTag(line, parser);
                    if (templateTag.isFound) {
                        previousTemplateTag = templateTag;
                    }
                    if (!toValue) return [3 /*break*/, 6];
                    hasTestTag = (line.indexOf(toTestLabel) !== notFound);
                    if (hasTestTag) {
                        replaceKeyValues.testMode = true;
                    }
                    if (!isReadingSetting) return [3 /*break*/, 4];
                    if (parser.verbose || hasTestTag) {
                        console.log("Verbose:     " + getTestablePath(inputFilePath) + ":" + lineNum + ":");
                        console.log("Verbose:         " + key + ": " + toValue);
                    }
                    replaceKeyValues.pushKeyValue(key, {
                        value: toValue,
                        lineNum: [lineNum],
                    });
                    return [3 /*break*/, 6];
                case 4:
                    if (!previousTemplateTag) return [3 /*break*/, 6];
                    if (parser.verbose || hasTestTag) {
                        console.log("Verbose:     " + getTestablePath(inputFilePath) + ":" + lineNum + ":");
                    }
                    return [4 /*yield*/, previousTemplateTag.scanKeyValues(toValue, Object.keys(setting), lineNum, parser, hasTestTag)];
                case 5:
                    newKeyValues = _g.sent();
                    errorCount += checkNoConfilict(replaceKeyValues.keyValues, newKeyValues, inputFilePath);
                    if (parser.verbose || hasTestTag) {
                        for (_i = 0, _b = Object.entries(newKeyValues); _i < _b.length; _i++) {
                            _c = _b[_i], key_ = _c[0], newValue = _c[1];
                            console.log("Verbose:         " + key_ + ": " + newValue.value);
                        }
                    }
                    for (_d = 0, _e = Object.entries(newKeyValues); _d < _e.length; _d++) {
                        _f = _e[_d], key_ = _f[0], newValue = _f[1];
                        replaceKeyValues.pushKeyValue(key_, newValue);
                    }
                    previousTemplateTag = null;
                    _g.label = 6;
                case 6: return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_7_1 = _g.sent();
                    e_7 = { error: e_7_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _g.trys.push([9, , 12, 13]);
                    if (!(reader_6_1 && !reader_6_1.done && (_a = reader_6.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(reader_6)];
                case 10:
                    _g.sent();
                    _g.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_7) throw e_7.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14:
                    if (errorCount >= 1) {
                        replaceKeyValuesSet = [];
                    }
                    else {
                        replaceKeyValuesSet = replaceKeyValuesSet.filter(function (replaceKeyValues) { return (Object.keys(replaceKeyValues.keyValues).length >= 1); });
                    }
                    return [2 /*return*/, replaceKeyValuesSet];
            }
        });
    });
}
// checkNoConfilict
function checkNoConfilict(keyValueA, keyValueB, filePath) {
    var commonKeys = lib.getCommonElements(Object.keys(keyValueA), Object.keys(keyValueB));
    var errorCount = 0;
    for (var _i = 0, commonKeys_1 = commonKeys; _i < commonKeys_1.length; _i++) {
        var key = commonKeys_1[_i];
        if (keyValueA[key].value !== keyValueB[key].value) {
            console.log('');
            console.log('Error of conflict #to: tag:');
            console.log("    key: " + key);
            console.log("    valueA: " + keyValueA[key].value + " in " + getTestablePath(filePath) + ":" + keyValueA[key].lineNum);
            console.log("    valueB: " + keyValueB[key].value + " in " + getTestablePath(filePath) + ":" + keyValueB[key].lineNum);
            errorCount += 1;
        }
    }
    return errorCount;
}
// search
function search() {
    return __awaiter(this, void 0, void 0, function () {
        var startIndex, keyword, cSearch, cPrintRef, cRunVerb, lastWord, hasVerb, command, keywordWithoutVerb, ref, previousPrint, prompt, prompt, keyword_1, command, verbNumber;
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
                    return [4 /*yield*/, searchSub(keyword, false)];
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
                    keywordWithoutVerb = exports.programArguments.slice(startIndex, exports.programArguments.length - 1).join(' ');
                    return [4 /*yield*/, printRef(keywordWithoutVerb, { print: false })];
                case 5:
                    ref = _a.sent();
                    runVerb(ref.verbs, ref.address, ref.addressLineNum, lastWord);
                    _a.label = 6;
                case 6: return [3 /*break*/, 19];
                case 7:
                    lib.inputSkip(startIndex);
                    previousPrint = getEmptyOfPrintRefResult();
                    _a.label = 8;
                case 8:
                    prompt = 'keyword:';
                    if (previousPrint.hasVerbMenu) {
                        prompt = 'keyword or number:';
                    }
                    return [4 /*yield*/, lib.input(chalk.yellow(prompt) + ' ')];
                case 9:
                    keyword_1 = _a.sent();
                    if (!(keyword_1 === 'exit()')) return [3 /*break*/, 10];
                    return [3 /*break*/, 19];
                case 10:
                    if (!(keyword_1 === '')) return [3 /*break*/, 13];
                    if (!previousPrint.hasFindMenu) return [3 /*break*/, 12];
                    return [4 /*yield*/, findSub(previousPrint.previousKeyword)];
                case 11:
                    _a.sent();
                    _a.label = 12;
                case 12:
                    previousPrint.hasVerbMenu = false;
                    previousPrint.hasFindMenu = false;
                    return [3 /*break*/, 18];
                case 13:
                    command = cSearch;
                    if (previousPrint.hasVerbMenu && numberRegularExpression.test(keyword_1)) {
                        command = cRunVerb;
                    }
                    else if (hasRefTag(keyword_1)) {
                        command = cPrintRef;
                    }
                    if (!(command === cSearch)) return [3 /*break*/, 15];
                    return [4 /*yield*/, searchSub(keyword_1, false)];
                case 14:
                    previousPrint = _a.sent();
                    if (previousPrint.hasFindMenu) {
                        console.log(translate(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Not found. To do full text search, press Enter key."], ["Not found. To do full text search, press Enter key."]))));
                    }
                    return [3 /*break*/, 18];
                case 15:
                    if (!(command === cPrintRef)) return [3 /*break*/, 17];
                    return [4 /*yield*/, printRef(keyword_1)];
                case 16:
                    previousPrint = _a.sent();
                    return [3 /*break*/, 18];
                case 17:
                    if (command === cRunVerb) {
                        verbNumber = keyword_1;
                        runVerb(previousPrint.verbs, previousPrint.address, previousPrint.addressLineNum, verbNumber);
                    }
                    _a.label = 18;
                case 18: return [3 /*break*/, 8];
                case 19: return [2 /*return*/];
            }
        });
    });
}
// searchSub
function searchSub(keyword, isMutual) {
    var e_8, _a;
    return __awaiter(this, void 0, void 0, function () {
        var _i, ignoredKeywords_1, ignoredKeyword, currentFolder, fileFullPaths, targetFolders, _loop_3, _b, targetFolders_4, folder, thesaurus, glossaryTags, foundLines, thesaurusFilePath, _loop_4, lineNum, label, indexOfLabel, labelLength, label, indexOfLabel, labelLength, csv, withParameter, withParameter, positionOfCSV, positionOfCSV, glossaryTag, glossaryWords, _c, fileFullPaths_1, inputFileFullPath, keyphraseWordCount, _d, foundLines_1, foundLineInformation, foundLine, refTagPosition, nextTagPosition, refTagAndAddress, refTagAndAddress, normalReturn;
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
                    return [4 /*yield*/, lib.parseCSVColumns(exports.programOptions.folder)];
                case 1:
                    targetFolders = _e.sent();
                    _loop_3 = function (folder) {
                        var _f, targetFolderFullPath, wildcard, scanedPaths;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    _f = lib.getGlobbyParameters(folder, currentFolder), targetFolderFullPath = _f.targetFolderFullPath, wildcard = _f.wildcard;
                                    if (!fs.existsSync(targetFolderFullPath)) {
                                        throw new Error("Not found target folder at \"" + targetFolderFullPath + "\".");
                                    }
                                    process.chdir(targetFolderFullPath);
                                    return [4 /*yield*/, globby(["**/" + wildcard])];
                                case 1:
                                    scanedPaths = _g.sent();
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
                    thesaurus = new Thesaurus();
                    glossaryTags = [];
                    foundLines = [];
                    if (!('thesaurus' in exports.programOptions)) return [3 /*break*/, 7];
                    thesaurusFilePath = exports.programOptions.thesaurus;
                    if (!fs.existsSync(thesaurusFilePath)) {
                        throw new Error("not found the thesaurus file \"" + lib.getFullPath(thesaurusFilePath, process.cwd()) + "\"");
                    }
                    return [4 /*yield*/, thesaurus.load(thesaurusFilePath)];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    _loop_4 = function (inputFileFullPath) {
                        var reader, blockDisable, reader_7, reader_7_1, line1, line, indexOfKeywordLabel, indexOfSearchLabelIfMutual, columns, found, unescapedLine, columnPositions, _h, _j, match, currentIndent, characterAtIndent, isGlossaryIndentLevel, isComment, colonPosition, wordInGlossary, found, _k, _l, match, _m, _o, match, e_8_1;
                        return __generator(this, function (_p) {
                            switch (_p.label) {
                                case 0:
                                    reader = readline.createInterface({
                                        input: fs.createReadStream(inputFileFullPath),
                                        crlfDelay: Infinity
                                    });
                                    blockDisable = new BlockDisableTagParser();
                                    lineNum = 0;
                                    _p.label = 1;
                                case 1:
                                    _p.trys.push([1, 8, 9, 14]);
                                    reader_7 = (e_8 = void 0, __asyncValues(reader));
                                    _p.label = 2;
                                case 2: return [4 /*yield*/, reader_7.next()];
                                case 3:
                                    if (!(reader_7_1 = _p.sent(), !reader_7_1.done)) return [3 /*break*/, 7];
                                    line1 = reader_7_1.value;
                                    line = line1;
                                    lineNum += 1;
                                    blockDisable.evaluate(line);
                                    indexOfKeywordLabel = line.indexOf(keywordLabel);
                                    indexOfSearchLabelIfMutual = (isMutual) ? line.indexOf(searchLabel) : notFound;
                                    if (!((indexOfKeywordLabel !== notFound || indexOfSearchLabelIfMutual !== notFound)
                                        && !line.includes(disableLabel) && !blockDisable.isInBlock)) return [3 /*break*/, 5];
                                    if (indexOfKeywordLabel !== notFound) {
                                        label = keywordLabel;
                                        indexOfLabel = indexOfKeywordLabel;
                                        labelLength = keywordLabel.length;
                                    }
                                    else {
                                        label = searchLabel;
                                        indexOfLabel = indexOfSearchLabelIfMutual;
                                        labelLength = searchLabel.length;
                                    }
                                    csv = getValue(line, indexOfLabel + labelLength);
                                    if (csv !== '') {
                                        withParameter = true;
                                    }
                                    else {
                                        withParameter = false;
                                        csv = parseKeyName(line);
                                    }
                                    return [4 /*yield*/, lib.parseCSVColumns(csv)
                                            .catch(function (e) {
                                            console.log("Warning: " + e.message + " in " + inputFileFullPath + ":" + lineNum + ": " + line);
                                            return [];
                                        })];
                                case 4:
                                    columns = _p.sent();
                                    found = getKeywordMatchingScore(columns, keyword, thesaurus);
                                    if (found.matchedKeywordCount >= 1) {
                                        unescapedLine = unscapePercentByte(line);
                                        if (withParameter) {
                                            positionOfCSV = unescapedLine.indexOf(csv, unescapedLine.indexOf(label) + labelLength);
                                        }
                                        else {
                                            positionOfCSV = unescapedLine.indexOf(csv);
                                        }
                                        columnPositions = lib.parseCSVColumnPositions(csv, columns);
                                        found.score += keywordMatchScore;
                                        found.path = getTestablePath(inputFileFullPath);
                                        found.lineNum = lineNum;
                                        found.line = unescapedLine;
                                        found.tagLabel = label;
                                        for (_h = 0, _j = found.matches; _h < _j.length; _h++) {
                                            match = _j[_h];
                                            match.position += positionOfCSV + columnPositions[match.testTargetIndex];
                                        }
                                        foundLines.push(found);
                                    }
                                    _p.label = 5;
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
                                        if (line.includes(glossaryLabel) && !line.includes(disableLabel) && !blockDisable.isInBlock) {
                                            glossaryWords = getValue(line, line.indexOf(glossaryLabel) + glossaryLabel.length);
                                            if (glossaryWords !== '') {
                                                glossaryWords += ' '; // ' ' is a word separator
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
                                                found = getKeywordMatchingScore([wordInGlossary], keyword, thesaurus);
                                                if (found.matchedKeywordCount >= 1 && colonPosition !== notFound) {
                                                    found.score += glossaryMatchScore;
                                                    found.path = getTestablePath(inputFileFullPath);
                                                    found.lineNum = lineNum;
                                                    found.tagLabel = glossaryLabel;
                                                    if (glossaryTag.glossaryWords === '') {
                                                        found.line = line;
                                                        for (_k = 0, _l = found.matches; _k < _l.length; _k++) {
                                                            match = _l[_k];
                                                            match.position += glossaryTag.indentPosition;
                                                        }
                                                    }
                                                    else {
                                                        found.line = glossaryTag.glossaryWords.trim() + ':' + line;
                                                        for (_m = 0, _o = found.matches; _m < _o.length; _m++) {
                                                            match = _o[_m];
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
                                    _p.label = 6;
                                case 6: return [3 /*break*/, 2];
                                case 7: return [3 /*break*/, 14];
                                case 8:
                                    e_8_1 = _p.sent();
                                    e_8 = { error: e_8_1 };
                                    return [3 /*break*/, 14];
                                case 9:
                                    _p.trys.push([9, , 12, 13]);
                                    if (!(reader_7_1 && !reader_7_1.done && (_a = reader_7.return))) return [3 /*break*/, 11];
                                    return [4 /*yield*/, _a.call(reader_7)];
                                case 10:
                                    _p.sent();
                                    _p.label = 11;
                                case 11: return [3 /*break*/, 13];
                                case 12:
                                    if (e_8) throw e_8.error;
                                    return [7 /*endfinally*/];
                                case 13: return [7 /*endfinally*/];
                                case 14: return [2 /*return*/];
                            }
                        });
                    };
                    _c = 0, fileFullPaths_1 = fileFullPaths;
                    _e.label = 8;
                case 8:
                    if (!(_c < fileFullPaths_1.length)) return [3 /*break*/, 11];
                    inputFileFullPath = fileFullPaths_1[_c];
                    return [5 /*yield**/, _loop_4(inputFileFullPath)];
                case 9:
                    _e.sent();
                    _e.label = 10;
                case 10:
                    _c++;
                    return [3 /*break*/, 8];
                case 11:
                    keyphraseWordCount = keyword.split(' ').length;
                    foundLines = foundLines.filter(function (found) { return (found.matchedKeywordCount >= keyphraseWordCount); });
                    foundLines.sort(compareScore);
                    for (_d = 0, foundLines_1 = foundLines; _d < foundLines_1.length; _d++) {
                        foundLineInformation = foundLines_1[_d];
                        console.log(foundLineInformation.toString());
                    }
                    if (!(foundLines.length >= 1 && lastOf(foundLines).line.includes(refLabel))) return [3 /*break*/, 13];
                    foundLine = lastOf(foundLines).line;
                    refTagPosition = foundLine.indexOf(refLabel);
                    nextTagPosition = foundLine.indexOf(' #', refTagPosition + 1);
                    if (nextTagPosition === notFound) {
                        refTagAndAddress = foundLine.substr(refTagPosition);
                    }
                    else {
                        refTagAndAddress = foundLine.substr(refTagPosition, nextTagPosition - refTagPosition);
                    }
                    return [4 /*yield*/, printRef(refTagAndAddress)];
                case 12: return [2 /*return*/, _e.sent()];
                case 13:
                    normalReturn = getEmptyOfPrintRefResult();
                    if (foundLines.length === 0) {
                        normalReturn.previousKeyword = keyword;
                        normalReturn.hasFindMenu = true;
                    }
                    return [2 /*return*/, normalReturn];
            }
        });
    });
}
// getKeywordMatchingScore
function getKeywordMatchingScore(testingStrings, keyphrase, thesaurus) {
    function subMain() {
        var bestFound = testingStrings.reduce(function (bestFound, aTestingString, stringIndex) {
            var keywords = keyphrase.split(' ');
            var found = new FoundLine();
            var previousPosition = -1;
            var wordPositions = new WordPositions();
            wordPositions.setPhrase(aTestingString);
            var matchedCountsByWord = new Array(wordPositions.length).fill(0);
            for (var _i = 0, keywords_3 = keywords; _i < keywords_3.length; _i++) {
                var keyword = keywords_3[_i];
                if (keyword === '') {
                    continue;
                }
                var result = getSubMatchedScore(aTestingString, keyword, keyword.toLowerCase(), stringIndex, found);
                if (result.score !== 0) {
                    if (result.position > previousPosition) {
                        found.score += result.score + orderMatchScoreWeight;
                    }
                    else {
                        found.score += result.score;
                    }
                    found.score += notNormalizedScore;
                    found.matchedKeywordCount += 1;
                }
                if (result.position !== notFound) {
                    matchedCountsByWord[wordPositions.getWordIndex(result.position)] += 1;
                    previousPosition = result.position;
                }
                var useThesaurus = (result.score === 0 && result.position === notFound && thesaurus.enabled);
                if (useThesaurus) {
                    var normalizedTestingString = thesaurus.normalize(aTestingString);
                    var normalizedKeyword = thesaurus.normalize(keyword);
                    var result_1 = getSubMatchedScore(normalizedTestingString, normalizedKeyword, normalizedKeyword.toLowerCase(), stringIndex, found);
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
            }
            if (found.matchedKeywordCount < keywords.length) {
                found.score = 0;
            }
            if (found.score !== 0) {
                found.score += 2 * (keyphrase.length - aTestingString.length); // 2 is double score from the score of different (upper/loser) case
                found.testedWordCount = aTestingString.split(' ').length;
                found.matchedTargetKeywordCount = matchedCountsByWord.filter(function (count) { return (count >= 1); }).length;
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
            matched.matchedString = testingString.substr(position, matched.length);
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
// find
function find() {
    return __awaiter(this, void 0, void 0, function () {
        var keyword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keyword = exports.programArguments.slice(1).join(' ');
                    if (!(keyword === '')) return [3 /*break*/, 1];
                    search();
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, findSub(keyword)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
// findSub
function findSub(keyword) {
    var e_9, _a;
    return __awaiter(this, void 0, void 0, function () {
        var keywordLowerCase, _i, _b, inputFileFullPath, reader, lineNum, reader_8, reader_8_1, line1, line, keywordIndex, e_9_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    keywordLowerCase = keyword.toLowerCase();
                    _i = 0;
                    return [4 /*yield*/, listUpFilePaths()];
                case 1:
                    _b = _c.sent();
                    _c.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 15];
                    inputFileFullPath = _b[_i];
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFileFullPath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 8, 9, 14]);
                    reader_8 = (e_9 = void 0, __asyncValues(reader));
                    _c.label = 4;
                case 4: return [4 /*yield*/, reader_8.next()];
                case 5:
                    if (!(reader_8_1 = _c.sent(), !reader_8_1.done)) return [3 /*break*/, 7];
                    line1 = reader_8_1.value;
                    line = line1;
                    lineNum += 1;
                    keywordIndex = line.toLowerCase().indexOf(keywordLowerCase);
                    if (keywordIndex !== notFound) {
                        console.log("" + pathColor(getTestablePath(inputFileFullPath)) + lineNumColor(":" + lineNum + ":") + " " +
                            line.substr(0, keywordIndex) +
                            matchedColor(line.substr(keywordIndex, keyword.length)) +
                            line.substr(keywordIndex + keyword.length));
                    }
                    _c.label = 6;
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_9_1 = _c.sent();
                    e_9 = { error: e_9_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _c.trys.push([9, , 12, 13]);
                    if (!(reader_8_1 && !reader_8_1.done && (_a = reader_8.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(reader_8)];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_9) throw e_9.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14:
                    _i++;
                    return [3 /*break*/, 2];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// mutualSearch
function mutualSearch() {
    return __awaiter(this, void 0, void 0, function () {
        var keyword;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keyword = exports.programArguments.slice(1).join(' ');
                    return [4 /*yield*/, searchSub(keyword, true)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// lookUpVariable
function lookUpVariable(variableName, inputFilePath, referenceLineNum) {
    var e_10, _a;
    return __awaiter(this, void 0, void 0, function () {
        var valueColor, _i, _b, inputFileFullPath, reader, lineNum, isReferenceFound, isReadingSetting, settingIndentLength, foundLine, reader_9, reader_9_1, line1, line, separator, keyOrNot, key, value, valueIndex, e_10_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    valueColor = chalk.yellow;
                    _i = 0;
                    return [4 /*yield*/, listUpFilePaths(inputFilePath)];
                case 1:
                    _b = _c.sent();
                    _c.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 15];
                    inputFileFullPath = _b[_i];
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFileFullPath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    isReferenceFound = false;
                    isReadingSetting = false;
                    settingIndentLength = 0;
                    foundLine = '';
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 8, 9, 14]);
                    reader_9 = (e_10 = void 0, __asyncValues(reader));
                    _c.label = 4;
                case 4: return [4 /*yield*/, reader_9.next()];
                case 5:
                    if (!(reader_9_1 = _c.sent(), !reader_9_1.done)) return [3 /*break*/, 7];
                    line1 = reader_9_1.value;
                    line = line1;
                    lineNum += 1;
                    // setting = ...
                    if (settingStartLabel.test(line.trim()) || settingStartLabelEn.test(line.trim())) {
                        isReadingSetting = true;
                        settingIndentLength = indentRegularExpression.exec(line)[0].length;
                        foundLine = '';
                    }
                    else if (indentRegularExpression.exec(line)[0].length <= settingIndentLength && isReadingSetting) {
                        isReadingSetting = false;
                        isReferenceFound = false;
                    }
                    if (isReadingSetting) {
                        separator = line.indexOf(':');
                        if (separator !== notFound) {
                            keyOrNot = line.substr(0, separator).trim();
                            if (keyOrNot[0] !== '#') {
                                key = keyOrNot;
                                if (key === variableName) {
                                    value = getValue(line, separator);
                                    valueIndex = line.indexOf(value, separator);
                                    foundLine = "" + pathColor(getTestablePath(inputFileFullPath)) + lineNumColor(":" + lineNum + ":") + " " +
                                        line.substr(0, valueIndex) + valueColor(value) + line.substr(valueIndex + value.length);
                                    if (referenceLineNum === 0 || isReferenceFound) {
                                        console.log(foundLine);
                                    }
                                }
                            }
                        }
                    }
                    if (lineNum === referenceLineNum) {
                        if (foundLine) {
                            console.log(foundLine);
                        }
                        else if (isReadingSetting) {
                            isReferenceFound = true;
                        }
                    }
                    _c.label = 6;
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_10_1 = _c.sent();
                    e_10 = { error: e_10_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _c.trys.push([9, , 12, 13]);
                    if (!(reader_9_1 && !reader_9_1.done && (_a = reader_9.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(reader_9)];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_10) throw e_10.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14:
                    _i++;
                    return [3 /*break*/, 2];
                case 15: return [2 /*return*/];
            }
        });
    });
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
        addressLineNum: 0,
        hasFindMenu: false,
        previousKeyword: '',
    };
}
// printRef
function printRef(refTagAndAddress, option) {
    if (option === void 0) { option = printRefOptionDefault; }
    return __awaiter(this, void 0, void 0, function () {
        var addressBefore, variableRe, variables, variable, address, _loop_5, _i, _a, variable, linkableAddress, addressLineNum, getter, _b, filePath, lineNum, recommended, lowerCaseDriveRegExp, upperCaseDriveRegExp, sortedEnvronmentVariables, reservedNames, _c, _d, _e, envName, envValue, variableName, value, _f, sortedEnvronmentVariables_1, variable, verbs, verbMenu, verbs, verbMenu;
        return __generator(this, function (_g) {
            switch (_g.label) {
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
                                var variableRegExp = new RegExp('\\\\?' + lib.escapeRegularExpression(variable), 'g');
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
                    addressLineNum = 0;
                    getter = getRelatedLineNumGetter(address);
                    if (!(getter.type === 'text')) return [3 /*break*/, 2];
                    return [4 /*yield*/, searchAsText(getter, address)];
                case 1:
                    _b = _g.sent(), filePath = _b.filePath, lineNum = _b.lineNum;
                    linkableAddress = getter.address
                        .replace(verbVar.file, filePath.replace(/\\/g, '/'))
                        .replace(verbVar.windowsFile, filePath.replace(/\//g, '\\'))
                        .replace(verbVar.fragment, '')
                        .replace(verbVar.lineNum, lineNum.toString());
                    // This format is hyperlinkable in the Visual Studio Code Terminal
                    addressLineNum = lineNum;
                    _g.label = 2;
                case 2:
                    recommended = address;
                    recommended = recommended.replace(/\$/g, '\\$');
                    lowerCaseDriveRegExp = /^[a-z]:/;
                    upperCaseDriveRegExp = /^[A-Z]:/;
                    sortedEnvronmentVariables = [];
                    reservedNames = ['TYPRM_FOLDER'];
                    for (_c = 0, _d = Object.entries(process.env); _c < _d.length; _c++) {
                        _e = _d[_c], envName = _e[0], envValue = _e[1];
                        if (envName.startsWith(typrmEnvPrefix) && !reservedNames.includes(envName) && envValue) {
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
                    for (_f = 0, sortedEnvronmentVariables_1 = sortedEnvronmentVariables; _f < sortedEnvronmentVariables_1.length; _f++) {
                        variable = sortedEnvronmentVariables_1[_f];
                        recommended = recommended.replace(new RegExp(lib.escapeRegularExpression(variable.value.replace('\\', '\\\\')), 'g'), '${' + variable.key + '}'); // Change the address to an address with variables
                    }
                    if (recommended.replace(/\\/g, '/').startsWith(lib.getHomePath().replace(/\\/g, '/'))) {
                        recommended = '~' + recommended.substr(lib.getHomePath().length);
                    }
                    // print the address
                    if (option.print && addressLineNum !== notFound) {
                        if (recommended !== addressBefore) {
                            console.log('Recommend: #ref: ' + recommended);
                        }
                        console.log(linkableAddress);
                    }
                    // print the verb menu
                    if (addressLineNum !== notFound) {
                        verbs = getRelatedVerbs(address);
                        verbMenu = verbs.map(function (verb) { return (verb.label); }).join(', ');
                        if (verbMenu !== '' && option.print) {
                            console.log('    ' + verbMenu);
                        }
                    }
                    else {
                        verbs = [];
                        verbMenu = '';
                    }
                    return [2 /*return*/, {
                            hasVerbMenu: (verbMenu !== ''),
                            verbs: verbs,
                            address: address,
                            addressLineNum: addressLineNum,
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
function runVerb(verbs, address, lineNum, verbNum) {
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
                .replace(verbVar.fragment, '')
                .replace(verbVar.lineNum, lineNum.toString());
            var fileOrFolderPath = address;
        }
        else {
            command = verb.command
                .replace(verbVar.ref, address)
                .replace(verbVar.windowsRef, address.substr(0, fragmentIndex).replace(/\//g, '\\') + address.substr(fragmentIndex))
                .replace(verbVar.file, address.substr(0, fragmentIndex))
                .replace(verbVar.windowsFile, address.substr(0, fragmentIndex).replace(/\//g, '\\'))
                .replace(verbVar.fragment, address.substr(fragmentIndex + 1))
                .replace(verbVar.lineNum, lineNum.toString());
            var fileOrFolderPath = address.substr(0, fragmentIndex);
        }
        if (runningOS === 'Windows') {
            fileOrFolderPath = fileOrFolderPath.replace(/\//g, '\\');
        }
        fileOrFolderPath = lib.getFullPath(fileOrFolderPath, process.cwd());
        if (!fs.existsSync(fileOrFolderPath)) {
            console.log(translate(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Error of not found the file or folder at \"", "\""], ["Error of not found the file or folder at \"", "\""])), getTestablePath(fileOrFolderPath)));
            return;
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
        console.log(translate(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Error that verb number ", " is not defined"], ["Error that verb number ", " is not defined"])), verbNum));
    }
}
// printConfig
function printConfig() {
    if ('folder' in exports.programOptions) {
        console.log("Verbose: --folder, TYPRM_FOLDER: " + exports.programOptions.folder);
    }
    if ('thesaurus' in exports.programOptions) {
        console.log("Verbose: --thesaurus, TYPRM_THESAURUS: " + exports.programOptions.thesaurus);
    }
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
                console.log("Verbose:     csvOptionRegularExpressionIndex: " + getter.csvOptionRegularExpressionIndex);
                console.log("Verbose:     targetMatchIdRegularExpressionIndex: " + getter.targetMatchIdRegularExpressionIndex);
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
// varidateMutualSearchCommandArguments
function varidateMutualSearchCommandArguments() {
    if (exports.programArguments.length < 2) {
        throw new Error('Error: Too few argurments.\n' +
            'typrm mutual-search  __Keywords__"');
    }
}
// varidateUpdateCommandArguments
function varidateReplaceCommandArguments() {
    if (exports.programArguments.length < 2) {
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
function onEndOfSettingScope(setting, inputFilePath) {
    for (var _i = 0, _a = Object.keys(setting); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!setting[key].isReferenced) {
            console.log(translate(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Error: ", " ", ""], ["Error: ", " ", ""])), getTestablePath(inputFilePath), setting[key].lineNum));
            console.log(translate(templateObject_10 || (templateObject_10 = __makeTemplateObject(["  Not referenced: ", ""], ["  Not referenced: ", ""])), key));
        }
    }
}
// evaluateIfCondition
function evaluateIfCondition(expression, setting, parser, previsousEvalatedKeyValues) {
    if (previsousEvalatedKeyValues === void 0) { previsousEvalatedKeyValues = []; }
    if (expression === 'true') {
        if (parser.verbose) {
            console.log("Verbose: " + getTestablePath(parser.filePath) + ":" + parser.lineNum + ": #if: true");
        }
        return true;
    }
    else if (expression === 'false') {
        if (parser.verbose) {
            console.log("Verbose: " + getTestablePath(parser.filePath) + ":" + parser.lineNum + ": #if: false");
        }
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
            if (previsousEvalatedKeyValues.length === 0) {
                if (parser.verbose) {
                    if (parser.command == CommandEnum.replace) {
                        console.log("Verbose: " + getTestablePath(parser.filePath) + ":" + parser.lineNum + ": skipped evaluation: #if: " + expression);
                    }
                    else if (parser.command == CommandEnum.check) {
                        console.log("Verbose: " + getTestablePath(parser.filePath) + ":" + parser.lineNum + ": #if: " + expression + "  (" + result + ", " + name_1 + " = " + leftValue + ")");
                    }
                }
                return result;
            }
            else {
                var isReplacable = previsousEvalatedKeyValues.includes(name_1) || parent !== settingsDot;
                if (parser.verbose) {
                    if (!isReplacable) {
                        console.log("Verbose: " + getTestablePath(parser.filePath) + ":" + parser.lineNum + ": skipped evaluation: #if: " + expression);
                    }
                    else {
                        console.log("Verbose: " + getTestablePath(parser.filePath) + ":" + parser.lineNum + ": #if: " + expression + "  (" + result + ", " + name_1 + " = " + leftValue + ")");
                    }
                }
                return {
                    result: result,
                    isReplacable: isReplacable,
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
    var e_11, _a;
    return __awaiter(this, void 0, void 0, function () {
        var reader, settingCount, lineNum, breaking, isFound, exception, targetLineNum, targetSettingName, isOneSetting, reader_10, reader_10_1, line1, line, currentSettingName, e_11_1, settingIndex;
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
                    reader_10 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_10.next()];
                case 3:
                    if (!(reader_10_1 = _b.sent(), !reader_10_1.done)) return [3 /*break*/, 5];
                    line1 = reader_10_1.value;
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
                    e_11_1 = _b.sent();
                    e_11 = { error: e_11_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(reader_10_1 && !reader_10_1.done && (_a = reader_10.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_10)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_11) throw e_11.error;
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
        else if (path_.startsWith(inputFileParentPath + path.sep) && inputFileParentPath !== '') {
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
        var re = new RegExp(lib.escapeRegularExpression(key), "gi");
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
        replacedSetting[key] = { value: value, lineNum: [] /*dummy*/, isReferenced: true /*dummy*/ };
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
    if (value[0] === '#') {
        var comment = 0;
    }
    else {
        var comment = value.indexOf(' #');
    }
    if (comment !== notFound) {
        value = value.substr(0, comment).trim();
    }
    value = unscapePercentByte(value);
    return value;
}
// unscapePercentByte
function unscapePercentByte(value) {
    var found = 0;
    for (;;) {
        var found20 = value.indexOf('"%20"', found);
        var found25 = value.indexOf('"%25"', found);
        if (found20 !== notFound) {
            if (found25 !== notFound) {
                if (found20 < found25) {
                    value = value.replace('"%20"', ' ');
                    found = found20 + 1;
                }
                else {
                    value = value.replace('"%25"', '%');
                    found = found25 + 1;
                }
            }
            else {
                value = value.replace('"%20"', ' ');
                found = found20 + 1;
            }
        }
        else {
            if (found25 !== notFound) {
                value = value.replace('"%25"', '%');
                found = found25 + 1;
            }
            else {
                break;
            }
        }
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
function parseTemplateTag(line, parser) {
    var tag = new TemplateTag(parser);
    tag.parseLine(line);
    return tag;
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
// CommandEnum
var CommandEnum;
(function (CommandEnum) {
    CommandEnum[CommandEnum["unknown"] = 0] = "unknown";
    CommandEnum[CommandEnum["check"] = 1] = "check";
    CommandEnum[CommandEnum["replace"] = 2] = "replace";
    CommandEnum[CommandEnum["search"] = 3] = "search";
})(CommandEnum || (CommandEnum = {}));
// ReplaceKeyValues
var ReplaceKeyValues = /** @class */ (function () {
    function ReplaceKeyValues() {
        this.settingNameOrLineNum = '';
        this.keyValues = {};
        this.testMode = false;
    }
    Object.defineProperty(ReplaceKeyValues.prototype, "keyValueLines", {
        get: function () {
            var lines = '';
            for (var _i = 0, _a = Object.entries(this.keyValues); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], setting = _b[1];
                lines += key + ": " + setting.value + "\n";
            }
            return lines;
        },
        enumerable: false,
        configurable: true
    });
    ReplaceKeyValues.prototype.pushKeyValue = function (key, keyValue) {
        if (!(key in this.keyValues)) {
            this.keyValues[key] = keyValue;
        }
        else {
            this.keyValues[key].lineNum.push(keyValue.lineNum[0]);
        }
    };
    return ReplaceKeyValues;
}());
// Thesaurus
var Thesaurus = /** @class */ (function () {
    function Thesaurus() {
        this.synonym = {}; // the value is the normalized word
    }
    Object.defineProperty(Thesaurus.prototype, "enabled", {
        get: function () { return Object.keys(this.synonym).length !== 0; },
        enumerable: false,
        configurable: true
    });
    Thesaurus.prototype.load = function (csvFilePath) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolveFunction, _rejectFunction) {
                    fs.createReadStream(csvFilePath)
                        .pipe(csvParse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',', relax_column_count: true }))
                        .on('data', function (columns) {
                        if (columns.length >= 1) {
                            var normalizedKeyword_1 = columns[0];
                            columns.shift();
                            var synonyms = columns;
                            synonyms.forEach(function (synonym) {
                                _this.synonym[synonym.toLowerCase()] = normalizedKeyword_1;
                            });
                        }
                    })
                        .on('end', function () {
                        resolveFunction();
                    });
                });
                return [2 /*return*/, promise];
            });
        });
    };
    Thesaurus.prototype.normalize = function (keyphrase) {
        var words = keyphrase.split(' ');
        for (var i = 0; i < words.length; i += 1) {
            var word = words[i].toLowerCase();
            if (word in this.synonym) {
                words[i] = this.synonym[word];
            }
        }
        var normalizedKeyphrase = words.join(' ');
        return normalizedKeyphrase;
    };
    return Thesaurus;
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
        this.tagLabel = ''; // keywordLabel, searchLabel
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
        if (this.tagLabel !== searchLabel) {
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
        }
        if (false) {
            var debugString = " (score: " + this.score + ", wordCount: " + this.testedWordCount + ", matchedCount: " + this.matchedTargetKeywordCount + ")";
        }
        else {
            var debugString = "";
        }
        // colored string
        return "" + pathColor(this.path) + lineNumColor(":" + this.lineNum + ":") + " " + coloredLine + debugString;
    };
    return FoundLine;
}());
// MatchedPart
var MatchedPart = /** @class */ (function () {
    function MatchedPart() {
        this.position = 0;
        this.length = 0;
        this.testTargetIndex = -1;
        this.matchedString = '';
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
function splitFilePathAndKeyword(address, getter) {
    var verboseMode = 'verbose' in exports.programOptions;
    if (verboseMode) {
        console.log("Verbose: Parsed by TYPRM_LINE_NUM_GETTER:");
        console.log("Verbose:     address: " + address);
        console.log("Verbose:     regularExpression: " + getter.regularExpression);
        console.log("Verbose:     filePathRegularExpressionIndex: " + getter.filePathRegularExpressionIndex);
        console.log("Verbose:     keywordRegularExpressionIndex: " + getter.keywordRegularExpressionIndex);
        console.log("Verbose:     csvOptionRegularExpressionIndex: " + getter.csvOptionRegularExpressionIndex);
        console.log("Verbose:     targetMatchIdRegularExpressionIndex: " + getter.targetMatchIdRegularExpressionIndex);
    }
    var parameters = (new RegExp(getter.regularExpression)).exec(address);
    if (!parameters) {
        throw new Error("ERROR: regularExpression (" + getter.regularExpression + ") of regularExpression " +
            ("\"" + getter.regularExpression + "\" in TYPRM_LINE_NUM_GETTER is not matched.") +
            ("testing string is \"" + address + "\"."));
    }
    if (verboseMode) {
        console.log("Verbose:     matched: [" + parameters.join(', ') + "]");
    }
    if (getter.filePathRegularExpressionIndex > parameters.length - 1) {
        throw new Error("ERROR: filePathRegularExpressionIndex (" + getter.filePathRegularExpressionIndex + ") of regularExpression " +
            ("\"" + getter.regularExpression + "\" in TYPRM_LINE_NUM_GETTER is out of range.") +
            ("testing string is \"" + address + "\"."));
    }
    if (getter.keywordRegularExpressionIndex > parameters.length - 1) {
        throw new Error("ERROR: keywordRegularExpressionIndex (" + getter.keywordRegularExpressionIndex + ") of regularExpression " +
            ("\"" + getter.regularExpression + "\" in TYPRM_LINE_NUM_GETTER is out of range.") +
            ("testing string is \"" + address + "\"."));
    }
    var csvOption = false;
    if (parameters.length >= getter.csvOptionRegularExpressionIndex) {
        if (parameters[getter.csvOptionRegularExpressionIndex]) {
            csvOption = true;
        }
    }
    var targetMatchID = 1;
    if (parameters.length >= getter.targetMatchIdRegularExpressionIndex) {
        targetMatchID = parseInt(parameters[getter.targetMatchIdRegularExpressionIndex]);
        if (!targetMatchID || targetMatchID < 1) {
            targetMatchID = 1;
        }
    }
    return {
        filePath: parameters[getter.filePathRegularExpressionIndex],
        keyword: parameters[getter.keywordRegularExpressionIndex],
        csvOption: csvOption,
        targetMatchID: targetMatchID,
    };
}
// searchAsText
function searchAsText(getter, address) {
    var e_12, _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b, filePath, keyword, csvOption, targetMatchID, keywords, firstKeyword, currentKeyword, keywords, currentKeyword, reader, lineNum, breaking, exception, foundCount, reader_11, reader_11_1, line1, line, nextKeyword, e_12_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = splitFilePathAndKeyword(address, getter), filePath = _b.filePath, keyword = _b.keyword, csvOption = _b.csvOption, targetMatchID = _b.targetMatchID;
                    if (!fs.existsSync(filePath)) {
                        console.log("ERROR: not found a file at \"" + getTestablePath(lib.getFullPath(filePath, process.cwd())) + "\"");
                        return [2 /*return*/, { filePath: filePath, lineNum: notFound }];
                    }
                    if (!csvOption) return [3 /*break*/, 2];
                    return [4 /*yield*/, lib.parseCSVColumns(keyword)];
                case 1:
                    keywords = _c.sent();
                    firstKeyword = keywords.shift();
                    if (!firstKeyword) {
                        console.log("ERROR: no keywords at \"" + getTestablePath(lib.getFullPath(filePath, process.cwd())) + "\"");
                        return [2 /*return*/, { filePath: filePath, lineNum: notFound }];
                    }
                    if (targetMatchID !== 1) {
                        console.log("ERROR: both csvOption and targetMatchID must not be specified at \"" + getTestablePath(lib.getFullPath(filePath, process.cwd())) + "\"");
                        return [2 /*return*/, { filePath: filePath, lineNum: notFound }];
                    }
                    currentKeyword = firstKeyword;
                    return [3 /*break*/, 3];
                case 2:
                    keywords = [keyword];
                    currentKeyword = keyword;
                    _c.label = 3;
                case 3:
                    reader = readline.createInterface({
                        input: fs.createReadStream(filePath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    breaking = false;
                    foundCount = 0;
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 9, 10, 15]);
                    reader_11 = __asyncValues(reader);
                    _c.label = 5;
                case 5: return [4 /*yield*/, reader_11.next()];
                case 6:
                    if (!(reader_11_1 = _c.sent(), !reader_11_1.done)) return [3 /*break*/, 8];
                    line1 = reader_11_1.value;
                    if (breaking) {
                        return [3 /*break*/, 7];
                    } // "reader" requests read all lines
                    try {
                        line = line1;
                        lineNum += 1;
                        if (line.includes(currentKeyword)) {
                            if (!csvOption) {
                                foundCount += 1;
                                if (foundCount >= targetMatchID) { // targetMatchID
                                    breaking = true; // return or break must not be written.
                                    // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                                }
                            }
                            else { // csvOption
                                nextKeyword = keywords.shift();
                                if (!nextKeyword) {
                                    breaking = true; // return or break must not be written.
                                    currentKeyword = '';
                                }
                                else {
                                    currentKeyword = nextKeyword;
                                }
                            }
                        }
                    }
                    catch (e) {
                        exception = e;
                        breaking = true;
                    }
                    _c.label = 7;
                case 7: return [3 /*break*/, 5];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_12_1 = _c.sent();
                    e_12 = { error: e_12_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _c.trys.push([10, , 13, 14]);
                    if (!(reader_11_1 && !reader_11_1.done && (_a = reader_11.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _a.call(reader_11)];
                case 11:
                    _c.sent();
                    _c.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_12) throw e_12.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15:
                    if (exception) {
                        throw exception;
                    }
                    if (!breaking) {
                        lineNum = 0;
                    }
                    return [2 /*return*/, { filePath: filePath, lineNum: lineNum }];
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
// FilePathLineNum
var FilePathLineNum = /** @class */ (function () {
    function FilePathLineNum() {
        this.filePath = '';
        this.lineNum = 0;
    }
    return FilePathLineNum;
}());
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
// Parser
var Parser = /** @class */ (function () {
    function Parser() {
        this.command = CommandEnum.unknown;
        this.verbose = false;
        this.filePath = '';
        this.lineNum = 0;
    }
    return Parser;
}());
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
    WriteBuffer.prototype.replaceAboveLine = function (relativeLineNum, replacedLine) {
        var targetLineNum = this.lineBuffer.length + relativeLineNum;
        this.lineBuffer[targetLineNum] = replacedLine;
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
        lib_1.pp(message.toString());
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
            "Error of not found the file or folder at \"${verbNum}\"": "エラー：ファイルまたはフォルダーが見つかりません \"${0}\"",
            "Error of duplicated variable name:": "エラー：変数名が重複しています",
            "Error of not expected condition:": "エラー：予期しない条件です",
            "Error of expect tag syntax:": "エラー：expect タグの文法エラー",
            "Error of unexpected: The count of evalatedKeyValues is not increasing.": "予期しないエラー：evalatedKeyValues の数が増えていません。",
            "isReplacable may be not changed. Try typrm check command.": "isReplacable が変更されていません。 typrm check コマンドを試してください。",
            "${0}a quote is found inside a field${1}": "${0}フィールド内に引用符があります${1}",
            "Not found. To do full text search, press Enter key.": "見つかりません。全文検索するときは Enter キーを押してください。",
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
            "Before Editing": "編集前",
            "After  Editing": "編集後",
            "WarningLine": "警告行",
            "Found": "見つかったもの",
            "Setting": "設定",
            "SettingIndex": "設定番号",
            "Not found any replacing target": "置き換える対象が見つかりません",
            "Set old value at settings in the replacing file": "置き換えるファイルの中の設定に古い値を設定してください",
            "The parameter must be less than 0": "パラメーターは 0 より小さくしてください",
            "Not found \"${0}\" above": "上方向に「${0}」が見つかりません",
            "Not found \"${0}\" following": "下方向に「${0}」が見つかりません",
            "Not referenced:": "参照されていません：",
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
                    d = lib_1.pp('');
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
var toLabel = "#to:"; // replace to tag
var toTestLabel = "#to-test:";
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
var searchIfLabel = "#(search)if: false";
var ifLabel = "#if:";
var expectLabel = "#expect:";
var ignoredKeywords = [/#search:/g, /: +#keyword:/g, /#keyword:/g];
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
var wordsMatchScore = 17;
var partMatchScore = 15;
var notNormalizedScore = 1;
var caseIgnoredWordMatchScore = 16;
var caseIgnoredPartMatchScore = 14;
var orderMatchScoreWeight = 2;
var minLineNum = 0;
var maxLineNum = 999999999;
var maxNumber = 999999999;
var foundForAbove = minLineNum;
var foundForFollowing = maxLineNum;
var pathColor = chalk.cyan;
var lineNumColor = chalk.keyword('gray');
var matchedColor = chalk.green.bold;
var notFound = -1;
var allSetting = 0;
var inputFileParentPath = '';
var locale = '';
var withJest = false;
exports.stdout = '';
exports.programArguments = [];
exports.programOptions = {};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
//# sourceMappingURL=main.js.map