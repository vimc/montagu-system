import * as React from "react";
import {expect} from "chai";

import {Sandbox} from "../../../../Sandbox";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockPageProperties, shallowRenderPage} from "../../../../mocks/mockPages";
import {touchstoneVersionPageActionCreators} from "../../../../../main/admin/actions/pages/touchstoneVersionPageActionCreators";
import {
    TouchstoneVersionDetails,
    TouchstoneVersionDetailsComponent
} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionDetails";
import {TouchstoneVersionPage} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {shallow} from "enzyme";
import {mockTouchstone, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {ButtonLink} from "../../../../../main/shared/components/ButtonLink";

describe("TouchstoneVersionPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("calls onLoad and renders TouchstoneVersionDetails", () => {
        const onLoadStub = sandbox.setStubReduxAction(touchstoneVersionPageActionCreators, "onLoad");
        const titleStub = sandbox.setStubReduxAction(touchstoneVersionPageActionCreators, "title");
        const rendered = shallowRenderPage(<TouchstoneVersionPage {...mockPageProperties()} />);
        expect(rendered.find(PageArticle).find(TouchstoneVersionDetails)).to.have.length(1);
        expect(onLoadStub.called).is.equal(true);
    });
});

describe("TouchstoneVersionDetails", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders status", () => {
        const rendered = shallow(<TouchstoneVersionDetailsComponent touchstone={mockTouchstone()}
                                                                    touchstoneVersion={mockTouchstoneVersion({status: "open"})}/>);
        expect(rendered.find("h2").text()).to.eq("Status: open");
    });

    it("renders responsibilities button link", () => {
        const rendered = shallow(<TouchstoneVersionDetailsComponent touchstone={mockTouchstone({id: "t1"})}
                                                                    touchstoneVersion={mockTouchstoneVersion({id: "v1", status: "open"})}/>);
        expect(rendered.find(ButtonLink).at(0).prop("href")).to.eq("/touchstones/t1/v1/responsibilities");
    });

    it("renders demographics button link", () => {
        const rendered = shallow(<TouchstoneVersionDetailsComponent touchstone={mockTouchstone({id: "t1"})}
                                                                    touchstoneVersion={mockTouchstoneVersion({id: "v1", status: "open"})}/>);
        expect(rendered.find(ButtonLink).at(1).prop("href")).to.eq("/touchstones/t1/v1/demographics");
    });
});