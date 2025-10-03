import {CoverageUploadMetadata} from "../../shared/models/APITypes";

export enum CoverageTypes {
    COVERAGE_UPLOAD_STATE_CHANGED = "COVERAGE_UPLOAD_STATE_CHANGED",
    COVERAGE_UPLOAD_METADATA_FETCHED = "COVERAGE_UPLOAD_METADATA_FETCHED",
}

export enum CoverageUploadStatus {
    off = 'off',
    in_progress = 'in_progress',
    completed = 'completed'
}

export interface CoverageUploadState {
    status: CoverageUploadStatus,
    errors: Error[]
}

export interface CoverageUploadStateChanged {
    type: CoverageTypes.COVERAGE_UPLOAD_STATE_CHANGED,
    data: CoverageUploadState
}

export interface CoverageUploadMetadataFetched {
    type: CoverageTypes.COVERAGE_UPLOAD_METADATA_FETCHED,
    data: CoverageUploadMetadata[]
}

export type CoverageAction =
    | CoverageUploadStateChanged
    | CoverageUploadMetadataFetched
