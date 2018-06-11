import * as React from "react";
import {expect} from "chai"
import {Client, QueryResult} from "pg";
import { createMemoryHistory } from 'history';

import {
    Responsibilities, TouchstoneVersion, Disease, Result, ModellingGroup, ScenarioTouchstoneAndCoverageSets,
    DemographicDataset,
    ModelRunParameterSet,
} from "../main/shared/models/Generated";
import { IntegrationTestSuite} from "./IntegrationTest";
import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-15";
enzyme.configure({ adapter: new Adapter() });
import * as QueryString from "querystring";

import {createContribStore} from "../main/contrib/createStore";
import { ModellingGroupsService } from "../main/shared/services/ModellingGroupsService";
import {RunParametersService} from "../main/contrib/services/RunParametersService";
import {DiseasesService} from "../main/contrib/services/DiseasesService";
import {TouchstonesService} from "../main/contrib/services/TouchstonesService";
import {ResponsibilitiesService} from "../main/contrib/services/ResponsibilitiesService";
import {CoverageService} from "../main/contrib/services/CoverageService";
import {DemographicService} from "../main/contrib/services/DemographicService";
import {appSettings, settings} from "../main/shared/Settings";
import {EstimatesService} from "../main/contrib/services/EstimatesService";
import {EstimatesCreateBurdenData} from "../main/contrib/actionTypes/EstimatesTypes";
import {UserService} from "../main/contrib/services/UserService";
import {helpers} from "../main/shared/Helpers";

