import * as lib from "./lib";
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
    });
    describe("checkFileContents >>", () => {
        describe("basic >>", () => {
            test("Same", () => {
                const unexpectedLine = lib.checkTextContents([
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
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 1,
                    partsLine: 'not found line',
                });
            });
            test("Diff >> Different at many expected line", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 3,
                    partsLine: 'Line 3',
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
                const unexpectedLine = lib.checkTextContents([
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
            test("Diff >> any lines tag >> different line 2 lines below any lines tag", () => {
                const testData = {
                    testingContents: [
                        "Line 1", "Line 2", "Line 3",
                        "Line 4",
                        "Line 5", // or (unexpected)
                    ], expectedParts: [
                        "Line 1",
                        anyLinesTag,
                        "Line 4",
                        "Line 5", // same or different
                    ], forDiff: {
                        contentsLineNum: 5, replaceContentsLine: "Line 5",
                        partsLineNum: 4,
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
                        contentsLineNum: 4, replaceContentsLine: "Line 4",
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
                        contentsLineNum: 13, replaceContentsLine: "         Line 13",
                        partsLineNum: 11,
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
                        contentsLineNum: 11, replaceContentsLine: "Line 11",
                        partsLineNum: 11,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Diff >> Different indent", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 2,
                    partsLine: '      Line 2',
                });
            });
            test("Diff >> deeper and shallower", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 3,
                    partsLine: 'Line 3',
                });
            });
            test("Diff >> shallow level", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 4,
                    partsLine: 'Line 4',
                });
            });
            test("Diff >> shallow level >> opposite", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 4,
                    partsLine: '    Line 4',
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
                        contentsLineNum: 11, replaceContentsLine: "Line 11",
                        partsLineNum: 11,
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
                        contentsLineNum: 24, replaceContentsLine: "Line 24:",
                        partsLineNum: 23,
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
                        contentsLineNum: 16, replaceContentsLine: "Line 16:",
                        partsLineNum: 16,
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
                        contentsLineNum: 3, replaceContentsLine: "Line 3:",
                        partsLineNum: 2,
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
                        contentsLineNum: 3, replaceContentsLine: "Line 3:",
                        partsLineNum: 2,
                    }
                };
                simpleTestOfCheckFileContents(testData);
                alternateTestsOfCheckFileContents(testData);
            });
            test("Diff >> YAML comment with the hyphen in parts second line", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 2,
                    partsLine: '    -   #// comment',
                });
            });
            test("Diff >> shallow level", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 4,
                    partsLine: 'Line 4',
                });
            });
            test("Diff >> shallow level >> opposite", () => {
                const unexpectedLine = lib.checkTextContents([
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
                    partsLineNum: 4,
                    partsLine: '  Line 4',
                });
            });
        });
        function simpleTestOfCheckFileContents(testData) {
            const { testingContents, expectedParts } = testData;
            const unexpectedLine = lib.checkTextContents(testingContents, expectedParts, anyLinesTag);
            expect(unexpectedLine).toStrictEqual(null);
        }
        function alternateTestsOfCheckFileContents(testData) {
            var { testingContents, expectedParts } = testData;
            var { contentsLineNum, replaceContentsLine, contentsLine, partsLineNum } = testData.forDiff;
            contentsLine = contentsLine || '(unexpected)';
            // Test case of unexpected parts
            const unexpectedLine = lib.checkTextContents(testingContents.map((line) => (line.includes(replaceContentsLine) ? '(unexpected)' : line)), expectedParts, anyLinesTag);
            expect(unexpectedLine).toStrictEqual({
                contentsLineNum: contentsLineNum,
                contentsLine: (contentsLineNum === 0) ? '' : contentsLine,
                partsLineNum: partsLineNum,
                partsLine: expectedParts[partsLineNum - 1],
            });
        }
    });
});
describe("data >>", () => {
    test("stableUniqueFilterFunction >>", async () => {
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
    test("lastUniqueFilterFunction >>", async () => {
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
    test("fastUniqueFilter >>", async () => {
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
    test("parseMap >>", async () => {
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
//# sourceMappingURL=lib.test.js.map