import { alt } from "../../shared/alt";
import { FetchActions, FetchActionsInterface } from "../../shared/actions/FetchActions";
import { User } from "../../shared/models/Generated";

export const userActions = alt.createActions<FetchActionsInterface<User[]>>(
    class extends FetchActions<User[]> {}
);
