import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {DemographicService} from "../services/DemographicService";
import {DemographicDataSetsFetched, DemographicTypes} from "../actionTypes/DemographicTypes";

export const demographicActionCreators = {

    getDataSets(touchstoneId: string) {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const dataSets: any = await (new DemographicService(dispatch, getState)).getDataSetsByTouchstoneId(touchstoneId);
            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
                data: dataSets
            } as DemographicDataSetsFetched );
        }
    },
};
