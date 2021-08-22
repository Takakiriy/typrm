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
var path = require("path");
var main = require("./main");
var chalk = require("chalk");
var lib = require("./lib");
var snapshots = require("./__snapshots__/main.test.ts.snap");
var callMain = main.callMainFromJest;
process.env['typrm_aaa'] = 'aaa';
process.chdir(lib.getHomePath() + '/GitProjects/GitHub/typrm/src');
var testFolderPath = "test_data" + path.sep;
var matchedColor = chalk.green.bold;
var refColor = chalk.yellow;
var searchColor = chalk.yellow;
var pathColor = chalk.cyan;
var lineNumColor = chalk.keyword('gray');
process.env.TYPRM_TEST_ENV = 'testEnv';
process.env.TYPRM_TEST_PATH = 'C:\\Test';
if (process.env.windir) {
    var testingOS = 'Windows';
}
else {
    var testingOS = 'Linux';
}
process.env.TYPRM_LINE_NUM_GETTER = "\n    - #\n        regularExpression: ^(.*\\.(yaml|md))(:id=([0-9]+))?(#(.*))?$\n        type: text\n        filePathRegularExpressionIndex: 1\n        keywordRegularExpressionIndex: 6\n        targetMatchIdRegularExpressionIndex: 4\n        address: \"${file}:${lineNum}\"\n";
if (testingOS === 'Windows') {
    process.env.TYPRM_VERB = "\n        - #\n            label: 7.Test Echo\n            number: 7\n            regularExpression: ^.*\\.md(#.*)?$\n            command: 'echo {ref: ${ref}, windowsRef: ${windowsRef}, file: ${file}, windowsFile: ${windowsFile}, fragment: ${fragment}}'\n        - #\n            label: 1.View\n            number: 1\n            regularExpression: ^.*\\.(svg|svgz)(#.*)?$\n            command: 'msedge \"file://${file}\"'\n    ";
}
else {
    process.env.TYPRM_VERB = "\n        - #\n            label: 7.Test Echo\n            number: 7\n            regularExpression: ^.*\\.md(#.*)?$\n            command: 'echo  \"{ref: ${ref}, windowsRef: ${windowsRef}, file: ${file}, windowsFile: ${windowsFile}, fragment: ${fragment}}\"'\n        - #\n            label: 1.View\n            number: 1\n            regularExpression: ^.*\\.(svg|svgz)(#.*)?$\n            command: '\"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome\" \"file://${file}\"'\n    ";
}
beforeAll(function () {
    fs.mkdirSync('empty_folder', { recursive: true });
});
describe("checks template value >>", function () {
    test.each([
        ["1_template_1_ok"],
        ["1_template_2_error"],
        ["1_template_3_if"],
        ["refer_1_ok"],
        ["refer_2_error"],
        ["secret_1_error"],
        ["var_not_ref_1_error"],
        ["template_if_1_error"],
    ])("%s", function (fileNameHead) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFileContents = getSnapshot("checks template value >> " + fileNameHead + " 1: sourceFileContents 1");
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    writeFileSync("test_data/_checking/" + fileNameHead + "_1.yaml", sourceFileContents);
                    process.chdir('empty_folder');
                    return [4 /*yield*/, callMain(["check"], {
                            folder: '../test_data/_checking', test: "", locale: "en-US",
                        })];
                case 1:
                    _a.sent();
                    process.chdir('..');
                    expect(main.stdout).toMatchSnapshot();
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
    test("check one file only", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFileContents = getSnapshot("checks template value >> 1_template_1_ok 1: sourceFileContents 1");
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    writeFileSync("test_data/_checking/1_template_1_ok_1.yaml", sourceFileContents);
                    process.chdir('empty_folder');
                    return [4 /*yield*/, callMain(["check", "_checking/1_template_1_ok_1.yaml"], {
                            folder: '../test_data', test: "", locale: "en-US",
                        })];
                case 1:
                    _a.sent();
                    process.chdir('..');
                    expect(main.stdout).toMatchSnapshot();
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
    test("check files in multi folder", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFileContents = getSnapshot("checks template value >> one_error 1: sourceFileContents 1");
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    writeFileSync("test_data/_checking/1/one_error_1.yaml", sourceFileContents);
                    writeFileSync("test_data/_checking/2/one_error_1.yaml", sourceFileContents);
                    process.chdir('empty_folder');
                    return [4 /*yield*/, callMain(["check"], {
                            folder: '../test_data/_checking/1, ../test_data/_checking/2/*.yaml', test: "", locale: "en-US",
                        })];
                case 1:
                    _a.sent();
                    process.chdir('..');
                    expect(main.stdout).toMatchSnapshot();
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
    test("verbose", function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFileContents = getSnapshot("checks template value >> check_verbose 1: sourceFileContents 1");
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    writeFileSync("test_data/_checking/check_verbose.yaml", sourceFileContents);
                    process.chdir('empty_folder');
                    return [4 /*yield*/, callMain(["check", "_checking/check_verbose.yaml"], {
                            folder: '../test_data', test: "", locale: "en-US", verbose: "",
                        })];
                case 1:
                    _a.sent();
                    process.chdir('..');
                    expect(lib.cutLeftOf(main.stdout, 'Verbose: typrm command: check')).toMatchSnapshot();
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("checks file contents >>", function () {
    test.each([
        [
            "OK", "file_1_ok_and_bad", "file/1", "", 0, 0, "",
        ], [
            "NG", "file_1_ok_and_bad", "file/1", "replace", 6, 1, "__User__: user2",
        ], [
            "file name", "file_3_file_name", "", "", 1, 1, "",
        ], [
            "if", "file_4_if", "file/1", "", 0, 0, "",
        ], [
            "any_lines", "file_8_others", "file/1", "", 0, 0, "",
        ]
    ])("%s in %s, %s %s", function (caseName, fileNameHead, targetPath, optionOperation, lineNum, settingNum, keyValues) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFileContents, changingFilePath, changingFileRelativePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFileContents = getSnapshot("checks file contents >> " + fileNameHead + " : sourceFileContents 1");
                    changingFilePath = 'test_data/_checking/document/' + fileNameHead + "_1_changing.yaml";
                    changingFileRelativePath = '_checking/document/' + fileNameHead + "_1_changing.yaml";
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    writeFileSync(changingFilePath, sourceFileContents);
                    process.chdir('empty_folder');
                    if (!(optionOperation === 'replace')) return [3 /*break*/, 2];
                    return [4 /*yield*/, callMain(["replace", changingFileRelativePath, String(lineNum), keyValues], {
                            folder: '../test_data', test: "", locale: "en-US",
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: 
                // Test Main
                return [4 /*yield*/, callMain(["check"], {
                        folder: '../test_data/_checking/document', test: "", locale: "en-US",
                    })];
                case 3:
                    // Test Main
                    _a.sent();
                    process.chdir('..');
                    expect(main.stdout).toMatchSnapshot('stdout');
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
    test.each([
        [
            "all", ["check"],
        ], [
            "file in 1st folder", ["check", "file_1.yaml"],
        ], [
            "file in 2nd folder", ["check", "file_2.yaml"],
        ], [
            "full path", ["check", getFullPath("test_data/_checking/2/file_2.yaml", process.cwd())],
        ]
    ])("Multi folder >> %s", function (caseName, parameters) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFileContents = getSnapshot("checks file contents >> file_0_one_error : sourceFileContents 1");
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    writeFileSync("test_data/_checking/1/file_1.yaml", sourceFileContents);
                    writeFileSync("test_data/_checking/2/file_2.yaml", sourceFileContents);
                    process.chdir('empty_folder');
                    // Test Main
                    return [4 /*yield*/, callMain(parameters, {
                            folder: '../test_data/_checking/1, ../test_data/_checking/2', test: "", locale: "en-US",
                        })];
                case 1:
                    // Test Main
                    _a.sent();
                    process.chdir('..');
                    expect(main.stdout).toMatchSnapshot('stdout');
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("replaces settings >>", function () {
    test.each([
        [
            '2_replace_1_ok', ' setting 1', '10', 'en-US',
            "key1: value1changed\n   __Key2__: value2changed  #\u3053\u3053\u306F\u7F6E\u304D\u63DB\u3048\u5F8C\u306B\u5165\u3089\u306A\u3044\u30B3\u30E1\u30F3\u30C8\nKey3: value3changed  #\u3053\u3053\u306F\u7F6E\u304D\u63DB\u3048\u5F8C\u306B\u5165\u3089\u306A\u3044\u30B3\u30E1\u30F3\u30C8",
        ], [
            '2_replace_1_ok', ' setting 2', '29', 'en-US',
            "key1: value1changed",
        ], [
            '2_replace_1_ok', ' setting 2 lineNum', '26', 'en-US',
            "key1: value1changed",
        ], [
            '2_replace_2_error', '', '4', 'en-US',
            "Key3: value3changed",
        ], [
            '2_replace_3_English', '', '10', 'en-US',
            "Key3: value3changed",
        ], [
            '2_replace_4_Japanese', '', '10', 'ja-JP',
            "Key3: value3changed",
        ], [
            '2_replace_5_setting_name', ' setting 1', '1st', 'ja-JP',
            "key1: value1changed",
        ], [
            '2_replace_5_setting_name', ' setting 2', '2番目', 'ja-JP',
            "key1: value1changed",
        ], [
            '2_replace_5_setting_name', ' setting 3', '3rd', 'en-US',
            "key1: value1changed",
        ], [
            '2_replace_5_setting_name', ' setting not found', 'not found', 'en-US',
            "key1: value1changed",
        ], [
            '2_replace_6_if', ' in if block', '9', 'en-US',
            "__Setting1__: replaced",
        ], [
            '2_replace_6_if', ' in if variable', '9', 'en-US',
            "fruit: melon",
        ], [
            '2_replace_6_if', ' both', '9', 'en-US',
            "fruit: melon\n            __Setting1__: replaced",
        ], [
            '2_replace_7_undefined_if', '', '3', 'en-US',
            "fruit: apple",
        ], [
            '2_replace_8_one_setting', ' without line num', undefined, 'en-US',
            "key1: changed1",
        ], [
            '2_replace_8_one_setting', ' line num 1', '1', 'en-US',
            "key1: changed1",
        ], [
            '2_replace_9_template_if_1_OK', '', '1', 'en-US',
            "__Stage__: develop",
        ], [
            '2_replace_9_template_if_2_NG', '', '1', 'en-US',
            "__Stage__: develop",
        ], [
            '2_replace_9_template_if_3_not_set', '', '1', 'en-US',
            "__Stage__: develop",
        ], [
            '2_replace_9_template_if_4_operators', '', '1', 'en-US',
            "__Stage__: develop",
        ],
    ])("in %s%s", function (fileNameHead, _subCaseName, lineNum, locale, keyValues) { return __awaiter(void 0, void 0, void 0, function () {
        var changingFolderPath, changingFileName, changingFilePath, sourceFileContents, updatedFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changingFolderPath = testFolderPath + '_changing';
                    changingFileName = fileNameHead + "_1_changing.yaml";
                    changingFilePath = changingFolderPath + '/' + changingFileName;
                    sourceFileContents = getSnapshot("replaces settings >> in " + fileNameHead + ": sourceFileContents 1");
                    fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                    writeFileSync(changingFilePath, sourceFileContents);
                    if (!lineNum) return [3 /*break*/, 2];
                    return [4 /*yield*/, callMain(["replace", changingFileName, lineNum, keyValues], {
                            folder: changingFolderPath, test: "", locale: locale,
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, callMain(["replace", changingFileName, keyValues], {
                        folder: changingFolderPath, test: "", locale: locale,
                    })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    updatedFileContents = fs.readFileSync(changingFilePath).toString();
                    expect(main.stdout).toMatchSnapshot('stdout');
                    expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
                    fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
    test.each([
        [
            '2_replace_1_ok', ' one setting', undefined, 'en-US',
            "key1: changed1",
            'Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.',
        ],
    ])("Exception case >> in %s%s", function (fileNameHead, _subCaseName, lineNum, locale, keyValues, expectedErrorMessage) { return __awaiter(void 0, void 0, void 0, function () {
        var changingFolderPath, changingFileName, changingFilePath, sourceFileContents, errorMessage, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changingFolderPath = testFolderPath + '_changing';
                    changingFileName = fileNameHead + "_1_changing.yaml";
                    changingFilePath = changingFolderPath + '/' + changingFileName;
                    sourceFileContents = getSnapshot("replaces settings >> in " + fileNameHead + ": sourceFileContents 1");
                    errorMessage = '';
                    fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                    writeFileSync(changingFilePath, sourceFileContents);
                    if (!lineNum) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, callMain(["replace", changingFileName, String(lineNum), keyValues], {
                            folder: changingFolderPath, test: "", locale: locale,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    errorMessage = e_1.message;
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 8];
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, callMain(["replace", changingFileName, keyValues], {
                            folder: changingFolderPath, test: "", locale: locale,
                        })];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    errorMessage = e_2.message;
                    return [3 /*break*/, 8];
                case 8:
                    expect(errorMessage).toBe(expectedErrorMessage);
                    return [2 /*return*/];
            }
        });
    }); });
    test.each([
        [
            '2_replace_1_ok', ' without folder option', undefined, 'en-US',
            "key1: changed1",
            'Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.',
        ],
    ])("Exception case >> in %s%s", function (fileNameHead, _subCaseName, lineNum, locale, keyValues, expectedErrorMessage) { return __awaiter(void 0, void 0, void 0, function () {
        var changingFolderPath, changingFileName, changingFilePath, sourceFileContents, errorMessage, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changingFolderPath = testFolderPath + '_changing';
                    changingFileName = fileNameHead + "_1_changing.yaml";
                    changingFilePath = changingFolderPath + '/' + changingFileName;
                    sourceFileContents = getSnapshot("replaces settings >> in " + fileNameHead + ": sourceFileContents 1");
                    errorMessage = '';
                    fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                    writeFileSync(changingFilePath, sourceFileContents);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, callMain(["replace", changingFilePath, keyValues], {
                            folder: "", test: "", locale: locale,
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    errorMessage = e_3.message;
                    return [3 /*break*/, 4];
                case 4:
                    expect(errorMessage).toBe(expectedErrorMessage);
                    return [2 /*return*/];
            }
        });
    }); });
    describe("Multi folder >>", function () {
        var fileNameHead = '2_replace_1_ok';
        var changingFolderPath = testFolderPath + '_changing';
        var changingFile1Path = changingFolderPath + '/1/' + fileNameHead + "_1_changing.yaml";
        var changingFile2Path = changingFolderPath + '/2/' + fileNameHead + "_2_changing.yaml";
        var changingFile1APath = changingFolderPath + '/1/' + fileNameHead + "_same_name.yaml";
        var changingFile2APath = changingFolderPath + '/2/' + fileNameHead + "_same_name.yaml";
        var lineNum = 29;
        var keyValues = "key1: value1changed";
        test.each([
            ["replace 1", fileNameHead + "_1_changing.yaml", changingFile1Path],
            ["replace 2", fileNameHead + "_2_changing.yaml", changingFile2Path],
            ["same name error", fileNameHead + "_same_name.yaml", undefined],
        ])("%s", function (caseName, changingFileName, changingFilePath) { return __awaiter(void 0, void 0, void 0, function () {
            var sourceFileContents, fileContentsBefore, fileContentsAfter, fileContentsBefore, fileContents1, fileContents2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceFileContents = getSnapshot("replaces settings >> in " + fileNameHead + ": sourceFileContents 1");
                        fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                        writeFileSync(changingFile1Path, sourceFileContents);
                        writeFileSync(changingFile2Path, sourceFileContents);
                        writeFileSync(changingFile1APath, sourceFileContents);
                        writeFileSync(changingFile2APath, sourceFileContents);
                        // Test Main
                        return [4 /*yield*/, callMain(["replace", changingFileName, String(lineNum), keyValues], {
                                folder: changingFolderPath + "/1, " + changingFolderPath + "/2", test: "", locale: "en-US"
                            })];
                    case 1:
                        // Test Main
                        _a.sent();
                        // Check
                        if (caseName !== "same name error") { // Case of relace 1, replace 2
                            if (!changingFilePath) {
                                throw new Error('unexpected');
                            }
                            fileContentsBefore = sourceFileContents;
                            fileContentsAfter = fs.readFileSync(changingFilePath).toString();
                            expect(fileContentsAfter).not.toBe(fileContentsBefore);
                        }
                        else { // Case of same name error
                            fileContentsBefore = sourceFileContents;
                            fileContents1 = fs.readFileSync(changingFile1APath).toString();
                            fileContents2 = fs.readFileSync(changingFile2APath).toString();
                            expect(fileContents1).toBe(fileContentsBefore);
                            expect(fileContents2).toBe(fileContentsBefore);
                            expect(main.stdout).toMatchSnapshot('stdout');
                        }
                        fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("revert", function () {
        test.each([
            [
                '2_replace_1_ok', ' setting 2', 29, 'en-US',
                "key1: value1changed",
            ], [
                '2_replace_6_if', ' in if block', 9, 'en-US',
                "__Setting1__: replaced",
            ], [
                '2_replace_6_if', ' in if variable', 9, 'en-US',
                "fruit: melon",
            ], [
                '2_replace_6_if', ' both', 9, 'en-US',
                "fruit: melon\n                __Setting1__: replaced",
            ], [
                '2_replace_6_if', ' without line num', undefined, 'en-US',
                "__Setting1__: replaced",
            ], [
                '2_replace_6_if', ' setting name', 'set1', 'en-US',
                "__Setting1__: replaced",
            ],
        ])("%s%s >>", function (fileNameHead, _subCaseName, lineNum, locale, keyValues) { return __awaiter(void 0, void 0, void 0, function () {
            var changingFolderPath, changingFileName, changingFilePath, sourceFileContents, updatedFileContents, revertedFileContents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        changingFolderPath = testFolderPath + '_changing';
                        changingFileName = fileNameHead + "_1_changing.yaml";
                        changingFilePath = changingFolderPath + '/' + changingFileName;
                        sourceFileContents = getSnapshot("replaces settings >> in " + fileNameHead + ": sourceFileContents 1");
                        fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                        writeFileSync(changingFilePath, sourceFileContents);
                        if (!lineNum) return [3 /*break*/, 2];
                        return [4 /*yield*/, callMain(["replace", changingFileName, lineNum.toString(), keyValues], {
                                folder: changingFolderPath, test: "", locale: locale
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, callMain(["replace", changingFileName, keyValues], {
                            folder: changingFolderPath, test: "", locale: locale
                        })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        updatedFileContents = fs.readFileSync(changingFilePath).toString();
                        expect(updatedFileContents).not.toBe(sourceFileContents);
                        if (!lineNum) return [3 /*break*/, 6];
                        return [4 /*yield*/, callMain(["revert", changingFileName, lineNum.toString()], {
                                folder: changingFolderPath, test: "", locale: locale
                            })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, callMain(["revert", changingFileName], {
                            folder: changingFolderPath, test: "", locale: locale
                        })];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        revertedFileContents = fs.readFileSync(changingFilePath).toString();
                        expect(revertedFileContents).toBe(sourceFileContents);
                        fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe("searches keyword tag >>", function () {
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n"),
        ], [
            "not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ], [
            "acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n")
        ], [
            "ommit command name (1)",
            ["ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n")
        ], [
            "ommit command name (2)",
            ["do", "it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do') + " " + matchedColor('it') + "\", \"a,b\"\n"),
        ], [
            "space",
            ["search", "do it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do') + " " + matchedColor('it') + "\", \"a,b\"\n"),
        ], [
            "comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + (" #keyword: \"" + matchedColor('A,B') + "\"\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"do it\", \"" + matchedColor('a,b') + "\"\n"),
        ], [
            "double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + (" #keyword: \"" + matchedColor('double') + " " + matchedColor('quotation') + " " + matchedColor('is') + " " + matchedColor('"".') + "\"\n"),
        ], [
            "ignore case",
            ["search", "DO It"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do') + " " + matchedColor('it') + "\", \"a,b\"\n"),
        ], [
            "word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('AB') + "C, \"do it\", \"a,b\"\n"),
        ], [
            "word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + (" #keyword: \"" + matchedColor('do') + "uble quotation is \"\".\"\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do') + " it\", \"a,b\"\n"),
        ], [
            "trim",
            ["search", " do "],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + (" #keyword: \"" + matchedColor('do') + "uble quotation is \"\".\"\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do') + " it\", \"a,b\"\n"),
        ], [
            "ignored keyword",
            ["search", "#search: #keyword: AB"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('AB') + "C, \"do it\", \"a,b\"\n"),
        ], [
            "words order score",
            ["search", "aaa bbb"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':2:') + (" #keyword: " + matchedColor('bbb') + " " + matchedColor('aaa') + " xxx\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':1:') + (" #keyword: " + matchedColor('aaa') + " " + matchedColor('bbb') + " xxx\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':4:') + (" #keyword: " + matchedColor('bbb') + " " + matchedColor('aaa') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('aaa') + " " + matchedColor('bbb') + "\n"),
        ], [
            "words order score (2)",
            ["search", "user", "interface"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':10:') + ("     #keyword: " + matchedColor('user') + " " + matchedColor('interface') + "\n"),
        ], [
            "1 word search score",
            ["search", "second"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':15:') + ("     #keyword: " + matchedColor('second') + " screen\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':14:') + ("     #keyword: " + matchedColor('second') + "ary\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':13:') + ("     #keyword: " + matchedColor('second') + "\n"),
        ], [
            "word match is better than same case",
            ["search", "ipad"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':18:') + ("     #keyword: " + matchedColor('ipad') + " pro, " + matchedColor('ipad') + " nano\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':17:') + ("     #keyword: " + matchedColor('iPad') + "\n"),
        ], [
            "target word count",
            ["search", "new task"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':21:') + ("     #keyword: " + matchedColor('new') + " " + matchedColor('task') + "s only\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':20:') + ("     #keyword: " + matchedColor('new') + " " + matchedColor('task') + "s\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':22:') + ("     #keyword: " + matchedColor('new') + " " + matchedColor('task') + "s\n"),
        ], [
            "target word count 3",
            ["search", "world wide web"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':67:') + ("     #keyword: " + matchedColor('web') + " " + matchedColor('World') + " " + matchedColor('wide') + ", " + matchedColor('World') + " " + matchedColor('wide') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':65:') + ("     #keyword: " + matchedColor('World') + " " + matchedColor('wide') + " " + matchedColor('web') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':66:') + ("     #keyword: " + matchedColor('World') + " " + matchedColor('wide') + " " + matchedColor('web') + "\n"),
        ], [
            "compound word",
            ["search", "frame set"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':6:') + (" #keyword: " + matchedColor('frame') + matchedColor('set') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':5:') + (" #keyword: " + matchedColor('frame') + " " + matchedColor('set') + "\n"),
        ], [
            "bug case (1)",
            ["search", "go lang"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':81:') + ("     #keyword: " + matchedColor('Go') + "_" + matchedColor('lang') + "uage.yaml, " + matchedColor('go') + "\n"),
        ], [
            "output order (1)",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + (" #keyword: \"" + matchedColor('A,B') + "\"\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"do it\", \"" + matchedColor('a,b') + "\"\n"),
        ], [
            "output order (2)",
            ["search", "A,B"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"do it\", \"" + matchedColor('a,b') + "\"\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + (" #keyword: \"" + matchedColor('A,B') + "\"\n"),
        ], [
            "output order (3)",
            ["search", "grape"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':40:') + ("     #keyword: " + matchedColor('GRAPE') + "fruit juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':42:') + ("     #keyword: " + matchedColor('GRAPE') + "fruit juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':30:') + ("     #keyword: " + matchedColor('grape') + "fruit juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':32:') + ("     #keyword: " + matchedColor('grape') + "fruit juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':41:') + ("     #keyword: pink " + matchedColor('GRAPE') + "fruit\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':31:') + ("     #keyword: pink " + matchedColor('grape') + "fruit\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':45:') + ("     #keyword: " + matchedColor('GRAPE') + " juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':47:') + ("     #keyword: " + matchedColor('GRAPE') + " juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':35:') + ("     #keyword: " + matchedColor('grape') + " juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':37:') + ("     #keyword: " + matchedColor('grape') + " juice\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':46:') + ("     #keyword: pink " + matchedColor('GRAPE') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':36:') + ("     #keyword: pink " + matchedColor('grape') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':39:') + ("     #keyword: " + matchedColor('GRAPE') + "fruit\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':43:') + ("     #keyword: " + matchedColor('GRAPE') + "fruit\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':29:') + ("     #keyword: " + matchedColor('grape') + "fruit\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':33:') + ("     #keyword: " + matchedColor('grape') + "fruit\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':44:') + ("     #keyword: " + matchedColor('GRAPE') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':48:') + ("     #keyword: " + matchedColor('GRAPE') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':34:') + ("     #keyword: " + matchedColor('grape') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':38:') + ("     #keyword: " + matchedColor('grape') + "\n"),
        ], [
            "output order (4)",
            ["search", "main", "stage"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':51:') + ("     #keyword: " + matchedColor('main') + "ly " + matchedColor('stage') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':50:') + ("     #keyword: " + matchedColor('Main') + " " + matchedColor('stage') + "s\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':52:') + ("     #keyword: " + matchedColor('main') + " " + matchedColor('stage') + "s\n"),
        ], [
            "output order (5)",
            ["search", "silver", "arrow"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':54:') + ("     #keyword: add " + matchedColor('SILVER') + " " + matchedColor('arrow') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':56:') + ("     #keyword: add " + matchedColor('SILVER') + " " + matchedColor('arrow') + "\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':55:') + ("     #keyword: [" + matchedColor('silver') + "/super-system], " + matchedColor('SILVER') + " " + matchedColor('Arrow') + "s\n"),
        ], [
            "output order (6)",
            ["search", "tool", "release"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':59:') + ("     #keyword: " + matchedColor('Tool') + " " + matchedColor('release') + " now\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':58:') + ("     #keyword: " + matchedColor('Tool') + " " + matchedColor('release') + ", " + matchedColor('Tool') + " deploy\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':60:') + ("     #keyword: " + matchedColor('Tool') + " " + matchedColor('release') + ", " + matchedColor('Tool') + " deploy\n"),
        ], [
            "without tag parameter",
            ["search", "specular"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':25:') + ("         " + matchedColor('specular') + " reflection light:  #keyword:  #// out of keyword parameter\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':27:') + ("         - " + matchedColor('specular') + " reflection:  #keyword:\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':24:') + ("     " + matchedColor('specular') + ":  #// the mirror-like reflection  #keyword:\n"),
        ], [
            "block-to-disable-tag-tool tag",
            ["search", "document_in_block"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':78:') + ("         Making materials:  #keyword: " + matchedColor('document_in_block') + "\n"),
        ], [
            "emphasize search and ref tag",
            ["search", "picture"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':62:') + ("     #keyword: " + matchedColor('picture') + "  " + refColor('#ref: path') + "  #search: " + searchColor('keyword') + "\n") +
                'path\n' +
                '    0.Folder\n',
        ], [
            "Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n"),
        ], [
            "target is file",
            ["search", "wonderful"],
            { folder: "test_data/search/2/2.yaml", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':85:') + ("     #keyword: " + matchedColor('wonderful') + "\n"),
        ], [
            "file extension filter",
            ["search", "target"],
            { folder: "test_data/search/3/*.yaml", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/3/31.yaml') + lineNumColor(':1:') + (" #keyword: " + matchedColor('target') + "\n"),
        ], [
            "Windows typrm folder path",
            ["search", "ABC"],
            { folder: process.cwd() + "\\test_data\\search\\1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n"),
        ],
    ])("%s", function (caseName, arguments_, options, answer) { return __awaiter(void 0, void 0, void 0, function () {
        var isWindowsEnvironment, isWindowsCase;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isWindowsEnvironment = (path.sep === '\\');
                    isWindowsCase = (caseName.indexOf('Windows') !== notFound);
                    if (!isWindowsEnvironment && isWindowsCase) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, callMain(arguments_, options)];
                case 1:
                    _a.sent();
                    expect(main.stdout).toBe(answer);
                    return [2 /*return*/];
            }
        });
    }); });
    describe("thesaurus >>", function () {
        test.each([
            [
                "acronym",
                ["search", "PS"],
                { folder: "test_data/thesaurus/1", thesaurus: "test_data/thesaurus/thesaurus.csv", test: "" },
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/thesaurus/1/1.yaml') + lineNumColor(':1:') + (" #keyword: " + matchedColor('PowerShell') + "\n"),
            ],
        ])("%s", function (_caseName, arguments_, options, answer) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callMain(arguments_, options)];
                    case 1:
                        _a.sent();
                        expect(main.stdout).toBe(answer);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe("searches glossary tag >>", function () {
    test.skip('output order (3)', function () { });
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n"),
        ], [
            "ignore case",
            ["search", "abc"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n"),
        ], [
            "word",
            ["search", "AB"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('AB') + "C: abc\n"),
        ], [
            "nested indent",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + "D: abcd\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':4:') + ("     " + matchedColor('ABC') + ": abc\n"),
        ], [
            "skip comment",
            ["search", "comment"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':26:') + ("     " + matchedColor('comment') + ": hit\n"),
        ], [
            "output order (1)",
            ["search", "de"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + ("     " + matchedColor('DE') + ": de\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + ("     " + matchedColor('de') + ": de\n"),
        ], [
            "output order (2)",
            ["search", "DE"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + ("     " + matchedColor('de') + ": de\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + ("     " + matchedColor('DE') + ": de\n"),
            /*
                ],[
                    "output order (3)",
                    ["search", "search score comparison glossary"],
                    { folder: "test_data/search/glossary/2", test: "" },
                    pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':38:') + ` ${matchedColor('search score')}:        ${matchedColor('comparison glossary')} and keyword: 3\n` +
                    pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':39:') + `         #keyword: ${matchedColor('search score comparison glossary')} and keyword\n` +
                    pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':37:') + ` ${matchedColor('search score')}:        ${matchedColor('comparison glossary')}: 2\n`,
            */
        ], [
            "glossary is less score than keyword",
            ["search", "grape"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':11:') + ("         " + matchedColor('grape') + ":\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':14:') + ("         " + matchedColor('grape') + ":\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':12:') + ("     keyword:  #keyword: " + matchedColor('grape') + "\n"),
        ], [
            "glossary with empty line",
            ["search", "space"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':17:') + ("     " + matchedColor('space') + "1:\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':19:') + ("     " + matchedColor('space') + "2:\n"),
        ], [
            "glossary with parameters (1)",
            ["search", "category1 apple"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':22:') + (" " + matchedColor('category1') + ":    " + matchedColor('apple') + ": juice\n"),
        ], [
            "glossary with parameters (2)",
            ["search", "apple category1"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':22:') + (" " + matchedColor('category1') + ":    " + matchedColor('apple') + ": juice\n"),
        ], [
            "emphasize search and ref tag",
            ["search", "picture"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':28:') + ("     " + matchedColor('picture') + ":  " + refColor('#ref: path#hash') + "  #search: " + searchColor('keyword') + "\n") +
                'path#hash\n' +
                '    0.Folder\n',
        ], [
            "nested glossary tag",
            ["search", "turnip"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':33:') + (" level-2:        white " + matchedColor('turnip') + ":\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':34:') + (" level-1:    " + matchedColor('turnip') + " soup:\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':32:') + (" level-2:        red " + matchedColor('turnip') + ":\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':31:') + (" level-1:    " + matchedColor('turnip') + ": #glossary: level-2\n"),
        ], [
            "Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n") +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n"),
        ],
    ])("%s", function (_caseName, arguments_, options, answer) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callMain(arguments_, options)];
                case 1:
                    _a.sent();
                    expect(main.stdout).toBe(answer);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("print reference >>", function () {
    describe("basic >>", function () {
        test.each([
            [
                "1st",
                ["search", "#ref:", "${TEST_ENV}/file.txt"],
                { locale: "en-US", test: "" },
                "testEnv/file.txt\n" +
                    "    0.Folder\n",
            ], [
                "multi parameters",
                ["search", " #ref:", "${TEST_ENV}/file1.txt", "${TEST_ENV}/${TEST_ENV}/file2.txt"],
                { locale: "en-US", test: "" },
                "testEnv/file1.txt testEnv/testEnv/file2.txt\n" +
                    "    0.Folder\n",
            ], [
                "escape",
                ["search", "#ref:", "\\${TEST_ENV}", "-\\${TEST_ENV}-", "/${TEST_ENV}"],
                { locale: "en-US", test: "" },
                "${TEST_ENV} -${TEST_ENV}- /testEnv\n" +
                    "    0.Folder\n",
            ], [
                "path",
                ["search", "#ref:", "~/.ssh  folder/f1.txt  ${TEST_PATH}  escaped\\ space  /root  //pc"],
                { locale: "en-US", test: "" },
                lib.getHomePath() + "/.ssh  folder/f1.txt  C:/Test  escaped\\ space  /root  //pc\n" + // TYPRM_TEST_PATH has \ but print replaced to /
                    "    0.Folder\n",
            ], [
                "shared folder",
                ["search", "#ref:", "\\\\pc\\folder\\file.txt"],
                { locale: "en-US", test: "" },
                "\\\\pc\\folder\\file.txt\n" +
                    "    0.Folder\n",
            ],
        ])("%s", function (_caseName, arguments_, options, answer) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callMain(arguments_, options)];
                    case 1:
                        _a.sent();
                        expect(main.stdout).toBe(answer);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("line number getter >>", function () {
        test.each([
            [
                "lineNum",
                ["search", "#ref:", "test_data/search/2/2.yaml#lineNum"],
                { locale: "en-US", test: "" },
                "test_data/search/2/2.yaml:69\n" +
                    "    0.Folder\n",
            ], [
                "second match",
                ["search", "#ref:", "test_data/search/2/2.yaml:id=2#lineNum"],
                { locale: "en-US", test: "" },
                "test_data/search/2/2.yaml:86\n" +
                    "    0.Folder\n",
            ], [
                "(error) lineNum not found",
                ["search", "#ref:", "test_data/search/2/2.yaml#notFound"],
                { locale: "en-US", test: "" },
                "test_data/search/2/2.yaml:0\n" +
                    "    0.Folder\n",
            ], [
                "(error) file not found",
                ["search", "#ref:", "test_data/search/2/notFound.yaml#notFound"],
                { locale: "en-US", test: "" },
                'ERROR: not found a file at "${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/notFound.yaml"\n' +
                    "test_data/search/2/notFound.yaml:0\n" +
                    "    0.Folder\n",
            ],
        ])("%s", function (_caseName, arguments_, options, answer) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callMain(arguments_, options)];
                    case 1:
                        _a.sent();
                        expect(main.stdout).toBe(answer);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("recommend >>", function () {
        test.each([
            [
                "recommend",
                ["search", "#ref:", lib.getHomePath() + "/.ssh  testEnv/file1.txt  testEnv\\testEnv\\file2.txt  C:\\Test\\user1  c:\\Test  \\root  \\\\pc  last\\"],
                { locale: "en-US", test: "" },
                "Recommend: #ref: ~/.ssh  ${TEST_ENV}/file1.txt  ${TEST_ENV}/${TEST_ENV}/file2.txt  ${TEST_PATH}/user1  ${TEST_PATH}  /root  //pc  last/\n" +
                    lib.getHomePath().replace(/\\/g, '/') + "/.ssh  testEnv/file1.txt  testEnv/testEnv/file2.txt  C:/Test/user1  c:/Test  /root  //pc  last/\n" +
                    "    0.Folder\n",
            ], [
                "recommend (2)",
                ["search", "#ref: '/User'"],
                { locale: "en-US", test: "" },
                "Recommend: #ref: /User\n" +
                    "/User\n" +
                    "    0.Folder\n",
            ], [
                "Do not recommend reserved variables",
                ["search", "#ref: TYPRM_FOLDER"],
                { locale: "en-US", test: "" },
                "TYPRM_FOLDER\n" +
                    "    0.Folder\n",
            ],
        ])("%s", function (_caseName, arguments_, options, answer) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (arguments_[1].includes('TYPRM_FOLDER')) {
                            process.env.TYPRM_FOLDER = 'TYPRM_FOLDER';
                        }
                        return [4 /*yield*/, callMain(arguments_, options)];
                    case 1:
                        _a.sent();
                        expect(main.stdout).toBe(answer);
                        if (arguments_[1].includes('TYPRM_FOLDER')) {
                            delete process.env.TYPRM_FOLDER;
                        }
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("verb >>", function () {
        test.each([
            [
                "verb",
                ["search", "#ref:", "../README.md", "7"],
                { locale: "en-US", test: "" },
                "{ref: ../README.md, windowsRef: ..\\README.md, file: ../README.md, windowsFile: ..\\README.md, fragment: }\n",
            ], [
                "verb (2)",
                ["search", "#ref:", "../README.md#title", "7"],
                { locale: "en-US", test: "" },
                "{ref: ../README.md#title, windowsRef: ..\\README.md#title, file: ../README.md, windowsFile: ..\\README.md, fragment: title}\n",
            ], [
                "verb error",
                ["search", "#ref:", "../README.md", "4"],
                { locale: "en-US", test: "" },
                "Error that verb number 4 is not defined\n",
            ], [
                "not found the folder",
                ["search", "#ref:", "/Unknown_", "0"],
                { locale: "en-US", test: "" },
                (testingOS === 'Windows')
                    ? "Error of not found the file or folder at \"\\Unknown_\"\n"
                    : "Error of not found the file or folder at \"/Unknown_\"\n",
            ], [
                "verb verbose",
                ["search", "#ref:", "../README.md", "4"],
                { locale: "en-US", test: "", verbose: "" },
                (testingOS === 'Windows')
                    ? // Windows
                        "Verbose: TYPRM_TEST_ENV = testEnv\n" +
                            "Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                            "Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                            "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:id=([0-9]+))?(#(.*))?$\n" +
                            "Verbose:     type: text\n" +
                            "Verbose:     filePathRegularExpressionIndex: 1\n" +
                            "Verbose:     keywordRegularExpressionIndex: 6\n" +
                            "Verbose:     targetMatchIdRegularExpressionIndex: 4\n" +
                            "Verbose:     address: ${file}:${lineNum}\n" +
                            "Verbose: TYPRM_VERB[0]:\n" +
                            "Verbose:     regularExpression: ^.*\\.md(#.*)?\$\n" +
                            "Verbose:     label: 7.Test Echo\n" +
                            "Verbose:     number: 7\n" +
                            "Verbose:     command: echo {ref: \${ref}, windowsRef: ${windowsRef}, file: \${file}, windowsFile: ${windowsFile}, fragment: \${fragment}}\n" +
                            "Verbose: TYPRM_VERB[1]:\n" +
                            "Verbose:     regularExpression: ^.*\\.(svg|svgz)(#.*)?\$\n" +
                            "Verbose:     label: 1.View\n" +
                            "Verbose:     number: 1\n" +
                            "Verbose:     command: msedge \"file://\${file}\"\n" +
                            "Verbose: Parsed by TYPRM_LINE_NUM_GETTER:\n" +
                            "Verbose:     address: ../README.md\n" +
                            "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:id=([0-9]+))?(#(.*))?$\n" +
                            "Verbose:     filePathRegularExpressionIndex: 1\n" +
                            "Verbose:     keywordRegularExpressionIndex: 6\n" +
                            "Verbose:     targetMatchIdRegularExpressionIndex: 4\n" +
                            "Verbose:     matched: [../README.md, ../README.md, md, , , , ]\n" +
                            "Error that verb number 4 is not defined\n"
                    : // mac
                        "Verbose: TYPRM_TEST_ENV = testEnv\n" +
                            "Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                            "Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                            "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:id=([0-9]+))?(#(.*))?$\n" +
                            "Verbose:     type: text\n" +
                            "Verbose:     filePathRegularExpressionIndex: 1\n" +
                            "Verbose:     keywordRegularExpressionIndex: 6\n" +
                            "Verbose:     targetMatchIdRegularExpressionIndex: 4\n" +
                            "Verbose:     address: ${file}:${lineNum}\n" +
                            "Verbose: TYPRM_VERB[0]:\n" +
                            "Verbose:     regularExpression: ^.*\\.md(#.*)?\$\n" +
                            "Verbose:     label: 7.Test Echo\n" +
                            "Verbose:     number: 7\n" +
                            "Verbose:     command: echo  \"{ref: \${ref}, windowsRef: \${windowsRef}, file: \${file}, windowsFile: \${windowsFile}, fragment: \${fragment}}\"\n" +
                            "Verbose: TYPRM_VERB[1]:\n" +
                            "Verbose:     regularExpression: ^.*\\.(svg|svgz)(#.*)?\$\n" +
                            "Verbose:     label: 1.View\n" +
                            "Verbose:     number: 1\n" +
                            "Verbose:     command: \"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome\" \"file://\${file}\"\n" +
                            "Verbose: typrm command: search\n" +
                            "Verbose: Parsed by TYPRM_LINE_NUM_GETTER:\n" +
                            "Verbose:     address: ../README.md\n" +
                            "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:id=([0-9]+))?(#(.*))?$\n" +
                            "Verbose:     filePathRegularExpressionIndex: 1\n" +
                            "Verbose:     keywordRegularExpressionIndex: 6\n" +
                            "Verbose:     targetMatchIdRegularExpressionIndex: 4\n" +
                            "Verbose:     matched: [../README.md, ../README.md, md, , , , ]\n" +
                            "Error that verb number 4 is not defined\n",
            ],
            // Others test is "search_mode_ref_verb".
        ])("%s", function (_caseName, arguments_, options, answer) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, callMain(arguments_, options)];
                    case 1:
                        _a.sent();
                        expect(main.stdout).toBe(answer);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe("test of test >>", function () {
    test("checks snapshots files are confirmed", function () {
        var activeSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap').toString();
        var backUpSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap.confirmed-ts').toString();
        // 拡張子の末尾を .snap にしない理由は、Jest が使っていない .snap ファイルを自動的に削除しようとするからです
        // ____.snap.confirmed-ts ファイルが存在する理由は、Jest の自動編集が予期しないデータを追加することがあるからです
        expect(activeSnapshots).toBe(backUpSnapshots);
    });
});
afterAll(function () {
    deleteFileSync('test_data/_output.txt');
    fs.rmdirSync('empty_folder', { recursive: true });
});
// getSnapshot
function getSnapshot(label) {
    var snapshot = snapshots[label];
    if (!snapshot) {
        throw new Error("Not found '" + label + "' in __snapshots__/____.snap");
    }
    return snapshot.substr(2, snapshot.length - 4).replace('\\"', '"');
}
// writeFileSync
// #keyword: writeFileSync
// This also makes the copy target folder.
function writeFileSync(filePath, fileContents) {
    var destinationFolderPath = path.dirname(filePath);
    fs.mkdirSync(destinationFolderPath, { recursive: true });
    fs.writeFileSync(filePath, fileContents);
}
// deleteFileSync
// #keyword: deleteFileSync, unlinkSync
// This does not occurr any errors, even if there is not the file at the specified path.
function deleteFileSync(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// getFullPath
function getFullPath(relativePath, basePath) {
    var fullPath = "";
    if (relativePath.substr(0, 1) === "/") {
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
var testFolderFullPath = getFullPath("../src/" + testFolderPath, __dirname);
expect.extend({
    because: function (isPassed, errorMessage) {
        return {
            pass: isPassed,
            message: function () { return errorMessage; },
        };
    },
});
var cutBOM = 1;
var notFound = -1;
//# sourceMappingURL=main.test.js.map