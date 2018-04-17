import { Dispatch } from "redux";

import {ContribAppState} from "../reducers/contribAppReducers";
import {Coverage, CoverageTypes} from "../actionTypes/CoverageTypes";
import {CoverageService} from "../services/CoverageService";
import {statePropsMapHelper} from "../helpers/statePropsMapHelper";
import { ScenarioAndCoverageSets} from "../../shared/models/Generated";

export const coverageActionCreators = {

    getDataSets() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {

            const ids = statePropsMapHelper.getResponsibilityIds(getState());

            const sets: ScenarioAndCoverageSets = await (new CoverageService(dispatch, getState))
                .getDataSets(ids.groupId, ids.touchstoneId, ids.scenarioId);

            return dispatch({
                type: CoverageTypes.COVERAGE_DATA_SETS_FETCHED,
                data: sets ? sets.coverage_sets: null
            } as Coverage.DataSetsFetched );
        }
    },

    setFormat(format: string) {
        return {
            type: CoverageTypes.COVERAGE_SET_FORMAT,
            data: format
        } as Coverage.SetFormat;
    },

    getOneTimeToken() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            dispatch({
                type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_CLEAR,
            } as Coverage.OneTimeTokenClear );

            const ids = statePropsMapHelper.getResponsibilityIds(getState());

            const format = getState().coverage.selectedFormat;

            const token: string = await (new CoverageService(dispatch, getState))
                .getOneTimeToken(ids.groupId, ids.touchstoneId, ids.scenarioId, format);

            return dispatch({
                type: CoverageTypes.COVERAGE_ONE_TIME_TOKEN_FETCHED,
                data: token
            } as Coverage.OneTimeTokenFetched );
        }
    },
};
