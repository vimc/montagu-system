import * as React from "react";
import {FileDownloadLink} from "../FileDownloadLink";
import {encodeFilename} from "../../../shared/Helpers";
import {ReportDownloadSection} from "../Reports/DownloadSection";

interface ResourceLinksProps {
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
        if (this.props.resources.length == 0) {
            return null;
        }

        const links = this.props.resources.map((resource) =>
            <div>
                <FileDownloadLink href={this.buildUrl(resource)}>{resource}</FileDownloadLink>
            </div>
        );

        return <ReportDownloadSection title={"Resources"}>
            {links}
        </ReportDownloadSection>
    }
}