import { expect } from "chai";
import { Sandbox } from "../../Sandbox";
import { ErrorInfo, Result } from "../../../main/shared/models/Generated";
import * as actionHelpers from "../../actionHelpers";
import { getActions } from "../../actionHelpers";
import { mockFetcherResponse, mockResult } from "../../mocks/mockRemote";
import fetcher from "../../../main/shared/sources/Fetcher";
import { Notification } from "../../../main/shared/actions/NotificationActions";

interface FetchHelperConfig<TPayload> {
    triggerFetch: () => Promise<TPayload>,
    makePayload: () => TPayload;
    expectedURL: string;
}

interface FetchTestConfig {
    done: DoneCallback;
    payload: Result;
    errorMessage: string;
    expectedAction: actionHelpers.ActionExpectation;
}

export class FetchHelper<TPayload> {
    config: FetchHelperConfig<TPayload>;
    sandbox: Sandbox;

    constructor(config: FetchHelperConfig<TPayload>) {
        this.config = config;
    }

    testFetchWithMockedResponse({ done, payload, errorMessage, expectedAction }: FetchTestConfig) {
        mockFetcherResponse(payload, errorMessage);
        const fetcherSpy = this.sandbox.sinon.spy(fetcher.fetcher, "fetch");
        const dispatchSpy = this.sandbox.dispatchSpy();
        const handler = () => {
            try {
                expect(fetcherSpy.args[0][0]).to.equal(this.config.expectedURL);
                const actions = getActions(dispatchSpy);
                expect(actions[0].action).to.contain("beginFetch");
                expect(actions.length).to.be.greaterThan(1, `Expected '${expectedAction.action}' to be triggered`);
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
        beforeEach(() => this.sandbox = new Sandbox());
        afterEach(() => this.sandbox.restore());

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

        it("emits notificationActions.notify when source returns errors", (done: DoneCallback) => {
            const message = "Error message in error collection";
            const errors: Array<ErrorInfo> = [
                { code: "code", message: message }
            ];
            const expectedNotification: Notification = {
                message: message,
                type: "error"
            };
            this.testFetchWithMockedResponse({
                done,
                payload: mockResult(null, errors, "failure"),
                errorMessage: null,
                expectedAction: {
                    action: "NotificationActions.notify",
                    payload: expectedNotification
                }
            });
        });

        it("emits notificationActions.notify when error occurs accessing source", (done: DoneCallback) => {
            const errorMessage = "Error message";
            const expectedNotification: Notification = {
                message: errorMessage,
                type: "error"
            };
            this.testFetchWithMockedResponse({
                done,
                payload: null,
                errorMessage,
                expectedAction: {
                    action: "NotificationActions.notify",
                    payload: expectedNotification
                }
            });
        });

        it("triggers logout when server returns bearer token error", (done: DoneCallback) => {
            const errors: Array<ErrorInfo> = [
                {
                    code: "bearer-token-invalid",
                    message: "Something wicked this way comes"
                }
            ];
            this.testFetchWithMockedResponse({
                done,
                payload: mockResult(null, errors, "failure"),
                errorMessage: null,
                expectedAction: {
                    action: "AuthActions.logOut",
                    payload: true
                }
            });
        });
    }
}