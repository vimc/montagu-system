import { expect } from "chai";

import { Sandbox } from "../../../Sandbox";
import {createMockStore} from "../../../mocks/mockStore";
import {chooseGroupPageActionCreators} from "../../../../main/contrib/actions/pages/chooseGroupPageActionCreators";
import {ModellingGroupsService} from "../../../../main/shared/services/ModellingGroupsService";
import {ModellingGroupTypes} from "../../../../main/contrib/actionTypes/ModellingGroupsTypes";
import {BreadcrumbsTypes} from "../../../../main/shared/actionTypes/BreadrumbsTypes";
import {breadcrumbsModule} from "../../../../main/shared/modules/breadcrumbs";
import {mockBreadcrumbs} from "../../../mocks/mockModels";

describe("Choose Group Page actions tests", () => {
    const sandbox = new Sandbox();

    const testGroup1 = {id: "test1", description: "Test 1"};
    const testBreadcrumbs = mockBreadcrumbs();

    afterEach(() => {
        sandbox.restore();
    });

    it("on load", (done) => {
        const initialState = {
            auth: {modellingGroups: "test1"}
        };
        const store = createMockStore(initialState);

        sandbox.setStubFunc(ModellingGroupsService.prototype, "getAllGroups", ()=>{
            return Promise.resolve([testGroup1]);
        });
        sandbox.setStubFunc(breadcrumbsModule, "initialize", ()=>{
            return testBreadcrumbs;
        });

        store.dispatch(chooseGroupPageActionCreators.onLoad())
        setTimeout(() => {
            const actions = store.getActions()
            const expectedPayload = [
                { type: ModellingGroupTypes.USER_GROUPS_FETCHED, data: [testGroup1] },
                { type: BreadcrumbsTypes.BREADCRUMBS_RECEIVED, data: testBreadcrumbs }
            ]
            expect(actions).to.eql(expectedPayload);
            done();
        });
    });



});