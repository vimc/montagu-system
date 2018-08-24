import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Store} from "redux";

import "../../../../helper";
import {
    mockBurdenEstimateSet,
    mockDisease,
    mockModellingGroup,
    mockResponsibility,
    mockResponsibilitySetWithExpectations,
    mockScenario,
    mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import {Sandbox} from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    UploadBurdenEstimatesContent,
    UploadBurdenEstimatesContentComponent, UploadBurdenEstimatesContentProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesContent";

import {
    CurrentEstimateSetSummary,
    CurrentEstimateSetSummaryProps
} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {
    UploadBurdenEstimatesForm,
    UploadBurdenEstimatesFormComponentProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {TemplateLink} from "../../../../../main/contrib/components/Responsibilities/Overview/List/OldStyleTemplates/TemplateLink";
import {RecursivePartial} from "../../../../mocks/mockStates";
import {settings} from "../../../../../main/shared/Settings";

describe("UploadBurdenEstimatesContent", () => {

    const testGroup = mockModellingGroup();
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstoneVersion();
    const testScenario = mockScenario({disease: testDisease.id, touchstones: [testTouchstone.id]});
    const testEstimateSet = mockBurdenEstimateSet();
    const testResponsibility = mockResponsibility({scenario: testScenario, current_estimate_set: testEstimateSet});
    const testResponsibilitySet = mockResponsibilitySetWithExpectations({
        responsibilities: [testResponsibility],
        touchstone_version: testTouchstone.id
    });

    const testState: RecursivePartial<ContribAppState> = {
        groups: {currentUserGroup: testGroup},
        touchstones: {currentTouchstoneVersion: testTouchstone},
        responsibilities: {
            currentResponsibility: testResponsibility,
            responsibilitiesSet: testResponsibilitySet,
        },
    };

    let store: Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level and receives proper props", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}});
        const expectedProps: UploadBurdenEstimatesContentProps = {
            touchstone: testTouchstone,
            scenario: testScenario,
            group: testGroup,
            responsibilitySetStatus: testResponsibilitySet.status,
            responsibility: testResponsibility,
            canCreate: true,
            canUpload: false
        };
        expect(rendered.props()).to.eql(expectedProps)
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive();
        expect(rendered.find(UploadBurdenEstimatesContentComponent).length).to.eql(1);
    });

    it("renders on branch level, not passes", () => {
        store = createMockStore({
            ...testState,
            responsibilities: {...testState.responsibilities, currentResponsibility: null}
        });
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on component level touchstone, scenario ", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const firstTable = rendered.find('table.specialColumn').at(0);
        expect(firstTable.find('tr').at(0).find('td').at(1).text(), testTouchstone.description);
        expect(firstTable.find('tr').at(1).find('td').at(1).text(), testScenario.description);
    });

    if (settings.showOldTemplates) {
        it("renders on component level, passes props to TemplateLink component", () => {
            const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
            const firstTable = rendered.find('table.specialColumn').at(0);
            const burdEstimatesTemplatesCell = firstTable.find('tr').at(2).find('td').at(1);
            const burdenEstimatesTemplates = burdEstimatesTemplatesCell.find(TemplateLink);
            const burdenEstimatesTemplatesProps = burdenEstimatesTemplates.props();
            expect(burdenEstimatesTemplatesProps.diseaseId).to.eql(testDisease.id);
            expect(burdenEstimatesTemplatesProps.groupId).to.eql(testGroup.id);
            expect(burdenEstimatesTemplatesProps.touchstoneId).to.eql(testTouchstone.id);
        });
    }

    it("renders on component level, passes right params to CurrentEstimateSetSummary", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const currentEstimateSetSummary = rendered.find(CurrentEstimateSetSummary);
        const expectedProps: CurrentEstimateSetSummaryProps = {
            canUpload: true,
            estimateSet: testEstimateSet
        };
        expect(currentEstimateSetSummary.length).to.equal(1);
        expect(currentEstimateSetSummary.props()).to.eql(expectedProps);
    });

    it("renders on component level, passes right params to UploadBurdenEstimatesForm", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const uploadBurdenEstimatesForm = rendered.find(UploadBurdenEstimatesForm);
        expect(uploadBurdenEstimatesForm.length).to.equal(1);
        const expected: UploadBurdenEstimatesFormComponentProps = {
            canCreate: true,
            canUpload: false,
            estimateSet: testEstimateSet,
            groupId: testGroup.id,
            scenarioId: testScenario.id,
            touchstoneId: testTouchstone.id
        };
        expect(uploadBurdenEstimatesForm.props()).to.eql(expected);
    });
});