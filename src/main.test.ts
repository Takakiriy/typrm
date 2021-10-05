import * as fs from "fs";
import * as path from "path";
import * as main from "./main";
import * as chalk from "chalk";
import * as lib from "./lib";
import { pp } from "./lib";
const snapshots = require(`${__dirname}/../src/__snapshots__/main.test.ts.snap`);
const callMain = main.callMainFromJest;
process.env['typrm_aaa'] = 'aaa';
process.chdir(__dirname);

const testFolderPath = `test_data` + path.sep;
const matchedColor = chalk.green.bold;
const refColor = chalk.yellow;
const searchColor = chalk.yellow;
const valueColor = chalk.yellow;
const pathColor = chalk.cyan;
const lineNumColor = chalk.keyword('gray');
process.env.TYPRM_TEST_ENV = 'testEnv';
process.env.TYPRM_TEST_PATH = 'C:\\Test';
if (process.env.windir) {
    var  testingOS = 'Windows';
} else {
    var  testingOS = 'Linux';
}
process.env.TYPRM_LINE_NUM_GETTER = `
    - #
        regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?\$
        type: text
        filePathRegularExpressionIndex: 1
        keywordRegularExpressionIndex: 7
        csvOptionRegularExpressionIndex: 3
        targetMatchIdRegularExpressionIndex: 5
        address: "\${file}:\${lineNum}"
`;
if (testingOS === 'Windows') {
    process.env.TYPRM_VERB = `
        - #
            label: 7.Test Echo
            number: 7
            regularExpression: ^.*\\.md(#.*)?\$
            command: 'echo {ref: \${ref}, windowsRef: \${windowsRef}, file: \${file}, windowsFile: \${windowsFile}, fragment: \${fragment}}'
        - #
            label: 1.View
            number: 1
            regularExpression: ^.*\\.(svg|svgz)(#.*)?\$
            command: 'msedge "file://\${file}"'
    `;
} else {
    process.env.TYPRM_VERB = `
        - #
            label: 7.Test Echo
            number: 7
            regularExpression: ^.*\\.md(#.*)?\$
            command: 'echo  "{ref: \${ref}, windowsRef: \${windowsRef}, file: \${file}, windowsFile: \${windowsFile}, fragment: \${fragment}}"'
        - #
            label: 1.View
            number: 1
            regularExpression: ^.*\\.(svg|svgz)(#.*)?\$
            command: '"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome" "file://\${file}"'
    `;
}
beforeAll(()=>{
    fs.mkdirSync('empty_folder', {recursive: true});
});

describe("checks template value >>", () => {
    test.each([
        ["1_template_1_ok"],
        ["1_template_2_error"],
        ["1_template_3_if"],
        ["refer_1_ok"],
        ["refer_2_error"],
        ["secret_1_error"],
        ["var_not_ref_1_error"],
        ["template_if_1_error"],

    ])("%s", async (fileNameHead) => {
        const  sourceFileContents = lib.getSnapshot(`checks template value >> ${fileNameHead} 1: sourceFileContents 1`);
        fs.rmdirSync('test_data/_checking', {recursive: true});
        writeFileSync(`test_data/_checking/${fileNameHead}_1.yaml`, sourceFileContents);
        process.chdir('empty_folder');

        await callMain(["check"], {
            folder: '../test_data/_checking', test: "", locale: "en-US",
        });

        process.chdir('..');
        expect(main.stdout).toMatchSnapshot();
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });

    test("check one file only", async () => {
        const  sourceFileContents = lib.getSnapshot(`checks template value >> 1_template_1_ok 1: sourceFileContents 1`);
        fs.rmdirSync('test_data/_checking', {recursive: true});
        writeFileSync(`test_data/_checking/1_template_1_ok_1.yaml`, sourceFileContents);
        process.chdir('empty_folder');

        await callMain(["check", "_checking/1_template_1_ok_1.yaml"], {
            folder: '../test_data', test: "", locale: "en-US",
        });
        process.chdir('..');
        expect(main.stdout).toMatchSnapshot();
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });

    test("check files in multi folder", async () => {
        const  sourceFileContents = lib.getSnapshot(`checks template value >> one_error 1: sourceFileContents 1`);
        fs.rmdirSync('test_data/_checking', {recursive: true});
        writeFileSync(`test_data/_checking/1/one_error_1.yaml`, sourceFileContents);
        writeFileSync(`test_data/_checking/2/one_error_1.yaml`, sourceFileContents);
        process.chdir('empty_folder');

        await callMain(["check"], {
            folder: '../test_data/_checking/1, ../test_data/_checking/2/*.yaml', test: "", locale: "en-US",
        });
        process.chdir('..');
        expect(main.stdout).toMatchSnapshot();
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });

    test("verbose", async () => {
        const  sourceFileContents = lib.getSnapshot(`checks template value >> verbose 1: sourceFileContents 1`);
        fs.rmdirSync('test_data/_checking', {recursive: true});
        writeFileSync(`test_data/_checking/check_verbose.yaml`, sourceFileContents);
        process.chdir('empty_folder');

        await callMain(["check", "_checking/check_verbose.yaml"], {
            folder: '../test_data', test: "", locale: "en-US", verbose: "",
        });
        process.chdir('..');
        expect(lib.cutLeftOf(main.stdout, 'Verbose: typrm command: check')).toMatchSnapshot();
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });
});

