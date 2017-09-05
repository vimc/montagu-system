import fetcher from "../main/shared/sources/Fetcher";
import { ContribFetcher } from "../main/contrib/sources/ContribFetcher";
import { logIn } from "../main/shared/sources/LoginSource";
import { contribAuthStore } from "../main/contrib/stores/ContribAuthStore";
import { mainStore } from "../main/contrib/stores/MainStore";
import { expect } from "chai";
import { checkPromise } from "../test/testHelpers";
import { Client } from "pg";
import { responsibilityStore } from "../main/contrib/stores/ResponsibilityStore";
import {
    Disease, ModellingGroup, Responsibilities, ScenarioTouchstoneAndCoverageSets,
    Touchstone
} from "../main/shared/models/Generated";
import { alt } from "../main/shared/alt";
import { touchstoneActions } from "../main/contrib/actions/TouchstoneActions";
import { modellingGroupActions } from "../main/shared/actions/ModellingGroupActions";
import { responsibilityActions } from "../main/contrib/actions/ResponsibilityActions";
import * as QueryString from 'querystring';
const jwt_decode = require('jwt-decode');

// This group (IC-Garske) must match the one the logged in user belongs to
const groupId = "IC-Garske";
const touchstoneId = "test-1";
const scenarioId = "yf-1";

const dbName = process.env.PGDATABASE;
const dbTemplateName = process.env.PGTEMPLATE;

describe("Contribution portal", () => {
    let db: Client;

    beforeEach((done: DoneCallback) => {
        queryAgainstRootDb(`CREATE DATABASE ${dbName} TEMPLATE ${dbTemplateName};`)
            .then(() => {
                db = new Client({});
                db.connect();
                done();
            })
            .catch(e => done(e));
    });
    afterEach((done: DoneCallback) => {
        db.end();
        queryAgainstRootDb(`DROP DATABASE ${dbName};`)
            .then(() => done())
            .catch(e => done(e));
    });

    beforeEach((done: DoneCallback) => {
        (global as any).fetch = require('node-fetch');
        fetcher.fetcher = new ContribFetcher();
        checkPromise(done, logIn("test.user@imperial.ac.uk", "password", contribAuthStore, false));
    });
    afterEach(() => alt.recycle());

    it("fetches diseases", (done: DoneCallback) => {
        const promise = db.query(`
            INSERT INTO disease (id, name) VALUES ('d1', 'Disease 1');
            INSERT INTO disease (id, name) VALUES ('d2', 'Disease 2');
        `).then(() => mainStore.fetchDiseases());

        checkPromise(done, promise, (diseases) => {
            expectIsEqual<Disease[]>(diseases, [
                    { id: "d1", name: "Disease 1" },
                    { id: "d2", name: "Disease 2" }
            ]);
        });
    });

    it("fetches modelling groups", (done: DoneCallback) => {
        const promise = addGroups(db).then(() => mainStore.fetchModellingGroups());

        checkPromise(done, promise, (groups) => {
            expectIsEqual<ModellingGroup[]>(groups, [
                { id: groupId, description: "Group 1" },
                { id: "Fake", description: "Group 2" }
            ]);
        });
    });

    it("fetches touchstones", (done: DoneCallback) => {
        const promise = addTouchstone(db).then(() => responsibilityStore.fetchTouchstones());

        const expected: Touchstone = {
            id: touchstoneId,
            name: "test",
            version: 1,
            description: "Testing version 1",
            status: "open"
        };

        checkPromise(done, promise, (touchstones) => expectIsEqual<Touchstone[]>(touchstones, [expected]));
    });

    it("fetches responsibilities", (done: DoneCallback) => {
        const promise = addTouchstone(db)
            .then(() => addGroups(db))
            .then(() => addResponsibilities(db))
            .then(() => {
                setTouchstoneAndGroup(touchstoneId, groupId);
                return responsibilityStore.fetchResponsibilities();
            });
        checkPromise(done, promise, (responsibilities) => {
            expectIsEqual<Responsibilities>(responsibilities, expectedResponsibilitiesResponse());
        });
    });

    it("fetches coverage sets", (done: DoneCallback) => {
        let coverageSetId: number;
        const promise = addTouchstone(db)
            .then(() => addGroups(db))
            .then(() => addResponsibilities(db))
            .then(() => addCoverageSets(db))
            .then(id => coverageSetId = id)
            .then(() => {
                setTouchstoneAndGroup(touchstoneId, groupId);
                responsibilityActions.update(expectedResponsibilitiesResponse());
                responsibilityActions.setCurrentResponsibility(scenarioId);
                return responsibilityStore.fetchCoverageSets()
            });
        checkPromise(done, promise, data => {
            expectIsEqual<ScenarioTouchstoneAndCoverageSets>(data, {
                scenario: {
                    id: scenarioId,
                    description: "Yellow Fever scenario",
                    disease: "yf",
                    touchstones: [touchstoneId]
                },
                touchstone: {
                    id: touchstoneId,
                    name: "test",
                    version: 1,
                    description: "Testing version 1",
                    status: "open"
                },
                coverage_sets: [
                    {
                        id: coverageSetId,
                        name: "Test set",
                        touchstone: touchstoneId,
                        activity_type: "none",
                        vaccine: "yf",
                        gavi_support: "no vaccine"
                    }
                ]
            });
        })
    });

    it("fetches coverage one time token", (done: DoneCallback) => {
        const promise = addTouchstone(db)
            .then(() => addGroups(db))
            .then(() => addResponsibilities(db))
            .then(() => addCoverageSets(db))
            .then(() => {
                setTouchstoneAndGroup(touchstoneId, groupId);
                responsibilityActions.update(expectedResponsibilitiesResponse());
                responsibilityActions.setCurrentResponsibility(scenarioId);
                return responsibilityStore.fetchOneTimeCoverageToken()
            });
        checkPromise(done, promise, token => {
            const decoded = jwt_decode(token);
            expect(decoded.action).to.equal("coverage");
            const payload = QueryString.parse(decoded.payload);
            expect(payload).to.eql(JSON.parse(`{
                ":group-id": "${groupId}",
                ":touchstone-id": "${touchstoneId}",
                ":scenario-id": "${scenarioId}"
            }`));
        });
    });
});

