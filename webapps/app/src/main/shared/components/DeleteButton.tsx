import * as React from "react";
import fetcher from "../sources/Fetcher";

const buttonStyles = require("../styles/buttons.css");

export interface DeleteProps{
    href: string;
}

export class DeleteButton extends React.Component<DeleteProps, undefined> {

    clickHandler(){
        fetcher.fetcher.fetch(this.props.href, {
            method: "post",
            body: null
        })
    }

    render() {
        return <button ref="link" className={buttonStyles.delete} href={this.props.href} onClick={this.clickHandler.bind(this)}>
           {this.props.children}</button>;
    }
}