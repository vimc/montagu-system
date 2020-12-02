import {createMockAdminStore} from "../../../mocks/mockStore";
import {shallow} from "enzyme";
import {CoverageProgress} from "../../../../main/admin/components/Touchstones/Coverage/CoverageProgress";
import * as React from "react";
import {UncontrolledAlert} from "reactstrap";
import {longTimestamp} from "../../../../main/shared/Helpers";

describe("Coverage Progress component tests", () => {
    const coverageUploadMetadata = [
        {vaccine: "YF", uploaded_on: "2020-12-02T14:07:19", uploaded_by: "test.user"},
        {vaccine: "Measles", uploaded_on: "2020-12-01T13:07:19", uploaded_by: "test.user2"}
    ];
    const store = createMockAdminStore({
        coverage: {
            coverageUploadMetadata
        }
    });

    it("renders with props", () => {
        const rendered = shallow(<CoverageProgress/>, {context: {store}});
        expect(rendered.props().metadataEntries).toStrictEqual(coverageUploadMetadata);
    });

    it("renders metadata entries text as expected", () => {
        const rendered = shallow(<CoverageProgress/>, {context: {store}}).dive();
        const alerts = rendered.find(UncontrolledAlert);
        expect(alerts.length).toBe(2);

        expect(alerts.at(0).html()).toContain(
            "A coverage set for YF was uploaded on Wed Dec 02 2020, 14:07 by test.user");
        expect(alerts.at(1).html()).toContain(
            "A coverage set for Measles was uploaded on Tue Dec 01 2020, 13:07 by test.user2");

        expect(alerts.at(0).key()).toBe("coverage-metadata-0");
        expect(alerts.at(1).key()).toBe("coverage-metadata-1");
    });

    it("renders with no metadata entries", () => {
        const emptyStore = createMockAdminStore({
            coverage: {
                coverageUploadMetadata: []
            }
        });
        const rendered = shallow(<CoverageProgress/>, {context: {store}}).dive();
        const alerts = rendered.find(UncontrolledAlert);
        expect(alerts.length).toBe(0);
    });
});
