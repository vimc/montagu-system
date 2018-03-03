import { AbstractLocalService } from "./AbstractLocalService";

export class ModellingGroupsService extends AbstractLocalService {

    getAllGroups() {
        return this.setOptions({cacheKey: ModellingGroupsCacheKeysEnum.groups})
            .get("/modelling-groups/");
    }
}

export enum ModellingGroupsCacheKeysEnum {
    "groups" = "groups",
}
