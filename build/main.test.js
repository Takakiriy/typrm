import * as fs from "fs";
import * as path from "path";
import * as main from "./main";
import chalk from "chalk";
import * as lib from "./lib";
const callMain = main.callMainFromJest;
process.env['typrm_aaa'] = 'aaa';
process.chdir(__dirname);
const testFolderPath = `test_data` + path.sep;
const matchedColor = chalk.green.bold;
const keywordLabelColor = chalk.gray;
const refColor = chalk.yellow;
const searchColor = chalk.yellow;
const pathColor = chalk.cyan;
const lineNumColor = chalk.keyword('gray');
if (process.env.windir) {
    var testingOS = 'Windows';
}
else {
    var testingOS = 'Linux';
}
process.env.TYPRM_TEST_ENV = 'testEnv';
process.env.TYPRM_TEST_PATH = 'C:\\Test';
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
}
else {
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
beforeAll(() => {
    fs.mkdirSync('empty_folder', { recursive: true });
    chdirInProject('src');
});
describe("typrm shell >>", () => {
    describe("search >>", () => {
        test.each([
            ['search_mode', 'test_data/search/1', 'ABC\nexit()\n'],
            ['search_mode_without_tags', 'test_data/search/1', 'Not\nexit()\n'],
            ['search_mode_snippet', 'test_data/search/2', 'snippet_keyword\nexit()\n'],
            ['snippet_depth_1', 'test_data/search/2', 'snippet_depth_1\nexit()\n'],
            ['snippet_depth_2', 'test_data/search/2', 'snippet_depth_2\nexit()\n'],
            ['snippet_depth_3', 'test_data/search/2', 'snippet_depth_3\nexit()\n'],
            ['snippet_environment_variable', 'test_data/search/2', 'snippet_environment_variable\nexit()\n'],
        ])("%s", async (_caseName, folder, input) => {
            chdirInProject('src');
            var typrmOptions = {
                folder, test: "", locale: "en-US", input,
            };
            await callMain([], typrmOptions);
            expect(lib.cutEscapeSequence(main.stdout)).toMatchSnapshot('stdout');
        });
    });
    describe("replace >>", () => {
        test.each([
            ['replace', 'replace', ['#r', '#replace:', '#r _tmp.yaml', '#replace: _tmp.yaml'], {}],
            ['replaceNotFound', 'replace', ['#r not_found.yaml'], { error: '' }],
            ['reset', 'reset', ['#reset:', '#reset: _tmp.yaml'], {}],
            ['resetNotFound', 'reset', ['#reset: not_found.yaml'], { error: '' }],
            ['check', 'check', ['#c', '#check:', '#c _tmp.yaml', '#check: _tmp.yaml'], {}],
            ['checkNotFound', 'check', ['#c not_found.yaml'], { error: '' }],
        ])("%s", async (_caseName, fileName, inputs, _options) => {
            var inputIndex = 0;
            var updatedFileContentsAnswer = '?';
            for (const input of inputs) {
                var { filePath } = initializeTestInputFile(`typrm shell >> replace >> ${fileName}: sourceFileContents 1`);
                var inputPattern = `${input}\n${input}\nexit()\n`;
                // The reason to run twice is to check that the file is closed correctly
                await callMain([], {
                    folder: 'test_data/_tmp', test: "", locale: "en-US", input: inputPattern,
                });
                var updatedFileContents = fs.readFileSync(filePath).toString();
                chdirInProject('src');
                if (inputIndex === 0) {
                    expect(lib.cutEscapeSequence(main.stdout)).toMatchSnapshot('stdout');
                    expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
                    updatedFileContentsAnswer = updatedFileContents;
                }
                else {
                    expect(lib.cutEscapeSequence(main.stdout)).toMatchSnapshot('stdout');
                    expect(updatedFileContents).toBe(updatedFileContentsAnswer);
                }
                inputIndex += 1;
            }
            lib.rmdirSync(testFolderPath + '_tmp');
        });
    });
});
describe("checks template value >>", () => {
    test.each([
        ["1_template_1_ok"],
        ["1_template_2_error"],
        ["1_template_3_if"],
        ["var_not_ref_1_error"],
        ["template_if_1_error"],
        ["environment_variable"],
        ["list_to_tag_original_tag"],
        ["settings_tree"],
        ["settings_tree_deep"],
        ["settings_tree_position"],
        ["settings_tree_if"],
        ["settings_tree_if_disable"],
        ["settings_tree_error"],
    ])("%s", async (fileNameHead) => {
        initializeTestInputFile(`checks template value >> ${fileNameHead}: sourceFileContents 1`);
        process.chdir('empty_folder');
        await callMain(["check"], {
            folder: '../test_data/_tmp', test: "", locale: "en-US",
        });
        chdirInProject('src');
        expect(main.stdout).toMatchSnapshot(`answer`);
        lib.rmdirSync(testFolderPath + '_tmp');
    });
    test("check one file only", async () => {
        initializeTestInputFile(`checks template value >> 1_template_1_ok: sourceFileContents 1`);
        process.chdir('empty_folder');
        await callMain(["check", "_tmp/_tmp.yaml"], {
            folder: '../test_data', test: "", locale: "en-US",
        });
        process.chdir('..');
        expect(main.stdout).toMatchSnapshot(`answer`);
        lib.rmdirSync(testFolderPath + '_tmp');
    });
    describe("check files in multi folder >>", () => {
        test.each([
            [
                "1st",
                "empty_folder",
                ["check"],
            ], [
                "with current folder",
                "test_data/_checking/1",
                ["check", "one_error_1.yaml"],
            ],
        ])("%s", async (_caseName, currentFolder, command) => {
            chdirInProject('src');
            const sourceFileContents = lib.getSnapshot(`checks template value >> one_error: sourceFileContents 1`);
            lib.rmdirSync(testFolderPath + '_checking');
            writeFileSync(`test_data/_checking/1/one_error_1.yaml`, sourceFileContents);
            writeFileSync(`test_data/_checking/2/one_error_1.yaml`, sourceFileContents);
            const srcPath = process.cwd();
            process.chdir(currentFolder);
            await callMain(command, {
                folder: `${srcPath}/test_data/_checking/1, ${srcPath}/test_data/_checking/2/*.yaml`,
                test: "", locale: "en-US",
            });
            chdirInProject('src');
            expect(main.stdout).toMatchSnapshot(`answer`);
            lib.rmdirSync(testFolderPath + '_checking');
        });
    });
    describe("settings >>", () => {
        test.each([
            ["1 same values"],
            ["2 not same values error"],
            ["3 overwrite"],
            ["3e overwrite error"],
            ["4 neighbor error"],
            ["4-2 neighbor level 2 error"],
            ["b1_bug_case_no_root_settings"],
            ["b2_bug_case_nest_settings"],
            // There are other settings tests in "unit test >>"
        ])("%s", async (caseName) => {
            initializeTestInputFile(`checks template value >> settings >> ${caseName}: sourceFileContents 1`);
            await callMain(["check", "_tmp/_tmp.yaml"], {
                folder: 'test_data', test: "", locale: "en-US",
            });
            chdirInProject('src');
            expect(lib.cutLeftOf(main.stdout, 'Verbose: typrm command: check')).toMatchSnapshot('answer');
            lib.rmdirSync(testFolderPath + '_tmp');
        });
    });
    test("verbose", async () => {
        initializeTestInputFile(`checks template value >> verbose: sourceFileContents 1`);
        process.chdir('empty_folder');
        await callMain(["check", "_tmp/_tmp.yaml"], {
            folder: '../test_data', test: "", locale: "en-US", verbose: "",
        });
        chdirInProject('src');
        expect(lib.cutLeftOf(main.stdout, 'Verbose: typrm command: check')).toMatchSnapshot('answer');
        lib.rmdirSync(testFolderPath + '_tmp');
    });
});
describe("checks file contents >>", () => {
    test.each([
        [
            "OK", "file_1_ok_and_bad",
        ], [
            "NG", "file_1_ok_and_bad",
        ], [
            "file name", "file_3_file_name",
        ], [
            "if", "file_4_if",
        ], [
            "any_lines", "file_8_others",
        ], [
            "environment_variable", "file_5",
        ]
    ])("First >> %s", async (caseName, _fileNameHead) => {
        chdirInProject('src');
        const sourceFileContents = lib.getSnapshot(`checks file contents >> First >> ${caseName}: sourceFileContents 1`);
        const changingFilePath = 'test_data/_checking/document/' + caseName + "_1_changing.yaml";
        lib.rmdirSync(testFolderPath + '_checking');
        writeFileSync(changingFilePath, sourceFileContents);
        process.chdir('empty_folder');
        lib.copyFileSync('../.env', '.env');
        // Test Main
        await callMain(["check"], {
            folder: '../test_data/_checking', test: "", locale: "en-US",
        });
        chdirInProject('src');
        expect(main.stdout).toMatchSnapshot('stdout');
        lib.rmdirSync(testFolderPath + '_checking');
    });
    test.each([
        [
            "all", ["check"],
        ], [
            "file in 1st folder", ["check", "file_1.yaml"],
        ], [
            "file in 2nd folder", ["check", "file_2.yaml"],
        ], [
            "full path", ["check", getFullPath("test_data/_checking/2/file_2.yaml", process.cwd())],
        ]
    ])("Multi folder >> %s", async (caseName, parameters) => {
        chdirInProject('src');
        const sourceFileContents = lib.getSnapshot(`checks file contents >> file_0_one_error: sourceFileContents 1`);
        lib.rmdirSync(testFolderPath + '_checking');
        writeFileSync(`test_data/_checking/1/file_1.yaml`, sourceFileContents);
        writeFileSync(`test_data/_checking/2/file_2.yaml`, sourceFileContents);
        process.chdir('empty_folder');
        // Test Main
        await callMain(parameters, {
            folder: '../test_data/_checking/1, ../test_data/_checking/2', test: "", locale: "en-US",
        });
        chdirInProject('src');
        expect(main.stdout).toMatchSnapshot('stdout');
        lib.rmdirSync(testFolderPath + '_checking');
    });
});
describe("checks copy tag >>", () => {
    const goodColor = chalk.bgGreen.black;
    const badColor = chalk.bgRed.black;
    test.each([
        ['1 >> OK', null],
        ['1 >> NG', { replacers: [
                    { from: 'bbb', to: goodColor('bbb') },
                    { from: 'BBB', to: badColor('BBB') },
                ] }],
        ['2 >> OK', null],
        ['2 >> NG', null],
        ['ignore keyword tag', { replacers: [
                    { from: 'aaa', to: goodColor('aaa') },
                    { from: 'bbb', to: badColor('bbb') },
                ] }],
        ['template >> 1 >> OK', null],
        ['template >> 1 >> NG-1', { replacers: [
                    { from: 'a2', to: `a${goodColor('2')}` },
                    { from: '__Bad__', to: `${badColor('__B')}a${badColor('d__')}` },
                ] }],
        ['template >> 1 >> NG-2', { replacers: [
                    { from: '(__Bad__)  #template: (__VariableA__)', to: `(${goodColor('__B')}a${goodColor('d__')})${goodColor('  #template: (__VariableA__)')}` },
                    { from: 'a2', to: `a${badColor('2')}` },
                    { from: '(__Bad__)  #template: (__VariableA__)', to: `(${goodColor('__B')}a${goodColor('d__')})${goodColor('  #template: (__VariableA__)')}` },
                    { from: 'a2', to: `a${badColor('2')}` },
                ] }],
        ['template >> default value', { replacers: [
                    { from: '(a1, b2)', to: `(a${goodColor('1')}, b2)` },
                    { from: '(__Bad__, b2)', to: `(${badColor('__B')}a${badColor('d__')}, b2)` },
                    { from: '(a1, b2)', to: `(a1, ${goodColor('b2')})` },
                    { from: '(a1, __Bad__)', to: `(a1, ${badColor('__Bad__')})` },
                ] }],
        ['template >> variable', { replacers: [
                    { from: 's1', to: `${goodColor('s1')}` },
                    { from: '__Bad__', to: `${badColor('__Bad__')}` },
                ] }],
    ])("%s", async (caseName, option) => {
        const { filePath } = initializeTestInputFile(`checks copy tag >> ${caseName}: sourceFileContents 1`);
        var inputContents = lib.getSnapshot(`checks copy tag >> ${caseName}: stdout 1`);
        if (option) {
            inputContents = lib.replace(inputContents, option.replacers);
        }
        // Test Main
        await callMain(["check", path.basename(filePath)], {
            folder: path.dirname(filePath), test: "", locale: "en-US",
        });
        chdirInProject('src');
        expect(main.stdout).toBe(inputContents);
    });
});
describe("replaces settings >>", () => {
    test.each([
        [
            '1_replace', '', 'en-US', null,
        ], [
            '2_replace_1_ok', ' setting 1', 'en-US',
            { replacers: [
                    { from: 'key1: value1', to: 'key1: value1  #to: value1changed' },
                    { from: '__Key2__: value2', to: '__Key2__: value2  #to: value2changed' },
                    { from: 'Key3: value3', to: 'Key3: value3  #to: value3changed' },
                ] },
        ], [
            '2_replace_1_ok', ' setting 2', 'en-US',
            { replacers: [{ from: 'key1: value11', to: 'key1: value11  #to: value1changed' }] },
        ], [
            '2_replace_1A_end_of_template', '', 'en-US', null,
        ], [
            '2_replace_2_error', '', 'en-US', null,
        ], [
            '2_replace_3_English', '', 'en-US', null,
        ], [
            '2_replace_4_Japanese', '', 'ja-JP', null,
        ], [
            '2_replace_5_with_environment_variable', '', '', null,
        ], [
            '2_replace_6_if', ' in if block', 'en-US',
            { replacers: [{ from: '__Setting1__: yes', to: '__Setting1__: yes  #to: replaced' }] },
        ], [
            '2_replace_6_if', ' in if variable', 'en-US',
            { replacers: [{ from: 'fruit: banana', to: 'fruit: banana  #to: melon' }] },
        ], [
            '2_replace_6_if', ' both', 'en-US',
            { replacers: [
                    { from: 'fruit: banana', to: 'fruit: banana  #to: melon' },
                    { from: '__Setting1__: no', to: '__Setting1__: no  #to: replaced' },
                ] },
        ], [
            '2_replace_7_undefined_if', '', 'en-US', null,
        ], [
            '2_replace_8_one_setting', ' without line num', 'en-US', null,
        ], [
            '2_replace_9_template_if_1_OK', '', 'en-US', null,
        ], [
            '2_replace_9_template_if_2_NG', '', 'en-US', null,
        ], [
            '2_replace_9_template_if_3_not_set', '', 'en-US', null,
        ], [
            '2_replace_9_template_if_4_operators', '', 'en-US', null,
        ], [
            '2_replace_10_double_check', ' 1_OK', 'en-US',
            { replacers: [
                    { from: '__Full__: folder/file', to: '__Full__: folder/file  #to: fo/fi' },
                    { from: '__Folder__: folder', to: '__Folder__: folder  #to: fo' },
                    { from: '__File__: file', to: '__File__: file  #to: fi' },
                ] },
        ], [
            '2_replace_10_double_check', ' 2_BadPart', 'en-US',
            { replacers: [
                    { from: '__Full__: folder/file', to: '__Full__: folder/file  #to: fo/fi' },
                    { from: '__File__: file', to: '__File__: file  #to: fi' },
                ] },
        ], [
            '2_replace_10_double_check', ' 3_NoReplace', 'en-US',
            { replacers: [] },
        ], [
            '2_replace_11_nested_if', ' AB', 'en-US',
            { replacers: [
                    { from: '__Switch2__: A', to: '__Switch2__: A  #to:B' },
                    { from: '__Switch_02__: A', to: '__Switch_02__: A  #to:B' },
                ] },
        ], [
            '2_replace_11_nested_if', ' BA', 'en-US',
            { replacers: [
                    { from: '__Switch1__: A', to: '__Switch1__: A  #to:B' },
                    { from: '__Switch_01__: A', to: '__Switch_01__: A  #to:B' },
                ] },
        ], [
            '2_replace_11_nested_if', ' BB', 'en-US',
            { replacers: [
                    { from: '__Switch1__: A', to: '__Switch1__: A  #to:B' },
                    { from: '__Switch2__: A', to: '__Switch2__: A  #to:B' },
                    { from: '__Switch_01__: A', to: '__Switch_01__: A  #to:B' },
                    { from: '__Switch_02__: A', to: '__Switch_02__: A  #to:B' },
                ] },
        ], [
            '2_replace_11_nested_if', ' C', 'en-US',
            { replacers: [{ from: '__Set2__: C', to: '__Set2__: C  #to:CC' }] },
        ],
        // There are other cases in "replace to tag" test.
    ])("in %s%s", async (fileNameHead, _subCaseName, locale, option) => {
        const { filePath } = initializeTestInputFile(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
        if (option) {
            lib.replaceFileSync(filePath, (text) => (lib.replace(text, option.replacers)));
        }
        // Test Main
        await callMain(["replace", path.basename(filePath)], {
            folder: path.dirname(filePath), test: "", locale,
        });
        const updatedFileContents = fs.readFileSync(filePath).toString();
        chdirInProject('src');
        expect(main.stdout).toMatchSnapshot('stdout');
        expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
        lib.rmdirSync(testFolderPath + '_tmp');
    });
    describe("Multi folder >>", () => {
        const fileNameHead = '2_replace_1_ok';
        const changingFolderPath = testFolderPath + '_changing';
        const changingFile1Path = changingFolderPath + '/1/' + fileNameHead + "_1_changing.yaml";
        const changingFile2Path = changingFolderPath + '/2/' + fileNameHead + "_2_changing.yaml";
        const changingFile1APath = changingFolderPath + '/1/' + fileNameHead + "_same_name.yaml";
        const changingFile2APath = changingFolderPath + '/2/' + fileNameHead + "_same_name.yaml";
        const lineNum = 29;
        const keyValues = `key1: value1changed`;
        test.each([
            ["replace 1", fileNameHead + "_1_changing.yaml", changingFile1Path],
            ["replace 2", fileNameHead + "_2_changing.yaml", changingFile2Path],
            ["same name error", fileNameHead + "_same_name.yaml", undefined],
            ["full path", process.cwd() + "/" + changingFile1Path, changingFile1Path],
        ])("%s", async (caseName, changingFileName, changingFilePath) => {
            chdirInProject('src');
            var errorMessage = '';
            const sourceFileContents = lib.getSnapshot(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
            lib.rmdirSync(testFolderPath + '_changing');
            writeFileSync(changingFile1Path, sourceFileContents);
            writeFileSync(changingFile2Path, sourceFileContents);
            writeFileSync(changingFile1APath, sourceFileContents);
            writeFileSync(changingFile2APath, sourceFileContents);
            if (changingFilePath) {
                lib.replaceFileSync(changingFilePath, (text) => (lib.replace(text, [{ from: 'key1: value1', to: 'key1: value1changed' }])));
            }
            // Test Main
            if (caseName !== "same name error") { // Case of relace 1, replace 2
                await callMain(["replace", changingFileName], {
                    folder: `${changingFolderPath}/1, ${changingFolderPath}/2`, test: "", locale: "en-US"
                });
            }
            else {
                try {
                    await callMain(["replace", changingFileName], {
                        folder: `${changingFolderPath}/1, ${changingFolderPath}/2`, test: "", locale: "en-US"
                    });
                }
                catch (e) {
                    errorMessage = e.message;
                }
            }
            chdirInProject('src');
            // Check
            if (caseName !== "same name error") { // Case of relace 1, replace 2
                if (!changingFilePath) {
                    throw new Error('unexpected');
                }
                const fileContentsBefore = sourceFileContents;
                const fileContentsAfter = fs.readFileSync(changingFilePath).toString();
                expect(fileContentsAfter).not.toBe(fileContentsBefore);
            }
            else { // Case of same name error
                const fileContentsBefore = sourceFileContents;
                const fileContents1 = fs.readFileSync(changingFile1APath).toString();
                const fileContents2 = fs.readFileSync(changingFile2APath).toString();
                expect(main.stdout).toMatchSnapshot('stdout');
                expect(fileContents1).toBe(fileContentsBefore);
                expect(fileContents2).toBe(fileContentsBefore);
            }
            lib.rmdirSync(testFolderPath + '_changing');
        });
    });
    describe("reset >>", () => {
        test.each([
            [
                '2_replace_1_ok', ' setting 2', 'en-US',
                {
                    replacers: [
                        { fromCSV: '手順B:, key1: value11', to: 'key1: value11  #to: value1changed1' },
                        { from: '#original: oldValue3', to: '#to: value3changed' },
                    ],
                    resetAnswer: 'replaces settings >> in 2_replace_1_ok: resetFileContents 1',
                },
            ], [
                '2_replace_6_if', ' in if block', 'en-US',
                { replacers: [
                        { from: '__Setting1__: yes', to: '__Setting1__: yes  #to: replaced' },
                    ] },
            ], [
                '2_replace_6_if', ' in if variable', 'en-US',
                { replacers: [
                        { from: 'fruit: banana', to: 'fruit: banana  #to: melon' },
                    ] },
            ], [
                '2_replace_6_if', ' both', 'en-US',
                {
                    replacers: [
                        { from: '__Setting1__: no', to: '__Setting1__: no  #to: replaced' },
                        { from: 'fruit: banana', to: 'fruit: banana  #to: melon' },
                    ],
                },
            ], [
                '2_replace_10_double_check', ' 1_OK', 'en-US',
                {
                    replacers: [
                        { from: '__Full__: folder/file', to: '__Full__: folder/file  #to: fo/fi' },
                        { from: '__Folder__: folder', to: '__Folder__: folder  #to: fo' },
                        { from: '__File__: file', to: '__File__: file  #to: fi' },
                    ],
                },
            ], [
                '2_replace_11_nested_if', ' AB', 'en-US',
                { replacers: [{ from: '__Switch2__: A', to: '__Switch2__: A  #to:B' }] },
            ], [
                '2_replace_11_nested_if', ' BA', 'en-US',
                { replacers: [{ from: '__Switch1__: A', to: '__Switch1__: A  #to:B' }] },
            ], [
                '2_replace_11_nested_if', ' BB', 'en-US',
                { replacers: [
                        { from: '__Switch1__: A', to: '__Switch1__: A  #to:B' },
                        { from: '__Switch2__: A', to: '__Switch2__: A  #to:B' },
                    ] },
            ], [
                '2_replace_11_nested_if', ' C', 'en-US',
                { replacers: [{ from: '__Set2__: C', to: '__Set2__: C  #to:CC' }] },
            ],
        ])("%s%s >>", async (fileNameHead, _subCaseName, locale, option) => {
            const { filePath, inputContents } = initializeTestInputFile(`replaces settings >> in ${fileNameHead}: sourceFileContents 1`);
            if (option) {
                await lib.replaceFileAsync(filePath, async (text) => (await lib.replaceAsync(text, option.replacers)));
            }
            await callMain(["replace", path.basename(filePath)], {
                folder: path.dirname(filePath), test: "", locale
            });
            const updatedFileContents = fs.readFileSync(filePath).toString();
            expect(updatedFileContents).not.toBe(filePath);
            // Test Main
            await callMain(["reset", path.basename(filePath)], {
                folder: path.dirname(filePath), test: "", locale
            });
            chdirInProject('src');
            const resetFileContents = fs.readFileSync(filePath).toString();
            if (!('resetAnswer' in option)) {
                expect(resetFileContents).toBe(inputContents);
            }
            else {
                const resetFileContents = lib.getSnapshot(option.resetAnswer).toString();
                expect(resetFileContents).toBe(resetFileContents);
            }
            expect(main.stdout).toMatchSnapshot('stdout');
            lib.rmdirSync(testFolderPath + '_tmp');
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
            ['6_VariousTags', ''],
            ['7_VariableCount', ''],
            ['7E_VariableCount_Error', 'ErrorCase'],
            ['8_ParentSettings', ''],
            ['settings_tree_if', ''],
            ['E1_BugCase_IfBlock_DoubleCheck_Error', 'ErrorCase'],
            ['E2_BugCase_ParentSettings', ''],
            ['bug_case_5', ''],
        ])("%s", async (caseName, options) => {
            const { filePath, inputContents } = initializeTestInputFile(`replaces settings >> replace to tag >> ${caseName}: sourceFileContents 1`);
            // Test Main >> replace
            if (options.includes('FileParameter')) {
                var parameters = ["replace", filePath];
            }
            else {
                var parameters = ["replace"];
            }
            await callMain(parameters, {
                folder: path.dirname(filePath), test: "", locale: "en-US"
            });
            chdirInProject('src');
            const replacedFileContents = fs.readFileSync(filePath).toString();
            expect(main.stdout).toMatchSnapshot('stdout');
            if (!options.includes('ErrorCase')) {
                expect(replacedFileContents).toMatchSnapshot('replacedFileContents');
                // Test Main >> reset
                if (caseName.includes('FileParameter')) {
                    var parameters = ["reset", filePath];
                }
                else {
                    var parameters = ["reset"];
                }
                await callMain(parameters, {
                    folder: path.dirname(filePath), test: "", locale: "en-US"
                });
                const resetFileContents = fs.readFileSync(filePath).toString();
                expect(resetFileContents).toMatchSnapshot('resetFileContents');
            }
            else { // error case
                const sourceFileContents2 = fs.readFileSync(filePath).toString();
                expect(sourceFileContents2).toBe(inputContents);
            }
            lib.rmdirSync(testFolderPath + '_tmp');
        });
    });
    test("CR LF >>", async () => {
        chdirInProject('src');
        const caseName = 'CR LF';
        const changingFolderPath = testFolderPath + '_changing';
        const changingFileName = caseName + "_1_changing.yaml";
        const changingFilePath = changingFolderPath + '/' + changingFileName;
        var sourceFileContents = lib.getSnapshot(`replaces settings >> ${caseName} >>: sourceFileContents 1`);
        sourceFileContents = sourceFileContents.replace(/\\r/g, '\r');
        sourceFileContents = sourceFileContents.replace('(BOM)', '\uFEFF');
        lib.rmdirSync(testFolderPath + '_changing');
        writeFileSync(changingFilePath, sourceFileContents);
        await callMain(["replace"], {
            folder: changingFolderPath, test: "", locale: "en-US"
        });
        const updatedFileContents = fs.readFileSync(changingFilePath).toString();
        chdirInProject('src');
        expect(main.stdout).toMatchSnapshot('stdout');
        expect(updatedFileContents).toBe(sourceFileContents);
        lib.rmdirSync(testFolderPath + '_changing');
    });
    describe("verbose >>", () => {
        test("no conflict", async () => {
            const { filePath } = initializeTestInputFile(`replaces settings >> verbose >> no conflict: sourceFileContents 1`);
            await callMain(["replace"], {
                folder: path.dirname(filePath), test: "", locale: "en-US", verbose: ""
            });
            chdirInProject('src');
            const verboseOutput = main.stdout.substring(main.stdout.indexOf('Verbose: Phase 3: replace ...'));
            expect(verboseOutput).toMatchSnapshot('verbose');
            lib.rmdirSync(testFolderPath + '_tmp');
        });
        test("conflict", async () => {
            const { filePath } = initializeTestInputFile(`replaces settings >> verbose >> conflict: sourceFileContents 1`);
            await callMain(["replace"], {
                folder: path.dirname(filePath), test: "", locale: "en-US", verbose: ""
            });
            chdirInProject('src');
            const verboseOutput = main.stdout.substring(main.stdout.indexOf('Verbose: Phase 3: replace ...'));
            expect(verboseOutput).toMatchSnapshot('verbose');
            lib.rmdirSync(testFolderPath + '_tmp');
        });
    });
});
describe("searches keyword tag >>", () => {
    test.skip('sharp (best)', () => { });
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ], [
            "not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ], [
            "acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`
        ], [
            "ommit command name (1)",
            ["ABC"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`
        ], [
            "ommit command name (2)",
            ["do", "it"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ], [
            "space",
            ["search", "do it"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ], [
            "comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n`,
        ], [
            "double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('double')} ${matchedColor('quotation')} ${matchedColor('is')} ${matchedColor('"".')}"\n`,
        ], [
            "sharp",
            ["search", 'space sharp is #. "parcent 20" is "%20".'],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':94:') + `     ${keywordLabelColor('#keyword:')} "${matchedColor('space')} ${matchedColor('sharp')} ${matchedColor('is')}is${matchedColor('is')} ${matchedColor('#.')} ${matchedColor('""parcent')}${matchedColor(' 20"')}" i${matchedColor('s ""%20"')}"."\n`,
            // This is little wrong answer
        ], [
            "ignore case",
            ["search", "DO It"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ], [
            "word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], [
            "word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('do')}uble quotation is ""."\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} it", "a,b"\n`,
        ], [
            "trim",
            ["search", " do "],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('do')}uble quotation is ""."\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} it", "a,b"\n`,
        ], [
            "ignored keyword",
            ["search", "#search: AB  #keyword: AB"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], [
            "ignored colon before keyword tag",
            ["search", "AB: #keyword:"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], [
            "ignored hyphen and colon before keyword tag",
            ["search", "- AB: #keyword:"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], [
            "CSV ignored colon before keyword tag",
            ["search", "A,B: #keyword:"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n`,
        ], [
            "words order score",
            ["search", "aaa bbb"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('bbb')} ${matchedColor('aaa')} xxx\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('aaa')} ${matchedColor('bbb')} xxx\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('bbb')} ${matchedColor('aaa')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('aaa')} ${matchedColor('bbb')}\n`,
        ], [
            "words order score (2)",
            ["search", "user", "interface"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':10:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('user')} ${matchedColor('interface')}\n`,
        ], [
            "1 word search score",
            ["search", "second"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':15:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('second')} screen\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':14:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('second')}ary\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':13:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('second')}\n`,
        ], [
            "word match is better than same case",
            ["search", "ipad"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':18:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('ipad')} pro, ${matchedColor('ipad')} nano\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':17:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('iPad')}\n`,
        ], [
            "target word count",
            ["search", "new task"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':21:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('new')} ${matchedColor('task')}s only\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':20:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('new')} ${matchedColor('task')}s\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':22:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('new')} ${matchedColor('task')}s\n`,
        ], [
            "target word count 3",
            ["search", "world wide web"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':67:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('web')} ${matchedColor('World')} ${matchedColor('wide')}, ${matchedColor('World')} ${matchedColor('wide')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':65:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('World')} ${matchedColor('wide')} ${matchedColor('web')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':66:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('World')} ${matchedColor('wide')} ${matchedColor('web')}\n`,
        ], [
            "compound word",
            ["search", "frame set"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':6:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('frame')}${matchedColor('set')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('frame')} ${matchedColor('set')}\n`,
        ], [
            "bug case (1)",
            ["search", "go lang"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':81:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Go')}_${matchedColor('lang')}uage.yaml, ${matchedColor('go')}\n`,
        ], [
            "output order (1)",
            ["search", "a,b"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n`,
        ], [
            "output order (2)",
            ["search", "A,B"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n`,
        ], [
            "output order (3)",
            ["search", "grape"],
            { folder: "test_data/search/2", disableFindAll: '', test: "", foundCountMax: "99" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':40:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':42:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':30:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':32:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':41:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('GRAPE')}fruit\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':31:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('grape')}fruit\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':45:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')} juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':47:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')} juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':35:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')} juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':37:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')} juice\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':46:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('GRAPE')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':36:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('grape')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':39:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':43:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':29:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':33:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':44:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':48:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':34:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':38:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}\n`,
        ], [
            "output order (4)",
            ["search", "main", "stage"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':51:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('main')}ly ${matchedColor('stage')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':50:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Main')} ${matchedColor('stage')}s\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':52:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('main')} ${matchedColor('stage')}s\n`,
        ], [
            "output order (5)",
            ["search", "silver", "arrow"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':54:') + `     ${keywordLabelColor('#keyword:')} add ${matchedColor('SILVER')} ${matchedColor('arrow')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':56:') + `     ${keywordLabelColor('#keyword:')} add ${matchedColor('SILVER')} ${matchedColor('arrow')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':55:') + `     ${keywordLabelColor('#keyword:')} [${matchedColor('silver')}/super-system], ${matchedColor('SILVER')} ${matchedColor('Arrow')}s\n`,
        ], [
            "output order (6)",
            ["search", "tool", "release"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':59:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Tool')} ${matchedColor('release')} now\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':58:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Tool')} ${matchedColor('release')}, ${matchedColor('Tool')} deploy\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':60:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Tool')} ${matchedColor('release')}, ${matchedColor('Tool')} deploy\n`,
        ], [
            "many result",
            ["search", "hello"],
            { folder: "test_data/search/2", disableFindAll: '', test: "", locale: "en-US" },
            '... (To show more result, restart typrm with --found-count-max option)\n' +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':99:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':101:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':103:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':105:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':96:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':98:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':100:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':102:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':104:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':106:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n`,
        ], [
            "without tag parameter",
            ["search", "specular"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':25:') + `         ${matchedColor('specular')} reflection light:  ${keywordLabelColor('#keyword:')}  #// out of keyword parameter\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':27:') + `         - ${matchedColor('specular')} reflection:  ${keywordLabelColor('#keyword:')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':24:') + `     ${matchedColor('specular')}:  #// the mirror-like reflection  ${keywordLabelColor('#keyword:')}\n`,
        ], [
            "block-to-disable-tag-tool tag",
            ["search", "document_in_block"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':78:') + `         Making materials:  ${keywordLabelColor('#keyword:')} ${matchedColor('document_in_block')}\n`,
        ], [
            "score tag",
            ["search", "score_tag"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':192:') + `         11: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':195:') + `         13: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':196:') + `     2: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':194:') + `             112: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n`,
        ], [
            "emphasize search and ref tag",
            ["search", "picture"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':62:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('picture')}  ${refColor('#ref: path')}  #search: ${searchColor('keyword')}\n` +
                'path\n' +
                '    0.Folder\n',
        ], [
            "Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('ABC')}: abc\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ], [
            "target is file",
            ["search", "wonderful"],
            { folder: "test_data/search/2/2.yaml", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':85:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('wonderful')}\n`,
        ], [
            "file extension filter",
            ["search", "target"],
            { folder: "test_data/search/3/*.yaml", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/3/31.yaml') + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('target')}\n`,
        ], [
            "Windows typrm folder path",
            ["search", "ABC"],
            { folder: `${process.cwd()}\\test_data\\search\\1`, disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ],
    ])("%s", async (caseName, arguments_, options, answer) => {
        const isWindowsEnvironment = (path.sep === '\\');
        const isWindowsCase = (caseName.indexOf('Windows') !== notFound);
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
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_checking/thesaurus/1.yaml') + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('PowerShell')}\n`,
            ], [
                "ignore case",
                ["search", "ps"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/_checking/thesaurus/1.yaml') + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('PowerShell')}\n`,
            ],
        ])("%s", async (caseName, arguments_, options, answer) => {
            chdirInProject('src');
            const sourceFileContents = lib.getSnapshot(`searches keyword tag >> thesaurus >> ${caseName}: sourceFileContents 1`);
            const thesaurusFileContents = lib.getSnapshot(`searches keyword tag >> thesaurus >> ${caseName}: thesaurus 1`);
            lib.rmdirSync(testFolderPath + '_checking');
            writeFileSync(`test_data/_checking/thesaurus/1.yaml`, sourceFileContents);
            writeFileSync(`test_data/_checking/thesaurus/thesaurus.csv`, thesaurusFileContents);
            await callMain(arguments_, options);
            chdirInProject('src');
            expect(main.stdout).toBe(answer);
            lib.rmdirSync(testFolderPath + '_checking');
        });
    });
});
describe("searches glossary tag >>", () => {
    test.each([
        [
            "1st",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('ABC')}: abc\n`,
        ], [
            "ignore case",
            ["search", "abc"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('ABC')}: abc\n`,
        ], [
            "word",
            ["search", "AB"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('AB')}C: abc\n`,
        ], [
            "nested indent",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('ABC')}D: abcd\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':4:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('ABC')}: abc\n`,
        ], [
            "skip comment",
            ["search", "comment"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':26:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('comment')}: hit\n`,
        ], [
            "output order (1)",
            ["search", "de"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('DE')}: de\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('de')}: de\n`,
        ], [
            "output order (2)",
            ["search", "DE"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':9:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('de')}: de\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':8:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('DE')}: de\n`,
        ], [
            "output order (3)",
            ["search", "search score comparison glossary"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':39:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('search')} ${matchedColor('score')}:        ${matchedColor('comparison')} ${matchedColor('glossary')} and keyword: 3\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':41:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('search')} ${matchedColor('score')} ${matchedColor('comparison')} ${matchedColor('glossary')} and keyword\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':38:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('search')} ${matchedColor('score')}:        ${matchedColor('comparison')} ${matchedColor('glossary')}: 2\n`,
        ], [
            "glossary is less score than keyword",
            ["search", "grape"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':11:') + ` ${keywordLabelColor('#glossary:')}         ${matchedColor('grape')}:\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':14:') + ` ${keywordLabelColor('#glossary:')}         ${matchedColor('grape')}:\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':12:') + `     keyword:  ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}\n`,
        ], [
            "glossary with empty line",
            ["search", "space"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':17:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('space')}1:\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':19:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('space')}2:\n`,
        ], [
            "glossary with parameters (1)",
            ["search", "category1 apple"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':22:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('category1')}:    ${matchedColor('apple')}: juice\n`,
        ], [
            "glossary with parameters (2)",
            ["search", "apple category1"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':22:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('category1')}:    ${matchedColor('apple')}: juice\n`,
        ], [
            "emphasize search and ref tag",
            ["search", "picture"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':28:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('picture')}:  ${refColor('#ref: path#hash')}  #search: ${searchColor('keyword')}\n` +
                'path#hash\n' +
                '    0.Folder\n',
        ], [
            "nested glossary tag",
            ["search", "turnip"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':33:') + ` ${keywordLabelColor('#glossary:')} level-2:        white ${matchedColor('turnip')}:\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':34:') + ` ${keywordLabelColor('#glossary:')} level-1:    ${matchedColor('turnip')} soup:\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':32:') + ` ${keywordLabelColor('#glossary:')} level-2:        red ${matchedColor('turnip')}:\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/2/2.yml') + lineNumColor(':31:') + ` ${keywordLabelColor('#glossary:')} level-1:    ${matchedColor('turnip')}: #glossary: level-2\n`,
        ], [
            "Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/glossary/1/1.yaml') + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')}     ${matchedColor('ABC')}: abc\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/1/1.yaml') + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});
describe("find all >>", () => {
    test.each([
        [
            "1st",
            ["search", "find_all_abc"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':108:') + `     ${matchedColor('find_all_abc')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':110:') + `     ${matchedColor('find_all_abc')}\n`,
        ], [
            "shffle",
            ["search", "find_all_1  find_all_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':117:') + `     ${matchedColor('find_all_1')} find_all_3 ${matchedColor('find_all_2')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':114:') + `     ${matchedColor('find_all_2')} ${matchedColor('find_all_1')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':113:') + `     ${matchedColor('find_all_1')} ${matchedColor('find_all_2')}\n`,
        ], [
            "shffle jp",
            ["search", "find_all_1\u{3000}find_all_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':117:') + `     ${matchedColor('find_all_1')} find_all_3 ${matchedColor('find_all_2')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':114:') + `     ${matchedColor('find_all_2')} ${matchedColor('find_all_1')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':113:') + `     ${matchedColor('find_all_1')} ${matchedColor('find_all_2')}\n`,
        ], [
            "full match",
            ["search", "full_match_1  full_match_1  full_match_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':120:') + `     ${matchedColor('full_match_1')}  ${matchedColor('full_match_2')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':119:') + `     ${matchedColor('full_match_1  full_match_1  full_match_2')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':122:') + `     ${matchedColor('full_match_1  full_match_1  full_match_2')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':123:') + `     ${matchedColor('full_match_1  full_match_1  full_match_2')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':124:') + `     ${matchedColor('full_match_1  full_match_1  full_match_2')}\n`,
        ], [
            "full match or keyword tag",
            ["search", "fk_1 fk_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':144:') + `     ${matchedColor('fk_1 fk_2')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':145:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('fk_1')} ${matchedColor('fk_2')}\n`,
        ], [
            "part full match or keyword tag",
            ["search", "pf_1 pf_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':154:') + `     ${matchedColor('pf_1')}________ ${matchedColor('pf_2')}__________\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':155:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('pf_1')}__ ${matchedColor('pf_2')}__\n`,
        ], [
            "search tag",
            ["search", "- link  #search: find_search_tag_1"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':128:') + `     ${matchedColor(`-`)} ${matchedColor(`link`)}  ${matchedColor(`#search:`)} ${matchedColor(`find_search_tag_1`)}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':127:') + `     - ${keywordLabelColor('#keyword:')} ${matchedColor('find_search_tag_1')}\n`,
        ], [
            "full match replaced from search tag",
            ["search", "- link  #search: find_search_tag_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':148:') + `     ${matchedColor(`-`)} ${matchedColor(`link`)}  ${matchedColor(`#search:`)} ${matchedColor(`find_search_tag_2`)}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':147:') + `     - link  ${keywordLabelColor('#keyword:')} ${matchedColor(`find_search_tag_2`)}\n`,
        ], [
            "full match with colon",
            ["search", "- find_search_tag_3 :"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':151:') + `     ${matchedColor(`- find_search_tag_3`)} :\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/2/2.yaml') + lineNumColor(':150:') + `     ${matchedColor(`- find_search_tag_3`)}\n`,
            // The order does not matter
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
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/mutual/1/1.yaml') + lineNumColor(':2:') + ` Target: ${keywordLabelColor('#keyword:')} ${matchedColor('AAA')}\n`,
        ], [
            "mutual_tag",
            ["search", "#mutual: AAA"],
            { folder: "test_data/search/mutual/1", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/mutual/1/1.yaml') + lineNumColor(':1:') + ` Index: #search: ${matchedColor('AAA')}\n` +
                pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/mutual/1/1.yaml') + lineNumColor(':2:') + ` Target: ${keywordLabelColor('#keyword:')} ${matchedColor('AAA')}\n`,
        ], [
            "not mutual",
            ["search", "AAA"],
            { folder: "test_data/search/mutual/1", disableFindAll: "", test: "", locale: "en-US" },
            pathColor('${HOME}/GitProjects/GitHub/typrm/src/test_data/search/mutual/1/1.yaml') + lineNumColor(':2:') + ` Target: ${keywordLabelColor('#keyword:')} ${matchedColor('AAA')}\n`,
        ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});
describe("print reference >>", () => {
    describe("basic >>", () => {
        test.each([
            [
                "1st",
                ["search", "#ref:", "${TEST_ENV}/file.txt"],
                { locale: "en-US", test: "" },
                "testEnv/file.txt\n" +
                    "    0.Folder\n",
            ], [
                "multi parameters",
                ["search", " #ref:", "${TEST_ENV}/file1.txt", "${TEST_ENV}/${TEST_ENV}/file2.txt"],
                { locale: "en-US", test: "" },
                "testEnv/file1.txt testEnv/testEnv/file2.txt\n" +
                    "    0.Folder\n",
            ], [
                "escape",
                ["search", "#ref:", "\\${TEST_ENV}", "-\\${TEST_ENV}-", "/${TEST_ENV}"],
                { locale: "en-US", test: "" },
                "${TEST_ENV} -${TEST_ENV}- /testEnv\n" +
                    "    0.Folder\n",
            ], [
                "path",
                ["search", "#ref:", "~/.ssh  folder/f1.txt  ${TEST_PATH}  escaped\\ space  /root  //pc"],
                { locale: "en-US", test: "" },
                lib.getHomePath() + "/.ssh  folder/f1.txt  C:/Test  escaped\\ space  /root  //pc\n" + // TYPRM_TEST_PATH has \ but print replaced to /
                    "    0.Folder\n",
            ], [
                "shared folder",
                ["search", "#ref:", "\\\\pc\\folder\\file.txt"],
                { locale: "en-US", test: "" },
                "\\\\pc\\folder\\file.txt\n" +
                    "    0.Folder\n",
            ],
        ])("%s", async (_caseName, arguments_, options, answer) => {
            chdirInProject('src');
            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });
    describe("line number getter >>", () => {
        test.each([
            [
                "lineNum",
                ["search", "#ref:", "test_data/search/2/2.yaml#lineNum"],
                { locale: "en-US", test: "" },
                "test_data/search/2/2.yaml:69\n" +
                    "    0.Folder\n",
            ], [
                "second match",
                ["search", "#ref:", "test_data/search/2/2.yaml:csv#lineNum,lineNum"],
                { locale: "en-US", test: "" },
                "test_data/search/2/2.yaml:86\n" +
                    "    0.Folder\n",
            ], [
                "keyword list",
                ["search", "#ref:", "test_data/search/2/2.yaml:csv#firstKeyword, secondKeyword"],
                { locale: "en-US", test: "" },
                "test_data/search/2/2.yaml:91\n" +
                    "    0.Folder\n",
            ], [
                "(error) lineNum not found",
                ["search", "#ref:", "test_data/search/2/2.yaml#notFound"],
                { locale: "en-US", test: "" },
                "test_data/search/2/2.yaml:0\n" +
                    "    0.Folder\n",
            ], [
                "(error) file not found",
                ["search", "#ref:", "test_data/search/2/notFound.yaml#notFound"],
                { locale: "en-US", test: "" },
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
                ["search", "#ref:", lib.getHomePath() + "/.ssh  testEnv/file1.txt  testEnv\\testEnv\\file2.txt  C:\\Test\\user1  c:\\Test  \\root  \\\\pc  last\\"],
                { locale: "en-US", test: "" },
                "Recommend: #ref: ~/.ssh  ${TEST_ENV}/file1.txt  ${TEST_ENV}/${TEST_ENV}/file2.txt  ${TEST_PATH}/user1  ${TEST_PATH}  /root  //pc  last/\n" +
                    lib.getHomePath().replace(/\\/g, '/') + "/.ssh  testEnv/file1.txt  testEnv/testEnv/file2.txt  C:/Test/user1  c:/Test  /root  //pc  last/\n" +
                    "    0.Folder\n",
            ], [
                "recommend (2)",
                ["search", "#ref: '/User'"],
                { locale: "en-US", test: "" },
                "Recommend: #ref: /User\n" +
                    "/User\n" +
                    "    0.Folder\n",
            ], [
                "Do not recommend reserved variables",
                ["search", `#ref: TYPRM_FOLDER`],
                { locale: "en-US", test: "" },
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
                delete process.env.TYPRM_FOLDER;
            }
        });
    });
    describe("verb >>", () => {
        test.each([
            [
                "verb",
                ["search", "#ref:", "../README.md", "7"],
                { commandFolder: ".", locale: "en-US", test: "" },
                "{ref: ../README.md, windowsRef: ..\\README.md, file: ../README.md, windowsFile: ..\\README.md, fragment: }\n",
            ], [
                "verb (2)",
                ["search", "#ref:", "../README.md#title", "7"],
                { commandFolder: ".", locale: "en-US", test: "" },
                "{ref: ../README.md#title, windowsRef: ..\\README.md#title, file: ../README.md, windowsFile: ..\\README.md, fragment: title}\n",
            ], [
                "verb error",
                ["search", "#ref:", "../README.md", "4"],
                { locale: "en-US", test: "" },
                "Error that verb number 4 is not defined\n",
            ], [
                "not found the folder",
                ["search", "#ref:", "/Unknown_", "0"],
                { locale: "en-US", test: "" },
                "Error of not found the file or folder at \"/Unknown_\"\n",
            ], [
                "verb verbose",
                ["search", "#ref:", "../README.md", "4"],
                { locale: "en-US", test: "", verbose: "" },
                (testingOS === 'Windows')
                    ? // Windows
                        "Verbose: Option and environment variables:\n" +
                            "    Verbose: TYPRM_TEST_ENV = testEnv\n" +
                            "    Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                            "    Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                            "        Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                            "        Verbose: type: text\n" +
                            "        Verbose: filePathRegularExpressionIndex: 1\n" +
                            "        Verbose: keywordRegularExpressionIndex: 7\n" +
                            "        Verbose: csvOptionRegularExpressionIndex: 3\n" +
                            "        Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                            "        Verbose: address: ${file}:${lineNum}\n" +
                            "    Verbose: TYPRM_VERB[0]:\n" +
                            "        Verbose: regularExpression: ^.*\\.md(#.*)?\$\n" +
                            "        Verbose: label: 7.Test Echo\n" +
                            "        Verbose: number: 7\n" +
                            "        Verbose: command: echo {ref: \${ref}, windowsRef: ${windowsRef}, file: \${file}, windowsFile: ${windowsFile}, fragment: \${fragment}}\n" +
                            "    Verbose: TYPRM_VERB[1]:\n" +
                            "        Verbose: regularExpression: ^.*\\.(svg|svgz)(#.*)?\$\n" +
                            "        Verbose: label: 1.View\n" +
                            "        Verbose: number: 1\n" +
                            "        Verbose: command: msedge \"file://\${file}\"\n" +
                            "    Verbose: (.env) TEST_SECRET = (secret)\n" +
                            "    Verbose: (.env) TEST_SECRET_2 = (secret)\n" +
                            '    Verbose: Envrironment variables defined in ".env" file are not inherit to child processes.\n' +
                            "Verbose: typrm command: search\n" +
                            "Verbose: Parsed by TYPRM_LINE_NUM_GETTER:\n" +
                            "    Verbose: address: ../README.md\n" +
                            "    Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                            "    Verbose: filePathRegularExpressionIndex: 1\n" +
                            "    Verbose: keywordRegularExpressionIndex: 7\n" +
                            "    Verbose: csvOptionRegularExpressionIndex: 3\n" +
                            "    Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                            "    Verbose: matched: [../README.md, ../README.md, md, , , , , ]\n" +
                            "Error that verb number 4 is not defined\n"
                    : // mac
                        "Verbose: Option and environment variables:\n" +
                            "    Verbose: TYPRM_TEST_ENV = testEnv\n" +
                            "    Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                            "    Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                            "        Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                            "        Verbose: type: text\n" +
                            "        Verbose: filePathRegularExpressionIndex: 1\n" +
                            "        Verbose: keywordRegularExpressionIndex: 7\n" +
                            "        Verbose: csvOptionRegularExpressionIndex: 3\n" +
                            "        Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                            "        Verbose: address: ${file}:${lineNum}\n" +
                            "    Verbose: TYPRM_VERB[0]:\n" +
                            "        Verbose: regularExpression: ^.*\\.md(#.*)?\$\n" +
                            "        Verbose: label: 7.Test Echo\n" +
                            "        Verbose: number: 7\n" +
                            "        Verbose: command: echo  \"{ref: \${ref}, windowsRef: \${windowsRef}, file: \${file}, windowsFile: \${windowsFile}, fragment: \${fragment}}\"\n" +
                            "    Verbose: TYPRM_VERB[1]:\n" +
                            "        Verbose: regularExpression: ^.*\\.(svg|svgz)(#.*)?\$\n" +
                            "        Verbose: label: 1.View\n" +
                            "        Verbose: number: 1\n" +
                            "        Verbose: command: \"/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome\" \"file://\${file}\"\n" +
                            "    Verbose: (.env) TEST_SECRET = (secret)\n" +
                            "    Verbose: (.env) TEST_SECRET_2 = (secret)\n" +
                            '    Verbose: Envrironment variables defined in ".env" file are not inherit to child processes.\n' +
                            "Verbose: typrm command: search\n" +
                            "Verbose: Parsed by TYPRM_LINE_NUM_GETTER:\n" +
                            "    Verbose: address: ../README.md\n" +
                            "    Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                            "    Verbose: filePathRegularExpressionIndex: 1\n" +
                            "    Verbose: keywordRegularExpressionIndex: 7\n" +
                            "    Verbose: csvOptionRegularExpressionIndex: 3\n" +
                            "    Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                            "    Verbose: matched: [../README.md, ../README.md, md, , , , , ]\n" +
                            "Error that verb number 4 is not defined\n",
            ],
            // Others test is "search_mode_ref_verb".
        ])("%s", async (_caseName, arguments_, options, answer) => {
            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });
});
describe("unit test >>", () => {
    describe("makeSettingTree >>", () => {
        test.each([
            ["1st", { sameInput: "replaces settings >> in 2_replace_11_nested_if: sourceFileContents 1" }],
            ["bug_case", {}],
            ["if_and_no_indent", {}],
            ["below_shallow_settings", { sameInput: "checks template value >> settings >> b2_bug_case_nest_settings: sourceFileContents 1" }],
            ["bug_case_2", {}],
            ["bug_case_3", { checkSettings: true }],
            ["bug_case_4", {}],
        ])("%s", async (caseName, options) => {
            const Parser = main.private_.Parser;
            const makeSettingTree = main.private_.makeSettingTree;
            const { inputContents } = initializeTestInputFile(`unit test >> makeSettingTree >> ${caseName}: sourceFileContents 1`);
            if ('sameInput' in options) {
                expect(inputContents).toBe(lib.getSnapshot(options.sameInput));
            }
            const answerIndicesWithIf = Array.from(await lib.parseMap(lib.getSnapshot(`unit test >> makeSettingTree >> ${caseName}: answer indicesWithIf 1`)));
            const parser = new Parser();
            parser.filePath = `test_data/_tmp/_tmp.yaml`;
            const settingsTree = await makeSettingTree(parser);
            expect(Array.from(settingsTree.indicesWithIf)).toStrictEqual(answerIndicesWithIf);
            if ('checkSettings' in options) {
                expect(settingsTree.settings).toMatchSnapshot('settings');
            }
            lib.rmdirSync(testFolderPath + '_tmp');
        });
    });
    describe("makeReplaceToTagTree >>", () => {
        test.each([
            ["1st", { sameInput: "replaces settings >> replace to tag >> E2_BugCase_ParentSettings: sourceFileContents 1" }],
            ["bug_case_3", {}],
            ["bug_case_5", { sameInput: "replaces settings >> replace to tag >> bug_case_5: sourceFileContents 1" }],
        ])("%s", async (caseName, options) => {
            const Parser = main.private_.Parser;
            const makeSettingTree = main.private_.makeSettingTree;
            const makeReplaceToTagTree = main.private_.makeReplaceToTagTree;
            const { inputContents } = initializeTestInputFile(`unit test >> makeReplaceToTagTree >> ${caseName}: sourceFileContents 1`);
            if ('sameInput' in options) {
                expect(inputContents).toBe(lib.getSnapshot(options.sameInput));
            }
            const parser = new Parser();
            parser.filePath = `test_data/_tmp/_tmp.yaml`;
            const settingsTree = await makeSettingTree(parser);
            const toTagTree = await makeReplaceToTagTree(parser, settingsTree);
            expect(toTagTree.replaceTo).toMatchSnapshot('replaceTo');
            lib.rmdirSync(testFolderPath + '_tmp');
        });
    });
});
describe("test of test >>", () => {
    test("checks snapshots files are confirmed", () => {
        const activeSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap').toString();
        const backUpSnapshots = fs.readFileSync('__snapshots__/main.test.ts.snap.confirmed-ts').toString();
        // You muse edit "main.test.ts.snap.confirmed-ts" file using the text file comparison tool.
        // #search: typrm checks snapshots files are confirmed
        expect(activeSnapshots).toBe(backUpSnapshots);
    });
});
afterAll(() => {
    chdirInProject('src');
    deleteFileSync('test_data/_output.txt');
    lib.rmdirSync('empty_folder');
});
// chdirInProject
// #keyword: chdirInProject
function chdirInProject(relativePath) {
    const projectPath = path.dirname(__dirname);
    process.chdir(projectPath);
    process.chdir(relativePath);
}
// initializeTestInputFile
function initializeTestInputFile(snapshotName) {
    chdirInProject('src');
    const filePath = `${testFolderPath}_tmp/_tmp.yaml`;
    const inputContents = lib.getSnapshot(snapshotName);
    if (fs.existsSync(`${testFolderPath}_tmp`)) {
        lib.rmdirSync(`${testFolderPath}_tmp`);
    }
    writeFileSync(filePath, inputContents);
    return { filePath, inputContents };
}
// writeFileSync
// #keyword: writeFileSync
// This also makes the copy target folder.
function writeFileSync(filePath, fileContents) {
    const destinationFolderPath = path.dirname(filePath);
    fs.mkdirSync(destinationFolderPath, { recursive: true });
    fs.writeFileSync(filePath, fileContents);
}
// deleteFileSync
// #keyword: deleteFileSync, unlinkSync
// This does not occurr any errors, even if there is not the file at the specified path.
function deleteFileSync(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}
// getFullPath
function getFullPath(relativePath, basePath) {
    var fullPath = "";
    if (relativePath.substr(0, 1) === "/") {
        fullPath = relativePath;
    }
    else {
        fullPath = path.join(basePath, relativePath);
    }
    return fullPath;
}
// printDifferentPaths
function printDifferentPaths(path1, path2) {
    console.log(`Error: different between the following files`);
    console.log(`  Path1: ${testFolderFullPath + path1}`);
    console.log(`  Path2: ${testFolderFullPath + path2}`);
}
const testFolderFullPath = getFullPath(`../src/${testFolderPath}`, __dirname);
expect.extend({
    because(isPassed, errorMessage) {
        return {
            pass: isPassed,
            message: () => errorMessage,
        };
    },
});
const cutBOM = 1;
const notFound = -1;
//# sourceMappingURL=main.test.js.map