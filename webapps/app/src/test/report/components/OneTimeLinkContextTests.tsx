import {expect} from "chai";
import {ReportingFetcher} from "../../../main/report/sources/ReportingFetcher";
import {checkAsync} from "../../testHelpers";
import {bootstrapOneTimeTokenStore} from "../../StoreHelpers";
import {OneTimeLinkContext, OneTimeLinkProps} from "../../../main/report/components/OneTimeLinkContext";
import {mockOneTimeToken} from "../../mocks/mocks";
import * as React from "react";
import {oneTimeTokenStore} from "../../../main/report/stores/OneTimeTokenStore";
import {Sandbox} from "../../Sandbox";
import {alt} from "../../../main/shared/alt";
import {OneTimeToken} from "../../../main/report/models/OneTimeToken";

describe("OneTimeLinkContext", () => {
    const sandbox = new Sandbox();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    class EmptyComponent extends React.Component<OneTimeLinkProps, undefined> {
        render(): JSX.Element {
            return null;
        }
    }

    it("if store does not contain matching token, href passed to child is null", () => {
        mockFetchToken();
        bootstrapOneTimeTokenStore([]);
        const Class = OneTimeLinkContext(EmptyComponent);
        const rendered = sandbox.mount(<Class href="/banana"/>);
        const child = rendered.find(EmptyComponent);
        expect(child.prop("href")).to.equal(null);
    });

    it("can get properties from store with matching token", () => {
        const token = setupStoreWithTokenFor("/banana");
        const Class = OneTimeLinkContext(EmptyComponent);
        const rendered = sandbox.mount(<Class href="/banana"/>);
        const child = rendered.find(EmptyComponent);
        expect(child.prop("href")).to.equal("http://localhost:8081/v1/banana?access_token=" + token.raw);
    });

    it("triggers fetchToken on mount", (done: DoneCallback) => {
        const fetchToken = mockFetchToken();
        bootstrapOneTimeTokenStore([]);
        const Class: any = OneTimeLinkContext(EmptyComponent);
        sandbox.mount(<Class href="/panda"/>);

        checkAsync(done, () => {
            expect(fetchToken.called).to.equal(true, "Expected _fetchToken to be called");
        });
    });

    it("it does not trigger fetchToken on properties change if href is the same", (done: DoneCallback) => {
        const url = "/bamboo";
        const Class = OneTimeLinkContext(EmptyComponent);
        const element = sandbox.mount(<Class href={url}/>);
        checkAsync(done, (afterWait) => {
            const fetchToken = mockFetchToken();
            element.setProps({href: url});
            afterWait(done, () => {
                expect(fetchToken.called).to.equal(false, "Expected _fetchToken to not be called");
            });
        });
    });

    it("it does trigger fetchToken on properties change if href is different", (done: DoneCallback) => {
        const url = "/bamboo";
        const Class: any = OneTimeLinkContext(EmptyComponent);
        const element = sandbox.mount(<Class href={url}/>);
        const fetchToken = mockFetchToken();
        element.setProps({href: "/juniper"});
        checkAsync(done, () => {
            expect(fetchToken.called).to.equal(true, "Expected _fetchToken to be called");
        });
    });

    function mockFetchToken() {
        return sandbox.sinon.stub(oneTimeTokenStore, "_fetchToken").returns(Promise.resolve(true));
    }

    function setupStoreWithTokenFor(url: string): OneTimeToken {
        const qualifiedUrl = ReportingFetcher.buildRelativeReportingURL(url);
        const token = mockOneTimeToken(qualifiedUrl);
        bootstrapOneTimeTokenStore([token]);
        return token;
    }
});