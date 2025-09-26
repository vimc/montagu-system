import {coverageVariablesPageActionCreators} from "../../../../main/admin/actions/pages/CoverageVariablesPageActionCreators";
import {coveragePageActionCreators} from "../../../../main/admin/actions/pages/CoveragePageActionCreators";

describe("coverageVariablesPageActionCreators", () => {

    it("creates breadcrumbs", () => {
        const result = coverageVariablesPageActionCreators.createBreadcrumb();
        expect(result.urlFragment).toEqual("coverage-variables/");
        expect(result.name).toEqual("Coverage variables");
    });

    it("has correct title", () => {
        expect(coverageVariablesPageActionCreators.title()).toEqual("Coverage variables");
    });

    it("has correct parent", () => {
        expect(coverageVariablesPageActionCreators.parent).toEqual(coveragePageActionCreators);
    });
});
