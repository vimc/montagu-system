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
import {InternalLink} from "../../../../../main/shared/components/InternalLink";

describe("TouchstoneVersionPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("calls onLoad and renders TouchstoneVersionDetails", () => {
        const onLoadStub = sandbox.setStubReduxAction(touchstoneVersionPageActionCreators, "onLoad");
        sandbox.setStubReduxAction(touchstoneVersionPageActionCreators, "title");
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
        expect(rendered.find("h3").text()).to.eq("Status: open");
    });

    it("renders scenarios link", () => {
        const rendered = shallow(<TouchstoneVersionDetailsComponent touchstone={mockTouchstone({id: "t1"})}
                                                                    touchstoneVersion={mockTouchstoneVersion({id: "v1", status: "open"})}/>);
        expect(rendered.find(InternalLink).at(0).prop("href")).to.eq("/touchstones/t1/v1/scenarios/");
    });

    it("renders responsibilities link", () => {
        const rendered = shallow(<TouchstoneVersionDetailsComponent touchstone={mockTouchstone({id: "t1"})}
                                                                    touchstoneVersion={mockTouchstoneVersion({id: "v1", status: "open"})}/>);
        expect(rendered.find(InternalLink).at(1).prop("href")).to.eq("/touchstones/t1/v1/responsibilities/");
    });

    it("renders demographics link", () => {
        const rendered = shallow(<TouchstoneVersionDetailsComponent touchstone={mockTouchstone({id: "t1"})}
                                                                    touchstoneVersion={mockTouchstoneVersion({id: "v1", status: "open"})}/>);
        expect(rendered.find(InternalLink).at(2).prop("href")).to.eq("/touchstones/t1/v1/demographics/");
    });
});