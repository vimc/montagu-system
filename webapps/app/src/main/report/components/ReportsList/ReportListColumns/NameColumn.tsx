import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {Report} from "../../../../shared/models/Generated";
import {ReportRowRenderProps} from "../ReportListTable";

export const NameCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {

    const report = props.row;

    let name = <div>{report.name}</div>;

    if (report.display_name) {
        name =
            <div>
                {report.display_name}
                <br/>
                ({report.name})
            </div>
    }

    return <div>
        <InternalLink href={`/${report.name}/${report.latest_version}/`}>
            {name}
        </InternalLink>
    </div>
};

export const nameAccessorFunction = (data: Report) => {

    let name = data.name;
    if (data.display_name) {
        name = data.display_name + ` (${name})`
    }
    return name
};