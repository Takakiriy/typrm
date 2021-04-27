"use strict";
exports.__esModule = true;
test('because: カスタム エラーメッセージ', function () {
    var a = 2;
    var b = 3;
    var c = 5;
    expect(c === a + b).because(c + " != " + a + " + " + b);
});
expect.extend({
    because: function (isPassed, errorMessage) {
        return {
            pass: isPassed,
            message: function () { return errorMessage; }
        };
    }
});
//# sourceMappingURL=typrm.test.js.map