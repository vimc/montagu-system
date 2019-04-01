import * as React from "react";
import {expect} from "chai";
import {mount} from "enzyme";

import "../../../../helper";
import {
    mapDispatchToProps,
    mapStateToProps,
    PopulateEstimatesForm
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/PopulateBurdenEstimatesForm";
import {mockContribState} from "../../../../mocks/mockStates";
import {Sandbox} from "../../../../Sandbox";
import {estimatesActionCreators} from "../../../../../main/contrib/actions/estimatesActionCreators";
import {LoadingElement} from "../../../../../main/shared/partials/LoadingElement/LoadingElement";
import {createMockContribStore} from "../../../../mocks/mockStore";
import {mockError} from "../../../../mocks/mockResult";

describe("Populate Burden Estimates Form tests", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore()
    });

    describe("mapStateToProps", () => {
        it("sets url if token exists", () => {

            const mockState = mockContribState({estimates: {uploadToken: "TOKEN"}});
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", setId: 1, groupId: "g1"});
            expect(result.url).to.eq("http://localhost:8080/v1/modelling-groups/g1/responsibilities/t1/s1/estimate-sets/1/actions/upload/TOKEN/");
        });

        it("url is null while token is null", () => {

            const mockState = mockContribState();
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", setId: 1, groupId: "g1"});
            expect(result.url).to.be.null;
        });

        it("properties are set from state", () => {

            const mockState = mockContribState({
                estimates: {
                    populatingInProgress: true,
                    populateErrors: "error" as any,
                    hasPopulateSuccess: true
                }
            });
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", setId: 1, groupId: "g1"});
            expect(result.populateErrors).to.have.members(["error"]);
            expect(result.populatingInProgress).to.be.true;
            expect(result.hasPopulateSuccess).to.be.true;
        });

    });

    describe("mapDispatchToProps", () => {

        it("can dispatch getUploadToken", () => {
            const dispatchStub = sandbox.sinon.stub();
            sandbox.setStubFunc(estimatesActionCreators, "getUploadToken", () => "TEST");

            const result = mapDispatchToProps(dispatchStub, {});
            result.getUploadToken();

            expect(dispatchStub.calledWith("TEST")).to.be.true;
        });

        it("can dispatch populateEstimateSet", () => {
            const dispatchStub = sandbox.sinon.stub();
            sandbox.setStubFunc(estimatesActionCreators, "populateEstimateSet", (token: String) => token);

            const result = mapDispatchToProps(dispatchStub, {});
            result.populateEstimateSet("TOKEN");

            expect(dispatchStub.calledWith("TOKEN")).to.be.true;
        });

        it("can dispatch resetPopulateState", () => {
            const dispatchStub = sandbox.sinon.stub();
            sandbox.setStubFunc(estimatesActionCreators, "resetPopulateState", () => "TEST");

            const result = mapDispatchToProps(dispatchStub, {});
            result.resetPopulateState();

            expect(dispatchStub.calledWith("TEST")).to.be.true;
        })

    });

    it("displays loading element while populating is in progress", () => {

        const result = mount(<PopulateEstimatesForm groupId={"g1"} scenarioId={"s1"} touchstoneId={"t1"} setId={1}/>,
            {context: {store: createMockContribStore(mockContribState({estimates: {populatingInProgress: true}}))}});
        expect(result.find(LoadingElement)).to.have.lengthOf(1);

    });
});