import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import {
    mockDisease, mockModellingGroup,
    mockResponsibility, mockResponsibilitySetWithExpectations,
    mockScenario, mockTouchstoneVersion
} from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    UploadBurdenEstimatesContent,
    UploadBurdenEstimatesContentComponent
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesContent";

import {CurrentEstimateSetSummary} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {UploadBurdenEstimatesForm} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {TemplateLink} from "../../../../../main/contrib/components/Responsibilities/Overview/List/OldStyleTemplates/TemplateLink";

describe("Upload Burden Estimates Content Component tests", () => {

    const testGroup = mockModellingGroup();
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstoneVersion();
    const testScenario = mockScenario({disease: testDisease.id, touchstones: [testTouchstone]});
    const testResponsibility = mockResponsibility({scenario: testScenario});
    const testResponsibilitySet = mockResponsibilitySetWithExpectations({responsibilities: [testResponsibility], touchstone: testTouchstone.id});

    const testState = {
        groups: {currentUserGroup: testGroup},
        touchstones: {currentTouchstoneVersion: testTouchstone},
        responsibilities: {currentResponsibility: testResponsibility, responsibilitiesSet: testResponsibilitySet},
        estimates: {token: "test-token"},
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level and receives proper props", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}});
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().scenario).to.eql(testScenario);
        expect(rendered.props().group).to.eql(testGroup);
        expect(rendered.props().responsibilitySetStatus).to.eql(testResponsibilitySet.status);
        expect(rendered.props().token).to.eql("test-token");
        expect(rendered.props().responsibility).to.eql(testResponsibility);
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive();
        expect(rendered.find(UploadBurdenEstimatesContentComponent).length).to.eql(1);
    });

    it("renders on branch level, not passes", () => {
        store = createMockStore({...testState, responsibilities: {...testState.responsibilities, currentResponsibility: null}});
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on component level touchstone, scenario ", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const firstTable = rendered.find('table.specialColumn').at(0);
        expect(firstTable.find('tr').at(0).find('td').at(1).text(), testTouchstone.description);
        expect(firstTable.find('tr').at(1).find('td').at(1).text(), testScenario.description);
    });

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

    it("renders on component level, passes right params to CurrentEstimateSetSummary", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const currentEstimateSetSummary = rendered.find(CurrentEstimateSetSummary);
        expect(currentEstimateSetSummary.length).to.equal(1);
        expect(currentEstimateSetSummary.props().estimateSet).to.equal(null);
        expect(currentEstimateSetSummary.props().canUpload).to.equal(true);
    });

    it("renders on component level, passes right params to UploadBurdenEstimatesForm", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const uploadBurdenEstimatesForm = rendered.find(UploadBurdenEstimatesForm);
        expect(uploadBurdenEstimatesForm.length).to.equal(1);
        expect(uploadBurdenEstimatesForm.props().canUpload).to.equal(false);
        expect(uploadBurdenEstimatesForm.props().canCreate).to.equal(true);
        expect(uploadBurdenEstimatesForm.props().groupId).to.equal(testGroup.id);
        expect(uploadBurdenEstimatesForm.props().estimatesToken).to.equal("test-token");
        expect(uploadBurdenEstimatesForm.props().scenarioId).to.equal(testScenario.id);
    });
});