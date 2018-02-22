declare module "react-bootstrap-toggle" {
    import {Component} from "react";

    export interface ToggleProperties {
        onClick: () => any;
        on: JSX.Element;
        off: JSX.Element;
        size: string;
        offstyle: string;
        onstyle: string;
        active: boolean;
    }

    class Toggle extends Component<ToggleProperties, any> {
    }

    export default Toggle;
}