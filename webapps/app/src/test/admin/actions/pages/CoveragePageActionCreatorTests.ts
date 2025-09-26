import {RecursivePartial} from "../../../mocks/mockStates";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";
import {coveragePageActionCreators} from "../../../../main/admin/actions/pages/CoveragePageActionCreators";
import {AdminAppState} from "../../../../main/admin/reducers/adminAppReducers";
import {coverageActionCreators} from "../../../../main/admin/actions/coverageActionCreators";
import {createMockAdminStore} from "../../../mocks/mockStore";
import {Sandbox} from "../../../Sandbox";

describe("coveragePageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("creates breadcrumbs", () => {
        const result = coveragePageActionCreators.createBreadcrumb(null);
        expect(result.urlFragment).toEqual("coverage/");
        expect(result.name).toEqual("Coverage");
    });

    it("has correct title", () => {
        const state: RecursivePartial<AdminAppState> = {
            touchstones: {
                currentTouchstoneVersion: mockTouchstoneVersion()
            }
        };
        expect(coveragePageActionCreators.title(state as AdminAppState)).toEqual("Upload coverage for touchstone version touchstone-1");
    });

    it("loadData gets coverage metadata", async () => {
        const getMetadataStub = sandbox.setStubReduxAction(coverageActionCreators, "getCoverageMetadata");

        const store = createMockAdminStore();
        await store.dispatch(coveragePageActionCreators.loadData({
            touchstoneId: "touchstone",
            touchstoneVersionId: "touchstone-1"
        }));
        expect(getMetadataStub.mock.calls.length).toEqual(1);
        expect(getMetadataStub.mock.calls[0]).toEqual(["touchstone-1"]);
    });
});
