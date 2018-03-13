import {Dispatch} from "redux";

import {GlobalState} from "../../shared/reducers/GlobalState";
import {BreadcrumbsActionsTypes, BreadcrumbsReceived, BreadcrumbsTypeKeys} from "../actionTypes/BreadrumbsTypes";
import {PageInterface} from "../components/PageWithHeader/PageWithHeader";
import {Breadcrumb} from "../models/Breadcrumb";
import {breadcrumbsModule} from "../../shared/modules/breadcrumbs";

export const breadcrumbsActions = {
    createBreadcrumbs(page: PageInterface) {
        return (dispatch: Dispatch<BreadcrumbsActionsTypes>) => {
            const breadcrumbs: Breadcrumb[] = breadcrumbsModule.initialize(page);
            dispatch({
                type: BreadcrumbsTypeKeys.BREADCRUMBS_RECEIVED,
                data: breadcrumbs
            } as BreadcrumbsReceived);
        }
    }
};
