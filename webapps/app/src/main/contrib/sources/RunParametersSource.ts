import SourceModel = AltJS.SourceModel;
import {runParameterActions} from "../actions/RunParameterActions";
import {Source, processResponse } from "../../shared/sources/Source";
import {ModelRunParameterSet} from "../../shared/models/Generated";
import {RunParametersState} from "../stores/RunParametersStore";
import fetcher from "../../shared/sources/Fetcher";

export class RunParametersSource extends Source<RunParametersState> {
    _fetchParameterSets: () => SourceModel<ModelRunParameterSet[]>;

    constructor() {
        super();
        this._fetchParameterSets = () => this.doFetch(
            s => `/modelling-groups/${s.groupId}/model-run-parameters/${s.touchstoneId}/`,
            {
                success: runParameterActions.updateParameterSets,
                loading: runParameterActions.beginFetchParameterSets,
                isCached: s => s.parameterSets != null
            }
        );
    }
}

export function fetchToken(groupId: string, touchstoneId: string, setId: number) :Promise<string> {
    return fetcher.fetcher
        .fetch(`/modelling-groups/${groupId}/model-run-parameters/${touchstoneId}/${setId}/get_onetime_link/`)
        .then((response :Response) => {
            return processResponse(response);
        })
        .then((token :string) => {
            return token;
        });
}