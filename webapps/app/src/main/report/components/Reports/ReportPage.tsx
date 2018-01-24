import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportDetails} from "./ReportDetails";
import {reportStore} from "../../stores/ReportStore";
import {doNothing} from "../../../shared/Helpers";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {appSettings} from "../../../shared/Settings";
import {MainMenu} from "../MainMenu/MainMenu";
import {ReportPageTitle} from "./ReportPageTitle";
import { Page } from "../../../shared/components/PageWithHeader/Page";
import {Version} from "../../../shared/models/reports/Report";

export interface ReportPageProps {
    report: string;
    version: string;
}

export class ReportPage extends ReportingPageWithHeader<ReportPageProps> {
    constructor(props: PageProperties<ReportPageProps>) {
        super(props);
        this.changeVersion = this.changeVersion.bind(this);
    }

    load(props: ReportPageProps): Promise<Version> {
        return this.loadParent(props).then(() => {
            return this.loadVersion(props.report, props.version);
        });
    }

    loadVersion(report: string, version: string): Promise<Version> {
        reportActions.setCurrentReport(report);
        return reportStore.fetchVersions().catch(doNothing).then(() => {
            reportActions.setCurrentVersion(version);
            return reportStore.fetchVersionDetails()
        });
    }

    changeVersion(version: string): Promise<Version> {
        const report = this.props.location.params.report;
        this.props.router.redirectTo(`${appSettings.publicPath}/${report}/${version}/`, false);
        return this.loadVersion(report, version);
    }

    parent() {
        return new MainMenu();
    }

    title() {
        return <ReportPageTitle />;
    }

    name() {
        const params = this.props.location.params;
        return `${params.report} (${params.version})`;
    }

    urlFragment() {
        const params = this.props.location.params;
        return `${params.report}/${params.version}/`;
    }

    render() :JSX.Element {
        return <Page page={this}>
            <ReportDetails onChangeVersion={this.changeVersion} />
        </Page>;
    }
}