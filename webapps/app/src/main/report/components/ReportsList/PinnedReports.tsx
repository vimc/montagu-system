import * as React from "react";
import {branch, compose, renderNothing} from "recompose";

import {ReportsListContainerProps} from "./ReportsList";
import {FileDownloadButton} from "../../../shared/components/FileDownloadLink";
import {Card, CardBody, CardHeader} from "reactstrap";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect} from "react-redux";
import {ReportVersion} from "../../../shared/models/Generated";
import {InternalLink} from "../../../shared/components/InternalLink";
import {longTimestamp} from "../../../shared/Helpers";
import {settings} from "../../../shared/Settings";

interface PinnedReportsProps {
    reports: ReportVersion[]
}

export class PinnedReportsComponent extends React.Component<PinnedReportsProps> {

    static bundleUrl(report: ReportVersion) {
        return `/reports/${report.name}/versions/${report.id}/all/`;
    }

    static reportUrl(report: ReportVersion) {
        return `/${report.name}/${report.id}/`;
    }

    render(): JSX.Element {

        return <div>
            <h1 className="h3 mb-3">
                Pinned reports
            </h1>
            <div className={"row mb-5"}>
                {this.props.reports.map((r: ReportVersion) =>

                    <div className={"col-12 col-sm-6 col-lg-4"} key={r.id}>
                        <Card>
                            <CardHeader>
                                <InternalLink
                                    href={PinnedReportsComponent.reportUrl(r)}>{r.display_name || r.name}</InternalLink>
                                <div
                                    className={"text-muted small"}>Updated: {longTimestamp(new Date(r.date))}
                                </div>
                            </CardHeader>
                            <CardBody>
                                <FileDownloadButton href={PinnedReportsComponent.bundleUrl(r)}
                                                    className={"pinned-report-link"}
                                                    service="reporting">
                                    Download latest
                                </FileDownloadButton>
                            </CardBody>
                        </Card>
                    </div>)
                }
            </div>
        </div>
    }
}

function getLatestPublishedMatchingReport(name: String, reports: ReportVersion[]) {
    const filteredReports = reports
        .filter(r => r.name == name && r.published);

    filteredReports
        .sort((a, b) => (a.date > b.date ? -1 : 1));

    if (filteredReports.length > 0) {
        return filteredReports[0];
    }
    return null;
}

export const mapStateToProps = (state: ReportAppState): Partial<PinnedReportsProps> => {
    return {
        reports: settings.pinnedReports.map(name => state.reports.reports &&
            getLatestPublishedMatchingReport(name, state.reports.reports)).filter(r => r)
    }
};

const enhance = compose(
    connect(mapStateToProps),
    branch((props: ReportsListContainerProps) => !props.reports || props.reports.length == 0, renderNothing)
);

export const PinnedReports = enhance(PinnedReportsComponent);
