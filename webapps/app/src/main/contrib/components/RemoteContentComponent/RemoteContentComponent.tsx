import * as React from "react";
import { RemoteContent } from "../../../shared/models/RemoteContent";

const spinner = require("./spinner.gif");
const messageStyles = require("../../../shared/styles/messages.css");

export abstract class RemoteContentComponent<TProps extends RemoteContent> extends React.Component<TProps, undefined> {
    abstract renderContent(content: TProps): JSX.Element;

    render() {
        if (this.props.ready) {
            return this.renderContent(this.props);
        } else {
            return <img src={ spinner } />
        }
    }
}