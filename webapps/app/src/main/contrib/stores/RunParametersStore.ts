import * as AltJS from "alt";
import {AbstractStore} from "../../shared/stores/AbstractStore";
import alt from "../../shared/alt";
import {ModelRunParameterSet} from "../../shared/models/Generated";
import {runParameterActions} from "../actions/RunParameterActions";
import {RunParametersSource} from "../sources/RunParametersSource";
import StoreModel = AltJS.StoreModel;
import {touchstoneActions} from "../actions/TouchstoneActions";
import {modellingGroupActions} from "../../shared/actions/ModellingGroupActions";

export interface RunParametersState {
    parameterSets: ModelRunParameterSet[];

    oneTimeToken: string;
    redirectPath: string;

    groupId: string;
    touchstoneId: string;
}

interface RunParametersStoreInterface extends AltJS.AltStore<RunParametersState> {
    fetchOneTimeParametersToken(redirectPath: string): Promise<string>;
    _fetchOneTimeParametersToken(): Promise<string>;
    fetchParameterSets(): Promise<ModelRunParameterSet[]>;
}

class RunParametersStore
    extends AbstractStore<RunParametersState, RunParametersStoreInterface>
    implements RunParametersState {

    parameterSets: ModelRunParameterSet[];
    oneTimeToken: string;
    redirectPath: string;
    groupId: string;
    touchstoneId: string;

    constructor() {
        super();
        this.registerAsync(new RunParametersSource());
        this.bindListeners({
            setGroup: modellingGroupActions.setCurrentGroup,
            setTouchstone: touchstoneActions.setCurrentTouchstone,

            clearAll: runParameterActions.beginFetchParameterSets,
            updateParameterSets: runParameterActions.updateParameterSets,

            updateParametersToken: runParameterActions.receiveToken,
            clearUsedParametersToken: runParameterActions.clearUsedToken
        });
        this.exportPublicMethods({
            fetchOneTimeParametersToken: (redirectPath: string) => {
                this.redirectPath = redirectPath;
                return this.getInstance()._fetchOneTimeParametersToken();
            },
        });
    }

    initialState(): RunParametersState {
        return {
            parameterSets: null,
            oneTimeToken: null,
            redirectPath: null,
            groupId: null,
            touchstoneId: null
        };
    }

    setGroup(groupId: string) {
        this.groupId = groupId;
    }

    setTouchstone(touchstoneId: string) {
        this.touchstoneId = touchstoneId;
    }

    clearAll(): void {
        this.parameterSets = [];
        this.oneTimeToken = null;
    }

    updateParameterSets(parameterSets: ModelRunParameterSet[]) {
        this.parameterSets = parameterSets;
    }

    updateParametersToken(token: string) {
        this.oneTimeToken = token;
    }

    clearUsedParametersToken() {
        this.oneTimeToken = null;
    }
}

export const runParametersStore = <RunParametersStoreInterface>alt.createStore<RunParametersState>(
    RunParametersStore as StoreModel<RunParametersState>

);