/// <reference types="jest" />
export {};
declare global {
    namespace jest {
        interface Matchers<R> {
            because: (expected: string) => CustomMatcherResult;
        }
    }
}
