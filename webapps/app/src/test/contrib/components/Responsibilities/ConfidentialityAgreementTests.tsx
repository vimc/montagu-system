import * as React from "react";
import * as sinon from 'sinon';
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {expect} from "chai"
import {createMockStore} from "../../../mocks/mockStore";
import {
    ConfidentialityAgreementComponent, ConfidentialityPublicProps, withConfidentialityAgreement
} from "../../../../main/contrib/components/Responsibilities/Overview/ConfidentialityAgreement";
import {RecursivePartial} from "../../../mocks/mockStates";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {userActionCreators} from "../../../../main/contrib/actions/userActionCreators";
import {LoadingElement} from "../../../../main/shared/partials/LoadingElement/LoadingElement";

describe('ConfidentialityAgreement', () => {
    const sandbox = new Sandbox();

    let getConfidentialityStub: sinon.SinonStub;

    afterEach(() => {
        sandbox.restore();
    });

    const setupStore = function (signed?: boolean) {
        const store: RecursivePartial<ContribAppState> = createMockStore({
            user: {
                signedConfidentialityAgreement: signed
            }
        });

        getConfidentialityStub =
            sandbox.setStubReduxAction(userActionCreators, "getConfidentialityAgreement");

        return store;
    };

    class TestInnerComponent extends React.Component<ConfidentialityPublicProps> {
        render() {
            return <div>Test</div>
        }
    }

    const TestComponent = withConfidentialityAgreement(TestInnerComponent);

    it("renders ConfidentialityAgreement if touchstone is rfp and not signed", () => {

        const store = setupStore(false);

        const rendered = shallow(<TestComponent touchstoneId={"rfp-"}/>,
            {context: {store}});

        expect(rendered.dive().dive().dive().dive().find(ConfidentialityAgreementComponent)).to.have.lengthOf(1);
        expect(rendered.dive().dive().find(TestInnerComponent)).to.have.lengthOf(0);

    });

    it("renders wrapped component if touchstone is not rfp", () => {

        const store = setupStore(false);

        const rendered = shallow(<TestComponent touchstoneId={"somethingelse"}/>,
            {context: {store}}).dive().dive();

        expect(rendered.find(ConfidentialityAgreementComponent)).to.have.lengthOf(0);
        expect(rendered.find(TestInnerComponent)).to.have.lengthOf(1);
    });

    it("renders wrapped component if signed is true", () => {

        const store = setupStore(true);

        const rendered = shallow(<TestComponent touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive();


        expect(rendered.find(ConfidentialityAgreementComponent)).to.have.lengthOf(0);
        expect(rendered.find(TestInnerComponent)).to.have.lengthOf(1);
    });


    it("renders loading element if touchstone is rfp and signed is null", () => {

        const store = setupStore(null);

        const rendered = shallow(<TestComponent touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive().dive();

        expect(rendered.find(ConfidentialityAgreementComponent)).to.have.lengthOf(0);
        expect(rendered.find(TestInnerComponent)).to.have.lengthOf(0);
        expect(rendered.find(LoadingElement)).to.have.lengthOf(1);
    });

    it("renders submit button if input checked", () => {

        const store = setupStore(false);

        const rendered = shallow(<TestComponent touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive().dive().dive();
;
        rendered.find("input").simulate("change", {target: {checked: true}});
        expect(rendered.find("button")).to.have.lengthOf(1)
    });

    it("does not renders submit button if input not checked", () => {

        const store = setupStore(false);

        const rendered = shallow(<TestComponent touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive().dive().dive();

        expect(rendered.find("button")).to.have.lengthOf(0)

    });

    it("dispatches signConfidentialityAgreement on submit", () => {

        const store = setupStore(false);

        const stub = sandbox.setStubReduxAction(userActionCreators, 'signConfidentialityAgreement');

        const rendered = shallow(<TestComponent touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive().dive().dive();

        rendered.setState({checked: true});
        rendered.find("button").simulate("click");

        expect(stub.called).to.be.true;
    });


    it("dispatches getConfidentialityAgreement onMount", () => {

        const store = setupStore(false);

        shallow(<TestComponent touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive();

        expect(getConfidentialityStub.called).to.be.true;
    });

});