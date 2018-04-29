import { AbstractLocalService } from "./AbstractLocalService";
import {AssociateUser} from "../models/Generated";

export class ModellingGroupsService extends AbstractLocalService {

    getAllGroups() {
        return this.setOptions({cacheKey: ModellingGroupsCacheKeysEnum.groups})
            .get("/modelling-groups/");
    }

    getGroupDetails(groupId: string) {
        return this.setOptions({cacheKey: ModellingGroupsCacheKeysEnum.groupsDetails})
            .get(`/modelling-groups/${groupId}/`);
    }

    addMember(groupId: string, username: string) {
        const associateUser: AssociateUser = {
            username: username,
            action: "add"
        };
        return this.post(`/modelling-groups/${groupId}/actions/associate-member/`, JSON.stringify(associateUser));
    }

    removeMember(groupId: string, username: string) {
        const associateUser: AssociateUser = {
            username: username,
            action: "remove"
        };
        return this.post(`/modelling-groups/${groupId}/actions/associate-member/`, JSON.stringify(associateUser));
    }

    clearCacheForGroupDetails(groupId: string) {
        return this.clearCache(ModellingGroupsCacheKeysEnum.groupsDetails, `/modelling-groups/${groupId}/`);
    }
}

export enum ModellingGroupsCacheKeysEnum {
    groups = "groups",
    groupsDetails = "groupsDetails",
}
