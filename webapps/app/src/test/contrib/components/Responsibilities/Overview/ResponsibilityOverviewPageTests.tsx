import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockMatch} from "../../../../mocks/mocks";
import {
    ResponsibilityOverviewPage, ResponsibilityOverviewPageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewPage";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {mockTouchstone} from "../../../../mocks/mockModels";
import {responsibilityOverviewPageActionCreators} from "../../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {ResponsibilityOverviewDescription} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewDescription";
import {ResponsibilityOverviewContent} from "../../../../../main/contrib/components/Responsibilities/Overview/ResponsibilityOverviewContent";

describe("Responsibility Overview Page Component", () => {

    const sandbox = new Sandbox();
    const testTouchstone = mockTouchstone();

    let store : Store<ContribAppState>;
    beforeEach(() => {
        store = createMockStore({
            touchstones: {currentTouchstone: testTouchstone}
        });
    });
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        const rendered = shallow(<ResponsibilityOverviewPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders component component level", () => {
        let testMatch = mockMatch<ResponsibilityOverviewPageLocationProps>({
            groupId: "g-1",
            touchstoneId: testTouchstone.id
        });
        const testResponsibilityOverviewPageTitle = `Responsibilities in ${testTouchstone.description }`;
        const onLoadStub = sandbox.setStubReduxAction(responsibilityOverviewPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityOverviewPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(testResponsibilityOverviewPageTitle);
        expect(pageArticle.find(ResponsibilityOverviewDescription).length).is.equal(1);
        expect(pageArticle.find(ResponsibilityOverviewDescription).props().currentTouchstoneId).is.equal(testTouchstone.id);
        expect(pageArticle.find(ResponsibilityOverviewContent).length).is.equal(1);
    });
});

