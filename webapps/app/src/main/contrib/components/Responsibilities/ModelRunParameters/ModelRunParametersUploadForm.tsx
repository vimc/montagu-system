import * as React from "react";
import fetcher from "../../../../shared/sources/Fetcher";
import {UploadState} from "../BurdenEstimates/UploadForm";

const formStyles = require("../../../../shared/styles/forms.css");
const buttonStyles = require("../../../../shared/styles/buttons.css");
const styles = require("../Responsibilities.css");

interface UploadFormProps {
    groupId: string;
    touchstoneId: string;
    diseases: string[];
    token: string;
}

export class ModelRunParametersUploadForm extends React.Component<UploadFormProps, UploadState> {

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

        const uploadText = "Choose a new model run parameter set";
        const props = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(props.token);
        const enabled = props.token != null;
        const diseases = this.props.diseases.map((disease) => <option key={disease} value={disease}>{disease}</option>);

        return <div>
            <form action={url} className={formStyles.form}
                  method="POST" encType="multipart/form-data">
                <div className="form-group">
                    <label className={formStyles.customFileUpload}>
                        <input name="file" type="file" onChange={this.handleChange.bind(this)}/>
                        <div className={`${buttonStyles.button} ${styles.button} mt-2 mb-2`}>
                            {uploadText}
                        </div>
                        <div className="mr-5">{this.state.fileSelected ? "File selected: " + this.state.fileName : ""}</div>
                    </label>
                </div>
                <div className="form-group">
                    <select name="disease">{diseases}</select>
                </div>
                <button type="submit"
                        disabled={!this.state.fileSelected || !enabled}>Upload
                </button>
            </form>
        </div>;
    }
}