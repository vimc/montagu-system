import { ILookup } from "../../shared/models/Lookup";
import { DemographicStatisticType } from "../../shared/models/Generated";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { touchstoneActions } from "../actions/TouchstoneActions";
import { demographicActions } from "../actions/DemographicActions";
import StoreModel = AltJS.StoreModel;
import { DemographicSource } from "../sources/DemographicSource";

export interface DemographicState {
    dataSets: ILookup<DemographicStatisticType[]>;
    currentTouchstone: string;
}

interface Interface extends AltJS.AltStore<DemographicState> {
    fetchDataSets(): Promise<DemographicStatisticType[]>;
}

class DemographicStore extends AbstractStore<DemographicState, Interface> {
    dataSets: ILookup<DemographicStatisticType[]>;
    currentTouchstone: string;

    constructor() {
        super();
        this.bindListeners({
            handleSetCurrentTouchstone: touchstoneActions.setCurrentTouchstone,
            handleBeginFetchDataSets: demographicActions.beginFetch,
            handleUpdateDataSets: demographicActions.update
        });
        this.registerAsync(new DemographicSource());
    }

    initialState(): DemographicState {
        return {
            dataSets: {},
            currentTouchstone: null
        };
    }

    handleSetCurrentTouchstone(touchstoneId: string) {
        this.currentTouchstone = touchstoneId;
    }
    handleBeginFetchDataSets() {
        delete this.dataSets[this.currentTouchstone];
    }
    handleUpdateDataSets(dataSets: DemographicStatisticType[]) {
        this.dataSets[this.currentTouchstone] = dataSets;
    }

}

export const demographicStore = alt.createStore<DemographicState>(DemographicStore as StoreModel<DemographicState>) as Interface;