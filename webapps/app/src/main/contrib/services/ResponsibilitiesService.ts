import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class ResponsibilitiesService extends AbstractLocalService {

    getResponsibilities(groupId: string, touchstoneId: string) {
        return this.setOptions({cacheKey: ResponsibilitiesCacheKeysEnum.responsibilities})
            .get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/`);
    }
}

export enum ResponsibilitiesCacheKeysEnum {
    "responsibilities" = "responsibilities",
}
