import * as React from "react";
import { demographicActions } from "../../../actions/DemographicActions";
import { GenderControl } from "./GenderControl";
import { DemographicStatisticType } from "../../../../shared/models/Generated";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

interface Props {
    dataSets: DemographicStatisticType[];
    selectedDataSet: DemographicStatisticType;
    selectedGender: string;
}

export class DemographicOptions extends React.Component<Props, undefined> {
    onSelectDataSet(e: React.ChangeEvent<HTMLSelectElement>) {
        demographicActions.selectDataSet(e.target.value);
    }

    onSelectGender(gender: string) {
        demographicActions.selectGender(gender);
    }

    render() {
        const props = this.props;
        const statisticTypes = props.dataSets.map(x =>
            <option key={x.id} value={x.id}>
                {x.name}
            </option>
        );

        const selectedId = props.selectedDataSet != null ? props.selectedDataSet.id : "";
        return <table className={ styles.options }>
            <tbody>
            <tr className={ commonStyles.specialColumn }>
                <td>Statistic type</td>
                <td>
                    <select
                        className={styles.dataSet}
                        onChange={this.onSelectDataSet}
                        value={selectedId}>
                        <option value="">- Select -</option>
                        {statisticTypes}
                    </select>
                </td>
            </tr>
            <tr className={ commonStyles.specialColumn }>
                <td>Gender</td>
                <td><GenderControl
                    dataSet={props.selectedDataSet}
                    value={props.selectedGender}
                    onSelectGender={this.onSelectGender} />
                </td>
            </tr>
            </tbody>
        </table>
    }
}
