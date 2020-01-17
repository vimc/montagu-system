import * as React from "react";
import { shallow } from "enzyme";


import "../../../../../helper";
import { Sandbox } from "../../../../../Sandbox";
import {
    mockDisease, mockResponsibility, mockResponsibilitySetWithExpectations,
    mockScenario
} from "../../../../../mocks/mockModels";

import { DiseaseFilter, DiseaseFilterComponent } from "../../../../../../main/contrib/components/Responsibilities/Overview/List/DiseaseFilter";
import { OptionSelector } from "../../../../../../main/contrib/components/OptionSelector/OptionSelector";
import {createMockStore} from "../../../../../mocks/mockStore";
import {diseasesActionCreators} from "../../../../../../main/shared/actions/diseasesActionCreators";

describe("Responsibility Overview Disease Filter Component tests", () => {
    const sandbox = new Sandbox();

    const testDisease = mockDisease();
    const testDisease2 = mockDisease();

    const mockNotMatchingState = () => {
        return {
            diseases: {diseases: [mockDisease()]},
            responsibilities: {responsibilitiesSet: mockResponsibilitySetWithExpectations()}
        };
    };

    const mockOneMatchState = () => {
        const testScenario = mockScenario({disease: testDisease.id});
        const testResponsibility = mockResponsibility({scenario: testScenario});
        const testResponsibilitySet = mockResponsibilitySetWithExpectations({responsibilities: [testResponsibility]});

        return {
            diseases: {diseases: [testDisease]},
            responsibilities: {responsibilitiesSet: testResponsibilitySet}
        };
    };

    const mockTwoMatchState = () => {
        const testScenario = mockScenario({disease: testDisease.id});
        const testScenario2 = mockScenario({disease: testDisease2.id});
        const testResponsibility = mockResponsibility({scenario: testScenario});
        const testResponsibility2 = mockResponsibility({scenario: testScenario2});
        const testResponsibilitySet = mockResponsibilitySetWithExpectations({responsibilities: [testResponsibility, testResponsibility2]});

        return {
            diseases: {diseases: [testDisease, testDisease2]},
            responsibilities: {responsibilitiesSet: testResponsibilitySet}
        };
    };

    afterEach(() => {
        sandbox.restore();
    });

    it("renders on connect level no options", () => {
        const store = createMockStore(mockNotMatchingState());
        const rendered = shallow(<DiseaseFilter/>, {context: {store}});
        expect(rendered.props().options).toEqual(null);
        expect(typeof rendered.props().setCurrentDiseaseId).toEqual("function");
    });

    it("renders on connect level 1 option", () => {
        const store = createMockStore(mockOneMatchState());
        const rendered = shallow(<DiseaseFilter/>, {context: {store}});
        expect(rendered.props().options).toEqual([{value: testDisease.id, text: testDisease.name}]);
    });

    it("renders on branch level, 1 option, renders nothing", () => {
        const store = createMockStore(mockOneMatchState());
        const rendered = shallow(<DiseaseFilter/>, {context: {store}}).dive();
        expect(rendered.find('Nothing').length).toEqual(1);
    });

    it("renders on branch level, 2 options, renders select box", () => {
        const store = createMockStore(mockTwoMatchState());
        const rendered = shallow(<DiseaseFilter/>, {context: {store}}).dive();
        expect(rendered.find(DiseaseFilterComponent).length).toEqual(1);
    });

    it("renders on component level, 2 options, renders select box", () => {
        const store = createMockStore(mockTwoMatchState());
        const rendered = shallow(<DiseaseFilter/>, {context: {store}}).dive().dive();
        const optionsSelector = rendered.find(OptionSelector);
        expect(optionsSelector.props().options).toEqual([
            {value: testDisease.id, text: testDisease.name},
            {value: testDisease2.id, text: testDisease2.name}
        ]);
    });

    it(
        "renders on component level, 2 options, renders select box, emits select",
        () => {
            const selectChangeStub = sandbox.setStubReduxAction(diseasesActionCreators, "setCurrentDiseaseId");
            const state = {...mockTwoMatchState()};
            const store = createMockStore(state);
            const rendered = shallow(<DiseaseFilter/>, {context: {store}}).dive().dive();
            const selectElement = rendered.find(OptionSelector).dive();
            expect(selectChangeStub.called).toEqual(false);
            selectElement.simulate('change', { currentTarget: {value: testDisease.id} });
            expect(selectChangeStub.called).toEqual(true);
        }
    );
});