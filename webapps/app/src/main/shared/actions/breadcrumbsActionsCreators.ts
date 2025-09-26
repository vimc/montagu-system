import {BreadcrumbsReceived, BreadcrumbsTypes} from "../actionTypes/BreadrumbsTypes";
import {PageBreadcrumb} from "../components/PageWithHeader/PageProperties";
import {Breadcrumb} from "../models/Breadcrumb";
import {breadcrumbsModule} from "../modules/breadcrumbs";

export const breadcrumbsActionCreators = {
    createBreadcrumbs(pageBreadcrumb: PageBreadcrumb) {
        const breadcrumbs: Breadcrumb[] = breadcrumbsModule.initialize(pageBreadcrumb);
        return {
            type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED,
            data: breadcrumbs
        } as BreadcrumbsReceived
    }
};
