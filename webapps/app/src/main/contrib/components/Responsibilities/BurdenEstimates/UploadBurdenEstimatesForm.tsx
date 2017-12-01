import * as React from "react";
import {BurdenEstimateSet} from "../../../../shared/models/Generated";
import {settings} from "../../../../shared/Settings";
import {UploadForm} from "../../../../shared/components/UploadForm";
import {CurrentEstimateSetSummary} from "../Overview/List/CurrentEstimateSetSummary";

interface UploadBurdenEstimateFormProps {
    canUpload: boolean;
    currentEstimateSet: BurdenEstimateSet;
    token: string;
}

export class UploadBurdenEstimatesForm extends React.Component<UploadBurdenEstimateFormProps, undefined> {

    render() {

        const uploadText = "Choose a new burden estimate set";

        const uploadForm = this.props.canUpload ?
            <UploadForm token={this.props.token} enableSubmit={this.props.canUpload} uploadText={uploadText}/>
            : null;

        return <div>
            <CurrentEstimateSetSummary estimateSet={this.props.currentEstimateSet} canUpload={this.props.canUpload}/>
            {uploadForm}
        </div>;
    }
}