import * as React from "react";
import {FileDownloadLink} from "../FileDownloadLink";
import {ArtefactsList} from "./ArtefactsList";
import {Version} from "../../../shared/models/reports/Report";
import {ReportDownloadSection} from "../Reports/DownloadSection";

interface Props {
    report: string;
    versionDetails: Version;
}

export class ArtefactsSection extends React.Component<Props, undefined> {
    render() {
        const version = this.props.versionDetails.id;
        const bundleUrl = `/reports/${this.props.report}/versions/${version}/all/`;
        return <div>

            <ArtefactsList artefacts={this.props.versionDetails.artefacts}
                           report={this.props.report}
                           version={version}/>

            <ReportDownloadSection title="All outputs as zip bundle">
                <FileDownloadLink href={bundleUrl}>
                    {this.props.report}-{version}.zip
                </FileDownloadLink>
            </ReportDownloadSection>
        </div>;
    }
}