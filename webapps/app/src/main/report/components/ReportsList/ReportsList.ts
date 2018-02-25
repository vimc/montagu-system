import { connect } from 'react-redux';
import { Dispatch } from "redux";
import { compose, lifecycle, branch, renderComponent } from "recompose";
import { clone } from "lodash";

import {ReportAppState} from "../../reducers/reportAppReducers";
import { reportsActions } from "../../actions/reportsActions";
import {ReportsListComponent, ReportsListComponentProps} from "./ReportsListComponent";
import {Report} from "../../../shared/models/Generated";
import {
    ReportsFilterFields, ReportsFilterPublishTypes,
    ReportsSortingFields
} from "../../actionTypes/ReportsActionsTypes";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";

export interface ReportsListContainerProps extends ReportsListComponentProps {
    getReports: () => void;
    ready: boolean;
}

export const getDisplayedReportsList = (items: Report[], sortBy: ReportsSortingFields, filter: ReportsFilterFields) => {
    if (!items || !items.length) return [];
    let displayItems = clone(items);
    if (filter.published !== ReportsFilterPublishTypes.all) {
        displayItems = displayItems.filter((item: any) => filter.published === ReportsFilterPublishTypes.published
            ? item.published
            : !item.published
        );
    }
    displayItems = displayItems.sort(sortReports(sortBy));
    return displayItems;
}

export const sortReports = (sortBy: ReportsSortingFields) => (a: Report, b: Report)=> (a[sortBy] < b[sortBy] ? -1 : 1);

const lifecyleProps = {
    componentDidMount() {
        this.props.getReports();
    }
}

export const mapStateToProps = (state: ReportAppState): Partial<ReportsListContainerProps> => {
    return {
        reports: getDisplayedReportsList(state.reports.reports, state.reports.reportsSortBy, state.reports.reportsFilter),
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