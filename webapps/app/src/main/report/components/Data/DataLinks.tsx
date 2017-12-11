import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {FileDownloadLink} from "../FileDownloadLink";

import "../../../shared/styles/common.scss";

export class DataLinks extends React.Component<ILookup<string>, undefined> {
    buildUrl(type: string, key: string): string {
        let data = encodeURIComponent(this.props[key]);
        return `/data/${type}/${data}/`;
    }

    render() {
        const keys = Object.getOwnPropertyNames(this.props);

        const links = keys.map((key) =>
            <div className="row" key={key}>
                <div className="col-12 col-md-3">{key}</div>
                <div className="col-12 col-md-9">
                    <ul>
                        <li><FileDownloadLink href={this.buildUrl("csv", key)}>Download csv</FileDownloadLink></li>
                        <li><FileDownloadLink href={this.buildUrl("rds", key)}>Download rds</FileDownloadLink></li>
                    </ul>
                </div>
            </div>);

        return <div>
            <div className="row">
                <div className="col-12 sectionTitle">Input data to the report</div>
            </div>
            {links}
        </div>;
    }
}