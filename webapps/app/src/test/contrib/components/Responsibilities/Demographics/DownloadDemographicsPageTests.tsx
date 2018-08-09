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
import {ResponsibilitiesPageTitle} from "../../../../../main/contrib/components/Responsibilities/PageTitle";
import {
    DownloadDemographicsPage,
    DownloadDemographicsPageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsPage";
import {downloadDemographicsPageActionCreators} from "../../../../../main/contrib/actions/pages/downloadDemographicsPageActionCreators";
import {DownloadDemographicsContent} from "../../../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsContent";

describe("Download Demographics Page tests", () => {

    const sandbox = new Sandbox();

    let store : Store<ContribAppState>;

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => sandbox.restore());

    it("renders component component level", () => {
        let testMatch = mockMatch<DownloadDemographicsPageLocationProps>({
            groupId: "g-1",
            touchstoneId: "t-1"
        });
        const onLoadStub = sandbox.setStubReduxAction(downloadDemographicsPageActionCreators, "onLoad");
        const rendered = shallow(<DownloadDemographicsPage
            match={testMatch}
        />, {context: {store}}).dive().dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.find(DownloadDemographicsContent).length).is.equal(1);
        const titleComponent = pageArticle.dive().find(ResponsibilitiesPageTitle);
        expect(titleComponent.props().title).is.equal("Download demographic data sets");
    });
});

