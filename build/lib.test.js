import * as lib from "./lib";
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