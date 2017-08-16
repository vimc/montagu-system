import * as React from "react";
import { ILookup } from "../../../shared/models/Lookup";
import { FileDownloadLink } from "../FileDownloadLink";

export class DataLinks extends React.Component<ILookup<string>, undefined> {
    buildUrl(type: string, key: string): string {
        let data = encodeURIComponent(this.props[key]);
        return `/data/${type}/${data}/`;
    }

    render() {
        const keys = Object.getOwnPropertyNames(this.props);

        const links =
            keys.map((key) => <li key={key}>{key}
                <div><FileDownloadLink href={this.buildUrl("csv", key)}>Download csv</FileDownloadLink></div>
                <div><FileDownloadLink href={this.buildUrl("rds", key)}>Download rds</FileDownloadLink></div>
            </li>);

        return <ul>{links}</ul>;
    }
}