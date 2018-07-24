import {Location} from "history";
import {match, MemoryRouter, Router, RouterChildContext} from 'react-router';

import {emptyOneTimeTokenData, OneTimeToken, OneTimeTokenData} from "../../main/report/models/OneTimeToken";

export function mockLocation(params?: Partial<Location>): Location {
    return Object.assign({
        hash: "hash",
        search: "",
        pathname: "/some/path",
        state: undefined
    }, params);
}

export function mockMatch<P>(params?: P): match<P> {
    return {
        params: params || null,
        isExact: true,
        path: "/some/path",
        url: "/some/url"
    };
}

export function mockHistory(params?: any) {
    return Object.assign({
        length: 1,
        action: "",
        location: "",
        push: () => {
        },
        replace: () => {
        },
        go: () => {
        },
        goBack: () => {
        },
        goForward: () => {
        },
        block: () => {
        },
        listen: () => {
        },
        createHref: () => {
        }
    }, params);
}

export function mockEvent() {
    return {
        preventDefault: () => {
        }
    };
}

export function mockOneTimeTokenData(props: any): OneTimeTokenData {
    return Object.assign(emptyOneTimeTokenData(), props);
}

export function mockOneTimeToken(url: string): OneTimeToken {
    return {
        raw: "TOKEN",
        data: mockOneTimeTokenData({url: url})
    };
}

export function mockAction(): any {
    return {
        type: "some_type_key",
        data: true
    }
}
