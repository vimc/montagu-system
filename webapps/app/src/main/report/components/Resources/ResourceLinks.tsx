import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {settings} from "../../../shared/Settings";
import { FileDownloadLink } from "../FileDownloadLink";

interface ResourceLinksProps{
    resources: ILookup<string>,
    report: string,
    version: string
}

export class ResourceLinks extends React.Component<ResourceLinksProps, undefined> {
    buildUrl(resource: string): string {
        const p = this.props;
        return `/reports/${p.report}/${p.version}/resources/${resource}`;
    }

    render() {
        const keys = Object.getOwnPropertyNames(this.props.resources);

        const links =
            keys.map((key) => <li key={key}>
                <FileDownloadLink href={this.buildUrl(key)}>{key}</FileDownloadLink>
            </li>);

        if (links.length == 0)
            return <div>none</div>;

        return <ul>{links}</ul>;
    }
}