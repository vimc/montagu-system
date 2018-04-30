import {Dispatch} from "redux";

import {BreadcrumbsReceived, BreadcrumbsTypes} from "../actionTypes/BreadrumbsTypes";
import {PageBreadcrumb} from "../components/PageWithHeader/PageWithHeader";
import {Breadcrumb} from "../models/Breadcrumb";
import {breadcrumbsModule} from "../../shared/modules/breadcrumbs";
import {GlobalState} from "../reducers/GlobalState";

export const breadcrumbsActionCreators = {
    createBreadcrumbs(pageBreadcrumb: PageBreadcrumb) {
        return (dispatch: Dispatch<GlobalState>) => {
            const breadcrumbs: Breadcrumb[] = breadcrumbsModule.initialize(pageBreadcrumb);
            dispatch({
                type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED,
                data: breadcrumbs
            } as BreadcrumbsReceived);
        }
    }
};
