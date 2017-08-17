import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import { OneTimeButton } from "../../../main/shared/components/OneTimeButton";
import { doNothing } from "../../../main/shared/Helpers";
import fetcher from "../../../main/shared/sources/Fetcher";

describe("OneTimeButton", () => {
    it("renders form with onetime URL", () => {
        const rendered = shallow(<OneTimeButton token="TOKEN" refreshToken={doNothing} />);
        expect(rendered.find("form").prop("action")).to.equal(fetcher.fetcher.buildURL("/onetime_link/TOKEN/"));
    });

    it("button is disabled when token is null", () => {
        const rendered = shallow(<OneTimeButton token={null} refreshToken={doNothing} />);
        const button = rendered.find("form").find("button");
        expect(button.prop("disabled")).to.be.true;
    });

    it("button is disabled when if enabled is false", () => {
        const rendered = shallow(<OneTimeButton token="TOKEN" refreshToken={doNothing} enabled={false} />);
        const button = rendered.find("form").find("button");
        expect(button.prop("disabled")).to.be.true;
    });

    it("animation is visible when enabled is true and token is null", () => {
        function checkImage(token: string, enable: boolean, expectImage: boolean) {
            const rendered = shallow(<OneTimeButton token={token} refreshToken={doNothing} enabled={enable} />);
            const expectedImageCount = expectImage ? 1 : 0;
            expect(rendered.find("form").find("img")).to.have.length(expectedImageCount,
                `When token is '${token}' and enable is '${enable}', expected image to be present: ${expectImage}`);
        }
        checkImage(null, false, false);
        checkImage(null, true, true);
        checkImage("TOKEN", false, false);
        checkImage("TOKEN", true, false);
    });

    it("clicking button triggers callback after timeout", (done: DoneCallback) => {
        let tracker = false;
        const callback = () => tracker = true;

        const rendered = shallow(<OneTimeButton token="TOKEN" refreshToken={callback} />);
        const button = rendered.find("form").find("button");
        expect(button.prop("disabled")).to.be.false;
        button.simulate("click");

        expect(tracker).to.be.false;
        setTimeout(() => {
            expect(tracker).to.be.true;
            done();
        });
    });
});