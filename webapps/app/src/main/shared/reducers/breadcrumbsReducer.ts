import {BreadcrumbsTypes, BreadcrumbsAction} from "../actionTypes/BreadrumbsTypes";
import {Breadcrumb} from "../models/Breadcrumb";

export interface BreadcrumbsState {
    breadcrumbs: Breadcrumb[];
}

export const initialBreadcrumbsState: BreadcrumbsState = {
    breadcrumbs: [],
};

export const breadcrumbsReducer = (state = initialBreadcrumbsState, action: BreadcrumbsAction) => {
    switch (action.type) {
        case BreadcrumbsTypes.BREADCRUMBS_RECEIVED:
            return { ...state, breadcrumbs: action.data };
        default:
            return state;
    }
};
