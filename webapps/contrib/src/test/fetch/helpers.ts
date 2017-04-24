import { Source } from '../../main/sources/Source';
import { Result, ErrorInfo } from '../../main/Models';
import * as mocks from '../mocks';
import * as actionHelpers from '../actionHelpers';

interface FetchHelperConfig<TFetchParameters> {
    source: Source<TFetchParameters>;
    fetchAction: (params: TFetchParameters) => void,
    params: TFetchParameters,

    actionNamespace: string;
    successAction: string;
    failAction: string;
    makePayload: () => any;
}

interface FetchTestConfig<TFetchParameters> {
    done: DoneCallback,
    payload: Result, 
    errorMessage: string,
    expectedAction: actionHelpers.ActionExpectation
}

export class FetchHelper<TFetchParameters> {
    config: FetchHelperConfig<TFetchParameters>;

    constructor(config: FetchHelperConfig<TFetchParameters>) {
        this.config = config;
    }

    testFetchWithMockedResponse({ done, payload, errorMessage, expectedAction }: FetchTestConfig<TFetchParameters>) {
        mocks.mockSource(this.config.source, payload, errorMessage);
        const spy = actionHelpers.dispatchSpy();
        this.config.fetchAction(this.config.params);

        setTimeout(() => {
            actionHelpers.expectFetchActions(spy, this.config.actionNamespace, 0);
            actionHelpers.expectOrderedActions(spy, [ expectedAction ], 2);
            done();
        });
    }

    addTestsToMocha() {
        it(`emits ${this.config.successAction} when source returns successfully`, (done: DoneCallback) => { 
            const payload = this.config.makePayload();
            this.testFetchWithMockedResponse({
                done,
                payload: mocks.mockResult(payload), 
                errorMessage: null, 
                expectedAction: { 
                    action: `${this.config.actionNamespace}.${this.config.successAction}`, 
                    payload: payload 
                }
            });
        });

        it("emits fetchFailed when source returns errors", (done: DoneCallback) => {
            const message = "Error message";
            const errors: Array<ErrorInfo> = [
                { code: "code", message: message }
            ];
            this.testFetchWithMockedResponse({
                done,
                payload: mocks.mockResult(null, errors, "failure"), 
                errorMessage: null,
                expectedAction: { 
                    action: `${this.config.actionNamespace}.${this.config.failAction}`, 
                    payload: message 
                }
            });
        });

        it("emits fetchFailed when error occurs accessing source", (done: DoneCallback) => {
            const errorMessage = "Error message";
            this.testFetchWithMockedResponse({
                done,
                payload: null, 
                errorMessage,
                expectedAction: { 
                    action: `${this.config.actionNamespace}.${this.config.failAction}`, 
                    payload: errorMessage 
                }
            });
        });
    }
}