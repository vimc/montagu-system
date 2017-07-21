import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { RemoteContent } from "../../shared/models/RemoteContent";
import StoreModel = AltJS.StoreModel;
import {reportActions} from "../actions/ReportActions";
import {ReportSource} from "../sources/ReportSource";
import {ILookup} from "../../shared/models/Lookup";
import {Version} from "../../shared/models/Report";

export interface ReportStoreState extends RemoteContent {
    reports: string[];
    versions: ILookup<string[]>;
    currentReport: string;
    currentVersion: string;
    versionDetails: ILookup<Version>;
}

export interface ReportStoreInterface extends AltJS.AltStore<ReportStoreState> {
    fetchReports(): Promise<string[]>;
    fetchVersions(): Promise<string[]>;
    fetchVersionDetails(): Promise<Version>;
}

class ReportStore
    extends AbstractStore<ReportStoreState, ReportStoreInterface> {
    reports: string[];
    versions: ILookup<string[]>;
    versionDetails: ILookup<Version>;
    currentReport: string;
    currentVersion: string;
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchReports: reportActions.beginFetchReports,
            handleUpdateReports: reportActions.updateReports,
            handleSetCurrentReport: reportActions.setCurrentReport,

            handleBeginFetchVersions: reportActions.beginFetchVersions,
            handleUpdateVersions: reportActions.updateVersions,
            handleSetCurrentVersion: reportActions.setCurrentVersion,

            handleBeginFetchVersionDetails: reportActions.beginFetchVersionDetails,
            handleUpdateVersionDetails: reportActions.updateVersionDetails
        });
        this.registerAsync(new ReportSource());
    }

    initialState(): ReportStoreState {
        return {
            reports: [],
            versions: {},
            currentReport: null,
            currentVersion: null,
            versionDetails: {},
            ready: false
        };
    }

    handleBeginFetchReports() {
        this.ready = false;
        this.reports = [];
    }

    handleUpdateReports(reports: string[]) {
        this.reports = reports;
        this.ready = true;
    }

    handleSetCurrentReport(name: string) {

        this.currentReport = name;
    }

    handleBeginFetchVersions() {
        this.ready = false;
        delete this.versions[this.currentReport];
    }

    handleUpdateVersions(versions: string[]) {
        this.versions[this.currentReport] = versions;
        this.ready = true;
    }

    handleSetCurrentVersion(version: string) {
        this.currentVersion = version;
    }

    handleBeginFetchVersionDetails(){
        this.ready = false;
        delete this.versionDetails[this.currentVersion];
    }

    handleUpdateVersionDetails(versionDetails: Version){
        this.versionDetails[this.currentVersion] = versionDetails;
        this.ready = true;

    }


}

export const reportStore = alt.createStore<ReportStoreState>(ReportStore as StoreModel<ReportStoreState>) as ReportStoreInterface;