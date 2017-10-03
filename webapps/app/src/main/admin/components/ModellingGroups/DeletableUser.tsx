import { AssociateUser, User } from "../../../shared/models/Generated";
import * as React from "react";
import { InternalLink } from "../../../shared/components/InternalLink";
import { processResponseAndNotifyOnErrors } from "../../../shared/sources/Source";
import { modellingGroupActions } from "../../../shared/actions/ModellingGroupActions";
import { notificationActions, NotificationException } from "../../../shared/actions/NotificationActions";
import fetcher from "../../../shared/sources/Fetcher";
import { Link } from "simple-react-router";
import { adminAuthStore } from "../../stores/AdminAuthStore";

interface UserProps {
    user: User;
    groupId: string;
    showDelete: boolean;
}

export class DeletableUser extends React.Component<UserProps, undefined> {

    clickHandler() {

        const href = `/modelling-groups/${this.props.groupId}/actions/associate_member/`;
        const associateUser: AssociateUser = {
            username: this.props.user.username,
            action: "remove"
        };

        fetcher.fetcher.fetch(href, {
            method: "post",
            body: JSON.stringify(associateUser)
        }).then((response: Response) =>
            processResponseAndNotifyOnErrors(response)
                .then(() => modellingGroupActions.removeMember(this.props.user.username))
                .catch((e: NotificationException) => notificationActions.notify(e))
        )
    }

    render() {

        const deleteLink = this.props.showDelete ?
            <Link onClick={this.clickHandler.bind(this)} className="text-danger float-right" href="#">Remove
                member</Link>
            : "";

        return <div>
            <div className="form-group">
                <InternalLink href={`/users/${this.props.user.username}/`}>
                    {this.props.user.name}
                </InternalLink>
                {deleteLink}
            </div>
            <hr/>
        </div>;
    }
}