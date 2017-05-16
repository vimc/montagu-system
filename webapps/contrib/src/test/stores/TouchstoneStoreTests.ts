import { expect } from "chai";
import alt from "../../main/alt";
import { mockTouchstone } from "../mocks/mockModels";

import { Store } from "../../main/stores/TouchstoneStore";
import { touchstoneActions } from "../../main/actions/TouchstoneActions";

describe("TouchstoneStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            ready: false,
            touchstones: []
        });
    });

    it("update sets touchstones", () => {
        const touchstones = [ mockTouchstone({ status: "finished" }) ];
        touchstoneActions.update(touchstones);

        const state = Store.getState();
        expect(state).to.eql({
            ready: true,
            touchstones
        });
    });

    it("beginFetch clears everything", () => {
        // First set us up in a state where everything is non-null
        alt.bootstrap(JSON.stringify({
            TouchstoneStore: {
                ready: true,
                touchstones: [ mockTouchstone({}) ]
            }
        }));
        touchstoneActions.beginFetch();

        const state = Store.getState();
        expect(state).to.eql({
            ready: false,
            touchstones: []
        });
    });
});
