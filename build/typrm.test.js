"use strict";
exports.__esModule = true;
expect.extend({
    because: function (isPassed, errorMessage) {
        return {
            pass: isPassed,
            message: function () { return errorMessage; }
        };
    }
});
it('case', function () {
    var a = 2;
    var b = 3;
    var c = 4;
    expect(c == a + b).because(c + " != " + a + " + " + b);
});
//# sourceMappingURL=typrm.test.js.map