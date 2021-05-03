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
        mkdirSync('test_data/_checking');
        fs.copyFileSync(`test_data/${fileNameHead}_1.yaml`, `test_data/_checking/${fileNameHead}_1.yaml`);

        await callMain(["check"], {
            folder: 'test_data/_checking', test: "", locale: "en-US",
        });

        expect(main.stdout).toMatchSnapshot();
        deleteFileSync(`test_data/_checking/${fileNameHead}_1.yaml`);
        deleteFolderSync('test_data/_checking');
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
        const  sourceFilePath   = testFolderPath + fileNameHead + "_1.yaml";
        const  changingFilePath = testFolderPath + '_checking/document/' + fileNameHead + "_1_changing.yaml";
        mkdirSync('test_data/_checking');
        mkdirSync('test_data/_checking/document');
        deleteFileSync(changingFilePath);
        fs.copyFileSync(sourceFilePath, changingFilePath);

        if (optionOperation === 'replace') {
            await callMain(["replace", changingFilePath, String(lineNum), keyValues], {
                folder: 'test_data', test: "", locale: "en-US",
            });
        }

        // Test Main
        await callMain(["check"], {
            folder: 'test_data/_checking/document', test: "", locale: "en-US",
        });

        expect(main.stdout).toMatchSnapshot('stdout');
        deleteFileSync(changingFilePath);
        deleteFolderSync('test_data/_checking/document');
        deleteFolderSync('test_data/_checking');
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
        const  changingFilePath = testFolderPath + fileNameHead + "_1_changing.yaml";
        deleteFileSync(changingFilePath);
        fs.copyFileSync(sourceFilePath, changingFilePath);

        // Test Main
        await callMain(["replace", changingFilePath, String(lineNum), keyValues], {
            folder: 'test_data', test: "", locale,
        });
        const  updatedFileContents = fs.readFileSync(changingFilePath).toString().substr(cutBOM);

        expect(main.stdout).toMatchSnapshot('stdout');
        expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
        deleteFileSync(changingFilePath);
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

// mkdirSync
function  mkdirSync(path: string) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

// deleteFileSync
function  deleteFileSync(path: string) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

// deleteFolderSync
function  deleteFolderSync(path: string) {
    if (fs.existsSync(path)) {
        fs.rmdirSync(path);
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
