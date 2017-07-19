import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { RemoteContent } from "../../shared/models/RemoteContent";
import StoreModel = AltJS.StoreModel;
import {reportActions} from "../actions/ReportActions";
import {ReportSource} from "../sources/ReportSource";

export interface ReportStoreState extends RemoteContent {
    reports: string[];
}

export interface ReportStoreInterface extends AltJS.AltStore<ReportStoreState> {
    fetchReports(): Promise<string[]>;
}

class ReportStore
    extends AbstractStore<ReportStoreState, ReportStoreInterface> {
    reports: string[];
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchReports: reportActions.beginFetchReports
        });
        this.registerAsync(new ReportSource());
    }

    initialState(): ReportStoreState {
        return {
            reports: [],
            ready: false
        };
    }

    handleBeginFetchReports() {
        this.ready = false;
        this.reports = [];
    }

}

export const reportStore = alt.createStore<ReportStoreState>(ReportStore as StoreModel<ReportStoreState>) as ReportStoreInterface;