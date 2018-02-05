import * as React from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dispatch } from "redux";

import { InternalLink } from "../InternalLink";
import { ValidationError } from "./ValidationError";
import { validations } from "../../modules/ReduxForm";
import { authActions } from "../../actions/authActions";

export interface LoginFormProps {
    handleSubmit: (F: any) => any;
    errorMessage?: string;
    submit: Function;
}

export class LoginFormComponent extends React.Component<LoginFormProps, undefined> {
    renderField(data: any) {
        const { input, label, type, meta: { touched,  error } } = data;
        return <div>
            <input {...input} placeholder={label} type={type}/>
            <ValidationError message={ touched && error ? label + error : null } />
        </div>;
    }

    render() {
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
                        <ValidationError message={ this.props.errorMessage } />
                    </div>
                    <button
                        type="submit"
                    >
                        Log in
                    </button>
                </form>
                <div style={{"clear": "both"}}>
                    Forgotten your password?&nbsp;
                    <InternalLink href={"/forgotten-password/"}>
                        Click here
                    </InternalLink>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: any) {
    return { errorMessage: state.auth.errorMessage || null };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        submit : (values: any) => dispatch(authActions.logIn(values.email, values.password))
    }
}

const enhance = compose(
    reduxForm({ form: 'login'}),
    connect(mapStateToProps, mapDispatchToProps),
);

export const LoginForm = enhance(LoginFormComponent);
