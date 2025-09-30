import {Dispatch} from "redux";

import FormData = require("form-data");
import {AdminAppState} from "../reducers/adminAppReducers";
import {CoverageTypes, CoverageUploadStatus} from "../actionTypes/CoverageTypes";
import {CoverageService} from "../services/CoverageService";
import {Result} from "../../shared/models/APITypes";

export const coverageActionCreators = {
    uploadCoverage(data: FormData) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
                data: {status: CoverageUploadStatus.in_progress, errors: []}
            });

            const touchstone = getState().touchstones.currentTouchstoneVersion;

            const result: Result = await (new CoverageService(dispatch, getState))
                .uploadCoverage(touchstone.id, data);

            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
                data: {status: CoverageUploadStatus.completed, errors: result.errors || []}
            });

            dispatch(this.getCoverageMetadata(touchstone.id));
        }
    },

    getCoverageMetadata(touchstoneVersionId: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {

            const result: Result = await (new CoverageService(dispatch, getState))
                .fetchCoverageMetadata(touchstoneVersionId);

            dispatch({
                type: CoverageTypes.COVERAGE_UPLOAD_METADATA_FETCHED,
                data: result || []
            });
        }
    }
};
