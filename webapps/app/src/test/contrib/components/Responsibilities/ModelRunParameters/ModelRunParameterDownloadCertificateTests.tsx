
import * as React from "react";

import {mockModelRunParameterSet,} from "../../../../mocks/mockModels";
import {Base64} from 'js-base64';
import {ModelRunParameterDownloadCertificate} from "../../../../../main/contrib/components/Responsibilities/ModelRunParameters/ModelRunParameterDownloadCertificate";

describe("ModelRunParameterDownloadCertificate", () => {

    it("creates signature data, signature and can be decoded back", () => {
        const component = new ModelRunParameterDownloadCertificate({set: mockModelRunParameterSet()});
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
        expect(Array.isArray(signatureData)).toBe(true);
        expect(typeof signatureData[0]).toBe('object');
        expect(typeof signatureData[1]).toBe('object');
        expect(signatureData[0]).toEqual(signatureInputMock);
        // check if signature is generated correctly
        expect(signatureData[1].signature).toEqual(signatureMock);
        // check if decoded back data is exacty the same data
        expect(decodedSignatureInput).toEqual(signatureInputMock);
    });
});