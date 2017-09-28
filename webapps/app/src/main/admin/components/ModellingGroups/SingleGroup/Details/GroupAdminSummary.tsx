import * as React from "react";
import { ModellingGroupDetails, User } from "../../../../../shared/models/Generated";
import { InternalLink } from "../../../../../shared/components/InternalLink";
import { ListOfUsers } from "../../ListOfUsers";

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
                Please click <InternalLink href={ url }>here</InternalLink> to add one.
            </span>;
        } else {
            return <span>
                <ListOfUsers users={ members } />&nbsp;
                (<InternalLink href={ url }>edit</InternalLink>)
            </span>
        }
    }
}