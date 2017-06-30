import { Source } from "../../shared/sources/Source";
import { Responsibilities } from "../../shared/models/Generated";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import { ResponsibilityState, responsibilityStore } from "../stores/ResponsibilityStore";
import SourceModel = AltJS.SourceModel;

export class ResponsibilitySource extends Source<ResponsibilityState> {
    private fetchResponsibilities: () => SourceModel<Responsibilities>;

    constructor() {
        super();
        this.fetchResponsibilities = () => {
            return this.doFetch(s => `/modelling-groups/${s.currentModellingGroup.id}/responsibilities/${s.currentTouchstone.id}/`, {
                success: responsibilityActions.update,
                loading: responsibilityActions.beginFetch,
                isCached: s => false
            });
        };
    }
}