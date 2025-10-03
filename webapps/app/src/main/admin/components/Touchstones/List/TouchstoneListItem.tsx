import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {Touchstone} from "../../../../shared/models/APITypes";

export interface TouchstoneListItemProps extends Touchstone {
    showFinished: boolean;
}

export const TouchstoneListItem: React.FunctionComponent<TouchstoneListItemProps> = (props: TouchstoneListItemProps) => {

    const touchstoneUrl = `/touchstones/${props.id}/`;

    let latestVersionUrl = "", latestVersionId = "";
    const versionsToChooseFrom = props.versions.filter(v => v.status != "finished" || props.showFinished);
    if (versionsToChooseFrom.length > 0) {
        // The API is guaranteed to return versions in descending order
        latestVersionId = versionsToChooseFrom[0].id;
        latestVersionUrl = `/touchstones/${props.id}/${latestVersionId}/`;
    }

    return <tr>
        <td>{props.id}</td>
        <td><InternalLink href={touchstoneUrl}>{props.description}</InternalLink></td>
        <td>{props.comment}</td>
        <td>{latestVersionId && <InternalLink href={latestVersionUrl}>{latestVersionId}</InternalLink>}</td>
    </tr>;

};
