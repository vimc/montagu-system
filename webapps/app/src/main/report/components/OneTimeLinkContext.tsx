import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../reducers/reportAppReducers";
import {oneTimeTokenActionCreators} from "../actionCreators/oneTimeTokenActionCreators";
import {buildReportingURL} from "../services/AbstractReportLocalService";

const url = require('url'),
    querystring = require("querystring");

interface PublicProps {
    href: string;
    className?: string;
}

interface PropsFromState extends PublicProps {
    token: string;
}

interface Props extends PropsFromState {
    refreshToken: (url: string) => void;
}

// These props are passed to the children
export interface OneTimeLinkProps extends PublicProps {
    refreshToken: () => void;
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): PropsFromState => {
    return {...props, token: state.onetimeTokens.tokens[props.href]}
};

const mapDispatchToProps = (dispatch: Dispatch<any>, props: PropsFromState): Props => {
    return {...props, refreshToken: (url) => setTimeout(() => dispatch(oneTimeTokenActionCreators.fetchToken(url)))}
};

export function OneTimeLinkContext(WrappedComponent: ComponentConstructor<OneTimeLinkProps, undefined>) {
    return connect(mapStateToProps, mapDispatchToProps)(class OneTimeLinkContextWrapper extends React.Component<Props> {

        componentWillReceiveProps(newProps: Props) {
            if (this.props.href != newProps.href) {
                this.props.refreshToken(newProps.href);
            }
        }

        componentDidMount() {
            this.props.refreshToken(this.props.href);
        }

        render() {
            let href = null;
            if (this.props.token != null) {
                href = appendAccessToken(this.props.href, this.props.token);
            }
            return <WrappedComponent
                className={this.props.className}
                href={href}
                refreshToken={() => this.props.refreshToken(this.props.href)}
                children={this.props.children}/>;
        }
    })
}

function appendAccessToken(path: string, token: string) {
    const parsed = url.parse(buildReportingURL(path), true);
    parsed.query["access_token"] = token;

    // we need to rebuild `search` now as it gets used by `format` under the hood
    parsed.search = querystring.stringify(parsed.query);
    return url.format(parsed)

}