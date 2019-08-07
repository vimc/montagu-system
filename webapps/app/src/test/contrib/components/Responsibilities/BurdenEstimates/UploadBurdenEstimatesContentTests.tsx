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
    UploadBurdenEstimatesContentComponent,
    UploadBurdenEstimatesContentProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesContent";

import {
    CurrentEstimateSetSummary,
    CurrentEstimateSetSummaryProps
} from "../../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {RecursivePartial} from "../../../../mocks/mockStates";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";
import {DiagnosticSection} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/DiagnosticSection";
import {
    UploadEstimatesForm,
    UploadEstimatesPublicProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";

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
            canUpload: true
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

    it("renders touchstone and scenario message", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const subheading = rendered.find("h5").at(0);
        expect(subheading.find('span').at(0).text(), testTouchstone.description);
        expect(subheading.find('span').at(1).text(), testScenario.description);
    });

    it("renders link to template download page", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const link = rendered.find(InternalLink);
        expect(link.prop("href")).to.eql(`/${testGroup.id}/responsibilities/${testTouchstone.id}/templates/`);
    });

    it("renders diagnostic section if latest burden estimate set exists and is populated", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const section = rendered.find(DiagnosticSection);
        expect(section).to.have.lengthOf(1);
    });

    it("does not render diagnostic section if no latest burden estimate set", () => {
        store = createMockContribStore({
            ...testState,
            responsibilities: {
                ...testState.responsibilities, currentResponsibility: {
                    ...testResponsibility,
                    current_estimate_set: null
                }
            }
        });

        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const section = rendered.find(DiagnosticSection);
        expect(section).to.have.lengthOf(0);
    });

    it("does not render diagnostic section if latest burden estimate set is empty", () => {
        store = createMockContribStore({
            ...testState,
            responsibilities: {
                ...testState.responsibilities, currentResponsibility: {
                    ...testResponsibility,
                    current_estimate_set: {...testResponsibility.current_estimate_set, status: "empty"}
                }
            }
        });

        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const section = rendered.find(DiagnosticSection);
        expect(section).to.have.lengthOf(0);
    });

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

    it("renders UploadEstimatesForm if canUpload is true", () => {
        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const uploadBurdenEstimatesForm = rendered.find(UploadEstimatesForm);
        expect(uploadBurdenEstimatesForm.length).to.equal(1);

        const expected: Partial<UploadEstimatesPublicProps> = {
            groupId: testGroup.id,
            scenarioId: testScenario.id,
            touchstoneId: testTouchstone.id
        };
        expect(uploadBurdenEstimatesForm.props()).to.eql(expected);
    });

    it("does not render UploadEstimatesForm if canUpload is false", () => {

        store = createMockStore({
            ...testState,
            responsibilities: {...testState.responsibilities, currentResponsibility: null}
        });

        const rendered = shallow(<UploadBurdenEstimatesContent/>, {context: {store}}).dive().dive();
        const uploadBurdenEstimatesForm = rendered.find(UploadEstimatesForm);
        expect(uploadBurdenEstimatesForm.length).to.equal(0);

    });
});