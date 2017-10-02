import { alt } from "../../../main/shared/alt";
import { expect } from "chai";
import { userActions } from "../../../main/admin/actions/UserActions";
import { mockUser } from "../../mocks/mockModels";
import { userStore } from "../../../main/admin/stores/UserStore";
import { RoleAssignment } from "../../../main/shared/models/Generated";

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

    it("sets showCreateUser", () => {
        userActions.setShowCreateUser(true);
        expect(userStore.getState().showCreateUser).to.equal(true);
        userActions.setShowCreateUser(false);
        expect(userStore.getState().showCreateUser).to.equal(false);
    });


    it("adds global role", () => {
        const testUser = mockUser({username: "testUser"});
        const anotherTestUser = mockUser({username: "anotherTestUser"});
        const users = [ testUser, anotherTestUser ];

        userActions.updateUsers(users);
        userActions.setCurrentUser("testUser");
        userActions.addRole("reports-reader", null, null);

        const roles = userStore.getCurrentUserRoles();

        expect(roles.length).to.eq(3);
        expect(roles.filter(r => r.name == "reports-reader").length).to.eq(1);
    });

    it("removes global role", () => {
        const testUser = mockUser({username: "testUser"});
        const anotherTestUser = mockUser({username: "anotherTestUser"});
        const users = [ testUser, anotherTestUser ];


        userActions.updateUsers(users);
        userActions.setCurrentUser("testUser");
        userActions.addRole("reports-reader", null, null);
        userActions.removeRole("reports-reader", null, null);

        const roles = userStore.getCurrentUserRoles();
        expect(roles.filter(r => r.name == "reports-reader").length).to.eq(0);
    });

});