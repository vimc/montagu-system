import * as React from "react";
import { expect } from "chai";
import { shallow, mount } from "enzyme";
import { OneTimeButton } from "../../../main/shared/components/OneTimeButton/OneTimeButton";
import { OneTimeButtonButton } from "../../../main/shared/components/OneTimeButton/Elements/Button";
import { OneTimeButtonLink } from "../../../main/shared/components/OneTimeButton/Elements/Link";
import { doNothing } from "../../../main/shared/Helpers";
import fetcher from "../../../main/shared/sources/Fetcher";
import { Sandbox } from "../../Sandbox";

describe("OneTimeButton Button Element", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders button with onetime URL", () => {
        const rendered = shallow(<OneTimeButtonButton url="test_url" token="TOKEN">Test Button</OneTimeButtonButton>);
        expect(rendered.find("form").prop("action")).to.equal("test_url");
    });

    it("button is disabled when token is null", () => {
        const rendered = shallow(<OneTimeButtonButton token={null} url="test" enabled={true} >Test</OneTimeButtonButton>);
        const button = rendered.find("button");
        expect(button.prop("disabled")).to.be.true;
    });

    it("button is disabled when if enabled is false", () => {
        const rendered = shallow(<OneTimeButtonButton token="TOKEN" url="test" enabled={false}>Test</OneTimeButtonButton>);
        const button = rendered.find("form").find("button");
        expect(button.prop("disabled")).to.be.true;
    });

    it("animation is visible when enabled is true and token is null", () => {
        function checkImage(token: string, enable: boolean, expectImage: boolean) {
            const rendered = shallow(<OneTimeButtonButton token={token} enabled={enable} url="test">Test</OneTimeButtonButton>);
            const expectedImageCount = expectImage ? 1 : 0;
            expect(rendered.find("form").find("img")).to.have.length(expectedImageCount,
                `When token is '${token}' and enable is '${enable}', expected image to be present: ${expectImage}`);
        }
        checkImage(null, false, false);
        checkImage(null, true, true);
        checkImage("TOKEN", false, false);
        checkImage("TOKEN", true, false);
    });

    it("clicking button triggers refresh token callback after timeout", () => {
        let tracker = false;
        const callback = () => tracker = true;

        const rendered = shallow(<OneTimeButtonButton token="TOKEN" onClick={callback} url="test" enabled={true}>Test</OneTimeButtonButton>);
        const button = rendered.find("form").find("button");

        expect(button.prop("disabled")).to.be.false;
        button.simulate("click");

        expect(tracker).to.be.true;
    });
    // it("clicking button triggers refresh token callback after timeout", (done: DoneCallback) => {
    //     let tracker = false;
    //     const callback = () => tracker = true;
    //
    //     const rendered = shallow(<OneTimeButtonButton token="TOKEN" onClick={callback} url="test" enabled={true}>Test</OneTimeButtonButton>);
    //     const button = rendered.find("form").find("button");
    //
    //     expect(button.prop("disabled")).to.be.false;
    //     button.simulate("click");
    //
    //     expect(tracker).to.be.false;
    //     setTimeout(() => {
    //         expect(tracker).to.be.true;
    //         done();
    //     });
    // });
});

describe("OneTimeButton Link Element", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders link with onetime URL", () => {
        const rendered = shallow(<OneTimeButtonLink url="test_url" token="TOKEN" enabled={true}>Test Button</OneTimeButtonLink>);
        expect(rendered.find("a").prop("href")).to.equal("test_url");
    });

    it("link is disabled when token is null", () => {
        const rendered = shallow(<OneTimeButtonLink token={null} url="test" enabled={true} >Test</OneTimeButtonLink>);
        const link = rendered.find("span");
        expect(link.text()).to.equal('Test');
    });

    it("link is disabled when if enabled is false", () => {
        const rendered = shallow(<OneTimeButtonLink token="TOKEN" url="test" enabled={false}>Test</OneTimeButtonLink>);
        const link = rendered.find("span");
        expect(link.text()).to.equal('Test');
    });

    it("clicking button triggers refresh token callback", () => {
        let tracker = false;
        const callback = () => tracker = true;

        const rendered = shallow(<OneTimeButtonLink token="TOKEN" onClick={callback} url="test" enabled={true}>Test</OneTimeButtonLink>);
        const link = rendered.find("a");
        link.simulate("click");

        expect(tracker).to.be.true;
    });
});


describe("OneTimeButton", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders button with onetime URL", () => {
        const refreshUrlSpy = sandbox.createSpy();
        const rendered = shallow(<OneTimeButton token="TOKEN" refreshToken={refreshUrlSpy}>Test Button</OneTimeButton>);
        expect(rendered.find("OneTimeButtonButton").prop("url")).to.equal(fetcher.fetcher.buildURL("/onetime_link/TOKEN/"));
    });

    it("renders link with onetime URL", () => {
        const refreshUrlSpy = sandbox.createSpy();
        const rendered = shallow(<OneTimeButton token="TOKEN" refreshToken={refreshUrlSpy} element="Link">Test Button</OneTimeButton>);
        expect(rendered.find("OneTimeButtonLink").prop("url")).to.equal(fetcher.fetcher.buildURL("/onetime_link/TOKEN/"));
    });

    it("clicking the button trigger outer refresh url and onclick function", (done: DoneCallback) => {
        const refreshUrlSpy = sandbox.createSpy();
        const onclickSpy = sandbox.createSpy();
        const rendered = mount(<OneTimeButton token="TOKEN" refreshToken={refreshUrlSpy} onClick={onclickSpy}>Test Button</OneTimeButton>);
        const button = rendered.find("form").find("button");
        button.simulate("click");
        setTimeout(() => {
            console.log(refreshUrlSpy.callCount)
            expect(refreshUrlSpy.callCount).to.equal(1);
            expect(onclickSpy.callCount).to.equal(1);
            done();
        });
    });
});