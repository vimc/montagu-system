import * as React from "react";
import {expect} from "chai";
import {mount, shallow} from "enzyme";
import {
    mockBurdenEstimateSet,
    mockDisease,
    mockExpectationMapping,
    mockExpectations,
    mockModellingGroup,
    mockResponsibility,
    mockResponsibilitySetWithExpectations,
    mockScenario,
    mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import {mockContribState, RecursivePartial} from "../../../../mocks/mockStates";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {Sandbox} from "../../../../Sandbox";
import {createMockContribStore} from "../../../../mocks/mockStore";
import {DiagnosticSection} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/DiagnosticSection";
import {ScenarioChart} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/ScenarioChart";
import {estimatesActionCreators} from "../../../../../main/contrib/actions/estimatesActionCreators";
import {BurdenOutcome, EstimateTypes} from "../../../../../main/contrib/actionTypes/EstimateTypes";
import {estimatesInitialState} from "../../../../../main/contrib/reducers/estimatesReducer";
import {MockStore} from "redux-mock-store";
import {EstimatesService} from "../../../../../main/contrib/services/EstimatesService";

describe("Diagnostic section", () => {

    const testGroup = mockModellingGroup();
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstoneVersion();
    const testScenario = mockScenario({disease: testDisease.id, touchstones: [testTouchstone.id]});
    const testEstimateSet = mockBurdenEstimateSet();
    const testResponsibility = mockResponsibility({scenario: testScenario, current_estimate_set: testEstimateSet});
    const testExpectations = mockExpectations({
        ages: {minimum_inclusive: 0, maximum_inclusive: 50},
        years: {minimum_inclusive: 1980, maximum_inclusive: 2001}
    });
    const testResponsibilitySet = mockResponsibilitySetWithExpectations({
        responsibilities: [testResponsibility],
        touchstone_version: testTouchstone.id,
        expectations: [mockExpectationMapping(testExpectations, [testScenario.id]), mockExpectationMapping()]
    });

    const testState: RecursivePartial<ContribAppState> = mockContribState({
        groups: {currentUserGroup: testGroup},
        touchstones: {currentTouchstoneVersion: testTouchstone},
        responsibilities: {
            currentResponsibility: testResponsibility,
            responsibilitiesSet: testResponsibilitySet,
        },
    });

    let store: MockStore<ContribAppState>;

    const sandbox = new Sandbox();

    beforeEach(() => {
        store = createMockContribStore(testState);
        sandbox.setStubFunc(EstimatesService.prototype, "getEstimates", () => {
            return Promise.resolve("TEST");
        });
    });

    afterEach(() => sandbox.restore());

    it("passes props to chart", () => {

        const rendered = shallow(<DiagnosticSection scenarioId={testScenario.id}
                                                    setId={testEstimateSet.id}/>, {context: {store}})
            .dive()
            .dive();

        const chartProps = rendered.find(ScenarioChart).props();
        expect(chartProps.ages).to.eq(testExpectations.ages);
        expect(chartProps.years).to.eq(testExpectations.years);
        expect(chartProps.setId).to.eq(testEstimateSet.id);
        expect(chartProps.scenarioId).to.eq(testScenario.id);
        expect(chartProps.outcome).to.eq(BurdenOutcome.DEATHS);
    });

    it("sets data to cases for scenario if chart type is cases", () => {

        const data = {} as any;
        data[testEstimateSet.id] = "TEST_DATA";
        const state: RecursivePartial<ContribAppState> = {
            ...testState,
            estimates: {...estimatesInitialState, chartType: BurdenOutcome.CASES, cases: data},
        };
        store = createMockContribStore(state);
        const rendered = shallow(<DiagnosticSection scenarioId={testScenario.id}
                                                    setId={testEstimateSet.id}/>, {context: {store}})
            .dive()
            .dive();

        const chartProps = rendered.find(ScenarioChart).props();
        expect(chartProps.data).to.eq("TEST_DATA");
    });

    it("sets data to deaths for scenario if chart type is deaths", () => {

        const data = {} as any;
        data[testEstimateSet.id] = "TEST_DATA";
        const state: RecursivePartial<ContribAppState> = {
            ...testState,
            estimates: {...estimatesInitialState, deaths: data},
        };
        store = createMockContribStore(state);
        const rendered = shallow(<DiagnosticSection scenarioId={testScenario.id}
                                                    setId={testEstimateSet.id}/>, {context: {store}})
            .dive()
            .dive();

        const chartProps = rendered.find(ScenarioChart).props();
        expect(chartProps.data).to.eq("TEST_DATA");
    });

    it("sets data to dalys for scenario if chart type is dalys", () => {

        const data = {} as any;
        data[testEstimateSet.id] = "TEST_DATA";
        const state: RecursivePartial<ContribAppState> = {
            ...testState,
            estimates: {...estimatesInitialState, chartType: BurdenOutcome.DALYS, dalys: data},
        };
        store = createMockContribStore(state);
        const rendered = shallow(<DiagnosticSection scenarioId={testScenario.id}
                                                    setId={testEstimateSet.id}/>, {context: {store}})
            .dive()
            .dive();

        const chartProps = rendered.find(ScenarioChart).props();
        expect(chartProps.data).to.eq("TEST_DATA");
    });

    it("fetches data on mount", () => {

        const getEstimatesStub = sandbox.setStubReduxAction(estimatesActionCreators, "getEstimates");
        mount(<DiagnosticSection scenarioId={testScenario.id}
                                 setId={testEstimateSet.id}/>, {context: {store}});

        expect(getEstimatesStub.calledWith(BurdenOutcome.DEATHS, testScenario.id, testEstimateSet.id)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.DALYS, testScenario.id, testEstimateSet.id)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.CASES, testScenario.id, testEstimateSet.id)).to.be.true;
    });

    it("fetches data when setId or scenarioId is updated", () => {

        const store = createMockContribStore({...testState, responsibilities: {}});
        const getEstimatesStub = sandbox.setStubReduxAction(estimatesActionCreators, "getEstimates");
        const rendered = mount(<DiagnosticSection scenarioId={testScenario.id}
                                                  setId={testEstimateSet.id}/>, {context: {store}});

        expect(getEstimatesStub.calledWith(BurdenOutcome.DEATHS, testScenario.id, testEstimateSet.id)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.DALYS, testScenario.id, testEstimateSet.id)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.CASES, testScenario.id, testEstimateSet.id)).to.be.true;

        rendered.setProps({setId: 123});
        expect(getEstimatesStub.calledWith(BurdenOutcome.DEATHS, testScenario.id, 123)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.DALYS, testScenario.id, 123)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.CASES, testScenario.id, 123)).to.be.true;

        rendered.setProps({scenarioId: 456});
        expect(getEstimatesStub.calledWith(BurdenOutcome.DEATHS, 456, 123)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.DALYS, 456, 123)).to.be.true;
        expect(getEstimatesStub.calledWith(BurdenOutcome.CASES, 456, 123)).to.be.true;

    });

    it("sets chart type", () => {

        const rendered = shallow(<DiagnosticSection scenarioId={testScenario.id}
                                                    setId={testEstimateSet.id}/>, {context: {store}}).dive().dive();

        const outcomeDropDown = rendered.find("#outcome");
        const options = outcomeDropDown.find("option");
        expect(options).to.have.lengthOf(3);
        expect(options.at(0).prop("value")).to.eq("deaths");
        expect(options.at(1).prop("value")).to.eq("cases");
        expect(options.at(2).prop("value")).to.eq("dalys");

        outcomeDropDown.simulate("change", {target: {value: "cases"}});

        const actions = store.getActions();
        expect(actions).to.have.deep.members([{type: EstimateTypes.SET_CHART_TYPE, data: BurdenOutcome.CASES}]);
    })

});