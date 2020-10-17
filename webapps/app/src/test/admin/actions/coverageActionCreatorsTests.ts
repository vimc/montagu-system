import {Sandbox} from "../../Sandbox";
import {mockTouchstoneVersion} from "../../mocks/mockModels";
import {createMockAdminStore} from "../../mocks/mockStore";
import {coverageActionCreators} from "../../../main/admin/actions/coverageActionCreators";
import {UploadCoverageService} from "../../../main/admin/services/UploadCoverageService";
import FormData = require("form-data");
import {CoverageTypes, CoverageUploadStatus} from "../../../main/admin/actionTypes/CoverageTypes";

describe("coverageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const testTouchstoneVersion = mockTouchstoneVersion();

    it("calls upload service and updates coverage upload state", async () => {
        const store = createMockAdminStore({
            touchstones: { currentTouchstoneVersion: testTouchstoneVersion }
        });

        const data = {} as FormData;
        const errors = [] as Error[];
        const serviceStub = sandbox.setStubFunc(UploadCoverageService.prototype, "uploadCoverage", ()=>{
            return Promise.resolve({errors});
        });
        await store.dispatch(coverageActionCreators.uploadCoverage(data));

        expect(serviceStub.mock.calls.length).toEqual(1);
        expect(serviceStub.mock.calls[0][0]).toEqual("touchstone-1");
        expect(serviceStub.mock.calls[0][1]).toBe(data);

        const actions = store.getActions();
        expect(actions.length).toBe(2);

        expect(actions[0].type).toBe(CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED);
        expect(actions[0].data.status).toBe(CoverageUploadStatus.in_progress);
        expect(actions[1].data.errors).toEqual([]);

        expect(actions[1].type).toBe(CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED);
        expect(actions[1].data.status).toBe(CoverageUploadStatus.completed);
        expect(actions[1].data.errors).toBe(errors);
    });
});
