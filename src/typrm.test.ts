import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';

if (path.basename(process.cwd()) !== 'src') {  // Jest watch mode で２回目の実行をしても カレント フォルダー が引き継がれるため
    process.chdir('src');
}
const  scriptPath =  `../build/typrm.js`;
const  testFolderPath = `test_data` + path.sep;

describe('search', () => {
    let  returns: ProcessReturns;

    test.each([
/*
        [
            '1st',
            'ABC  --folder test_data/search/1',
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.txt:3:#keyword: ABC, "do it", "a,b"\n'
        ],
        [
            'not found',
            'notFound  --folder test_data/search/1',
            ''
        ],[
            'space',
            '"do it"  --folder test_data/search/1',
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.txt:3:#keyword: ABC, "do it", "a,b"\n'
        ],[
            'comma',
            'a,b  --folder test_data/search/1',
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.txt:3:#keyword: ABC, "do it", "a,b"\n'
        ]
*/
    ])('%s', async (_caseName, parameters, answer) => {

        returns = await callChildProccess(`node ${scriptPath} search --test  ${parameters}`);
            expect(returns.stdout).toBe(answer);
    });
});

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

export {};
declare global {  // for TypeScript
    namespace jest {
        interface Matchers<R> {
            because: (expected: string) => CustomMatcherResult;
        }
    }
}
expect.extend({

    because(isPassed: boolean, errorMessage: string) {
        return {
            pass: isPassed,
            message: () => errorMessage,
        };
    },
});
