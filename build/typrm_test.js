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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TestOfCheck()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, TestOfChange()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, TestOfChangeError()];
                case 3:
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
                    if (!(target < caseCount)) return [3 /*break*/, 5];
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
                            "25",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm1fdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90eXBybV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUJBQXlCO0FBQ3pCLDZDQUErQztBQUUvQyxJQUFPLFVBQVUsR0FBSSxtQkFBbUIsQ0FBQztBQUN6QyxJQUFPLGNBQWMsR0FBRyxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBRTVDLFNBQWdCLElBQUk7Ozs7d0JBQ25CLHFCQUFNLFdBQVcsRUFBRSxFQUFBOztvQkFBbkIsU0FBbUIsQ0FBQztvQkFDcEIscUJBQU0sWUFBWSxFQUFFLEVBQUE7O29CQUFwQixTQUFvQixDQUFDO29CQUNyQixxQkFBTSxpQkFBaUIsRUFBRSxFQUFBOztvQkFBekIsU0FBeUIsQ0FBQztvQkFDMUIsVUFBVSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUMsQ0FBQztvQkFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Q0FDcEI7QUFFRCxTQUFnQixXQUFXOzs7Ozs7b0JBR3BCLGFBQWEsR0FBRzt3QkFDckIsaUJBQWlCO3dCQUNqQixvQkFBb0I7d0JBQ3BCLGFBQWE7d0JBQ2IsNEJBQTRCO3dCQUM1QixZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZ0JBQWdCO3dCQUNoQixpQkFBaUI7cUJBQ2pCLENBQUM7MEJBQ3NDLEVBQWIsK0JBQWE7Ozt5QkFBYixDQUFBLDJCQUFhLENBQUE7b0JBQTdCLFlBQVk7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQTRCLFlBQWMsQ0FBQyxDQUFDO29CQUc5QyxxQkFBTSxpQkFBaUIsQ0FBQyxVQUFRLFVBQVUsMkJBQXdCLEVBQzNFLEVBQUMsVUFBVSxFQUFFO2dDQUNaLGNBQWMsR0FBRyxZQUFZLEdBQUcsU0FBUztnQ0FDekMsTUFBTTs2QkFDTixFQUFDLENBQ0YsRUFBQTs7b0JBTkQsWUFBWTtv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QUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRCxpQkFBaUI7QUFDakI7SUFBQTtRQUNDLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixXQUFNLEdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQsSUFBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLElBQU8sUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLElBQUksRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgKiBhcyBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5cclxuY29uc3QgIHNjcmlwdFBhdGggPSAgYC4uL2J1aWxkL3R5cHJtLmpzYDtcclxuY29uc3QgIHRlc3RGb2xkZXJQYXRoID0gYC4vdGVzdF9kYXRhYCArIFwiL1wiO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gIG1haW4oKSB7XHJcblx0YXdhaXQgVGVzdE9mQ2hlY2soKTtcclxuXHRhd2FpdCBUZXN0T2ZDaGFuZ2UoKTtcclxuXHRhd2FpdCBUZXN0T2ZDaGFuZ2VFcnJvcigpO1xyXG5cdGRlbGV0ZUZpbGUodGVzdEZvbGRlclBhdGggKyAnX291dHB1dC50eHQnKTtcclxuXHRjb25zb2xlLmxvZygnUGFzcycpO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiAgVGVzdE9mQ2hlY2soKSB7XHJcblx0bGV0ICByZXR1cm5zOiBQcm9jZXNzUmV0dXJucztcclxuXHJcblx0Y29uc3QgZmlsZU5hbWVIZWFkcyA9IFtcclxuXHRcdFwiMV90ZW1wbGF0ZV8xX29rXCIsXHJcblx0XHRcIjFfdGVtcGxhdGVfMl9lcnJvclwiLFxyXG5cdFx0XCJub3dfMV9lcnJvclwiLFxyXG5cdFx0XCJub3dfMl9lcnJvcl90ZW1wbGF0ZV9lcnJvclwiLFxyXG5cdFx0XCJyZWZlcl8xX29rXCIsXHJcblx0XHRcInJlZmVyXzJfZXJyb3JcIixcclxuXHRcdFwic2VjcmV0XzFfZXJyb3JcIixcclxuXHRcdFwidmFyX3JlZl8xX2Vycm9yXCIsXHJcblx0XTtcclxuXHRmb3IgKGNvbnN0IGZpbGVOYW1lSGVhZCBvZiBmaWxlTmFtZUhlYWRzKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgVGVzdENhc2U6IFRlc3RPZkNoZWNrID4+ICR7ZmlsZU5hbWVIZWFkfWApO1xyXG5cclxuXHRcdC8vIFRlc3QgTWFpblxyXG5cdFx0cmV0dXJucyA9IGF3YWl0IGNhbGxDaGlsZFByb2NjZXNzKGBub2RlICR7c2NyaXB0UGF0aH0gLS10ZXN0IC0tbG9jYWxlIGVuLVVTYCxcclxuXHRcdFx0e2lucHV0TGluZXM6IFtcclxuXHRcdFx0XHR0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzEueWFtbFwiLFxyXG5cdFx0XHRcdFwiZXhpdFwiXHJcblx0XHRcdF19XHJcblx0XHQpO1xyXG5cdFx0Y29uc3QgIGFuc3dlciA9IGZzLnJlYWRGaWxlU3luYyh0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzNfYW5zd2VyLnR4dFwiKVxyXG5cdFx0XHQudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHJcblx0XHQvLyBDaGVja1xyXG5cdFx0aWYgKHJldHVybnMuc3Rkb3V0ICE9PSBhbnN3ZXIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yOiBkaWZmZXJlbnQgYmV0d2VlbiBcIl9vdXRwdXQudHh0XCIgYW5kIFwiJyArIGZpbGVOYW1lSGVhZCArICdfM19hbnN3ZXIudHh0XCInKTtcclxuXHRcdFx0ZnMud3JpdGVGaWxlU3luYyh0ZXN0Rm9sZGVyUGF0aCArIFwiX291dHB1dC50eHRcIiwgcmV0dXJucy5zdGRvdXQpO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vIFRlc3RPZkNoYW5nZVxyXG5hc3luYyBmdW5jdGlvbiAgVGVzdE9mQ2hhbmdlKCkge1xyXG5cdGxldCAgcmV0dXJuczogUHJvY2Vzc1JldHVybnM7XHJcblxyXG5cdGNvbnN0IGZpbGVOYW1lSGVhZHM6IHtbbmFtZTogc3RyaW5nXTogbnVtYmVyfSA9IHtcclxuXHRcdFwiMl9jaGFuZ2VfMV9va1wiOiAyLFxyXG5cdFx0XCIyX2NoYW5nZV8zX0VuZ2xpc2hcIjogMSxcclxuXHR9O1xyXG5cdGZvciAoY29uc3QgZmlsZU5hbWVIZWFkIGluIGZpbGVOYW1lSGVhZHMpIHtcclxuXHRcdGNvbnN0ICBjYXNlQ291bnQgPSBmaWxlTmFtZUhlYWRzW2ZpbGVOYW1lSGVhZF07XHJcblx0XHRmb3IgKGxldCB0YXJnZXQgPSAxOyAgdGFyZ2V0IDwgY2FzZUNvdW50OyAgdGFyZ2V0Kz0xKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBUZXN0Q2FzZTogVGVzdE9mQ2hhbmdlID4+ICR7ZmlsZU5hbWVIZWFkfSA+PiAke3RhcmdldH1gKTtcclxuXHRcdFx0Y29uc3QgIHNvdXJjZUZpbGVQYXRoICAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzEueWFtbFwiO1xyXG5cdFx0XHRjb25zdCAgYmFja1VwRmlsZVBhdGggICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMV9jaGFuZ2luZy55YW1sLmJhY2t1cFwiO1xyXG5cdFx0XHRjb25zdCAgY2hhbmdpbmdGaWxlUGF0aCA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMV9jaGFuZ2luZy55YW1sXCI7XHJcblx0XHRcdGNvbnN0ICBhbnN3ZXJGaWxlUGF0aCAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBgXzJfJHt0YXJnZXR9X2FmdGVyX2Fuc3dlci55YW1sYDtcclxuXHRcdFx0ZGVsZXRlRmlsZShjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHRcdFx0ZGVsZXRlRmlsZShiYWNrVXBGaWxlUGF0aCk7XHJcblx0XHRcdGZzLmNvcHlGaWxlU3luYyhzb3VyY2VGaWxlUGF0aCwgY2hhbmdpbmdGaWxlUGF0aCk7XHJcblxyXG5cdFx0XHQvLyBUZXN0IE1haW5cclxuXHRcdFx0bGV0ICBpbnB1dExpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cdFx0XHRpZiAoZmlsZU5hbWVIZWFkID09PSAnMl9jaGFuZ2VfMV9vaycpIHtcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSAxKSB7XHJcblx0XHRcdFx0XHRpbnB1dExpbmVzID0gW1xyXG5cdFx0XHRcdFx0XHRjaGFuZ2luZ0ZpbGVQYXRoLFxyXG5cdFx0XHRcdFx0XHRcIjEwXCIsXHJcblx0XHRcdFx0XHRcdFwia2V5MTogdmFsdWUxY2hhbmdlZFwiLFxyXG5cdFx0XHRcdFx0XHRcIiAgX19LZXkyX186IHZhbHVlMmNoYW5nZWQgICPjgrPjg6Hjg7Pjg4ggIFwiLFxyXG5cdFx0XHRcdFx0XHRcIktleTM6IHZhbHVlM2NoYW5nZWQgICPjgrPjg6Hjg7Pjg4hcIixcclxuXHRcdFx0XHRcdFx0XCJcIixcclxuXHRcdFx0XHRcdFx0XCJleGl0XCIsXHJcblx0XHRcdFx0XHRdO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpbnB1dExpbmVzID0gIFtcclxuXHRcdFx0XHRcdFx0Y2hhbmdpbmdGaWxlUGF0aCxcclxuXHRcdFx0XHRcdFx0XCIyOVwiLFxyXG5cdFx0XHRcdFx0XHRcImtleTE6IHZhbHVlMTFjaGFuZ2VkXCIsXHJcblx0XHRcdFx0XHRcdFwiXCIsXHJcblx0XHRcdFx0XHRcdFwiZXhpdFwiLFxyXG5cdFx0XHRcdFx0XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSBpZiAoZmlsZU5hbWVIZWFkID09PSAnMl9jaGFuZ2VfM19FbmdsaXNoJykge1xyXG5cdFx0XHRcdGlucHV0TGluZXMgPSAgW1xyXG5cdFx0XHRcdFx0Y2hhbmdpbmdGaWxlUGF0aCxcclxuXHRcdFx0XHRcdFwiMjVcIixcclxuXHRcdFx0XHRcdFwia2V5MTogdmFsdWUxMWNoYW5nZWRcIixcclxuXHRcdFx0XHRcdFwiXCIsXHJcblx0XHRcdFx0XHRcImV4aXRcIixcclxuXHRcdFx0XHRdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm5zID0gYXdhaXQgY2FsbENoaWxkUHJvY2Nlc3MoYG5vZGUgJHtzY3JpcHRQYXRofSAtLXRlc3QgLS1sb2NhbGUgZW4tVVNgLCB7aW5wdXRMaW5lc30pO1xyXG5cdFx0XHRjb25zdCAgc291cmNlICAgPSBmcy5yZWFkRmlsZVN5bmMoc291cmNlRmlsZVBhdGgpLnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblx0XHRcdGNvbnN0ICBjaGFuZ2luZyA9IGZzLnJlYWRGaWxlU3luYyhjaGFuZ2luZ0ZpbGVQYXRoKS50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cdFx0XHRjb25zdCAgYW5zd2VyICAgPSBmcy5yZWFkRmlsZVN5bmMoYW5zd2VyRmlsZVBhdGgpLnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblx0XHRcdGNvbnN0ICBiYWNrVXAgICA9IGZzLnJlYWRGaWxlU3luYyhiYWNrVXBGaWxlUGF0aCkudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHJcblx0XHRcdC8vIENoZWNrXHJcblx0XHRcdGlmIChjaGFuZ2luZyAhPT0gYW5zd2VyKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coYEVycm9yOiBkaWZmZXJlbnQgYmV0d2VlbiBgICtcclxuXHRcdFx0XHRcdGBcIiR7ZmlsZU5hbWVIZWFkfV8xX2NoYW5naW5nLnlhbWxcIiBhbmQgYCArXHJcblx0XHRcdFx0XHRgXCIke2ZpbGVOYW1lSGVhZH1fMl8ke3RhcmdldH1fYWZ0ZXJfYW5zd2VyLnlhbWxgKTtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoYmFja1VwICE9PSBzb3VyY2UpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgRXJyb3I6IGRpZmZlcmVudCBiZXR3ZWVuIGAgK1xyXG5cdFx0XHRcdFx0YFwiJHtmaWxlTmFtZUhlYWR9XzFfY2hhbmdpbmcueWFtbC5iYWNrdXBcIiBhbmQgYCArXHJcblx0XHRcdFx0XHRgXCIke2ZpbGVOYW1lSGVhZH1fMS55YW1sXCJgKTtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZGVsZXRlRmlsZShjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHRcdFx0ZGVsZXRlRmlsZShiYWNrVXBGaWxlUGF0aCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBUZXN0T2ZDaGFuZ2VFcnJvclxyXG5hc3luYyBmdW5jdGlvbiAgVGVzdE9mQ2hhbmdlRXJyb3IoKSB7XHJcblx0bGV0ICByZXR1cm5zOiBQcm9jZXNzUmV0dXJucztcclxuXHJcblx0Y29uc3QgZmlsZU5hbWVIZWFkczoge1tuYW1lOiBzdHJpbmddOiBhbnl9ID0ge1xyXG5cdFx0XCIyX2NoYW5nZV8yX2Vycm9yXCI6IHtsb2NhbGU6IFwiLS10ZXN0IC0tbG9jYWxlIGVuLVVTXCJ9LFxyXG5cdFx0XCIyX2NoYW5nZV80X0phcGFuZXNlXCI6IHtsb2NhbGU6IFwiLS10ZXN0IC0tbG9jYWxlIGphLUpQXCJ9LFxyXG5cdH07XHJcblx0Zm9yIChjb25zdCBmaWxlTmFtZUhlYWQgaW4gZmlsZU5hbWVIZWFkcykge1xyXG5cdFx0Y29uc29sZS5sb2coYFRlc3RDYXNlOiBUZXN0T2ZDaGFuZ2VFcnJvciA+PiAke2ZpbGVOYW1lSGVhZH1gKTtcclxuXHRcdGNvbnN0ICBjYXNlRGF0YSA9IGZpbGVOYW1lSGVhZHNbZmlsZU5hbWVIZWFkXTtcclxuXHRcdGNvbnN0ICBzb3VyY2VGaWxlUGF0aCAgICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMS55YW1sXCI7XHJcblx0XHRjb25zdCAgYmFja1VwRmlsZVBhdGggICAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzFfY2hhbmdpbmcueWFtbC5iYWNrdXBcIjtcclxuXHRcdGNvbnN0ICBjaGFuZ2luZ0ZpbGVQYXRoICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMV9jaGFuZ2luZy55YW1sXCI7XHJcblx0XHRjb25zdCAgYW5zd2VyRmlsZVBhdGggICAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzJfYWZ0ZXJfYW5zd2VyLnlhbWxcIjtcclxuXHRcdGNvbnN0ICBsb2dBbnN3ZXJGaWxlUGF0aCA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfM19hbnN3ZXIudHh0XCI7XHJcblx0XHRkZWxldGVGaWxlKGNoYW5naW5nRmlsZVBhdGgpO1xyXG5cdFx0ZGVsZXRlRmlsZShiYWNrVXBGaWxlUGF0aCk7XHJcblx0XHRmcy5jb3B5RmlsZVN5bmMoc291cmNlRmlsZVBhdGgsIGNoYW5naW5nRmlsZVBhdGgpO1xyXG5cclxuXHRcdC8vIFRlc3QgTWFpblxyXG5cdFx0cmV0dXJucyA9IGF3YWl0IGNhbGxDaGlsZFByb2NjZXNzKGBub2RlICR7c2NyaXB0UGF0aH0gJHtjYXNlRGF0YS5sb2NhbGV9YCxcclxuXHRcdFx0e2lucHV0TGluZXM6IFtcclxuXHRcdFx0XHRjaGFuZ2luZ0ZpbGVQYXRoLFxyXG5cdFx0XHRcdFwiNFwiLFxyXG5cdFx0XHRcdFwiS2V5MzogdmFsdWUzY2hhbmdlZFwiLFxyXG5cdFx0XHRcdFwiZXhpdFwiLFxyXG5cdFx0XHRdfVxyXG5cdFx0KTtcclxuXHRcdGNvbnN0ICBjaGFuZ2luZyA9IGZzLnJlYWRGaWxlU3luYyhjaGFuZ2luZ0ZpbGVQYXRoKS50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cdFx0Y29uc3QgIGFuc3dlciAgID0gZnMucmVhZEZpbGVTeW5jKGFuc3dlckZpbGVQYXRoKS50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cdFx0Y29uc3QgIGxvZ0Fuc3dlciA9IGZzLnJlYWRGaWxlU3luYyhsb2dBbnN3ZXJGaWxlUGF0aCkudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHJcblx0XHQvLyBDaGVja1xyXG5cdFx0aWYgKHJldHVybnMuc3Rkb3V0ICE9PSBsb2dBbnN3ZXIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0Vycm9yOiBkaWZmZXJlbnQgYmV0d2VlbiBcIl9vdXRwdXQudHh0XCIgYW5kIFwiJyArIGZpbGVOYW1lSGVhZCArICdfM19hbnN3ZXIudHh0XCInKTtcclxuXHRcdFx0ZnMud3JpdGVGaWxlU3luYyh0ZXN0Rm9sZGVyUGF0aCArIFwiX291dHB1dC50eHRcIiwgcmV0dXJucy5zdGRvdXQpO1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdH1cclxuXHRcdGlmIChjaGFuZ2luZyAhPT0gYW5zd2VyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGBFcnJvcjogZGlmZmVyZW50IGJldHdlZW4gYCArXHJcblx0XHRcdFx0YFwiJHtmaWxlTmFtZUhlYWR9XzFfY2hhbmdpbmcueWFtbFwiIGFuZCBgICtcclxuXHRcdFx0XHRgXCIke2ZpbGVOYW1lSGVhZH1fMl9hZnRlcl9hbnN3ZXIueWFtbFwiYCk7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGRlbGV0ZUZpbGUoY2hhbmdpbmdGaWxlUGF0aCk7XHJcblx0XHRkZWxldGVGaWxlKGJhY2tVcEZpbGVQYXRoKTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGNhbGxDaGlsZFByb2NjZXNzXHJcbmFzeW5jIGZ1bmN0aW9uICBjYWxsQ2hpbGRQcm9jY2Vzcyhjb21tYW5kTGluZTogc3RyaW5nLCAgb3B0aW9uPzogUHJvY2Vzc09wdGlvbik6IFByb21pc2U8UHJvY2Vzc1JldHVybnM+IHtcclxuXHRyZXR1cm4gICBuZXcgUHJvbWlzZSggYXN5bmMgKHJlc29sdmVGdW5jdGlvbiwgcmVqZWN0RnVuY3Rpb24pID0+IHtcclxuXHRcdGNvbnN0ICByZXR1cm5WYWx1ZSA9IG5ldyBQcm9jZXNzUmV0dXJucygpO1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0Y29uc3QgIGNoaWxkUHJvY2VzcyA9IGNoaWxkX3Byb2Nlc3MuZXhlYyggY29tbWFuZExpbmUsXHJcblxyXG5cdFx0XHRcdC8vIG9uIGNsb3NlIHRoZSBcImNoaWxkUHJvY2Vzc1wiICgyKVxyXG5cdFx0XHRcdChlcnJvcjogY2hpbGRfcHJvY2Vzcy5FeGVjRXhjZXB0aW9uIHwgbnVsbCwgc3Rkb3V0OiBzdHJpbmcsIHN0ZGVycjogc3RyaW5nKSA9PiB7XHJcblx0XHRcdFx0XHRyZXR1cm5WYWx1ZS5zdGRvdXQgPSBzdGRvdXQ7XHJcblx0XHRcdFx0XHRyZXR1cm5WYWx1ZS5zdGRlcnIgPSBzdGRlcnI7XHJcblx0XHRcdFx0XHRyZXNvbHZlRnVuY3Rpb24ocmV0dXJuVmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0KTtcclxuXHRcdFx0aWYgKG9wdGlvbiAmJiBjaGlsZFByb2Nlc3Muc3RkaW4pIHtcclxuXHJcblx0XHRcdFx0aWYgKG9wdGlvbi5pbnB1dExpbmVzKSB7XHJcblx0XHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMzAwKSk7XHJcblx0XHRcdFx0XHRmb3IgKGNvbnN0IGlucHV0TGluZSBvZiBvcHRpb24uaW5wdXRMaW5lcykge1xyXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhpbnB1dExpbmUpO1xyXG5cdFx0XHRcdFx0XHRjaGlsZFByb2Nlc3Muc3RkaW4ud3JpdGUoaW5wdXRMaW5lICsgXCJcXG5cIik7XHJcblx0XHRcdFx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDApKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2hpbGRQcm9jZXNzLnN0ZGluLmVuZCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBvbiBjbG9zZSB0aGUgXCJjaGlsZFByb2Nlc3NcIiAoMSlcclxuXHRcdFx0Y2hpbGRQcm9jZXNzLm9uKCdjbG9zZScsIChleGl0Q29kZTogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuVmFsdWUuZXhpdENvZGUgPSBleGl0Q29kZTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGNoaWxkUHJvY2Vzcy5vbignZXhpdCcsIChleGl0Q29kZTogbnVtYmVyKSA9PiB7XHJcblx0XHRcdFx0cmV0dXJuVmFsdWUuZXhpdENvZGUgPSBleGl0Q29kZTtcclxuXHRcdFx0fSk7XHJcblx0XHR9IGNhdGNoIChlKSB7XHJcblx0XHRcdHRocm93IEVycm9yKGBFcnJvciBpbiB0aGUgY29tbWFuZCBsaW5lICR7Y29tbWFuZExpbmV9YCk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbi8vIGRlbGV0ZUZpbGVcclxuZnVuY3Rpb24gIGRlbGV0ZUZpbGUocGF0aDogc3RyaW5nKSB7XHJcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoKSkge1xyXG4gICAgICAgIGZzLnVubGlua1N5bmMocGF0aCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFByb2Nlc3NPcHRpb25cclxuY2xhc3MgUHJvY2Vzc09wdGlvbiB7XHJcblx0aW5wdXRMaW5lcz86IHN0cmluZ1tdO1xyXG59XHJcblxyXG4vLyBQcm9jZXNzUmV0dXJuc1xyXG5jbGFzcyBQcm9jZXNzUmV0dXJucyB7XHJcblx0ZXhpdENvZGU6IG51bWJlciA9IDA7XHJcblx0c3Rkb3V0OiBzdHJpbmcgPSAnJztcclxuXHRzdGRlcnI6IHN0cmluZyA9ICcnO1xyXG59XHJcblxyXG5jb25zdCAgY3V0Qk9NID0gMTtcclxuY29uc3QgIG5vdEZvdW5kID0gLTE7XHJcbm1haW4oKTsiXX0=