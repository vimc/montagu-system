import * as React from "react";

import { OneTimeButtonElement } from "../OneTimeButton";

export class OneTimeButtonLink extends React.Component<OneTimeButtonElement, undefined> {

    isReady() {
        if (this.props.enabled && this.props.token) {
            return true;
        }
    }

    render() :JSX.Element {
        if (this.isReady()) {
            return <a
                className="disabled"
                href={this.props.url}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </a>;
        } else {
            return <span>{this.props.children}</span>;
        }
    }
}