import {Dispatch} from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {RunParametersService} from "../services/RunParametersService";
import {
    RunParametersSetsFetched,
    RunParametersSetUploadStatus,
    RunParametersTypes,
    RunParametersUploadStatus
} from "../actionTypes/RunParametersTypes";
import {ModelRunParameterSet, Result} from "../../shared/models/Generated";
import FormData = require("form-data");
import {AdminAppState} from "../reducers/adminAppReducers";
import {CoverageTypes, CoverageUploadStatus} from "../actionTypes/CoverageTypes";

export const coverageActionCreators = {
    uploadCoverage(data: FormData) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
                data: {status: CoverageUploadStatus.uploading, errors: []}
            });
            //dispatch({
            //    type: RunParametersTypes.RUN_PARAMETERS_SET_UPLOAD_STATUS,
            //    data: {status: RunParametersUploadStatus.in_progress, errors: null}
            //});

            //const group = getState().groups.currentUserGroup;
            //const touchstone = getState().touchstones.currentTouchstoneVersion;

            //const result: Result = await (new RunParametersService(dispatch, getState))
            //    .uploadSet(group.id, touchstone.id, data);

            alert("This is where we will upload coverage!!");
            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
                data: {status: CoverageUploadStatus.completed, errors: []}
            });
            //if (result && !result.errors) {
                //dispatch(this.refreshParameterSets());
            //}
        }
    },

    resetUploadStatus() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
                data: {status: CoverageUploadStatus.off, errors: []}
            });
        }
    }

};
