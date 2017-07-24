import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {settings} from "../../../shared/Settings";

export class DataLinks extends React.Component<ILookup<string>, undefined> {

    static buildUrl(type: string, hash: string): string {
        return settings.reportingApiUrl() + "/data/"
            + type + "/"
            + hash;
    }

    render() {

        const keys = Object.getOwnPropertyNames(this.props);

        const links =
            keys.map((key) => <li key={key}>{key}
                <div> <a href={DataLinks.buildUrl("csv", this.props[key])}>Download csv</a></div>
                <div><a href={DataLinks.buildUrl("rds", this.props[key])}>Download rds</a></div>
            </li>);

        return <ul>{links}</ul>;
    }
}