import { User } from "../../../shared/models/Generated";
import * as React from "react";
import { InternalLink } from "../../../shared/components/InternalLink";
import { intersperse } from "../../../shared/components/Helpers";

interface Props {
    users: User[];
}

export class ListOfUsers extends React.Component<Props, undefined> {
    render() {
        const items = this.props.users.map(a => <InternalLink key={ a.username } href={ `/users/${a.username}/` }>
            { a.name }
        </InternalLink>);
        return <span>{ intersperse(items, ", ") }</span>;
    }
}