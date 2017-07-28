import * as React from "react";
import { OneTimeToken } from "../models/OneTimeToken";
import { oneTimeTokenStore } from "../stores/OneTimeTokenStore";
import fetcher from "../../shared/sources/Fetcher";
import { connectToStores } from "../../shared/alt";
import { doNothing } from "../../shared/Helpers";
import { oneTimeTokenActions } from "../actions/OneTimeTokenActions";

interface PublicProps {
    href: string;
}

interface Props extends PublicProps {
    token: OneTimeToken;
}

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
        let href = null;
        let disabled = true;
        if (this.props.token != null) {
            href = fetcher.fetcher.buildReportingURL(this.props.token.data.url) + "?access_token=" + this.props.token.raw;
            disabled = false;
        }

        return <a href={href} disabled={disabled} onClick={this.refreshToken}>
            {this.props.children}
        </a>;
    }
}

export const FileDownloadLink = connectToStores(FileDownloadLinkComponent) as ComponentConstructor<PublicProps, any>;