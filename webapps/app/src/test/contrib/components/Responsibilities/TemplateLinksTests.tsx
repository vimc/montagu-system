import * as React from "react";
import { Sandbox } from "../../../Sandbox";
import * as mocks from "../../../mocks/mocks";
import { shallow } from "enzyme";

import { expect } from "chai";
import { mockExtendedResponsibilitySet, mockResponsibility, mockScenario } from "../../../mocks/mockModels";

import {
    TemplateLink,
    TemplateLinks
} from "../../../../main/contrib/components/Responsibilities/Overview/List/TemplateLinks";
import { ButtonLink } from "../../../../main/shared/components/ButtonLink";

describe("TemplateLinks", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("is empty if there are no diseases", () => {
        const set = mockExtendedResponsibilitySet({}, []);
        set.responsibilities = [];

        const rendered = shallow(<TemplateLinks
            responsibilities={set.responsibilities}
            groupId="grpid"
            touchstoneId="tid"
        />);
        expect(rendered.find(TemplateLink).length).to.eq(0)
    });

    it("renders template links", () => {

        const set = mockExtendedResponsibilitySet({}, [
            mockResponsibility({}, mockScenario({ disease: "d1" })),
            mockResponsibility({}, mockScenario({ disease: "d2" }))
        ]);
        const rendered = shallow(<TemplateLinks
            responsibilities={set.responsibilities}
            groupId="grpid"
            touchstoneId="tid"
        />);
        const buttons = rendered.find(TemplateLink);

        expect(buttons.length).to.eq(2);
    });

});

describe("TemplateLink", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders template links", () => {
        mocks.setupMainStore({
            diseases: [
                { id: "d1", name: "Disease 1" },
                { id: "d2", name: "Disease 2" },
            ]
        });
        const rendered = shallow(<TemplateLink
            groupId="grpid"
            diseaseId="d1"
            touchstoneId="tid"
        />);
        const links = rendered.find("a");
        expect(links.length).to.eq(2);
        expect(links.first().prop("href")).to.eq("/contribution/templates/central_burden_template_d1-grpid.csv");
        expect(links.last().prop("href")).to.eq("/contribution/templates/stochastic_burden_template_d1-grpid.csv");
    });
});