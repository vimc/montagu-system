import fetcher from "../main/shared/sources/Fetcher";
import { ContribFetcher } from "../main/contrib/sources/ContribFetcher";
import { logIn } from "../main/shared/sources/LoginSource";
import { contribAuthStore } from "../main/contrib/stores/ContribAuthStore";
import { mainStore } from "../main/contrib/stores/MainStore";
import { expect } from "chai";
import { checkPromise } from "../test/testHelpers";
import { Client } from "pg";
import { responsibilityStore } from "../main/contrib/stores/ResponsibilityStore";
import { Touchstone } from "../main/shared/models/Generated";
import { alt } from "../main/shared/alt";
import { touchstoneActions } from "../main/contrib/actions/TouchstoneActions";
import { modellingGroupActions } from "../main/shared/actions/ModellingGroupActions";
import { ExtendedResponsibilitySet } from "../main/contrib/models/ResponsibilitySet";

// This group (IC-Garske) must match the one the logged in user belongs to
const groupId = "IC-Garske";
const touchstoneId = "test-1";

describe("Contribution portal", () => {
    const db = new Client({});

    before(() => db.connect());
    after(() => db.end());

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

        checkPromise(done, promise, () => {
            expect(mainStore.getState().diseases).to.eql({
                loaded: true,
                content: {
                    d1: { id: "d1", name: "Disease 1" },
                    d2: { id: "d2", name: "Disease 2" }
                }
            });
        });
    });

    it("fetches modelling groups", (done: DoneCallback) => {
        const promise = addGroups(db).then(() => mainStore.fetchModellingGroups());

        checkPromise(done, promise, () => {
            expect(mainStore.getState().modellingGroups).to.eql({
                loaded: true,
                content: {
                    "IC-Garske": { id: groupId, description: "Group 1" },
                    Fake: { id: "Fake", description: "Group 2" }
                }
            });
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

        checkPromise(done, promise, () => expect(responsibilityStore.getState().touchstones).to.eql([expected]));
    });

    it("fetches responsibilities", (done: DoneCallback) => {
        const promise = addTouchstone(db)
            .then(() => addGroups(db))
            .then(() => addResponsibilities(db))
            .then(() => touchstoneActions.setCurrentTouchstone(touchstoneId))
            .then(() => modellingGroupActions.setCurrentGroup(groupId))
            .then(() => responsibilityStore.fetchResponsibilities());
        checkPromise(done, promise, () => {
            const set: ExtendedResponsibilitySet = responsibilityStore.getCurrentResponsibilitySet();
            expect(set).to.eql({
                problems: "",
                responsibilities: [{
                    current_estimate: null,
                    problems: [],
                    scenario: {
                        description: "Yellow Fever scenario",
                        disease: "yf",
                        id: "yf-1",
                        touchstones: ["test-1"]
                    },
                    status: "empty",
                    coverageSets: []
                }],
                status: "incomplete",
                touchstone: {},
                modellingGroup: {
                    id: groupId,
                    description: "Group 1"
                }
            });
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
        INSERT INTO disease (id, name) VALUES ('yf', 'Yellow Fever');
        INSERT INTO scenario_description (id, description, disease)
        VALUES ('yf-1', 'Yellow Fever scenario', 'yf');
        INSERT INTO scenario (touchstone, scenario_description)
        VALUES ('${touchstoneId}', 'yf-1')
        RETURNING id scenario_id;
    
        INSERT INTO responsibility_set_status (id, name) VALUES ('incomplete', 'Incomplete');
        
        INSERT INTO responsibility_set (modelling_group, touchstone, status)
        VALUES ('${groupId}', '${touchstoneId}', 'incomplete')
        RETURNING id INTO set_id;
        
        INSERT INTO responsibility (responsibility_set, scenario)
        VALUES (set_id, scenario_id)
    `);
}