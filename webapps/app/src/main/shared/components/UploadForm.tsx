import * as React from "react";
import fetcher from "../sources/Fetcher";

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
}

export class UploadForm extends React.Component<UploadFormProps, UploadState> {
    constructor() {
        super();
        this.state = {
            fileSelected: false,
            fileName: ""
        };
    }

    handleChange(e: any) {
        this.setState({
            fileSelected: true,
            fileName: e.target.value.replace("C:\\fakepath\\", "")
        });
    }

    render() {

        const props = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(props.token);

        const enableSubmit = this.props.enableSubmit && props.token != null && this.state.fileSelected;

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
                <button type="submit"
                        disabled={!enableSubmit}>Upload
                </button>
            </form>
        </div>;
    }
}