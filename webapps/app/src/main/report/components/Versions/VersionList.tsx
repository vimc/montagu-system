import * as React from "react";
import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import {VersionListItem} from "./VersionListItem";

export interface VersionListProps extends RemoteContent {
    versions: string[],
    report: string
}

export class VersionListComponent extends RemoteContentComponent<VersionListProps> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(): VersionListProps {

        const s = reportStore.getState();

        return {
            versions: s.versions[s.currentReport],
            report: s.currentReport,
            ready: s.versions[s.currentReport] != null
        };
    }

    renderContent(props: VersionListProps) {

        const items = props.versions
            .sort((a, b) => a.localeCompare(b))
            .map((name) => <VersionListItem key={ name } report={ props.report } version={ name } />);

        return <ul>
            {items}
        </ul>;
    }
}

export const VersionList = connectToStores(VersionListComponent);