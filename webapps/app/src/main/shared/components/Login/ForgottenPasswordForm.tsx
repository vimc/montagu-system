import * as React from "react";
import { ReformProps } from "alt-reform";
import { ValidationError } from "./ValidationError";

const formStyles = require("../../styles/forms.css");

export class ForgottenPasswordFormComponent extends React.Component<ReformProps, undefined> {

    render() {

        const disabled = this.props.loading;
        return <form className={ formStyles.form } onSubmit={ this.props.submit }>
            <div className={ formStyles.fields }>
                <input name="email" type="email" placeholder="Email address"
                       disabled={ disabled }
                       { ...this.props.fields.email } />
                <ValidationError message={ this.props.errors.email } />
                <ValidationError message={ this.props.store.state.submitError } />
            </div>
            <button type="submit"
                    disabled={ disabled }>Send password reset email ➡
            </button>
        </form>;
    }
}