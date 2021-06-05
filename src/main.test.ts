import * as fs from "fs";
import * as path from "path";
import { ppid } from "process";
import * as main from "./main";
import * as chalk from "chalk";
const callMain = main.callMainFromJest;

if (path.basename(process.cwd()) !== "src") {
    // Jest watch mode で２回目の実行をしても カレント フォルダー が引き継がれるため
    process.chdir("src");
}
const scriptPath = `../build/typrm.js`;
const testFolderPath = `test_data` + path.sep;
const matchedColor = chalk.green.bold;
const pathColor = chalk.cyan;
const lineNumColor = chalk.keyword('gray');

describe("checks template value >>", () => {
    test.each([
        ["1_template_1_ok"],
        ["1_template_2_error"],
        ["1_template_3_if"],
        ["refer_1_ok"],
        ["refer_2_error"],
        ["secret_1_error"],
        ["var_not_ref_1_error"],

    ])("%s", async (fileNameHead) => {
        fs.rmdirSync('test_data/_checking', {recursive: true});
        copyFileSync(`test_data/${fileNameHead}_1.yaml`, `test_data/_checking/${fileNameHead}_1.yaml`);

        await callMain(["check"], {
            folder: 'test_data/_checking', test: "", locale: "en-US",
        });

        expect(main.stdout).toMatchSnapshot();
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });

    test("check one file only", async () => {
        await callMain(["check", "1_template_1_ok_1.yaml"], {
            folder: 'test_data', test: "", locale: "en-US",
        });
        expect(main.stdout).toMatchSnapshot();
    });
});

describe("checks file contents >>", () => {
    test.skip('file_2_tab',()=>{});
    test.skip('file_3_file_name',()=>{});
    test.each([
        [
            "OK", "file_1_ok_and_bad", "file/1", "", 0, 0, "",
        ],[
            "NG", "file_1_ok_and_bad", "file/1", "replace", 6, 1, "__User__: user2",
        ],[
            "if", "file_4_if", "file/1", "", 0, 0, "",
        ],[
            "any_lines", "file_8_others", "file/1", "", 0, 0, "",
        ]
    ])("%s in %s, %s %s", async (caseName, fileNameHead, targetPath, optionOperation, lineNum, settingNum, keyValues) => {
        const  sourceFilePath   = 'test_data/' + fileNameHead + "_1.yaml";
        const  changingFilePath = 'test_data/_checking/document/' + fileNameHead + "_1_changing.yaml";
        const  changingFileRelativePath = '_checking/document/' + fileNameHead + "_1_changing.yaml";
        fs.rmdirSync('test_data/_checking', {recursive: true});
        copyFileSync(sourceFilePath, changingFilePath);

        if (optionOperation === 'replace') {
            await callMain(["replace", changingFileRelativePath, String(lineNum), keyValues], {
                folder: 'test_data', test: "", locale: "en-US",
            });
        }

        // Test Main
        await callMain(["check"], {
            folder: 'test_data/_checking/document', test: "", locale: "en-US",
        });

        expect(main.stdout).toMatchSnapshot('stdout');
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });

    test.each([
        [
            "all", ["check"],
        ],[
            "file in 1st folder", ["check", "file_1.yaml"],
        ],[
            "file in 2nd folder", ["check", "file_2.yaml"],
        ],[
            "full path", ["check", getFullPath("test_data/_checking/2/file_2.yaml", process.cwd())],
        ]
    ])("Multi folder >> %s", async (caseName, parameters) => {
        fs.rmdirSync('test_data/_checking', {recursive: true});
        copyFileSync(`test_data/file_0_one_error_1.yaml`, `test_data/_checking/1/file_1.yaml`);
        copyFileSync(`test_data/file_0_one_error_1.yaml`, `test_data/_checking/2/file_2.yaml`);

        // Test Main
        await callMain(parameters, {
            folder: 'test_data/_checking/1, test_data/_checking/2', test: "", locale: "en-US",
        });

        expect(main.stdout).toMatchSnapshot('stdout');
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });
});

