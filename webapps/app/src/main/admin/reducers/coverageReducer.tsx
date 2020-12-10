import {CoverageUploadStatus, CoverageTypes, CoverageUploadState, CoverageAction} from "../actionTypes/CoverageTypes";
import {CoverageUploadMetadata} from "../../shared/models/Generated";

export interface CoverageState {
    uploadState: CoverageUploadState
    coverageUploadMetadata: CoverageUploadMetadata[]
}

export const coverageInitialState: CoverageState = {
    uploadState: {status: CoverageUploadStatus.off, errors: []},
    coverageUploadMetadata: []
};

export const coverageReducer = (state = coverageInitialState, action: CoverageAction): CoverageState => {
    switch (action.type) {
        case CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED:
            return {...state, uploadState: action.data};
        case CoverageTypes.COVERAGE_UPLOAD_METADATA_FETCHED:
            return {...state, coverageUploadMetadata: action.data};
        default:
            return state;
    }
};

