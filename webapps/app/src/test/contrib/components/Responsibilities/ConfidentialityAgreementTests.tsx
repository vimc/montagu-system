import * as React from "react";
import * as sinon from 'sinon';
import {Sandbox} from "../../../Sandbox";
import {shallow} from "enzyme";
import {expect} from "chai"
import {createMockStore} from "../../../mocks/mockStore";
import {
    ConfidentialityAgreement,
    ConfidentialityAgreementComponent
} from "../../../../main/contrib/components/Responsibilities/Overview/ConfidentialityAgreement";
import {modellingGroupsActionCreators} from "../../../../main/contrib/actions/modellingGroupsActionCreators";
import {RecursivePartial} from "../../../mocks/mockStates";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";

describe('ConfidentialityAgreement', () => {
    const sandbox = new Sandbox();

    let getConfidentialityStub : sinon.SinonStub;

    afterEach(() => {
        sandbox.restore();
    });

    const setupStore = function(signed: boolean){
        const store: RecursivePartial<ContribAppState> = createMockStore({groups: {
            signedConfidentialityAgreement: signed
        }});

        getConfidentialityStub =
            sandbox.setStubReduxAction(modellingGroupsActionCreators, "getConfidentialityAgreement");

        return store;
    };

    it("renders if touchstone is rfp", () => {

        const store = setupStore(false);

        const rendered = shallow(<ConfidentialityAgreement touchstoneId={"rfp-"}/>,
            {context: {store}}).dive().dive();
        expect(rendered.find(ConfidentialityAgreementComponent)).to.have.lengthOf(1)
    });

    it("does not render if touchstone is not rfp", () => {

        const store = setupStore(false);

        const rendered = shallow(<ConfidentialityAgreement touchstoneId={"somethingelse"}/>,
            {context: {store}}).dive().dive();
        expect(rendered.find(ConfidentialityAgreementComponent)).to.have.lengthOf(0)
    });

    it("dispatches signConfidentialityAgreement", () => {

        const store = setupStore(false);

        const stub = sandbox.setStubReduxAction(modellingGroupsActionCreators, 'signConfidentialityAgreement');

        const rendered = shallow(<ConfidentialityAgreement touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive();

        rendered.find("input").simulate("change");

        expect(stub.called).to.be.true;
    });

    it("renders checkbox if not signed", () => {

        const store = setupStore(false);

        const rendered = shallow(<ConfidentialityAgreement touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive();

        expect(rendered.find("input")).to.have.lengthOf(1)
    });

    it("does not render checkbox if signed", () => {

        const store = setupStore(true);

        const rendered = shallow(<ConfidentialityAgreement touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive();

        expect(rendered.find("input")).to.have.lengthOf(0)
    });

    it("dispatches getConfidentialityAgreement onMount", () => {

        const store = setupStore(false);

        shallow(<ConfidentialityAgreement touchstoneId={"rfp-1"}/>,
            {context: {store}}).dive().dive().dive();

        expect(getConfidentialityStub.called).to.be.true;
    });

});