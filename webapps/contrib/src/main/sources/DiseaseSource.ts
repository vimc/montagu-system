import { Disease } from "../Models";
import { diseaseActions } from "../actions/DiseaseActions";
import { Source } from './Source';
import SourceModel = AltJS.SourceModel;
import { State } from "../stores/MainStore";

export class DiseaseSource extends Source<Disease[], State> {
    fetchDiseases: () => SourceModel<Disease[]>;

    constructor() {
        super({ success: diseaseActions.update, loading: diseaseActions.beginFetch });
        this.fetchDiseases = () => this.doFetch(_ => "/diseases/");
    }
}
