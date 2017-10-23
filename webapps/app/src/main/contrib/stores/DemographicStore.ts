import { ILookup } from "../../shared/models/Lookup";
import { DemographicDataset } from "../../shared/models/Generated";
import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { touchstoneActions } from "../actions/TouchstoneActions";
import { demographicActions } from "../actions/DemographicActions";
import StoreModel = AltJS.StoreModel;
import { DemographicSource } from "../sources/DemographicSource";

export interface DemographicState {
    dataSets: ILookup<DemographicDataset[]>;
    currentTouchstone: string;
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    token: string
}

export interface DemographicStoreInterface extends AltJS.AltStore<DemographicState> {
    fetchDataSets(): Promise<DemographicDataset[]>;
    fetchOneTimeToken(): Promise<string>;
}

class DemographicStore extends AbstractStore<DemographicState, DemographicStoreInterface> {
    dataSets: ILookup<DemographicDataset[]>;
    currentTouchstone: string;
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    token: string;

    constructor() {
        super();
        this.bindListeners({
            handleSetCurrentTouchstone: touchstoneActions.setCurrentTouchstone,

            handleBeginFetchDataSets: demographicActions.beginFetch,
            handleUpdateDataSets: demographicActions.update,

            handleSelectDataSet: demographicActions.selectDataSet,
            handleSelectGender: demographicActions.selectGender,
            handleSelectFormat: demographicActions.selectFormat,

            handleBeginFetchToken: demographicActions.beginFetchToken,
            handleUpdateToken: demographicActions.updateToken,
            handleClearUsedToken: demographicActions.clearUsedToken,
        });
        this.registerAsync(new DemographicSource());
        this.exportPublicMethods({
            fetchOneTimeToken: () => {
                if (this.selectedDataSet != null && this.selectedDataSet.source) {
                    return (this.getInstance() as any)._fetchOneTimeToken();
                } else {
                    return Promise.reject("Cannot fetch token without selecting all options first");
                }
            }
        });
    }

    initialState(): DemographicState {
        return {
            dataSets: {},
            currentTouchstone: null,
            selectedDataSet: null,
            selectedGender: "both",
            selectedFormat: "long",
            token: null,
        };
    }

    handleSetCurrentTouchstone(touchstoneId: string) {
        this.currentTouchstone = touchstoneId;
    }
    handleBeginFetchDataSets() {
        delete this.dataSets[this.currentTouchstone];
    }
    handleUpdateDataSets(dataSets: DemographicDataset[]) {
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

        this.token = null;
    }
    handleSelectGender(gender: string) {
        this.selectedGender = gender;
    }
    handleSelectFormat(format: string) {
        this.selectedFormat = format;
    }
    handleUpdateToken(token: string) {
        this.token = token;
    }
    handleBeginFetchToken() {
        this.token = null;
    }
    handleClearUsedToken() {
        this.token = null;
    }
}

export const demographicStore = alt.createStore<DemographicState>(
    DemographicStore as StoreModel<DemographicState>
) as DemographicStoreInterface;