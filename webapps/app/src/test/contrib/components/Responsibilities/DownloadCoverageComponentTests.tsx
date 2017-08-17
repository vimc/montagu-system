import * as React from "react";
import { expect } from "chai";
import { mockCoverageSet, mockScenario, mockTouchstone } from "../../../mocks/mockModels";
import { shallow } from "enzyme";

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
            enabled: true,
            children: "Download combined coverage set data in CSV format"
        });
    });

    it("refreshToken triggers token refresh", () => {
        const spy = sandbox.dispatchSpy();
        const fetchNewToken = sandbox.sinon.stub(responsibilityStore, "fetchOneTimeCoverageToken");
        new DownloadCoverageContentComponent().refreshToken();
        expectOneAction(spy, { action: "CoverageTokenActions.clearUsedToken" });
        expect(fetchNewToken.called).to.be.true;
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