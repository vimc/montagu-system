// This is the raw response that comes back from the reporting API's get report status endpoint. It does not include the
//report name, though it does include the key
export interface RunningReportStatusUpdate {
    key: string;
    status: string;
    version: string;
    output: object;
}

// This is the object we store in the state, containing both name and key (used to retrieve status updates)
export interface RunningReportStatus extends RunningReportStatusUpdate {
    name: string;
}

export enum RunningReportStatusValues  {
    RUNNING_REPORT_STATUS_STARTED = "started",
    RUNNING_REPORT_STATUS_SUCCESS = "success"
}