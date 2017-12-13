import * as React from "react";
import fetcher from "../sources/Fetcher";
import {helpers} from "../Helpers";
import {ErrorInfo, Result} from "../models/Generated";
import {Alert} from "./Alert";

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
    hasSuccess: boolean;
    errors: ErrorInfo[];
}

export class UploadFileForm extends React.Component<UploadFileProps, UploadFileState> {
    constructor() {
        super();

        const result = helpers.ingestQueryStringAndReturnResult();

        this.state = {
            fileSelected: false,
            fileName: "",
            hasSuccess: result != null && (result as Result).status == "success",
            errors: result ? result.errors : []
        };
    }

    handleChange(e: React.MouseEvent<HTMLInputElement>) {
        this.setState({
            hasSuccess: false,
            errors: [],
            fileSelected: true,
            fileName: (e.target as HTMLInputElement).value.replace("C:\\fakepath\\", "")
        });
    }

    render() {

        const url = fetcher.fetcher.buildOneTimeLink(this.props.token);
        const enableSubmit = this.props.enableSubmit && this.props.token != null && this.state.fileSelected;

        const hasError = this.state.errors.length > 0;
        const alertMessage = hasError ? this.state.errors[0].message : this.props.successMessage;

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
                <Alert hasSuccess={this.state.hasSuccess} hasError={hasError} message={alertMessage}/>
                <button type="submit" className={enableSubmit ? "" : "disabled"}
                        disabled={!enableSubmit}>Upload
                </button>
            </form>
        </div>;
    }
}