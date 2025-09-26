import * as React from "react";

import {Store} from "redux";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {createMockContribStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockMatch} from "../../../../mocks/mocks";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {ResponsibilitiesPageTitle} from "../../../../../main/contrib/components/Responsibilities/PageTitle";
import {
    ModelRunParametersPage,
    ModelRunParametersPageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersPage";
import {modelRunParametersPageActionCreators} from "../../../../../main/contrib/actions/pages/modelRunParametersPageActionCreators";
import {ModelRunParametersContent} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersContent";
import {Provider} from "react-redux";
import {mockContribState} from "../../../../mocks/mockStates";
import {mount} from "enzyme";

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

        const rendered = mount(<Provider store={store}><ModelRunParametersPage
            match={testMatch}
        /></Provider>);

        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.mock.calls.length).toBe(1);
        expect(pageArticle.find(ModelRunParametersContent).length).toBe(1);
        const titleComponent = pageArticle.find(ResponsibilitiesPageTitle);
        expect(titleComponent.props().title).toBe("Upload parameters");
    });
});
