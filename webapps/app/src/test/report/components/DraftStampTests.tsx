import {expect} from "chai";
import {DraftStamp} from "../../../main/report/components/DraftStamp";
import {shallow} from "enzyme";
import * as React from "react";

describe("DraftStamp", () => {
    it("renders nothing when published is true", () => {
        const rendered = shallow(<DraftStamp published={true}/>);
        expect(rendered.text()).to.equal("");
    });

    it("renders stamp when published is false", () => {
        const rendered = shallow(<DraftStamp published={false}/>);
        expect(rendered.text()).to.equal("Draft");
    });
});