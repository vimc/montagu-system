import * as React from 'react';
import { PageWithHeader } from '../PageWithHeader/PageWithHeader'
import altForm, { AltForm } from 'alt-form';
import { connectToStores, alt } from '../../alt';

const formStyles = require("../../styles/forms.css");

interface LoginFormProps {
    email: string;
    password: string;
}

const loginForm = altForm<LoginFormProps>("Login", alt, {
    propTypes: {
        email: React.PropTypes.string.isRequired,
        password: React.PropTypes.string.isRequired
    }
});

class LoginFormComponent extends React.Component<AltForm<LoginFormProps>, undefined> {
    static getStores() {
        return [ loginForm.store ];
    }
    static getPropsFromStores() {
        return loginForm.getProps({
            email: "",
            password: ""
        });
    }

    canSubmit(): boolean {
        /*return this.props.state.email != ""
            && this.props.state.password != "";*/
        this.props.validate().then((state) => true, (errors) => false);
    }

    render() {
        const buttonStyle = {
            width: 140
        }
        return <form className={ formStyles.form }>
            <div className={ formStyles.fields }>
                <input type="text" placeholder="Email address" { ...this.props.props.email } />
                <input type="password" placeholder="Password" { ...this.props.props.password } />
            </div>
            <button
                    style={ buttonStyle }
                    onClick={ this.props.save }>Log in ➡</button>
        </form>;
    }
}
const LoginForm = connectToStores(LoginFormComponent);

export class LoginPage extends PageWithHeader<undefined, undefined> {
    title(): JSX.Element {
        return <span>Log in</span>;
    }

    renderPageContent(): JSX.Element {
        return <LoginForm />;
    }
}