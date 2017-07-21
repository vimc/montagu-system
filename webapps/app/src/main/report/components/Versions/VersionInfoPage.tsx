import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";

export interface VersionInfoPageProps {
    report: string;
    version: string;
}

export class ViewVersionsPage extends ReportingPageWithHeader<VersionInfoPageProps> {
    componentDidMount() {
        setTimeout(() => {
            reportActions.setCurrentReport(this.props.location.params.report);
            reportActions.setCurrentVersion(this.props.location.params.version);
            reportActions.beginFetchVersionDetails();
        });
    }

    title() {
        return <span>{this.props.location.params.report}: {this.props.location.params.version}</span>;
    }

    renderPageContent() {
        return <div></div>;
    }
}