import * as React from "react";
import {ReportRowRenderProps} from "../ReportListTable";

export const PublishStatusCell: React.SFC<ReportRowRenderProps> = (props: ReportRowRenderProps) => {
    return props.value ?
        <span className="ml-1 badge-published badge d-none d-sm-inline mr-2">published</span> :
        <span className="ml-1 badge-internal badge d-none d-sm-inline mr-2">internal</span>
};
