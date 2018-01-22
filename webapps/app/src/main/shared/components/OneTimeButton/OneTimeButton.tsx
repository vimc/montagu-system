import * as React from "react";
import fetcher from "../../sources/Fetcher";

import { OneTimeButtonButton } from "./Elements/Button";
import { OneTimeButtonLink } from "./Elements/Link";
import "../../styles/buttons.scss";

export interface OneTimeButtonProps {
    token: string;
    enabled?: boolean;
    refreshToken: () => void;
    onClick?: () =>void;
    element?: string;
}

export interface OneTimeButtonElement {
    url: string
    enabled?: boolean;
    onClick?: () =>void;
    token: string;
    children: JSX.Element;
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

    getElement() :any {
        if (this.props.element === 'Link') {
            return OneTimeButtonLink;
        }
        return OneTimeButtonButton;
    }

    internalOnClickHandler() {
        this.refreshToken();
        if (typeof this.props.onClick === 'function') {
            this.props.onClick();
        }
    }

    render() :JSX.Element {
        const props = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(props.token);
        const enabled = props.enabled && props.token != null;
        const OneTimeElement = this.getElement();

        return <OneTimeElement
            url={url}
            enabled={enabled}
            onClick={ this.internalOnClickHandler }
            token={this.props.token}
            children={this.props.children}
        />;
    }
}
