import {Sandbox} from "../../../../Sandbox";
import {mockPageProperties, shallowRenderPage} from "../../../../mocks/mockPages";
import {expect} from "chai";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import * as React from "react";
import {modelMetaPageActionCreators} from "../../../../../main/admin/actions/pages/ModelMetaPageActionCreators";
import {
    ModelMetaPage,
} from "../../../../../main/admin/components/ModellingGroups/Models/ModelMetaPage";
import {ModelMetaTable} from "../../../../../main/admin/components/ModellingGroups/Models/ModelMetaTable";

describe("ModelMetaPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    test("renders page with correct action creators", () => {
        const onLoadStub = sandbox.setStubReduxAction(modelMetaPageActionCreators, "onLoad");
        const rendered = shallowRenderPage(<ModelMetaPage {...mockPageProperties()} />);

        expect(rendered.find(PageArticle).props().title).to.eq("Model Metadata");
        expect(rendered.find(PageArticle).find(ModelMetaTable)).to.have.length(2);
        expect(onLoadStub.called).is.equal(true);
    });

});