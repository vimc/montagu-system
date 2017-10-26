import * as React from "react";
import ReactRadioButtonGroup, { RadioButtonOption } from "react-radio-button-group";

const styles = require("./Responsibilities.css");

interface Props {
    value: string;
    onSelectFormat: (format: string) => void;
}

export class FormatControl extends React.Component<Props, undefined> {
    constructor() {
        super();
    }

    render() {

        const formats: RadioButtonOption[] = [
            { value: "long", label: "Long" },
            { value: "wide", label: "Wide" },
        ];

        return <ReactRadioButtonGroup
            name="format"
            options={formats}
            value={this.props.value}
            onChange={this.props.onSelectFormat}
            groupClassName="col"
            itemClassName="form-check-label form-check-inline"
            inputClassName="form-check-input"
            labelClassName="mb-0"
        />;
    }
}