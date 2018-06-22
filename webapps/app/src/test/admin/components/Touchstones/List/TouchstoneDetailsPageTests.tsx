import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {Sandbox} from "../../../../Sandbox";
import {expect} from "chai";
import {mockPageProperties, shallowRenderPage} from "../../../../mocks/mockPages";
import {touchstoneDetailsPageActionCreators} from "../../../../../main/admin/actions/pages/touchstoneDetailsPageActionCreators";
import {TouchstoneDetailsPage} from "../../../../../main/admin/components/Touchstones/Details/TouchstoneDetailsPage";
import * as React from "react";
import {TouchstoneDetails} from "../../../../../main/admin/components/Touchstones/Details/TouchstoneDetails";
import {AdminTouchstoneState} from "../../../../../main/admin/reducers/adminTouchstoneReducer";
import {mockTouchstone} from "../../../../mocks/mockModels";
import {createMockAdminStore} from "../../../../mocks/mockStore";

describe("TouchstoneDetailsPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("calls onLoad when loaded", () => {
        const touchstones: Partial<AdminTouchstoneState> = {
            currentTouchstone: mockTouchstone()
        };
        const store = createMockAdminStore({touchstones: touchstones});
        const onLoadStub = sandbox.setStubReduxAction(touchstoneDetailsPageActionCreators, "onLoad");
        const rendered = shallowRenderPage(<TouchstoneDetailsPage {...mockPageProperties()} />, store);
        expect(rendered.find(PageArticle).find(TouchstoneDetails)).to.have.length(1);
        expect(onLoadStub.called).is.equal(true);
    });
});
