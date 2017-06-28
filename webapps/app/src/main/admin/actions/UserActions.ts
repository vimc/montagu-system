import { alt } from "../../shared/alt";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { User } from "../../shared/models/Generated";

interface Actions extends FetchActionsInterface<User[]> {
    setCurrentUser(username: string): string;
    beginFetchDetails(username: string): string;
    updateUserDetails(details: User): User;

}

class UserActions extends FetchActions<User[]> implements Actions {

    setCurrentUser(username: string): string {
        return username;
    }

    beginFetchDetails(username: string): string {
        return username;
    }

    updateUserDetails(details: User) {
        return details;
    }

}

export const userActions =
    alt.createActions<Actions>(UserActions);
