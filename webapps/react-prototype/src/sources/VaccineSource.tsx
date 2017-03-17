import { Vaccine } from '../stores/VaccineStore'

export interface VaccineSourceInterface {
	fetch(): Promise<Response>;
}

const VaccineSource: VaccineSourceInterface = {
	fetch(): Promise<Response> {
		return fetch('/vaccines.json')
	}
}

export default VaccineSource;