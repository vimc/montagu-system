import * as React from "react";
import { shallow} from "enzyme";

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

    const itTouchstone = mockTouchstoneVersion();
    const itTouchstone2 = mockTouchstoneVersion({id: "rfp-1"});
    const itCurrentGroup = mockModellingGroup();
    const itResponsibilitiesSet = mockExtendedResponsibilitySet();
    const itDiseaseId = "d-1";

    const state: RecursivePartial<ContribAppState> = {
        touchstones: {currentTouchstoneVersion: itTouchstone},
        groups: {currentUserGroup: itCurrentGroup},
        diseases: {currentDiseaseId: itDiseaseId},
        responsibilities: {responsibilitiesSet: itResponsibilitiesSet},
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
        expect(rendered.props().modellingGroup).toEqual(itCurrentGroup);
        expect(rendered.props().currentDiseaseId).toEqual(itDiseaseId);
        expect(rendered.props().responsibilitySet).toEqual(itResponsibilitiesSet);
    });

    it("renders loading element if responsibilitiesSet is null", () => {
        const anotherState = {...state, responsibilities: {responsibilitiesSet: null as any}};
        store = createMockStore(anotherState);
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).toEqual(1);
    });

    it(
        "does not render loading element if responsibilitiesSet is present",
        () => {
            const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive();
            expect(rendered.find(LoadingElement).length).toEqual(0);
        }
    );

    it("renders on confidentiality level, passes", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find(ResponsibilitySetStatusMessage).length).toEqual(1);
    });

    it("renders on confidentiality level, not passes", () => {
        const anotherState = {...state, touchstones: {currentTouchstoneVersion: itTouchstone2}};
        store = createMockContribStore(anotherState);
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}})
            .dive().dive().dive().dive().dive().dive();
        expect(rendered.find(ConfidentialityAgreementComponent).length).toEqual(1);
    });

    it("renders on component level", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find(ResponsibilitySetStatusMessage).length).toEqual(1);
        expect(rendered.find(ResponsibilitySetStatusMessage).props().status).toEqual(itResponsibilitiesSet.status);
        const responsibilityList = rendered.find(ResponsibilityList);
        expect(responsibilityList.length).toEqual(1);
        expect(responsibilityList.props().currentDiseaseId).toEqual(itDiseaseId);
        expect(responsibilityList.props().modellingGroup).toEqual(itCurrentGroup);
        expect(responsibilityList.props().responsibilitySet).toEqual(itResponsibilitiesSet);

        expect(rendered.find(ButtonLink).length).toEqual(3);

     });

    it("maps state to props", () => {
        const contribStateMock = mockContribState({
            groups: {currentUserGroup: itCurrentGroup},
            diseases: {currentDiseaseId: itDiseaseId},
            responsibilities: {responsibilitiesSet: itResponsibilitiesSet},
            touchstones: {currentTouchstoneVersion: itTouchstone}
        });
        const props = mapStateToProps(contribStateMock);
        expect(props.modellingGroup).toEqual(itCurrentGroup);
        expect(props.currentDiseaseId).toEqual(itDiseaseId);
        expect(props.responsibilitySet).toEqual(itResponsibilitiesSet);
    });

    it("renders description", () => {
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find(ResponsibilityOverviewDescription).length).toBe(1);
        expect(rendered.find(ResponsibilityOverviewDescription).props().currentTouchstoneId)
            .toBe(itTouchstone.id);
    });

    it("renders parameters section when stochastic", () => {
        const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => true );
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find("#params-section").length).toBe(1);

    })

    it("does not render parameters section when not stochastic", () => {
        const stub = sandbox.setStubFunc(settings, "isVersionOfStochasticTouchstone", () => false);
        const rendered = shallow(<ResponsibilityOverviewContent/>, {context: {store}}).dive().dive()
            .dive().dive().dive().dive();
        expect(rendered.find("#params-section").length).toBe(0);

    })
});