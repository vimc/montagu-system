import { FetchHelper } from "../../shared/fetch/helpers";
import { User } from "../../../main/shared/models/Generated";
import { mockUser } from "../../mocks/mockModels";
import { userStore } from "../../../main/admin/stores/UserStore";
import { doNothing } from "../../../main/shared/Helpers";
import { alt } from "../../../main/shared/alt";
import { mockResult } from "../../mocks/mockRemote";

describe("UserStore.fetchUsers", () => {
    const prepareForCachedFetch = () => alt.bootstrap(JSON.stringify({
        UserStore: {
            users: [mockUser()]
        }
    }));
    const makePayload = () => [mockUser(), mockUser()];

    const helper = new FetchHelper<User[], User[]>({
        makePayload,
        prepareForFetch: doNothing,
        prepareForCachedFetch,
        triggerFetch: () => userStore.fetchUsers(),
        expectedURL: "/users/"
    });
    helper.addTestsToMocha();

    it("if 'force' is true, fetches even if cache is ready", (done: DoneCallback) => {
        prepareForCachedFetch();
        const payload = makePayload();
        helper.testFetchWithMockedResponse({
            done,
            triggerFetch: () => userStore.fetchUsers(true),
            errorMessage: null,
            expectedAction: helper.defaultSuccessResult(payload),
            payload: mockResult(payload)
        })
    });
});