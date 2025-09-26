declare module "react-radio-button-group" {
    import { Component } from "react";

    export interface RadioButtonOption {
        value: string;
        label?: string;
        itemClassName?: string;
        labelClassName?: string;
        inputClassName?: string;
    }

    export interface RadioButtonGroupProperties {
        options: string[] | RadioButtonOption[];
        name: string;
        isStateful?: boolean;
        value?: string;
        onChange?: (value: string) => void;
        fireOnMount?: boolean;
        inputClassName?: string;
        labelClassName?: string;
        itemClassName?: string;
        groupClassName?: string;
    }

    class ReactRadioButtonGroup extends Component<RadioButtonGroupProperties, any> { }
    export default ReactRadioButtonGroup;
}