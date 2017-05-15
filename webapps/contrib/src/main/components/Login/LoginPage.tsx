import * as React from "react";
import AltReform, { FormConnector, Reform, ReformProps } from "alt-reform";
import FormActions from "../../FormActions";
import { PageWithHeader } from "../PageWithHeader/PageWithHeader";
import { ValidationError } from "./ValidationError";
import { alt } from "../../alt";
import fetcher from "../../sources/Fetcher";
import * as Validation from "../../Validation";
import { authActions } from "../../actions/AuthActions";
import * as MainStore from '../../stores/MainStore';

const formStyles = require('../../styles/forms.css');
const { submitFailed } = FormActions("Login");

export interface LoginFields {
    email: string;
    password: string;
}

export const loginForm: Reform<LoginFields> = AltReform("Login", alt, {
    fields: {
        email: Validation.required("Email address"),
        password: Validation.required("Password"),
        errors: () => {
        },
    },
    onSubmit: (state: LoginFields) => {
        const data = "grant_type=client_credentials";
        return fetcher.fetch("/authenticate/", {
            method: "POST",
            headers: {
                'Authorization': 'Basic ' + btoa(`${state.email}:${state.password}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        }, false);
    },
    onSubmitSuccess: (response: any) => {
        response.json().then((json: any) => {
            if (json.error) {
                alt.dispatch(submitFailed("Your username or password is incorrect"));
            } else {
                authActions.logIn(json.access_token);
                MainStore.Store.fetchDiseases();
            }
        });
    },
    onSubmitFail: (response: any) => {
        console.log("Error logging in: " + response);
        alt.dispatch(submitFailed("An error occurred logging in"));
    }
});

export class LoginFormComponent extends React.Component<ReformProps, undefined> {
    render() {
        const buttonStyle = {
            width: 140
        };
        const disabled = this.props.loading;
        return <form className={ formStyles.form } onSubmit={ this.props.submit }>
            <div className={ formStyles.fields }>
                <input name="email" type="email" placeholder="Email address"
                       disabled={ disabled }
                       { ...this.props.fields.email } />
                <ValidationError message={ this.props.errors.email } />
                <input name="password" type="password" placeholder="Password"
                       disabled={ disabled }
                       { ...this.props.fields.password } />
                <ValidationError message={ this.props.errors.password } />
                <ValidationError message={ this.props.store.state.submitError } />
            </div>
            <button type="submit"
                    style={ buttonStyle }
                    disabled={ disabled }>Log in ➡
            </button>
        </form>;
    }
}
const LoginForm = FormConnector(loginForm)(LoginFormComponent);

export class LoginPage extends PageWithHeader<undefined, undefined, undefined> {
    title(): JSX.Element {
        return <span>Log in</span>;
    }

    renderPageContent(): JSX.Element {
        return <LoginForm />;
    }
}