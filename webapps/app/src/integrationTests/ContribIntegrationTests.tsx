import * as React from "react";
import {expect} from "chai"
import {Client, QueryResult} from "pg";
import {createMemoryHistory} from 'history';

import {
    CoverageSet, CreateBurdenEstimateSet, DemographicDataset,
    Disease, ErrorInfo,
    ModellingGroup, ModelRunParameterSet,
    ResponsibilitySetWithExpectations,
    Result, ScenarioTouchstoneAndCoverageSets, Touchstone,
} from "../main/shared/models/Generated";
import {IntegrationTestSuite, TestService, ResponsibilityIds, addResponsibilities, addGroups,
        addCoverageSetsForGroup, addCoverageData, addTouchstone} from "./IntegrationTest";
import * as enzyme from "enzyme";
import {shallow} from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";

import {createContribStore} from "../main/contrib/createStore";
import {Sandbox} from "../test/Sandbox";
import {DownloadCoverageContentComponent} from "../main/contrib/components/Responsibilities/Coverage/DownloadCoverageContent";
import {mockModellingGroup, mockScenario, mockTouchstoneVersion} from "../test/mocks/mockModels";
import {FileDownloadButton} from "../main/shared/components/FileDownloadLink";
import {DownloadDemographicsContentComponent} from "../main/shared/components/Demographics/DownloadDemographicsContent";
import {RunParametersService} from "../main/contrib/services/RunParametersService";
import {DiseasesService} from "../main/shared/services/DiseasesService";
import {UserService} from "../main/contrib/services/UserService";
import {ModellingGroupsService} from "../main/shared/services/ModellingGroupsService";
import {TouchstonesService} from "../main/shared/services/TouchstonesService";
import {ResponsibilitiesService} from "../main/contrib/services/ResponsibilitiesService";
import {CoverageService} from "../main/contrib/services/CoverageService";
import {DemographicService} from "../main/shared/services/DemographicService";
import {EstimatesService} from "../main/contrib/services/EstimatesService";
import {ILookup} from "../main/shared/models/Lookup";
import {DataPoint} from "../main/contrib/reducers/estimatesReducer";

enzyme.configure({adapter: new Adapter()});