describe("checks file contents >>", () => {
    test.each([
        [
            "OK", "file_1_ok_and_bad", "file/1", "", 0, 0, "",
        ],[
            "NG", "file_1_ok_and_bad", "file/1", "replace", 6, 1, "__User__: user2",
        ],[
            "file name", "file_3_file_name", "", "", 1, 1, "",
        ],[
            "if", "file_4_if", "file/1", "", 0, 0, "",
        ],[
            "any_lines", "file_8_others", "file/1", "", 0, 0, "",
        ]
    ])("%s in %s, %s %s", async (caseName, fileNameHead, targetPath, optionOperation, lineNum, settingNum, keyValues) => {
        const  sourceFileContents = lib.getSnapshot(`checks file contents >> ${fileNameHead} : sourceFileContents 1`);
        const  changingFilePath = 'test_data/_checking/document/' + fileNameHead + "_1_changing.yaml";
        const  changingFileRelativePath = '_checking/document/' + fileNameHead + "_1_changing.yaml";
        fs.rmdirSync('test_data/_checking', {recursive: true});
        writeFileSync(changingFilePath, sourceFileContents);
        process.chdir('empty_folder');

        if (optionOperation === 'replace') {
            await callMain(["replace", changingFileRelativePath, String(lineNum), keyValues], {
                folder: '../test_data', test: "", locale: "en-US",
            });
        }

        // Test Main
        await callMain(["check"], {
            folder: '../test_data/_checking/document', test: "", locale: "en-US",
        });

        process.chdir('..');
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
        const  sourceFileContents = lib.getSnapshot(`checks file contents >> file_0_one_error : sourceFileContents 1`);
        fs.rmdirSync('test_data/_checking', {recursive: true});
        writeFileSync(`test_data/_checking/1/file_1.yaml`, sourceFileContents);
        writeFileSync(`test_data/_checking/2/file_2.yaml`, sourceFileContents);
        process.chdir('empty_folder');

        // Test Main
        await callMain(parameters, {
            folder: '../test_data/_checking/1, ../test_data/_checking/2', test: "", locale: "en-US",
        });

        process.chdir('..');
        expect(main.stdout).toMatchSnapshot('stdout');
        fs.rmdirSync('test_data/_checking', {recursive: true});
    });
});

