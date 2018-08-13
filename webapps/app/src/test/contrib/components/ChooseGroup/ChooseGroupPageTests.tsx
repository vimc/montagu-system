import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../helper";
import { ChooseGroupPage, ChooseGroupPageComponent } from "../../../../main/contrib/components/ChooseGroup/ChooseGroupPage";
import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {ChooseGroupContent} from "../../../../main/contrib/components/ChooseGroup/ChooseGroupContent";

describe("Choose Group Page Component", () => {

    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        let store = createMockStore();
        const rendered = shallow(<ChooseGroupPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders title, description and ChooseGroupContent", () => {
        const rendered = shallow(<ChooseGroupPageComponent history={null} location={null} match={null}
                                                           router={null} title={"title"}/>);
        const pageArticle = rendered.find('PageArticle');
        expect(pageArticle.props().title).is.equal("title");
        expect(pageArticle.find('p').length).is.equal(1);
        expect(pageArticle.find(ChooseGroupContent).length).is.equal(1);
    });


});

