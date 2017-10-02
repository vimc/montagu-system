import { AssociateUser, User } from "../../../shared/models/Generated";
import * as React from "react";
import { InternalLink } from "../../../shared/components/InternalLink";
import { RemoveLink } from "../../../shared/components/RemoveLink";
import { processResponseAndNotifyOnErrors } from "../../../shared/sources/Source";
import { modellingGroupActions } from "../../../shared/actions/ModellingGroupActions";
import { notificationActions, NotificationException } from "../../../shared/actions/NotificationActions";
import fetcher from "../../../shared/sources/Fetcher";

interface UserProps {
    user: User;
    groupId: string;
}

export class DeletableUser extends React.Component<UserProps, undefined> {

    clickHandler(){

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
        return <div>
            <div className="form-group">
                <InternalLink key={this.props.user.username} href={`/users/${this.props.user.username}/`}>
                    {this.props.user.name}
                </InternalLink>
                <RemoveLink clickHandler={this.clickHandler.bind(this)} text="Remove member"/>
            </div>
            <hr/>
        </div>;
    }
}