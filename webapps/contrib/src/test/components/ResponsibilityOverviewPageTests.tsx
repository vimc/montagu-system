import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import { mockLocation, mockTouchstone } from '../mocks';
import { Location } from 'simple-react-router';
import { alt } from '../../main/alt';
import * as actionHelpers from '../actionHelpers';
import { sources } from '../../main/sources/Sources';
import * as mocks from '../mocks';

import { ResponsibilityOverviewPage } from '../../main/components/Responsibilities/ResponsibilityOverviewPage';
import { Store } from '../../main/stores/TouchstoneStore';
import { responsibilityActions } from '../../main/actions/ResponsibilityActions';

const headerStyles = require("../../main/components/PageWithHeader/PageWithHeader.css");

function checkTitleIs(touchstoneId: string, title: string) {
    const location = mockLocation({ touchstoneId: touchstoneId });
    const rendered = shallow(<ResponsibilityOverviewPage location={ location } />);
    const titleText = rendered.find(`.${headerStyles.pageTitle}`).text();
    expect(titleText).to.contain(title);
}

function setupStore() {
    alt.bootstrap(JSON.stringify({
        TouchstoneStore: {
            touchstones: [
                mockTouchstone({ id: "a", description: "A" }),
                mockTouchstone({ id: "b", description: "B" })
            ],
            errorMessage: "",
            ready: true
        }
    }));
}

describe('ResponsibilityOverviewPage', () => {
    before(setupStore);

    describe("renders", () => {
        it("renders a title for A when URL is a", () => { 
            checkTitleIs("a", "Responsibilities in A");
        });

        it("renders a title for B when URL is b", () => { 
            checkTitleIs("b", "Responsibilities in B");
        });
    });

    describe("emits", () => {
        it("setTouchstone on load", () => {
            const spy = actionHelpers.dispatchSpy();
            const expected = Store.getState().touchstones[0];
            const location = mockLocation({ touchstoneId: expected.id });
            mount(<ResponsibilityOverviewPage location={ location } />).unmount();
            actionHelpers.expectOrderedActions(spy, [
                { action: "ResponsibilityActions.setTouchstone", payload: expected }
            ], 0);
        });

        afterEach(actionHelpers.restoreDispatch);
    });
});