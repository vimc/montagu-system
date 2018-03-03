import {shallow} from "enzyme";
import {expect} from "chai";
import {FileDownloadLink, FileDownloadLinkInner} from "../../../main/report/components/FileDownloadLink";
import * as React from "react";
import {alt} from "../../../main/shared/alt";
import {Sandbox} from "../../Sandbox";

describe("FileDownloadLink", () => {
    const sandbox = new Sandbox();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("renders disabled link when href is null", () => {
        const rendered = shallow(<FileDownloadLinkInner href={null} refreshToken={null} />);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal(null);
    });

    it("renders enabled link when href is set", () => {
        const rendered = shallow(<FileDownloadLinkInner href="/grapefruit" refreshToken={null} />);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal("/grapefruit");
    });

    it("clicking link triggers token refresh", () => {
        let called = false;
        const callback = () => called = true;
        const element = shallow(<FileDownloadLinkInner href="some-url" refreshToken={callback} />);
        element.find("a").simulate("click");
        expect(called).to.be.true;
    });
});