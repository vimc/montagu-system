import * as React from "react";
import {Action, Dispatch} from "redux";
import {connect} from 'react-redux';

import {ReportDetails} from "./ReportDetails";
import {appSettings} from "../../../shared/Settings";
import {ReportsListPageComponent} from "../ReportsList/ReportsListPage";
import {reportPageActions} from "../../actions/reportPageActions";
import {ReportTabEnum, Sidebar, sidebarHashToTab} from "../Sidebar/Sidebar";
import {ReportDownloads} from "./ReportDownloads";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageWithHeader";

export interface ReportPageLocationProps {
    report: string;
    version: string;
}

export interface ReportPageProps extends PageProperties<ReportPageLocationProps> {
    onLoad?: (props:ReportPageLocationProps) => void;
}

export class ReportPageComponent extends React.Component<ReportPageProps> {
    constructor(props: ReportPageProps) {
        super(props);
        this.changeVersion = this.changeVersion.bind(this);
    }

    componentDidMount() {
        this.props.onLoad(this.props.match.params);
    }

    componentWillReceiveProps(nextProps: ReportPageProps) {
        if (nextProps.match.params.version !== this.props.match.params.version) {
            this.props.onLoad(nextProps.match.params);
        }
    }

    changeVersion(version: string): void {
        const hash = this.props.location.hash;
        this.props.history
            .push(`/${this.props.match.params.report}/${version}/${hash}`, false);
    }

    static breadcrumb(params: ReportPageLocationProps) {
        return {
            name: `${params.report} (${params.version})`,
            urlFragment: `${params.report}/${params.version}/`,
            parent: ReportsListPageComponent.breadcrumb()
        }
    }

    render(): JSX.Element {
        const activeTab = sidebarHashToTab(this.props.location.hash);

        return <div>
            <div className={"container-fluid pt-4 sm-pt-5"}>
                <div className="row flex-xl-nowrap">
                    <div className="col-12 col-md-4 col-xl-3">
                        <Sidebar active={activeTab} onChangeVersion={this.changeVersion}/>
                    </div>
                    <div className={"col-12 col-md-8 pt-4 pt-md-1"}>
                        {activeTab == ReportTabEnum.REPORT && <ReportDetails />}
                        {activeTab == ReportTabEnum.DOWNLOAD && <ReportDownloads/>}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ReportPageProps> => {
    return {
        onLoad: (props: ReportPageLocationProps) => dispatch(reportPageActions.onLoad(props))
    }
};

export const ReportPage = connect(
    (props: Partial<ReportPageProps>) => props,
    mapDispatchToProps
)(ReportPageComponent) as React.ComponentClass<Partial<ReportPageProps>>;