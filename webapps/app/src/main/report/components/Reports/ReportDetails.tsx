import * as React from "react";
import { connect } from 'react-redux';

import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {DraftStamp} from "../DraftStamp";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
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
        const artefactGroup = this.props.versionDetails.artefacts[0];
        const type = Object.getOwnPropertyNames(artefactGroup)[0];
        const artefact = artefactGroup[type];

        return <div>
            <h1 className={"h2"}>{props.versionDetails.displayname || props.versionDetails.name}</h1>
            <p className={"small text-muted"}>{props.versionDetails.id}</p>
            <InlineArtefact report={props.report} version={props.versionDetails.id} artefact={artefact}/>
            <DraftStamp published={props.versionDetails.published}/>
            <ReportVersionSwitcher
                currentVersion={props.versionDetails.id}
                versions={props.allVersions}
                onChangeVersion={props.onChangeVersion}
            />
            <ArtefactsSection report={props.report} versionDetails={props.versionDetails}/>
            <DataLinks {...props.versionDetails.hash_data} />
            <ResourceLinks resources={props.versionDetails.resources} report={props.report} version={props.versionDetails.id}/>
            <ParameterList {...props.versionDetails.parameters} />
        </div>;
    } else {
        return <LoadingElement />;
    }
}

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
