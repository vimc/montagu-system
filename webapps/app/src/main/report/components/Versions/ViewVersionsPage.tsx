import * as React from "react";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {VersionList} from "./VersionList";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";

export interface ViewVersionsPageProps {
    name: string;
}

export class ViewVersionsPage extends ReportingPageWithHeader<ViewVersionsPageProps> {
    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            reportActions.setCurrentReport(this.props.location.params.name);
            reportStore.fetchVersions().catch(doNothing);
        });
    }

    name() {
        return `Select a version of ${this.props.location.params.name}`;
    }

    renderPageContent() {
        return <VersionList />;
    }
}