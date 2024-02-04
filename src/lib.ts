import * as fs from "fs";
import * as path from "path";
import globby from 'globby';
import * as readline from 'readline';
import { ReadLineOptions } from 'readline';
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
export async function  copyFolderSync(sourceFolderPath: string, destinationFolderPath: string) {
    const  currentFolderPath = process.cwd();
    const  destinationFolderFullPath = getFullPath(destinationFolderPath, currentFolderPath);
    process.chdir(sourceFolderPath);

    const  paths: string[] = await globby(['**/*']);
    for await (const path_ of paths) {
        const  sourceFilePath = path_;
        const  destinationFilePath = path.resolve(destinationFolderFullPath +'/'+ path_);

        copyFileSync(sourceFilePath,  destinationFilePath);
    }
    process.chdir(currentFolderPath);
}

// copyFileSync
// #keyword: lib.ts copyFileSync
// This also makes the copy target folder.
export function  copyFileSync(sourceFilePath: string, destinationFilePath: string) {
	const  destinationFolderPath = path.dirname(destinationFilePath);
	fs.mkdirSync(destinationFolderPath, {recursive: true});

	fs.copyFileSync(sourceFilePath, destinationFilePath);
}

export function  rmdirSync(folderPath: string) {
    if (fs.existsSync(folderPath)) {
        fs.rmdirSync(folderPath, {recursive: true});
            // (node:8328) [DEP0147] DeprecationWarning: In future versions of Node.js, fs.rmdir(path, { recursive: true }) will be removed. Use fs.rm(path, { recursive: true }) instead
        // fs.rmSync(folderPath, {recursive: true});
            // Property 'rm' does not exist on type 'typeof import("fs")'.ts(2339)
            // #ref: https://nodejs.org/api/fs.html#:~:text=rmSync
    }
}

// replaceFileSync
// #keyword: lib.ts replaceFileSync
// replaceFileSync('a.txt', (text)=>(text.replace('before', 'after')));
export function  replaceFileSync(sourceFilePath: string, replaceFunction: {(text: string): string}, destinationFilePath: string = '') {
    const  text = fs.readFileSync(sourceFilePath, 'utf-8');
    const  replacedText = replaceFunction(text);
    if (destinationFilePath === '') {
        destinationFilePath = sourceFilePath;
    }
    fs.writeFileSync(destinationFilePath, replacedText);
}

// replaceFileAsync
// #keyword: lib.ts replaceFileAsync
// replaceFileSync('a.txt', (text)=>(text.replace('before', 'after')));
export async function  replaceFileAsync(sourceFilePath: string, replaceFunction: {(text: string): Promise<string>}, destinationFilePath: string = '') {
    const  text = fs.readFileSync(sourceFilePath, 'utf-8');
    const  replacedText = await replaceFunction(text);
    if (destinationFilePath === '') {
        destinationFilePath = sourceFilePath;
    }
    fs.writeFileSync(destinationFilePath, replacedText);
}

export async function  searchAsTextSub(readlineOptions: ReadLineOptions, keyword: string, csvOption: boolean): /* lineNum */ Promise<number> {
    if (csvOption) {
        var    keywords = await parseCSVColumns(keyword);
        const  firstKeyword = keywords.shift();
        if ( ! firstKeyword) {
            throw Error(`ERROR: no keywords`);
        }
        var  currentKeyword = firstKeyword;
    } else {
        var  keywords = [keyword];
        var  currentKeyword = keyword;
    }

    var  lineNum = 0;
    var  breaking = false;
    var  exception: any;
    const  reader = readline.createInterface(addDefaultReadLineOptions(readlineOptions));

    for await (const line1 of reader) {
        if (breaking) {continue;}  // "reader" requests read all lines
        try {
            const  line: string = line1;
            lineNum += 1;

            if (line.includes(currentKeyword)) {
                if ( ! csvOption) {
                    breaking = true;  // return or break must not be written.
                        // https://stackoverflow.com/questions/23208286/node-js-10-fs-createreadstream-streams2-end-event-not-firing
                } else { // csvOption
                    const  nextKeyword = keywords.shift();
                    if ( ! nextKeyword) {
                        breaking = true;  // return or break must not be written.
                        currentKeyword = '';
                    } else {
                        currentKeyword = nextKeyword;
                    }
                }
            }
        } catch (e) {
            exception = e;
            breaking = true;
        }
    }
    if (exception) {
        throw exception;
    }
    if ( ! breaking) {
        lineNum = notFoundInFile;
    }

    return  lineNum;
}

function  addDefaultReadLineOptions(localOptions: ReadLineOptions): ReadLineOptions {
    return {crlfDelay: Infinity, ...localOptions};
}

export function  pathResolve(path_: string) {

    // '/c/home' format to current OS format
    if (path_.length >= 3) {
        if (path_[0] === '/'  &&  path_[2] === '/') {
            path_ = path_[1] +':'+ path_.substr(2);
        }
    }

    // Replace separators to OS format
    path_ = path.resolve(path_);

    return path_
}

export interface  UnexpectedLine {
    contentsLineNum: number;
    contentsLine: string;
    contentsIndentLength: number;
    partsLineNum: number;
    partsLine: string;
    partsIndentLength: number;
    indentDiff: number;
}

// getFullPath
// #keyword: lib.ts JavaScript (js) library getFullPath
// If "basePath" is current directory, you can call "path.resolve"
// If the variable has full path and litteral relative path, write `${___FullPath}/relative_path}`
export function  getFullPath(relativePath: string, basePath: string): string {
    var    fullPath = '';
    const  slashRelativePath = relativePath.replace(/\\/g,'/');
    const  colonSlashIndex = slashRelativePath.indexOf(':/');
    const  slashFirstIndex = slashRelativePath.indexOf('/');
    const  withProtocol = (colonSlashIndex + 1 === slashFirstIndex);  // e.g.) C:/, http://

    if (relativePath[0] === '/') {
        fullPath = relativePath;
    } else if (relativePath[0] === '~') {
        fullPath = relativePath.replace('~', getHomePath() );
    } else if (withProtocol) {
        fullPath = relativePath;
    } else {
        fullPath = path.join(basePath, relativePath);
    }
    return  fullPath;
}

// isFullPath
// #keyword: lib.ts JavaScript (js) library isFullPath
export function  isFullPath(path: string): boolean {
    const  colonPosition = path.indexOf(':');
    const  slashPosition = path.indexOf('/');
    const  backSlashPosition = path.indexOf('\\');
    if (slashPosition === notFound) {
        var  separatorPosition = backSlashPosition;
    } else if (backSlashPosition === notFound) {
        var  separatorPosition = slashPosition;
    } else {
        var  separatorPosition = Math.min(slashPosition, backSlashPosition);
    }

    if (colonPosition === notFound) {
        var  isFullPath = (separatorPosition === 0);
    } else if (colonPosition < separatorPosition) {
        var  isFullPath = (separatorPosition === colonPosition + 1);
    } else {
        var  isFullPath = (separatorPosition === 0);
    }
    return  isFullPath;
}

export function  isInFileSystem(path_: string): boolean {
    return  ! path_.includes('://');
}

