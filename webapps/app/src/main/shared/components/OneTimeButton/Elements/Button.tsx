import * as React from "react";

import { OneTimeButtonElement } from "../OneTimeButton";
import * as loaderAnimation from "../../../resources/link-loader.gif";

export class OneTimeButtonButton extends React.Component<OneTimeButtonElement, undefined> {

    renderAnimation() {
        if (this.props.enabled && this.props.token == null) {
            return <img src={ loaderAnimation } />;
        } else {
            return null;
        }
    }

    isReady() {
        if (this.props.enabled && this.props.token) {
            return true;
        }
    }

    render() :JSX.Element {
        return <form action={ this.props.url }>
            <button
                onClick={ this.props.onClick }
                disabled={ !this.isReady() }
                type="submit"
            >
                { this.props.children }
            </button>
            { this.renderAnimation() }
        </form>;
    }
}