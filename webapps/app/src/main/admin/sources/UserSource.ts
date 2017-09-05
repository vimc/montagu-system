import { Source } from "../../shared/sources/Source";
import { UserStoreState } from "../stores/UserStore";
import SourceModel = AltJS.SourceModel;
import { User } from "../../shared/models/Generated";
import { userActions } from "../actions/UserActions";

export class UserSource extends Source<UserStoreState> {
    _fetchUsers: () => SourceModel<User[]>;

    constructor() {
        super();
        this._fetchUsers = () => this.doFetch(() => "/users/", {
            loading: userActions.beginFetchUsers,
            success: userActions.updateUsers,
            isCached: s => s.users && s.users.length > 0
        });
    }
}
