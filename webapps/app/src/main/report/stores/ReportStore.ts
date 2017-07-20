import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { RemoteContent } from "../../shared/models/RemoteContent";
import StoreModel = AltJS.StoreModel;
import {reportActions} from "../actions/ReportActions";
import {ReportSource} from "../sources/ReportSource";
import {ILookup} from "../../shared/models/Lookup";

export interface ReportStoreState extends RemoteContent {
    reports: string[];
    versions: ILookup<string[]>;
    currentReport: string;
}

export interface ReportStoreInterface extends AltJS.AltStore<ReportStoreState> {
    fetchReports(): Promise<string[]>;
    fetchVersions(): Promise<string[]>;
}

class ReportStore
    extends AbstractStore<ReportStoreState, ReportStoreInterface> {
    reports: string[];
    versions: ILookup<string[]>;
    currentReport: string;
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchReports: reportActions.beginFetchReports,
            handleUpdateReports: reportActions.updateReports,
            handleBeginFetchVersions: reportActions.beginFetchVersions,
            handleUpdateVersions: reportActions.updateVersions,
            handleSetCurrentReport: reportActions.setCurrentReport
        });
        this.registerAsync(new ReportSource());
    }

    initialState(): ReportStoreState {
        return {
            reports: [],
            versions: {},
            currentReport: null,
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

    handleBeginFetchVersions(name: string) {
        this.ready = false;
        delete this.versions[name];
    }

    handleUpdateVersions(versions: string[]) {
        this.versions[this.currentReport] = versions;
        this.ready = true;
    }


}

export const reportStore = alt.createStore<ReportStoreState>(ReportStore as StoreModel<ReportStoreState>) as ReportStoreInterface;