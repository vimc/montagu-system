import * as sinon from "sinon";
import { expect } from "chai";
import { alt } from "../main/alt";

export interface ActionExpectation {
    action: string,
    // Leave payload off to not make an assertion about it
    payload?: any
}

export function expectOrderedActions(spy: sinon.SinonSpy, expectations: Array<ActionExpectation>, startIndex: number = 0) {
    //spy.args.forEach((e, i) => console.log(`${i}: ${JSON.stringify(e)}`));

    expectations.forEach((value, index) => {
        const realIndex = startIndex + index;
        const event = spy.args[realIndex];
        expect(event).is.not.equal(undefined, `Expected this ${realIndex}th event: ${value.action}`);
        if (typeof event[0] == "string") {
            expect(event[0]).to.equal(value.action);
            if (value.hasOwnProperty("payload")) {
                expect(event[1]).to.eql(value.payload,
                    `Expected payload for event ${realIndex}, which was ${JSON.stringify(event[1])}, to match ${JSON.stringify(value.payload)}`);
            }
        } else {
            expect(event[0]).to.eql({
                type: value.action,
                payload: value.payload
            })
        }
    })
}

export function expectOneAction(spy: sinon.SinonSpy, expectation: ActionExpectation, startIndex: number = 0) {
    expectOrderedActions(spy, [ expectation ], startIndex);
}

export function dispatchSpy(): sinon.SinonSpy {
    return sinon.spy(alt, "dispatch");
}

export function restoreDispatch() {
    const dispatch = alt.dispatch;
    if (isSpy(dispatch)) {
        dispatch.restore();
    }
}

function isSpy(x: any): x is sinon.SinonSpy {
    return x.hasOwnProperty("restore");
}