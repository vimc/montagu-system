export function checkAsync(done: DoneCallback, checks: () => void) {
    setTimeout(() => {
        try {
            checks();
            done();
        } catch (e) {
            done(e);
        }
    });
}
