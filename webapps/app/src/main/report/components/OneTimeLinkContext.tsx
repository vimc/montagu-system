import * as React from "react";
import {doNothing} from "../../shared/Helpers";
import {connectToStores} from "../../shared/alt";
import fetcher from "../../shared/sources/Fetcher";
import {OneTimeToken} from "../models/OneTimeToken";
import {oneTimeTokenStore} from "../stores/OneTimeTokenStore";
import {oneTimeTokenActions} from "../actions/OneTimeTokenActions";
import {ReactElement} from "react";

interface PublicProps {
    href: string;
}

interface Props extends PublicProps {
    token: OneTimeToken;
}

// These props are passed to the children
export interface OneTimeLinkProps {
    href?: string;
    refreshToken?: () => void;
}

// This is a component that needs to get data from its parent component (the 'href' prop) but also
// from the stores (the 'token' prop). So in `getPropsFromStores` we pass through the `href` prop
// unchanged, and also use it to determine which token to retrieve from the store.
export class OneTimeLinkContextComponent extends React.Component<Props, undefined> {
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
        const childProps: OneTimeLinkProps = {
            href: null,
            refreshToken: this.refreshToken
        };

        if (this.props.token != null) {
            childProps.href = fetcher.fetcher.buildReportingURL(this.props.token.data.url)
                + "?access_token=" + this.props.token.raw;
        }

        const childrenWithProps = React.Children.map(this.props.children, child => {
            const c = child as ReactElement<OneTimeLinkProps>;
            return React.cloneElement(c, Object.assign({}, c.props, childProps))
        });

        return <span>
            {childrenWithProps}
        </span>;
    }
}

// We cast this to a component with props of type `PublicProps`, as these are the subset of the props
// that are not filled in from the stores
export const OneTimeLinkContext = connectToStores(OneTimeLinkContextComponent) as ComponentConstructor<PublicProps, any>;