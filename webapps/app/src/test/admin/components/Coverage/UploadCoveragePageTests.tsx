import {Sandbox} from "../../../Sandbox";
import {createMockAdminStore, createMockStore} from "../../../mocks/mockStore";
import {shallow} from "enzyme";
import * as React from "react";
import {UploadCoverage} from "../../../../main/admin/components/Touchstones/Coverage/UploadCoverage";
import {mockMatch} from "../../../mocks/mocks";
import {PageArticle} from "../../../../main/shared/components/PageWithHeader/PageArticle";
import {CoveragePage} from "../../../../main/admin/components/Touchstones/Coverage/CoveragePage";
import {InternalLink} from "../../../../main/shared/components/InternalLink";
import {coveragePageActionCreators} from "../../../../main/admin/actions/pages/CoveragePageActionCreators";
import {TouchstoneVersionPageLocationProps} from "../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";
import {FileDownloadLink} from "../../../../main/shared/components/FileDownloadLink";

describe("Upload Coverage Page tests", () => {
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
        const onLoadStub = sandbox.setStubReduxAction(coveragePageActionCreators, "onLoad");
        const rendered = shallow(<CoveragePage match={testMatch}/>, {context: {store}}).dive().dive();
        const pageArticle = rendered.find(PageArticle);
        expect(onLoadStub.mock.calls.length).toBe(1);
        expect(pageArticle.props().title).toBe("Upload coverage for touchstone version touchstone-1");
        expect(pageArticle.find(UploadCoverage).length).toBe(1);
        expect(pageArticle.find(FileDownloadLink).prop("href")).toBe("/coverage/template/");
        expect(pageArticle.find(FileDownloadLink).childAt(0).text()).toBe("Download template");
    })
});
