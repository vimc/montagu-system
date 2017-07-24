import * as React from "react";
import {settings} from "../../../shared/Settings";

interface ArtefactProps
{
    filename: string,
    description: string;
    report: string;
    version: string;
}

export class ArtefactItem extends React.Component<ArtefactProps, undefined> {
    render() {

        const url = settings.reportingApiUrl() + "/reports/"
            + this.props.report + "/"
            + this.props.version + "/artefacts/"
            + this.props.filename;

        return <li><a key={this.props.filename}
                       href={url}>{this.props.filename}</a>
            <div>({this.props.description})</div></li>

    }
}