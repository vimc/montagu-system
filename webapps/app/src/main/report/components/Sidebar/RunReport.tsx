import * as React from "react";
import {connect, Dispatch} from "react-redux";
import {ReportAppState} from "../../reducers/reportAppReducers";
import {reportActionCreators} from "../../actionCreators/reportActionCreators";

export interface PublicProps{
    name: string;
}

export interface RunReportProps extends PublicProps {
    run: (name: string) => void;
}

export class RunReportComponent extends React.Component<RunReportProps, undefined> {

    constructor() {
        super();
        this.onClickRun = this.onClickRun.bind(this);
    }

    onClickRun() {
        //TODO: show modal confirm dialog
        this.props.run(this.props.name);
    }

    render() {
        return <div>
                <div>Run this report to create new version.</div>
                <button className={"btn"} type={"submit"} onClick={this.onClickRun}>Run report</button>
            </div>
    }
}

const mapStateToProps = (state: ReportAppState, props: PublicProps): Partial<RunReportProps> => {
    return {
        name: props.name
    }
}

export const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<RunReportProps> => {
    return {
        run: (name: string) => dispatch(reportActionCreators.runReport(name)),
    }
}

export const RunReport = connect(mapStateToProps, mapDispatchToProps)(RunReportComponent)