type AfterWaitCallback = (then: () => void) => void;

function afterWait(then: () => void) {
    setTimeout(then);
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
