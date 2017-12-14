import * as React from "react";
import { demographicActions } from "../../../actions/DemographicActions";
import { GenderControl } from "./GenderControl";
import { DemographicDataset } from "../../../../shared/models/Generated";
import { demographicStore } from "../../../stores/DemographicStore";
import { doNothing } from "../../../../shared/Helpers";
import { FormatControl } from "../FormatControl";

import "../../../../shared/styles/common.scss";
import "../Responsibilities.scss";

interface Props extends HasFormatOption {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
}

export interface HasFormatOption {
    selectedFormat: string;
}

export class DemographicOptions extends React.Component<Props, undefined> {
    onSelectDataSet(e: React.ChangeEvent<HTMLSelectElement>) {
        demographicActions.selectDataSet(e.target.value);
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    onSelectGender(gender: string) {
        demographicActions.selectGender(gender);
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    onSelectFormat(format: string) {
        demographicActions.selectFormat(format);
        demographicStore.fetchOneTimeToken().catch(doNothing);
    }

    render() {
        const props = this.props;

        const statisticTypes = props.dataSets.map(x =>
            <option key={x.id} value={x.id}>
                {x.name}
            </option>
        );

        const selectedId = props.selectedDataSet != null ? props.selectedDataSet.id : "";
        return <table className="options table table-responsive table-bordered">
            <tbody>
            <tr className="specialColumn">
                <td>
                    <label className="col-form-label">
                        Statistic type
                    </label>
                </td>
                <td>
                    <div className="col">
                        <select
                            className="form-control"
                            onChange={this.onSelectDataSet}
                            value={selectedId}>
                            <option value="">- Select -</option>
                            {statisticTypes}
                        </select>
                    </div>
                </td>
            </tr>
            <tr className="specialColumn">
                <td>
                    <label className="col-form-label">
                        Gender
                    </label>
                </td>
                <td><GenderControl
                    dataSet={props.selectedDataSet}
                    value={props.selectedGender}
                    onSelectGender={this.onSelectGender}/>
                </td>
            </tr>
            <tr className="specialColumn">
                <td>
                    <label className="col-form-label">
                        Format
                    </label>
                </td>
                <td><FormatControl
                    value={props.selectedFormat}
                    onSelectFormat={this.onSelectFormat}/>
                </td>
            </tr>
            </tbody>
        </table>
    }
}
