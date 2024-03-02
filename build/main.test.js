import * as fs from "fs";
import * as path from "path";
import * as main from './main.js';
import chalk from "chalk";
import * as lib from './lib.js';
const callMain = main.callMainFromJest;
process.env['typrm_aaa'] = 'aaa';
process.chdir(__dirname);
const projectRelativePath = path.dirname(__dirname).substring(lib.getHomePath().length + 1);
const normalizedProjectRoot = path.dirname(__dirname.replace(/\\/g, "/").replace(/^C/, "c"));
const typrmProject = '${typrmProject}'; // "getTestablePath" in "main.ts" changes paths to "${typrmProject}".
const testFolderPath = `test_data` + path.sep;
const matchedColor = chalk.green.bold;
const keywordLabelColor = chalk.gray;
const alarmLabelColor = chalk.redBright;
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
process.env.TYPRM_TEST_ENV = lib.getFullPath('test_data', __dirname);
process.env.TYPRM_TEST_SEARCH = 'search';
process.env.TYPRM_TEST_ENV2 = 'testEnv';
process.env.TYPRM_TEST_PATH = 'C:\\Test';
const defaultUsesLineNumGetter = true;
if (defaultUsesLineNumGetter) {
    process.env.TYPRM_LINE_NUM_GETTER = `
        - #
            regularExpression: ^https?://
            type: keep
        - #
            regularExpression: ^(.*\\.html)(:csv)?(:id=([0-9]+))?(#(.*))?\$
            type: keep
            filePathRegularExpressionIndex: 1
        - #
            regularExpression: ^(.*?)(:csv)?(:id=([0-9]+))?(#(.*))?\$
            type: text
            filePathRegularExpressionIndex: 1
            keywordRegularExpressionIndex: 6
            csvOptionRegularExpressionIndex: 2
            targetMatchIdRegularExpressionIndex: 4
            address: "\${file}:\${lineNum}"
    `;
}
else {
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
}
if (testingOS === 'Windows') {
    process.env.TYPRM_VERB = `
        - #
            label: 7.Test Echo
            number: 7
            regularExpression: ^.*\\.(md|html)(#.*)?\$
            command: 'echo {ref: \${ref}, windowsRef: \${windowsRef}, file: \${file}, windowsFile: \${windowsFile}, existingAddress: \${existingAddress}, windowsExistingAddress: \${windowsExistingAddress}, fragment: \${fragment}, lineNum: \${lineNum}}'
        - #
            label: 1.View
            number: 1
            regularExpression: ^.*\\.(svg|svgz)(#.*)?\$
            command: 'msedge "file://\${file}"'
    `;
}
else {
    // "wr" and "wf" avoids to escape by back slash. 
    process.env.TYPRM_VERB = `
        - #
            label: 7.Test Echo
            number: 7
            regularExpression: ^.*\\.(md|html)(#.*)?\$
            command: "wr='\${windowsRef}' wf='\${windowsFile}' we='\${windowsExistingAddress}'  bash -c  'echo  \\"{ref: \${ref}, windowsRef: \${wr}, file: \${file}, windowsFile: \${wf}, existingAddress: \${existingAddress}, windowsExistingAddress: \${we}, fragment: \${fragment}, lineNum: \${lineNum}}\\"'"
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
            ['search_mode', 'test_data/search/1', 'ABC\nexit()\n', ''],
            ['search_mode_without_tags', 'test_data/search/1', 'Not\nexit()\n', ''],
            ['search_mode_snippet', 'test_data/search/2', 'snippet_keyword\nexit()\n', ''],
            ['snippet_depth_1', 'test_data/search/2', 'snippet_depth_1\nexit()\n', ''],
            ['snippet_depth_2', 'test_data/search/2', 'snippet_depth_2\nexit()\n', ''],
            ['snippet_depth_3', 'test_data/search/2', 'snippet_depth_3\nexit()\n', ''],
            ['snippet_environment_variable', 'test_data/search/2', 'snippet_environment_variable\nexit()\n', '-' + testingOS],
        ])("%s", async (caseName, folder, input, snapshotTag) => {
            chdirInProject('src');
            var typrmOptions = {
                folder, test: "", locale: "en-US", input,
            };
            const normalCase = (caseName !== 'snippet_environment_variable');
            if (normalCase) {
                await callMain([], typrmOptions);
                expect(lib.cutEscapeSequence(main.stdout)).toMatchSnapshot('stdout' + snapshotTag);
            }
            else if (caseName === 'snippet_environment_variable') {
                const typrmProjectPath = '${HOME}\\\\' + projectRelativePath;
                var answerFileContents = lib.getSnapshot(`typrm shell >> search >> snippet_environment_variable: stdout${snapshotTag} 1`);
                if (testingOS === 'Windows') {
                    answerFileContents = lib.replace(answerFileContents, [
                        { from: '${HOME}\\\\GitProjects\\\\GitHub\\\\typrm', to: typrmProjectPath },
                    ]).replace(/\\\\/g, '\\');
                }
                else {
                    answerFileContents = lib.replace(answerFileContents, [
                        { from: '${HOME}/GitProjects/GitHub/typrm', to: typrmProjectPath.replace(/\\\\/g, '/') },
                    ]);
                }
                await callMain([], typrmOptions);
                expect(lib.cutEscapeSequence(main.stdout)).toBe(answerFileContents);
            }
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
describe("checks >> template value >>", () => {
    test.each([
        ["1_template_1_ok", {}],
        ["1_template_2_error", {}],
        ["1_template_3_if", {}],
        ["var_not_ref_1_error", {}],
        ["template_if_1_error", {}],
        ["template_if_2_referenced_one_side", {}],
        ["case_sensitive_variable_name", {}],
        ["environment_variable", {}],
        ["list_to_tag_original_tag", {}],
        ["list_to_tag_original_tag_in_multi_files", { multiFiles: true }],
        ["settings_tree", {}],
        ["settings_tree_deep", {}],
        ["settings_tree_position", {}],
        ["settings_tree_if", {}],
        ["settings_tree_if_disable", {}],
        ["settings_tree_error", {}],
    ])("%s", async (caseName, options) => {
        initializeTestInputFile(`checks template value >> ${caseName}: sourceFileContents 1`);
        if ('multiFiles' in options) {
            chdirInProject('src');
            writeFileSync(`${testFolderPath}_tmp/_tmp_2.yaml`, lib.getSnapshot(`checks template value >> ${caseName}: sourceFileContents 2`));
        }
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
            ["1st",
                "empty_folder",
                ["check"],
            ], ["with current folder",
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
            ["1_same_values"],
            ["2_not_same_values_error"],
            ["3_overwrite"],
            ["3e_overwrite_error"],
            ["4_neighbor_error"],
            ["4_2_neighbor_level_2_error"],
            ["5_check_same_as_tag"],
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
describe("checks >> file contents >>", () => {
    test.each([
        ["OK",
        ], ["NG",
        ], ["file name",
        ], ["if",
        ], ["exist_if",
        ], ["any_lines",
        ], ["empty_line",
        ], ["environment_variable",
        ], ["multi_paths",
        ]
    ])("First >> %s", async (caseName) => {
        chdirInProject('src');
        const typrmProjectPath = "~/" + projectRelativePath.replace(/\\\\/g, '/');
        var sourceFileContents = lib.getSnapshot(`checks file contents >> First >> ${caseName}: sourceFileContents 1`);
        const changingFilePath = 'test_data/_checking/document/' + caseName + "_1_changing.yaml";
        sourceFileContents = lib.replace(sourceFileContents, [
            { from: "~/GitProjects/GitHub/typrm", to: typrmProjectPath },
            { from: "~/GitProjects/GitHub/typrm", to: typrmProjectPath }, // 2nd replace
        ]);
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
        ["all", ["check"],
        ], ["file in 1st folder", ["check", "file_1.yaml"],
        ], ["file in 2nd folder", ["check", "file_2.yaml"],
        ], ["full path", ["check", getFullPath("test_data/_checking/2/file_2.yaml", process.cwd())],
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
describe("checks >> copy tag >>", () => {
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
                    { from: 'good_color($copy.__VariableA__)', to: `${goodColor('$copy.')}__${goodColor('V')}a${goodColor('riableA')}__` },
                    { from: 'bad_color(__Bad__)', to: `__${badColor('B')}a${badColor('d')}__` },
                ] }],
        ['template >> 1 >> NG-2', { replacers: [
                    { from: 'good_color(__Bad__)', to: `__${goodColor('B')}a${goodColor('d')}__` },
                    { from: 'bad_color($copy.__VariableA__)', to: `${badColor('$copy.')}__${badColor('V')}a${badColor('riableA')}__` },
                    { from: 'good_color(__Bad__)', to: `__${goodColor('B')}a${goodColor('d')}__` },
                    { from: 'bad_color($copy.__VariableA__)', to: `${badColor('$copy.')}__${badColor('V')}a${badColor('riableA')}__` },
                ] }],
        ['template >> default value', { replacers: [
                    { from: 'good_color($copy.__VariableA__, $copy.__VariableB__)', to: `${goodColor('$copy.')}__${goodColor('V')}a${goodColor('riableA')}__, ${goodColor('$copy.__Varia')}b${goodColor('leB__')}` },
                    { from: 'bad_color(__Bad__, b2)', to: `__${badColor('B')}a${badColor('d')}__, b${badColor('2')}` },
                    { from: 'good_color($copy.__VariableA__, $copy.__VariableB__)', to: `${goodColor('$copy.__V')}a${goodColor('riableA__')}, ${goodColor('$copy.')}__${goodColor('Variable')}B__` },
                    { from: 'bad_color(a1, __Bad__)', to: `a${badColor('1')}, __B${badColor('ad')}__` },
                ] }],
        ['template >> variable', { replacers: [
                    { from: 'good_color($copy.__VariableA__)', to: `${goodColor('$copy.')}__${goodColor('V')}a${goodColor('riableA')}__` },
                    { from: 'bad_color(__Bad__)', to: `__${badColor('B')}a${badColor('d')}__` },
                    { from: '[$copy.__VariableA__]', to: `[${goodColor('$copy.__VariableA__')}]` },
                    { from: '__Bad__', to: `${badColor('__Bad__')}` },
                    { from: 'good_color($copy.__VariableA__)', to: `${goodColor('$copy.__VariableA__')}` },
                    { from: 'bad_color(s1)', to: badColor('s1') },
                    { from: 'good_color($settings.__SetA__)', to: `${goodColor('$settings.__SetA__')}` },
                    { from: 'bad_color(bad):', to: `${badColor('bad')}:` },
                    { from: 'good_color($settings.__SetA__)', to: `${goodColor('$settings.__SetA__')}` },
                    { from: 'bad_color(bad):', to: `${badColor('bad')}:` },
                ] }],
        ['bug_1_continual_template', null],
        ['bug_2_template_in_deep_indent', null],
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
describe("replaces >> settings >>", () => {
    test.each([
        ['1_replace', '', 'en-US', null,
        ], ['2_replace_1_ok', ' setting 1', 'en-US',
            { replacers: [
                    { from: 'key1: value1', to: 'key1: value1  #to: value1changed' },
                    { from: '__Key2__: value2', to: '__Key2__: value2  #to: value2changed' },
                    { from: 'Key3: value3', to: 'Key3: value3  #to: value3changed' },
                ] },
        ], ['2_replace_1_ok', ' setting 2', 'en-US',
            { replacers: [{ from: 'key1: value11', to: 'key1: value11  #to: value1changed' }] },
        ], ['2_replace_1A_end_of_template', '', 'en-US', null,
        ], ['2_replace_2_error', '', 'en-US', null,
        ], ['2_replace_3_English', '', 'en-US', null,
        ], ['2_replace_4_Japanese', '', 'ja-JP', null,
        ], ['2_replace_5_with_environment_variable', '', '', null,
        ], ['2_replace_6_if', ' in if block', 'en-US',
            { replacers: [{ from: '__Setting1__: yes', to: '__Setting1__: yes  #to: replaced' }] },
        ], ['2_replace_6_if', ' in if variable', 'en-US',
            { replacers: [{ from: 'fruit: banana', to: 'fruit: banana  #to: melon' }] },
        ], ['2_replace_6_if', ' both', 'en-US',
            { replacers: [
                    { from: 'fruit: banana', to: 'fruit: banana  #to: melon' },
                    { from: '__Setting1__: no', to: '__Setting1__: no  #to: replaced' },
                ] },
        ], ['2_replace_7_undefined_if', '', 'en-US', null,
        ], ['2_replace_8_one_setting', ' without line num', 'en-US', null,
        ], ['2_replace_9_template_if_1_OK', '', 'en-US', null,
        ], ['2_replace_9_template_if_2_NG', '', 'en-US', null,
        ], ['2_replace_9_template_if_3_not_set', '', 'en-US', null,
        ], ['2_replace_9_template_if_4_operators', '', 'en-US', null,
        ], ['2_replace_10_double_check', ' 1_OK', 'en-US',
            { replacers: [
                    { from: '__Full__: folder/file', to: '__Full__: folder/file  #to: fo/fi' },
                    { from: '__Folder__: folder', to: '__Folder__: folder  #to: fo' },
                    { from: '__File__: file', to: '__File__: file  #to: fi' },
                ] },
        ], ['2_replace_10_double_check', ' 2_BadPart', 'en-US',
            { replacers: [
                    { from: '__Full__: folder/file', to: '__Full__: folder/file  #to: fo/fi' },
                    { from: '__File__: file', to: '__File__: file  #to: fi' },
                ] },
        ], ['2_replace_10_double_check', ' 3_NoReplace', 'en-US',
            { replacers: [] },
        ], ['2_replace_11_nested_if', ' AB', 'en-US',
            { replacers: [
                    { from: '__Switch2__: A', to: '__Switch2__: A  #to:B' },
                    { from: '__Switch_02__: A', to: '__Switch_02__: A  #to:B' },
                ] },
        ], ['2_replace_11_nested_if', ' BA', 'en-US',
            { replacers: [
                    { from: '__Switch1__: A', to: '__Switch1__: A  #to:B' },
                    { from: '__Switch_01__: A', to: '__Switch_01__: A  #to:B' },
                ] },
        ], ['2_replace_11_nested_if', ' BB', 'en-US',
            { replacers: [
                    { from: '__Switch1__: A', to: '__Switch1__: A  #to:B' },
                    { from: '__Switch2__: A', to: '__Switch2__: A  #to:B' },
                    { from: '__Switch_01__: A', to: '__Switch_01__: A  #to:B' },
                    { from: '__Switch_02__: A', to: '__Switch_02__: A  #to:B' },
                ] },
        ], ['2_replace_11_nested_if', ' C', 'en-US',
            { replacers: [{ from: '__Set2__: C', to: '__Set2__: C  #to:CC' }] },
        ], ['2_replace_12_case_sensitive_variable', '', 'en-US',
            { replacers: [
                    { from: '__Variable__: Value', to: '__Variable__: Value  #to: After' },
                    { from: '__variable__: value2', to: '__variable__: value2  #to: after2' },
                    { from: '__variable2__: Value2', to: '__variable2__: Value2  #to: After2' },
                ] },
        ], ['2_replace_13_same_as_tag', '', 'en-US', null,
        ], ['2_replace_13e_same_as_tag_error', '', 'en-US', null,
        ], ['bug_1_template_in_copy_tag', '', 'en-US', null,
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
        expect(lib.cutEscapeSequence(main.stdout)).toMatchSnapshot('stdout');
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
            ['2_replace_1_ok', ' setting 2', 'en-US',
                {
                    replacers: [
                        { fromCSV: '手順B:, key1: value11', to: 'key1: value11  #to: value1changed1' },
                        { from: '#original: oldValue3', to: '#to: value3changed' },
                    ],
                    resetAnswer: 'replaces settings >> in 2_replace_1_ok: resetFileContents 1',
                },
            ], ['2_replace_6_if', ' in if block', 'en-US',
                { replacers: [
                        { from: '__Setting1__: yes', to: '__Setting1__: yes  #to: replaced' },
                    ] },
            ], ['2_replace_6_if', ' in if variable', 'en-US',
                { replacers: [
                        { from: 'fruit: banana', to: 'fruit: banana  #to: melon' },
                    ] },
            ], ['2_replace_6_if', ' both', 'en-US',
                {
                    replacers: [
                        { from: '__Setting1__: no', to: '__Setting1__: no  #to: replaced' },
                        { from: 'fruit: banana', to: 'fruit: banana  #to: melon' },
                    ],
                },
            ], ['2_replace_10_double_check', ' 1_OK', 'en-US',
                {
                    replacers: [
                        { from: '__Full__: folder/file', to: '__Full__: folder/file  #to: fo/fi' },
                        { from: '__Folder__: folder', to: '__Folder__: folder  #to: fo' },
                        { from: '__File__: file', to: '__File__: file  #to: fi' },
                    ],
                },
            ], ['2_replace_11_nested_if', ' AB', 'en-US',
                { replacers: [{ from: '__Switch2__: A', to: '__Switch2__: A  #to:B' }] },
            ], ['2_replace_11_nested_if', ' BA', 'en-US',
                { replacers: [{ from: '__Switch1__: A', to: '__Switch1__: A  #to:B' }] },
            ], ['2_replace_11_nested_if', ' BB', 'en-US',
                { replacers: [
                        { from: '__Switch1__: A', to: '__Switch1__: A  #to:B' },
                        { from: '__Switch2__: A', to: '__Switch2__: A  #to:B' },
                    ] },
            ], ['2_replace_11_nested_if', ' C', 'en-US',
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
            ['E3_ReplaceIncludesPart', ''],
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
            expect(lib.cutEscapeSequence(main.stdout)).toMatchSnapshot('stdout');
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
            expect(lib.cutEscapeSequence(verboseOutput)).toMatchSnapshot('verbose');
            lib.rmdirSync(testFolderPath + '_tmp');
        });
    });
});
describe("replaces >> in copy tag >>", () => {
    test.each([
        ['template >> 1'],
        ['template >> error_not_found_variable'],
    ])("%s", async (caseName) => {
        const { filePath } = initializeTestInputFile(`replaces in copy tag >> ${caseName}: sourceFileContents 1`);
        chdirInProject('src');
        // Test Main
        await callMain(["replace", path.basename(filePath)], {
            folder: path.dirname(filePath), test: "", locale: "en-US",
        });
        const updatedFileContents = fs.readFileSync(filePath).toString();
        chdirInProject('src');
        expect(updatedFileContents).toMatchSnapshot('updatedFileContents');
        expect(main.stdout).toMatchSnapshot('stdout');
        lib.rmdirSync(testFolderPath + '_tmp');
    });
});
describe("searches >> keyword tag >>", () => {
    test.each([
        ["1st",
            ["search", "ABC"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ], ["not found",
            ["search", "notFound"],
            { folder: "test_data/search/1", test: "" },
            "",
        ], ["acronym",
            ["s", "ABC"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`
        ], ["ommit command name (1)",
            ["ABC"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`
        ], ["ommit command name (2)",
            ["do", "it"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ], ["space",
            ["search", "do it"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ], ["comma",
            ["search", "a,b"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n`,
        ], ["double quotation",
            ["search", 'double quotation is ".'],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('double')} ${matchedColor('quotation')} ${matchedColor('is')} ${matchedColor('"".')}"\n`,
        ], ["sharp",
            ["search", 'space sharp is #. "parcent 20" is "%20".'],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':94:') + `     ${keywordLabelColor('#keyword:')} "${matchedColor('space')} ${matchedColor('sharp')} ${matchedColor('is')} ${matchedColor('#.')} ${matchedColor('""parcent')}${matchedColor(' 20"')}" i${matchedColor('s ""%20"')}"."\n`,
            // This answer coloring is not correct. Correct behavior is not supported, yet.
            // "%20"# specification is specified in "settings tag and #template tag: replaces settings values" in README.md
        ], ["ignore case",
            ["search", "DO It"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} ${matchedColor('it')}", "a,b"\n`,
        ], ["word(1)",
            ["search", "AB"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], ["word(2)",
            ["search", "do"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('do')}uble quotation is ""."\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} it", "a,b"\n`,
        ], ["trim",
            ["search", " do "],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('do')}uble quotation is ""."\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "${matchedColor('do')} it", "a,b"\n`,
        ], ["ignored keyword",
            ["search", "#search: AB  #keyword: AB"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], ["ignored colon before keyword tag",
            ["search", "AB: #keyword:"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], ["ignored hyphen and colon before keyword tag",
            ["search", "- AB: #keyword:"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('AB')}C, "do it", "a,b"\n`,
        ], ["CSV ignored colon before keyword tag",
            ["search", "A,B: #keyword:"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n`,
        ], ["CSV ignored colon before search tag",
            ["search", "A,B: #search:"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n`,
        ], ["words order score",
            ["search", "aaa bbb"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('bbb')} ${matchedColor('aaa')} xxx\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('aaa')} ${matchedColor('bbb')} xxx\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('bbb')} ${matchedColor('aaa')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('aaa')} ${matchedColor('bbb')}\n`,
        ], ["words order score (2)",
            ["search", "user", "interface"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':10:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('user')} ${matchedColor('interface')}\n`,
        ], ["1 word search score",
            ["search", "second"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':14:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('second')}ary\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':15:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('second')} screen\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':13:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('second')}\n`,
        ], ["word match is better than same case",
            ["search", "ipad"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':17:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('iPad')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':18:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('ipads')}\n`,
        ], ["participle_is_better_than_different_case",
            ["search", "str"],
            { folder: "test_data/search/2", test: "", "foundCountMax": "40" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':242:') + `     full 12: ${matchedColor('str')}ipe\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':241:') + `     full 11: ${matchedColor('STR')}S\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':230:') + `     full 2:  ${matchedColor('str')}.\n` + // "str length" is prior than "str.length"
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':240:') + `     full 8c: ${matchedColor('strer')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':239:') + `     full 8b: ${matchedColor('stred')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':238:') + `     full 8a: ${matchedColor('strs')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':237:') + `     full 7:  ${matchedColor('str')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':236:') + `     full 6b: ${matchedColor('STRs')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':235:') + `     full 6a: ${matchedColor('STR')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':234:') + `     full 3d: ${matchedColor('string')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':233:') + `     full 3c: ${matchedColor('strer')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':232:') + `     full 3b: ${matchedColor('stred')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':231:') + `     full 3a: ${matchedColor('strs')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':229:') + `     full 1:  ${matchedColor('str')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':228:') + `     12: ${keywordLabelColor('#keyword:')} ${matchedColor('str')}ipe\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':227:') + `     11: ${keywordLabelColor('#keyword:')} ${matchedColor('STR')}S\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':226:') + `     8d: ${keywordLabelColor('#keyword:')} ${matchedColor('str')}.replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':225:') + `     8c: ${keywordLabelColor('#keyword:')} ${matchedColor('strer')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':224:') + `     8b: ${keywordLabelColor('#keyword:')} ${matchedColor('stred')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':223:') + `     8a: ${keywordLabelColor('#keyword:')} ${matchedColor('strs')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':222:') + `     7:  ${keywordLabelColor('#keyword:')} ${matchedColor('str')} replace\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':215:') + `     2:  ${keywordLabelColor('#keyword:')} ${matchedColor('str')}.\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':221:') + `     6b: ${keywordLabelColor('#keyword:')} ${matchedColor('STRs')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':220:') + `     6a: ${keywordLabelColor('#keyword:')} ${matchedColor('STR')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':219:') + `     3d: ${keywordLabelColor('#keyword:')} ${matchedColor('string')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':218:') + `     3c: ${keywordLabelColor('#keyword:')} ${matchedColor('strer')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':217:') + `     3b: ${keywordLabelColor('#keyword:')} ${matchedColor('stred')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':216:') + `     3a: ${keywordLabelColor('#keyword:')} ${matchedColor('strs')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':214:') + `     1:  ${keywordLabelColor('#keyword:')} ${matchedColor('str')}\n`,
        ], ["multiple_search_words_hit_is_better_than_one_word",
            ["search", "launch", "json"],
            { folder: "test_data/search/2", test: "", "foundCountMax": "40" },
            // "json others", "json" are not shown.
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':257:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('launch')}pad.${matchedColor('json')}\n`,
        ], ["find_all_many_match_is_better_than_keyword_one_match",
            ["search", "nex", "pre"],
            { folder: "test_data/search/2", test: "", "foundCountMax": "20" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':261:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('nex')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':262:') + `     ${matchedColor('nex')}t ${matchedColor('pre')}v\n`,
        ], ["keyword_tag_and_comment_matched_bug_case",
            ["search", "happy", "turn"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':333:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('happy')}  #// ${matchedColor('turn')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':332:') + `     ${keywordLabelColor('#keyword:')} dummy, ${matchedColor('happy')} ${matchedColor('turn')} 2\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':331:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('happy')} ${matchedColor('turn')}\n`,
        ], ["special_participle",
            ["search", "save", "class"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':251:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('classes')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':249:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('saving')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':250:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('saves')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':248:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('saved')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':247:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('saver')}\n`,
        ], ["target word count",
            ["search", "new task"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':21:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('new')} ${matchedColor('tasks')} only\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':22:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('new')} ${matchedColor('tasks')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':20:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('new')} ${matchedColor('tasks')}\n`,
        ], ["target word count 3",
            ["search", "world wide web"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':67:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('web')} ${matchedColor('World')} ${matchedColor('wide')}, World wide\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':66:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('World')} ${matchedColor('wide')} ${matchedColor('web')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':65:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('World')} ${matchedColor('wide')} ${matchedColor('web')}\n`,
            // line 67 "World wide" is too few matched word count.
        ], ["few_word_count",
            ["search", "mini bluetooth speaker"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':349:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('bluetooth')} ${matchedColor('speaker')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':348:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('bluetooth')} ${matchedColor('mini')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':350:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('mini')} ${matchedColor('speaker')}\n`,
        ], ["idiom_few_word_count_by_word_separator",
            ["search", "docker compose down00"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':268:') + `         ${matchedColor('Docker')} re${matchedColor('compose')} ${matchedColor('Down00')} and any other words\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':269:') + `         ${matchedColor('docker')}-${matchedColor('compose')}-${matchedColor('down00')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':266:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')} ${matchedColor('compose')} ${matchedColor('down00')} -v\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':267:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('Docker')}-${matchedColor('Compose')} ${matchedColor('Down00')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':265:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')}-${matchedColor('compose')} ${matchedColor('down00')}\n`,
        ], ["idiom_few_word_count_by_word_separator_12",
            ["search", "docker compose down12"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':272:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')} ${matchedColor('compose')} ${matchedColor('down12')} -v\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':271:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')}-${matchedColor('compose')} ${matchedColor('down12')}\n`,
        ], ["idiom_few_word_count_by_word_separator_13",
            ["search", "docker compose down13"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':275:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('Docker')}-${matchedColor('Compose')} ${matchedColor('Down13')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':274:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')}-${matchedColor('compose')} ${matchedColor('down13')}\n`,
        ], ["idiom_few_word_count_by_word_separator_14",
            ["search", "docker compose down14"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':278:') + `         ${matchedColor('Docker')} re${matchedColor('compose')} ${matchedColor('Down14')} and any other words\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':277:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')}-${matchedColor('compose')} ${matchedColor('down14')}\n`,
        ], ["idiom_few_word_count_by_word_separator_23",
            ["search", "docker compose down23"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':280:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')} ${matchedColor('compose')} ${matchedColor('down23')} -v\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':281:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('Docker')}-${matchedColor('Compose')} ${matchedColor('Down23')}\n`,
        ], ["idiom_few_word_count_by_word_separator_24",
            ["search", "docker compose down24"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':284:') + `         ${matchedColor('Docker')} re${matchedColor('compose')} ${matchedColor('Down24')} and any other words\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':283:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')} ${matchedColor('compose')} ${matchedColor('down24')} -v\n`,
        ], ["idiom_few_word_count_by_word_separator_34",
            ["search", "docker compose down34"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':287:') + `         ${matchedColor('Docker')} re${matchedColor('compose')} ${matchedColor('Down34')} and any other words\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':286:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('Docker')}-${matchedColor('Compose')} ${matchedColor('Down34')}\n`,
        ], ["test_of_double_space",
            ["search", "big  boss"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':212:') + `     2: ${keywordLabelColor('#keyword:')} super  ${matchedColor('big')}  ${matchedColor('boss')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':211:') + `     1: ${keywordLabelColor('#keyword:')} ${matchedColor('big')}  ${matchedColor('boss')}\n`,
        ], ["compound word",
            ["search", "frame set"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':6:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('frame')}${matchedColor('set')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('frame')} ${matchedColor('set')}\n`,
        ], ["kana_mode",
            ["search", "ぎｔ"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            `keyword="git"\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':253:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('git')}\n`,
        ], ["kana_mode_bug",
            ["search", "ワード"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':255:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('ワード')}\n`,
        ], ["bug case (1)",
            ["search", "go lang"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':81:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Go')}_${matchedColor('lang')}uage.yaml, go\n`,
        ], ["output order (1)",
            ["search", "a,b"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n`,
        ], ["output order (2)",
            ["search", "A,B"],
            { folder: "test_data/search/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ABC, "do it", "${matchedColor('a,b')}"\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} "${matchedColor('A,B')}"\n`,
        ], ["output order (3)",
            ["search", "grape"],
            { folder: "test_data/search/2", disableFindAll: '', test: "", foundCountMax: "99" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':42:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':40:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':41:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('GRAPE')}fruit\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':32:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':30:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':31:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('grape')}fruit\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':43:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':39:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}fruit\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':33:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':29:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}fruit\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':47:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')} juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':45:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')} juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':46:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('GRAPE')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':37:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')} juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':35:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')} juice\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':36:') + `     ${keywordLabelColor('#keyword:')} pink ${matchedColor('grape')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':48:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':44:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('GRAPE')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':38:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':34:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}\n`,
        ], ["output order (4)",
            ["search", "main", "stage"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':51:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('main')}ly ${matchedColor('stage')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':50:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Main')} ${matchedColor('stages')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':52:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('main')} ${matchedColor('stages')}\n`,
        ], ["output order (5)",
            ["search", "silver", "arrow"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':56:') + `     ${keywordLabelColor('#keyword:')} add ${matchedColor('SILVER')} ${matchedColor('arrow')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':54:') + `     ${keywordLabelColor('#keyword:')} add ${matchedColor('SILVER')} ${matchedColor('arrow')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':55:') + `     ${keywordLabelColor('#keyword:')} [silver/super-system], ${matchedColor('SILVER')} ${matchedColor('Arrows')}\n`,
        ], ["output order (6)",
            ["search", "tool", "release"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':59:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Tool')} ${matchedColor('release')} now\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':60:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Tool')} ${matchedColor('release')}, Tool deploy\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':58:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('Tool')} ${matchedColor('release')}, Tool deploy\n`,
        ], ["many result",
            ["search", "hello"],
            { folder: "test_data/search/2", disableFindAll: '', test: "", locale: "en-US" },
            '... (To show more result, restart typrm with --found-count-max option)\n' +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':103:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':101:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':99:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':97:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')} world\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':106:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':104:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':102:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':100:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':98:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':96:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('hello')}\n`,
        ], ["without tag parameter",
            ["search", "specular"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':25:') + `         ${matchedColor('specular')} reflection light:  ${keywordLabelColor('#keyword:')}  #// out of keyword parameter\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':27:') + `         - ${matchedColor('specular')} reflection:  ${keywordLabelColor('#keyword:')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':24:') + `     ${matchedColor('specular')}:  #// the mirror-like reflection  ${keywordLabelColor('#keyword:')}\n`,
        ], ["block-to-disable-tag-tool tag",
            ["search", "document_in_block"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':78:') + `         Making materials:  ${keywordLabelColor('#keyword:')} ${matchedColor('document_in_block')}\n`,
        ], ["cut_long_line",
            ["search", "cut_long_line_keyword"],
            { folder: "test_data/search/2", disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':209:') + `     until_colored_keyword:  #// ---------------------------------------------------------------------------------------------------------------------------------------------------------------- cut_lon\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':208:') + `     ${matchedColor('cut_long_line_keyword')}  found_line:  #// ------------------------------------------------------------------------------------------------------------------------------------------------------------\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':207:') + `     ${matchedColor('cut_long_line_keyword')}  keyword_line:  ${keywordLabelColor('#keyword:')}  #// -----------------------------------------------------------------------------------------------------------------------------------------------\n`,
        ], ["score tag",
            ["search", "score_tag"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':195:') + `         13: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':192:') + `         11: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':196:') + `     2: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':194:') + `             112: ${keywordLabelColor('#keyword:')} ${matchedColor('score_tag')}\n`,
        ], ["emphasize search and ref tag",
            ["search", "picture"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':62:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('picture')}  ${refColor('#ref: /path')}  #search: ${searchColor('keyword')}\n` +
                'ERROR: not found a file or folder at "/path"\n'.replace(/\//g, path.sep) +
                lib.getHomePath() + '\n' +
                '    0.Folder\n',
        ], ["Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('ABC')}: abc\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ], ["target is file",
            ["search", "wonderful"],
            { folder: "test_data/search/2/2.yaml", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':85:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('wonderful')}\n`,
        ], ["file extension filter",
            ["search", "target"],
            { folder: "test_data/search/3/*.yaml", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/3/31.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('target')}\n`,
        ], ["Windows typrm folder path",
            ["search", "ABC"],
            { folder: `${process.cwd()}\\test_data\\search\\1`, disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ], ["normalized_word_count",
            ["parentN1 server"],
            { folder: "test_data/search/2", disableFindAll: '', disableSnippet: '', test: "", thesaurus: "test_data/search/2/thesaurus2.csv" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':354:') + `     ${matchedColor('parentN node1')}  ${keywordLabelColor('#keyword:')} ${matchedColor('server')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':352:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('parentN1')} ${matchedColor('server')}\n`,
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
            ["acronym search keyword",
                ["search", "PS"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('PowerShell')}\n`,
            ], ["acronym keyword tag",
                ["search", "PowerShell"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} PS (${matchedColor('PowerShell')})\n`,
            ], ["ignore case",
                ["search", "ps"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('PowerShell')}\n`,
            ], ["normalized_word_match_1",
                ["search", "ts file"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ts')}x ${matchedColor('file')}\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} JavaScript ${matchedColor('file')} (${matchedColor('TypeScript')} ${matchedColor('file')})\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} js ${matchedColor('file')} (${matchedColor('TypeScript')} ${matchedColor('file')})\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('TypeScript')} ${matchedColor('file')}\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ts')} ${matchedColor('file')}\n`,
                // "ts file" must first priority. Other either order is fine.
            ], ["normalized_word_match_2",
                ["search", "js file"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':6:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('js')}x ${matchedColor('file')}\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('JavaScript')} ${matchedColor('file')}\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('js')} ${matchedColor('file')}\n`,
            ], ["related_normalized_word_match",
                ["search", "rc file"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':10:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('rc')}t ${matchedColor('file')}\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':6:') + ` ${keywordLabelColor('#keyword:')} TypeScript ${matchedColor('file')} (${matchedColor('React')} ${matchedColor('file')})\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':5:') + ` ${keywordLabelColor('#keyword:')} JavaScript ${matchedColor('file')} (${matchedColor('React')} ${matchedColor('file')})\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ts ${matchedColor('file')} (${matchedColor('React')} ${matchedColor('file')})\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} js ${matchedColor('file')} (${matchedColor('React')} ${matchedColor('file')})\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('React')} ${matchedColor('file')}\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('rc')} ${matchedColor('file')}\n`,
                // "rc file" must first priority. Other either order is fine.
            ], ["error_of_circular_reference",
                ["search", "ts"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                `ERROR: thesaurus has infinite loop: script,javascript\n`,
            ], ["score",
                ["search", "object end"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#keyword:')} DI ${matchedColor('object')} (dep${matchedColor('end')}ency injection ${matchedColor('object')})\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('object')} DI (${matchedColor('object')} dep${matchedColor('end')}ency injection)\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('end')} ${matchedColor('object')}\n` +
                    pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('object')} ${matchedColor('end')}\n`,
            ], ["idiom",
                ["search", "マウスクリック"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('マウス')} ${matchedColor('クリック')}\n`,
            ], ["idiom_synonym_1",
                ["search", "timeout"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} タイム アウト (${matchedColor('time')} ${matchedColor('out')})\n`,
            ], ["idiom_synonym_2",
                ["search", "タイムアウト"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':2:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('タイム')} ${matchedColor('アウト')}\n`,
            ], ["idiom_compound_word",
                ["search", "グッドルッキング"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('グッドルッキング')}\n`,
            ], ["idiom_reverse",
                ["search", "マウス クリック"],
                { folder: "test_data/_checking/thesaurus", thesaurus: "test_data/_checking/thesaurus/thesaurus.csv", disableFindAll: '', test: "" },
                pathColor(`${typrmProject}/src/test_data/_checking/thesaurus/1.yaml`) + lineNumColor(':1:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('マウス')}${matchedColor('クリック')}\n`,
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
        ["1st",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('ABC')}: abc\n`,
        ], ["ignore case",
            ["search", "abc"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('ABC')}: abc\n`,
        ], ["word",
            ["search", "AB"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('AB')}C: abc\n`,
        ], ["nested indent",
            ["search", "ABC"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')} Nested tag must not be matched:    ${matchedColor('ABC')}D: abcd\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':4:') + ` ${keywordLabelColor('#glossary:')} Nested tag must not be matched:    ${matchedColor('ABC')}: abc\n`,
        ], ["skip comment",
            ["search", "commentA"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':26:') + ` ${keywordLabelColor('#glossary:')} comment in glossary:    ${matchedColor('commentA')}: hit\n`,
        ], ["output order (1)",
            ["search", "de"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':8:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('DE')}: de\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':9:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('de')}: de\n`,
        ], ["output order (2)",
            ["search", "DE"],
            { folder: "test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':9:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('de')}: de\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':8:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('DE')}: de\n`,
        ], ["output order (3)",
            ["search", "search score comparison glossary"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':39:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('search')} ${matchedColor('score')}:        ${matchedColor('comparison')} ${matchedColor('glossary')} and keyword: 3\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':41:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('search')} ${matchedColor('score')} ${matchedColor('comparison')} ${matchedColor('glossary')} and keyword\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':38:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('search')} ${matchedColor('score')}:        ${matchedColor('comparison')} ${matchedColor('glossary')}: 2\n`,
        ], ["glossary is less score than keyword",
            ["search", "grape"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':14:') + ` ${keywordLabelColor('#glossary:')} glossary2:        ${matchedColor('grape')}:\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':11:') + ` ${keywordLabelColor('#glossary:')} glossary1:        ${matchedColor('grape')}:\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':12:') + `     keyword:  ${keywordLabelColor('#keyword:')} ${matchedColor('grape')}\n`,
        ], ["glossary_all_match_is_greater_score_than_keyword_part_match",
            ["search", "docker", "compose"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':46:') + `         ${keywordLabelColor('#keyword:')} ${matchedColor('docker')} ${matchedColor('compose')} container\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':44:') + ` ${keywordLabelColor('#glossary:')} parent:        ${matchedColor('docker')} ${matchedColor('compose')}:\n`,
        ], ["glossary with empty line",
            ["search", "space"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':19:') + ` ${keywordLabelColor('#glossary:')} glossary with empty line:    ${matchedColor('space')}2:\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':17:') + ` ${keywordLabelColor('#glossary:')} glossary with empty line:    ${matchedColor('space')}1:\n`,
        ], ["glossary with parameters (1)",
            ["search", "category1 apple"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':22:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('category1')}:    ${matchedColor('apple')}: juice\n`,
        ], ["glossary with parameters (2)",
            ["search", "apple category1"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':22:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('category1')}:    ${matchedColor('apple')}: juice\n`,
        ], ["glossary_01_without_parameter_with_comment",
            ["search", "glossary_01  123"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':48:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('glossary_01')}_without_parameter_with_comment:    ${matchedColor('123')}: 456\n`,
        ], ["emphasize search and ref tag",
            ["search", "picture"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', test: "", locale: 'en-US' },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':28:') + ` ${keywordLabelColor('#glossary:')} emphasize search and ref tag:    ${matchedColor('picture')}:  ${refColor('#ref: /path#hash')}  #search: ${searchColor('keyword')}\n` +
                'ERROR: not found a file or folder at "/path#hash"\n'.replace(/\//g, path.sep) +
                lib.getHomePath() + '\n' +
                '    0.Folder\n',
        ], ["nested glossary tag",
            ["search", "turnip"],
            { folder: "test_data/search/glossary/2", disableFindAll: '', disableSnippet: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':33:') + ` ${keywordLabelColor('#glossary:')} level-2:        white ${matchedColor('turnip')}:\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':34:') + ` ${keywordLabelColor('#glossary:')} level-1:    ${matchedColor('turnip')} soup:\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':32:') + ` ${keywordLabelColor('#glossary:')} level-2:        red ${matchedColor('turnip')}:\n` +
                pathColor(`${typrmProject}/src/test_data/search/glossary/2/2.yml`) + lineNumColor(':31:') + ` ${keywordLabelColor('#glossary:')} level-1:    ${matchedColor('turnip')}: #glossary: level-2\n`,
        ], ["Multi folder",
            ["search", "ABC"],
            { folder: "test_data/search/1, test_data/search/glossary/1", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/glossary/1/1.yaml`) + lineNumColor(':7:') + ` ${keywordLabelColor('#glossary:')} Glossary:    ${matchedColor('ABC')}: abc\n` +
                pathColor(`${typrmProject}/src/test_data/search/1/1.yaml`) + lineNumColor(':3:') + ` ${keywordLabelColor('#keyword:')} ${matchedColor('ABC')}, "do it", "a,b"\n`,
        ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});
describe("searches keyword and parent >>", () => {
    test.each([
        ["1st",
            ["search", "parent1A child1"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            // (The answer is not to show) pathColor(`${projectRoot}/src/test_data/search/2/2.yaml`) + lineNumColor(':293:') + `             ${matchedColor('child1')}: ${keywordLabelColor('#keyword:')}\n` +
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':291:') + ` ${matchedColor('parent1A')} >>             ${matchedColor('child1')}: ${keywordLabelColor('#keyword:')}\n`,
        ], ["1st another",
            ["search", "parent1B child1"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            // (The answer is not to show) pathColor(`${projectRoot}/src/test_data/search/2/2.yaml`) + lineNumColor(':291:') + `             ${matchedColor('child1')}: ${keywordLabelColor('#keyword:')}\n` +
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':293:') + ` ${matchedColor('parent1B')} >>             ${matchedColor('child1')}: ${keywordLabelColor('#keyword:')}\n`,
        ], ["grand parent",
            ["search", "childG1 parent1GA"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            // (The answer is not to show) pathColor(`${projectRoot}/src/test_data/search/2/2.yaml`) + lineNumColor(':300:') + `                 ${keywordLabelColor('#keyword:')} ${matchedColor('childG1')}\n` +
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':297:') + ` ${matchedColor('parent1GA')} >>                 ${keywordLabelColor('#keyword:')} ${matchedColor('childG1')}\n`,
        ], ["grand parent another",
            ["search", "childG1 parent1GB"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            // (The answer is not to show) pathColor(`${projectRoot}/src/test_data/search/2/2.yaml`) + lineNumColor(':297:') + `                 ${keywordLabelColor('#keyword:')} ${matchedColor('childG1')}\n` +
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':300:') + ` ${matchedColor('parent1GB')} >>                 ${keywordLabelColor('#keyword:')} ${matchedColor('childG1')}\n`,
        ], ["many keyword than parent",
            ["search", "childK1 parent1K"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':306:') + ` ${matchedColor('parent1K')} >>             ${keywordLabelColor('#keyword:')} ${matchedColor('childK1')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':308:') + `             ${matchedColor('parent1K')}  ${keywordLabelColor('#keyword:')} ${matchedColor('childK1')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':304:') + `             ${keywordLabelColor('#keyword:')} ${matchedColor('childK1')} ${matchedColor('parent1K')}\n`,
        ], ["many keyword than parent another",
            ["search", "parent2K childK2"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':313:') + ` ${matchedColor('parent2K')} >>             ${keywordLabelColor('#keyword:')} ${matchedColor('childK2')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':311:') + `             ${matchedColor('parent2K')}  ${keywordLabelColor('#keyword:')} ${matchedColor('childK2')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':315:') + `             ${keywordLabelColor('#keyword:')} ${matchedColor('childK2')} ${matchedColor('parent2K')}\n`,
        ], ["order of keyword glossary and parent",
            ["search", "command option"],
            { folder: "test_data/search/2", test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':343:') + `     ${matchedColor('command option')}:\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':336:') + ` ${matchedColor('command')} >>         ${keywordLabelColor('#keyword:')} ${matchedColor('option')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':337:') + `     4: ${keywordLabelColor('#keyword:')} ${matchedColor('command')} ${matchedColor('option')} letter\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':339:') + ` ${keywordLabelColor('#glossary:')} ${matchedColor('command')}:        ${matchedColor('option')}:\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':341:') + ` ${keywordLabelColor('#glossary:')} 2:        ${matchedColor('command')} ${matchedColor('option')}:\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':342:') + `     1: ${keywordLabelColor('#keyword:')} ${matchedColor('command')} ${matchedColor('option')}\n`,
        ], ["1st line matched case",
            ["search", "child3", "aaa"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':317:') + ` ${matchedColor('aaa')} >>         ${keywordLabelColor('#keyword:')} ${matchedColor('child3')}\n`,
        ], ["bug case 1",
            ["search", "parentB"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':320:') + `             ${matchedColor('ParentB')} and 1: ${keywordLabelColor('#keyword:')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':322:') + `             ${matchedColor('PARENTB')} and: ${keywordLabelColor('#keyword:')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':324:') + `             ${matchedColor('parentB')}: ${keywordLabelColor('#keyword:')}\n`,
        ], ["bug case 2",
            ["search", "parentPA", "parentPB"],
            { folder: "test_data/search/2", disableFindAll: '', test: "" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':329:') + `             ${keywordLabelColor('#keyword:')} ${matchedColor('ParentPA')} ${matchedColor('parentPB')} parentPC\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':327:') + `             ${keywordLabelColor('#keyword:')} ${matchedColor('ParentPA')} ${matchedColor('parentPB')}\n`,
        ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});
describe("find all >>", () => {
    test.each([
        ["1st",
            ["search", "find_all_abc"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':110:') + `     ${matchedColor('find_all_abc')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':108:') + `     ${matchedColor('find_all_abc')}\n`,
        ], ["shuffle",
            ["search", "find_all_1  find_all_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':117:') + `     ${matchedColor('find_all_1')} find_all_3 ${matchedColor('find_all_2')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':114:') + `     ${matchedColor('find_all_2')} ${matchedColor('find_all_1')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':113:') + `     ${matchedColor('find_all_1')} ${matchedColor('find_all_2')}\n`,
        ], ["shuffle jp",
            ["search", "find_all_1\u{3000}find_all_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':117:') + `     ${matchedColor('find_all_1')} find_all_3 ${matchedColor('find_all_2')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':114:') + `     ${matchedColor('find_all_2')} ${matchedColor('find_all_1')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':113:') + `     ${matchedColor('find_all_1')} ${matchedColor('find_all_2')}\n`,
        ], ["full match",
            ["search", "full_match_1  full_match_1  full_match_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US", "foundCountMax": "3" },
            `... (To show more result, restart typrm with --found-count-max option)\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':120:') + `     ${matchedColor('full_match_1')}  ${matchedColor('full_match_2')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':121:') + `     ${matchedColor('full_match_1  full_match_1  full_match_2')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':119:') + `     ${matchedColor('full_match_1  full_match_1  full_match_2')}\n`,
        ], ["full match or keyword tag",
            ["search", "fk_1 fk_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':144:') + `     ${matchedColor('fk_1 fk_2')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':145:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('fk_1')} ${matchedColor('fk_2')}\n`,
        ], ["part full match or keyword tag",
            ["search", "pf_1 pf_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':154:') + `     ${matchedColor('pf_1')}________ ${matchedColor('pf_2')}__________\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':155:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor('pf_1')}__ ${matchedColor('pf_2')}__\n`,
        ], ["search tag",
            ["search", "- link  #search: find_search_tag_1"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':128:') + `     ${matchedColor(`-`)} ${matchedColor(`link`)}  ${matchedColor(`#search:`)} ${matchedColor(`find_search_tag_1`)}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':127:') + `     - ${keywordLabelColor('#keyword:')} ${matchedColor('find_search_tag_1')}\n`,
        ], ["full match replaced from search tag",
            ["search", "- link  #search: find_search_tag_2"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':148:') + `     ${matchedColor(`-`)} ${matchedColor(`link`)}  ${matchedColor(`#search:`)} ${matchedColor(`find_search_tag_2`)}\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':147:') + `     - link  ${keywordLabelColor('#keyword:')} ${matchedColor(`find_search_tag_2`)}\n`,
        ], ["full match replaced from search tag (2)",
            ["search", "find_search_tag_4:  #search:"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':205:') + `     ${matchedColor(`find_search_tag_4`)}:  ${keywordLabelColor('#keyword:')}\n`,
        ], ["full match with colon",
            ["search", "- find_search_tag_3 :"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':151:') + `     ${matchedColor(`- find_search_tag_3`)} :\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':150:') + `     ${matchedColor(`- find_search_tag_3`)}\n`,
            // The order does not matter
        ], ["part match",
            ["search", "thesau"],
            { folder: "test_data/search/2", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':346:') + `     ${matchedColor(`thesau`)}rus.csv:\n` +
                pathColor(`${typrmProject}/src/test_data/search/2/2.yaml`) + lineNumColor(':345:') + `     ${keywordLabelColor('#keyword:')} ${matchedColor(`thesau`)}rus.csv\n`,
        ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});
describe("mutual search >>", () => {
    test.each([
        ["1st",
            ["mutual-search", "AAA"],
            { folder: "test_data/search/mutual/1", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/mutual/1/1.yaml`) + lineNumColor(':1:') + ` Index: #search: ${matchedColor('AAA')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/mutual/1/1.yaml`) + lineNumColor(':2:') + ` Target: ${keywordLabelColor('#keyword:')} ${matchedColor('AAA')}\n`,
        ], ["mutual_tag",
            ["search", "#mutual: AAA"],
            { folder: "test_data/search/mutual/1", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/mutual/1/1.yaml`) + lineNumColor(':1:') + ` Index: #search: ${matchedColor('AAA')}\n` +
                pathColor(`${typrmProject}/src/test_data/search/mutual/1/1.yaml`) + lineNumColor(':2:') + ` Target: ${keywordLabelColor('#keyword:')} ${matchedColor('AAA')}\n`,
        ], ["not mutual",
            ["search", "AAA"],
            { folder: "test_data/search/mutual/1", disableFindAll: "", test: "", locale: "en-US" },
            pathColor(`${typrmProject}/src/test_data/search/mutual/1/1.yaml`) + lineNumColor(':2:') + ` Target: ${keywordLabelColor('#keyword:')} ${matchedColor('AAA')}\n`,
        ],
    ])("%s", async (_caseName, arguments_, options, answer) => {
        await callMain(arguments_, options);
        expect(main.stdout).toBe(answer);
    });
});
describe("print reference >>", () => {
    describe("basic >>", () => {
        test.each([
            ["1st",
                ["search", "#ref:", "${TEST_ENV}/file_target/1/file_5.yaml"],
                { locale: "en-US", test: "" },
                `${__dirname}/test_data/file_target/1/file_5.yaml\n`.replace(/\//g, path.sep) +
                    "    0.Folder\n",
            ], ["folder",
                ["search", "#ref:", "${TEST_ENV}"],
                { locale: "en-US", test: "" },
                `${__dirname}/test_data\n`.replace(/\//g, path.sep) +
                    "    0.Folder\n",
            ], ["escape",
                ["search", "#ref:", "\\${TEST_SEARCH}", "-\\${TEST_SEARCH}-", "/${TEST_SEARCH}"],
                { locale: "en-US", test: "" },
                'Warning: ref tag value "${TEST_SEARCH} -${TEST_SEARCH}- /search" must be full path. Then you can specify the path with a variable.\n',
            ], ["path",
                ["search", "#ref:", "~/.ssh  folder/f1.txt  ${TEST_PATH}  escaped\\ space  /root  //pc"],
                { locale: "en-US", test: "" },
                "ERROR: not found a file or folder at \"" + lib.getHomePath() + "/.ssh  folder/f1.txt  C:/Test  escaped\\ space  /root  //pc\"\n".replace(/\//g, path.sep) + // TYPRM_TEST_PATH has \ but print replaced to /
                    lib.getHomePath() + "\n" +
                    "    0.Folder\n",
            ], ["shared folder",
                ["search", "#ref:", "\\\\pc\\folder\\file.yaml"],
                { locale: "en-US", test: "" },
                'ERROR: not found a file or folder at "\\\\pc\\folder\\file.yaml"\n' +
                    lib.getHomePath() + "\n" + // USERPROFILE, if pc is not found
                    "    0.Folder\n",
            ], ["URL",
                ["search", "#ref:", "http://example.com/"],
                { locale: "en-US", test: "" },
                "http://example.com/\n"
            ], ["URL fragment",
                ["search", "#ref:", "https://github.com/Takakiriy/typrm/blob/master/README.md#for-windows"],
                { locale: "en-US", test: "" },
                "https://github.com/Takakiriy/typrm/blob/master/README.md#for-windows\n"
            ],
        ])("%s", async (_caseName, arguments_, options, answer) => {
            chdirInProject('src');
            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });
    describe("line number getter >>", () => {
        test.each([
            ["lineNum",
                ["search", "#ref:", "${TEST_ENV}/${TEST_SEARCH}/2/2.yaml#lineNum"],
                { locale: "en-US", test: "" },
                `${__dirname}/test_data/search/2/2.yaml:69\n`.replace(/\//g, path.sep) +
                    "    0.Folder\n",
            ], ["second match",
                ["search", "#ref:", "${TEST_ENV}/${TEST_SEARCH}/2/2.yaml:csv#lineNum,lineNum"],
                { locale: "en-US", test: "" },
                `${__dirname}/test_data/search/2/2.yaml:86\n`.replace(/\//g, path.sep) +
                    "    0.Folder\n",
            ], ["keyword list",
                ["search", "#ref:", "${TEST_ENV}/${TEST_SEARCH}/2/2.yaml:csv#firstKeyword, secondKeyword"],
                { locale: "en-US", test: "" },
                `${__dirname}/test_data/search/2/2.yaml:91\n`.replace(/\//g, path.sep) +
                    "    0.Folder\n",
            ], ["(error) lineNum not found",
                ["search", "#ref:", "${TEST_ENV}/${TEST_SEARCH}/2/2.yaml#notFound"],
                { locale: "en-US", test: "" },
                `${__dirname}/test_data/search/2/2.yaml#notFound\n`.replace(/\//g, path.sep) +
                    `${__dirname}/test_data/search/2/2.yaml\n`.replace(/\//g, path.sep) +
                    "    0.Folder\n",
            ], ["keep",
                ["search", "#ref:", "${TEST_ENV}/verb/test.html#lineNum"],
                { locale: "en-US", test: "" },
                `${__dirname}/test_data/verb/test.html#lineNum\n`.replace(/\//g, path.sep) +
                    "    7.Test Echo, 0.Folder\n",
            ], ["(error) file not found",
                ["search", "#ref:", "${TEST_ENV}/${TEST_SEARCH}/2/notFound.yaml#notFound"],
                { locale: "en-US", test: "" },
                `ERROR: not found a file or folder at "${__dirname}/test_data/search/2/notFound.yaml#notFound"\n`.replace(/\//g, path.sep) +
                    `${__dirname}/test_data/search/2\n`.replace(/\//g, path.sep) +
                    "    0.Folder\n",
            ],
        ])("%s", async (_caseName, arguments_, options, answer) => {
            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });
    describe("recommend >>", () => {
        const typrmProjectPath = `${lib.getHomePath()}/${projectRelativePath.replace(/\\\\/g, '/')}`;
        test.each([
            ["recommend",
                ["search", "#ref:", `${lib.getHomePath()}/.ssh  ${__dirname}/test_data/search/1/1.yaml  ${__dirname}/test_data/search/2/2.yaml  C:\\Test\\user1  c:\\Test  last\\`],
                { locale: "en-US", test: "" },
                'Recommend: #ref: ~/.ssh  ${TEST_ENV}/${TEST_SEARCH}/1/1.yaml  ${TEST_ENV}/${TEST_SEARCH}/2/2.yaml  ${TEST_PATH}/user1  ${TEST_PATH}  last/\n' +
                    `ERROR: not found a file or folder at \"${lib.getHomePath()}/.ssh  ${typrmProjectPath}/src/test_data/search/1/1.yaml  ${typrmProjectPath}/src/test_data/search/2/2.yaml  C:/Test/user1  c:/Test  last/\"\n`.replace(/\//g, path.sep) +
                    lib.getHomePath() + "\n" + // USERPROFILE, if pc is not found
                    "    0.Folder\n",
            ], ["recommend (2)",
                ["search", "#ref: '/Users'"],
                { locale: "en-US", test: "" },
                (testingOS === 'Windows') ?
                    "Recommend: #ref: /Users\n" +
                        `\\Users\n` +
                        "    0.Folder\n"
                    : // Linux, mac
                        "Recommend: #ref: /Users\n" +
                            "/Users\n" +
                            "    0.Folder\n",
            ], ["root",
                ["search", "#ref: \\root"],
                { locale: "en-US", test: "" },
                "Recommend: #ref: /root\n" +
                    `ERROR: not found a file or folder at \"/root\"\n`.replace(/\//g, path.sep) +
                    lib.getHomePath() + "\n" + // USERPROFILE, if pc is not found
                    "    0.Folder\n",
            ], ["Windows drive (1)",
                ["search", "#ref: C:\\"],
                { locale: "en-US", test: "" },
                (testingOS === 'Windows') ?
                    "Recommend: #ref: c:/\n" +
                        `C:\\\n` +
                        "    0.Folder\n"
                    : // Linux, mac
                        "Recommend: #ref: c:/\n" +
                            `ERROR: not found a file or folder at \"c:/\"\n` +
                            lib.getHomePath() + "\n" + // USERPROFILE, if pc is not found
                            "    0.Folder\n",
            ], ["Windows drive (2)",
                ["search", "#ref: C:\\test"],
                { locale: "en-US", test: "" },
                (testingOS === 'Windows') ?
                    "Recommend: #ref: c:/test\n" +
                        `ERROR: not found a file or folder at \"C:\\test\"\n` +
                        "C:\\\n" +
                        "    0.Folder\n"
                    : // Linux, mac
                        "Recommend: #ref: c:/test\n" +
                            `ERROR: not found a file or folder at \"c:/test\"\n` +
                            lib.getHomePath() + "\n" + // USERPROFILE, if pc is not found
                            "    0.Folder\n",
            ], ["shared folder",
                ["search", "#ref: \\\\pc"],
                { locale: "en-US", test: "" },
                `ERROR: not found a file or folder at \"\\\\pc\"\n` +
                    lib.getHomePath() + "\n" + // USERPROFILE, if pc is not found
                    "    0.Folder\n",
            ], ["Do not recommend reserved variables",
                ["search", `#ref: TYPRM_FOLDER`],
                { locale: "en-US", test: "" },
                "Warning: ref tag value \"TYPRM_FOLDER\" must be full path. Then you can specify the path with a variable.\n",
                // No recommend message
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
        const projectPathInRefTag0 = lib.getFullPath("..", __dirname).replace(/\\/g, '/');
        const projectPathInRefTag = projectPathInRefTag0[0].toLowerCase() + projectPathInRefTag0.substring(1);
        const projectPathLinux = lib.replacePathToSlashed(lib.getFullPath("..", __dirname).replace(/\\/g, '/'));
        const projectPathWindows = lib.replaceToPathForWindows(projectPathLinux.replace(/\//g, '\\'));
        test.each([
            ["verb",
                ["search", "#ref:", `${projectPathInRefTag}/README.md`, "7"],
                { commandFolder: ".", locale: "en-US", test: "" },
                `{ref: ${projectPathLinux}/README.md, windowsRef: ${projectPathWindows}\\README.md, file: ${projectPathLinux}/README.md, windowsFile: ${projectPathWindows}\\README.md, existingAddress: ${projectPathLinux}/README.md, windowsExistingAddress: ${projectPathWindows}\\README.md, fragment: , lineNum: 0}\n`,
            ], ["verb fragment",
                ["search", "#ref:", `${projectPathLinux}/src/test_data/verb/test.html#example`, "7"],
                { commandFolder: ".", locale: "en-US", test: "" },
                `{ref: ${projectPathLinux}/src/test_data/verb/test.html#example, windowsRef: ${projectPathWindows}\\src\\test_data\\verb\\test.html#example, file: ${projectPathLinux}/src/test_data/verb/test.html, windowsFile: ${projectPathWindows}\\src\\test_data\\verb\\test.html, existingAddress: ${projectPathLinux}/src/test_data/verb/test.html, windowsExistingAddress: ${projectPathWindows}\\src\\test_data\\verb\\test.html, fragment: example, lineNum: 0}\n`,
            ], ["verb line num",
                ["search", "#ref:", `${projectPathLinux}/src/test_data/verb/test.md#document`, "7"],
                { commandFolder: ".", locale: "en-US", test: "" },
                `{ref: ${projectPathLinux}/src/test_data/verb/test.md#document, windowsRef: ${projectPathWindows}\\src\\test_data\\verb\\test.md#document, file: ${projectPathLinux}/src/test_data/verb/test.md, windowsFile: ${projectPathWindows}\\src\\test_data\\verb\\test.md, existingAddress: ${projectPathLinux}/src/test_data/verb/test.md, windowsExistingAddress: ${projectPathWindows}\\src\\test_data\\verb\\test.md, fragment: document, lineNum: 3}\n`,
            ], ["verb not found",
                ["search", "#ref:", `${projectPathLinux}/src/test_data/verb/notFound/test.md#document`, "7"],
                { commandFolder: ".", locale: "en-US", test: "" },
                `{ref: ${projectPathLinux}/src/test_data/verb/notFound/test.md#document, windowsRef: ${projectPathWindows}\\src\\test_data\\verb\\notFound\\test.md#document, file: ${projectPathLinux}/src/test_data/verb/notFound/test.md, windowsFile: ${projectPathWindows}\\src\\test_data\\verb\\notFound\\test.md, existingAddress: ${projectPathLinux}/src/test_data/verb, windowsExistingAddress: ${projectPathWindows}\\src\\test_data\\verb, fragment: document, lineNum: -1}\n`,
            ], ["verb error",
                ["search", "#ref:", `${projectPathLinux}/src/test_data/verb/test.md`, "4"],
                { locale: "en-US", test: "" },
                "Error that verb number 4 is not defined\n",
            ], ["URL",
                ["search", "#ref:", "http://example.com/", "0"],
                { locale: "en-US", test: "" },
                "Error that verb number 0 is not defined\n",
            ], ["verb verbose",
                ["search", "#ref:", `${projectPathLinux}/README.md`, "4"],
                { locale: "en-US", test: "", verbose: "" },
                (testingOS === 'Windows')
                    ? // Windows
                        "Verbose: Option and environment variables:\n" +
                            "    Verbose: --word-super-separators, TYPRM_WORD_SUPER_SEPARATORS: \" 　\"\n" +
                            "    Verbose: --word-separators, TYPRM_WORD_SEPARATORS: \"~!^&*#()=+-[{]}\\|;:'\"`,.<>/?、。（）「」【】\"\n" +
                            "    Verbose: programOptionsWordSeparators: \" 　~!^&*#()=+-[{]}\\|;:'\"`,.<>/?、。（）「」【】\"\n" +
                            `    Verbose: TYPRM_TEST_ENV = ${__dirname}\\test_data\n` +
                            "    Verbose: TYPRM_TEST_SEARCH = search\n" +
                            "    Verbose: TYPRM_TEST_ENV2 = testEnv\n" +
                            "    Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                            (defaultUsesLineNumGetter ?
                                "    Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                                    "        Verbose: regularExpression: ^https?://\n" +
                                    "        Verbose: type: keep\n" +
                                    "        Verbose: filePathRegularExpressionIndex: undefined\n" +
                                    "    Verbose: TYPRM_LINE_NUM_GETTER[1]:\n" +
                                    "        Verbose: regularExpression: ^(.*\\.html)(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                    "        Verbose: type: keep\n" +
                                    "        Verbose: filePathRegularExpressionIndex: 1\n" +
                                    "    Verbose: TYPRM_LINE_NUM_GETTER[2]:\n" +
                                    "        Verbose: regularExpression: ^(.*?)(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                    "        Verbose: type: text\n" +
                                    "        Verbose: filePathRegularExpressionIndex: 1\n" +
                                    "        Verbose: keywordRegularExpressionIndex: 6\n" +
                                    "        Verbose: csvOptionRegularExpressionIndex: 2\n" +
                                    "        Verbose: targetMatchIdRegularExpressionIndex: 4\n" +
                                    "        Verbose: address: ${file}:${lineNum}\n"
                                :
                                    "    Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                                        "        Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                        "        Verbose: type: text\n" +
                                        "        Verbose: filePathRegularExpressionIndex: 1\n" +
                                        "        Verbose: keywordRegularExpressionIndex: 7\n" +
                                        "        Verbose: csvOptionRegularExpressionIndex: 3\n" +
                                        "        Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                                        "        Verbose: address: ${file}:${lineNum}\n") +
                            "    Verbose: TYPRM_VERB[0]:\n" +
                            "        Verbose: regularExpression: ^.*\\.(md|html)(#.*)?\$\n" +
                            "        Verbose: label: 7.Test Echo\n" +
                            "        Verbose: number: 7\n" +
                            "        Verbose: command: echo {ref: \${ref}, windowsRef: ${windowsRef}, file: \${file}, windowsFile: ${windowsFile}, existingAddress: ${existingAddress}, windowsExistingAddress: ${windowsExistingAddress}, fragment: \${fragment}, lineNum: ${lineNum}}\n" +
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
                            `    Verbose: address in ref tag: ${normalizedProjectRoot}/README.md\n` +
                            "    Verbose: type: text\n" +
                            (defaultUsesLineNumGetter ?
                                "    Verbose: regularExpression: ^(.*?)(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                    "    Verbose: filePathRegularExpressionIndex: 1\n" +
                                    "    Verbose: keywordRegularExpressionIndex: 6\n" +
                                    "    Verbose: csvOptionRegularExpressionIndex: 2\n" +
                                    "    Verbose: targetMatchIdRegularExpressionIndex: 4\n" +
                                    "    Verbose: address: ${file}:${lineNum}\n" +
                                    `    Verbose: matched: [${normalizedProjectRoot}/README.md, ${normalizedProjectRoot}/README.md, , , , , ]\n`
                                :
                                    "    Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                        "    Verbose: filePathRegularExpressionIndex: 1\n" +
                                        "    Verbose: keywordRegularExpressionIndex: 7\n" +
                                        "    Verbose: csvOptionRegularExpressionIndex: 3\n" +
                                        "    Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                                        "    Verbose: address: ${file}:${lineNum}\n" +
                                        `    Verbose: matched: [${normalizedProjectRoot}/README.md, ${normalizedProjectRoot}/README.md, md, , , , , ]\n`) +
                            "Error that verb number 4 is not defined\n"
                    : // mac
                        "Verbose: Option and environment variables:\n" +
                            "    Verbose: --word-super-separators, TYPRM_WORD_SUPER_SEPARATORS: \" 　\"\n" +
                            "    Verbose: --word-separators, TYPRM_WORD_SEPARATORS: \"~!^&*#()=+-[{]}\\|;:'\"`,.<>/?、。（）「」【】\"\n" +
                            "    Verbose: programOptionsWordSeparators: \" 　~!^&*#()=+-[{]}\\|;:'\"`,.<>/?、。（）「」【】\"\n" +
                            `    Verbose: TYPRM_TEST_ENV = ${__dirname}/test_data\n` +
                            "    Verbose: TYPRM_TEST_SEARCH = search\n" +
                            "    Verbose: TYPRM_TEST_ENV2 = testEnv\n" +
                            "    Verbose: TYPRM_TEST_PATH = C:\\Test\n" +
                            (defaultUsesLineNumGetter ?
                                "    Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                                    "        Verbose: regularExpression: ^https?://\n" +
                                    "        Verbose: type: keep\n" +
                                    "        Verbose: filePathRegularExpressionIndex: undefined\n" +
                                    "    Verbose: TYPRM_LINE_NUM_GETTER[1]:\n" +
                                    "        Verbose: regularExpression: ^(.*\\.html)(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                    "        Verbose: type: keep\n" +
                                    "        Verbose: filePathRegularExpressionIndex: 1\n" +
                                    "    Verbose: TYPRM_LINE_NUM_GETTER[2]:\n" +
                                    "        Verbose: regularExpression: ^(.*?)(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                    "        Verbose: type: text\n" +
                                    "        Verbose: filePathRegularExpressionIndex: 1\n" +
                                    "        Verbose: keywordRegularExpressionIndex: 6\n" +
                                    "        Verbose: csvOptionRegularExpressionIndex: 2\n" +
                                    "        Verbose: targetMatchIdRegularExpressionIndex: 4\n" +
                                    "        Verbose: address: ${file}:${lineNum}\n"
                                :
                                    "    Verbose: TYPRM_LINE_NUM_GETTER[0]:\n" +
                                        "        Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                        "        Verbose: type: text\n" +
                                        "        Verbose: filePathRegularExpressionIndex: 1\n" +
                                        "        Verbose: keywordRegularExpressionIndex: 7\n" +
                                        "        Verbose: csvOptionRegularExpressionIndex: 3\n" +
                                        "        Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                                        "        Verbose: address: ${file}:${lineNum}\n") +
                            "    Verbose: TYPRM_VERB[0]:\n" +
                            "        Verbose: regularExpression: ^.*\\.(md|html)(#.*)?\$\n" +
                            "        Verbose: label: 7.Test Echo\n" +
                            "        Verbose: number: 7\n" +
                            "        Verbose: command: wr='${windowsRef}' wf='${windowsFile}' we='${windowsExistingAddress}'  bash -c  'echo  \"{ref: \${ref}, windowsRef: \${wr}, file: \${file}, windowsFile: \${wf}, existingAddress: ${existingAddress}, windowsExistingAddress: ${we}, fragment: \${fragment}, lineNum: ${lineNum}}\"'\n" +
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
                            `    Verbose: address in ref tag: ${normalizedProjectRoot}/README.md\n` +
                            "    Verbose: type: text\n" +
                            (defaultUsesLineNumGetter ?
                                "    Verbose: regularExpression: ^(.*?)(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                    "    Verbose: filePathRegularExpressionIndex: 1\n" +
                                    "    Verbose: keywordRegularExpressionIndex: 6\n" +
                                    "    Verbose: csvOptionRegularExpressionIndex: 2\n" +
                                    "    Verbose: targetMatchIdRegularExpressionIndex: 4\n" +
                                    "    Verbose: address: ${file}:${lineNum}\n" +
                                    `    Verbose: matched: [${normalizedProjectRoot}/README.md, ${normalizedProjectRoot}/README.md, , , , , ]\n`
                                :
                                    "    Verbose: regularExpression: ^(.*\\.(yaml|md))(:csv)?(:id=([0-9]+))?(#(.*))?$\n" +
                                        "    Verbose: filePathRegularExpressionIndex: 1\n" +
                                        "    Verbose: keywordRegularExpressionIndex: 7\n" +
                                        "    Verbose: csvOptionRegularExpressionIndex: 3\n" +
                                        "    Verbose: targetMatchIdRegularExpressionIndex: 5\n" +
                                        "    Verbose: address: ${file}:${lineNum}\n" +
                                        `    Verbose: matched: [${normalizedProjectRoot}/README.md, ${normalizedProjectRoot}/README.md, md, , , , , ]\n`) +
                            "Error that verb number 4 is not defined\n",
            ],
            // Others test is "search_mode_ref_verb".
        ])("%s", async (_caseName, arguments_, options, answer) => {
            await callMain(arguments_, options);
            expect(main.stdout).toBe(answer);
        });
    });
});
describe("alarm >>", () => {
    test("1st", async () => {
        fs.mkdirSync(testFolderPath + '_tmp/input', { recursive: true });
        const now = new Date();
        const yesterdayObject = new Date();
        const tomorrowObject = new Date();
        yesterdayObject.setDate(yesterdayObject.getDate() - 1);
        tomorrowObject.setDate(tomorrowObject.getDate() + 1);
        const today = lib.getStringBefore(lib.getLocalIsoString(now), "T");
        const yesterday = lib.getStringBefore(lib.getLocalIsoString(yesterdayObject), "T");
        const tomorrow = lib.getStringBefore(lib.getLocalIsoString(tomorrowObject), "T");
        const targetPath = testFolderPath + '_tmp/input/target_with_alarm.yaml';
        const answerPath = testFolderPath + '_tmp/answer.log';
        initializeTestInputFiles({
            'alarm >> 1st: sourceFileContents 1': targetPath,
            'alarm >> 1st: stdout answer 1': answerPath,
        }, (text) => (lib.replace(text, [
            { from: 'start of today:  #alarm: 2024-01-10 00:00', to: `start of today:  #alarm: ${today} 00:00` },
            { from: 'end of today:    #alarm: 2024-01-10 23:39', to: `end of today:    #alarm: ${today} 23:39` },
            { from: 'yesterday: #alarm: 2024-01-09', to: `yesterday: #alarm: ${yesterday}` },
            { from: 'today:     #alarm: 2024-01-10', to: `today:     #alarm: ${today}` },
            { from: 'tomorrow:  #alarm: 2024-01-11', to: `tomorrow:  #alarm: ${tomorrow}` },
            { from: 'start of today:  #alarm: 2024-01-10T00:00', to: `start of today:  #alarm: ${today}T00:00` },
            { from: 'end of today:    #alarm: 2024-01-10T23:39', to: `end of today:    #alarm: ${today}T23:39` },
        ])));
        lib.replaceFileSync(answerPath, (text) => (lib.replace(text, answerReplace)));
        const answer = fs.readFileSync(answerPath).toString();
        await callMain(["others"], { folder: testFolderPath + '_tmp/input', test: "", disableFindAll: '', disableSnippet: '' });
        expect(main.stdout).toBe(answer);
        lib.rmdirSync(testFolderPath + '_tmp');
    });
    test("search", async () => {
        const targetPath = testFolderPath + '_tmp/input/target_with_alarm.yaml';
        const answerPath = testFolderPath + '_tmp/answer.log';
        initializeTestInputFiles({
            'alarm >> search: sourceFileContents 1': targetPath,
            'alarm >> search: stdout answer 1': answerPath,
        });
        lib.replaceFileSync(answerPath, (text) => (lib.replace(text, answerReplace)));
        const answer = fs.readFileSync(answerPath).toString();
        await callMain(["#alarm: 2024-01-10"], { folder: testFolderPath + '_tmp/input', test: "", disableFindAll: '', disableSnippet: '' });
        expect(main.stdout).toBe(answer);
        lib.rmdirSync(testFolderPath + '_tmp');
    });
    test("list", async () => {
        const targetPath = testFolderPath + '_tmp/input/target_with_alarm.yaml';
        const answerPath = testFolderPath + '_tmp/answer.log';
        initializeTestInputFiles({
            'alarm >> list: sourceFileContents 1': targetPath,
            'alarm >> list: stdout answer 1': answerPath,
        });
        lib.replaceFileSync(answerPath, (text) => (lib.replace(text, answerReplace)));
        const answer = fs.readFileSync(answerPath).toString();
        await callMain(["#alarm:"], { folder: testFolderPath + '_tmp/input', test: "", disableFindAll: '', disableSnippet: '' });
        expect(main.stdout).toBe(answer);
        lib.rmdirSync(testFolderPath + '_tmp');
    });
    const foundPath = '${typrmProject}/src/test_data/_tmp/input/target_with_alarm.yaml';
    const answerReplace = [
        { from: '#keyword:', to: keywordLabelColor('#keyword:') },
        { from: new RegExp('#alarm:', 'g'), to: alarmLabelColor('#alarm:') },
        { from: 'others', to: matchedColor('others') },
        { from: new RegExp('.yaml(:[0-9]+:)', 'g'), to: `.yaml${lineNumColor('$1')}` },
        { from: new RegExp(lib.escapeRegularExpression(foundPath), 'g'), to: pathColor(foundPath) },
        { from: new RegExp('([0-9]{4}-[0-9]{2}-[0-9]{2}(( |T)?([0-9]{2}:[0-9]{2}))?(:[0-9]{2}\\+[0-9]{2}:[0-9]{2})?)', 'g'), to: matchedColor('$1') },
        { from: '2024--1-10(Bad format)', to: matchedColor('2024--1-10(Bad format)') },
    ];
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
            ["bug_case_6", {}],
            ["bug_case_7_first_child_settings", {}],
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
            for (const [lineNum, index] of settingsTree.indices.entries()) {
                expect(Array.from(settingsTree.indicesWithIf.keys()).includes(lineNum)).toBe(true);
                expect(settingsTree.indicesWithIf.get(lineNum)).toBe(index);
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
    describe("FoundLine >> notMatchedTargetWordCount >>", () => {
        test("1. str", () => {
            const targetKeyphrase = "str";
            const found = Object.assign(new main.private_.FoundLine(), {
                line: "    8d: #keyword: " + targetKeyphrase,
                //     0         1         2         3
                targetWordCount: 1,
                matches: [Object.assign(new main.private_.MatchedPart(), {
                        position: 0,
                        matchedString: "str",
                        targetWordsIndex: 0,
                        searchWordIndex: 0,
                        targetType: "strict",
                        targetTagType: "keyword",
                        matchedWordType: "wordOrIdiom",
                        caseSensitiveMatched: true,
                    })],
            });
            found.notMatchedTargetKeyphrase = __getNotMatchedTargetKeyphrase(targetKeyphrase, found);
            expect(found.notMatchedTargetWordCount).toBe(0);
        });
        test("2. str.replace", () => {
            const targetKeyphrase = "str.replace";
            const found = Object.assign(new main.private_.FoundLine(), {
                line: "    8d: #keyword: " + targetKeyphrase,
                //     0         1         2         3
                targetWordCount: 1,
                matches: [Object.assign(new main.private_.MatchedPart(), {
                        position: 0,
                        matchedString: "str",
                        targetWordsIndex: 0,
                        searchWordIndex: 0,
                        targetType: "strict",
                        targetTagType: "keyword",
                        matchedWordType: "wordOrIdiomWord",
                        caseSensitiveMatched: true,
                    })],
            });
            found.notMatchedTargetKeyphrase = __getNotMatchedTargetKeyphrase(targetKeyphrase, found);
            expect(found.notMatchedTargetWordCount).toBe(1);
        });
        test("3. str replace", () => {
            const targetKeyphrase = "str replace";
            const found = Object.assign(new main.private_.FoundLine(), {
                line: "    7:  #keyword: " + targetKeyphrase,
                //     0         1         2         3
                targetWordCount: 2,
                matches: [Object.assign(new main.private_.MatchedPart(), {
                        position: 0,
                        matchedString: "str",
                        targetWordsIndex: 0,
                        searchWordIndex: 0,
                        targetType: "strict",
                        targetTagType: "keyword",
                        matchedWordType: "wordOrIdiom",
                        caseSensitiveMatched: true,
                    })],
            });
            found.notMatchedTargetKeyphrase = __getNotMatchedTargetKeyphrase(targetKeyphrase, found);
            expect(found.notMatchedTargetWordCount).toBe(1);
        });
        test("4. str and replace", () => {
            // ToDo Test case keyword "str replace". It matches "str" and "replace"
            const targetKeyphrase = "str replace";
            const found = Object.assign(new main.private_.FoundLine(), {
                line: "    7:  #keyword: " + targetKeyphrase,
                //     0         1         2         3
                targetWordCount: 2,
                matches: [Object.assign(new main.private_.MatchedPart(), {
                        position: 0,
                        matchedString: "str",
                        targetWordsIndex: 0,
                        searchWordIndex: 0,
                        targetType: "strict",
                        targetTagType: "keyword",
                        matchedWordType: "wordOrIdiom",
                        caseSensitiveMatched: true,
                    }), Object.assign(new main.private_.MatchedPart(), {
                        position: 4,
                        matchedString: "replace",
                        targetWordsIndex: 0,
                        searchWordIndex: 0,
                        targetType: "strict",
                        targetTagType: "keyword",
                        matchedWordType: "wordOrIdiom",
                        caseSensitiveMatched: true,
                    })],
            });
            found.notMatchedTargetKeyphrase = __getNotMatchedTargetKeyphrase(targetKeyphrase, found);
            expect(found.notMatchedTargetWordCount).toBe(0);
        });
        const __getNotMatchedTargetKeyphrase = main.private_.GetKeywordMatchingScore.Class.__getNotMatchedTargetKeyphrase;
    });
    describe("searchTargetKeyphrasePosition >>", () => {
        test.each([
            //                0         1         2         3
            ["1st", "title: #keyword: Title", [15], [17]],
            ["no_parameter", "    title: #keyword:", [19], [4]],
            ["CSV-1", "    title: #keyword: Title 1, Title 2", [19, 28], [21, 30]],
            ["quoted_CSV", '#keyword: ABC, "do it", "a,b"', [8, 14, 23], [10, 16, 25]],
        ])("%s", async (caseName, line, separatorPositions, answer) => {
            expect(searchTargetKeyphrasePositions(line, separatorPositions)).toEqual(answer);
        });
        const searchTargetKeyphrasePositions = main.private_.searchTargetKeyphrasePositions;
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
function initializeTestInputFiles(filePath, replaceFunction = (x) => (x)) {
    const fileContents = {};
    chdirInProject('src');
    if (fs.existsSync(`${testFolderPath}_tmp`)) {
        lib.rmdirSync(`${testFolderPath}_tmp`);
    }
    for (const [snapshotName, filePath_] of Object.entries(filePath)) {
        const fileContentsBeforeReplace = lib.getSnapshot(snapshotName);
        const fileContents_ = replaceFunction(fileContentsBeforeReplace);
        writeFileSync(filePath_, fileContents_);
        fileContents[snapshotName] = fileContents_;
    }
    return fileContents;
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
expect.extend({
    because(isPassed, errorMessage) {
        return {
            pass: isPassed,
            message: () => errorMessage,
        };
    },
});
const notFound = -1;
//# sourceMappingURL=main.test.js.map