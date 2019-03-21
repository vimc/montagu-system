import {AbstractLocalService} from "../../shared/services/AbstractLocalService";
import {CreateBurdenEstimateSet, Result} from "../../shared/models/Generated";
import {ILookup} from "../../shared/models/Lookup";
import {DataPoint} from "../reducers/estimatesReducer";

export class EstimatesService extends AbstractLocalService {
    createBurden(groupId: string, touchstoneId: string, scenarioId: string, data: CreateBurdenEstimateSet) {
        return this.post(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/`, JSON.stringify(data));
    }

    getEstimates(groupId: string, touchstoneId: string, scenarioId: string, setId: number, outcome: string): Promise<ILookup<DataPoint[]>> {
        return this.get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${setId}/estimates/${outcome}/`);
    }

    getUploadToken(groupId: string, touchstoneId: string, scenarioId: string, setId: number): Promise<string> {
        return this.get(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${setId}/actions/request-upload/`);
    }

    populateEstimatesFromFile(groupId: string, touchstoneId: string, scenarioId: string, setId: number, uploadToken: string):
        Promise<String | Result> {
        return this.setOptions({notificationOnError: false})
            .post(`/modelling-groups/${groupId}/responsibilities/${touchstoneId}/${scenarioId}/estimate-sets/${setId}/actions/populate/${uploadToken}/`)
    }
}
