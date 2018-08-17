import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../../report/reducers/reportAppReducers";
import {oneTimeTokenActionCreators} from "../actions/oneTimeTokenActionCreators";
import {APIService} from "../models/APIService";
import {buildURL} from "../services/AbstractLocalService";
import {isNullOrUndefined} from "util";

const url = require('url'),
    querystring = require("querystring");

// Props that are passed to the HOC, and then also passed-through to children
interface PropsSharedWithChildren {
    href: string;
    className?: string;
}

// Props that are passed to the HOC
interface PublicProps extends PropsSharedWithChildren {
    service?: APIService;
    // If set, then enabled will be set to false for this many seconds after
    // clicking. If the href changes, the disable will be cancelled
    delayBeforeReenable?: number;
}

// The complete set of props used by the HOC
interface Props extends PublicProps {
    token: string;
    refreshToken: (url: string, service: APIService) => void;
}

// These props are passed to the children
export interface OneTimeLinkProps extends PropsSharedWithChildren {
    enabled: boolean;
    loading?: boolean;
    tokenConsumed: () => void;
}

interface ComponentState {
    enabled: boolean;
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): Partial<Props> => {
    return {...props, token: state.onetimeTokens.tokens[props.href]}
};

const mapDispatchToProps = (dispatch: Dispatch<any>, props: Props): Props => {
    return {
        ...props,
        refreshToken: (url, service) => dispatch(oneTimeTokenActionCreators.fetchToken(url, service))
    }
};

export function OneTimeLinkContext(WrappedComponent: ComponentConstructor<OneTimeLinkProps, undefined>): React.ComponentClass<PublicProps> {
    return connect(mapStateToProps, mapDispatchToProps)(class OneTimeLinkContextWrapper extends React.Component<Props, ComponentState> {
        timeoutHandler: any;

        constructor(props?: Props) {
            super(props);
            this.state = {enabled: true};
        }

        componentDidMount() {
            this.refreshToken();
        }

        componentDidUpdate(prevProps: Props) {
            if (this.props.href != prevProps.href) {
                this.refreshToken();
                this.immediatelyEnable();
            }
        }

        componentWillUnmount() {
            this.immediatelyEnable();
        }

        render() {
            let href = null;
            const service = this.getService();
            if (this.props.token != null) {
                href = appendAccessToken(buildURL(this.props.href, service), this.props.token);
            }
            return <WrappedComponent
                className={this.props.className}
                href={href}
                enabled={this.props.href != null && this.state.enabled}
                loading={this.props.href != null && this.props.token == null}
                tokenConsumed={this.tokenConsumed.bind(this)}
                children={this.props.children}/>;
        }

        private tokenConsumed() {
            this.refreshToken();
            if (this.props.delayBeforeReenable) {
                this.disableTemporarily();
            }
        }

        private disableTemporarily() {
            setTimeout(() => this.setState({enabled: false}));
            this.timeoutHandler = setTimeout(() => this.setState({enabled: true}), this.props.delayBeforeReenable * 1000);
        }

        private immediatelyEnable() {
            if (this.timeoutHandler) {
                clearTimeout(this.timeoutHandler);
                this.timeoutHandler = null;
            }
            this.setState({enabled: true});
        }

        private refreshToken() {
            if (this.props.href != null) {
                this.props.refreshToken(this.props.href, this.getService());
            }
        }

        private getService(): APIService {
            return this.props.service || "main";
        }
    });
}

function appendAccessToken(path: string, token: string) {
    const parsed = url.parse(path, true);
    parsed.query["access_token"] = token;

    // we need to rebuild `search` now as it gets used by `format` under the hood
    parsed.search = querystring.stringify(parsed.query);
    return url.format(parsed)

}