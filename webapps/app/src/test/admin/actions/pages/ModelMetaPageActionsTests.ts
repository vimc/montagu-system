import {Sandbox} from "../../../Sandbox";
import {mockModel} from "../../../mocks/mockModels";
import {mockAdminState} from "../../../mocks/mockStates";
import {createMockAdminStore} from "../../../mocks/mockStore";

import {modelMetaPageActionCreators} from "../../../../main/admin/actions/pages/ModelMetaPageActionCreators";
import {modellingGroupsListPageActionCreators} from "../../../../main/admin/actions/pages/ModellingGroupsListPageActionCreators";
import {modellingGroupsActionCreators} from "../../../../main/admin/actions/modellingGroupsActionCreators";

describe("modelMetaPageActionCreators", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const model = mockModel({id: "mA"});
    const model2 = mockModel({id: "mB"});

    const state = mockAdminState({groups: {models: [model, model2]}});

    it("fetches models on load", async () => {

        sandbox.setStubReduxAction(modellingGroupsActionCreators, "getAllModelsAndExpectations");
        const store = createMockAdminStore(state);
        await store.dispatch(modelMetaPageActionCreators.loadData());
        expect(store.getActions()).toEqual([
            {type: 'test'}
        ]);
    });

    it("creates breadcrumbs", () => {

        const result = modelMetaPageActionCreators.createBreadcrumb(state);

        expect(result.urlFragment).toEqual("models/");
        expect(result.name).toEqual("Model Metadata");
    });

    it("has ModellingGroupsListPage as parent", () => {
        expect(modelMetaPageActionCreators.parent).toEqual(modellingGroupsListPageActionCreators)
    });

    it("has title", () => {
        expect(modelMetaPageActionCreators.title()).toEqual("Model Metadata")
    });
});