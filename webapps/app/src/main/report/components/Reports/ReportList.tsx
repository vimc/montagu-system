import * as React from "react";
import { connect } from 'react-redux';
import { Dispatch } from "redux";

import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportListItem} from "./ReportListItem";
import { Report } from "../../../shared/models/Generated";
import {ReportAppState} from "../../reducers/reportAppReducers";
import { reportsActions } from "../../actions/reportsActions";

interface ReportProps {
    reports: Report[],
    getReports: () => void;
    ready: boolean;
}

export class ReportListComponent extends React.Component<ReportProps, undefined> {

    componentDidMount() {
        this.props.getReports();
    }

    render() {
        if (this.props.ready) {
            const items = this.props.reports
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((report) => <ReportListItem key={ report.name } {...report} />);

            return <ul className="list-unstyled">
                {items}
            </ul>;
        } else {
            return <LoadingElement />;
        }
    }
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportProps> => {
    return {
        reports: state.reports.reports,
        ready: state.reports.reports && state.reports.reports.length > 0
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<ReportProps> => {
    return {
        getReports: () => dispatch(reportsActions.getReports())
    }
};

export const ReportList = connect(mapStateToProps, mapDispatchToProps)(ReportListComponent);