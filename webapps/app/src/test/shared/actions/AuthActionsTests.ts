import {expect} from "chai";
import {Sandbox} from "../../Sandbox";
import {authActionCreators} from "../../../main/shared/actions/authActionCreators";
import {AuthService} from "../../../main/shared/services/AuthService";
import {AuthTypeKeys} from "../../../main/shared/actionTypes/AuthTypes";
import {createMockStore} from "../../mocks/mockStore";
import {NotificationTypeKeys} from "../../../main/shared/actionTypes/NotificationTypes";
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

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("dispatches authenticated action if can get authenticated user data from API", (done) => {
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
            expect(actions[0].type).to.eql(AuthTypeKeys.AUTHENTICATED);
            expect(actions[0].data.username).to.eql("test-user");
            expect(actions[0].data.isAccountActive).to.eql(true);
            expect(actions[0].data.isModeller).to.eql(true);
            done();
        });
    });

    it("dispatches authentication error action if user cannot be validated", (done) => {
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
            expect(actions[0].type).to.eql(NotificationTypeKeys.NOTIFY);
            expect(actions[0].message).to.contain("Your account has been deactivated");
            expect(actions[1].type).to.eql(AuthTypeKeys.AUTHENTICATION_ERROR);
            done();
        });
    });

    it("dispatches unauthenticated action if cannot get authenticated user data from API", (done) => {
        sandbox.setStubFunc(AuthService.prototype, "getCurrentUser", () => {
            return Promise.reject("failed")
        });

        sandbox.setStub(AuthService.prototype, "logOutOfAPI");
        store.dispatch(authActionCreators.loadAuthenticatedUser());
        setTimeout(() => {
            const actions = store.getActions();
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            done();
        });
    });

    it("dispatches unauthenticated action if cannot get modelling groups data from API", (done) => {
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
            expect(actions[0].type).to.eql(AuthTypeKeys.UNAUTHENTICATED);
            done();
        });
    });

});
