import alt from "../../shared/alt";
import { LogInProperties } from "../../shared/actions/AuthActions";
import { mainStore } from "./MainStore";
import { ModellingGroup } from "../models/Generated";
import { modellingGroupActions } from "../actions/ModellingGroupActions";
import { AuthStateBase, AuthStore, AuthStoreBaseInterface } from "../../shared/stores/AuthStoreBase";

export interface ContribAuthState extends AuthStateBase {
    modellingGroupIds: string[];
    modellingGroups: ModellingGroup[];
}

export interface ContribAuthStoreInterface extends AuthStoreBaseInterface<ContribAuthState> { }

export function initialAuthState(): ContribAuthState {
    return {
        loggedIn: false,
        username: null,
        bearerToken: null,
        permissions: [],
        modellingGroupIds: [],
        modellingGroups: []
    };
}

class ContribAuthStore extends AuthStore<ContribAuthState, ContribAuthStoreInterface> {
    modellingGroups: ModellingGroup[];
    modellingGroupIds: string[];

    constructor() {
        super();
        this.bindListeners({
            handleModellingGroups: modellingGroupActions.update
        });
    }

    doLogIn(accessToken: string) {
        super.doLogIn(accessToken);
        if (this.loggedIn) {
            mainStore.load();
        }
    }

    canLogIn(props: LogInProperties) {
        return super.canLogIn(props) && props.isModeller;
    }

    initialState(): ContribAuthState {
        return initialAuthState();
    }

    saveLoginProps(props: LogInProperties) {
        super.saveLoginProps(props);
        this.modellingGroupIds = props.modellingGroups;
    }

    handleModellingGroups(groups: ModellingGroup[]) {
        this.modellingGroups = this.modellingGroupIds.map(id => groups.find(g => g.id == id));
    }
}

export const contribAuthStore = alt.createStore<ContribAuthState>(ContribAuthStore) as ContribAuthStoreInterface;
