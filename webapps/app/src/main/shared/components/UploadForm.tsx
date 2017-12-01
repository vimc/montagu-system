import * as React from "react";
import fetcher from "../sources/Fetcher";
import {helpers} from "../Helpers";
import {fail} from "assert";
import {ErrorInfo} from "../models/Generated";

const formStyles = require("../styles/forms.css");
const buttonStyles = require("../styles/buttons.css");

export interface UploadFormProps {
    token: string;
    uploadText: string;
    enableSubmit: boolean;
}

export interface UploadState {
    fileSelected: boolean;
    fileName: string;
    showAlert: boolean;
    errors: ErrorInfo[];
}

export class UploadForm extends React.Component<UploadFormProps, UploadState> {
    constructor() {
        super();

        const result = helpers.ingestQueryStringAndReturnResult();

        this.state = {
            fileSelected: false,
            fileName: "",
            showAlert: result != null,
            errors: result ? result.errors : []
        };
    }

    handleChange(e: any) {
        this.setState({
            showAlert: false,
            fileSelected: true,
            fileName: e.target.value.replace("C:\\fakepath\\", "")
        });
    }

    closeAlert(e: any) {
        this.setState({
            showAlert: false
        })
    }

    render() {

        const url = fetcher.fetcher.buildOneTimeLink(this.props.token);
        const enableSubmit = this.props.enableSubmit && this.props.token != null && this.state.fileSelected;

        const hasError = this.state.errors.length > 0;
        const alertClass = hasError ? "alert alert-danger": "alert alert-success";
        const alertMessage = hasError ? this.state.errors[0].message : "Success! You have uploaded a new model run parameter set";

        const alert = this.state.showAlert ?
            <div className={alertClass}>
                <button type="button" style={ {"outline": "none"}} className="close" onClick={this.closeAlert.bind(this)}>
                    <span>&times;</span>
                </button>
                {alertMessage}
            </div>
            : null;

        return <div>
            <form action={url} className={formStyles.form}
                  method="POST" encType="multipart/form-data">
                {this.props.children}
                <div className="form-group">
                    <label className={formStyles.customFileUpload}>
                        <input name="file" type="file" onChange={this.handleChange.bind(this)}/>
                        <div className={`${buttonStyles.button} mt-2 mb-2`}>
                            {this.props.uploadText}
                        </div>
                        <div
                            className="mr-5">{this.state.fileSelected ? "File selected: " + this.state.fileName : ""}</div>
                    </label>
                </div>
                {alert}
                <button type="submit" className={enableSubmit ? "" : "disabled"}
                        disabled={!enableSubmit}>Upload
                </button>
            </form>
        </div>;
    }
}