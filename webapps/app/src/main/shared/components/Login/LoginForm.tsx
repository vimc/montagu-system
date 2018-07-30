import * as React from "react";
import {Field, formValueSelector, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {compose} from "recompose";
import {Dispatch} from "redux";

import {InternalLink} from "../InternalLink";
import {ValidationError} from "./ValidationError";
import {validations} from "../../modules/reduxForm";
import {authActionCreators} from "../../actions/authActionCreators";
import {GlobalState} from "../../reducers/GlobalState";
import {InputFieldProps} from "../ReduxForm/types";

export interface LoginFormProps {
    email: string;
    handleSubmit: (F: Function) => any;
    errorMessage?: string;
    submit: (values: LoginFormFields) => void;
}

export interface LoginFormFields {
    email: string;
    password: string;
}

export class LoginFormComponent extends React.Component<LoginFormProps, undefined> {
    renderField(data: InputFieldProps) {
        const {input, label, type, meta: {touched, error}} = data;
        return <div>
            <input {...input} placeholder={label} type={type}/>
            <ValidationError message={touched && error ? label + error : null}/>
        </div>;
    }

    render() {
        let forgottenLink = "/forgotten-password/";
        if (this.props.email) {
            forgottenLink += `?email=${this.props.email}`;
        }

        return (
            <div>
                <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
                    <div className="fields">
                        <Field
                            name="email"
                            component={this.renderField}
                            type="text"
                            label="Email address"
                            validate={[validations.required, validations.email]}
                        />
                        <Field
                            name="password"
                            component={this.renderField}
                            type="password"
                            label="Password"
                            validate={[validations.required]}
                        />
                        <ValidationError message={this.props.errorMessage}/>
                    </div>
                    <button type="submit">Log in</button>
                </form>
                <div style={{"clear": "both"}}>
                    Forgotten your password?&nbsp;
                    <InternalLink className="forgotten-password-link" href={forgottenLink}>
                        Click here
                    </InternalLink>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: GlobalState): Partial<LoginFormProps> {
    return {
        // Gets the form field value from the state
        email: formValueSelector('login')(state, "email"),
        errorMessage: state.auth.errorMessage
    };
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<LoginFormProps> {
    return {
        submit: (values: LoginFormFields) => dispatch(authActionCreators.logIn(values.email, values.password))
    }
}

const enhance = compose(
    reduxForm({form: 'login'}),
    connect(mapStateToProps, mapDispatchToProps),
);

export const LoginForm = enhance(LoginFormComponent);
