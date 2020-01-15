import {shallow} from "enzyme";
import {expect} from "chai";
import {
    FileDownloadButton,
    FileDownloadButtonInner,
    FileDownloadInner, FileDownloadLink,
    FileDownloadLinkInner
} from "../../../main/shared/components/FileDownloadLink";
import * as React from "react";
import {Sandbox} from "../../Sandbox";

describe("FileDownloadLinkInner", () => {
    const sandbox = new Sandbox();
    afterEach(() => sandbox.restore());

    test("renders disabled link when href is null", () => {
        const rendered = shallow(<FileDownloadInner href={null} tokenConsumed={null} enabled={true} />);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal(null);
    });

    test("renders enabled link when href is set", () => {
        const rendered = shallow(<FileDownloadInner href="/grapefruit" tokenConsumed={null} enabled={true} />);
        const a = rendered.find("a");
        expect(a.prop('href')).to.equal("/grapefruit");
    });

    test("renders loading animation when loading is true", () => {
        const rendered = shallow(<FileDownloadInner href="/grapefruit" tokenConsumed={null} enabled={true} loading={true} />);
        const img = rendered.find("img");
        expect(img).to.have.lengthOf(1)
    });

    test("does not render loading animation when loading is false", () => {
        const rendered = shallow(<FileDownloadInner href={null} tokenConsumed={null} enabled={true} loading={false} />);
        const img = rendered.find("img");
        expect(img).to.have.lengthOf(0);
    });

    test("clicking link triggers token refresh", () => {
        let called = false;
        const callback = () => called = true;
        const element = shallow(<FileDownloadInner href="some-url" tokenConsumed={callback} enabled={true} />);
        element.find("a").simulate("click");
        expect(called).to.be.true;
    });
});

describe("FileDownloadLink", () => {

    test("renders file download link inner", () => {
        const rendered = shallow(<FileDownloadLinkInner href={null} tokenConsumed={null} enabled={true} />);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).to.have.lengthOf(1);
        expect(inner.prop('className')).to.be.undefined;
    });

});

describe("FileDownloadButton", () => {

    test("renders file download link inner", () => {
        const rendered = shallow(<FileDownloadButtonInner href={null} tokenConsumed={null} enabled={true}/>);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).to.have.lengthOf(1);
        expect(inner.prop('className')).to.equal("button");
    });

    test("passes through classname if exists", () => {
        const rendered = shallow(<FileDownloadButtonInner href={null} tokenConsumed={null} className={"test"} enabled={true} />);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).to.have.lengthOf(1);
        expect(inner.prop('className')).to.equal("button test");
    });

});