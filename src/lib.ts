import * as fs from "fs";
import * as path from "path";
import * as globby from 'globby';
import * as readline from 'readline';

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
                this.inputResolver(line);
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
