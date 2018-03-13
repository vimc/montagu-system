import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { compose, branch, renderComponent } from "recompose";
import { createSelector } from "reselect";
import withLifecycle, {LifecycleMethods} from '@hocs/with-lifecycle';

import {ReportAppState} from "../../reducers/reportAppReducers";
import { reportsActions } from "../../actions/reportsActions";
import {ReportsListComponent, ReportsListComponentProps} from "./ReportsListComponent";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
import {reportsListSelectors} from "./reportsListSelectors";

const reportsDisplayListSelector = reportsListSelectors.createDisplayListSelector();

export interface ReportsListContainerProps extends ReportsListComponentProps {
    getReports: () => void;
    ready: boolean;
}

const lifecyleProps: Partial<LifecycleMethods<ReportsListContainerProps>> = {
    onDidMount(props: ReportsListContainerProps) {
        props.getReports();
    }
};

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListContainerProps> => {
    return {
        reports: reportsDisplayListSelector(state),
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
    withLifecycle(lifecyleProps),
    branch((props: ReportsListContainerProps) => !props.ready, renderComponent(LoadingElement))
);
export const ReportsList = enhance(ReportsListComponent);