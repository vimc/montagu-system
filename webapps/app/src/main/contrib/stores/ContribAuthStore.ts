import alt from "../../shared/alt";
import { LogInProperties } from "../../shared/actions/_AuthActions";
import { mainStore } from "./MainStore";
import { ModellingGroup } from "../../shared/models/Generated";
import { modellingGroupActions } from "../../shared/actions/ModellingGroupActions";
import { AuthStateBase, AuthStore, AuthStoreBaseInterface } from "../../shared/stores/AuthStoreBase";
import StoreModel = AltJS.StoreModel;

export interface ContribAuthState extends AuthStateBase {
    modellingGroupIds: string[];
    modellingGroups: ModellingGroup[];
}

export interface ContribAuthStoreInterface extends AuthStoreBaseInterface<ContribAuthState> { }

export function initialAuthState(): ContribAuthState {
    return Object.assign({}, AuthStore.baseInitialState(), {
        modellingGroupIds: [],
        modellingGroups: []
    });
}

class ContribAuthStore extends AuthStore<ContribAuthState, ContribAuthStoreInterface> {
    modellingGroups: ModellingGroup[];
    modellingGroupIds: string[];

    constructor() {
        super();
        this.bindListeners({
            handleModellingGroups: modellingGroupActions.updateGroups
        });
    }

    doLogIn(accessToken: string, triggeredByUser: boolean) {
        super.doLogIn(accessToken, triggeredByUser);
        if (this.loggedIn && triggeredByUser) {
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
        this.modellingGroups = this.modellingGroupIds
            .map(id => groups.find(g => g.id == id))
            .filter(x => !!x);  // Filters out 'falsey' values, like null
    }
}

export const contribAuthStore =
    alt.createStore<ContribAuthState>(ContribAuthStore as StoreModel<ContribAuthState>) as
        ContribAuthStoreInterface;
