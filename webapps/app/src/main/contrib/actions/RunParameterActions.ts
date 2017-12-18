import {alt} from "../../shared/alt";
import {ModelRunParameterSet} from "../../shared/models/Generated";
import {AbstractActions} from "../../shared/actions/AbstractActions";

interface Actions {
    receiveToken(token: string): string;
    beginFetchToken(): boolean;
    clearUsedToken(): boolean;

    beginFetchParameterSets(): boolean;
    updateParameterSets(parameterSets: ModelRunParameterSet[]): ModelRunParameterSet[];
}

class RunParameterActions extends AbstractActions implements Actions {
    receiveToken(token: string): string {
        return token;
    }
    beginFetchToken(): boolean {
        return true;
    }
    clearUsedToken(): boolean {
        return true;
    }

    beginFetchParameterSets(): boolean {
        return true;
    }
    updateParameterSets(parameterSets: ModelRunParameterSet[]): ModelRunParameterSet[] {
        return parameterSets
    }
}

export const runParameterActions = alt.createActions<Actions>(RunParameterActions);