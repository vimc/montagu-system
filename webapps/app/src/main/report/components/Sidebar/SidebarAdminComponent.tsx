import * as React from "react";
import {User} from "../../../shared/models/Generated";
import {ReportVersionSwitcher} from "../Reports/ReportVersionSwitcher";
import {PublishSwitch} from "./PublishSwitch";
import {ReportReadersList} from "./ReportReadersList";
import {SidebarAdminPublicProps} from "./SidebarAdmin";

export interface SidebarAdminProps extends SidebarAdminPublicProps {
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