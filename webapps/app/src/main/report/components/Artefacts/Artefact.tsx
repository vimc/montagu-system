import * as React from "react";
import { FileDownloadLink } from "../FileDownloadLink";
import { encodeFilename } from "../../../shared/Helpers";

const styles = require("../../styles/reports.css");

interface ArtefactProps {
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
        return <li className={styles.artefact}>
            <div>{p.description}</div>
            <ul>
                <li>
                    <FileDownloadLink key={filename} href={url}>
                        {filename}
                    </FileDownloadLink>
                </li>
            </ul>
        </li>;
    }
}