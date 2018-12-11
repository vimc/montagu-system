import * as React from "react";
import {UploadFileForm} from "../../../../shared/components/UploadFileForm";
import {helpers} from "../../../../shared/Helpers";
import {Alert} from "reactstrap";
import {BurdenEstimateSet, ErrorInfo, Result} from "../../../../shared/models/Generated";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";
import {checkFileExtensionIsCSV} from "../../../../shared/validation/FileValidationHelpers";

export interface UploadBurdenEstimatesFormComponentProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    estimateSet: BurdenEstimateSet | null;
    canUpload: boolean;
    canCreate: boolean;
}

interface State {
    hasUploadSuccess: boolean;
    errors: ErrorInfo[]

}

export class UploadBurdenEstimatesForm extends React.Component<UploadBurdenEstimatesFormComponentProps, State> {
    private uploadSuccessMessage = "Success! You have uploaded a new set of burden estimates";

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
        const hasError = this.state.errors.length > 0;

        const createForm = this.props.canCreate && !this.props.canUpload && !this.state.hasUploadSuccess ?
            <CreateBurdenEstimateSetForm groupId={this.props.groupId}
                                         touchstoneId={this.props.touchstoneId}
                                         scenarioId={this.props.scenarioId}/>
            : null;

        return <div>
            <Alert color="danger" isOpen={hasError} toggle={this.onDismiss.bind(this)}>
                <p className="render-whitespace">
                    {this.state.errors[0] && this.state.errors[0].message}
                </p>
                 Please correct the data and re-upload.
            </Alert>
            <Alert color="success" isOpen={this.state.hasUploadSuccess}>
                {this.uploadSuccessMessage}
            </Alert>

            {createForm}
            {this.renderUploadForm()}
        </div>;
    }

    renderUploadForm(): JSX.Element {
        if (this.props.canUpload) {
            const {groupId, touchstoneId, scenarioId, estimateSet} = this.props;
            const redirectUrl = encodeURIComponent(helpers.getCurrentLocation());
            const url = `/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${estimateSet.id}/?redirectResultTo=${redirectUrl}`;
            return <div className={"bg-light p-3"}>
                <h5>Second step: upload a CSV containing your central estimates</h5><UploadFileForm href={url}
                                   enableSubmit={true}
                                   successMessage={this.uploadSuccessMessage}
                                   validatePath={checkFileExtensionIsCSV}
            /></div>
        } else {
            return null;
        }
    }
}