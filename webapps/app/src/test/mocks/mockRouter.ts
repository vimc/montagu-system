import {IRouter} from "simple-react-router";

export function mockRouter(): IRouter {
    return {
        redirectTo: (href: string, replace: boolean) => {
            //do nothing
        }
    };
}