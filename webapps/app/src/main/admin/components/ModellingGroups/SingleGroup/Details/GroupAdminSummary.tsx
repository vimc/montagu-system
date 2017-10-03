import * as React from "react";
import { ModellingGroupDetails, User } from "../../../../../shared/models/Generated";
import { InternalLink } from "../../../../../shared/components/InternalLink";
import { ListOfUsers } from "../../ListOfUsers";
import { intersperse } from "../../../../../shared/components/Helpers";

interface Props {
    group: ModellingGroupDetails,
    allUsers: User[]
}

export class GroupAdminSummary extends React.Component<Props, undefined> {
    render() {
        const url = `/modelling-groups/${this.props.group.id}/admin/`;
        const members = this.props.group.members.map(member => this.props.allUsers.find(u => member == u.username));
        if (members.length == 0) {
            return <span>
                This group does not have any members.
                Please click <InternalLink href={url}>here</InternalLink> to add one.
            </span>;
        } else {

            const items = members.map(a => <InternalLink key={a.username} href={`/users/${a.username}/`}>
                {a.name}
            </InternalLink>);
            return <div>
                <span>{intersperse(items, ", ")}</span>
                <span className="float-right">(<InternalLink href={url}>edit</InternalLink>)</span>
            </div>
        }
    }
}