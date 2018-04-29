import { AbstractLocalService } from "./AbstractLocalService";

export class ModellingGroupsService extends AbstractLocalService {

    getAllGroups() {
        return this.setOptions({cacheKey: ModellingGroupsCacheKeysEnum.groups})
            .get("/modelling-groups/");
    }

    getGroupDetails(groupId: string) {
        return this.setOptions({cacheKey: ModellingGroupsCacheKeysEnum.groupsDetails})
            .get(`/modelling-groups/${groupId}/`);
    }
}

export enum ModellingGroupsCacheKeysEnum {
    groups = "groups",
    groupsDetails = "groupsDetails",
}
