import * as fs from "fs";
import * as path from "path";
import globby from 'globby';
import * as readline from 'readline';
import * as stream from 'stream';
import * as csvParse from 'csv-parse';
import * as dotenv from "dotenv";
import chalk from 'chalk';
import * as diff from 'diff';
import { Readable, Writable } from 'stream';
// @ts-ignore
import { snapshots } from './lib-cjs.cjs';
// File group
// copyFolderSync
// #keyword: lib.ts copyFolderSync
// sourceFolder/1.txt => destinationFolderPath/1.txt
export async function copyFolderSync(sourceFolderPath, destinationFolderPath) {
    const currentFolderPath = process.cwd();
    const destinationFolderFullPath = getFullPath(destinationFolderPath, currentFolderPath);
    process.chdir(sourceFolderPath);
    const paths = await globby(['**/*']);
    for await (const path_ of paths) {
        const sourceFilePath = path_;
        const destinationFilePath = path.resolve(destinationFolderFullPath + '/' + path_);
        copyFileSync(sourceFilePath, destinationFilePath);
    }
    process.chdir(currentFolderPath);
}
// copyFileSync
// #keyword: lib.ts copyFileSync
// This also makes the copy target folder.
export function copyFileSync(sourceFilePath, destinationFilePath) {
    const destinationFolderPath = path.dirname(destinationFilePath);
    fs.mkdirSync(destinationFolderPath, { recursive: true });
    fs.copyFileSync(sourceFilePath, destinationFilePath);
}
export function rmdirSync(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.rmdirSync(folderPath, { recursive: true });
        // (node:8328) [DEP0147] DeprecationWarning: In future versions of Node.js, fs.rmdir(path, { recursive: true }) will be removed. Use fs.rm(path, { recursive: true }) instead
        // Property 'rm' does not exist on type 'typeof import("fs")'.ts(2339)
    }
}
// replaceFileSync
// #keyword: lib.ts replaceFileSync
// replaceFileSync('a.txt', (text)=>(text.replace('before', 'after')));
export function replaceFileSync(sourceFilePath, replaceFunction, destinationFilePath = '') {
    const text = fs.readFileSync(sourceFilePath, 'utf-8');
    const replacedText = replaceFunction(text);
    if (destinationFilePath === '') {
        destinationFilePath = sourceFilePath;
    }
    fs.writeFileSync(destinationFilePath, replacedText);
}
// replaceFileAsync
// #keyword: lib.ts replaceFileAsync
// replaceFileSync('a.txt', (text)=>(text.replace('before', 'after')));
export async function replaceFileAsync(sourceFilePath, replaceFunction, destinationFilePath = '') {
    const text = fs.readFileSync(sourceFilePath, 'utf-8');
    const replacedText = await replaceFunction(text);
    if (destinationFilePath === '') {
        destinationFilePath = sourceFilePath;
    }
    fs.writeFileSync(destinationFilePath, replacedText);
}
export async function searchAsTextSub(readlineOptions, keyword, csvOption) {
    if (csvOption) {
        var keywords = await parseCSVColumns(keyword);
        const firstKeyword = keywords.shift();
        if (!firstKeyword) {
            throw Error(`ERROR: no keywords`);
        }
        var currentKeyword = firstKeyword;
    }
    else {
        var keywords = [keyword];
        var currentKeyword = keyword;
    }
    var lineNum = 0;
    var breaking = false;
    var exception;
    const reader = readline.createInterface(addDefaultReadLineOptions(readlineOptions));
    for await (const line1 of reader) {
        if (breaking) {
            continue;
        } // "reader" requests read all lines
        try {
            const line = line1;
            lineNum += 1;
            if (line.includes(currentKeyword)) {
                if (!csvOption) {
                    breaking = true; // return or break must not be written.
                    // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                }
                else { // csvOption
                    const nextKeyword = keywords.shift();
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
    }
    if (exception) {
        throw exception;
    }
    if (!breaking) {
        lineNum = notFoundInFile;
    }
    return lineNum;
}
function addDefaultReadLineOptions(localOptions) {
    return { crlfDelay: Infinity, ...localOptions };
}
export function pathResolve(path_) {
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
// getFullPath
// #keyword: lib.ts JavaScript (js) library getFullPath
// If "basePath" is current directory, you can call "path.resolve"
// If the variable has full path and litteral relative path, write `${___FullPath}/relative_path}`
export function getFullPath(relativePath, basePath) {
    var fullPath = '';
    const slashRelativePath = relativePath.replace(/\\/g, '/');
    const colonSlashIndex = slashRelativePath.indexOf(':/');
    const slashFirstIndex = slashRelativePath.indexOf('/');
    const withProtocol = (colonSlashIndex + 1 === slashFirstIndex); // e.g.) C:/, http://
    if (relativePath[0] === '/') {
        fullPath = relativePath;
    }
    else if (relativePath[0] === '~') {
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
// isFullPath
// #keyword: lib.ts JavaScript (js) library isFullPath
export function isFullPath(path) {
    const colonPosition = path.indexOf(':');
    const slashPosition = path.indexOf('/');
    const backSlashPosition = path.indexOf('\\');
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
    else if (colonPosition < separatorPosition) {
        var isFullPath = (separatorPosition === colonPosition + 1);
    }
    else {
        var isFullPath = (separatorPosition === 0);
    }
    return isFullPath;
}
export function isInFileSystem(path_) {
    return !path_.includes('://');
}
export function getExistingParentPath(path_) {
    if (path.sep === '/') {
        path_ = replacePathToSlashed(path_);
    }
    else {
        path_ = replaceToPathForWindows(path_);
    }
    if (!(path_[0] === path.sep || path_.substr(1, 2) === ':' + path.sep)) {
        return getHomePath();
    }
    while (path_ !== path.sep) {
        if (fs.existsSync(path_)) {
            return path_;
        }
        const nextPath = path.dirname(path_);
        if (nextPath === path_ || nextPath === '.') { // dirname('c:/') === '.' in mac
            return getHomePath();
        }
        path_ = nextPath;
    }
    return getHomePath();
}
// export function  withHomeVariable(path_: string) {
//     const  home = getHomePath();
//     const  homeL = home.toLowerCase().replace(/\\/g, '/');
//     const  pathL = path_.toLowerCase().replace(/\\/g, '/');
//     if (pathL.startsWith(homeL)) {
//         return  '${HOME}' + path_.substring(home.length);
//     } else {
//         return  path_;
//     }
// }
export function replacePathToSlashed(path_) {
    if (path_.substring(0, 2) === "\\\\") {
        return path_.replace(/\//g, '\\'); // Windows network path
    }
    else {
        path_ = path_.replace(/\\([^ ]|$)/g, '/$1');
        if (/^([A-Za-z]):/.test(path_)) {
            path_ = path_[0].toLowerCase() + path_.substring(1);
            if (fs.existsSync('/mnt/c')) {
                path_ = '/mnt/' + path_[0] + ':' + path_.substring(2);
            }
        }
        else if (path_.startsWith('/mnt/') && /[A-Za-z]/.test(path_[5]) && (path_[6] === '/' || path_[6] === undefined)) {
            if (!fs.existsSync('/mnt/c')) {
                path_ = path_[5] + ':' + path_.substring(6);
            }
        }
        return path_;
    }
}
export function replaceToPathForWindows(path_) {
    if (path_.startsWith('/mnt/') && /[a-z]/.test(path_[5]) && (path_[6] === '/' || path_[6] === undefined)) {
        return path_[5].toUpperCase() + ':' + path_.substring(6).replace(/\//g, '\\');
    }
    else if (path_[1] === ':') {
        return path_.substring(0, 2).toUpperCase() + path_.substring(2).replace(/\//g, '\\');
    }
    else {
        return path_.replace(/\//g, '\\');
    }
}
export function checkNotInGitWorking() {
    var path_ = process.cwd();
    if (!path_.includes('extract_git_branches')) {
        throw new Error('This is not in project folder.');
    }
    while (path_.includes('extract_git_branches')) {
        path_ = path.dirname(path_);
    }
    while (path_ !== '/') {
        if (fs.existsSync(`${path_}/.git`)) {
            throw new Error('This test is not supported with git submodule.');
        }
        path_ = path.dirname(path_);
    }
}
export function getTestWorkFolderFullPath() {
    var path_ = process.cwd();
    if (!path_.includes('extract_git_branches')) {
        throw new Error('This is not in project folder.');
    }
    while (path_.includes('extract_git_branches')) {
        path_ = path.dirname(path_);
    }
    return `${path_}/_test_of_extract_git_branches`;
}
// getHomePath
// #keyword: lib.ts getHomePath
export function getHomePath() {
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
// getGlobbyParameters
// #keyword: lib.ts getGlobbyParameters
export async function getGlobbyParameters(targetPath, baseFullPath) {
    var targetFullPath = getFullPath(targetPath, baseFullPath);
    var fileName = path.basename(targetFullPath);
    const negated = (fileName[0] === '!');
    if (fileName[0] === '{' && fileName[fileName.length - 1] === '}') {
        var fileNames = await parseCSVColumns(fileName.substring(1, fileName.length - 1));
    }
    else {
        var fileNames = [fileName];
    }
    const filePath = 1;
    const folderPath = 2;
    var pathIs = 0;
    if (fileName.includes('*')) {
        pathIs = filePath;
    }
    else if (fileNames.length >= 2) {
        pathIs = filePath;
    }
    else {
        const fileExists = fs.lstatSync(targetFullPath).isFile(); // This raises an exception, if path has wildcard
        if (fileExists) {
            pathIs = filePath;
        }
        else {
            pathIs = folderPath;
        }
    }
    if (pathIs === filePath) {
        var targetFolderFullPath = path.dirname(targetFullPath);
        var globbyParameters = [];
        for (let fileName_ of fileNames) {
            if (fileName_[0] !== '!') {
                globbyParameters.push(`**/${fileName_}`);
            }
            else {
                globbyParameters.push(`!**/${fileName_.substring(1)}`);
            }
        }
    }
    else { // folderPath
        var targetFolderFullPath = targetFullPath;
        var globbyParameters = [`**/*`];
    }
    return {
        targetFolderFullPath,
        globbyParameters,
    };
}
// String group
// cutLeftOf
// #keyword: lib.ts cutLeftOf
// cutLeftOf("abcde", "c") == "cde"
export function cutLeftOf(input, keyword) {
    const keywordPosition = input.indexOf(keyword);
    if (keywordPosition !== notFound) {
        return input.substring(keywordPosition);
    }
    else {
        return input;
    }
}
// cutLast
// #keyword: lib.ts cutLast
// cutLast("ab/", "/") == "ab"
// cutLast("abc", "/") == "abc"
export function cutLast(input, keyword) {
    if (input.endsWith(keyword)) {
        return input.substring(0, input.length - keyword.length);
    }
    else {
        return input;
    }
}
export function cutIndent(lines) {
    const nullLength = 99999;
    var minIndentLength = nullLength;
    for (const line of lines) {
        if (line.trim() !== '') {
            const indentLength = indentRegularExpression.exec(line)[0].length;
            minIndentLength = Math.min(minIndentLength, indentLength);
        }
    }
    for (var lineNum = 1; lineNum <= lines.length; lineNum += 1) {
        const unindentedLine = lines[lineNum - 1].substring(minIndentLength);
        const indentBefore = indentRegularExpression.exec(unindentedLine)[0];
        const indentAfter = ' '.repeat(indentBefore.length);
        lines[lineNum - 1] = indentAfter + unindentedLine.substring(indentBefore.length);
    }
    return lines;
}
export function unexpandVariable(expanded, keyValues, out_replacedIndices = null) {
    var replacing = expanded;
    var replacedTag = '\r\n'; // This is not matched with any values
    for (const [key, value] of keyValues) {
        const keyRe = new RegExp(escapeRegularExpression(key), 'g');
        const valueRe = new RegExp(escapeRegularExpression(value), 'g');
        replacing = replacing.replace(keyRe, replacedTag);
        replacing = replacing.replace(valueRe, replacedTag);
        replacedTag += '\n';
    }
    var index = keyValues.length;
    for (const [key, _value] of keyValues.reverse()) {
        replacedTag = replacedTag.slice(0, replacedTag.length - 1);
        const replacedTagRe = new RegExp(escapeRegularExpression(replacedTag), 'g');
        if (out_replacedIndices) {
            index -= 1;
            if (replacing.includes(replacedTag)) {
                out_replacedIndices.unshift(index);
            }
        }
        replacing = replacing.replace(replacedTagRe, key);
    }
    const unexpanded = replacing;
    return unexpanded;
}
function getIndentWithoutHyphen(line) {
    const match = indentHyphenRegularExpression.exec(line);
    if (match === null) {
        return null;
    }
    const leftOfHyphen = match[1] || '';
    const rightOfHyphen = match[3] || '';
    if (rightOfHyphen[0] === '\t') {
        var indentWithoutHyphen = leftOfHyphen + rightOfHyphen;
    }
    else {
        var indentWithoutHyphen = leftOfHyphen + ' ' + rightOfHyphen;
    }
    return indentWithoutHyphen;
}
// checkExpectedTextContents
// This ignores different indent depth and different indent width.
export function checkExpectedTextContents(testingContents, expectedParts, anyLinesTag) {
    return _main(testingContents, expectedParts, anyLinesTag);
    function _main(testingContents, expectedParts, anyLinesTag) {
        if (expectedParts.length === 0) {
            return null;
        }
        const contents = testingContents;
        const contentsLineCount = contents.length;
        var contentsIndent = '';
        var contentsIndentStack = [];
        var skipToContentsIndent = '';
        var skipToDeeper = false;
        const parts = cutIndent(expectedParts.slice());
        const partsStartsWithHyphen = (parts[0][0] === '-');
        var partsBaseIndentLength = expectedParts[0].length - parts[0].length;
        var partsFirstLine = parts[0].trim();
        var partsLineNumFirst = 1;
        if (partsFirstLine.trim() === anyLinesTag) {
            partsFirstLine = parts[1].trim();
            partsLineNumFirst = 2;
        }
        if (partsStartsWithHyphen) {
            partsFirstLine = partsFirstLine.substring(1).trimLeft();
        }
        var partsIndent = '';
        var partsIndentStack = [];
        var partsLineNum = partsLineNumFirst;
        let Result;
        (function (Result) {
            Result[Result["same"] = 0] = "same";
            Result[Result["different"] = 1] = "different";
            Result[Result["skipped"] = 2] = "skipped";
        })(Result || (Result = {}));
        ;
        var result = Result.different;
        var unexpectedLine = null;
        var contentsIndentLength = 0;
        var indentDiff = 0;
        var skipTo = '';
        var skipFrom = '';
        var skipStartLineNum = 1;
        for (var contentsLineNum = 1; contentsLineNum <= contentsLineCount; contentsLineNum += 1) {
            const contentsLine = contents[contentsLineNum - 1];
            if (partsLineNum === partsLineNumFirst) {
                if (_foundFirstLine(contentsLine, partsFirstLine, partsStartsWithHyphen)) {
                    result = Result.same;
                    contentsIndentStack = [];
                    partsIndentStack = [];
                    if (partsLineNumFirst === 2) {
                        const deeperContentsIndent = indentRegularExpression.exec(contentsLine)[0];
                        for (let lineNum = contentsLineNum - 1; lineNum >= 1; lineNum -= 1) {
                            const aboveContentsLine = contents[lineNum - 1];
                            if (!aboveContentsLine.startsWith(deeperContentsIndent)) {
                                [contentsIndent, partsIndent] =
                                    _pushToIndentStack(contentsIndentStack, partsIndentStack, aboveContentsLine, parts[0]);
                                break;
                            }
                        }
                    }
                    [contentsIndent, partsIndent] =
                        _pushToIndentStack(contentsIndentStack, partsIndentStack, contentsLine, parts[partsLineNumFirst - 1]);
                    contentsIndentLength = contentsIndentStack[0].length - partsIndentStack[0].length;
                }
                else {
                    result = Result.different;
                }
            }
            else if (skipTo === '') { // not skip
                var partsLine = parts[partsLineNum - 1];
                const contentsLineWithoutIndent = contentsLine.substring(contentsIndent.length);
                const partsLineWithoutIndent = partsLine.substring(partsIndent.length);
                const contentsLineHasNewIndent = contentsLine.startsWith(contentsIndent + ' ');
                var partsLineHasNewIndent = partsLine.startsWith(partsIndent + ' ');
                if (_stringsWithoutIndentAreSame(contentsLineWithoutIndent, partsLineWithoutIndent) &&
                    contentsLine.startsWith(contentsIndent) && partsLine.startsWith(partsIndent)) {
                    result = Result.same;
                }
                else if (contentsLine.trim() === '' && partsLine.trim() === '') { // not check the indent of empty line
                    result = Result.same;
                }
                else if (_trimStringsAreSame(contentsLine, partsLine)) {
                    if (contentsLineHasNewIndent && partsLineHasNewIndent) {
                        result = Result.same;
                    }
                    else {
                        for (;;) {
                            if (contentsIndentStack.length <= 1 || partsIndentStack.length <= 1 ||
                                contentsLine.startsWith(contentsIndent) || partsLine.startsWith(partsIndent)) {
                                result = Result.different;
                                if (unexpectedLine === null || partsLineNum > unexpectedLine.partsLineNum) {
                                    const partsLine = expectedParts[partsLineNum - 1];
                                    unexpectedLine = { contentsLineNum, contentsLine, contentsIndentLength, partsLineNum,
                                        partsLine,
                                        partsIndentLength: partsBaseIndentLength,
                                        indentDiff: _getIndentDiff(contentsIndentStack, contentsLine, partsIndentStack, partsLine, partsBaseIndentLength) };
                                }
                                break;
                            }
                            contentsIndentStack.pop();
                            partsIndentStack.pop();
                            contentsIndent = contentsIndentStack[contentsIndentStack.length - 1];
                            partsIndent = partsIndentStack[partsIndentStack.length - 1];
                            if (contentsLine.startsWith(contentsIndent) && partsLine.startsWith(partsIndent)) {
                                if (contentsLine[contentsIndent.length] !== ' ' &&
                                    partsLine[partsIndent.length] !== ' ') {
                                    result = Result.same;
                                    if (_hasFirstFieldWithHyphen(partsLine, partsIndent.length)) {
                                        contentsIndent = getIndentWithoutHyphen(contentsLine);
                                        partsIndent = getIndentWithoutHyphen(partsLine);
                                        contentsIndentStack.push(contentsIndent);
                                        partsIndentStack.push(partsIndent);
                                    }
                                }
                                else {
                                    result = Result.different;
                                    if (unexpectedLine === null || partsLineNum > unexpectedLine.partsLineNum) {
                                        unexpectedLine = { contentsLineNum, contentsLine, contentsIndentLength, partsLineNum,
                                            partsLine: expectedParts[partsLineNum - 1], partsIndentLength: partsBaseIndentLength, indentDiff };
                                    }
                                }
                                break;
                            }
                        }
                    }
                }
                else if (partsLine.trim() === anyLinesTag) {
                    result = Result.skipped;
                    partsLineNum += 1;
                    skipTo = parts[partsLineNum - 1];
                    skipFrom = contentsLine;
                    skipStartLineNum = contentsLineNum;
                    skipToContentsIndent = contentsIndentStack[0];
                    for (let level = partsIndentStack.length - 1; level >= 0; level -= 1) {
                        if (skipTo.startsWith(partsIndentStack[level])) {
                            skipToContentsIndent = contentsIndentStack[level];
                            if (skipTo.trimLeft()[0] === '-') {
                                skipToContentsIndent += '-';
                                skipTo = skipTo.substring(skipTo.indexOf('-') + 1);
                            }
                            break;
                        }
                    }
                    skipToDeeper = (skipTo[skipToContentsIndent.length] === ' ');
                    partsLineHasNewIndent = skipToDeeper;
                    partsLine = skipTo;
                    skipTo = skipTo.trim();
                }
                else {
                    result = Result.different;
                    if (unexpectedLine === null || partsLineNum > unexpectedLine.partsLineNum) {
                        unexpectedLine = { contentsLineNum, contentsLine, contentsIndentLength, partsLineNum,
                            partsLine: expectedParts[partsLineNum - 1], partsIndentLength: partsBaseIndentLength, indentDiff };
                    }
                }
                // contentsIndentStack, ... = ...
                if (contentsLineHasNewIndent || partsLineHasNewIndent) {
                    [contentsIndent, partsIndent] = _pushToIndentStack(contentsIndentStack, partsIndentStack, contentsLine, partsLine);
                }
            }
            else { // skipTo
                if (_foundSkipTo(contentsLine, skipToContentsIndent, skipToDeeper, skipTo)) {
                    result = Result.same;
                }
                else { // if (contentsLine.trim() === ''  ||  (contentsLine.startsWith(contentsIndent)  &&  contentsIndent !== '')) {
                    result = Result.skipped;
                }
            }
            if (result === Result.same) {
                partsLineNum += 1;
                if (partsLineNum > expectedParts.length) {
                    break;
                }
                skipTo = '';
            }
            else if (result === Result.skipped) {
                // Do nothing
            }
            else { // Result.different
                partsLineNum = partsLineNumFirst;
                skipTo = '';
            }
        }
        if (result === Result.same) {
            unexpectedLine = null;
        }
        else if (result === Result.different) {
            if (unexpectedLine === null) {
                if (partsLineNum <= partsLineNumFirst) {
                    unexpectedLine = {
                        contentsLineNum: 0,
                        contentsLine: '',
                        contentsIndentLength: 0,
                        partsLineNum: partsLineNum,
                        partsLine: expectedParts[0],
                        partsIndentLength: partsBaseIndentLength,
                        indentDiff: 0,
                    };
                }
                else {
                    unexpectedLine = {
                        contentsLineNum: contentsLineNum,
                        contentsLine: testingContents[contentsLineNum - 1],
                        contentsIndentLength: 0,
                        partsLineNum: partsLineNum,
                        partsLine: expectedParts[partsLineNum - 1],
                        partsIndentLength: partsBaseIndentLength,
                        indentDiff: 0,
                    };
                }
            }
        }
        else if (result === Result.skipped) {
            if (unexpectedLine === null) {
                result = Result.different;
                unexpectedLine = {
                    contentsLineNum: skipStartLineNum,
                    contentsLine: skipFrom,
                    contentsIndentLength: 0,
                    partsLineNum: partsLineNum,
                    partsLine: skipTo,
                    partsIndentLength: partsBaseIndentLength,
                    indentDiff: 0,
                };
            }
        }
        return unexpectedLine;
    }
    function _foundFirstLine(contentsLine, partsFirstLine, partsStartsWithHyphen) {
        if (!partsStartsWithHyphen) {
            var partColumnIndexInContents = contentsLine.indexOf(partsFirstLine);
        }
        else { // if partsStartsWithHyphen
            const contentsStartsWithHyphen = (contentsLine.trimStart()[0] === '-');
            if (contentsStartsWithHyphen) {
                var partColumnIndexInContents = contentsLine.indexOf('-');
                var partColumnIndexInContents = contentsLine.indexOf(partsFirstLine, partColumnIndexInContents + 1);
            }
            else {
                var partColumnIndexInContents = notFound;
            }
        }
        const foundFirstLineOfParts = (partColumnIndexInContents !== notFound);
        if (foundFirstLineOfParts) {
            var rightOfFoundInContents = contentsLine.substring(partColumnIndexInContents + partsFirstLine.length).trim();
        }
        else {
            var rightOfFoundInContents = ''; // This value will be ignored
        }
        return foundFirstLineOfParts && rightOfFoundInContents === '';
    }
    function _stringsWithoutIndentAreSame(contentsLineWithoutIndent, partsLineWithoutIndent) {
        const contents = contentsLineWithoutIndent;
        const parts = partsLineWithoutIndent;
        if (contents[0] === '-' && parts[0] === '-') {
            return contents.substring(1).trimLeft() === parts.substring(1).trimLeft();
        }
        else {
            return contents === parts;
        }
    }
    function _trimStringsAreSame(contentsLine, partsLine) {
        if (contentsLine.trimLeft()[0] === '-' && partsLine.trimLeft()[0] === '-') {
            return contentsLine.trimLeft().substring(1).trim() === partsLine.trimLeft().substring(1).trim();
        }
        else {
            return contentsLine.trim() === partsLine.trim();
        }
    }
    function _foundSkipTo(contentsLine, skipToContentsIndent, skipToDeeper, skipTo) {
        if (contentsLine.startsWith(skipToContentsIndent)) {
            const hasHyphen = skipToContentsIndent.slice(-1) === '-';
            if (!hasHyphen) {
                if (!skipToDeeper) {
                    return contentsLine.substring(skipToContentsIndent.length).trimRight() === skipTo;
                }
                else { // skipToDeeper
                    return contentsLine[skipToContentsIndent.length] === ' ' &&
                        contentsLine.substring(skipToContentsIndent.length).trim() === skipTo;
                }
            }
            else { // hasHyphen
                return contentsLine.substring(skipToContentsIndent.length).trim() === skipTo;
            }
        }
        else {
            return false;
        }
    }
    function _pushToIndentStack(contentsIndentStack, partsIndentStack, contentsLine, partsLine) {
        const contentsIndent = indentRegularExpression.exec(contentsLine)[0];
        const partsIndent = indentRegularExpression.exec(partsLine)[0];
        contentsIndentStack.push(contentsIndent);
        partsIndentStack.push(partsIndent);
        if (!_hasFirstFieldWithHyphen(partsLine, partsIndent.length)) {
            return [contentsIndent, partsIndent];
        }
        else {
            const contentsIndent = getIndentWithoutHyphen(contentsLine);
            const partsIndent = getIndentWithoutHyphen(partsLine);
            contentsIndentStack.push(contentsIndent);
            partsIndentStack.push(partsIndent);
            return [contentsIndent, partsIndent];
        }
    }
    function _hasFirstFieldWithHyphen(line, indentLength) {
        const lineStartsWithHyphen = (line[indentLength] === '-');
        if (lineStartsWithHyphen) {
            const rightOfHyphen = line.substring(indentLength + 1).trimLeft();
            return rightOfHyphen[0] !== '#';
        }
        else {
            return false;
        }
    }
    function _getIndentDiff(contentsIndentStack, contentsLine, partsIndentStack, partsLine, partsBaseIndentLength) {
        const contentsIndentPreviousLength = contentsIndentStack[contentsIndentStack.length - 1].length;
        const contentsIndentCurrentLength = indentRegularExpression.exec(contentsLine)[0].length;
        const partsIndentPreviousLength = partsIndentStack[partsIndentStack.length - 1].length + partsBaseIndentLength;
        const partsIndentCurrentLength = indentRegularExpression.exec(partsLine)[0].length;
        if (contentsIndentCurrentLength > contentsIndentPreviousLength && partsIndentCurrentLength > partsIndentPreviousLength) {
            return 0;
        }
        else if (contentsIndentCurrentLength === contentsIndentPreviousLength && partsIndentCurrentLength > partsIndentPreviousLength) {
            return -(partsIndentCurrentLength - partsIndentPreviousLength);
        }
        else if (contentsIndentCurrentLength > contentsIndentPreviousLength && partsIndentCurrentLength === partsIndentPreviousLength) {
            return contentsIndentCurrentLength - contentsIndentPreviousLength;
        }
        else {
            return contentsIndentCurrentLength - partsIndentCurrentLength;
        }
    }
}
export function coloredDiff(redLine, greenLine, redHeaderLength = 0, greenHeaderLength = 0) {
    const green = chalk.bgGreen.black;
    const red = chalk.bgRed.black;
    const changes = diff.diffChars(redLine.substring(redHeaderLength), greenLine.substring(greenHeaderLength));
    redLine = redLine.substring(0, redHeaderLength);
    greenLine = greenLine.substring(0, greenHeaderLength);
    for (const change of changes) {
        if (change.added) {
            greenLine += green(change.value);
        }
        else if (change.removed) {
            redLine += red(change.value);
        }
        else {
            greenLine += change.value;
            redLine += change.value;
        }
    }
    return { greenLine, redLine };
}
export function splitIdioms(idioms, words) {
    var output = '';
    const minimumWordLength = 2;
    const dictionary = new Set();
    for (const word of words) {
        if (word.length >= minimumWordLength) {
            dictionary.add(word);
        }
    }
    const idiomArray = idioms.split(' ');
    for (const idiom of idiomArray) {
        var splitWords = '';
        for (let offset = 0; offset < idiom.length;) {
            var found = false;
            var word = '';
            for (let length = idiom.length - offset; length >= minimumWordLength; length -= 1) {
                word = idiom.substr(offset, length);
                if (dictionary.has(word)) {
                    found = true;
                    break;
                }
            }
            if (found) {
                splitWords += word + ' ';
                offset += word.length;
            }
            else {
                splitWords = '';
                break;
            }
        }
        if (splitWords !== '') {
            output += splitWords;
        }
        else {
            output += idiom + ' ';
        }
    }
    output = output.substring(0, output.length - 1);
    return output;
}
export function chageToAlphabets(inputString) {
    const japaneseTable = {
        'あ': 'a', 'ｂ': 'b', 'ｃ': 'c', 'ｄ': 'd', 'え': 'e', 'ｆ': 'f', 'ｇ': 'g', 'ｈ': 'h',
        'い': 'i', 'ｊ': 'j', 'ｋ': 'k', 'ｌ': 'l', 'ｍ': 'm', 'ｎ': 'n',
        'お': 'o', 'ｐ': 'p', 'ｑ': 'q', 'ｒ': 'r', 'ｓ': 's', 'ｔ': 't', 'う': 'u', 'ｖ': 'v', 'ｗ': 'w', 'ｘ': 'x', 'ｙ': 'y', 'ｚ': 'z',
        '　': ' ', '！': '!', '”': '"', '＃': '#', '＄': '$', '％': '%', '＆': '&', '’': '\'', '（': '(', '）': ')',
        'ー': '-', '＝': '=', '＾': '^', '〜': '~', '＼': '\\', '￥': '\\', '｜': '|', '＠': '@', '｀': '`', '「': '[', '『': '{',
        '；': ';', '＋': '+', '：': ':', '＊': '*', '」': ']', '』': '}', '、': ',', '＜': '<', '。': '.', '＞': '>', '・': '/', '？': '?', '＿': '_',
        'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko', 'さ': 'sa', 'し': 'si', 'す': 'su', 'せ': 'se', 'そ': 'so',
        'た': 'ta', 'ち': 'ti', 'つ': 'tu', 'て': 'te', 'と': 'to', 'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
        'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho', 'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
        'や': 'ya', 'ゆ': 'yu', 'よ': 'yo', 'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro', 'わ': 'wa', 'を': 'wo', 'ん': 'n',
        'きゃ': 'kya', 'きゅ': 'kyu', 'きょ': 'kyo', 'しゃ': 'sha', 'しゅ': 'shu', 'しょ': 'sho', 'ちゃ': 'cha', 'ちゅ': 'chu', 'ちょ': 'cho',
        'にゃ': 'nya', 'にゅ': 'nyu', 'にょ': 'nyo', 'ひゃ': 'hya', 'ひゅ': 'hyu', 'ひょ': 'hyo', 'ふぁ': 'fa', 'ふぃ': 'fi', 'ふぇ': 'fe', 'ふぉ': 'fo',
        'みゃ': 'mya', 'みゅ': 'myu', 'みょ': 'myo', 'りゃ': 'rya', 'りゅ': 'ryu', 'りょ': 'ryo',
        'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go', 'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
        'だ': 'da', 'ぢ': 'di', 'づ': 'du', 'で': 'de', 'ど': 'do',
        'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo', 'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
        'ぎゃ': 'gya', 'ぎゅ': 'gyu', 'ぎょ': 'gyo', 'じゃ': 'ja', 'じゅ': 'ju', 'じょ': 'jo', 'ぢゃ': 'dya', 'ぢゅ': 'dyu', 'ぢょ': 'dyo',
        'びゃ': 'bya', 'びゅ': 'byu', 'びょ': 'byo', 'ぴゃ': 'pya', 'ぴゅ': 'pyu', 'ぴょ': 'pyo',
        'ぁ': 'la', 'ぃ': 'li', 'ぅ': 'lu', 'ぇ': 'le', 'ぉ': 'lo',
        'ゔぁ': 'va', 'ゔぃ': 'vi', 'ゔ': 'vu', 'ゔぇ': 've', 'ゔぉ': 'vo', 'うぃ': 'wi', 'うぇ': 'we',
        'くぁ': 'qa', 'くぃ': 'qi', 'くぅ': 'qu', 'くぇ': 'qe', 'くぉ': 'qo',
        'すぁ': "swa", 'すぃ': "swi", 'すぅ': "swu", 'すぇ': "swe", 'すぉ': "swo",
        'でゃ': 'dha', 'でぃ': 'deli', 'でゅ': 'dhu', 'でぇ': 'dele', 'でょ': 'dho',
        'っか': 'kka', 'っき': 'kki', 'っく': 'kku', 'っけ': 'kke', 'っこ': 'kko', 'っさ': 'ssa', 'っし': 'ssi', 'っす': 'ssu', 'っせ': 'sse', 'っそ': 'sso',
        'った': 'tta', 'っち': 'tti', 'っつ': 'ttu', 'って': 'tte', 'っと': 'tto',
        'っは': 'hha', 'っひ': 'hhi', 'っふ': 'ffu', 'っへ': 'hhe', 'っほ': 'hho', 'っふぁ': 'ffa', 'っふぃ': 'ffi', 'っふぇ': 'ffe', 'っふぉ': 'ffo',
        'っま': 'mma', 'っみ': 'mmi', 'っむ': 'mmu', 'っめ': 'mme', 'っも': 'mmo', 'っや': 'yya', 'っゆ': 'yyu', 'っいぇ': 'yye', 'っよ': 'yyo',
        'っら': 'rra', 'っり': 'rri', 'っる': 'rru', 'っれ': 'rre', 'っろ': 'rro', 'っわ': 'wwa', 'っうぃ': 'wwi', 'っうぇ': 'wwe', 'っを': 'wwo',
        'っが': 'gga', 'っぎ': 'ggi', 'っぐ': 'ggu', 'っげ': 'gge', 'っご': 'ggo', 'っざ': 'zza', 'っじ': 'zzi', 'っず': 'zzu', 'っぜ': 'zze', 'っぞ': 'zzo',
        'っだ': 'dda', 'っぢ': 'ddi', 'っづ': 'ddu', 'っで': 'dde', 'っど': 'ddo',
        'っば': 'bba', 'っび': 'bbi', 'っぶ': 'bbu', 'っべ': 'bbe', 'っぼ': 'bbo', 'っぱ': 'ppa', 'っぴ': 'ppi', 'っぷ': 'ppu', 'っぺ': 'ppe', 'っぽ': 'ppo',
        'っぁ': 'lla', 'っぃ': 'lli', 'っぅ': 'llu', 'っぇ': 'lle', 'っぉ': 'llo',
    };
    const second = ['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'];
    var output = '';
    for (let i = 0; i < inputString.length; i += 1) {
        const input = inputString.substr(i, 1);
        const nextInput = inputString.substr(i + 1, 1);
        if (second.includes(nextInput) || input === 'っ') {
            const withLittle = input + nextInput;
            const with2Little = input + nextInput + inputString.substr(i + 2, 1);
            if (with2Little in japaneseTable) {
                output += japaneseTable[with2Little];
                i += 2;
            }
            else if (withLittle in japaneseTable) {
                output += japaneseTable[withLittle];
                i += 1;
            }
            else {
                output += japaneseTable[input];
            }
        }
        else {
            if (input in japaneseTable) {
                output += japaneseTable[input];
            }
            else {
                output += input;
            }
        }
    }
    return output;
}
export async function parseCSVColumns(columns) {
    if (!columns) {
        return []; // stream.Readable.from(undefined) occurs an error
    }
    // Prevent csv-parse module error, when a quote is found inside a field.
    // A quote is always written at frist character.
    // The inside quote should be parsed as a character data in the column.
    if (columns[0] === '"' || columns.includes(',')) {
        return new Promise((resolveFunction, rejectFunction) => {
            var columnArray = [];
            stream.Readable.from(columns)
                .pipe(csvParse.parse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' }))
                .on('data', (columns) => {
                columnArray = columns;
            })
                .on('end', () => {
                resolveFunction(columnArray);
            })
                .on('error', (e) => {
                e.message = `Error in csv-parse module. Parsing CSV is:\n${columns}\n${e.message}`;
                rejectFunction(e);
            });
        });
    }
    else {
        return [columns];
    }
}
export function parseCSVColumnPositions(csv, columns) {
    const positions = [];
    var searchPosition = 0;
    for (const column of columns) {
        const columnPosition = csv.indexOf(column.replace(/\"/g, '""'), searchPosition);
        positions.push(columnPosition);
        searchPosition = csv.indexOf(',', columnPosition + column.length) + 1;
    }
    return positions;
}
export function escapeRegularExpression(expression) {
    return expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}
export function replace(input, replacers) {
    var replacing = input;
    for (const replacer of replacers) {
        var optionCount = 0;
        if (replacer.from) {
            optionCount += 1;
        }
        if (replacer.fromCSV) {
            throw new Error('"ReplaceParameter.fromCSV" must be called with replaceAsync function');
        }
        if (replacer.lineNum) {
            throw new Error('"ReplaceParameter.lineNum" must be called with replaceAsync function');
        }
        if (optionCount !== 1) {
            throw new Error('"ReplaceParameter" must set either "from", "fromCSV" or "lineNum" attribute');
        }
        if (replacer.from) {
            replacing = replacing.replace(replacer.from, replacer.to);
        }
    }
    const replaced = replacing;
    return replaced;
}
export async function replaceAsync(input, replacers) {
    var replacing = input;
    for (const replacer of replacers) {
        var optionCount = 0;
        if (replacer.fromCSV) {
            optionCount += 1;
        }
        if (replacer.lineNum) {
            optionCount += 1;
        }
        if (optionCount >= 2) {
            throw new Error('"ReplaceParameter" must set either "fromCSV" or "lineNum" attribute');
            // OK patterns are:
            // - replacer.from
            // - replacer.fromCSV
            // - replacer.fromCSV, replacer.from
            // - replacer.lineNum
            // - replacer.lineNum, replacer.from
        }
        if (replacer.from && optionCount === 0) {
            replacing = replacing.replace(replacer.from, replacer.to);
        }
        if (replacer.lineNum) {
            const stream = new Readable();
            stream.push(replacing);
            stream.push(null);
            const reader = readline.createInterface({
                input: stream,
                crlfDelay: Infinity
            });
            const writer = new WritableMemoryStream();
            var lineNum = 0;
            for await (const line1 of reader) {
                const line = line1;
                lineNum += 1;
                if (lineNum === replacer.lineNum) {
                    if (replacer.from) {
                        var replacedLine = line.replace(replacer.from, replacer.to);
                    }
                    else {
                        var replacedLine = replacer.to;
                    }
                    writer.write(`${replacedLine}\n`);
                }
                else {
                    writer.write(`${line}\n`);
                }
            }
            replacing = writer.toString();
        }
        if (replacer.fromCSV) {
            const inputStream = Readable.from(replacing);
            const keywords = await parseCSVColumns(replacer.fromCSV);
            if (replacer.from) {
                var replaceFrom = replacer.from;
            }
            else {
                var replaceFrom = keywords[keywords.length - 1];
            }
            const lineNum = await searchAsTextSub({ input: inputStream }, replacer.fromCSV, true);
            replacing = await replaceAsync(replacing, [{ from: replaceFrom, lineNum, to: replacer.to }]);
        }
    }
    const replaced = replacing;
    return replaced;
}
class WritableMemoryStream extends Writable {
    constructor() {
        super();
        this.array = [];
    }
    _write(chunk, _encoding, callback) {
        this.array.push(chunk);
        callback();
    }
    toString() {
        return this.array.join('');
    }
}
const dotenvSecrets = {};
var dotenvInheritToProcessEnv = false;
export function loadDotEnvSecrets(inheritProcessEnv = false) {
    dotenvInheritToProcessEnv = inheritProcessEnv;
    if (inheritProcessEnv) {
        dotenv.config();
    }
    else {
        const envronmentVariableNames = Object.keys(process.env);
        dotenv.config();
        const withSecret = Object.assign({}, process.env);
        const secretNames = Object.keys(withSecret).filter((key) => (envronmentVariableNames.indexOf(key) === -1));
        for (const secretName of secretNames) {
            dotenvSecrets[secretName] = process.env[secretName];
            delete process.env[secretName];
        }
    }
}
export function getDotEnvSecrets() {
    return dotenvSecrets;
}
export function getProcessEnvAndDotEnvSecrets() {
    if (dotenvInheritToProcessEnv) {
        return process.env;
    }
    else {
        return Object.assign(Object.assign({}, process.env), dotenvSecrets);
    }
}
// indentRegularExpression
// e.g. indent = indentRegularExpression.exec( line )![0];
export const indentRegularExpression = /^( |\t)*/;
// indentHyphenRegularExpression
// e.g. indentWithHyphen = indentHyphenRegularExpression.exec( line )![0];
// e.g. match = indentHyphenRegularExpression.exec( line )!;
//    const  leftOfHyphen = match[1];
//    const  rightOfHyphen = match[3];
export const indentHyphenRegularExpression = /^(( |\t)*)-(( |\t)*)/;
// Data group
export function isSameArray(log, answer) {
    if (log.length !== answer.length) {
        return false;
    }
    else {
        for (var i = 0; i < log.length; i += 1) {
            if (log[i] !== answer[i]) {
                return false;
            }
        }
        return true;
    }
}
// isSameArrayOf
// T: string, nunmber
// If only order had difference, this returns true
export function isSameArrayOf(log, answer) {
    const matched = log.filter((item) => answer.includes(item));
    const isSame = (matched.length === answer.length && log.length === answer.length);
    return isSame;
}
export function getCommonItems(arrayA, arrayB) {
    const commonItems = [];
    for (const item of arrayA) {
        if (arrayB.includes(item)) {
            commonItems.push(item);
        }
    }
    return commonItems;
}
export function cutSameItems(array) {
    return Array.from(new Set(array));
}
// stableUniqueFilterFunction
// const  uniqueArray1 = array1.filter(lib.stableUniqueFilterFunction((element1, element2) =>
//         element1.path == element2.path));
export function stableUniqueFilterFunction(isSameFunction) {
    return function (element, index, array) {
        return index === array.findIndex((e) => isSameFunction(element, e));
    };
}
// lastUniqueFilterFunction
// const  uniqueArray1 = array1.filter(lib.lastUniqueFilterFunction((element1, element2) =>
//         element1.path == element2.path));
export function lastUniqueFilterFunction(isSameFunction) {
    return function (element, index, array) {
        const matchIndices = array.map((e, index) => isSameFunction(element, e) ? index : -1);
        return index === Math.max(...matchIndices);
    };
}
// fastUniqueFilter
// const  uniqueArray1 = lib.fastUniqueFilter(array1, (element) => (element.path));
export function fastUniqueFilter(array, getKeyFunction) {
    return Array.from(new Map(array.map((element) => [getKeyFunction(element), element])).values());
}
export async function parseMap(mapString) {
    const startIndex = mapString.indexOf('{');
    const lastIndex = mapString.lastIndexOf('}');
    if (!startIndex || !lastIndex) {
        throw new Error('in lib.ts parseMap');
    }
    var keyType;
    var valueType;
    function parseValue(value) {
        value = value.trim();
        if (!valueType) {
            if (value.substring(0, 1) === '"' && value.slice(-1) === '"') {
                valueType = 'string';
            }
            else {
                const isNumber = !isNaN(value);
                valueType = isNumber ? 'string' : 'object';
            }
        }
        if (valueType === 'number') {
            return parseFloat(value);
        }
        else if (valueType === 'string') {
            if (value.substring(0, 1) === '"' && value.slice(-1) === '"') {
                return value.substring(1, value.length - 1);
            }
            else {
                throw new Error('in lib.ts parseValue');
            }
        }
        else if (valueType === 'object') {
            return JSON.parse(value);
        }
    }
    const stream = new Readable();
    stream.push(mapString);
    stream.push(null);
    const reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });
    const map = new Map();
    for await (const line of reader) {
        if (!keyType) {
            const matchNumber = /([0-9]+) *=>(.*),/.exec(line);
            const matchString = /"(.*)" *=>(.*),/.exec(line);
            if (matchNumber) {
                keyType = 'number';
            }
            else if (matchString) {
                keyType = 'string';
            }
        }
        if (keyType === 'number') {
            const match = /([0-9]+) *=>(.*),/.exec(line);
            if (match) {
                map.set(parseInt(match[1]), parseValue(match[2]));
            }
        }
        else { // if (keyType === 'string') {
            const match = /"(.*)" *=>(.*),/.exec(line);
            if (match) {
                map.set(match[1], parseValue(match[2]));
            }
        }
    }
    // // This code sorts keys
    // const  keyIsNumber = /[0-9]+ *=>/.test(mapString);
    // var  itemsString = mapString.substring(startIndex, lastIndex + 1).trim();
    // itemsString = itemsString.replace(/([0-9]+) *=>/g, '"n-$1":');
    // const  stringOfJSON = itemsString.replace(/,[ \t\n]*}$/, '}');  // cut last ','
    // const  object = JSON.parse(stringOfJSON)
    // const  map = new Map<keyT, valueT>();
    // for (const [key, value] of Object.entries(object)) {
    //     if (keyIsNumber) {
    //         map.set(parseInt(key) as any, value as any);
    //     } else {
    //         map.set(key as any, value as any);
    //     }
    // }
    return map;
}
export function isAlphabetIndex(index) {
    const lastCharacter = index.slice(-1);
    const lastCharacterIsNumber = !isNaN(lastCharacter);
    return !lastCharacterIsNumber && index !== '/';
}
// getAlphabetIndex
// 1=>a, 2=>b, ..., 25=>y, 26=>z26z, 27=>z27z, ...
// First charactor and last cahractor must be alphabet.
export function getAlphabetIndex(num) {
    const index = parseInt(num);
    if (index >= 1 && index <= 25) {
        const ascii_code_a_minus1 = 96;
        return String.fromCharCode(index + ascii_code_a_minus1);
    }
    else {
        return `z${num}z`;
    }
}
// fromAlphabetIndex
// a=>1, b=>2, ..., y=>25, z26z=>26, z27z=>27, ...
export function fromAlphabetIndex(index) {
    const code = index.charCodeAt(0);
    const ascii_code_a_minus1 = 96;
    const ascii_code_y = 121;
    if (code > ascii_code_a_minus1 && code <= ascii_code_y) {
        return code - ascii_code_a_minus1;
    }
    else if (isAlphabetIndex(index)) {
        return parseInt(index.slice(1, -1));
    }
    else {
        return NaN;
    }
}
export function cutAlphabetInIndex(index) {
    for (var parentIndex = index; parentIndex !== '/'; parentIndex = path.dirname(parentIndex)) {
        const lastCharacter = parentIndex.slice(-1);
        const lastCharacterIsNumber = !isNaN(lastCharacter);
        if (lastCharacterIsNumber) {
            break;
        }
    }
    return parentIndex;
}
export var hasInterfaceOf;
(function (hasInterfaceOf) {
    function Error(object) {
        return (object.hasOwnProperty('message'));
    }
    hasInterfaceOf.Error = Error;
})(hasInterfaceOf || (hasInterfaceOf = {}));
// getObjectID
// Exmaple:
//    var  object1={}, object2={}
//    console.log( objectId(object1) ) // 1
//    console.log( objectId(object2) ) // 2
export function getObjectID(object) {
    if (!objectIDs.has(object)) {
        objectCount += 1;
        objectIDs.set(object, objectCount);
    }
    return objectIDs.get(object);
}
const objectIDs = new WeakMap;
var objectCount = 0;
// User interface group
export class InputOption {
    constructor(inputLines) {
        this.inputLines = inputLines;
        this.nextLineIndex = 0;
        this.nextParameterIndex = 2;
    }
}
const testBaseFolder = String.raw `R:\home\mem_cache\MyDoc\src\TypeScript\typrm\test_data` + '\\';
const inputOption = new InputOption([
/*
    testBaseFolder +`____.yaml`,
    String.raw `file`,
*/
]);
export function setInputOption(option) {
    Object.assign(inputOption, option);
}
// input
// #keyword: lib.ts input
// Example: const name = await input('What is your name? ');
export async function input(guide) {
    // Input emulation
    if (inputOption.inputLines) {
        if (inputOption.nextLineIndex < inputOption.inputLines.length) {
            const value = inputOption.inputLines[inputOption.nextLineIndex];
            inputOption.nextLineIndex += 1;
            console.log(guide + value);
            return value;
        }
    }
    // Read the starting process parameters
    while (inputOption.nextParameterIndex < process.argv.length) {
        const value = process.argv[inputOption.nextParameterIndex];
        inputOption.nextParameterIndex += 1;
        if (value.substring(0, 1) !== '-') {
            console.log(guide + value);
            return value;
        }
        if (value !== '--test') {
            inputOption.nextParameterIndex += 1;
        }
    }
    // input
    return InputObject.input(guide);
}
// inputPath
// Example: const name = await input('What is your name? ');
export async function inputPath(guide) {
    const key = await input(guide);
    if (key.endsWith('()')) {
        return key;
    }
    else {
        return pathResolve(key);
    }
}
export function inputSkip(count) {
    inputOption.nextParameterIndex += count;
}
export function setInputEchoBack(isEnabled) {
    inputEchoBack = isEnabled;
}
var inputEchoBack = false;
export function getInputEchoBack() {
    return inputEchoBack;
}
class StandardInputBuffer {
    constructor() {
        this.inputBuffer = [];
        this.inputResolver = undefined;
    }
    delayedConstructor() {
        this.readlines = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.readlines.on('line', async (line) => {
            if (this.inputResolver) {
                if (inputEchoBack) {
                    console.log(line);
                }
                this.inputResolver(line); // inputResolver() is resolve() in input()
                this.inputResolver = undefined;
            }
            else {
                this.inputBuffer.push(line);
            }
        });
        this.readlines.setPrompt('');
        this.readlines.prompt();
    }
    async input(guide) {
        if (!this.readlines) {
            this.delayedConstructor();
        }
        return new Promise((resolve, reject) => {
            const nextLine = this.inputBuffer.shift();
            if (typeof nextLine === 'string') {
                console.log(guide + nextLine);
                resolve(nextLine);
            }
            else { // nextLine === undefnied
                process.stdout.write(guide);
                this.inputResolver = resolve;
            }
        });
    }
    close() {
        if (this.readlines) {
            this.readlines.close();
        }
    }
}
const InputObject = new StandardInputBuffer();
export function getInputObject() {
    return InputObject;
}
export function cutEscapeSequence(textWithEscapeSequence) {
    return textWithEscapeSequence.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}
export function getSnapshot(label, deafultSnapshot = undefined) {
    if (!(label in snapshots)) {
        if (!deafultSnapshot) {
            throw new Error(`not found snapshot label "${label}" in "__Project__/src/__snapshots__/main.test.ts.snap" file.`);
        }
        return deafultSnapshot;
    }
    const snapshot = snapshots[label];
    return snapshot.substr(2, snapshot.length - 4).replace(/\\\"/g, '"');
}
// pp
// Debug print.
// #keyword: lib.ts pp
// Example:
//    pp(var);
// Example:
//    var d = pp(var);
//    d = d;  // Set break point here and watch the variable d
// Example:
//    var d = ppClear();
//    pp(var);
// Example:
//    try {
//
//        await main();
//    } finally {
//        var d = pp('');
//        d = [];  // Set break point here and watch the variable d
//    }
export function pp(message) {
    if (message instanceof Array) {
        debugOut.push(`length: ${message.length}`);
        for (const element of message) {
            pp(element);
        }
    }
    else {
        if (typeof message === 'object') {
            if (message instanceof Map) {
                const messageObject = Object.create(null);
                for (let [k, v] of message) {
                    messageObject[k] = v;
                }
                message = JSON.stringify(messageObject, null, '    ');
            }
            else {
                message = JSON.stringify(message, null, '    ');
            }
        }
        else if (message === undefined) {
            message = '(undefined)';
        }
        else if (message === null) {
            message = '(null)';
        }
        debugOut.push(message.toString());
    }
    return debugOut;
}
export const debugOut = [];
// ppClear
// #keyword: ppClear
export function ppClear() {
    debugOut.length = 0;
    return debugOut;
}
// cc
// Through counter.
// #keyword: lib.ts cc
// Example:
//   cc();
// Example:
//   var c = cc().debugOut;  // Set break point here and watch the variable c
// Example:
//   if ( cc(1).isTarget )  // count up and if count is 1
//   var d = pp('');  // Set break point here and watch the variable d
// Example:
//   if ( gCount[0] >= 1 )  // if count is 1 or over
export function cc(targetCount = 9999999, label = '0') {
    if (!(label in gCount)) {
        gCount[label] = 0;
    }
    gCount[label] += 1;
    pp(`${label}:countThrough[${label}] = ${gCount[label]}`);
    const isTarget = (gCount[label] === targetCount);
    if (isTarget) {
        pp('    **** It is before the target! ****');
    }
    return { isTarget, debugOut };
}
export const gCount = {};
const notFoundInFile = -2;
const notFound = -1;
//# sourceMappingURL=lib.js.map