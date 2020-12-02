import {coverageInitialState, coverageReducer} from "../../../main/admin/reducers/coverageReducer";
import {CoverageTypes, CoverageUploadStatus} from "../../../main/admin/actionTypes/CoverageTypes";

describe("coverageReducer", () => {
    it("updates upload coverage state", () => {
        const errors = [{name: "test name", message: "test message"}];
        const data = {status: CoverageUploadStatus.completed, errors};
        const result = coverageReducer(coverageInitialState,
            {type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED, data}) ;
        expect(result.uploadState.status).toBe(CoverageUploadStatus.completed);
        expect(result.uploadState.errors).toBe(errors);
    });

    it("updates coverage upload metadata state", () => {
        const metadata = ["TEST META 1", "TEST META 2"] as any;
        const result = coverageReducer(coverageInitialState,
            {type: CoverageTypes.COVERAGE_UPLOAD_METADATA_FETCHED, data: metadata});
        expect(result.coverageUploadMetadata).toBe(metadata);
    });
});
