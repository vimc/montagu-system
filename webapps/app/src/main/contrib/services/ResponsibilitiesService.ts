import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class ResponsibilitiesService extends AbstractLocalService {

    getResponsibilities(groupId: string, touchstoneId: string) {
        return this.setOptions({cacheKey: ResponsibilitiesCacheKeysEnum.set})
            .get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/`);
    }

    clearCacheForResponsibilities(groupId: string, touchstoneId: string) {
        return this.clearCache(ResponsibilitiesCacheKeysEnum.set, `/modelling-groups/${groupId}/responsibilities/${touchstoneId}/`);
    }
}

export enum ResponsibilitiesCacheKeysEnum {
    set = "set",
}
