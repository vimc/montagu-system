import {mockUsersState} from "../../mocks/mockStates";
import {mockUser} from "../../mocks/mockModels";
import {expect} from "chai";
import {usersReducer} from "../../../main/report/reducers/userReducer";
import {UserActionKeys} from "../../../main/report/actionTypes/UsersActions";

describe('Reports reducer tests', () => {

    it('should map report readers', () => {

        const originalState = mockUsersState({
            reportReaders: []
        });

        const mutatedState = usersReducer(originalState, {
            type: UserActionKeys.REPORT_READERS_FETCHED,
            data: [mockUser({username: "testuser"})]
        });

        expect(mutatedState.reportReaders).to.have.lengthOf(1);
        expect(mutatedState.reportReaders[0].username).to.equal("testuser");

    });

    it('removes report reader from list', () => {

        const originalState = mockUsersState({
            reportReaders: [mockUser({username: "testuser"})]
        });

        const mutatedState = usersReducer(originalState, {
            type: UserActionKeys.REPORT_READER_REMOVED,
            data: "testuser"
        });

        expect(mutatedState.reportReaders).to.have.lengthOf(0);

    });

});