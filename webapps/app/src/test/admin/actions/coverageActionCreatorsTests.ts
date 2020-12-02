import {Sandbox} from "../../Sandbox";
import {mockTouchstoneVersion} from "../../mocks/mockModels";
import {createMockAdminStore} from "../../mocks/mockStore";
import {coverageActionCreators} from "../../../main/admin/actions/coverageActionCreators";
import {CoverageService} from "../../../main/admin/services/CoverageService";
import FormData = require("form-data");
import {CoverageTypes, CoverageUploadStatus} from "../../../main/admin/actionTypes/CoverageTypes";

describe("coverageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const testTouchstoneVersion = mockTouchstoneVersion();

    const getStore = () => createMockAdminStore({
        touchstones: { currentTouchstoneVersion: testTouchstoneVersion }
    });

    const serviceStub = (data: any) => {
        return () => {
            return Promise.resolve(data);
        }
    };

    it("calls upload service and updates coverage upload state", async () =>  {
        const store = getStore();
        const data = {} as FormData;
        const errors = [] as Error[];
        const uploadServiceStub = sandbox.setStubFunc(CoverageService.prototype, "uploadCoverage", serviceStub({errors}));
        const getCoverageMetadataStub = sandbox.setStubFunc(coverageActionCreators, "getCoverageMetadata", () => {
            return async () => {};
        });

        await store.dispatch(coverageActionCreators.uploadCoverage(data));

        expect(uploadServiceStub.mock.calls.length).toEqual(1);
        expect(uploadServiceStub.mock.calls[0][0]).toEqual("touchstone-1");
        expect(uploadServiceStub.mock.calls[0][1]).toBe(data);

        expect(getCoverageMetadataStub.mock.calls.length).toEqual(1);
        expect(uploadServiceStub.mock.calls[0][0]).toEqual("touchstone-1");

        const actions = store.getActions();
        expect(actions.length).toBe(2);

        expect(actions[0].type).toBe(CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED);
        expect(actions[0].data.status).toBe(CoverageUploadStatus.in_progress);
        expect(actions[1].data.errors).toEqual([]);

        expect(actions[1].type).toBe(CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED);
        expect(actions[1].data.status).toBe(CoverageUploadStatus.completed);
        expect(actions[1].data.errors).toBe(errors);
    });

    it("fetches coverage metadata and updates state", async () => {
        const store = getStore();
        const metadata = ["TEST META 1", "TEST META 2"];
        const fetchServiceStub = sandbox.setStubFunc(CoverageService.prototype, "fetchCoverageMetadata", serviceStub(metadata));

       await store.dispatch(coverageActionCreators.getCoverageMetadata(testTouchstoneVersion.id));

        expect(fetchServiceStub.mock.calls.length).toEqual(1);
        expect(fetchServiceStub.mock.calls[0][0]).toBe(testTouchstoneVersion.id);

        const actions = store.getActions();
        expect(actions.length).toBe(1);
        expect(actions[0]).toStrictEqual({type: CoverageTypes.COVERAGE_UPLOAD_METADATA_FETCHED, data: metadata});
    });
});
