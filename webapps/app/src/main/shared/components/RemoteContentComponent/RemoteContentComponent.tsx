import * as React from "react";
import { RemoteContent } from "../../models/RemoteContent";

import * as spinner from "./spinner.gif";
import "../../styles/messages.scss";

export abstract class RemoteContentComponent<TProps extends RemoteContent, TState> extends React.Component<TProps, TState> {
    abstract renderContent(content: TProps): JSX.Element;

    render() {
        if (this.props.ready) {
            return this.renderContent(this.props);
        } else {
            return this.renderLoading();
        }
    }

    renderLoading(): JSX.Element {
        return <img src={ spinner } />;
    }
}