import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { User } from "../../shared/models/Generated";
import { UserSource } from "../sources/UserSource";
import { userActions } from "../actions/UserActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import StoreModel = AltJS.StoreModel;

export interface UserStoreState extends RemoteContent {
    users: User[];
}

export interface UserStoreInterface extends AltJS.AltStore<UserStoreState> {
    fetchUsers(): Promise<User[]>;
}

class UserStore extends AbstractStore<UserStoreState, UserStoreInterface> {
    users: User[];
    ready: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchUsers: userActions.beginFetch,
            handleUpdateUsers: userActions.update
        });
        this.registerAsync(new UserSource());
    }

    initialState(): UserStoreState {
        return {
            users: [],
            ready: false
        };
    }

    handleBeginFetchUsers() {
        this.ready = false;
        this.users = [];
    }
    handleUpdateUsers(users: User[]) {
        this.ready = true;
        this.users = users;
    }
}

export const userStore = alt.createStore<UserStoreState>(UserStore as StoreModel<UserStoreState>) as UserStoreInterface;