import {shallow} from "enzyme";

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

    it("renders disabled link when href is null", () => {
        const rendered = shallow(<FileDownloadInner href={null} tokenConsumed={null} enabled={true} />);
        const a = rendered.find("a");
        expect(a.prop('href')).toEqual(null);
    });

    it("renders enabled link when href is set", () => {
        const rendered = shallow(<FileDownloadInner href="/grapefruit" tokenConsumed={null} enabled={true} />);
        const a = rendered.find("a");
        expect(a.prop('href')).toEqual("/grapefruit");
    });

    it("renders loading animation when loading is true", () => {
        const rendered = shallow(<FileDownloadInner href="/grapefruit" tokenConsumed={null} enabled={true} loading={true} />);
        const img = rendered.find("img");
        expect(img).toHaveLength(1)
    });

    it("does not render loading animation when loading is false", () => {
        const rendered = shallow(<FileDownloadInner href={null} tokenConsumed={null} enabled={true} loading={false} />);
        const img = rendered.find("img");
        expect(img).toHaveLength(0);
    });

    it("clicking link triggers token refresh", () => {
        let called = false;
        const callback = () => called = true;
        const element = shallow(<FileDownloadInner href="some-url" tokenConsumed={callback} enabled={true} />);
        element.find("a").simulate("click");
        expect(called).toBe(true);
    });
});

describe("FileDownloadLink", () => {

    it("renders file download link inner", () => {
        const rendered = shallow(<FileDownloadLinkInner href={null} tokenConsumed={null} enabled={true} />);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).toHaveLength(1);
        expect(inner.prop('className')).toBeUndefined();
    });

});

describe("FileDownloadButton", () => {

    it("renders file download link inner", () => {
        const rendered = shallow(<FileDownloadButtonInner href={null} tokenConsumed={null} enabled={true}/>);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).toHaveLength(1);
        expect(inner.prop('className')).toEqual("button");
    });

    it("passes through classname if exists", () => {
        const rendered = shallow(<FileDownloadButtonInner href={null} tokenConsumed={null} className={"test"} enabled={true} />);
        const inner = rendered.find(FileDownloadInner);
        expect(inner).toHaveLength(1);
        expect(inner.prop('className')).toEqual("button test");
    });

});