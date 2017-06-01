import * as React from "react";
import { expect } from "chai";
import { mockCoverageSet, mockScenario, mockTouchstone } from "../../mocks/mockModels";
import { shallow } from "enzyme";

import {
    DownloadCoverageComponent,
    DownloadCoverageComponentProps
} from "../../../main/components/Responsibilities/Coverage/DownloadCoverageComponent"
import { findLabelledCell } from "../../TableHelpers";
import { CoverageSetList } from "../../../main/components/Responsibilities/Coverage/CoverageSetList";
import { Sandbox } from "../../Sandbox";
import { expectOneAction } from "../../actionHelpers";
import { responsibilityStore } from "../../../main/stores/ResponsibilityStore";

describe("DownloadCoverageComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders the general metadata", () => {
        const touchstone = mockTouchstone();
        const scenario = mockScenario();
        const props = makeProps({ touchstone, scenario });
        const rendered = shallow(<DownloadCoverageComponent {...props} />);
        expect(findLabelledCell(rendered, "Touchstone").text()).to.equal(touchstone.description);
        expect(findLabelledCell(rendered, "Scenario").text()).to.equal(scenario.description);
    });

    it("renders coverage set list", () => {
        const sets = [ mockCoverageSet(), mockCoverageSet() ];
        const props = makeProps({ coverageSets: sets });
        const rendered = shallow(<DownloadCoverageComponent {...props} />);
        expect(rendered.find(CoverageSetList).props()).to.eql({ coverageSets: sets });
    });

    it("renders form with onetime URL", () => {
        const props = makeProps({ coverageToken: "TOKEN" });
        const rendered = shallow(<DownloadCoverageComponent {...props} />);
        expect(rendered.find("form").prop("action")).to.equal("http://localhost:8080/v1/onetime_link/TOKEN/");
    });

    it("clicking download coverage data button triggers token refresh", (done: DoneCallback) => {
        const spy = sandbox.dispatchSpy();
        const fetchNewToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeCoverageToken");

        const props = makeProps({ coverageToken: "TOKEN" });
        const rendered = shallow(<DownloadCoverageComponent {...props} />);
        const button = rendered.find("form").find("button");
        expect(button.prop("disabled")).to.be.false;
        button.simulate("click");
        setTimeout(() => {
            expectOneAction(spy, { action: "CoverageTokenActions.clearUsedToken" });
            expect(fetchNewToken.called).to.be.true;
            done();
        });
    });

    it("download coverage data button is disabled when token is null", () => {
        const props = makeProps({ coverageToken: null });
        const rendered = shallow(<DownloadCoverageComponent {...props} />);
        const button = rendered.find("form").find("button");
        expect(button.prop("disabled")).to.be.true;
    });
});

function makeProps(props: any): DownloadCoverageComponentProps {
    const touchstone = mockTouchstone();
    const scenario = mockScenario();
    return {
        ready: true,
        props: Object.assign({
            touchstone,
            scenario,
            coverageSets: [],
            coverageToken: null,
        }, props)
    };
}