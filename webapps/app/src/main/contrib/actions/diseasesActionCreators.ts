import { Dispatch } from "redux";

import { DiseasesService } from "../services/DiseasesService";
import {DiseasesFetched, DiseasesTypes, SetCurrentDiseaseId} from "../actionTypes/DiseasesTypes";
import {ContribAppState} from "../reducers/contribAppReducers";

export const diseasesActionCreators = {

    getAllDiseases() {
        return async (dispatch: Dispatch<any>, getState: () => ContribAppState) => {
            const allDiseases: any = await (new DiseasesService(dispatch, getState)).getAllDiseases();
            dispatch({
                type: DiseasesTypes.DISEASES_FETCHED,
                data: allDiseases
            } as DiseasesFetched );
        }
    },

    setCurrentDiseaseId(diseaseId: string) {
        return (dispatch: Dispatch<any>) => {
            dispatch({
                type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
                data: diseaseId
            } as SetCurrentDiseaseId );
        }
    }


};
