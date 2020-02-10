import * as React from "react";
import {FormEvent} from "react";
import {Alert} from "reactstrap";
import {checkFileExtensionIsCSV, CustomValidationResult} from "../../../../shared/validation/FileValidationHelpers";
import {BurdenEstimateSetType, BurdenEstimateSetTypeCode, ErrorInfo, Result} from "../../../../shared/models/Generated";
import {ConfigurationHash, Resumable, ResumableFile} from "./ResumableTypes";
import {settings} from "../../../../shared/Settings";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {Dispatch} from "redux";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {connect} from "react-redux";
import {compose} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {roundToOneDecimalPlace} from "../../../../shared/Helpers";
import {OptionSelector} from "../../OptionSelector/OptionSelector";

const FileUploadClient = require('resumablejs');

export interface UploadEstimatesState {
    file: ResumableFile,
    progress: number,
    isUploading: boolean,
    uploadErrors: ErrorInfo[],
    fileValidationResult: CustomValidationResult,
    metadata: BurdenEstimateSetType
}

export interface UploadEstimatesPublicProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
}

export interface UploadEstimatesProps extends UploadEstimatesPublicProps {
    createUploadClient: (settings: ConfigurationHash) => Resumable,
    populateEstimateSet: (token: string) => void,
    resetPopulateState: () => void;
    url: string;
    uploadToken: string;
    createBurdenEstimateSet: (data: BurdenEstimateSetType) => void;
    hasPopulateSuccess: boolean;
    populateErrors: ErrorInfo[];
    populatingInProgress: boolean;
}

const baseSettings: ConfigurationHash = {
    testChunks: false,
    maxFiles: 1,
    withCredentials: true,
    setChunkTypeFromFile: true,
    totalSizeParameterName: "totalSize",
    fileNameParameterName: "fileName",
    totalChunksParameterName: "totalChunks",
    chunkNumberParameterName: "chunkNumber",
    chunkSizeParameterName: "chunkSize"
};

export const initialUploadState: UploadEstimatesState = {
    progress: 0,
    file: null,
    isUploading: false,
    uploadErrors: [],
    fileValidationResult: null,
    metadata: {
        type: null,
        details: null
    }
};

export class UploadEstimatesFormComponent extends React.Component<UploadEstimatesProps, UploadEstimatesState> {

    private uploadClient: Resumable;
    private uploaderElement: Element;
    private options = [
        {
            value: "central-single-run",
            text: "Single model run"
        }, {
            value: "central-averaged",
            text: "Averaged across model runs"
        }];

    constructor(props: UploadEstimatesProps) {
        super(props);
        this.state = {...initialUploadState};
    }

    resetUploadState = (removeFile: Boolean) => {
        this.setState({
            ...initialUploadState,
            metadata: {...this.state.metadata},
            file: removeFile ? null : this.state.file,
            fileValidationResult: removeFile ? null : this.state.fileValidationResult
        })
    };

    componentDidMount = () => {
        const settings: ConfigurationHash = {
            ...baseSettings,
            target: (params) => `${this.props.url}?${params.join("&")}`,
            minFileSizeErrorCallback: () => {
                this.props.resetPopulateState();
                this.setState({
                    ...initialUploadState,
                    metadata: {...this.state.metadata},
                    uploadErrors: [{
                        code: "e",
                        message: "This file is empty."
                    }]
                })
            }
        };

        this.uploadClient = this.props.createUploadClient(settings);
        this.uploadClient.assignBrowse(this.uploaderElement, false);

        this.uploadClient.on('fileAdded', (file: ResumableFile) => {

            this.props.resetPopulateState();
            const validationResult = checkFileExtensionIsCSV(file.fileName);

            this.setState({
                ...initialUploadState,
                metadata: {...this.state.metadata},
                fileValidationResult: validationResult,
                file: file
            });
        });

        this.uploadClient.on('progress', () => {
            this.setState({
                isUploading: true,
                progress: roundToOneDecimalPlace(this.uploadClient.progress() * 100)
            });
        });

        this.uploadClient.on('fileSuccess', () => {
            this.resetUploadState(false);
            this.props.populateEstimateSet(this.props.uploadToken);
        });

        this.uploadClient.on('fileError', (file: ResumableFile, error: string) => {

            let uploadErrors: ErrorInfo[] = [];
            try {
                const result = JSON.parse(error) as Result;
                uploadErrors = result.errors
            } catch (e) {
                uploadErrors.push({code: "error", message: "Error contacting server"})
            }
            this.setState({
                uploadErrors: uploadErrors,
                isUploading: false,
                progress: 0,
                file: null
            });
        });
    };

    componentDidUpdate(prevProps: Readonly<UploadEstimatesProps>) {
        if (prevProps.url != this.props.url && this.props.url != null) {
            if (this.uploadClient.files[0].progress(false) == 1) {
                this.uploadClient.files[0].retry();
            } else {
                this.uploadClient.upload();
            }
        }
    }

    startUpload = () => {
        this.setState({
            isUploading: true
        });
        this.props.resetPopulateState();
        this.props.createBurdenEstimateSet(this.state.metadata);
    };

    cancelUpload = () => {
        this.resetUploadState(true);
        this.uploadClient.cancel();
    };

    submitDisabled = () => {
        return this.state.isUploading
            || this.state.file == null
            || (this.state.fileValidationResult && !this.state.fileValidationResult.isValid)
            || !this.state.metadata.details
            || !this.state.metadata.type
    };

