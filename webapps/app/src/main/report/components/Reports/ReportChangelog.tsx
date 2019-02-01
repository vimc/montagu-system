import * as React from "react";
import {connect} from 'react-redux';

import {Changelog} from "../../../shared/models/Generated";
import {longTimestamp} from "../../../shared/Helpers";
import {VersionIdentifier} from  "../../models/VersionIdentifier";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {compose} from "recompose";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {Dispatch} from "redux";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";
import {ContribAppState} from "../../../contrib/reducers/contribAppReducers";
import withLifecycle from "@hocs/with-lifecycle";

export interface ReportChangelogPublicProps {
    report: string;
    version: string;
}

export interface ReportChangelogProps extends ReportChangelogPublicProps {
    versionChangelog: Changelog[];
    fetchChangelog: (props: ReportChangelogPublicProps) => void;
}

export class ReportChangelogComponent extends React.Component<ReportChangelogProps> {

    render() {

        if (this.props.versionChangelog == null) {
            return <LoadingElement/>
        }

        const header = <h3 className="mb-3">Changelog</h3>;

        if (this.props.versionChangelog.length == 0) {
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
                    <th className="datestring-column">Date</th>
                    <th>Label</th>
                    <th>Text</th>
                </tr>
                </thead>
                <tbody>
                {this.props.versionChangelog.map((changelog: Changelog) => {
                        const badgeType = (changelog.label == "public") ? "published" : "internal";
                        return <tr key={rowIdx++}>
                            <td>{longTimestamp(new VersionIdentifier(changelog.report_version).timestamp)}</td>
                            <td><span className={`badge badge-${badgeType}`}>{changelog.label}</span></td>
                            <td>{changelog.value}</td>
                        </tr>;
                    }
                )
                }
                </tbody>
            </table>
        </div>
    };

    componentDidUpdate() {
        //Do this here as well as in didMount as we also need to fetch when already mounted when report changes from
        //sidebar dropdown. Can't only do it here as componentDidUpdate is not called on initial render.
        if (this.props.versionChangelog == null) {
            this.props.fetchChangelog(this.props);
        }
    }
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportChangelogProps> => {
    return {
        versionChangelog: state.reports.versionChangelog
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ReportChangelogProps> => {
    return {
        fetchChangelog: (props: ReportChangelogProps) => dispatch(reportActionCreators.getVersionChangelog(props.report, props.version))
    }
};

export const ReportChangelog = compose<ReportChangelogProps, ReportChangelogPublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle({
        onDidMount: (props: ReportChangelogProps) => {
            props.fetchChangelog(props)
        }
    })
)(ReportChangelogComponent);
