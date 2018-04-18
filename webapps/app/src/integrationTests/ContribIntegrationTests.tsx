import * as React from "react";
import {expect} from "chai"
import {checkPromise} from "../test/testHelpers";
import {Client, QueryResult} from "pg";
import { createMemoryHistory } from 'history';

import {
    Responsibilities, Touchstone, Disease, Result, ModellingGroup, ScenarioTouchstoneAndCoverageSets,
    DemographicDataset,
    ModelRunParameterSet,
} from "../main/shared/models/Generated";
import {touchstoneActions} from "../main/contrib/actions/TouchstoneActions";
import {modellingGroupActions} from "../main/shared/actions/ModellingGroupActions";
import {expectIsEqual, IntegrationTestSuite} from "./IntegrationTest";
import {ContribFetcher} from "../main/contrib/sources/ContribFetcher";
import {shallow} from "enzyme";
import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-15";
enzyme.configure({ adapter: new Adapter() });
import {ModelRunParametersSection} from "../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersSection";
import {ModelRunParametersContentComponent} from "../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersContent";
import {mockModellingGroup, mockTouchstone} from "../test/mocks/mockModels";
import {mainStore} from "../main/contrib/stores/MainStore";
import fetcher, {Fetcher} from "../main/shared/sources/Fetcher";
import {apiResponse} from "../main/shared/sources/Source";
import {responsibilityStore} from "../main/contrib/stores/ResponsibilityStore";
import {responsibilityActions} from "../main/contrib/actions/ResponsibilityActions";
import {Form} from "../main/shared/components/Form";
import {CreateBurdenEstimateSetForm} from "../main/contrib/components/Responsibilities/BurdenEstimates/CreateBurdenEstimateSetForm";
import {runParametersStore} from "../main/contrib/stores/RunParametersStore";
import * as QueryString from "querystring";
import {demographicStore} from "../main/contrib/stores/DemographicStore";
import {demographicActions} from "../main/contrib/actions/DemographicActions";
import {estimateTokenActions} from "../main/contrib/actions/EstimateActions";
import {runParameterActions} from "../main/contrib/actions/RunParameterActions";

import {fetchToken as fetchTokenForModelRunParam} from "../main/contrib/sources/RunParametersSource";
import {createContribStore} from "../main/contrib/stores/createContribStore";
import { ModellingGroupsService } from "../main/shared/services/ModellingGroupsService";
import {UserService} from "../main/contrib/services/UserService";

const FormData = require('form-data');
const http = require('http');
const jwt_decode = require('jwt-decode');

const groupId = "test-group"; // This group must match the one the logged in user belongs to
const touchstoneId = "test-1";
const scenarioId = "yf-1";
const modelId = "model-1";
const modelVersion = "v1";

class ContributionPortalIntegrationTests extends IntegrationTestSuite {
    description() {
        return "Contribution portal";
    }

    createStore() {
        return createContribStore(createMemoryHistory());
    }

    makeFetcher() {
        return new ContribFetcher();
    }

