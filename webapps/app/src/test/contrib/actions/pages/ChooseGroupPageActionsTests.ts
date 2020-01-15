import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {chooseGroupPageActionCreators} from "../../../../main/contrib/actions/pages/chooseGroupPageActionCreators";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {mockModellingGroup} from "../../../mocks/mockModels";
import {verifyActionThatCallsService} from "../../../ActionCreatorTestHelpers";

describe("Choose Group Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup = mockModellingGroup();

    afterEach(() => {
        sandbox.restore();
    });

    test("gets all groups on load", (done: DoneCallback) => {
        const initialState = {
            auth: {modellingGroups: [testGroup.id]}
        };
        const store = createMockContribStore(initialState);
        const fakeData = [mockModellingGroup({id: testGroup.id})];
        verifyActionThatCallsService(done, {
            store: store,
            mockServices: () => {
                sandbox.stubService(ModellingGroupsService.prototype, "getUserGroups", fakeData)
            },
            callActionCreator: () => chooseGroupPageActionCreators.loadData(),
            expectTheseActions: [{type: ModellingGroupTypes.USER_GROUPS_FETCHED, data: fakeData}]
        })
    });

    test("creates breadcrumbs", () => {

        const result = chooseGroupPageActionCreators.createBreadcrumb();

        expect(result.urlFragment).to.eq("/");
        expect(result.name).to.eq("Modellers' contribution portal");
    });

    test("has no parent", () => {
        expect(chooseGroupPageActionCreators.parent).to.be.undefined;
    });

    test("creates title", () => {
        expect(chooseGroupPageActionCreators.title()).to.eq("Modellers' contribution portal");
    });

});