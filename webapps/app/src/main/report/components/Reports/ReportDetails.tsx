import * as React from "react";
import {RemoteContent} from "../../../shared/models/RemoteContent";
import {RemoteContentComponent} from "../../../shared/components/RemoteContentComponent/RemoteContentComponent";
import {reportStore} from "../../stores/ReportStore";
import {connectToStores} from "../../../shared/alt";
import {Version} from "../../../shared/models/reports/Report";
import {ParameterList} from "../Parameters/ParameterList";
import {DataLinks} from "../Data/DataLinks";
import {ResourceLinks} from "../Resources/ResourceLinks";
import {ReportVersionSwitcher} from "./ReportVersionSwitcher";
import {ArtefactsSection} from "../Artefacts/ArtefactsSection";
import {DraftStamp} from "../DraftStamp";

import "../../../shared/styles/common.scss";
import {InlineArtefact} from "../Artefacts/InlineArtefact";

interface PublicProps {
    onChangeVersion: (version: string) => void;
}

export interface ReportDetailsProps extends RemoteContent, PublicProps {
    versionDetails: Version;
    report: string;
    allVersions: string[];
}

export class ReportDetailsComponent extends RemoteContentComponent<ReportDetailsProps, undefined> {
    static getStores() {
        return [reportStore];
    }

    static getPropsFromStores(props: Partial<ReportDetailsProps>): ReportDetailsProps {
        const s = reportStore.getState();
        return {
            versionDetails: s.versionDetails[s.currentVersion],
            report: s.currentReport,
            allVersions: s.versions[s.currentReport],
            ready: s.ready
            && s.versions[s.currentReport] !== undefined
            && s.versionDetails[s.currentVersion] != null,

            onChangeVersion: props.onChangeVersion
        };
    }

    renderContent(props: ReportDetailsProps) {
        const report = props.report;
        const version = props.versionDetails.id;
        const artefactGroup = this.props.versionDetails.artefacts[0];
        const type = Object.getOwnPropertyNames(artefactGroup)[0];
        const artefact = artefactGroup[type];

        return <div>
            <InlineArtefact report={report} version={version} artefact={artefact}/>
            <DraftStamp published={props.versionDetails.published}/>
            <DraftStamp published={props.versionDetails.published}/>
            <ReportVersionSwitcher
                currentVersion={props.versionDetails.id}
                versions={props.allVersions}
                onChangeVersion={props.onChangeVersion}
            />
            <ArtefactsSection report={report} versionDetails={this.props.versionDetails}/>
            <DataLinks {...props.versionDetails.hash_data} />
            <ResourceLinks resources={props.versionDetails.resources} report={report} version={version}/>
            <ParameterList {...props.versionDetails.parameters} />
        </div>
    }
}

export const ReportDetails = connectToStores(ReportDetailsComponent) as ComponentConstructor<PublicProps, undefined>;