import * as React from "react";
import { demographicActions } from "../../../actions/DemographicActions";
import { GenderControl } from "./GenderControl";
import { DemographicStatisticType } from "../../../../shared/models/Generated";
import { demographicStore } from "../../../stores/DemographicStore";
import { doNothing } from "../../../../shared/Helpers";
import { SourceControl } from "./SourceControl";

const commonStyles = require("../../../../shared/styles/common.css");
const styles = require("../Responsibilities.css");

interface Props {
    dataSets: DemographicStatisticType[];
    selectedDataSet: DemographicStatisticType;
    selectedGender: string;
    selectedSource: string;
}

export class DemographicOptions extends React.Component<Props, undefined> {
    onSelectDataSet(e: React.ChangeEvent<HTMLSelectElement>) {
        demographicActions.selectDataSet(e.target.value);
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    onSelectSource(e: React.ChangeEvent<HTMLSelectElement>) {
        demographicActions.selectSource(e.target.value);
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    onSelectGender(gender: string) {
        demographicActions.selectGender(gender);
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    renderSourceSelect(): JSX.Element {
        const props = this.props;
        if (props.selectedDataSet != null && props.selectedDataSet.sources.length > 1) {
            return <tr className={commonStyles.specialColumn}>
                <td>Source</td>
                <td>
                    <SourceControl
                        dataSet={props.selectedDataSet}
                        onSelectSource={this.onSelectSource}
                        selected={props.selectedSource}/>
                </td>
            </tr>;
        } else {
            return null;
        }
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
            { this.renderSourceSelect() }
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
