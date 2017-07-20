import * as React from "react";
import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import {ReportListItem} from "./ReportListItem";

interface ReportProps extends RemoteContent {
    reports: string[]
}

export class ReportListComponent extends RemoteContentComponent<ReportProps> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(): ReportProps {
        const s = reportStore.getState();
        return {
            reports: s.reports,
            ready: s.ready
        };
    }

    renderContent(props: ReportProps) {
        const items = props.reports
            .sort((a, b) => a.localeCompare(b))
            .map((name) => <ReportListItem key={ name } name={ name } />);

        return <ul>
            {items}
        </ul>;
    }
}

export const ReportList = connectToStores(ReportListComponent);