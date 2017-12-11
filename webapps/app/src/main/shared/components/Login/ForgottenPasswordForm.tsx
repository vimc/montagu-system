import * as React from "react";
import { ReformProps } from "alt-reform";
import { ValidationError } from "./ValidationError";

import "../../styles/forms.scss";

export class ForgottenPasswordFormComponent extends React.Component<ReformProps, undefined> {

    render() {

        const disabled = this.props.loading;
        return <form className="form" onSubmit={ this.props.submit }>
            <div className="fields">
                <input name="email" type="email" placeholder="Email address"
                       disabled={ disabled }
                       { ...this.props.fields.email } />
                <ValidationError message={ this.props.errors.email } />
                <ValidationError message={ this.props.store.state.submitError } />
            </div>
            <button type="submit"
                    disabled={ disabled }>Send password reset email
            </button>
        </form>;
    }
}

export const ForgottenPasswordPageTitle: string = "Forgotten your password?";