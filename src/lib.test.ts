import * as lib from "./lib";
var anyLinesLabel = '#anyLines:'

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

    describe("checkFileContents >>", () => {

        test("OK", () => {
            const  unexpectedLine = lib.checkTextContents([
                    // testingContents
                    'Line 1',
                    'Line 2',
                    'Line 3',
                ],[
                    // expectedParts
                    'Line 2',
                ],
                anyLinesLabel);
            expect(unexpectedLine).toStrictEqual(null);
        });

        test("Not found", () => {
            const  unexpectedLine = lib.checkTextContents([
                    // testingContents
                    'Line 1',
                    'Line 2',
                    'Line 3',
                ],[
                    // expectedParts
                    'not found line',
                ],
                anyLinesLabel);
            expect(unexpectedLine).toStrictEqual({
                contentsLineNum: 0,
                contentsLine: '',
                partsLineNum: 1,
                partsLine: 'not found line',
            });
        });

        test("Different at expected line 2", () => {
            const  unexpectedLine = lib.checkTextContents([
                    // testingContents
                    'Line 1',
                    'Line 2',
                    'Line 3',
                ],[
                    // expectedParts
                    'Line 1',
                    'different line',
                ],
                anyLinesLabel);
            expect(unexpectedLine).toStrictEqual({
                contentsLineNum: 2,
                contentsLine: 'Line 2',
                partsLineNum: 2,
                partsLine: 'different line',
            });
        });

        test("OK >> Found at 2nd expected line 1", () => {
            const  unexpectedLine = lib.checkTextContents([
                    // testingContents
                    'Line 1',
                    'unexpected',
                    'Line 1',
                    'Line 2',
                ],[
                    // expectedParts
                    'Line 1',
                    'Line 2',
                ],
                anyLinesLabel);
            expect(unexpectedLine).toStrictEqual(null);
        });

        test("Difference at many expected line", () => {
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
                anyLinesLabel);
            expect(unexpectedLine).toStrictEqual({
                contentsLineNum: 5,
                contentsLine: '5: unexpected',
                partsLineNum: 3,
                partsLine: 'Line 3',
            });
        });

        describe("ignores indent depth >>", () => {

            test("OK >> (contents < parts)", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        '  Line 1',
                        '  unexpected',
                        '  Line 1',
                        '      Line 2',
                    ],[
                        // expectedParts
                        '    Line 1',
                        '        Line 2',
                    ],
                    anyLinesLabel);
                expect(unexpectedLine).toStrictEqual(null);
            });

            test("OK >> (contents > parts)", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        '    Line 1',
                        '    unexpected',
                        '    Line 1',
                        '        Line 2',
                    ],[
                        // expectedParts
                        '  Line 1',
                        '      Line 2',
                    ],
                    anyLinesLabel);
                expect(unexpectedLine).toStrictEqual(null);
            });

            test("OK >> line 1 is deeper than line 2", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        '  Line 1',
                        '  unexpected',
                        '      Line 1',
                        '  Line 2',
                    ],[
                        // expectedParts
                        '        Line 1',
                        '    Line 2',
                    ],
                    anyLinesLabel);
                expect(unexpectedLine).toStrictEqual(null);
            });

            test("Different indent", () => {
                const  unexpectedLine = lib.checkTextContents([
                        // testingContents
                        '    Line 1',
                        '    Line 2',
                    ],[
                        // expectedParts
                        '  Line 1',
                        '      Line 2',
                    ],
                    anyLinesLabel);
                expect(unexpectedLine).toStrictEqual({
                    contentsLineNum: 2,
                    contentsLine: '    Line 2',
                    partsLineNum: 2,
                    partsLine: '      Line 2',
                });
            });
        });
    });
});

describe("data >>", () => {
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
