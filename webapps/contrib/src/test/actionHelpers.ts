import * as sinon from 'sinon';
import { expect } from 'chai';
import { alt } from '../main/alt';

export interface ActionExpectation {
    action: string,
    payload: any
}

export function expectOrderedActions(spy: sinon.SinonSpy, expectations: Array<ActionExpectation>, startIndex: number) {
    expectations.forEach((value, index) => {
        const event = spy.args[startIndex + index];
        expect(event).is.not.equal(undefined, `Expected this ${startIndex + index}th event: ${value.action}`);
        expect(event[0]).to.equal(value.action);
        expect(event[1]).to.eql(value.payload);
    })
}

export function expectFetchActions(spy: sinon.SinonSpy, namespace: string, startIndex: number) {
    expectOrderedActions(spy, [
        { action: `${namespace}.fetch`, payload: undefined },
        { action: `${namespace}.beginFetch`, payload: true },
    ], startIndex);
}

export function dispatchSpy(): sinon.SinonSpy {
    return sinon.spy(alt, "dispatch");
}

export function restoreDispatch() {
    (alt.dispatch as any as sinon.SinonSpy).restore();
}