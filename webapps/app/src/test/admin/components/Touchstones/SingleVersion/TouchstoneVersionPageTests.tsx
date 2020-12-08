import * as React from "react";


import {Sandbox} from "../../../../Sandbox";
import {PageArticle} from "../../../../../main/shared/components/PageWithHeader/PageArticle";
import {mockPageProperties, shallowRenderPage} from "../../../../mocks/mockPages";
import {touchstoneVersionPageActionCreators} from "../../../../../main/admin/actions/pages/touchstoneVersionPageActionCreators";
import {
    TouchstoneVersionDetails,
    TouchstoneVersionDetailsComponent
} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionDetails";
import {TouchstoneVersionPage} from "../../../../../main/admin/components/Touchstones/SingleTouchstoneVersion/TouchstoneVersionPage";
import {mount} from "enzyme";
import {mockTouchstone, mockTouchstoneVersion} from "../../../../mocks/mockModels";
import {InternalLink} from "../../../../../main/shared/components/InternalLink";
import {createMockAdminStore} from "../../../../mocks/mockStore";
import {mockAuthState} from "../../../../mocks/mockStates";
import {AuthState} from "../../../../../main/shared/reducers/authReducer";

describe("TouchstoneVersionPage", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    it("calls onLoad and renders TouchstoneVersionDetails", () => {
        const onLoadStub = sandbox.setStubReduxAction(touchstoneVersionPageActionCreators, "onLoad");
        sandbox.setStubReduxAction(touchstoneVersionPageActionCreators, "title");
        const rendered = shallowRenderPage(<TouchstoneVersionPage {...mockPageProperties()} />);
        expect(rendered.find(PageArticle).find(TouchstoneVersionDetails)).toHaveLength(1);
        expect(onLoadStub.mock.calls.length).toBe(1);
    });
});

describe("TouchstoneVersionDetails", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    const createSut = (authState: Partial<AuthState> = mockAuthState()) => {
        const store = createMockAdminStore({
            auth: authState,
            touchstones: {
                currentTouchstone: mockTouchstone({id: "t1"}),
                currentTouchstoneVersion: mockTouchstoneVersion({id: "v1", status: "open"})
            }
        });
        return mount(<TouchstoneVersionDetails/>, {context: {store}});//.dive().dive();
    };

    it("renders status", () => {
        const rendered = createSut();
        expect(rendered.find("h3").text()).toEqual("Status: open");
    });

    it("renders scenarios link", () => {
        const rendered = createSut();
        expect(rendered.find(InternalLink).at(0).prop("href")).toEqual("/touchstones/t1/v1/scenarios/");
    });

    it("renders responsibilities link", () => {
        const rendered = createSut();
        expect(rendered.find(InternalLink).at(1).prop("href")).toEqual("/touchstones/t1/v1/responsibilities/");
    });

    it("renders demographics link", () => {
        const rendered = createSut();
        expect(rendered.find(InternalLink).at(2).prop("href")).toEqual("/touchstones/t1/v1/demographics/");
    });

    it("renders upload coverage link if user has coverage upload permission", () => {
        const rendered = createSut({canUploadCoverage: true});
        expect(rendered.find(InternalLink).at(3).prop("href")).toEqual("/touchstones/t1/v1/coverage/");
    });

    it("does not render upload coverage link if user does not have coverage upload permission", () => {
        const rendered = createSut({canUploadCoverage: false});
        expect(rendered.find(InternalLink).length).toBe(3);
    });
});
