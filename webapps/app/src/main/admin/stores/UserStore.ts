import { AbstractStore } from "../../shared/stores/AbstractStore";
import { alt } from "../../shared/alt";
import { RoleAssignment, User } from "../../shared/models/Generated";
import { UserSource } from "../sources/UserSource";
import { userActions } from "../actions/UserActions";
import { RemoteContent } from "../../shared/models/RemoteContent";
import StoreModel = AltJS.StoreModel;
import { ILookup } from "../../shared/models/Lookup";

export interface UserStoreState extends RemoteContent {
    users: User[];
    currentUsername: string;
    usersLookup: ILookup<User>;
    rolesLookup: ILookup<RoleAssignment[]>;
    showCreateUser: boolean;
}

export interface UserStoreInterface extends AltJS.AltStore<UserStoreState> {
    fetchUsers(force?: boolean): Promise<User[]>;

    getCurrentUserDetails(): User;

    getCurrentUserRoles(): RoleAssignment[];

    removeRole(name: string, scopePrefix: string | null, scopeId: string | null): void

    addRole(name: string, scopePrefix: string | null, scopeId: string | null): void
}

class UserStore
    extends AbstractStore<UserStoreState, UserStoreInterface> {
    users: User[];
    ready: boolean;
    usersLookup: ILookup<User>;
    rolesLookup: ILookup<RoleAssignment[]>;
    currentUsername: string;
    showCreateUser: boolean;

    constructor() {
        super();
        this.bindListeners({
            handleBeginFetchUsers: userActions.beginFetchUsers,
            handleUpdateUsers: userActions.updateUsers,
            handleSetCurrentUser: userActions.setCurrentUser,
            handleSetShowCreateUser: userActions.setShowCreateUser,
            handleAddRole: userActions.addRole,
            handleRemoveRole: userActions.removeRole
        });
        this.registerAsync(new UserSource());
        this.exportPublicMethods({
            fetchUsers: (force?: boolean) => {
                if (force == true) {
                    this.users = [];
                    this.rolesLookup = {}
                }
                return (this.getInstance() as any)._fetchUsers();
            },
            getCurrentUserDetails: () => {
                if (this.currentUsername && this.usersLookup.hasOwnProperty(this.currentUsername)) {
                    return this.usersLookup[this.currentUsername]
                } else {
                    return null;
                }
            },
            getCurrentUserRoles: () => {
                if (this.currentUsername && this.rolesLookup.hasOwnProperty(this.currentUsername)) {
                    return this.rolesLookup[this.currentUsername]
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
            showCreateUser: false,
            rolesLookup: {}
        };
    }

    handleBeginFetchUsers() {
        this.ready = false;
        this.users = [];
        this.usersLookup = {};
        this.rolesLookup = {};
    }

    handleUpdateUsers(users: User[]) {
        this.ready = true;
        this.users = users;

        users.forEach(u => {
            this.usersLookup[u.username] = u;
            this.rolesLookup[u.username] = u.roles;
        });

    }

    handleSetCurrentUser(username: string) {
        this.currentUsername = username;
    }

    handleSetShowCreateUser(show: boolean) {
        this.showCreateUser = show;
    }

    handleAddRole (role: RoleAssignment) {
        const index = this.rolesLookup[this.currentUsername].indexOf(role);
        if (index == -1) {
            this.rolesLookup[this.currentUsername].push(role);
        }
    }

    handleRemoveRole (role: RoleAssignment) {
        this.rolesLookup[this.currentUsername] = this.rolesLookup[this.currentUsername]
            .filter(r => r.name == role.name && r.scope_id == role.scope_id && r.scope_prefix == role.scope_prefix);
    }
}

export const userStore = alt.createStore<UserStoreState>(UserStore as StoreModel<UserStoreState>) as UserStoreInterface;