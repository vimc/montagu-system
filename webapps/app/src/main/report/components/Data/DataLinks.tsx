import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {settings} from "../../../shared/Settings";

export class DataLinks extends React.Component<ILookup<string>, undefined> {

    buildUrl(type: string, key: string): string {
        return settings.reportingApiUrl() + "/data/"
            + type + "/"
            + this.props[key];
    }

    render() {

        const keys = Object.getOwnPropertyNames(this.props);

        const links =
            keys.map((key) => <li key={key}>{key}
                <div> <a href={this.buildUrl("csv", key)}>Download csv</a></div>
                <div><a href={this.buildUrl("rds", key)}>Download rds</a></div>
            </li>);

        return <ul>{links}</ul>;
    }
}