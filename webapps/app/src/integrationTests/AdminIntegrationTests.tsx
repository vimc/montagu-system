import * as React from "react";
import {createMemoryHistory} from 'history';

import {expectIsEqual, IntegrationTestSuite} from "./IntegrationTest";
import {AdminFetcher} from "../main/admin/sources/AdminFetcher";
import {groupStore} from "../main/admin/stores/GroupStore";
import {checkPromise} from "../test/testHelpers";
import {expect} from "chai";
import {Client, QueryResult} from "pg";
import {ModellingGroup, ModellingGroupDetails, User} from "../main/shared/models/Generated";
import {modellingGroupActions} from "../main/shared/actions/ModellingGroupActions";
import {userStore} from "../main/admin/stores/UserStore";
import {createAdminStore} from "../main/admin/stores/createAdminStore";
import {AuthService} from "../main/shared/services/AuthService";
import {ModellingGroupsService} from "../main/shared/services/ModellingGroupsService";
import {UsersService} from "../main/admin/services/UsersService";


class AdminIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Admin portal";
    }

    createStore() {
        return createAdminStore(createMemoryHistory());
    }


    makeFetcher() {
        return new AdminFetcher();
    }

    addTestsToMocha() {

        it("can fetch shiny cookie", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).setShinyCookie();
            expect(result).to.be.eq("OK");
        });

        it("can clear shiny cookie", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).clearShinyCookie();
            expect(result).to.be.eq("OK");
        });

        it("forgot password", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).forgotPassword("test@test.com");
            expect(result).to.be.eq("OK");
        });

        it("can fetch groups", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getAllGroups();
            expect(result).to.eql([
                {id: "g1", description: "Group 1"},
                {id: "g2", description: "Group 2"}
            ]);
        });

        it("can fetch group details", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getGroupDetails('g1');
            expect(result).to.eql({
                id: "g1",
                description: "Group 1",
                members: ['bob'],
                models: [
                    {
                        id: "model",
                        modelling_group: "g1",
                        description: "A model",
                        citation: "Citation"
                    }
                ]
            });
        });

        it("can add member to a group", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .addMember("g1", "test.user");
            expect(result).to.equal("OK");
            const groupDetails = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getGroupDetails('g1');
            expect(groupDetails.members.indexOf("test.user") > -1).to.be.true;
        });

        it("can remove member from a group", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .removeMember("g1", "bob");
            expect(result).to.equal("OK");
            const groupDetails = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getGroupDetails('g1');
            expect(groupDetails.members.indexOf("bob") === -1).to.be.true;
        });

        it("can fetch users", async () => {
            await addUsers(this.db);
            const users: User[] = await (new UsersService(this.store.dispatch, this.store.getState)).getAllUsers();
            const bob: User = users.find(x => x.username == 'bob');
            expect(bob).to.eql({
                username: "bob",
                name: "Bob Jones",
                email: "bob@example.com",
                roles: [
                    {name: "member", scope_prefix: "modelling-group", scope_id: "some-group"},
                    {name: "user-manager", scope_prefix: null, scope_id: null}
                ],
                last_logged_in: "2017-01-01T08:36:23Z"
            });
        });

        it("can create a user", async () => {

            const usersService = new UsersService(this.store.dispatch, this.store.getState);
            const result = await usersService
                .createUser("new user", "user@example.com", "new.user");

            expect(result).to.equal("http://api:8080/v1/users/new.user/");
            const allUsers = await usersService.getAllUsers();
            expect(allUsers.map((u: User) => u.username).indexOf("new.user") > -1).to.be.true;
        });
    }
}

new AdminIntegrationTests();

function addGroups(db: Client): Promise<QueryResult> {
    return db.query(`
        DO $$
            DECLARE role_id integer;
        BEGIN
            INSERT INTO modelling_group (id, description, institution, pi) VALUES ('g1', 'Group 1', '', '');
            INSERT INTO modelling_group (id, description, institution, pi) VALUES ('g2', 'Group 2', '', '');
            
            INSERT INTO model (id, modelling_group, description, citation, is_current) VALUES ('model', 'g1', 'A model', 'Citation', true);
            
            INSERT INTO app_user (username) VALUES ('bob'); 
            INSERT INTO user_group (id, name) VALUES ('bob', 'bob');
            INSERT INTO user_group_membership (username, user_group) VALUES ('bob', 'bob');        
            
            --See VIMC-359 for why this is group members rather than admins    
            SELECT id INTO role_id FROM role WHERE name = 'member' AND scope_prefix = 'modelling-group';
            
            INSERT INTO user_group_role (user_group, role, scope_id) VALUES ('bob', role_id, 'g1');
        END $$;
    `);
}

function addUsers(db: Client): Promise<QueryResult> {
    return db.query(`
        DO $$
            DECLARE simple_role_id integer;
            DECLARE scoped_role_id integer;
        BEGIN
            INSERT INTO app_user (username, name, email, last_logged_in)
            VALUES ('bob', 'Bob Jones', 'bob@example.com', '2017-01-01T08:36:23');
             
            INSERT INTO user_group (id, name) VALUES ('bob', 'bob');
            INSERT INTO user_group_membership (username, user_group) VALUES ('bob', 'bob');           
            
            SELECT id INTO simple_role_id FROM role WHERE name = 'user-manager' AND scope_prefix IS NULL;
            SELECT id INTO scoped_role_id FROM role WHERE name = 'member' AND scope_prefix = 'modelling-group';
            INSERT INTO user_group_role (user_group, role, scope_id) VALUES ('bob', simple_role_id, '');
            INSERT INTO user_group_role (user_group, role, scope_id) VALUES ('bob', scoped_role_id, 'some-group');
       END $$;
    `);
}