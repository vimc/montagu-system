import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import { Store } from "redux";

import "../../../helper";
import {
    RunReportComponent,
    RunReport
} from "../../../../main/report/components/Sidebar/RunReport";
import {ConfirmModal} from "../../../../main/shared/components/ConfirmModal";
import {Sandbox} from "../../../Sandbox";
import {reportActionCreators} from "../../../../main/report/actionCreators/reportActionCreators";
import {createMockStore} from "../../../mocks/mockStore";
import {ReportAppState} from "../../../../main/report/reducers/reportAppReducers";
import {
    RunStatusPoll,
    RunStatusPollingActive
} from "../../../../main/report/polling/RunStatusPoll";
import {InternalLink} from "../../../../main/shared/components/InternalLink";


describe("RunReport connected component tests", () => {

    const testingProps = {
        name: "report-name",
        version: "v1"
    };

    let store : Store<ReportAppState>;

    const sandbox = new Sandbox();
    beforeEach(() => {
        store = createMockStore({reports: {runningReports: []}});
    });
    afterEach(() => {
        sandbox.restore();
    });

    it("renders on connect level", () => {
        const rendered = shallow(<RunReport {...testingProps}/>, {context: {store}});
        expect(rendered.props().name).to.eql(testingProps.name);
        expect(rendered.props().version).to.eql(testingProps.version);
        expect(typeof rendered.props().run).to.eql("function");
        expect(typeof rendered.props().startPoll).to.eql("function");
        expect(typeof rendered.props().stopPoll).to.eql("function");
        expect(typeof rendered.props().dismissRunStatus).to.eql("function");
        expect(typeof rendered.props().refreshVersions).to.eql("function");
        expect(rendered.props().newVersionFromRun).to.eql(null);
        expect(rendered.props().isPollingActive).to.eql(false);
    });

    it("test dispatch run report", () => {
        const rendered = shallow(<RunReport {...testingProps}/>, {context: {store}}).dive();
        const RunReportComponentInstance = rendered.instance() as RunReportComponent;
        const runReportStub = sandbox.setStubReduxAction(reportActionCreators, "runReport");
        RunReportComponentInstance.props.run("report");
        expect(runReportStub.called).to.be.true;
        expect(runReportStub.getCall(0).args[0]).to.equal("report");
    });

    it("test dispatch startPoll", () => {
        const rendered = shallow(<RunReport {...testingProps}/>, {context: {store}}).dive();
        const RunReportComponentInstance = rendered.instance() as RunReportComponent;
        const startPollStub = sandbox.setStubReduxAction(RunStatusPoll, "start");
        RunReportComponentInstance.props.startPoll("key");
        expect(startPollStub.called).to.be.true;
        expect(startPollStub.getCall(0).args[1]).to.equal("key");
    });

    it("test dispatch stopPoll", () => {
        const rendered = shallow(<RunReport {...testingProps}/>, {context: {store}}).dive();
        const RunReportComponentInstance = rendered.instance() as RunReportComponent;
        const stopPollStub = sandbox.setStubReduxAction(RunStatusPoll, "stop");
        RunReportComponentInstance.props.stopPoll();
        expect(stopPollStub.called).to.be.true;
    });

    it("test dispatch run status remove", () => {
        const rendered = shallow(<RunReport {...testingProps}/>, {context: {store}}).dive();
        const RunReportComponentInstance = rendered.instance() as RunReportComponent;
        const runStatusRemovedStub = sandbox.setStubReduxAction(reportActionCreators, "reportRunStatusRemoved");
        RunReportComponentInstance.props.dismissRunStatus("report");
        expect(runStatusRemovedStub.called).to.be.true;
        expect(runStatusRemovedStub.getCall(0).args[0]).to.equal("report");
    });

    it("test dispatch get report versions", () => {
        const rendered = shallow(<RunReport {...testingProps}/>, {context: {store}}).dive();
        const RunReportComponentInstance = rendered.instance() as RunReportComponent;
        const getReportVersionsStub = sandbox.setStubReduxAction(reportActionCreators, "getReportVersions");
        RunReportComponentInstance.props.refreshVersions("report");
        expect(getReportVersionsStub.called).to.be.true;
        expect(getReportVersionsStub.getCall(0).args[0]).to.equal("report");
    });

});

