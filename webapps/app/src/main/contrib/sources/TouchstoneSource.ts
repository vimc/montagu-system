import { Source } from "../../shared/sources/Source";
import { Touchstone } from "../../shared/models/Generated";
import { touchstoneActions } from "../actions/TouchstoneActions";
import SourceModel = AltJS.SourceModel;
import { ResponsibilityState } from "../stores/ResponsibilityStore";

export class TouchstoneSource extends Source<Touchstone[], ResponsibilityState> {
    fetchTouchstones: () => SourceModel<Touchstone[]>;

    constructor() {
        super({ success: touchstoneActions.update, loading: touchstoneActions.beginFetch });
        this.fetchTouchstones = () => this.doFetch(_ => "/touchstones/");
    }
}
