import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {VersionDetails} from "./VersionDetails";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {appSettings} from "../../../shared/Settings";
import {MainMenu} from "../MainMenu/MainMenu";

export interface VersionInfoPageProps {
    report: string;
    version: string;
}

export class VersionInfoPage extends ReportingPageWithHeader<VersionInfoPageProps> {
    constructor(props: PageProperties<VersionInfoPageProps>) {
        super(props);
        this.changeVersion = this.changeVersion.bind(this);
    }

    load() {
        const p = this.props.location.params;
        this.loadVersion(p.report, p.version);
    }

    loadVersion(report: string, version: string) {
        reportActions.setCurrentReport(report);
        reportStore.fetchVersions().catch(doNothing).then(() => {
            reportActions.setCurrentVersion(version);
            reportStore.fetchVersionDetails().catch(doNothing).then(() => {
                super.load();
            });
        });
    }

    changeVersion(version: string) {
        const report = this.props.location.params.report;
        this.props.router.redirectTo(`${appSettings.publicPath}/${report}/${version}/`, false);
        this.loadVersion(report, version);
    }

    parent() {
        return new MainMenu();
    }

    name() {
        return this.props.location.params.version;
    }

    urlFragment() {
        return `${this.name()}/`;
    }

    renderPageContent() {
        return <VersionDetails onChangeVersion={this.changeVersion} />;
    }
}