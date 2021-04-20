"use strict";
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
exports.__esModule = true;
var fs = require("fs");
var child_process = require("child_process");
var scriptPath = "../build/typrm.js";
var testFolderPath = "./test_data" + "/";
var debug = false;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!debug) return [3 /*break*/, 4];
                    return [4 /*yield*/, TestOfCheck()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, TestOfChange()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, TestOfChangeError()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, TestOfFileCheck()];
                case 5:
                    _a.sent();
                    deleteFile(testFolderPath + '_output.txt');
                    console.log('Pass');
                    return [2 /*return*/];
            }
        });
    });
}
function TestOfCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var returns, fileNameHeads, _i, fileNameHeads_1, fileNameHead, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileNameHeads = [
                        "1_template_1_ok",
                        "1_template_2_error",
                        "now_1_error",
                        "now_2_error_template_error",
                        "refer_1_ok",
                        "refer_2_error",
                        "secret_1_error",
                        "var_ref_1_error",
                    ];
                    _i = 0, fileNameHeads_1 = fileNameHeads;
                    _a.label = 1;
                case 1:
                    if (!(_i < fileNameHeads_1.length)) return [3 /*break*/, 4];
                    fileNameHead = fileNameHeads_1[_i];
                    console.log("TestCase: TestOfCheck >> " + fileNameHead);
                    return [4 /*yield*/, callChildProccess("node " + scriptPath + " --test --locale en-US", { inputLines: [
                                testFolderPath + fileNameHead + "_1.yaml",
                                "exit"
                            ] })];
                case 2:
                    // Test Main
                    returns = _a.sent();
                    answer = fs.readFileSync(testFolderPath + fileNameHead + "_3_answer.txt")
                        .toString().substr(cutBOM);
                    // Check
                    if (returns.stdout !== answer) {
                        console.log('Error: different between "_output.txt" and "' + fileNameHead + '_3_answer.txt"');
                        fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
                        throw new Error();
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// TestOfChange
function TestOfChange() {
    return __awaiter(this, void 0, void 0, function () {
        var returns, fileNameHeads, _a, _b, _i, fileNameHead, caseCount, target, sourceFilePath, backUpFilePath, changingFilePath, answerFilePath, inputLines, source, changing, answer, backUp;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fileNameHeads = {
                        "2_change_1_ok": 2,
                        "2_change_3_English": 1
                    };
                    _a = [];
                    for (_b in fileNameHeads)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    fileNameHead = _a[_i];
                    caseCount = fileNameHeads[fileNameHead];
                    target = 1;
                    _c.label = 2;
                case 2:
                    if (!(target <= caseCount)) return [3 /*break*/, 5];
                    console.log("TestCase: TestOfChange >> " + fileNameHead + " >> " + target);
                    sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
                    backUpFilePath = testFolderPath + fileNameHead + "_1_changing.yaml.backup";
                    changingFilePath = testFolderPath + fileNameHead + "_1_changing.yaml";
                    answerFilePath = testFolderPath + fileNameHead + ("_2_" + target + "_after_answer.yaml");
                    deleteFile(changingFilePath);
                    deleteFile(backUpFilePath);
                    fs.copyFileSync(sourceFilePath, changingFilePath);
                    inputLines = [];
                    if (fileNameHead === '2_change_1_ok') {
                        if (target === 1) {
                            inputLines = [
                                changingFilePath,
                                "10",
                                "key1: value1changed",
                                "  __Key2__: value2changed  #コメント  ",
                                "Key3: value3changed  #コメント",
                                "",
                                "exit",
                            ];
                        }
                        else {
                            inputLines = [
                                changingFilePath,
                                "29",
                                "key1: value11changed",
                                "",
                                "exit",
                            ];
                        }
                    }
                    else if (fileNameHead === '2_change_3_English') {
                        inputLines = [
                            changingFilePath,
                            "30",
                            "key1: value11changed",
                            "",
                            "exit",
                        ];
                    }
                    return [4 /*yield*/, callChildProccess("node " + scriptPath + " --test --locale en-US", { inputLines: inputLines })];
                case 3:
                    returns = _c.sent();
                    source = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
                    changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
                    answer = fs.readFileSync(answerFilePath).toString().substr(cutBOM);
                    backUp = fs.readFileSync(backUpFilePath).toString().substr(cutBOM);
                    // Check
                    if (changing !== answer) {
                        console.log("Error: different between " +
                            ("\"" + fileNameHead + "_1_changing.yaml\" and ") +
                            ("\"" + fileNameHead + "_2_" + target + "_after_answer.yaml"));
                        throw new Error();
                    }
                    if (backUp !== source) {
                        console.log("Error: different between " +
                            ("\"" + fileNameHead + "_1_changing.yaml.backup\" and ") +
                            ("\"" + fileNameHead + "_1.yaml\""));
                        throw new Error();
                    }
                    deleteFile(changingFilePath);
                    deleteFile(backUpFilePath);
                    _c.label = 4;
                case 4:
                    target += 1;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// TestOfChangeError
function TestOfChangeError() {
    return __awaiter(this, void 0, void 0, function () {
        var returns, fileNameHeads, _a, _b, _i, fileNameHead, caseData, sourceFilePath, backUpFilePath, changingFilePath, answerFilePath, logAnswerFilePath, changing, answer, logAnswer;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fileNameHeads = {
                        "2_change_2_error": { locale: "--test --locale en-US" },
                        "2_change_4_Japanese": { locale: "--test --locale ja-JP" }
                    };
                    _a = [];
                    for (_b in fileNameHeads)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    fileNameHead = _a[_i];
                    console.log("TestCase: TestOfChangeError >> " + fileNameHead);
                    caseData = fileNameHeads[fileNameHead];
                    sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
                    backUpFilePath = testFolderPath + fileNameHead + "_1_changing.yaml.backup";
                    changingFilePath = testFolderPath + fileNameHead + "_1_changing.yaml";
                    answerFilePath = testFolderPath + fileNameHead + "_2_after_answer.yaml";
                    logAnswerFilePath = testFolderPath + fileNameHead + "_3_answer.txt";
                    deleteFile(changingFilePath);
                    deleteFile(backUpFilePath);
                    fs.copyFileSync(sourceFilePath, changingFilePath);
                    return [4 /*yield*/, callChildProccess("node " + scriptPath + " " + caseData.locale, { inputLines: [
                                changingFilePath,
                                "4",
                                "Key3: value3changed",
                                "exit",
                            ] })];
                case 2:
                    // Test Main
                    returns = _c.sent();
                    changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
                    answer = fs.readFileSync(answerFilePath).toString().substr(cutBOM);
                    logAnswer = fs.readFileSync(logAnswerFilePath).toString().substr(cutBOM);
                    // Check
                    if (returns.stdout !== logAnswer) {
                        console.log('Error: different between "_output.txt" and "' + fileNameHead + '_3_answer.txt"');
                        fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
                        throw new Error();
                    }
                    if (changing !== answer) {
                        console.log("Error: different between " +
                            ("\"" + fileNameHead + "_1_changing.yaml\" and ") +
                            ("\"" + fileNameHead + "_2_after_answer.yaml\""));
                        throw new Error();
                    }
                    deleteFile(changingFilePath);
                    deleteFile(backUpFilePath);
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// TestOfFileCheck
function TestOfFileCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var returns, fileNameHeads, fileNameHeads, _a, _b, _i, fileNameHead, caseCount, target, sourceFilePath, backUpFilePath, changingFilePath, inputLines, answer;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (debug) {
                        fileNameHeads = {
                            //		"file_1_ok_and_bad": 1,
                            "file_2_tab": 1,
                            "file_3_file_name": 1
                        };
                    }
                    else {
                        fileNameHeads = {
                            "file_1_ok_and_bad": 1
                        };
                    }
                    _a = [];
                    for (_b in fileNameHeads)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 6];
                    fileNameHead = _a[_i];
                    caseCount = fileNameHeads[fileNameHead];
                    target = 1;
                    _c.label = 2;
                case 2:
                    if (!(target <= caseCount)) return [3 /*break*/, 5];
                    console.log("TestCase: TestOfFileCheck >> " + fileNameHead + " >> " + target);
                    sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
                    backUpFilePath = testFolderPath + fileNameHead + "_1_changing.yaml.backup";
                    changingFilePath = testFolderPath + fileNameHead + "_1_changing.yaml";
                    deleteFile(changingFilePath);
                    deleteFile(backUpFilePath);
                    fs.copyFileSync(sourceFilePath, changingFilePath);
                    inputLines = [];
                    if (fileNameHead === 'file_1_ok_and_bad') {
                        inputLines = [
                            changingFilePath,
                            "6",
                            "__User__: user2",
                            "",
                            "exit",
                        ];
                    }
                    else {
                        inputLines = [
                            changingFilePath,
                            "exit",
                        ];
                    }
                    return [4 /*yield*/, callChildProccess("node " + scriptPath + " --test --locale en-US", { inputLines: inputLines })];
                case 3:
                    returns = _c.sent();
                    answer = fs.readFileSync(testFolderPath + fileNameHead + "_4_answer.txt")
                        .toString().substr(cutBOM);
                    // Check
                    if (returns.stdout !== answer) {
                        console.log('Error: different between "_output.txt" and "' + fileNameHead + '_4_answer.txt"');
                        fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
                        throw new Error();
                    }
                    _c.label = 4;
                case 4:
                    target += 1;
                    return [3 /*break*/, 2];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// callChildProccess
function callChildProccess(commandLine, option) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolveFunction, rejectFunction) { return __awaiter(_this, void 0, void 0, function () {
                    var returnValue, childProcess, _i, _a, inputLine, e_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                returnValue = new ProcessReturns();
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 8, , 9]);
                                childProcess = child_process.exec(commandLine, 
                                // on close the "childProcess" (2)
                                function (error, stdout, stderr) {
                                    returnValue.stdout = stdout;
                                    returnValue.stderr = stderr;
                                    resolveFunction(returnValue);
                                });
                                if (!(option && childProcess.stdin)) return [3 /*break*/, 7];
                                if (!option.inputLines) return [3 /*break*/, 6];
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 300); })];
                            case 2:
                                _b.sent();
                                _i = 0, _a = option.inputLines;
                                _b.label = 3;
                            case 3:
                                if (!(_i < _a.length)) return [3 /*break*/, 6];
                                inputLine = _a[_i];
                                console.log(inputLine);
                                childProcess.stdin.write(inputLine + "\n");
                                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 200); })];
                            case 4:
                                _b.sent();
                                _b.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 3];
                            case 6:
                                childProcess.stdin.end();
                                _b.label = 7;
                            case 7:
                                // on close the "childProcess" (1)
                                childProcess.on('close', function (exitCode) {
                                    returnValue.exitCode = exitCode;
                                });
                                childProcess.on('exit', function (exitCode) {
                                    returnValue.exitCode = exitCode;
                                });
                                return [3 /*break*/, 9];
                            case 8:
                                e_1 = _b.sent();
                                throw Error("Error in the command line " + commandLine);
                            case 9: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
