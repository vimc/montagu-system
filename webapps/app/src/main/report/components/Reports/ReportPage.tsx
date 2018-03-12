import * as React from "react";
import {Action, Dispatch} from "redux";
import {connect} from 'react-redux';

import {ReportingPageWithHeader} from "../ReportingPageWithHeader";
import {ReportDetails} from "./ReportDetails";
import {appSettings} from "../../../shared/Settings";
import {ReportsListPage} from "../ReportsList/ReportsListPage";
import {reportPageActions} from "../../actions/reportPageActions";
import {ReportTabEnum, Sidebar} from "../Sidebar/Sidebar";
import {ReportingPageHeader} from "../ReportingPageHeader";
import {ReportDownloads} from "./ReportDownloads";
import {IPageWithParent} from "../../../shared/models/Breadcrumb";
import {PageProperties, PageInterface, PageProps} from "../../../shared/components/PageWithHeader/PageWithHeader";

export interface ReportPageLocationProps {
    report: string;
    version: string;
}

export interface ReportPageProps extends PageProps<ReportPageLocationProps> {
    onLoad?: (props:ReportPageLocationProps) => void;
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

export class ReportPageComponent
    extends React.Component<ReportPageProps>
    implements PageInterface {

    constructor(props: ReportPageProps) {
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
        this.props.onLoad(this.props.match.params);
        // this.createBreadcrumb();
    }

    redirectToVersion(version: string) {
        const hash = this.props.location.hash;
        this.props.history
            .push(`${appSettings.publicPath}/${this.props.match.params.report}/${version}/${hash}`, false);
    }


    parent() : IPageWithParent {
        return null//new ReportsListPage();
    }

    name() {
        const params = this.props.match.params;
        return `${params.report} (${params.version})`;
    }

    urlFragment() {
        const params = this.props.match.params;
        return `${params.report}/${params.version}/`;
    }


    render(): JSX.Element {
        const activeTab = hashToTab(this.props.location.hash);

        return <div>
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

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ReportPageProps> => {
    return {
        onLoad: (props: ReportPageLocationProps ) => dispatch(reportPageActions.onLoad(props))
    }
};

export const ReportPage = connect((props) => props, mapDispatchToProps)(ReportPageComponent);