describe("replaces settings >>", () => {
    test.each([
        [
            '2_replace_1_ok', ' setting 1', '10', 'en-US',
            `key1: value1changed
   __Key2__: value2changed  #ここは置き換え後に入らないコメント
Key3: value3changed  #ここは置き換え後に入らないコメント`,
        ],[
            '2_replace_1_ok', ' setting 2', '29', 'en-US',
            `key1: value1changed`,
        ],[
            '2_replace_1_ok', ' setting 2 lineNum', '26', 'en-US',  // lineNum on settings
            `key1: value1changed`,
        ],[
            '2_replace_1A_end_of_template', '', '2', 'en-US',
            `key1: value1changed`,
        ],[
            '2_replace_2_error', '', '4', 'en-US',
            `Key3: value3changed`,
        ],[
            '2_replace_3_English', '', '10', 'en-US',
            `Key3: value3changed`,
        ],[
            '2_replace_4_Japanese', '', '10', 'ja-JP',
            `Key3: value3changed`,
        ],[
            '2_replace_5_setting_name', ' setting 1', '1st', 'ja-JP',
            `key1: value1changed`,
        ],[
            '2_replace_5_setting_name', ' setting 2', '2番目', 'ja-JP',
            `key1: value1changed`,
        ],[
            '2_replace_5_setting_name', ' setting 3', '3rd', 'en-US',
            `key1: value1changed`,
        ],[
            '2_replace_5_setting_name', ' setting not found', 'not found', 'en-US',
            `key1: value1changed`,
        ],[
            '2_replace_6_if', ' in if block', '9', 'en-US',
            `__Setting1__: replaced`,
        ],[
            '2_replace_6_if', ' in if variable', '9', 'en-US',
            `fruit: melon`,
        ],[
            '2_replace_6_if', ' both', '9', 'en-US',
            `fruit: melon
            __Setting1__: replaced`,
        ],[
            '2_replace_7_undefined_if', '', '3', 'en-US',
            `fruit: apple`,
        ],[
            '2_replace_8_one_setting', ' without line num', undefined, 'en-US',
            `key1: changed1`,
        ],[
            '2_replace_8_one_setting', ' line num 1', '1', 'en-US',
            `key1: changed1`,
        ],[
            '2_replace_9_template_if_1_OK', '', '1', 'en-US',
            `__Stage__: develop`,
        ],[
            '2_replace_9_template_if_2_NG', '', '1', 'en-US',
            `__Stage__: develop`,
        ],[
            '2_replace_9_template_if_3_not_set', '', '1', 'en-US',
            `__Stage__: develop`,
        ],[
            '2_replace_9_template_if_4_operators', '', '1', 'en-US',
            `__Stage__: develop`,
        ],[
            '2_replace_10_double_check', ' 1_OK', '1', 'en-US',
            `__Full__: fo/fi
            __Folder__: fo
            __File__: fi`,
        ],[
            '2_replace_10_double_check', ' 2_BadPart', '1', 'en-US',
            `__Full__: fo/fi
            __File__: fi`,
        ],

    ])("in %s%s", async (fileNameHead, _subCaseName, lineNum, locale, keyValues) => {
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFileName = fileNameHead + "_1_changing.yaml";
        const  changingFilePath = changingFolderPath +'/'+ changingFileName;
        const  sourceFileContents = lib.getSnapshot(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        writeFileSync(changingFilePath, sourceFileContents);

        // Test Main
        if (lineNum) {
            await callMain(["replace", changingFileName, lineNum, keyValues], {
                folder: changingFolderPath, test: "", locale,
            });
        } else {
            await callMain(["replace", changingFileName, keyValues], {
                folder: changingFolderPath, test: "", locale,
            });
        }
        const  updatedFileContents = fs.readFileSync(changingFilePath).toString();

        expect(main.stdout).toMatchSnapshot('stdout');
        expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
    });

    test.each([
        [
            '2_replace_1_ok', ' one setting', undefined, 'en-US',
            `key1: changed1`,
            'Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.',
        ],

    ])("Exception case >> in %s%s", async (fileNameHead, _subCaseName, lineNum, locale, keyValues, expectedErrorMessage) => {
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFileName = fileNameHead + "_1_changing.yaml";
        const  changingFilePath = changingFolderPath +'/'+ changingFileName;
        const  sourceFileContents = lib.getSnapshot(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
        var    errorMessage = '';
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        writeFileSync(changingFilePath, sourceFileContents);

        // Test Main
        if (lineNum) {
            try {
                await callMain(["replace", changingFileName, String(lineNum), keyValues], {
                    folder: changingFolderPath, test: "", locale,
                });
            } catch (e: any) {
                errorMessage = e.message;
            }
        } else {
            try {
                await callMain(["replace", changingFileName, keyValues], {
                    folder: changingFolderPath, test: "", locale,
                });
            } catch (e: any) {
                errorMessage = e.message;
            }
        }

        expect(errorMessage).toBe(expectedErrorMessage);
    });

    test.each([
        [
            '2_replace_1_ok', ' without folder option', undefined, 'en-US',
            `key1: changed1`,
            'Settings cannot be identified, because the file has 2 or more settings. Add line number parameter.',
        ],

    ])("Exception case >> in %s%s", async (fileNameHead, _subCaseName, lineNum, locale, keyValues, expectedErrorMessage) => {
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFileName = fileNameHead + "_1_changing.yaml";
        const  changingFilePath = changingFolderPath +'/'+ changingFileName;
        const  sourceFileContents = lib.getSnapshot(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
        var    errorMessage = '';
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        writeFileSync(changingFilePath, sourceFileContents);

        // Test Main
        try {
            await callMain(["replace", changingFilePath, keyValues], {
                folder: "", test: "", locale,
            });
        } catch (e: any) {
            errorMessage = e.message;
        }

        expect(errorMessage).toBe(expectedErrorMessage);
    });

    describe("Multi folder >>", () => {
        const  fileNameHead = '2_replace_1_ok';
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
            ["full path",        process.cwd() +"/"+ changingFile1Path,  changingFile1Path],
        ])("%s", async (caseName, changingFileName, changingFilePath) => {
            const  sourceFileContents = lib.getSnapshot(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
            writeFileSync(changingFile1Path,  sourceFileContents);
            writeFileSync(changingFile2Path,  sourceFileContents);
            writeFileSync(changingFile1APath, sourceFileContents);
            writeFileSync(changingFile2APath, sourceFileContents);

            // Test Main
            await callMain(["replace", changingFileName, String(lineNum), keyValues], {
                folder: `${changingFolderPath}/1, ${changingFolderPath}/2`, test: "", locale: "en-US"
            });

            // Check
            if (caseName !== "same name error") {  // Case of relace 1, replace 2
                if (!changingFilePath) { throw new Error('unexpected');} 
                const  fileContentsBefore = sourceFileContents;
                const  fileContentsAfter  = fs.readFileSync(changingFilePath).toString();

                expect(fileContentsAfter).not.toBe(fileContentsBefore);
            } else {  // Case of same name error
                const  fileContentsBefore = sourceFileContents;
                const  fileContents1 = fs.readFileSync(changingFile1APath).toString();
                const  fileContents2 = fs.readFileSync(changingFile2APath).toString();

                expect(fileContents1).toBe(fileContentsBefore);
                expect(fileContents2).toBe(fileContentsBefore);
                expect(main.stdout).toMatchSnapshot('stdout');
            }
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        });
    });

    describe("revert", () => {
        test.each([
            [
                '2_replace_1_ok', ' setting 2', 29, 'en-US',
                `key1: value1changed`,
            ],[
                '2_replace_6_if', ' in if block', 9, 'en-US',
                `__Setting1__: replaced`,
            ],[
                '2_replace_6_if', ' in if variable', 9, 'en-US',
                `fruit: melon`,
            ],[
                '2_replace_6_if', ' both', 9, 'en-US',
                `fruit: melon
                __Setting1__: replaced`,
            ],[
                '2_replace_6_if', ' without line num', undefined, 'en-US',
                `__Setting1__: replaced`,
            ],[
                '2_replace_6_if', ' setting name', 'set1', 'en-US',
                `__Setting1__: replaced`,
            ],[
                '2_replace_10_double_check', ' 1_OK', undefined, 'en-US',
                `__Full__: fo/fi
                __Folder__: fo
                __File__: fi`,
            ],

        ])("%s%s >>", async (fileNameHead, _subCaseName, lineNum, locale, keyValues) => {
            const  changingFolderPath = testFolderPath + '_changing';
            const  changingFileName = fileNameHead + "_1_changing.yaml";
            const  changingFilePath = changingFolderPath +'/'+ changingFileName;
            const  sourceFileContents = lib.getSnapshot(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
            writeFileSync(changingFilePath, sourceFileContents);
            if (lineNum) {
                await callMain(["replace", changingFileName, lineNum.toString(), keyValues], {
                    folder: changingFolderPath, test: "", locale
                });
            } else {
                await callMain(["replace", changingFileName, keyValues], {
                    folder: changingFolderPath, test: "", locale
                });
            }
            const  updatedFileContents = fs.readFileSync(changingFilePath).toString();
            expect(updatedFileContents).not.toBe(sourceFileContents);

            // Test Main
            if (lineNum) {
                await callMain(["revert", changingFileName, lineNum.toString()], {
                    folder: changingFolderPath, test: "", locale
                });
            } else {
                await callMain(["revert", changingFileName], {
                    folder: changingFolderPath, test: "", locale
                });
            }
            const  revertedFileContents = fs.readFileSync(changingFilePath).toString();

            expect(revertedFileContents).toBe(sourceFileContents);
            expect(main.stdout).toMatchSnapshot('stdout');
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        });
    });

    describe("replace to tag >>", () => {
        test.each([
            ['1_OK', ''],
            ['2_FileParameter', 'FileParameter'],
            ['3_SimpleOneLoop', ''],
            ['4_IfBlock_OK', ''],
            ['4E_IfBlock_Error', 'ErrorCase'],
            ['5_Conflict_Error', 'ErrorCase'],
            ['E1_BugCase_IfBlock_DoubleCheck_Error', 'ErrorCase'],
        ])("%s", async (caseName, options) => {
            const  changingFolderPath = testFolderPath + '_changing';
            const  changingFileName = caseName + "_1_changing.yaml";
            const  changingFilePath = changingFolderPath +'/'+ changingFileName;
            var  sourceFileContents = lib.getSnapshot(`replaces settings >> replace to tag >> ${caseName}: sourceFileContents 1`);
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
            writeFileSync(changingFilePath, sourceFileContents);

            // Test Main >> replace
            if (options.includes('FileParameter')) {
                var  parameters = ["replace", changingFilePath];
            } else {
                var  parameters = ["replace"];
            }
            await callMain(parameters, {
                folder: changingFolderPath, test: "", locale: "en-US"
            });
            const  replacedFileContents = fs.readFileSync(changingFilePath).toString();

            expect(main.stdout).toMatchSnapshot('stdout');
            if ( ! options.includes('ErrorCase')) {
                expect(replacedFileContents).toMatchSnapshot('replacedFileContents');

                // Test Main >> revert
                if (caseName.includes('FileParameter')) {
                    var  parameters = ["revert", changingFilePath];
                } else {
                    var  parameters = ["revert"];
                }
                await callMain(parameters, {
                    folder: changingFolderPath, test: "", locale: "en-US"
                });
                const  revertedFileContents = fs.readFileSync(changingFilePath).toString();

                expect(revertedFileContents).toMatchSnapshot('revertedFileContents');
            } else {  // error case
                const  sourceFileContents2 = fs.readFileSync(changingFilePath).toString();

                expect(sourceFileContents2).toBe(sourceFileContents);
            }
            fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        });
    });
    test("replace to tag >> ToTestTag", async () => {
        const  caseName = 'ToTestTag';
        const  changingFolderPath = testFolderPath + '_changing';
        const  changingFileName = caseName + "_1_changing.yaml";
        const  changingFilePath = changingFolderPath +'/'+ changingFileName;
        var  sourceFileContents = lib.getSnapshot(`replaces settings >> replace to tag >> ${caseName}: sourceFileContents 1`);
        fs.rmdirSync(testFolderPath + '_changing', {recursive: true});
        writeFileSync(changingFilePath, sourceFileContents);

        await callMain(["replace"], {
            folder: changingFolderPath, test: "", locale: "en-US"
        });
        expect(main.stdout).toMatchSnapshot('stdout');
    });
});

describe("searches keyword tag >>", () => {
    test.skip('sharp (best)',()=>{});
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ],[
            "not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ],[
            "acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`
        ],[
            "ommit command name (1)",
            ["ABC"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`
        ],[
            "ommit command name (2)",
            ["do", "it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ],[
            "space",
            ["search", "do it"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ],[
            "comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` #keyword: "${matchedColor('A,B')}"\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "do it", "${matchedColor('a,b')}"\n`,
        ],[
            "double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` #keyword: "${matchedColor('double')} ${matchedColor('quotation')} ${matchedColor('is')} ${matchedColor('"".')}"\n`,
        ],[
            "sharp",
            ["search", 'space sharp is #. "parcent 20" is "%20".'],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':94:') + `     #keyword: "${matchedColor('space')} ${matchedColor('sharp')} ${matchedColor('is')}${matchedColor('is')} ${matchedColor('#.')} ${matchedColor('""parcent')}${matchedColor(' 20"')}" i${matchedColor('s ""%20"')}"."\n`,
            // This is little wrong answer
        ],[
            "ignore case",
            ["search", "DO It"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ],[
            "word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ],[
            "word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` #keyword: "${matchedColor('do')}uble quotation is ""."\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do')} it", "a,b"\n`,
        ],[
            "trim",
            ["search", " do "],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` #keyword: "${matchedColor('do')}uble quotation is ""."\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "${matchedColor('do')} it", "a,b"\n`,
        ],[
            "ignored keyword",
            ["search", "#search: #keyword: AB"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ],[
            "ignored colon before keyword tag",
            ["search", "AB: #keyword:"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ],[
            "CSV ignored colon before keyword tag",
            ["search", "A,B: #keyword:"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "do it", "${matchedColor('a,b')}"\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` #keyword: "${matchedColor('A,B')}"\n`,
        ],[
            "words order score",
            ["search", "aaa bbb"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':2:') + ` #keyword: ${matchedColor('bbb')} ${matchedColor('aaa')} xxx\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':1:') + ` #keyword: ${matchedColor('aaa')} ${matchedColor('bbb')} xxx\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':4:') + ` #keyword: ${matchedColor('bbb')} ${matchedColor('aaa')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('aaa')} ${matchedColor('bbb')}\n`,
        ],[
            "words order score (2)",  // It does not show small number of matched words
            ["search", "user", "interface"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_idiom_and_word_score
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':10:') + `     #keyword: ${matchedColor('user')} ${matchedColor('interface')}\n`,
        ],[
            "1 word search score",  // keyword: 1 word： 1 word match > 1 word match in 2 words > 1 word partial match.  '>' means grater than.
            ["search", "second"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_1_word_search_score
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':15:') + `     #keyword: ${matchedColor('second')} screen\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':14:') + `     #keyword: ${matchedColor('second')}ary\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':13:') + `     #keyword: ${matchedColor('second')}\n`,
        ],[
            "word match is better than same case",  // word match and not same case > same case and many partial match.  '>' means grater than.
            ["search", "ipad"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_word_match_is_better_than_same_case
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':18:') + `     #keyword: ${matchedColor('ipad')} pro, ${matchedColor('ipad')} nano\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':17:') + `     #keyword: ${matchedColor('iPad')}\n`,
        ],[
            "target word count",
            ["search", "new task"],
            { folder: "test_data/search/2", test: "" },  // section: test_of_target_word_count
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':21:') + `     #keyword: ${matchedColor('new')} ${matchedColor('task')}s only\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':20:') + `     #keyword: ${matchedColor('new')} ${matchedColor('task')}s\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':22:') + `     #keyword: ${matchedColor('new')} ${matchedColor('task')}s\n`,
        ],[
            "target word count 3",
            ["search", "world wide web"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':67:') + `     #keyword: ${matchedColor('web')} ${matchedColor('World')} ${matchedColor('wide')}, ${matchedColor('World')} ${matchedColor('wide')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':65:') + `     #keyword: ${matchedColor('World')} ${matchedColor('wide')} ${matchedColor('web')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':66:') + `     #keyword: ${matchedColor('World')} ${matchedColor('wide')} ${matchedColor('web')}\n`,
        ],[
            "compound word",
            ["search", "frame set"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':6:') + ` #keyword: ${matchedColor('frame')}${matchedColor('set')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':5:') + ` #keyword: ${matchedColor('frame')} ${matchedColor('set')}\n`,
        ],[
            "bug case (1)",
            ["search", "go lang"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':81:') + `     #keyword: ${matchedColor('Go')}_${matchedColor('lang')}uage.yaml, ${matchedColor('go')}\n`,
        ],[
            "output order (1)",
            ["search", "a,b"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` #keyword: "${matchedColor('A,B')}"\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "do it", "${matchedColor('a,b')}"\n`,
        ],[
            "output order (2)",
            ["search", "A,B"],
            { folder: "test_data/search/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ABC, "do it", "${matchedColor('a,b')}"\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` #keyword: "${matchedColor('A,B')}"\n`,
        ],[
            "output order (3)",  // word count > word length > different case
            ["search", "grape"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':40:') + `     #keyword: ${matchedColor('GRAPE')}fruit juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':42:') + `     #keyword: ${matchedColor('GRAPE')}fruit juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':30:') + `     #keyword: ${matchedColor('grape')}fruit juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':32:') + `     #keyword: ${matchedColor('grape')}fruit juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':41:') + `     #keyword: pink ${matchedColor('GRAPE')}fruit\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':31:') + `     #keyword: pink ${matchedColor('grape')}fruit\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':45:') + `     #keyword: ${matchedColor('GRAPE')} juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':47:') + `     #keyword: ${matchedColor('GRAPE')} juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':35:') + `     #keyword: ${matchedColor('grape')} juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':37:') + `     #keyword: ${matchedColor('grape')} juice\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':46:') + `     #keyword: pink ${matchedColor('GRAPE')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':36:') + `     #keyword: pink ${matchedColor('grape')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':39:') + `     #keyword: ${matchedColor('GRAPE')}fruit\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':43:') + `     #keyword: ${matchedColor('GRAPE')}fruit\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':29:') + `     #keyword: ${matchedColor('grape')}fruit\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':33:') + `     #keyword: ${matchedColor('grape')}fruit\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':44:') + `     #keyword: ${matchedColor('GRAPE')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':48:') + `     #keyword: ${matchedColor('GRAPE')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':34:') + `     #keyword: ${matchedColor('grape')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':38:') + `     #keyword: ${matchedColor('grape')}\n`,
        ],[
            "output order (4)",
            ["search", "main", "stage"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':51:') + `     #keyword: ${matchedColor('main')}ly ${matchedColor('stage')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':50:') + `     #keyword: ${matchedColor('Main')} ${matchedColor('stage')}s\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':52:') + `     #keyword: ${matchedColor('main')} ${matchedColor('stage')}s\n`,
        ],[
            "output order (5)",
            ["search", "silver", "arrow"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':54:') + `     #keyword: add ${matchedColor('SILVER')} ${matchedColor('arrow')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':56:') + `     #keyword: add ${matchedColor('SILVER')} ${matchedColor('arrow')}\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':55:') + `     #keyword: [${matchedColor('silver')}/super-system], ${matchedColor('SILVER')} ${matchedColor('Arrow')}s\n`,
        ],[
            "output order (6)",
            ["search", "tool", "release"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':59:') + `     #keyword: ${matchedColor('Tool')} ${matchedColor('release')} now\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':58:') + `     #keyword: ${matchedColor('Tool')} ${matchedColor('release')}, ${matchedColor('Tool')} deploy\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':60:') + `     #keyword: ${matchedColor('Tool')} ${matchedColor('release')}, ${matchedColor('Tool')} deploy\n`,
        ],[
            "without tag parameter",  // test_of_without_tag_parameter
            ["search", "specular"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':25:') + `         ${matchedColor('specular')} reflection light:  #keyword:  #// out of keyword parameter\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':27:') + `         - ${matchedColor('specular')} reflection:  #keyword:\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':24:') + `     ${matchedColor('specular')}:  #// the mirror-like reflection  #keyword:\n`,
        ],[
            "block-to-disable-tag-tool tag",
            ["search", "document_in_block"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':78:') + `         Making materials:  #keyword: ${matchedColor('document_in_block')}\n`,
        ],[
            "emphasize search and ref tag",
            ["search", "picture"],
            { folder: "test_data/search/2", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':62:') + `     #keyword: ${matchedColor('picture')}  ${refColor('#ref: path')}  #search: ${searchColor('keyword')}\n` +
            'path\n' +
            '    0.Folder\n',
        ],[
            "Multi folder",  // and test of long path length > short path length
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n` +
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ],[
            "target is file",
            ["search", "wonderful"],
            { folder: "test_data/search/2/2.yaml", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':85:') + `     #keyword: ${matchedColor('wonderful')}\n`,
        ],[
            "file extension filter",
            ["search", "target"],
            { folder: "test_data/search/3/*.yaml", test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/3/31.yaml') + lineNumColor(':1:') + ` #keyword: ${matchedColor('target')}\n`,
        ],[
            "Windows typrm folder path",
            ["search", "ABC"],
            { folder: `${process.cwd()}\\test_data\\search\\1`, test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`,
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

    describe("thesaurus >>", () => {
        test.each([
            [
                "acronym",
                ["search", "PS"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", test: "" },
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_checking/thesaurus/1.yaml') + lineNumColor(':1:') + ` #keyword: ${matchedColor('PowerShell')}\n`,
            ],[
                "ignore case",
                ["search", "ps"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", test: "" },
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_checking/thesaurus/1.yaml') + lineNumColor(':1:') + ` #keyword: ${matchedColor('PowerShell')}\n`,
            ],
        ])("%s", async (caseName, arguments_, options, answer) => {
            const  sourceFileContents =    lib.getSnapshot(`searches keyword tag >> thesaurus >> ${caseName}: sourceFileContents 1`);
            const  thesaurusFileContents = lib.getSnapshot(`searches keyword tag >> thesaurus >> ${caseName}: thesaurus 1`);
            fs.rmdirSync('test_data/_checking', {recursive: true});
            writeFileSync(`test_data/_checking/thesaurus/1.yaml`, sourceFileContents);
            writeFileSync(`test_data/_checking/thesaurus/thesaurus.csv`, thesaurusFileContents);

            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
            fs.rmdirSync('test_data/_checking', {recursive: true});
        });
    });
});

describe("searches glossary tag >>", () => {
  test.each([
    [
        "1st",
        ["search", "ABC"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n`,
    ],[
        "ignore case",
        ["search", "abc"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n`,
    ],[
        "word",
        ["search", "AB"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('AB')}C: abc\n`,
    ],[
        "nested indent",  // 2段以上深いインデントは対象外です
        ["search", "ABC"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}D: abcd\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':4:') + `     ${matchedColor('ABC')}: abc\n`,
    ],[
        "skip comment",
        ["search", "comment"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':26:') + `     ${matchedColor('comment')}: hit\n`,
    ],[
        "output order (1)",
        ["search", "de"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + `     ${matchedColor('DE')}: de\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + `     ${matchedColor('de')}: de\n`,
    ],[
        "output order (2)",
        ["search", "DE"],
        { folder: "test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + `     ${matchedColor('de')}: de\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + `     ${matchedColor('DE')}: de\n`,
    ],[
        "output order (3)",
        ["search", "search score comparison glossary"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':39:') + ` ${matchedColor('search')} ${matchedColor('score')}:        ${matchedColor('comparison')} ${matchedColor('glossary')} and keyword: 3\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':41:') + `         #keyword: ${matchedColor('search')} ${matchedColor('score')} ${matchedColor('comparison')} ${matchedColor('glossary')} and keyword\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':38:') + ` ${matchedColor('search')} ${matchedColor('score')}:        ${matchedColor('comparison')} ${matchedColor('glossary')}: 2\n`,
    ],[
        "glossary is less score than keyword",
        ["search", "grape"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':11:') + `         ${matchedColor('grape')}:\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':14:') + `         ${matchedColor('grape')}:\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':12:') + `     keyword:  #keyword: ${matchedColor('grape')}\n`,
    ],[
        "glossary with empty line",
        ["search", "space"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':17:') + `     ${matchedColor('space')}1:\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':19:') + `     ${matchedColor('space')}2:\n`,
    ],[
        "glossary with parameters (1)",
        ["search", "category1 apple"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':22:') + ` ${matchedColor('category1')}:    ${matchedColor('apple')}: juice\n`,
    ],[
        "glossary with parameters (2)",
        ["search", "apple category1"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':22:') + ` ${matchedColor('category1')}:    ${matchedColor('apple')}: juice\n`,
    ],[
        "emphasize search and ref tag",
        ["search", "picture"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':28:') + `     ${matchedColor('picture')}:  ${refColor('#ref: path#hash')}  #search: ${searchColor('keyword')}\n` +
        'path#hash\n' +
        '    0.Folder\n',
    ],[
        "nested glossary tag",
        ["search", "turnip"],
        { folder: "test_data/search/glossary/2", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':33:') + ` level-2:        white ${matchedColor('turnip')}:\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':34:') + ` level-1:    ${matchedColor('turnip')} soup:\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':32:') + ` level-2:        red ${matchedColor('turnip')}:\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':31:') + ` level-1:    ${matchedColor('turnip')}: #glossary: level-2\n`,
    ],[
        "Multi folder",
        ["search", "ABC"],
        { folder: "test_data/search/1, test_data/search/glossary/1", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + `     ${matchedColor('ABC')}: abc\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` #keyword: ${matchedColor('ABC')}, "do it", "a,b"\n`,
    ],
    ])("%s", async (_caseName, arguments_, options, answer) => {

        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

describe("find >>", () => {
  test.each([
    [
        "1st",
        ["find", "not"],
        { folder: "test_data/search/1", test: "", locale: "en-US" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':2:') + ` ${matchedColor('Not')} keyword  ABC, "do it", "a,b"\n`,
    ],
    ])("%s", async (_caseName, arguments_, options, answer) => {

        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

describe("mutual search >>", () => {
  test.each([
    [
        "1st",
        ["mutual-search", "AAA"],
        { folder: "test_data/search/mutual/1", test: "", locale: "en-US" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/mutual/1/1.yaml') + lineNumColor(':1:') + ` Index: #search: ${matchedColor('AAA')}\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/mutual/1/1.yaml') + lineNumColor(':2:') + ` Target: #keyword: ${matchedColor('AAA')}\n`,
    ],[
        "not mutual",
        ["search", "AAA"],
        { folder: "test_data/search/mutual/1", test: "", locale: "en-US" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/mutual/1/1.yaml') + lineNumColor(':2:') + ` Target: #keyword: ${matchedColor('AAA')}\n`,
    ],
    ])("%s", async (_caseName, arguments_, options, answer) => {

        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});

describe("where variable >>", () => {
  test.each([
    [
        "1st",
        ["where", "__VarA__"],
        { folder: "test_data/_search_target", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_search_target/1.yaml') + lineNumColor(':2:') + `     ${'__VarA__'}: ${valueColor('valueA')}\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_search_target/1.yaml') + lineNumColor(':7:') + `     ${'__VarA__'}: ${valueColor('valueA')}\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_search_target/sub/1.yaml') + lineNumColor(':2:') + `     ${'__VarA__'}: ${valueColor('valueA')}\n`,
    ],
    [
        "in the file",
        ["where", "__VarA__", "1.yaml"],
        { folder: "test_data/_search_target", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_search_target/1.yaml') + lineNumColor(':2:') + `     ${'__VarA__'}: ${valueColor('valueA')}\n` +
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_search_target/1.yaml') + lineNumColor(':7:') + `     ${'__VarA__'}: ${valueColor('valueA')}\n`,
    ],
    [
        "in the file near the line number (1)",
        ["where", "__VarA__", "1.yaml", "5"],
        { folder: "test_data/_search_target", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_search_target/1.yaml') + lineNumColor(':2:') + `     ${'__VarA__'}: ${valueColor('valueA')}\n`,
    ],
    [
        "in the file near the line number (2)",
        ["where", "__VarA__", "1.yaml", "6"],
        { folder: "test_data/_search_target", test: "" },
        pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_search_target/1.yaml') + lineNumColor(':7:') + `     ${'__VarA__'}: ${valueColor('valueA')}\n`,
    ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        const  sourceFileContents = lib.getSnapshot(`where variable >> all : sourceFileContents 1`);
        const  subSourceFileContents = lib.getSnapshot(`where variable >> sub : sourceFileContents 1`);
        fs.rmdirSync('test_data/_search_target', {recursive: true});
        writeFileSync(`test_data/_search_target/1.yaml`, sourceFileContents);
        writeFileSync(`test_data/_search_target/sub/1.yaml`, subSourceFileContents);

        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
        fs.rmdirSync('test_data/_search_target', {recursive: true});
    });
});

describe("print reference >>", () => {
    describe("basic >>", () => {
        test.each([
            [
                "1st",
                ["search", "#ref:", "${TEST_ENV}/file.txt"],
                {locale: "en-US", test: ""},
                "testEnv/file.txt\n" +
                "    0.Folder\n",
            ],[
                "multi parameters",
                ["search", " #ref:", "${TEST_ENV}/file1.txt", "${TEST_ENV}/${TEST_ENV}/file2.txt"],
                {locale: "en-US", test: ""},
                "testEnv/file1.txt testEnv/testEnv/file2.txt\n" +
                "    0.Folder\n",
            ],[
                "escape",
                ["search", "#ref:", "\\${TEST_ENV}", "-\\${TEST_ENV}-", "/${TEST_ENV}"],
                {locale: "en-US", test: ""},
                "${TEST_ENV} -${TEST_ENV}- /testEnv\n" +
                "    0.Folder\n",
            ],[
                "path",
                ["search", "#ref:", "~/.ssh  folder/f1.txt  ${TEST_PATH}  escaped\\ space  /root  //pc"],
                {locale: "en-US", test: ""},
                lib.getHomePath() +"/.ssh  folder/f1.txt  C:/Test  escaped\\ space  /root  //pc\n" +  // TYPRM_TEST_PATH has \ but print replaced to /
                "    0.Folder\n",
            ],[
                "shared folder",
                ["search", "#ref:", "\\\\pc\\folder\\file.txt"],
                {locale: "en-US", test: ""},
                "\\\\pc\\folder\\file.txt\n" +
                "    0.Folder\n",
            ],
        ])("%s", async (_caseName, arguments_, options, answer) => {

            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });

    describe("line number getter >>", () => {
        test.each([
            [
                "lineNum",
                ["search", "#ref:", "test_data/search/2/2.yaml#lineNum"],
                {locale: "en-US", test: ""},
                "test_data/search/2/2.yaml:69\n" +
                "    0.Folder\n",
            ],[
                "second match",
                ["search", "#ref:", "test_data/search/2/2.yaml:id=2#lineNum"],
                {locale: "en-US", test: ""},
                "test_data/search/2/2.yaml:86\n" +
                "    0.Folder\n",
            ],[
                "keyword list",
                ["search", "#ref:", "test_data/search/2/2.yaml:csv#firstKeyword, secondKeyword"],
                {locale: "en-US", test: ""},
                "test_data/search/2/2.yaml:91\n" +
                "    0.Folder\n",
            ],[
                "(error) lineNum not found",
                ["search", "#ref:", "test_data/search/2/2.yaml#notFound"],
                {locale: "en-US", test: ""},
                "test_data/search/2/2.yaml:0\n" +
                "    0.Folder\n",
            ],[
                "(error) file not found",
                ["search", "#ref:", "test_data/search/2/notFound.yaml#notFound"],
                {locale: "en-US", test: ""},
                'ERROR: not found a file at "${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/notFound.yaml"\n',
            ],
        ])("%s", async (_caseName, arguments_, options, answer) => {

            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });

    describe("recommend >>", () => {
        test.each([
            [
                "recommend",
                ["search", "#ref:", lib.getHomePath() +"/.ssh  testEnv/file1.txt  testEnv\\testEnv\\file2.txt  C:\\Test\\user1  c:\\Test  \\root  \\\\pc  last\\"],
                {locale: "en-US", test: ""},
                "Recommend: #ref: ~/.ssh  ${TEST_ENV}/file1.txt  ${TEST_ENV}/${TEST_ENV}/file2.txt  ${TEST_PATH}/user1  ${TEST_PATH}  /root  //pc  last/\n" +
                lib.getHomePath().replace(/\\/g,'/') +"/.ssh  testEnv/file1.txt  testEnv/testEnv/file2.txt  C:/Test/user1  c:/Test  /root  //pc  last/\n" +
                "    0.Folder\n",
            ],[
                "recommend (2)",  // cut ' '
                ["search", "#ref: '/User'"],
                {locale: "en-US", test: ""},
                "Recommend: #ref: /User\n" +
                "/User\n" +
                "    0.Folder\n",
            ],[
                "Do not recommend reserved variables",
                ["search", `#ref: TYPRM_FOLDER`],
                {locale: "en-US", test: ""},
                "TYPRM_FOLDER\n" +
                "    0.Folder\n",
            ],
        ])("%s", async (_caseName, arguments_, options, answer) => {
            if (arguments_[1].includes('TYPRM_FOLDER')) {
                process.env.TYPRM_FOLDER = 'TYPRM_FOLDER';
            }

            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
            if (arguments_[1].includes('TYPRM_FOLDER')) {
                delete  process.env.TYPRM_FOLDER;
            }
        });
    });

    describe("verb >>", () => {
        test.each([
            [
                "verb",
                ["search", "#ref:", "../README.md", "7"],  // 7 is echo command by "TYPRM_VERB"
                {locale: "en-US", test: ""},
                "{ref: ../README.md, windowsRef: ..\\README.md, file: ../README.md, windowsFile: ..\\README.md, fragment: }\n",
            ],[
                "verb (2)",
                ["search", "#ref:", "../README.md#title", "7"],  // 7 is echo command by "TYPRM_VERB"
                {locale: "en-US", test: ""},
                "{ref: ../README.md#title, windowsRef: ..\\README.md#title, file: ../README.md, windowsFile: ..\\README.md, fragment: title}\n",
            ],[
                "verb error",
                ["search", "#ref:", "../README.md", "4"],  // 4 is unknown verb
                {locale: "en-US", test: ""},
                "Error that verb number 4 is not defined\n",
            ],[
                "not found the folder",
                ["search", "#ref:", "/Unknown_", "0"],
                {locale: "en-US", test: ""},
                "Error of not found the file or folder at \"/Unknown_\"\n",
            ],[
                "verb verbose",
                ["search", "#ref:", "../README.md", "4"],
                {locale: "en-US", test: "", verbose: ""},
                (testingOS === 'Windows')
                ? // Windows
                    "Verbose: TYPRM_TEST_ENV = testEnv\n" +
                    "Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                    "Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                    "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                    "Verbose:     type: text\n" +
                    "Verbose:     filePathRegularExpressionIndex: 1\n" +
                    "Verbose:     keywordRegularExpressionIndex: 7\n" +
                    "Verbose:     csvOptionRegularExpressionIndex: 3\n" +
                    "Verbose:     targetMatchIdRegularExpressionIndex: 5\n" +
                    "Verbose:     address: ${file}:${lineNum}\n" +
                    "Verbose: TYPRM_VERB[0]:\n" +
                    "Verbose:     regularExpression: ^.*\\.md(#.*)?\$\n" +
                    "Verbose:     label: 7.Test Echo\n" +
                    "Verbose:     number: 7\n" +
                    "Verbose:     command: echo {ref: \${ref}, windowsRef: ${windowsRef}, file: \${file}, windowsFile: ${windowsFile}, fragment: \${fragment}}\n" +
                    "Verbose: TYPRM_VERB[1]:\n" +
                    "Verbose:     regularExpression: ^.*\\.(svg|svgz)(#.*)?\$\n" +
                    "Verbose:     label: 1.View\n" +
                    "Verbose:     number: 1\n" +
                    "Verbose:     command: msedge \"file://\${file}\"\n" +
                    "Verbose: typrm command: search\n" +
                    "Verbose: Parsed by TYPRM_LINE_NUM_GETTER:\n" +
                    "Verbose:     address: ../README.md\n" +
                    "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                    "Verbose:     filePathRegularExpressionIndex: 1\n" +
                    "Verbose:     keywordRegularExpressionIndex: 7\n" +
                    "Verbose:     csvOptionRegularExpressionIndex: 3\n" +
                    "Verbose:     targetMatchIdRegularExpressionIndex: 5\n" +
                    "Verbose:     matched: [../README.md, ../README.md, md, , , , , ]\n" +
                    "Error that verb number 4 is not defined\n"
                : // mac
                    "Verbose: TYPRM_TEST_ENV = testEnv\n" +
                    "Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                    "Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                    "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                    "Verbose:     type: text\n" +
                    "Verbose:     filePathRegularExpressionIndex: 1\n" +
                    "Verbose:     keywordRegularExpressionIndex: 7\n" +
                    "Verbose:     csvOptionRegularExpressionIndex: 3\n" +
                    "Verbose:     targetMatchIdRegularExpressionIndex: 5\n" +
                    "Verbose:     address: ${file}:${lineNum}\n" +
                    "Verbose: TYPRM_VERB[0]:\n" +
                    "Verbose:     regularExpression: ^.*\\.md(#.*)?\$\n" +
                    "Verbose:     label: 7.Test Echo\n" +
                    "Verbose:     number: 7\n" +
                    "Verbose:     command: echo  \"{ref: \${ref}, windowsRef: \${windowsRef}, file: \${file}, windowsFile: \${windowsFile}, fragment: \${fragment}}\"\n" +
                    "Verbose: TYPRM_VERB[1]:\n" +
                    "Verbose:     regularExpression: ^.*\\.(svg|svgz)(#.*)?\$\n" +
                    "Verbose:     label: 1.View\n" +
                    "Verbose:     number: 1\n" +
                    "Verbose:     command: \"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome\" \"file://\${file}\"\n" +
                    "Verbose: typrm command: search\n" +
                    "Verbose: Parsed by TYPRM_LINE_NUM_GETTER:\n" +
                    "Verbose:     address: ../README.md\n" +
                    "Verbose:     regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                    "Verbose:     filePathRegularExpressionIndex: 1\n" +
                    "Verbose:     keywordRegularExpressionIndex: 7\n" +
                    "Verbose:     csvOptionRegularExpressionIndex: 3\n" +
                    "Verbose:     targetMatchIdRegularExpressionIndex: 5\n" +
                    "Verbose:     matched: [../README.md, ../README.md, md, , , , , ]\n" +
                    "Error that verb number 4 is not defined\n",
            ],
            // Others test is "search_mode_ref_verb".
        ])("%s", async (_caseName, arguments_, options, answer) => {

            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });
});

describe("test of test >>", () => {
    test("checks snapshots files are confirmed", () => {
        const  activeSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap').toString();
        const  backUpSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap.confirmed-ts').toString();
            // 拡張子の末尾を .snap にしない理由は、Jest が使っていない .snap ファイルを自動的に削除しようとするからです
            // ____.snap.confirmed-ts ファイルが存在する理由は、Jest の自動編集が予期しないデータを追加することがあるからです

        expect(activeSnapshots).toBe(backUpSnapshots);
    });
});

afterAll(()=>{
    deleteFileSync('test_data/_output.txt')
    fs.rmdirSync('empty_folder', {recursive: true});
});

// writeFileSync
// #keyword: writeFileSync
// This also makes the copy target folder.
function  writeFileSync(filePath: string, fileContents: string) {
	const  destinationFolderPath = path.dirname(filePath);
	fs.mkdirSync(destinationFolderPath, {recursive: true});

    fs.writeFileSync(filePath, fileContents);
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
