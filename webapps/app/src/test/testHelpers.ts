type AfterWaitCallback = (done: DoneCallback, then: () => void) => void;

function afterWait(done: DoneCallback, then: () => void): void {
    setTimeout(() => {
        try {
            then();
        } catch (e) {
            done(e);
        }
    });
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

export function checkPromise<T>(done: DoneCallback, promise: Promise<T>, checks?: (afterWait: AfterWaitCallback, data: T) => void) {
    setTimeout(() => {
        promise
            .then(data => {
                if (checks) {
                    checks(afterWait, data);
                }
                done();
            })
            .catch(error => done(error));
    });
}

