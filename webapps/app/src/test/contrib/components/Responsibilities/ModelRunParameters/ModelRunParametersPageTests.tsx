import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";
import { Store } from "redux";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockMatch} from "../../../../mocks/mocks";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {DownloadDataTitle} from "../../../../../main/contrib/components/Responsibilities/DownloadDataTitle";
import {
    ModelRunParametersPage, ModelRunParametersPageComponent,
    ModelRunParametersPageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersPage";
import {modelRunParametersPageActionCreators} from "../../../../../main/contrib/actions/pages/modelRunParametersPageActionCreators";
import {ModelRunParametersContent} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersContent";

describe("Model Run Parameters Page Component tests", () => {

    const sandbox = new Sandbox();

    let store : Store<ContribAppState>;
    beforeEach(() => {
        store = createMockStore();
    });
    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {
        const rendered = shallow(<ModelRunParametersPage/>, {context: {store}});
        expect(typeof rendered.props().onLoad).is.equal('function');
    });

    it("renders component component level", () => {
        let testMatch = mockMatch<ModelRunParametersPageLocationProps>({
            groupId: "g-1",
            touchstoneId: "t-1"
        });
        const onLoadStub = sandbox.setStubReduxAction(modelRunParametersPageActionCreators, "onLoad");
        const rendered = shallow(<ModelRunParametersPage
            match={testMatch}
        />, {context: {store}}).dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.find(ModelRunParametersContent).length).is.equal(1);
        const titleComponent = pageArticle.dive().find(DownloadDataTitle);
        expect(titleComponent.props().title).is.equal(ModelRunParametersPageComponent.pageName);
    });
});

