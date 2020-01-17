

import {usersInitialState, usersReducer} from "../../../main/admin/reducers/usersReducer";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";
import {mockError} from "../../mocks/mockResult";

describe('Admin Users reducer tests', () => {

    const testUser = mockUser();
    const testUser2 = mockUser();

    it('sets fetched users', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USERS_FETCHED,
            data: [testUser, testUser2]
        })).toEqual({...usersInitialState, users: [testUser, testUser2]});
    });

    it('sets fetched users empty ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_USERS_FETCHED,
            data: null
        })).toEqual(usersInitialState);
    });

    it('sets showCreateUser ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SHOW_CREATE_USER,
            data: true
        })).toEqual({...usersInitialState, showCreateUser: true});

        expect(usersReducer(undefined, {
            type: UsersTypes.SHOW_CREATE_USER,
            data: false
        })).toEqual({...usersInitialState, showCreateUser: false});
    });

    it('sets createUserErrors ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.SET_CREATE_USER_ERRORS,
            errors: [{code: "e", message: "error"}]
        })).toEqual({...usersInitialState, createUserErrors:  [{code: "e", message: "error"}]});
    });

    it('sets global roles ', () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.ALL_GLOBAL_ROLES_FETCHED,
            data: ["role1", "role2"]
        })).toEqual({...usersInitialState, globalRoles: ["role1", "role2"]});
    });

    it("changes set password errors", () => {
        const errors = [mockError("a", "A"), mockError("b", "B")];
        expect(usersReducer(undefined, {
            type: UsersTypes.CHANGE_SET_PASSWORD_ERRORS,
            errors: errors
        })).toEqual({...usersInitialState, setPasswordErrors: errors})
    });

    it("changes set password token", () => {
        expect(usersReducer(undefined, {
            type: UsersTypes.CHANGE_SET_PASSWORD_TOKEN,
            token: "TOKEN"
        })).toEqual({...usersInitialState, setPasswordToken: "TOKEN"})
    });
});