declare module '@hocs/with-lifecycle'{

    import {Component} from "react";

    class WithLifecycle<TProps> extends Component<TProps, any> { }

    export interface LifecycleMethods<TProps> {
        onWillMount: (props: TProps) => any
        onDidMount: (props: TProps) => any
        onWillReceiveProps: (oldProps: TProps, newProps: TProps) => any
    }

    export function withLifecycle<TProps>(methods: Partial<LifecycleMethods<TProps>>) : (target: Component) =>
        WithLifecycle<TProps>

    export default withLifecycle
}