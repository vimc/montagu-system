import { Disease } from "../../shared/models/Generated";
import { diseaseActions } from "../actions/DiseaseActions";
import { Source } from '../../shared/sources/Source';
import SourceModel = AltJS.SourceModel;
import { MainState } from "../stores/MainStore";

export class DiseaseSource extends Source<Disease[], MainState> {
    fetchDiseases: () => SourceModel<Disease[]>;

    constructor() {
        super({ success: diseaseActions.update, loading: diseaseActions.beginFetch });
        this.fetchDiseases = () => this.doFetch(_ => "/diseases/");
    }
}
