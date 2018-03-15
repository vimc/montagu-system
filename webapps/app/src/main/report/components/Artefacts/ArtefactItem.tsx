import * as React from "react";
import {FileDownloadLink} from "../FileDownloadLink";
import {encodeFilename} from "../../../shared/Helpers";
import {ArtefactRow} from "./ArtefactRow";

import {buildArtefactUrl} from "../../LinkHelpers";
import {link} from "fs";
import {InlineArtefact} from "./InlineArtefact";
import {Artefact} from "../../../shared/models/reports/Artefact";
interface ArtefactProps {
    artefact: Artefact
    report: string;
    version: string;
}

export class ArtefactItem extends React.Component<ArtefactProps, undefined> {
    render() {
        const a = this.props.artefact;

        const links = a.filenames.map(filename => {
            const url = buildArtefactUrl(this.props.report, this.props.version, filename, false);
            return <FileDownloadLink key={filename} href={url}>
                    {filename}
                </FileDownloadLink>;
        });

        return <ArtefactRow description={a.description}>
            <InlineArtefact report={this.props.report} version={this.props.version}
                            artefact={a} height={"200px"}/>
            {links}
        </ArtefactRow>;
    }
}