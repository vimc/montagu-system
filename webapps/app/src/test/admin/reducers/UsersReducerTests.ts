import { expect } from "chai";

import {usersInitialState, usersReducer} from "../../../main/admin/reducers/usersReducer";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";
import {mockError} from "../../mocks/mockRemote";

describe('Admin Users reducer tests', () => {

    const testUser = mockUser();
    const testUser2 = mockUser();

    it('sets fetched users', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USERS_FETCHED,
            data: [testUser, testUser2]
        })).to.eql({...usersInitialState, users: [testUser, testUser2]});
    });

    it('sets fetched users empty ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USERS_FETCHED,
            data: null
        })).to.eql(usersInitialState);
    });

    it('sets showCreateUser ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SHOW_CREATE_USER,
            data: true
        })).to.eql({...usersInitialState, showCreateUser: true});

        expect(usersReducer(undefined, {
            type: UsersTypes.SHOW_CREATE_USER,
            data: false
        })).to.eql({...usersInitialState, showCreateUser: false});
    });

    it('sets createUserErrors ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SET_CREATE_USER_ERRORS,
            errors: [{code: "e", message: "error"}]
        })).to.eql({...usersInitialState, createUserErrors:  [{code: "e", message: "error"}]});
    });

    it('sets global roles ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_GLOBAL_ROLES_FETCHED,
            data: ["role1", "role2"]
        })).to.eql({...usersInitialState, globalRoles: ["role1", "role2"]});
    });

    it("changes set password errors", () => {
        const errors = [mockError("a", "A"), mockError("b", "B")];
        expect(usersReducer(undefined, {
            type: UsersTypes.CHANGE_SET_PASSWORD_ERRORS,
            errors: errors
        })).to.eql({...usersInitialState, setPasswordErrors: errors})
    });

    it("changes set password token", () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.CHANGE_SET_PASSWORD_TOKEN,
            token: "TOKEN"
        })).to.eql({...usersInitialState, setPasswordToken: "TOKEN"})
    });
});