import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {settings} from "../../../shared/Settings";

export class ResourceLinks extends React.Component<ILookup<string>, undefined> {

    static buildUrl(type: string, hash: string): string {
        return settings.reportingApiUrl() + "/data/"
            + type + "/"
            + hash;
    }

    render() {

        const keys = Object.getOwnPropertyNames(this.props);

        const links =
            keys.map((key) => <div key={key}>
                <a href={ResourceLinks.buildUrl("csv", key)}>{}</a>
            </div>);

        if (links.length == 0)
            return <div>none</div>;

        return <div>{links}</div>;
    }
}