import * as React from "react";
import { shallow } from "enzyme";

import { Store } from "redux";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockMatch} from "../../../../mocks/mocks";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {ResponsibilitiesPageTitle} from "../../../../../main/contrib/components/Responsibilities/PageTitle";
import {DownloadDemographicsPageLocationProps, DownloadDemographicsPage} from "../../../../../main/contrib/components/Responsibilities/Demographics/DownloadDemographicsPage";
import {downloadDemographicsContribPageActionCreators} from "../../../../../main/contrib/actions/pages/downloadDemographicsContribPageActionCreators";
import {DownloadDemographicsContent} from "../../../../../main/shared/components/Demographics/DownloadDemographicsContent";

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
        const onLoadStub = sandbox.setStubReduxAction(downloadDemographicsContribPageActionCreators, "onLoad");
        const rendered = shallow(<DownloadDemographicsPage match={testMatch} />, {context: {store}}).dive().dive();
        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.mock.calls.length).toBe(1);
        expect(pageArticle.find(DownloadDemographicsContent).length).toBe(1);
        const titleComponent = pageArticle.dive().find(ResponsibilitiesPageTitle);
        expect(titleComponent.props().title).toBe("Download demographic data sets");
    });
});

