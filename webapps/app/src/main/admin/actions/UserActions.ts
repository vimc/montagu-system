import { alt } from "../../shared/alt";
import { FetchActions } from "../../shared/actions/FetchActions";
import { RoleAssignment, User } from "../../shared/models/Generated";

interface Actions {
    setCurrentUser(username: string): string;
    beginFetchUsers() : boolean;
    updateUsers(users: User[]) : User[]
    setShowCreateUser(show: boolean): boolean;
    removeRole(name: string, scopePrefix: string | null, scopeId: string | null): RoleAssignment
    addRole(name: string, scopePrefix: string | null, scopeId: string | null): RoleAssignment
}

class UserActions extends FetchActions<User[]> implements Actions {

    setCurrentUser(username: string): string {
        return username;
    }

    updateUsers(data: User[]) {
        return data;
    }

    beginFetchUsers(): boolean {
        return true;
    }

    setShowCreateUser(show: boolean) {
        return show;
    }

    addRole(name: string, scope_prefix: string | null, scope_id: string | null){
        return {name, scope_id, scope_prefix}
    }

    removeRole(name: string, scope_prefix: string | null, scope_id: string | null){
        return {name, scope_id, scope_prefix}
    }
}

export const userActions =
    alt.createActions<Actions>(UserActions);
