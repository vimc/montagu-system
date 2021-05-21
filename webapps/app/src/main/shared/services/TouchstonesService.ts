import {AbstractLocalService} from "./AbstractLocalService";
import {
    ResponsibilitySetWithComments,
    ResponsibilitySetWithExpectations,
    ScenarioAndCoverageSets,
    Touchstone
} from "../models/Generated";

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

    getResponsibilityCommentsForTouchstoneVersion(touchstoneVersion: string): Promise<ResponsibilitySetWithComments[]> {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.responsibilityComments})
            .get(`/touchstones/${touchstoneVersion}/responsibilities/comments/`);
    }

    addResponsibilityComment(touchstoneVersion: string, modellingGroupId: string, scenarioId: string, comment: string) {
        return this.post(`/touchstones/${touchstoneVersion}/responsibilities/comments/?group_id=${modellingGroupId}&scenario_id=${scenarioId}&comment=${encodeURIComponent(comment)}`)
    }

    clearCacheForTouchstoneResponsibilityComments(touchstoneVersion: string) {
        return this.clearCache(TouchstonesCacheKeysEnum.responsibilityComments, `/touchstones/${touchstoneVersion}/responsibilities/comments/`);
    }

    getScenariosForTouchstoneVersion(touchstoneVersion: string): Promise<ScenarioAndCoverageSets[]> {
        return this.setOptions({cacheKey: TouchstonesCacheKeysEnum.touchstones})
            .get(`/touchstones/${touchstoneVersion}/scenarios/`);
    }
}

export enum TouchstonesCacheKeysEnum {
    touchstones = "touchstones",
    responsibilityComments = "responsibilityComments",
}
