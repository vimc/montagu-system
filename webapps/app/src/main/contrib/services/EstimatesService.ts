import { AbstractLocalService } from "../../shared/services/AbstractLocalService";
import {CreateBurdenEstimateSet} from "../../shared/models/Generated";

export class EstimatesService extends AbstractLocalService {
    createBurden(groupId: string, touchstoneId: string, scenarioId: string, data: CreateBurdenEstimateSet) {
        return this.post(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/`, JSON.stringify(data));
    }

    getEstimates(groupId: string, touchstoneId: string, scenarioId: string, setId: number, outcome: string) {
        return this.get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${setId}/estimates/${outcome}/`);
    }
}

