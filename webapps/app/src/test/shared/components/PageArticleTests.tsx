import {shallow} from "enzyme";
import {expect} from "chai";
import {
    PageArticle
} from "../../../main/shared/components/PageWithHeader/PageArticle";
import * as React from "react";
import {Sandbox} from "../../Sandbox";

describe("PageArticle", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    test("renders a fluid container if isFluid", () => {
        const rendered = shallow(<PageArticle title={"test title"} isFluid={true} children={"test content"}/>);
        const article = rendered.find("article");
        expect(article.hasClass("container-fluid")).to.equal(true);
        expect(article.hasClass("container-fit")).to.equal(true);
        expect(article.hasClass("container")).to.equal(false);
    });

    test("renders nonfluid container if not isFluid", () => {
        const rendered = shallow(<PageArticle title={"test title"} isFluid={false} children={"test content"}/>);
        const article = rendered.find("article");
        expect(article.hasClass("container-fluid")).to.equal(false);
        expect(article.hasClass("container-fit")).to.equal(false);
        expect(article.hasClass("container")).to.equal(true);
    });
});