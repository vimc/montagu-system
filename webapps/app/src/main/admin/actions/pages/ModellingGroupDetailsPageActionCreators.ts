import { Dispatch } from "redux";

import { modellingGroupsActionCreators } from "../modellingGroupsActionCreators";
import {AdminAppState} from "../../reducers/adminAppReducers";
import {
    ModellingGroupDetailsPageLocationProps
} from "../../components/ModellingGroups/SingleGroup/Details/ModellingGroupDetailsPage";
import {usersActionCreators} from "../usersActionCreators";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {
    modellingGroupMembersPageActionCreators,
    ModellingGroupMembersPageActionCreators
} from "./ModellingGroupMembersPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";
import {modellingGroupsListPageActionCreators} from "./ModellingGroupsListPageActionCreators";


export class ModellingGroupDetailsPageActionCreators extends AdminPageActionCreators<ModellingGroupDetailsPageLocationProps>{

    parent = modellingGroupsListPageActionCreators;

    createBreadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: state.groups.currentGroup.id,
            urlFragment: `${state.groups.currentGroup.id}/`
        }
    }


    loadData(params: ModellingGroupDetailsPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            dispatch(modellingGroupsActionCreators.setCurrentGroup(params.groupId));
            await dispatch(usersActionCreators.getAllUsers());
            await dispatch(modellingGroupsActionCreators.getGroupDetails(params.groupId));
            dispatch(modellingGroupsActionCreators.setCurrentGroupMembers());
        }
    }
}

export const modellingGroupDetailsPageActionCreators = new ModellingGroupDetailsPageActionCreators()
