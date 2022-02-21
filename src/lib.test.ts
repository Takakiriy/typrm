import * as lib from "./lib";
import chalk from 'chalk';
var anyLinesTag = '#anyLines:'

describe("string >>", () => {
    describe("cutIndent >>", () => {

        test("1st", () => {
            const  withoutIndent = lib.cutIndent([
                '    Line 1',
                '        Line 2',
            ]);
            expect(withoutIndent).toStrictEqual([
                'Line 1',
                '    Line 2',
            ]);
        });

        test("1st line is deeper", () => {
            const  withoutIndent = lib.cutIndent([
                '        Line 1',
                '    Line 2',
            ]);
            expect(withoutIndent).toStrictEqual([
                '    Line 1',
                'Line 2',
            ]);
        });
    });

    describe("unexpandVariable >>", () => {
        test("1st", () => {
            const  unexpectedLine = lib.unexpandVariable('abcXdef',
                [['$a', 'abc'], ['$d', 'def']]);
            expect(unexpectedLine).toBe('$aX$d');
        });

        test("not regular expression", () => {
            const  unexpectedLine = lib.unexpandVariable('abcde_ab.*e',
                [['$a', 'ab.*e']]);
            expect(unexpectedLine).toBe('abcde_$a');
        });

        describe("order >>", () => {
            test("descending", () => {
                const  unexpectedLine = lib.unexpandVariable('abcdef',
                    [['${ab}', 'abcde'], ['${a}', 'abc']]);
                expect(unexpectedLine).toBe('${ab}f');
            });

            test("ascending", () => {
                const  unexpectedLine = lib.unexpandVariable('abcdef',
                    [['${a}', 'abc'], ['${ab}', 'abcde']]);
                expect(unexpectedLine).toBe('${a}def');
            });
        });

        describe("matched replaced >>", () => {
            test("replaced", () => {
                const  unexpectedLine = lib.unexpandVariable('abc_def_$g',
                    [['${abc}', 'def'], ['${d}', 'abc'], ['\\$', '$']]);
                expect(unexpectedLine).toBe('${d}_${abc}_\\$g');
            });
            test("already replaced", () => {
                const  unexpectedLine = lib.unexpandVariable('${d}_def_$g',
                    [['${abc}', 'def'], ['${d}', 'abc'], ['\\$', '$']]);
                expect(unexpectedLine).toBe('${d}_${abc}_\\$g');
            });
        });
    });

    describe("checkFileContents >>", () => {

        describe("basic >>", () => {
            test("Same", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        'Line 2',
                        'Line 3',
                    ],[
                        // expectedParts
                        'Line 2',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual(null);
            });

            test("Diff >> Not found expected line 1", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        'Line 2',
                        'Line 3',
                    ],[
                        // expectedParts
                        'not found line',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 0,
                    contentsLine: '',
                    contentsIndentLength: 0,
                    partsLineNum: 1,
                    partsLine: 'not found line',
                    partsIndentLength: 0,
                    indentDiff: 0,
                });
            });

            test("Diff >> Different at many expected line", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        '2: unexpected',
                        'Line 1',
                        'Line 2',
                        '5: unexpected',
                        'Line 1',
                        '7: unexpected',
                    ],[
                        // expectedParts
                        'Line 1',
                        'Line 2',
                        'Line 3',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 5,
                    contentsLine: '5: unexpected',
                    contentsIndentLength: 0,
                    partsLineNum: 3,
                    partsLine: 'Line 3',
                    partsIndentLength: 0,
                    indentDiff: 0,
                });
            });

            test("Diff >> Different at parts line 2", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        'Line 1',
                        'Line 2',
                        'Line 3',
                    ], expectedParts: [
                        'Line 1',
                        'Line 2',
                    ], forDiff: {
                        contentsLineNum: 2,  replaceContentsLine: "Line 2",
                        partsLineNum: 2,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("Same >> Found the part line 1 in second line in contents", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        "Line 1 or 3",
                        "unexpected",
                        "Line 1 or 3",  // This line must be same as line 1
                        "Line 4",
                        "Line 5",  // or (unexpected)
                    ], expectedParts: [
                        "Line 1 or 3",
                        "Line 4",
                        "Line 5",  // same or different
                    ], forDiff: {
                        contentsLineNum: 5,  replaceContentsLine: "Line 5",
                        partsLineNum: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("Same >> empty line", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        '    Line 1',
                        '',
                        '    Line 3',
                    ],[
                        // expectedParts
                        '    Line 1',
                        '',
                        '    Line 3',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual(null);
            });

            test("OK and Diff >> any lines tag >> different line 1 line below any lines tag", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        "Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7", "Line 8",
                        "Line 9",
                        "Line 10",  // or (unexpected)
                    ], expectedParts: [
                        "Line 2",
                        anyLinesTag,  // skip 1 line
                        "Line 4",
                        anyLinesTag,  // skip 2 lines
                        "Line 7",  // search this line
                        "Line 8",  // check this line
                        anyLinesTag,
                        "Line 10",  // same or different
                    ], forDiff: {
                        contentsLineNum: 9,  // Not found "Line 10" at line 9 and below
                        contentsLine: "Line 9",
                        replaceContentsLine: "Line 10",
                        partsLineNum: 8,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("Diff >> any lines tag >> different line 2 lines below any lines tag", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        "Line 1", "Line 2", "Line 3",
                        "Line 4",
                        "Line 5",  // or (unexpected)
                    ], expectedParts: [
                        "Line 1",
                        anyLinesTag,
                        "Line 4",
                        "Line 5",  // same or different
                    ], forDiff: {
                        contentsLineNum: 5,  replaceContentsLine: "Line 5",
                        partsLineNum: 4,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("Diff >> any lines tag >> at first line", () => { // line 1 is deeper than line 2
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        "Line 1",
                        "    Line 2",
                        "        Line 3",
                        "    Line 4", // or (unexpected)
                    ], expectedParts: [
                        `${anyLinesTag}`,  // This indent is used as level 0 indent
                        "    Line 3",
                        "Line 4",  // same or different
                    ], forDiff: {
                        contentsLineNum: 4,  replaceContentsLine: "Line 4",  contentsIndentLength: 4,
                        partsLineNum: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
        });

        describe("ignores indent depth >>", () => {

            test("OK >> indent depth (contents < parts)", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        ' Line 1',
                        ' unexpected',
                        ' Line 3',
                        '     Line 4',  // depth 1
                        ' Line 5',
                        '     Line 6',
                        '         Line 7',  // depth 2
                        ' Line 8',  // shallow 2
                        '     Line 9',
                        '         Line 10',
                        '     Line 11',  // shallow 1
                        '         Line 12',
                        '         Line 13',  // or (unexpected)
                    ], expectedParts: [
                        '    Line 3',
                        '        Line 4',
                        '    Line 5',
                        '        Line 6',
                        '            Line 7',
                        '    Line 8',
                        '        Line 9',
                        '            Line 10',
                        '        Line 11',
                        '            Line 12',
                        '            Line 13',  // same or different
                    ], forDiff: {
                        contentsLineNum: 13,  replaceContentsLine: "         Line 13",  contentsIndentLength: 1,
                        partsLineNum: 11,  partsIndentLength: 4,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("OK >> indent depth (contents > parts)", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        '    Line 1',
                        '        Line 2',  // depth 1
                        '    Line 3',
                        '        Line 4',
                        '            Line 5',  // depth 2
                        '    Line 6',  // shallow 2
                        '        Line 7',
                        '            Line 8',
                        '        Line 9',  // shallow 1
                        '            Line 10',
                        '            Line 11',  // or (unexpected)
                    ], expectedParts: [
                        ' Line 1',
                        '     Line 2',
                        ' Line 3',
                        '     Line 4',
                        '         Line 5',
                        ' Line 6',
                        '     Line 7',
                        '         Line 8',
                        '     Line 9',
                        '         Line 10',
                        '         Line 11',  // same or different
                    ], forDiff: {
                        contentsLineNum: 11,  replaceContentsLine: "Line 11",  contentsIndentLength: 4,
                        partsLineNum: 11,  partsIndentLength: 1,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("Diff >> Different indent", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        '    Line 1',
                        '    Line 2',
                    ],[
                        // expectedParts
                        '  Line 1',
                        '      Line 2',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 2,
                    contentsLine: '    Line 2',
                    contentsIndentLength: 4,
                    partsLineNum: 2,
                    partsLine: '      Line 2',
                    partsIndentLength: 2,
                    indentDiff: -4,
                });
            });

            test("Diff >> deeper and shallower", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        '    Line 2',
                        '        Line 3',
                    ],[
                        // expectedParts
                        'Line 1',
                        '    Line 2',
                        'Line 3',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 3,
                    contentsLine: '        Line 3',
                    contentsIndentLength: 0,
                    partsLineNum: 3,
                    partsLine: 'Line 3',
                    partsIndentLength: 0,
                    indentDiff: +8,
                });
            });

            test("Diff >> shallow level", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        '    Line 2',
                        '        Line 3',
                        '    Line 4',
                    ],[
                        // expectedParts
                        'Line 1',
                        '    Line 2',
                        '        Line 3',
                        'Line 4',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 4,
                    contentsLine: '    Line 4',
                    contentsIndentLength: 0,
                    partsLineNum: 4,
                    partsLine: 'Line 4',
                    partsIndentLength: 0,
                    indentDiff: 4,
                });
            });

            test("Diff >> shallow level >> opposite", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        '    Line 2',
                        '        Line 3',
                        'Line 4',
                    ],[
                        // expectedParts
                        'Line 1',
                        '    Line 2',
                        '        Line 3',
                        '    Line 4',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 4,
                    contentsLine: 'Line 4',
                    contentsIndentLength: 0,
                    partsLineNum: 4,
                    partsLine: '    Line 4',
                    partsIndentLength: 0,
                    indentDiff: -4,
                });
            });
        });

        describe("ignores indent width >>", () => {

            test("OK >> indent width (contents < parts)", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        '  Line 1',
                        '    Line 2',  // depth 1
                        '  Line 3',
                        '    Line 4',
                        '      Line 5',  // depth 2
                        '  Line 6',  // shallow 2
                        '    Line 7',
                        '      Line 8',
                        '    Line 9',  // shallow 1
                        '      Line 10',
                        '      Line 11',  // or (unexpected)
                    ], expectedParts: [
                        '        Line 1',
                        '            Line 2',
                        '        Line 3',
                        '            Line 4',
                        '                Line 5',
                        '        Line 6',
                        '            Line 7',
                        '                Line 8',
                        '            Line 9',
                        '                Line 10',
                        '                Line 11',  // same or different
                    ], forDiff: {
                        contentsLineNum: 11,  replaceContentsLine: "Line 11",  contentsIndentLength: 2,
                        partsLineNum: 11,  partsIndentLength: 8,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("OK >> indent width (contents > parts)", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        '---',
                        'Line 2',
                        '    Line 3',  // depth 1
                        'Line 4',
                        '    Line 5',
                        '        Line 6',  // depth 2
                        'Line 7',  // shallow 2
                        '    Line 8',
                        '        Line 9',
                        '    Line 10',  // shallow 1
                        '        Line 11',
                        '        Line 12',  // or (unexpected)
                    ], expectedParts: [
                        'Line 2',
                        '  Line 3',
                        'Line 4',
                        '  Line 5',
                        '    Line 6',
                        'Line 7',
                        '  Line 8',
                        '    Line 9',
                        '  Line 10',
                        '    Line 11',
                        '    Line 12',  // same or different
                    ], forDiff: {
                        contentsLineNum: 12,  replaceContentsLine: "Line 12",
                        partsLineNum: 11,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("OK >> YAML sequence of mappings >> width (contents < parts)", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        '    Line 1:',
                        '    - Line 2:',
                        '      Line 3:',
                        '        Line 4:',  // depth 2
                        '    - Line 5:',  // shallow to hyphen
                        '        Line 6:',
                        '          Line 7:',
                        '        Line 8:',  // shallow 1
                        '    - Line 9:',
                        '        Line 10:',
                        '          Line 11:',
                        '      Line 12:',  // shallow 2
                        '    Line 13:',
                        '       -  Line 14:',  // different width
                        '       -  Line 15:',  // continuous hyphen
                        '       -',            // hyphen only
                        '         Line 17:',
                        '         Line 18:',
                        '       -   #//',       // comment indent is not field indent of next line
                        '         Line 20:',
                        '         Line 21:',
                        '         Line 22:',
                        '       - Line 23:',
                        '         Line 24:',  // or (unexpected)
                    ], expectedParts: [
                        '            -   Line 2:',  // found hyphen with different indent width
                        '                Line 3:',
                        '                    Line 4:',
                        '            -   Line 5:',
                        '                    Line 6:',
                        '                        Line 7:',
                        '                    Line 8:',
                        '            -   Line 9:',
                        '                    Line 10:',
                        '                        Line 11:',
                        '                Line 12:',
                        '            Line 13:',
                        '                -   Line 14:',
                        '                -   Line 15:',
                        '                -',
                        '                    Line 17:',
                        '                    Line 18:',
                        '                -         #//',
                        '                    Line 20:',
                        '                    Line 21:',
                        `                    ${anyLinesTag}`,
                        '                -   Line 23:',
                        '                    Line 24:',  // same or different
                    ], forDiff: {
                        contentsLineNum: 24,  replaceContentsLine: "Line 24:",  contentsIndentLength: 4,
                        partsLineNum: 23,  partsIndentLength: 12,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("OK >> YAML sequence of mappings >> width (contents > parts)", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        '    Line 1:',
                        '    -   Line 2:',
                        '        Line 3:',
                        '            Line 4:',  // depth 2
                        '    -   Line 5:',  // shallow to hyphen
                        '            Line 6:',
                        '                Line 7:',
                        '            Line 8:',  // shallow 1
                        '    -   Line 9:',
                        '            Line 10:',
                        '                Line 11:',
                        '        Line 12:',  // shallow 2
                        '    Line 13:',
                        '       -  Line 14:',  // different width
                        '       -  Line 15:',  // continuous hyphen
                        '          Line 16:',
                        '          Line 17:',
                        '       -  Line 18:',
                        '          Line 19:',  // or (unexpected)
                    ], expectedParts: [
                        '   Line 1:',
                        '   - Line 2:',  // This hyphen line is same, even if different indent width
                        '     Line 3:',
                        '       Line 4:',
                        '   - Line 5:',
                        '       Line 6:',
                        '         Line 7:',
                        '       Line 8:',
                        '   - Line 9:',
                        '       Line 10:',
                        '         Line 11:',
                        '     Line 12:',
                        '   Line 13:',
                        '     - Line 14:',
                        '     - Line 15:',
                        '       Line 16:',
                        `       ${anyLinesTag}`,
                        '     - Line 18:',
                        '       Line 19:',  // same or different
                    ], forDiff: {
                        contentsLineNum: 16,  replaceContentsLine: "Line 16:",  contentsIndentLength: 4,
                        partsLineNum: 16,  partsIndentLength: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("OK >> YAML sequence of mappings >> first line contents", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        '    -   Line 1:',  // This line will be not matched
                        '    -   Line 2:',
                        '        Line 3:',
                    ], expectedParts: [
                        '   - Line 2:',
                        '     Line 3:',  // same or different
                    ], forDiff: {
                        contentsLineNum: 3,  replaceContentsLine: "Line 3:",  contentsIndentLength: 4,
                        partsLineNum: 2,  partsIndentLength: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("OK >> YAML sequence of mappings >> first line comment indent", () => {
                const  testData: testOfCheckFileContentsTestData = {
                    testingContents: [
                        '    -      #// This line will be not match',
                        '    - #//',
                        '        Line 3:',
                    ], expectedParts: [
                        '   -       #//',
                        '     Line 3:',  // same or different
                    ], forDiff: {
                        contentsLineNum: 3,  replaceContentsLine: "Line 3:",  contentsIndentLength: 4,
                        partsLineNum: 2,  partsIndentLength: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });

            test("Diff >> YAML comment with the hyphen in parts second line", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'block:',
                        '    - #// bad comment',
                        '        1stField:',
                        '        2ndField:',
                    ],[
                        // expectedParts
                        'block:',
                        '    -   #// comment',
                        '        1stField:',
                        '        2ndField:',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 2,
                    contentsLine: '    - #// bad comment',
                    contentsIndentLength: 0,
                    partsLineNum: 2,
                    partsLine: '    -   #// comment',
                    partsIndentLength: 0,
                    indentDiff: 0,
                });
            });

            test("Diff >> shallow level", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        '    Line 2',
                        '        Line 3',
                        '    Line 4',
                    ],[
                        // expectedParts
                        'Line 1',
                        '  Line 2',
                        '    Line 3',
                        'Line 4',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 4,
                    contentsLine: '    Line 4',
                    contentsIndentLength: 0,
                    partsLineNum: 4,
                    partsLine: 'Line 4',
                    partsIndentLength: 0,
                    indentDiff: 4,
                });
            });

            test("Diff >> shallow level >> opposite", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        'Line 1',
                        '    Line 2',
                        '        Line 3',
                        'Line 4',
                    ],[
                        // expectedParts
                        'Line 1',
                        '  Line 2',
                        '    Line 3',
                        '  Line 4',
                    ],
                    anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 4,
                    contentsLine: 'Line 4',
                    contentsIndentLength: 0,
                    partsLineNum: 4,
                    partsLine: '  Line 4',
                    partsIndentLength: 0,
                    indentDiff: -2,
                });
            });
        });

        interface  testOfCheckFileContentsTestData {
            testingContents: string[];
            expectedParts: string[];
            forDiff: {
                contentsLineNum: number;
                contentsLine?: string;
                contentsIndentLength?: number;
                replaceContentsLine: string;
                partsLineNum: number;
                partsIndentLength?: number;
                indentDiff?: number;
            }
        }

        function  simpleTestOfCheckFileContents(testData: testOfCheckFileContentsTestData) {
            const  { testingContents, expectedParts } = testData;

            const  unexpectedLine = lib.checkTextContents(
                testingContents,
                expectedParts,
                anyLinesTag);
            expect(unexpectedLine).toStrictEqual(null);
        }

        function  alternateTestsOfCheckFileContents(testData: testOfCheckFileContentsTestData) {
            var  { testingContents, expectedParts } = testData;
            var  { contentsLineNum, replaceContentsLine, contentsLine, contentsIndentLength,
                partsLineNum, partsIndentLength, indentDiff } = testData.forDiff;
            contentsLine = contentsLine || '(unexpected)';
            contentsIndentLength = contentsIndentLength || 0;
            partsIndentLength = partsIndentLength || 0;
            indentDiff = indentDiff || 0;

            // Test case of unexpected parts
            const  unexpectedLine = lib.checkTextContents(
                testingContents.map((line) =>
                    (line.includes(replaceContentsLine) ? '(unexpected)': line)),
                expectedParts,
                anyLinesTag);
            expect(unexpectedLine).toStrictEqual({
                contentsLineNum,
                contentsLine: (contentsLineNum === 0) ? '' : contentsLine,
                contentsIndentLength,
                partsLineNum,
                partsLine: expectedParts[partsLineNum-1],
                partsIndentLength,
                indentDiff,
            });
        }
    });

    describe("coloredDiff >>", () => {
        const  green = chalk.bgGreen.black;
        const  red = chalk.bgRed.black;

        test("1st", () => {
            const  result = lib.coloredDiff('0125dd89Y', '012aa589X');
            expect(result.redLine).toBe(`0125${red('dd')}89${red('Y')}`);
            expect(result.greenLine).toBe(`012${green('aa')}589${green('X')}`);
        });
        test("header", () => {
            const  result = lib.coloredDiff('red: 0125dd89Y', 'green: 012aa589X', 'red: '.length, 'green: '.length);
            expect(result.redLine).toBe(`red: 0125${red('dd')}89${red('Y')}`);
            expect(result.greenLine).toBe(`green: 012${green('aa')}589${green('X')}`);
        });
    });
});

