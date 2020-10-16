import {CoverageUploadStatus, CoverageTypes, CoverageUploadState, CoverageAction} from "../actionTypes/CoverageTypes";

export interface CoverageState {
    uploadState: CoverageUploadState
}

export const coverageInitialState: CoverageState = {
    uploadState: { status: CoverageUploadStatus.off, errors: [] }
};

export const coverageReducer = (state = coverageInitialState, action: CoverageAction): CoverageState => {
    switch (action.type) {
        case CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED:
            return {...state, uploadState: action.data};
        default:
            return state;
    }
};

