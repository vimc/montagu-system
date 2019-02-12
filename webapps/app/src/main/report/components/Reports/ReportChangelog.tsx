import * as React from "react";
import {connect} from 'react-redux';

import {Changelog} from "../../../shared/models/Generated";
import {shortTimestamp} from "../../../shared/Helpers";
import {VersionIdentifier} from "../../models/VersionIdentifier";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {Dispatch} from "redux";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";
import {ContribAppState} from "../../../contrib/reducers/contribAppReducers";
import withLifecycle from "@hocs/with-lifecycle";

import {Card, Col} from "reactstrap";
import {InternalLink} from "../../../shared/components/InternalLink";
import groupBy from "lodash/groupBy"
import map from "lodash/map"

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

        const header = <h3 className="mb-3">Changelog</h3>;

        if (this.props.versionChangelog.length == 0) {
            return <div>
                {header}
                <p>
                    There is no Changelog for this Report version.
                </p>
            </div>
        }

        return <div>
            {header}
            {map(groupBy(this.props.versionChangelog, "report_version"),
                (value: Changelog[], version: string) => {
                    console.log(value, version);
                    return <ChangelogItem key={version} version={version} reportName={this.props.report}
                                          changelog={value}/>
                })
            }
        </div>
    };
}

export const ChangelogItem = (props: { reportName: string, version: string, changelog: Changelog[] }) => {

    return <Card className={"rounded-0"}>
        <Col>
            <InternalLink href={`/${props.reportName}/${props.version}/`}>
                {shortTimestamp(new VersionIdentifier(props.version).timestamp)}
            </InternalLink>
        </Col>
        <Col>
            {props.changelog.map((item) => {
                const badgeType = (item.label == "public") ? "published" : "internal";
                return [<span className={`badge badge-${badgeType}`}>{item.label}</span>, <span>{item.value}</span>]
            })}
        </Col>
    </Card>

};

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
            props.fetchChangelog(props);
        },
        onDidUpdate: (prevProps: ReportChangelogProps, props: ReportChangelogProps) => {
            if (props.versionChangelog == null) {
                props.fetchChangelog(props);
            }
        }
    }),
    branch((props: ReportChangelogProps) => props.versionChangelog == null, renderComponent(LoadingElement)),
)(ReportChangelogComponent);