describe("data >>", () => {
    test("stableUniqueFilterFunction >>", async () => {
        const  array1 = [
            {id: 1, value:'A'},
            {id: 2, value:'B'},
            {id: 3, value:'C'},
            {id: 4, value:'B'},
        ];

        const  uniqueArray1 = array1.filter(lib.stableUniqueFilterFunction((found1, found2) =>
            found1.value == found2.value));
        expect(uniqueArray1).toStrictEqual([
            {id: 1, value:'A'},
            {id: 2, value:'B'},
            {id: 3, value:'C'},
        ]);
    });

    test("lastUniqueFilterFunction >>", async () => {
        const  array1 = [
            {id: 1, value:'A'},
            {id: 2, value:'B'},
            {id: 3, value:'C'},
            {id: 4, value:'B'},
        ];

        const  uniqueArray1 = array1.filter(lib.lastUniqueFilterFunction((found1, found2) =>
            found1.value == found2.value));
        expect(uniqueArray1).toStrictEqual([
            {id: 1, value:'A'},
            {id: 3, value:'C'},
            {id: 4, value:'B'},
        ]);
    });

    test("fastUniqueFilter >>", async () => {
        const  array1 = [
            {id: 1, value:'A'},
            {id: 2, value:'B'},
            {id: 3, value:'C'},
            {id: 4, value:'B'},
        ];

        const  uniqueArray1 = lib.fastUniqueFilter(array1, (element) => (element.value));
        expect(uniqueArray1).toStrictEqual([
            {id: 1, value:'A'},
            {id: 4, value:'B'},
            {id: 3, value:'C'},
        ]);
    });
    test("parseMap >>", async () => {
        const  resultMap = await lib.parseMap<number,string>(`Map {
            1 =>  "a",
            5 =>  "bb",
            3  => "cc",
            22 => "ddd",
        }`);
        expect(Array.from(resultMap)).toStrictEqual([
            [1, "a"],
            [5, "bb"],
            [3, "cc"],
            [22, "ddd"],
        ]);
        expect(Array.from(resultMap)).not.toStrictEqual([
            [1, "a"],
            [3, "cc"],  // Bad order
            [5, "bb"],
            [22, "ddd"],
        ]);
    });
});

