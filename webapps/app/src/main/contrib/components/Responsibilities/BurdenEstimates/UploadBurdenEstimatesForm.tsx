import * as React from "react";
import {Alert} from "reactstrap";
import {BurdenEstimateSet, ErrorInfo} from "../../../../shared/models/Generated";
import {CreateBurdenEstimateSetForm} from "./CreateBurdenEstimateSetForm";
import {PopulateEstimatesForm} from "./PopulateBurdenEstimatesForm";
import {Dispatch} from "redux";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {connect} from "react-redux";

export interface UploadBurdenEstimatesFormPublicProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    estimateSet: BurdenEstimateSet | null;
    canUpload: boolean;
    canCreate: boolean;
}

export interface UploadBurdenEstimatesFormComponentProps extends UploadBurdenEstimatesFormPublicProps {
    hasSuccess: boolean;
    errors: ErrorInfo[];
    resetPopulateState: () => void;
}

export class UploadBurdenEstimatesFormComponent extends React.Component<UploadBurdenEstimatesFormComponentProps> {

    render() {
        const hasError = this.props.errors && this.props.errors.length > 0;

        const createForm = this.props.canCreate && !this.props.canUpload && !this.props.hasSuccess ?
            <CreateBurdenEstimateSetForm groupId={this.props.groupId}
                                         touchstoneId={this.props.touchstoneId}
                                         scenarioId={this.props.scenarioId}/>
            : null;

        return <div>
            <Alert color="danger" isOpen={hasError} toggle={this.props.resetPopulateState}>
                <p className="render-whitespace">
                    {hasError && this.props.errors[0].message}
                </p>
                Please correct the data and re-upload.
            </Alert>
            <Alert color="success" isOpen={this.props.hasSuccess} toggle={this.props.resetPopulateState}>
                Success! You have uploaded a new set of burden estimates
            </Alert>

            {createForm}
            {this.renderUploadForm()}
        </div>;
    }

    renderUploadForm(): JSX.Element {
        if (this.props.canUpload) {
            const {groupId, touchstoneId, scenarioId, estimateSet} = this.props;
            return <div className={"bg-light p-3"}>
                <h5>Second step: upload a CSV containing your central estimates</h5>
                <PopulateEstimatesForm groupId={groupId} touchstoneId={touchstoneId} scenarioId={scenarioId} setId={estimateSet.id}/>
            </div>
        } else {
            return null;
        }
    }
}

export const mapStateToProps: (state: ContribAppState, props: UploadBurdenEstimatesFormPublicProps)
    => Partial<UploadBurdenEstimatesFormComponentProps>
    = (state: ContribAppState, props: UploadBurdenEstimatesFormPublicProps) => {
    return {
        ...props,
        errors: state.estimates.populateErrors,
        hasSuccess: state.estimates.hasPopulateSuccess
    }
};

export const mapDispatchToProps:
    (dispatch: Dispatch<ContribAppState>, props: UploadBurdenEstimatesFormComponentProps)
        => UploadBurdenEstimatesFormComponentProps
    = (dispatch, props) => {
    return {
        ...props,
        resetPopulateState: () => dispatch(estimatesActionCreators.resetPopulateState())
    }
};

export const UploadBurdenEstimatesForm = connect(mapStateToProps, mapDispatchToProps)(UploadBurdenEstimatesFormComponent);