const FormData = require('form-data');
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

    makeFetcher(): any {
        return null;
    }

    addTestsToMocha() {

        it("can upload model run parameter sets", async () => {
            await addResponsibilities(this.db);
            await addModel(this.db);

            const form = new FormData();
            form.append('disease', 'yf');

            const uploadResult: Result = await (new RunParametersService(this.store.dispatch, this.store.getState))
                .uploadSet(groupId, touchstoneId, form);

            expect(uploadResult.errors[0].message).to.eq("You must supply a \'file\' parameter in the multipart body")
        });

        it("fetches diseases", async () => {
            await this.db.query(`
                INSERT INTO disease (id, name) VALUES ('d1', 'Disease 1');
                INSERT INTO disease (id, name) VALUES ('d2', 'Disease 2');
            `);

            const fetchedDiseasesResult: Disease[] = await (new DiseasesService(this.store.dispatch, this.store.getState))
                .getAllDiseases();

            expect(fetchedDiseasesResult).to.eql([
                {id: "d1", name: "Disease 1"},
                {id: "d2", name: "Disease 2"}
            ]);
        });

        it("signs confidentiality agreement", async () => {

          const result = await (new UserService(this.store.dispatch, this.store.getState))
            .signConfidentiality();
          expect(result).to.eq("OK");

        });

        it("gets confidentiality agreement", async () => {

          const result = await (new UserService(this.store.dispatch, this.store.getState))
            .getConfidentiality();
         expect(result).to.eq(false);

        });

        it("fetches modelling groups", async () => {
            await addGroups(this.db);

            const fetchedGroupsResult: ModellingGroup[] = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getAllGroups();

            expect(fetchedGroupsResult).to.eql([
                {id: groupId, description: "Group 1"},
                {id: "Fake", description: "Group 2"}
            ]);
        });

        it("fetches touchstones", async () => {
            await addResponsibilities(this.db);

            const fetchedTouchstonesResult: TouchstoneVersion[] = await (new TouchstonesService(this.store.dispatch, this.store.getState))
                .getTouchstonesByGroupId(groupId);

            const touchstone: TouchstoneVersion = {
                id: touchstoneId,
                name: "test",
                version: 1,
                description: "Testing version 1",
                status: "open"
            };
            expect(fetchedTouchstonesResult).to.eql([touchstone]);
        });

        it("fetches responsibilities", async () => {
            const responsibilityIds = await addResponsibilities(this.db);
            const modelVersionId = await addModel(this.db);
            await addBurdenEstimateSet(this.db, responsibilityIds.responsibility, modelVersionId);

            const responsibilities: Responsibilities = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .getResponsibilities(groupId, touchstoneId);

            expect(responsibilities).to.eql(expectedResponsibilitiesResponse());
        });

        it("fetches coverage sets", async () => {
            const coverageSetId: number = await addCoverageSets(this.db);

            const coverageSets: ScenarioTouchstoneAndCoverageSets = await (new CoverageService(this.store.dispatch, this.store.getState))
                .getDataSets(groupId, touchstoneId, scenarioId);

            const expectedCoverageSets: ScenarioTouchstoneAndCoverageSets = {
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
            };
            expect(coverageSets).to.eql(expectedCoverageSets);
        });


        it("fetches coverage one time token", async () => {
            await addCoverageSets(this.db);

            const token: string = await (new CoverageService(this.store.dispatch, this.store.getState))
                .getOneTimeToken(groupId, touchstoneId, scenarioId, 'long');

            const decoded = jwt_decode(token);

            expect(decoded.action).to.equal("coverage");
            const payload = QueryString.parse(decoded.payload);
            expect(payload).to.eql({
                ":group-id": groupId,
                ":touchstone-id": touchstoneId,
                ":scenario-id": scenarioId
            });
        });

        it("fetches demographic data sets", async () => {
            await addDemographicDataSets(this.db);

            const demographicDataSets: DemographicDataset[] = await (new DemographicService(this.store.dispatch, this.store.getState))
                .getDataSetsByTouchstoneId(touchstoneId);

            const expectedDataSets: DemographicDataset[] = [
                {
                    id: "statistic",
                    name: "Some statistic",
                    gender_is_applicable: false,
                    source: "source"
                }
            ];
            expect(demographicDataSets).to.eql(expectedDataSets)
        });

        it("fetches one time demographic token", async () => {
            await addDemographicDataSets(this.db);

            const demographicDataSets: DemographicDataset[] = await (new DemographicService(this.store.dispatch, this.store.getState))
                .getDataSetsByTouchstoneId(touchstoneId);

            const demographicDataSet = demographicDataSets[0];

            const token: string = await (new DemographicService(this.store.dispatch, this.store.getState))
                .getOneTimeToken(touchstoneId, demographicDataSet.source, demographicDataSet.id,'long', 'female');

            const decoded = jwt_decode(token);

            expect(decoded.action).to.equal("demography");
            const payload = QueryString.parse(decoded.payload);
            expect(payload).to.eql({
                ":touchstone-id": touchstoneId,
                ":source-code": demographicDataSet.source,
                ":type-code": demographicDataSet.id
            });
        });

        it("fetches one time estimates token", async () => {

            await returnBurdenEstimateSetPromise(this.db);

            const responsibilities: Responsibilities = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .getResponsibilities(groupId, touchstoneId);

            const estimatesSet = responsibilities.responsibilities[0].current_estimate_set;

            const token: string = await (new EstimatesService(this.store.dispatch, this.store.getState))
                .getOneTimeToken(groupId, touchstoneId, scenarioId, estimatesSet.id);

            const decoded = jwt_decode(token);
            expect(decoded.action).to.equal("burdens-populate");
            const payload = QueryString.parse(decoded.payload);
            expect(payload).to.eql({
                ":group-id": groupId,
                ":touchstone-id": touchstoneId,
                ":scenario-id": scenarioId,
                ":set-id": String(estimatesSet.id)
            });
        });

        it("fetches one time estimates token with redirect url", async () => {

            await returnBurdenEstimateSetPromise(this.db);

            const responsibilities: Responsibilities = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .getResponsibilities(groupId, touchstoneId);

            const estimatesSet = responsibilities.responsibilities[0].current_estimate_set;

            const redirectPath = appSettings.publicPath + '/test';
            const queryString = helpers.buildRedirectUrl(redirectPath);

            const token: string = await (new EstimatesService(this.store.dispatch, this.store.getState))
                .getOneTimeToken(groupId, touchstoneId, scenarioId, estimatesSet.id, queryString);

            const decoded = jwt_decode(token);

            const query = QueryString.parse(decoded.query);
            expect(query.redirectUrl).to.equal("http://localhost:5000/contribution/test");

            expect(decoded.action).to.equal("burdens-populate");
            const payload = QueryString.parse(decoded.payload);
            expect(payload).to.eql({
                ":group-id": groupId,
                ":touchstone-id": touchstoneId,
                ":scenario-id": scenarioId,
                ":set-id": String(estimatesSet.id)
            });
        });

        function returnBurdenEstimateSetPromise(db: Client): Promise<any> {
            let responsibilityIds: ResponsibilityIds = null;
            return addResponsibilities(db)
                .then(responsibilityIdsResult => {responsibilityIds = responsibilityIdsResult; return addModel(db)})
                .then(modelVersionId => addBurdenEstimateSet(db, responsibilityIds.responsibility, modelVersionId))
                .then(setId => updateCurrentBurdenEstimateSet(db, responsibilityIds.responsibility, setId));
        }



        it("fetches model run parameter sets", async () => {
            await addModelRunParameterSets(this.db);

            const runParametersSets: ModelRunParameterSet[] = await (new RunParametersService(this.store.dispatch, this.store.getState))
                .getParameterSets(groupId, touchstoneId);

            const expectedSet = [
                {
                    id: 1,
                    model: "model-1",
                    disease: "yf",
                    uploaded_on: '2017-12-25T12:00:00Z',
                    uploaded_by: 'test.user'
                }
            ];
            expect(runParametersSets).to.eql(expectedSet);
        });


        it("fetches one time model run parameter sets token", async () => {
            await addModelRunParameterSets(this.db);

            const sets: ModelRunParameterSet[] = await (new RunParametersService(this.store.dispatch, this.store.getState))
                .getParameterSets(groupId, touchstoneId);

            const token: string = await (new RunParametersService(this.store.dispatch, this.store.getState))
                .getOneTimeToken(groupId, touchstoneId, sets[0].id);

            const decoded = jwt_decode(token);
            expect(decoded.action).to.equal("model-run-parameters");
            const payload = QueryString.parse(decoded.payload);
            expect(payload).to.eql({
                ":group-id": groupId,
                ":touchstone-id": touchstoneId,
                ":model-run-parameter-set-id": String(sets[0].id)
            });
        });

        it("creates burden estimates set", async () => {
            await addResponsibilities(this.db);
            await addModel(this.db);

            const data = {
                type: {
                    type: "central-averaged",
                    details: "details"
                }
            } as EstimatesCreateBurdenData;

            const responsibilitiesInitial: Responsibilities = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .getResponsibilities(groupId, touchstoneId);

            expect(responsibilitiesInitial.responsibilities[0].current_estimate_set).to.equal(null);

            await (new EstimatesService(this.store.dispatch, this.store.getState))
                .createBurden(groupId, touchstoneId, scenarioId, data);

            const responsibilities: Responsibilities = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .setOptions({noCache: true}).getResponsibilities(groupId, touchstoneId);

            const estimateSet = responsibilities.responsibilities[0].current_estimate_set;
            expect(estimateSet.type).to.eql(data.type);
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