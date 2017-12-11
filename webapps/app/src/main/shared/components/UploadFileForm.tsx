import * as React from "react";
import fetcher from "../sources/Fetcher";
import {helpers} from "../Helpers";
import {ErrorInfo} from "../models/Generated";

import "../styles/forms.scss";
import "../styles/buttons.scss";

export interface UploadFileProps {
    token: string;
    uploadText: string;
    enableSubmit: boolean;
    successMessage: string;
}

export interface UploadFileState {
    fileSelected: boolean;
    fileName: string;
    showAlert: boolean;
    errors: ErrorInfo[];
}

export class UploadFileForm extends React.Component<UploadFileProps, UploadFileState> {
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

    handleChange(e: React.MouseEvent<HTMLInputElement>) {
        this.setState({
            showAlert: false,
            fileSelected: true,
            fileName: (e.target as HTMLInputElement).value.replace("C:\\fakepath\\", "")
        });
    }

    closeAlert() {
        this.setState({
            showAlert: false
        })
    }

    render() {

        const url = fetcher.fetcher.buildOneTimeLink(this.props.token);
        const enableSubmit = this.props.enableSubmit && this.props.token != null && this.state.fileSelected;

        const hasError = this.state.errors.length > 0;
        const alertClass = hasError ? "alert alert-danger" : "alert alert-success";
        const alertMessage = hasError ? this.state.errors[0].message : this.props.successMessage;

        const alert = this.state.showAlert ?
            <div className={alertClass}>
                <button type="button" style={{"outline": "none"}} className="close"
                        onClick={this.closeAlert.bind(this)}>
                    <span>&times;</span>
                </button>
                <span data-role={"alert-message"}>
                {alertMessage}
                </span>
            </div>
            : null;

        return <div>
            <form action={url} className="form"
                  method="POST" encType="multipart/form-data">
                {this.props.children}
                <div className="form-group">
                    <label className="customFileUpload">
                        <input name="file" type="file" onChange={this.handleChange.bind(this)}/>
                        <div className="button mt-2 mb-2">
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