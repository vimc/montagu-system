import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class DemographicService extends AbstractLocalService {
    getDataSetsByTouchstoneId(touchstoneId: string) {
        return this.setOptions({cacheKey: DemographicCacheKeysEnum.sets})
            .get(`/touchstones/${touchstoneId}/demographics/`);
    }
}

export enum DemographicCacheKeysEnum {
    sets = "sets",
}
