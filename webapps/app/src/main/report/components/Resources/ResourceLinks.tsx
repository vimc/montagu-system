import * as React from "react";
import {FileDownloadLink} from "../FileDownloadLink";
import {helpers} from "../../../shared/Helpers";

const styles = require("../../../shared/styles/common.css");

interface ResourceLinksProps {
    resources: string[],
    report: string,
    version: string
}

export class ResourceLinks extends React.Component<ResourceLinksProps, undefined> {
    buildUrl(resource: string): string {
        resource = helpers.encodeFilename(resource);
        const p = this.props;
        return `/reports/${p.report}/versions/${p.version}/resources/${resource}/`;
    }

    render() {
        if (this.props.resources.length == 0) {
            return null;
        }

        const links = this.props.resources.map((resource) =>
            <li key={resource}>
                <FileDownloadLink href={this.buildUrl(resource)}>{resource}</FileDownloadLink>
            </li>
        );

        return <div>
            <div className="row">
                <div className={"col-12 " + styles.sectionTitle}>Resources</div>
            </div>
            <ul>
                {links}
            </ul>
        </div>;
    }
}