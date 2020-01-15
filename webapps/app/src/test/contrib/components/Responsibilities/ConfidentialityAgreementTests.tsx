import * as React from "react";
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {expect} from "chai"
import {Store} from "redux";

import "../../../helper";
import {createMockContribStore, createMockStore} from "../../../mocks/mockStore";
import {
    ConfidentialityAgreementComponent,
    withConfidentialityAgreement
} from "../../../../main/contrib/components/Responsibilities/Overview/ConfidentialityAgreement";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {userActionCreators} from "../../../../main/contrib/actions/userActionCreators";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";

describe('Confidentiality Agreement Component tests', () => {

    const testTouchstone = mockTouchstoneVersion();
    const testTouchstoneRfp = mockTouchstoneVersion({id: "rfp-1"});

    class TestInnerComponent extends React.Component {
        render() {
            return <div>Test</div>
        }
    }

    const testState = {
        touchstones: {currentTouchstoneVersion: testTouchstoneRfp},
        user: {signedConfidentialityAgreement: false}
    };

    let store: Store<ContribAppState>;
    let TestComponent: any;
    let getStub: sinon.SinonStub;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockContribStore(testState);
        getStub = sandbox.setStubReduxAction(userActionCreators, 'getConfidentialityAgreement');

        TestComponent = withConfidentialityAgreement(TestInnerComponent);
    });
    afterEach(() => sandbox.restore());

    test("renders on connect level", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}});
        expect(rendered.props().touchstoneId).to.equal("rfp-1");
        expect(rendered.props().signed).to.equal(false);
        expect(typeof rendered.props().signAgreement).to.equal("function");
    });

    test("renders loading element if touchstone is rfp and signed is null", () => {
        const anotherState = {...testState, user: {signedConfidentialityAgreement: null as any}};
        store = createMockStore(anotherState);
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive();
        expect(rendered.find(LoadingElement).length).to.equal(1);
    });

    test(
        "renders ConfidentialityAgreement if touchstone is rfp and not signed",
        () => {
            const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive();
            const agreement = rendered.find(ConfidentialityAgreementComponent);
            expect(agreement.length).to.eql(1);
            expect(agreement.props().touchstoneId).to.equal("rfp-1");
            expect(agreement.props().signed).to.equal(false);
            expect(typeof agreement.props().signAgreement).to.equal("function");
        }
    );

    test("renders wrapped component if touchstone is not rfp", () => {
        const anotherState = {...testState, touchstones: {currentTouchstoneVersion: testTouchstone}};
        store = createMockContribStore(anotherState);
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive();
        expect(rendered.find('div').text()).to.equal("Test");
    });

    test("renders wrapped component if signed is true", () => {
        const anotherState = {...testState, user: {signedConfidentialityAgreement: true}};
        store = createMockContribStore(anotherState);
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive();
        expect(rendered.find('div').text()).to.equal("Test");
    });

    test("renders checkbox if touchstone is rfp and signed is false", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();
        expect(rendered.find('input[type="checkbox"]')).to.have.lengthOf(1);
    });

    test("renders submit button if input checked", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();
        rendered.find('input[type="checkbox"]').simulate("change", {target: {checked: true}});
        expect(rendered.find("button")).to.have.lengthOf(1);
    });

    test("does not renders submit button if input not checked", () => {
        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();
        expect(rendered.find("button")).to.have.lengthOf(0);
    });

    test("dispatches signConfidentialityAgreement on submit", () => {
        const signStub = sandbox.setStubReduxAction(userActionCreators, 'signConfidentialityAgreement');

        const rendered = shallow(<TestComponent/>, {context: {store}}).dive().dive().dive().dive().dive();

        rendered.setState({checked: true});
        rendered.find("button").simulate("click");

        expect(signStub.called).to.be.true;
    });

    test("dispatches getConfidentialityAgreement onMount", () => {

        shallow(<TestComponent touchstoneId={"rfp1"}/>,
            {context: {store}}).dive().dive();

        expect(getStub.called).to.be.true;
    });

});
