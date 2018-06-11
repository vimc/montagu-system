import { expect } from "chai";

import {usersInitialState, usersReducer} from "../../../main/admin/reducers/usersReducer";
import {UsersTypes} from "../../../main/admin/actionTypes/UsersTypes";
import {mockUser} from "../../mocks/mockModels";

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

});