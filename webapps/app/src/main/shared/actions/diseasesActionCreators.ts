import {Dispatch} from "redux";

import {DiseasesService} from "../services/DiseasesService";
import {DiseasesFetched, DiseasesTypes, SetCurrentDiseaseId} from "../actionTypes/DiseasesTypes";
import {Disease} from "../models/APITypes";
import {CommonState} from "../reducers/CommonState";

export const diseasesActionCreators = {

    getAllDiseases() {
        return async (dispatch: Dispatch<CommonState>, getState: () => CommonState) => {
            const allDiseases: Disease[] = await (new DiseasesService(dispatch, getState)).getAllDiseases();
            dispatch({
                type: DiseasesTypes.DISEASES_FETCHED,
                data: allDiseases
            } as DiseasesFetched );
        }
    },

    setCurrentDiseaseId(diseaseId: string) {
        return (dispatch: Dispatch<CommonState>) => {
            dispatch({
                type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
                data: diseaseId
            } as SetCurrentDiseaseId );
        }
    }


};
