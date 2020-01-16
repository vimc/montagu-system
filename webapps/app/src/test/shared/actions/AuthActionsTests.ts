
import * as jwt from "jsonwebtoken";
import {Sandbox} from "../../Sandbox";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";
import {AuthService} from "../../../main/shared/services/AuthService";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";
import {createMockStore} from "../../mocks/mockStore";

import {signAndCompress} from "../helpers/TokenHelpers";
import {NotificationTypeKeys} from "../../../main/shared/actionTypes/NotificationTypes";
import {appSettings} from "../../../main/shared/Settings";
import {ModellingGroupsService} from "../../../main/shared/services/ModellingGroupsService";

describe("AuthActions", () => {
    const sandbox = new Sandbox();
    let store: any = null;

    const mockUsertokenData = {
        sub: "test.user",
        permissions: "*/can-login,*/countries.read,*/demographics.read,*…les.write,modelling-group:test-group/users.create",
        roles: "*/user,modelling-group:IC-Garske/member,*/user-man…/uploader,modelling-group:test-group/user-manager",
        iss: "vaccineimpact.org",
        exp: Math.round(Date.now() / 1000) + 1000
    };

    const mockUsertokenDataNotActive = Object.assign({}, mockUsertokenData, {
        permissions: "*/countries.read,*/demographics.read,*…les.write,modelling-group:test-group/users.create"
    });

    const mockUsertokenNotModeller = Object.assign({}, mockUsertokenData, {
        roles: ""
    });

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it(
        "dispatches authenticated action if service returned proper token",
        (done) => {
            const testToken = signAndCompress(mockUsertokenData);
            sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
                return Promise.resolve({access_token: testToken});
            });
            sandbox.setStub(AuthService.prototype, "setCookies");
            store.dispatch(authActionCreators.logIn('test', 'test'));
            setTimeout(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(AuthTypeKeys.AUTHENTICATED);
                done();
            });
        }
    );

    it(
        "dispatches authentication error action if service returned error",
        (done) => {
            sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
                return Promise.resolve({error: 'test error'});
            });
            store.dispatch(authActionCreators.logIn('test', 'test'));
            setTimeout(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(AuthTypeKeys.AUTHENTICATION_ERROR);
                done();
            });
        }
    );

    it(
        "dispatches authentication error action if user is not active",
        (done) => {
            const testToken = signAndCompress(mockUsertokenDataNotActive);
            sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
                return Promise.resolve({access_token: testToken});
            });
            store.dispatch(authActionCreators.logIn('test', 'test'));
            setTimeout(() => {
                const actions = store.getActions();
                expect(actions[0].type).toEqual(NotificationTypeKeys.NOTIFY);
                expect(actions[0].message).toContain("Your account has been deactivated.");
                expect(actions[1].type).toEqual(AuthTypeKeys.AUTHENTICATION_ERROR);
                done();
            });
        }
    );

    it(
        "dispatches authentication error action if user is not modeller",
        (done) => {
            appSettings.requiresModellingGroupMembership = true;
            const testToken = signAndCompress(mockUsertokenNotModeller);
            sandbox.setStubFunc(AuthService.prototype, "logIn", () => {
                return Promise.resolve({access_token: testToken});
            });
            store.dispatch(authActionCreators.logIn('test', 'test'));
            setTimeout(() => {
                const actions = store.getActions();

                expect(actions[0].type).toEqual(NotificationTypeKeys.NOTIFY);
                expect(actions[0].message).toContain("Only members of modelling groups can log into the contribution portal");
                expect(actions[1].type).toEqual(AuthTypeKeys.AUTHENTICATION_ERROR);
                done();
            });
        }
    );

    it(
        "dispatches authenticated action if can get authenticated user data from API",
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

    it(
        "dispatches authentication error action if user cannot be validated",
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

    describe("setCookies", () => {
        it("does nothing if service returns failure", async () => {
            const stub = sandbox.setStubFunc(AuthService.prototype, "setCookies", () => Promise.resolve(null));
            await store.dispatch(authActionCreators.setCookies());
            expect(stub.callCount).toEqual(1);
            expect(store.getActions()).toHaveLength(0);
        });

        it("dispatches action if service returns success", async () => {
            const stub = sandbox.setStubFunc(AuthService.prototype, "setCookies", () => Promise.resolve(true));
            await store.dispatch(authActionCreators.setCookies());
            expect(stub.callCount).toEqual(1);
            expect(store.getActions()).toEqual([
                { type: AuthTypeKeys.RECEIVED_COOKIES }
            ])
        });
    });
});
