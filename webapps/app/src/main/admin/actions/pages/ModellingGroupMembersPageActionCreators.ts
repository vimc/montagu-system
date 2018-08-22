import {Dispatch} from "redux";

import {AdminAppState} from "../../reducers/adminAppReducers";

import {modellingGroupDetailsPageActionCreators} from "./ModellingGroupDetailsPageActionCreators";
import {
    ModellingGroupMembersPageComponent,
    ModellingGroupMembersPageLocationProps
} from "../../components/ModellingGroups/SingleGroup/Members/ModellingGroupMembersPage";
import {AdminPageActionCreators} from "./AdminPageActionCreators";
import {
    modellingGroupsListPageActionCreators,
    ModellingGroupsListPageActionCreators
} from "./ModellingGroupsListPageActionCreators";
import {PageBreadcrumb} from "../../../shared/components/PageWithHeader/PageProperties";

export class ModellingGroupMembersPageActionCreators extends AdminPageActionCreators<ModellingGroupMembersPageLocationProps> {

    parent: ModellingGroupsListPageActionCreators = modellingGroupsListPageActionCreators;

    createBreadcrumb(state: AdminAppState): PageBreadcrumb {
        return {
            name: ModellingGroupMembersPageComponent.title,
            urlFragment: "admin/"
        }
    }

    loadData(params: ModellingGroupMembersPageLocationProps) {
        return async (dispatch: Dispatch<AdminAppState>) => {
            await dispatch(modellingGroupDetailsPageActionCreators.loadData(params));
        }
    }
}

export const modellingGroupMembersPageActionCreators = new ModellingGroupMembersPageActionCreators();
