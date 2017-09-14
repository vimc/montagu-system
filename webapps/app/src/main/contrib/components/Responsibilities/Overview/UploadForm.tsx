import * as React from "react";
import { ReformProps } from "alt-reform";
import { ValidationError } from "../../../../shared/components/Login/ValidationError";

const formStyles = require("../../styles/forms.css");

export class UploadFormComponent extends React.Component<ReformProps, undefined> {

    render() {

        const disabled = this.props.loading;
        return <form className={ formStyles.form } onSubmit={ this.props.submit }>
            <div className={ formStyles.fields }>
                <input name="file" type="file"
                       disabled={ disabled }
                       { ...this.props.fields.file } />
                <ValidationError message={ this.props.errors.file } />
                <ValidationError message={ this.props.store.state.submitError } />
            </div>
            <button type="submit"
                    disabled={ disabled }>Upload
            </button>
        </form>;
    }
}