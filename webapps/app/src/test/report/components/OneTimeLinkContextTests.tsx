import {expect} from "chai";
import * as React from "react";

import {checkAsync} from "../../testHelpers";
import {OneTimeLinkContext, OneTimeLinkProps} from "../../../main/report/components/OneTimeLinkContext";
import {Sandbox} from "../../Sandbox";
import {OneTimeTokenService} from "../../../main/report/services/OneTimeTokenService";
import {mockOnetimeTokenState, mockReportAppState} from "../../mocks/mockStates";
import {ILookup} from "../../../main/shared/models/Lookup";
import {ReportAppState} from "../../../main/report/reducers/reportAppReducers";
import {shallow} from "enzyme";
import {createMockReportStore} from "../../mocks/mockStore";
import {MockStore} from "redux-mock-store";
import * as Sinon from "sinon"

describe("OneTimeLinkContext", () => {
    const sandbox = new Sandbox();
    let store: MockStore<ReportAppState> = null,
        fetchTokenStub: Sinon.SinonStub = null;

    const url = "/banana/";
    const token = "TOKEN";
    const tokens: ILookup<string> = {};
    tokens[url] = token;

    beforeEach(() => {
        store = createMockReportStore(mockReportAppState({onetimeTokens: mockOnetimeTokenState({tokens})}));
        fetchTokenStub = sandbox.sinon.stub(OneTimeTokenService.prototype, "fetchToken")
            .returns(Promise.resolve("token"));

    });

    afterEach(() => sandbox.restore());

    class EmptyComponent extends React.Component<OneTimeLinkProps, undefined> {
        render(): JSX.Element {
            return null;
        }
    }

    it("if store does not contain matching token, href passed to child is null", () => {
        const Class = OneTimeLinkContext(EmptyComponent);
        const rendered = shallow(<Class href="/orange/"/>, {context: {store}}).dive();
        const child = rendered.find(EmptyComponent);
        expect(child.prop("href")).to.equal(null);
    });

    it("can get properties from store with matching token", () => {
        const Class = OneTimeLinkContext(EmptyComponent);
        const rendered = shallow(<Class href="/banana/"/>, {context: {store}}).dive();
        const child = rendered.find(EmptyComponent);
        expect(child.prop("href")).to.equal("http://localhost:8081/v1/banana/?access_token=" + token);
    });

    it("triggers fetchToken on mount", (done: DoneCallback) => {

        const Class: any = OneTimeLinkContext(EmptyComponent);
        shallow(<Class href="/banana/"/>, {context: {store}}).dive();

        checkAsync(done, () => {
            expect(fetchTokenStub.called).to.equal(true, "Expected fetchToken to be called");
        });
    });

    it("it does not trigger fetchToken on properties change if href is the same", (done: DoneCallback) => {
        const url = "/bamboo";
        const Class = OneTimeLinkContext(EmptyComponent);
        const element = shallow(<Class href={url}/>, {context: {store}}).dive();
        element.setProps({href: url});

        setTimeout(() => {
            expect(fetchTokenStub.calledOnce).to.equal(true, "Expected fetchToken to be called once");
            expect(fetchTokenStub.getCall(0).args[0]).to.equal(url, "Expected fetchToken to be called with old url");
            done()
        }, 300);
    });

    it("it does trigger fetchToken on properties change if href is different", (done: DoneCallback) => {
        const url = "/bamboo";
        const Class: any = OneTimeLinkContext(EmptyComponent);
        const element = shallow(<Class href={url}/>, {context: {store}}).dive();

        const newUrl = "/juniper";
        element.setProps({href: newUrl});

        setTimeout(() => {
            expect(fetchTokenStub.calledTwice).to.equal(true, "Expected fetchToken to be called twice");
            expect(fetchTokenStub.getCall(0).args[0]).to.equal(url, "Expected fetchToken to be called with old url");
            expect(fetchTokenStub.getCall(1).args[0]).to.equal(newUrl, "Expected fetchToken to be called with new url");
            done()
        }, 300);

    });

});