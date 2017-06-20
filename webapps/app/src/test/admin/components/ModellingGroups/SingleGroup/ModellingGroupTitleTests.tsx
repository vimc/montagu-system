import { expect } from "chai";
import { mockModellingGroupDetails } from "../../../../mocks/mockModels";
import { alt } from "../../../../../main/shared/alt";
import { ModellingGroupTitle } from "../../../../../main/admin/components/ModellingGroups/SingleGroup/ModellingGroupTitle";

describe("ModellingGroupTitle", () => {
    it("can get props from stores", () => {
        const group = mockModellingGroupDetails();
        alt.bootstrap(JSON.stringify({
            GroupStore: {
                currentGroupId: "group1",
                groupDetails: {
                    "group1": group,
                    "group2": mockModellingGroupDetails()
                }
            }
        }));
        const props = ModellingGroupTitle.getPropsFromStores();
        expect(props).to.eql({
            ready: true,
            group: group
        });
    });
});