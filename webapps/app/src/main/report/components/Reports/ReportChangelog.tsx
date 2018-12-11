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
import {Action, Dispatch} from "redux";
import {PageProperties} from "../../../shared/components/PageWithHeader/PageProperties";
import {reportVersionChangelogActionCreators} from "../../actionCreators/reportVersionChangelogActionCreators";
import {ReportPageLocationProps} from "./ReportPage";
import {ModellingGroupMembersPageProps} from "../../../admin/components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersPage";

export interface ReportChangelogPublicProps{
    report: string;
    version: string;
    onLoad: (props: ReportChangelogPublicProps) => any;
}

export interface ReportChangelogProps extends ReportChangelogPublicProps {
    versionChangelog: Changelog[];
}

export class ReportChangelogComponent extends React.Component<ReportChangelogProps> {

    render(): JSX.Element {

        //We kick of loading of Changelog ourselves if we don't have one yet
        if (this.props.report && this.props.version && isNullOrUndefined(this.props.versionChangelog)){
            this.props.onLoad(this.props);
        }


        if (isNullOrUndefined(this.props.versionChangelog)){
            return <LoadingElement/>
        }

        const header = <h3 className="mb-3">Changelog</h3>;

        if (this.props.versionChangelog.length == 0)
        {
            return <div>
                {header}
                <p>
                    There is no Changelog for this Report version.
                </p>
            </div>
        }

        let rowIdx = 0;
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
                    { this.props.versionChangelog.map((changelog: Changelog) => {
                        const badgeType = (changelog.label == "public") ? "published" : "internal";
                        return <tr key={rowIdx++}>
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
F
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportChangelogProps> => {

    const result = {
            report:  state.reports.currentReport,
            version: state.reports.versionDetails && state.reports.versionDetails.id,
            versionChangelog: state.reports.versionChangelog,
    }

    return result;
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ReportChangelogProps> => {
    return {
        onLoad: (props: ReportChangelogProps) => dispatch(reportVersionChangelogActionCreators.onLoad(props))
    }
};

export const ReportChangelog = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(ReportChangelogComponent);