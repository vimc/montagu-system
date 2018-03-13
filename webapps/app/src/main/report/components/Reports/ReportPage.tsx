import * as React from "react";
import {Action, Dispatch} from "redux";
import {connect} from 'react-redux';

import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportDetails} from "./ReportDetails";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";
import {appSettings} from "../../../shared/Settings";
import {ReportsListPage} from "../ReportsList/ReportsListPage";
import {reportPageActions} from "../../actions/reportPageActions";
import {ReportTabEnum, Sidebar} from "../Sidebar/Sidebar";
import {ReportingPageHeader} from "../ReportingPageHeader";
import {ReportDownloads} from "./ReportDownloads";

export interface ReportPageProps {
    report: string;
    version: string;
}

const hashToTab = (hash: string): ReportTabEnum => {
    switch (hash) {
        case "#downloads":
            return ReportTabEnum.DOWNLOAD;
        case "#changelog":
            return ReportTabEnum.CHANGELOG;
        case "#report":
        default:
            return ReportTabEnum.REPORT;
    }
};

export class ReportPageComponent extends ReportingPageWithHeader<ReportPageProps> {
    constructor(props: PageProperties<ReportPageProps>) {
        super(props);
        this.changeVersion = this.changeVersion.bind(this);
    }

    componentDidMount() {
        this.loadVersion();
    }

    changeVersion(version: string): any {
        this.redirectToVersion(version);
        setTimeout(() => {
            this.loadVersion();
        });
    }

    loadVersion() {
        this.props.onLoad({
            report: this.getLocationParams().report,
            version: this.getLocationParams().version
        });
        this.createBreadcrumb();
    }

    redirectToVersion(version: string) {
        const hash = this.props.location.hash;
        this.props.history
            .push(`/${this.getLocationParams().report}/${version}/${hash}`, false);
    }

    parent() {
        return new ReportsListPage();
    }

    name() {
        const params = this.getLocationParams();
        return `${params.report} (${params.version})`;
    }

    urlFragment() {
        const params = this.getLocationParams();
        return `${params.report}/${params.version}/`;
    }

    render(): JSX.Element {
        const activeTab = hashToTab(this.props.location.hash);

        return <div>
            <ReportingPageHeader siteTitle={this.siteTitle()}/>
            <div className={"container-fluid pt-4 sm-pt-5"}>
                <div className="row flex-xl-nowrap">
                    <div className="col-12 col-md-4 col-xl-2">
                        <Sidebar active={activeTab} onChangeVersion={this.changeVersion}/>
                    </div>
                    <div className={"col-12 col-sm-10 col-md-8 pt-4 pt-md-1"}>
                        {activeTab == ReportTabEnum.REPORT && <ReportDetails />}
                        {activeTab == ReportTabEnum.DOWNLOAD && <ReportDownloads/>}
                    </div>
                </div>
            </div>
        </div>
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<PageProperties<ReportPageProps>> => {
    return {
        onLoad: (props: ReportPageProps) => dispatch(reportPageActions.onLoad(props))
    }
};

export const ReportPage = connect((props) => props, mapDispatchToProps)(ReportPageComponent);