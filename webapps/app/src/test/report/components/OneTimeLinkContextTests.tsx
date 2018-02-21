import {expect} from "chai";
import {ReportingFetcher} from "../../../main/report/sources/ReportingFetcher";
import {checkAsync} from "../../testHelpers";
import {bootstrapOneTimeTokenStore} from "../../StoreHelpers";
import {OneTimeLinkContext, OneTimeLinkContextComponent} from "../../../main/report/components/OneTimeLinkContext";
import {mockOneTimeToken} from "../../mocks/mocks";
import * as React from "react";
import {oneTimeTokenStore} from "../../../main/report/stores/OneTimeTokenStore";
import {Sandbox} from "../../Sandbox";
import {alt} from "../../../main/shared/alt";
import {FileDownloadLinkInner} from "../../../main/report/components/FileDownloadLink";
import {shallow} from "enzyme";
import {OneTimeToken} from "../../../main/report/models/OneTimeToken";

describe("OneTimeLinkContext", () => {
    const sandbox = new Sandbox();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("can get properties from empty store", () => {
        const props = OneTimeLinkContextComponent.getPropsFromStores({href: "/banana", token: null});
        expect(props).to.eql({
            href: "/banana",
            token: null
        });
    });

    it("can get properties from store with matching token", () => {
        const token = setupStoreWithTokenFor("/banana");
        const props = OneTimeLinkContextComponent.getPropsFromStores({href: "/banana", token: null});
        expect(props).to.eql({
            href: "/banana",
            token: token
        });
    });

    it("triggers fetchToken on mount", (done: DoneCallback) => {
        const fetchToken = mockFetchToken();
        bootstrapOneTimeTokenStore([]);
        sandbox.mount(<OneTimeLinkContext href="/panda"/>);

        checkAsync(done, () => {
            expect(fetchToken.called).to.equal(true, "Expected _fetchToken to be called");
        });
    });

    it("it does not trigger fetchToken on properties change if href is the same", (done: DoneCallback) => {
        const url = "/bamboo";
        const element = sandbox.mount(<OneTimeLinkContext href={url}/>);
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
        const element = sandbox.mount(<OneTimeLinkContext href={url}/>);
        const fetchToken = mockFetchToken();
        element.setProps({href: "/juniper"});
        checkAsync(done, () => {
            expect(fetchToken.called).to.equal(true, "Expected _fetchToken to be called");
        });
    });

    it("passes through onetime link to inner element", () => {
        const token = setupStoreWithTokenFor("/banana");
        const rendered = sandbox.mount(<OneTimeLinkContext href="/banana">
            <FileDownloadLinkInner />
        </OneTimeLinkContext>);

        const inner = rendered.find(FileDownloadLinkInner);
        expect(inner).to.have.length(1);
        expect(inner.prop("href")).to.contain("?access_token=" + token.raw);
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