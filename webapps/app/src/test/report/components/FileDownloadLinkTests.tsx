import {shallow} from "enzyme";
import {expect} from "chai";
import {
    FileDownloadButton,
    FileDownloadButtonInner,
    FileDownloadInner, FileDownloadLink,
    FileDownloadLinkInner
} from "../../../main/report/components/FileDownloadLink";
import * as React from "react";
import {alt} from "../../../main/shared/alt";
import {Sandbox} from "../../Sandbox";

describe("FileDownloadLinkInner", () => {
    const sandbox = new Sandbox();

    beforeEach(() => alt.recycle());
    afterEach(() => sandbox.restore());

    it("renders disabled link when href is null", () => {
        const rendered = shallow(<FileDownloadInner href={null} refreshToken={null} />);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal(null);
    });

    it("renders enabled link when href is set", () => {
        const rendered = shallow(<FileDownloadInner href="/grapefruit" refreshToken={null} />);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal("/grapefruit");
    });

    it("clicking link triggers token refresh", () => {
        let called = false;
        const callback = () => called = true;
        const element = shallow(<FileDownloadInner href="some-url" refreshToken={callback} />);
        element.find("a").simulate("click");
        expect(called).to.be.true;
    });
});

describe("FileDownloadLink", () => {

    it("renders file download link inner", () => {
        const rendered = shallow(<FileDownloadLinkInner href={null} refreshToken={null} />);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).to.have.lengthOf(1);
        expect(inner.prop('className')).to.be.undefined;
    });

});

describe("FileDownloadButton", () => {

    it("renders file download link inner", () => {
        const rendered = shallow(<FileDownloadButtonInner href={null} refreshToken={null}/>);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).to.have.lengthOf(1);
        expect(inner.prop('className')).to.equal("button");
    });

});