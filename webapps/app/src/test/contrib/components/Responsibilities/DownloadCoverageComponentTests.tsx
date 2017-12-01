import * as React from "react";
import { expect } from "chai";
import { mockCoverageSet, mockScenario, mockTouchstone } from "../../../mocks/mockModels";
import { shallow, ShallowWrapper, mount } from "enzyme";

import {
    DownloadCoverageContentComponent,
    DownloadCoverageComponentProps
} from "../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoverageContent"
import { findLabelledCell } from "../../../TableHelpers";
import { CoverageSetList } from "../../../../main/contrib/components/Responsibilities/Coverage/CoverageSetList";
import { Sandbox } from "../../../Sandbox";
import { expectOneAction } from "../../../actionHelpers";
import { responsibilityStore } from "../../../../main/contrib/stores/ResponsibilityStore";
import fetcher from "../../../../main/shared/sources/Fetcher";
import { OneTimeButton } from "../../../../main/shared/components/OneTimeButton";
import { FormatControl } from "../../../../main/contrib/components/Responsibilities/FormatControl";

describe("DownloadCoverageContentComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders the general metadata", () => {
        const touchstone = mockTouchstone();
        const scenario = mockScenario();
        const props = makeProps({ touchstone, scenario });
        const rendered = shallow(<DownloadCoverageContentComponent {...props} />);
        expect(findLabelledCell(rendered, "Touchstone").text()).to.equal(touchstone.description);
        expect(findLabelledCell(rendered, "Scenario").text()).to.equal(scenario.description);
    });

    it("renders coverage set list", () => {
        const sets = [ mockCoverageSet(), mockCoverageSet() ];
        const props = makeProps({ coverageSets: sets });
        const rendered = shallow(<DownloadCoverageContentComponent {...props} />);
        expect(rendered.find(CoverageSetList).props()).to.eql({ coverageSets: sets });
    });

    it("renders OnetimeButton", () => {
        const props = makeProps({ coverageToken: "TOKEN" });
        const rendered = shallow(<DownloadCoverageContentComponent {...props} />);
        expect(rendered.find(OneTimeButton).props()).to.eql({
            token: "TOKEN",
            refreshToken: (rendered.instance() as DownloadCoverageContentComponent).refreshToken,
            onClick: (rendered.instance() as DownloadCoverageContentComponent).onDownloadClicked,
            enabled: true,
            children: "Download combined coverage set data in CSV format"
        });
    });

    it("refreshToken triggers token refresh", () => {
        const spy = sandbox.dispatchSpy();
        const fetchNewToken = sandbox.stubFetch(responsibilityStore, "fetchOneTimeCoverageToken");
        const props = makeProps({ready: true});
        const component = shallow(<DownloadCoverageContentComponent {...props} />);
        const instance = component.instance() as DownloadCoverageContentComponent;
        instance.refreshToken();
        expectOneAction(spy, { action: "CoverageTokenActions.clearUsedToken" });
        expect(fetchNewToken.called).to.be.true;
    });

    it("calling meth onDownloadClicked sets state prop downloadButtonEnabled to false after given timeout in 100ms", function(done: DoneCallback) {
        this.timeout(140);
        const props = makeProps({
            coverageToken: "TOKEN",
            downloadButtonDisableTimeout: 100,
        });
        const component = shallow(<DownloadCoverageContentComponent {...props} />);
        const instance = component.instance() as DownloadCoverageContentComponent;
        expect(component.state().downloadButtonEnabled).to.be.equal(true)
        instance.onDownloadClicked();
        setTimeout(() => {
            expect(component.state().downloadButtonEnabled).to.be.equal(false)
        },70);
        setTimeout(() => {
            expect(component.state().downloadButtonEnabled).to.be.equal(true)
            done();
        },110);
    });

    it("renders format control", () => {
        const props = makeProps({ selectedFormat: "x" });
        const rendered = shallow(<DownloadCoverageContentComponent {...props} />);

        const control = getFormat(rendered);
        expect(control.prop("value")).to.equal("x");
    });

    it("emits action when format is selected", () => {
        const fetchOneTimeToken = sandbox.stubFetch(responsibilityStore, "fetchOneTimeCoverageToken");
        const spy = sandbox.dispatchSpy();
        const props = makeProps({ coverageToken: "TOKEN" });
        const rendered = shallow(<DownloadCoverageContentComponent {...props} />);
        getFormat(rendered).simulate("selectFormat", "x");
        expectOneAction(spy, { action: "CoverageSetActions.selectFormat", payload: "x" });
        expect(fetchOneTimeToken.called).to.be.true;
    });

    function getFormat(rendered: ShallowWrapper<any, any>) {
        return findRowByLabel(rendered, "Format").find(FormatControl);
    }

    function findRowByLabel(rendered: ShallowWrapper<any, any>, label: string) {
        return rendered.find("table").find(`label[children="${label}"]`).closest("tr");
    }

});

function makeProps(props: any): DownloadCoverageComponentProps {
    const touchstone = mockTouchstone();
    const scenario = mockScenario();
    return {
        ready: true,
        touchstone,
        scenario,
        coverageSets: [],
        coverageToken: null,
        ...props
    };
}