import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {DemographicService} from "../services/DemographicService";
import {Demographic, DemographicTypes} from "../actionTypes/DemographicTypes";
import {DemographicDataset} from "../../shared/models/Generated";

export const demographicActionCreators = {

    getDataSets(touchstoneId: string) {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const dataSets: any = await (new DemographicService(dispatch, getState)).getDataSetsByTouchstoneId(touchstoneId);
            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_DATA_SETS_FETCHED,
                data: dataSets
            } as Demographic.DataSetsFetched );
        }
    },

    setDataSet(dataSetId: string) {
        return (dispatch: Dispatch<any>, getState: any) => {
            const dataSets = getState().demographic.dataSets;
            const dataSet = dataSets.find((set: DemographicDataset) => set.id === dataSetId);
            dispatch({
                type: DemographicTypes.DEMOGRAPHIC_SET_DATA_SET,
                data: dataSet
            } as Demographic.SetDataSet );
        }
    },

    setGender(gender: string) {
        return (dispatch: Dispatch<any>) => {
            dispatch({
                type: DemographicTypes.DEMOGRAPHIC_SET_GENDER,
                data: gender
            } as Demographic.SetGender );
        }
    },

    setFormat(format: string) {
        return (dispatch: Dispatch<any>) => {
            dispatch({
                type: DemographicTypes.DEMOGRAPHIC_SET_FORMAT,
                data: format
            } as Demographic.SetFormat);
        }
    },

    getOneTimeToken() {
        return async (dispatch: Dispatch<any>, getState: any) => {
            dispatch({
                type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_CLEAR,
            } as Demographic.OneTimeTokenClear );
            const dataSet = getState().demographic.selectedDataSet;
            const touchstone = getState().touchstones.currentTouchstone;
            const format = getState().demographic.selectedFormat;
            const token: string = await (new DemographicService(dispatch, getState))
                .getOneTimeToken(touchstone.id, dataSet.source, dataSet.id, format);
            return dispatch({
                type: DemographicTypes.DEMOGRAPHIC_ONE_TIME_TOKEN_FETCHED,
                data: token
            } as Demographic.OneTimeTokenFetched );
        }
    },
};
