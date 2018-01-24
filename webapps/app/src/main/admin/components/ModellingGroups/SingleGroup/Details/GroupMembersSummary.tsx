import * as React from "react";
import {ModellingGroupDetails, User} from "../../../../../shared/models/Generated";
import {InternalLink} from "../../../../../shared/components/InternalLink";
import {intersperse} from "../../../../../shared/components/Helpers";

interface Props {
    group: ModellingGroupDetails,
    allUsers: User[],
    canEdit: boolean
}

export class GroupMembersSummary extends React.Component<Props, undefined> {
    render() {
        const url = `/modelling-groups/${this.props.group.id}/admin/`;
        const members = this.props.group.members.map(member => this.props.allUsers.find(u => member == u.username));
        if (members.length == 0) {
            return this.renderNoMembers(url);
        } else {
            return this.renderMemberList(members, url);
        }
    }

    private renderNoMembers(url: string) {
        return <span>
            This group does not have any members.
            &nbsp;
            {this.renderAddLink(url)}
        </span>;
    }

    private renderAddLink(url: string) {
        if (this.props.canEdit) {
            return <span>Please click <InternalLink href={url}>here</InternalLink> to add one.</span>
        } else {
            return null;
        }
    }

    private renderMemberList(members: User[], url: string): JSX.Element {
        const items = members.map(a => <InternalLink key={a.username} href={`/users/${a.username}/`}>
            {a.name}
        </InternalLink>);
        return <div>
            <span>{intersperse(items, ", ")}</span>
            &nbsp;
            {this.renderEditLink(url)}
        </div>;
    }

    private renderEditLink(url: string): JSX.Element {
        if (this.props.canEdit) {
            return <span className="float-right">
                (<InternalLink href={url}>edit</InternalLink>)
            </span>;
        } else {
            return null;
        }
    }
}