import * as React from "react";
import { FileDownloadLink } from "../FileDownloadLink";
import { encodeFilename } from "../../../shared/Helpers";

interface ResourceLinksProps{
    resources: string[],
    report: string,
    version: string
}

export class ResourceLinks extends React.Component<ResourceLinksProps, undefined> {
    buildUrl(resource: string): string {
        resource = encodeFilename(resource);
        const p = this.props;
        return `/reports/${p.report}/versions/${p.version}/resources/${resource}/`;
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