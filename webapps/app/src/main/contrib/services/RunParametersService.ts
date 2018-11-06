import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import FormData = require("form-data");

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

    uploadSet(groupId: string, touchstoneId: string, data: FormData) {
        return this.setOptions({notificationOnError: false})
            .post(`/modelling-groups/${groupId}/model-run-parameters/${touchstoneId}/`, data);
    }
}

export enum RunParametersCacheKeysEnum {
    runParameters = "runParameters",
}
