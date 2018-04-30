import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../helper";
import { mockModellingGroup } from "../../../mocks/mockModels";
import { GroupList } from "../../../../main/contrib/components/ChooseGroup/GroupList";
import { ButtonLink } from "../../../../main/shared/components/ButtonLink";

describe("Choose Group List", () => {
    it("renders one group link per group", () => {
        const groups = [
            mockModellingGroup({ id: "g1" }),
            mockModellingGroup({ id: "g2" })
        ];
        const rendered = shallow(<GroupList groups={ groups } />);
        const items = rendered.find(ButtonLink);
        expect(items.at(0).prop("href")).to.eql(`/g1/`);
        expect(items.at(1).prop("href")).to.eql(`/g2/`);
    });
});