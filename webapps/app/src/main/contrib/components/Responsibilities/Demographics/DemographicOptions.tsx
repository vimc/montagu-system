import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";
import { Action, Dispatch } from "redux";

import { GenderControl } from "./GenderControl";
import { DemographicDataset } from "../../../../shared/models/Generated";
import { FormatControl } from "../FormatControl";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {demographicActionCreators} from "../../../actions/demographicActionCreators";

export interface DemographicOptionsProps {
    dataSets: DemographicDataset[];
    selectedDataSet: DemographicDataset;
    selectedGender: string;
    selectedFormat: string;
    onSelectDataSet: any;
    onSelectGender: any;
    onSelectFormat: any;
}

export class DemographicOptionsComponent extends React.Component<DemographicOptionsProps> {

    render() {
        const props = this.props;

        const statisticTypes = props.dataSets.map(x =>
            <option key={x.id} value={x.id}>
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

export const mapStateToProps = (state: ContribAppState): Partial<DemographicOptionsProps> => {
    console.log(2226, state)
    return {
        dataSets: state.demographic.dataSets,
        selectedDataSet: state.demographic.selectedDataSet,
        selectedGender: state.demographic.selectedGender,
        selectedFormat: state.demographic.selectedFormat,
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<DemographicOptionsProps> => {
    return {
        onSelectDataSet: (e: React.ChangeEvent<HTMLSelectElement>) => {
            dispatch(demographicActionCreators.setDataSet(e.target.value));
            dispatch(demographicActionCreators.getOneTimeToken());
        },
        onSelectGender: (gender: string) => {
            dispatch(demographicActionCreators.setGender(gender));
            dispatch(demographicActionCreators.getOneTimeToken());
        },
        onSelectFormat: (format: string) => {
            dispatch(demographicActionCreators.setFormat(format));
            dispatch(demographicActionCreators.getOneTimeToken());
        }
    }
};

export const DemographicOptions = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: DemographicOptionsProps) => !props.dataSets, renderComponent(LoadingElement))
)(DemographicOptionsComponent) as React.ComponentClass<Partial<DemographicOptionsProps>>;

