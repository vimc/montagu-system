import {createMockStore} from "./mocks/mockStore";

import {MockStore} from "redux-mock-store";
import {ThunkAction} from "redux-thunk";
import DoneCallback = jest.DoneCallback;

export interface VerifyActionThatCallsServiceProperties {
    mockServices: () => void;
    callActionCreator: () => ThunkAction<any, any, any>;
    expectTheseActions: any[];
    store?: MockStore<any>;
}

export interface VerifyActionThatCallsServiceAndReturnsResultProperties {
    mockServices: () => void;
    callActionCreator: () => ThunkAction<any, any, any>;
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
        expect(actions).toEqual(props.expectTheseActions);
        done();
    })
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
        expect(actions.map((x: any) => x.type)).toEqual(props.expectTheseActionTypes);
        props.expectTheseActionTypes.forEach((expectedAction, i) => {
            expect(actions[i]).toEqual({
                type: expectedAction,
                data: "default_result"
            });
        });
        done();
    });
}