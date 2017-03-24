import alt from "../alt";
import * as AltJS from 'alt'
import VaccineActions from '../actions/VaccineActions'
import AbstractStore from "./AbstractStore";

export interface Vaccine {
    id: string;
    name: string;
}
export interface VaccineProperties {
    id?: string;
    name?: string;
}

export interface State {
    vaccines: Array<Vaccine>;
    errorMessage: string;
    newVaccine: Vaccine;
}

interface VaccineStoreInterface extends AltJS.AltStore<State> {
}

class VaccineStore extends AbstractStore<State> {
    vaccines: Array<Vaccine>;
    errorMessage: string;
    newVaccine: Vaccine;

    constructor() {
        super();
        this.vaccines = [];
        this.errorMessage = null;
        this.newVaccine = { id: "", name: "" };
        this.bindListeners({
            handleUpdateVaccines: VaccineActions.updateVaccines,
            handleFetchVaccines: VaccineActions.fetchVaccines,
            handleVaccinesFailed: VaccineActions.vaccinesFailed,
            handleModifyNewVaccine: VaccineActions.modifyNewVaccine,
            handleAddNewVaccine: VaccineActions.addNewVaccine
        });
    }

    handleUpdateVaccines(vaccines: Array<Vaccine>): void {
        this.vaccines = vaccines;
    }
    handleModifyNewVaccine(vaccine: VaccineProperties) {
        Object.assign(this.newVaccine, vaccine);
    }
    handleAddNewVaccine() {
        this.vaccines.push(this.newVaccine);
        this.newVaccine = { id: "", name: "" };
    }
    handleFetchVaccines() {
        this.vaccines = [];
    }
    handleVaccinesFailed(errorMessage: string) {
        this.errorMessage = errorMessage;
    }
}

export const Store = <VaccineStoreInterface>alt.createStore<State>(VaccineStore);