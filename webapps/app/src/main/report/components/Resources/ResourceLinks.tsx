import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {settings} from "../../../shared/Settings";

interface ResourceLinksProps{
    resources: ILookup<string>,
    report: string,
    version: string
}

export class ResourceLinks extends React.Component<ResourceLinksProps, undefined> {

    buildUrl(resource: string): string {
        return settings.reportingApiUrl() + "/reports/"
            + this.props.report + "/"
            + this.props.version + "/resources/"
            + resource
    }

    render() {

        const keys = Object.getOwnPropertyNames(this.props.resources);

        const links =
            keys.map((key) => <li key={key}>
                <a href={this.buildUrl(key)}>{key}</a>
            </li>);

        if (links.length == 0)
            return <div>none</div>;

        return <ul>{links}</ul>;
    }
}