import { Sandbox } from "../../Sandbox";
import { expect } from "chai";
import { demographicStore } from "../../../main/contrib/stores/DemographicStore";
import { touchstoneActions } from "../../../main/contrib/actions/TouchstoneActions";
import { demographicActions } from "../../../main/contrib/actions/DemographicActions";
import { mockDemographicStatisticType } from "../../mocks/mockModels";

// Each test builds on the one above it
describe("DemographicStore", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("records current touchstone", () => {
        touchstoneActions.setCurrentTouchstone("fish");
        expect(demographicStore.getState().currentTouchstone).to.equal("fish");
    });

    it("stores data sets against current touchstone when fetch finishes", () => {
        const sets = [mockDemographicStatisticType()];
        touchstoneActions.setCurrentTouchstone("fish");
        demographicActions.update(sets);
        expect(demographicStore.getState().dataSets["fish"]).to.eql(sets);
    });

    it("clears data sets for current touchstone when fetch begins", () => {
        touchstoneActions.setCurrentTouchstone("fish");
        demographicActions.update([mockDemographicStatisticType()]);
        demographicActions.beginFetch();
        expect("fish" in demographicStore.getState().dataSets).to.equal(false, "Expected data sets to have been removed");
    });

    it("sets selected data set to object, when given the ID", () => {
        const set = mockDemographicStatisticType();
        touchstoneActions.setCurrentTouchstone("fish");
        demographicActions.update([
            mockDemographicStatisticType(),
            mockDemographicStatisticType(),
            set
        ]);
        demographicActions.selectDataSet(set.id);
        expect(demographicStore.getState().selectedDataSet).to.eql(set);
    });

    it("sets selected data set to null, when no data exists for current touchstone", () => {
        const set = mockDemographicStatisticType();
        touchstoneActions.setCurrentTouchstone("fish");
        demographicActions.selectDataSet(set.id);
        expect(demographicStore.getState().selectedDataSet).to.eql(null);
    });

    it("sets selected data set to null, when set does not exist in current touchstone", () => {
        const setA = mockDemographicStatisticType();
        const setB = mockDemographicStatisticType();
        touchstoneActions.setCurrentTouchstone("fish");
        demographicActions.update([setA]);
        demographicActions.selectDataSet(setB.id);
        expect(demographicStore.getState().selectedDataSet).to.eql(null);
    });

    it("records selected gender", () => {
        demographicActions.selectGender("gender");
        expect(demographicStore.getState().selectedGender).to.equal("gender");
    });
});