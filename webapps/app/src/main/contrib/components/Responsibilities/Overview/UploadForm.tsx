import * as React from "react";
import { Responsibility } from "../../../../shared/models/Generated";

const formStyles = require("../../../../shared/styles/forms.css");
const commonStyles = require("../../../../shared/styles/common.css");
const buttonStyles = require("../../../../shared/styles/buttons.css");
const styles = require("../Responsibilities.css");

export interface UploadFormProps {
    groupId: string;
    canUpload: boolean;
    responsibility: Responsibility;
}

interface UploadState {
    fileSelected: boolean;
    display: boolean;
    fileName: string;
}

export class UploadForm extends React.Component<UploadFormProps, UploadState> {

    constructor() {
        super();
        this.state = {
            fileSelected: false,
            display: false,
            fileName: ""
        };
    }

    handleChange(e: any) {
        this.setState({
            fileSelected: true,
            fileName: e.target.value
        });
    }

    handleClick() {
        this.setState({ display: !this.state.display });
    }

    render() {

        const uploadText = this.props.canUpload ? "Upload a new burden estimate set" : "No more burden estimates can be uploaded";
        const href = `/${this.props.groupId}/${this.props.responsibility.scenario.id}`;

        return <div>
            <button onClick={this.handleClick.bind(this)}
                    className={this.state.display ? buttonStyles.arrowup : buttonStyles.arrowdown}>{uploadText}</button>
            <form className={formStyles.form} style={{ display: this.state.display ? "block" : "none" }} action={href}
                  method="POST">
                <div>
                    <label className={formStyles.customFileUpload}>
                        <input value={this.state.fileName} name="file" type="file" onChange={this.handleChange.bind(this)}
                               disabled={!this.props.canUpload}/>
                        <div className={`${buttonStyles.button} ${styles.button} ${commonStyles.mt5} ${commonStyles.mb5}`}>
                            Choose file
                        </div>
                        <div className={`${commonStyles.mr10}`}>{this.state.fileSelected ? "File selected: " + this.state.fileName : ""}</div>
                    </label>
                </div>
                <button type="submit"
                        disabled={!this.props.canUpload || !this.state.fileSelected}>Upload
                </button>
            </form>
        </div>;
    }
}