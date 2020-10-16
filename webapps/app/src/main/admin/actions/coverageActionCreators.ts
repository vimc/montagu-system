import {Dispatch} from "redux";

import FormData = require("form-data");
import {AdminAppState} from "../reducers/adminAppReducers";
import {CoverageTypes, CoverageUploadStatus} from "../actionTypes/CoverageTypes";
import {UploadCoverageService} from "../services/UploadCoverageService";
import {Result} from "../../shared/models/Generated";

export const coverageActionCreators = {
    uploadCoverage(data: FormData) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
                data: {status: CoverageUploadStatus.in_progress, errors: []}
            });

            const touchstone = getState().touchstones.currentTouchstoneVersion;

            const result: Result = await (new UploadCoverageService(dispatch, getState))
                .uploadCoverage(touchstone.id, data);

            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
                data: {status: CoverageUploadStatus.completed, errors: result.errors || []}
            });
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
