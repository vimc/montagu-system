import * as React from "react";
import { connect } from 'react-redux';

import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {ReportTitle} from "./ReportTitle";

export interface ReportDownloadsProps {
    versionDetails: Version;
    report: string;
    ready: boolean;
}

export const ReportDownloadsComponent = (props: ReportDownloadsProps) => {
    if (props.ready) {
        return <div>
            <ReportTitle versionDetails={props.versionDetails}/>
            <ArtefactsSection report={props.report} versionDetails={props.versionDetails}/>
            <DataLinks {...props.versionDetails.hash_data} />
            <ResourceLinks resources={props.versionDetails.resources} report={props.report} version={props.versionDetails.id}/>
            <ParameterList {...props.versionDetails.parameters} />
        </div>;
    } else {
        return <LoadingElement/>;
    }
};

export const mapStateToProps = (state: ReportAppState, props: {}): ReportDownloadsProps => {
    return {
        versionDetails: state.reports.versionDetails,
        ready: !!state.reports.versionDetails,
        report: state.reports.currentReport
    }
};

export const ReportDownloads = connect(mapStateToProps)(ReportDownloadsComponent);
