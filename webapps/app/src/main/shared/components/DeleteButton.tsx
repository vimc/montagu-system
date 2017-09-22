import * as React from "react";

const buttonStyles = require("../styles/buttons.css");

export interface DeleteProps{
    href: string;
}

export class DeleteButton extends React.Component<DeleteProps, undefined> {

    render() {
        return <button ref="link" className={buttonStyles.delete} href={this.props.href}>
           {this.props.children}</button>;
    }
}