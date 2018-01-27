import * as React from "react";
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { login } from '../../_actions/AuthActions';
import { InternalLink } from "../InternalLink";
import { ValidationError } from "./ValidationError";

export interface LoginFormProps {
    handleSubmit: (F: any) => any;
    errorMessage?: string;
    dispatch: any;
}

const validations = {
    required: (value: string) => (value
            ? undefined
            : ' is required'),
    email: (value: string) => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
            ? ' is invalid'
            : undefined)

}

const renderField = (data: any) => {
    const { input, label, type, meta: { touched,  error } } = data;
    return <div>
        <input {...input} placeholder={label} type={type}/>
        <ValidationError message={ touched && error ? label + error : null } />
    </div>
}

class LoginFormView extends React.Component<LoginFormProps, undefined> {
    constructor() {
        super();
        this.submit = this.submit.bind(this);
    }

    submit(values: any) {
        this.props.dispatch(login(values.email, values.password));
    }

    render() {
        return (
            <div>
                <form className="form" onSubmit={this.props.handleSubmit(this.submit)}>
                    <div className="fields">
                        <Field
                            name="email"
                            component={renderField}
                            type="text"
                            label="Email address"
                            validate={[validations.required, validations.email]}
                        />
                        <Field
                            name="password"
                            component={renderField}
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

const enhance = compose(
    reduxForm({ form: 'login' }),
    connect(mapStateToProps),
);

export const LoginForm = enhance(LoginFormView);
