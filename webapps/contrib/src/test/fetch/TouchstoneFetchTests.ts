import * as sinon from 'sinon';
import { sources } from '../../main/sources/Sources';
import * as mocks from '../mocks';
import * as actionHelpers from '../actionHelpers';
import { Result, ErrorInfo } from '../../main/Models';

import { touchstoneActions } from '../../main/actions/TouchstoneActions';

function testFetchWithMockedResponse(    
    done: DoneCallback,
    payload: Result, 
    errorMessage: string, 
    expectedAction: actionHelpers.ActionExpectation
)
{
    mocks.mockSource(sources.touchstones, payload, errorMessage);
    const spy = actionHelpers.dispatchSpy();
    touchstoneActions.fetch({});

    setTimeout(() => {
        actionHelpers.expectFetchActions(spy, "TouchstoneActions", 0);
        actionHelpers.expectOrderedActions(spy, [ expectedAction ], 2);
        done();
    });
}


describe("Touchstone fetch", () => {
    afterEach(() => {
        actionHelpers.restoreDispatch();
    });

    it("emits update when source returns successfully", (done: DoneCallback) => { 
        const payload = [ 
            mocks.mockTouchstone({ id: "a" }), 
            mocks.mockTouchstone({ id: "b" })
        ];
        testFetchWithMockedResponse(done, 
            mocks.mockResult(payload), null, 
            { action: "TouchstoneActions.update", payload: payload }
        );
    });

    it("emits fetchFailed when source returns errors", (done: DoneCallback) => {
        const message = "Error message";
        const errors: Array<ErrorInfo> = [
            { code: "code", message: message }
        ];
        testFetchWithMockedResponse(done, 
            mocks.mockResult(null, errors, "failure"), null,
            { action: "TouchstoneActions.fetchFailed", payload: message }
        );
    });

    it("emits fetchFailed when error occurs accessing source", (done: DoneCallback) => {
        const message = "Error message";
        testFetchWithMockedResponse(done, null, message,
            { action: "TouchstoneActions.fetchFailed", payload: message }
        );
    });
});