test('because: カスタム エラーメッセージ', () => {
    const  a = 2;
    const  b = 3;
    const  c = 5;

    expect( c === a + b ).because(`${c} != ${a} + ${b}`);
});

export {};
declare global {  // for TypeScript
    namespace jest {
        interface Matchers<R> {
            because: (expected: string) => CustomMatcherResult;
        }
    }
}
expect.extend({

    because(isPassed: boolean, errorMessage: string) {
        return {
            pass: isPassed,
            message: () => errorMessage,
        };
    },
});
