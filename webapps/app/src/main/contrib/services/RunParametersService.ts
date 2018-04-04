import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class RunParametersService extends AbstractLocalService {

    getParameterSets(groupId: string, touchstoneId: string) {
        return this.setOptions({cacheKey: RunParametersCacheKeysEnum.runParameters})
            .get(`/modelling-groups/${groupId}/model-run-parameters/${touchstoneId}/`);
    }
}

export enum RunParametersCacheKeysEnum {
    "runParameters" = "runParameters",
}
