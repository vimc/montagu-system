import * as React from "react";
import { shallow } from "enzyme";
import { expect } from "chai";

import "../../../../helper";
import { Sandbox } from "../../../../Sandbox";
import {createMockContribStore, createMockStore} from "../../../../mocks/mockStore";
import {ResponsibilityGuidanceModelInputsPage} from "../../../../../main/contrib/components/Responsibilities/Guidance/ResponsibilityGuidanceModelInputsPage";
import {
    responsibilityGuidanceModelInputsPageActionCreators,
    responsibilityGuidanceModelOutputsPageActionCreators
} from "../../../../../main/contrib/actions/pages/responsibilityGuidancePageActionCreators";
import {mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {mockMatch} from "../../../../mocks/mocks";
import {ResponsibilityGuidancePageLocationProps} from "../../../../../main/contrib/components/Responsibilities/Guidance/ResponsibilityGuidancePageProps";
import {ResponsibilityGuidanceModelInputsContentLatest} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceModelInputsContentLatest";
import {ResponsibilityGuidanceModelInputsContent2017} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceModelInputsContent2017";
import {ResponsibilityGuidanceTouchstoneNotOpenContent} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceTouchstoneNotOpenContent";

describe("Guidance Model Inputs Page Component tests", () => {

    const sandbox = new Sandbox();

    beforeEach(() => {

    });

    afterEach(() => sandbox.restore());

    it("renders component on connect level", () => {

        const testTouchstone = mockTouchstoneVersion();

        const store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });

        const testMatch = mockMatch<ResponsibilityGuidancePageLocationProps>({
            touchstoneId: testTouchstone.id
        });

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelInputsPage match={testMatch}/>, {context: {store}});

        const props = rendered.props();
        expect(props.touchstoneVersion.name).is.equal(testTouchstone.name);
    });

    it("renders component on component level for latest content", () => {
        const testTouchstone = mockTouchstoneVersion();

        const store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });

        const testMatch = mockMatch<ResponsibilityGuidancePageLocationProps>({
            touchstoneId: testTouchstone.id
        });

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelInputsPage match={testMatch}/>, {context: {store}}).dive().dive().dive();

        expect(onLoadStub.called).is.equal(true);

        const content = rendered.find(ResponsibilityGuidanceModelInputsContentLatest);
        expect(content.getElements().length).is.equal(1);
    });

    it("renders component for finished touchstone", () => {
        const testTouchstone = mockTouchstoneVersion({status: "finished"});

        const store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });

        const testMatch = mockMatch<ResponsibilityGuidancePageLocationProps>({
            touchstoneId: testTouchstone.id
        });

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelInputsPage match={testMatch}/>, {context: {store}}).dive().dive().dive();

        expect(onLoadStub.called).is.equal(true);

        const content = rendered.find(ResponsibilityGuidanceTouchstoneNotOpenContent);
        expect(content.getElements().length).is.equal(1);

    });

    it("renders component for 2017 touchstone", () => {
        const testTouchstone = mockTouchstoneVersion({id: "op-2017-1"});

        const store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });

        const testMatch = mockMatch<ResponsibilityGuidancePageLocationProps>({
            touchstoneId: testTouchstone.id
        });

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelInputsPage match={testMatch}/>, {context: {store}}).dive().dive().dive();

        expect(onLoadStub.called).is.equal(true);

        const content = rendered.find(ResponsibilityGuidanceModelInputsContent2017);
        expect(content.getElements().length).is.equal(1);

    });

    it("renders component for 2019 touchstone", () => {
        const testTouchstone = mockTouchstoneVersion({id: "201910"});

        const store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });

        const testMatch = mockMatch<ResponsibilityGuidancePageLocationProps>({
            touchstoneId: testTouchstone.id
        });

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelInputsPage match={testMatch}/>, {context: {store}}).dive().dive().dive();

        expect(onLoadStub.called).is.equal(true);

        const link = rendered.find("a");
        expect(link.prop("href")).contains("guidance-2019-inputs.pdf");
    });

});

