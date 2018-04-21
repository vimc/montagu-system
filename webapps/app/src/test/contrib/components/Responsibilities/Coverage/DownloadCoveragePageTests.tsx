import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockMatch} from "../../../../mocks/mocks";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {
    DownloadCoveragePage,
    DownloadCoveragePageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoveragePage";
import {downloadCoveragePageActionCreators} from "../../../../../main/contrib/actions/pages/downloadCoveragePageActionCreators";
import {DownloadCoverageContent} from "../../../../../main/contrib/components/Responsibilities/Coverage/DownloadCoverageContent";
import {ResponsibilitiesPageTitle} from "../../../../../main/contrib/components/Responsibilities/PageTitle";

describe("Download Coverage Page Component tests", () => {

    const sandbox = new Sandbox();

    let store : Store<ContribAppState>;
    beforeEach(() => {
        store = createMockStore();
    });
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        const rendered = shallow(<DownloadCoveragePage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders component component level", () => {
        let testMatch = mockMatch<DownloadCoveragePageLocationProps>({
            groupId: "g-1",
            touchstoneId: "t-1",
            scenarioId: "s-1"
        });
        const onLoadStub = sandbox.setStubReduxAction(downloadCoveragePageActionCreators, "onLoad");
        const rendered = shallow(<DownloadCoveragePage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.find(DownloadCoverageContent).length).is.equal(1);
        const titleComponent = pageArticle.dive().find(ResponsibilitiesPageTitle);
        expect(titleComponent.props().title).is.equal("Download coverage data");
    });
});

