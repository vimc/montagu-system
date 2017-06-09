import { expect } from "chai";
import alt from "../../main/alt";
import { Sandbox } from "../Sandbox";
import { mockDisease, mockModellingGroup } from "../mocks/mockModels";
const jwt = require("jsonwebtoken");

import { mainStore } from "../../main/contrib/stores/MainStore";
import { authActions } from "../../main/contrib/actions/AuthActions";
import { diseaseActions } from "../../main/contrib/actions/DiseaseActions";
import { errorActions } from "../../main/contrib/actions/ErrorActions";
import { responsibilityStore } from "../../main/contrib/stores/ResponsibilityStore";
import { Disease, ModellingGroup } from "../../main/contrib/models/Generated";
import { emptyLookup } from "../../main/contrib/stores/Loadable";
import { modellingGroupActions } from "../../main/contrib/actions/ModellingGroupActions";
import { checkAsync } from "../testHelpers";

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
            errors: [],
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
            errors: [],
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
        modellingGroupActions.update([ group1, group2 ]);

        const state = mainStore.getState();
        expect(state).to.eql({
            errors: [],
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

    it("when all sources have been loaded, store is ready and fetchTouchstones is triggered", (done: DoneCallback) => {
        const spy = sandbox.sinon.spy(responsibilityStore, "fetchTouchstones");

        expect(mainStore.getState().ready).to.be.false;
        modellingGroupActions.update([]);
        expect(mainStore.getState().ready).to.be.false;
        diseaseActions.update([]);
        expect(mainStore.getState().ready).to.be.true;

        checkAsync(done, () => {
            expect(spy.called).to.equal(true, "Expected responsibilityStore.fetchTouchstones to be called");
        });
    });


    it("errorActions.error adds errorMessage", () => {
        errorActions.error("message");

        let state = mainStore.getState();
        expect(state).to.eql({
            errors: [ "message" ],
            ready: false,
            diseases: emptyLookup<Disease>(),
            modellingGroups: emptyLookup<ModellingGroup>()
        });

        errorActions.error("message 2");

        state = mainStore.getState();
        expect(state).to.eql({
            errors: [ "message 2", "message" ],
            ready: false,
            diseases: emptyLookup<Disease>(),
            modellingGroups: emptyLookup<ModellingGroup>()
        });
    });

    it("logIn does not set errorMessage if user is active modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = mainStore.getState();
        expect(state.errors).to.be.empty;
    });

    it("logIn does set errorMessage if user is inactive", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "",
            roles: "modelling-group:group/member"
        }, "secret");
        authActions.logIn(token);

        const state = mainStore.getState();
        expect(state.errors[0]).to.contain("Your account has been deactivated");
    });

    it("logIn does set errorMessage if user is not a modeller", () => {
        const token = jwt.sign({
            sub: "user",
            permissions: "*/can-login",
            roles: ""
        }, "secret");
        authActions.logIn(token);

        const state = mainStore.getState();
        expect(state.errors[0]).to.contain("Only members of modelling groups");
    });
});
