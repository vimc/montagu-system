import { Dispatch } from "redux";

import { DiseasesService } from "../services/DiseasesService";
import { DiseasesFetched, DiseasesTypes} from "../actionTypes/DiseasesTypes";
import {GlobalState} from "../../shared/reducers/GlobalState";

export const DiseasesActionCreators = {

    getAllDiseases() {
        return async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
            const allDiseases: any = await (new DiseasesService(dispatch, getState)).getAllDiseases();
            dispatch({
                type: DiseasesTypes.DISEASES_FETCHED,
                data: allDiseases
            } as DiseasesFetched );
        }
    },




};
