import { expect } from "chai";

import { runParametersReducer, runParametersInitialState } from "../../../main/contrib/reducers/runParametersReducer";
import {
    RunParametersTokenData, RunParametersTypes, RunParametersUploadStatus, RunParametersUploadStatusData
} from "../../../main/contrib/actionTypes/RunParametersTypes";
import {mockModelRunParameterSet} from "../../mocks/mockModels";

describe('Run Parameters reducer tests', () => {

    const testModelRunParametersSet = mockModelRunParameterSet();
    const testModelRunParametersToken: RunParametersTokenData = {
        id: 2,
        token: "test-token"
    };
    const testModelRunParametersInProgress: RunParametersUploadStatusData = {
        status: RunParametersUploadStatus.in_progress,
        errors: null
    };
    const testModelRunParametersCompletedNoErrors: RunParametersUploadStatusData = {
        status: RunParametersUploadStatus.completed,
        errors: null
    };
    const testModelRunParametersCompletedWithErrors: RunParametersUploadStatusData = {
        status: RunParametersUploadStatus.completed,
        errors: [new Error('test')]
    }

    it('sets fetched model run parameters set', () => {
        expect(runParametersReducer(undefined, {
            type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED,
            data: [testModelRunParametersSet]
        })).to.eql({...runParametersInitialState, sets: [testModelRunParametersSet]});
    });

    it('sets empty fetched model run parameters set', () => {
        expect(runParametersReducer(undefined, {
            type: RunParametersTypes.RUN_PARAMETERS_SETS_FETCHED,
            data: null
        })).to.eql(runParametersInitialState);
    });

    it('sets fetched token', () => {
        expect(runParametersReducer(undefined, {
            type: RunParametersTypes.RUN_PARAMETERS_TOKEN_FETCHED,
            data: testModelRunParametersToken
        })).to.eql({...runParametersInitialState, tokens: {...{[testModelRunParametersToken.id]: testModelRunParametersToken.token}}});
    });

    it('sets upload status in progress', () => {
        expect(runParametersReducer(undefined, {
            type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
            data: testModelRunParametersInProgress
        })).to.eql({...runParametersInitialState, uploadStatus: {status: "in_progress", errors: null}});
    });

    it('sets upload status completed no errors', () => {
        expect(runParametersReducer(undefined, {
            type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
            data: testModelRunParametersCompletedNoErrors
        })).to.eql({...runParametersInitialState, uploadStatus: {status: "completed", errors: null}});
    });

    it('sets upload status completed with errors', () => {
        expect(runParametersReducer(undefined, {
            type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
            data: testModelRunParametersCompletedWithErrors
        })).to.eql({...runParametersInitialState, uploadStatus: {status: "completed", errors: [new Error('test')]}});
    });

})