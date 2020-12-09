
import {createMockAdminStore} from "../../mocks/mockStore";
import {CoverageService} from "../../../main/admin/services/CoverageService";
import {Sandbox} from "../../Sandbox";
import {AdminAppState} from "../../../main/admin/reducers/adminAppReducers";
import FormData = require("form-data");

describe('Upload Coverage service tests', () => {
    const sandbox = new Sandbox();
    const store = createMockAdminStore();

    afterEach(() => {
        sandbox.restore();
    });

    it('uploads coverage', () => {
        const uploadCoverageService = new CoverageService(store.dispatch, store.getState as () => AdminAppState);

        const postStub = sandbox.setStubFunc(uploadCoverageService, "post", ()=>{
            return Promise.resolve();
        });

        const data = {} as FormData;
        uploadCoverageService.uploadCoverage("touchstone-1", data);

        expect(postStub.mock.calls.length).toEqual(1);
        expect(postStub.mock.calls[0][0]).toEqual("/touchstones/touchstone-1/coverage/");
        expect(postStub.mock.calls[0][1]).toBe(data);
    });

    it('fetches coverage metadata', () => {
        const coverageService = new CoverageService(store.dispatch, store.getState as () => AdminAppState);
        const getStub = sandbox.setStubFunc(coverageService, "get", ()=>{
            return ["TEST META"];
        });

        const result = coverageService.fetchCoverageMetadata("touchstone-1");
        expect(result).toStrictEqual(["TEST META"]);

        expect(getStub.mock.calls.length).toEqual(1);
        expect(getStub.mock.calls[0][0]).toEqual("/touchstones/touchstone-1/coverage/meta/");
    });

});
