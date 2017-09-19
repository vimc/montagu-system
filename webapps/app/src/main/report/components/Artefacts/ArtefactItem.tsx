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
        const links = p.filenames.map(filename => {
            const url = `/reports/${p.report}/${p.version}/artefacts/${encodeFilename(filename)}/`;
            return <li key={`li-${filename}`}>
                <FileDownloadLink key={filename} href={url}>
                    {filename}
                </FileDownloadLink>
            </li>;
        });

        return <li className={styles.artefact}>
            <div>{p.description}</div>
            <ul>{links}</ul>
        </li>;
    }
}