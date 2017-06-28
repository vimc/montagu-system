import * as React from "react";
import { InternalLink } from "../../../../shared/components/InternalLink";
import {User} from "../../../../shared/models/Generated";

export class UserListItem extends React.Component<User, undefined> {
    render() {
        const url = `/users/${ this.props.username }/`;
        return <InternalLink href={ url }>{ this.props.name}</InternalLink>;
    }
}