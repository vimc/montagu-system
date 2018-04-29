import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {ModellingGroupsListPageComponent} from "../../components/ModellingGroups/List/ModellingGroupsListPage";

export const modellingGroupsListPageActionCreators = {

    onLoad() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupsListPageActionCreators.loadData());
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ModellingGroupsListPageComponent.breadcrumb()));
        }
    },

    loadData() {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupsActionCreators.getAllGroups());
        }
    }

};
