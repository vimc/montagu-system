import * as React from "react";
import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import {VersionListItem} from "./VersionListItem";

interface ReportProps extends RemoteContent {
    versions: string[],
    report: string
}

export class VersionListComponent extends RemoteContentComponent<ReportProps> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(): ReportProps {

        const s = reportStore.getState();

        return {
            versions: s.versions[s.currentReport],
            report: s.currentReport,
            ready: s.versions[s.currentReport] != null
        };
    }

    renderContent(props: ReportProps) {

        const items = props.versions
            .sort((a, b) => a.localeCompare(b))
            .map((name) => <VersionListItem key={ name } report={ props.report } version={ name } />);

        return <ul>
            {items}
        </ul>;
    }
}

export const VersionList = connectToStores(VersionListComponent);