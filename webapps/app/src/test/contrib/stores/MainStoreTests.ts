import { expect } from "chai";
import alt from "../../../main/shared/alt";
import { Sandbox } from "../../Sandbox";
import { mockDisease, mockModellingGroup } from "../../mocks/mockModels";

import { mainStore } from "../../../main/contrib/stores/MainStore";
import { diseaseActions } from "../../../main/contrib/actions/DiseaseActions";
import { responsibilityStore } from "../../../main/contrib/stores/ResponsibilityStore";
import { Disease, ModellingGroup } from "../../../main/shared/models/Generated";
import { emptyLoadable } from "../../../main/contrib/stores/Loadable";
import { modellingGroupActions } from "../../../main/contrib/actions/ModellingGroupActions";
import { checkAsync } from "../../testHelpers";

describe("MainStore", () => {
    const sandbox = new Sandbox();

    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("is initially blank", () => {
        const state = mainStore.getState();
        expect(state).to.eql({
            ready: false,
            diseases: emptyLoadable<Disease>(),
            modellingGroups: emptyLoadable<ModellingGroup>()
        });
    });

    it("diseaseActions.update sets diseases", () => {
        const disease1 = mockDisease({ id: "d1" });
        const disease2 = mockDisease({ id: "d2" });
        diseaseActions.update([ disease1, disease2 ]);

        const state = mainStore.getState();
        expect(state).to.eql({
            ready: false,
            diseases: {
                loaded: true,
                content: {
                    d1: disease1,
                    d2: disease2,
                }
            },
            modellingGroups: emptyLoadable<ModellingGroup>()
        });
    });

    it("modellingGroupActions.update sets modelling groups", () => {
        const group1 = mockModellingGroup({ id: "g1" });
        const group2 = mockModellingGroup({ id: "g2" });
        modellingGroupActions.update([ group1, group2 ]);

        const state = mainStore.getState();
        expect(state).to.eql({
            ready: false,
            diseases: emptyLoadable<Disease>(),
            modellingGroups: {
                loaded: true,
                content: {
                    g1: group1,
                    g2: group2,
                }
            }
        });
    });
});
