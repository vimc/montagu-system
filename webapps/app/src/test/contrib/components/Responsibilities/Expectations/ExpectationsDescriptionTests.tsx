import {ExpectationMapping} from "../../../../../main/shared/models/Generated";
import {mockExpectationMapping, mockExpectations} from "../../../../mocks/mockModels";
import {ExpectationsDescription} from "../../../../../main/contrib/components/Responsibilities/Expectations/ExpectationsDescription";
import {shallow} from "enzyme";
import * as React from "react";
import {expect} from "chai";
import * as Adapter from "enzyme-adapter-react-15";
import {FileDownloadButton} from "../../../../../main/shared/components/FileDownloadLink";

describe("ExpectationsDescription", () => {
    it("renders applicable scenarios", () => {
        const expectation: ExpectationMapping = {
            expectation: mockExpectations(),
            applicable_scenarios: ["a", "b", "c"]
        };
        const rendered = shallow(<ExpectationsDescription
            expectationMapping={expectation}
            touchstoneVersionId="tId"
            groupId="gId"
        />);
        expect(rendered.find(".h3").text()).to.equal("Template for a, b, c");
    });

    it("renders FileDownloadButton", () => {
        const em = mockExpectationMapping();
        const rendered = shallow(<ExpectationsDescription
            expectationMapping={em}
            touchstoneVersionId="tId"
            groupId="gId"
        />);
        expect(rendered.find(FileDownloadButton).prop("href"))
            .to.equal(`/modelling-groups/gId/expectations/tId/${em.expectation.id}/`);
    });
});