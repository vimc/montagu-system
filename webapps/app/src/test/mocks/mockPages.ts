import {mockMatch} from "./mocks";
import {PageProperties} from "../../main/shared/components/PageWithHeader/PageWithHeader";
import {shallow, ShallowWrapper} from "enzyme";
import {ReactElement} from "react";
import {createMockStore} from "./mockStore";

export function mockPageProperties(): PageProperties<undefined> {
    return {
        history: null,
        location: null,
        router: null,
        match: mockMatch<undefined>()
    };
}

export function shallowRenderPage<P>(page: ReactElement<P>): ShallowWrapper<any, any> {
    return shallow(page, {context: {store: createMockStore()}}).dive();
}
