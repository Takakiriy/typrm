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
                case 0: 
                /*	await TestOfCheck();
                    await TestOfChange();
                    await TestOfChangeError();
                */ return [4 /*yield*/, TestOfFileCheck()];
                case 1:
                    /*	await TestOfCheck();
                        await TestOfChange();
                        await TestOfChangeError();
                    */ _a.sent();
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
        var returns, fileNameHeads, _a, _b, _i, fileNameHead, caseCount, target, sourceFilePath, backUpFilePath, changingFilePath, inputLines, answer;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    fileNameHeads = {
                        "file_1_ok_and_bad": 1,
                        "file_2_tab": 1,
                        "file_3_file_name": 1
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwcm1fdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90eXBybV90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUJBQXlCO0FBQ3pCLDZDQUErQztBQUUvQyxJQUFPLFVBQVUsR0FBSSxtQkFBbUIsQ0FBQztBQUN6QyxJQUFPLGNBQWMsR0FBRyxhQUFhLEdBQUcsR0FBRyxDQUFDO0FBRTVDLFNBQWdCLElBQUk7Ozs7O2dCQUNwQjs7O2tCQUdFLENBQUMscUJBQU0sZUFBZSxFQUFFLEVBQUE7O29CQUgxQjs7O3NCQUdFLENBQUMsU0FBdUIsQ0FBQztvQkFDMUIsVUFBVSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUMsQ0FBQztvQkFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Q0FDcEI7QUFFRCxTQUFnQixXQUFXOzs7Ozs7b0JBR3BCLGFBQWEsR0FBRzt3QkFDckIsaUJBQWlCO3dCQUNqQixvQkFBb0I7d0JBQ3BCLGFBQWE7d0JBQ2IsNEJBQTRCO3dCQUM1QixZQUFZO3dCQUNaLGVBQWU7d0JBQ2YsZ0JBQWdCO3dCQUNoQixpQkFBaUI7cUJBQ2pCLENBQUM7MEJBQ3NDLEVBQWIsK0JBQWE7Ozt5QkFBYixDQUFBLDJCQUFhLENBQUE7b0JBQTdCLFlBQVk7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQTRCLFlBQWMsQ0FBQyxDQUFDO29CQUc5QyxxQkFBTSxpQkFBaUIsQ0FBQyxVQUFRLFVBQVUsMkJBQXdCLEVBQzNFLEVBQUMsVUFBVSxFQUFFO2dDQUNaLGNBQWMsR0FBRyxZQUFZLEdBQUcsU0FBUztnQ0FDekMsTUFBTTs2QkFDTixFQUFDLENBQ0YsRUFBQTs7b0JBTkQsWUFBWTtvQkFDWixPQUFPLEdBQUcsU0FLVCxDQUFDO29CQUNLLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsR0FB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VUFBQyxRQUFnQjtvQ0FDeEMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0NBQ2pDLENBQUMsQ0FBQyxDQUFDOzs7O2dDQUVILE1BQU0sS0FBSyxDQUFDLCtCQUE2QixXQUFhLENBQUMsQ0FBQzs7OztxQkFFekQsQ0FBQyxFQUFDOzs7Q0FDSDtBQUVELGFBQWE7QUFDYixTQUFVLFVBQVUsQ0FBQyxJQUFZO0lBQzdCLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNyQixFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCO0FBQ0wsQ0FBQztBQUVELGdCQUFnQjtBQUNoQjtJQUFBO0lBRUEsQ0FBQztJQUFELG9CQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRCxpQkFBaUI7QUFDakI7SUFBQTtRQUNDLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFDckIsV0FBTSxHQUFXLEVBQUUsQ0FBQztRQUNwQixXQUFNLEdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFBRCxxQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQsSUFBTyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLElBQU8sUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3JCLElBQUksRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgKiBhcyBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5cclxuY29uc3QgIHNjcmlwdFBhdGggPSAgYC4uL2J1aWxkL3R5cHJtLmpzYDtcclxuY29uc3QgIHRlc3RGb2xkZXJQYXRoID0gYC4vdGVzdF9kYXRhYCArIFwiL1wiO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gIG1haW4oKSB7XHJcbi8qXHRhd2FpdCBUZXN0T2ZDaGVjaygpO1xyXG5cdGF3YWl0IFRlc3RPZkNoYW5nZSgpO1xyXG5cdGF3YWl0IFRlc3RPZkNoYW5nZUVycm9yKCk7XHJcbiovXHRhd2FpdCBUZXN0T2ZGaWxlQ2hlY2soKTtcclxuXHRkZWxldGVGaWxlKHRlc3RGb2xkZXJQYXRoICsgJ19vdXRwdXQudHh0Jyk7XHJcblx0Y29uc29sZS5sb2coJ1Bhc3MnKTtcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gIFRlc3RPZkNoZWNrKCkge1xyXG5cdGxldCAgcmV0dXJuczogUHJvY2Vzc1JldHVybnM7XHJcblxyXG5cdGNvbnN0IGZpbGVOYW1lSGVhZHMgPSBbXHJcblx0XHRcIjFfdGVtcGxhdGVfMV9va1wiLFxyXG5cdFx0XCIxX3RlbXBsYXRlXzJfZXJyb3JcIixcclxuXHRcdFwibm93XzFfZXJyb3JcIixcclxuXHRcdFwibm93XzJfZXJyb3JfdGVtcGxhdGVfZXJyb3JcIixcclxuXHRcdFwicmVmZXJfMV9va1wiLFxyXG5cdFx0XCJyZWZlcl8yX2Vycm9yXCIsXHJcblx0XHRcInNlY3JldF8xX2Vycm9yXCIsXHJcblx0XHRcInZhcl9yZWZfMV9lcnJvclwiLFxyXG5cdF07XHJcblx0Zm9yIChjb25zdCBmaWxlTmFtZUhlYWQgb2YgZmlsZU5hbWVIZWFkcykge1xyXG5cdFx0Y29uc29sZS5sb2coYFRlc3RDYXNlOiBUZXN0T2ZDaGVjayA+PiAke2ZpbGVOYW1lSGVhZH1gKTtcclxuXHJcblx0XHQvLyBUZXN0IE1haW5cclxuXHRcdHJldHVybnMgPSBhd2FpdCBjYWxsQ2hpbGRQcm9jY2Vzcyhgbm9kZSAke3NjcmlwdFBhdGh9IC0tdGVzdCAtLWxvY2FsZSBlbi1VU2AsXHJcblx0XHRcdHtpbnB1dExpbmVzOiBbXHJcblx0XHRcdFx0dGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xLnlhbWxcIixcclxuXHRcdFx0XHRcImV4aXRcIlxyXG5cdFx0XHRdfVxyXG5cdFx0KTtcclxuXHRcdGNvbnN0ICBhbnN3ZXIgPSBmcy5yZWFkRmlsZVN5bmModGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8zX2Fuc3dlci50eHRcIilcclxuXHRcdFx0LnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblxyXG5cdFx0Ly8gQ2hlY2tcclxuXHRcdGlmIChyZXR1cm5zLnN0ZG91dCAhPT0gYW5zd2VyKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdFcnJvcjogZGlmZmVyZW50IGJldHdlZW4gXCJfb3V0cHV0LnR4dFwiIGFuZCBcIicgKyBmaWxlTmFtZUhlYWQgKyAnXzNfYW5zd2VyLnR4dFwiJyk7XHJcblx0XHRcdGZzLndyaXRlRmlsZVN5bmModGVzdEZvbGRlclBhdGggKyBcIl9vdXRwdXQudHh0XCIsIHJldHVybnMuc3Rkb3V0KTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHR9XHJcblx0fVxyXG59XHJcblxyXG4vLyBUZXN0T2ZDaGFuZ2VcclxuYXN5bmMgZnVuY3Rpb24gIFRlc3RPZkNoYW5nZSgpIHtcclxuXHRsZXQgIHJldHVybnM6IFByb2Nlc3NSZXR1cm5zO1xyXG5cclxuXHRjb25zdCBmaWxlTmFtZUhlYWRzOiB7W25hbWU6IHN0cmluZ106IG51bWJlcn0gPSB7XHJcblx0XHRcIjJfY2hhbmdlXzFfb2tcIjogMixcclxuXHRcdFwiMl9jaGFuZ2VfM19FbmdsaXNoXCI6IDEsXHJcblx0fTtcclxuXHRmb3IgKGNvbnN0IGZpbGVOYW1lSGVhZCBpbiBmaWxlTmFtZUhlYWRzKSB7XHJcblx0XHRjb25zdCAgY2FzZUNvdW50ID0gZmlsZU5hbWVIZWFkc1tmaWxlTmFtZUhlYWRdO1xyXG5cdFx0Zm9yIChsZXQgdGFyZ2V0ID0gMTsgIHRhcmdldCA8PSBjYXNlQ291bnQ7ICB0YXJnZXQrPTEpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYFRlc3RDYXNlOiBUZXN0T2ZDaGFuZ2UgPj4gJHtmaWxlTmFtZUhlYWR9ID4+ICR7dGFyZ2V0fWApO1xyXG5cdFx0XHRjb25zdCAgc291cmNlRmlsZVBhdGggICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMS55YW1sXCI7XHJcblx0XHRcdGNvbnN0ICBiYWNrVXBGaWxlUGF0aCAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xX2NoYW5naW5nLnlhbWwuYmFja3VwXCI7XHJcblx0XHRcdGNvbnN0ICBjaGFuZ2luZ0ZpbGVQYXRoID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xX2NoYW5naW5nLnlhbWxcIjtcclxuXHRcdFx0Y29uc3QgIGFuc3dlckZpbGVQYXRoICAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIGBfMl8ke3RhcmdldH1fYWZ0ZXJfYW5zd2VyLnlhbWxgO1xyXG5cdFx0XHRkZWxldGVGaWxlKGNoYW5naW5nRmlsZVBhdGgpO1xyXG5cdFx0XHRkZWxldGVGaWxlKGJhY2tVcEZpbGVQYXRoKTtcclxuXHRcdFx0ZnMuY29weUZpbGVTeW5jKHNvdXJjZUZpbGVQYXRoLCBjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHJcblx0XHRcdC8vIFRlc3QgTWFpblxyXG5cdFx0XHRsZXQgIGlucHV0TGluZXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRcdGlmIChmaWxlTmFtZUhlYWQgPT09ICcyX2NoYW5nZV8xX29rJykge1xyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IDEpIHtcclxuXHRcdFx0XHRcdGlucHV0TGluZXMgPSBbXHJcblx0XHRcdFx0XHRcdGNoYW5naW5nRmlsZVBhdGgsXHJcblx0XHRcdFx0XHRcdFwiMTBcIixcclxuXHRcdFx0XHRcdFx0XCJrZXkxOiB2YWx1ZTFjaGFuZ2VkXCIsXHJcblx0XHRcdFx0XHRcdFwiICBfX0tleTJfXzogdmFsdWUyY2hhbmdlZCAgI+OCs+ODoeODs+ODiCAgXCIsXHJcblx0XHRcdFx0XHRcdFwiS2V5MzogdmFsdWUzY2hhbmdlZCAgI+OCs+ODoeODs+ODiFwiLFxyXG5cdFx0XHRcdFx0XHRcIlwiLFxyXG5cdFx0XHRcdFx0XHRcImV4aXRcIixcclxuXHRcdFx0XHRcdF07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlucHV0TGluZXMgPSAgW1xyXG5cdFx0XHRcdFx0XHRjaGFuZ2luZ0ZpbGVQYXRoLFxyXG5cdFx0XHRcdFx0XHRcIjI5XCIsXHJcblx0XHRcdFx0XHRcdFwia2V5MTogdmFsdWUxMWNoYW5nZWRcIixcclxuXHRcdFx0XHRcdFx0XCJcIixcclxuXHRcdFx0XHRcdFx0XCJleGl0XCIsXHJcblx0XHRcdFx0XHRdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIGlmIChmaWxlTmFtZUhlYWQgPT09ICcyX2NoYW5nZV8zX0VuZ2xpc2gnKSB7XHJcblx0XHRcdFx0aW5wdXRMaW5lcyA9ICBbXHJcblx0XHRcdFx0XHRjaGFuZ2luZ0ZpbGVQYXRoLFxyXG5cdFx0XHRcdFx0XCIzMFwiLFxyXG5cdFx0XHRcdFx0XCJrZXkxOiB2YWx1ZTExY2hhbmdlZFwiLFxyXG5cdFx0XHRcdFx0XCJcIixcclxuXHRcdFx0XHRcdFwiZXhpdFwiLFxyXG5cdFx0XHRcdF07XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybnMgPSBhd2FpdCBjYWxsQ2hpbGRQcm9jY2Vzcyhgbm9kZSAke3NjcmlwdFBhdGh9IC0tdGVzdCAtLWxvY2FsZSBlbi1VU2AsIHtpbnB1dExpbmVzfSk7XHJcblx0XHRcdGNvbnN0ICBzb3VyY2UgICA9IGZzLnJlYWRGaWxlU3luYyhzb3VyY2VGaWxlUGF0aCkudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHRcdFx0Y29uc3QgIGNoYW5naW5nID0gZnMucmVhZEZpbGVTeW5jKGNoYW5naW5nRmlsZVBhdGgpLnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblx0XHRcdGNvbnN0ICBhbnN3ZXIgICA9IGZzLnJlYWRGaWxlU3luYyhhbnN3ZXJGaWxlUGF0aCkudG9TdHJpbmcoKS5zdWJzdHIoY3V0Qk9NKTtcclxuXHRcdFx0Y29uc3QgIGJhY2tVcCAgID0gZnMucmVhZEZpbGVTeW5jKGJhY2tVcEZpbGVQYXRoKS50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cclxuXHRcdFx0Ly8gQ2hlY2tcclxuXHRcdFx0aWYgKGNoYW5naW5nICE9PSBhbnN3ZXIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZyhgRXJyb3I6IGRpZmZlcmVudCBiZXR3ZWVuIGAgK1xyXG5cdFx0XHRcdFx0YFwiJHtmaWxlTmFtZUhlYWR9XzFfY2hhbmdpbmcueWFtbFwiIGFuZCBgICtcclxuXHRcdFx0XHRcdGBcIiR7ZmlsZU5hbWVIZWFkfV8yXyR7dGFyZ2V0fV9hZnRlcl9hbnN3ZXIueWFtbGApO1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChiYWNrVXAgIT09IHNvdXJjZSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGBFcnJvcjogZGlmZmVyZW50IGJldHdlZW4gYCArXHJcblx0XHRcdFx0XHRgXCIke2ZpbGVOYW1lSGVhZH1fMV9jaGFuZ2luZy55YW1sLmJhY2t1cFwiIGFuZCBgICtcclxuXHRcdFx0XHRcdGBcIiR7ZmlsZU5hbWVIZWFkfV8xLnlhbWxcImApO1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRkZWxldGVGaWxlKGNoYW5naW5nRmlsZVBhdGgpO1xyXG5cdFx0XHRkZWxldGVGaWxlKGJhY2tVcEZpbGVQYXRoKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbi8vIFRlc3RPZkNoYW5nZUVycm9yXHJcbmFzeW5jIGZ1bmN0aW9uICBUZXN0T2ZDaGFuZ2VFcnJvcigpIHtcclxuXHRsZXQgIHJldHVybnM6IFByb2Nlc3NSZXR1cm5zO1xyXG5cclxuXHRjb25zdCBmaWxlTmFtZUhlYWRzOiB7W25hbWU6IHN0cmluZ106IGFueX0gPSB7XHJcblx0XHRcIjJfY2hhbmdlXzJfZXJyb3JcIjoge2xvY2FsZTogXCItLXRlc3QgLS1sb2NhbGUgZW4tVVNcIn0sXHJcblx0XHRcIjJfY2hhbmdlXzRfSmFwYW5lc2VcIjoge2xvY2FsZTogXCItLXRlc3QgLS1sb2NhbGUgamEtSlBcIn0sXHJcblx0fTtcclxuXHRmb3IgKGNvbnN0IGZpbGVOYW1lSGVhZCBpbiBmaWxlTmFtZUhlYWRzKSB7XHJcblx0XHRjb25zb2xlLmxvZyhgVGVzdENhc2U6IFRlc3RPZkNoYW5nZUVycm9yID4+ICR7ZmlsZU5hbWVIZWFkfWApO1xyXG5cdFx0Y29uc3QgIGNhc2VEYXRhID0gZmlsZU5hbWVIZWFkc1tmaWxlTmFtZUhlYWRdO1xyXG5cdFx0Y29uc3QgIHNvdXJjZUZpbGVQYXRoICAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xLnlhbWxcIjtcclxuXHRcdGNvbnN0ICBiYWNrVXBGaWxlUGF0aCAgICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMV9jaGFuZ2luZy55YW1sLmJhY2t1cFwiO1xyXG5cdFx0Y29uc3QgIGNoYW5naW5nRmlsZVBhdGggID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xX2NoYW5naW5nLnlhbWxcIjtcclxuXHRcdGNvbnN0ICBhbnN3ZXJGaWxlUGF0aCAgICA9IHRlc3RGb2xkZXJQYXRoICsgZmlsZU5hbWVIZWFkICsgXCJfMl9hZnRlcl9hbnN3ZXIueWFtbFwiO1xyXG5cdFx0Y29uc3QgIGxvZ0Fuc3dlckZpbGVQYXRoID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8zX2Fuc3dlci50eHRcIjtcclxuXHRcdGRlbGV0ZUZpbGUoY2hhbmdpbmdGaWxlUGF0aCk7XHJcblx0XHRkZWxldGVGaWxlKGJhY2tVcEZpbGVQYXRoKTtcclxuXHRcdGZzLmNvcHlGaWxlU3luYyhzb3VyY2VGaWxlUGF0aCwgY2hhbmdpbmdGaWxlUGF0aCk7XHJcblxyXG5cdFx0Ly8gVGVzdCBNYWluXHJcblx0XHRyZXR1cm5zID0gYXdhaXQgY2FsbENoaWxkUHJvY2Nlc3MoYG5vZGUgJHtzY3JpcHRQYXRofSAke2Nhc2VEYXRhLmxvY2FsZX1gLFxyXG5cdFx0XHR7aW5wdXRMaW5lczogW1xyXG5cdFx0XHRcdGNoYW5naW5nRmlsZVBhdGgsXHJcblx0XHRcdFx0XCI0XCIsXHJcblx0XHRcdFx0XCJLZXkzOiB2YWx1ZTNjaGFuZ2VkXCIsXHJcblx0XHRcdFx0XCJleGl0XCIsXHJcblx0XHRcdF19XHJcblx0XHQpO1xyXG5cdFx0Y29uc3QgIGNoYW5naW5nID0gZnMucmVhZEZpbGVTeW5jKGNoYW5naW5nRmlsZVBhdGgpLnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblx0XHRjb25zdCAgYW5zd2VyICAgPSBmcy5yZWFkRmlsZVN5bmMoYW5zd2VyRmlsZVBhdGgpLnRvU3RyaW5nKCkuc3Vic3RyKGN1dEJPTSk7XHJcblx0XHRjb25zdCAgbG9nQW5zd2VyID0gZnMucmVhZEZpbGVTeW5jKGxvZ0Fuc3dlckZpbGVQYXRoKS50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cclxuXHRcdC8vIENoZWNrXHJcblx0XHRpZiAocmV0dXJucy5zdGRvdXQgIT09IGxvZ0Fuc3dlcikge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnRXJyb3I6IGRpZmZlcmVudCBiZXR3ZWVuIFwiX291dHB1dC50eHRcIiBhbmQgXCInICsgZmlsZU5hbWVIZWFkICsgJ18zX2Fuc3dlci50eHRcIicpO1xyXG5cdFx0XHRmcy53cml0ZUZpbGVTeW5jKHRlc3RGb2xkZXJQYXRoICsgXCJfb3V0cHV0LnR4dFwiLCByZXR1cm5zLnN0ZG91dCk7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcigpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGNoYW5naW5nICE9PSBhbnN3ZXIpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coYEVycm9yOiBkaWZmZXJlbnQgYmV0d2VlbiBgICtcclxuXHRcdFx0XHRgXCIke2ZpbGVOYW1lSGVhZH1fMV9jaGFuZ2luZy55YW1sXCIgYW5kIGAgK1xyXG5cdFx0XHRcdGBcIiR7ZmlsZU5hbWVIZWFkfV8yX2FmdGVyX2Fuc3dlci55YW1sXCJgKTtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZGVsZXRlRmlsZShjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHRcdGRlbGV0ZUZpbGUoYmFja1VwRmlsZVBhdGgpO1xyXG5cdH1cclxufVxyXG5cclxuLy8gVGVzdE9mRmlsZUNoZWNrXHJcbmFzeW5jIGZ1bmN0aW9uICBUZXN0T2ZGaWxlQ2hlY2soKSB7XHJcblx0bGV0ICByZXR1cm5zOiBQcm9jZXNzUmV0dXJucztcclxuXHJcblx0Y29uc3QgZmlsZU5hbWVIZWFkczoge1tuYW1lOiBzdHJpbmddOiBudW1iZXJ9ID0ge1xyXG5cdFx0XCJmaWxlXzFfb2tfYW5kX2JhZFwiOiAxLFxyXG5cdFx0XCJmaWxlXzJfdGFiXCI6IDEsXHJcblx0XHRcImZpbGVfM19maWxlX25hbWVcIjogMSxcclxuXHR9O1xyXG5cdGZvciAoY29uc3QgZmlsZU5hbWVIZWFkIGluIGZpbGVOYW1lSGVhZHMpIHtcclxuXHRcdGNvbnN0ICBjYXNlQ291bnQgPSBmaWxlTmFtZUhlYWRzW2ZpbGVOYW1lSGVhZF07XHJcblx0XHRmb3IgKGxldCB0YXJnZXQgPSAxOyAgdGFyZ2V0IDw9IGNhc2VDb3VudDsgIHRhcmdldCs9MSkge1xyXG5cdFx0XHRjb25zb2xlLmxvZyhgVGVzdENhc2U6IFRlc3RPZkZpbGVDaGVjayA+PiAke2ZpbGVOYW1lSGVhZH0gPj4gJHt0YXJnZXR9YCk7XHJcblx0XHRcdGNvbnN0ICBzb3VyY2VGaWxlUGF0aCAgID0gdGVzdEZvbGRlclBhdGggKyBmaWxlTmFtZUhlYWQgKyBcIl8xLnlhbWxcIjtcclxuXHRcdFx0Y29uc3QgIGJhY2tVcEZpbGVQYXRoICAgPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzFfY2hhbmdpbmcueWFtbC5iYWNrdXBcIjtcclxuXHRcdFx0Y29uc3QgIGNoYW5naW5nRmlsZVBhdGggPSB0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzFfY2hhbmdpbmcueWFtbFwiO1xyXG5cdFx0XHRkZWxldGVGaWxlKGNoYW5naW5nRmlsZVBhdGgpO1xyXG5cdFx0XHRkZWxldGVGaWxlKGJhY2tVcEZpbGVQYXRoKTtcclxuXHRcdFx0ZnMuY29weUZpbGVTeW5jKHNvdXJjZUZpbGVQYXRoLCBjaGFuZ2luZ0ZpbGVQYXRoKTtcclxuXHJcblx0XHRcdC8vIFRlc3QgTWFpblxyXG5cdFx0XHRsZXQgIGlucHV0TGluZXM6IHN0cmluZ1tdID0gW107XHJcblx0XHRcdGlmIChmaWxlTmFtZUhlYWQgPT09ICdmaWxlXzFfb2tfYW5kX2JhZCcpIHtcclxuXHRcdFx0XHRpbnB1dExpbmVzID0gW1xyXG5cdFx0XHRcdFx0Y2hhbmdpbmdGaWxlUGF0aCxcclxuXHRcdFx0XHRcdFwiNlwiLFxyXG5cdFx0XHRcdFx0XCJfX1VzZXJfXzogdXNlcjJcIixcclxuXHRcdFx0XHRcdFwiXCIsXHJcblx0XHRcdFx0XHRcImV4aXRcIixcclxuXHRcdFx0XHRdO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlucHV0TGluZXMgPSBbXHJcblx0XHRcdFx0XHRjaGFuZ2luZ0ZpbGVQYXRoLFxyXG5cdFx0XHRcdFx0XCJleGl0XCIsXHJcblx0XHRcdFx0XTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJucyA9IGF3YWl0IGNhbGxDaGlsZFByb2NjZXNzKGBub2RlICR7c2NyaXB0UGF0aH0gLS10ZXN0IC0tbG9jYWxlIGVuLVVTYCwge2lucHV0TGluZXN9KTtcclxuXHRcdFx0Y29uc3QgIGFuc3dlciA9IGZzLnJlYWRGaWxlU3luYyh0ZXN0Rm9sZGVyUGF0aCArIGZpbGVOYW1lSGVhZCArIFwiXzRfYW5zd2VyLnR4dFwiKVxyXG5cdFx0XHRcdC50b1N0cmluZygpLnN1YnN0cihjdXRCT00pO1xyXG5cclxuXHRcdFx0Ly8gQ2hlY2tcclxuXHRcdFx0aWYgKHJldHVybnMuc3Rkb3V0ICE9PSBhbnN3ZXIpIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnRXJyb3I6IGRpZmZlcmVudCBiZXR3ZWVuIFwiX291dHB1dC50eHRcIiBhbmQgXCInICsgZmlsZU5hbWVIZWFkICsgJ180X2Fuc3dlci50eHRcIicpO1xyXG5cdFx0XHRcdGZzLndyaXRlRmlsZVN5bmModGVzdEZvbGRlclBhdGggKyBcIl9vdXRwdXQudHh0XCIsIHJldHVybnMuc3Rkb3V0KTtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxufVx0XHJcblxyXG4vLyBjYWxsQ2hpbGRQcm9jY2Vzc1xyXG5hc3luYyBmdW5jdGlvbiAgY2FsbENoaWxkUHJvY2Nlc3MoY29tbWFuZExpbmU6IHN0cmluZywgIG9wdGlvbj86IFByb2Nlc3NPcHRpb24pOiBQcm9taXNlPFByb2Nlc3NSZXR1cm5zPiB7XHJcblx0cmV0dXJuICAgbmV3IFByb21pc2UoIGFzeW5jIChyZXNvbHZlRnVuY3Rpb24sIHJlamVjdEZ1bmN0aW9uKSA9PiB7XHJcblx0XHRjb25zdCAgcmV0dXJuVmFsdWUgPSBuZXcgUHJvY2Vzc1JldHVybnMoKTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdGNvbnN0ICBjaGlsZFByb2Nlc3MgPSBjaGlsZF9wcm9jZXNzLmV4ZWMoIGNvbW1hbmRMaW5lLFxyXG5cclxuXHRcdFx0XHQvLyBvbiBjbG9zZSB0aGUgXCJjaGlsZFByb2Nlc3NcIiAoMilcclxuXHRcdFx0XHQoZXJyb3I6IGNoaWxkX3Byb2Nlc3MuRXhlY0V4Y2VwdGlvbiB8IG51bGwsIHN0ZG91dDogc3RyaW5nLCBzdGRlcnI6IHN0cmluZykgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuVmFsdWUuc3Rkb3V0ID0gc3Rkb3V0O1xyXG5cdFx0XHRcdFx0cmV0dXJuVmFsdWUuc3RkZXJyID0gc3RkZXJyO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZUZ1bmN0aW9uKHJldHVyblZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRcdGlmIChvcHRpb24gJiYgY2hpbGRQcm9jZXNzLnN0ZGluKSB7XHJcblxyXG5cdFx0XHRcdGlmIChvcHRpb24uaW5wdXRMaW5lcykge1xyXG5cdFx0XHRcdFx0YXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMCkpO1xyXG5cdFx0XHRcdFx0Zm9yIChjb25zdCBpbnB1dExpbmUgb2Ygb3B0aW9uLmlucHV0TGluZXMpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coaW5wdXRMaW5lKTtcclxuXHRcdFx0XHRcdFx0Y2hpbGRQcm9jZXNzLnN0ZGluLndyaXRlKGlucHV0TGluZSArIFwiXFxuXCIpO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMjAwKSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNoaWxkUHJvY2Vzcy5zdGRpbi5lbmQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gb24gY2xvc2UgdGhlIFwiY2hpbGRQcm9jZXNzXCIgKDEpXHJcblx0XHRcdGNoaWxkUHJvY2Vzcy5vbignY2xvc2UnLCAoZXhpdENvZGU6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdHJldHVyblZhbHVlLmV4aXRDb2RlID0gZXhpdENvZGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRjaGlsZFByb2Nlc3Mub24oJ2V4aXQnLCAoZXhpdENvZGU6IG51bWJlcikgPT4ge1xyXG5cdFx0XHRcdHJldHVyblZhbHVlLmV4aXRDb2RlID0gZXhpdENvZGU7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHR0aHJvdyBFcnJvcihgRXJyb3IgaW4gdGhlIGNvbW1hbmQgbGluZSAke2NvbW1hbmRMaW5lfWApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG4vLyBkZWxldGVGaWxlXHJcbmZ1bmN0aW9uICBkZWxldGVGaWxlKHBhdGg6IHN0cmluZykge1xyXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGF0aCkpIHtcclxuICAgICAgICBmcy51bmxpbmtTeW5jKHBhdGgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBQcm9jZXNzT3B0aW9uXHJcbmNsYXNzIFByb2Nlc3NPcHRpb24ge1xyXG5cdGlucHV0TGluZXM/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuLy8gUHJvY2Vzc1JldHVybnNcclxuY2xhc3MgUHJvY2Vzc1JldHVybnMge1xyXG5cdGV4aXRDb2RlOiBudW1iZXIgPSAwO1xyXG5cdHN0ZG91dDogc3RyaW5nID0gJyc7XHJcblx0c3RkZXJyOiBzdHJpbmcgPSAnJztcclxufVxyXG5cclxuY29uc3QgIGN1dEJPTSA9IDE7XHJcbmNvbnN0ICBub3RGb3VuZCA9IC0xO1xyXG5tYWluKCk7Il19