import * as React from "react";
import {Artefact} from "../../../shared/models/reports/Artefact";
import {OneTimeLinkContext, OneTimeLinkProps} from "../OneTimeLinkContext";
import {encodeFilename} from "../../../shared/Helpers";

interface Props {
    report: string;
    version: string;
    artefact: Artefact;
}

export class InlineArtefact extends React.Component<Props, undefined> {
    render(): JSX.Element {
        const {report, version, artefact} = this.props;
        const filename = artefact.filenames[0];
        return <OneTimeLinkContext href={`/reports/${report}/versions/${version}/artefacts/${encodeFilename(filename)}/`}>
            <ArtefactIFrame />
        </OneTimeLinkContext>
    }
}

class ArtefactIFrame extends React.Component<OneTimeLinkProps, undefined> {
    render(): JSX.Element {
        return <iframe
            src={this.props.href}
            className="float-right"
            width="50%" height="600px"
            frameBorder={0}
        />;
    }
}

