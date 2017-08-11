import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { alt } from "../../shared/alt";
import { DemographicStatisticType } from "../../shared/models/Generated";
import { createSign } from "crypto";

interface Actions extends FetchActionsInterface<DemographicStatisticType[]> {
    selectDataSet(dataSetId: string): string;
    selectGender(gender: string): string;
}

class DemographicActions extends FetchActions<DemographicStatisticType[]> implements Actions {
    selectDataSet(dataSetId: string): string {
        return dataSetId;
    }
    selectGender(gender: string): string {
        return gender;
    }
}

export const demographicActions = alt.createActions<Actions>(DemographicActions);
