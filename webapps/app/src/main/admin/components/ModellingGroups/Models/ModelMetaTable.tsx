import * as React from "react";
import {ResearchModel} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {connect} from "react-redux";
import {ILookup} from "../../../../shared/models/Lookup";

interface ModelMetaProps {
    models: ResearchModel[]
}

interface State {
    cols: ILookup<boolean>
    data: ResearchModel[]
}

export class ModelMetaTableComponent extends React.Component<ModelMetaProps, State> {

    constructor(props: ModelMetaProps) {
        super(props);

        this.state = {cols: {}, data: []};
        this.onSort = this.onSort.bind(this)
    }

    static getDerivedStateFromProps(props: ModelMetaProps, state: State) {
        return {
            cols: state.cols,
            data: props.models
        };
    }

    onSort(sortKey: keyof ResearchModel) {

        const cols: ILookup<boolean> = {};
        cols[sortKey] = !this.state.cols[sortKey];

        const ascending = cols[sortKey] ? 1 : -1;
        this.setState({
            cols: {...cols},
            data: this.state.data.sort((a, b) => ascending * a[sortKey].localeCompare(b[sortKey]))
        });
    }

    render() {
        return <div>
            <p>Click on a column header to sort</p>
            <table>
                <thead>
                <tr>
                    <th className="sortable" onClick={() => this.onSort('modelling_group')}>Group</th>
                    <th className="sortable" onClick={() => this.onSort('id')}>Model Name</th>
                    {/*<th onClick={() => this.onSort('disease')}>Disease</th>*/}
                    {/*<th onClick={() => this.onSort('type')}>Model Type</th>*/}
                    {/*<th onClick={() => this.onSort('code')}>Code</th>*/}
                    {/*<th>Max Countries</th>*/}
                    {/*<th>Years</th>*/}
                    {/*<th>Ages</th>*/}
                    {/*<th>Cohorts</th>*/}
                    {/*<th>Outcomes</th>*/}
                    {/*<th>DALYs</th>*/}
                </tr>
                </thead>
                <tbody>
                {this.state.data.map(function (model: ResearchModel, index: number) {
                    return (
                        <tr key={index} data-item={model}>
                            <td data-title="group">{model.modelling_group}</td>
                            <td data-title="name">{model.id}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

    }
}

export const mapStateToProps = (state: AdminAppState): ModelMetaProps => {
    return {
        models: state.groups.models
    }
};

export const ModelMetaTable = connect(mapStateToProps)(ModelMetaTableComponent);