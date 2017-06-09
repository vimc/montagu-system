import { ModellingGroup, Touchstone } from "../../models/Generated";
import * as React from "react";
import { touchstoneActions } from "../../actions/TouchstoneActions";
import { responsibilityActions } from "../../actions/ResponsibilityActions";
import { modellingGroupActions } from "../../actions/ModellingGroupActions";

const chooseStyles = require("./Choose.css");

export interface GroupLinkProps {
    group: ModellingGroup;
    selected: boolean;
}

export class GroupLink extends React.Component<GroupLinkProps, undefined> {
    constructor(props: GroupLinkProps) {
        super(props);
        this.clicked = this.clicked.bind(this);
    }

    clicked() {
        modellingGroupActions.setCurrentModellingGroup(this.props.group.id);
    }

    render() {
        let className = chooseStyles.choice;
        if (this.props.selected) {
            className += " " + chooseStyles.selected;
        }

        return <div className={ className } onClick={ this.clicked } >
            { this.props.group.description }
        </div>
    }
}