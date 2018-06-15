import {createMockStore} from "./mocks/mockStore";
import {expect} from "chai";


export interface VerifyActionThatCallsServiceProperties {
    mockServices: () => void;
    callActionCreator: () => void;
    expectTheseActions: any[];
}

export interface VerifyActionThatCallsServiceAndReturnsResultProperties {
    mockServices: () => void;
    callActionCreator: () => void;
    expectTheseActionTypes: any[];
}

export function verifyActionThatCallsService(
    done: DoneCallback,
    props: VerifyActionThatCallsServiceProperties
) {
    props.mockServices();
    const store = createMockStore({});
    store.dispatch(props.callActionCreator());
    setTimeout(() => {
        const actions = store.getActions();
        expect(props.expectTheseActions).to.eql(actions);
        done();
    });
}

export function verifyActionThatCallsServiceAndReturnsResult(
    done: DoneCallback,
    props: VerifyActionThatCallsServiceAndReturnsResultProperties
) {
    props.mockServices();
    const store = createMockStore({});
    store.dispatch(props.callActionCreator());
    setTimeout(() => {
        const actions = store.getActions();
        expect(props.expectTheseActionTypes).to.eql(actions.map((x: any) => x.type));
        props.expectTheseActionTypes.forEach((expectedAction, i) => {
            expect(actions[i]).to.eql({
                type: expectedAction,
                data: "default_result"
            });
        });
        done();
    });
}