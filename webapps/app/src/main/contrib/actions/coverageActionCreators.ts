import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {
    CoverageDataSetsFetched,
    CoverageOneTimeTokenClear, CoverageOneTimeTokenFetched, CoverageSetFormat,
    CoverageTypes
} from "../actionTypes/CoverageTypes";
import {CoverageService} from "../services/CoverageService";

export const coverageActionCreators = {

    getDataSets() {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {

            const touchstone = getState().touchstones.currentTouchstone;
            const group = getState().groups.currentUserGroup;
            const responsibility = getState().responsibilities.currentResponsibility;

            const sets: any = await (new CoverageService(dispatch, getState))
                .getDataSets(group.id, touchstone.id, responsibility.scenario.id);

            return dispatch({
                type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
                data: sets ? sets.coverage_sets: null
            } as CoverageDataSetsFetched );
        }
    },

    setFormat(format: string) {
        return (dispatch: Dispatch<any>) => {
            dispatch({
                type: CoverageTypes.COVERAGE_SET_FORMAT,
                data: format
            } as CoverageSetFormat);
        }
    },

    getOneTimeToken() {
        return async (dispatch: Dispatch<any>, getState: any) => {
            dispatch({
                type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR,
            } as CoverageOneTimeTokenClear );

            const touchstone = getState().touchstones.currentTouchstone;
            const format = getState().coverage.selectedFormat;
            const group = getState().groups.currentUserGroup;
            const responsibility = getState().responsibilities.currentResponsibility;

            const token: string = await (new CoverageService(dispatch, getState))
                .getOneTimeToken(group.id, touchstone.id, responsibility.scenario.id, format);

            return dispatch({
                type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED,
                data: token
            } as CoverageOneTimeTokenFetched );
        }
    },
};
