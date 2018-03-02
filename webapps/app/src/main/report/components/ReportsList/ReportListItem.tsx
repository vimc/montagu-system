import * as React from "react";
import {InternalLink} from "../../../shared/components/InternalLink";
import {Report} from "../../../shared/models/Generated";

export const ReportListItem: React.StatelessComponent<Report> = (props: Report) => {
    const url = `/${props.name}/${props.latest_version}/`;
    let name = props.display_name ? props.display_name : props.name;
    return (
        <li>
            <InternalLink href={url}>{name}</InternalLink>
        </li>
    );
}