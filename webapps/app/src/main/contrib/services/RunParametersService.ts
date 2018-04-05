import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class RunParametersService extends AbstractLocalService {

    clearCacheForGetParameterSets(groupId: string, touchstoneId: string) {
        return this.clearCache(
            RunParametersCacheKeysEnum.runParameters,
            `/modelling-groups/${groupId}/model-run-parameters/${touchstoneId}/`
        );
    }

    getParameterSets(groupId: string, touchstoneId: string) {
        return this.setOptions({cacheKey: RunParametersCacheKeysEnum.runParameters})
            .get(`/modelling-groups/${groupId}/model-run-parameters/${touchstoneId}/`);
    }

    getOneTimeToken(groupId: string, touchstoneId: string, setId: number) {
        return this.get(`/modelling-groups/${groupId}/model-run-parameters/${touchstoneId}/${setId}/get_onetime_link/`);
    }
}

export enum RunParametersCacheKeysEnum {
    "runParameters" = "runParameters",
}
