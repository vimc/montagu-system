import * as React from "react";
import {PageProperties} from "../../../../shared/components/PageWithHeader/PageProperties";
import {TouchstoneVersionPageLocationProps} from "../SingleTouchstoneVersion/TouchstoneVersionPage";
import {
    ModelRunParametersFormComponent,
    ModelRunParametersFormProps
} from "../../../../contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersForm";
import {PageArticle} from "../../../../shared/components/PageWithHeader/PageArticle";
import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {Alert} from "reactstrap";
import {RunParametersUploadStatus} from "../../../../contrib/actionTypes/RunParametersTypes";
import {ContribAppState} from "../../../../contrib/reducers/contribAppReducers";
import {Dispatch} from "redux";
import {runParametersActionCreators} from "../../../../contrib/actions/runParametersActionCreators";
import {compose} from "recompose";
import {connect} from "react-redux";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {CoverageUploadStatus} from "../../../actionTypes/CoverageTypes";

export interface UploadCoverageProps {
    errors: Error[];
    status: CoverageUploadStatus;
}

export interface UploadCoverageState {
    fileInputKey: Date;
    errors: Error[];
    success: boolean;
    disabled: boolean;
}

class UploadCoverageComponent extends React.Component<UploadCoverageProps, UploadCoverageState> {
    render(): JSX.Element {
        return <form encType="multipart/form-data"
                     onSubmit={this.onSubmit}
                     onChange={this.onChange}
                     noValidate>
            <CustomFileInput required={true} key={this.state.fileInputKey.toISOString()}>
                Choose file
            </CustomFileInput>
            <Alert color="danger" isOpen={this.state.errors.length > 0}>
                {this.state.errors[0] && this.state.errors[0].message}
            </Alert>
            <Alert color="success" isOpen={this.state.success}
                   toggle={this.onChange}>
                Success! You have uploaded a new parameter set
            </Alert>
            <button type="submit" className="mt-2" disabled={this.state.disabled}>
                Upload
            </button>
        </form>
    }

    constructor(props: UploadCoverageProps) {
        super(props);
        this.state = {
            fileInputKey: new Date(),
            errors: [],
            success: false,
            disabled: false,
        };
        this.resetForm = this.resetForm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps: UploadCoverageProps) {
        if (this.props.status !== nextProps.status && nextProps.status === CoverageUploadStatus.completed) {
            this.setState({disabled: false});
            if (nextProps.errors) {
                this.setState({
                    success: false,
                    errors: nextProps.errors,
                    disabled: false
                });
            } else {
                this.setState({
                    success: true,
                    errors: [],
                    disabled: false
                });
            }
            //TODO:!!
            //this.props.resetUploadStatus();
            this.resetForm();
        }
    }

    onChange() {
        this.setState({
            success: false,
            errors: []
        });
    }

    resetForm() {
        this.setState({
            // this is to trick React into re-rendering the file input when the form has been successfully submitted
            // see https://github.com/erikras/redux-form/issues/769
            fileInputKey: new Date()
        });
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        this.setState({
            disabled: true,
            success: false,
            errors: []
        });
        //TODO:
        //this.props.uploadSet(data);
    }
}

export const mapStateToProps = (state: AdminAppState, props: Partial<UploadCoverageProps>): Partial<UploadCoverageProps> => {
    return {
        errors: [],
        status: CoverageUploadStatus.off
        //errors: state.runParameters.uploadStatus.errors,
        //status: state.runParameters.uploadStatus.status
    }
};

//TODO: Dispatch!
/*export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ModelRunParametersFormProps> => {
    return {
        uploadSet: (data: FormData) => dispatch(runParametersActionCreators.uploadSet(data)),
        resetUploadStatus: () => dispatch(runParametersActionCreators.resetUploadStatus())
    }
};*/

export const UploadCoverage = compose(
    //connect(mapStateToProps, mapDispatchToProps),
    connect(mapStateToProps),
)(UploadCoverageComponent) as React.ComponentClass<Partial<UploadCoverageProps>>;
