import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import Toggle from 'react-bootstrap-toggle';
import {
    mapDispatchToProps, Props,
    PublishSwitchComponent
} from "../../../../main/report/components/Reports/PublishSwitch";
import {Sandbox} from "../../../Sandbox";
import {reportsActions} from "../../../../main/report/actions/reportsActions";

describe("PublishSwitch", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("is on if report is published", () => {

        const props: Props = {
            name: "report-name",
            version: "v1",
            published: true,
            publish: sandbox.createSpy(),
            unpublish: sandbox.createSpy()
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        expect(rendered.find(Toggle).prop("active")).to.be.true
    });

    it("is off if report is not published", () => {

        const props: Props = {
            name: "report-name",
            version: "v1",
            published: false,
            publish: sandbox.createSpy(),
            unpublish: sandbox.createSpy()
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        expect(rendered.find(Toggle).prop("active")).to.be.false
    });

    it("unpublishes on toggle if report is published", () => {

        const unpublishSpy = sandbox.createSpy();
        const props: Props = {
            name: "report-name",
            version: "v1",
            published: true,
            publish: sandbox.createSpy(),
            unpublish: unpublishSpy
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        const toggle = rendered.find(Toggle);
        toggle.simulate("click");

        expect(unpublishSpy.calledWith("report-name", "v1")).to.be.true;

    });

    it("publishes on toggle if report is not published", () => {

        const publishSpy = sandbox.createSpy();
        const props: Props = {
            name: "report-name",
            version: "v1",
            published: false,
            publish: publishSpy,
            unpublish: sandbox.createSpy()
        };

        const rendered = shallow(<PublishSwitchComponent {...props} />);
        const toggle = rendered.find(Toggle);
        toggle.simulate("click");

        expect(publishSpy.calledWith("report-name", "v1")).to.be.true;

    });

    it("maps publish action to props", () => {

        const dispatchSpy = sandbox.createSpy();
        const props = mapDispatchToProps(dispatchSpy);

        const reportActionsPublishSpy = sandbox.setSpy(reportsActions, "publishReport");

        props.publish("report", "v1");
        expect(dispatchSpy.called).to.be.true;
        expect(reportActionsPublishSpy.calledWith("report", "v1")).to.be.true;

    });

    it("maps unpublish action to props", () => {

        const dispatchSpy = sandbox.createSpy();
        const props = mapDispatchToProps(dispatchSpy);

        const reportActionsUnpublishSpy = sandbox.setSpy(reportsActions, "publishReport");

        props.unpublish("report", "v1");
        expect(dispatchSpy.called).to.be.true;
        expect(reportActionsUnpublishSpy.calledWith("report", "v1")).to.be.true;

    });

});