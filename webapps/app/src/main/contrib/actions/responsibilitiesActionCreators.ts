import { Dispatch } from "redux";

import {ResponsibilitiesService} from "../services/ResponsibilitiesService";
import {
    ResponsibilitiesTypes, SetCurrentResponsibility,
    SetResponsibilities
} from "../actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibility, ExtendedResponsibilitySet} from "../models/ResponsibilitySet";
import {estimatesActionCreators} from "./estimatesActionCreators";
import {ContribAppState} from "../reducers/contribAppReducers";
import {Responsibilities} from "../../shared/models/Generated";

export const responsibilitiesActionCreators = {

    clearCacheForResponsibilitySet() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;

            (new ResponsibilitiesService(dispatch, getState)).clearCacheForResponsibilities(group.id, touchstone.id);
        }
    },

    getResponsibilitySet() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;

            const responsibilities: Responsibilities = await (new ResponsibilitiesService(dispatch, getState))
                .getResponsibilities(group.id, touchstone.id);
            const set = new ExtendedResponsibilitySet(responsibilities, touchstone, group);

            dispatch({
                type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
                data: set
            } as SetResponsibilities );
        }
    },

    setCurrentResponsibility(scenarioId: string ) {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const set = getState().responsibilities.responsibilitiesSet;
            const responsibility = set ? set.responsibilities.find((item: ExtendedResponsibility) => item.scenario.id === scenarioId) : null;
            dispatch({
                type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY,
                data: responsibility
            } as SetCurrentResponsibility );
        }
    },

    refreshResponsibilities() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const scenarioId = getState().responsibilities.currentResponsibility.scenario.id;
            dispatch(this.clearCacheForResponsibilitySet());
            await dispatch(this.getResponsibilitySet());
            dispatch(this.setCurrentResponsibility(scenarioId));
            await dispatch(estimatesActionCreators.getOneTimeToken());
        }
    }
};
