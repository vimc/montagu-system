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
