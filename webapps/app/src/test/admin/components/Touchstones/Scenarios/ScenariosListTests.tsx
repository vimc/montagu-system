import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockDisease, mockScenario, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {shallow} from "enzyme";
import {
    ScenariosList,
    ScenariosListComponent,
    ScenariosListProps
} from "../../../../../main/admin/components/Touchstones/Scenarios/ScenariosList";
import * as React from "react";
import {expect} from "chai";
import {ScenarioGroup} from "../../../../../main/admin/components/Touchstones/Scenarios/ScenarioGroup";
import {mockAdminState} from "../../../../mocks/mockStates";

describe("ScenariosList", () => {
    it("maps state to props", () => {
        const scenarios = [mockScenario(), mockScenario()];
        const diseases = [mockDisease(), mockDisease()];
        const touchstoneVersionId = "t1";
        const store = createMockAdminStore({
            scenario: {scenarios},
            diseases: {diseases},
            touchstones: {currentTouchstoneVersion: mockTouchstoneVersion({id: touchstoneVersionId})}
        });
        const rendered = shallow(<ScenariosList/>, {context: {store}});
        const expectedProps: ScenariosListProps = {
            scenarios, diseases, touchstoneVersionId,
            canDownloadCoverage: false
        };
        expect(rendered.find(ScenariosListComponent).props()).to.eql(expectedProps);
    });

    it("canDownloadCoverage is true when user has global coverage reading permission", () => {
        const scenarios = [mockScenario(), mockScenario()];
        const diseases = [mockDisease(), mockDisease()];
        const touchstoneVersionId = "t1";

        const store = createMockAdminStore({
            scenario: {scenarios},
            diseases: {diseases},
            auth: {permissions: ["*/coverage.read"]},
            touchstones: {currentTouchstoneVersion: mockTouchstoneVersion({id: touchstoneVersionId})}
        });
        const rendered = shallow(<ScenariosList/>, {context: {store}});
        const expectedProps: ScenariosListProps = {
            scenarios, diseases, touchstoneVersionId,
            canDownloadCoverage: true
        };
        expect(rendered.find(ScenariosListComponent).props()).to.eql(expectedProps);
    });

    it("renders one ScenarioGroup per disease, and passes the relevant scenarios in", () => {
        const disease1 = mockDisease({id: "d1"});
        const disease2 = mockDisease({id: "d2"});
        const d1scenarios = [mockScenario({disease: "d1"}), mockScenario({disease: "d1"})];
        const d2scenarios = [mockScenario({disease: "d2"})];
        const touchstoneVersionId = "t1";
        const store = createMockAdminStore({
            scenario: {scenarios: d1scenarios.concat(d2scenarios)},
            diseases: {diseases: [disease1, disease2]},
            touchstones: {currentTouchstoneVersion: mockTouchstoneVersion({id: touchstoneVersionId})}
        });
        const rendered = shallow(<ScenariosList/>, {context: {store}}).dive();
        const groups = rendered.find(ScenarioGroup);
        expect(groups).to.have.length(2);
        expect(groups.at(0).props()).to.eql({disease: disease1, scenarios: d1scenarios, touchstoneVersionId,
            canDownloadCoverage: false});
        expect(groups.at(1).props()).to.eql({disease: disease2, scenarios: d2scenarios, touchstoneVersionId,
            canDownloadCoverage: false});
    });
});