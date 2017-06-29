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
        const admins = this.props.group.admins.map(admin => this.props.allUsers.find(u => admin == u.username));
        if (admins.length == 0) {
            return <span>
                This group does not have an admin.
                Please click <InternalLink href={ url }>here</InternalLink> to choose one.
            </span>;
        } else {
            return <span>
                <ListOfUsers users={ admins } />&nbsp;
                (<InternalLink href={ url }>change</InternalLink>)
            </span>
        }
    }
}