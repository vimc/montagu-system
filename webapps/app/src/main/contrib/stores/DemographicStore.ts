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
    selectedDataSet: DemographicStatisticType;
    selectedGender: string;
}

interface Interface extends AltJS.AltStore<DemographicState> {
    fetchDataSets(): Promise<DemographicStatisticType[]>;
}

class DemographicStore extends AbstractStore<DemographicState, Interface> {
    dataSets: ILookup<DemographicStatisticType[]>;
    currentTouchstone: string;
    selectedDataSet: DemographicStatisticType;
    selectedGender: string;

    constructor() {
        super();
        this.bindListeners({
            handleSetCurrentTouchstone: touchstoneActions.setCurrentTouchstone,
            handleBeginFetchDataSets: demographicActions.beginFetch,
            handleUpdateDataSets: demographicActions.update,
            handleSelectDataSet: demographicActions.selectDataSet,
            handleSelectGender: demographicActions.selectGender
        });
        this.registerAsync(new DemographicSource());
    }

    initialState(): DemographicState {
        return {
            dataSets: {},
            currentTouchstone: null,
            selectedDataSet: null,
            selectedGender: "both"
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
    handleSelectDataSet(dataSetId: string) {
        const list = this.dataSets[this.currentTouchstone];
        if (list != null) {
            // find returns undefined if the item isn't present, so we use `|| null` to make we either have the item
            // or null, rather than a ternary system of item, null, or undefined.
            this.selectedDataSet = list.find(x => x.id == dataSetId) || null;
        } else {
            this.selectedDataSet = null;
        }
    }
    handleSelectGender(gender: string) {
        this.selectedGender = gender;
    }
}

export const demographicStore = alt.createStore<DemographicState>(DemographicStore as StoreModel<DemographicState>) as Interface;