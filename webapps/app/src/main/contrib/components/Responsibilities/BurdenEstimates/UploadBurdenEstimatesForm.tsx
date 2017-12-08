import * as React from "react";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import {helpers} from "../../../../shared/Helpers";
import {Alert} from "../../../../shared/components/Alert";
import {ErrorInfo, Result} from "../../../../shared/models/Generated";

interface UploadBurdenEstimatesFormComponentProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    estimatesToken: string;
    canUpload: boolean;
    canCreate: boolean;
}

interface State {
    hasUploadSuccess: boolean;
    errors: ErrorInfo[]

}

export class UploadBurdenEstimatesForm extends React.Component<UploadBurdenEstimatesFormComponentProps, State> {

    constructor() {
        super();
        const result = helpers.ingestQueryStringAndReturnResult();
        this.state = {
            hasUploadSuccess: result != null && (result as Result).status == "success",
            errors: result ? result.errors : []
        }
    }

    render() {

        const uploadSuccessMessage = "Success! You have uploaded a new set of burden estimates";
        const hasError = this.state.errors.length > 0;
        const alertMessage = hasError ? this.state.errors[0].message : uploadSuccessMessage;

        const uploadForm = this.props.canUpload ?
            <UploadFileForm token={this.props.estimatesToken}
                            enableSubmit={true}
                            uploadText={"Upload estimates for this set"}
                            successMessage={uploadSuccessMessage}/>
            : null;

        const createForm = this.props.canCreate && !this.props.canUpload ?
            <CreateBurdenEstimateSetForm groupId={this.props.groupId}
                                         touchstoneId={this.props.touchstoneId}
                                         scenarioId={this.props.scenarioId}/>
            : null;

        return <div>
            <Alert hasSuccess={this.state.hasUploadSuccess} hasError={this.state.errors.length > 0}
                   message={alertMessage}/>
            {createForm}
            {uploadForm}
        </div>;
    }
}