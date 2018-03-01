import * as React from "react";
import { connect } from 'react-redux';

import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportAppState} from "../../reducers/reportAppReducers";

import {InlineArtefact} from "../Artefacts/InlineArtefact";
import {ReportTitle} from "./ReportTitle";

export interface ReportDetailsProps {
    versionDetails: Version;
    report: string;
    ready: boolean;
}

export const ReportDetailsComponent = (props: ReportDetailsProps) => {
    if (props.ready) {
        const version = props.versionDetails.id;
        const artefactGroup = props.versionDetails.artefacts[0];
        const type = Object.getOwnPropertyNames(artefactGroup)[0];
        const artefact = artefactGroup[type];
        const report = props.report;

        return <div className={"pl-3 pl-md-0"}>
            <ReportTitle versionDetails={props.versionDetails}/>
            <InlineArtefact report={report} version={version} artefact={artefact}/>
        </div>;
    } else {
        return <LoadingElement/>;
    }
};

export const mapStateToProps = (state: ReportAppState): Partial<ReportDetailsProps> => {
    return {
        versionDetails: state.reports.versionDetails,
        ready: !!state.reports.versionDetails,
        report: state.reports.currentReport
    }
};

export const ReportDetails = connect(mapStateToProps)(ReportDetailsComponent);
