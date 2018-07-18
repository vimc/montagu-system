import * as React from "react";
import {doNothing} from "../../shared/Helpers";
import fetcher from "../../shared/sources/Fetcher";
import {OneTimeToken} from "../models/OneTimeToken";
import {oneTimeTokenStore} from "../stores/OneTimeTokenStore";
import {oneTimeTokenActions} from "../actions/OneTimeTokenActions";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../reducers/reportAppReducers";

interface PublicProps {
    href: string;
    className?: string;
}

interface PropsFromState extends PublicProps {
    token: OneTimeToken;
}

interface Props extends PropsFromState {
    fetchNewToken: () => void;
}

// These props are passed to the children
export interface OneTimeLinkProps extends PublicProps {
    refreshToken: () => void;
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): PropsFromState => {
    return {...props, token: state.onetimeTokens.tokens[props.href]}
};

const mapDispatchToProps = (dispatch: Dispatch<any>, props: PublicProps): Props => {
    return {...props, fetchNewToken: dispatch(oneTimeTokenActions)}
};

export function OneTimeLinkContext(WrappedComponent: ComponentConstructor<OneTimeLinkProps, undefined>) {
    return connect(mapStateToProps)(class OneTimeLinkContextWrapper extends React.Component<Props> {

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
                className={this.props.className}
                href={href}
                refreshToken={this.refreshToken}
                children={this.props.children}/>;
        }
    })
}