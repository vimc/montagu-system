import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";

import {modellingGroupDetailsPageActionCreators} from "./modellingGroupDetailsPageActionCreators";
import {
    ModellingGroupMembersPageComponent,
    ModellingGroupMembersPageLocationProps
} from "../../components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersPage";

export const modellingGroupMembersPageActionCreators = {

    onLoad(params: ModellingGroupMembersPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState : () => AdminAppState) => {
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ModellingGroupMembersPageComponent.breadcrumb(getState())));
        }
    },

    loadData(params: ModellingGroupMembersPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupDetailsPageActionCreators.loadData(params));
        }
    }

};
