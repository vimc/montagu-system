import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import Toggle from 'react-bootstrap-toggle';
import { Store } from "redux";

import "../../../helper";
import {
    PublishSwitchProps,
    PublishSwitchComponent,
    PublishSwitch,
    PublishSwitchModal
} from "../../../../main/report/components/Sidebar/PublishSwitch";
import {Sandbox} from "../../../Sandbox";
import {reportActionCreators} from "../../../../main/report/actionCreators/reportActionCreators";
import {ContribAppState} from "../../../../main/contrib/reducers/contribAppReducers";
import {createMockStore} from "../../../mocks/mockStore";
import {Component} from "react";


describe("Publish Switch connected component tests", () => {

    const testingProps = {
        name: "report-name",
        version: "v1",
        published: true
    };

    let store : Store<ContribAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore({});
    });
    afterEach(() => {
        sandbox.restore();
    });

    it("renders on connect level", () => {
        const rendered = shallow(<PublishSwitch {...testingProps}/>, {context: {store}});
        expect(rendered.props().name).to.eql(testingProps.name);
        expect(rendered.props().version).to.eql(testingProps.version);
        expect(rendered.props().published).to.eql(testingProps.published);
        expect(typeof rendered.props().publish).to.eql("function");
        expect(typeof rendered.props().unpublish).to.eql("function");
    });

    it("test dispatch publish", () => {
        const rendered = shallow(<PublishSwitch {...testingProps}/>, {context: {store}}).dive();
        const PublishSwitchComponentInstance = rendered.instance() as PublishSwitchComponent;
        const publishStub = sandbox.setStubReduxAction(reportActionCreators, "publishReport");
        PublishSwitchComponentInstance.props.publish("report", "v1");
        expect(publishStub.called).to.be.true;
        expect(publishStub.getCall(0).args[0]).to.equal("report");
        expect(publishStub.getCall(0).args[1]).to.equal("v1");
    });

    it("test dispatch unpublish", () => {
        const rendered = shallow(<PublishSwitch {...testingProps}/>, {context: {store}}).dive();
        const PublishSwitchComponentInstance = rendered.instance() as PublishSwitchComponent;
        const unPublishStub = sandbox.setStubReduxAction(reportActionCreators, "unPublishReport");
        PublishSwitchComponentInstance.props.unpublish("report", "v1");
        expect(unPublishStub.called).to.be.true;
        expect(unPublishStub.getCall(0).args[0]).to.equal("report");
        expect(unPublishStub.getCall(0).args[1]).to.equal("v1");
    });

});

describe("Publish Switch component tests", () => {

    const sandbox = new Sandbox();
    afterEach(() => {
        sandbox.restore();
    });

    it("toggle is off if report is not published", () => {
        const props: PublishSwitchProps = {
            name: "report-name",
            version: "v1",
            published: false,
            publish: sandbox.createSpy(),
            unpublish: sandbox.createSpy()
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        expect(rendered.find(Toggle).prop("active")).to.be.false
    });

    it("initialises with modal not showing", () => {
        const props: PublishSwitchProps = {
            name: "report-name",
            version: "v1",
            published: false,
            publish: sandbox.createSpy(),
            unpublish: sandbox.createSpy()
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        expect(rendered.find(PublishSwitchModal).prop("show")).to.be.false;
    });

    it("clicking toggle shows modal", () => {
        const props: PublishSwitchProps = {
            name: "report-name",
            version: "v1",
            published: false,
            publish: sandbox.createSpy(),
            unpublish: sandbox.createSpy()

        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        const toggle = rendered.find(Toggle);
        toggle.simulate("click");

        rendered.update();
        expect(rendered.find(PublishSwitchModal).prop("show")).to.be.true;
    });

    it("unpublishes on confirm from modal if report is published", () => {

        const unpublishSpy = sandbox.createSpy();
        const props: PublishSwitchProps = {
            name: "report-name",
            version: "v1",
            published: true,
            publish: sandbox.createSpy(),
            unpublish: unpublishSpy
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        rendered.setState({ showModal: true });

        const modal = rendered.find(PublishSwitchModal).shallow();
        const modalButton = modal.find("#confirm-publish-btn");
        modalButton.simulate("click");

        expect(unpublishSpy.calledWith("report-name", "v1")).to.be.true;

    });

    it("publishes on confirm from modal if report is not published", () => {

        const publishSpy = sandbox.createSpy();
        const props: PublishSwitchProps = {
            name: "report-name",
            version: "v1",
            published: false,
            publish: publishSpy,
            unpublish: sandbox.createSpy()
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        rendered.setState({ showModal: true });

        const modal = rendered.find(PublishSwitchModal).shallow();
        const modalButton = modal.find("#confirm-publish-btn");
        modalButton.simulate("click");

        expect(publishSpy.calledWith("report-name", "v1")).to.be.true;

    });

    it("does not publish if cancel from dialog", () => {

        const publishSpy = sandbox.createSpy();
        const props: PublishSwitchProps = {
            name: "report-name",
            version: "v1",
            published: false,
            publish: publishSpy,
            unpublish: sandbox.createSpy()
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        rendered.setState({ showModal: true });

        const modal = rendered.find(PublishSwitchModal).shallow();
        const modalButton = modal.find("#cancel-publish-btn");
        modalButton.simulate("click");

        expect(publishSpy.calledWith("report-name", "v1")).to.be.false;

    });

});