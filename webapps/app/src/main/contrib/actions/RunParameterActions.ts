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

class ModelParameterActions extends AbstractActions implements Actions {
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

export const modelParameterActions = alt.createActions<Actions>(ModelParameterActions);