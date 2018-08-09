import * as React from "react";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import {helpers} from "../../../../shared/Helpers";
import {Alert} from "reactstrap";
import {ErrorInfo, Result} from "../../../../shared/models/Generated";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";
import {checkFileExtensionIsCSV} from "../../../../shared/validation/FileValidationHelpers";
import {settings} from "../../../../shared/Settings";

interface UploadBurdenEstimatesFormComponentProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    estimateSetId: number;
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

    onDismiss() {
        this.setState({
            errors: []
        })
    }

    render() {
        const {groupId, touchstoneId, scenarioId, estimateSetId} = this.props;
        const redirectUrl = encodeURIComponent(window.location.href);
        const url = `/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${estimateSetId}/multipart/?redirectResultTo=${redirectUrl}`;
        const uploadSuccessMessage = "Success! You have uploaded a new set of burden estimates";
        const hasError = this.state.errors.length > 0;

        const uploadForm = this.props.canUpload ?
            <UploadFileForm href={url}
                            enableSubmit={true}
                            successMessage={uploadSuccessMessage}
                            validatePath={checkFileExtensionIsCSV}
            />
            : null;

        const createForm = this.props.canCreate && !this.props.canUpload && !this.state.hasUploadSuccess ?
            <CreateBurdenEstimateSetForm groupId={this.props.groupId}
                                         touchstoneId={this.props.touchstoneId}
                                         scenarioId={this.props.scenarioId}/>
            : null;

        return <div>
            <Alert color="danger" isOpen={hasError} toggle={this.onDismiss.bind(this)}>
                {this.state.errors[0] && this.state.errors[0].message}
            </Alert>
            <Alert color="success" isOpen={this.state.hasUploadSuccess}>
                {uploadSuccessMessage}
            </Alert>

            {createForm}
            {uploadForm}
        </div>;
    }
}