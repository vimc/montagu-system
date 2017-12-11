import * as React from "react";
import {FileDownloadLink} from "../FileDownloadLink";
import {ArtefactsList} from "./ArtefactsList";
import {Version} from "../../../shared/models/reports/Report";
import {ArtefactRow} from "./ArtefactRow";

import "../../../shared/styles/common.scss";

interface Props {
    report: string;
    versionDetails: Version;
}

export class ArtefactsSection extends React.Component<Props, undefined> {
    render() {
        const version = this.props.versionDetails.id;
        const bundleUrl = `/reports/${this.props.report}/versions/${version}/all/`;
        return <div>
            <div className="row">
                <div className="col-12 sectionTitle">Artefacts</div>
            </div>

            <ArtefactsList artefacts={this.props.versionDetails.artefacts}
                           report={this.props.report}
                           version={version}/>

            <ArtefactRow description="All files as zip bundle">
                <li>
                    <FileDownloadLink href={bundleUrl}>
                        {this.props.report}-{version}.zip
                    </FileDownloadLink>
                </li>
            </ArtefactRow>
        </div>;
    }
}