import * as React from "react";
import {Artefact} from "../../../shared/models/reports/Artefact";
import {OneTimeLinkContext, OneTimeLinkProps} from "../OneTimeLinkContext";
import {buildArtefactUrl} from "../../LinkHelpers";

interface Props {
    report: string;
    version: string;
    artefact: Artefact;
}

export class InlineArtefact extends React.Component<Props, undefined> {
    render(): JSX.Element {
        const {report, version, artefact} = this.props;
        const filename = artefact.filenames[0];
        const extension = filename.split('.').pop();

        if (this.canRenderInIFrame(extension)) {
            return <OneTimeLinkContext href={buildArtefactUrl(report, version, filename, false)}>
                <ArtefactIFrame/>
            </OneTimeLinkContext>;
        } else {
            // Do other things here, like rendering CSV as a table, etc.
            return null;
        }
    }

    canRenderInIFrame(ext: string): boolean {
        // This will be replaced with checking the mimetype once we have that metadata
        const images = ["png", "jpg", "jpeg", "gif", "svg"];
        return (ext == "pdf" || images.indexOf(ext) > -1);
    }
}

class ArtefactIFrame extends React.Component<OneTimeLinkProps, undefined> {
    render(): JSX.Element {
        const {href} = this.props;
        if (href != null) {
            return <iframe
                src={this.props.href + "&inline=true"}
                className="float-right"
                width="50%" height="600px"
                frameBorder={0}
            />;
        } else {
            return null;
        }
    }
}

