import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';

const  scriptPath =  `../build/typrm.js`;
const  testFolderPath = `test_data` + path.sep;

const  debug = true;

async function  main() {
	if (false) {
		await DoCustomDebug();
	}
	await TestOfCommandLine();
	console.log('Pass');
}

// DoCustomDebug
async function  DoCustomDebug() {
	const  returns = await callChildProccess(`node ../build/typrm.js r C:\\Users\\user1\\steps\\!Temp.yaml 7 "__RepositoryName__: afa"`, {});
	console.log(returns.stdout);
	console.log('Done');
}

// TestOfFileCheck
async function  TestOfCommandLine() {
	let  returns: ProcessReturns;

	if (debug) {
		var cases: ({[name: string]: string})[] = [{
			"name": "version",
			"parameters": "--version",
			"expected": "(not check)",
		},{
			"name": "locale",
			"parameters": "search ABC --folder test_data/search/1",
			"expected": "____/test_data/search/1/1.yaml: #keyword: ABC, \"do it\", \"a,b\"",
		}];
	} else {
		var cases: ({[name: string]: string})[] = [{
			"name": "locale",
			"parameters": "search ABC --folder test_data/search/1",
			"expected": "____/test_data/search/1/1.yaml: #keyword: ABC, \"do it\", \"a,b\"",
		}];
	}
	for (const case_ of cases) {
		console.log(`TestCase: TestOfCommandLine >> ${case_.name}`);

		// Test Main
		returns = await callChildProccess(`node ../build/typrm.js ${case_.parameters} --test`, {});

		// Check
		if (case_.expected !== '(not check)') {
			const  answer = fs.readFileSync(`test_data/command_line/${case_.name}.txt`).toString(); //.substr(cutBOM);

			if (returns.stdout !== answer) {
				printDifferentPaths('_output.txt', '_expected.txt');
				fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
				fs.writeFileSync(testFolderPath + "_expected.txt", returns.stdout);
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