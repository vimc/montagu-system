import { expect } from "chai";
import { Sandbox } from "../../Sandbox";
import { ErrorInfo, Result } from "../../../main/shared/models/Generated";
import * as actionHelpers from "../../actionHelpers";
import { expectNoActions, getActions } from "../../actionHelpers";
import { mockFetcherResponse, mockResponse, mockResult } from "../../mocks/mockRemote";
import fetcher from "../../../main/shared/sources/Fetcher";
import { Notification } from "../../../main/shared/actions/NotificationActions";
import { SinonSpy } from "sinon";

export interface FetchHelperConfig<TPayload, TActionPayload> {
    prepareForFetch: () => void;
    prepareForCachedFetch?: () => void;
    triggerFetch: () => Promise<TPayload>,
    makePayload: () => TPayload;
    expectedURL: string;
    expectedSuccessResult?: {
        action: string,
        payload: TActionPayload
    }
}

export interface FetchTestConfig<TPayload> {
    done: DoneCallback;
    payload: Result;
    errorMessage: string;
    expectedAction: actionHelpers.ActionExpectation;
    triggerFetch: () => Promise<TPayload>;
}

// The two type arguments mean:
// TPayload: The type returned by the remote endpoint, which is passed through to the success action
// TActionPayload: The type that the action transforms the payload into. For most actions, this is the same.
// e.g. TouchstoneActions.setCurrentTouchstone takes a string and returns a string. But some actions transform
// from one data type to another. e.g. OneTimeTokenActions.receiveToken decodes the token.
// If you are using an action that transforms the type you will also have to specify `expectedSuccessResult`
// explicitly in the config.
export class FetchHelper<TPayload, TActionPayload> {
    config: FetchHelperConfig<TPayload, TActionPayload>;
    sandbox: Sandbox;

    constructor(config: FetchHelperConfig<TPayload, TActionPayload>) {
        this.config = config;
    }

    testFetchWithMockedResponse<TPayload>({ done, payload, errorMessage, expectedAction, triggerFetch }: FetchTestConfig<TPayload>) {
        this.mockFetcherResponse(payload, errorMessage);
        const fetcherSpy = this.getFetcherSpy();
        const dispatchSpy = this.sandbox.dispatchSpy();
        const handler = () => {
            try {
                expect(fetcherSpy.args).to.have.length(1, "Fetch method was not invoked");
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
        triggerFetch().then(handler, handler);
    }

    getFetcherSpy(): SinonSpy {
        return this.sandbox.sinon.spy(fetcher.fetcher, "fetch");
    }

    mockFetcherResponse(payload: Result, errorMessage?: string) {
        mockFetcherResponse(mockResponse(payload, errorMessage), null);
    }

    defaultSuccessResult<T>(payload: T) {
        return {
            action: "update",
            payload: payload
        };
    }

    addTestsToMocha() {
        beforeEach(() => this.sandbox = new Sandbox());
        afterEach(() => this.sandbox.restore());

        it(`emits update when source returns successfully`, (done: DoneCallback) => {
            const payload = this.config.makePayload();
            this.config.prepareForFetch();
            this.testFetchWithMockedResponse({
                done,
                payload: mockResult(payload),
                errorMessage: null,
                expectedAction: this.config.expectedSuccessResult || this.defaultSuccessResult(payload),
                triggerFetch: this.config.triggerFetch
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
            this.config.prepareForFetch();
            this.testFetchWithMockedResponse({
                done,
                payload: mockResult(null, errors, "failure"),
                errorMessage: null,
                expectedAction: {
                    action: "NotificationActions.notify",
                    payload: expectedNotification
                },
                triggerFetch: this.config.triggerFetch
            });
        });

        it("emits notificationActions.notify when error occurs accessing source", (done: DoneCallback) => {
            const errorMessage = "Error message";
            const expectedNotification: Notification = {
                message: errorMessage,
                type: "error"
            };
            this.config.prepareForFetch();
            this.testFetchWithMockedResponse({
                done,
                payload: null,
                errorMessage,
                expectedAction: {
                    action: "NotificationActions.notify",
                    payload: expectedNotification
                },
                triggerFetch: this.config.triggerFetch
            });
        });

        it("triggers logout when server returns bearer token error", (done: DoneCallback) => {
            const errors: Array<ErrorInfo> = [
                {
                    code: "bearer-token-invalid",
                    message: "Something wicked this way comes"
                }
            ];
            this.config.prepareForFetch();
            this.testFetchWithMockedResponse({
                done,
                payload: mockResult(null, errors, "failure"),
                errorMessage: null,
                expectedAction: {
                    action: "AuthActions.logOut",
                    payload: true
                },
                triggerFetch: this.config.triggerFetch
            });
        });

        if (this.config.prepareForCachedFetch) {
            it("does not fetch when data is present in cache", (done: DoneCallback) => {
                this.mockFetcherResponse(mockResult(true));
                const fetcherSpy = this.getFetcherSpy();

                this.config.prepareForCachedFetch();
                const dispatchSpy = this.sandbox.dispatchSpy();
                const handler = () => {
                    try {
                        expect(fetcherSpy.called).to.equal(false, "Cache miss - fetcher was invoked");
                        expectNoActions(dispatchSpy);
                        done();
                    } catch (e) {
                        done(e);
                    }
                };
                this.config.triggerFetch().then(handler, handler);
            });
        }
    }
}