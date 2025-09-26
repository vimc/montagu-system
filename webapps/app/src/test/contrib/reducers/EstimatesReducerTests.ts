

import {estimatesInitialState, estimatesReducer} from "../../../main/contrib/reducers/estimatesReducer";
import {BurdenOutcome, EstimateTypes} from "../../../main/contrib/actionTypes/EstimateTypes";

describe('Estimates reducer tests', () => {

    const fakeBurdens = {"2000": [{"x": 1, "y": 10000}]};
    const makeFakeData = (outcome: BurdenOutcome) => {
        return {
            setId: 2,
            burdens: fakeBurdens,
            type: outcome
        };
    };

    it('adds deaths to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.DEATHS);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.deaths)).toHaveLength(1);
        expect(result.deaths[2]).toEqual(fakeBurdens);
        expect(result.dalys).toBe(null);
        expect(result.cases).toBe(null);
    });

    it('adds cases to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.CASES);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.cases)).toHaveLength(1);
        expect(result.cases[2]).toEqual(fakeBurdens);
        expect(result.dalys).toBe(null);
        expect(result.deaths).toBe(null);
    });

    it('adds dalys to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.DALYS);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.dalys)).toHaveLength(1);
        expect(result.dalys[2]).toEqual(fakeBurdens);
        expect(result.deaths).toBe(null);
        expect(result.cases).toBe(null);
    });

    it('sets chart type', () => {

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.SET_CHART_TYPE,
            data: BurdenOutcome.CASES
        });

        expect(result.chartType).toEqual(BurdenOutcome.CASES);
    });

    it("records that estimate set populating in progress", () => {
        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.POPULATING_ESTIMATES,
            data: true
        });

        expect(result.populatingInProgress).toBe(true);
    });

    it("sets populate state after set is populated with errors", () => {

        const mockErrors = [{code: "e", message: "e"}];
        const mockState = {...estimatesInitialState, populatingInProgress: true};
        const result = estimatesReducer(mockState, {
            type: EstimateTypes.ESTIMATE_SET_POPULATED,
            data: {setStatus: "invalid", errors: mockErrors}
        });

        expect(result.populateErrors).toEqual(mockErrors);
        expect(result.hasPopulateSuccess).toBe(false);
        expect(result.populatingInProgress).toBe(false);
        expect(result.populatingSetId).toBe(null);
    });

    it("sets populate state after set is populated successfully", () => {

        const mockState = {
            ...estimatesInitialState,
            uploadToken: "TOKEN",
            populatingSetId: 1,
            populatingInProgress: true
        };

        const result = estimatesReducer(mockState, {
            type: EstimateTypes.ESTIMATE_SET_POPULATED,
            data: {setStatus: "complete", errors: []}
        });

        expect(result.populateErrors).toHaveLength(0);
        expect(result.hasPopulateSuccess).toBe(true);
        expect(result.populatingInProgress).toBe(false);
        expect(result.populatingSetId).toBe(null);
        expect(result.uploadToken).toBe(null);
    });

    it("resets populate state", () => {

        const mockState = {
            ...estimatesInitialState,
            hasPopulateSuccess: true,
            populateErrors: [{code: "e", message: ""}],
            populatingSetId: 1,
            uploadToken: "TOKEN"
        };

        const result = estimatesReducer(mockState, {
            type: EstimateTypes.RESET_POPULATE_STATE,
            data: true
        });

        expect(result.hasPopulateSuccess).toBe(false);
        expect(result.populatingSetId).toBe(null);
        expect(result.populateErrors).toHaveLength(0);
        expect(result.uploadToken).toBe(null);
    });

    it("sets upload token", () => {

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.UPLOAD_TOKEN_FETCHED,
            data: "TOKEN"
        });

        expect(result.uploadToken).toEqual("TOKEN");
    });

    it("sets populatingSetId", () => {

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.SET_CREATED,
            data: 1
        });

        expect(result.populatingSetId).toEqual(1);
    });

});