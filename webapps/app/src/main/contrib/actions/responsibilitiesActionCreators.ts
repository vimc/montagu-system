import { Dispatch } from "redux";

import {ResponsibilitiesService} from "../services/ResponsibilitiesService";
import {ModellingGroup, Touchstone} from "../../shared/models/Generated";
import {ResponsibilitiesTypes, SetResponsibilities} from "../actionTypes/ResponsibilitiesTypes";
import {ExtendedResponsibilitySet} from "../models/ResponsibilitySet";

export const responsibilitiesActionCreators = {

    getResponsibilitySet(group: ModellingGroup, touchstone: Touchstone) {

        return async (dispatch: Dispatch<any>, getState: any) => {
            const responsibilities: any = await (new ResponsibilitiesService(dispatch, getState))
                .getResponsibilities(group.id, touchstone.id);
            const set = new ExtendedResponsibilitySet(responsibilities, touchstone, group);

            dispatch({
                type: ResponsibilitiesTypes.SET_RESPONSIBILITIES,
                data: set
            } as SetResponsibilities );
        }
    },
};
