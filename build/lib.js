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
exports.cc = exports.debugOut = exports.pp = exports.getSnapshot = exports.getTestWorkFolderFullPath = exports.checkNotInGitWorking = exports.pathResolve = exports.inputSkip = exports.inputPath = exports.getInputObject = exports.input = exports.getGlobbyParameters = exports.cutLeftOf = exports.getHomePath = exports.isFullPath = exports.getFullPath = exports.copyFileSync = exports.copyFolderSync = void 0;
var fs = require("fs");
var path = require("path");
var globby = require("globby");
var readline = require("readline");
try {
    var snapshots = require("./__snapshots__/main.test.ts.snap");
}
catch (e) {
}
// copyFolderSync
// #keyword: copyFolderSync
// sourceFolder/1.txt => destinationFolderPath/1.txt
function copyFolderSync(sourceFolderPath, destinationFolderPath) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var currentFolderPath, destinationFolderFullPath, paths, paths_1, paths_1_1, path_, sourceFilePath, destinationFilePath, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    currentFolderPath = process.cwd();
                    destinationFolderFullPath = getFullPath(destinationFolderPath, currentFolderPath);
                    process.chdir(sourceFolderPath);
                    return [4 /*yield*/, globby(['**/*'])];
                case 1:
                    paths = _b.sent();
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 13]);
                    paths_1 = __asyncValues(paths);
                    _b.label = 3;
                case 3: return [4 /*yield*/, paths_1.next()];
                case 4:
                    if (!(paths_1_1 = _b.sent(), !paths_1_1.done)) return [3 /*break*/, 6];
                    path_ = paths_1_1.value;
                    sourceFilePath = path_;
                    destinationFilePath = path.resolve(destinationFolderFullPath + '/' + path_);
                    copyFileSync(sourceFilePath, destinationFilePath);
                    _b.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _b.trys.push([8, , 11, 12]);
                    if (!(paths_1_1 && !paths_1_1.done && (_a = paths_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(paths_1)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13:
                    process.chdir(currentFolderPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.copyFolderSync = copyFolderSync;
// copyFileSync
// #keyword: copyFileSync
// This also makes the copy target folder.
function copyFileSync(sourceFilePath, destinationFilePath) {
    var destinationFolderPath = path.dirname(destinationFilePath);
    fs.mkdirSync(destinationFolderPath, { recursive: true });
    fs.copyFileSync(sourceFilePath, destinationFilePath);
}
exports.copyFileSync = copyFileSync;
// getFullPath
// #keyword: JavaScript (js) library getFullPath
// If "basePath" is current directory, you can call "path.resolve"
// If the variable has full path and litteral relative path, write `${___FullPath}/relative_path}`
function getFullPath(relativePath, basePath) {
    var fullPath = '';
    var slashRelativePath = relativePath.replace(/\\/g, '/');
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
exports.getFullPath = getFullPath;
// isFullPath
// #keyword: JavaScript (js) library isFullPath
function isFullPath(path) {
    var colonPosition = path.indexOf(':');
    var slashPosition = path.indexOf('/');
    var backSlashPosition = path.indexOf('\\');
    if (slashPosition === notFound) {
        var separatorPosition = backSlashPosition;
    }
    else if (backSlashPosition === notFound) {
        var separatorPosition = slashPosition;
    }
    else {
        var separatorPosition = Math.min(slashPosition, backSlashPosition);
    }
    if (colonPosition === notFound) {
        var isFullPath = (separatorPosition === 0);
    }
    else {
        var isFullPath = (separatorPosition === colonPosition + 1);
    }
    return isFullPath;
}
exports.isFullPath = isFullPath;
// getHomePath
// #keyword: getHomePath
function getHomePath() {
    if (process.env.HOME) {
        return process.env.HOME;
    }
    else if (process.env.USERPROFILE) {
        return process.env.USERPROFILE;
    }
    else {
        throw new Error('unexpected');
    }
}
exports.getHomePath = getHomePath;
// cutLeftOf
// #keyword: cutLeftOf
function cutLeftOf(input, keyword) {
    var keywordPosition = input.indexOf(keyword);
    if (keywordPosition !== notFound) {
        return input.substr(keywordPosition);
    }
    else {
        return input;
    }
}
exports.cutLeftOf = cutLeftOf;
// getGlobbyParameters
// #keyword: getGlobbyParameters
function getGlobbyParameters(targetPath, baseFullPath) {
    var targetFullPath = getFullPath(targetPath, baseFullPath);
    var fileName = path.basename(targetFullPath);
    if (fileName.includes('*')) {
        var targetFolderFullPath = path.dirname(targetFullPath);
        var wildcard = fileName;
    }
    else {
        var targetFolderFullPath = targetFullPath;
        var wildcard = '*';
    }
    return {
        targetFolderFullPath: targetFolderFullPath,
        wildcard: wildcard,
    };
}
exports.getGlobbyParameters = getGlobbyParameters;
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
var testBaseFolder = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["R:homemem_cacheMyDocsrcTypeScript\typrm\test_data"], ["R:\\home\\mem_cache\\MyDoc\\src\\TypeScript\\typrm\\test_data"]))) + '\\';
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
            return [2 /*return*/, InputObject.input(guide)];
        });
    });
}
exports.input = input;
var InputObject = new StandardInputBuffer();
function getInputObject() {
    return InputObject;
}
exports.getInputObject = getInputObject;
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
                    if (key.endsWith('()')) {
                        return [2 /*return*/, key];
                    }
                    else {
                        return [2 /*return*/, pathResolve(key)];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.inputPath = inputPath;
// inputSkip
function inputSkip(count) {
    inputOption.nextParameterIndex += count;
}
exports.inputSkip = inputSkip;
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
exports.pathResolve = pathResolve;
// checkNotInGitWorking
function checkNotInGitWorking() {
    var path_ = process.cwd();
    if (!path_.includes('extract_git_branches')) {
        throw new Error('This is not in project folder.');
    }
    while (path_.includes('extract_git_branches')) {
        path_ = path.dirname(path_);
    }
    while (path_ !== '/') {
        if (fs.existsSync(path_ + "/.git")) {
            throw new Error('This test is not supported with git submodule.');
        }
        path_ = path.dirname(path_);
    }
}
exports.checkNotInGitWorking = checkNotInGitWorking;
// getTestWorkFolderFullPath
function getTestWorkFolderFullPath() {
    var path_ = process.cwd();
    if (!path_.includes('extract_git_branches')) {
        throw new Error('This is not in project folder.');
    }
    while (path_.includes('extract_git_branches')) {
        path_ = path.dirname(path_);
    }
    return path_ + "/_test_of_extract_git_branches";
}
exports.getTestWorkFolderFullPath = getTestWorkFolderFullPath;
// getSnapshot
function getSnapshot(label) {
    if (!(label in snapshots)) {
        throw new Error("not found snapshot label \"" + label + "\" in \"__Project__/src/__snapshots__/main.test.ts.snap\" file.");
    }
    var snapshot = snapshots[label];
    return snapshot.substr(2, snapshot.length - 4).replace('\\"', '"');
}
exports.getSnapshot = getSnapshot;
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
//    } finally {
//        var d = pp('');
//        d = [];  // Set break point here and watch the variable d
//    }
function pp(message) {
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    exports.debugOut.push(message.toString());
    return exports.debugOut;
}
exports.pp = pp;
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
exports.cc = cc;
var gCount = {};
var notFound = -1;
var templateObject_1;
//# sourceMappingURL=lib.js.map