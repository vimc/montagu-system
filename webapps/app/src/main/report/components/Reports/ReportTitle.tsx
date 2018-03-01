import * as React from "react";
import {Version} from "../../../shared/models/reports/Report";

interface ReportTitleProps {
    versionDetails: Version;
}

export const ReportTitle = (props: ReportTitleProps) => {

    return <div>
        <h1 className={"h2"}>{props.versionDetails.displayname || props.versionDetails.name}</h1>
        <p className={"small text-muted"}>{props.versionDetails.id}</p>
    </div>
};