function addTouchstone(db: Client): Promise<any> {
    return db.query(`
        INSERT INTO touchstone_name (id,     description, comment) 
        VALUES ('test', 'Testing',   '');
        INSERT INTO touchstone_status (id, name) VALUES ('open', 'Open');
        INSERT INTO touchstone (id,       touchstone_name, version, description,         status, comment) 
        VALUES ('${touchstoneId}', 'test',          1,       'Testing version 1', 'open',      '');
    `);
}

function addGroups(db: Client): Promise<any> {
    return db.query(`
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('${groupId}', 'Group 1', '', '');
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('Fake', 'Group 2', '', '');
    `);
}

function addResponsibilities(db: Client): Promise<any> {
    return db.query(`
        DO $$
            DECLARE scenario_id integer;
            DECLARE set_id integer;
        BEGIN
            INSERT INTO disease (id, name) VALUES ('yf', 'Yellow Fever');
            INSERT INTO scenario_description (id, description, disease)
            VALUES ('${scenarioId}', 'Yellow Fever scenario', 'yf');
            INSERT INTO scenario (touchstone, scenario_description)
            VALUES ('${touchstoneId}', '${scenarioId}')
            RETURNING id INTO scenario_id;
                    
            INSERT INTO responsibility_set_status (id, name) VALUES ('incomplete', 'Incomplete');
    
            INSERT INTO responsibility_set (modelling_group, touchstone, status)
            VALUES ('${groupId}', '${touchstoneId}', 'incomplete')
            RETURNING id INTO set_id;
            
            INSERT INTO responsibility (responsibility_set, scenario)
            VALUES (set_id, scenario_id);
        END $$;
    `)
}

function addCoverageSets(db: Client): Promise<number> {
    return db.query(`
        DO $$
            DECLARE coverage_set_id integer;
            DECLARE scenario_id integer;
        BEGIN
            INSERT INTO vaccine            (id, name) VALUES ('yf', 'Yellow Fever vaccine');
            INSERT INTO gavi_support_level (id, name) VALUES ('none', 'None');
            INSERT INTO activity_type      (id, name) VALUES ('none', 'None');
        
            INSERT INTO coverage_set (      name,        touchstone, vaccine, gavi_support_level, activity_type)
                              VALUES ('Test set', '${touchstoneId}',    'yf',             'none',        'none')
                              RETURNING id INTO coverage_set_id;
                              
            SELECT id FROM scenario INTO scenario_id;
            
            INSERT INTO scenario_coverage_set (   scenario,    coverage_set, "order") 
                                       VALUES (scenario_id, coverage_set_id,       0);
        END $$;
    `)
        .then(() => db.query(`SELECT id FROM coverage_set`))
        .then(result => result.rows[0].id);
}

function queryAgainstRootDb(query: string): Promise<void> {
    const db = new Client({ database: "postgres" });
    db.connect();
    return db.query(query)
        .then(() => db.end());
}

function setTouchstoneAndGroup(touchstoneId: string, groupId: string) {
    touchstoneActions.update([
        { id: touchstoneId, description: "Touchstone", status: "open", version: 1, name: "test" }
    ]);
    touchstoneActions.setCurrentTouchstone(touchstoneId);
    modellingGroupActions.updateGroups([
        { id: groupId, description: "Group 1" }
    ]);
    modellingGroupActions.setCurrentGroup(groupId);
}

function expectedResponsibilitiesResponse(): Responsibilities {
    return {
        status: "incomplete",
        touchstone: touchstoneId,
        problems: "",
        responsibilities: [
            {
                problems: [],
                status: "empty",
                current_estimate: null,
                scenario: {
                    id: scenarioId,
                    description: "Yellow Fever scenario",
                    disease: "yf",
                    touchstones: [touchstoneId]
                }
            }
        ]
    };
}

function expectIsEqual<T>(actual: T, expected: T) {
    expect(actual).to.eql(expected);
}