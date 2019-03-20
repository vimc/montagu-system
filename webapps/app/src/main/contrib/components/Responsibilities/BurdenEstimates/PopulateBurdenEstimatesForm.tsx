import * as React from "react";
import {Alert} from "reactstrap";
import {checkFileExtensionIsCSV, CustomValidationResult} from "../../../../shared/validation/FileValidationHelpers";
import {ErrorInfo, Result} from "../../../../shared/models/Generated";
import {ConfigurationHash, Resumable, ResumableFile} from "./ResumableTypes";
import {settings} from "../../../../shared/Settings";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {Dispatch} from "redux";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {connect} from "react-redux";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";

const FileUploadClient = require('resumablejs');

interface UploadEstimatesState {
    file: ResumableFile,
    progress: number,
    isUploading: boolean,
    uploadErrors: ErrorInfo[],
    validationResult: CustomValidationResult
}

interface PopulateEstimatesPublicProps {
    touchstoneId: string;
    scenarioId: string;
    groupId: string;
    setId: number
}

interface PopulateEstimatesProps extends PopulateEstimatesPublicProps {
    createUploadClient: (settings: ConfigurationHash) => Resumable,
    getUploadToken: (fileName: string) => void,
    populateEstimateSet: (token: string) => void,
    hasPopulateSuccess: boolean;
    populateErrors: ErrorInfo[]
    resetPopulateState: () => void;
    url: string;
    uploadToken: string;
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

export const  initialUploadState: UploadEstimatesState = {
    progress: 0,
    file: null,
    isUploading: false,
    uploadErrors: [],
    validationResult: null
};

export class PopulateEstimatesFormComponent extends React.Component<PopulateEstimatesProps, UploadEstimatesState> {

    private uploadClient: Resumable;
    private uploaderElement: Element;

    constructor(props: PopulateEstimatesProps) {
        super(props);
        this.state = {...initialUploadState}
    }

    resetUploadState = (removeFile: Boolean) => {
        this.setState({...initialUploadState,
            file: removeFile ? null : this.state.file,
            validationResult: removeFile ? null : this.state.validationResult
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
                    uploadErrors: [{
                        code: "e",
                        message: "This file is empty."
                    }]
                })
            }
        };

        this.uploadClient = this.props.createUploadClient(settings);
        console.log(this.uploadClient);
        this.uploadClient.assignBrowse(this.uploaderElement, false);

        this.uploadClient.on('fileAdded', (file: ResumableFile) => {

            this.props.resetPopulateState();
            const validationResult = checkFileExtensionIsCSV(file.fileName);

            this.setState({
                ...initialUploadState,
                validationResult: validationResult,
                file: file
            });

            if (validationResult.isValid) {
                this.props.getUploadToken(file.fileName)
            }
        });

        this.uploadClient.on('progress', () => {

            this.setState({
                isUploading: true,
                progress: Math.round(this.uploadClient.progress() * 10) / 10 * 100
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
            } catch(e) {
                uploadErrors.push({code: "error", message: "Error contacting server"})
            }
            this.setState({
                uploadErrors: uploadErrors,
                isUploading: false,
                progress: 0
            });
        });
    };

    startUpload = () => {
        this.props.resetPopulateState();
        this.setState({
            isUploading: true
        });
        this.uploadClient.upload();
    };

    cancelUpload = () => {
        this.resetUploadState(true);
        this.uploadClient.cancel();
    };

    uploadDisabled = () => {
        return this.state.isUploading
            || this.state.file == null
            || this.props.url == null
            || (this.state.validationResult && !this.state.validationResult.isValid)
    };

    render() {

        return (
            <div>
                <div className="progress" style={{display: this.state.progress === 0 ? "none" : "block"}}>
                    <div className={`progress-bar ${this.state.uploadErrors.length > 0 ? "bg-danger" : "bg-success"}`}
                         style={{width: this.state.progress + '%'}}>&nbsp;</div>
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
                <Alert color="danger" id={"populate-errors"}  isOpen={this.props.populateErrors.length > 0}
                       toggle={this.props.resetPopulateState}>
                    {this.props.populateErrors.length > 0 && this.props.populateErrors[0].message}
                </Alert>
                <Alert color="success" isOpen={this.props.hasPopulateSuccess} toggle={this.props.resetPopulateState}>
                    Success! You have uploaded a new burden estimate set
                </Alert>
                <button disabled={this.uploadDisabled()}
                        className="submit start"
                        onClick={this.startUpload}>Upload
                </button>
                <button disabled={!this.state.isUploading} className="cancel"
                        onClick={this.cancelUpload}>Cancel
                </button>
            </div>
        );
    }
}

const SelectedFile: React.FunctionComponent<UploadEstimatesState> =
    (props: { file: ResumableFile, validationResult: CustomValidationResult }) => {

        if (props.file) {
            return <span>
                File selected: {props.file.fileName}
                <Alert color="danger" isOpen={!props.validationResult.isValid}
                       className="mt-3 pathProblems">
                    {props.validationResult.content}
                </Alert>
            </span>;
        } else {
            return null;
        }

    };

const mapStateToProps: (state: ContribAppState, props: PopulateEstimatesPublicProps) => Partial<PopulateEstimatesProps>
    = (state: ContribAppState, props: PopulateEstimatesPublicProps) => {
    return {
        ...props,
        url: state.estimates.uploadToken == null ? null :
            `${settings.apiUrl()}/modelling-groups/${props.groupId}/responsibilities/${props.touchstoneId}/${props.scenarioId}/estimate-sets/${props.setId}/actions/upload/${state.estimates.uploadToken}/`,
        uploadToken: state.estimates.uploadToken,
        populateErrors: state.estimates.populateErrors,
        hasPopulateSuccess: state.estimates.hasPopulateSuccess,
        populatingInProgress: state.estimates.populatingInProgress,
        createUploadClient: (settings: ConfigurationHash) => new FileUploadClient(settings)
    }
};

const mapDispatchToProps:
    (dispatch: Dispatch<ContribAppState>, props: Partial<PopulateEstimatesProps>) => Partial<PopulateEstimatesProps>
    = (dispatch, props) => {
    return {
        ...props,
        getUploadToken: () => dispatch(estimatesActionCreators.getUploadToken()),
        populateEstimateSet: (token) => dispatch(estimatesActionCreators.populateEstimateSet(token)),
        resetPopulateState: () => dispatch(estimatesActionCreators.resetPopulateState())
    }
};

export const PopulateEstimatesForm =
    compose<PopulateEstimatesProps, PopulateEstimatesPublicProps>(
        connect(mapStateToProps, mapDispatchToProps),
        branch((props: PopulateEstimatesProps) => props.populatingInProgress, renderComponent(LoadingElement))
    )(PopulateEstimatesFormComponent);
