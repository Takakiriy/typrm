import * as fs from "fs";
import * as path from "path";
import globby from 'globby';
import * as readline from 'readline';
import { ReadLineOptions } from 'readline';
import * as stream from 'stream';
import * as csvParse from 'csv-parse';
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

// searchAsTextSub
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
        lineNum = 0;
    }

    return  lineNum;
}

// addDefaultReadLineOptions
function  addDefaultReadLineOptions(localOptions: ReadLineOptions): ReadLineOptions {
    return {crlfDelay: Infinity, ...localOptions};
}

// pathResolve
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

// UnexpectedLine
export interface  UnexpectedLine {
    contentsLineNum: number;
    contentsLine: string;
    partsLineNum: number;
    partsLine: string;
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

    if (relativePath.substr(0,1) === '/') {
        fullPath = relativePath;
    } else if (relativePath.substr(0,1) === '~') {
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
    } else {
        var  isFullPath = (separatorPosition === colonPosition + 1);
    }
    return  isFullPath;
}

// checkNotInGitWorking
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

// getTestWorkFolderFullPath
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
export function  getGlobbyParameters(targetPath: string, baseFullPath: string): GlobbyParameters {
    const  targetFullPath = getFullPath(targetPath, baseFullPath);
    const  fileName = path.basename(targetFullPath);
    const  filePath = 1;
    const  folderPath = 2;
    var    pathIs = 0;

    if (fileName.includes('*')) {
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
        var  wildcard = fileName;
    } else {  // folderPath
        var  targetFolderFullPath = targetFullPath;
        var  wildcard = '*';
    }

    return  {
        targetFolderFullPath,
        wildcard,
    };
}

// GlobbyParameters
interface  GlobbyParameters {
    targetFolderFullPath: string;
    wildcard: string;
}


// String group

// cutLeftOf
// #keyword: lib.ts cutLeftOf
// cutLeftOf("abcde", "c") == "cde"
export function  cutLeftOf(input: string, keyword: string): string {
    const  keywordPosition = input.indexOf(keyword);
    if (keywordPosition !== notFound) {

        return  input.substr(keywordPosition);
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

        return  input.substr(0, input.length - keyword.length);
    } else {
        return  input;
    }
}

// cutIndent
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

// getIndentWithoutHyphen
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

