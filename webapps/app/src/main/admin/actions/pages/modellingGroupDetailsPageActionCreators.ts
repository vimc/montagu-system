import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {
    ModellingGroupDetailsPageComponent,
    ModellingGroupDetailsPageLocationProps
} from "../../components/ModellingGroups/SingleGroup/Details/ModellingGroupDetailsPage";
import {modellingGroupsListPageActionCreators} from "./modellingGroupsListPageActionCreators";

export const modellingGroupDetailsPageActionCreators = {

    onLoad(params: ModellingGroupDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState : () => AdminAppState) => {
            await dispatch(modellingGroupDetailsPageActionCreators.loadData(params));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ModellingGroupDetailsPageComponent.breadcrumb(getState())));
        }
    },

    loadData(params: ModellingGroupDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupsListPageActionCreators.loadData());
            dispatch(modellingGroupsActionCreators.setCurrentGroup(params.groupId));
            await dispatch(modellingGroupsActionCreators.getGroupDetails(params.groupId));
        }
    }

};
