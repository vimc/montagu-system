import {Dispatch} from "redux";

import {GlobalState} from "../../shared/reducers/GlobalState";
import {BreadcrumbsActionsTypes, BreadcrumbsReceived, BreadcrumbsTypeKeys} from "../actionTypes/BreadrumbsTypes";
import {PageBreadcrumb} from "../components/PageWithHeader/PageWithHeader";
import {Breadcrumb} from "../models/Breadcrumb";
import {breadcrumbsModule} from "../../shared/modules/breadcrumbs";

export const breadcrumbsActions = {
    createBreadcrumbs(pageBreadcrumb: PageBreadcrumb) {
        return (dispatch: Dispatch<BreadcrumbsActionsTypes>) => {
            const breadcrumbs: Breadcrumb[] = breadcrumbsModule.initialize(pageBreadcrumb);
            dispatch({
                type: BreadcrumbsTypeKeys.BREADCRUMBS_RECEIVED,
                data: breadcrumbs
            } as BreadcrumbsReceived);
        }
    }
};
