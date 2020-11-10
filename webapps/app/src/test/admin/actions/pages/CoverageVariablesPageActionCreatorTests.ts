import {coverageVariablesPageActionCreators} from "../../../../main/admin/actions/pages/CoverageVariablesPageActionCreators";

describe("coverageVariablesPageActionCreators", () => {

    it("creates breadcrumbs", () => {
        const result = coverageVariablesPageActionCreators.createBreadcrumb();
        expect(result.urlFragment).toEqual("coverage-variables/");
        expect(result.name).toEqual("Coverage variables");
    });

    it("has correct title", () => {
        expect(coverageVariablesPageActionCreators.title()).toEqual("Coverage variables");
    });
});
