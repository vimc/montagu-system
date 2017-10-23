import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { alt } from "../../shared/alt";
import { DemographicDataset } from "../../shared/models/Generated";

interface Actions extends FetchActionsInterface<DemographicDataset[]> {
    selectDataSet(dataSetId: string): string;
    selectGender(gender: string): string;
    selectFormat(format: string): string;

    updateToken(token: string): string;
    beginFetchToken(): boolean;
    clearUsedToken(): boolean;

}

class DemographicActions extends FetchActions<DemographicDataset[]> implements Actions {
    selectDataSet(dataSetId: string): string {
        return dataSetId;
    }

    selectGender(gender: string): string {
        return gender;
    }

    selectFormat(format: string): string {
        return format;
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
