import alt from "../../../main/shared/alt";
import {expect} from "chai";
import {bootstrapStore} from "../../StoreHelpers";
import {RunParametersState, runParametersStore, RunParametersStoreInterface } from "../../../main/contrib/stores/RunParametersStore";
import {runParameterActions} from "../../../main/contrib/actions/RunParameterActions";
import {mockModelRunParameterSet} from "../../mocks/mockModels";
import {modellingGroupActions} from "../../../main/shared/actions/ModellingGroupActions";
import {touchstoneActions} from "../../../main/contrib/actions/TouchstoneActions";

describe("RunParameterStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    const bootstrap = function(state: Partial<RunParametersState>) {
        bootstrapStore<RunParametersState, RunParametersStoreInterface>(runParametersStore, state);
    };

    it("runParameterActions.clearUsedToken sets token to null", () => {
        bootstrap({
            oneTimeTokens: {"1": "TOKEN"}
        });
        runParameterActions.clearToken(1);

        const state = runParametersStore.getState();
        expect(state.oneTimeTokens[1]).to.equal(null);
    });

    it("runParameterActions.receiveToken sets the token", () => {
        runParameterActions.receiveToken(1, "TOKEN");

        const state = runParametersStore.getState();
        expect(state.oneTimeTokens[1]).to.equal("TOKEN");
    });

    it("runParameterActions.beginFetchParameterSets clears existing sets", () => {
        bootstrap({
            parameterSets: [mockModelRunParameterSet()]
        });
        runParameterActions.beginFetchParameterSets();
        const state = runParametersStore.getState();
        expect(state.parameterSets).to.equal(null);
    });

    it("runParameterActions.updateParameterSets sets parameter sets", () => {
        const sets = [mockModelRunParameterSet(), mockModelRunParameterSet()];
        runParameterActions.updateParameterSets(sets);
        const state = runParametersStore.getState();
        expect(state.parameterSets).to.eql(sets);
    });

    it("modellingGroupActions.setCurrentGroup sets groupId and clears everything", () => {
        bootstrap({
            parameterSets: [mockModelRunParameterSet()],
            oneTimeTokens: { "1" : "TOKEN" },
            groupId: "some-id"
        });
        modellingGroupActions.setCurrentGroup("group-1");
        const state = runParametersStore.getState();
        expect(state.parameterSets).to.equal(null);
        expect(state.oneTimeTokens[1]).to.equal(undefined);
        expect(state.groupId).to.equal("group-1");
    });

    it("touchstoneActions.setCurrentTouchstone sets touchstoneId and clears everything", () => {
        bootstrap({
            parameterSets: [mockModelRunParameterSet()],
            oneTimeTokens: { "1" : "TOKEN" },
            touchstoneId: "some-id"
        });
        touchstoneActions.setCurrentTouchstone("touchstone-1");
        const state = runParametersStore.getState();
        expect(state.parameterSets).to.equal(null);
        expect(state.oneTimeTokens[1]).to.equal(undefined);
        expect(state.touchstoneId).to.equal("touchstone-1");
    });
});