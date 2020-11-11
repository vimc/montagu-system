import {Sandbox} from "../../../Sandbox";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {shallow} from "enzyme";
import * as React from "react";
import {mockMatch} from "../../../mocks/mocks";
import {PageArticle} from "../../../../main/shared/components/PageWithHeader/PageArticle";
import {TouchstoneVersionPageLocationProps} from "../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";
import {coverageVariablesPageActionCreators} from "../../../../main/admin/actions/pages/CoverageVariablesPageActionCreators";
import {CoverageVariablesPage} from "../../../../main/admin/components/Touchstones/Coverage/CoverageVariablesPage";

describe("Coverage Variables Page tests", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("renders page component, title and sub components", () => {
        const testMatch = mockMatch<TouchstoneVersionPageLocationProps>({
            touchstoneId: "touchstone",
            touchstoneVersionId: "touchstone-1"
        });
        const store = createMockAdminStore({
            touchstones: {currentTouchstoneVersion: mockTouchstoneVersion()}
        });
        const onLoadStub = sandbox.setStubReduxAction(coverageVariablesPageActionCreators, "onLoad");
        const rendered = shallow(<CoverageVariablesPage match={testMatch}/>, {context: {store}}).dive().dive();
        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.mock.calls.length).toBe(1);
        expect(pageArticle.props().title).toBe("Coverage variables");
        expect(pageArticle.find("ul").length).toBe(1);
    })
});
