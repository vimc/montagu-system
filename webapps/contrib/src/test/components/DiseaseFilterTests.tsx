import * as React from 'react';
import * as mocks from '../mocks';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { alt } from '../../main/alt';
import * as actionHelpers from '../actionHelpers';

import { DiseaseFilter } from '../../main/components/Responsibilities/DiseaseFilter';
import { OptionSelector } from '../../main/components/OptionSelector/OptionSelector';

describe("DiseaseFilter", () => {
    afterEach(() => {
        alt.recycle();
        actionHelpers.restoreDispatch();
    });

    it("is empty if there are no diseases", () => {
        const set = mocks.mockResponsibilitySet({}, []);
        const rendered = shallow(<DiseaseFilter {...set} />);
        expect(rendered.find(OptionSelector).exists()).to.equal(false, "Expected there to be no option selector");
    });

    it("is empty if there is one disease", () => {
        const set = mocks.mockResponsibilitySet({}, [ mocks.mockResponsibility() ]);
        const rendered = shallow(<DiseaseFilter {...set} />);
        expect(rendered.find(OptionSelector).exists()).to.equal(false, "Expected there to be no option selector");
    });

    it("renders disease options", () => {
        mocks.setupMainStore([
            { id: "d1", name: "Disease 1" },
            { id: "d2", name: "Disease 2" },
        ]);
        const set = mocks.mockResponsibilitySet({}, [ 
            mocks.mockResponsibility({}, { disease: "d1" }),
            mocks.mockResponsibility({}, { disease: "d2" })
        ]);
        const rendered = shallow(<DiseaseFilter {...set} />);
        const selector = rendered.find(OptionSelector).at(0);
        expect(selector.props()).to.eql({
            defaultOption: "All",
            options: [
                { value: "d1", text: "Disease 1" },
                { value: "d2", text: "Disease 2" }
            ],
            onChange: (rendered.instance() as DiseaseFilter).filterByDisease
        });
    });

    it("emits filterByDisease when option is selected", () => {
        //We know from "it renders disease options" that the callback is set correctly.
        //We know from OptionSelectorTests that the callback will be invoked.
        //So we can just run the callback and test what it does.
        const spy = actionHelpers.dispatchSpy();
        const rendered = shallow(<DiseaseFilter {...mocks.mockResponsibilitySet({}, [])} />);
        const instance = rendered.instance() as DiseaseFilter;
        instance.filterByDisease("d1");

        actionHelpers.expectOrderedActions(spy, [
            { 
                action: "ResponsibilityActions.filterByDisease",
                payload: "d1"
            }
        ], 0);
    });
});