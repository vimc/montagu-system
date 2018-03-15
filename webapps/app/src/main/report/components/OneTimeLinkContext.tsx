import * as React from "react";
import {doNothing} from "../../shared/Helpers";
import {connectToStores} from "../../shared/alt";
import fetcher from "../../shared/sources/Fetcher";
import {OneTimeToken} from "../models/OneTimeToken";
import {oneTimeTokenStore} from "../stores/OneTimeTokenStore";
import {oneTimeTokenActions} from "../actions/OneTimeTokenActions";

interface PublicProps {
    href: string;
    style?: Partial<CSSStyleDeclaration>
}

interface Props extends PublicProps {
    token: OneTimeToken;
}

// These props are passed to the children
export interface OneTimeLinkProps extends PublicProps {
    refreshToken: () => void;
}

export function OneTimeLinkContext(WrappedComponent: ComponentConstructor<OneTimeLinkProps, undefined>): ComponentConstructor<PublicProps, undefined> {
    return connectToStores(class OneTimeLinkContextWrapper extends React.Component<Props, undefined> {
        static getStores() {
            return [oneTimeTokenStore]
        }

        static getPropsFromStores(props: Props): Props {
            return {
                href: props.href,
                token: oneTimeTokenStore.getToken(oneTimeTokenStore.getState(), props.href),
                style: props.style
            }
        }

        constructor() {
            super();
            this.refreshToken = this.refreshToken.bind(this);
        }

        componentWillReceiveProps(newProps: Props) {
            if (this.props.href != newProps.href) {
                this.refreshToken();
            }
        }

        componentDidMount() {
            this.refreshToken();
        }

        refreshToken(): void {
            setTimeout(() => {
                oneTimeTokenActions.clearUsedToken(this.props.href);
                oneTimeTokenStore.fetchToken(this.props.href).catch(doNothing);
            });
        }

        render() {
            let href = null;
            if (this.props.token != null) {
                href = fetcher.fetcher.buildReportingURL(this.props.token.data.url)
                    + "?access_token=" + this.props.token.raw;
            }
            return <WrappedComponent
                style={this.props.style}
                href={href}
                refreshToken={this.refreshToken}
                children={this.props.children} />;
        }
    });
}