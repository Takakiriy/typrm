"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var c = 2;
test.each(__makeTemplateObject(["\n    a    | b    | expected  | comment\n    ", " | ", " | ", " | ", "\n    ", " | ", " | ", " | ", "\n    ", " | ", " | ", " | ", "\n"], ["\n    a    | b    | expected  | comment\n    ", " | ", " | ", " | ", "\n    ", " | ", " | ", " | ", "\n    ", " | ", " | ", " | ", "\n"]), 1, 1, 2, '＄で値を囲みます', 1, c, 3, '変数の参照もできます', 2, 3, 5, '')("returns $expected when $a is added $b", function (_a) {
    var a = _a.a, b = _a.b, expected = _a.expected;
    expect(a + b).toBe(expected);
});
//# sourceMappingURL=for.test.js.map