import {ModelRunParameterSetsListComponent} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterSetsList";
import {shallow} from "enzyme";
import {expect} from "chai";
import * as React from "react";
import {
    mockModellingGroup, mockModelRunParameterSet, mockResponsibilitySet,
    mockTouchstone
} from "../../../../mocks/mockModels";
import alt from "../../../../../main/shared/alt";
import {bootstrapStore} from "../../../../StoreHelpers";
import {
    RunParametersState, runParametersStore,
    RunParametersStoreInterface
} from "../../../../../main/contrib/stores/RunParametersStore";
import { Base64 } from 'js-base64';

describe("ModelRunParameterSetsListComponent", () => {
    beforeEach(() => alt.recycle());
    afterEach(() => alt.recycle());

    it("can get props from stores", () => {
        const touchstone = mockTouchstone();
        const sets = [mockModelRunParameterSet()];
        alt.bootstrap(JSON.stringify({
            ResponsibilityStore: {
                currentTouchstone: touchstone
            },
            RunParametersStore: {
                parameterSets: sets
            }
        }));
        const props = ModelRunParameterSetsListComponent.getPropsFromStores(null);
        expect(props).to.eql({
            sets: sets,
            touchstone: touchstone,
            ready: true
        });
    });

    it("ready is false when parameterSets is null", () => {
        bootstrapStore<RunParametersState, RunParametersStoreInterface>(runParametersStore, {
            parameterSets: null
        });
        const props = ModelRunParameterSetsListComponent.getPropsFromStores(null);
        expect(props).to.eql({
            sets: null,
            touchstone: null,
            ready: false
        });
    });

    it("renders empty message when there are no parameter sets", () => {
        const rendered = shallow(<ModelRunParameterSetsListComponent
            ready={true} sets={[]} touchstone={mockTouchstone()} />);
        expect(rendered.text()).to.contain("No parameter sets have been uploaded");
    });

    it("renders table when there are parameter sets", () => {
        const sets = [
            mockModelRunParameterSet({
                description: "Description",
                uploaded_on: "2017-12-25 12:00:00",
                uploaded_by: "me"
            })
        ];
        const rendered = shallow(<ModelRunParameterSetsListComponent
            ready={true} sets={sets} touchstone={mockTouchstone()} />);
        const row = rendered.find("table tbody tr").at(0);
        const values = row.find("td").map(cell => cell.text());
        expect(values).to.eql([
            "Description",
            "me",
            "Mon Dec 25 2017, 12:00",
            "Link"
        ])
        const downloadLink = row.find("td");
        expect(downloadLink.at(3).find("a").prop('href')).to.contains("data: text/json;charset=utf-8");
        expect(downloadLink.at(3).find("a").prop('download')).to.eq('signature294');
    });

    it("creates signature data, signature and can be decoded back", () => {
        const component = new ModelRunParameterSetsListComponent();
        const mockSet : any = mockModelRunParameterSet();
        const signatureData = component.makeSignatureContent(mockSet);
        const signatureInputMock = {
            id: mockSet.id,
            disease: mockSet.disease,
            uploaded_by: mockSet.uploaded_by,
            uploaded_on: mockSet.uploaded_on
        }
        const signatureMock = Base64.encode(JSON.stringify(signatureInputMock));
        // decode data back from signature
        const decodedSignatureInput = JSON.parse(Base64.decode(signatureData[1].signature));
        expect(signatureData).to.be.an('Array');
        expect(signatureData[0]).to.be.an('object');
        expect(signatureData[1]).to.be.an('object');
        expect(signatureData[0]).to.eql(signatureInputMock);
        // check if signature is generated correctly
        expect(signatureData[1].signature).to.eq(signatureMock);
        // check if decoded back data is exacty the same data
        expect(decodedSignatureInput).to.eql(signatureInputMock);
    });
});