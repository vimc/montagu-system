import { Dispatch } from "redux";
import {compact} from "lodash";

import { ModellingGroupsService } from "../../shared/services/ModellingGroupsService";
import {AdminAppState} from "../reducers/adminAppReducers";
import {ModellingGroup, ModellingGroupCreation, ModellingGroupDetails, User} from "../../shared/models/Generated";
import {
    GroupsFetched,
    ModellingGroupTypes,
    SetGroupDetails,
    SetCurrentGroup, SetCurrentGroupMembers, AddModellingGroup, SetShowCreateGroup
} from "../actionTypes/ModellingGroupsTypes";
import {ContribAppState} from "../../contrib/reducers/contribAppReducers";
import {isNonEmptyArray} from "../../shared/ArrayHelpers";
import {ExpectationsService} from "../../shared/services/ExpectationsService";

export const modellingGroupsActionCreators = {

    getAllGroups() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const groups: ModellingGroup[] = await (new ModellingGroupsService(dispatch, getState)).getAllGroups();
            dispatch({
                type: ModellingGroupTypes.GROUPS_FETCHED,
                data: groups
            } as GroupsFetched );
        }
    },

    getGroupDetails(groupId: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const groupDetails: ModellingGroupDetails = await (new ModellingGroupsService(dispatch, getState)).getGroupDetails(groupId);
            dispatch({
                type: ModellingGroupTypes.GROUP_DETAILS_FETCHED,
                data: groupDetails
            } as SetGroupDetails);
        }
    },

    setCurrentGroup(groupId: string) {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const groups = getState().groups.groups;
            const currentGroup = groups.find(group => group.id === groupId);
            dispatch({
                type: ModellingGroupTypes.SET_CURRENT_GROUP,
                data: currentGroup ? currentGroup : null
            } as SetCurrentGroup);
        }
    },

    addUserToGroup(groupId: string, username: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new ModellingGroupsService(dispatch, getState))
                .addMember(groupId, username);
            if (result === "OK") {
                dispatch(this.clearCacheForGroupDetails(groupId));
                await dispatch(this.getGroupDetails(groupId));
                dispatch(this.setCurrentGroupMembers());
            }
        }
    },

    removeUserFromGroup(groupId: string, username: string) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const result = await (new ModellingGroupsService(dispatch, getState))
                .removeMember(groupId, username);
            if (result === "OK") {
                dispatch(this.clearCacheForGroupDetails(groupId));
                await dispatch(this.getGroupDetails(groupId));
                dispatch(this.setCurrentGroupMembers());
            }
        }
    },

    clearCacheForGroupDetails(groupId: string,) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            (new ModellingGroupsService(dispatch, getState)).clearCacheForGroupDetails(groupId);
        }
    },

    setCurrentGroupMembers() {
        return (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const currentGroupDetails = getState().groups.currentGroupDetails;
            const allUsers = getState().users.users;
            let currentGroupMembers: User[] = [];

            if (currentGroupDetails && isNonEmptyArray(allUsers)) {
                currentGroupMembers = compact(currentGroupDetails.members
                    .map(memberUsername =>
                        allUsers.find(user => user.username === memberUsername)
                    )
                )
            }

            dispatch({
                type: ModellingGroupTypes.SET_CURRENT_GROUP_MEMBERS,
                data: currentGroupMembers
            } as SetCurrentGroupMembers);
        }
    },

    createModellingGroup(newGroup: ModellingGroupCreation) {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {

            // autogenerate this description field
            newGroup.description = `${newGroup.institution} (${newGroup.pi})`;

            const service = new ModellingGroupsService(dispatch, getState);
            const result = await service.createGroup(newGroup);
            
            if (result) {
                service.clearGroupListCache();
                dispatch(this.setShowCreateGroup(false));
                dispatch({
                    type: ModellingGroupTypes.ADD_MODELLING_GROUP,
                    data: newGroup
                } as AddModellingGroup)
            }
        }
    },

    setShowCreateGroup(show: boolean): SetShowCreateGroup {
        return {
            type: ModellingGroupTypes.SET_SHOW_CREATE_GROUP,
            data: show
        }
    },

    getAllModelsAndExpectations() {
        return async (dispatch: Dispatch<AdminAppState>, getState: () => AdminAppState) => {
            const models = await (new ModellingGroupsService(dispatch, getState)).getAllModels();
            const expectations = await (new ExpectationsService(dispatch, getState)).getAllExpectations();
            dispatch({
                type: ModellingGroupTypes.MODELS_FETCHED,
                models: models,
                expectations: expectations
            })

        }
    }

};