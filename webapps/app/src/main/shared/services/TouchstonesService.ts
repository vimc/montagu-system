import {AbstractLocalService} from "./AbstractLocalService";
import {ResponsibilitySetWithExpectations, ScenarioAndCoverageSets, Touchstone} from "../models/Generated";

export class TouchstonesService extends AbstractLocalService {
    getAllTouchstones(): Promise<Touchstone[]> {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get("/touchstones/");
    }

    getTouchstonesByGroupId(groupId: string): Promise<Touchstone[]> {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get(`/modelling-groups/${groupId}/responsibilities/`);
    }

    getResponsibilitiesForTouchstoneVersion(touchstoneVersion: string): Promise<ResponsibilitySetWithExpectations[]> {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get(`/touchstones/${touchstoneVersion}/responsibilities/`);
    }

    getScenariosForTouchstoneVersion(touchstoneVersion: string): Promise<ScenarioAndCoverageSets[]> {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get(`/touchstones/${touchstoneVersion}/scenarios/`);
    }
}

export enum TouchstonesCacheKeysEnum {
    touchstones = "touchstones",
}
