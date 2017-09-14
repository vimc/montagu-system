import * as React from "react";
import { Responsibility } from "../../../../shared/models/Generated";

const formStyles = require("../../../../shared/styles/forms.css");
const styles = require("../Responsibilities.css");

export interface UploadFormProps {
    groupId: string;
    canUpload: boolean;
    responsibility: Responsibility;
}

export class UploadForm extends React.Component<UploadFormProps, undefined> {

    render() {

        const uploadText = this.props.canUpload ? "Upload a new burden estimate set" : "No more burden estimates can be uploaded";
        const href = `/${this.props.groupId}/${this.props.responsibility.scenario.id}`;

        const hasUploadedEstimate = this.props.responsibility.current_estimate_set != null;
        const estimates = hasUploadedEstimate ?
            <div className={ styles.estimates }>You last uploaded an estimate on {this.props.responsibility.current_estimate_set.uploaded_on}.</div>
            : <div className={ styles.estimates }>
                You have not uploaded any burden estimate sets.
            </div>;

        return <form className={formStyles.form} action={href} method="POST">
            <div>
                <label className={formStyles.customFileUpload}>
                <input name="file" type="file"
                       disabled={!this.props.canUpload}/>
                    <div className={formStyles.button}>Choose file</div>
                </label>
            </div>
            <button type="submit"
                    disabled={!this.props.canUpload}>{uploadText}
            </button>
            {estimates}
        </form>;
    }
}