import * as React from "react";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect, Dispatch} from "react-redux";
import {User} from "../../../shared/models/Generated";
import {ReportVersionSwitcher} from "../Reports/ReportVersionSwitcher";
import {PublishSwitch} from "./PublishSwitch";
import {userActions} from "../../actions/userActions";
import {ReportReadersList} from "./ReportReadersList";

export interface PublicProps {
    onChangeVersion: (version: string) => any;
}

export interface SidebarAdminProps extends PublicProps {
    report: string;
    version: string;
    ready: boolean;
    isReviewer: boolean;
    published: boolean;
    allVersions: string[];
    reportReaders: User[];
    isAdmin: boolean;
    getReportReaders: (reportName: string) => void;
    removeReportReader: (username: string, reportName: string) => void;
}

export class SidebarAdminComponent extends React.Component<SidebarAdminProps, undefined> {

    constructor(props: SidebarAdminProps) {
        super();
        if (props.isAdmin) {
            props.getReportReaders(props.report)
        }
    }

    render() {
        if (!this.props.ready)
            return null;

        return <div>
            <ReportVersionSwitcher
                currentVersion={this.props.version}
                versions={this.props.allVersions}
                onChangeVersion={this.props.onChangeVersion}
            /> {this.props.isReviewer && <PublishSwitch name={this.props.report}
                                                   version={this.props.version}
                                                   published={this.props.published}/>}
            {this.props.isAdmin &&
            <div className="mt-5">
                <label className={"font-weight-bold"}>Report readers</label>
                <ReportReadersList users={this.props.reportReaders} report={this.props.report}
                                   removeReportReader={(username: string) => this.props.removeReportReader(this.props.report, username)}/>
            </div>}
        </div>
    }

};

export const mapStateToProps = (state: ReportAppState): Partial<SidebarAdminProps> => {
    const ready = !!state.reports.versionDetails && !!state.reports.versions;

    const finalProps: Partial<SidebarAdminProps> = {
        ready: ready,
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
        isAdmin: state.auth.permissions.indexOf("*/roles.read") > -1,
        published: false,
        allVersions: state.reports.versions,
        report: "",
        version: "",
        reportReaders: state.users.reportReaders
    };

    if (ready) {
        const versionDetails = state.reports.versionDetails;

        finalProps.published = versionDetails.published;
        finalProps.report = versionDetails.name;
        finalProps.version = versionDetails.id;
    }

    return finalProps
};

export const mapDispatchToProps = (dispatch: Dispatch<any>, _: PublicProps): Partial<SidebarAdminProps> => {

    return {
        removeReportReader: (report: string, username: string) =>
            dispatch(userActions.removeReportReader(report, username)),
        getReportReaders: (reportName: string) => dispatch(userActions.getReportReaders(reportName))
    }
};

export const SidebarAdmin = connect(mapStateToProps, mapDispatchToProps)(SidebarAdminComponent);