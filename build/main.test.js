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
var path = require("path");
var main = require("./main");
var callMain = main.callMainFromJest;
if (path.basename(process.cwd()) !== "src") {
    // Jest watch mode で２回目の実行をしても カレント フォルダー が引き継がれるため
    process.chdir("src");
}
var scriptPath = "../build/typrm.js";
var testFolderPath = "test_data" + path.sep;
describe("checks template value", function () {
    test.each([
        ["1_template_1_ok"],
        ["1_template_2_error"],
        ["refer_1_ok"],
        ["refer_2_error"],
        ["secret_1_error"],
        ["var_not_ref_1_error"],
    ])("%s", function (fileNameHead) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mkdirSync('test_data/_checking');
                    fs.copyFileSync("test_data/" + fileNameHead + "_1.yaml", "test_data/_checking/" + fileNameHead + "_1.yaml");
                    return [4 /*yield*/, callMain(["check"], {
                            folder: 'test_data/_checking', test: "", locale: "en-US"
                        })];
                case 1:
                    _a.sent();
                    expect(main.stdout).toMatchSnapshot();
                    deleteFileSync("test_data/_checking/" + fileNameHead + "_1.yaml");
                    deleteFolderSync('test_data/_checking');
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("checks file contents", function () {
    test.skip('file_2_tab', function () { });
    test.skip('file_3_file_name', function () { });
    test.each([
        [
            "file_1_ok_and_bad", "file/1", "", 0, 0, "",
        ], [
            "file_1_ok_and_bad", "file/1", "replace", 6, 1, "__User__: user2",
        ]
    ])("in %s, %s %s", function (fileNameHead, targetPath, optionOperation, lineNum, settingNum, keyValues) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFilePath, changingFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
                    changingFilePath = testFolderPath + '_checking/document/' + fileNameHead + "_1_changing.yaml";
                    mkdirSync('test_data/_checking');
                    mkdirSync('test_data/_checking/document');
                    deleteFileSync(changingFilePath);
                    fs.copyFileSync(sourceFilePath, changingFilePath);
                    if (!(optionOperation === 'replace')) return [3 /*break*/, 2];
                    return [4 /*yield*/, callMain(["replace", changingFilePath, String(lineNum), keyValues], {
                            folder: 'test_data', test: "", locale: "en-US"
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: 
                // Test Main
                return [4 /*yield*/, callMain(["check"], {
                        folder: 'test_data/_checking/document', test: "", locale: "en-US"
                    })];
                case 3:
                    // Test Main
                    _a.sent();
                    expect(main.stdout).toMatchSnapshot('stdout');
                    deleteFileSync(changingFilePath);
                    deleteFolderSync('test_data/_checking/document');
                    deleteFolderSync('test_data/_checking');
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("replaces settings", function () {
    test.skip('2_replace_5_setting_name', function () { });
    test.each([
        [
            '2_replace_1_ok', 10, 1, 'en-US',
            "key1: value1changed\n   __Key2__: value2changed  #\u30B3\u30E1\u30F3\u30C8\nKey3: value3changed  #\u30B3\u30E1\u30F3\u30C8",
            true,
        ], [
            '2_replace_1_ok', 29, 2, 'en-US',
            "key1: value1changed",
            true,
        ], [
            '2_replace_2_error', 4, 1, 'en-US',
            "Key3: value3changed",
            false,
        ], [
            '2_replace_3_English', 30, 1, 'en-US',
            "key1: value11changed",
            true,
        ], [
            '2_replace_4_Japanese', 30, 1, 'ja-JP',
            "Key3: value3changed",
            false,
        ],
    ])("in %s(%i) setting %i", function (fileNameHead, lineNum, settingNum, locale, keyValues, isSuccess) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceFilePath, changingFilePath, updatedFileContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
                    changingFilePath = testFolderPath + fileNameHead + "_1_changing.yaml";
                    deleteFileSync(changingFilePath);
                    fs.copyFileSync(sourceFilePath, changingFilePath);
                    // Test Main
                    return [4 /*yield*/, callMain(["replace", changingFilePath, String(lineNum), keyValues], {
                            folder: 'test_data', test: "",
                            locale: locale
                        })];
                case 1:
                    // Test Main
                    _a.sent();
                    updatedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
                    expect(main.stdout).toMatchSnapshot('stdout');
                    expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
                    deleteFileSync(changingFilePath);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("searches keyword tag", function () {
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n',
        ], [
            "not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ], [
            "acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n',
        ], [
            "space",
            ["search", "do it"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n',
        ], [
            "comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3:#keyword: ABC, "do it", "a,b"\n',
        ], [
            "double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:4:#keyword: "double quotation is ""."\n',
        ], [
            "word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", test: "" },
            "",
        ], [
            "word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", test: "" },
            "",
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
describe("searches glossary tag", function () {
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/1", test: "" },
            "${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml:7:    ABC: abc\n",
        ],
        [
            "word",
            ["search", "AB"],
            { folder: "test_data/search/glossary/1", test: "" },
            "",
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
describe("test of test", function () {
    test("checks snapshots files are confirmed", function () {
        var activeSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap').toString();
        var backUpSnapshots = fs.readFileSync('__snapshots_confirm__/main.test.ts.confirmed.snap_').toString();
        var confirmedSnapshots = fs.readFileSync('__snapshots_confirm__/main.test.ts.new_back_up.snap_').toString();
        // 拡張子の末尾を .snap にしない理由は、Jest が使っていない .snap ファイルを自動的に削除しようとするからです
        expect(activeSnapshots).toBe(backUpSnapshots);
        expect(backUpSnapshots).toBe(confirmedSnapshots);
    });
});
afterAll(function () {
    deleteFileSync('test_data/_output.txt');
});
// mkdirSync
function mkdirSync(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}
// deleteFileSync
function deleteFileSync(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// deleteFolderSync
function deleteFolderSync(path) {
    if (fs.existsSync(path)) {
        fs.rmdirSync(path);
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
            message: function () { return errorMessage; }
        };
    }
});
var cutBOM = 1;
//# sourceMappingURL=main.test.js.map