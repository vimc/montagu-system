import * as React from "react";
import { shallow } from "enzyme";
import { mockModellingGroup } from "../../../../mocks/mockModels";

import { ModellingGroupListItem } from "../../../../../main/admin/components/ModellingGroups/List/ModellingGroupListItem";

describe("ModellingGroupListItem", () => {
    it("can render", () => {
        shallow(<ModellingGroupListItem { ...mockModellingGroup() } />);
    });
});