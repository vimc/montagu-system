import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {VersionDetails} from "./VersionDetails";
import {reportStore} from "../../stores/ReportStore";

export interface VersionInfoPageProps {
    report: string;
    version: string;
}

export class VersionInfoPage extends ReportingPageWithHeader<VersionInfoPageProps> {
    componentDidMount() {
        super.componentDidMount();
        setTimeout(() => {
            reportActions.setCurrentReport(this.props.location.params.report);
            reportActions.setCurrentVersion(this.props.location.params.version);
            reportStore.fetchVersionDetails();
        });
    }

    name() {
        return this.props.location.params.report;
    }

    renderPageContent() {
        return <VersionDetails />;
    }
}