import * as React from "react";
import { OnetimeToken } from "../models/OnetimeToken";
import { onetimeTokenStore } from "../stores/OnetimeTokenStore";
import fetcher from "../../shared/sources/Fetcher";
import { connectToStores } from "../../shared/alt";
import { doNothing } from "../../shared/Helpers";

interface PublicProps {
    href: string;
}

interface Props extends PublicProps {
    token: OnetimeToken;
}

class FileDownloadLinkComponent extends React.Component<Props, undefined> {
    static getStores() {
        return [onetimeTokenStore]
    }

    static getPropsFromStores(props: Props): Props {
        return {
            href: props.href,
            token: onetimeTokenStore.getToken(onetimeTokenStore.getState(), props.href)
        }
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.token == null) {
                onetimeTokenStore.fetchToken(this.props.href).catch(doNothing);
            }
        });
    }

    render() {
        let href = null;
        let disabled = true;
        if (this.props.token != null) {
            href = fetcher.fetcher.buildReportingURL(this.props.token.data.url) + "?access_token=" + this.props.token.raw;
            disabled = false;
        }

        return <a href={href} disabled={disabled}>
            {this.props.children}
        </a>;
    }
}

export const FileDownloadLink = connectToStores(FileDownloadLinkComponent) as ComponentConstructor<PublicProps, any>;