describe("alphabetIndex >>", () => {

    test("isAlphabetIndex >>", () => {
        expect(lib.isAlphabetIndex('/1/a')).toBe(true);
        expect(lib.isAlphabetIndex('/1')).toBe(false);
        expect(lib.isAlphabetIndex('/2')).toBe(false);
        expect(lib.isAlphabetIndex('/1/a/b')).toBe(true);
    });

    test("getAlphabetIndex >>", () => {
        expect(lib.getAlphabetIndex(1)).toBe('a');
        expect(lib.getAlphabetIndex(2)).toBe('b');
        expect(lib.getAlphabetIndex(3)).toBe('c');
        expect(lib.getAlphabetIndex(25)).toBe('y');
        expect(lib.getAlphabetIndex(26)).toBe('z26z');
        expect(lib.getAlphabetIndex(27)).toBe('z27z');
        expect(lib.getAlphabetIndex(28)).toBe('z28z');
    });

    test("fromAlphabetIndex >>", () => {
        expect(lib.fromAlphabetIndex('a')).toBe(1);
        expect(lib.fromAlphabetIndex('b')).toBe(2);
        expect(lib.fromAlphabetIndex('c')).toBe(3);
        expect(lib.fromAlphabetIndex('y')).toBe(25);
        expect(lib.fromAlphabetIndex('z26z')).toBe(26);
        expect(lib.fromAlphabetIndex('z27z')).toBe(27);
        expect(lib.fromAlphabetIndex('z28z')).toBe(28);
    });

    test("cutAlphabetInIndex >>", () => {
        expect(lib.cutAlphabetInIndex('/1/a')).toBe('/1');
        expect(lib.cutAlphabetInIndex('/1/a/b')).toBe('/1');
        expect(lib.cutAlphabetInIndex('/1')).toBe('/1');
        expect(lib.cutAlphabetInIndex('/')).toBe('/');
        expect(lib.cutAlphabetInIndex('/a')).toBe('/');
        expect(lib.cutAlphabetInIndex('/a/b')).toBe('/');
        expect(lib.cutAlphabetInIndex('/1/2/a')).toBe('/1/2');
        expect(lib.cutAlphabetInIndex('/1/2/a/b')).toBe('/1/2');
        expect(lib.cutAlphabetInIndex('/1/2')).toBe('/1/2');
    });
});
