import { FetchHelper } from "../../shared/fetch/helpers";
import { User } from "../../../main/shared/models/Generated";
import { mockUser } from "../../mocks/mockModels";
import { userStore } from "../../../main/admin/stores/UserStore";

describe("UserStore.fetchUsers", () => {
    new FetchHelper<User[]>({
        makePayload: () => [ mockUser(), mockUser() ],
        triggerFetch: () => userStore.fetchUsers(),
        expectedURL: "/users/"
    }).addTestsToMocha();
});