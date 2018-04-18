import { expect } from "chai";

import { Sandbox } from "../../Sandbox";
import { runParametersActionCreators } from "../../../main/contrib/actions/runParametersActionCreators";
import { RunParametersService } from "../../../main/contrib/services/RunParametersService";
import {
    RunParametersTypes, RunParametersUploadStatus,
    RunParametersUploadStatusData
} from "../../../main/contrib/actionTypes/RunParametersTypes";
import {createMockStore} from "../../mocks/mockStore";
import {mockModellingGroup, mockModelRunParameterSet, mockTouchstone} from "../../mocks/mockModels";

describe("Run Parameters actions tests", () => {
    const sandbox = new Sandbox();

    const testTouchstone = mockTouchstone();
    const testGroup = mockModellingGroup();
    const testModelRunParametersSet = mockModelRunParameterSet();

    afterEach(() => {
        sandbox.restore();
    });

    it("clears cache for parameters set", (done) => {
        const store = createMockStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstone: testTouchstone }
        });
        sandbox.setStubFunc(RunParametersService.prototype, "clearCacheForGetParameterSets", ()=>{
            return Promise.resolve();
        });
        store.dispatch(runParametersActionCreators.clearCacheForGetParameterSets(testGroup.id, testTouchstone.id));
        setTimeout(() => {
            const actions = store.getActions()
            expect(actions).to.eql([])
            done();
        });
    });

    it("gets parameters set", (done) => {
        const store = createMockStore();
        sandbox.setStubFunc(RunParametersService.prototype, "getParameterSets", ()=>{
            return Promise.resolve([testModelRunParametersSet]);
        });
        store.dispatch(runParametersActionCreators.getParameterSets(testGroup.id, testTouchstone.id));
        setTimeout(() => {
            const actions = store.getActions();
            const expectedPayload = { type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED, data: [testModelRunParametersSet]};
            expect(actions).to.eql([expectedPayload]);
            done();
        });
    });

    it("gets one time token", (done) => {
        const store = createMockStore();
        sandbox.setStubFunc(RunParametersService.prototype, "getOneTimeToken", ()=>{
            return Promise.resolve("test-token");
        });
        store.dispatch(runParametersActionCreators.getOneTimeToken(testGroup.id, testTouchstone.id, testModelRunParametersSet.id));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                { type: RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED, data: {id: testModelRunParametersSet.id, token: "test-token"}},
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

    it("refresh parameters sets", (done) => {
        const store = createMockStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstone: testTouchstone }
        });
        sandbox.setStubFunc(RunParametersService.prototype, "getParameterSets", ()=>{
            return Promise.resolve([testModelRunParametersSet]);
        });
        store.dispatch(runParametersActionCreators.refreshParameterSets());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                { type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED, data: [testModelRunParametersSet] }
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

    it("upload parameters sets successfull", (done) => {
        const store = createMockStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstone: testTouchstone }
        });
        sandbox.setStubFunc(RunParametersService.prototype, "uploadSet", ()=>{
            return Promise.resolve([testModelRunParametersSet]);
        });
        sandbox.setStubFunc(RunParametersService.prototype, "getParameterSets", ()=>{
            return Promise.resolve([testModelRunParametersSet]);
        });
        store.dispatch(runParametersActionCreators.uploadSet({} as FormData));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                {
                    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                    data: {
                        status: RunParametersUploadStatus.in_progress,
                        errors: null,
                    } as RunParametersUploadStatusData
                },
                {
                    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                    data: {
                        status: RunParametersUploadStatus.completed,
                        errors: null,
                    } as RunParametersUploadStatusData
                },
                { type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED, data: [testModelRunParametersSet] }
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

    it("upload parameters sets unsuccessfull", (done) => {
        const store = createMockStore({
            groups: { currentUserGroup: testGroup },
            touchstones: { currentTouchstone: testTouchstone }
        });
        sandbox.setStubFunc(RunParametersService.prototype, "uploadSet", ()=>{
            return Promise.resolve({errors: [new Error('test')]});
        });
        sandbox.setStubFunc(RunParametersService.prototype, "getParameterSets", ()=>{
            return Promise.resolve([testModelRunParametersSet]);
        });
        store.dispatch(runParametersActionCreators.uploadSet({} as FormData));
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                {
                    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                    data: {
                        status: RunParametersUploadStatus.in_progress,
                        errors: null,
                    } as RunParametersUploadStatusData
                },
                {
                    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
                    data: {
                        status: RunParametersUploadStatus.completed,
                        errors: [new Error('test')],
                    } as RunParametersUploadStatusData
                }
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });

    it("reset upload status", (done) => {
        const resetData = {status: RunParametersUploadStatus.off, errors: null} as RunParametersUploadStatusData;
        const store = createMockStore();
        store.dispatch(runParametersActionCreators.resetUploadStatus());
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                { type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS, data: resetData}
            ];
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });


});