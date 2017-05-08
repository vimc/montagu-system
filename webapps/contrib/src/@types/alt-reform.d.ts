declare module "alt-reform" {
    import * as React from 'react';

    type ComponentConstructor<TProps, TState> = new (...args: any[]) => React.Component<TProps, TState>;

    export interface Reform {
        store: any;
        submit: (e: any) => void;
        cancel: () => void;
        validate: () => void;
        normalize: () => void;
        change: (state: any) => void;
        fields: any;
    }

    export interface ReformProps {
        store: any;

        submit: (e: any) => void;
        cancel: () => void;
        validate: () => void;
        normalize: () => void;
        change: (state: any) => void;

        fields: any;
        errors: any;
        touched: string[];
        loading: boolean;
    }

    function AltReform(namespace: string, alt: any, options: any): Reform;
    function FormActions(namespace: string): any;

    export function FormConnector<TForm extends Reform, TProps, TState>(form: TForm):
        (component: (new () => React.Component<TProps, TState>)) => ComponentConstructor<undefined, undefined>

    export default AltReform;
}