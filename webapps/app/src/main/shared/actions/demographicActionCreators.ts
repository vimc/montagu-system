import { Dispatch } from "redux";

import {ContribAppState} from "../../contrib/reducers/contribAppReducers";
import {DemographicService} from "../services/DemographicService";
import {DemographicDataset} from "../models/Generated";
import {AdminAppState} from "../../admin/reducers/adminAppReducers";
import {Demographic, DemographicTypes} from "../actionTypes/DemographicTypes";

export const demographicActionCreators = {

    getDataSets(touchstoneVersionId: string) {
        return async (dispatch: Dispatch<ContribAppState | AdminAppState>, getState: () => ContribAppState | AdminAppState) => {
            const dataSets: DemographicDataset[] = await (new DemographicService(dispatch, getState))
                .getDataSetsByTouchstoneVersionId(touchstoneVersionId);

            // reset selected data set
            await dispatch(demographicActionCreators.setDataSet(null));

            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
                data: dataSets
            } as Demographic.DataSetsFetched );
        }
    },

    setDataSet(dataSetId: string) {
        return (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState | AdminAppState) => {
            let dataSet = null;
            if (!!dataSetId){
                const dataSets = getState().demographics.dataSets;
                dataSet = dataSets.find((set: DemographicDataset) => set.id === dataSetId);
            }
            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
                data: dataSet
            } as Demographic.SetDataSet );
        }
    },

    setGender(gender: string) {
        return {
            type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
            data: gender
        } as Demographic.SetGender;
    },

    setFormat(format: string) {
        return {
            type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
            data: format
        } as Demographic.SetFormat;
    },
};
