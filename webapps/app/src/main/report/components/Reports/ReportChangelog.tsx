import * as React from "react";
import {connect} from 'react-redux';

import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {ReportTitle} from "./ReportTitle";
import {FileDownloadButton} from "../../../shared/components/FileDownloadLink";
import {branch, compose, renderComponent} from "recompose";
import {isNullOrUndefined} from "util";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";

export interface ReportChangelogProps {
    versionDetails: Version;
    report: string;
}

export const ReportChangelogComponent: React.SFC<ReportChangelogProps> = (props: ReportChangelogProps) => {
    //Returning dummy data for now

    const stringCheck = "Published version, which should be used from now on."

    return <div>
        <h3 className="mb-3">Changelog</h3>
        <table>
            <thead className="changelog-header">
            <tr>
                <th>Date</th>
                <th>Label</th>
                <th>Text</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>05/12/2018 09:13:23</td>
                    <td><span className="badge badge-published">public</span></td>
                    <td>{stringCheck}</td>
                </tr>
                <tr>
                    <td>04/12/2018 14:25:43</td>
                    <td><span className="badge badge-internal">internal</span></td>
                    <td>Several updates and corrections.</td>
                </tr>
                <tr>
                    <td>04/12/2018 10:01:12</td>
                    <td><span className="badge badge-internal">internal</span></td>
                    <td>The first internal version of the report, some changes still to make.</td>
                </tr>
            </tbody>
        </table>
     </div>   ;
};

export const mapStateToProps = (state: ReportAppState): ReportChangelogProps => {
    return {
        versionDetails: state.reports.versionDetails,
        report: state.reports.currentReport
    }
};

export const ReportChangelog = compose(
    connect(mapStateToProps),
    branch((p: ReportChangelogProps) => isNullOrUndefined(p.versionDetails), renderComponent(LoadingElement))
)(ReportChangelogComponent);