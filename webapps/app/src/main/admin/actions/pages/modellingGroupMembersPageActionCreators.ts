import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";

import {modellingGroupDetailsPageActionCreators} from "./modellingGroupDetailsPageActionCreators";
import {
    GroupMembersPageComponent,
    GroupMembersPageLocationProps
} from "../../components/ModellingGroups/SingleGroup/Members/GroupMembersPage";

export const modellingGroupMembersPageActionCreators = {

    onLoad(params: GroupMembersPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState : () => AdminAppState) => {
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(GroupMembersPageComponent.breadcrumb(getState())));
        }
    },

    loadData(params: GroupMembersPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupDetailsPageActionCreators.loadData(params));
        }
    }

};
