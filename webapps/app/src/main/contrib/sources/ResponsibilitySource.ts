import { Source } from "../../shared/sources/Source";
import { Responsibilities } from "../../shared/models/Generated";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import SourceModel = AltJS.SourceModel;
import { getCurrentResponsibilitySet, ResponsibilityState } from "../stores/ResponsibilityStore";

export class ResponsibilitySource extends Source<ResponsibilityState> {
    private fetchResponsibilities: () => SourceModel<Responsibilities>;

    constructor() {
        super();
        this.fetchResponsibilities = () => {
            return this.doFetch(s => `/modelling-groups/${s.currentModellingGroup.id}/responsibilities/${s.currentTouchstone.id}/`, {
                success: responsibilityActions.update,
                loading: responsibilityActions.beginFetch,
                isCached: state => {
                    const set = getCurrentResponsibilitySet(state);
                    return set != null && set.modellingGroup == state.currentModellingGroup
                }
            });
        };
    }
}