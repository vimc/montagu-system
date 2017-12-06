import * as React from "react";
import fetcher from "../sources/Fetcher";

const loaderAnimation = require("../resources/link-loader.gif");
const buttonStyles = require("../styles/buttons.css");

export interface OneTimeButtonProps {
    token: string
    enabled?: boolean;
    refreshToken: () => void;
    onClick?: () =>void;
}

export class OneTimeButton extends React.Component<OneTimeButtonProps, any> {
    static defaultProps: Partial<OneTimeButtonProps> = {
        enabled: true
    };

    constructor() {
        super();
        this.internalOnClickHandler = this.internalOnClickHandler.bind(this);
    }

    refreshToken() {
        setTimeout(this.props.refreshToken);
    }

    renderAnimation() {
        if (this.props.enabled && this.props.token == null) {
            return <img src={ loaderAnimation } />;
        } else {
            return null;
        }
    }

    internalOnClickHandler() {
        this.refreshToken();
        if (typeof this.props.onClick === 'function') {
            this.props.onClick();
        }
    }

    render() {
        const props = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(props.token);
        const enabled = props.enabled && props.token != null;
        return <form action={ url }>
            <button
                onClick={ this.internalOnClickHandler }
                disabled={ !enabled }
                type="submit"
            >
                { this.props.children }
            </button>
            { this.renderAnimation() }
        </form>;
    }
}