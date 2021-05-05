import * as fs from "fs";
import * as path from "path";
import * as main from "./main";
const callMain = main.callMainFromJest;

if (path.basename(process.cwd()) !== "src") {
    // Jest watch mode で２回目の実行をしても カレント フォルダー が引き継がれるため
    process.chdir("src");
}
const scriptPath = `../build/typrm.js`;
const testFolderPath = `test_data` + path.sep;

describe("checks template value", () => {
    test.each([
        ["1_template_1_ok"],
        ["1_template_2_error"],
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

describe("checks file contents", () => {
    test.skip('file_2_tab',()=>{});
    test.skip('file_3_file_name',()=>{});
    test.each([
        [
			"file_1_ok_and_bad", "file/1", "", 0, 0, "",
        ],[
			"file_1_ok_and_bad", "file/1", "replace", 6, 1, "__User__: user2",
        ]
    ])("in %s, %s %s", async (fileNameHead, targetPath, optionOperation, lineNum, settingNum, keyValues) => {
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
});

describe("replaces settings", () => {
    test.skip('2_replace_5_setting_name',()=>{});
    test.each([
        [
            '2_replace_1_ok', 10, 1, 'en-US',
            `key1: value1changed
   __Key2__: value2changed  #コメント
Key3: value3changed  #コメント`,
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
        ],

    ])("in %s(%i) setting %i", async (fileNameHead, lineNum, settingNum, locale, keyValues, isSuccess) => {
        const  sourceFilePath   = testFolderPath + fileNameHead + "_1.yaml";
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFileName = fileNameHead + "_1_changing.yaml";
        const  changingFilePath = changingFolderPath +'/'+ changingFileName;
        fs.rmdirSync('_changing', {recursive: true});
        copyFileSync(sourceFilePath, changingFilePath);

        // Test Main
        await callMain(["replace", changingFileName, String(lineNum), keyValues], {
            folder: changingFolderPath, test: "", locale,
        });
        const  updatedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);

        expect(main.stdout).toMatchSnapshot('stdout');
        expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
        fs.rmdirSync('_changing', {recursive: true});
    });
});

describe("searches keyword tag", () => {
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3: #keyword: ABC, "do it", "a,b"\n',
        ],[
            "not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ],[
            "acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3: #keyword: ABC, "do it", "a,b"\n',
        ],[
            "space",
            ["search", "do it"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3: #keyword: ABC, "do it", "a,b"\n',
        ],[
            "comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3: #keyword: ABC, "do it", "a,b"\n',
        ],[
            "double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:4: #keyword: "double quotation is ""."\n',
        ],[
            "word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", test: "" },
            "",
        ],[
            "word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", test: "" },
            "",
        ],[
            "Windows typrm folder path",
            ["search", "ABC"],
            { folder: `${process.cwd()}\\test_data\\search\\1`, test: "" },
            '${HOME}/Desktop/typrm/src/test_data/search/1/1.yaml:3: #keyword: ABC, "do it", "a,b"\n',
        ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

describe("searches glossary tag", () => {
  test.each([
    [
      "1st",
      ["search", "ABC"],
      { folder: "test_data/search/glossary/1", test: "" },
      "${HOME}/Desktop/typrm/src/test_data/search/glossary/1/1.yaml:7:     ABC: abc\n",
    ],
    [
      "word",
      ["search", "AB"],
      { folder: "test_data/search/glossary/1", test: "" },
      "",
    ],
  ])("%s", async (_caseName, arguments_, options, answer) => {
    await callMain(arguments_, options);
    expect(main.stdout).toBe(answer);
  });
});

describe("test of test", () => {
    test("checks snapshots files are confirmed", () => {
        const  activeSnapshots    = fs.readFileSync('__snapshots__/main.test.ts.snap').toString();
        const  backUpSnapshots    = fs.readFileSync('__snapshots_confirm__/main.test.ts.1.confirmed.snap_').toString();
        const  confirmedSnapshots = fs.readFileSync('__snapshots_confirm__/main.test.ts.2.new_back_up.snap_').toString();
            // 拡張子の末尾を .snap にしない理由は、Jest が使っていない .snap ファイルを自動的に削除しようとするからです

        expect(activeSnapshots).toBe(backUpSnapshots);
        expect(backUpSnapshots).toBe(confirmedSnapshots);
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
