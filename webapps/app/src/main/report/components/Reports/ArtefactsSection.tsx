import * as React from "react";
import {FileDownloadLink} from "../FileDownloadLink";
import {ArtefactsList} from "../Artefacts/ArtefactsList";
import {Version} from "../../../shared/models/reports/Report";

const styles = require("../../../shared/styles/common.css");

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
                <div className={"col-12 " + styles.sectionTitle}>Artefacts</div>
            </div>

            <div className="row">
                <div className="col-12 col-md-3">All artefacts as zip bundle</div>
                <div className="col-12 col-md-9">
                    <ul>
                        <li>
                            <FileDownloadLink href={bundleUrl}>
                                {this.props.report}-{version}.zip
                            </FileDownloadLink>
                        </li>
                    </ul>
                </div>
            </div>
            <ArtefactsList artefacts={this.props.versionDetails.artefacts}
                           report={this.props.report}
                           version={version}/>
        </div>;
    }
}