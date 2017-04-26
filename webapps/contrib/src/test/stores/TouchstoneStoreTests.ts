import { expect } from 'chai';
import alt from '../../main/alt';
import { mockTouchstone } from '../mocks';

import { Store } from '../../main/stores/TouchstoneStore';
import { touchstoneActions } from '../../main/actions/TouchstoneActions';
import { settings } from '../../main/Settings';

describe("TouchstoneStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            touchstones: null
        });
    });

    it("update sets touchstones", () => {
        const touchstones = [ mockTouchstone({ status: "finished" }) ];
        touchstoneActions.update(touchstones);

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: true,
            touchstones
        });
    });

    it("fetchFailed sets errorMessage", () => {
        touchstoneActions.fetchFailed("message");

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: "message",
            ready: false,
            touchstones: null
        });
    });

    it("beginFetch clears everything", () => {
        // First set us up in an impossible state where everything is non-null
        alt.bootstrap(JSON.stringify({
            TouchstoneStore: {
                errorMessage: "message",
                ready: true,
                touchstones: [ mockTouchstone({}) ]
            }
        }));
        touchstoneActions.beginFetch();

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            touchstones: null
        });
    });
});
