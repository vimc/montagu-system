import {alt} from "../../shared/alt";
import {ModelRunParameterSet} from "../../shared/models/Generated";
import {AbstractActions} from "../../shared/actions/AbstractActions";
import {fetchToken} from "../sources/RunParametersSource";
import {TokenProps} from "../stores/RunParametersStore";

interface Actions {
    receiveToken(setId: number, token: string): TokenProps;
    beginFetchToken(): boolean;
    clearToken(setId: number): number;

    beginFetchParameterSets(): boolean;
    updateParameterSets(parameterSets: ModelRunParameterSet[]): ModelRunParameterSet[];

    fetchToken(groupId: string, touchstoneId: string, setId: number): void;
}

class RunParameterActions extends AbstractActions implements Actions {
    receiveToken(setId: number, token: string): TokenProps {
        return {setId, token};
    }
    beginFetchToken(): boolean {
        return true;
    }
    clearToken(setId: number): number {
        return setId;
    }

    beginFetchParameterSets(): boolean {
        return true;
    }
    updateParameterSets(parameterSets: ModelRunParameterSet[]): ModelRunParameterSet[] {
        return parameterSets
    }
    fetchToken(groupId: string, touchstoneId: string, setId: number) {
        return fetchToken(groupId, touchstoneId, setId) .then((token: string) => {
            return this.receiveToken(setId, token);
        })
    }
}

export const runParameterActions = alt.createActions<Actions>(RunParameterActions);