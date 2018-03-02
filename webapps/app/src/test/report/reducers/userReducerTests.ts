import {mockUsersState} from "../../mocks/mockStates";
import {mockUser} from "../../mocks/mockModels";
import {expect} from "chai";
import {usersReducer} from "../../../main/report/reducers/userReducer";
import {UserTypeKeys} from "../../../main/report/actionTypes/UsersActionTypes";

describe('Reports reducer tests', () => {

    it('should map report readers', () => {

        const originalState = mockUsersState({
            reportReaders: []
        });

        const mutatedState = usersReducer(originalState, {
            type: UserTypeKeys.REPORT_READERS_FETCHED,
            data: [mockUser({username: "testuser"})]
        });

        expect(mutatedState.reportReaders).to.have.lengthOf(1);
        expect(mutatedState.reportReaders[0].username).to.equal("testuser");

    });

});