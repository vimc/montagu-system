import {AbstractLocalService} from "./AbstractLocalService";
import {
    ResponsibilityComment,
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
        const responsibilityComment: ResponsibilityComment = { comment, added_by: undefined, added_on: undefined };
        return this.post(
            `/touchstones/${touchstoneVersion}/responsibilities/${modellingGroupId}/${scenarioId}/comments/`,
            JSON.stringify(responsibilityComment)
        );
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
