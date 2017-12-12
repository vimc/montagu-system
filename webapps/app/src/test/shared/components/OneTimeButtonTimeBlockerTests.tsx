import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-15";
enzyme.configure({ adapter: new Adapter() });

import { OneTimeButton } from "../../../main/shared/components/OneTimeButton";
import { OneTimeButtonTimeBlocker } from "../../../main/shared/components/OneTimeButtonTimeBlocker";
import { TimeBlockerProps } from "../../../main/shared/components/OneTimeButtonTimeBlocker";
import { doNothing } from "../../../main/shared/Helpers";
import fetcher from "../../../main/shared/sources/Fetcher";
import { Sandbox } from "../../Sandbox";

const ButtonWithTimeout = OneTimeButtonTimeBlocker(OneTimeButton);

describe("OneTimeButtonTimeBlocker", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("renders time blocker wrapper of one time button", () => {
        const rendered = shallow(
            <div>
                <ButtonWithTimeout
                    token="TOKEN"
                    refreshToken={doNothing}
                    disableDuration={100}
                    enabled={true}
                />
            </div>);
        const button = rendered.find("ButtonTimeBlockerWrapper");
        expect(button.exists()).to.equal(true);
        const props = button.props() as TimeBlockerProps;
        expect(props.token).to.equal("TOKEN");
        expect(props.disableDuration).to.equal(100);
        expect(props.enabled).to.equal(true);
    });

    it("calling method buttonClicked sets state prop enabled to false then to true in 100ms", function(done: DoneCallback) {
        this.timeout(120);
        let reference :any = null;
        const component = shallow(<ButtonWithTimeout
            token="TOKEN"
            refreshToken={doNothing}
            disableDuration={100}
            enabled={true}
            onRef={ref => (reference = ref)}
        />);
        const instance = component.instance() as any;
        expect(component.state().enabled).to.be.equal(true);
        instance.buttonClicked();
        setTimeout(() => {
            expect(component.state().enabled).to.be.equal(false);
        },50);
        setTimeout(() => {
            expect(component.state().enabled).to.be.equal(true);
            done();
        },110);
    });

    it("invoking enable sets enabled back to true immediately and stops timer for enabler of button", function(done) {
        const component = shallow(<ButtonWithTimeout
            token="TOKEN"
            refreshToken={doNothing}
            disableDuration={100}
            enabled={true}
            onRef={ref => (reference = ref)}
        />);
        let reference :any = null;
        const instance = component.instance() as any;
        expect(component.state().enabled).to.be.equal(true)
        instance.buttonClicked();
        expect(instance.enableTimeoutId).to.be.not.empty;
        setTimeout(() => {
            expect(component.state().enabled).to.be.equal(false);
            instance.enable();
            expect(instance.enableTimeoutId).to.be.empty;
            expect(component.state().enabled).to.be.equal(true);
            done();
        });
    });

});