type AfterWaitCallback = (done: DoneCallback, then: () => void) => void;

function afterWait(done: DoneCallback, then: () => void): void {
    setTimeout(() => {
        try {
            then();
        } catch (e) {
            done(e);
        }
    }, 1000);
}

export function checkAsync(done: DoneCallback, checks: (afterWait: AfterWaitCallback) => void) {
    setTimeout(() => {
        try {
            checks(afterWait);
            done();
        } catch (e) {
            done(e);
        }
    });
}

export function checkPromise<T>(done: DoneCallback, promise: Promise<T>, checks?: (data: T, afterWait: AfterWaitCallback) => void) {
    setTimeout(() => {
        promise
            .then(data => {
                if (checks) {
                    checks(data, afterWait);
                }
                done();
            })
            .catch(error => done(error));
    });
}

