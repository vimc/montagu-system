import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { User } from "../../shared/models/Generated";
import { UserSource } from "../sources/UserSource";
import { userActions } from "../actions/UserActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import StoreModel = AltJS.StoreModel;
import { ILookup } from "../../shared/models/Lookup";

export interface UserStoreState extends RemoteContent {
    users: User[];
    currentUsername: string;
    usersLookup: ILookup<User>;
    showCreateUser: boolean;
}

export interface UserStoreInterface extends AltJS.AltStore<UserStoreState> {
    fetchUsers(force?: boolean): Promise<User[]>;
    getCurrentUserDetails(): User;
}

class UserStore
    extends AbstractStore<UserStoreState, UserStoreInterface> {
    users: User[];
    ready: boolean;
    usersLookup: ILookup<User>;
    currentUsername: string;
    showCreateUser: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchUsers: userActions.beginFetchUsers,
            handleUpdateUsers: userActions.updateUsers,
            handleSetCurrentUser: userActions.setCurrentUser,
            handleSetShowCreateUser: userActions.setShowCreateUser,
        });
        this.registerAsync(new UserSource());
        this.exportPublicMethods({
            fetchUsers: (force?: boolean) => {
                if (force == true) {
                    this.users = [];
                }
                return (this.getInstance() as any)._fetchUsers();
            },
            getCurrentUserDetails: () => {
                if (this.currentUsername && this.usersLookup.hasOwnProperty(this.currentUsername)) {
                    return this.usersLookup[this.currentUsername]
                } else {
                    return null;
                }
            }
        })
    }

    initialState(): UserStoreState {
        return {
            usersLookup: {},
            currentUsername: null,
            users: [],
            ready: false,
            showCreateUser: false
        };
    }

    handleBeginFetchUsers() {
        this.ready = false;
        this.users = [];
        this.usersLookup = {};
    }

    handleUpdateUsers(users: User[]) {
        this.ready = true;
        this.users = users;

        users.forEach(u => {
            this.usersLookup[u.username] = u;
        });
    }

    handleSetCurrentUser(username: string) {
        this.currentUsername = username;
    }

    handleSetShowCreateUser(show: boolean) {
        this.showCreateUser = show;
    }
}

export const userStore = alt.createStore<UserStoreState>(UserStore as StoreModel<UserStoreState>) as UserStoreInterface;