// deleteFile
function deleteFile(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// ProcessOption
var ProcessOption = /** @class */ (function () {
    function ProcessOption() {
    }
    return ProcessOption;
}());
// ProcessReturns
var ProcessReturns = /** @class */ (function () {
    function ProcessReturns() {
        this.exitCode = 0;
        this.stdout = '';
        this.stderr = '';
    }
    return ProcessReturns;
}());
var cutBOM = 1;
var notFound = -1;
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm1fdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90eXBybV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUJBQXlCO0FBQ3pCLDZDQUErQztBQUUvQyxJQUFPLFVBQVUsR0FBSSxtQkFBbUIsQ0FBQztBQUN6QyxJQUFPLGNBQWMsR0FBRyxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBRTVDLElBQU8sS0FBSyxHQUFHLEtBQUssQ0FBQztBQUVyQixTQUFnQixJQUFJOzs7Ozt5QkFDaEIsQ0FBQyxLQUFLLEVBQU4sd0JBQU07b0JBQ1QscUJBQU0sV0FBVyxFQUFFLEVBQUE7O29CQUFuQixTQUFtQixDQUFDO29CQUNwQixxQkFBTSxZQUFZLEVBQUUsRUFBQTs7b0JBQXBCLFNBQW9CLENBQUM7b0JBQ3JCLHFCQUFNLGlCQUFpQixFQUFFLEVBQUE7O29CQUF6QixTQUF5QixDQUFDOzt3QkFFMUIscUJBQU0sZUFBZSxFQUFFLEVBQUE7O29CQUF2QixTQUF1QixDQUFDO29CQUN4QixVQUFVLENBQUMsY0FBYyxHQUFHLGFBQWEsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7OztDQUNwQjtBQUVELFNBQWdCLFdBQVc7Ozs7OztvQkFHcEIsYUFBYSxHQUFHO3dCQUNyQixpQkFBaUI7d0JBQ2pCLG9CQUFvQjt3QkFDcEIsYUFBYTt3QkFDYiw0QkFBNEI7d0JBQzVCLFlBQVk7d0JBQ1osZUFBZTt3QkFDZixnQkFBZ0I7d0JBQ2hCLGlCQUFpQjtxQkFDakIsQ0FBQzswQkFDc0MsRUFBYiwrQkFBYTs7O3lCQUFiLENBQUEsMkJBQWEsQ0FBQTtvQkFBN0IsWUFBWTtvQkFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBNEIsWUFBYyxDQUFDLENBQUM7b0JBRzlDLHFCQUFNLGlCQUFpQixDQUFDLFVBQVEsVUFB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cm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5cclxuY29uc3QgIHNjcmlwdFBhdGggPSAgYC4uL2J1aWxkL3R5cHJtLmpzYDtcclxuY29uc3QgIHRlc3RGb2xkZXJQYXRoID0gYC4vdGVzdF9kYXRhYCArIFwiL1wiO1xyXG5cclxuY29uc3QgIGRlYnVnID0gZmFsc2U7XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgbWFpbigpIHtcclxuaWYgKCFkZWJ1Zykge1xyXG5cdGF3YWl0IFRlc3RPZkNoZWNrKCk7XHJcblx0YXdhaXQgVGVzdE9mQ2hhbmdlKCk7XHJcblx0YXdhaXQgVGVzdE9mQ2hhbmdlRXJyb3IoKTtcclxufVxyXG5cdGF3YWl0IFRlc3RPZkZpbGVDaGVjaygpO1xyXG5cdGRlbGV0ZUZpbGUodGVzdEZvbGRlclBhdGggKyAnX291dHB1dC50eHQnKTtcclxuXHRjb25zb2xlLmxvZygnUGFzcycpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgVGVzdE9mQ2hlY2soKSB7XHJcblx0bGV0ICByZXR1cm5zOiBQcm9jZXNzUmV0dXJucztcclxuXHJcblx0Y29uc3QgZmlsZU5hbWVIZWFkcyA9IFtcclxuXHRcdFwiMV90ZW1wbGF0ZV8xX29rXCIsXHJcblx0XHRcIjFfdGVtcGxhdGVfMl9lcnJvclwiLFxyXG5cdFx0XCJub3dfMV9lcnJvclwiLFxyXG5cdFx0XCJub3dfMl9lcnJvcl90ZW1wbGF0ZV9lcnJvclwiLFxyXG5cdFx0XCJyZWZlcl8xX29rXCIsXHJcblx0XHRcInJlZmVyXzJfZXJyb3JcIixcclxuXHRcdFwic2VjcmV0XzFfZXJyb3JcIixcclxuXHRcdFwidmFyX3JlZl8xX2Vycm9yXCIsXHJcblx0XTtcclxuXHRmb3IgKGNvbnN0IGZpbGVOYW1lSGVhZCBvZiBmaWxlTmFtZUhlYWRzKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgVGVzdENhc2U6IFRlc3RPZkNoZWNrID4+ICR7ZmlsZU5hbWVIZWFkfWApO1xyXG5cclxuXHRcdC8vIFRlc3QgTWFpblxyXG5cdFx0cmV0dXJucyA9IGF3YWl0IGNhbGxDaGlsZFByb2NjZXNzKGBub2RlICR7c2NyaXB0UGF0aH0gLS10ZXN0IC0tbG9jYWxlIGVuLVVTYCxcclxuXHRcdFx0e2lucHV0TGluZXM6IFtcclxuXHRcdFx0XHR0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzEueWFtbFwiLFxyXG5cdFx0XHRcdFwiZXhpdFwiXHJcblx0XHRcdF19XHJcblx0XHQpO1xyXG5cdFx0Y29uc3QgIGFuc3dlciA9IGZzLnJlYWRGaWxlU3luYyh0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzNfYW5zd2VyLnR4dFwiKVxyXG5cdFx0XHQudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHJcblx0XHQvLyBDaGVja1xyXG5cdFx0aWYgKHJldHVybnMuc3Rkb3V0ICE9PSBhbnN3ZXIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yOiBkaWZmZXJlbnQgYmV0d2VlbiBcIl9vdXRwdXQudHh0XCIgYW5kIFwiJyArIGZpbGVOYW1lSGVhZCArICdfM19hbnN3ZXIudHh0XCInKTtcclxuXHRcdFx0ZnMud3JpdGVGaWxlU3luYyh0ZXN0Rm9sZGVyUGF0aCArIFwiX291dHB1dC50eHRcIiwgcmV0dXJucy5zdGRvdXQpO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vIFRlc3RPZkNoYW5nZVxyXG5hc3luYyBmdW5jdGlvbiAgVGVzdE9mQ2hhbmdlKCkge1xyXG5cdGxldCAgcmV0dXJuczogUHJvY2Vzc1JldHVybnM7XHJcblxyXG5cdGNvbnN0IGZpbGVOYW1lSGVhZHM6IHtbbmFtZTogc3RyaW5nXTogbnVtYmVyfSA9IHtcclxuXHRcdFwiMl9jaGFuZ2VfMV9va1wiOiAyLFxyXG5cdFx0XCIyX2NoYW5nZV8zX0VuZ2xpc2hcIjogMSxcclxuXHR9O1xyXG5cdGZvciAoY29uc3QgZmlsZU5hbWVIZWFkIGluIGZpbGVOYW1lSGVhZHMpIHtcclxuXHRcdGNvbnN0ICBjYXNlQ291bnQgPSBmaWxlTmFtZUhlYWRzW2ZpbGVOYW1lSGVhZF07XHJcblx0XHRmb3IgKGxldCB0YXJnZXQgPSAxOyAgdGFyZ2V0IDw9IGNhc2VDb3VudDsgIHRhcmdldCs9MSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgVGVzdENhc2U6IFRlc3RPZkNoYW5nZSA+PiAke2ZpbGVOYW1lSGVhZH0gPj4gJHt0YXJnZXR9YCk7XHJcblx0XHRcdGNvbnN0ICBzb3VyY2VGaWxlUGF0aCAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xLnlhbWxcIjtcclxuXHRcdFx0Y29uc3QgIGJhY2tVcEZpbGVQYXRoICAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzFfY2hhbmdpbmcueWFtbC5iYWNrdXBcIjtcclxuXHRcdFx0Y29uc3QgIGNoYW5naW5nRmlsZVBhdGggPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzFfY2hhbmdpbmcueWFtbFwiO1xyXG5cdFx0XHRjb25zdCAgYW5zd2VyRmlsZVBhdGggICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgYF8yXyR7dGFyZ2V0fV9hZnRlcl9hbnN3ZXIueWFtbGA7XHJcblx0XHRcdGRlbGV0ZUZpbGUoY2hhbmdpbmdGaWxlUGF0aCk7XHJcblx0XHRcdGRlbGV0ZUZpbGUoYmFja1VwRmlsZVBhdGgpO1xyXG5cdFx0XHRmcy5jb3B5RmlsZVN5bmMoc291cmNlRmlsZVBhdGgsIGNoYW5naW5nRmlsZVBhdGgpO1xyXG5cclxuXHRcdFx0Ly8gVGVzdCBNYWluXHJcblx0XHRcdGxldCAgaW5wdXRMaW5lczogc3RyaW5nW10gPSBbXTtcclxuXHRcdFx0aWYgKGZpbGVOYW1lSGVhZCA9PT0gJzJfY2hhbmdlXzFfb2snKSB7XHJcblx0XHRcdFx0aWYgKHRhcmdldCA9PT0gMSkge1xyXG5cdFx0XHRcdFx0aW5wdXRMaW5lcyA9IFtcclxuXHRcdFx0XHRcdFx0Y2hhbmdpbmdGaWxlUGF0aCxcclxuXHRcdFx0XHRcdFx0XCIxMFwiLFxyXG5cdFx0XHRcdFx0XHRcImtleTE6IHZhbHVlMWNoYW5nZWRcIixcclxuXHRcdFx0XHRcdFx0XCIgIF9fS2V5Ml9fOiB2YWx1ZTJjaGFuZ2VkICAj44Kz44Oh44Oz44OIICBcIixcclxuXHRcdFx0XHRcdFx0XCJLZXkzOiB2YWx1ZTNjaGFuZ2VkICAj44Kz44Oh44Oz44OIXCIsXHJcblx0XHRcdFx0XHRcdFwiXCIsXHJcblx0XHRcdFx0XHRcdFwiZXhpdFwiLFxyXG5cdFx0XHRcdFx0XTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aW5wdXRMaW5lcyA9ICBbXHJcblx0XHRcdFx0XHRcdGNoYW5naW5nRmlsZVBhdGgsXHJcblx0XHRcdFx0XHRcdFwiMjlcIixcclxuXHRcdFx0XHRcdFx0XCJrZXkxOiB2YWx1ZTExY2hhbmdlZFwiLFxyXG5cdFx0XHRcdFx0XHRcIlwiLFxyXG5cdFx0XHRcdFx0XHRcImV4aXRcIixcclxuXHRcdFx0XHRcdF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2UgaWYgKGZpbGVOYW1lSGVhZCA9PT0gJzJfY2hhbmdlXzNfRW5nbGlzaCcpIHtcclxuXHRcdFx0XHRpbnB1dExpbmVzID0gIFtcclxuXHRcdFx0XHRcdGNoYW5naW5nRmlsZVBhdGgsXHJcblx0XHRcdFx0XHRcIjMwXCIsXHJcblx0XHRcdFx0XHRcImtleTE6IHZhbHVlMTFjaGFuZ2VkXCIsXHJcblx0XHRcdFx0XHRcIlwiLFxyXG5cdFx0XHRcdFx0XCJleGl0XCIsXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJucyA9IGF3YWl0IGNhbGxDaGlsZFByb2NjZXNzKGBub2RlICR7c2NyaXB0UGF0aH0gLS10ZXN0IC0tbG9jYWxlIGVuLVVTYCwge2lucHV0TGluZXN9KTtcclxuXHRcdFx0Y29uc3QgIHNvdXJjZSAgID0gZnMucmVhZEZpbGVTeW5jKHNvdXJjZUZpbGVQYXRoKS50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cdFx0XHRjb25zdCAgY2hhbmdpbmcgPSBmcy5yZWFkRmlsZVN5bmMoY2hhbmdpbmdGaWxlUGF0aCkudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHRcdFx0Y29uc3QgIGFuc3dlciAgID0gZnMucmVhZEZpbGVTeW5jKGFuc3dlckZpbGVQYXRoKS50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cdFx0XHRjb25zdCAgYmFja1VwICAgPSBmcy5yZWFkRmlsZVN5bmMoYmFja1VwRmlsZVBhdGgpLnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblxyXG5cdFx0XHQvLyBDaGVja1xyXG5cdFx0XHRpZiAoY2hhbmdpbmcgIT09IGFuc3dlcikge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBFcnJvcjogZGlmZmVyZW50IGJldHdlZW4gYCArXHJcblx0XHRcdFx0XHRgXCIke2ZpbGVOYW1lSGVhZH1fMV9jaGFuZ2luZy55YW1sXCIgYW5kIGAgK1xyXG5cdFx0XHRcdFx0YFwiJHtmaWxlTmFtZUhlYWR9XzJfJHt0YXJnZXR9X2FmdGVyX2Fuc3dlci55YW1sYCk7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGJhY2tVcCAhPT0gc291cmNlKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYEVycm9yOiBkaWZmZXJlbnQgYmV0d2VlbiBgICtcclxuXHRcdFx0XHRcdGBcIiR7ZmlsZU5hbWVIZWFkfV8xX2NoYW5naW5nLnlhbWwuYmFja3VwXCIgYW5kIGAgK1xyXG5cdFx0XHRcdFx0YFwiJHtmaWxlTmFtZUhlYWR9XzEueWFtbFwiYCk7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRlbGV0ZUZpbGUoY2hhbmdpbmdGaWxlUGF0aCk7XHJcblx0XHRcdGRlbGV0ZUZpbGUoYmFja1VwRmlsZVBhdGgpO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuLy8gVGVzdE9mQ2hhbmdlRXJyb3JcclxuYXN5bmMgZnVuY3Rpb24gIFRlc3RPZkNoYW5nZUVycm9yKCkge1xyXG5cdGxldCAgcmV0dXJuczogUHJvY2Vzc1JldHVybnM7XHJcblxyXG5cdGNvbnN0IGZpbGVOYW1lSGVhZHM6IHtbbmFtZTogc3RyaW5nXTogYW55fSA9IHtcclxuXHRcdFwiMl9jaGFuZ2VfMl9lcnJvclwiOiB7bG9jYWxlOiBcIi0tdGVzdCAtLWxvY2FsZSBlbi1VU1wifSxcclxuXHRcdFwiMl9jaGFuZ2VfNF9KYXBhbmVzZVwiOiB7bG9jYWxlOiBcIi0tdGVzdCAtLWxvY2FsZSBqYS1KUFwifSxcclxuXHR9O1xyXG5cdGZvciAoY29uc3QgZmlsZU5hbWVIZWFkIGluIGZpbGVOYW1lSGVhZHMpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBUZXN0Q2FzZTogVGVzdE9mQ2hhbmdlRXJyb3IgPj4gJHtmaWxlTmFtZUhlYWR9YCk7XHJcblx0XHRjb25zdCAgY2FzZURhdGEgPSBmaWxlTmFtZUhlYWRzW2ZpbGVOYW1lSGVhZF07XHJcblx0XHRjb25zdCAgc291cmNlRmlsZVBhdGggICAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzEueWFtbFwiO1xyXG5cdFx0Y29uc3QgIGJhY2tVcEZpbGVQYXRoICAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xX2NoYW5naW5nLnlhbWwuYmFja3VwXCI7XHJcblx0XHRjb25zdCAgY2hhbmdpbmdGaWxlUGF0aCAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzFfY2hhbmdpbmcueWFtbFwiO1xyXG5cdFx0Y29uc3QgIGFuc3dlckZpbGVQYXRoICAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8yX2FmdGVyX2Fuc3dlci55YW1sXCI7XHJcblx0XHRjb25zdCAgbG9nQW5zd2VyRmlsZVBhdGggPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzNfYW5zd2VyLnR4dFwiO1xyXG5cdFx0ZGVsZXRlRmlsZShjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHRcdGRlbGV0ZUZpbGUoYmFja1VwRmlsZVBhdGgpO1xyXG5cdFx0ZnMuY29weUZpbGVTeW5jKHNvdXJjZUZpbGVQYXRoLCBjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHJcblx0XHQvLyBUZXN0IE1haW5cclxuXHRcdHJldHVybnMgPSBhd2FpdCBjYWxsQ2hpbGRQcm9jY2Vzcyhgbm9kZSAke3NjcmlwdFBhdGh9ICR7Y2FzZURhdGEubG9jYWxlfWAsXHJcblx0XHRcdHtpbnB1dExpbmVzOiBbXHJcblx0XHRcdFx0Y2hhbmdpbmdGaWxlUGF0aCxcclxuXHRcdFx0XHRcIjRcIixcclxuXHRcdFx0XHRcIktleTM6IHZhbHVlM2NoYW5nZWRcIixcclxuXHRcdFx0XHRcImV4aXRcIixcclxuXHRcdFx0XX1cclxuXHRcdCk7XHJcblx0XHRjb25zdCAgY2hhbmdpbmcgPSBmcy5yZWFkRmlsZVN5bmMoY2hhbmdpbmdGaWxlUGF0aCkudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHRcdGNvbnN0ICBhbnN3ZXIgICA9IGZzLnJlYWRGaWxlU3luYyhhbnN3ZXJGaWxlUGF0aCkudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHRcdGNvbnN0ICBsb2dBbnN3ZXIgPSBmcy5yZWFkRmlsZVN5bmMobG9nQW5zd2VyRmlsZVBhdGgpLnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblxyXG5cdFx0Ly8gQ2hlY2tcclxuXHRcdGlmIChyZXR1cm5zLnN0ZG91dCAhPT0gbG9nQW5zd2VyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvcjogZGlmZmVyZW50IGJldHdlZW4gXCJfb3V0cHV0LnR4dFwiIGFuZCBcIicgKyBmaWxlTmFtZUhlYWQgKyAnXzNfYW5zd2VyLnR4dFwiJyk7XHJcblx0XHRcdGZzLndyaXRlRmlsZVN5bmModGVzdEZvbGRlclBhdGggKyBcIl9vdXRwdXQudHh0XCIsIHJldHVybnMuc3Rkb3V0KTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHR9XHJcblx0XHRpZiAoY2hhbmdpbmcgIT09IGFuc3dlcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgRXJyb3I6IGRpZmZlcmVudCBiZXR3ZWVuIGAgK1xyXG5cdFx0XHRcdGBcIiR7ZmlsZU5hbWVIZWFkfV8xX2NoYW5naW5nLnlhbWxcIiBhbmQgYCArXHJcblx0XHRcdFx0YFwiJHtmaWxlTmFtZUhlYWR9XzJfYWZ0ZXJfYW5zd2VyLnlhbWxcImApO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH1cclxuXHJcblx0XHRkZWxldGVGaWxlKGNoYW5naW5nRmlsZVBhdGgpO1xyXG5cdFx0ZGVsZXRlRmlsZShiYWNrVXBGaWxlUGF0aCk7XHJcblx0fVxyXG59XHJcblxyXG4vLyBUZXN0T2ZGaWxlQ2hlY2tcclxuYXN5bmMgZnVuY3Rpb24gIFRlc3RPZkZpbGVDaGVjaygpIHtcclxuXHRsZXQgIHJldHVybnM6IFByb2Nlc3NSZXR1cm5zO1xyXG5cclxuXHRpZiAoZGVidWcpIHtcclxuXHRcdHZhciBmaWxlTmFtZUhlYWRzOiB7W25hbWU6IHN0cmluZ106IG51bWJlcn0gPSB7XHJcblx0Ly9cdFx0XCJmaWxlXzFfb2tfYW5kX2JhZFwiOiAxLFxyXG5cdFx0XHRcImZpbGVfMl90YWJcIjogMSxcclxuXHRcdFx0XCJmaWxlXzNfZmlsZV9uYW1lXCI6IDEsXHJcblx0XHR9O1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgZmlsZU5hbWVIZWFkczoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG5cdFx0XHRcImZpbGVfMV9va19hbmRfYmFkXCI6IDEsXHJcblx0Ly9cdFx0XCJmaWxlXzJfdGFiXCI6IDEsXHJcblx0Ly9cdFx0XCJmaWxlXzNfZmlsZV9uYW1lXCI6IDEsXHJcblx0XHR9O1xyXG5cdH1cclxuXHRmb3IgKGNvbnN0IGZpbGVOYW1lSGVhZCBpbiBmaWxlTmFtZUhlYWRzKSB7XHJcblx0XHRjb25zdCAgY2FzZUNvdW50ID0gZmlsZU5hbWVIZWFkc1tmaWxlTmFtZUhlYWRdO1xyXG5cdFx0Zm9yIChsZXQgdGFyZ2V0ID0gMTsgIHRhcmdldCA8PSBjYXNlQ291bnQ7ICB0YXJnZXQrPTEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFRlc3RDYXNlOiBUZXN0T2ZGaWxlQ2hlY2sgPj4gJHtmaWxlTmFtZUhlYWR9ID4+ICR7dGFyZ2V0fWApO1xyXG5cdFx0XHRjb25zdCAgc291cmNlRmlsZVBhdGggICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMS55YW1sXCI7XHJcblx0XHRcdGNvbnN0ICBiYWNrVXBGaWxlUGF0aCAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xX2NoYW5naW5nLnlhbWwuYmFja3VwXCI7XHJcblx0XHRcdGNvbnN0ICBjaGFuZ2luZ0ZpbGVQYXRoID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xX2NoYW5naW5nLnlhbWxcIjtcclxuXHRcdFx0ZGVsZXRlRmlsZShjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHRcdFx0ZGVsZXRlRmlsZShiYWNrVXBGaWxlUGF0aCk7XHJcblx0XHRcdGZzLmNvcHlGaWxlU3luYyhzb3VyY2VGaWxlUGF0aCwgY2hhbmdpbmdGaWxlUGF0aCk7XHJcblxyXG5cdFx0XHQvLyBUZXN0IE1haW5cclxuXHRcdFx0bGV0ICBpbnB1dExpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0XHRpZiAoZmlsZU5hbWVIZWFkID09PSAnZmlsZV8xX29rX2FuZF9iYWQnKSB7XHJcblx0XHRcdFx0aW5wdXRMaW5lcyA9IFtcclxuXHRcdFx0XHRcdGNoYW5naW5nRmlsZVBhdGgsXHJcblx0XHRcdFx0XHRcIjZcIixcclxuXHRcdFx0XHRcdFwiX19Vc2VyX186IHVzZXIyXCIsXHJcblx0XHRcdFx0XHRcIlwiLFxyXG5cdFx0XHRcdFx0XCJleGl0XCIsXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpbnB1dExpbmVzID0gW1xyXG5cdFx0XHRcdFx0Y2hhbmdpbmdGaWxlUGF0aCxcclxuXHRcdFx0XHRcdFwiZXhpdFwiLFxyXG5cdFx0XHRcdF07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybnMgPSBhd2FpdCBjYWxsQ2hpbGRQcm9jY2Vzcyhgbm9kZSAke3NjcmlwdFBhdGh9IC0tdGVzdCAtLWxvY2FsZSBlbi1VU2AsIHtpbnB1dExpbmVzfSk7XHJcblx0XHRcdGNvbnN0ICBhbnN3ZXIgPSBmcy5yZWFkRmlsZVN5bmModGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl80X2Fuc3dlci50eHRcIilcclxuXHRcdFx0XHQudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHJcblx0XHRcdC8vIENoZWNrXHJcblx0XHRcdGlmIChyZXR1cm5zLnN0ZG91dCAhPT0gYW5zd2VyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yOiBkaWZmZXJlbnQgYmV0d2VlbiBcIl9vdXRwdXQudHh0XCIgYW5kIFwiJyArIGZpbGVOYW1lSGVhZCArICdfNF9hbnN3ZXIudHh0XCInKTtcclxuXHRcdFx0XHRmcy53cml0ZUZpbGVTeW5jKHRlc3RGb2xkZXJQYXRoICsgXCJfb3V0cHV0LnR4dFwiLCByZXR1cm5zLnN0ZG91dCk7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn1cdFxyXG5cclxuLy8gY2FsbENoaWxkUHJvY2Nlc3NcclxuYXN5bmMgZnVuY3Rpb24gIGNhbGxDaGlsZFByb2NjZXNzKGNvbW1hbmRMaW5lOiBzdHJpbmcsICBvcHRpb24/OiBQcm9jZXNzT3B0aW9uKTogUHJvbWlzZTxQcm9jZXNzUmV0dXJucz4ge1xyXG5cdHJldHVybiAgIG5ldyBQcm9taXNlKCBhc3luYyAocmVzb2x2ZUZ1bmN0aW9uLCByZWplY3RGdW5jdGlvbikgPT4ge1xyXG5cdFx0Y29uc3QgIHJldHVyblZhbHVlID0gbmV3IFByb2Nlc3NSZXR1cm5zKCk7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRjb25zdCAgY2hpbGRQcm9jZXNzID0gY2hpbGRfcHJvY2Vzcy5leGVjKCBjb21tYW5kTGluZSxcclxuXHJcblx0XHRcdFx0Ly8gb24gY2xvc2UgdGhlIFwiY2hpbGRQcm9jZXNzXCIgKDIpXHJcblx0XHRcdFx0KGVycm9yOiBjaGlsZF9wcm9jZXNzLkV4ZWNFeGNlcHRpb24gfCBudWxsLCBzdGRvdXQ6IHN0cmluZywgc3RkZXJyOiBzdHJpbmcpID0+IHtcclxuXHRcdFx0XHRcdHJldHVyblZhbHVlLnN0ZG91dCA9IHN0ZG91dDtcclxuXHRcdFx0XHRcdHJldHVyblZhbHVlLnN0ZGVyciA9IHN0ZGVycjtcclxuXHRcdFx0XHRcdHJlc29sdmVGdW5jdGlvbihyZXR1cm5WYWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRpZiAob3B0aW9uICYmIGNoaWxkUHJvY2Vzcy5zdGRpbikge1xyXG5cclxuXHRcdFx0XHRpZiAob3B0aW9uLmlucHV0TGluZXMpIHtcclxuXHRcdFx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDApKTtcclxuXHRcdFx0XHRcdGZvciAoY29uc3QgaW5wdXRMaW5lIG9mIG9wdGlvbi5pbnB1dExpbmVzKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKGlucHV0TGluZSk7XHJcblx0XHRcdFx0XHRcdGNoaWxkUHJvY2Vzcy5zdGRpbi53cml0ZShpbnB1dExpbmUgKyBcIlxcblwiKTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMCkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjaGlsZFByb2Nlc3Muc3RkaW4uZW5kKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIG9uIGNsb3NlIHRoZSBcImNoaWxkUHJvY2Vzc1wiICgxKVxyXG5cdFx0XHRjaGlsZFByb2Nlc3Mub24oJ2Nsb3NlJywgKGV4aXRDb2RlOiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRyZXR1cm5WYWx1ZS5leGl0Q29kZSA9IGV4aXRDb2RlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0Y2hpbGRQcm9jZXNzLm9uKCdleGl0JywgKGV4aXRDb2RlOiBudW1iZXIpID0+IHtcclxuXHRcdFx0XHRyZXR1cm5WYWx1ZS5leGl0Q29kZSA9IGV4aXRDb2RlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0dGhyb3cgRXJyb3IoYEVycm9yIGluIHRoZSBjb21tYW5kIGxpbmUgJHtjb21tYW5kTGluZX1gKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuLy8gZGVsZXRlRmlsZVxyXG5mdW5jdGlvbiAgZGVsZXRlRmlsZShwYXRoOiBzdHJpbmcpIHtcclxuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGgpKSB7XHJcbiAgICAgICAgZnMudW5saW5rU3luYyhwYXRoKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gUHJvY2Vzc09wdGlvblxyXG5jbGFzcyBQcm9jZXNzT3B0aW9uIHtcclxuXHRpbnB1dExpbmVzPzogc3RyaW5nW107XHJcbn1cclxuXHJcbi8vIFByb2Nlc3NSZXR1cm5zXHJcbmNsYXNzIFByb2Nlc3NSZXR1cm5zIHtcclxuXHRleGl0Q29kZTogbnVtYmVyID0gMDtcclxuXHRzdGRvdXQ6IHN0cmluZyA9ICcnO1xyXG5cdHN0ZGVycjogc3RyaW5nID0gJyc7XHJcbn1cclxuXHJcbmNvbnN0ICBjdXRCT00gPSAxO1xyXG5jb25zdCAgbm90Rm91bmQgPSAtMTtcclxubWFpbigpOyJdfQ==