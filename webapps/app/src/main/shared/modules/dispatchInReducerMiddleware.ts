
export const dispatchInReducerMiddleware = (store: any) => (next:any) => (action: any) => {
    let syncActivityFinished = false;
    let actionQueue: any[] = [];

    function flushQueue() {
        actionQueue.forEach(a => store.dispatch(a)); // flush queue
        actionQueue = [];
    }

    function dispatchAfter(asyncAction: any) {
        actionQueue = actionQueue.concat([asyncAction]);

        if (syncActivityFinished) {
            flushQueue();
        }
    }

    const actionWithAsyncDispatch =
        Object.assign({}, action, { dispatchAfter });

    next(actionWithAsyncDispatch);
    syncActivityFinished = true;
    flushQueue();
};
