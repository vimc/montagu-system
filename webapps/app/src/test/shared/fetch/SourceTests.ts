import {expect} from "chai";
import {processEncodedResultAndNotifyOnErrors} from "../../../main/shared/sources/Source";
import {Sandbox} from "../../Sandbox";
import {jwtDecoder} from "../../../main/shared/sources/JwtDecoder";
import {mockResult} from "../../mocks/mockRemote";

describe("processEncodedResultAndNotifyOnErrors", () => {
    it("returns result", () => {

        const decodedResult = mockResult("OK");

        new Sandbox().sinon.stub(jwtDecoder, "jwtDecode").returns({result: JSON.stringify(decodedResult)});

        const result = processEncodedResultAndNotifyOnErrors<string>({result: "encodedstring"});

        expect(result).to.equal("OK")
    });
});