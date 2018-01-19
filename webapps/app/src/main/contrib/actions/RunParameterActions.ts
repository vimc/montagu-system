import {alt} from "../../shared/alt";
import {ModelRunParameterSet} from "../../shared/models/Generated";
import {AbstractActions} from "../../shared/actions/AbstractActions";
import {fetchToken} from "../sources/RunParametersSource";
import {TokenProps} from "../stores/RunParametersStore";

interface Actions {
    receiveToken(id: number, token: string): TokenProps;
    beginFetchToken(): boolean;
    clearToken(): boolean;

    beginFetchParameterSets(): boolean;
    updateParameterSets(parameterSets: ModelRunParameterSet[]): ModelRunParameterSet[];

    fetchToken(groupId: string, touchstoneId: string, setId: number): void;
}

class RunParameterActions extends AbstractActions implements Actions {
    receiveToken(id: number, token: string): TokenProps {
        return {id, token};
    }
    beginFetchToken(): boolean {
        return true;
    }
    clearToken(): boolean {
        return true;
    }

    beginFetchParameterSets(): boolean {
        return true;
    }
    updateParameterSets(parameterSets: ModelRunParameterSet[]): ModelRunParameterSet[] {
        return parameterSets
    }
    fetchToken(groupId: string, touchstoneId: string, setId: number) {
        return (dispatch: any) => {
            dispatch();
            fetchToken(groupId, touchstoneId, setId) .then((token: string) => {
                this.receiveToken(setId, token);
            })
        }
    }
}

export const runParameterActions = alt.createActions<Actions>(RunParameterActions);