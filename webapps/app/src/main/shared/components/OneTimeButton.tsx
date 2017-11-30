import * as React from "react";
import fetcher from "../sources/Fetcher";

const loaderAnimation = require("../resources/link-loader.gif");
const buttonStyles = require("../styles/buttons.css");

interface Props {
    token: string
    enabled?: boolean;
    refreshToken: () => void;
    onClickOuterEvent?: () =>void;
}

export class OneTimeButton extends React.Component<Props, any> {
    static defaultProps: Partial<Props> = {
        enabled: true
    };

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
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

    onClick() {
        this.refreshToken();
        if (typeof this.props.onClickOuterEvent === 'function') {
            this.props.onClickOuterEvent();
        }
    }

    render() {
        const props = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(props.token);
        const enabled = props.enabled && props.token != null;
        return <form action={ url }>
            <button
                onClick={ this.onClick }
                disabled={ !enabled }
                type="submit"
            >
                { this.props.children }
            </button>
            { this.renderAnimation() }
        </form>;
    }
}