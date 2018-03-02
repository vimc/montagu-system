import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { compose, lifecycle, branch, renderComponent } from "recompose";
import { createSelector } from "reselect";

import {ReportAppState} from "../../reducers/reportAppReducers";
import { reportsActions } from "../../actions/reportsActions";
import {ReportsListComponent, ReportsListComponentProps} from "./ReportsListComponent";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
import {getDisplayedReportsListSelector} from "./reportsListSelectors";

export interface ReportsListContainerProps extends ReportsListComponentProps {
    getReports: () => void;
    ready: boolean;
}

const lifecyleProps = {
    componentDidMount() {
        console.log('pl', this.props)
        this.props.getReports();
    }
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListContainerProps> => {
    console.log(state)
    return {
        reports: getDisplayedReportsListSelector(state),
        ready: Array.isArray(state.reports.reports)
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ReportAppState>): Partial<ReportsListContainerProps> => {
    return {
        getReports: () => dispatch(reportsActions.getReports())
    }
};

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    lifecycle(lifecyleProps),
    branch((props: ReportsListContainerProps) => !props.ready, renderComponent(LoadingElement))
);
export const ReportsList = enhance(ReportsListComponent);