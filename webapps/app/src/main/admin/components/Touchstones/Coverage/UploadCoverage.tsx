import * as React from "react";
import {CustomFileInput} from "../../../../shared/components/CustomFileInput";
import {UncontrolledAlert} from "reactstrap";
import {Dispatch} from "redux";
import {compose} from "recompose";
import {connect} from "react-redux";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {CoverageUploadStatus} from "../../../actionTypes/CoverageTypes";
import {coverageActionCreators} from "../../../actions/coverageActionCreators";
import FormData = require("form-data");

export interface UploadCoverageProps {
    errors: Error[];
    status: CoverageUploadStatus;
    uploadCoverage: (data: FormData) => void;
}

export interface UploadCoverageState {
    fileInputKey: Date;
    success: boolean;
    fileSelected: boolean;
}

class UploadCoverageComponent extends React.Component<UploadCoverageProps, UploadCoverageState> {
    render(): JSX.Element {
        return <form encType="multipart/form-data"
                     onSubmit={this.onSubmit}
                     onChange={this.onChange}
                     noValidate>
            <CustomFileInput required={true} accept=".csv" key={this.state.fileInputKey.toISOString()}>
                Choose file
            </CustomFileInput>
            { this.props.errors.length > 0 &&
                <UncontrolledAlert id="error-alert" color="danger">
                    {this.props.errors[0] && this.props.errors[0].message }
                </UncontrolledAlert>}
            { this.state.success &&
                <UncontrolledAlert id="success-alert" color="success" toggle={this.onChange}>
                    Success! You have uploaded a new coverage set
                </UncontrolledAlert> }
            <button type="submit" className="mt-2" disabled={(this.props.status == CoverageUploadStatus.in_progress) || !this.state.fileSelected}>
                Upload
            </button>
        </form>
    }

    constructor(props: UploadCoverageProps) {
        super(props);
        this.state = {
            fileInputKey: new Date(),
            success: false,
            fileSelected: false
        };
        this.resetForm = this.resetForm.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps: UploadCoverageProps) {
        if (this.props.status !== nextProps.status && nextProps.status === CoverageUploadStatus.completed) {
            if (nextProps.errors.length) {
                this.setState({
                    success: false
                });
            } else {
                this.setState({
                    success: true
                });
            }
            this.resetForm();
        }
    }

    onChange() {
        this.setState({
            success: false,
            fileSelected: true
        });
    }

    resetForm() {
        this.setState({
            // this is to trick React into re-rendering the file input when the form has been successfully submitted
            // see https://github.com/erikras/redux-form/issues/769
            fileInputKey: new Date(),
            fileSelected: false
        });
    }

    onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);
        this.setState({
            success: false
        });
        this.props.uploadCoverage(data);
    }
}

export const mapStateToProps = (state: AdminAppState, props: Partial<UploadCoverageProps>): Partial<UploadCoverageProps> => {
    return {
        errors: state.coverage.uploadState.errors,
        status: state.coverage.uploadState.status
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<UploadCoverageProps> => {
    return {
        uploadCoverage: (data: FormData) => dispatch(coverageActionCreators.uploadCoverage(data))
    }
};

export const UploadCoverage = compose(
    connect(mapStateToProps, mapDispatchToProps)
)(UploadCoverageComponent) as React.ComponentClass<Partial<UploadCoverageProps>>;
