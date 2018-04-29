import { Dispatch } from "redux";

import {breadcrumbsActionCreators} from "../../../shared/actions/breadcrumbsActionsCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {
    ModellingGroupDetailsPageComponent,
    ModellingGroupDetailsPageLocationProps
} from "../../components/ModellingGroups/SingleGroup/Details/ModellingGroupDetailsPage";
import {modellingGroupDetailsPageActionCreators} from "./modellingGroupDetailsPageActionCreators";

export const modellingGroupMembersPageActionCreators = {

    onLoad(params: ModellingGroupDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>, getState : () => AdminAppState) => {
            await dispatch(this.loadData(params));
            dispatch(breadcrumbsActionCreators.createBreadcrumbs(ModellingGroupDetailsPageComponent.breadcrumb(getState())));
        }
    },

    loadData(params: ModellingGroupDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupDetailsPageActionCreators.loadData(params));
        }
    }

};
