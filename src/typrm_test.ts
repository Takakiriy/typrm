import * as fs from 'fs';
import * as child_process from 'child_process';
import * as url from 'url';
import * as path from 'path';
import * as lib from './lib';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const  scriptPath =  `../build/typrm.js`;
const  testFolderPath = `test_data` + path.sep;
//process.env.TYPRM_THESAURUS = 'test_data/thesaurus/thesaurus.csv';
//process.env.TYPRM_FOLDER = 'C:/aaaa';
process.env.TYPRM_LINE_NUM_GETTER = `
    - #
        regularExpression: ^(.*\\.(yaml|yml|json|js|ts|jsx|tsx|md|py|go|swift))(#(.*))?\$
        type: text
        filePathRegularExpressionIndex: 1
        keywordRegularExpressionIndex: 4
        address: "\${file}:\${lineNum}"
`;
process.env.TYPRM_VERB = `
    - #
        label: 7.Test Echo
        number: 7
        regularExpression: .*
        command: 'echo  "ref:  \${ref}";  echo  "file: \${file}";  echo  "fragment: \${fragment}";  echo  "lineNum: \${lineNum}"'
`;
if (process.env.windir) {
    var  testingOS = 'Windows';
    process.env.TYPRM_OPEN_DOCUMENT = `powershell -Command "Write-Output  'code -g ""\${ref}"""' > test_data\\_out.txt"`;
} else {
    var  testingOS = 'mac';  // or Linux
    process.env.TYPRM_OPEN_DOCUMENT = `echo  "code -g \\"\${ref}\\"" > test_data/_out.txt`;
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
    const  returns = await callChildProccess(
        `node --experimental-modules --es-module-specifier-resolution=node ${scriptPath} ` +
        `search  --folder test_data/search/1`, {inputLines: ['Not', '', 'exit()']});
    console.log(`(typrm_test.ts) ${returns.stdout}`);
    console.log('Done');
}

// TestOfFileCheck
async function  TestOfCommandLine() {
    var  returns: ProcessReturns;

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
        "name": "search_mode_select_by_number",
        "parameters": "--folder test_data/search/1",
        "check": "false",
        "checkFile": "_out.txt",
        "inputLines": "double quotation is\n#1\nexit()\n",
    },{
        "name": "search_mode_ref_verb",
        "parameters": "search",
        "check": "true",
        "inputLines": "#ref: \"../README.md#parameters\"\n7\n\n7\nexit()\n",
    },{
        "name": "search_mode_find",
        "parameters": "search  --folder test_data/search/1",
        "check": "true",
        "inputLines": "Not\n\n\nexit()\n",
    },{
        "name": "search_mode_result_has_ref_verb",
        "parameters": "search  --folder test_data/search/2",
        "check": "true",
        "inputLines": "file_path\nexit()\n",
    }];
    for (const case_ of cases) {
        if ( true  ||  case_.name === 'search_mode_find') {
            console.log(`\nTestCase: TestOfCommandLine >> ${case_.name}`);
            const  optionsForESModules = '--experimental-modules --es-module-specifier-resolution=node';

            // Test Main
            returns = await callChildProccess(`node ${optionsForESModules} ${scriptPath} ${case_.parameters} --test`,
                {inputLines: case_.inputLines.split('\n')});

            // Check
            if (case_.check === 'true') {
                const  noData = 'no data';
                const  answer  = lib.getSnapshot(`typrm_test >> TestOfCommandLine >> ${case_.name} >> ${testingOS}: stdout 1`);
                const  answer2 = lib.getSnapshot(`typrm_test >> TestOfCommandLine >> ${case_.name} >> ${testingOS}2: stdout 1`, noData);

                if (returns.stdout !== answer  &&  returns.stdout !== answer2) {
                    if (answer2 === noData) {
                        printDifferentPaths('_output.txt', '_expected.txt');
                    } else {
                        printDifferentPaths('_output.txt', '_expected.txt', '_expected2.txt');
                    }
                    fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
                    fs.writeFileSync(testFolderPath + "_expected.txt", answer);
                    fs.writeFileSync(testFolderPath + "_expected2.txt", answer2);
                    throw new Error(`in typrm_test >> TestOfCommandLine >> ${case_.name}`);
                }
            }
            if (case_.checkFile) {
                const  snapShotName = `typrm_test >> TestOfCommandLine >> ${case_.name} >> ${case_.checkFile} 1`;
                const  result = fs.readFileSync(testFolderPath + case_.checkFile, 'utf-8').replace(/\r/g, '');
                const  answer = lib.getSnapshot(snapShotName);

                if (result !== answer) {
                    fs.writeFileSync(testFolderPath + '_expected.txt', answer);
                    printDifferentPaths(case_.checkFile, '_expected.txt');
                    throw new Error(`in typrm_test >> TestOfCommandLine >> ${case_.name}`);
                }               
            }
        }
    }
    deleteFile(testFolderPath + "_out.txt");
    deleteFile(testFolderPath + "_output.txt");
    deleteFile(testFolderPath + "_expected.txt");
    deleteFile(testFolderPath + "_expected2.txt");
}

// callChildProccess
async function  callChildProccess(commandLine: string,  option?: ProcessOption): Promise<ProcessReturns> {
    console.log(`CommandLine: ${commandLine}`);
    console.log(option);

    return   new Promise( async (resolveFunction, rejectFunction) => {
        const  returnValue = new ProcessReturns();
        try {
// if (commandLine.includes('Not')) {
//             var  childProcess = child_process.spawn(... commandLine.split(' '),

//                 // on close the "childProcess" (2)
//                 (error: child_process.ExecException | null, stdout: string, stderr: string) => {
//                     returnValue.stdout = stdout;
//                     returnValue.stderr = stderr;
//                     resolveFunction(returnValue);
//                 },
//             );
// } else {
            var  childProcess = child_process.exec( commandLine,
                { maxBuffer: 2000*1024, timeout:1000 },

                // on close the "childProcess" (2)
                (error: child_process.ExecException | null, stdout: string, stderr: string) => {
                    returnValue.stdout = stdout;
                    returnValue.stderr = stderr;
                    resolveFunction(returnValue);
                },
            );
// }
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
function  printDifferentPaths(path1: string, path2: string, path3: string | undefined = undefined) {
    console.log(`Error: different between the following files`);
    console.log(`  Path1: ${testFolderFullPath + path1}`);
    console.log(`  Path2: ${testFolderFullPath + path2}`);
    if (path3) {
        console.log(`  Path3: ${testFolderFullPath + path3}`);
    }
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
