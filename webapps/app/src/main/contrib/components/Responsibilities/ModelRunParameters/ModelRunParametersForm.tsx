import * as React from "react";
import { compose, branch, renderComponent} from "recompose";
import { connect } from 'react-redux';
import { Action, Dispatch } from "redux";
import {Alert} from "reactstrap";

import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {runParametersActionCreators} from "../../../actions/runParametersActionCreators";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {RunParametersUploadStatus} from "../../../actionTypes/RunParametersTypes";

export interface ModelRunParametersFormProps {
    disease: string;
    errors: Error[];
    status: RunParametersUploadStatus;
    uploadSet: (data: FormData) => void;
    resetUploadStatus: () => void;
}

export interface ModelRunParametersFormState {
    fileInputKey: Date;
    errors: Error[];
    success: boolean;
    disabled: boolean;
}

export class ModelRunParametersFormComponent extends React.Component<ModelRunParametersFormProps, ModelRunParametersFormState> {

    constructor() {
        super();
        this.state = {
            fileInputKey: new Date(),
            errors: [],
            success: false,
            disabled: false,
        }
        this.resetForm = this.resetForm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps: ModelRunParametersFormProps) {
        if (this.props.status !== nextProps.status && nextProps.status === RunParametersUploadStatus.completed) {
            this.setState({disabled: false});
            if (nextProps.errors) {
                this.setState({
                    success: false,
                    errors: nextProps.errors
                });
            } else {
                this.setState({
                    success: true,
                    errors: []
                });
            }
            this.props.resetUploadStatus();
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
        this.props.uploadSet(data);
    }

    render(): JSX.Element {
        return <div>
            <h4>Upload a new set of parameters:</h4>
            <form encType="multipart/form-data"
                  onSubmit={this.onSubmit}
                  onChange={this.onChange}
                  noValidate
            >
                <input type={"hidden"} name={"disease"} value={this.props.disease}/>
                <CustomFileInput required={true} key={this.state.fileInputKey.toISOString()}>
                    Choose file
                </CustomFileInput>
                <Alert color="danger" isOpen={this.state.errors.length > 0}>
                    {this.state.errors[0] && this.state.errors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.state.success}
                       toggle={this.onChange}
                >
                    Success! You have uploaded a new parameter set
                </Alert>
                <button type="submit" className="mt-2" disabled={this.state.disabled}>
                    Upload
                </button>
            </form>
        </div>
    }
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ModelRunParametersFormProps>): Partial<ModelRunParametersFormProps> => {
    return {
        disease: props.disease,
        errors: state.runParameters.uploadStatus.errors,
        status: state.runParameters.uploadStatus.status
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ModelRunParametersFormProps> => {
    return {
        uploadSet: (data: FormData) => dispatch(runParametersActionCreators.uploadSet(data)),
        resetUploadStatus: () => dispatch(runParametersActionCreators.resetUploadStatus())
    }
};

export const ModelRunParametersForm = compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModelRunParametersFormComponent) as React.ComponentClass<Partial<ModelRunParametersFormProps>>;
