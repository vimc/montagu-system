import {shallow, ShallowWrapper} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {
    CurrentEstimateSetSummary,
    ReviewedAndApprovedMessage
} from "../../../../main/contrib/components/Responsibilities/Overview/List/CurrentEstimateSetSummary";
import {BurdenEstimateSet} from "../../../../main/shared/models/Generated";
import {mockBurdenEstimateSet} from "../../../mocks/mockModels";

describe("CurrentEstimateSetSummary", () => {
    const render = function(set: BurdenEstimateSet, canUpload: boolean): ShallowWrapper<any, any> {
        return shallow(<CurrentEstimateSetSummary estimateSet={set} canUpload={canUpload}/>);
    };

    it("displays no estimates message if current estimate is null", () => {
        const rendered = render(null, true);
        expect(rendered.text()).to.contain("No burden estimate sets have been uploaded");
    });

    it("displays empty set message if current estimate is empty", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "empty",
            uploaded_on: "2017-07-13 13:55:29 +0100"
        }), true);
        expect(rendered.text()).to.contain("An empty burden estimate set was created on Thu Jul 13");
    });

    it("displays complete set message if current estimate is complete", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "complete",
            uploaded_on: "2017-07-13 13:55:29 +0100"
        }), true);
        expect(rendered.text()).to.contain("A complete estimate set was uploaded on Thu Jul 13");
    });

    it("displays fallback message for unknown status", () => {
        const rendered = render(mockBurdenEstimateSet({
            status: "foo" as any,
            uploaded_on: "2017-07-13 13:55:29 +0100"
        }), true);
        expect(rendered.text()).to.contain("You have an estimate set in status 'foo'");
        expect(rendered.text()).to.contain("Thu Jul 13");
    });

    it("displays standard reviewed and approved message when uploads are not allowed", () => {
        const rendered = render(mockBurdenEstimateSet(), false);
        expect(rendered.find(ReviewedAndApprovedMessage)).to.have.length(1);
    });
});