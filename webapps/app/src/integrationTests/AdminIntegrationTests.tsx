import * as React from "react";
import { expectIsEqual, IntegrationTestSuite } from "./IntegrationTest";
// import { adminAuthStore } from "../main/admin/stores/AdminAuthStore";
import { AdminFetcher } from "../main/admin/sources/AdminFetcher";
import { groupStore } from "../main/admin/stores/GroupStore";
import { checkPromise } from "../test/testHelpers";
import { expect } from "chai";
import { Client, QueryResult } from "pg";
import { ModellingGroup, ModellingGroupDetails, User } from "../main/shared/models/Generated";
import { modellingGroupActions } from "../main/shared/actions/ModellingGroupActions";
import { userStore } from "../main/admin/stores/UserStore";
// import {setShinyToken} from "../main/shared/sources/LoginSource";

class AdminIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Admin portal";
    }

    // authStore() {
    //     return adminAuthStore;
    // }

    makeFetcher() {
        return new AdminFetcher();
    }

    addTestsToMocha() {
        //
        // it("can fetch shiny cookie", (done: DoneCallback) => {
        //     setShinyToken().then((res: Response) => {
        //         expect(res.ok).to.be.eq(true);
        //         done()
        //     })
        // });

        it("can fetch groups", (done: DoneCallback) => {
            const promise = addGroups(this.db)
                .then(() => groupStore.fetchGroups());
            checkPromise(done, promise, groups => {
                expectIsEqual<ModellingGroup[]>(groups, [
                    { id: "g1", description: "Group 1" },
                    { id: "g2", description: "Group 2" }
                ]);
            });
        });

        it("can fetch group details", (done: DoneCallback) => {
            const promise = addGroups(this.db)
                .then(() => {
                    modellingGroupActions.setCurrentGroup("g1");
                    return groupStore.fetchGroupDetails();
                });
            checkPromise(done, promise, details => {
                expectIsEqual<ModellingGroupDetails>(details, {
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
            })
        });

        it("can fetch users", (done: DoneCallback) => {
            const promise = addUsers(this.db)
                .then(() => userStore.fetchUsers());
            checkPromise(done, promise, users => {
                const bob: User = users.find(x => x.username == 'bob');
                expectIsEqual<User>(bob, {
                    username: "bob",
                    name: "Bob Jones",
                    email: "bob@example.com",
                    roles: [
                        { name: "user-manager", scope_prefix: null, scope_id: null },
                        { name: "member", scope_prefix: "modelling-group", scope_id: "some-group" },
                    ],
                    last_logged_in: "2017-01-01T08:36:23Z"
                });
            });
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
            
            --See VIMC-359 for why this is group members rather than admins    
            SELECT id INTO role_id FROM role WHERE name = 'member' AND scope_prefix = 'modelling-group';
            
            INSERT INTO user_role (username, role, scope_id) VALUES ('bob', role_id, 'g1');
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
            
            SELECT id INTO simple_role_id FROM role WHERE name = 'user-manager' AND scope_prefix IS NULL;
            SELECT id INTO scoped_role_id FROM role WHERE name = 'member' AND scope_prefix = 'modelling-group';
            INSERT INTO user_role (username, role, scope_id) VALUES ('bob', simple_role_id, '');
            INSERT INTO user_role (username, role, scope_id) VALUES ('bob', scoped_role_id, 'some-group');
       END $$;
    `);
}