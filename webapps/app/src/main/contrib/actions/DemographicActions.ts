import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { alt } from "../../shared/alt";
import { DemographicStatisticType } from "../../shared/models/Generated";

export const demographicActions = alt.createActions<FetchActionsInterface<DemographicStatisticType[]>>(
    class extends FetchActions<DemographicStatisticType[]> { }
);
