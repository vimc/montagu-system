import { Source } from "../../shared/sources/Source";
import { Touchstone } from "../../shared/models/Generated";
import { touchstoneActions } from "../actions/TouchstoneActions";
import SourceModel = AltJS.SourceModel;
import { ResponsibilityState } from "../stores/ResponsibilityStore";

export class TouchstoneSource extends Source<ResponsibilityState> {
    fetchTouchstones: () => SourceModel<Touchstone[]>;

    constructor() {
        super();
        this.fetchTouchstones = () => this.doFetch(_ => "/touchstones/", {
            success: touchstoneActions.update,
            loading: touchstoneActions.beginFetch,
            isCached: state => state.touchstones != null && state.touchstones.length > 0
        });
    }
}
