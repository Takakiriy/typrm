import * as fs from 'fs';
import * as child_process from 'child_process';

const  scriptPath = String.raw `..\out\check_template_line.js`;
const  testFolderPath = String.raw `..\check_template_line\test_data` + "\\";

async function  main() {
	await TestOfCheck();
	await TestOfChange();
	await TestOfChangeError();
	await TestOfChanges();
	await TestOfChangeSet();
	deleteFile(testFolderPath + '_output.txt');
	console.log('Pass');
}

async function  TestOfCheck() {
	let  returns: ProcessReturns;

	const fileNameHeads = ["now_error", "refer_ok", "refer_error", "secret_error",
		"template_error", "template_ok", "var_ref_error",
	];
	for (const fileNameHead of fileNameHeads) {

		// Test Main
		returns = await callChildProccess(`node ${scriptPath} --english`,
			{inputLines: [
				testFolderPath + fileNameHead + ".yaml",
				"exit"
			]}
		);
		const  answer = fs.readFileSync(testFolderPath + fileNameHead + "_answer.txt")
			.toString().substr(cutBOM);

		// Check
		if (returns.stdout !== answer) {
			console.log('Error: different between "_output.txt" and "' + fileNameHead + '_answer.txt"');
			fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
			throw new Error();
		}
	}
}

async function  TestOfChange() {
	const fileNameHeads = ["change"];
	for (const fileNameHead of fileNameHeads) {
		const  sourceFilePath   = testFolderPath + fileNameHead + ".yaml";
		const  backUpFilePath   = testFolderPath + fileNameHead + "_changing.yaml.backup";
		const  changingFilePath = testFolderPath + fileNameHead + "_changing.yaml";
		const  answerFilePath   = testFolderPath + fileNameHead + "_after_answer.yaml";
		deleteFile(changingFilePath);
		deleteFile(backUpFilePath);
		fs.copyFileSync(sourceFilePath, changingFilePath);

		// Test Main
		await callChildProccess(`node ${scriptPath} --english`,
			{inputLines: [
				changingFilePath,
				"I1",
				"Key3",
				"value3changed",
				"exit",
			]}
		);
		const  source   = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
		const  backUp   = fs.readFileSync(backUpFilePath).toString().substr(cutBOM);
		const  changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
		const  answer   = fs.readFileSync(answerFilePath).toString().substr(cutBOM);

		// Check
		if (changing !== answer) {
			console.log(`Error: different between ` +
				`"${fileNameHead}_changing.yaml" and ` +
				`"${fileNameHead}_after_answer.yaml"`);
			throw new Error();
		}
		if (backUp !== source) {
			console.log(`Error: different between ` +
				`"${fileNameHead}_changing.yaml.backup" and ` +
				`"${fileNameHead}.yaml"`);
			throw new Error();
		}

		deleteFile(changingFilePath);
		deleteFile(backUpFilePath);
	}
}

async function  TestOfChangeError() {
	let  returns: ProcessReturns;

	const fileNameHeads = ["change_error"];
	for (const fileNameHead of fileNameHeads) {
		const  sourceFilePath   = testFolderPath + fileNameHead + ".yaml";
		const  backUpFilePath   = testFolderPath + fileNameHead + "_changing.yaml.backup";
		const  changingFilePath = testFolderPath + fileNameHead + "_changing.yaml";
		const  answerFilePath   = testFolderPath + fileNameHead + "_after_answer.yaml";
		const  logAnswerFilePath   = testFolderPath + fileNameHead + "_answer.txt";
		deleteFile(changingFilePath);
		deleteFile(backUpFilePath);
		fs.copyFileSync(sourceFilePath, changingFilePath);

		// Test Main
		returns = await callChildProccess(`node ${scriptPath} --english`,
			{inputLines: [
				changingFilePath,
				"I1",
				"Key3",
				"value3changed",
				"exit",
			]}
		);
		const  changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
		const  answer   = fs.readFileSync(answerFilePath).toString().substr(cutBOM);
		const  logAnswer = fs.readFileSync(logAnswerFilePath).toString().substr(cutBOM);

		// Check
		if (returns.stdout !== logAnswer) {
			console.log('Error: different between "_output.txt" and "' + fileNameHead + '_answer.txt"');
			fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
			throw new Error();
		}
		if (changing !== answer) {
			console.log(`Error: different between ` +
				`"${fileNameHead}_changing.yaml" and ` +
				`"${fileNameHead}_after_answer.yaml"`);
			throw new Error();
		}

		deleteFile(changingFilePath);
		deleteFile(backUpFilePath);
	}
}

