import { Disease } from "../../shared/models/Generated";
import { diseaseActions } from "../actions/DiseaseActions";
import { Source } from "../../shared/sources/Source";
import { MainState } from "../stores/MainStore";
import SourceModel = AltJS.SourceModel;

export class DiseaseSource extends Source<MainState> {
    fetchDiseases: () => SourceModel<Disease[]>;

    constructor() {
        super();
        this.fetchDiseases = () => this.doFetch(_ => "/diseases/", {
            success: diseaseActions.update,
            loading: diseaseActions.beginFetch,
            isCached: state => state.diseases.loaded
        });
    }
}