// checkTextContents
// This ignores different indent depth and different indent width.
export function  checkTextContents(testingContents: string[], expectedParts: string[], anyLinesTag: string
        ): UnexpectedLine | null {

    return  main(testingContents, expectedParts, anyLinesTag);
    function  main(testingContents: string[], expectedParts: string[], anyLinesTag: string
            ): UnexpectedLine | null {

        const  contents = testingContents;
        const  contentsLineCount = contents.length;
        var  contentsIndent = '';
        var  contentsIndentStack: string[] = [];
        const  parts = cutIndent(expectedParts.slice());
        const  partsStartsWithHyphen = (parts[0].substring(0,1) === '-');
        const  partsFirstLine = parts[0];
        if ( ! partsStartsWithHyphen) {
            var  partsFirstLineWithoutHyphen = parts[0];
        } else {
            var  partsFirstLineWithoutHyphen = parts[0].substring(1).trimStart();
        }
        var  partsIndent = '';
        var  partsIndentStack: string[] = [];
        var  partsLineNum = 1;
        enum Result { same, different, skipped };
        var  result = Result.same;
        var  unexpectedLine: UnexpectedLine | null = null;
        var  skipTo = '';
        var  skipFrom = '';
        var  skipStartLineNum = 1;

        for (var contentsLineNum = 1;  contentsLineNum <= contentsLineCount;  contentsLineNum += 1) {
            const  contentsLine = contents[contentsLineNum-1];
// if (contentsLineNum == 5  &&  ! testingContents.includes('(unexpected)')) {
// pp('')
// }
            if (partsLineNum === 1) {
                if ( ! partsStartsWithHyphen) {
                    var  partColumnIndex = contentsLine.indexOf(partsFirstLine);
                } else { // if partsStartsWithHyphen
                    const  contentsStartsWithHyphen = (contentsLine.trimStart()[0] === '-');
                    if (contentsStartsWithHyphen) {
                        var  partColumnIndex = contentsLine.indexOf('-');
                    } else {
                        var  partColumnIndex = notFound;
                    }
                }
                const  contentsHasPartsFirstLine = (partColumnIndex !== notFound);
                const  contentsAfterPartsFirstLine = contentsLine.substring(0, partColumnIndex).trim();

                if (contentsHasPartsFirstLine  &&  contentsAfterPartsFirstLine === '') {
                    result = Result.same;
                    contentsIndent = contentsLine.substring(0, partColumnIndex);
                    contentsIndentStack = [contentsIndent];
                    partsIndent = indentRegularExpression.exec(partsFirstLine)![0];
                    partsIndentStack = [partsIndent];
                    if (partsStartsWithHyphen) {
                        contentsIndent = getIndentWithoutHyphen(contentsLine)!;
                        contentsIndentStack.push(contentsIndent);
                        partsIndent = getIndentWithoutHyphen(partsFirstLine)!;
                        partsIndentStack.push(partsIndent);
                    }
                } else {
                    result = Result.different;
                }
            } else if (skipTo === '') {
                const  partsLine = parts[partsLineNum-1];
                const  contentsLineWithoutIndent = contentsLine.substring(contentsIndent.length);
                const  partsLineWithoutIndent = partsLine.substring(partsIndent.length);
                const  contentsLineHasNewIndent = contentsLine.startsWith(contentsIndent + ' ');
                const  partsLineHasNewIndent = partsLine.startsWith(partsIndent + ' ');

                if (contentsLineWithoutIndent === partsLineWithoutIndent  &&
                        contentsLine.startsWith(contentsIndent)  &&  partsLine.startsWith(partsIndent)) {
                    result = Result.same;
                } else if (contentsLine.trim() === partsLine.trim()) {
                    if (contentsLineHasNewIndent  &&  partsLineHasNewIndent) {
                        result = Result.same;
                    } else {
                        for (;;) {
                            if (contentsIndentStack.length === 0  ||  partsIndentStack.length === 0) {
                                result = Result.different;
                                if (unexpectedLine === null  ||  partsLineNum > unexpectedLine.partsLineNum) {
                                    unexpectedLine = { contentsLineNum, contentsLine, partsLineNum,
                                        partsLine: expectedParts[partsLineNum - 1]};
                                }
                                break;
                            }
                            contentsIndentStack.pop();
                            partsIndentStack.pop();
                            contentsIndent = contentsIndentStack[contentsIndentStack.length-1];
                            partsIndent = partsIndentStack[partsIndentStack.length-1];

                            if (contentsLine.startsWith(contentsIndent)  &&  partsLine.startsWith(partsIndent)) {
                                if (contentsLine.substr(contentsIndent.length, 1) !== ' '  &&
                                        partsLine.substr(partsIndent.length, 1) !== ' ') {
                                    result = Result.same;
                                } else {
                                    result = Result.different;
                                    if (unexpectedLine === null  ||  partsLineNum > unexpectedLine.partsLineNum) {
                                        unexpectedLine = { contentsLineNum, contentsLine, partsLineNum,
                                            partsLine: expectedParts[partsLineNum - 1]};
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
                } else {
                    result = Result.different;
                    if (unexpectedLine === null  ||  partsLineNum > unexpectedLine.partsLineNum) {
                        unexpectedLine = { contentsLineNum, contentsLine, partsLineNum,
                            partsLine: expectedParts[partsLineNum - 1]};
                    }
                }

                // contentsIndentStack, ... = ...
                if (contentsLineHasNewIndent || partsLineHasNewIndent) {
                    contentsIndent = indentRegularExpression.exec(contentsLine)![0];
                    contentsIndentStack.push(contentsIndent);
                    partsIndent = indentRegularExpression.exec(partsLine)![0];
                    partsIndentStack.push(partsIndent);
                }
            } else { // skipTo
                if (contentsLine === contentsIndent + skipTo) {
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
                partsLineNum = 1;
                skipTo = '';
            }
        }

        if (result === Result.same) {
            unexpectedLine = null;
        } else if (result === Result.different) {
            if (unexpectedLine === null) {
                if (partsLineNum === 1) {
                    unexpectedLine = {
                        contentsLineNum: 0,
                        contentsLine: '',
                        partsLineNum: 1,
                        partsLine: expectedParts[0],
                    };
                } else {
                    unexpectedLine = {
                        contentsLineNum: contentsLineNum,
                        contentsLine: testingContents[contentsLineNum - 1],
                        partsLineNum: partsLineNum,
                        partsLine: expectedParts[partsLineNum - 1],
                    };
                }
            }
        } else if (result === Result.skipped) {
            if (unexpectedLine === null) {
                result = Result.different;
                unexpectedLine = {
                    contentsLineNum: skipStartLineNum,
                    contentsLine: skipFrom,
                    partsLineNum: partsLineNum,
                    partsLine: skipTo,
                };
            }
        }

        return  unexpectedLine;
    }
}

// parseCSVColumns
export async function  parseCSVColumns(columns: string): Promise<string[]> {
    if (!columns) {
        return  [];  // stream.Readable.from(undefined) occurs an error
    }
    // Prevent csv-parse module error, when a quote is found inside a field.
    // A quote is always written at frist character.
    // The inside quote should be parsed as a character data in the column.
    if ( columns[0] === '"'  ||  columns.includes(',')) {
        return new Promise((resolveFunction, rejectFunction) => {
            var  columnArray: string[] = [];

            stream.Readable.from(columns)
                .pipe(
                    csvParse.parse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' })
                )
                .on('data', (columns: string[]) => {
                    columnArray = columns;
                })
                .on('end', () => {
                    resolveFunction(columnArray);
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

// parseCSVColumnPositions
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

// escapeRegularExpression
export function  escapeRegularExpression(expression: string) {
    return  expression.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

// replace
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

// replaceAsync
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

// ReplaceParameter
interface ReplaceParameter {
    from?: string;
    fromCSV?: string;
    lineNum?: number;
    to: string;
}

// WritableMemoryStream
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

// isSameArray
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
export function  isSameArrayOf<T>(log: T[], answer: T[]): boolean {
    const matched = log.filter( (item) => answer.includes( item ) );
    const isSame = (matched.length === answer.length && log.length === answer.length);
    return isSame;
}

// getCommonItems
export function  getCommonItems<T>(arrayA: T[], arrayB: T[]): T[] {
    const  commonItems = [] as T[];
    for (const item of arrayA) {
        if (arrayB.includes(item)){
            commonItems.push(item);
        }
    }
    return  commonItems;
}

// cutSameItems
export function  cutSameItems<T>(array: T[]): T[] {
    return  Array.from(new Set<T>(array));
}

// parseMap
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

// isAlphabetIndex
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

// cutAlphabetInIndex
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

// hasInterfaceOf
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

// InputOption
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

// inputOption
const inputOption = new InputOption([
/*
    testBaseFolder +`____.yaml`,
    String.raw `file`,
*/
]);

// setInputOption
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

// inputSkip
export function  inputSkip(count: number) {
    inputOption.nextParameterIndex += count;
}

// setInputEchoBack
export function setInputEchoBack(isEnabled: boolean) {
    inputEchoBack = isEnabled;
}
var  inputEchoBack = false;

// getInputEchoBack
export function getInputEchoBack(): boolean {
    return  inputEchoBack;
}

// StandardInputBuffer
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
        if (!this.readlines) {
            this.delayedConstructor();
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

// getSnapshot
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
export const  debugOut: string[] = [];

// ppClear
// #keyword: ppClear
export function  ppClear() {
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
//   if ( cc(2).isTarget )
//   var d = pp('');  // Set break point here and watch the variable d
export function  cc( targetCount: number = 9999999, label: string = '0' ) {
    if (!(label in gCount)) {
        gCount[label] = 0;
    }

    gCount[label] += 1;
    pp( `${label}:countThrough[${label}] = ${gCount[label]}` );
    const isTarget = ( gCount[label] === targetCount );

    if (isTarget) {
        pp( '    **** It is before the target! ****' );
    }
    return  { isTarget, debugOut };
}
const  gCount: {[name: string]: number} = {};
const  notFound = -1;

