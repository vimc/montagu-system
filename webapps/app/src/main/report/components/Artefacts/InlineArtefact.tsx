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

        if (InlineArtefact.canRenderInIFrame(extension)) {
            return <ArtefactIFrame href={buildArtefactUrl(report, version, filename, false)}/>;
        } else {
            // Do other things here, like rendering CSV as a table, etc.
            return null;
        }
    }

    static canRenderInIFrame(ext: string): boolean {
        // This will be replaced with checking the mimetype once we have that metadata
        const images = ["png", "jpg", "jpeg", "gif", "svg"];
        const html = ["html", "htm"];
        const all = ["pdf"].concat(html).concat(images);
        return all.indexOf(ext) > -1;
    }
}

export class ArtefactIFrameInner extends React.Component<OneTimeLinkProps, undefined> {
    render(): JSX.Element {
        const {href} = this.props;
        if (href != null) {
            return <iframe
                src={this.props.href + "&inline=true"}
                width="100%"
                height="600px"
                className="border border-dark p-3"
                frameBorder={0}
            />;
        } else {
            return null;
        }
    }
}

export const ArtefactIFrame = OneTimeLinkContext(ArtefactIFrameInner);
