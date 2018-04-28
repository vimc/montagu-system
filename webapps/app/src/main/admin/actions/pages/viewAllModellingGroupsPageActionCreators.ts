import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {ViewAllModellingGroupsPageComponent} from "../../components/ModellingGroups/List/ViewAllModellingGroupsPage";

export const viewAllModellingGroupsPageActionCreators = {

    onLoad() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(viewAllModellingGroupsPageActionCreators.loadData());
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ViewAllModellingGroupsPageComponent.breadcrumb()));
        }
    },

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupsActionCreators.getAllGroups());
        }
    }

};
