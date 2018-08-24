import {History, Location} from "history";
import {match} from 'react-router';

export function mockLocation(params?: Partial<Location>): Location {
    return Object.assign({
        hash: "hash",
        search: "",
        pathname: "/some/path",
        state: undefined
    }, params);
}

export function mockMatch<P>(params?: P) :match<P> {
    return {
        params: params || null,
        isExact: true,
        path: "/some/path",
        url: "/some/url"
    };
}

export function mockHistory(params?: Partial<History>): History {
    const template: History = {
        length: 1,
        action: "PUSH",
        location: mockLocation(),
        push: () => {},
        replace: () => {},
        go: () => {},
        goBack: () => {},
        goForward: () => {},
        block: (() => {}) as any,
        listen: (() => {}) as any,
        createHref: () => ""
    };
    return Object.assign(template, params);
}

export function mockEvent() {
    return {
        preventDefault: () => {
        }
    };
}

export function mockAction(): any {
    return {
        type: "some_type_key",
        data: true
    }
}