// TestOfChanges
async function  TestOfChanges() {
	let  returns: ProcessReturns;

	const fileNameHeads = ["changes"];
	for (const fileNameHead of fileNameHeads) {
		for (const target of ["1", "2"]) {
			const  sourceFilePath   = testFolderPath + fileNameHead + ".yaml";
			const  backUpFilePath   = testFolderPath + fileNameHead + "_changing.yaml.backup";
			const  changingFilePath = testFolderPath + fileNameHead + "_changing.yaml";
			const  answerFilePath   = testFolderPath + fileNameHead + `_${target}_after_answer.yaml`;
			deleteFile(changingFilePath);
			deleteFile(backUpFilePath);
			fs.copyFileSync(sourceFilePath, changingFilePath);

			// Test Main
			let  inputLines;
			if (target === "1") {
				inputLines =  [
					changingFilePath,
					"1",
					"key1: value1changed",
					"  __Key2__: value2changed  #コメント  ",
					"Key3: value3changed  #コメント",
					"",
					"exit",
				];
			} else{
				inputLines =  [
					changingFilePath,
					"25",
					"key1: value11changed",
					"",
					"exit",
				];
			}

			returns = await callChildProccess(`node ${scriptPath} --english`, {inputLines});
			const  source   = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
			const  changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
			const  answer   = fs.readFileSync(answerFilePath).toString().substr(cutBOM);
			const  backUp   = fs.readFileSync(backUpFilePath).toString().substr(cutBOM);

			// Check
			if (changing !== answer) {
				console.log(`Error: different between ` +
					`"${fileNameHead}_changing.yaml" and ` +
					`"${fileNameHead}_${target}_after_answer.yaml`);
				throw new Error();
			}
			if (backUp !== source) {
				console.log(`Error: different between ` +
					`"${fileNameHead}_changing.yaml.backup" and ` +
					`"${fileNameHead}.yaml"`);
				throw new Error();
			}

			deleteFile(changingFilePath);
			deleteFile(backUpFilePath);
		}
	}
}

// TestOfChangeSet
async function  TestOfChangeSet() {
	let  returns: ProcessReturns;

	const fileNameHeads = ["change_set"];
	for (const fileNameHead of fileNameHeads) {
		for (const target of ["Changed", "Original", "SettingIndex", "ErrorBadName", "AllSetting"]) {
			let  filaNameTail: string;
			if ( ! target.startsWith('Error')) {
				filaNameTail = 'after_answer.yaml';
			} else {
				filaNameTail = 'answer.txt';
			}
			const  sourceFilePath   = testFolderPath + fileNameHead + ".yaml";
			const  backUpFilePath   = testFolderPath + fileNameHead + "_changing.yaml.backup";
			const  changingFilePath = testFolderPath + fileNameHead + "_changing.yaml";
			const  answerFilePath   = testFolderPath + fileNameHead + `_${target}_${filaNameTail}`;
			deleteFile(changingFilePath);
			deleteFile(backUpFilePath);
			fs.copyFileSync(sourceFilePath, changingFilePath);

			// Test Main
			returns = await callChildProccess(`node ${scriptPath} --english`,
				{inputLines: [
					changingFilePath,
					"file",
					testFolderPath + fileNameHead + "_setting.yaml",
					target,
					"exit",
				]}
			);
			const  source   = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
			const  changing = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
			const  answer   = fs.readFileSync(answerFilePath).toString().substr(cutBOM);
			let  backUp = "dummy";
			if ( ! target.startsWith('Error')) {
				backUp = fs.readFileSync(backUpFilePath).toString().substr(cutBOM);
			}

			// Check
			if ( ! target.startsWith('Error')) {
				if (changing !== answer) {
					console.log(`Error: different between ` +
						`"${fileNameHead}_changing.yaml" and ` +
						`"${fileNameHead}_${target}_after_answer.yaml`);
					throw new Error();
				}
				if (backUp !== source) {
					console.log(`Error: different between ` +
						`"${fileNameHead}_changing.yaml.backup" and ` +
						`"${fileNameHead}.yaml"`);
					throw new Error();
				}
			} else {
				if (returns.stdout !== answer) {
					console.log(`Error: different between "_output.txt" and "${fileNameHead}_${target}_${filaNameTail}"`);
					fs.writeFileSync(testFolderPath + "_output.txt", returns.stdout);
					throw new Error();
				}
			}

			deleteFile(changingFilePath);
			deleteFile(backUpFilePath);
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