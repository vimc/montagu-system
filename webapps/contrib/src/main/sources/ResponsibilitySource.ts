import { Source } from "./Source";
import { Responsibilities } from "../models/Generated";
import { responsibilityActions } from "../actions/ResponsibilityActions";
import SourceModel = AltJS.SourceModel;
import { ResponsibilityState } from "../stores/ResponsibilityStore";

export class ResponsibilitySource extends Source<Responsibilities, ResponsibilityState> {
    private fetchResponsibilities: () => SourceModel<Responsibilities>;

    constructor() {
        super({ success: responsibilityActions.update, loading: responsibilityActions.beginFetch });
        this.fetchResponsibilities = () => {
            return this.doFetch(s => `/modelling-groups/${s.currentModellingGroupId}/responsibilities/${s.currentTouchstone.id}/`);
        };
    }
}