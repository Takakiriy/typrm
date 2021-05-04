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
exports.programOptions = exports.programArguments = exports.stdout = exports.callMainFromJest = exports.InputObject = exports.debugOut = exports.main = void 0;
var fs = require("fs"); // file system
var path = require("path"); // or path = require("path")
var globby = require("globby");
var readline = require("readline");
var stream = require("stream");
var csvParse = require("csv-parse");
// main
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var checkingFilePath, inputFilePath, changingLineNum, keyValues;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    locale = Intl.NumberFormat().resolvedOptions().locale;
                    if ('locale' in exports.programOptions) {
                        locale = exports.programOptions.locale;
                    }
                    if (!(exports.programArguments.length === 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, oldMain(true, '')];
                case 1:
                    _a.sent();
                    if (!exports.programOptions.test) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 11];
                case 4:
                    if (!(exports.programArguments.length >= 1)) return [3 /*break*/, 11];
                    if (!(exports.programArguments[0] === 's' || exports.programArguments[0] === 'search')) return [3 /*break*/, 6];
                    return [4 /*yield*/, search()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 6:
                    if (!(exports.programArguments[0] === 'c' || exports.programArguments[0] === 'check')) return [3 /*break*/, 8];
                    if (exports.programArguments.length >= 2) {
                        checkingFilePath = exports.programArguments[1];
                    }
                    return [4 /*yield*/, check(checkingFilePath)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 8:
                    if (!(exports.programArguments[0] === 'r' || exports.programArguments[0] === 'replace')) return [3 /*break*/, 10];
                    varidateUpdateCommandArguments();
                    inputFilePath = exports.programArguments[1];
                    changingLineNum = parseInt(exports.programArguments[2]);
                    keyValues = exports.programArguments[3];
                    return [4 /*yield*/, replaceSettings(inputFilePath, changingLineNum, keyValues)];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 10:
                    println("Unknown command \"" + exports.programArguments[0] + "\".");
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.main = main;
// oldMain
function oldMain(isModal, inputFilePath) {
    var inputFilePath;
    var e_1, _a, e_2, _b;
    return __awaiter(this, void 0, void 0, function () {
        var parentPath, previousTemplateCount, reader, isReadingSetting, setting, settingCount, lineNum, templateCount, fileTemplateTag, errorCount, warningCount, secretLabelCount, lines, keywords, reader_1, reader_1_1, line1, line, previousIsReadingSetting, separator, key, value, templateTag, checkingLine, expected, continue_, checkPassed, _i, temporaryLabels_1, temporaryLabel, match, keyword, label, e_1_1, checkPassed, reader_2, reader_2_1, line1, line, _c, keywords_1, keyword, e_2_1, _d, keywords_2, keyword, loop, key, lineNum_1, changingSettingIndex, keyValue, _e, _f, _g, key;
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
                    lineNum = 0;
                    templateCount = 0;
                    fileTemplateTag = null;
                    errorCount = 0;
                    warningCount = 0;
                    secretLabelCount = 0;
                    lines = [];
                    keywords = [];
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
                        // const  match = settingStartLabel.exec(line.trim());
                        // settingName = match[1];
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
                        println("");
                        println(translate('ErrorLine') + ": " + lineNum);
                        println("  " + translate('Contents') + ": " + line.trim());
                        println("  " + translate('Error') + ": " + translate('The parameter must be less than 0'));
                        templateTag.isFound = false;
                        templateCount += 1;
                        errorCount += 1;
                    }
                    if (templateTag.isFound) {
                        templateCount += 1;
                        checkingLine = lines[lines.length - 1 + templateTag.lineNumOffset];
                        expected = getExpectedLine(setting, templateTag.template);
                        if (checkingLine.indexOf(expected) === notFound) {
                            println("");
                            println(translate('ErrorLine') + ": " + (lineNum + templateTag.lineNumOffset));
                            println("  " + translate('Contents') + ": " + checkingLine.trim());
                            println("  " + translate('Expected') + ": " + expected);
                            println("  " + translate('Template') + ": " + templateTag.template);
                            println("  " + translate('SettingIndex') + ": " + settingCount);
                            errorCount += 1;
                        }
                    }
                    if (!fileTemplateTag) return [3 /*break*/, 8];
                    continue_ = fileTemplateTag.onReadLine(line);
                    if (!!continue_) return [3 /*break*/, 8];
                    return [4 /*yield*/, fileTemplateTag.checkTargetContents(setting, inputFilePath, lineNum)];
                case 7:
                    checkPassed = _h.sent();
                    if (!checkPassed) {
                        errorCount += 1;
                    }
                    fileTemplateTag = null;
                    _h.label = 8;
                case 8:
                    if (templateTag.label === fileTemplateLabel) {
                        fileTemplateTag = templateTag;
                    }
                    // Check if there is not "#★Now:".
                    for (_i = 0, temporaryLabels_1 = temporaryLabels; _i < temporaryLabels_1.length; _i++) {
                        temporaryLabel = temporaryLabels_1[_i];
                        if (line.toLowerCase().indexOf(temporaryLabel.toLowerCase()) !== notFound) {
                            println("");
                            println(translate('WarningLine') + ": " + lineNum);
                            println("  " + translate('Contents') + ": " + line.trim());
                            println("  " + translate('SettingIndex') + ": " + settingCount);
                            warningCount += 1;
                        }
                    }
                    // Check if there is not secret tag.
                    if (line.indexOf(secretLabel) !== notFound || line.indexOf(secretLabelEn) !== notFound) {
                        if (line.indexOf(secretExamleLabel) === notFound && line.indexOf(secretExamleLabelEn) === notFound) {
                            if (secretLabelCount === 0) { // Because there will be many secret data.
                                println("");
                                println(translate('WarningLine') + ": " + lineNum);
                                println("  " + translate('This is a secret value.'));
                                println('  ' + translate(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Change \"", "\" to \"", "\".'"], ["Change \"", "\" to \"", "\".'"])), secretLabelEn, secretExamleLabelEn));
                                println('  ' + translate(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Change \"", "\" to \"", "\".'"], ["Change \"", "\" to \"", "\".'"])), secretLabel, secretExamleLabel));
                                println("  " + translate('SettingIndex') + ": " + settingCount);
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
                    if (!(reader_1_1 && !reader_1_1.done && (_a = reader_1["return"]))) return [3 /*break*/, 14];
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
                    return [4 /*yield*/, fileTemplateTag.checkTargetContents(setting, inputFilePath, lineNum)];
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
                    _h.label = 23;
                case 23: return [3 /*break*/, 21];
                case 24: return [3 /*break*/, 31];
                case 25:
                    e_2_1 = _h.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 31];
                case 26:
                    _h.trys.push([26, , 29, 30]);
                    if (!(reader_2_1 && !reader_2_1.done && (_b = reader_2["return"]))) return [3 /*break*/, 28];
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
                                println('');
                                println(translate('ErrorLine') + ": " + (keyword.startLineNum + 1));
                                println('  ' + translate(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Not found \"", "\" above"], ["Not found \"", "\" above"])), keyword.keyword));
                                errorCount += 1;
                            }
                        }
                        else if (keyword.direction === Direction.Following) {
                            if (keyword.startLineNum !== foundForFollowing) {
                                println('');
                                println(translate('ErrorLine') + ": " + (keyword.startLineNum - 1));
                                println('  ' + translate(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Not found \"", "\" following"], ["Not found \"", "\" following"])), keyword.keyword));
                                errorCount += 1;
                            }
                        }
                    }
                    // Show the result
                    println('');
                    println(translate('Warning') + ": " + warningCount + ", " + translate('Error') + ": " + errorCount);
                    if (previousTemplateCount) {
                        println(translate('template count') + " = " + previousTemplateCount + " (" + translate('in previous check') + ")");
                    }
                    println(translate('template count') + " = " + templateCount);
                    if (!isModal) {
                        return [3 /*break*/, 43];
                    }
                    loop = true;
                    _h.label = 32;
                case 32:
                    if (!loop) return [3 /*break*/, 41];
                    println(translate('Press Enter key to retry checking.'));
                    return [4 /*yield*/, input(translate('The line number to change the variable value >'))];
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
                    changingSettingIndex = _h.sent();
                    println(translate('SettingIndex') + ": " + changingSettingIndex);
                    println(translate('Enter only: finish to input setting'));
                    _h.label = 36;
                case 36: return [4 /*yield*/, input(translate('key: new_value>'))];
                case 37:
                    keyValue = _h.sent();
                    if (keyValue === '') {
                        return [3 /*break*/, 40];
                    }
                    _e = errorCount;
                    return [4 /*yield*/, changeSettingByKeyValueOld(inputFilePath, changingSettingIndex, keyValue)];
                case 38:
                    errorCount = _e + _h.sent();
                    _h.label = 39;
                case 39: return [3 /*break*/, 36];
                case 40:
                    loop = (errorCount >= 1);
                    return [3 /*break*/, 32];
                case 41:
                    // Rescan
                    println('========================================');
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
// updateParameters
function replaceSettings(inputFilePath, changingLineNum, keyValues) {
    return __awaiter(this, void 0, void 0, function () {
        var errorCount, changingSettingIndex, _i, _a, keyValue, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    errorCount = 0;
                    return [4 /*yield*/, getSettingIndexFromLineNum(inputFilePath, changingLineNum)];
                case 1:
                    changingSettingIndex = _c.sent();
                    _i = 0, _a = keyValues.split('\n');
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    keyValue = _a[_i];
                    _b = errorCount;
                    return [4 /*yield*/, changeSettingByKeyValueOld(inputFilePath, changingSettingIndex, keyValue)];
                case 3:
                    errorCount = _b + _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    println('');
                    println(translate('Warning') + ": 0, " + translate('Error') + ": " + errorCount);
                    return [2 /*return*/];
            }
        });
    });
}
// changeSettingByKeyValue
function changeSettingByKeyValueOld(inputFilePath, changingSettingIndex, keyValue) {
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
        var backUpFilePath, oldFilePath, newFilePath, writer, readStream, reader, lines, isReadingSetting, setting, settingCount, changedValue, lineNum, errorCount, isChanging, reader_3, reader_3_1, line1, line, output, separator, key, value, commentIndex, comment, templateTag, checkingLine, expected, changed, before, after, aboveLine, e_3_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (false) {
                        backUpFilePath = inputFilePath + ".backup";
                        if (!fs.existsSync(backUpFilePath)) {
                            fs.copyFileSync(inputFilePath, backUpFilePath);
                        }
                    }
                    oldFilePath = inputFilePath;
                    newFilePath = inputFilePath + ".new";
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
                            if (templateTag.isFound && templateTag.template.indexOf(changingKey) !== notFound) {
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
                                        println('');
                                        println(translate('ErrorLine') + ": " + lineNum);
                                        println("  " + translate('Error') + ": " + translate('Not found any replacing target'));
                                        println("  " + translate('Solution') + ": " + translate('Set old value at settings in the replacing file'));
                                        println("  " + translate('Contents') + ": " + line.trim());
                                        println("  " + translate('Expected') + ": " + expected.trim());
                                        println("  " + translate('Template') + ": " + templateTag.template.trim());
                                        println("  " + translate('SettingIndex') + ": " + settingCount);
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
                                deleteFileSync(newFilePath);
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
            var parentPath, targetFilePath, templateLineNum, targetFileReader, expectedFirstLine, templateLineIndex, targetLineNum, errorTemplateLineIndex, errorTargetLineNum, errorContents, errorExpected, errorTemplate, indent, same, targetFileReader_1, targetFileReader_1_1, line1, targetLine, indentLength, expected, e_4_1, templateLineNum;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parentPath = path.dirname(inputFilePath);
                        targetFilePath = getFullPath(getExpectedLine(setting, this.template), parentPath);
                        if (!fs.existsSync(targetFilePath)) {
                            templateLineNum = templateEndLineNum - this.templateLines.length;
                            println("");
                            println("Error:");
                            println("  " + translate('NotFound') + ": " + targetFilePath);
                            println("  Template: " + inputFilePath + ":" + templateLineNum);
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
                            println("");
                            println(translate('typrmFile') + ": " + getTestablePath(inputFilePath) + ":" + templateLineNum);
                            println(translate('ErrorFile') + ": " + getTestablePath(targetFilePath) + ":" + errorTargetLineNum);
                            println("  Contents: " + errorContents);
                            println("  Expected: " + errorExpected);
                            println("  Template: " + errorTemplate);
                        }
                        return [2 /*return*/, same];
                }
            });
        });
    };
    return TemplateTag;
}());
// check
function check(checkingFilePath) {
    return __awaiter(this, void 0, void 0, function () {
        var targetFolder, targetFolderFullPath, inputFileFullPath, filePaths, oldCurrentFoldderPath, filePaths, _i, filePaths_1, inputFilePath, inputFileFullPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    targetFolder = exports.programOptions.folder;
                    targetFolderFullPath = getFullPath(targetFolder, process.cwd());
                    if (!checkingFilePath) return [3 /*break*/, 1];
                    inputFileFullPath = targetFolderFullPath + path.sep + checkingFilePath;
                    if (!fs.existsSync(inputFileFullPath)) {
                        throw new Error("Not found specified target file at \"" + inputFileFullPath + "\".");
                    }
                    filePaths = [checkingFilePath];
                    return [3 /*break*/, 3];
                case 1:
                    oldCurrentFoldderPath = process.cwd();
                    if (!fs.existsSync(targetFolderFullPath)) {
                        throw new Error("Not found target folder at \"" + targetFolderFullPath + "\".");
                    }
                    process.chdir(targetFolder);
                    return [4 /*yield*/, globby(['**/*'])];
                case 2:
                    filePaths = _a.sent();
                    process.chdir(oldCurrentFoldderPath);
                    _a.label = 3;
                case 3:
                    _i = 0, filePaths_1 = filePaths;
                    _a.label = 4;
                case 4:
                    if (!(_i < filePaths_1.length)) return [3 /*break*/, 7];
                    inputFilePath = filePaths_1[_i];
                    inputFileFullPath = targetFolderFullPath + path.sep + inputFilePath;
                    return [4 /*yield*/, oldMain(false, inputFileFullPath)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// search
function search() {
    var e_5, _a;
    return __awaiter(this, void 0, void 0, function () {
        var keyword, targetFolder, targetFolderFullPath, oldCurrentFoldderPath, filePaths, indentAtStart, inGlossary, _i, filePaths_2, inputFilePath, inputFileFullPath, reader, lineNum, reader_4, reader_4_1, line1, line, csv, columns, currentIndent, e_5_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    keyword = exports.programArguments[1].replace('"', '""');
                    targetFolder = exports.programOptions.folder;
                    targetFolderFullPath = getFullPath(targetFolder, process.cwd());
                    oldCurrentFoldderPath = process.cwd();
                    process.chdir(targetFolder);
                    return [4 /*yield*/, globby(['**/*'])];
                case 1:
                    filePaths = _b.sent();
                    process.chdir(oldCurrentFoldderPath);
                    indentAtStart = '';
                    inGlossary = false;
                    _i = 0, filePaths_2 = filePaths;
                    _b.label = 2;
                case 2:
                    if (!(_i < filePaths_2.length)) return [3 /*break*/, 17];
                    inputFilePath = filePaths_2[_i];
                    inputFileFullPath = targetFolderFullPath + path.sep + inputFilePath;
                    reader = readline.createInterface({
                        input: fs.createReadStream(inputFileFullPath),
                        crlfDelay: Infinity
                    });
                    lineNum = 0;
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 10, 11, 16]);
                    reader_4 = (e_5 = void 0, __asyncValues(reader));
                    _b.label = 4;
                case 4: return [4 /*yield*/, reader_4.next()];
                case 5:
                    if (!(reader_4_1 = _b.sent(), !reader_4_1.done)) return [3 /*break*/, 9];
                    line1 = reader_4_1.value;
                    line = line1;
                    lineNum += 1;
                    if (!(line.indexOf(keywordLabel) !== notFound)) return [3 /*break*/, 7];
                    if (!(line.indexOf(keyword) !== notFound)) return [3 /*break*/, 7];
                    csv = line.substr(line.indexOf(keywordLabel) + keywordLabel.length);
                    return [4 /*yield*/, parseCSVColumns(csv)];
                case 6:
                    columns = _b.sent();
                    if (columns.indexOf(keyword.replace('""', '"')) !== notFound) {
                        println(getTestablePath(inputFileFullPath) + ":" + lineNum + ": " + line);
                    }
                    _b.label = 7;
                case 7:
                    // glossary tag
                    if (line.indexOf(glossaryLabel) !== notFound) {
                        inGlossary = true;
                        indentAtStart = indentRegularExpression.exec(line)[0];
                    }
                    else if (inGlossary) {
                        currentIndent = indentRegularExpression.exec(line)[0];
                        if (line.indexOf(keyword) === currentIndent.length) {
                            if (line[currentIndent.length + keyword.length] === ':') {
                                println(getTestablePath(inputFileFullPath) + ":" + lineNum + ": " + line);
                            }
                        }
                        if (currentIndent.length <= indentAtStart.length) {
                            inGlossary = false;
                        }
                    }
                    _b.label = 8;
                case 8: return [3 /*break*/, 4];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_5_1 = _b.sent();
                    e_5 = { error: e_5_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _b.trys.push([11, , 14, 15]);
                    if (!(reader_4_1 && !reader_4_1.done && (_a = reader_4["return"]))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _a.call(reader_4)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_5) throw e_5.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16:
                    _i++;
                    return [3 /*break*/, 2];
                case 17: return [2 /*return*/];
            }
        });
    });
}
// varidateUpdateCommandArguments
function varidateUpdateCommandArguments() {
    if (exports.programArguments.length < 4) {
        throw new Error('Error: Too few argurments. Usage: typrm replace  __FilePath__  __LineNum__  __KeyColonValue__');
    }
}
// onEndOfSetting
function onEndOfSetting(setting) {
    for (var _i = 0, _a = Object.keys(setting); _i < _a.length; _i++) {
        var key = _a[_i];
        if (!setting[key].isReferenced) {
            println(translate(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Not referenced: ", " in line ", ""], ["Not referenced: ", " in line ", ""])), key, setting[key].lineNum));
        }
    }
}
// getSettingIndexFromLineNum
function getSettingIndexFromLineNum(inputFilePath, targetLineNum) {
    var e_6, _a;
    return __awaiter(this, void 0, void 0, function () {
        var reader, settingCount, lineNum, loop, exception, reader_5, reader_5_1, line1, line, e_6_1;
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
                    reader_5 = __asyncValues(reader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, reader_5.next()];
                case 3:
                    if (!(reader_5_1 = _b.sent(), !reader_5_1.done)) return [3 /*break*/, 5];
                    line1 = reader_5_1.value;
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
                    e_6_1 = _b.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _b.trys.push([7, , 10, 11]);
                    if (!(reader_5_1 && !reader_5_1.done && (_a = reader_5["return"]))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _a.call(reader_5)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_6) throw e_6.error;
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
    var slashRelativePath = relativePath.replace('\\', '/');
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
                    });
                })];
        });
    });
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
// dd
// debugOut の内容が見えないときは、 const debugOut_ = debugOut; を書いて debugOut_ の内容を見ます。
function dd(message) {
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    exports.debugOut.push(message.toString());
}
exports.debugOut = [];
// watchPrint
function watchPrint() {
    var s = exports.stdout;
    var debugOut_ = exports.stdout.split('\n');
    return; // Set break point here
}
// println
function println(message) {
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    if (withJest) {
        exports.stdout += message.toString() + '\n';
    }
    else {
        console.log(message);
    }
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
                            println(guide + nextLine);
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
                    println(guide + value);
                    return [2 /*return*/, value];
                }
            }
            // Read the starting process parameters
            while (inputOption.nextParameterIndex < process.argv.length) {
                value = process.argv[inputOption.nextParameterIndex];
                inputOption.nextParameterIndex += 1;
                if (value.substr(0, 1) !== '-') {
                    println(guide + value);
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
    // Change separators to OS format
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
// callMainFromJest
function callMainFromJest(parameters, options) {
    return __awaiter(this, void 0, void 0, function () {
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
                    return [4 /*yield*/, main()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.callMainFromJest = callMainFromJest;
var settingStartLabel = /^設定(\(|（[^\)]*\)|）)?:$/;
var settingStartLabelEn = /^settings(\([^\)]*\))?:$/;
var templateLabel = "#template:";
var templateAtStartLabel = "#template-at(";
var templateAtEndLabel = "):";
var fileTemplateLabel = "#file-template:";
var keywordLabel = "#keyword:";
var glossaryLabel = "#glossary:";
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
var inputFileParentPath = '';
var locale = '';
var withJest = false;
exports.stdout = '';
exports.programArguments = [];
exports.programOptions = {};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=main.js.map