export interface ReportName {
    name: string;
}

export interface VersionName {
    report: string;
    version: string;
}

export interface Version{

    name: string;
    id: string;
    date: string;
    data: {};
    parameters: {},
    resources: {};
    artefacts: {};

}