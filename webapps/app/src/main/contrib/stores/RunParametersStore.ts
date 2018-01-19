import * as AltJS from "alt";
import {AbstractStore} from "../../shared/stores/AbstractStore";
import alt from "../../shared/alt";
import {ModelRunParameterSet} from "../../shared/models/Generated";
import {runParameterActions} from "../actions/RunParameterActions";
import {RunParametersSource} from "../sources/RunParametersSource";
import {touchstoneActions} from "../actions/TouchstoneActions";
import {modellingGroupActions} from "../../shared/actions/ModellingGroupActions";
import StoreModel = AltJS.StoreModel;

export interface RunParametersState {
    parameterSets: ModelRunParameterSet[];

    oneTimeTokens: TokensMap;

    groupId: string;
    touchstoneId: string;
}

export interface TokensMap {
    [setId: number]: string;
}

export interface TokenProps {
    setId: number;
    token: string;
}

export interface RunParametersStoreInterface extends AltJS.AltStore<RunParametersState> {
    fetchParameterSets(force?: boolean): Promise<ModelRunParameterSet[]>;
    _fetchParameterSets(): Promise<ModelRunParameterSet[]>;
}

class RunParametersStore
    extends AbstractStore<RunParametersState, RunParametersStoreInterface>
    implements RunParametersState {

    parameterSets: ModelRunParameterSet[];
    oneTimeTokens: TokensMap;
    groupId: string;
    touchstoneId: string;

    constructor() {
        super();
        this.registerAsync(new RunParametersSource());
        this.bindListeners({
            setGroup: modellingGroupActions.setCurrentGroup,
            setTouchstone: touchstoneActions.setCurrentTouchstone,

            clearParameterSets: runParameterActions.beginFetchParameterSets,
            updateParameterSets: runParameterActions.updateParameterSets,

            updateParametersToken: runParameterActions.receiveToken,
            clearParametersToken: runParameterActions.clearToken,

        });
        this.exportPublicMethods({
            fetchParameterSets: (force?: boolean) => {
                if (force)
                    this.clearParameterSets();
                return this.getInstance()._fetchParameterSets();
            }
        });
    }

    initialState(): RunParametersState {
        return {
            parameterSets: null,
            oneTimeTokens: {},
            groupId: null,
            touchstoneId: null
        };
    }

    setGroup(groupId: string) {
        this.groupId = groupId;
        this.clearAll();
    }

    setTouchstone(touchstoneId: string) {
        this.touchstoneId = touchstoneId;
        this.clearAll();
    }

    clearParameterSets() {
        this.parameterSets = null;
    }

    updateParameterSets(parameterSets: ModelRunParameterSet[]) {
        this.parameterSets = parameterSets;
    }

    updateParametersToken(data: TokenProps) {
        this.oneTimeTokens[data.setId] = data.token;
    }

    clearParametersToken(setId: number) {
        this.oneTimeTokens[setId] = null;
    }

    clearAll(): void {
        this.parameterSets = null;
        this.oneTimeTokens = {};
    }
}

export const runParametersStore = <RunParametersStoreInterface>alt.createStore<RunParametersState>(
    RunParametersStore as StoreModel<RunParametersState>
);