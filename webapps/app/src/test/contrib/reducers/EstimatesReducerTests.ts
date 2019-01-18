import {expect} from "chai";

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

        expect(Object.keys(result.deaths)).to.have.lengthOf(1);
        expect(result.deaths[2]).to.eq(fakeBurdens);
        expect(result.dalys).to.be.null;
        expect(result.cases).to.be.null;
    });

    it('adds cases to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.CASES);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.cases)).to.have.lengthOf(1);
        expect(result.cases[2]).to.eq(fakeBurdens);
        expect(result.dalys).to.be.null;
        expect(result.deaths).to.be.null;
    });

    it('adds dalys to estimates lookup', () => {

        const fakeData = makeFakeData(BurdenOutcome.DALYS);

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.BURDEN_ESTIMATES_FETCHED,
            data: fakeData
        });

        expect(Object.keys(result.dalys)).to.have.lengthOf(1);
        expect(result.dalys[2]).to.eq(fakeBurdens);
        expect(result.deaths).to.be.null;
        expect(result.cases).to.be.null;
    });

    it('sets chart type', () => {

        const result = estimatesReducer(estimatesInitialState, {
            type: EstimateTypes.SET_CHART_TYPE,
            data: BurdenOutcome.CASES
        });

        expect(result.chartType).to.eq(BurdenOutcome.CASES);
    })
});