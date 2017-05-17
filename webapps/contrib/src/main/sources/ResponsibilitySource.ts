import { Source } from "./Source";
import { Responsibilities } from "../models/Generated";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import SourceModel = AltJS.SourceModel;
import { State } from "../stores/ResponsibilityStore";

export class ResponsibilitySource extends Source<Responsibilities, State> {
    private fetchResponsibilities: () => SourceModel<Responsibilities>;

    constructor() {
        super({ success: responsibilityActions.update, loading: responsibilityActions.beginFetch });
        this.fetchResponsibilities = () => {
            return this.doFetch(s => `/modelling-groups/${s.currentModellingGroupId}/responsibilities/${s.currentTouchstone.id}/`);
        };
    }
}