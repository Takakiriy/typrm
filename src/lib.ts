import * as fs from "fs";
import * as path from "path";
import globby from 'globby';
import * as readline from 'readline';
import * as stream from 'stream';
import csvParse from 'csv-parse';
import { stringify } from "querystring";
const  snapshots = require(`${__dirname}/../src/__snapshots__/main.test.ts.snap`);


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
                    csvParse({ quote: '"', ltrim: true, rtrim: true, delimiter: ',' })
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
    var  replaced = input;
    for (const replacer of replacers) {
        replaced = replaced.replace(replacer.from, replacer.to);
    }
    return  replaced;
}

// ReplaceParameter
interface ReplaceParameter {
    from: string;
    to: string;
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
            if (nextLine) {
                console.log(guide + nextLine);
                resolve(nextLine);
            } else {
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


// Data group

// getCommonElements
export function  getCommonElements<T>(arrayA: T[], arrayB: T[]): T[] {
    const  commonElements = [] as T[];
    for (const item of arrayA) {
        if (arrayB.includes(item)){
            commonElements.push(item);
        }
    }
    return  commonElements;
}

// isAlphabetIndex
export function  isAlphabetIndex(index: string): boolean {
    const  lastCharacter = index.substr(-1);
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
class InputOption {
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
        if (value.substr(0,1) !== '-') {
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
const  InputObject = new StandardInputBuffer();
export function  getInputObject(): StandardInputBuffer {
    return  InputObject;
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
//    try {
//
//        await main();
//    } finally {
//        var d = pp('');
//        d = [];  // Set break point here and watch the variable d
//    }
export function  pp(message: any) {
    if (message instanceof Array) {
        for (const element of message) {
            debugOut.push(element.toString());
        }
    } else {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
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

