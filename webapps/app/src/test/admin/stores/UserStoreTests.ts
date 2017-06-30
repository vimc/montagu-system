import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { userActions } from "../../../main/admin/actions/UserActions";
import { mockUser } from "../../mocks/mockModels";
import { userStore } from "../../../main/admin/stores/UserStore";

describe("UserStore", () => {
    beforeEach(() => alt.recycle());

    it("has users and usersLookup after userActions.updateUsers", () => {
        const testUser = mockUser({username: "testUser"});
        const anotherTestUser = mockUser({username: "anotherTestUser"});
        const users = [ testUser, anotherTestUser ];

        userActions.updateUsers(users);

        expect(userStore.getState().users).to.eql(users);
        expect(userStore.getState().usersLookup).to.eql({
            "testUser" : testUser,
            "anotherTestUser": anotherTestUser
        });
        expect(userStore.getState().ready).to.be.true;
    });

    it("is blank after userActions.beginFetchUsers", () => {
        userActions.updateUsers([ mockUser(), mockUser() ]);
        userActions.beginFetchUsers();

        expect(userStore.getState().users).to.eql([]);
        expect(userStore.getState().usersLookup).to.eql({});
        expect(userStore.getState().ready).to.be.false;
    });

    it("has a current username after userActions.setCurrentUser", () => {

        userActions.setCurrentUser("testUser");
        expect(userStore.getState().currentUsername).to.eql("testUser")

    });

    it("gets current user details when users and currentUsername exist", () => {
        const testUser = mockUser({username: "testUser"});
        const anotherTestUser = mockUser({username: "anotherTestUser"});
        const users = [ testUser, anotherTestUser ];

        userActions.updateUsers(users);
        userActions.setCurrentUser("testUser");

        const currentUserResult = userStore.getCurrentUserDetails();
        expect(currentUserResult).to.eql(testUser)

    });

    it("returns null for user details when currentUsername not set", () => {
        const testUser = mockUser({username: "testUser"});
        const anotherTestUser = mockUser({username: "anotherTestUser"});
        const users = [ testUser, anotherTestUser ];

        userActions.updateUsers(users);

        const currentUserResult = userStore.getCurrentUserDetails();
        expect(currentUserResult).to.eql(null)

    });

});