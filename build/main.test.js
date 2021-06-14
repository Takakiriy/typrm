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
var snapshots = require("./__snapshots__/main.test.ts.snap");
var callMain = main.callMainFromJest;
if (path.basename(process.cwd()) !== "src") {
    // Jest watch mode で２回目の実行をしても カレント フォルダー が引き継がれるため
    process.chdir("src");
}
var scriptPath = "../build/typrm.js";
var testFolderPath = "test_data" + path.sep;
var matchedColor = chalk.green.bold;
var pathColor = chalk.cyan;
var lineNumColor = chalk.keyword('gray');
describe("checks template value >>", function () {
    test.each([
        ["1_template_1_ok"],
        ["1_template_2_error"],
        ["1_template_3_if"],
        ["refer_1_ok"],
        ["refer_2_error"],
        ["secret_1_error"],
        ["var_not_ref_1_error"],
    ])("%s", function (fileNameHead) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    copyFileSync("test_data/" + fileNameHead + "_1.yaml", "test_data/_checking/" + fileNameHead + "_1.yaml");
                    return [4 /*yield*/, callMain(["check"], {
                            folder: 'test_data/_checking', test: "", locale: "en-US",
                        })];
                case 1:
                    _a.sent();
                    expect(main.stdout).toMatchSnapshot();
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
    test("check one file only", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, callMain(["check", "1_template_1_ok_1.yaml"], {
                        folder: 'test_data', test: "", locale: "en-US",
                    })];
                case 1:
                    _a.sent();
                    expect(main.stdout).toMatchSnapshot();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("checks file contents >>", function () {
    test.skip('file_2_tab', function () { });
    test.skip('file_3_file_name', function () { });
    test.each([
        [
            "OK", "file_1_ok_and_bad", "file/1", "", 0, 0, "",
        ], [
            "NG", "file_1_ok_and_bad", "file/1", "replace", 6, 1, "__User__: user2",
        ], [
            "if", "file_4_if", "file/1", "", 0, 0, "",
        ], [
            "any_lines", "file_8_others", "file/1", "", 0, 0, "",
        ]
    ])("%s in %s, %s %s", function (caseName, fileNameHead, targetPath, optionOperation, lineNum, settingNum, keyValues) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFilePath, changingFilePath, changingFileRelativePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFilePath = 'test_data/' + fileNameHead + "_1.yaml";
                    changingFilePath = 'test_data/_checking/document/' + fileNameHead + "_1_changing.yaml";
                    changingFileRelativePath = '_checking/document/' + fileNameHead + "_1_changing.yaml";
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    copyFileSync(sourceFilePath, changingFilePath);
                    if (!(optionOperation === 'replace')) return [3 /*break*/, 2];
                    return [4 /*yield*/, callMain(["replace", changingFileRelativePath, String(lineNum), keyValues], {
                            folder: 'test_data', test: "", locale: "en-US",
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: 
                // Test Main
                return [4 /*yield*/, callMain(["check"], {
                        folder: 'test_data/_checking/document', test: "", locale: "en-US",
                    })];
                case 3:
                    // Test Main
                    _a.sent();
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
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    copyFileSync("test_data/file_0_one_error_1.yaml", "test_data/_checking/1/file_1.yaml");
                    copyFileSync("test_data/file_0_one_error_1.yaml", "test_data/_checking/2/file_2.yaml");
                    // Test Main
                    return [4 /*yield*/, callMain(parameters, {
                            folder: 'test_data/_checking/1, test_data/_checking/2', test: "", locale: "en-US",
                        })];
                case 1:
                    // Test Main
                    _a.sent();
                    expect(main.stdout).toMatchSnapshot('stdout');
                    fs.rmdirSync('test_data/_checking', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("replaces settings >>", function () {
    test.skip('2_replace_5_setting_name', function () { });
    test.each([
        [
            '2_replace_1_ok', ' setting 1', 10, 'en-US',
            "key1: value1changed\n   __Key2__: value2changed  #\u3053\u3053\u306F\u7F6E\u304D\u63DB\u3048\u5F8C\u306B\u5165\u3089\u306A\u3044\u30B3\u30E1\u30F3\u30C8\nKey3: value3changed  #\u3053\u3053\u306F\u7F6E\u304D\u63DB\u3048\u5F8C\u306B\u5165\u3089\u306A\u3044\u30B3\u30E1\u30F3\u30C8",
        ], [
            '2_replace_1_ok', ' setting 2', 29, 'en-US',
            "key1: value1changed",
        ], [
            '2_replace_2_error', '', 4, 'en-US',
            "Key3: value3changed",
        ], [
            '2_replace_3_English', '', 10, 'en-US',
            "Key3: value3changed",
        ], [
            '2_replace_4_Japanese', '', 10, 'ja-JP',
            "Key3: value3changed",
        ], [
            '2_replace_6_if', ' in if block', 9, 'en-US',
            "__Setting1__: replaced",
        ], [
            '2_replace_6_if', ' in if variable', 9, 'en-US',
            "fruit: melon",
        ], [
            '2_replace_6_if', ' both', 9, 'en-US',
            "fruit: melon\n            __Setting1__: replaced",
        ], [
            '2_replace_7_undefined_if', '', 3, 'en-US',
            "fruit: apple",
        ],
    ])("in %s%s", function (fileNameHead, _subCaseName, lineNum, locale, keyValues) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFilePath, changingFolderPath, changingFileName, changingFilePath, sourceFileContents, updatedFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
                    changingFolderPath = testFolderPath + '_changing';
                    changingFileName = fileNameHead + "_1_changing.yaml";
                    changingFilePath = changingFolderPath + '/' + changingFileName;
                    fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                    copyFileSync(sourceFilePath, changingFilePath);
                    if (fileNameHead === '2_replace_7_undefined_if') {
                        sourceFileContents = getSnapshot("replaces settings >> in " + fileNameHead + ": sourceFileContents 1");
                        fs.writeFileSync(changingFilePath, sourceFileContents);
                    }
                    // Test Main
                    return [4 /*yield*/, callMain(["replace", changingFileName, String(lineNum), keyValues], {
                            folder: changingFolderPath, test: "", locale: locale,
                        })];
                case 1:
                    // Test Main
                    _a.sent();
                    updatedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
                    expect(main.stdout).toMatchSnapshot('stdout');
                    expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
                    fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                    return [2 /*return*/];
            }
        });
    }); });
    describe("Multi folder >>", function () {
        var fileNameHead = '2_replace_1_ok';
        var sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
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
            var fileContentsBefore, fileContentsAfter, fileContentsBefore, fileContents1, fileContents2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                        copyFileSync(sourceFilePath, changingFile1Path);
                        copyFileSync(sourceFilePath, changingFile2Path);
                        copyFileSync(sourceFilePath, changingFile1APath);
                        copyFileSync(sourceFilePath, changingFile2APath);
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
                            fileContentsBefore = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
                            fileContentsAfter = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
                            expect(fileContentsAfter).not.toBe(fileContentsBefore);
                        }
                        else { // Case of same name error
                            fileContentsBefore = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
                            fileContents1 = fs.readFileSync(changingFile1APath).toString().substr(cutBOM);
                            fileContents2 = fs.readFileSync(changingFile2APath).toString().substr(cutBOM);
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
            ],
        ])("%s%s >>", function (fileNameHead, _subCaseName, lineNum, locale, keyValues) { return __awaiter(void 0, void 0, void 0, function () {
            var sourceFilePath, changingFolderPath, changingFileName, changingFilePath, sourceFileContents, updatedFileContents, revertedFileContents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
                        changingFolderPath = testFolderPath + '_changing';
                        changingFileName = fileNameHead + "_1_changing.yaml";
                        changingFilePath = changingFolderPath + '/' + changingFileName;
                        fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                        copyFileSync(sourceFilePath, changingFilePath);
                        return [4 /*yield*/, callMain(["replace", changingFileName, lineNum.toString(), keyValues], {
                                folder: changingFolderPath, test: "", locale: locale
                            })];
                    case 1:
                        _a.sent();
                        sourceFileContents = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
                        updatedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
                        expect(updatedFileContents).not.toBe(sourceFileContents);
                        // Test Main
                        return [4 /*yield*/, callMain(["revert", changingFileName, lineNum.toString()], {
                                folder: changingFolderPath, test: "", locale: locale
                            })];
                    case 2:
                        // Test Main
                        _a.sent();
                        revertedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
                        expect(revertedFileContents).toBe(sourceFileContents);
                        fs.rmdirSync(testFolderPath + '_changing', { recursive: true });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe("searches keyword tag >>", function () {
    test.skip('trim', function () { });
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n"),
        ], [
            "not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ], [
            "acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n")
        ], [
            "ommit command name (1)",
            ["ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n")
        ], [
            "ommit command name (2)",
            ["do", "it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do it') + "\", \"a,b\"\n"),
        ], [
            "space",
            ["search", "do it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do it') + "\", \"a,b\"\n"),
        ], [
            "comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + (" #keyword: \"" + matchedColor('A,B') + "\"\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"do it\", \"" + matchedColor('a,b') + "\"\n"),
        ], [
            "double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + (" #keyword: \"" + matchedColor('double quotation is "".') + "\"\n"),
        ], [
            "ignore case",
            ["search", "DO It"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do it') + "\", \"a,b\"\n"),
        ], [
            "word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('AB') + "C, \"do it\", \"a,b\"\n"),
        ], [
            "word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + (" #keyword: \"" + matchedColor('do') + "uble quotation is \"\".\"\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"" + matchedColor('do') + " it\", \"a,b\"\n"),
            /*        ],[
                        "trim",
                        ["search", " do "],
                        { folder: "test_data/search/1", test: "" },
                        pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` #keyword: "${matchedColor('do')}uble quotation is ""."\n` +
                        pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do')} it", "a,b"\n`,
            */ 
        ], [
            "words order score",
            ["search", "aaa bbb"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':2:') + (" #keyword: " + matchedColor('bbb') + " " + matchedColor('aaa') + " xxx\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':4:') + (" #keyword: " + matchedColor('bbb') + " " + matchedColor('aaa') + "\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':1:') + (" #keyword: " + matchedColor('aaa bbb') + " xxx\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('aaa bbb') + "\n"),
        ], [
            "words order score (2)",
            ["search", "user", "interface"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':10:') + ("     #keyword: " + matchedColor('user interface') + "\n"),
        ], [
            "1 word search score",
            ["search", "second"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':14:') + ("     #keyword: " + matchedColor('second') + "ary\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':15:') + ("     #keyword: " + matchedColor('second') + " screen\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':13:') + ("     #keyword: " + matchedColor('second') + "\n"),
        ], [
            "word match is better than same case",
            ["search", "ipad"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':18:') + ("     #keyword: " + matchedColor('ipad') + " pro, " + matchedColor('ipad') + " nano\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':17:') + ("     #keyword: " + matchedColor('iPad') + "\n"),
        ], [
            "target word count",
            ["search", "new task"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':21:') + ("     #keyword: " + matchedColor('new task') + "s only\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':20:') + ("     #keyword: " + matchedColor('new task') + "s\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':22:') + ("     #keyword: " + matchedColor('new task') + "s\n"),
        ], [
            "compound word",
            ["search", "frame set"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':6:') + (" #keyword: " + matchedColor('frame') + matchedColor('set') + "\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':5:') + (" #keyword: " + matchedColor('frame set') + "\n"),
        ], [
            "output order (1)",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + (" #keyword: \"" + matchedColor('A,B') + "\"\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"do it\", \"" + matchedColor('a,b') + "\"\n"),
        ], [
            "output order (2)",
            ["search", "A,B"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: ABC, \"do it\", \"" + matchedColor('a,b') + "\"\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + (" #keyword: \"" + matchedColor('A,B') + "\"\n"),
        ], [
            "Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n"),
        ], [
            "Windows typrm folder path",
            ["search", "ABC"],
            { folder: process.cwd() + "\\test_data\\search\\1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n"),
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
});
describe("searches glossary tag >>", function () {
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n"),
        ], [
            "ignore case",
            ["search", "abc"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n"),
        ], [
            "word",
            ["search", "AB"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('AB') + "C: abc\n"),
        ], [
            "nested indent",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + "D: abcd\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':4:') + ("     " + matchedColor('ABC') + ": abc\n"),
        ], [
            "output order (1)",
            ["search", "de"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + ("     " + matchedColor('DE') + ": de\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + ("     " + matchedColor('de') + ": de\n"),
        ], [
            "output order (2)",
            ["search", "DE"],
            { folder: "test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + ("     " + matchedColor('de') + ": de\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + ("     " + matchedColor('DE') + ": de\n"),
        ], [
            "Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + (" #keyword: " + matchedColor('ABC') + ", \"do it\", \"a,b\"\n") +
                pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ("     " + matchedColor('ABC') + ": abc\n"),
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
describe("test of test >>", function () {
    test("checks snapshots files are confirmed", function () {
        var activeSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap').toString();
        var backUpSnapshots = fs.readFileSync('__snapshots_confirm__/main.test.ts.1.confirmed.snap_').toString();
        // 拡張子の末尾を .snap にしない理由は、Jest が使っていない .snap ファイルを自動的に削除しようとするからです
        expect(activeSnapshots).toBe(backUpSnapshots);
    });
});
afterAll(function () {
    deleteFileSync('test_data/_output.txt');
});
// getSnapshot
function getSnapshot(label) {
    var snapshot = snapshots[label];
    return snapshot.substr(2, snapshot.length - 4).replace('\\"', '"');
}
// copyFileSync
// #keyword: copyFileSync
// This also makes the copy target folder.
function copyFileSync(sourceFilePath, destinationFilePath) {
    var destinationFolderPath = path.dirname(destinationFilePath);
    fs.mkdirSync(destinationFolderPath, { recursive: true });
    fs.copyFileSync(sourceFilePath, destinationFilePath);
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