import * as React from "react";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect, Dispatch} from "react-redux";
import {User} from "../../../shared/models/Generated";
import {ReportVersionSwitcher} from "../Reports/ReportVersionSwitcher";
import {PublishSwitch} from "./PublishSwitch";
import {UserList} from "./UserList";
import {userActions} from "../../actions/userActions";

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
    removeReportReader: (username: string, reportName: string) => void;
}

export const SidebarAdminComponent = (props: SidebarAdminProps) => {
    if (!props.ready)
        return null;

    return <div>
        <ReportVersionSwitcher
            currentVersion={props.version}
            versions={props.allVersions}
            onChangeVersion={props.onChangeVersion}
        /> {props.isReviewer && <PublishSwitch name={props.report}
                                               version={props.version}
                                               published={props.published}/>}
        {props.isAdmin &&
        <div className="mt-5">
            <label className={"font-weight-bold"}>Report readers</label>
            <UserList users={props.reportReaders} report={props.report}
                      removeReportReader={(username: string) => props.removeReportReader(username, props.report)}/>
        </div>}
    </div>

};

export const mapStateToProps = (state: ReportAppState, props: SidebarAdminProps): SidebarAdminProps => {
    const ready = !!state.reports.versionDetails && !!state.reports.versions
        && !!state.users.reportReaders;

    if (!ready) {
        return {
            ready: false,
            isReviewer: false,
            isAdmin: false,
            published: false,
            report: "",
            version: "",
            allVersions: [],
            onChangeVersion: props.onChangeVersion,
            reportReaders: [],
            removeReportReader: props.removeReportReader
        }
    }
    else {
        const versionDetails = state.reports.versionDetails;
        return {
            ready: true,
            isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
            isAdmin: state.auth.permissions.indexOf("*/roles.read") > -1,
            published: versionDetails.published,
            allVersions: state.reports.versions,
            report: versionDetails.name,
            version: versionDetails.id,
            onChangeVersion: props.onChangeVersion,
            reportReaders: state.users.reportReaders,
            removeReportReader: props.removeReportReader
        }
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<any>, props: PublicProps): Partial<SidebarAdminProps> => {

    return {
        removeReportReader: (username: string, reportName: string) =>
            dispatch(userActions.removeReportReader(reportName, username))
    }
};

export const SidebarAdmin = connect(mapStateToProps, mapDispatchToProps)(SidebarAdminComponent);