const FormData = require('form-data');
const touchstoneVersionId = "test-1";
const groupId = "test-group"; // This group must match the one the logged in user belongs to
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

    addTestsToMocha() {

        const sandbox = new Sandbox();

        afterEach(() => sandbox.restore());

        it("can upload model run parameter sets", async () => {
            await addResponsibilities(this.db, scenarioId, touchstoneVersionId, groupId);
            await addModel(this.db);

            const form = new FormData();
            form.append('disease', 'yf');

            const uploadResult: Result = await (new RunParametersService(this.store.dispatch, this.store.getState))
                .uploadSet(groupId, touchstoneVersionId, form);

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

        it("fetches all modelling groups", async () => {
            await addGroups(this.db, groupId);

            const fetchedGroupsResult: ModellingGroup[] = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getAllGroups();

            expect(fetchedGroupsResult).to.eql([
                {id: groupId, description: "Group 1"},
                {id: "Fake", description: "Group 2"}
            ]);
        });

        it("fetches user modelling groups", async () => {
            await addGroups(this.db, groupId);

            await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .addMember(groupId, "test.user");

            const fetchedGroupsResult: ModellingGroup[] = await (new ModellingGroupsService(this.store.dispatch, this.store.getState))
                .getUserGroups();

            expect(fetchedGroupsResult).to.eql([
                {id: groupId, description: "Group 1"}
            ]);
        });

        it("fetches touchstones", async () => {
            await addResponsibilities(this.db, scenarioId, touchstoneVersionId, groupId);

            const fetchedTouchstonesResult: Touchstone[] = await (new TouchstonesService(this.store.dispatch, this.store.getState))
                .getTouchstonesByGroupId(groupId);

            const touchstone: Touchstone = {
                id: "test",
                description: "Testing",
                comment: "comment",
                versions: [{
                    id: touchstoneVersionId,
                    name: "test",
                    version: 1,
                    description: "Testing version 1",
                    status: "open"
                }]
            };
            expect(fetchedTouchstonesResult).to.eql([touchstone]);
        });

        it("fetches responsibilities", async () => {
            const responsibilityIds = await addResponsibilities(this.db, scenarioId, touchstoneVersionId, groupId);
            const modelVersionId = await addModel(this.db);
            await addBurdenEstimateSet(this.db, responsibilityIds.responsibility, modelVersionId);

            const responsibilities: ResponsibilitySetWithExpectations = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .getResponsibilities(groupId, touchstoneVersionId);

            expect(responsibilities).to.eql(expectedResponsibilitiesResponse());
        });

        it("fetches coverage sets", async () => {
            const coverageSetId: number = await addCoverageSetsForGroup(this.db, scenarioId, touchstoneVersionId, groupId);

            const coverageSets: ScenarioTouchstoneAndCoverageSets = await (new CoverageService(this.store.dispatch, this.store.getState))
                .getDataSets(groupId, touchstoneVersionId, scenarioId);

            const expectedCoverageSets: ScenarioTouchstoneAndCoverageSets = {
                scenario: {
                    id: scenarioId,
                    description: "Yellow Fever scenario",
                    disease: "yf",
                    touchstones: [touchstoneVersionId]
                },
                touchstone_version: {
                    id: touchstoneVersionId,
                    name: "test",
                    version: 1,
                    description: "Testing version 1",
                    status: "open"
                },
                coverage_sets: [
                    {
                        id: coverageSetId,
                        name: "Test set",
                        touchstone_version: touchstoneVersionId,
                        activity_type: "none",
                        vaccine: "yf",
                        gavi_support: "no vaccine"
                    }
                ]
            };
            expect(coverageSets).to.eql(expectedCoverageSets);
        });

        it("fetches demographic data sets", async () => {
            await addDemographicDataSets(this.db);

            const demographicDataSets: DemographicDataset[] = await (new DemographicService(this.store.dispatch, this.store.getState))
                .getDataSetsByTouchstoneVersionId(touchstoneVersionId);

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

        it("fetches model run parameter sets", async () => {
            await addModelRunParameterSets(this.db);

            const runParametersSets: ModelRunParameterSet[] = await (new RunParametersService(this.store.dispatch, this.store.getState))
                .getParameterSets(groupId, touchstoneVersionId);

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

        it("creates burden estimates set", async () => {
            await addResponsibilities(this.db, scenarioId, touchstoneVersionId, groupId);
            await addModel(this.db);

            const data = {
                type: {
                    type: "central-averaged",
                    details: "details"
                }
            } as CreateBurdenEstimateSet;

            const responsibilitiesInitial: ResponsibilitySetWithExpectations = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .getResponsibilities(groupId, touchstoneVersionId);

            expect(responsibilitiesInitial.responsibilities[0].current_estimate_set).to.equal(null);

            await (new EstimatesService(this.store.dispatch, this.store.getState))
                .createBurden(groupId, touchstoneVersionId, scenarioId, data);

            const responsibilities: ResponsibilitySetWithExpectations = await (new ResponsibilitiesService(this.store.dispatch, this.store.getState))
                .setOptions({noCache: true}).getResponsibilities(groupId, touchstoneVersionId);

            const estimateSet = responsibilities.responsibilities[0].current_estimate_set;
            expect(estimateSet.type).to.eql(data.type);
        });

        it("can download coverage data", async () => {
            const coverageSetId = await addCoverageSetsForGroup(this.db, scenarioId, touchstoneVersionId, groupId);
            await addCoverageData(this.db, coverageSetId);

            const mockCoverageSets: CoverageSet[] = [
                {
                    id: coverageSetId,
                    name: "Test set",
                    touchstone_version: touchstoneVersionId,
                    activity_type: "none",
                    vaccine: "yf",
                    gavi_support: "no vaccine"
                }
            ];

            const rendered = shallow(<DownloadCoverageContentComponent
                touchstone={mockTouchstoneVersion({id: touchstoneVersionId})}
                coverageSets={mockCoverageSets}
                group={mockModellingGroup({id: groupId})}
                scenario={mockScenario({id: scenarioId})}
                selectedFormat={"long"}
                setFormat={() => {
                }}/>);

            const href = rendered.find(FileDownloadButton).prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).to.equal(200);
            const result = await response.text();

            // we expect no rows, because there are no expectations for this responsibility
            expect(result).to.eq("scenario,set_name,vaccine,gavi_support,activity_type,country_code,country,year,age_first,age_last,age_range_verbatim,target,coverage\n")
        });

        it("can download coverage data for all countries", async () => {
            const coverageSetId = await addCoverageSetsForGroup(this.db, scenarioId, touchstoneVersionId, groupId);
            await addCoverageData(this.db, coverageSetId);

            const mockCoverageSets: CoverageSet[] = [
                {
                    id: coverageSetId,
                    name: "Test set",
                    touchstone_version: touchstoneVersionId,
                    activity_type: "none",
                    vaccine: "yf",
                    gavi_support: "no vaccine"
                }
            ];

            const rendered = shallow(<DownloadCoverageContentComponent
                touchstone={mockTouchstoneVersion({id: touchstoneVersionId})}
                coverageSets={mockCoverageSets}
                group={mockModellingGroup({id: groupId})}
                scenario={mockScenario({id: scenarioId})}
                selectedFormat={"long"}
                setFormat={() => {
                }}/>);

            rendered.find("#filter-countries").simulate("change");

            const href = rendered.find(FileDownloadButton).prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).to.equal(200);
            const result = await response.text();

            // we expect one row for the country ATL, even though there are no expectations for this responsibility
            expect(result).to.eq("scenario,set_name,vaccine,gavi_support,activity_type,country_code,country,year,age_first,age_last,age_range_verbatim,target,coverage\n" +
                "yf-1,Test set,yf,no vaccine,none,ATL,Atlantis,1970,1,2,1-2,1000,1000\n")
        });

        it("can download demographic data", async () => {
            await addDemographicDataSets(this.db);

            const mockDataSets = [{
                id: "statistic",
                name: "Some statistic",
                gender_is_applicable: false,
                source: "source"
            }];

            const rendered = shallow(<DownloadDemographicsContentComponent
                touchstone={mockTouchstoneVersion({id: touchstoneVersionId})}
                dataSets={mockDataSets}
                selectedFormat={"long"}
                selectedDataSet={mockDataSets[0]}
                selectedGender={"F"}
            />);


            const href = rendered.find(FileDownloadButton).prop("href");

            const response = await new TestService(this.store.dispatch, this.store.getState)
                .getAnyUrl(href);

            expect(response.status).to.equal(200)
        });

        it("can get burden estimates", async () => {
            const responsibilityIds = await addResponsibilities(this.db, scenarioId, touchstoneVersionId, groupId);
            const modelVersionId = await addModel(this.db);
            const setId = await addBurdenEstimateSet(this.db, responsibilityIds.responsibility, modelVersionId);

            const value = 32156;
            await addBurdenEstimate(this.db, setId, value);
            const response: ILookup<DataPoint[]> = await (new EstimatesService(this.store.dispatch, this.store.getState))
                .getEstimates(groupId, touchstoneVersionId, scenarioId, setId, "cases");
            expect(response).to.eql({"1": [{"x": 2000, "y": value}]});
        });

        it("can get burden estimate upload token", async () => {
            const responsibilityIds = await addResponsibilities(this.db, scenarioId, touchstoneVersionId, groupId);
            const modelVersionId = await addModel(this.db);
            const setId = await addBurdenEstimateSet(this.db, responsibilityIds.responsibility, modelVersionId);

            const value = 32156;
            await addBurdenEstimate(this.db, setId, value);

            const response: String = await (new EstimatesService(this.store.dispatch, this.store.getState))
                .getUploadToken(groupId, touchstoneVersionId, scenarioId, setId);

            expect(response.length).to.be.greaterThan(1)
        });

        it("can populate estimates from file", async () => {
            const responsibilityIds = await addResponsibilities(this.db, scenarioId, touchstoneVersionId, groupId);
            const modelVersionId = await addModel(this.db);
            const setId = await addBurdenEstimateSet(this.db, responsibilityIds.responsibility, modelVersionId);

            const value = 32156;
            await addBurdenEstimate(this.db, setId, value);

            const response = await (new EstimatesService(this.store.dispatch, this.store.getState))
                .populateEstimatesFromFile(groupId, touchstoneVersionId, scenarioId, setId, "TOKEN") as Result;

            // this will error as not a real token, but that's fine, we just want to verify that we have the correct
            // endpoint here
            expect(response.errors[0].code).to.eq("unknown-upload-token");
        });

    }
}

new ContributionPortalIntegrationTests();

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


function addBurdenEstimate(db: Client, setId: number, value: number){
    return db.query("INSERT INTO country (id, name, nid) VALUES ('XYZ', 'fake-country', 1111)")
        .then(() => db.query("SELECT id from burden_outcome where code = 'cases'"))
        .then(result => db.query(`INSERT INTO burden_estimate (burden_estimate_set, country, year, burden_outcome, value, age)
        VALUES ('${setId}', 1111, 2000, ${result.rows[0].id}, ${value}, 1);
    `))
}

function addDemographicDataSets(db: Client): Promise<QueryResult> {
    return addTouchstone(db, touchstoneVersionId)
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
                VALUES ('${touchstoneVersionId}', dataset_id);
                
                INSERT INTO touchstone_country (touchstone, country, disease)
                VALUES ('${touchstoneVersionId}', 'ATL', 'yf');
                
                INSERT INTO demographic_statistic 
                (demographic_source, country, year, age_from, age_to, demographic_statistic_type, demographic_variant,    gender, value)
                VALUES
                (         source_id,   'ATL', 2017,       20,     25,                    type_id,          variant_id, gender_id,  8765);                
            END $$;
        `));
}

function addModelRunParameterSets(db: Client): Promise<QueryResult> {
    return addResponsibilities(db, scenarioId, touchstoneVersionId, groupId)
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

function expectedResponsibilitiesResponse(): ResponsibilitySetWithExpectations {
    return {
        status: "incomplete",
        touchstone_version: touchstoneVersionId,
        modelling_group_id: groupId,
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
        expectations: []
    };
}