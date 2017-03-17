import alt from "../alt";
import * as AltJS from 'alt'
import VaccineActions from '../actions/VaccineActions'
import AbstractStore from "./AbstractStore";

export interface Vaccine {
    id: string;
    name: string;
}

export interface State {
    vaccines: Array<Vaccine>;
    errorMessage: string;
}

interface VaccineStoreInterface extends AltJS.AltStore<State> {
}

class VaccineStore extends AbstractStore<State> {
    vaccines: Array<Vaccine>;
    errorMessage: string;

    constructor() {
        super();
        this.vaccines = [];
        this.errorMessage = null;
        this.bindListeners({
            handleUpdateVaccines: VaccineActions.updateVaccines,
            handleFetchVaccines: VaccineActions.fetchVaccines,
            handleVaccinesFailed: VaccineActions.vaccinesFailed,
            handleAddVaccine: VaccineActions.addVaccine
        });
    }

    handleUpdateVaccines(vaccines: Array<Vaccine>): void {
        this.vaccines = vaccines;
    }
    handleAddVaccine(vaccine: Vaccine) {
        this.vaccines.push(vaccine);
    }
    handleFetchVaccines() {
        this.vaccines = [];
    }
    handleVaccinesFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
    }
}

export const Store = <VaccineStoreInterface>alt.createStore<State>(VaccineStore);