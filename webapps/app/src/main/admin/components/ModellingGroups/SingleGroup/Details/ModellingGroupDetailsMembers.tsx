import * as React from "react";
import {ModellingGroupDetails, User} from "../../../../../shared/models/Generated";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import {intersperse} from "../../../../../shared/components/Helpers";
import {isNonEmptyArray} from "../../../../../shared/ArrayHelpers";

export interface ModellingGroupDetailsMembersProps {
    group: ModellingGroupDetails,
    members: User[],
    canEdit: boolean
}
export const ModellingGroupDetailsMembers: React.FunctionComponent<ModellingGroupDetailsMembersProps> = (props: ModellingGroupDetailsMembersProps) => {
    const url = `/modelling-groups/${props.group.id}/admin/`;
    if (!isNonEmptyArray(props.members)) {
        return <span>
            This group does not have any members.
            &nbsp;
            {props.canEdit && props.group &&
                <span>Please click <InternalLink href={url}>here</InternalLink> to add one.</span>
            }
        </span>;
    } else {
        const items = props.members.map(a => <InternalLink key={a.username} href={`/users/${a.username}/`}>
            {a.name}
        </InternalLink>);

        return <div>
            <span>{intersperse(items, ", ")}</span>
            &nbsp;
            {props.canEdit && props.group &&
            <span className="float-right">
                (<InternalLink href={url}>edit</InternalLink>)
            </span>
            }
        </div>;
    }
};