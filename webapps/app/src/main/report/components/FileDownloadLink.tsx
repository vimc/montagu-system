import * as React from "react";

import * as loaderAnimation from "../../shared/resources/link-loader.gif";
import {OneTimeLinkContext, OneTimeLinkProps} from "./OneTimeLinkContext";

export const FileDownloadLink = OneTimeLinkContext(class extends React.Component<OneTimeLinkProps, undefined> {
    constructor(props: OneTimeLinkProps) {
        super(props);
        this.refreshToken = this.refreshToken.bind(this);
    }

    refreshToken(e: React.MouseEvent<HTMLAnchorElement>) {
        this.props.refreshToken();
    }

    render() {
        const {href} = this.props;
        let className: string;
        let loader: JSX.Element;

        if (href != null) {
            className = null;
            loader = null;
        } else {
            className = 'disabledLink';
            loader = <img src={loaderAnimation}/>;
        }

        return <span>
            <a
                href={href}
                onClick={this.refreshToken}
                className={className}
                target="_blank"
                download="" // Filename is provided by server
            >
                {this.props.children}
            </a>
            {loader}
        </span>;
    }
});
