import * as React from "react";
import { shallow} from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import {
    mockDisease, mockModellingGroup, mockModelRunParameterSet, mockTouchstone
} from "../../../../mocks/mockModels";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";

import {
    ModelRunParametersStatus,
    ModelRunParametersStatusComponent
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersStatus";
import {runParametersActionCreators} from "../../../../../main/contrib/actions/runParametersActionCreators";
import {longestTimestamp} from "../../../../../main/shared/Helpers";
import {ModelRunParameterDownloadCertificate} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterDownloadCertificate";
import {OneTimeButton} from "../../../../../main/shared/components/OneTimeButton/OneTimeButton";

describe("Model Run Parameters Status component tests", () => {

    const testGroup = mockModellingGroup();
    const testDisease = mockDisease();
    const testTouchstone = mockTouchstone();
    const testRunParametersSet = mockModelRunParameterSet({disease: testDisease.id})

    const testState = {
        groups: {currentUserGroup: testGroup},
        touchstones: {currentTouchstone: testTouchstone},
        runParameters: {sets: [testRunParametersSet], tokens:{[testRunParametersSet.id]: 'test-token'}}
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore(testState);
    });
    afterEach(() => sandbox.restore());

    it("renders on connect level", () => {
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}});
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().group).to.eql(testGroup);
        expect(rendered.props().set).to.eql(testRunParametersSet);
        expect(rendered.props().disease).to.eql(testDisease.id);
        expect(typeof rendered.props().loadToken).to.eql("function");
    });

    it("renders on branch level, passes", () => {
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive();
        expect(rendered.find(ModelRunParametersStatusComponent).length).to.eql(1);
    });

    it("renders on branch level, not passes", () => {
        store = createMockStore({...testState, touchstones: {currentTouchstone: null}});
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        expect(rendered.find(LoadingElement).length).to.eql(1);
    });

    it("renders on component level, shows alert if no set received ", () => {
        store = createMockStore({...testState, runParameters: {...testState.runParameters, sets: []}});
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        expect(rendered.find('Alert').find('span').text()).to
            .equal(`You have not uploaded any parameter sets for ${testDisease.id}`);
    });

    it("renders on component level, shows message of downloadable files", () => {
        sandbox.setStubReduxAction(runParametersActionCreators, "getOneTimeToken");
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        expect(rendered.find("Alert").find('span').text()
            .indexOf(`You last uploaded a parameter set on ${longestTimestamp(new Date(testRunParametersSet.uploaded_on))}`))
            .to.equal(0);
    });

    it("renders on component level, test fetch token action is triggered on mount with right params", () => {
        const getOneTimeTokenStub = sandbox.setStubReduxAction(runParametersActionCreators, "getOneTimeToken");
        shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        expect(getOneTimeTokenStub.called).to.equal(true);
        expect(getOneTimeTokenStub.getCall(0).args[0]).to.equal(testGroup.id);
        expect(getOneTimeTokenStub.getCall(0).args[1]).to.equal(testTouchstone.id);
        expect(getOneTimeTokenStub.getCall(0).args[2]).to.equal(testRunParametersSet.id);
    });

    it("renders on component level, passes params to certificate download and to one time button component", () => {
        sandbox.setStubReduxAction(runParametersActionCreators, "getOneTimeToken");
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();

        const certificate = rendered.find(ModelRunParameterDownloadCertificate);
        expect(certificate.props().set).to.eql(testRunParametersSet);

        const oneTimeButton = rendered.find(OneTimeButton);
        expect(oneTimeButton.props().token).to.eql("test-token");
        expect(typeof oneTimeButton.props().refreshToken).to.eql("function");
        expect(oneTimeButton.props().enabled).to.eql(true);
        expect(oneTimeButton.props().element).to.eql('Link');
        expect(oneTimeButton.props().children).to.eql('Download data set');
    });

    it("renders on component level, triggers load token action 2nd time if onetimetoken button has been clicked", (done) => {
        const getOneTimeTokenStub = sandbox.setStubReduxAction(runParametersActionCreators, "getOneTimeToken");
        const rendered = shallow(<ModelRunParametersStatus disease={testDisease.id}/>, {context: {store}}).dive().dive();
        const oneTimeButton = rendered.find(OneTimeButton).dive().dive();
        expect(getOneTimeTokenStub.callCount).to.eql(1);
        oneTimeButton.simulate('click');
        setTimeout(() => {
            expect(getOneTimeTokenStub.callCount).to.eql(2);
            done()
        })
    });

});