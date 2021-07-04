import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';
const currentFolder = process.cwd();
const snapshots = require(currentFolder +"/__snapshots__/main.test.ts.snap");

const  scriptPath =  `../build/typrm.js`;
const  testFolderPath = `test_data` + path.sep;
process.env.TYPRM_VERB = `
    - #
        label: 7.Test Echo
        number: 7
        regularExpression: ^.*\\.md(#.*)?\$
        command: 'echo  "(\${ref})"'
`;
if (process.env.windir !== '') {
    var  testingOS = 'Windows';
} else {
    var  testingOS = 'Linux';
}

async function  main() {
    if (false) {
        await DoCustomDebug();
    } else {
        await TestOfCommandLine();
    }
    console.log('Pass');
}

// DoCustomDebug
async function  DoCustomDebug() {
    const  returns = await callChildProccess(`node ${scriptPath} r C:\\Users\\user1\\steps\\!Temp.yaml 7 "__RepositoryName__: afa"`, {});
    // const  returns = await callChildProccess(`node ${scriptPath} s DSL --folder /Users/totadashi/Documents/typrm`, {});
    console.log(returns.stdout);
    console.log('Done');
}

// TestOfFileCheck
async function  TestOfCommandLine() {
    let  returns: ProcessReturns;

    var cases: ({[name: string]: string})[] = [{
        "name": "version",
        "parameters": "--version",
        "check": "false",
        "inputLines": "",
    },{
        "name": "locale",
        "parameters": "search ABC --folder test_data/search/1",
        "check": "true",
        "inputLines": "",
    },{
        "name": "search_mode",
        "parameters": "search  --folder test_data/search/1",
        "check": "true",
        "inputLines": "ABC\nexit()\n",
    },{
        "name": "search_mode_ref_verb",
        "parameters": "search",
        "check": "true",
        "inputLines": "#ref: ../README.md\n7\n\n7\nexit()\n",
    }];
    for (const case_ of cases) {
        console.log(`TestCase: TestOfCommandLine >> ${case_.name}`);

        // Test Main
        returns = await callChildProccess(`node ${scriptPath} ${case_.parameters} --test`,
            {inputLines: case_.inputLines.split('\n')});

        // Check
        if (case_.check === 'true') {
            if (testingOS === 'Windows') {
                testingOS = 'Windows2';
            }
            const  answer = getSnapshot(`typrm_test >> ${case_.name} >> ${testingOS}: stdout 1`);

            if (returns.stdout !== answer) {
                printDifferentPaths('_output.txt', '_expected.txt');
                fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
                fs.writeFileSync(testFolderPath + "_expected.txt", answer);
                throw new Error();
            }
        }
    }
    deleteFile(testFolderPath + "_output.txt");
    deleteFile(testFolderPath + "_expected.txt");
}

// callChildProccess
async function  callChildProccess(commandLine: string,  option?: ProcessOption): Promise<ProcessReturns> {
    return   new Promise( async (resolveFunction, rejectFunction) => {
        const  returnValue = new ProcessReturns();
        try {
            const  childProcess = child_process.exec( commandLine,

                // on close the "childProcess" (2)
                (error: child_process.ExecException | null, stdout: string, stderr: string) => {
                    returnValue.stdout = stdout;
                    returnValue.stderr = stderr;
                    resolveFunction(returnValue);
                }
            );
            if (option && childProcess.stdin) {

                if (option.inputLines) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    for (const inputLine of option.inputLines) {
                        console.log(inputLine);
                        childProcess.stdin.write(inputLine + "\n");
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
                childProcess.stdin.end();
            }

            // on close the "childProcess" (1)
            childProcess.on('close', (exitCode: number) => {
                returnValue.exitCode = exitCode;
            });
            childProcess.on('exit', (exitCode: number) => {
                returnValue.exitCode = exitCode;
            });
        } catch (e) {
            throw Error(`Error in the command line ${commandLine}`);
        }
    });
}

// getSnapshot
function  getSnapshot(label: string) {
    const  snapshot = snapshots[label];
    if ( ! snapshot) {
        throw  new Error(`Not found '${label}' in __snapshots__/____.snap`);
    }
    return  snapshot.substr(2, snapshot.length - 4).replace('\\"', '"');
}

// deleteFile
function  deleteFile(path: string) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

// getFullPath
function  getFullPath(relativePath: string, basePath: string): string {
    var  fullPath = '';
    if (relativePath.substr(0,1) === '/') {
        fullPath = relativePath;
    } else {
        fullPath = path.join(basePath, relativePath);
    }
    return  fullPath;
}

// printDifferentPaths
function  printDifferentPaths(path1: string, path2: string) {
    console.log(`Error: different between the following files`);
    console.log(`  Path1: ${testFolderFullPath + path1}`);
    console.log(`  Path2: ${testFolderFullPath + path2}`);
}

// diffStrings
function  diffStrings(result: string, answer: string) {
    const  resultFilePath = '_output.txt';
    const  answerFilePath = '_answer.txt';

    fs.writeFileSync(testFolderFullPath + resultFilePath, result);
    fs.writeFileSync(testFolderFullPath + answerFilePath, answer);

    printDifferentPaths(resultFilePath, answerFilePath);
}

// ProcessOption
class ProcessOption {
    inputLines?: string[];
}

// ProcessReturns
class ProcessReturns {
    exitCode: number = 0;
    stdout: string = '';
    stderr: string = '';
}

const  testFolderFullPath = getFullPath( `../src/${testFolderPath}`, __dirname);
const  cutBOM = 1;
const  notFound = -1;
main();
