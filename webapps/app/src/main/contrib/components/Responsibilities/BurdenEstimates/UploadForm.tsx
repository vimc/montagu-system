import * as React from "react";
import {BurdenEstimateSet} from "../../../../shared/models/Generated";
import fetcher from "../../../../shared/sources/Fetcher";
import {CurrentEstimateSetSummary} from "../Overview/List/CurrentEstimateSetSummary";

const formStyles = require("../../../../shared/styles/forms.css");
const commonStyles = require("../../../../shared/styles/common.css");
const buttonStyles = require("../../../../shared/styles/buttons.css");
const styles = require("../Responsibilities.css");

export interface UploadFormProps {
    groupId: string;
    canUpload: boolean;
    scenarioId: string;
    currentEstimateSet: BurdenEstimateSet;
    token: string;
}

interface UploadState {
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
        const uploadText = this.props.canUpload
            ? "Choose a new burden estimate set"
            : "No more burden estimates can be uploaded";
        const {canUpload, currentEstimateSet, token} = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(token);
        const enabled = token != null;

        return <div>
            <CurrentEstimateSetSummary estimateSet={currentEstimateSet} canUpload={canUpload}/>
            <form className={formStyles.form} action={url}
                  method="POST" encType="multipart/form-data">
                <div>
                    <label className={formStyles.customFileUpload}>
                        <input name="file" type="file" onChange={this.handleChange.bind(this)}
                               disabled={!this.props.canUpload}/>
                        <div className={`${buttonStyles.button} ${styles.button} ${commonStyles.mt5} ${commonStyles.mb5}
                        ${!this.props.canUpload ? buttonStyles.disabled : ""}`}>
                            {uploadText}
                        </div>
                        <div
                            className={`${commonStyles.mr10}`}>{this.state.fileSelected ? "File selected: " + this.state.fileName : ""}</div>
                    </label>
                </div>
                <button type="submit"
                        style={{ display: this.props.canUpload ? "block" : "none" }}
                        disabled={!this.props.canUpload || !this.state.fileSelected || !enabled}>Upload
                </button>
            </form>
        </div>;
    }
}