import {mockMatch} from "./mocks";
import {PageProperties} from "../../main/shared/components/PageWithHeader/PageWithHeader";
import {shallow, ShallowWrapper} from "enzyme";
import {ReactElement} from "react";
import {createMockStore} from "./mockStore";
import {MockStore} from "redux-mock-store";

export function mockPageProperties(): PageProperties<undefined> {
    return {
        history: null,
        location: null,
        router: null,
        match: mockMatch<undefined>()
    };
}

export function shallowRenderPage<P, T>(page: ReactElement<P>, store?: MockStore<T>): ShallowWrapper<any, any> {
    store = store || createMockStore();
    return shallow(page, {context: {store}}).dive();
}
