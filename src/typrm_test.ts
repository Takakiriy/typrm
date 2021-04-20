import * as fs from 'fs';
import * as child_process from 'child_process';

const  scriptPath =  `../build/typrm.js`;
const  testFolderPath = `./test_data` + "/";

const  debug = false;

async function  main() {
if (!debug) {
	await TestOfCheck();
	await TestOfChange();
	await TestOfChangeError();
}
	await TestOfFileCheck();
	deleteFile(testFolderPath + '_output.txt');
	console.log('Pass');
}

async function  TestOfCheck() {
	let  returns: ProcessReturns;

	const fileNameHeads = [
		"1_template_1_ok",
		"1_template_2_error",
		"now_1_error",
		"now_2_error_template_error",
		"refer_1_ok",
		"refer_2_error",
		"secret_1_error",
		"var_ref_1_error",
	];
	for (const fileNameHead of fileNameHeads) {
		console.log(`TestCase: TestOfCheck >> ${fileNameHead}`);

		// Test Main
		returns = await callChildProccess(`node ${scriptPath} --test --locale en-US`,
			{inputLines: [
				testFolderPath + fileNameHead + "_1.yaml",
				"exit"
			]}
		);
		const  answer = fs.readFileSync(testFolderPath + fileNameHead + "_3_answer.txt")
			.toString().substr(cutBOM);

		// Check
		if (returns.stdout !== answer) {
			console.log('Error: different between "_output.txt" and "' + fileNameHead + '_3_answer.txt"');
			fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
			throw new Error();
		}
	}
}

// TestOfChange
async function  TestOfChange() {
	let  returns: ProcessReturns;

	const fileNameHeads: {[name: string]: number} = {
		"2_change_1_ok": 2,
		"2_change_3_English": 1,
	};
	for (const fileNameHead in fileNameHeads) {
		const  caseCount = fileNameHeads[fileNameHead];
		for (let target = 1;  target <= caseCount;  target+=1) {
			console.log(`TestCase: TestOfChange >> ${fileNameHead} >> ${target}`);
			const  sourceFilePath   = testFolderPath + fileNameHead + "_1.yaml";
			const  backUpFilePath   = testFolderPath + fileNameHead + "_1_changing.yaml.backup";
			const  changingFilePath = testFolderPath + fileNameHead + "_1_changing.yaml";
			const  answerFilePath   = testFolderPath + fileNameHead + `_2_${target}_after_answer.yaml`;
			deleteFile(changingFilePath);
			deleteFile(backUpFilePath);
			fs.copyFileSync(sourceFilePath, changingFilePath);

			// Test Main
			let  inputLines: string[] = [];
			if (fileNameHead === '2_change_1_ok') {
				if (target === 1) {
					inputLines = [
						changingFilePath,
						"10",
						"key1: value1changed",
						"  __Key2__: value2changed  #コメント  ",
						"Key3: value3changed  #コメント",
						"",
						"exit",
					];
				} else {
					inputLines =  [
						changingFilePath,
						"29",
						"key1: value11changed",
						"",
						"exit",
					];
				}
			} else if (fileNameHead === '2_change_3_English') {
				inputLines =  [
					changingFilePath,
					"30",
					"key1: value11changed",
					"",
					"exit",
				];
			}

			returns = await callChildProccess(`node ${scriptPath} --test --locale en-US`, {inputLines});
			const  source   = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
			const  changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
			const  answer   = fs.readFileSync(answerFilePath).toString().substr(cutBOM);
			const  backUp   = fs.readFileSync(backUpFilePath).toString().substr(cutBOM);

			// Check
			if (changing !== answer) {
				console.log(`Error: different between ` +
					`"${fileNameHead}_1_changing.yaml" and ` +
					`"${fileNameHead}_2_${target}_after_answer.yaml`);
				throw new Error();
			}
			if (backUp !== source) {
				console.log(`Error: different between ` +
					`"${fileNameHead}_1_changing.yaml.backup" and ` +
					`"${fileNameHead}_1.yaml"`);
				throw new Error();
			}

			deleteFile(changingFilePath);
			deleteFile(backUpFilePath);
		}
	}
}

// TestOfChangeError
async function  TestOfChangeError() {
	let  returns: ProcessReturns;

	const fileNameHeads: {[name: string]: any} = {
		"2_change_2_error": {locale: "--test --locale en-US"},
		"2_change_4_Japanese": {locale: "--test --locale ja-JP"},
	};
	for (const fileNameHead in fileNameHeads) {
		console.log(`TestCase: TestOfChangeError >> ${fileNameHead}`);
		const  caseData = fileNameHeads[fileNameHead];
		const  sourceFilePath    = testFolderPath + fileNameHead + "_1.yaml";
		const  backUpFilePath    = testFolderPath + fileNameHead + "_1_changing.yaml.backup";
		const  changingFilePath  = testFolderPath + fileNameHead + "_1_changing.yaml";
		const  answerFilePath    = testFolderPath + fileNameHead + "_2_after_answer.yaml";
		const  logAnswerFilePath = testFolderPath + fileNameHead + "_3_answer.txt";
		deleteFile(changingFilePath);
		deleteFile(backUpFilePath);
		fs.copyFileSync(sourceFilePath, changingFilePath);

		// Test Main
		returns = await callChildProccess(`node ${scriptPath} ${caseData.locale}`,
			{inputLines: [
				changingFilePath,
				"4",
				"Key3: value3changed",
				"exit",
			]}
		);
		const  changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
		const  answer   = fs.readFileSync(answerFilePath).toString().substr(cutBOM);
		const  logAnswer = fs.readFileSync(logAnswerFilePath).toString().substr(cutBOM);

		// Check
		if (returns.stdout !== logAnswer) {
			console.log('Error: different between "_output.txt" and "' + fileNameHead + '_3_answer.txt"');
			fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
			throw new Error();
		}
		if (changing !== answer) {
			console.log(`Error: different between ` +
				`"${fileNameHead}_1_changing.yaml" and ` +
				`"${fileNameHead}_2_after_answer.yaml"`);
			throw new Error();
		}

		deleteFile(changingFilePath);
		deleteFile(backUpFilePath);
	}
}

// TestOfFileCheck
async function  TestOfFileCheck() {
	let  returns: ProcessReturns;

	if (debug) {
		var fileNameHeads: {[name: string]: number} = {
	//		"file_1_ok_and_bad": 1,
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
				console.log('Error: different between "_output.txt" and "' + fileNameHead + '_4_answer.txt"');
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

const  cutBOM = 1;
const  notFound = -1;
main();