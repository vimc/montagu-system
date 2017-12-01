import * as React from "react";
import {BurdenEstimateSet} from "../../../../shared/models/Generated";
import {settings} from "../../../../shared/Settings";
import {UploadForm} from "../../../../shared/components/UploadForm";

const messageStyles = require("../../../../shared/styles/messages.css");

interface UploadFormProps {
    groupId: string;
    canUpload: boolean;
    scenarioId: string;
    currentEstimateSet: BurdenEstimateSet;
    token: string;
}

export class UploadBurdenEstimatesForm extends React.Component<UploadFormProps, undefined> {

    render() {

        const uploadText = "Choose a new burden estimate set";

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

        const uploadForm = this.props.canUpload ?
            <UploadForm token={this.props.token} enableSubmit={this.props.canUpload} uploadText={uploadText}/>
            : null;

        return <div>
            <div className={messageStyles.info}>{lastUploadedText} <br/> {helperText}</div>
            {uploadForm}
        </div>;
    }
}