import * as React from "react";
import { BurdenEstimateSet } from "../../../../shared/models/Generated";
import { settings } from "../../../../shared/Settings";
import { estimateTokenActions } from "../../../actions/EstimateActions";
import { responsibilityStore } from "../../../stores/ResponsibilityStore";
import fetcher from "../../../../shared/sources/Fetcher";

const formStyles = require("../../../../shared/styles/forms.css");
const commonStyles = require("../../../../shared/styles/common.css");
const buttonStyles = require("../../../../shared/styles/buttons.css");
const styles = require("../Responsibilities.css");
const messageStyles = require("../../../../shared/styles/messages.css");

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

        const uploadText = this.props.canUpload ? "Choose a new burden estimate set" : "No more burden estimates can be uploaded";

        const lastUploadedText = this.props.currentEstimateSet != null ?
            `You last uploaded an estimate on ${this.props.currentEstimateSet.uploaded_on}.`
            :
                "You have not uploaded any burden estimate sets.";

        const supportEmail = `mailto:${settings.supportContact}`;
        const helperText = !this.props.canUpload ?
            <p>The burden estimates uploaded by your modelling group have been reviewed
                and approved.
                You cannot upload any new estimates. If you need to upload new estimates (e.g. for corrections) please
                contact us <a href={supportEmail}>here</a>.</p>

            : "";

        const props = this.props;
        const url = fetcher.fetcher.buildOneTimeLink(props.token);
        const enabled = props.token != null;

        return <div>
            <div className={messageStyles.info}>{lastUploadedText} <br/> {helperText}</div>
            <form className={formStyles.form} action={url}
                  method="POST">
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