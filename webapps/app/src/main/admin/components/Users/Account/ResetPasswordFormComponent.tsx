import { ReformProps } from "alt-reform";
import { ValidationError } from "../../../../shared/components/Login/ValidationError";
import * as React from "react";

import "../../../../shared/styles/forms.scss";

export class ResetPasswordFormComponent extends React.Component<ReformProps, undefined> {

    render() {
        const disabled = this.props.loading;
        return <form className="form" onSubmit={ this.props.submit }>
            <div className="fields">
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