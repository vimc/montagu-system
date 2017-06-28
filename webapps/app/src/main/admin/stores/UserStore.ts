import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { User } from "../../shared/models/Generated";
import { UserSource } from "../sources/UserSource";
import { userActions } from "../actions/UserActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import { ILookup } from "../../shared/models/Lookup";

export interface UserStoreState extends RemoteContent {
    users: User[];
    currentUsername: string;
    userDetails: ILookup<User>;
}

export interface UserStoreInterface extends AltJS.AltStore<UserStoreState> {
    fetchUsers(): Promise<User[]>;
    getCurrentUserDetails(): User;
    fetchUserDetails(): Promise<User>;
}

class UserStore
    extends AbstractStore<UserStoreState, UserStoreInterface> {
    users: User[];
    ready: boolean;
    userDetails: ILookup<User>;
    currentUsername: string;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchUsers: userActions.beginFetch,
            handleUpdateUsers: userActions.update,
            handleSetCurrentUser: userActions.setCurrentUser,
            handleUpdateUserDetails: userActions.updateUserDetails,

        });
        this.registerAsync(new UserSource());
        this.exportPublicMethods({
            getCurrentUserDetails: () => {
                if (this.currentUsername && this.userDetails.hasOwnProperty(this.currentUsername)) {
                    return this.userDetails[this.currentUsername]
                } else {
                    return null;
                }
            }
        })
    }

    initialState(): UserStoreState {
        return {
            userDetails: {},
            currentUsername: null,
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

    handleUpdateUserDetails(user: User) {
        this.ready = true;
        this.userDetails[user.username] = user;
    }

    handleSetCurrentUser(username: string) {
        this.currentUsername = username;
    }
}

export const userStore = alt.createStore<UserStoreState>(UserStore) as UserStoreInterface;