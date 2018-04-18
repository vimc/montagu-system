import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {expect} from "chai"
import {
    enhance,
    ResponsibilityOverviewComponentProps,
    ResponsibilityOverviewContentComponent
} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";
import {ExtendedResponsibilitySet} from "../../../../main/contrib/models/ResponsibilitySet";
import {mockModellingGroup, mockTouchstone} from "../../../mocks/mockModels";
import {createMockStore} from "../../../mocks/mockStore";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {RecursivePartial} from "../../../mocks/mockStates";
import {
    ResponsibilityOverviewDescription,
    ResponsibilityOverviewDescriptionComponent
} from "../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewDescription";

function makeProps(touchstoneId: string): ResponsibilityOverviewComponentProps {
    const touchstone = mockTouchstone({id: touchstoneId});
    const modellingGroup = mockModellingGroup();
    return {
        ready: true,
        modellingGroup: modellingGroup,
        currentDiseaseId: "d1",
        responsibilitySet: new ExtendedResponsibilitySet({
            problems: "",
            status: null,
            touchstone: touchstone.id,
            responsibilities: []
        }, touchstone, modellingGroup)
    };
}

let fakeState: RecursivePartial<ContribAppState> = {
    groups: {
        userGroups: [],
        signedConfidentialityAgreement: false
    }
};

describe('ResponsibilityOverviewContent', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
        fakeState = {
            groups: {
                userGroups: [],
                signedConfidentialityAgreement: false
            }
        };
    });

    it("show params if touchstone is not rfp", () => {

        const rendered = shallow(<ResponsibilityOverviewContentComponent {...makeProps("something")} />);
        const params = rendered.find("#params-section");
        expect(params).to.have.lengthOf(1)
    });

    it("does not show params if touchstone is rfp", () => {

        const rendered = shallow(<ResponsibilityOverviewContentComponent {...makeProps("rfp-1")} />);
        const params = rendered.find("#params-section");
        expect(params).to.have.lengthOf(0)
    });

    const testClass: React.StatelessComponent<any> =
        () => {
            return <div>Test content</div>
        };


    it("renders nothing if touchstone is rfp and confidentiality unsigned", () => {

        const store = createMockStore(fakeState);

        const WrappedComponent = enhance(testClass);
        const rendered = shallow(<WrappedComponent touchstoneId={"rfp-"}/>,
            {context: {store}}).dive();
        expect(rendered.find(testClass)).to.have.lengthOf(0)
    });

    it("renders if touchstone is not rfp", () => {

        const store = createMockStore(fakeState);

        const WrappedComponent = enhance(testClass);
        const rendered = shallow(<WrappedComponent touchstoneId={"somethingelse"}/>,
            {context: {store}}).dive();
        expect(rendered.find(testClass)).to.have.lengthOf(1)
    });

    it("renders if confidentiality is signed", () => {

        fakeState.groups.signedConfidentialityAgreement = true;
        const store = createMockStore(fakeState);

        const WrappedComponent = enhance(testClass);
        const rendered = shallow(<WrappedComponent touchstoneId={"rfp-"}/>,
            {context: {store}}).dive();
        expect(rendered.find(testClass)).to.have.lengthOf(1)
    });

});

describe('ResponsibilityOverviewDescription', () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders nothing if touchstone is rfp and confidentiality unsigned", () => {

        const store = createMockStore(fakeState);

        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"rfp-"}/>,
            {context: {store}}).dive();
        expect(rendered.find(ResponsibilityOverviewDescriptionComponent)).to.have.lengthOf(0)
    });

    it("renders if touchstone is not rfp", () => {

        const store = createMockStore(fakeState);

        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"somethingelse"}/>,
            {context: {store}}).dive();
        expect(rendered.find(ResponsibilityOverviewDescriptionComponent)).to.have.lengthOf(1)
    });

    it("renders if confidentiality is signed", () => {

        fakeState.groups.signedConfidentialityAgreement = true;

        const store = createMockStore(fakeState);
        const rendered = shallow(<ResponsibilityOverviewDescription currentTouchstoneId={"rfp-"}/>,
            {context: {store}}).dive();
        expect(rendered.find(ResponsibilityOverviewDescriptionComponent)).to.have.lengthOf(1)
    });

});