import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../helper";
import { ChooseGroupPage, ChooseGroupPageComponent } from "../../../../main/contrib/components/ChooseGroup/ChooseGroupPage";
import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {chooseGroupPageActionCreators} from "../../../../main/contrib/actions/pages/chooseGroupPageActionCreators";
import {PageArticle} from "../../../../main/shared/components/PageWithHeader/PageArticle";
import {ChooseGroupContent} from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";

describe("Choose Group Page Component", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore();
        const rendered = shallow(<ChooseGroupPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders component component level", () => {
        let store = createMockStore();
        const onLoadStub = sandbox.setStubFunc(chooseGroupPageActionCreators, "onLoad", () => ({type: 'any'}));
        const rendered = shallow(<ChooseGroupPage/>, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.props().title).is.equal(ChooseGroupPageComponent.title);
        expect(pageArticle.find('p').length).is.equal(1);
        expect(pageArticle.find(ChooseGroupContent).length).is.equal(1);
    });


});

