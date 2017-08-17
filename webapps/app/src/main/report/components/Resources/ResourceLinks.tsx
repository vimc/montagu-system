import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {settings} from "../../../shared/Settings";
import { FileDownloadLink } from "../FileDownloadLink";

interface ResourceLinksProps{
    resources: string[],
    report: string,
    version: string
}

export class ResourceLinks extends React.Component<ResourceLinksProps, undefined> {
    buildUrl(resource: string): string {
        resource = resource.replace("/", ":");
        const p = this.props;
        return `/reports/${p.report}/${p.version}/resources/${resource}/`;
    }

    render() {

        const links =
            this.props.resources.map((resource) => <li key={resource}>
                <FileDownloadLink href={this.buildUrl(resource)}>{resource}</FileDownloadLink>
            </li>);

        if (links.length == 0)
            return <div>none</div>;

        return <ul>{links}</ul>;
    }
}