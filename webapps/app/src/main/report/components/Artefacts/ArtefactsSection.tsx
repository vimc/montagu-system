import * as React from "react";
import {ArtefactsList} from "./ArtefactsList";
import {ReportVersionDetails} from "../../../shared/models/Generated";

interface Props {
    report: string;
    versionDetails: ReportVersionDetails;
}

export class ArtefactsSection extends React.Component<Props, undefined> {
    render() {
        const version = this.props.versionDetails.id;

        return <div>

            <ArtefactsList artefacts={this.props.versionDetails.artefacts}
                           report={this.props.report}
                           version={version}/>
        </div>;
    }
}