    addTestsToMocha() {

        function getUrlFromModelRunParametersContent(): string {
            const rendered = shallow(<ModelRunParametersContentComponent
                ready={true} touchstone={mockTouchstone({id: touchstoneId})}
                group={mockModellingGroup({id: groupId})}
                diseases={["yf"]}/>);

            return rendered.find(ModelRunParametersSection).first().prop("url");
        }

        it("can upload model run parameter sets", (done: DoneCallback) => {

            const url = getUrlFromModelRunParametersContent();

            const form = new FormData();

            const promise = addResponsibilities(this.db).then(() => {
                return addModel(this.db).then(() => {

                    form.append('disease', 'yf');

                    return fetcher.fetcher.fetch(url, {
                        method: "POST",
                        body: form
                    }).then((response: Response) => {
                        return apiResponse(response)
                            .then((result: Result) => {
                                    return result
                                }
                            );
                    });

                })
            });

            checkPromise(done, promise, (result: Result) => {
                // we don't expect this to be successful as haven't attached a file
                // but this verifies that that we have the right url
                expect(result.errors[0].message).to.eq("You must supply a \'file\' parameter in the multipart body")
            })
        });

        it("fetches diseases", (done: DoneCallback) => {
            const promise = this.db.query(`
                INSERT INTO disease (id, name) VALUES ('d1', 'Disease 1');
                INSERT INTO disease (id, name) VALUES ('d2', 'Disease 2');
            `).then(() => mainStore.fetchDiseases());

            checkPromise(done, promise, (diseases) => {
                expectIsEqual<Disease[]>(diseases, [
                    {id: "d1", name: "Disease 1"},
                    {id: "d2", name: "Disease 2"}
                ]);
            });
        });

        it("signs confidentiality agreement", async () => {

            const result = await (new UserService(this.store.dispatch, this.store.getState))
                .signConfidentiality();
            expect(result).to.eq("OK");

        });

        it("gets confidentiality agreement", async () => {

            const result = await (new UserService(this.store.dispatch, this.store.getState))
                .getConfidentiality();
            expect(result).to.eq("False");

        });

        it("fetches modelling groups", (done: DoneCallback) => {
            const promise = addGroups(this.db).then(() => (new ModellingGroupsService(this.store.dispatch, this.store.getState).getAllGroups()));

            checkPromise(done, promise, (groups) => {
                expectIsEqual<ModellingGroup[]>(groups, [
                    {id: groupId, description: "Group 1"},
                    {id: "Fake", description: "Group 2"}
                ]);
            });
        });

        it("fetches touchstones", (done: DoneCallback) => {
            const promise = addResponsibilities(this.db)
                .then(() => {
                    setGroup(groupId);
                    return responsibilityStore.fetchTouchstones()
                });

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
            const promise = addResponsibilities(this.db)
                .then((responsibilityIds) => {
                    return addModel(this.db)
                        .then((modelVersionId) => {
                            return addBurdenEstimateSet(this.db, responsibilityIds.responsibility, modelVersionId)
                        })
                })
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
            const promise = addCoverageSets(this.db)
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
            const promise = addCoverageSets(this.db)
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

        it("fetches demographic data sets", (done: DoneCallback) => {
            const promise = addDemographicDataSets(this.db)
                .then(() => {
                    touchstoneActions.setCurrentTouchstone(touchstoneId);
                    return demographicStore.fetchDataSets();
                });
            checkPromise(done, promise, (dataSets: DemographicDataset[]) => {
                expectIsEqual<DemographicDataset[]>(dataSets, [
                    {
                        id: "statistic",
                        name: "Some statistic",
                        gender_is_applicable: false,
                        source: "source"
                    }
                ]);
            });
        });

        it("fetches one time demographic token", (done: DoneCallback) => {
            const promise = addDemographicDataSets(this.db)
                .then(() => {
                    touchstoneActions.setCurrentTouchstone(touchstoneId);
                    return demographicStore.fetchDataSets();
                })
                .then(() => {
                    demographicActions.selectDataSet("statistic");
                    return demographicStore.fetchOneTimeToken();
                });
            checkPromise(done, promise, (token: string) => {
                const decoded = jwt_decode(token);
                expect(decoded.action).to.equal("demography");
                const payload = QueryString.parse(decoded.payload);
                expect(payload).to.eql(JSON.parse(`{
                    ":touchstone-id": "${touchstoneId}",
                    ":source-code": "source",
                    ":type-code": "statistic"
                }`));
            });
        });

        it("fetches one time estimates token", (done: DoneCallback) => {

            const promise = returnBurdenEstimateSetPromise(this.db)
                .then(() => {
                    setTouchstoneAndGroup(touchstoneId, groupId);
                    return responsibilityStore.fetchResponsibilities().then(() => {
                        responsibilityActions.setCurrentResponsibility(scenarioId);
                        return responsibilityStore.fetchOneTimeEstimatesToken();
                    });

                });


            checkPromise(done, promise, token => {
                const decoded = jwt_decode(token);
                expect(decoded.action).to.equal("burdens-populate");
                const payload = QueryString.parse(decoded.payload);
                expect(payload).to.eql(JSON.parse(`{
                    ":group-id": "${groupId}",
                    ":touchstone-id": "${touchstoneId}",
                    ":scenario-id": "${scenarioId}",
                    ":set-id": "1"
                }`));
            });
        });

        it("fetches one time estimates token with redirect url", (done: DoneCallback) => {

            const promise = returnBurdenEstimateSetPromise(this.db)
                .then(() => {
                    setTouchstoneAndGroup(touchstoneId, groupId);
                    return responsibilityStore.fetchResponsibilities().then(() => {
                        responsibilityActions.setCurrentResponsibility(scenarioId);
                        estimateTokenActions.setRedirectPath("/redirect/back");
                        return responsibilityStore.fetchOneTimeEstimatesToken();

                    });
                });

            checkPromise(done, promise, token => {
                const decoded = jwt_decode(token);
                expect(decoded.action).to.equal("burdens-populate");

                const query = QueryString.parse(decoded.query);
                expect(query).to.eql(JSON.parse(`{
                    "redirectUrl": "http://localhost:5000/redirect/back"
                }`
                ));

                const payload = QueryString.parse(decoded.payload);
                expect(payload).to.eql(JSON.parse(`{
                    ":group-id": "${groupId}",
                    ":touchstone-id": "${touchstoneId}",
                    ":scenario-id": "${scenarioId}",
                    ":set-id": "1"
                }`));

            });
        });

        function returnBurdenEstimateSetPromise(db: Client): Promise<any> {
            let responsibilityIds: ResponsibilityIds = null;
            return addResponsibilities(db)
                .then(responsibilityIdsResult => {responsibilityIds = responsibilityIdsResult; return addModel(db)})
                .then(modelVersionId => addBurdenEstimateSet(db, responsibilityIds.responsibility, modelVersionId))
                .then(setId => updateCurrentBurdenEstimateSet(db, responsibilityIds.responsibility, setId));
        }

        it("fetches model run parameter sets", (done: DoneCallback) => {
            const promise: Promise<any> = addModelRunParameterSets(this.db)
                .then(() => {
                    setTouchstoneAndGroup(touchstoneId, groupId);
                    return runParametersStore.fetchParameterSets()
                });

            checkPromise(done, promise, parameterSets => {
                expectIsEqual<ModelRunParameterSet[]>(parameterSets, [
                    {
                        id: 1,
                        model: "model-1",
                        disease: "yf",
                        uploaded_on: '2017-12-25T12:00:00Z',
                        uploaded_by: 'test.user'
                    }
                ]);
            });
        });

        it("fetches one time model run parameter sets token", (done: DoneCallback) => {

            const promise: Promise<any> = addModelRunParameterSets(this.db)
                .then(() => {
                    setTouchstoneAndGroup(touchstoneId, groupId);
                    const s = runParametersStore.getState();
                    return fetchTokenForModelRunParam(s.groupId, s.touchstoneId, 1)
                });

            checkPromise(done, promise, token => {
                const decoded = jwt_decode(token);
                expect(decoded.action).to.equal("model-run-parameters");
                const payload = QueryString.parse(decoded.payload);
                expect(payload).to.eql(JSON.parse(`{
                    ":group-id": "${groupId}",
                    ":touchstone-id": "${touchstoneId}",
                    ":model-run-parameter-set-id": "1"
                }`));
            });
        });

        function getUrlFromCreateBurdenEstimateSetForm(): string {
            const rendered = shallow(<CreateBurdenEstimateSetForm
                touchstoneId={touchstoneId} groupId={groupId} scenarioId={scenarioId}/>);

            return rendered.find(Form).prop("url");
        }

        it("creates burden estimates set", (done: DoneCallback) => {

            const url = getUrlFromCreateBurdenEstimateSetForm();

            let testValue = 0;
            const props = {
                successCallback: () => {
                    testValue = 1;
                },
                url: url,
                successMessage: "hi",
                submitText: "submit",
                data: {
                    type: {
                        type: "central-averaged",
                        details: "details"
                    }
                }
            };

            const form = new Form(props);

            const promise = addResponsibilities(this.db).then(() => {
                return addModel(this.db).then(() => {
                    return form.submitForm(null);
                })
            });

            checkPromise(done, promise, (id) => {
                expect(testValue).to.eq(1);
            })

        });

    }
}

new ContributionPortalIntegrationTests();

function addTouchstone(db: Client): Promise<QueryResult> {
    return db.query(`
        INSERT INTO touchstone_name (id,     description, comment) 
        VALUES ('test', 'Testing',   '');
        INSERT INTO touchstone (id,       touchstone_name, version, description,         status, comment) 
        VALUES ('${touchstoneId}', 'test',          1,       'Testing version 1', 'open',      '');
    `);
}

function addGroups(db: Client): Promise<QueryResult> {
    return db.query(`
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('${groupId}', 'Group 1', '', '');
        INSERT INTO modelling_group (id, description, institution, pi) VALUES ('Fake', 'Group 2', '', '');
    `);
}

interface ResponsibilityIds {
    responsibility: number;
    responsibilitySet: number;
}

function addResponsibilities(db: Client): Promise<ResponsibilityIds> {
    return addTouchstone(db)
        .then(() => addGroups(db))
        .then(() => db.query(`
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
        
                INSERT INTO responsibility_set (modelling_group, touchstone, status)
                VALUES ('${groupId}', '${touchstoneId}', 'incomplete')
                RETURNING id INTO set_id;
                
                INSERT INTO responsibility (responsibility_set, scenario, is_open)
                VALUES (set_id, scenario_id, true);
            END $$;
    `))
        .then(() => db.query(`SELECT responsibility.id as responsibility, responsibility_set.id as responsibility_set 
                              FROM responsibility JOIN responsibility_set ON true`))
        .then(result => {
            const row = result.rows[0];
            return {responsibility: row.responsibility, responsibilitySet: row.responsibility_set}
        });
}

function addModel(db: Client): Promise<number> {
    return db.query(`
        INSERT INTO model (id, modelling_group, disease, description, citation, is_current) VALUES ('${modelId}', '${groupId}', 'yf', 'a model', 'citation', true);        
        INSERT INTO model_version (model, version) VALUES ('${modelId}', '${modelVersion}');
                UPDATE model SET current_version = (SELECT id FROM model_version);`)
        .then(() => db.query(`SELECT id FROM model_version;`))
        .then(result => result.rows[0].id);
}

function addBurdenEstimateSet(db: Client, responsibilityId: number, modelVersionId: number): Promise<number> {
    return db.query(`INSERT INTO burden_estimate_set (responsibility, model_version, uploaded_by, run_info, interpolated, complete)
        VALUES ('${responsibilityId}', '${modelVersionId}', 'test.user', '', false, false);
    `)
        .then(() => db.query(`SELECT id FROM burden_estimate_set;`))
        .then(result => result.rows[0].id);
}

function updateCurrentBurdenEstimateSet(db: Client, responsibilityId: number, setId: number): Promise<QueryResult> {
    return db.query(`UPDATE responsibility SET current_burden_estimate_set=${setId} WHERE id = ${responsibilityId}`);
}

function addCoverageSets(db: Client): Promise<number> {
    return addResponsibilities(db)
        .then(() => db.query(`
            DO $$
                DECLARE coverage_set_id integer;
                DECLARE scenario_id integer;
            BEGIN
                INSERT INTO vaccine            (id, name) VALUES ('yf', 'Yellow Fever vaccine');
            
                INSERT INTO coverage_set (      name,        touchstone, vaccine, gavi_support_level, activity_type)
                                  VALUES ('Test set', '${touchstoneId}',    'yf',             'none',        'none')
                                  RETURNING id INTO coverage_set_id;
                                  
                SELECT id FROM scenario INTO scenario_id;
                
                INSERT INTO scenario_coverage_set (   scenario,    coverage_set, "order") 
                                           VALUES (scenario_id, coverage_set_id,       0);
            END $$;
        `))
        .then(() => db.query(`SELECT id FROM coverage_set`))
        .then(result => result.rows[0].id);
}

function addDemographicDataSets(db: Client): Promise<QueryResult> {
    return addTouchstone(db)
        .then(() => db.query(`
            DO $$
                DECLARE gender_id integer;
                DECLARE source_id integer;
                DECLARE variant_id integer;
                DECLARE unit_id integer;
                DECLARE type_id integer;
                DECLARE dataset_id integer;
            BEGIN
                INSERT INTO country (id, name) VALUES ('ATL', 'Atlantis');
                INSERT INTO disease (id, name) VALUES ('yf', 'Yellow Fever');
                
                INSERT INTO demographic_source (code, name) VALUES ('source', 'A great source')
                    RETURNING id INTO source_id;
                INSERT INTO demographic_variant (code, name) VALUES ('variant', 'A so-so variant')
                    RETURNING id INTO variant_id;
                    
                SELECT id INTO unit_id FROM demographic_value_unit WHERE name = 'Number of people';
                SELECT id INTO gender_id FROM gender WHERE code = 'both';
                
                INSERT INTO demographic_statistic_type 
                       (      code,              name, default_variant, demographic_value_unit, gender_is_applicable, age_interpretation, year_step_size, reference_date) 
                VALUES ('statistic', 'Some statistic',     variant_id,                unit_id,                false,            'people',            5,   '2017-01-01')
                RETURNING id INTO type_id;
                
                INSERT INTO demographic_dataset (demographic_source, demographic_statistic_type, description)
                VALUES (source_id, type_id, 'some dataset')
                RETURNING id into dataset_id;
                
                INSERT INTO touchstone_demographic_dataset (touchstone, demographic_dataset)
                VALUES ('${touchstoneId}', dataset_id);
                
                INSERT INTO touchstone_country (touchstone, country, disease)
                VALUES ('${touchstoneId}', 'ATL', 'yf');
                
                INSERT INTO demographic_statistic 
                (demographic_source, country, year, age_from, age_to, demographic_statistic_type, demographic_variant,    gender, value)
                VALUES
                (         source_id,   'ATL', 2017,       20,     25,                    type_id,          variant_id, gender_id,  8765);                
            END $$;
        `));
}

function addModelRunParameterSets(db: Client): Promise<QueryResult> {
    return addResponsibilities(db)
        .then((responsibilityIds: ResponsibilityIds) => {
            return addModel(db).then(modelVersion => {
                return {
                    responsibilitySet: responsibilityIds.responsibilitySet,
                    modelVersion: modelVersion
                };
            });
        })
        .then((ids) => {
            return db.query(`
                DO $$
                    DECLARE upload_info_id integer;
                BEGIN
                    INSERT INTO upload_info (uploaded_by, uploaded_on) VALUES ('test.user', '2017-12-25 12:00')
                        RETURNING id INTO upload_info_id;
            
                    INSERT INTO model_run_parameter_set 
                    (responsibility_set, model_version, upload_info)
                    VALUES 
                    (${ids.responsibilitySet}, ${ids.modelVersion}, upload_info_id);
                END $$;
            `);
        });
}

function setTouchstoneAndGroup(touchstoneId: string, groupId: string) {
    touchstoneActions.update([
        {id: touchstoneId, description: "Touchstone", status: "open", version: 1, name: "test"}
    ]);
    touchstoneActions.setCurrentTouchstone(touchstoneId);
    modellingGroupActions.updateGroups([
        {id: groupId, description: "Group 1"}
    ]);
    modellingGroupActions.setCurrentGroup(groupId);
}

function setGroup(groupId: string) {
    modellingGroupActions.updateGroups([
        {id: groupId, description: "Group 1"}
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
                current_estimate_set: null,
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