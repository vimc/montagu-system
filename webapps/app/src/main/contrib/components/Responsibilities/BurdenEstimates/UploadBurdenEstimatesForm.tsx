import * as React from "react";
import {BurdenEstimateSet} from "../../../../shared/models/Generated";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
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
            <UploadFileForm token={this.props.token} enableSubmit={this.props.canUpload} uploadText={uploadText}
                            successMessage={"Success! You have uploaded a new set of burden estimates"}/>
            : null;

        return <div>
            <CurrentEstimateSetSummary estimateSet={this.props.currentEstimateSet} canUpload={this.props.canUpload}/>
            {uploadForm}
        </div>;
    }
}