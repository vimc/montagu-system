import * as React from "react";
import { DemographicDataset } from "../../../../shared/models/Generated";
import ReactRadioButtonGroup, { RadioButtonOption } from "react-radio-button-group";

const styles = require("../Responsibilities.css");

interface Props {
    dataSet: DemographicDataset;
    value: string;
    onSelectGender: (gender: string) => void;
}

export class GenderControl extends React.Component<Props, undefined> {
    constructor() {
        super();
    }

    static genderApplicable(dataSet: DemographicDataset): boolean {
        return dataSet != null
            && dataSet.gender_is_applicable
    }

    render() {
        if (GenderControl.genderApplicable(this.props.dataSet)) {
            const genders: RadioButtonOption[] = [
                { value: "both", label: "Both" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" }
            ];
            return <ReactRadioButtonGroup
                name="gender"
                options={genders}
                value={this.props.value}
                onChange={this.props.onSelectGender}
                groupClassName="col"
                itemClassName="form-check-label form-check-inline"
                inputClassName="form-check-input"
                labelClassName="mb-0"
            />;
        } else {
            return <div className="col">Gender is not applicable / no gender options available</div>;
        }
    }
}