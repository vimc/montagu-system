import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class DemographicService extends AbstractLocalService {
    getDataSetsByTouchstoneId(touchstoneId: string) {
        return this.setOptions({cacheKey: DemographicCacheKeysEnum.demographic})
            .get(`/touchstones/${touchstoneId}/demographics/`);
    }

    getOneTimeToken(touchstoneId: string, dataSetSource: string, datasetId: string, format: string) {
        return this.get(`/touchstones/${touchstoneId}/demographics/${dataSetSource}/${datasetId}/get_onetime_link/?format=${format}`);
    }
}

export enum DemographicCacheKeysEnum {
    "demographic" = "demographic",
}
