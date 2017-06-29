import { FetchHelper } from "../../shared/fetch/helpers";
import { User } from "../../../main/shared/models/Generated";
import { mockUser } from "../../mocks/mockModels";
import { userStore } from "../../../main/admin/stores/UserStore";
import { doNothing } from "../../../main/shared/Helpers";
import { alt } from "../../../main/shared/alt";

describe("UserStore.fetchUsers", () => {
    new FetchHelper<User[]>({
        makePayload: () => [ mockUser(), mockUser() ],
        prepareForFetch: doNothing,
        prepareForCachedFetch: () => {
            alt.bootstrap(JSON.stringify({
                UserStore: {
                    users: [ mockUser() ]
                }
            }))
        },
        triggerFetch: () => userStore.fetchUsers(),
        expectedURL: "/users/"
    }).addTestsToMocha();
});