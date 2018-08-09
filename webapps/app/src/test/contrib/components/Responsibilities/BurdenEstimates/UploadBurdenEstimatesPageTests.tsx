import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {Store} from "redux";

import "../../../../helper";
import {Sandbox} from "../../../../Sandbox";
import {createMockStore} from "../../../../mocks/mockStore";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockLocation, mockMatch} from "../../../../mocks/mocks";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";
import {ResponsibilitiesPageTitle} from "../../../../../main/contrib/components/Responsibilities/PageTitle";
import {
    UploadBurdenEstimatesPage,
    UploadBurdenEstimatesPageLocationProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesPage";
import {uploadBurdenEstimatesPageActionCreators} from "../../../../../main/contrib/actions/pages/uploadBurdenEstimatesPageActionCreators";
import {UploadBurdenEstimatesContent} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesContent";

describe("Upload Burden Estimates Page tests", () => {

    const sandbox = new Sandbox();

    let store: Store<ContribAppState>;

    beforeEach(() => {
        store = createMockStore();
    });

    afterEach(() => sandbox.restore());

    it("renders component component level", () => {
        const testMatch = mockMatch<UploadBurdenEstimatesPageLocationProps>({
            groupId: "g-1",
            touchstoneId: "t-1",
            scenarioId: "s-1"
        });
        const testLocation = mockLocation({pathname: "/test/"});
        const onLoadStub = sandbox.setStubReduxAction(uploadBurdenEstimatesPageActionCreators, "onLoad");
        const rendered = shallow(<UploadBurdenEstimatesPage
            match={testMatch}
            location={testLocation}
        />, {context: {store}}).dive().dive().dive();
        const pageArticle = rendered.find('PageArticle');
        expect(onLoadStub.called).is.equal(true);
        expect(pageArticle.find(UploadBurdenEstimatesContent).length).is.equal(1);
        const titleComponent = pageArticle.dive().find(ResponsibilitiesPageTitle);
        expect(titleComponent.props().title).is.equal("Upload burden estimates");
    });
});

