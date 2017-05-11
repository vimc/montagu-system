declare module "simple-react-router" {
    import { Component } from "react";

    type ComponentConstructor = new (...args: any[]) => Component<any, any>;

    export type RouteMap = (path: string, component: ComponentConstructor, params?: any) => void;

    export abstract class Router<RoutingProperties> extends Component<RoutingProperties, any> {
        component: Component<any, any>;

        routes(map: RouteMap): void;

        getRoutes(map: RouteMap, props: RoutingProperties): void;

        redirectTo(href: String, replace: Boolean): void;
    }
    export class Link extends Component<any, any> {
        onClick(e: React.MouseEvent<any>): void;
    }

    export interface Location<T> {
        hash: string;
        params: T;
        pathName: string;
        query: any;
    }
}