describe("RunReport component tests", () => {

    const sandbox = new Sandbox();
    afterEach(() => {
        sandbox.restore();
    });

    let store : Store<ReportAppState>;

    it("Button shown, status not shown if no running status", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: []}});

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        //Button should be rendered
        const runButton = rendered.find("button");
        expect(runButton).to.have.lengthOf(1);
        expect(runButton.text()).to.eql("Run report");

        //Run status should not be rendered
        const statusDiv = rendered.find("div .text-secondary");
        expect(statusDiv).to.have.lengthOf(0);

        //Dismiss button should not be rendered
        const dismiss = rendered.find("div .dismiss-link");
        expect(dismiss).to.have.lengthOf(0);
    });

    it("Button and status shown if running status exists", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "running", version: null}
                ]}});

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        //Button should be rendered
        const runButton = rendered.find("button");
        expect(runButton).to.have.lengthOf(1);
        expect(runButton.text()).to.eql("Run report");

        //Run status should be rendered
        const statusDiv = rendered.find("div .text-secondary");
        expect(statusDiv).to.have.lengthOf(1);
        expect(statusDiv.text()).to.eql("Running status: running");

        //Dismiss button should be rendered
        const dismiss = rendered.find("div .dismiss-link");
        expect(dismiss).to.have.lengthOf(1);
        expect(dismiss.text()).to.eql("Dismiss");
    });

    it("Link to new version not shown if newVersionFromRun does not exist", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "running", version: null}
                ]}});

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        const versionLink = rendered.find(InternalLink);
        expect(versionLink).to.have.lengthOf(0);
    });

    it("Link to new version shown if newVersionFromRun exists", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "running", version: "20190212-162818-9774deeb"}
                ]}});

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        const versionLink = rendered.find(InternalLink);
        expect(versionLink).to.have.lengthOf(1);
        expect(versionLink.prop("href")).to.eql("/report-name/20190212-162818-9774deeb/");
        expect(versionLink.dive().text()).to.eql("Tue Feb 12 2019, 16:28");
    });


    it("initialises with modal not showing", () => {
        const props = {
          name: "report-name",
          version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                  {name: "report-name", key: "charming_aardvark", status: "running", version: null}
              ]}});

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();
        expect(rendered.find(ConfirmModal).prop("show")).to.be.false;
    });


   it("clicking button shows modal", () => {
       const props = {
           name: "report-name",
           version: "v1"
       };

       store = createMockStore({reports: {runningReports: []}});

       const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

       const button = rendered.find("button");
       button.simulate("click");

       rendered.update();
       expect(rendered.find(ConfirmModal).prop("show")).to.be.true;
   });


    it("runs report on confirm from modal", () => {

        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: []}});

        const runReportStub = sandbox.setStubReduxAction(reportActionCreators, "runReport");

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();
        rendered.setState({ showModal: true });

        const modal = rendered.find(ConfirmModal).shallow();
        const modalButton = modal.find("#confirm-publish-btn");
        modalButton.simulate("click");

        expect(runReportStub.called).to.be.true;
        expect(runReportStub.getCall(0).args[0]).to.equal("report-name");

    });

    it("does not run report if cancel from modal", () => {

        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: []}});

        const runReportStub = sandbox.setStubReduxAction(reportActionCreators, "runReport");

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();
        rendered.setState({ showModal: true });

        const modal = rendered.find(ConfirmModal).shallow();
        const modalButton = modal.find("#cancel-publish-btn");
        modalButton.simulate("click");

        expect(runReportStub.called).to.be.false;

    });

    it("clicking Dismiss removed run status", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "running", version: null}
                ]}});

        const removeRunStatusStub = sandbox.setStubReduxAction(reportActionCreators, "reportRunStatusRemoved");

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        //Dismiss button should be rendered
        const dismiss = rendered.find("div .dismiss-link");
        dismiss.simulate("click");
        expect(removeRunStatusStub.called).to.be.true;
        expect(removeRunStatusStub.getCall(0).args[0]).to.equal("report-name");
    });

    it("updates polling as expected when polling is active and run is finished", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "success", version: "20190212-162818-9774deeb"}
                ]}});

        const pollingActiveStub = sandbox.setStubReduxAction(RunStatusPollingActive, "isActive").returns(true);

        const startPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "start");
        const stopPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "stop");
        const refreshVersionsStub = sandbox.setStubReduxAction(reportActionCreators, "getReportVersions");

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        expect(pollingActiveStub.called).to.be.true;

        //polling should have been stopped
        expect(stopPollingStub.called).to.be.true;

        //versions should have been refreshed
        expect(refreshVersionsStub.called).to.be.true;

        //polling should not have been restarted
        expect(startPollingStub.called).to.be.false;
    });

    it("updates polling as expected when polling is active and run is not finished", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "running", version: "20190212-162818-9774deeb"}
                ]}});

        const pollingActiveStub = sandbox.setStubReduxAction(RunStatusPollingActive, "isActive").returns(true);

        const startPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "start");
        const stopPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "stop");
        const refreshVersionsStub = sandbox.setStubReduxAction(reportActionCreators, "getReportVersions");

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        expect(pollingActiveStub.called).to.be.true;

        //polling should have been stopped
        expect(stopPollingStub.called).to.be.true;

        //versions should not have been refreshed
        expect(refreshVersionsStub.called).to.be.false;

        //polling should have been restarted
        expect(startPollingStub.called).to.be.true;
    });

    it("updates polling as expected when polling is not active and run is finished", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "success", version: "20190212-162818-9774deeb"}
                ]}});

        const pollingActiveStub = sandbox.setStubReduxAction(RunStatusPollingActive, "isActive").returns(false);

        const startPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "start");
        const stopPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "stop");
        const refreshVersionsStub = sandbox.setStubReduxAction(reportActionCreators, "getReportVersions");

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        expect(pollingActiveStub.called).to.be.true;

        //polling should not have been stopped
        expect(stopPollingStub.called).to.be.false;

        //versions should not have been refreshed
        expect(refreshVersionsStub.called).to.be.false;

        //polling should not have been restarted
        expect(startPollingStub.called).to.be.false;
    });

    it("updates polling as expected when polling is not active and run is not finished", () => {
        const props = {
            name: "report-name",
            version: "v1"
        };

        store = createMockStore({reports: {runningReports: [
                    {name: "report-name", key: "charming_aardvark", status: "running", version: "20190212-162818-9774deeb"}
                ]}});

        const pollingActiveStub = sandbox.setStubReduxAction(RunStatusPollingActive, "isActive").returns(false);

        const startPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "start");
        const stopPollingStub = sandbox.setStubReduxAction(RunStatusPoll, "stop");
        const refreshVersionsStub = sandbox.setStubReduxAction(reportActionCreators, "getReportVersions");

        const rendered = shallow(<RunReport {...props} />, {context: {store}}).dive().dive();

        expect(pollingActiveStub.called).to.be.true;

        //polling should not have been stopped
        expect(stopPollingStub.called).to.be.false;

        //versions should not have been refreshed
        expect(refreshVersionsStub.called).to.be.false;

        //polling should have been restarted
        expect(startPollingStub.called).to.be.true;
    });

});