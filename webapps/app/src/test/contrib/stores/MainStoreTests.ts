import { expect } from "chai";
import alt from "../../../main/shared/alt";
import { Sandbox } from "../../Sandbox";
import { mockDisease, mockModellingGroup } from "../../mocks/mockModels";

import { mainStore } from "../../../main/contrib/stores/MainStore";
import { diseaseActions } from "../../../main/contrib/actions/DiseaseActions";
import { Disease, ModellingGroup } from "../../../main/shared/models/Generated";
import { emptyLookup } from "../../../main/contrib/stores/Loadable";
import {modellingGroupActions} from "../../../main/shared/actions/ModellingGroupActions";

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
            diseases: emptyLookup<Disease>(),
            modellingGroups: emptyLookup<ModellingGroup>()
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
            modellingGroups: emptyLookup<ModellingGroup>()
        });
    });

    it("modellingGroupActions.update sets modelling groups", () => {
        const group1 = mockModellingGroup({ id: "g1" });
        const group2 = mockModellingGroup({ id: "g2" });
        modellingGroupActions.updateGroups([ group1, group2 ]);

        const state = mainStore.getState();
        expect(state).to.eql({
            ready: false,
            diseases: emptyLookup<Disease>(),
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
