import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class CoverageService extends AbstractLocalService {
    getDataSets(groupId: string, touchstoneId: string, scenarioId: string) {
        return this.setOptions({cacheKey: CoverageCacheKeysEnum.sets})
            .get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/coverage-sets/`);
    }

    getOneTimeToken(groupId: string, touchstoneId: string, scenarioId: string, format: string) {
        return this.get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/coverage/get_onetime_link/?format=${format}`);
    }
}

export enum CoverageCacheKeysEnum {
    "sets" = "sets",
}
