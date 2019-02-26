import * as React from "react";
import {FileDownloadLink} from "../../../shared/components/FileDownloadLink";
import {buildArtefactUrl} from "../../LinkHelpers";
import {InlineArtefactFigure} from "./InlineArtefactFigure";
import {ReportDownloadSection} from "../Reports/DownloadSection";
import {Artefact} from "../../../shared/models/Generated";

interface ArtefactProps {
    artefact: Artefact
    report: string;
    version: string;
}

export class ArtefactItem extends React.Component<ArtefactProps, undefined> {
    render() {
        const a = this.props.artefact;

        const links = a.files.map(filename => {
            const url = buildArtefactUrl(this.props.report, this.props.version, filename, false);
            return <div key={filename}><FileDownloadLink key={filename} href={url} service="reporting">
                {filename}
            </FileDownloadLink></div>;
        });

        return <ReportDownloadSection title={a.description}>
            <InlineArtefactFigure report={this.props.report} version={this.props.version}
                                  artefact={a}/>
            <div className="mt-2">{links}</div>
        </ReportDownloadSection>;
    }
}