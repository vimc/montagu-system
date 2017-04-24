import { expect } from 'chai';
import alt from '../../main/alt';
import * as mocks from '../mocks';
import * as actionHelpers from '../actionHelpers';

import { Store } from '../../main/stores/ResponsibilityStore';
import { responsibilityActions } from '../../main/actions/ResponsibilityActions';
import { sources } from '../../main/sources/Sources';
import { settings } from '../../main/Settings';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe("ResponsibilityStore", () => {
    beforeEach(() => {
        // Clear all stores
        alt.recycle();
    });

    it("is initially blank", () => {
        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            currentTouchstone: null,
            responsibilitySet: null
        });
    });

    it("setTouchstone triggers fetch", (done: TestCallback) => {
        const touchstone = mocks.mockTouchstone({});
        const spy = actionHelpers.dispatchSpy();
        mocks.mockSource(sources.responsibilities);

        responsibilityActions.setTouchstone(touchstone);
        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            currentTouchstone: touchstone,
            responsibilitySet: null
        });

        actionHelpers.expectOrderedActions(spy, [
            { action: "ResponsibilityActions.setTouchstone", payload: touchstone }
        ], 0);

        // Yield test thread so that deferred action gets dispatched
        setTimeout(() => {
            actionHelpers.expectFetchActions(spy, "ResponsibilityActions", 1);
            done();
        });
    });

    it("updateResponsibilities sets responsibility set", () => {
        const responsibilitySet = mocks.mockResponsibilitySet({});
        responsibilityActions.updateResponsibilities(responsibilitySet);

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: true,
            currentTouchstone: null,
            responsibilitySet: responsibilitySet
        });
    });

    it("fetchFailed sets errorMessage", () => {
        responsibilityActions.fetchFailed("message");

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: "message",
            ready: false,
            currentTouchstone: null,
            responsibilitySet: null
        });
    });

    it("beginFetch clears everything expect currentTouchstone", () => {
        const touchstone = mocks.mockTouchstone()
        // First set us up in an impossible state where everything is non-null
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                errorMessage: "message",
                ready: true,
                currentTouchstone: touchstone,
                responsibilitySet: mocks.mockResponsibilitySet()
            }
        }));
        responsibilityActions.beginFetch();

        const state = Store.getState();
        expect(state).to.eql({
            errorMessage: null,
            ready: false,
            currentTouchstone: touchstone,
            responsibilitySet: null
        });
    });
});