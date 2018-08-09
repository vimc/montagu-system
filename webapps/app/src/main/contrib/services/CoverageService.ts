import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class CoverageService extends AbstractLocalService {
    getDataSets(groupId: string, touchstoneId: string, scenarioId: string) {
        return this.setOptions({cacheKey: CoverageCacheKeysEnum.sets})
            .get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/coverage-sets/`);
    }
}

export enum CoverageCacheKeysEnum {
    "sets" = "sets",
}
