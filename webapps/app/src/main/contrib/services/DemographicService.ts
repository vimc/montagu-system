import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class DemographicService extends AbstractLocalService {

    getDataSetsByTouchstoneId(touchstoneId: string) {
        return this.setOptions({cacheKey: DemographicCacheKeysEnum.demographic})
            .get(`/touchstones/${touchstoneId}/demographics/`);
    }
}

export enum DemographicCacheKeysEnum {
    "demographic" = "demographic",
}
