import {RecursivePartial} from "../../../mocks/mockStates";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";
import {coveragePageActionCreators} from "../../../../main/admin/actions/pages/CoveragePageActionCreators";
import {AdminAppState} from "../../../../main/admin/reducers/adminAppReducers";

describe("coveragePageActionCreators", () => {

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
});
