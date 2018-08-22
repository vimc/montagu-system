import {Location} from "history";
import {match} from 'react-router';

import {emptyOneTimeTokenData, OneTimeToken, OneTimeTokenData} from "../../main/report/models/OneTimeToken";

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

export function mockHistory(params?: any) {
    return Object.assign({
        length: 1,
        action: "",
        location: "",
        push: () => {},
        replace: () => {},
        block: () => {}}, params);
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

export function mockAction(): any {
    return {
        type: "some_type_key",
        data: true
    }
}
