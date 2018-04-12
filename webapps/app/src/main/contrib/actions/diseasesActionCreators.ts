import { Dispatch } from "redux";

import { DiseasesService } from "../services/DiseasesService";
import {DiseasesFetched, DiseasesTypes, SetCurrentDiseaseId} from "../actionTypes/DiseasesTypes";
import {ContribAppState} from "../reducers/contribAppReducers";
import {Disease} from "../../shared/models/Generated";

export const diseasesActionCreators = {

    getAllDiseases() {
        return async (dispatch: Dispatch<ContribAppState>, getState: () => ContribAppState) => {
            const allDiseases: Disease[] = await (new DiseasesService(dispatch, getState)).getAllDiseases();
            dispatch({
                type: DiseasesTypes.DISEASES_FETCHED,
                data: allDiseases
            } as DiseasesFetched );
        }
    },

    setCurrentDiseaseId(diseaseId: string) {
        return (dispatch: Dispatch<ContribAppState>) => {
            dispatch({
                type: DiseasesTypes.DISEASES_SET_CURRENT_DISEASE_ID,
                data: diseaseId
            } as SetCurrentDiseaseId );
        }
    }


};
