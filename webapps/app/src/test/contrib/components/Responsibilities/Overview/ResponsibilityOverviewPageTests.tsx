import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockMatch} from "../../../../mocks/mocks";
import {
    ResponsibilityOverviewPage, ResponsibilityOverviewPageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {responsibilityOverviewPageActionCreators} from "../../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {ResponsibilityOverviewContent} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";

describe("Responsibility Overview Page Component", () => {

    const sandbox = new Sandbox();
    const testTouchstone = mockTouchstoneVersion();

    let store : Store<ContribAppState>;
    beforeEach(() => {
        store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });
    });
    afterEach(() => sandbox.restore());

    it("renders component component level", () => {
        let testMatch = mockMatch<ResponsibilityOverviewPageLocationProps>({
            groupId: "g-1",
            touchstoneId: testTouchstone.id
        });
        const testResponsibilityOverviewPageTitle = `Responsibilities in ${testTouchstone.description }`;
        const onLoadStub = sandbox.setStubReduxAction(responsibilityOverviewPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityOverviewPage
            match={testMatch}
        />, {context: {store}}).dive().dive().dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(testResponsibilityOverviewPageTitle);
        expect(pageArticle.find(ResponsibilityOverviewContent).length).is.equal(1);
    });
});

