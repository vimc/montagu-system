import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class TouchstonesService extends AbstractLocalService {

    getTouchstonesByGroupId(groupId: string) {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get(`/modelling-groups/${groupId}/responsibilities/`);
    }
}

export enum TouchstonesCacheKeysEnum {
    "touchstones" = "touchstones",
}
