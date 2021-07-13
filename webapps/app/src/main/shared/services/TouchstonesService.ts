import {AbstractLocalService} from "./AbstractLocalService";
import {
    ResponsibilityCommentPayload,
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
        const responsibilityComment: ResponsibilityCommentPayload = { comment };
        return this.post(
            `/touchstones/${touchstoneVersion}/comments/${modellingGroupId}/${scenarioId}/`,
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
