

import {Sandbox} from "../../Sandbox";
import {demographicActionCreators} from "../../../main/shared/actions/demographicActionCreators";
import {DemographicService} from "../../../main/shared/services/DemographicService";
import {createMockContribStore} from "../../mocks/mockStore";
import {mockDemographicDataset} from "../../mocks/mockModels";
import {DemographicTypes} from "../../../main/shared/actionTypes/DemographicTypes";
import {DemographicDataset} from "../../../main/shared/models/Generated";

describe("Demographic actions tests", () => {
    const sandbox = new Sandbox();

    const testDemographicDataSet = mockDemographicDataset({id: "set-1", source: "source-1"});

    afterEach(() => {
        sandbox.restore();
    });

    it("resets selected data set and sets fetched sets", (done) => {
        const store = createMockContribStore({});
        sandbox.setStubFunc(DemographicService.prototype, "getDataSetsByTouchstoneVersionId", () => {
            return Promise.resolve([testDemographicDataSet]);
        });
        store.dispatch(demographicActionCreators.getDataSets('touchstone-1'));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayloads = [
                {
                    type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
                    data: null as DemographicDataset
                },
                {
                    type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
                    data: [testDemographicDataSet]
                }
            ];
            expect(actions).toEqual(expectedPayloads);
            done();
        });
    });

    it("set data set by id using previously loaded sets", (done) => {
        const store = createMockContribStore({demographics: {dataSets: [testDemographicDataSet]}});
        store.dispatch(demographicActionCreators.setDataSet('set-1'))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET, data: testDemographicDataSet}
            expect(actions).toEqual([expectedPayload])
            done();
        });
    });

    it("can set data set to null", (done) => {
        const store = createMockContribStore({demographics: {dataSets: [testDemographicDataSet]}});
        store.dispatch(demographicActionCreators.setDataSet(null))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET, data: null as DemographicDataset}
            expect(actions).toEqual([expectedPayload])
            done();
        });
    });

    it("set gender", (done) => {
        const store = createMockContribStore({});
        store.dispatch(demographicActionCreators.setGender('male'))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: DemographicTypes.DEMOGRAPHIC_SET_GENDER, data: 'male'}
            expect(actions).toEqual([expectedPayload])
            done();
        });
    });

    it("sets format", (done) => {
        const store = createMockContribStore({});
        store.dispatch(demographicActionCreators.setFormat('long'))
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = {type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT, data: 'long'}
            expect(actions).toEqual([expectedPayload])
            done();
        });
    });
});