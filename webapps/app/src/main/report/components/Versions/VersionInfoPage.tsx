import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {VersionDetails} from "./VersionDetails";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {ViewVersionsPage} from "./ViewVersionsPage";

export interface VersionInfoPageProps {
    report: string;
    version: string;
}

export class VersionInfoPage extends ReportingPageWithHeader<VersionInfoPageProps> {
    load() {
        super.load();
        reportActions.setCurrentReport(this.props.location.params.report);
        reportActions.setCurrentVersion(this.props.location.params.version);
        reportStore.fetchVersionDetails().catch(doNothing);
    }

    name(): string {
        const s = reportStore.getState();
        return s.currentVersion;
    }

    urlFragment(): string {
        const s = reportStore.getState();
        return `${s.currentVersion}/`;
    }

    parent(): IPageWithParent {
        return new ViewVersionsPage();
    }

    renderPageContent() {
        return <VersionDetails />;
    }
}