export function  getExistingParentPath(path_: string): string {
    if (path.sep === '/') {
        path_ = replacePathToSlashed(path_);
    } else {
        path_ = replaceToPathForWindows(path_);
    }

    if ( ! (path_[0] === path.sep || path_.substr(1,2) === ':' + path.sep)) {
        return  getHomePath();
    }
    while (path_ !== path.sep) {
        if (fs.existsSync(path_)) {
            return  path_;
        }
        const  nextPath = path.dirname(path_);
        if (nextPath === path_  ||  nextPath === '.') {  // dirname('c:/') === '.' in mac
            return  getHomePath();
        }
        path_ = nextPath;
    }
    return  getHomePath();
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

export function  replacePathToSlashed(path_: string): string {
    if (path_.substring(0,2) === "\\\\") {
        return  path_.replace(/\//g, '\\');  // Windows network path
    } else {
        path_ = path_.replace(/\\([^ ]|$)/g, '/$1');
        if (/^([A-Za-z]):/.test(path_)) {
            path_ = path_[0].toLowerCase() + path_.substring(1);
            if (fs.existsSync('/mnt/c')) {
                path_ = '/mnt/' + path_[0] +':'+ path_.substring(2);
            }
        } else if (path_.startsWith('/mnt/')  &&  /[A-Za-z]/.test(path_[5])  &&  (path_[6] === '/'  ||  path_[6] === undefined)) {
            if ( ! fs.existsSync('/mnt/c')) {
                path_ = path_[5] +':'+ path_.substring(6);
            }
        }
        return  path_;
    }
}

export function  replaceToPathForWindows(path_: string): string {
    if (path_.startsWith('/mnt/')  &&  /[a-z]/.test(path_[5])  &&  (path_[6] === '/'  ||  path_[6] === undefined)) {
        return  path_[5].toUpperCase() +':'+ path_.substring(6).replace(/\//g, '\\');
    } else if (path_[1] === ':') {
        return  path_.substring(0,2).toUpperCase() + path_.substring(2).replace(/\//g, '\\');
    } else {
        return  path_.replace(/\//g, '\\');
    }
}

export function  checkNotInGitWorking() {
    var  path_ = process.cwd();

    if ( ! path_.includes('extract_git_branches')) {
        throw  new Error('This is not in project folder.')
    }
    while (path_.includes('extract_git_branches')) {
        path_ = path.dirname(path_);
    }
    while (path_ !== '/') {

        if (fs.existsSync(`${path_}/.git`)) {
            throw  new Error('This test is not supported with git submodule.')
        }
        path_ = path.dirname(path_);
    }
}

export function  getTestWorkFolderFullPath(): string {
    var  path_ = process.cwd();

    if ( ! path_.includes('extract_git_branches')) {
        throw  new Error('This is not in project folder.')
    }
    while (path_.includes('extract_git_branches')) {
        path_ = path.dirname(path_);
    }

    return  `${path_}/_test_of_extract_git_branches`;
}

// getHomePath
// #keyword: lib.ts getHomePath
export function  getHomePath(): string {
    if (process.env.HOME) {
        return  process.env.HOME;
    } else if (process.env.USERPROFILE) {
        return  process.env.USERPROFILE;
    } else {
        throw new Error('unexpected');
    }
}

// getGlobbyParameters
// #keyword: lib.ts getGlobbyParameters
export async function  getGlobbyParameters(targetPath: string, baseFullPath: string): Promise<GlobbyParameters> {
    var    targetFullPath = getFullPath(targetPath, baseFullPath);
    var    fileName = path.basename(targetFullPath);
    const  negated = (fileName[0] === '!');
    if (fileName[0] === '{'  &&  fileName[fileName.length - 1] === '}') {
        var  fileNames = await parseCSVColumns(fileName.substring(1, fileName.length - 1));
    } else {
        var  fileNames = [fileName];
    }
    const  filePath = 1;
    const  folderPath = 2;
    var    pathIs = 0;

    if (fileName.includes('*')) {
        pathIs = filePath;
    } else if (fileNames.length >= 2) {
        pathIs = filePath;
    } else {
        const  fileExists = fs.lstatSync(targetFullPath).isFile();  // This raises an exception, if path has wildcard
        if (fileExists) {
            pathIs = filePath;
        } else {
            pathIs = folderPath;
        }
    }
    if (pathIs === filePath) {
        var  targetFolderFullPath = path.dirname(targetFullPath);
        var  globbyParameters: string[] = [];
        for (let fileName_ of fileNames) {
            if (fileName_[0] !== '!') {
                globbyParameters.push(`**/${fileName_}`);
            } else {
                globbyParameters.push(`!**/${fileName_.substring(1)}`);
            }
        }
    } else {  // folderPath
        var  targetFolderFullPath = targetFullPath;
        var  globbyParameters = [`**/*`];
    }

    return  {
        targetFolderFullPath,
        globbyParameters,
    };
}

interface  GlobbyParameters {
    targetFolderFullPath: string;
    globbyParameters: string[];
}


// String group

// cutLeftOf
// #keyword: lib.ts cutLeftOf
// cutLeftOf("abcde", "c") == "cde"
export function  cutLeftOf(input: string, keyword: string): string {
    const  keywordPosition = input.indexOf(keyword);
    if (keywordPosition !== notFound) {

        return  input.substring(keywordPosition);
    } else {
        return  input;
    }
}

// cutLast
// #keyword: lib.ts cutLast
// cutLast("ab/", "/") == "ab"
// cutLast("abc", "/") == "abc"
export function  cutLast(input: string, keyword: string): string {
    if (input.endsWith(keyword)) {

        return  input.substring(0, input.length - keyword.length);
    } else {
        return  input;
    }
}

export function  cutIndent(lines: string[]) {
    const  nullLength = 99999;

    var  minIndentLength = nullLength;
    for (const line of lines) {
        if (line.trim() !== '') {
            const  indentLength = indentRegularExpression.exec( line )![0].length;
            minIndentLength = Math.min(minIndentLength, indentLength)
        }
    }

    for (var lineNum = 1;  lineNum <= lines.length;  lineNum += 1 ) {
        const  unindentedLine = lines[lineNum - 1].substring(minIndentLength);
        const  indentBefore = indentRegularExpression.exec( unindentedLine )![0];
        const  indentAfter = ' '.repeat(indentBefore.length);

        lines[lineNum - 1] = indentAfter + unindentedLine.substring(indentBefore.length);
    }

    return  lines;
}

export function  unexpandVariable(expanded: string, keyValues: string[][], out_replacedIndices: number[]|null = null): string {
    var  replacing = expanded;

    var  replacedTag = '\r\n';  // This is not matched with any values
    for (const [key, value] of keyValues) {
        const  keyRe = new RegExp(escapeRegularExpression( key ), 'g');
        const  valueRe = new RegExp(escapeRegularExpression( value ), 'g');

        replacing = replacing.replace(keyRe, replacedTag);
        replacing = replacing.replace(valueRe, replacedTag);
        replacedTag += '\n';
    }
    var  index = keyValues.length;

    for (const [key, _value] of keyValues.reverse()) {
        replacedTag = replacedTag.slice(0, replacedTag.length - 1);
        const  replacedTagRe = new RegExp(escapeRegularExpression( replacedTag ), 'g');
        if (out_replacedIndices) {
            index -= 1;
            if (replacing.includes(replacedTag)) {
                out_replacedIndices.unshift(index);
            }
        }

        replacing = replacing.replace(replacedTagRe, key);
    }

    const   unexpanded = replacing;
    return  unexpanded;
}

function  getIndentWithoutHyphen(line: string): string | null {
    const  match = indentHyphenRegularExpression.exec(line);
    if (match === null) {
        return  null;
    }
    const  leftOfHyphen = match[1] || '';
    const  rightOfHyphen = match[3] || '';
    if (rightOfHyphen[0] === '\t') {
        var  indentWithoutHyphen = leftOfHyphen + rightOfHyphen;
    } else {
        var  indentWithoutHyphen = leftOfHyphen + ' ' + rightOfHyphen;
    }
    return  indentWithoutHyphen;
}

// checkExpectedTextContents
// This ignores different indent depth and different indent width.
export function  checkExpectedTextContents(testingContents: string[], expectedParts: string[], anyLinesTag: string
        ): UnexpectedLine | null {

    return  _main(testingContents, expectedParts, anyLinesTag);
    function  _main(testingContents: string[], expectedParts: string[], anyLinesTag: string
            ): UnexpectedLine | null {
        if (expectedParts.length === 0) {
            return  null;
        }

        const  contents = testingContents;
        const  contentsLineCount = contents.length;
        var  contentsIndent = '';
        var  contentsIndentStack: string[] = [];
        var  skipToContentsIndent = '';
        var  skipToDeeper = false;
        const  parts = cutIndent(expectedParts.slice());
        const  partsStartsWithHyphen = (parts[0][0] === '-');
        var  partsBaseIndentLength = expectedParts[0].length - parts[0].length;
        var  partsFirstLine = parts[0].trim();
        var  partsLineNumFirst = 1;
        if (partsFirstLine.trim() === anyLinesTag) {
            partsFirstLine = parts[1].trim();
            partsLineNumFirst = 2;
        }
        if (partsStartsWithHyphen) {
            partsFirstLine = partsFirstLine.substring(1).trimLeft();
        }
        var  partsIndent = '';
        var  partsIndentStack: string[] = [];
        var  partsLineNum = partsLineNumFirst;
        enum Result { same, different, skipped };
        var  result = Result.different;
        var  unexpectedLine: UnexpectedLine | null = null;
        var  contentsIndentLength = 0;
        var  indentDiff = 0;
        var  skipTo = '';
        var  skipFrom = '';
        var  skipStartLineNum = 1;

        for (var contentsLineNum = 1;  contentsLineNum <= contentsLineCount;  contentsLineNum += 1) {
            const  contentsLine = contents[contentsLineNum-1];

            if (partsLineNum === partsLineNumFirst) {
                if (_foundFirstLine(contentsLine, partsFirstLine, partsStartsWithHyphen)) {
                    result = Result.same;
                    contentsIndentStack = [];
                    partsIndentStack = [];
                    if (partsLineNumFirst === 2) {
                        const  deeperContentsIndent = indentRegularExpression.exec(contentsLine)![0];
                        for (let lineNum = contentsLineNum - 1;  lineNum >= 1;  lineNum -= 1) {
                            const  aboveContentsLine = contents[lineNum-1];
                            if ( ! aboveContentsLine.startsWith(deeperContentsIndent)) {

                                [contentsIndent, partsIndent] =
                                    _pushToIndentStack(contentsIndentStack, partsIndentStack, aboveContentsLine, parts[0]);
                                break;
                            }
                        }
                    }
                    [contentsIndent, partsIndent] =
                        _pushToIndentStack(contentsIndentStack, partsIndentStack, contentsLine, parts[partsLineNumFirst - 1]);
                    contentsIndentLength = contentsIndentStack[0].length - partsIndentStack[0].length;
                } else {
                    result = Result.different;
                }
            } else if (skipTo === '') {  // not skip
                var    partsLine = parts[partsLineNum-1];
                const  contentsLineWithoutIndent = contentsLine.substring(contentsIndent.length);
                const  partsLineWithoutIndent = partsLine.substring(partsIndent.length);
                const  contentsLineHasNewIndent = contentsLine.startsWith(contentsIndent + ' ');
                var    partsLineHasNewIndent = partsLine.startsWith(partsIndent + ' ');

                if (_stringsWithoutIndentAreSame(contentsLineWithoutIndent, partsLineWithoutIndent)  &&
                        contentsLine.startsWith(contentsIndent)  &&  partsLine.startsWith(partsIndent)) {
                    result = Result.same;
                } else if (contentsLine.trim() === ''  &&  partsLine.trim() === '') {  // not check the indent of empty line
                    result = Result.same;
                } else if (_trimStringsAreSame(contentsLine, partsLine)) {
                    if (contentsLineHasNewIndent  &&  partsLineHasNewIndent) {
                        result = Result.same;
                    } else {
                        for (;;) {
                            if (contentsIndentStack.length <= 1  ||  partsIndentStack.length <= 1  ||
                                    contentsLine.startsWith(contentsIndent)  ||  partsLine.startsWith(partsIndent)) {
                                result = Result.different;
                                if (unexpectedLine === null  ||  partsLineNum > unexpectedLine.partsLineNum) {
                                    const  partsLine = expectedParts[partsLineNum - 1];
                                    unexpectedLine = { contentsLineNum, contentsLine, contentsIndentLength, partsLineNum,
                                        partsLine,
                                        partsIndentLength: partsBaseIndentLength,
                                        indentDiff: _getIndentDiff(
                                            contentsIndentStack, contentsLine,
                                            partsIndentStack, partsLine, partsBaseIndentLength)};
                                }
                                break;
                            }
                            contentsIndentStack.pop();
                            partsIndentStack.pop();
                            contentsIndent = contentsIndentStack[contentsIndentStack.length-1];
                            partsIndent = partsIndentStack[partsIndentStack.length-1];

                            if (contentsLine.startsWith(contentsIndent)  &&  partsLine.startsWith(partsIndent)) {
                                if (contentsLine[contentsIndent.length] !== ' '  &&
                                        partsLine[partsIndent.length] !== ' ') {
                                    result = Result.same;
                                    if (_hasFirstFieldWithHyphen(partsLine, partsIndent.length)) {
                                        contentsIndent = getIndentWithoutHyphen(contentsLine)!;
                                        partsIndent = getIndentWithoutHyphen(partsLine)!;
                                        contentsIndentStack.push(contentsIndent);
                                        partsIndentStack.push(partsIndent);
                                    }
                                } else {
                                    result = Result.different;
                                    if (unexpectedLine === null  ||  partsLineNum > unexpectedLine.partsLineNum) {
                                        unexpectedLine = { contentsLineNum, contentsLine, contentsIndentLength, partsLineNum,
                                            partsLine: expectedParts[partsLineNum - 1], partsIndentLength: partsBaseIndentLength, indentDiff};
                                    }
                                }
                                break;
                            }
                        }
                    }
                } else if (partsLine.trim() === anyLinesTag) {
                    result = Result.skipped;
                    partsLineNum += 1;
                    skipTo = parts[partsLineNum-1];
                    skipFrom = contentsLine;
                    skipStartLineNum = contentsLineNum;
                    skipToContentsIndent = contentsIndentStack[0];
                    for (let level = partsIndentStack.length - 1;  level >= 0;  level -= 1) {
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
                } else {
                    result = Result.different;
                    if (unexpectedLine === null  ||  partsLineNum > unexpectedLine.partsLineNum) {
                        unexpectedLine = { contentsLineNum, contentsLine, contentsIndentLength, partsLineNum,
                            partsLine: expectedParts[partsLineNum - 1], partsIndentLength: partsBaseIndentLength, indentDiff};
                    }
                }

                // contentsIndentStack, ... = ...
                if (contentsLineHasNewIndent || partsLineHasNewIndent) {
                    [contentsIndent, partsIndent] = _pushToIndentStack(
                        contentsIndentStack, partsIndentStack, contentsLine, partsLine);
                }
            } else { // skipTo
                if (_foundSkipTo(contentsLine, skipToContentsIndent, skipToDeeper, skipTo)) {
                    result = Result.same;
                } else {  // if (contentsLine.trim() === ''  ||  (contentsLine.startsWith(contentsIndent)  &&  contentsIndent !== '')) {
                    result = Result.skipped;
                }
            }

            if (result === Result.same) {
                partsLineNum += 1;
                if (partsLineNum > expectedParts.length) {
                    break
                }
                skipTo = '';
            } else if (result === Result.skipped) {
                // Do nothing
            } else {  // Result.different
                partsLineNum = partsLineNumFirst;
                skipTo = '';
            }
        }

        if (result === Result.same) {
            unexpectedLine = null;
        } else if (result === Result.different) {
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
                } else {
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
        } else if (result === Result.skipped) {
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

        return  unexpectedLine;
    }

    function  _foundFirstLine(contentsLine: string, partsFirstLine: string, partsStartsWithHyphen: boolean): boolean {
        if ( ! partsStartsWithHyphen) {
            var  partColumnIndexInContents = contentsLine.indexOf(partsFirstLine);
        } else { // if partsStartsWithHyphen
            const  contentsStartsWithHyphen = (contentsLine.trimStart()[0] === '-');
            if (contentsStartsWithHyphen) {
                var  partColumnIndexInContents = contentsLine.indexOf('-');
                var  partColumnIndexInContents = contentsLine.indexOf(partsFirstLine, partColumnIndexInContents + 1);
            } else {
                var  partColumnIndexInContents = notFound;
            }
        }
        const  foundFirstLineOfParts = (partColumnIndexInContents !== notFound);
        if (foundFirstLineOfParts) {
            var  rightOfFoundInContents = contentsLine.substring(partColumnIndexInContents + partsFirstLine.length).trim();
        } else {
            var  rightOfFoundInContents = '';  // This value will be ignored
        }

        return  foundFirstLineOfParts  &&  rightOfFoundInContents === '';
    }

    function  _stringsWithoutIndentAreSame(contentsLineWithoutIndent: string, partsLineWithoutIndent: string): boolean {
        const  contents = contentsLineWithoutIndent;
        const  parts = partsLineWithoutIndent;

        if (contents[0] === '-'  &&  parts[0] === '-') {
            return  contents.substring(1).trimLeft() === parts.substring(1).trimLeft();
        } else {
            return  contents === parts;
        }
    }

    function  _trimStringsAreSame(contentsLine: string, partsLine: string) {
        if (contentsLine.trimLeft()[0] === '-'  &&  partsLine.trimLeft()[0] === '-') {
            return  contentsLine.trimLeft().substring(1).trim() === partsLine.trimLeft().substring(1).trim();
        } else {
            return  contentsLine.trim() === partsLine.trim();
        }
    }

    function  _foundSkipTo(contentsLine: string, skipToContentsIndent: string, skipToDeeper: boolean, skipTo: string): boolean {
        if (contentsLine.startsWith(skipToContentsIndent)) {
            const  hasHyphen = skipToContentsIndent.slice(-1) === '-';
            if ( ! hasHyphen) {
                if ( ! skipToDeeper) {
                    return  contentsLine.substring(skipToContentsIndent.length).trimRight() === skipTo;
                } else { // skipToDeeper
                    return  contentsLine[skipToContentsIndent.length] === ' '  &&
                        contentsLine.substring(skipToContentsIndent.length).trim() === skipTo;
                }
            } else { // hasHyphen
                return  contentsLine.substring(skipToContentsIndent.length).trim() === skipTo;
            }
        } else {
            return  false;
        }
    }

    function  _pushToIndentStack(contentsIndentStack: string[], partsIndentStack: string[],
            contentsLine: string, partsLine: string): string[] {
        const  contentsIndent = indentRegularExpression.exec(contentsLine)![0];
        const  partsIndent = indentRegularExpression.exec(partsLine)![0];

        contentsIndentStack.push(contentsIndent);
        partsIndentStack.push(partsIndent);

        if ( ! _hasFirstFieldWithHyphen(partsLine, partsIndent.length)) {
            return  [contentsIndent, partsIndent];
        } else {
            const  contentsIndent = getIndentWithoutHyphen(contentsLine)!;
            const  partsIndent = getIndentWithoutHyphen(partsLine)!;

            contentsIndentStack.push(contentsIndent);
            partsIndentStack.push(partsIndent);
            return  [contentsIndent, partsIndent];
        }
    }

    function  _hasFirstFieldWithHyphen(line: string, indentLength: number): boolean {
        const  lineStartsWithHyphen = (line[indentLength] === '-');
        if (lineStartsWithHyphen) {
            const  rightOfHyphen = line.substring(indentLength + 1).trimLeft();
            return  rightOfHyphen[0] !== '#';
        } else {
            return  false;
        }
    }

    function  _getIndentDiff(contentsIndentStack: string[], contentsLine: string,
            partsIndentStack: string[], partsLine: string, partsBaseIndentLength: number): number {
        const  contentsIndentPreviousLength = contentsIndentStack[contentsIndentStack.length-1].length;
        const  contentsIndentCurrentLength = indentRegularExpression.exec( contentsLine )![0].length;
        const  partsIndentPreviousLength = partsIndentStack[partsIndentStack.length-1].length + partsBaseIndentLength;
        const  partsIndentCurrentLength = indentRegularExpression.exec( partsLine )![0].length;

        if (contentsIndentCurrentLength > contentsIndentPreviousLength  &&  partsIndentCurrentLength > partsIndentPreviousLength) {
            return  0;
        } else if (contentsIndentCurrentLength === contentsIndentPreviousLength  &&  partsIndentCurrentLength > partsIndentPreviousLength) {
            return  - (partsIndentCurrentLength - partsIndentPreviousLength);
        } else if (contentsIndentCurrentLength > contentsIndentPreviousLength  &&  partsIndentCurrentLength === partsIndentPreviousLength) {
            return  contentsIndentCurrentLength - contentsIndentPreviousLength;
        } else {
            return  contentsIndentCurrentLength - partsIndentCurrentLength;
        }
    }
}

export function  coloredDiff(redLine: string, greenLine: string, redHeaderLength: number = 0, greenHeaderLength: number = 0): ColoredDiff {
    const  green = chalk.bgGreen.black;
    const  red = chalk.bgRed.black;

    const  changes = diff.diffChars(
        redLine.substring(redHeaderLength),
        greenLine.substring(greenHeaderLength));

    redLine = redLine.substring(0, redHeaderLength);
    greenLine = greenLine.substring(0, greenHeaderLength);
    for (const change of changes) {
        if (change.added) {
            greenLine += green(change.value);
        } else if (change.removed) {
            redLine += red(change.value);
        } else {
            greenLine += change.value;
            redLine += change.value;
        }
    }
    return {greenLine, redLine};
}

export function  toWordArray(idiom: string): string[] {
    const  normalizedIdiom = idiom.replace(/\u{3000}/ug,' ').trim().replace(/ +/g, ' ');
    if (normalizedIdiom) {
        return  normalizedIdiom.split(' ');
    } else {
        return  [];
    }
}

export function  getWordCount(idiom: string): number {
    return  idiom.replace(/\u{3000}/ug,' ').split(' ').filter((word)=>(word !== '')).length;
        // '\u{3000}': Japanese space
}

export function  splitIdioms(idioms: string, words: string[]): string {
    var    output = '';
    const  minimumWordLength = 2;

    const  dictionary = new Set<string>();
    for (const word of words) {
        if (word.length >= minimumWordLength) {
            dictionary.add(word);
        }
    }
    const  idiomArray = idioms.split(' ');

    for (const idiom of idiomArray) {
        var  splitWords = '';
        for (let offset = 0;  offset < idiom.length; ) {
            var  found = false;
            var  word = '';
            for (let length = idiom.length - offset;  length >= minimumWordLength;  length -= 1) {
                word = idiom.substr(offset, length);

                if (dictionary.has(word)) {
                    found = true;
                    break;
                }
            }
            if (found) {
                splitWords += word + ' ';
                offset += word.length;
            } else {
                splitWords = '';
                break;
            }
        }
        if (splitWords !== '') {
            output += splitWords
        } else {
            output += idiom + ' ';
        }
    }
    output = output.substring(0, output.length - 1);

    return  output;
}

export function  chageToAlphabets(inputString: string): string {
    const  japaneseTable: {[i: string]: string} = {
        'あ':'a', 'ｂ':'b', 'ｃ':'c', 'ｄ':'d', 'え':'e', 'ｆ':'f', 'ｇ':'g', 'ｈ':'h',
        'い':'i', 'ｊ':'j', 'ｋ':'k', 'ｌ':'l', 'ｍ':'m', 'ｎ':'n',
        'お':'o', 'ｐ':'p', 'ｑ':'q', 'ｒ':'r', 'ｓ':'s', 'ｔ':'t', 'う':'u', 'ｖ':'v', 'ｗ':'w', 'ｘ':'x', 'ｙ':'y', 'ｚ':'z',
        '　':' ', '！':'!', '”':'"', '＃':'#', '＄':'$', '％':'%', '＆':'&', '’':'\'', '（':'(', '）':')',
        'ー':'-', '＝':'=', '＾':'^', '〜':'~', '＼':'\\', '￥':'\\', '｜':'|', '＠':'@', '｀':'`', '「':'[', '『':'{',
        '；':';', '＋':'+', '：':':', '＊':'*', '」':']', '』':'}', '、':',', '＜':'<', '。':'.', '＞':'>', '・':'/', '？':'?', '＿':'_',
        'か':'ka', 'き':'ki', 'く':'ku', 'け':'ke', 'こ':'ko', 'さ':'sa', 'し':'si', 'す':'su', 'せ':'se', 'そ':'so',
        'た':'ta', 'ち':'ti', 'つ':'tu', 'て':'te', 'と':'to', 'な':'na', 'に':'ni', 'ぬ':'nu', 'ね':'ne', 'の':'no',
        'は':'ha', 'ひ':'hi', 'ふ':'fu', 'へ':'he', 'ほ':'ho', 'ま':'ma', 'み':'mi', 'む':'mu', 'め':'me', 'も':'mo',
        'や':'ya', 'ゆ':'yu', 'よ':'yo', 'ら':'ra', 'り':'ri', 'る':'ru', 'れ':'re', 'ろ':'ro', 'わ':'wa', 'を':'wo', 'ん':'n',
        'きゃ':'kya', 'きゅ':'kyu', 'きょ':'kyo', 'しゃ':'sha', 'しゅ':'shu', 'しょ':'sho', 'ちゃ':'cha', 'ちゅ':'chu', 'ちょ':'cho',
        'にゃ':'nya', 'にゅ':'nyu', 'にょ':'nyo', 'ひゃ':'hya', 'ひゅ':'hyu', 'ひょ':'hyo', 'ふぁ':'fa', 'ふぃ':'fi', 'ふぇ':'fe', 'ふぉ':'fo',
        'みゃ':'mya', 'みゅ':'myu', 'みょ':'myo', 'りゃ':'rya', 'りゅ':'ryu', 'りょ':'ryo',
        'が':'ga', 'ぎ':'gi', 'ぐ':'gu', 'げ':'ge', 'ご':'go', 'ざ':'za', 'じ':'ji', 'ず':'zu', 'ぜ':'ze', 'ぞ':'zo',
        'だ':'da', 'ぢ':'di', 'づ':'du', 'で':'de', 'ど':'do',
        'ば':'ba', 'び':'bi', 'ぶ':'bu', 'べ':'be', 'ぼ':'bo', 'ぱ':'pa', 'ぴ':'pi', 'ぷ':'pu', 'ぺ':'pe', 'ぽ':'po',
        'ぎゃ':'gya', 'ぎゅ':'gyu', 'ぎょ':'gyo', 'じゃ':'ja', 'じゅ':'ju', 'じょ':'jo', 'ぢゃ':'dya', 'ぢゅ':'dyu', 'ぢょ':'dyo',
        'びゃ':'bya', 'びゅ':'byu', 'びょ':'byo', 'ぴゃ':'pya', 'ぴゅ':'pyu', 'ぴょ':'pyo',
        'ぁ':'la', 'ぃ':'li', 'ぅ':'lu', 'ぇ':'le', 'ぉ':'lo',
        'ゔぁ':'va', 'ゔぃ':'vi', 'ゔ':'vu', 'ゔぇ':'ve', 'ゔぉ':'vo', 'うぃ':'wi', 'うぇ':'we',
        'くぁ':'qa', 'くぃ':'qi', 'くぅ':'qu', 'くぇ':'qe', 'くぉ':'qo',
        'すぁ':"swa", 'すぃ':"swi", 'すぅ':"swu", 'すぇ':"swe", 'すぉ':"swo",
        'でゃ':'dha', 'でぃ':'deli','でゅ':'dhu', 'でぇ':'dele','でょ':'dho',
        'っか':'kka', 'っき':'kki', 'っく':'kku', 'っけ':'kke', 'っこ':'kko', 'っさ':'ssa', 'っし':'ssi', 'っす':'ssu', 'っせ':'sse', 'っそ':'sso',
        'った':'tta', 'っち':'tti', 'っつ':'ttu', 'って':'tte', 'っと':'tto',
        'っは':'hha', 'っひ':'hhi', 'っふ':'ffu', 'っへ':'hhe', 'っほ':'hho', 'っふぁ':'ffa', 'っふぃ':'ffi', 'っふぇ':'ffe', 'っふぉ':'ffo',
        'っま':'mma', 'っみ':'mmi', 'っむ':'mmu', 'っめ':'mme', 'っも':'mmo', 'っや':'yya', 'っゆ':'yyu', 'っいぇ':'yye', 'っよ':'yyo',
        'っら':'rra', 'っり':'rri', 'っる':'rru', 'っれ':'rre', 'っろ':'rro', 'っわ':'wwa',  'っうぃ':'wwi',  'っうぇ':'wwe', 'っを':'wwo',
        'っが':'gga', 'っぎ':'ggi', 'っぐ':'ggu', 'っげ':'gge', 'っご':'ggo', 'っざ':'zza', 'っじ':'zzi', 'っず':'zzu', 'っぜ':'zze', 'っぞ':'zzo',
        'っだ':'dda', 'っぢ':'ddi', 'っづ':'ddu', 'っで':'dde', 'っど':'ddo',
        'っば':'bba', 'っび':'bbi', 'っぶ':'bbu', 'っべ':'bbe', 'っぼ':'bbo', 'っぱ':'ppa', 'っぴ':'ppi', 'っぷ':'ppu', 'っぺ':'ppe', 'っぽ':'ppo',
        'っぁ':'lla', 'っぃ':'lli', 'っぅ':'llu', 'っぇ':'lle', 'っぉ':'llo',
    };
    const  second = ['ゃ', 'ゅ', 'ょ', 'ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'];
    var  output = '';

    for (let i = 0;  i < inputString.length;  i += 1) {
        const  input = inputString.substr(i, 1);
        const  nextInput = inputString.substr(i + 1, 1);
        if (second.includes(nextInput)  ||  input === 'っ') {
            const  withLittle = input + nextInput;
            const  with2Little = input + nextInput + inputString.substr(i + 2, 1);
            if (with2Little in japaneseTable) {
                output += japaneseTable[with2Little];
                i += 2;
            } else if (withLittle in japaneseTable) {
                output += japaneseTable[withLittle];
                i += 1;
            } else {
                output += japaneseTable[input];
            }
        } else {
            if (input in japaneseTable) {

                output += japaneseTable[input];
            } else {
                output += input;
            }
        }
    }
    return  output;
}

interface  ColoredDiff {
    greenLine: string;
    redLine: string;
}

export async function  parseCSVColumns(columns: string): Promise<string[]> {
    if (!columns) {
        return  [];  // stream.Readable.from(undefined) occurs an error
    }
    // Prevent csv-parse module error, when a quote is found inside a field.
    // A quote is always written at frist character.
    // The inside quote should be parsed as a character data in the column.
    if ( columns[0] === '"'  ||  columns.includes(',')) {
        return new Promise((resolveFunction, rejectFunction) => {
            var  parsedColumns: string[] = [];

            stream.Readable.from(columns)
                .pipe(
                    csvParse.parse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' })
                )
                .on('data', (columns: string[]) => {
                    parsedColumns = columns;
                })
                .on('end', () => {
                    resolveFunction(parsedColumns);
                })
                .on('error', (e: Error) => {
                    e.message = `Error in csv-parse module. Parsing CSV is:\n${columns}\n${e.message}`;
                    rejectFunction(e);
                });
        });
    } else {
        return  [columns];
    }
}

export function  parseCSVColumnPositions(csv: string, columns: string[]): number[] {
    const  positions: number[] = [];
    var  searchPosition = 0;
    for (const column of columns) {
        const  columnPosition = csv.indexOf(column.replace(/\"/g, '""'), searchPosition);

        positions.push(columnPosition);
        searchPosition = csv.indexOf(',', columnPosition + column.length) + 1;
    }
    return  positions;
}

export function  getAllQuotedCSVLine(columns: string[] | number[]): string {
    return  columns.map((s) => ('"' + s.toString().replace(/"/g, '""') + '"')).join(',');
}

export function  escapeRegularExpression(expression: string) {
    return  expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

export function  replace(input: string, replacers: ReplaceParameter[]): string {
    var  replacing = input;
    for (const replacer of replacers) {
        var  optionCount = 0;
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
    const  replaced = replacing;
    return  replaced;
}

export async function  replaceAsync(input: string, replacers: ReplaceParameter[]): Promise<string> {
    var  replacing = input;
    for (const replacer of replacers) {
        var  optionCount = 0;
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

        if (replacer.from  &&  optionCount === 0) {
            replacing = replacing.replace(replacer.from, replacer.to);
        }

        if (replacer.lineNum) {
            const  stream = new Readable();
            stream.push(replacing);
            stream.push(null);
            const  reader = readline.createInterface({
                input: stream,
                crlfDelay: Infinity
            });
            const  writer = new WritableMemoryStream();
            var  lineNum = 0;

            for await (const line1 of reader) {
                const  line: string = line1;
                lineNum += 1;

                if (lineNum === replacer.lineNum) {
                    if (replacer.from) {
                        var  replacedLine = line.replace(replacer.from, replacer.to);
                    } else {
                        var  replacedLine = replacer.to;
                    }
                    writer.write(`${replacedLine}\n`);
                } else {
                    writer.write(`${line}\n`);
                }
            }
            replacing = writer.toString();
        }

        if (replacer.fromCSV) {
            const  inputStream = Readable.from(replacing);
            const  keywords = await parseCSVColumns(replacer.fromCSV);
            if (replacer.from) {
                var  replaceFrom = replacer.from;
            } else {
                var  replaceFrom = keywords[keywords.length - 1];
            }

            const  lineNum = await searchAsTextSub({input: inputStream}, replacer.fromCSV, true);
            replacing = await replaceAsync(replacing, [{ from: replaceFrom,  lineNum,  to: replacer.to }]);
        }
    }
    const  replaced = replacing;
    return  replaced;
}

interface ReplaceParameter {
    from?: string;
    fromCSV?: string;
    lineNum?: number;
    to: string;
}

class WritableMemoryStream extends Writable {
    private array: string[];

    constructor() {
        super();
        this.array = [];
    }

    _write(chunk: any, _encoding: BufferEncoding, callback: (error?: Error | null) => void) {
        this.array.push(chunk);
        callback();
    }

    toString(): string {
        return this.array.join('');
    }
}

// Secrets
// Split secrets from environment variables in order to prevent child process inheritance
type  Secrets = {[name: string]: string | undefined};

const  dotenvSecrets: Secrets = {};

var  dotenvInheritToProcessEnv = false;

export function  loadDotEnvSecrets(inheritProcessEnv: boolean = false) {
    dotenvInheritToProcessEnv = inheritProcessEnv;
    if (inheritProcessEnv) {

        dotenv.config();
    } else {
        const  envronmentVariableNames = Object.keys(process.env);

        dotenv.config();
        const  withSecret = Object.assign({}, process.env);
        const  secretNames = Object.keys(withSecret).filter(
            (key) => (envronmentVariableNames.indexOf(key) === -1));
        for (const secretName of secretNames) {

            dotenvSecrets[secretName] = process.env[secretName];

            delete  process.env[secretName];
        }
    }
}

export function  getDotEnvSecrets(): Secrets {
    return  dotenvSecrets;
}

export function  getProcessEnvAndDotEnvSecrets(): Secrets {
    if (dotenvInheritToProcessEnv) {
        return  process.env;
    } else {
        return  Object.assign(Object.assign({}, process.env), dotenvSecrets);
    }
}

// indentRegularExpression
// e.g. indent = indentRegularExpression.exec( line )![0];
export const  indentRegularExpression = /^( |\t)*/;

// indentHyphenRegularExpression
// e.g. indentWithHyphen = indentHyphenRegularExpression.exec( line )![0];
// e.g. match = indentHyphenRegularExpression.exec( line )!;
//    const  leftOfHyphen = match[1];
//    const  rightOfHyphen = match[3];
export const  indentHyphenRegularExpression = /^(( |\t)*)-(( |\t)*)/;


// Data group

export function  isSameArray<T>(log: T[], answer: T[]): boolean {
    if (log.length !== answer.length) {
        return  false;
    } else {
        for (var i = 0; i < log.length; i += 1) {
            if (log[i] !== answer[i]) {
                return  false;
            }
        }
        return  true;
    }
}

// isSameArrayOf
// T: string, nunmber
// If only order had difference, this returns true
// #ref: ${typrm_files}/ref/JavaScript-AI.yaml#label: isSameArrayOf
export function  isSameArrayOf<T>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const countMap: Record<string, number> = {};

    for (const item of arr1) {
        const key = JSON.stringify(item);
        countMap[key] = (countMap[key] || 0) + 1;
    }

    for (const item of arr2) {
        const key = JSON.stringify(item);
        if (!countMap[key]) {
            return false;
        }
        countMap[key] -= 1;
    }

    return Object.values(countMap).every(count => count === 0);
}

// Old implement. There is a bug.  #ref: ${typrm_files}/ref/JavaScript-AI.yaml#label: isSameArrayOf
function  isSameArrayOfOld<T>(log: T[], answer: T[]): boolean {
    const matched = log.filter( (item) => answer.includes( item ) );
    const isSame = (matched.length === answer.length && log.length === answer.length);
    return isSame;
}

export function  getCommonItems<T>(arrayA: T[], arrayB: T[]): T[] {
    const  commonItems = [] as T[];
    for (const item of arrayA) {
        if (arrayB.includes(item)){
            commonItems.push(item);
        }
    }
    return  commonItems;
}

export function  cutSameItems<T>(array: T[]): T[] {
    return  Array.from(new Set<T>(array));
}

// stableUniqueFilterFunction
// const  uniqueArray1 = array1.filter(lib.stableUniqueFilterFunction((element1, element2) =>
//         element1.path == element2.path));
export function  stableUniqueFilterFunction<T>(
    isSameFunction: {(element1:T, element2:T): boolean}
): {(element: T, index: number, array: T[]): boolean} {

    return  function (element: T, index: number, array: T[]): boolean {
        return  index === array.findIndex(
            (e) => isSameFunction(element, e));
    };
}

// lastUniqueFilterFunction
// const  uniqueArray1 = array1.filter(lib.lastUniqueFilterFunction((element1, element2) =>
//         element1.path == element2.path));
export function  lastUniqueFilterFunction<T>(
    isSameFunction: {(element1:T, element2:T): boolean}
): {(element: T, index: number, array: T[]): boolean} {

    return  function (element: T, index: number, array: T[]): boolean {
        const  matchIndices = array.map((e, index) => isSameFunction(element, e) ? index : -1);

        return  index === Math.max(... matchIndices);
    };
}

// fastUniqueFilter
// const  uniqueArray1 = lib.fastUniqueFilter(array1, (element) => (element.path));
export function  fastUniqueFilter<T>(
    array: T[],
	getKeyFunction: {(element1:T): any}
): T[] {

	return  Array.from<T>(
		new Map(array.map((element) => [getKeyFunction(element), element])).values()
	);
}

export async function  parseMap<keyT, valueT>(mapString: string): Promise<Map<keyT, valueT>> {
    const  startIndex = mapString.indexOf('{');
    const  lastIndex = mapString.lastIndexOf('}');
    if ( ! startIndex  ||  ! lastIndex) {
        throw new Error('in lib.ts parseMap')
    }
    type  KeyType = (undefined | 'number' | 'string' | 'object');
    var  keyType: KeyType;
    var  valueType: KeyType;

    function  parseValue(value: string): any {
        value = value.trim();
        if ( ! valueType) {
            if (value.substring(0,1) === '"'  &&  value.slice(-1) === '"') {
                valueType = 'string';
            } else {
                const  isNumber = ! isNaN(value as any);
                valueType = isNumber ? 'string' : 'object';
            }
        }

        if (valueType === 'number') {
            return  parseFloat(value);
        } else if (valueType === 'string') {
            if (value.substring(0,1) === '"'  &&  value.slice(-1) === '"') {
                return  value.substring(1, value.length - 1);
            } else {
                throw new Error('in lib.ts parseValue');
            }
        } else if (valueType === 'object') {
            return  JSON.parse(value);
        }
    }

    const stream = new Readable();
    stream.push(mapString);
    stream.push(null);
    const  reader = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    const  map = new Map<keyT, valueT>();
    for await (const line of reader) {
        if ( ! keyType) {
            const  matchNumber = /([0-9]+) *=>(.*),/.exec(line);
            const  matchString = /"(.*)" *=>(.*),/.exec(line);
            if (matchNumber) {
                keyType = 'number';
            } else if (matchString) {
                keyType = 'string';
            }
        }

        if (keyType === 'number') {
            const  match = /([0-9]+) *=>(.*),/.exec(line);
            if (match) {
                map.set(parseInt( match[1] ) as any,  parseValue( match[2] ));
            }
        } else {  // if (keyType === 'string') {
            const  match = /"(.*)" *=>(.*),/.exec(line);
            if (match) {
                map.set( match[1] as any,  parseValue( match[2] ));
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

    return  map;
}

export function  isAlphabetIndex(index: string): boolean {
    const  lastCharacter = index.slice(-1);
    const  lastCharacterIsNumber = ! isNaN(lastCharacter as any);
    return  ! lastCharacterIsNumber  &&  index !== '/';
}

// getAlphabetIndex
// 1=>a, 2=>b, ..., 25=>y, 26=>z26z, 27=>z27z, ...
// First charactor and last cahractor must be alphabet.
export function  getAlphabetIndex(num: number | string): string {
    const  index = parseInt(num as any);
    if (index >= 1  &&  index <= 25) {
        const  ascii_code_a_minus1 = 96;
        return String.fromCharCode(index + ascii_code_a_minus1);
    } else {
        return `z${num}z`;
    }
}

// fromAlphabetIndex
// a=>1, b=>2, ..., y=>25, z26z=>26, z27z=>27, ...
export function  fromAlphabetIndex(index: string): number {
    const  code = index.charCodeAt(0)
    const  ascii_code_a_minus1 = 96;
    const  ascii_code_y = 121;
    if (code > ascii_code_a_minus1  &&  code <= ascii_code_y) {
        return  code - ascii_code_a_minus1;
    } else if (isAlphabetIndex(index)) {
        return  parseInt(index.slice(1,-1));
    } else {
        return  NaN;
    }
}

export function  cutAlphabetInIndex(index: string): string {
    for (var  parentIndex = index;  parentIndex !== '/';  parentIndex = path.dirname(parentIndex)) {
        const  lastCharacter = parentIndex.slice(-1);
        const  lastCharacterIsNumber = ! isNaN(lastCharacter as any);
        if (lastCharacterIsNumber) {
            break;
        }
    }
    return  parentIndex;
}

export namespace  hasInterfaceOf {
    export function  Error(object: any): object is Error {
        return (
            object.hasOwnProperty('message')
        );
    }
}

// getObjectID
// Exmaple:
//    var  object1={}, object2={}
//    console.log( objectId(object1) ) // 1
//    console.log( objectId(object2) ) // 2
export function  getObjectID(object: any) {
    if ( ! objectIDs.has(object)) {
        objectCount += 1;
        objectIDs.set(object, objectCount);
    }
    return  objectIDs.get(object);
}
const  objectIDs = new WeakMap
var  objectCount = 0;

// User interface group

export class InputOption {
    inputLines: string[];
    nextLineIndex: number;
    nextParameterIndex: number;  // The index of the starting process parameters

    constructor(inputLines: string[]) {
        this.inputLines = inputLines;
        this.nextLineIndex = 0;
        this.nextParameterIndex = 2;
    }
}

const  testBaseFolder = String.raw `R:\home\mem_cache\MyDoc\src\TypeScript\typrm\test_data`+'\\';

const inputOption = new InputOption([
/*
    testBaseFolder +`____.yaml`,
    String.raw `file`,
*/
]);

export function  setInputOption(option: InputOption) {
    Object.assign(inputOption, option);
}

// input
// #keyword: lib.ts input
// Example: const name = await input('What is your name? ');
export async function  input( guide: string ): Promise<string> {
    // Input emulation
    if (inputOption.inputLines) {
        if (inputOption.nextLineIndex < inputOption.inputLines.length) {
            const  value = inputOption.inputLines[inputOption.nextLineIndex];
            inputOption.nextLineIndex += 1;
            console.log(guide + value);

            return  value;
        }
    }

    // Read the starting process parameters
    while (inputOption.nextParameterIndex < process.argv.length) {
        const  value = process.argv[inputOption.nextParameterIndex];
        inputOption.nextParameterIndex += 1;
        if (value.substring(0,1) !== '-') {
            console.log(guide + value);

            return  value;
        }
        if (value !== '--test') {
            inputOption.nextParameterIndex += 1;
        }
    }

    // input
    return  InputObject.input(guide);
}

// inputPath
// Example: const name = await input('What is your name? ');
export async function  inputPath( guide: string ) {
    const  key = await input(guide);
    if (key.endsWith('()')) {
        return  key;
    } else {
        return  pathResolve(key);
    }
}

export function  inputSkip(count: number) {
    inputOption.nextParameterIndex += count;
}

export function setInputEchoBack(isEnabled: boolean) {
    inputEchoBack = isEnabled;
}
var  inputEchoBack = false;

export function getInputEchoBack(): boolean {
    return  inputEchoBack;
}

class  StandardInputBuffer {
    readlines: readline.Interface | undefined;
    inputBuffer: string[] = [];
    inputResolver?: (answer:string)=>void = undefined;

    delayedConstructor() {  // It is not constructor, because "createInterface" stops the program, if stdin was not used.
        this.readlines = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.readlines.on('line', async (line: string) => {
            if (this.inputResolver) {
                if (inputEchoBack) {
                    console.log(line);
                }
                this.inputResolver(line);  // inputResolver() is resolve() in input()
                this.inputResolver = undefined;
            } else {
                this.inputBuffer.push(line);
            }
        });

        this.readlines.setPrompt('');
        this.readlines.prompt();
    }

    async  input(guide: string): Promise<string> {
        if ( ! this.readlines) {
            this.delayedConstructor();
        }
        if (this.readlines) {
            this.readlines.setPrompt(guide);
        }

        return  new Promise(
            (resolve: (answer:string)=>void,  reject: (answer:string)=>void ) =>
        {
            const  nextLine = this.inputBuffer.shift();
            if (typeof nextLine === 'string') {
                console.log(guide + nextLine);
                resolve(nextLine);
            } else {  // nextLine === undefnied
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
const  InputObject = new StandardInputBuffer();
export function  getInputObject(): StandardInputBuffer {
    return  InputObject;
}

export function  cutEscapeSequence(textWithEscapeSequence: string) {
    return  textWithEscapeSequence.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

export function  getSnapshot(label: string, deafultSnapshot: string | undefined = undefined) {
    if ( ! (label in snapshots)) {
        if ( ! deafultSnapshot) {
            throw  new Error(`not found snapshot label "${label}" in "__Project__/src/__snapshots__/main.test.ts.snap" file.`);
        }
        return  deafultSnapshot;
    }
    const  snapshot = snapshots[label];
    return  snapshot.substr(2, snapshot.length - 4).replace(/\\\"/g, '"');
}

export function  mark(object: any,  label: string | number | boolean = "mark") {
    object._mark = label;  // Add an attribute dynamically
}

export function  jsonStringify(object: any, dummy?: any, space?: string): string {
    // This is JSON.stringify supported circular references object
    const checkedObjects = new WeakSet();

    return  JSON.stringify(object, (_key, value) => {
        if (typeof value === "object" && value !== null) {
            if (checkedObjects.has(value)) {
                return;  // circular references
            }
            checkedObjects.add(value);
        }
        return value;
    }, space);
}

// pp
// #keyword: lib.ts pp
//     Debug print.
// Example:
//    pp(var);
// Example:
//    pp('---var');
//    pp(var);
// Example:
//    var d = pp('---var');
//    pp(var);  // Set break point here and watch the variable d
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
export function  pp(message: any) {
    if (message instanceof Array) {
        debugOut.push(`length: ${message.length}`);
        for (const element of message) {
            pp(element);
        }
    } else {
        if (typeof message === 'object') {
            if (message instanceof Map) {
                const  messageObject = Object.create(null);
                for (let [k,v] of message) {
                    messageObject[k] = v;
                }
                message = JSON.stringify(messageObject, null, '    ');
            } else {
                message = JSON.stringify(message, null, '    ');
            }
        } else if (message === undefined) {
            message = '(undefined)';
        } else if (message === null) {
            message = '(null)';
        }
        debugOut.push(message.toString());
    }
    return debugOut;
}
declare global {
    export var  debugOut: string[];
}
(globalThis as any).debugOut = [];

// ppClear
// #keyword: ppClear
export function  ppClear() {
    debugOut.length = 0;
    return debugOut;
}

// ff
// #keyword: lib.ts ff
// Condition flag.
// Example:
//     Mark of got debug target data layer 1 (L1): |
//         ff('L1', argument == '____');
//     if current data is target data layer 1 (L1): |
//         if ( ff('L1') ) {
//         var d = pp('____');}
export function  ff( conditionName: string, condition: boolean|null = null ) {
    if (condition !== null) {
        ffFlags[conditionName] = condition;
    }

    if (conditionName in ffFlags) {
        return  ffFlags[conditionName];
    } else {
        return  false;
    }
}
export const  ffFlags: {[name: string]: boolean} = {};

// cc
// #keyword: lib.ts cc
// Through counter.
// Example:
//     count up: |
//         cc();
//     print a data and count up: |
//         var d = pp(data);
//         cc();
//     count up and if counter value is 1 ...: |
//         if ( cc(1).isTarget ) {
//         var d = pp('');}  // Set break point here and watch the variable d
//     count up and look at debug output: |
//         var c = cc().debugOut;  // Set break point here and watch the variable c
export function  cc( targetCount: number|null = 9999999, label: string = '0' ) {
    if (!(label in ccCount)) {
        ccCount[label] = 0;
    }

    ccCount[label] += 1;
    pp( `${label}:countThrough[${label}] = ${ccCount[label]}` );
    const  isTarget = ( ccCount[label] === targetCount );

    if (isTarget) {
        pp( '    **** It is before the target! ****' );
    }
    return  { isTarget, debugOut };
}
declare global {
    export var  ccCount: {[name: string]: number};
}
(globalThis as any).ccCount = {}
// export const  ccCount: {[name: string]: number} = {};
const  notFoundInFile = -2;
const  notFound = -1;
