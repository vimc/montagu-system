import { Source } from "./Source";
import { Touchstone } from "../Models";
import { touchstoneActions } from "../actions/TouchstoneActions";
import SourceModel = AltJS.SourceModel;
import { State } from "../stores/ResponsibilityStore";

export class TouchstoneSource extends Source<Touchstone[], State> {
    fetchTouchstones: () => SourceModel<Touchstone[]>;

    constructor() {
        super({ success: touchstoneActions.update, loading: touchstoneActions.beginFetch });
        this.fetchTouchstones = () => this.doFetch(_ => "/touchstones/");
    }
}
