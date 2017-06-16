import { Touchstone } from "../../../shared/models/Generated";
import * as React from "react";
import { touchstoneActions } from "../../actions/TouchstoneActions";

const chooseStyles = require("./Choose.css");

export interface TouchstoneLinkProps {
    touchstone: Touchstone;
    selected: boolean;
}

export class TouchstoneLink extends React.Component<TouchstoneLinkProps, undefined> {
    constructor(props: TouchstoneLinkProps) {
        super(props);
        this.clicked = this.clicked.bind(this);
    }

    clicked() {
        touchstoneActions.setCurrentTouchstone(this.props.touchstone.id);
    }

    render() {
        let className = chooseStyles.choice;
        if (this.props.selected) {
            className += " " + chooseStyles.selected;
        }

        return <div className={ className } onClick={ this.clicked } >
            { this.props.touchstone.description }
        </div>
    }
}