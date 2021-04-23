"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
test.each(__makeTemplateObject(["\n    a  |  b  | expected\n    1  |  1  | 2\n    1  |  2  | 3\n    2  |  1  | 3\n"], ["\n    a  |  b  | expected\n    1  |  1  | 2\n    1  |  2  | 3\n    2  |  1  | 3\n"]))('.add(%i, %i)', function (a, b, expected) {
    expect(a + b).toBe(expected);
});
test('case', function () {
    var a = 2;
    var b = 3;
    var c = 5;
    expect(a + b).toBe(c);
});
//# sourceMappingURL=for.test.js.map