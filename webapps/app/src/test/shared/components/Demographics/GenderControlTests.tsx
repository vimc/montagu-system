import * as React from "react";

import { shallow } from "enzyme";

import ReactRadioButtonGroup from "react-radio-button-group";
import {GenderControl} from "../../../../main/shared/components/Demographics/GenderControl";
import {mockDemographicDataset} from "../../../mocks/mockModels";

describe("GenderControl", () => {
    it(
        "gender is applicable when data set is selected and that gender has gender applicable",
        () => {
            const f = GenderControl.genderApplicable;
            expect(f(null)).toBe(false);
            expect(f(mockDemographicDataset({ gender_is_applicable: false }))).toBe(false);
            expect(f(mockDemographicDataset({ gender_is_applicable: true }))).toBe(true);
        }
    );

    it("renders radio buttons when gender is applicable", () => {
        const set = mockDemographicDataset({ gender_is_applicable: true });
        const rendered = shallow(<GenderControl dataSet={set} value="" onSelectGender={null} />);
        expect(rendered.find(ReactRadioButtonGroup)).toHaveLength(1);
    });

    it("renders message when gender is not applicable", () => {
        const set = mockDemographicDataset({ gender_is_applicable: false });
        const rendered = shallow(<GenderControl dataSet={set} value="" onSelectGender={null} />);
        expect(rendered.find(ReactRadioButtonGroup)).toHaveLength(0);
        expect(rendered.text()).toContain("Gender is not applicable");
    });
});
