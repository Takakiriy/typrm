import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';

const  scriptPath =  `../build/typrm.js`;
const  testFolderPath = `test_data` + path.sep;

const  debug = false;

async function  main() {
if (!debug) {
	await TestOfFileCheck();
} else {
	await TestOfFileCheck();
}
	deleteFile(testFolderPath + '_output.txt');
	console.log('Pass');
}

// TestOfFileCheck
async function  TestOfFileCheck() {
	let  returns: ProcessReturns;

	if (debug) {
		var fileNameHeads: {[name: string]: number} = {
			"file_1_ok_and_bad": 1,
			"file_2_tab": 1,
			"file_3_file_name": 1,
		};
	} else {
		var fileNameHeads: {[name: string]: number} = {
			"file_1_ok_and_bad": 1,
	//		"file_2_tab": 1,
	//		"file_3_file_name": 1,
		};
	}
	for (const fileNameHead in fileNameHeads) {
		const  caseCount = fileNameHeads[fileNameHead];
		for (let target = 1;  target <= caseCount;  target+=1) {
			console.log(`TestCase: TestOfFileCheck >> ${fileNameHead} >> ${target}`);
			const  sourceFilePath   = testFolderPath + fileNameHead + "_1.yaml";
			const  backUpFilePath   = testFolderPath + fileNameHead + "_1_changing.yaml.backup";
			const  changingFilePath = testFolderPath + fileNameHead + "_1_changing.yaml";
			deleteFile(changingFilePath);
			deleteFile(backUpFilePath);
			fs.copyFileSync(sourceFilePath, changingFilePath);

			// Test Main
			let  inputLines: string[] = [];
			if (fileNameHead === 'file_1_ok_and_bad') {
				inputLines = [
					changingFilePath,
					"6",
					"__User__: user2",
					"",
					"exit",
				];
			} else {
				inputLines = [
					changingFilePath,
					"exit",
				];
			}

			returns = await callChildProccess(`node ${scriptPath} --test --locale en-US`, {inputLines});
			const  answer = fs.readFileSync(testFolderPath + fileNameHead + "_4_answer.txt")
				.toString().substr(cutBOM);

			// Check
			if (returns.stdout !== answer) {
				printDifferentPaths('_output.txt', fileNameHead + '_4_answer.txt');
				fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
				throw new Error();
			}
		}
	}
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