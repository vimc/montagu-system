import * as React from "react";
import {expect} from "chai";
import {shallow, ShallowWrapper} from "enzyme";
import {Sandbox} from "../../../../Sandbox";
import {mockFetcher} from "../../../../mocks/mockRemote";
import {ModelRunParametersStatus} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParametersStatus";
import alt from "../../../../../main/shared/alt";
import {mockModelRunParameterSet} from "../../../../mocks/mockModels";
import {Alert} from "reactstrap";
import {ModelRunParameterDownloadCertificate} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterDownloadCertificate";

describe('ModelRunParameterStatus', () => {
    let rendered: ShallowWrapper<any, any>;
    const sandbox = new Sandbox();
    const sets = [mockModelRunParameterSet({disease: "d1", uploaded_on: "2018-07-13 13:45:29"}),
        mockModelRunParameterSet({disease: "d1", uploaded_on: "2017-07-13 13:45:29"}),
        mockModelRunParameterSet({disease: "d2"})];
    beforeEach(() => {
        alt.bootstrap(JSON.stringify({
            RunParametersStore: {
                parameterSets: sets,
            }
        }));

        mockFetcher(Promise.resolve(null))
    });

    afterEach(() => sandbox.restore());

    it("gets sets from store and filters by disease", () => {

        rendered = shallow(<ModelRunParametersStatus
            disease={"d1"}
        />);

        const sets = rendered.state().sets;

        expect(sets.length).to.eq(2);
        expect(sets[0].disease).to.eq("d1");
        expect(sets[1].disease).to.eq("d1");
    });

    it("renders message if no sets", () => {

        rendered = shallow(<ModelRunParametersStatus
            disease={"d3"}
        />);

        const alert = rendered.find(Alert);
        expect(alert.childAt(0).text()).to.eq("You have not uploaded any parameter sets for d3");

        const link = rendered.find(ModelRunParameterDownloadCertificate);
        expect(link).to.have.lengthOf(0);
    });

    it("renders certificate link of latest set", () => {

        rendered = shallow(<ModelRunParametersStatus
            disease={"d1"}
        />);

        const alert = rendered.find(Alert);
        expect(alert.childAt(0).text()).to.contain("You last uploaded a parameter set on Fri Jul 13 2018, 13:45:29");

        const link = rendered.find(ModelRunParameterDownloadCertificate);
        expect(link).to.have.lengthOf(1);
    });

});