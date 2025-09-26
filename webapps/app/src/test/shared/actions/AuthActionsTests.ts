import {Sandbox} from "../../Sandbox";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";
import {AuthService} from "../../../main/shared/services/AuthService";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";
import {createMockStore} from "../../mocks/mockStore";
import {NotificationTypeKeys} from "../../../main/shared/actionTypes/NotificationTypes";
import {ModellingGroupsService} from "../../../main/shared/services/ModellingGroupsService";
import {initialAuthState} from "../../../main/shared/reducers/authReducer";

describe("AuthActions", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    beforeEach(() => {
        store = createMockStore({auth: initialAuthState});
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches authenticated action if can get authenticated user data from API",
        (done) => {
            const testUser = {
                username: "test-user",
                permissions: ["*/can-login"]
            };

            const testModellingGroups = [{id: "group1"}]

            sandbox.setStubFunc(AuthService.prototype, "getCurrentUser", () => {
                return Promise.resolve(testUser);
            });
            sandbox.setStubFunc(ModellingGroupsService.prototype, "getUserGroups", () => {
                return Promise.resolve(testModellingGroups);
            });

            store.dispatch(authActionCreators.loadAuthenticatedUser());
            setTimeout(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(AuthTypeKeys.AUTHENTICATED);
                expect(actions[0].data.username).toEqual("test-user");
                expect(actions[0].data.isAccountActive).toEqual(true);
                expect(actions[0].data.isModeller).toEqual(true);
                done();
            });
        }
    );

    it("dispatches authentication error action if user cannot be validated",
        (done) => {
            const testUser = {
                username: "testuser",
                permissions: [] as String[]
            };

            const testModellingGroups = [{id: "group1"}]

            sandbox.setStubFunc(AuthService.prototype, "getCurrentUser", () => {
                return Promise.resolve(testUser);
            });
            sandbox.setStubFunc(ModellingGroupsService.prototype, "getUserGroups", () => {
                return Promise.resolve(testModellingGroups);
            });

            store.dispatch(authActionCreators.loadAuthenticatedUser());
            setTimeout(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(NotificationTypeKeys.NOTIFY);
                expect(actions[0].message).toContain("Your account has been deactivated");
                expect(actions[1].type).toEqual(AuthTypeKeys.AUTHENTICATION_ERROR);
                done();
            });
        }
    );

    it(
        "dispatches unauthenticated action if cannot get authenticated user data from API",
        (done) => {
            sandbox.setStubFunc(AuthService.prototype, "getCurrentUser", () => {
                return Promise.reject("failed")
            });

            sandbox.setStub(AuthService.prototype, "logOutOfAPI");
            store.dispatch(authActionCreators.loadAuthenticatedUser());
            setTimeout(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(AuthTypeKeys.UNAUTHENTICATED);
                done();
            });
        }
    );

    it(
        "dispatches unauthenticated action if cannot get modelling groups data from API",
        (done) => {
            const testUser = {
                user: "testuser",
                permissions: "*/can-login"
            }

            sandbox.setStubFunc(AuthService.prototype, "getCurrentUser", () => {
                return Promise.resolve(testUser);
            });
            sandbox.setStubFunc(ModellingGroupsService.prototype, "getUserGroups", () => {
                return Promise.reject("failed");
            })

            sandbox.setStub(AuthService.prototype, "logOutOfAPI");
            store.dispatch(authActionCreators.loadAuthenticatedUser());
            setTimeout(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(AuthTypeKeys.UNAUTHENTICATED);
                done();
            });
        }
    );

});
