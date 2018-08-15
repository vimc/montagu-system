import {AbstractLocalService} from "../../shared/services/AbstractLocalService";

export class DemographicService extends AbstractLocalService {
    getDataSetsByTouchstoneVersionId(touchstoneId: string) {
        return this.setOptions({cacheKey: DemographicCacheKeysEnum.sets})
            .get(`/touchstones/${touchstoneId}/demographics/`);
    }
}

export enum DemographicCacheKeysEnum {
    sets = "sets",
}
