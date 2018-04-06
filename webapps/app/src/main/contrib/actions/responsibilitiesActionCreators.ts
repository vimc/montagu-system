import { Dispatch } from "redux";

import {ResponsibilitiesService} from "../services/ResponsibilitiesService";
import {ModellingGroup, Touchstone} from "../../shared/models/Generated";
import {
    ResponsibilitiesTypes, SetCurrentResponsibility,
    SetResponsibilities
} from "../actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibility, ExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export const responsibilitiesActionCreators = {

    clearCacheForResponsibilitySet() {
        return async (dispatch: Dispatch<any>, getState: any) => {
            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;
            (new ResponsibilitiesService(dispatch, getState)).clearCacheForResponsibilities(group.id, touchstone.id);
        }
    },

    getResponsibilitySet() {
        return async (dispatch: Dispatch<any>, getState: any) => {
            const group = getState().groups.currentUserGroup;
            const touchstone = getState().touchstones.currentTouchstone;

            const responsibilities: any = await (new ResponsibilitiesService(dispatch, getState))
                .getResponsibilities(group.id, touchstone.id);
            const set = new ExtendedResponsibilitySet(responsibilities, touchstone, group);

            dispatch({
                type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
                data: set
            } as SetResponsibilities );
        }
    },

    setCurrentResponsibility(scenarioId: string ) {
        return async (dispatch: Dispatch<any>, getState: any) => {
            const set = getState().responsibilities.set;
            const responsibility = set ? set.responsibilities.find((item: ExtendedResponsibility) => item.scenario.id === scenarioId) : null;
            dispatch({
                type: ResponsibilitiesTypes.SET_CURRENT_RESPONSIBILITY_SET,
                data: responsibility
            } as SetCurrentResponsibility );
        }
    }
};
