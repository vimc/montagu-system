import { AbstractLocalService } from "../../shared/services/AbstractLocalService";

export class EstimatesService extends AbstractLocalService {
    getOneTimeToken(groupId: string, touchstoneId: string, scenarioId: string, estimateSetId: string, queryString: string) {
        return this.get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${estimateSetId}/get_onetime_link/${queryString}`);
    }
}

