import { Location } from "history";
import {match} from 'react-router';

import * as models from "../../main/shared/models/Generated";
import { alt } from "../../main/shared/alt";
import { makeLoadable } from "../../main/contrib/stores/Loadable";
import { ILookup } from "../../main/shared/models/Lookup";
import { emptyOneTimeTokenData, OneTimeToken, OneTimeTokenData } from "../../main/report/models/OneTimeToken";

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
        go: () => {},
        goBack: () => {},
        goForward: () => {},
        block: () => {},
        listen: () => {},
        createHref: () => {}
    }, params);
}

export function setupMainStore(config: {
    diseases?: models.Disease[],
    groups?: models.ModellingGroup[]
})
{
    alt.bootstrap(JSON.stringify({
        MainStore: {
            diseases: makeLoadable<models.Disease>(config.diseases),
            modellingGroups: makeLoadable<models.ModellingGroup>(config.groups),
        }
    }));
}

export function setupStores(config: {
    diseases?: models.Disease[],
    groups?: models.ModellingGroup[],
    touchstones?: models.Touchstone[],
})
{
    alt.bootstrap(JSON.stringify({
        MainStore: {
            diseases: makeLoadable<models.Disease>(config.diseases),
            modellingGroups: makeLoadable<models.ModellingGroup>(config.groups),
        },
        ResponsibilityStore: {
            touchstones: config.touchstones,
        }
    }));
}

export function mockEvent() {
    return {
        preventDefault: () => {
        }
    };
}

export function withMockLocalStorage(contents: ILookup<string>, test: () => void) {
    const mutableGlobal = global as any;
    mutableGlobal.Storage = true;
    mutableGlobal.localStorage = {
        getItem: function (key: string) {
            return contents[key];
        },
        setItem: function (key: string, value: any) {
            contents[key] = value;
        },
        removeItem: function (key: string) {
            delete contents[key];
        },
        clear: function() {
            contents = {};
        }
    };
    try {
        test()
    } finally {
        delete mutableGlobal.Storage;
        delete mutableGlobal.localStorage;
    }
}

export function mockOneTimeTokenData(props: any): OneTimeTokenData {
    return Object.assign(emptyOneTimeTokenData(), props);
}

export function mockOneTimeToken(url: string): OneTimeToken {
    return {
        raw: "TOKEN",
        data: mockOneTimeTokenData({ url: url })
    };
}