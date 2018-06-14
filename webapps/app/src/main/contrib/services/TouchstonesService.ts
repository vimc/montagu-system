import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import {Touchstone} from "../../shared/models/Generated";

export class TouchstonesService extends AbstractLocalService {

    getTouchstonesByGroupId(groupId: string): Promise<Touchstone[]> {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get(`/modelling-groups/${groupId}/responsibilities/`);
    }
}

export enum TouchstonesCacheKeysEnum {
    touchstones = "touchstones",
}
