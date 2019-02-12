import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";
import {RunStatusPoll, isRunStatusPollingActive} from "../../polling/RunStatusPoll";
import {RunningReportStatusValues} from "../../models/RunningReportStatus";
import {InternalLink} from "../../../shared/components/InternalLink";

export interface PublicProps{
    name: string;
    version: string;
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

export class RunReportComponent extends React.Component<RunReportProps, undefined> {

    constructor() {
        super();
        this.onClickRun = this.onClickRun.bind(this);
        this.onClickDismiss = this.onClickDismiss.bind(this);
    }

    componentDidMount() {
        this.updatePolling();
    }

    componentDidUpdate() {
        this.updatePolling();
    }

    runIsFinished(){
        return this.props.runningStatus == RunningReportStatusValues.RUNNING_REPORT_STATUS_SUCCESS ||
            this.props.runningStatus == RunningReportStatusValues.RUNNING_REPORT_STATUS_ERROR
    }

    updatePolling(){
        //Keep this simple - if we've had any sort of update, restart polling if we need to keep polling
        if (this.props.isPollingActive) {
            this.props.stopPoll();

            //if polling was active and the run has just completed, refresh version details to put new version in drop-down
            if (this.runIsFinished()) {
                this.props.refreshVersions(this.props.name);
            }

        }
        if (this.props.runningKey && !this.runIsFinished()){
            this.props.startPoll(this.props.runningKey);
        }
    }

    onClickRun() {
        //TODO: show modal confirm dialog
        this.props.run(this.props.name);
    }

    onClickDismiss() {
        this.props.dismissRunStatus(this.props.name);
    }

    render() {
        return <div>
                <div>Run this report to create a new version.</div>
                <button className={"btn mt-2"} type={"submit"} onClick={this.onClickRun}>Run report</button>
                {this.props.runningStatus &&
                    <div className={"text-secondary"}>
                        {"Running status: " + this.props.runningStatus}
                        {this.props.newVersionFromRun &&
                        <div >New version:
                            <InternalLink href={`/${this.props.name}/${this.props.newVersionFromRun}/`}>{this.props.newVersionFromRun}</InternalLink>
                        </div>}
                        <div className={"btn btn-link"} onClick={this.onClickDismiss}>Dismiss</div>
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
        isPollingActive: isRunStatusPollingActive(state)
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

export const RunReport = connect(mapStateToProps, mapDispatchToProps)(RunReportComponent)