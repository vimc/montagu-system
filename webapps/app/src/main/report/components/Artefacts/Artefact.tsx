import * as React from "react";
import {settings} from "../../../shared/Settings";
import { FileDownloadLink } from "../FileDownloadLink";
import { encodeFilename } from "../../../shared/Helpers";

interface ArtefactProps
{
    filename: string,
    description: string;
    report: string;
    version: string;
}

export class ArtefactItem extends React.Component<ArtefactProps, undefined> {
    render() {
        const p = this.props;
        const filename = encodeFilename(p.filename);
        const url = `/reports/${p.report}/${p.version}/artefacts/${filename}/`;
        return <li>
            <FileDownloadLink key={this.props.filename} href={url}>
                {p.filename}
            </FileDownloadLink>
            <div>({p.description})</div>
        </li>;
    }
}