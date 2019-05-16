import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { compose, branch, renderComponent } from "recompose";
import { createSelector } from "reselect";
import withLifecycle, {LifecycleMethods} from '@hocs/with-lifecycle';

import {ReportAppState} from "../../reducers/reportAppReducers";
import { reportActionCreators } from "../../actionCreators/reportActionCreators";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
import {ReportsListTable, ReportsListTableProps} from "./ReportListTable";

export interface ReportsListContainerProps extends ReportsListTableProps {
    ready: boolean;
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListContainerProps> => {
    return {
        reports: state.reports.reports,
        isReviewer: state.auth.isReportReviewer,
        ready: Array.isArray(state.reports.reports)
    }
};


const enhance = compose(
    connect(mapStateToProps),
    branch((props: ReportsListContainerProps) => !props.ready, renderComponent(LoadingElement))
);
export const ReportsList = enhance(ReportsListTable);