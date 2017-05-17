import { expect } from "chai";
import { ErrorInfo, Result } from "../../main/Models";
import * as actionHelpers from "../actionHelpers";
import { mockFetcherResponse, mockResult } from "../mocks/mockRemote";
import { getActions } from "../actionHelpers";

interface FetchHelperConfig {
    triggerFetch: () => Promise<any>,
    makePayload: () => any;
}

interface FetchTestConfig {
    done: DoneCallback,
    payload: Result,
    errorMessage: string,
    expectedAction: actionHelpers.ActionExpectation
}

export class FetchHelper {
    config: FetchHelperConfig;

    constructor(config: FetchHelperConfig) {
        this.config = config;
    }

    testFetchWithMockedResponse({ done, payload, errorMessage, expectedAction }: FetchTestConfig) {
        mockFetcherResponse(payload, errorMessage);
        const spy = actionHelpers.dispatchSpy();
        const handler = (_: any) => {
            try {
                const actions = getActions(spy);
                expect(actions[0].action).to.contain("beginFetch");
                expect(actions[1].action).to.contain(expectedAction.action);
                expect(actions[1].payload).to.eql(expectedAction.payload);
                done();
            } catch (e) {
                done(e);
            }
        };
        this.config.triggerFetch().then(handler, handler);
    }

    addTestsToMocha() {
        it(`emits update when source returns successfully`, (done: DoneCallback) => {
            const payload = this.config.makePayload();
            this.testFetchWithMockedResponse({
                done,
                payload: mockResult(payload),
                errorMessage: null,
                expectedAction: {
                    action: "update",
                    payload: payload
                }
            });
        });

        it("emits errorActions.error when source returns errors", (done: DoneCallback) => {
            const message = "Error message in error collection";
            const errors: Array<ErrorInfo> = [
                { code: "code", message: message }
            ];
            this.testFetchWithMockedResponse({
                done,
                payload: mockResult(null, errors, "failure"),
                errorMessage: null,
                expectedAction: {
                    action: "ErrorActions.error",
                    payload: Error(message)
                }
            });
        });

        it("emits errorActions.error when error occurs accessing source", (done: DoneCallback) => {
            const errorMessage = "Error message";
            this.testFetchWithMockedResponse({
                done,
                payload: null,
                errorMessage,
                expectedAction: {
                    action: "ErrorActions.error",
                    payload: Error(errorMessage)
                }
            });
        });
    }
}