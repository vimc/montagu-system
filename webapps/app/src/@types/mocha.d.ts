declare interface TestError {
    stack: string;
}

declare interface TestContext {
    parent: TestContext;
    title: string;
    state: string;
    err: TestError;
}

declare type DoneCallback = (err?: Error) => void;

declare function describe(description: string, body: () => void): void;
declare function it(expectation: string, body: (done?: DoneCallback) => void): void;

declare function before(step: (done?: DoneCallback) => void): void;
declare function after(step: (done?: DoneCallback) => void): void;

declare function beforeEach(step: (done?: DoneCallback) => void): void;
declare function afterEach(step: (done?: DoneCallback) => void): void;