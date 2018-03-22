import {BreadcrumbsTypeKeys, BreadcrumbsActionsTypes} from "../actionTypes/BreadrumbsTypes";
import {Breadcrumb} from "../models/Breadcrumb";

export interface BreadcrumbsState {
    breadcrumbs: Breadcrumb[];
}

export const initialBreadcrumbsState: BreadcrumbsState = {
    breadcrumbs: [],
};

export const breadcrumbsReducer = (state = initialBreadcrumbsState, action: BreadcrumbsActionsTypes) => {
    switch (action.type) {
        case BreadcrumbsTypeKeys.BREADCRUMBS_RECEIVED:
            return { ...state, breadcrumbs: action.data };
        default:
            return state;
    }
};
