import * as React from "react";
import {Artefact} from "../../../shared/models/reports/Artefact";
import {OneTimeLinkContext, OneTimeLinkProps} from "../OneTimeLinkContext";
import {buildArtefactUrl} from "../../LinkHelpers";

interface Props {
    report: string;
    version: string;
    artefact: Artefact;
}

export class InlineArtefactFigure extends React.Component<Props, undefined> {
    render(): JSX.Element {
        const {report, version, artefact} = this.props;
        const filename = artefact.filenames[0];
        const extension = filename.split('.').pop();

        if (InlineArtefactFigure.isImage(extension)) {
            return <ArtefactFigure href={buildArtefactUrl(report, version, filename, false)}/>;
        } else {
            return null;
        }
    }

    static isImage(ext: string): boolean {
        // This will be replaced with checking the mimetype once we have that metadata
        const images = ["png", "jpg", "jpeg", "gif", "svg"];
        return images.indexOf(ext) > -1;
    }
}

export class ArtefactFigureInner extends React.Component<OneTimeLinkProps, undefined> {
    render(): JSX.Element {
        const {href} = this.props;
        if (href != null) {
            return <img
                src={this.props.href + "&inline=true"}
                className="border border-dark p-3"
            />;
        } else {
            return null;
        }
    }
}

export const ArtefactFigure = OneTimeLinkContext(ArtefactFigureInner);
