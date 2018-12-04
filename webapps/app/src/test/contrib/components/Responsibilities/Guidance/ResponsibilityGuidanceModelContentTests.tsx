import {Sandbox} from "../../../../Sandbox";
import {mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {createMockContribStore} from "../../../../mocks/mockStore";
import {mockMatch} from "../../../../mocks/mocks";
import {TouchstoneVersion} from "../../../../../main/shared/models/Generated";
import {ResponsibilityGuidanceContentProps} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceContentProps";
import {responsibilityGuidanceModelInputsPageActionCreators} from "../../../../../main/contrib/actions/pages/responsibilityGuidancePageActionCreators";
import {shallow} from "enzyme";
import {ResponsibilityGuidanceModelInputsContentLatest} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceModelInputsContentLatest";
import {ResponsibilityGuidanceModelInputsContent2017} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceModelInputsContent2017";
import {ResponsibilityGuidanceModelOutputsContentLatest} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceModelOutputsContentLatest";
import {ResponsibilityGuidanceModelOutputsContent2017} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceModelOutputsContent2017";

import {ResponsibilityGuidanceTouchstoneNotOpenContent} from "../../../../../main/contrib/components/Responsibilities/Guidance/content/ResponsibilityGuidanceTouchstoneNotOpenContent";
import {expect} from "chai";
import * as React from "react";
import {match} from 'react-router';
import { Store } from "redux";
import {ContribAppState} from "../../../../../main/contrib/reducers/contribAppReducers";

describe("Guidance Content Component tests", () => {

    const sandbox = new Sandbox();
    let testTouchstone : TouchstoneVersion;
    let store : Store<ContribAppState>;

    beforeEach(() => {
        testTouchstone = mockTouchstoneVersion();

        store = createMockContribStore({
            touchstones: {currentTouchstoneVersion: testTouchstone}
        });

    });

    afterEach(() => sandbox.restore());

    it("renders Latest Input Content component with expected content", () => {

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelInputsContentLatest touchstoneVersion={testTouchstone}/>, {context: {store}});

        const props = rendered.props();
        expect(props.touchstoneVersion.name).is.equal(testTouchstone.name);
        const pageArticle = rendered.dive().find('PageArticle');
        expect(pageArticle.props().title).is.equal("Guidance on model inputs: coverage and demographic data");

        const alert = rendered.dive().find('.alert-primary');
        expect(alert.getElements().length).is.equal(1);

    });

    it("renders Touchstone Not Open component with expected content", () => {

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelInputsContent2017 touchstoneVersion={testTouchstone}/>, {context: {store}});

        const props = rendered.props();
        expect(props.touchstoneVersion.name).is.equal(testTouchstone.name);
        const pageArticle = rendered.dive().find('PageArticle');
        expect(pageArticle.props().title).is.equal("Guidance on model inputs: coverage and demographic data");

        const alert = rendered.dive().find('.alert-primary');
        expect(alert.getElements().length).is.equal(1);

    });

    it("renders Touchstone Not Open component with expected content", () => {

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceTouchstoneNotOpenContent touchstoneVersion={testTouchstone}/>, {context: {store}});

        const props = rendered.props();
        expect(props.touchstoneVersion.name).is.equal(testTouchstone.name);
        const pageArticle = rendered.dive().find('PageArticle');
        expect(pageArticle.props().title).is.equal("Touchstone is not open");

        const alert = rendered.dive().find('.alert-danger');
        expect(alert.getElements().length).is.equal(1);

    });

    it("renders Latest Output Content component with expected content", () => {

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelOutputsContentLatest touchstoneVersion={testTouchstone}/>, {context: {store}});

        const props = rendered.props();
        expect(props.touchstoneVersion.name).is.equal(testTouchstone.name);
        const pageArticle = rendered.dive().find('PageArticle');
        expect(pageArticle.props().title).is.equal("Guidance on model outputs: how to generate and upload central and stochastic estimates");

        const alert = rendered.dive().find('.alert-primary');
        expect(alert.getElements().length).is.equal(1);

    });

    it("renders 2017 Output Content component with expected content", () => {

        const onLoadStub = sandbox.setStubReduxAction(responsibilityGuidanceModelInputsPageActionCreators, "onLoad");
        const rendered = shallow(<ResponsibilityGuidanceModelOutputsContent2017 touchstoneVersion={testTouchstone}/>, {context: {store}});

        const props = rendered.props();
        expect(props.touchstoneVersion.name).is.equal(testTouchstone.name);
        const pageArticle = rendered.dive().find('PageArticle');
        expect(pageArticle.props().title).is.equal("Guidance on model outputs: how to generate and upload central and stochastic estimates");

        const alert = rendered.dive().find('.alert-primary');
        expect(alert.getElements().length).is.equal(1);

    });


});

