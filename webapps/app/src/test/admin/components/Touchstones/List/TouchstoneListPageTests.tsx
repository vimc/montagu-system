
import {Sandbox} from "../../../../Sandbox";
import {TouchstoneListPage} from "../../../../../main/admin/components/Touchstones/List/TouchstoneListPage";
import * as React from "react";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {TouchstoneList} from "../../../../../main/admin/components/Touchstones/List/TouchstoneList";
import {touchstoneListPageActionCreators} from "../../../../../main/admin/actions/pages/TouchstoneListPageActionCreators";
import {mockPageProperties, shallowRenderPage} from "../../../../mocks/mockPages";

describe("TouchstoneListPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

   it("calls onLoad when loaded", () => {
       const onLoadStub = sandbox.setStubReduxAction(touchstoneListPageActionCreators, "onLoad");
       const rendered = shallowRenderPage(<TouchstoneListPage {...mockPageProperties()} />);
       expect(rendered.find(PageArticle).find(TouchstoneList)).toHaveLength(1);
       expect(onLoadStub.mock.calls.length).toBe(1);
   });
});