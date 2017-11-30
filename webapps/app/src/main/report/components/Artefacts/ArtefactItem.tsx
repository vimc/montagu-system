import * as React from "react";
import {FileDownloadLink} from "../FileDownloadLink";
import {helpers} from "../../../shared/Helpers";
import {ArtefactRow} from "./ArtefactRow";

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
            const url = `/reports/${p.report}/versions/${p.version}/artefacts/${helpers.encodeFilename(filename)}/`;
            return <li key={`li-${filename}`}>
                <FileDownloadLink key={filename} href={url}>
                    {filename}
                </FileDownloadLink>
            </li>;
        });

        return <ArtefactRow description={p.description}>
            {links}
        </ArtefactRow>;
    }
}