import {AbstractLocalService} from "./AbstractLocalService";

export class DemographicService extends AbstractLocalService {
    getDataSetsByTouchstoneVersionId(touchstoneId: string) {
        return this.setOptions({cacheKey: DemographicCacheKeysEnum.sets})
            .get(`/touchstones/${touchstoneId}/demographics/`);
    }
}

export enum DemographicCacheKeysEnum {
    sets = "sets",
}
