import {ContribAppState} from "../reducers/contribAppReducers";

export const mapStateToPropsHelper = {
    getResponsibilityIds(state: ContribAppState) {
        const groupId = state.groups.currentUserGroup.id;
        const touchstoneId = state.touchstones.currentTouchstone.id;
        const scenarioId = state.responsibilities.currentResponsibility.scenario.id;
        const estimateSetId = state.responsibilities.currentResponsibility.current_estimate_set
            ? state.responsibilities.currentResponsibility.current_estimate_set.id
            :null;
        return {groupId, touchstoneId, scenarioId, estimateSetId};
    }
}