declare module "simple-react-router" {
    import { Component } from 'react'

    export type ComponentConstructor = new (...args: any[]) => Component<any, any>;
    export type RouteMap = (path: string, component: ComponentConstructor, params?: any) => void;

    export abstract class Router extends Component<any, any> {
        abstract routes(map: RouteMap): void;
    }
    export class Link extends Component<any, any> {}
}