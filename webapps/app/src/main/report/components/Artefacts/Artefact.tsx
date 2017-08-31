import * as React from "react";
import {settings} from "../../../shared/Settings";
import { FileDownloadLink } from "../FileDownloadLink";
import { encodeFilename } from "../../../shared/Helpers";

interface ArtefactProps
{
    filenames: string[],
    description: string;
    report: string;
    version: string;
}

export class ArtefactItem extends React.Component<ArtefactProps, undefined> {
    render() {
        const p = this.props;
        const filename = p.filenames[0];
        const url = `/reports/${p.report}/${p.version}/artefacts/${encodeFilename(filename)}/`;
        return <li>
            <FileDownloadLink key={filename} href={url}>
                {filename}
            </FileDownloadLink>
            <div>({p.description})</div>
        </li>;
    }
}