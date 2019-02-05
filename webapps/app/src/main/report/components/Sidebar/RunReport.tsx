import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";
import {RunStatusPoll} from "../../polling/runStatusPoll";
import {RunningReportStatusValues} from "../../models/RunningReportStatus";

export interface PublicProps{
    name: string;
}

export interface RunReportProps extends PublicProps {
    run: (name: string) => void;
    startPoll: (key: string) => void;
    runningKey: string;
    runningStatus: string;
}

export class RunReportComponent extends React.Component<RunReportProps, undefined> {

    constructor() {
        super();
        this.onClickRun = this.onClickRun.bind(this);
    }

    componentDidUpdate() {
        //TODO:still need to stop polling - when complete or error or change reportversion!
        if (this.props.runningStatus == RunningReportStatusValues.RUNNING_REPORT_STATUS_STARTED && this.props.runningKey) {
            this.props.startPoll(this.props.runningKey);
        }
    }

    onClickRun() {
        //TODO: show modal confirm dialog
        this.props.run(this.props.name);
    }

    render() {
        return <div>
                <div>Run this report to create new version.</div>
                <button className={"btn"} type={"submit"} onClick={this.onClickRun}>Run report</button>
                {this.props.runningStatus && <div>{"Running status: " + this.props.runningStatus}</div>}
            </div>
    }
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): Partial<RunReportProps> => {

    const runningReportStatus = state.reports.runningReports.find((r) => r.name == props.name);
    return  {
        name: props.name,
        runningKey: runningReportStatus ? runningReportStatus.key : null,
        runningStatus: runningReportStatus ? runningReportStatus.status : null
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<RunReportProps> => {
    return {
        run: (name: string) => dispatch(reportActionCreators.runReport(name)),
        startPoll: (runningKey: string) => dispatch(RunStatusPoll.start(dispatch, runningKey))

    }
}

export const RunReport = connect(mapStateToProps, mapDispatchToProps)(RunReportComponent)