import alt from '../alt'
import AbstractActions from './AbstractActions'
import VaccineSource from '../sources/VaccineSource'
import { Vaccine } from '../stores/VaccineStore'

interface Actions {
    updateVaccines(vaccines: Array<Vaccine>): Array<Vaccine>;
    addVaccine(vaccine: Vaccine): Vaccine;
    fetchVaccines(): (dispatch: any) => any;
    vaccinesFailed(errorMessage: string): string;
}

class VaccineActions extends AbstractActions implements Actions {
    updateVaccines(vaccines: Array<Vaccine>): Array<Vaccine> {
        return vaccines;
    }
    addVaccine(vaccine: Vaccine): Vaccine {
    	return vaccine;
    }
    fetchVaccines(): (dispatch: any) => any {
    	return (dispatch: any) => {
		    dispatch();
		    VaccineSource.fetch()
		      .then((response: Response) => {
		        return response.json();
		      })
		      .then((vaccines: any) => {
				this.updateVaccines(<Array<Vaccine>> vaccines);
		      })
		      .catch((errorMessage: string) => {
		        this.vaccinesFailed(errorMessage);
		      });
	    };
    }
    vaccinesFailed(errorMessage: string): string {
    	return errorMessage;
    }
}

const vaccineActions = alt.createActions<Actions>(VaccineActions);

export default vaccineActions;