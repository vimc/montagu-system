import * as React from "react";
import {InternalLink} from "../../../../shared/components/InternalLink";
import {jwtTokenAuth} from "../../../../shared/modules/jwtTokenAuth";
import {helpers} from "../../../../shared/Helpers";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageWithHeader";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import {connect, Dispatch} from "react-redux";
import {AdminPageHeader} from "../../AdminPageHeader";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {setPasswordPageActionCreators} from "../../../actions/pages/SetPasswordPageActionCreators";
import {SetPasswordForm} from "./SetPasswordForm";

export interface SetPasswordPageProps extends PageProperties<undefined> {
    token: string;
    saveTokenToState: (token: string) => void;
}

export class SetPasswordPageComponent extends React.Component<SetPasswordPageProps> {
    static title: string = "Enter a new password";

    componentDidMount() {
        const tokenFromUrl = helpers.queryStringAsObject().token;
        this.props.saveTokenToState(tokenFromUrl);
        this.props.onLoad()
    }

    render(): JSX.Element {
        let content: JSX.Element = null;
        if (jwtTokenAuth.isCompressedTokenValid(this.props.token)) {
            content = <SetPasswordForm resetToken={this.props.token}/>;
        } else {
            content = <RequestResetLinkButton/>;
        }

        return <div>
            <AdminPageHeader/>
            <PageArticle title={SetPasswordPageComponent.title}>
                {content}
            </PageArticle>
        </div>;
    }
}

function mapStateToProps(state: AdminAppState, props: SetPasswordPageProps): Partial<SetPasswordPageProps> {
    return {...props, token: state.users.setPasswordToken};
}

function mapDispatchToProps(dispatch: Dispatch<AdminAppState>): Partial<SetPasswordPageProps> {
    return {
        onLoad: () => dispatch(setPasswordPageActionCreators.onLoad()),
        saveTokenToState: (token: string) => dispatch(setPasswordPageActionCreators.saveToken(token))
    }
}

export const SetPasswordPage = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(SetPasswordPageComponent) as React.ComponentClass<SetPasswordPageProps>;

export class RequestResetLinkButton extends React.Component<undefined> {
    render(): JSX.Element {
        return <div className="mt-3">
            <div className="alert alert-warning">This password reset link has expired. Please request a new one</div>
            <InternalLink href="/forgotten-password/">
                <button>Request new reset password link</button>
            </InternalLink>
        </div>;
    }
}