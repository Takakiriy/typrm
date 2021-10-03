import * as fs from "fs";
import * as path from "path";
import * as globby from 'globby';
import * as readline from 'readline';
import * as stream from 'stream';
import * as csvParse from 'csv-parse';
const  snapshots = require(`${__dirname}/../src/__snapshots__/main.test.ts.snap`);


// File group

// copyFolderSync
// #keyword: copyFolderSync
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
// #keyword: copyFileSync
// This also makes the copy target folder.
export function  copyFileSync(sourceFilePath: string, destinationFilePath: string) {
	const  destinationFolderPath = path.dirname(destinationFilePath);
	fs.mkdirSync(destinationFolderPath, {recursive: true});

	fs.copyFileSync(sourceFilePath, destinationFilePath);
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
// #keyword: JavaScript (js) library getFullPath
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
// #keyword: JavaScript (js) library isFullPath
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
// #keyword: getHomePath
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
// #keyword: getGlobbyParameters
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
// #keyword: cutLeftOf
export function  cutLeftOf(input: string, keyword: string): string {
    const  keywordPosition = input.indexOf(keyword);
    if (keywordPosition !== notFound) {

        return  input.substr(keywordPosition);
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
                .on('data', (columns) => {
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

// hasInterfaceOf
export namespace  hasInterfaceOf {
    export function  Error(object: any): object is Error {
        return (
            object.hasOwnProperty('message')
        );
    }
}


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
export function  getSnapshot(label: string) {
    if ( ! (label in snapshots)) {
        throw  new Error(`not found snapshot label "${label}" in "__Project__/src/__snapshots__/main.test.ts.snap" file.`)
    }
    const  snapshot = snapshots[label];
    return  snapshot.substr(2, snapshot.length - 4).replace(/\\\"/g, '"');
}

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
export function  pp(message: any) {
    if (message instanceof Array) {
        for (const element of message) {
            debugOut.push(element.toString());
        }
    } else {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        debugOut.push(message.toString());
    }
    return debugOut;
}
export const  debugOut: string[] = [];

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

