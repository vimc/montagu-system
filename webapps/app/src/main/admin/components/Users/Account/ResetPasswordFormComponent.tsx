import { ReformProps } from "alt-reform";
import { ValidationError } from "../../../../shared/components/Login/ValidationError";
import * as React from "react";

const formStyles = require("../../../../shared/styles/forms.css");

export class ResetPasswordFormComponent extends React.Component<ReformProps, undefined> {

    render() {
        const disabled = this.props.loading;
        return <form className={ formStyles.form } onSubmit={ this.props.submit }>
            <div className={ formStyles.fields }>
                <input name="password" type="password" placeholder="New password"
                       { ...this.props.fields.password } />
                <ValidationError message={ this.props.errors.password } />
                <ValidationError message={ this.props.store.state.submitError } />
            </div>
            <button type="submit"
                    disabled={ disabled }>Update
            </button>
        </form>;
    }
}