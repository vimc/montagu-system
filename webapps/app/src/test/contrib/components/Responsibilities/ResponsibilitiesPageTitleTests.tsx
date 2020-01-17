import * as React from "react";
import { shallow } from "enzyme";


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

    it("renders on connect level", () => {
        const store = createMockContribStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstoneVersion: testTouchstone},
        });
        const rendered = shallow(<ResponsibilitiesPageTitle title={'test-1'}/>, {context: {store}});
        expect(rendered.props().group).toEqual(testGroup);
        expect(rendered.props().touchstone).toEqual(testTouchstone);
        expect(rendered.props().title).toEqual("test-1");
    });

    it("renders on component level with back link", () => {
        const store = createMockContribStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstoneVersion: testTouchstone},
        });
        const rendered = shallow(<ResponsibilitiesPageTitle title={"test"}/>, {context: {store}}).dive();
        expect(rendered.find('div.mr-3').text()).toEqual("test");
        expect(rendered.find(InternalLink).props().href).toEqual(`/${testGroup.id}/responsibilities/${testTouchstone.id}/`);
        expect(rendered.find(InternalLink).props().children).toEqual("Return to responsibilities list");
    });

    it("renders on component level with no back link", () => {
        const store = createMockContribStore({
            groups: {currentUserGroup: testGroup},
            touchstones: {currentTouchstoneVersion: null},
        });
        const rendered = shallow(<ResponsibilitiesPageTitle title={"test"}/>, {context: {store}}).dive();
        expect(rendered.find('div.mr-3').text()).toEqual("test");
        expect(rendered.find(InternalLink).length).toEqual(0);
    });
});

