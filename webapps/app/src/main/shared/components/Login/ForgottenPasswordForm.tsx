import * as React from "react";
import { reduxForm, Field} from "redux-form";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Dispatch } from "redux";

import { ValidationError } from "./ValidationError";
import { validations } from "../../modules/reduxForm";
import { authActions } from "../../actions/authActions";
import { GlobalState } from "../../reducers/GlobalState";
import {InputFieldProps} from "../../types";

export interface ForgotPasswordFormProps {
    handleSubmit: (F: Function) => any;
    submit: (values: ForgotPasswordFormFields) => void;
}

export interface ForgotPasswordFormFields{
    email: string;
}

export class ForgottenPasswordFormComponent extends React.Component<ForgotPasswordFormProps, undefined> {
    renderField(data: InputFieldProps)
    {
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
                    </div>
                    <button
                        type="submit"
                    >
                        Log in
                    </button>
                </form>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch: Dispatch<any>): Partial<ForgotPasswordFormProps> {
    return {
        submit : (values: ForgotPasswordFormFields) => dispatch(authActions.forgotPassword(values.email))
    }
}

export const ForgottenPasswordForm = compose(
    reduxForm({ form: 'forgotPassword'}),
    connect(state => state, mapDispatchToProps),
)(ForgottenPasswordFormComponent);
