import * as React from "react";
import {expect} from "chai";
import {Store} from "redux";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockMatch} from "../../../../mocks/mocks";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {ResponsibilitiesPageTitle} from "../../../../../main/contrib/components/Responsibilities/PageTitle";
import {
    ModelRunParametersPage,
    ModelRunParametersPageComponent,
    ModelRunParametersPageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersPage";
import {modelRunParametersPageActionCreators} from "../../../../../main/contrib/actions/pages/modelRunParametersPageActionCreators";
import {ModelRunParametersContent} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersContent";
import {Provider} from "react-redux";
import {mockContribState} from "../../../../mocks/mockStates";

describe("Model Run Parameters Page tests", () => {

    const sandbox = new Sandbox();

    let store: Store<ContribAppState>;

    beforeEach(() => {
        store = createMockContribStore(mockContribState());
    });

    afterEach(() => sandbox.restore());

    it("renders component component level", () => {
        let testMatch = mockMatch<ModelRunParametersPageLocationProps>({
            groupId: "g-1",
            touchstoneId: "t-1"
        });

        const onLoadStub = sandbox.setStubReduxAction(modelRunParametersPageActionCreators, "onLoad");

        const rendered = sandbox.mount(<Provider store={store}><ModelRunParametersPage
            match={testMatch}
        /></Provider>);

        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.find(ModelRunParametersContent).length).is.equal(1);
        const titleComponent = pageArticle.find(ResponsibilitiesPageTitle);
        expect(titleComponent.props().title).is.equal("Upload parameters");
    });
});

