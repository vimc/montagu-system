import * as React from "react";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {VersionList} from "./VersionList";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {MainMenu} from "../MainMenu/MainMenu";

export interface ViewVersionsPageProps {
    name: string;
}

export class ViewVersionsPage extends ReportingPageWithHeader<ViewVersionsPageProps> {
    load() {
        super.load();
        reportActions.setCurrentReport(this.props.location.params.name);
        reportStore.fetchVersions().catch(doNothing);
    }

    title(): JSX.Element {
        return <span>Select a version of {this.props.location.params.name}</span>;
    }

    name(): string {
        const s = reportStore.getState();
        return s.currentReport;
    }

    urlFragment(): string {
        return `${this.name()}/`;
    }

    parent(): IPageWithParent {
        return new MainMenu();
    }

    renderPageContent() {
        return <VersionList />;
    }
}