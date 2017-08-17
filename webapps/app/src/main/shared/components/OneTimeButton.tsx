import * as React from "react";
import fetcher from "../sources/Fetcher";

const loaderAnimation = require("../resources/link-loader.gif");

interface Props {
    token: string
    enabled?: boolean;
    refreshToken: () => void;
}

export class OneTimeButton extends React.Component<Props, undefined> {
    static defaultProps: Partial<Props> = {
        enabled: true
    };

    constructor() {
        super();
        this.refreshToken = this.refreshToken.bind(this);
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

    render() {
        const props = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(props.token);
        const enabled = props.enabled && props.token != null;
        return <form action={ url }>
            <button onClick={ this.refreshToken }
                    disabled={ !enabled }
                    type="submit">
                { this.props.children }
            </button>
            { this.renderAnimation() }
        </form>;
    }
}