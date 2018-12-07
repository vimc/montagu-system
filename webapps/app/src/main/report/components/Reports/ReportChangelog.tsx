import * as React from "react";
import {connect} from 'react-redux';

import {Changelog} from "../../../shared/models/Generated";
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
    versionChangelog: Changelog[];
    report: string;
}

export const ReportChangelogComponent: React.SFC<ReportChangelogProps> = (props: ReportChangelogProps) => {
    const header = <h3 className="mb-3">Changelog</h3>;

    if (!props.versionChangelog || props.versionChangelog.length == 0)
    {
        return <div>
            {header}
            <p>
                There is no Changelog for this Report version.
            </p>
        </div>
    }

    return <div>
        {header}
        <table>
            <thead className="changelog-header">
            <tr>
                <th>Version</th>
                <th>Label</th>
                <th>Text</th>
            </tr>
            </thead>
            <tbody>
                { props.versionChangelog.map((changelog: Changelog) => {
                    const badgeType = (changelog.label == "public") ? "published" : "internal";
                    return <tr>
                                <td>{changelog.report_version}</td>
                                <td><span className={`badge badge-${badgeType}`}>{changelog.label}</span></td>
                                <td>{changelog.value}</td>
                            </tr>;
                    }
                    )
                }
            </tbody>
        </table>
     </div>   ;
};

export const mapStateToProps = (state: ReportAppState): ReportChangelogProps => {
    return {
        versionChangelog: state.reports.versionChangelog,
        report: state.reports.currentReport
    }
};

export const ReportChangelog = compose(
    connect(mapStateToProps),
    branch((p: ReportChangelogProps) => isNullOrUndefined(p.versionChangelog), renderComponent(LoadingElement))
)(ReportChangelogComponent);