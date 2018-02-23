import * as React from "react";
import { connect } from 'react-redux';

import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {LoadingElement} from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportAppState} from "../../reducers/reportAppReducers";

import {InlineArtefact} from "../Artefacts/InlineArtefact";

interface PublicProps {
    onChangeVersion: (version: string) => void;
}

export interface ReportDetailsProps extends PublicProps {
    versionDetails: Version;
    report: string;
    allVersions: string[];
    ready: boolean;
}

export const ReportDetailsComponent = (props: ReportDetailsProps) => {
    if (props.ready) {
        const version = props.versionDetails.id;
        const artefactGroup = props.versionDetails.artefacts[0];
        const type = Object.getOwnPropertyNames(artefactGroup)[0];
        const artefact = artefactGroup[type];
        const report = props.report;

        return <div>
            <h1 className={"h2"}>{props.versionDetails.displayname || props.versionDetails.name}</h1>
            <p className={"small text-muted"}>{props.versionDetails.id}</p>
            <InlineArtefact report={report} version={version} artefact={artefact}/>
            <ReportVersionSwitcher
                currentVersion={props.versionDetails.id}
                versions={props.allVersions}
                onChangeVersion={props.onChangeVersion}
            />
        </div>;
    } else {
        return <LoadingElement/>;
    }
};

export const mapStateToProps = (state: ReportAppState, props: PublicProps): Partial<ReportDetailsProps> => {
    return {
        versionDetails: state.reports.versionDetails,
        ready: !!state.reports.versionDetails,
        report: state.reports.currentReport,
        allVersions: state.reports.versions,
        onChangeVersion: props.onChangeVersion
    }
};

export const ReportDetails = connect(mapStateToProps)(ReportDetailsComponent);
