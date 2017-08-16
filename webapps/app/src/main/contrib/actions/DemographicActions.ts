import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { alt } from "../../shared/alt";
import { DemographicStatisticType } from "../../shared/models/Generated";

interface Actions extends FetchActionsInterface<DemographicStatisticType[]> {
    selectDataSet(dataSetId: string): string;
    selectGender(gender: string): string;
    updateToken(token: string): string;
    beginFetchToken(): boolean;
    clearUsedToken(): boolean;
}

class DemographicActions extends FetchActions<DemographicStatisticType[]> implements Actions {
    selectDataSet(dataSetId: string): string {
        return dataSetId;
    }
    selectGender(gender: string): string {
        return gender;
    }
    updateToken(token: string): string {
        return token;
    }
    beginFetchToken(): boolean {
        return true;
    }
    clearUsedToken(): boolean {
        return true;
    }
}

export const demographicActions = alt.createActions<Actions>(DemographicActions);
