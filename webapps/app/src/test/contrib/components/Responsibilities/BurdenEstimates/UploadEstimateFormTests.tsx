import * as React from "react";
import {expect} from "chai";

import "../../../../helper";
import {
    mapDispatchToProps,
    mapStateToProps
} from "../../../../../main/contrib/components/Responsibilities/BurdenEstimates/UploadBurdenEstimatesForm";
import {mockContribState} from "../../../../mocks/mockStates";
import {Sandbox} from "../../../../Sandbox";
import {estimatesActionCreators} from "../../../../../main/contrib/actions/estimatesActionCreators";


describe("Upload Burden Estimates Form tests", () => {

    const sandbox = new Sandbox();

    afterEach(() => {
        sandbox.restore()
    });

    describe("mapStateToProps", () => {

        test("sets url if token and populatingSetId exists", () => {

            const mockState = mockContribState({estimates: {uploadToken: "TOKEN", populatingSetId: 1}});
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.url).to.eq("http://localhost:8080/v1/modelling-groups/g1/responsibilities/t1/s1/estimate-sets/1/actions/upload/TOKEN/");
        });

        test("url is null while token is null", () => {

            const mockState = mockContribState({estimates: {populatingSetId: 1}});
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.url).to.be.null;
        });

        test("url is null while populating setId is null", () => {

            const mockState = mockContribState({estimates: {uploadToken: "TOKEN"}});
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.url).to.be.null;
        });

        test("properties are set from state", () => {

            const mockState = mockContribState({
                estimates: {
                    populatingInProgress: true,
                    populateErrors: ["error" as any],
                    hasPopulateSuccess: true
                }
            });
            const result = mapStateToProps(mockState, {touchstoneId: "t1", scenarioId: "s1", groupId: "g1"});
            expect(result.populateErrors).to.have.members(["error"]);
            expect(result.populatingInProgress).to.be.true;
            expect(result.hasPopulateSuccess).to.be.true;
        });

    });

    describe("mapDispatchToProps", () => {

        test("can dispatch createBurdenEstimateSet", () => {
            const dispatchStub = sandbox.sinon.stub();
            sandbox.setStubFunc(estimatesActionCreators, "createBurden", () => "TEST");

            const result = mapDispatchToProps(dispatchStub, {});
            result.createBurdenEstimateSet({type: "central-averaged", details: ""});

            expect(dispatchStub.calledWith("TEST")).to.be.true;
        });

        test("can dispatch populateEstimateSet", () => {
            const dispatchStub = sandbox.sinon.stub();
            sandbox.setStubFunc(estimatesActionCreators, "populateEstimateSet", (token: String) => token);

            const result = mapDispatchToProps(dispatchStub, {});
            result.populateEstimateSet("TOKEN");

            expect(dispatchStub.calledWith("TOKEN")).to.be.true;
        });

        test("can dispatch resetPopulateState", () => {
            const dispatchStub = sandbox.sinon.stub();
            sandbox.setStubFunc(estimatesActionCreators, "resetPopulateState", () => "TEST");

            const result = mapDispatchToProps(dispatchStub, {});
            result.resetPopulateState();

            expect(dispatchStub.calledWith("TEST")).to.be.true;
        })

    });

});