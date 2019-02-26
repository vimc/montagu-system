import * as React from "react";
import {ReportVersionDetails} from "../../../shared/models/Generated";

interface ReportTitleProps {
    versionDetails: ReportVersionDetails;
}

export const ReportTitle = (props: ReportTitleProps) => {

    return <div>
        <h1 className={"h2"}>{props.versionDetails.display_name || props.versionDetails.name}</h1>
        <p className={"small text-muted"}>{props.versionDetails.id}</p>
    </div>
};
