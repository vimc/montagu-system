import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";
import {RunStatusPoll, RunStatusPollingActive} from "../../polling/RunStatusPoll";
import {RunningReportStatusValues} from "../../models/RunningReportStatus";
import {InternalLink} from "../../../shared/components/InternalLink";
import {compose} from "recompose";
import withLifecycle from "@hocs/with-lifecycle";
import {ConfirmModal} from "../../../shared/components/ConfirmModal";
import {longTimestamp} from "../../../shared/Helpers";
import {VersionIdentifier} from "../../models/VersionIdentifier";

export interface PublicProps{
    name: string;
}

export interface RunReportProps extends PublicProps {
    run: (name: string) => void;
    startPoll: (key: string) => void;
    stopPoll: () => void;
    dismissRunStatus: (name: string) => void;
    refreshVersions: (name: string) => void;
    runningKey: string;
    runningStatus: string;
    newVersionFromRun: string;
    isPollingActive: boolean;
}

interface RunReportModalState {
    showModal: boolean
}

export class RunReportComponent extends React.Component<RunReportProps, RunReportModalState> {

    constructor(props: RunReportProps) {
        super(props);
        this.state = { showModal: false };
        this.onClickRun = this.onClickRun.bind(this);
        this.onClickDismiss = this.onClickDismiss.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    showModal() {
        this.setState({ showModal: true });
    }

    hideModal = () => {
        this.setState({ showModal: false });
    };

    onClickRun() {
        this.showModal();
    }

    onConfirm() {
        this.hideModal();
        this.props.run(this.props.name);
    }

    onClickDismiss() {
        this.props.dismissRunStatus(this.props.name);
    }

    render() {
        return <div>
                <div>Run this report to create a new version.</div>
                <ConfirmModal show={this.state.showModal} title={`Confirm run report`}
                              text={`Are you sure you want to run this report?`}
                              onClose={this.hideModal}
                              onConfirm={this.onConfirm}/>
                <button className={"btn mt-2"} type={"submit"} onClick={this.onClickRun}>Run report</button>
                {this.props.runningStatus &&
                    <div>
                        <div className={"text-secondary mt-2"}>
                            {"Running status: " + this.props.runningStatus}
                            {this.props.newVersionFromRun &&
                            <div>
                                New version: <InternalLink
                                    href={`/${this.props.name}/${this.props.newVersionFromRun}/`}>
                                        {longTimestamp(new VersionIdentifier(this.props.newVersionFromRun).timestamp)}
                                        </InternalLink>
                            </div>}
                        </div>
                        <div className={"dismiss-link btn btn-link p-0"} onClick={this.onClickDismiss}>Dismiss</div>
                    </div>}
            </div>
    }
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): Partial<RunReportProps> => {

    const runningReportStatus = state.reports.runningReports.find((r) => r.name == props.name);
    return  {
        name: props.name,
        runningKey: runningReportStatus ? runningReportStatus.key : null,
        runningStatus: runningReportStatus ? runningReportStatus.status : null,
        newVersionFromRun: runningReportStatus ? runningReportStatus.version : null,
        isPollingActive: RunStatusPollingActive.isActive(state),
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<RunReportProps> => {
    return {
        run: (name: string) => dispatch(reportActionCreators.runReport(name)),
        startPoll: (runningKey: string) => dispatch(RunStatusPoll.start(dispatch, runningKey)),
        stopPoll: () => dispatch(RunStatusPoll.stop()),
        dismissRunStatus: (name: string) => dispatch(reportActionCreators.reportRunStatusRemoved(name)),
        refreshVersions: (name: string) => dispatch(reportActionCreators.getReportVersions(name))

    }
}

const updatePolling = (props: RunReportProps) => {
    //Keep this simple - if we've had any sort of update, restart polling if we need to keep polling
    if (props.isPollingActive) {
        props.stopPoll();

        //if polling was active and the run has just completed, refresh version details to put new version in drop-down
        if (runIsFinished(props)) {
            props.refreshVersions(props.name);
        }

    }
    if (props.runningKey && !runIsFinished(props)){
        props.startPoll(props.runningKey);
    }
}

const runIsFinished = (props: RunReportProps) => {
    return props.runningStatus == RunningReportStatusValues.RUNNING_REPORT_STATUS_SUCCESS ||
        props.runningStatus == RunningReportStatusValues.RUNNING_REPORT_STATUS_ERROR
}

export const RunReport = compose<RunReportProps, PublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle({
        onDidMount: (props: RunReportProps) => {
            updatePolling(props);
        },
        onDidUpdate: (prevProps: RunReportProps, props: RunReportProps) => {
            updatePolling(props);
        }
    })
)(RunReportComponent)
