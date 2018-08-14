import {expect} from "chai";

import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";
import {mockTouchstoneVersion} from "../../../mocks/mockModels";
import {responsibilityOverviewPageActionCreators} from "../../../../main/contrib/actions/pages/responsibilityOverviewPageActionCreators";
import {responsibilitiesActionCreators} from "../../../../main/contrib/actions/responsibilitiesActionCreators";
import {diseasesActionCreators} from "../../../../main/contrib/actions/diseasesActionCreators";
import {chooseActionPageActionCreators} from "../../../../main/contrib/actions/pages/chooseActionPageActionCreators";
import {mockContribState} from "../../../mocks/mockStates";
import {contribTouchstonesActionCreators} from "../../../../main/contrib/actions/contribTouchstonesActionCreators";

describe("Responsibility Overview Page actions tests", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    const state = mockContribState({
        touchstones: {
            currentTouchstoneVersion: mockTouchstoneVersion({id: "t2v2", description: "desc"})
        }
    });

    it("has choose action page as parent", () => {
        expect(responsibilityOverviewPageActionCreators.parent).to.eq(chooseActionPageActionCreators)
    });

    it("creates breadcrumb", () => {

        const result = responsibilityOverviewPageActionCreators.createBreadcrumb(state);
        expect(result.urlFragment).to.eq("responsibilities/t2v2/");
        expect(result.name).to.eq("desc");
    });

    it("loads diseases, sets current touchstone and gets responsibility set", async () => {
        const store = createMockContribStore(state);

        sandbox.stubReduxActionCreator(diseasesActionCreators, "getAllDiseases", {type: "disease-test"});
        sandbox.stubReduxActionCreator(responsibilitiesActionCreators, "getResponsibilitySet", {type: "RS-test"});
        sandbox.stubReduxActionCreator(contribTouchstonesActionCreators, "setCurrentTouchstoneVersion", {type: "TV-test"});

        await store.dispatch(responsibilityOverviewPageActionCreators
            .loadData({groupId: "g1", touchstoneId: "t1v1"}));

        const actions = store.getActions();

        const expectedPayload = [
            {type: "disease-test", props: undefined as any},
            {type: "TV-test", props: "t1v1"},
            {type: "RS-test", props: undefined},
        ];
        expect(actions).to.deep.eq(expectedPayload);

    });


});