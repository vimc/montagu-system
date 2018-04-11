import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import {EstimatesCreateBurdenData} from "../actionTypes/EstimatesTypes";

export class EstimatesService extends AbstractLocalService {
    getOneTimeToken(groupId: string, touchstoneId: string, scenarioId: string, estimateSetId: string, queryString: string) {
        return this.get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${estimateSetId}/get_onetime_link/${queryString}`);
    }

    createBurden(groupId: string, touchstoneId: string, scenarioId: string, data: EstimatesCreateBurdenData) {
        return this.post(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/`, JSON.stringify(data));
    }
}

