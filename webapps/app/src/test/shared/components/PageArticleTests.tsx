import {shallow} from "enzyme";

import {
    PageArticle
} from "../../../main/shared/components/PageWithHeader/PageArticle";
import * as React from "react";
import {Sandbox} from "../../Sandbox";

describe("PageArticle", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders a fluid container if isFluid", () => {
        const rendered = shallow(<PageArticle title={"test title"} isFluid={true} children={"test content"}/>);
        const article = rendered.find("article");
        expect(article.hasClass("container-fluid")).toEqual(true);
        expect(article.hasClass("container-fit")).toEqual(true);
        expect(article.hasClass("container")).toEqual(false);
    });

    it("renders nonfluid container if not isFluid", () => {
        const rendered = shallow(<PageArticle title={"test title"} isFluid={false} children={"test content"}/>);
        const article = rendered.find("article");
        expect(article.hasClass("container-fluid")).toEqual(false);
        expect(article.hasClass("container-fit")).toEqual(false);
        expect(article.hasClass("container")).toEqual(true);
    });
});