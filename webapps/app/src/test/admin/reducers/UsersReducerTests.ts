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

});