import { Location } from 'simple-react-router';

export function mockLocation(): Location<undefined> {
    return {
        hash: "hash",
        params: undefined,
        pathName: "/some/path",
        query: null
    };
}