import * as React from "react";
import { OneTimeToken } from "../models/OneTimeToken";
import { oneTimeTokenStore } from "../stores/OneTimeTokenStore";
import fetcher from "../../shared/sources/Fetcher";
import { connectToStores } from "../../shared/alt";
import { doNothing } from "../../shared/Helpers";
import { oneTimeTokenActions } from "../actions/OneTimeTokenActions";

import * as loaderAnimation from "../../shared/resources/link-loader.gif";

interface PublicProps {
    href: string;
}

interface Props extends PublicProps {
    token: OneTimeToken;
}

// This is a component that needs to get data from its parent component (the 'href' prop) but also
// from the stores (the 'token' prop). So in `getPropsFromStores` we pass through the `href` prop
// unchanged, and also use it to determine which token to retrieve from the store.
export class FileDownloadLinkComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [oneTimeTokenStore]
    }

    static getPropsFromStores(props: Props): Props {
        return {
            href: props.href,
            token: oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), props.href)
        }
    }

    constructor() {
        super();
        this.refreshToken = this.refreshToken.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.token == null) {
                oneTimeTokenStore.fetchToken(this.props.href).catch(doNothing);
            }
        });
    }

    refreshToken(e: React.MouseEvent<HTMLAnchorElement>): void {
        setTimeout(() => {
            oneTimeTokenActions.clearUsedToken(this.props.href);
            oneTimeTokenStore.fetchToken(this.props.href).catch(doNothing);
        });
    }

    render() {
        let href: string;
        let className: string;
        let loader: JSX.Element;

        if (this.props.token != null) {
            href = fetcher.fetcher.buildReportingURL(this.props.token.data.url) + "?access_token=" + this.props.token.raw;
            className = null;
            loader = null;
        } else {
            href = null;
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
}

// We cast this to a component with props of type `PublicProps`, as these are the subset of the props
// that are not filled in from the stores
export const FileDownloadLink = connectToStores(FileDownloadLinkComponent) as ComponentConstructor<PublicProps, any>;