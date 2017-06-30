import { Source } from "../../shared/sources/Source";
import { UserStoreState } from "../stores/UserStore";
import SourceModel = AltJS.SourceModel;
import { User } from "../../shared/models/Generated";
import { userActions } from "../actions/UserActions";

export class UserSource extends Source<UserStoreState> {
    fetchUsers: () => SourceModel<User[]>;
    fetchUserDetails: () => SourceModel<User>;

    constructor() {
        super();
        this.fetchUsers = () => this.doFetch(() => "/users/", {
            loading: userActions.beginFetchUsers,
            success: userActions.updateUsers
        });
    }
}
