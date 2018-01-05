import {expect} from "chai";
import * as React from "react";
import {mockModelRunParameterSet,} from "../../../../mocks/mockModels";
import alt from "../../../../../main/shared/alt";
import {Base64} from 'js-base64';
import {ModelRunParameterDownloadCertificate} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterDownloadCertificate";

describe("ModelRunParameterDownloadCertificate", () => {
    beforeEach(() => alt.recycle());
    afterEach(() => alt.recycle());


    it("creates signature data, signature and can be decoded back", () => {
        const component = new ModelRunParameterDownloadCertificate();
        const mockSet: any = mockModelRunParameterSet();
        const signatureData = component.makeSignatureContent(mockSet);
        const signatureInputMock = {
            id: mockSet.id,
            disease: mockSet.disease,
            uploaded_by: mockSet.uploaded_by,
            uploaded_on: mockSet.uploaded_on
        };

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