export enum CoverageTypes {
    COVERAGE_UPLOAD_STATE_CHANGED = "COVERAGE_UPLOAD_STATE_CHANGED",
}

export enum CoverageUploadStatus {
    off = 'off' ,
    in_progress = 'in_progress' ,
    completed = 'completed'
}

export interface CoverageUploadState {
    status: CoverageUploadStatus,
    errors: Error[]
}

export interface CoverageUploadStateChanged{
    type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
    data: CoverageUploadState
}

export type CoverageAction =
    | CoverageUploadStateChanged

