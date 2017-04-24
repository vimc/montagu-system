declare interface TestError {
    stack: string;
}

declare interface TestContext {
    parent: TestContext;
    title: string;
    state: string;
    err: TestError;
}

declare type DoneCallback = () => void;

declare function describe(description: string, body: () => void): void;
declare function it(expectation: string, body: (done?: DoneCallback) => void): void;

declare function before(step: () => void): void;
declare function after(step: () => void): void;

declare function beforeEach(step: () => void): void;
declare function afterEach(step: () => void): void;