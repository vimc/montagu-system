import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../helper";
import {mockModellingGroup, mockTouchstoneVersion} from "../../../mocks/mockModels";
import { ResponsibilitiesPageTitle } from "../../../../main/contrib/components/Responsibilities/PageTitle";
import { InternalLink } from "../../../../main/shared/components/InternalLink";
import {Sandbox} from "../../../Sandbox";
import {createMockContribStore} from "../../../mocks/mockStore";

describe("ResponsibilitiesPageTitle", () => {

    const testGroup = mockModellingGroup();
    const testTouchstone = mockTouchstoneVersion();

    const sandbox = new Sandbox();

    afterEach(() => sandbox.restore());

    test("renders on connect level", () => {
        const store = createMockContribStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstoneVersion: testTouchstone},
        });
        const rendered = shallow(<ResponsibilitiesPageTitle title={'test-1'}/>, {context: {store}});
        expect(rendered.props().group).to.eql(testGroup);
        expect(rendered.props().touchstone).to.eql(testTouchstone);
        expect(rendered.props().title).to.eql("test-1");
    });

    test("renders on component level with back link", () => {
        const store = createMockContribStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstoneVersion: testTouchstone},
        });
        const rendered = shallow(<ResponsibilitiesPageTitle title={"test"}/>, {context: {store}}).dive();
        expect(rendered.find('div.mr-3').text()).to.equal("test");
        expect(rendered.find(InternalLink).props().href).to.equal(`/${testGroup.id}/responsibilities/${testTouchstone.id}/`);
        expect(rendered.find(InternalLink).props().children).to.equal("Return to responsibilities list");
    });

    test("renders on component level with no back link", () => {
        const store = createMockContribStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstoneVersion: null},
        });
        const rendered = shallow(<ResponsibilitiesPageTitle title={"test"}/>, {context: {store}}).dive();
        expect(rendered.find('div.mr-3').text()).to.equal("test");
        expect(rendered.find(InternalLink).length).to.equal(0);
    });
});

