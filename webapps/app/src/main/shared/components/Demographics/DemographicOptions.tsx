import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";
import { Dispatch } from "redux";

import { GenderControl } from "./GenderControl";
import {DemographicDataset} from "../../models/Generated";
import {FormatControl} from "../../../contrib/components/Responsibilities/FormatControl";
import {ContribAppState} from "../../../contrib/reducers/contribAppReducers";
import {AdminAppState} from "../../../admin/reducers/adminAppReducers";
import {demographicActionCreators} from "../../actions/demographicActionCreators";
import {LoadingElement} from "../../partials/LoadingElement/LoadingElement";

export interface DemographicOptionsProps {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    onSelectDataSet: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSelectGender: (gender: string) => void;
    onSelectFormat: (gender: string) => void;
}

export class DemographicOptionsComponent extends React.Component<DemographicOptionsProps> {

    render() {
        const props = this.props;

        const statisticTypes = props.dataSets.map(x =>
            <option key={`${x.source}_${x.id}`} value={x.id}>
                {x.name}
            </option>
        );

        const selectedId = props.selectedDataSet != null ? props.selectedDataSet.id : "";
        return <table className="options">
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
                            onChange={this.props.onSelectDataSet}
                            value={selectedId}>
                            <option key="__none__" value="">- Select -</option>
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
                    onSelectGender={this.props.onSelectGender}/>
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
                    onSelectFormat={this.props.onSelectFormat}/>
                </td>
            </tr>
            </tbody>
        </table>
    }
}

export const mapStateToProps = (state: ContribAppState | AdminAppState): Partial<DemographicOptionsProps> => {
    return {
        dataSets: state.demographics.dataSets,
        selectedDataSet: state.demographics.selectedDataSet,
        selectedGender: state.demographics.selectedGender,
        selectedFormat: state.demographics.selectedFormat,
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState | AdminAppState>): Partial<DemographicOptionsProps> => {
    return {
        onSelectDataSet: (e: React.ChangeEvent<HTMLSelectElement>) => {
            dispatch(demographicActionCreators.setDataSet(e.target.value));
        },
        onSelectGender: (gender: string) => {
            dispatch(demographicActionCreators.setGender(gender));
        },
        onSelectFormat: (format: string) => {
            dispatch(demographicActionCreators.setFormat(format));
        }
    }
};

export const DemographicOptions = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: DemographicOptionsProps) => !props.dataSets || !props.dataSets.length, renderComponent(LoadingElement))
)(DemographicOptionsComponent) as React.ComponentClass<Partial<DemographicOptionsProps>>;

