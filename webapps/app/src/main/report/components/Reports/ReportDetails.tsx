import * as React from "react";
import { Dispatch, Action } from "redux";
import { connect } from 'react-redux';

import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";

import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {DraftStamp} from "../DraftStamp";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportAppState} from "../../reducers/reportAppReducers";

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
        return <div>
            <DraftStamp published={props.versionDetails.published}/>
            <ReportVersionSwitcher
                currentVersion={props.versionDetails.id}
                versions={props.allVersions}
                onChangeVersion={props.onChangeVersion}
            />
            <ArtefactsSection report={props.report} versionDetails={props.versionDetails}/>
            <DataLinks {...props.versionDetails.hash_data} />
            <ResourceLinks resources={props.versionDetails.resources} report={props.report} version={version}/>
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
