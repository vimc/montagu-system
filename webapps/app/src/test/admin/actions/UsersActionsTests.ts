import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { usersActionCreators } from "../../../main/admin/actions/usersActionCreators";
import {createMockStore} from "../../mocks/mockStore";
import {UserCacheKeysEnum, UsersService} from "../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";
import {mockResult} from "../../mocks/mockRemote";

describe("Admin Users actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const testUser = mockUser();
    const testUser2 = mockUser();

    it("gets all users", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });
        store.dispatch(usersActionCreators.getAllUsers());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("fetches all users after successful user creation", (done) => {
        const store = createMockStore({});
        const createUserStub = sandbox.setStubFunc(UsersService.prototype, "createUser", ()=>{
            return Promise.resolve("OK");
        });
        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });
        store.dispatch(usersActionCreators.createUser("joe bloggs", "joe@email.com", "joe.b"));
        setTimeout(() => {
            expect(createUserStub.calledWith("joe bloggs", "joe@email.com", "joe.b")).to.be.true;
            const actions = store.getActions();
            const expectedPayload = { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("dispatches error if user creation fails", (done) => {
        const store = createMockStore({});
        sandbox.setStubFunc(UsersService.prototype, "createUser", ()=>{
            return Promise.resolve(mockResult(null, [{code: "e", message: "error message"}]));
        });
        store.dispatch(usersActionCreators.createUser("joe bloggs", "joe@email.com", "joe.b"));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: UsersTypes.SET_CREATE_USER_ERRORS, errors: [{message: "error message", code: "e"}]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });


    it('should clear users cache when user is created', async () => {

        sandbox.setStub(UsersService.prototype, "post");
        const cacheStub = sandbox.setStub(UsersService.prototype, "clearCache");

        const store = createMockStore({});
        sandbox.setStubFunc(UsersService.prototype, "createUser", ()=>{
            return Promise.resolve("OK");
        });
        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });

        await store.dispatch(usersActionCreators.createUser("joe bloggs", "joe@email.com", "joe.b"));

        expect(cacheStub.calledWith(UserCacheKeysEnum.users, "/users/"))
            .to.be.true
    });

    it('should set current user', (done) => {

        const store = createMockStore({});
        store.dispatch(usersActionCreators.setCurrentUser("joe.bloggs"));

        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: UsersTypes.SET_CURRENT_USER, data: "joe.bloggs"};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

});