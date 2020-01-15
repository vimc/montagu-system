import {expect} from "chai";

import {Sandbox} from "../../Sandbox";
import {usersActionCreators} from "../../../main/admin/actions/usersActionCreators";
import {createMockAdminStore, createMockStore} from "../../mocks/mockStore";
import {UserCacheKeysEnum, UsersService} from "../../../main/admin/services/UsersService";
import {ChangeSetPasswordToken, UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";
import * as Sinon from "sinon"
import {checkPromise} from "../../testHelpers";
import {NotificationTypeKeys} from "../../../main/shared/actionTypes/NotificationTypes";
import {mockError, mockResult} from "../../mocks/mockResult";

describe("Admin Users actions tests", () => {
    const sandbox = new Sandbox();

    let store: any = null,
        createUserStub: Sinon.SinonStub = null;

    beforeEach(() => {
        store = createMockStore({});
    });

    afterEach(() => {
        sandbox.restore();
    });

    const testUser = mockUser();
    const testUser2 = mockUser();

    function setUpSuccessfulStubs() {

        createUserStub = sandbox.setStubFunc(UsersService.prototype, "createUser", () => {
            return Promise.resolve("OK");
        });
        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", () => {
            return Promise.resolve([testUser, testUser2]);
        });

        sandbox.setStubFunc(UsersService.prototype, "addGlobalRoleToUser", () => {
            return Promise.resolve("OK");
        });

        sandbox.setStubFunc(UsersService.prototype, "removeRoleFromUser", () => {
            return Promise.resolve("OK");
        });
    }

    test("gets all users", (done) => {

        setUpSuccessfulStubs();

        store.dispatch(usersActionCreators.getAllUsers());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    test("gets global roles", (done) => {

        sandbox.setStubFunc(UsersService.prototype, "getGlobalRoles", () => {
            return Promise.resolve(["role1"]);
        });

        store.dispatch(usersActionCreators.getGlobalRoles());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: UsersTypes.ALL_GLOBAL_ROLES_FETCHED, data: ["role1"]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    test(
        "clears user list cache and fetches users if role added to user",
        async () => {

            const cacheStub = sandbox.setStub(UsersService.prototype, "clearCache");
            setUpSuccessfulStubs();

            await store.dispatch(usersActionCreators.addGlobalRoleToUser("user", "role1"));

            const actions = store.getActions();
            const expectedPayload = [{type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]},
                {type: UsersTypes.SET_CURRENT_USER, data: "user"}];
            expect(actions).to.eql(expectedPayload);

            expect(cacheStub.calledWith(UserCacheKeysEnum.users, "/users/"))
                .to.be.true;

        }
    );

    test(
        "clears user list cache and fetches users if role removed from user",
        async () => {

            const cacheStub = sandbox.setStub(UsersService.prototype, "clearCache");
            setUpSuccessfulStubs();

            await store.dispatch(usersActionCreators.removeRoleFromUser("user", "role1", "any", "any"));
            const actions = store.getActions();
            const expectedPayload = [{type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]},
                {type: UsersTypes.SET_CURRENT_USER, data: "user"}];
            expect(actions).to.eql(expectedPayload);

            expect(cacheStub.calledWith(UserCacheKeysEnum.users, "/users/"))
                .to.be.true;

        }
    );

    test("fetches all users after successful user creation", async () => {

        setUpSuccessfulStubs();

        await store.dispatch(usersActionCreators.createUser({
            name: "joe bloggs",
            email: "joe@email.com",
            username: "joe.b"
        }));

        expect(createUserStub.calledWith("joe bloggs", "joe@email.com", "joe.b")).to.be.true;
        const actions = store.getActions();
        const expectedPayload = {type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
        expect(actions).to.deep.include.members([expectedPayload]);

    });

    test("dispatches error if user creation fails", async () => {

        sandbox.setStubFunc(UsersService.prototype, "createUser", () => {
            return Promise.resolve(mockResult(null, [{code: "e", message: "error message"}]));
        });
        await store.dispatch(usersActionCreators.createUser({name: "joe bloggs", email: "joe@email.com", username: "joe.b"}));

        const actions = store.getActions();
        const expectedPayload = {
            type: UsersTypes.SET_CREATE_USER_ERRORS,
            errors: [{message: "error message", code: "e"}]
        };
        expect(actions).to.eql([expectedPayload]);

    });

    test('should clear users cache when user is created', async () => {

        const cacheStub = sandbox.setStub(UsersService.prototype, "clearCache");

        setUpSuccessfulStubs();

        await store.dispatch(usersActionCreators.createUser({
            name: "joe bloggs",
            email: "joe@email.com",
            username: "joe.b"
        }));

        expect(cacheStub.calledWith(UserCacheKeysEnum.users, "/users/"))
            .to.be.true
    });

    test('createUser should set show create user to false', async () => {

        const stub = sandbox.setStubReduxAction(usersActionCreators, "setShowCreateUser");

        setUpSuccessfulStubs();

        await store.dispatch(usersActionCreators.createUser({
            name: "joe bloggs",
            email: "joe@email.com",
            username: "joe.b"
        }));

        expect(stub.calledWith(false)).to.be.true
    });

    test('setShowCreateUser dispatches SHOW_CREATE_USER', async () => {

        const result = usersActionCreators.setShowCreateUser(true);
        expect(result).to.eql({
            type: UsersTypes.SHOW_CREATE_USER,
            data: true
        })
    });

    test('should set current user', (done) => {

        const store = createMockStore({});
        store.dispatch(usersActionCreators.setCurrentUser("joe.bloggs"));

        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = {type: UsersTypes.SET_CURRENT_USER, data: "joe.bloggs"};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    test(
        "setPassword issues notification if service returns success",
        (done: DoneCallback) => {
            sandbox.stubService(UsersService.prototype, "setPassword", mockResult(true));
            const store = createMockAdminStore({});

            const promise = store.dispatch(usersActionCreators.setPassword("TOKEN", "password"));
            checkPromise(done, promise, () => {
                expect(store.getActions()).to.eql([
                    {
                        type: NotificationTypeKeys.NOTIFY,
                        "message": "Your password has been set. You are now being redirected to the Montagu homepage...",
                        "severity": "info"
                    }
                ])
            });
        }
    );

    test(
        "setPassword sets errors if service returns errors",
        (done: DoneCallback) => {
            const errors = [mockError("code", "message")];
            sandbox.stubService(UsersService.prototype, "setPassword", mockResult(null, errors));
            const store = createMockAdminStore({});

            const promise = store.dispatch(usersActionCreators.setPassword("TOKEN", "password"));
            checkPromise(done, promise, () => {
                expect(store.getActions()).to.eql([
                    {type: UsersTypes.CHANGE_SET_PASSWORD_ERRORS, errors: errors}
                ]);
            });
        }
    );

    test(
        "setPassword clears token if service returns invalid token error",
        (done: DoneCallback) => {
            const errors = [mockError("onetime-token-invalid", "message")];
            sandbox.stubService(UsersService.prototype, "setPassword", mockResult(null, errors));
            const store = createMockAdminStore({});

            const promise = store.dispatch(usersActionCreators.setPassword("TOKEN", "password"));
            checkPromise(done, promise, () => {
                expect(store.getActions()).to.eql([
                    {type: UsersTypes.CHANGE_SET_PASSWORD_TOKEN, token: null} as ChangeSetPasswordToken,
                    {type: UsersTypes.CHANGE_SET_PASSWORD_ERRORS, errors: errors}
                ]);
            });
        }
    );

    test("setPassword sets errors if sevice fails", (done: DoneCallback) => {
        sandbox.stubService(UsersService.prototype, "setPassword", null);
        const store = createMockAdminStore({});

        const promise = store.dispatch(usersActionCreators.setPassword("TOKEN", "password"));
        checkPromise(done, promise, () => {
            expect(store.getActions()).to.eql([
                {
                    type: UsersTypes.CHANGE_SET_PASSWORD_ERRORS,
                    errors: [{message: "An error occurred setting your password"}]
                }
            ]);
        });
    });

});