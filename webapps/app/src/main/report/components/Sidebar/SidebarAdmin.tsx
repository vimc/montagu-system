import * as React from "react";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect, Dispatch} from "react-redux";
import {User} from "../../../shared/models/Generated";
import {ReportVersionSwitcher} from "../Reports/ReportVersionSwitcher";
import {PublishSwitch} from "./PublishSwitch";
import {userActions} from "../../actions/userActions";
import {ReportReadersList} from "./ReportReadersList";
import {branch, compose, renderComponent, renderNothing} from "recompose";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import withLifecycle, {LifecycleMethods} from "@hocs/with-lifecycle";

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

export const SidebarAdminComponent: React.StatelessComponent<SidebarAdminProps> = (props: SidebarAdminProps) => {

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
            <ReportReadersList users={props.reportReaders} report={props.report}
                               removeReportReader={(username: string) => props.removeReportReader(props.report, username)}/>
        </div>}
    </div>
};

export const mapStateToProps = (state: ReportAppState): Partial<SidebarAdminProps> => {

    const versionDetails = state.reports.versionDetails;

    const ready = !!versionDetails
        && !!state.reports.versions;

    return {
        ready: ready,
        isReviewer: state.auth.permissions.indexOf("*/reports.review") > -1,
        isAdmin: state.auth.permissions.indexOf("*/roles.read") > -1,
        published: versionDetails && versionDetails.published,
        allVersions: state.reports.versions,
        report: versionDetails && versionDetails.name,
        version: versionDetails && versionDetails.id,
        reportReaders: state.users.reportReaders,

    };
};

export const mapDispatchToProps = (dispatch: Dispatch<any>, _: PublicProps): Partial<SidebarAdminProps> => {

    return {
        removeReportReader: (report: string, username: string) =>
            dispatch(userActions.removeReportReader(report, username)),
        getReportReaders: (reportName: string) =>
            dispatch(userActions.getReportReaders(reportName))
    }
};

const lifecycleMethods: Partial<LifecycleMethods<SidebarAdminProps>> = {
    onWillReceiveProps(_: SidebarAdminProps, nextProps: SidebarAdminProps) {
        if (nextProps.ready && nextProps.isAdmin && nextProps.reportReaders.length == 0) {
            nextProps.getReportReaders(nextProps.report)
        }
    }
};

const enhance = compose<SidebarAdminProps, PublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle(lifecycleMethods),
    branch((props: SidebarAdminProps) =>  !props.ready, renderNothing)
);

export const SidebarAdmin = enhance(SidebarAdminComponent);