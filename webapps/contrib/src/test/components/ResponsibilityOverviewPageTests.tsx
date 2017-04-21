import { setupVirtualDOM } from '../JSDomHelpers';
setupVirtualDOM();

import * as React from 'react';
import { expect } from 'chai';
import { shallow, ShallowWrapper } from 'enzyme';
import { mockLocation, mockTouchstone } from '../mocks';
import { Location } from 'simple-react-router';
import alt from '../../main/alt';

import { ResponsibilityOverviewPage } from '../../main/components/Responsibilities/ResponsibilityOverviewPage';
import { Store } from '../../main/stores/TouchstoneStore';
const headerStyles = require("../../main/components/PageWithHeader/PageWithHeader.css");

function checkTitleIs(touchstoneId: string, title: string) {
    const location = mockLocation({ touchstoneId: touchstoneId });
    const rendered = shallow(<ResponsibilityOverviewPage location={ location } />);
    const titleText = rendered.find(`.${headerStyles.pageTitle}`).text();
    expect(titleText).to.contain(title);
}

describe('ResponsibilityOverviewPage', () => {
    before(() => {
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
    });

    it("renders a title for A when URL is a", () => { 
        checkTitleIs("a", "Responsibilities in A");
    });

    it("renders a title for B when URL is b", () => { 
        checkTitleIs("b", "Responsibilities in B");
    });
});