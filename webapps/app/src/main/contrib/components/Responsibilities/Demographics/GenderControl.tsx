import * as React from "react";
import { DemographicStatisticType } from "../../../../shared/models/Generated";
import ReactRadioButtonGroup, { RadioButtonOption } from "react-radio-button-group";

const styles = require("../Responsibilities.css");

interface Props {
    dataSet: DemographicStatisticType;
    value: string;
    onSelectGender: (gender: string) => void;
}

export class GenderControl extends React.Component<Props, undefined> {
    constructor() {
        super();
    }

    static genderApplicable(dataSet: DemographicStatisticType): boolean {
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
                groupClassName={styles.radioOptions}
            />;
        } else {
            return <span>Gender is not applicable / no gender options available</span>;
        }
    }
}