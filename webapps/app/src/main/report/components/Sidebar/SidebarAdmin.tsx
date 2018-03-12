import * as React from "react";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect, Dispatch} from "react-redux";
import {User} from "../../../shared/models/Generated";
import {ReportVersionSwitcher} from "../Reports/ReportVersionSwitcher";
import {PublishSwitch} from "./PublishSwitch";
import {ReportReadersList} from "./ReportReadersList";
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
    getReportReaders: (reportName: string) => void;

}

export const SidebarAdminComponent = (props: SidebarAdminProps) => {
    if (!props.ready)
        return null;

    if (props.isAdmin) {
        props.getReportReaders(props.report)
    }


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
            <ReportReadersList users={props.reportReaders}/>
        </div>}
    </div>

};

export const mapStateToProps = (state: ReportAppState, props: Partial<SidebarAdminProps>): SidebarAdminProps => {
    const ready = !!state.reports.versionDetails &&
        !!state.reports.versions;

    const finalProps: SidebarAdminProps = {
        ready: ready,
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
        isAdmin: state.auth.permissions.indexOf("*/roles.read") > -1,
        published: false,
        allVersions: state.reports.versions,
        report: "",
        version: "",
        onChangeVersion: props.onChangeVersion,
        reportReaders: state.users.reportReaders,
        getReportReaders: props.getReportReaders
    };

    if (ready) {
        const versionDetails = state.reports.versionDetails;

        finalProps.published = versionDetails.published;
        finalProps.report = versionDetails.name;
        finalProps.version = versionDetails.id;
    }

    return finalProps
};

export const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        getReportReaders: (reportName: string) => dispatch(userActions.getReportReaders(reportName))
    }
};

export const SidebarAdmin = connect(mapStateToProps, mapDispatchToProps)(SidebarAdminComponent);