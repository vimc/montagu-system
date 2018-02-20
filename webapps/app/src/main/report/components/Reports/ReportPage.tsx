import * as React from "react";
import {reportActions} from "../../actions/ReportActions";
import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportDetails} from "./ReportDetails";
import {reportStore} from "../../stores/ReportStore";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {appSettings} from "../../../shared/Settings";
import {MainMenu} from "../MainMenu/MainMenu";
import {ReportPageTitle} from "./ReportPageTitle";
import {Version} from "../../../shared/models/reports/Report";
import {Sidebar} from "./Sidebar";
import {PageHeader} from "../../../shared/components/PageWithHeader/PageHeader";

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
        reportActions.setCurrentReport(props.report);
        return reportStore.fetchVersions().then(() => {
            reportActions.setCurrentVersion(props.version);
            return reportStore.fetchVersionDetails();
        });
    }

    changeVersion(version: string): Promise<Version> {
        const params = this.props.location.params;
        const report = params.report;
        this.props.router.redirectTo(`${appSettings.publicPath}/${report}/${version}/`, false);
        return this.load({
            report: report,   // same report as in old URL
            version: version  // new version from function argument
        });
    }

    parent() {
        return new MainMenu();
    }

    title() {
        return <ReportPageTitle/>;
    }

    name() {
        const params = this.props.location.params;
        return `${params.report} (${params.version})`;
    }

    urlFragment() {
        const params = this.props.location.params;
        return `${params.report}/${params.version}/`;
    }

    render(): JSX.Element {
        return <div>
            <PageHeader siteTitle={this.siteTitle()}/>
            <div className={"container-fluid pt-4 sm-pt-5"}>
                <div className="row flex-xl-nowrap">
                    <div className="col-12 col-md-4 col-xl-2">
                        <Sidebar/>
                    </div>
                    <div className={"col-12 col-sm-10 col-md-8 pt-4 pt-md-1"}>
                        <ReportDetails onChangeVersion={this.changeVersion}/>
                    </div>
                </div>
            </div>
        </div>
    }
}