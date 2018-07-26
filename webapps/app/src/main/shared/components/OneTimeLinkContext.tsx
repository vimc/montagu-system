import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../../report/reducers/reportAppReducers";
import {oneTimeTokenActionCreators} from "../actions/oneTimeTokenActionCreators";
import {APIService} from "../models/APIService";
import {buildURL} from "../services/AbstractLocalService";

const url = require('url'),
    querystring = require("querystring");

interface PublicProps {
    href: string;
    className?: string;
    service?: APIService;
}

interface PropsFromState extends PublicProps {
    token: string;
}

interface Props extends PropsFromState {
    refreshToken: (url: string, service: APIService) => void;
}

// These props are passed to the children
export interface OneTimeLinkProps extends PublicProps {
    refreshToken: () => void;
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): PropsFromState => {
    return {...props, token: state.onetimeTokens.tokens[props.href]}
};

const mapDispatchToProps = (dispatch: Dispatch<any>, props: PropsFromState): Props => {
    return {...props, refreshToken: (url, service) => setTimeout(() => dispatch(oneTimeTokenActionCreators.fetchToken(url, service)))}
};

export function OneTimeLinkContext(WrappedComponent: ComponentConstructor<OneTimeLinkProps, undefined>): React.ComponentClass<PublicProps> {
    return connect(mapStateToProps, mapDispatchToProps)(class OneTimeLinkContextWrapper extends React.Component<Props> {

        componentWillReceiveProps(newProps: Props) {
            if (this.props.href != newProps.href) {
                this.props.refreshToken(newProps.href, this.getService());
            }
        }

        componentDidMount() {
            this.props.refreshToken(this.props.href, this.getService());
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
                service={this.props.service}
                refreshToken={() => this.props.refreshToken(this.props.href, service)}
                children={this.props.children}/>;
        }

        getService(): APIService {
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