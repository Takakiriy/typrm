import * as fs from 'fs';
import * as child_process from 'child_process';
import * as url from 'url';
import * as path from 'path';
import * as lib from './lib';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.windir) {
    var testingOS = 'Windows';
}
else {
    var testingOS = 'Linux';
}
const scriptPath = `../build/typrm.js`;
const testFolderPath = `test_data` + path.sep;
var normalizedHomePath = lib.getHomePath().replace(/\\/g, '/');
normalizedHomePath = normalizedHomePath[0].toLowerCase() + normalizedHomePath.substring(1);
//process.env.TYPRM_THESAURUS = 'test_data/thesaurus/thesaurus.csv';
//process.env.TYPRM_FOLDER = 'C:/aaaa';
process.env.TYPRM_COMMAND_FOLDER = process.cwd();
process.env.TYPRM_LINE_NUM_GETTER = `
    - #
        regularExpression: ^(.*\\.(yaml|yml|json|js|ts|jsx|tsx|md|py|go|swift))(#(.*))?\$
        type: text
        filePathRegularExpressionIndex: 1
        keywordRegularExpressionIndex: 4
        address: "\${file}:\${lineNum}"
    - #
        regularExpression: ^(.*\\.(jpg|jpeg|png))\\?(name=([^&]*)&)?x=([0-9]+)&y=([0-9]+)$
        type: figure
        filePathRegularExpressionIndex: 1
        nameExpressionIndex: 4
        xExpressionIndex: 5
        yExpressionIndex: 6
        pointerImage: ../example/pointer_100x100.png
        outputFolder: ../_output
`;
process.env.TYPRM_VERB = `
    - #
        label: 7.Test Echo
        number: 7
        regularExpression: .*
        command: 'echo  "ref:  \${ref}";  echo  "file: \${file}";  echo  "fragment: \${fragment}";  echo  "lineNum: \${lineNum}"'
`;
if (process.env.windir) {
    var testingOS = 'Windows';
    process.env.TYPRM_OPEN_DOCUMENT = `powershell -Command "Write-Output  'code -g ""\${ref}"""' > test_data\\_out.log"`;
}
else {
    var testingOS = 'mac'; // or Linux
    process.env.TYPRM_OPEN_DOCUMENT = `echo  "code -g \\"\${ref}\\"" > test_data/_out.log`;
}
async function main() {
    if (false) {
        await DoCustomDebug();
    }
    else {
        await TestOfCommandLine();
    }
    console.log('Pass');
}
// DoCustomDebug
async function DoCustomDebug() {
    const returns = await callChildProccess(`node --experimental-modules --es-module-specifier-resolution=node ${scriptPath} ` +
        `search  --folder test_data/search/1`, { inputLines: [ /*"exit()"*/] });
    console.log(`(typrm_test.ts stdout) ${returns.stdout}`);
    console.log('Done');
}
// TestOfFileCheck
async function TestOfCommandLine() {
    var returns;
    var cases = [
        { "name": "version",
            "parameters": "--version",
            "check": "false",
            "inputLines": "",
        }, { "name": "locale",
            "parameters": "search ABC --folder test_data/search/1",
            "check": "true",
            "inputLines": "",
            // There are search_mode, search_mode_find test in "main.test.ts".
        }, { "name": "search_mode_select_by_number",
            "parameters": "--folder test_data/search/1",
            "check": "false",
            "checkFile": "_out.log",
            "inputLines": "double quotation is\n#1\nexit()\n",
        }, { "name": "search_mode_ref_verb",
            "parameters": "search",
            "check": "true",
            "inputLines": `#ref: \"${normalizedHomePath}/GitProjects/GitHub/typrm/README.md#parameters\"\n7\n\n7\nexit()\n`,
        }, { "name": "search_mode_result_has_ref_verb",
            "parameters": "search  --folder test_data/search/2",
            "check": "true",
            "inputLines": "file_path\nexit()\n",
        }, { "name": "pointed_figure_1",
            "parameters": "search  \"#ref: ${normalizedHomePath}/GitProjects/GitHub/typrm/example/figure_1.png?name=test_1&x=404&y=70\"",
            "check": "false",
            "inputLines": "",
        }, { "name": "pointed_figure_2",
            "parameters": "search",
            "check": "false",
            "inputLines": "#ref: ${normalizedHomePath}/GitProjects/GitHub/typrm//example/figure_1.png?name=test_2&x=404&y=70\nexit()\n",
        }
    ];
    for (const case_ of cases) {
        if (true || case_.name === 'pointed_figure_1') {
            console.log(`\nTestCase: TestOfCommandLine >> ${case_.name}`);
            const optionsForESModules = '--experimental-modules --es-module-specifier-resolution=node';
            // Test Main
            returns = await callChildProccess(`node ${optionsForESModules} ${scriptPath} ${case_.parameters} --test  --stdout-buffer`, { inputLines: case_.inputLines.split('\n') });
            // Redirect is also lost some outputs.
            //    callChildProccess(`... > test_data/_stdout.log`);
            //    returns.stdout = fs.readFileSync('test_data/_stdout.log').toString();
            // To flush stdout is also lost some outputs.
            //     console.log('This text will be lost')
            //     process.stdout.write('some data', () => {
            //         process.stdout.write('The data has been flushed');
            //     });
            //     https://stackoverflow.com/questions/12510835/stdout-flush-for-nodejs
            // --stdout-buffer option solves the problem.
            // Check
            if (case_.check === 'true') {
                const noData = 'no data';
                const answer = lib.getSnapshot(`typrm_test >> TestOfCommandLine >> ${case_.name} >> ${testingOS}: stdout 1`);
                const answer2 = lib.getSnapshot(`typrm_test >> TestOfCommandLine >> ${case_.name} >> ${testingOS}2: stdout 1`, noData);
                var stdout = returns.stdout;
                stdout = stdout.replace(new RegExp(normalizedHomePath, 'ig'), '${HOME}')
                    .replace(new RegExp(lib.getHomePath().replace(/\\/g, '\\\\'), 'ig'), '${HOME}')
                    .replace(/\\/g, '/');
                if (stdout !== answer) {
                    if (answer2 === noData) {
                        printDifferentPaths('_output.log', '_expected.log');
                    }
                    else {
                        printDifferentPaths('_output.log', '_expected.log', '_expected2.log');
                    }
                    fs.writeFileSync(testFolderPath + "_output.log", stdout);
                    fs.writeFileSync(testFolderPath + "_expected.log", answer);
                    fs.writeFileSync(testFolderPath + "_expected2.log", answer2);
                    throw new Error(`in typrm_test >> TestOfCommandLine >> ${case_.name}`);
                }
            }
            if (case_.checkFile) {
                const snapShotName = `typrm_test >> TestOfCommandLine >> ${case_.name} >> ${case_.checkFile} 1`;
                const result = fs.readFileSync(testFolderPath + case_.checkFile, 'utf-8')
                    .replace(/\r/g, '').replace(lib.getHomePath(), '${HOME}');
                var answer = lib.getSnapshot(snapShotName);
                if (testingOS === 'Windows') {
                    answer = answer.replace(/\//g, '\\');
                }
                if (result !== answer) {
                    fs.writeFileSync(testFolderPath + '_expected.log', answer);
                    printDifferentPaths(case_.checkFile, '_expected.log');
                    throw new Error(`in typrm_test >> TestOfCommandLine >> ${case_.name}`);
                }
            }
        }
    }
    deleteFile(testFolderPath + "_out.log");
    deleteFile(testFolderPath + "_output.log");
    deleteFile(testFolderPath + "_expected.log");
    deleteFile(testFolderPath + "_expected2.log");
}
// callChildProccess
async function callChildProccess(commandLine, option) {
    console.log(`CommandLine: ${commandLine}`);
    console.log(option);
    return new Promise(async (resolveFunction, rejectFunction) => {
        const returnValue = new ProcessReturns();
        try {
            var childProcess = child_process.exec(commandLine, { /* maxBuffer: 2000*1024, timeout:5000*/}, 
            // on close the "childProcess" (2)
            (error, stdout, stderr) => {
                returnValue.stdout = stdout;
                returnValue.stderr = stderr;
                resolveFunction(returnValue);
            });
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
            childProcess.on('close', (exitCode) => {
                returnValue.exitCode = exitCode;
            });
            childProcess.on('exit', (exitCode) => {
                returnValue.exitCode = exitCode;
            });
        }
        catch (e) {
            throw Error(`Error in the command line ${commandLine}`);
        }
    });
}
// deleteFile
function deleteFile(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// getFullPath
function getFullPath(relativePath, basePath) {
    var fullPath = '';
    if (relativePath.substr(0, 1) === '/') {
        fullPath = relativePath;
    }
    else {
        fullPath = path.join(basePath, relativePath);
    }
    return fullPath;
}
// printDifferentPaths
function printDifferentPaths(path1, path2, path3 = undefined) {
    console.log(`Error: different between the following files`);
    console.log(`  Path1: ${testFolderFullPath + path1}`);
    console.log(`  Path2: ${testFolderFullPath + path2}`);
    if (path3) {
        console.log(`  Path3: ${testFolderFullPath + path3}`);
    }
}
// diffStrings
function diffStrings(result, answer) {
    const resultFilePath = '_output.log';
    const answerFilePath = '_answer.log';
    fs.writeFileSync(testFolderFullPath + resultFilePath, result);
    fs.writeFileSync(testFolderFullPath + answerFilePath, answer);
    printDifferentPaths(resultFilePath, answerFilePath);
}
// ProcessOption
class ProcessOption {
}
// ProcessReturns
class ProcessReturns {
    constructor() {
        this.exitCode = 0;
        this.stdout = '';
        this.stderr = '';
    }
}
const testFolderFullPath = getFullPath(`../src/${testFolderPath}`, __dirname);
const cutBOM = 1;
const notFound = -1;
main();
//# sourceMappingURL=typrm_test.js.map