import * as React from "react";

import { settings } from "../Settings";
import {helpers} from "../Helpers";
import {ErrorInfo, Result} from "../models/Generated";
import {Alert} from "reactstrap";

import {CustomValidationResult} from "../validation/FileValidationHelpers";

export interface UploadFileProps {
    token: string;
    uploadText: string;
    enableSubmit: boolean;
    successMessage: string;
    validatePath?: (path: string) => CustomValidationResult;
}

export interface UploadFileState {
    fileSelected: boolean;
    fileName: string;
    hasSuccess: boolean;
    serverErrors: ErrorInfo[];
}

export class UploadFileForm extends React.Component<UploadFileProps, UploadFileState> {
    constructor() {
        super();

        const result = helpers.ingestQueryStringAndReturnResult();
        this.state = {
            fileSelected: false,
            fileName: "",
            hasSuccess: result != null && (result as Result).status == "success",
            serverErrors: result ? result.errors : []
        };
    }

    handleChange(e: React.MouseEvent<HTMLInputElement>) {
        const filePath = (e.target as HTMLInputElement).value.replace("C:\\fakepath\\", "");
        this.setState({
            hasSuccess: false,
            serverErrors: [],
            fileSelected: true,
            fileName: filePath
        });
    }

    validatePath(): CustomValidationResult {
        if (this.props.validatePath) {
            return this.props.validatePath(this.state.fileName);
        }
        return { isValid: true, content: null };
    }

    buildURL(urlFragment: string): string {
        return settings.apiUrl() + urlFragment;
    }
    buildOneTimeLink(token: string): string {
        return this.buildURL(`/onetime_link/${token}/`);
    }

    render() {
        const url = this.buildOneTimeLink(this.props.token);
        const enableSubmit = this.props.enableSubmit
            && this.props.token != null
            && this.state.fileSelected
            && this.validatePath().isValid;

        const hasError = this.state.serverErrors.length > 0;

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
                    </label>

                    <div className="mr-5">
                        {this.renderSelectedFile()}
                    </div>
                </div>
                <Alert color="danger" isOpen={hasError}>
                    {this.state.serverErrors[0] && this.state.serverErrors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.hasSuccess}>
                    {this.props.successMessage}
                </Alert>
                <button type="submit" className={enableSubmit ? "" : "disabled"}
                        disabled={!enableSubmit}>Upload
                </button>
            </form>
        </div>;
    }

    renderSelectedFile(): JSX.Element {
        if (this.state.fileSelected) {
            const problems = this.validatePath();
            return <span>
                File selected: {this.state.fileName}
                <Alert color="danger" isOpen={!problems.isValid} className="mt-3 pathProblems">
                    {problems.content}
                </Alert>
            </span>;
        } else {
            return null;
        }
    }
}