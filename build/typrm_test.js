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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var child_process = require("child_process");
var path = require("path");
var currentFolder = process.cwd();
var snapshots = require(currentFolder + "/__snapshots__/main.test.ts.snap");
var scriptPath = "../build/typrm.js";
var testFolderPath = "test_data" + path.sep;
//process.env.TYPRM_THESAURUS = 'test_data/thesaurus/thesaurus.csv';
//process.env.TYPRM_FOLDER = 'C:/aaaa';
process.env.TYPRM_LINE_NUM_GETTER = "\n    - #\n        regularExpression: ^(.*\\.(yaml|yml|json|js|ts|jsx|tsx|md|py|go|swift))(#(.*))?$\n        type: text\n        filePathRegularExpressionIndex: 1\n        keywordRegularExpressionIndex: 4\n        address: \"${file}:${lineNum}\"\n";
process.env.TYPRM_VERB = "\n    - #\n        label: 7.Test Echo\n        number: 7\n        regularExpression: .*\n        command: 'echo  \"ref:  ${ref}\";  echo  \"file: ${file}\";  echo  \"fragment: ${fragment}\";  echo  \"lineNum: ${lineNum}\"'\n";
if (process.env.windir) {
    var testingOS = 'Windows';
}
else {
    var testingOS = 'mac';
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, DoCustomDebug()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, TestOfCommandLine()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    console.log('Pass');
                    return [2 /*return*/];
            }
        });
    });
}
// DoCustomDebug
function DoCustomDebug() {
    return __awaiter(this, void 0, void 0, function () {
        var returns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callChildProccess("node " + scriptPath + " r C:\\Users\\m-toda\\Documents\\IIJ\\IIJ.yaml 349 \"$ElasticSearch: docker\"", {})];
                case 1:
                    returns = _a.sent();
                    // const  returns = await callChildProccess(`node ${scriptPath} s --verbose "#ref:" \${GitHub}/MyPrivateCode/UsingWatchConnectivity/SimpleWatchConnectivity/AppDelegate.swift#activate 7`, {});
                    // const  returns = await callChildProccess(`node ${scriptPath} s --verbose "#ref:" ~/GitProjects 0`, {});
                    // const  returns = await callChildProccess(`node ${scriptPath} s --verbose`, {inputLines: ["#ref: ~/GitProjects", "0"]});
                    // const  returns = await callChildProccess(`node ${scriptPath} --verbose c C:\\Users\\user1\\steps\\!Temp.yaml`, {});
                    // const  returns = await callChildProccess(`node ${scriptPath} s DSL --folder /Users/totadashi/Documents/typrm`, {});
                    console.log(returns.stdout);
                    console.log('Done');
                    return [2 /*return*/];
            }
        });
    });
}
// TestOfFileCheck
function TestOfCommandLine() {
    return __awaiter(this, void 0, void 0, function () {
        var returns, cases, _i, cases_1, case_, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cases = [{
                            "name": "version",
                            "parameters": "--version",
                            "check": "false",
                            "inputLines": "",
                        }, {
                            "name": "locale",
                            "parameters": "search ABC --folder test_data/search/1",
                            "check": "true",
                            "inputLines": "",
                        }, {
                            "name": "search_mode",
                            "parameters": "search  --folder test_data/search/1",
                            "check": "true",
                            "inputLines": "ABC\nexit()\n",
                        }, {
                            "name": "search_mode_ref_verb",
                            "parameters": "search",
                            "check": "true",
                            "inputLines": "#ref: \"../README.md#parameters\"\n7\n\n7\nexit()\n",
                        }, {
                            "name": "search_mode_result_has_ref_verb",
                            "parameters": "search  --folder test_data/search/2",
                            "check": "true",
                            "inputLines": "file_path\nexit()\n",
                        }];
                    _i = 0, cases_1 = cases;
                    _a.label = 1;
                case 1:
                    if (!(_i < cases_1.length)) return [3 /*break*/, 4];
                    case_ = cases_1[_i];
                    // if (case_.name === 'search_mode_result_has_ref_verb') {
                    console.log("TestCase: TestOfCommandLine >> " + case_.name);
                    return [4 /*yield*/, callChildProccess("node " + scriptPath + " " + case_.parameters + " --test", { inputLines: case_.inputLines.split('\n') })];
                case 2:
                    // Test Main
                    returns = _a.sent();
                    // Check
                    if (case_.check === 'true') {
                        if (testingOS === 'Windows') {
                            testingOS = 'Windows2';
                        }
                        answer = getSnapshot("typrm_test >> " + case_.name + " >> " + testingOS + ": stdout 1");
                        if (returns.stdout !== answer) {
                            printDifferentPaths('_output.txt', '_expected.txt');
                            fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
                            fs.writeFileSync(testFolderPath + "_expected.txt", answer);
                            throw new Error();
                        }
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    deleteFile(testFolderPath + "_output.txt");
                    deleteFile(testFolderPath + "_expected.txt");
                    return [2 /*return*/];
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
// getSnapshot
function getSnapshot(label) {
    var snapshot = snapshots[label];
    if (!snapshot) {
        throw new Error("Not found '" + label + "' in __snapshots__/____.snap");
    }
    return snapshot.substr(2, snapshot.length - 4).replace('\\"', '"');
}
// deleteFile
function deleteFile(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// getFullPath
function getFullPath(relativePath, basePath) {
    var fullPath = '';
    if (relativePath.substr(0, 1) === '/') {
        fullPath = relativePath;
    }
    else {
        fullPath = path.join(basePath, relativePath);
    }
    return fullPath;
}
// printDifferentPaths
function printDifferentPaths(path1, path2) {
    console.log("Error: different between the following files");
    console.log("  Path1: " + (testFolderFullPath + path1));
    console.log("  Path2: " + (testFolderFullPath + path2));
}
// diffStrings
function diffStrings(result, answer) {
    var resultFilePath = '_output.txt';
    var answerFilePath = '_answer.txt';
    fs.writeFileSync(testFolderFullPath + resultFilePath, result);
    fs.writeFileSync(testFolderFullPath + answerFilePath, answer);
    printDifferentPaths(resultFilePath, answerFilePath);
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
var testFolderFullPath = getFullPath("../src/" + testFolderPath, __dirname);
var cutBOM = 1;
var notFound = -1;
main();
//# sourceMappingURL=typrm_test.js.map