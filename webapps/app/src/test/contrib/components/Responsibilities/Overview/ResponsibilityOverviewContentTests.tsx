import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import {mockExtendedResponsibilitySet, mockModellingGroup} from "../../../../mocks/mockModels";
import { mockContribState } from "../../../../mocks/mockStates";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    ResponsibilityOverviewContentComponent, ResponsibilityOverviewContent,
    ResponsibilityOverviewContentProps, mapStateToProps
} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";
import {ResponsibilitySetStatusMessage} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilitySetStatusMessage";
import {ResponsibilityList} from "../../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityList";
import {ButtonLink} from "../../../../../main/shared/components/ButtonLink";

describe("Responsibility Overview Content Component", () => {

    const testCurrentGroup = mockModellingGroup();
    const testResponsibilitiesSet = mockExtendedResponsibilitySet();
    const testDiseaseId = "d-1";

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore({
            groups: {currentUserGroup: testCurrentGroup},
            diseases: {currentDiseaseId: testDiseaseId},
            responsibilities: {responsibilitiesSet: testResponsibilitiesSet}
        });
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}});
        expect(rendered.props().modellingGroup).to.eql(testCurrentGroup);
        expect(rendered.props().currentDiseaseId).to.eql(testDiseaseId);
        expect(rendered.props().responsibilitySet).to.eql(testResponsibilitiesSet);
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive();
        const props = rendered.props() as ResponsibilityOverviewContentProps;
        expect(props.modellingGroup).to.eql(testCurrentGroup);
        expect(props.currentDiseaseId).to.eql(testDiseaseId);
        expect(props.responsibilitySet).to.eql(testResponsibilitiesSet);
        expect(rendered.find(ResponsibilityOverviewContentComponent).length).to.eql(1);
    });

    it("renders on branch level, not passes", () => {
        store = createMockStore({
            groups: {currentUserGroup: testCurrentGroup},
            diseases: {currentDiseaseId: testDiseaseId},
            responsibilities: {responsibilitiesSet: null}
        });
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on component level", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(ResponsibilitySetStatusMessage).length).to.eql(1);
        expect(rendered.find(ResponsibilitySetStatusMessage).props().status).to.eql(testResponsibilitiesSet.status);
        const responsibilityList = rendered.find(ResponsibilityList);
        expect(responsibilityList.length).to.eql(1);
        expect(responsibilityList.props().currentDiseaseId).to.eql(testDiseaseId);
        expect(responsibilityList.props().modellingGroup).to.eql(testCurrentGroup);
        expect(responsibilityList.props().responsibilitySet).to.eql(testResponsibilitiesSet);
        expect(rendered.find(ButtonLink).length).to.equal(2);
     });

    it("maps state to props", () => {
        const contribStateMock = mockContribState({
            groups: {currentUserGroup: testCurrentGroup},
            diseases: {currentDiseaseId: testDiseaseId},
            responsibilities: {responsibilitiesSet: testResponsibilitiesSet}
        });
        const props = mapStateToProps(contribStateMock);
        expect(props.modellingGroup).to.eql(testCurrentGroup);
        expect(props.currentDiseaseId).to.eql(testDiseaseId);
        expect(props.responsibilitySet).to.eql(testResponsibilitiesSet);
    });
});