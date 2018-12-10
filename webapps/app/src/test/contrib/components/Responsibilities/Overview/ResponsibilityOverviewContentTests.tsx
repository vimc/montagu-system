import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import {mockExtendedResponsibilitySet, mockModellingGroup, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {mockContribState, RecursivePartial} from "../../../../mocks/mockStates";
import { Sandbox } from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {
    ResponsibilityOverviewContent,
    ResponsibilityOverviewContentProps, mapStateToProps
} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";
import {ResponsibilitySetStatusMessage} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilitySetStatusMessage";
import {ResponsibilityList} from "../../../../../main/contrib/components/Responsibilities/Overview/List/ResponsibilityList";
import {ButtonLink} from "../../../../../main/shared/components/ButtonLink";
import {
    ConfidentialityAgreementComponent
} from "../../../../../main/contrib/components/Responsibilities/Overview/ConfidentialityAgreement";
import {ResponsibilityOverviewDescription} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewDescription";
import {userActionCreators} from "../../../../../main/contrib/actions/userActionCreators";
import {settings} from "../../../../../main/shared/Settings";

describe("Responsibility Overview Content Component", () => {

    const testTouchstone = mockTouchstoneVersion();
    const testTouchstone2 = mockTouchstoneVersion({id: "rfp-1"});
    const testCurrentGroup = mockModellingGroup();
    const testResponsibilitiesSet = mockExtendedResponsibilitySet();
    const testDiseaseId = "d-1";

    const state: RecursivePartial<ContribAppState> = {
        touchstones: {currentTouchstoneVersion: testTouchstone},
        groups: {currentUserGroup: testCurrentGroup},
        diseases: {currentDiseaseId: testDiseaseId},
        responsibilities: {responsibilitiesSet: testResponsibilitiesSet},
        user: {signedConfidentialityAgreement: false}
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(state);
        sandbox.setStubReduxAction(userActionCreators, 'getConfidentialityAgreement');

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
        expect(rendered.find('Connect').length).to.eql(1);
    });

    it("renders on branch level, not passes", () => {
        const anotherState = {...state, responsibilities: {responsibilitiesSet: null as any}};
        store = createMockStore(anotherState);
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on confidentiality level, passes", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find(ResponsibilitySetStatusMessage).length).to.eql(1);
    });

    it("renders on confidentiality level, not passes", () => {
        const anotherState = {...state, touchstones: {currentTouchstoneVersion: testTouchstone2}};
        store = createMockContribStore(anotherState);
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}})
            .dive().dive().dive().dive().dive().dive();
        expect(rendered.find(ConfidentialityAgreementComponent).length).to.eql(1);
    });

    it("renders on component level", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find(ResponsibilitySetStatusMessage).length).to.eql(1);
        expect(rendered.find(ResponsibilitySetStatusMessage).props().status).to.eql(testResponsibilitiesSet.status);
        const responsibilityList = rendered.find(ResponsibilityList);
        expect(responsibilityList.length).to.eql(1);
        expect(responsibilityList.props().currentDiseaseId).to.eql(testDiseaseId);
        expect(responsibilityList.props().modellingGroup).to.eql(testCurrentGroup);
        expect(responsibilityList.props().responsibilitySet).to.eql(testResponsibilitiesSet);

        if (settings.showNewTemplates) {
            expect(rendered.find(ButtonLink).length).to.equal(3);
        }
        else{
            expect(rendered.find(ButtonLink).length).to.equal(2);
        }
     });

    it("maps state to props", () => {
        const contribStateMock = mockContribState({
            groups: {currentUserGroup: testCurrentGroup},
            diseases: {currentDiseaseId: testDiseaseId},
            responsibilities: {responsibilitiesSet: testResponsibilitiesSet},
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });
        const props = mapStateToProps(contribStateMock);
        expect(props.modellingGroup).to.eql(testCurrentGroup);
        expect(props.currentDiseaseId).to.eql(testDiseaseId);
        expect(props.responsibilitySet).to.eql(testResponsibilitiesSet);
    });

    it("renders description", function(){
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find(ResponsibilityOverviewDescription).length).is.equal(1);
        expect(rendered.find(ResponsibilityOverviewDescription).props().currentTouchstoneId)
            .is.equal(testTouchstone.id);
    })

    it("renders parameters section when stochastic", function(){
        const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => true );
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find("#params-section").length).is.equal(1);

    })

    it("does not render parameters section when not stochastic", function(){
        const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => false);
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find("#params-section").length).is.equal(0);

    })
});