import {createMockStore} from "./mocks/mockStore";
import {expect} from "chai";
import {MockStore} from "redux-mock-store";


export interface VerifyActionThatCallsServiceProperties {
    mockServices: () => void;
    callActionCreator: () => void;
    expectTheseActions: any[];
    store?: MockStore<any>;
}

export interface VerifyActionThatCallsServiceAndReturnsResultProperties {
    mockServices: () => void;
    callActionCreator: () => void;
    expectTheseActionTypes: any[];
    store?: MockStore<any>;
}

export function verifyActionThatCallsService(
    done: DoneCallback,
    props: VerifyActionThatCallsServiceProperties
) {
    props.mockServices();
    const store = props.store || createMockStore({});
    store.dispatch(props.callActionCreator());
    setTimeout(() => {
        const actions = store.getActions();
        expect(actions).to.eql(props.expectTheseActions);
        done();
    });
}

export function verifyActionThatCallsServiceAndReturnsResult(
    done: DoneCallback,
    props: VerifyActionThatCallsServiceAndReturnsResultProperties
) {
    props.mockServices();
    const store = props.store || createMockStore({});
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