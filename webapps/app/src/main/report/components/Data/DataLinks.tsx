import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {FileDownloadLink} from "../FileDownloadLink";
import {Card,CardHeader, CardBody} from "reactstrap";
import {ReportDownloadSection} from "../Reports/DownloadSection";

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
                        <li><FileDownloadLink href={this.buildUrl("csv", key)}>csv</FileDownloadLink></li>
                        <li><FileDownloadLink href={this.buildUrl("rds", key)}>rds</FileDownloadLink></li>
                    </ul>
                </div>
            </div>);

        return <ReportDownloadSection title={"Input data to the report"}>
            {links}
        </ReportDownloadSection>
    }
}