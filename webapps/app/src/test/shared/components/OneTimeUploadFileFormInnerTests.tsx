import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {OneTimeUploadFileFormInner} from "../../../main/shared/components/UploadFileForm";
import {doNothing} from "../../../main/shared/Helpers";
import * as React from "react";
import {OneTimeLinkProps} from "../../../main/shared/components/OneTimeLinkContext";
import * as sinon from "sinon";

describe("OneTimeUploadFileFormInner", () => {
    function render(props: Partial<OneTimeLinkProps>): ShallowWrapper<OneTimeLinkProps, undefined> {
        const defaultProps: OneTimeLinkProps = {
            enabled: true,
            href: "url",
            refreshToken: doNothing
        };
        const unifiedProps = Object.assign(defaultProps, props);
        return shallow(<OneTimeUploadFileFormInner {...unifiedProps} />);
    }

    it("renders children, then button", () => {
        const rendered = shallow(<OneTimeUploadFileFormInner enabled={true} href="url" refreshToken={doNothing}>
            <button>Before</button>
        </OneTimeUploadFileFormInner>);
        const buttons = rendered.find("button");
        expect(buttons.at(0).text()).to.equal("Before");
        expect(buttons.at(1).text()).to.equal("Upload");
    });

    it("renders enabled state correctly", () => {
        const enabledButton = render({enabled: true}).find("button");
        expect(enabledButton.prop("className")).to.equal("");
        expect(enabledButton.prop("disabled")).to.equal(false);
        const disabledButton = render({enabled: false}).find("button");
        expect(disabledButton.prop("className")).to.equal("disabled");
        expect(disabledButton.prop("disabled")).to.equal(true);
    });

    it("on button click it invokes one time link callback", () => {
        const callback = sinon.spy();
        const rendered = render({refreshToken: callback});
        rendered.find("button").simulate("click");
        expect(callback.callCount).to.equal(1, "Expected callback to be invoked once");
    });
});