describe("replaces settings >>", () => {
    test.skip('2_replace_5_setting_name',()=>{});
    test.each([
        [
            '2_replace_1_ok', 10, 1, 'en-US',
            `key1: value1changed
   __Key2__: value2changed  #ここは置き換え後に入らないコメント
Key3: value3changed  #ここは置き換え後に入らないコメント`,
            true,
        ],[
            '2_replace_1_ok', 29, 2, 'en-US',
            `key1: value1changed`,
            true,
        ],[
            '2_replace_2_error', 4, 1, 'en-US',
            `Key3: value3changed`,
            false,
        ],[
            '2_replace_3_English', 10, 1, 'en-US',
            `Key3: value3changed`,
            true,
        ],[
            '2_replace_4_Japanese', 10, 1, 'ja-JP',
            `Key3: value3changed`,
            false,
/*        ],[
            '2_replace_6_if', 9, 1, 'en-US',
            `__Setting1__: replaced`,
            false,
        ],[
            '2_replace_6_if', 9, 1, 'en-US',
            `fruit: melon
            __Setting1__: replaced`,
            false,
*/        ],

    ])("in %s(%i) setting %i", async (fileNameHead, lineNum, settingNum, locale, keyValues, isSuccess) => {
//if (fileNameHead !== '2_replace_6_if'  ||  ! keyValues.includes('fruit')) {return;}
        const  sourceFilePath     = testFolderPath + fileNameHead + "_1.yaml";
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFileName = fileNameHead + "_1_changing.yaml";
        const  changingFilePath = changingFolderPath +'/'+ changingFileName;
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        copyFileSync(sourceFilePath, changingFilePath);

        // Test Main
        await callMain(["replace", changingFileName, String(lineNum), keyValues], {
            folder: changingFolderPath, test: "", locale,
        });
        const  updatedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);

        expect(main.stdout).toMatchSnapshot('stdout');
        expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
//expect('test code').toBe('deleted skip code.');
    });

    describe("Multi folder >>", () => {
        const  fileNameHead = '2_replace_1_ok';
        const  sourceFilePath = testFolderPath + fileNameHead + "_1.yaml";
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFile1Path  = changingFolderPath +'/1/'+ fileNameHead + "_1_changing.yaml";
        const  changingFile2Path  = changingFolderPath +'/2/'+ fileNameHead + "_2_changing.yaml";
        const  changingFile1APath = changingFolderPath +'/1/'+ fileNameHead + "_same_name.yaml";
        const  changingFile2APath = changingFolderPath +'/2/'+ fileNameHead + "_same_name.yaml";
        const  lineNum = 29;
        const  keyValues = `key1: value1changed`;
        test.each([
            ["replace 1",        fileNameHead + "_1_changing.yaml",  changingFile1Path],
            ["replace 2",        fileNameHead + "_2_changing.yaml",  changingFile2Path],
            ["same name error",  fileNameHead + "_same_name.yaml",   undefined],
        ])("%s", async (caseName, changingFileName, changingFilePath) => {
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
            copyFileSync(sourceFilePath, changingFile1Path);
            copyFileSync(sourceFilePath, changingFile2Path);
            copyFileSync(sourceFilePath, changingFile1APath);
            copyFileSync(sourceFilePath, changingFile2APath);

            // Test Main
            await callMain(["replace", changingFileName, String(lineNum), keyValues], {
                folder: `${changingFolderPath}/1, ${changingFolderPath}/2`, test: "", locale: "en-US"
            });

            // Check
            if (caseName !== "same name error") {  // Case of relace 1, replace 2
                if (!changingFilePath) { throw new Error('unexpected');} 
                const  fileContentsBefore = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
                const  fileContentsAfter  = fs.readFileSync(changingFilePath).toString().substr(cutBOM);

                expect(fileContentsAfter).not.toBe(fileContentsBefore);
            } else {  // Case of same name error
                const  fileContentsBefore = fs.readFileSync(sourceFilePath).toString().substr(cutBOM);
                const  fileContents1 = fs.readFileSync(changingFile1APath).toString().substr(cutBOM);
                const  fileContents2 = fs.readFileSync(changingFile2APath).toString().substr(cutBOM);

                expect(fileContents1).toBe(fileContentsBefore);
                expect(fileContents2).toBe(fileContentsBefore);
                expect(main.stdout).toMatchSnapshot('stdout');
            }
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        });
    });

    test("revert >>", async () => {
        const  fileNameHead = "2_replace_1_ok";
        const  sourceFilePath     = testFolderPath + fileNameHead + "_1.yaml";
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFileName = fileNameHead + "_1_changing.yaml";
        const  changingFilePath = changingFolderPath +'/'+ changingFileName;
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        copyFileSync(sourceFilePath, changingFilePath);
        await callMain(["replace", changingFileName, '29', 'key1: value1changed'], {
            folder: changingFolderPath, test: "", locale: "en-US"
        });
        const  sourceFileContents  = fs.readFileSync(sourceFilePath  ).toString().substr(cutBOM);
        const  updatedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);
        expect(updatedFileContents).not.toBe(sourceFileContents);

        // Test Main
        await callMain(["revert", changingFileName, '29'], {
            folder: changingFolderPath, test: "", locale: "en-US"
        });
        const  revertedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);

        expect(revertedFileContents).toBe(sourceFileContents);
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
    });
});

