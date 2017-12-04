import * as React from "react";
import {expect} from "chai";
import {Sandbox} from "../../../../Sandbox";
import {shallow} from "enzyme";
import {
    UploadModelRunParametersContentComponent
} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/UploadModelRunParametersContent";
import {UploadModelRunParametersForm} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/UploadModelRunParametersForm";
import {
    mockModellingGroup, mockResponsibilitySet,
    mockTouchstone
} from "../../../../mocks/mockModels";
import alt from "../../../../../main/shared/alt";

describe("UploadEstimatesContentComponent", () => {
    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    it("can get props from stores", () => {

        const group = mockModellingGroup();
        const touchstone = mockTouchstone();

        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                currentTouchstone: touchstone,
                currentModellingGroup: group,
                parametersOneTimeToken: "token",
                responsibilitySets: [ mockResponsibilitySet(), mockResponsibilitySet()],
                ready: true
            }
        }));

        const props = UploadModelRunParametersContentComponent.getPropsFromStores();
        expect(props).to.eql({
            diseases:  ["disease-id"],
            group: group,
            touchstone: touchstone,
            parametersToken: "token",
            ready: true
        })

    });

    it("can get props from stores when token is not fetched yet", () => {

        const group = mockModellingGroup();
        const touchstone = mockTouchstone();

        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                currentTouchstone: touchstone,
                currentModellingGroup: group,
                parametersOneTimeToken: null,
                responsibilitySets: [ mockResponsibilitySet(), mockResponsibilitySet()],
                ready: true
            }
        }));

        const props = UploadModelRunParametersContentComponent.getPropsFromStores();
        expect(props).to.eql({
            diseases:  [],
            group: null,
            touchstone: null,
            parametersToken: null,
            ready: false
        })
    });

    it("renders UploadModelRunParametersForm", () => {
        const props = {
            touchstone: mockTouchstone({ id: "touchstone-1"}),
            group: mockModellingGroup({ id: "group-1"}),
            parametersToken: "TOKEN",
            diseases: ["disease-1", "disease-2"],
            ready: true
        };

        const rendered = shallow(<UploadModelRunParametersContentComponent {...props} />);
        expect(rendered.find(UploadModelRunParametersForm).props()).to.eql({
            token: "TOKEN",
            diseases:  ["disease-1", "disease-2"],
            groupId: "group-1",
            touchstoneId: "touchstone-1"
        });
    });

});