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
import {InternalLink} from "../../../../shared/components/InternalLink";

export interface UploadCoverageProps {
    errors: Error[];
    status: CoverageUploadStatus;
    uploadCoverage: (data: FormData) => void;
    currentTouchstone: string;
    currentTouchstoneVersion: string;
}

export interface UploadCoverageState {
    fileInputKey: Date;
    success: boolean;
    fileSelected: boolean;
}

class UploadCoverageComponent extends React.Component<UploadCoverageProps, UploadCoverageState> {
    render(): JSX.Element {
        const variablesDictUrl = `/touchstones/${this.props.currentTouchstone}/${this.props.currentTouchstoneVersion}/coverage/coverage-variables`;
        return <form encType="multipart/form-data"
                     onSubmit={this.onSubmit}
                     noValidate>
            <div className="form-group">
                <label>Please provide any additional details on this coverage data such as:
                    <ul>
                        <li>
                            caveats
                        </li>
                        <li>
                            variable interpretations
                        </li>
                        <li>
                            data sources
                        </li>
                        <li>
                            things to note
                        </li>
                        <li>
                            anything that could affect usage
                        </li>
                    </ul>
                    Please see <InternalLink href={variablesDictUrl}>here</InternalLink> for information about how
                    this coverage will be interpreted.</label>
                <textarea className={"form-control"}
                          placeholder={"additional details..."}
                          name="description"
                          required={true}/>
            </div>
            <CustomFileInput required={true}
                             accept=".csv"
                             key={this.state.fileInputKey.toISOString()}
                             onChange={this.onFileChange}>
                Choose file
            </CustomFileInput>
            {this.props.errors.length > 0 &&
            <UncontrolledAlert id="error-alert" color="danger">
                {this.props.errors[0] && this.props.errors[0].message}
            </UncontrolledAlert>}
            {this.state.success &&
            <UncontrolledAlert id="success-alert" color="success" toggle={this.onFileChange}>
                Success! You have uploaded a new coverage set
            </UncontrolledAlert>}
            <button type="submit" className="mt-2"
                    disabled={(this.props.status == CoverageUploadStatus.in_progress) || !this.state.fileSelected}>
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
        this.onFileChange = this.onFileChange.bind(this);
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

    onFileChange(target: HTMLInputElement) {
        this.setState({
            success: false,
            fileSelected: typeof target.value != "undefined"
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

export const mapStateToProps = (state: AdminAppState): Partial<UploadCoverageProps> => {
    return {
        errors: state.coverage.uploadState.errors,
        status: state.coverage.uploadState.status,
        currentTouchstone: state.touchstones.currentTouchstone && state.touchstones.currentTouchstone.id,
        currentTouchstoneVersion: state.touchstones.currentTouchstoneVersion && state.touchstones.currentTouchstoneVersion.id
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
