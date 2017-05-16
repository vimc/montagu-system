import { Source } from "../../main/sources/Source";
import { ErrorInfo, Result } from "../../main/Models";
import * as actionHelpers from "../actionHelpers";
import { mockFetcherResponse, mockResult } from "../mocks/mockRemote";
import { expectOneAction } from "../actionHelpers";

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
                expectOneAction(spy, { action: `_class.beginFetch1` }, 0);
                expectOneAction(spy, expectedAction, 1);
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
                    action: "_class.update1",
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