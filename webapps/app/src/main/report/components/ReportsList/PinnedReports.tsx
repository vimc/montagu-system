import * as React from "react";
import {branch, compose, renderNothing} from "recompose";

import {ReportsListContainerProps} from "./ReportsList";
import {FileDownloadButton} from "../../../shared/components/FileDownloadLink";
import {Card, CardHeader} from "reactstrap";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {connect} from "react-redux";
import {Report} from "../../../shared/models/Generated";
import {InternalLink} from "../../../shared/components/InternalLink";
import {longTimestamp} from "../../../shared/Helpers";
import {settings} from "../../../shared/Settings";
import {flatMap, flatten} from "../../../shared/ArrayHelpers";

interface PinnedReportsProps {
    reports: Report[]
}

export class PinnedReportsComponent extends React.Component<PinnedReportsProps> {

    static bundleUrl(report: Report) {
        return `/reports/${report.name}/${report.latest_version}/all/`;
    }

    static reportUrl(report: Report) {
        return `/reports/${report.name}/${report.latest_version}/`;
    }

    render(): JSX.Element {

        return <div>
            <h1 className="h3 mb-3">
                Pinned reports
            </h1>
            {this.props.reports.map((r: Report) =>
                <Card>
                    <CardHeader>
                        <InternalLink href={PinnedReportsComponent.reportUrl(r)}>{r.name}</InternalLink>
                        <span className={"text-muted small"}>Updated: {longTimestamp(new Date(r.updated_on))}</span>
                    </CardHeader>
                    <FileDownloadButton href={PinnedReportsComponent.bundleUrl(r)} service="reporting">
                        Download latest
                    </FileDownloadButton>
                </Card>)
            }

        </div>
    }
}

export const mapStateToProps = (state: ReportAppState): Partial<PinnedReportsProps> => {
    console.log(state.reports.reports)
    return {
        reports: settings.pinnedReports.map(name => state.reports.reports && state.reports.reports
            .filter(r => r.name == name && r.published)[0])
    }
};

const enhance = compose(
    connect(mapStateToProps),
    branch((props: ReportsListContainerProps) => !props.reports || props.reports.length == 0, renderNothing)
);

export const PinnedReports = enhance(PinnedReportsComponent);
