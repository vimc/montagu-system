import * as React from "react";
import {createMemoryHistory} from 'history';

import {addCoverageData, addCoverageSetsForScenario, IntegrationTestSuite, TestService} from "./IntegrationTest";

import {shallow} from "enzyme";
import {Client, QueryResult} from "pg";
import {
    ModellingGroup,
    ResponsibilitySetWithExpectations,
    RoleAssignment,
    Scenario,
    User
} from "../main/shared/models/Generated";
import {createAdminStore} from "../main/admin/stores/createAdminStore";
import {AuthService} from "../main/shared/services/AuthService";
import {ModellingGroupsService} from "../main/shared/services/ModellingGroupsService";
import {UsersService} from "../main/admin/services/UsersService";
import {mockModellingGroupCreation} from "../test/mocks/mockModels";
import {TouchstonesService} from "../main/shared/services/TouchstonesService";
import {ScenarioGroupComponent} from "../main/admin/components/Touchstones/Scenarios/ScenarioGroup"
import {FileDownloadButton} from "../main/shared/components/FileDownloadLink";
import {ExpectationsService} from "../main/shared/services/ExpectationsService";

const touchstoneVersionId = "test-1";
const scenarioId = "yf-1";

class AdminIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Admin portal";
    }

    createStore() {
        return createAdminStore(createMemoryHistory());
    }

    runTests() {

        it("can log out", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).logOutOfAPI();
            expect(result).toBe("OK");
        });

        it("forgot password", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).forgotPassword("test@test.com");
            expect(result).toBe("OK");
        });

        it("can get current user details", async () => {
            const result = await (new AuthService(this.store.dispatch, this.store.getState)).getCurrentUser();
            expect(result.username).toBe("test.user");
            expect(result.permissions).toContain("*/can-login");
        });

        it("can fetch groups", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getAllGroups();
            expect(result).toEqual([
                {id: "g1", description: "Group 1"},
                {id: "g2", description: "Group 2"}
            ]);
        });

        it("can fetch models", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getAllModels();
            expect(result).toEqual([
                {
                    citation: "Citation",
                    description: "A model",
                    id: "model",
                    modelling_group: "g1",
                    gender: null,
                    gender_specific: false,
                    current_version: null,
                    disease: {
                        id: "yf",
                        name: "yellow fever"
                    }
                },
                {
                    citation: "Citation",
                    description: "Another model",
                    id: "model2",
                    modelling_group: "g2",
                    gender: null,
                    gender_specific: false,
                    current_version: null,
                    disease: {
                        id: "yf",
                        name: "yellow fever"
                    }
                }
            ]);
        });

        it("can fetch expectations", async () => {
            await addResponsibilities(this.db);
            const result = await (new ExpectationsService(this.store.dispatch, this.store.getState)).getAllExpectations();
            expect(result).toEqual([{
                touchstone_version: touchstoneVersionId,
                modelling_group: "g1",
                disease: "yf",
                expectation: {
                    id: 1,
                    description: "bee desc",
                    years: {
                        minimum_inclusive: 1950,
                        maximum_inclusive: 2100
                    },
                    ages: {
                        minimum_inclusive: 0,
                        maximum_inclusive: 99
                    },
                    cohorts: {
                        minimum_birth_year: 1900,
                        maximum_birth_year: 2100
                    },
                    outcomes: [{code: "cases", name: "cases"}, {code: "deaths", name: "deaths"}]
                },
                applicable_scenarios: [scenarioId]
            }]);
        });

        it("can fetch group details", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState)).getGroupDetails('g1');
            expect(result).toEqual({
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
            expect(result).toEqual("OK");
            const groupDetails = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getGroupDetails('g1');
            expect(groupDetails.members.indexOf("test.user") > -1).toBe(true);
        });

        it("can remove member from a group", async () => {
            await addGroups(this.db);
            const result = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .removeMember("g1", "bob");
            expect(result).toEqual("OK");
            const groupDetails = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getGroupDetails('g1');
            expect(groupDetails.members.indexOf("bob") === -1).toBe(true);
        });

        it("can add a global role to a user", async () => {
            await addUsers(this.db);
            const result = await (new UsersService(this.store.dispatch, this.store.getState))
                .addGlobalRoleToUser("bob", "touchstone-reviewer");
            expect(result).toEqual("OK");

            const users = await (new UsersService(this.store.dispatch, this.store.getState))
                .getAllUsers();

            const user = users.find((u: User) => u.username == "bob");
            expect(user.roles.map((r: RoleAssignment) => r.name))
                .toEqual(['touchstone-reviewer', 'member', 'user-manager'])
        });

        it("can remove role from a user", async () => {
            await addUsers(this.db);
            const result = await (new UsersService(this.store.dispatch, this.store.getState))
                .removeRoleFromUser("bob", "user-manager", null, null);
            expect(result).toEqual("OK");

            const users = await (new UsersService(this.store.dispatch, this.store.getState))
                .getAllUsers();
            const user = users.find((u: User) => u.username == "bob");

            expect(user.roles.map((r: RoleAssignment) => r.name))
                .toEqual(['member'])
        });

        it("can fetch users", async () => {
            await addUsers(this.db);
            const users: User[] = await (new UsersService(this.store.dispatch, this.store.getState)).getAllUsers();
            const bob: User = users.find(x => x.username == 'bob');
            expect(bob).toEqual({
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

        it("can fetch global roles", async () => {
            const roles: string[] = await (new UsersService(this.store.dispatch, this.store.getState))
                .getGlobalRoles();

            expect(roles).toHaveLength(10)
        });

        it("can create a user", async () => {

            const usersService = new UsersService(this.store.dispatch, this.store.getState);
            const result = await usersService
                .createUser("new user", "user@example.com", "new.user");

            expect(result).toMatch(new RegExp("/v1/users/new.user/$"));
            const allUsers = await usersService.getAllUsers();
            expect(allUsers.map((u: User) => u.username).indexOf("new.user") > -1).toBe(true);
        });


        it("can create a group", async () => {

            const groupService = new ModellingGroupsService(this.store.dispatch, this.store.getState);
            const result = await groupService
                .createGroup(mockModellingGroupCreation({id: "test-group"}));

            expect(result).toMatch(new RegExp("/v1/modelling-group/test-group/$"));
            const allGroups = await groupService.getAllGroups();
            expect(allGroups.map((g: ModellingGroup) => g.id).indexOf("test-group") > -1).toBe(true);
        });

        it("can get responsibilities for touchstone", async () => {

            await addResponsibilities(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService
                .getResponsibilitiesForTouchstoneVersion(touchstoneVersionId);

            expect(result).toEqual(expectedResponsibilitySets)
        });

        it("can get scenarios for touchstone", async () => {
            await addResponsibilities(this.db);
            const touchstoneService = new TouchstonesService(this.store.dispatch, this.store.getState);
            const result = await touchstoneService.getScenariosForTouchstoneVersion(touchstoneVersionId);
            expect(result).toEqual([
                {
                    "coverage_sets": [],
                    "scenario": {
                        "description": "Yellow Fever scenario",
                        "disease": "yf",
                        "id": "yf-1",
                        "touchstones": [
                            "test-1"
                        ]
                    }
                }
            ]);
        });

        it("can download coverage data in long format", async () => {
            const coverageSetId = await addCoverageSetsForScenario(this.db, scenarioId, touchstoneVersionId);
            await addCoverageData(this.db, coverageSetId);

            const scenarios: Scenario[] = [
                {
                    "description": "Yellow Fever scenario",
                    "disease": "yf",
                    "id": "yf-1",
                    "touchstones": [
                        "test-1"
                    ]
                }
            ];

            const rendered = shallow(<ScenarioGroupComponent
                touchstoneVersionId={touchstoneVersionId}
                disease={{id: "yf", name: "Yellow Fever"}}
                canDownloadCoverage={true}
                scenarios={scenarios}/>);

            const href = rendered.find(FileDownloadButton).first().prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).toEqual(200);
            const result = await response.text();

            expect(result).toEqual("scenario,set_name,vaccine,gavi_support,activity_type,country_code,country,year,age_first,age_last,age_range_verbatim,target,coverage,gender\n"
                + "yf-1,Test set,yf,no vaccine,none,ATL,Atlantis,1970,1,2,1-2,1000,1000,both\n")
        });

        it("can download coverage data in wide format", async () => {
            const coverageSetId = await addCoverageSetsForScenario(this.db, scenarioId, touchstoneVersionId);
            await addCoverageData(this.db, coverageSetId);

            const scenarios: Scenario[] = [
                {
                    "description": "Yellow Fever scenario",
                    "disease": "yf",
                    "id": "yf-1",
                    "touchstones": [
                        "test-1"
                    ]
                }
            ];

            const rendered = shallow(<ScenarioGroupComponent
                touchstoneVersionId={touchstoneVersionId}
                disease={{id: "yf", name: "Yellow Fever"}}
                canDownloadCoverage={true}
                scenarios={scenarios}/>);

            const href = rendered.find(FileDownloadButton).at(1).prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).toEqual(200);
            const result = await response.text();

            expect(result).toEqual("scenario,set_name,vaccine,gavi_support,activity_type,country_code,country,age_first,age_last,age_range_verbatim,gender,coverage_1970,target_1970\n"
                + "yf-1,Test set,yf,no vaccine,none,ATL,Atlantis,1,2,1-2,both,1000,1000\n")
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
            
            INSERT INTO disease (id, name) values ('yf', 'yellow fever');
            INSERT INTO model (id, modelling_group, description, citation, is_current, disease) VALUES ('model', 'g1', 'A model', 'Citation', true, 'yf');
            INSERT INTO model (id, modelling_group, description, citation, is_current, disease) VALUES ('model2', 'g2', 'Another model', 'Citation', true, 'yf');
            
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

function addTouchstone(db: Client): Promise<QueryResult> {
    return db.query(`
        INSERT INTO touchstone_name (id,     description, comment) 
        VALUES ('test', 'Testing',   'comment');
        INSERT INTO touchstone (id,       touchstone_name, version, description,         status, comment) 
        VALUES ('${touchstoneVersionId}', 'test',          1,       'Testing version 1', 'open',      'comment for v1');
    `);
}

function addResponsibilities(db: Client) {
    return addTouchstone(db)
        .then(() => addGroups(db))
        .then(() => db.query(`
            DO $$
                DECLARE scenario_id integer;
                DECLARE set_id integer;
                DECLARE burden_estimate_expectation_id integer;
            BEGIN
                INSERT INTO scenario_description (id, description, disease)
                VALUES ('${scenarioId}', 'Yellow Fever scenario', 'yf');
                INSERT INTO scenario (touchstone, scenario_description)
                VALUES ('${touchstoneVersionId}', '${scenarioId}')
                RETURNING id INTO scenario_id;
        
                INSERT INTO responsibility_set (modelling_group, touchstone, status)
                VALUES ('g1', '${touchstoneVersionId}', 'incomplete')
                RETURNING id INTO set_id;
                
                INSERT INTO burden_estimate_expectation (year_min_inclusive, year_max_inclusive, age_min_inclusive,
                    age_max_inclusive, cohort_min_inclusive, cohort_max_inclusive, description, version)
                VALUES (1950, 2100, 0, 99, 1900, 2100, 'bee desc', '1')    
                RETURNING id INTO burden_estimate_expectation_id;
                
                INSERT INTO burden_estimate_outcome_expectation (burden_estimate_expectation, outcome)
                VALUES (burden_estimate_expectation_id, 'cases');
                
                INSERT INTO burden_estimate_outcome_expectation (burden_estimate_expectation, outcome)
                VALUES (burden_estimate_expectation_id, 'deaths');
                
                INSERT INTO responsibility (responsibility_set, scenario, is_open, expectations)
                VALUES (set_id, scenario_id, true, burden_estimate_expectation_id);
            END $$;
    `))
}

const expectedResponsibilitySets: ResponsibilitySetWithExpectations[] = [{
    modelling_group_id: "g1",
    touchstone_version: touchstoneVersionId,
    status: "incomplete",
    responsibilities: [
        {
            problems: [],
            status: "empty",
            current_estimate_set: null,
            scenario: {
                id: scenarioId,
                description: "Yellow Fever scenario",
                disease: "yf",
                touchstones: [touchstoneVersionId]
            }
        }
    ],
    expectations: [
        {
            applicable_scenarios: [scenarioId],
            disease: "yf",
            expectation: {
                ages: {
                    minimum_inclusive: 0,
                    maximum_inclusive: 99
                },
                cohorts: {
                    minimum_birth_year: 1900,
                    maximum_birth_year: 2100
                },
                countries: [],
                description: "bee desc",
                id: 1,
                outcomes: [{code: "cases", name: "cases"},{code: "deaths", name: "deaths"}],
                years: {
                    minimum_inclusive: 1950,
                    maximum_inclusive: 2100
                }
            }
        }
     ]
}];