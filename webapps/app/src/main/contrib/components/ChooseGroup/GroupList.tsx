import * as React from "react";
import { ModellingGroup } from "../../../shared/models/Generated";
import { ButtonLink } from "../../../shared/components/ButtonLink";

import "./ChooseGroup.scss";

export interface GroupListProps {
    groups: ModellingGroup[];
}

export class GroupList extends React.Component<GroupListProps, undefined> {
    render(): JSX.Element {
        const items = this.props.groups.map((group: ModellingGroup) => {
            const url = `/${group.id}/`;
            return <li key={ group.id }>
                <ButtonLink className="choice" href={ url }>{ group.description }</ButtonLink>
            </li>;
        });
        return <ul className="list">{ items }</ul>
    }
}