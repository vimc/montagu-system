import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { usersActionCreators } from "../../../main/admin/actions/usersActionCreators";
import {createMockStore} from "../../mocks/mockStore";
import {UserCacheKeysEnum, UsersService} from "../../../main/admin/services/UsersService";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";
import {mockResult} from "../../mocks/mockRemote";
import * as Sinon from "sinon"

describe("Admin Users actions tests", () => {
    const sandbox = new Sandbox();

    let store: any = null,
        createUserStub: Sinon.SinonStub = null;

    beforeEach(() => {
        sandbox.restore();
        store = createMockStore({});
    });

    const testUser = mockUser();
    const testUser2 = mockUser();

    function setUpSuccessfulStubs(){

        createUserStub = sandbox.setStubFunc(UsersService.prototype, "createUser", ()=>{
            return Promise.resolve("OK");
        });
        sandbox.setStubFunc(UsersService.prototype, "getAllUsers", ()=>{
            return Promise.resolve([testUser, testUser2]);
        });
    }

    it("gets all users", (done) => {

        setUpSuccessfulStubs();

        store.dispatch(usersActionCreators.getAllUsers());
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("fetches all users after successful user creation", (done) => {

       setUpSuccessfulStubs();

        store.dispatch(usersActionCreators.createUser("joe bloggs", "joe@email.com", "joe.b"));
        setTimeout(() => {
            expect(createUserStub.calledWith("joe bloggs", "joe@email.com", "joe.b")).to.be.true;
            const actions = store.getActions();
            const expectedPayload = { type: UsersTypes.ALL_USERS_FETCHED, data: [testUser, testUser2]};
            expect(actions).to.deep.include.members([expectedPayload]);
            done();
        });
    });

    it("dispatches error if user creation fails", (done) => {

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

        const cacheStub = sandbox.setStub(UsersService.prototype, "clearCache");

        setUpSuccessfulStubs();

        await store.dispatch(usersActionCreators.createUser("joe bloggs", "joe@email.com", "joe.b"));

        expect(cacheStub.calledWith(UserCacheKeysEnum.users, "/users/"))
            .to.be.true
    });

    it('createUser should set show create user to false', async () => {

        const stub = sandbox.setStubReduxAction(usersActionCreators, "setShowCreateUser");

        setUpSuccessfulStubs();

        await store.dispatch(usersActionCreators.createUser("joe bloggs", "joe@email.com", "joe.b"));

        expect(stub.calledWith(false)).to.be.true
    });

    it('setShowCreateUser dispatches SHOW_CREATE_USER', async () => {

        const result = usersActionCreators.setShowCreateUser(true);
        expect(result).to.eql({
            type: UsersTypes.SHOW_CREATE_USER,
            data: true
        })
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