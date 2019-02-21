import * as React from "react";
import {connect} from 'react-redux';

import {Version} from "../../../shared/models/reports/Report";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportAppState} from "../../reducers/reportAppReducers";

import {InlineArtefact} from "../Artefacts/InlineArtefact";
import {ReportTitle} from "./ReportTitle";
import {branch, compose, renderComponent} from "recompose";
import {isNullOrUndefined} from "util";

export interface ReportDetailsProps {
    versionDetails: Version;
    report: string;
}

export const ReportDetailsComponent: React.FunctionComponent<ReportDetailsProps> = (props: ReportDetailsProps) => {
    const version = props.versionDetails.id;
    const artefactGroup = props.versionDetails.artefacts[0];
    const type = Object.getOwnPropertyNames(artefactGroup)[0];
    const artefact = artefactGroup[type];
    const report = props.report;

    return <div className={"pl-3 pl-md-0"}>
        <ReportTitle versionDetails={props.versionDetails}/>
        <InlineArtefact
            report={report} version={version} artefact={artefact}/>
    </div>;
};

export const mapStateToProps = (state: ReportAppState): Partial<ReportDetailsProps> => {
    return {
        versionDetails: state.reports.versionDetails,
        report: state.reports.currentReport
    }
};

export const ReportDetails = compose(
    connect(mapStateToProps),
    branch((p: ReportDetailsProps) => isNullOrUndefined(p.versionDetails), renderComponent(LoadingElement))
)(ReportDetailsComponent);