describe("searches keyword tag >>", () => {
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ],[
            "not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ],[
            "acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`
        ],[
            "ommit command name (1)",
            ["ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`
        ],[
            "ommit command name (2)",
            ["do", "it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do it')}", "a,b"\n`,
        ],[
            "space",
            ["search", "do it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do it')}", "a,b"\n`,
        ],[
            "comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` #keyword: "${matchedColor('A,B')}"\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "do it", "${matchedColor('a,b')}"\n`,
        ],[
            "double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` #keyword: "${matchedColor('double quotation is "".')}"\n`,
        ],[
            "ignore case",
            ["search", "DO It"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do it')}", "a,b"\n`,
        ],[
            "word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ],[
            "word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` #keyword: "${matchedColor('do')}uble quotation is ""."\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do')} it", "a,b"\n`,
        ],[
            "words order score",
            ["search", "aaa bbb"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':2:') + ` #keyword: ${matchedColor('bbb')} ${matchedColor('aaa')} xxx\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':4:') + ` #keyword: ${matchedColor('bbb')} ${matchedColor('aaa')}\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':1:') + ` #keyword: ${matchedColor('aaa bbb')} xxx\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('aaa bbb')}\n`,
        ],[
            "words order score (2)",  // It does not show small number of matched words
            ["search", "user", "interface"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_idiom_and_word_score
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':10:') + `     #keyword: ${matchedColor('user interface')}\n`,
        ],[
            "1 word search score",  // keyword: 1 word： 1 word match > 1 word match in 2 words > 1 word partial match.  '>' means grater than.
            ["search", "second"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_1_word_search_score
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':14:') + `     #keyword: ${matchedColor('second')}ary\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':15:') + `     #keyword: ${matchedColor('second')} screen\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':13:') + `     #keyword: ${matchedColor('second')}\n`,
        ],[
            "word match is better than same case",  // word match and not same case > same case and many partial match.  '>' means grater than.
            ["search", "ipad"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_word_match_is_better_than_same_case
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':18:') + `     #keyword: ${matchedColor('ipad')} pro, ${matchedColor('ipad')} nano\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':17:') + `     #keyword: ${matchedColor('iPad')}\n`,
        ],[
            "target word count",
            ["search", "new task"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_target_word_count
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':21:') + `     #keyword: ${matchedColor('new task')}s only\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':20:') + `     #keyword: ${matchedColor('new task')}s\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':22:') + `     #keyword: ${matchedColor('new task')}s\n`,
        ],[
            "compound word",
            ["search", "frame set"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':6:') + ` #keyword: ${matchedColor('frame')}${matchedColor('set')}\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':5:') + ` #keyword: ${matchedColor('frame set')}\n`,
        ],[
            "output order (1)",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` #keyword: "${matchedColor('A,B')}"\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "do it", "${matchedColor('a,b')}"\n`,
        ],[
            "output order (2)",
            ["search", "A,B"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "do it", "${matchedColor('a,b')}"\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` #keyword: "${matchedColor('A,B')}"\n`,
        ],[
            "Multi folder",  // and test of long path length > short path length
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n` +
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n`,
        ],[
            "Windows typrm folder path",
            ["search", "ABC"],
            { folder: `${process.cwd()}\\test_data\\search\\1`, test: "" },
            pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ],
    ])("%s", async (caseName, arguments_, options, answer) => {
        const  isWindowsEnvironment = (path.sep === '\\');
        const  isWindowsCase = (caseName.indexOf('Windows') !== notFound);
        if (!isWindowsEnvironment && isWindowsCase) {
            return;
        }

        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

describe("searches glossary tag >>", () => {
  test.each([
    [
        "1st",
        ["search", "ABC"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n`,
    ],[
        "ignore case",
        ["search", "abc"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n`,
    ],[
        "word",
        ["search", "AB"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('AB')}C: abc\n`,
    ],[
        "nested indent",
        ["search", "ABC"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}D: abcd\n` +
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':4:') + `     ${matchedColor('ABC')}: abc\n`,
    ],[
        "output order (1)",
        ["search", "de"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + `     ${matchedColor('DE')}: de\n` +
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + `     ${matchedColor('de')}: de\n`,
    ],[
        "output order (2)",
        ["search", "DE"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + `     ${matchedColor('de')}: de\n` +
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + `     ${matchedColor('DE')}: de\n`,
    ],[
        "Multi folder",
        ["search", "ABC"],
        { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n` +
        pathColor('${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n`,
    ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

describe("test of test >>", () => {
    test("checks snapshots files are confirmed", () => {
        const  activeSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap').toString();
        const  backUpSnapshots = fs.readFileSync('__snapshots_confirm__/main.test.ts.1.confirmed.snap_').toString();
            // 拡張子の末尾を .snap にしない理由は、Jest が使っていない .snap ファイルを自動的に削除しようとするからです

        expect(activeSnapshots).toBe(backUpSnapshots);
    });
});

afterAll(()=>{
    deleteFileSync('test_data/_output.txt')
})

// copyFileSync
// #keyword: copyFileSync
// This also makes the copy target folder.
function  copyFileSync(sourceFilePath: string, destinationFilePath: string) {
	const  destinationFolderPath = path.dirname(destinationFilePath);
	fs.mkdirSync(destinationFolderPath, {recursive: true});

	fs.copyFileSync(sourceFilePath, destinationFilePath);
}

// deleteFileSync
// #keyword: deleteFileSync, unlinkSync
// This does not occurr any errors, even if there is not the file at the specified path.
function  deleteFileSync(path: string) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

// getFullPath
function getFullPath(relativePath: string, basePath: string): string {
    var fullPath = "";
    if (relativePath.substr(0, 1) === "/") {
        fullPath = relativePath;
    } else {
        fullPath = path.join(basePath, relativePath);
    }
    return fullPath;
}
  
// printDifferentPaths
function printDifferentPaths(path1: string, path2: string) {
    console.log(`Error: different between the following files`);
    console.log(`  Path1: ${testFolderFullPath + path1}`);
    console.log(`  Path2: ${testFolderFullPath + path2}`);
}

const testFolderFullPath = getFullPath(`../src/${testFolderPath}`, __dirname);

export {};
declare global {
    // for TypeScript
    namespace jest {
        interface Matchers<R> {
            because: (errorMessage: string) => CustomMatcherResult;
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

const cutBOM = 1;
const notFound = -1;
