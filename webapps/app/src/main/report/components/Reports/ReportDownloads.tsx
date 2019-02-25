import * as React from "react";
import {connect} from 'react-redux';

import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {ReportTitle} from "./ReportTitle";
import {FileDownloadButton} from "../../../shared/components/FileDownloadLink";
import {branch, compose, renderComponent} from "recompose";
import {isNullOrUndefined} from "util";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportVersionDetails} from "../../../shared/models/Generated";

export interface ReportDownloadsProps {
    versionDetails: ReportVersionDetails;
    report: string;
}

export const ReportDownloadsComponent: React.FunctionComponent<ReportDownloadsProps> = (props: ReportDownloadsProps) => {
    const bundleUrl = `/reports/${props.report}/versions/${props.versionDetails.id}/all/`;
    return <div className={"pl-3 pl-md-0 mb-5"}>
        <ReportTitle versionDetails={props.versionDetails}/>
        <ArtefactsSection report={props.report} versionDetails={props.versionDetails}/>
        <DataLinks {...props.versionDetails.data_hashes} />
        <ResourceLinks resources={props.versionDetails.resources} report={props.report}
                       version={props.versionDetails.id}/>
        <div className="mb-5 mt-5">
            <FileDownloadButton href={bundleUrl} service="reporting">
                {props.report}-{props.versionDetails.id}.zip
            </FileDownloadButton>
        </div>
    </div>;
};

export const mapStateToProps = (state: ReportAppState): ReportDownloadsProps => {
    return {
        versionDetails: state.reports.versionDetails,
        report: state.reports.currentReport
    }
};

export const ReportDownloads = compose(
    connect(mapStateToProps),
    branch((p: ReportDownloadsProps) => isNullOrUndefined(p.versionDetails), renderComponent(LoadingElement))
)(ReportDownloadsComponent);
