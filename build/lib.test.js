import * as fs from "fs";
import * as lib from "./lib";
import * as path from "path";
import chalk from 'chalk';
var anyLinesTag = '#anyLines:';
describe("string >>", () => {
    describe("cutIndent >>", () => {
        test("1st", () => {
            const withoutIndent = lib.cutIndent([
                '    Line 1',
                '        Line 2',
            ]);
            expect(withoutIndent).toStrictEqual([
                'Line 1',
                '    Line 2',
            ]);
        });
        test("1st line is deeper", () => {
            const withoutIndent = lib.cutIndent([
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
            const unexpectedLine = lib.unexpandVariable('abcXdef', [['$a', 'abc'], ['$d', 'def']]);
            expect(unexpectedLine).toBe('$aX$d');
        });
        test("not regular expression", () => {
            const unexpectedLine = lib.unexpandVariable('abcde_ab.*e', [['$a', 'ab.*e']]);
            expect(unexpectedLine).toBe('abcde_$a');
        });
        describe("order >>", () => {
            test("descending", () => {
                const unexpectedLine = lib.unexpandVariable('abcdef', [['${ab}', 'abcde'], ['${a}', 'abc']]);
                expect(unexpectedLine).toBe('${ab}f');
            });
            test("ascending", () => {
                const unexpectedLine = lib.unexpandVariable('abcdef', [['${a}', 'abc'], ['${ab}', 'abcde']]);
                expect(unexpectedLine).toBe('${a}def');
            });
        });
        describe("matched replaced >>", () => {
            test("replaced", () => {
                const unexpectedLine = lib.unexpandVariable('abc_def_$g', [['${abc}', 'def'], ['${d}', 'abc'], ['\\$', '$']]);
                expect(unexpectedLine).toBe('${d}_${abc}_\\$g');
            });
            test("already replaced", () => {
                const unexpectedLine = lib.unexpandVariable('${d}_def_$g', [['${abc}', 'def'], ['${d}', 'abc'], ['\\$', '$']]);
                expect(unexpectedLine).toBe('${d}_${abc}_\\$g');
            });
        });
        test("replaced indices", () => {
            const replacedIndices = [];
            const unexpectedLine = lib.unexpandVariable('abc_def_$g', [['${abc}', 'def'], ['${d}', 'abc'], ['${n}', 'not found'], ['\\$', '$']], replacedIndices);
            expect(replacedIndices).toStrictEqual([0, 1, 3]);
            expect(unexpectedLine).toBe('${d}_${abc}_\\$g');
        });
    });
    describe("checkExpectedTextContents >>", () => {
        describe("basic >>", () => {
            test("Same", () => {
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    'Line 2',
                    'Line 3',
                ], [
                    // expectedParts
                    'Line 2',
                ], anyLinesTag);
                expect(unexpectedLine).toStrictEqual(null);
            });
            test("Diff >> Not found expected line 1", () => {
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    'Line 2',
                    'Line 3',
                ], [
                    // expectedParts
                    'not found line',
                ], anyLinesTag);
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
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    '2: unexpected',
                    'Line 1',
                    'Line 2',
                    '5: unexpected',
                    'Line 1',
                    '7: unexpected',
                ], [
                    // expectedParts
                    'Line 1',
                    'Line 2',
                    'Line 3',
                ], anyLinesTag);
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
                const testData = {
                    testingContents: [
                        'Line 1',
                        'Line 2',
                        'Line 3',
                    ], expectedParts: [
                        'Line 1',
                        'Line 2',
                    ], forDiff: {
                        contentsLineNum: 2, replaceContentsLine: "Line 2",
                        partsLineNum: 2,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Same >> Found the part line 1 in second line in contents", () => {
                const testData = {
                    testingContents: [
                        "Line 1 or 3",
                        "unexpected",
                        "Line 1 or 3",
                        "Line 4",
                        "Line 5", // or (unexpected)
                    ], expectedParts: [
                        "Line 1 or 3",
                        "Line 4",
                        "Line 5", // same or different
                    ], forDiff: {
                        contentsLineNum: 5, replaceContentsLine: "Line 5",
                        partsLineNum: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Same >> empty line", () => {
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    '    Line 1',
                    '',
                    '    Line 3',
                ], [
                    // expectedParts
                    '    Line 1',
                    '',
                    '    Line 3',
                ], anyLinesTag);
                expect(unexpectedLine).toStrictEqual(null);
            });
            test("Same >> empty lines", () => {
                const unexpectedLine = lib.checkExpectedTextContents([], [], anyLinesTag);
                expect(unexpectedLine).toStrictEqual(null);
            });
            test("Same >> empty expected", () => {
                const unexpectedLine = lib.checkExpectedTextContents(["Line 1"], [], anyLinesTag);
                expect(unexpectedLine).toStrictEqual(null);
            });
            test("Same >> empty lines check", () => {
                const unexpectedLine = lib.checkExpectedTextContents([], ["Line 1"], anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 0,
                    contentsLine: '',
                    contentsIndentLength: 0,
                    partsLineNum: 1,
                    partsLine: 'Line 1',
                    partsIndentLength: 0,
                    indentDiff: 0,
                });
            });
            test("OK and Diff >> any lines tag >> different line 1 line below any lines tag", () => {
                const testData = {
                    testingContents: [
                        "Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 7", "Line 8",
                        "Line 9",
                        "Line 10", // or (unexpected)
                    ], expectedParts: [
                        "Line 2",
                        anyLinesTag,
                        "Line 4",
                        anyLinesTag,
                        "Line 7",
                        "Line 8",
                        anyLinesTag,
                        "Line 10", // same or different
                    ], forDiff: {
                        contentsLineNum: 9,
                        contentsLine: "Line 9",
                        replaceContentsLine: "Line 10",
                        partsLineNum: 8,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Diff >> any lines tag >> different line 2 lines below any lines tag, anyLinesTag next line is deeper", () => {
                const testData = {
                    testingContents: [
                        "Line 1", "Line 2", "Line 3",
                        "Line 4",
                        "    Line 5",
                        "    Line 6",
                        "        Line 7",
                        "        Line 8",
                        "Line 9", // or (unexpected)
                    ], expectedParts: [
                        "Line 1",
                        `${anyLinesTag}`,
                        "Line 4",
                        `${anyLinesTag}`,
                        "    Line 6",
                        `        ${anyLinesTag}`,
                        "        Line 8",
                        "Line 9", // same or different
                    ], forDiff: {
                        contentsLineNum: 9, replaceContentsLine: "Line 9",
                        partsLineNum: 8,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Diff >> any lines tag >> at first line", () => {
                const testData = {
                    testingContents: [
                        "Line 1",
                        "    Line 2",
                        "        Line 3",
                        "    Line 4", // or (unexpected)
                    ], expectedParts: [
                        `${anyLinesTag}`,
                        "    Line 3",
                        "Line 4", // same or different
                    ], forDiff: {
                        contentsLineNum: 4, replaceContentsLine: "Line 4", contentsIndentLength: 4,
                        partsLineNum: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
        });
        describe("ignores indent depth >>", () => {
            test("OK >> indent depth (contents < parts)", () => {
                const testData = {
                    testingContents: [
                        ' Line 1',
                        ' unexpected',
                        ' Line 3',
                        '     Line 4',
                        ' Line 5',
                        '     Line 6',
                        '         Line 7',
                        ' Line 8',
                        '     Line 9',
                        '         Line 10',
                        '     Line 11',
                        '         Line 12',
                        '         Line 13', // or (unexpected)
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
                        '            Line 13', // same or different
                    ], forDiff: {
                        contentsLineNum: 13, replaceContentsLine: "         Line 13", contentsIndentLength: 1,
                        partsLineNum: 11, partsIndentLength: 4,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("OK >> indent depth (contents > parts)", () => {
                const testData = {
                    testingContents: [
                        '    Line 1',
                        '        Line 2',
                        '    Line 3',
                        '        Line 4',
                        '            Line 5',
                        '    Line 6',
                        '        Line 7',
                        '            Line 8',
                        '        Line 9',
                        '            Line 10',
                        '            Line 11', // or (unexpected)
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
                        '         Line 11', // same or different
                    ], forDiff: {
                        contentsLineNum: 11, replaceContentsLine: "Line 11", contentsIndentLength: 4,
                        partsLineNum: 11, partsIndentLength: 1,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Diff >> Different indent", () => {
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    '    Line 1',
                    '    Line 2',
                ], [
                    // expectedParts
                    '  Line 1',
                    '      Line 2',
                ], anyLinesTag);
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
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    '    Line 2',
                    '        Line 3',
                ], [
                    // expectedParts
                    'Line 1',
                    '    Line 2',
                    'Line 3',
                ], anyLinesTag);
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
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    '    Line 2',
                    '        Line 3',
                    '    Line 4',
                ], [
                    // expectedParts
                    'Line 1',
                    '    Line 2',
                    '        Line 3',
                    'Line 4',
                ], anyLinesTag);
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
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    '    Line 2',
                    '        Line 3',
                    'Line 4',
                ], [
                    // expectedParts
                    'Line 1',
                    '    Line 2',
                    '        Line 3',
                    '    Line 4',
                ], anyLinesTag);
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
            test("Diff >> bug case 1", () => {
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    '    aaa',
                ], [
                    // expectedParts
                    '    bbb',
                ], anyLinesTag);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 0,
                    contentsLine: '',
                    contentsIndentLength: 0,
                    partsLineNum: 1,
                    partsLine: '    bbb',
                    partsIndentLength: 4,
                    indentDiff: 0,
                });
            });
        });
        describe("ignores indent width >>", () => {
            test("OK >> indent width (contents < parts)", () => {
                const testData = {
                    testingContents: [
                        '  Line 1',
                        '    Line 2',
                        '  Line 3',
                        '    Line 4',
                        '      Line 5',
                        '  Line 6',
                        '    Line 7',
                        '      Line 8',
                        '    Line 9',
                        '      Line 10',
                        '      Line 11', // or (unexpected)
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
                        '                Line 11', // same or different
                    ], forDiff: {
                        contentsLineNum: 11, replaceContentsLine: "Line 11", contentsIndentLength: 2,
                        partsLineNum: 11, partsIndentLength: 8,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("OK >> indent width (contents > parts)", () => {
                const testData = {
                    testingContents: [
                        '---',
                        'Line 2',
                        '    Line 3',
                        'Line 4',
                        '    Line 5',
                        '        Line 6',
                        'Line 7',
                        '    Line 8',
                        '        Line 9',
                        '    Line 10',
                        '        Line 11',
                        '        Line 12', // or (unexpected)
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
                        '    Line 12', // same or different
                    ], forDiff: {
                        contentsLineNum: 12, replaceContentsLine: "Line 12",
                        partsLineNum: 11,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("OK >> YAML sequence of mappings >> width (contents < parts)", () => {
                const testData = {
                    testingContents: [
                        '    Line 1:',
                        '    - Line 2:',
                        '      Line 3:',
                        '        Line 4:',
                        '    - Line 5:',
                        '        Line 6:',
                        '          Line 7:',
                        '        Line 8:',
                        '    - Line 9:',
                        '        Line 10:',
                        '          Line 11:',
                        '      Line 12:',
                        '    Line 13:',
                        '       -  Line 14:',
                        '       -  Line 15:',
                        '       -',
                        '         Line 17:',
                        '         Line 18:',
                        '       -   #//',
                        '         Line 20:',
                        '         Line 21:',
                        '         Line 22:',
                        '       - Line 23:',
                        '         Line 24:', // or (unexpected)
                    ], expectedParts: [
                        '            -   Line 2:',
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
                        '                    Line 24:', // same or different
                    ], forDiff: {
                        contentsLineNum: 24, replaceContentsLine: "Line 24:", contentsIndentLength: 4,
                        partsLineNum: 23, partsIndentLength: 12,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("OK >> YAML sequence of mappings >> width (contents > parts)", () => {
                const testData = {
                    testingContents: [
                        '    Line 1:',
                        '    -   Line 2:',
                        '        Line 3:',
                        '            Line 4:',
                        '    -   Line 5:',
                        '            Line 6:',
                        '                Line 7:',
                        '            Line 8:',
                        '    -   Line 9:',
                        '            Line 10:',
                        '                Line 11:',
                        '        Line 12:',
                        '    Line 13:',
                        '       -  Line 14:',
                        '       -  Line 15:',
                        '          Line 16:',
                        '          Line 17:',
                        '       -  Line 18:',
                        '          Line 19:', // or (unexpected)
                    ], expectedParts: [
                        '   Line 1:',
                        '   - Line 2:',
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
                        '       Line 19:', // same or different
                    ], forDiff: {
                        contentsLineNum: 16, replaceContentsLine: "Line 16:", contentsIndentLength: 4,
                        partsLineNum: 16, partsIndentLength: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("OK >> YAML sequence of mappings >> first line contents", () => {
                const testData = {
                    testingContents: [
                        '    -   Line 1:',
                        '    -   Line 2:',
                        '        Line 3:',
                    ], expectedParts: [
                        '   - Line 2:',
                        '     Line 3:', // same or different
                    ], forDiff: {
                        contentsLineNum: 3, replaceContentsLine: "Line 3:", contentsIndentLength: 4,
                        partsLineNum: 2, partsIndentLength: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("OK >> YAML sequence of mappings >> first line comment indent", () => {
                const testData = {
                    testingContents: [
                        '    -      #// This line will be not match',
                        '    - #//',
                        '        Line 3:',
                    ], expectedParts: [
                        '   -       #//',
                        '     Line 3:', // same or different
                    ], forDiff: {
                        contentsLineNum: 3, replaceContentsLine: "Line 3:", contentsIndentLength: 4,
                        partsLineNum: 2, partsIndentLength: 3,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Diff >> YAML comment with the hyphen in parts second line", () => {
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'block:',
                    '    - #// bad comment',
                    '        1stField:',
                    '        2ndField:',
                ], [
                    // expectedParts
                    'block:',
                    '    -   #// comment',
                    '        1stField:',
                    '        2ndField:',
                ], anyLinesTag);
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
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    '    Line 2',
                    '        Line 3',
                    '    Line 4',
                ], [
                    // expectedParts
                    'Line 1',
                    '  Line 2',
                    '    Line 3',
                    'Line 4',
                ], anyLinesTag);
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
                const unexpectedLine = lib.checkExpectedTextContents([
                    // testingContents
                    'Line 1',
                    '    Line 2',
                    '        Line 3',
                    'Line 4',
                ], [
                    // expectedParts
                    'Line 1',
                    '  Line 2',
                    '    Line 3',
                    '  Line 4',
                ], anyLinesTag);
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
        function simpleTestOfCheckFileContents(testData) {
            const { testingContents, expectedParts } = testData;
            const unexpectedLine = lib.checkExpectedTextContents(testingContents, expectedParts, anyLinesTag);
            expect(unexpectedLine).toStrictEqual(null);
        }
        function alternateTestsOfCheckFileContents(testData) {
            var { testingContents, expectedParts } = testData;
            var { contentsLineNum, replaceContentsLine, contentsLine, contentsIndentLength, partsLineNum, partsIndentLength, indentDiff } = testData.forDiff;
            contentsLine = contentsLine || '(unexpected)';
            contentsIndentLength = contentsIndentLength || 0;
            partsIndentLength = partsIndentLength || 0;
            indentDiff = indentDiff || 0;
            // Test case of unexpected parts
            const unexpectedLine = lib.checkExpectedTextContents(testingContents.map((line) => (line.includes(replaceContentsLine) ? '(unexpected)' : line)), expectedParts, anyLinesTag);
            expect(unexpectedLine).toStrictEqual({
                contentsLineNum,
                contentsLine: (contentsLineNum === 0) ? '' : contentsLine,
                contentsIndentLength,
                partsLineNum,
                partsLine: expectedParts[partsLineNum - 1],
                partsIndentLength,
                indentDiff,
            });
        }
    });
    describe("coloredDiff >>", () => {
        const green = chalk.bgGreen.black;
        const red = chalk.bgRed.black;
        test("1st", () => {
            const result = lib.coloredDiff('0125dd89Y', '012aa589X');
            expect(result.redLine).toBe(`0125${red('dd')}89${red('Y')}`);
            expect(result.greenLine).toBe(`012${green('aa')}589${green('X')}`);
        });
        test("header", () => {
            const result = lib.coloredDiff('red: 0125dd89Y', 'green: 012aa589X', 'red: '.length, 'green: '.length);
            expect(result.redLine).toBe(`red: 0125${red('dd')}89${red('Y')}`);
            expect(result.greenLine).toBe(`green: 012${green('aa')}589${green('X')}`);
        });
    });
    test("toWordArray", () => {
        const jpsp = String.fromCodePoint(0x3000); // Japanese space
        expect(lib.toWordArray('some words')).toEqual(['some', 'words']);
        expect(lib.toWordArray('some  words')).toEqual(['some', 'words']);
        expect(lib.toWordArray(`some${jpsp}words`)).toEqual(['some', 'words']);
        expect(lib.toWordArray(`some${jpsp}${jpsp}words`)).toEqual(['some', 'words']);
        expect(lib.toWordArray(' some words ')).toEqual(['some', 'words']);
        expect(lib.toWordArray(`${jpsp}some words${jpsp}`)).toEqual(['some', 'words']);
        expect(lib.toWordArray('word')).toEqual(['word']);
        expect(lib.toWordArray('')).toEqual([]);
    });
    test("getWordCount", () => {
        const jpsp = String.fromCodePoint(0x3000); // Japanese space
        expect(lib.getWordCount('some words')).toBe(2);
        expect(lib.getWordCount('some  words')).toBe(2);
        expect(lib.getWordCount(`some${jpsp}words`)).toBe(2);
        expect(lib.getWordCount(`some${jpsp}${jpsp}words`)).toBe(2);
        expect(lib.getWordCount(' some words ')).toBe(2);
        expect(lib.getWordCount(`${jpsp}some words${jpsp}`)).toBe(2);
        expect(lib.getWordCount('word')).toBe(1);
        expect(lib.getWordCount('')).toBe(0);
    });
    test("splitIdioms", () => {
        expect(lib.splitIdioms('timeout', ['time', 'out'])).toBe('time out');
        expect(lib.splitIdioms('timeout timeout', ['long', 'time', 'out'])).toBe('time out time out');
        expect(lib.splitIdioms('timeou', ['time', 'out'])).toBe('timeou');
        expect(lib.splitIdioms('timeouts', ['time', 'out'])).toBe('timeouts');
        expect(lib.splitIdioms('time out', ['other', 'words'])).toBe('time out');
        expect(lib.splitIdioms('double  space  timeout', ['time', 'out'])).toBe('double  space  time out');
        expect(lib.splitIdioms('タイムアウト', ['タイム', 'time', 'アウト'])).toBe('タイム アウト');
        expect(lib.splitIdioms('clipboard', ['clip', 'board'])).toBe('clip board');
        expect(lib.splitIdioms('clipboard', ['clip', 'board', 'clipboard'])).toBe('clipboard');
    });
    test("chageToAlphabets", () => {
        expect(lib.chageToAlphabets('ｃｄ')).toBe('cd');
        expect(lib.chageToAlphabets('ｃｄ ')).toBe('cd ');
        expect(lib.chageToAlphabets('ｃｄ　')).toBe('cd ');
        expect(lib.chageToAlphabets('んｐｍ てｓｔ ')).toBe('npm test ');
        expect(lib.chageToAlphabets('んｐｍ　てｓｔ　')).toBe('npm test ');
        expect(lib.chageToAlphabets('あｂｃｄえｆｇｈいｊｋｌｍんおｐｑｒｓｔうｖｗｘｙｚ')).toBe('abcdefghijklmnopqrstuvwxyz');
        expect(lib.chageToAlphabets('かきくけこ さしすせそ たちつてと なにぬねの はひふへほ まみむめも やゆよ らりるれろ わをん')).toBe('kakikukeko sasisuseso tatituteto naninuneno hahifuheho mamimumemo yayuyo rarirurero wawon');
        expect(lib.chageToAlphabets('きゃきゅきょ しゃしゅしょ ちゃちゅちょ にゃにゅにょ ひゃひゅひょ ふぁふぃふぇふぉ みゃみゅみょ りゃりゅりょ')).toBe('kyakyukyo shashusho chachucho nyanyunyo hyahyuhyo fafifefo myamyumyo ryaryuryo');
        expect(lib.chageToAlphabets('がぎぐげご ざじずぜぞ だぢづでど ばびぶべぼ ぱぴぷぺぽ')).toBe('gagigugego zajizuzezo dadidudedo babibubebo papipupepo');
        expect(lib.chageToAlphabets('ぎゃぎゅぎょ じゃじゅじょ ぢゃぢゅぢょ びゃびゅびょ ぴゃぴゅぴょ')).toBe('gyagyugyo jajujo dyadyudyo byabyubyo pyapyupyo');
        expect(lib.chageToAlphabets('ぁぃぅぇぉゔぁゔぃゔゔぇゔぉうぃうぇすぁすぃすぅすぇすぉでゃでぃでゅでぇでょくぁくぃくぅくぇくぉ')).toBe('lalilulelovavivuvevowiweswaswiswusweswodhadelidhudeledhoqaqiquqeqo');
        expect(lib.chageToAlphabets('っかっきっくっけっこっさっしっすっせっそったっちっつってっとっはっひっふっへっほっふぁっふぃっふぇっふぉ')).toBe('kkakkikkukkekkossassissussessottattittuttettohhahhiffuhhehhoffaffiffeffo');
        expect(lib.chageToAlphabets('っまっみっむっめっもっやっゆっよっいぇっらっりっるっれっろっぁっぃっぅっぇっぉ')).toBe('mmammimmummemmoyyayyuyyoyyerrarrirrurrerrollallillullello');
        expect(lib.chageToAlphabets('っがっぎっぐっげっごっざっじっずっぜっぞっだっぢっづっでっどっばっびっぶっべっぼっぱっぴっぷっぺっぽ')).toBe('ggaggigguggeggozzazzizzuzzezzoddaddidduddeddobbabbibbubbebboppappippuppeppo');
        expect(lib.chageToAlphabets('！”＃＄％＆’（）ー＝＾〜＼｜＠｀「『；＋：＊」』、＜。＞・？＿')).toBe('!"#$%&\'()-=^~\\|@`[{;+:*]},<.>/?_');
        expect(lib.chageToAlphabets('でぇて ')).toBe('delete ');
    });
});
describe("data >>", () => {
    test("stableUniqueFilterFunction", async () => {
        const array1 = [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
            { id: 4, value: 'B' },
        ];
        const uniqueArray1 = array1.filter(lib.stableUniqueFilterFunction((found1, found2) => found1.value == found2.value));
        expect(uniqueArray1).toStrictEqual([
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
        ]);
    });
    test("lastUniqueFilterFunction", async () => {
        const array1 = [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
            { id: 4, value: 'B' },
        ];
        const uniqueArray1 = array1.filter(lib.lastUniqueFilterFunction((found1, found2) => found1.value == found2.value));
        expect(uniqueArray1).toStrictEqual([
            { id: 1, value: 'A' },
            { id: 3, value: 'C' },
            { id: 4, value: 'B' },
        ]);
    });
    test("fastUniqueFilter", async () => {
        const array1 = [
            { id: 1, value: 'A' },
            { id: 2, value: 'B' },
            { id: 3, value: 'C' },
            { id: 4, value: 'B' },
        ];
        const uniqueArray1 = lib.fastUniqueFilter(array1, (element) => (element.value));
        expect(uniqueArray1).toStrictEqual([
            { id: 1, value: 'A' },
            { id: 4, value: 'B' },
            { id: 3, value: 'C' },
        ]);
    });
    test("parseMap", async () => {
        const resultMap = await lib.parseMap(`Map {
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
            [3, "cc"],
            [5, "bb"],
            [22, "ddd"],
        ]);
    });
});
describe("alphabetIndex >>", () => {
    test("isAlphabetIndex", () => {
        expect(lib.isAlphabetIndex('/1/a')).toBe(true);
        expect(lib.isAlphabetIndex('/1')).toBe(false);
        expect(lib.isAlphabetIndex('/2')).toBe(false);
        expect(lib.isAlphabetIndex('/1/a/b')).toBe(true);
    });
    test("getAlphabetIndex", () => {
        expect(lib.getAlphabetIndex(1)).toBe('a');
        expect(lib.getAlphabetIndex(2)).toBe('b');
        expect(lib.getAlphabetIndex(3)).toBe('c');
        expect(lib.getAlphabetIndex(25)).toBe('y');
        expect(lib.getAlphabetIndex(26)).toBe('z26z');
        expect(lib.getAlphabetIndex(27)).toBe('z27z');
        expect(lib.getAlphabetIndex(28)).toBe('z28z');
    });
    test("fromAlphabetIndex", () => {
        expect(lib.fromAlphabetIndex('a')).toBe(1);
        expect(lib.fromAlphabetIndex('b')).toBe(2);
        expect(lib.fromAlphabetIndex('c')).toBe(3);
        expect(lib.fromAlphabetIndex('y')).toBe(25);
        expect(lib.fromAlphabetIndex('z26z')).toBe(26);
        expect(lib.fromAlphabetIndex('z27z')).toBe(27);
        expect(lib.fromAlphabetIndex('z28z')).toBe(28);
    });
    test("cutAlphabetInIndex", () => {
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
describe("file and file path >>", () => {
    test("isFullPath", () => {
        expect(lib.isFullPath('/path')).toEqual(true);
        expect(lib.isFullPath('\\path')).toEqual(true);
        expect(lib.isFullPath('\\\\pc\\path')).toEqual(true);
        expect(lib.isFullPath('path')).toEqual(false);
        expect(lib.isFullPath('http://example.com')).toEqual(true);
        expect(lib.isFullPath('http://example.com:80')).toEqual(true);
        expect(lib.isFullPath('path/path')).toEqual(false);
        expect(lib.isFullPath('/file.md:csv#a,b')).toEqual(true);
    });
    test("isInFileSystem", () => {
        expect(lib.isInFileSystem('/path')).toEqual(true);
        expect(lib.isInFileSystem('\\path')).toEqual(true);
        expect(lib.isInFileSystem('\\\\pc\\path')).toEqual(true);
        expect(lib.isInFileSystem('path')).toEqual(true);
        expect(lib.isInFileSystem('http://example.com')).toEqual(false);
        expect(lib.isInFileSystem('http://example.com:80')).toEqual(false);
        expect(lib.isInFileSystem('c:\\Program Files')).toEqual(true);
        expect(lib.isInFileSystem('z:\\')).toEqual(true);
        expect(lib.isInFileSystem('z:/')).toEqual(true);
        expect(lib.isInFileSystem('path/path')).toEqual(true);
        expect(lib.isInFileSystem('/file.md:csv#a,b')).toEqual(true);
        // "file" URI scheme is not supported in this library.
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1299624
    });
    test("getExistingParentPath", () => {
        fs.mkdirSync(`${__dirname}/_lib_test`, { recursive: true });
        expect(lib.getExistingParentPath(`${__dirname}/_lib_test/sub/s`)).toEqual(`${__dirname}/_lib_test`.replace(/\//g, path.sep));
        expect(lib.getExistingParentPath(`${__dirname}/_lib_test/sub/s`.replace(/\//g, path.sep))).toEqual(`${__dirname}/_lib_test`.replace(/\//g, path.sep));
        lib.rmdirSync(`${__dirname}/_lib_test`);
    });
    // test("withHomeVariable", () => {
    //     const  home = lib.getHomePath();
    //     const  homePathLinux = home.replace(/\\/g, '/').replace(/^[A-Z]/, home[0].toLowerCase());
    //     const  homePathWindows = home.replace(/\//g, '\\').replace(/^[A-Z]/, home[0].toUpperCase());
    //     expect(lib.withHomeVariable(`${homePathLinux}`)).toEqual('${HOME}');
    //     expect(lib.withHomeVariable(`${homePathLinux}/bin`)).toEqual('${HOME}/bin');
    //     expect(lib.withHomeVariable(`${homePathWindows}`)).toEqual('${HOME}');
    //     expect(lib.withHomeVariable(`${homePathWindows}\\bin`)).toEqual('${HOME}\\bin');
    // });
    test("replacePathToSlashed", () => {
        expect(lib.replacePathToSlashed('\\path\\to')).toEqual('/path/to');
        expect(lib.replacePathToSlashed('\\path\\to\\ space')).toEqual('/path/to\\ space');
        expect(lib.replacePathToSlashed('\\\\pc\\folder\\sub/file.yaml')).toEqual('\\\\pc\\folder\\sub\\file.yaml');
        if (fs.existsSync('/mnt/c')) {
            expect(lib.replacePathToSlashed('c:\\path\\to')).toEqual('/mnt/c/path/to');
            expect(lib.replacePathToSlashed('c:/path/to')).toEqual('/mnt/c/path/to');
            expect(lib.replacePathToSlashed('/mnt/c/path/to')).toEqual('/mnt/c/path/to');
            expect(lib.replacePathToSlashed('C:\\')).toEqual('/mnt/c/');
            expect(lib.replacePathToSlashed('c:/')).toEqual('/mnt/c/');
            expect(lib.replacePathToSlashed('/mnt/c/')).toEqual('/mnt/c/');
            expect(lib.replacePathToSlashed('C:\\path\\to\\ space')).toEqual('/mnt/c/path/to\\ space');
            expect(lib.replacePathToSlashed('D:\\path\\to')).toEqual('/mnt/d/path/to');
            expect(lib.replacePathToSlashed('d:/path/to')).toEqual('/mnt/d/path/to');
            expect(lib.replacePathToSlashed('/mnt/d/path/to')).toEqual('/mnt/d/path/to');
        }
        else {
            expect(lib.replacePathToSlashed('c:\\path\\to')).toEqual('c:/path/to');
            expect(lib.replacePathToSlashed('c:/path/to')).toEqual('c:/path/to');
            expect(lib.replacePathToSlashed('/mnt/c/path/to')).toEqual('c:/path/to');
            expect(lib.replacePathToSlashed('C:\\')).toEqual('c:/');
            expect(lib.replacePathToSlashed('c:/')).toEqual('c:/');
            expect(lib.replacePathToSlashed('/mnt/c/')).toEqual('c:/');
            expect(lib.replacePathToSlashed('C:\\path\\to\\ space')).toEqual('c:/path/to\\ space');
            expect(lib.replacePathToSlashed('D:\\path\\to')).toEqual('d:/path/to');
            expect(lib.replacePathToSlashed('d:/path/to')).toEqual('d:/path/to');
            expect(lib.replacePathToSlashed('/mnt/d/path/to')).toEqual('d:/path/to');
        }
    });
    test("replaceToPathForWindows", () => {
        expect(lib.replaceToPathForWindows('C:\\path\\to')).toEqual('C:\\path\\to');
        expect(lib.replaceToPathForWindows('c:/path/to')).toEqual('C:\\path\\to');
        expect(lib.replaceToPathForWindows('/mnt/c/path/to')).toEqual('C:\\path\\to');
        expect(lib.replaceToPathForWindows('C:\\')).toEqual('C:\\');
        expect(lib.replaceToPathForWindows('c:/')).toEqual('C:\\');
        expect(lib.replaceToPathForWindows('/mnt/c/')).toEqual('C:\\');
        expect(lib.replaceToPathForWindows('C:')).toEqual('C:');
        expect(lib.replaceToPathForWindows('c:')).toEqual('C:');
        expect(lib.replaceToPathForWindows('/mnt/c')).toEqual('C:');
    });
    test.each([
        [
            "folder",
            "_test",
            "_test", ["**/*"],
        ], [
            "wildcard",
            "_test/*.yaml",
            "_test", ["**/*.yaml"],
        ], [
            "negate",
            "_test/{*, !node_modules}",
            "_test", ["**/*", "!**/node_modules"],
        ],
    ])("getGlobbyParameters >> %s", async (_caseName, arguments_, answerOfTarget, answerOfWildcard) => {
        fs.mkdirSync('_test', { recursive: true });
        const currentFolder = process.cwd();
        const result = await lib.getGlobbyParameters(arguments_, currentFolder);
        expect(result.targetFolderFullPath).toBe(`${currentFolder}/${answerOfTarget}`.replace(/\//g, path.sep));
        expect(result.globbyParameters).toEqual(answerOfWildcard);
        lib.rmdirSync('_test');
    });
});
//# sourceMappingURL=lib.test.js.map