    onDetailsChange = (e: FormEvent<HTMLInputElement>) => {

        const details = (e.target as HTMLInputElement).value;
        this.setState({
            metadata: {
                details: details,
                type: this.state.metadata.type
            }
        })
    };

    onTypeChange = (value: BurdenEstimateSetTypeCode) => {
        this.setState({
            metadata: {
                type: value,
                details: this.state.metadata.details
            }
        });
    };

    render() {

        return (
            <div>
                <div className="progress" style={{display: this.state.progress === 0 ? "none" : "block"}}>
                    <div className={`progress-bar ${this.state.uploadErrors.length > 0 ? "bg-danger" : "bg-success"}`}
                         style={{width: this.state.progress + '%'}}>&nbsp;</div>
                </div>
                <div className="row">
                    <div className="col">
                        <label>How were these estimates calculated? *</label>
                        <OptionSelector
                            name={"typeCode"}
                            defaultOption={"-- Please select one --"}
                            options={this.options} onChange={this.onTypeChange}
                            className="form-control" required={true}
                        />
                    </div>
                    <div className="col">
                        <label>Details of how these estimates were calculated *</label>
                        <input
                            type="text"
                            className={"form-control"}
                            name="details"
                            required={true}
                            onChange={this.onDetailsChange}
                        />
                        <small className="form-text text-muted">
                            For example, if averaged, what kind of averaging function was used.
                        </small>
                    </div>
                </div>
                <div className="form-group">
                    <label className="customFileUpload">
                        <input ref={node => this.uploaderElement = node} accept="csv" type="file" name={'file-upload'}/>
                        <div className="button mt-2 mb-2">
                            Choose file
                        </div>
                    </label>

                    <div className="mr-5">
                        <SelectedFile {...this.state} />
                    </div>
                </div>
                <Alert color="danger" id={"upload-errors"} isOpen={this.state.uploadErrors.length > 0}
                       toggle={() => this.resetUploadState(false)}>
                    {this.state.uploadErrors.length > 0 && this.state.uploadErrors[0].message}
                </Alert>
                <Alert color="danger" isOpen={this.props.populateErrors.length > 0}
                       toggle={this.props.resetPopulateState}>
                    <p className="render-whitespace">
                        {this.props.populateErrors.length > 0 && this.props.populateErrors[0].message}
                    </p>
                    {this.props.populateErrors.length > 0 && this.props.populateErrors[0].code == "invalid-operation" &&
                    <p>This may be a network error, please try again and if the problem persists
                        contact us at: ${settings.supportContact}
                    </p>}
                </Alert>
                <Alert color="success" isOpen={this.props.hasPopulateSuccess} toggle={this.props.resetPopulateState}>
                    Success! You have uploaded a new set of burden estimates
                </Alert>
                {!this.props.populatingInProgress &&
                <div>
                    <button disabled={this.submitDisabled()}
                            id="submit-form"
                            className="submit start"
                            onClick={this.startUpload}>Upload
                    </button>
                    <button disabled={!this.state.isUploading} className="cancel"
                            onClick={this.cancelUpload}>Cancel
                    </button>
                </div>
                }
                {this.props.populatingInProgress && <LoadingElement/>}
                <small className="form-text text-muted">
                    * All fields are required
                </small>
            </div>
        );
    }
}

export const SelectedFile: React.FunctionComponent<UploadEstimatesState> =
    (props: { file: ResumableFile, fileValidationResult: CustomValidationResult }) => {

        if (props.file) {
            return <span>
                <span>File selected: {props.file.fileName}</span>
                <Alert color="danger" isOpen={!props.fileValidationResult.isValid}
                       className="mt-3 pathProblems">
                    {props.fileValidationResult.content}
                </Alert>
            </span>;
        } else {
            return null;
        }

    };

export const mapStateToProps: (state: ContribAppState, props: UploadEstimatesPublicProps) => Partial<UploadEstimatesProps>
    = (state: ContribAppState, props: UploadEstimatesPublicProps) => {
    return {
        ...props,
        url: state.estimates.uploadToken == null || state.estimates.populatingSetId == null ? null :
            `${settings.apiUrl()}/modelling-groups/${props.groupId}/responsibilities/${props.touchstoneId}/${props.scenarioId}/estimate-sets/${state.estimates.populatingSetId}/actions/upload/${state.estimates.uploadToken}/`,
        uploadToken: state.estimates.uploadToken,
        populateErrors: state.estimates.populateErrors,
        hasPopulateSuccess: state.estimates.hasPopulateSuccess,
        populatingInProgress: state.estimates.populatingInProgress,
        createUploadClient: (settings: ConfigurationHash) => new FileUploadClient(settings)
    }
};

export const mapDispatchToProps:
    (dispatch: Dispatch<ContribAppState>, props: Partial<UploadEstimatesProps>) => Partial<UploadEstimatesProps>
    = (dispatch, props) => {
    return {
        ...props,
        populateEstimateSet: (token) => dispatch(estimatesActionCreators.populateEstimateSet(token)),
        resetPopulateState: () => dispatch(estimatesActionCreators.resetPopulateState()),
        createBurdenEstimateSet: (setType: BurdenEstimateSetType) => dispatch(estimatesActionCreators.createBurden(setType))
    }
};

export const UploadEstimatesForm =
    compose<UploadEstimatesProps, UploadEstimatesPublicProps>(
        connect(mapStateToProps, mapDispatchToProps)
    )(UploadEstimatesFormComponent);
