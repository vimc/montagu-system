import * as React from "react";
import {ResearchModel} from "../../../../shared/models/Generated";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {connect} from "react-redux";
import {Res} from "awesome-typescript-loader/dist/checker/protocol";
import {ILookup} from "../../../../shared/models/Lookup";

interface ModelMetaProps {
    models: ResearchModel[]
}

interface State {
    data: ResearchModel[]
    cols: ILookup<boolean>
}

class Model implements ResearchModel {
    citation: string | null;
    description: string;
    id: string;
    modelling_group: string;
}

export class ModelMetaTableComponent extends React.Component<ModelMetaProps, State> {

    constructor(props: ModelMetaProps) {
        super(props);

        this.state = {data: props.models, cols: {}};
        this.onSort = this.onSort.bind(this)
    }

    onSort(sortKey: keyof ResearchModel) {
        this.state.cols[sortKey] = !this.state.cols[sortKey];

        const ascending = this.state.cols[sortKey] ? 1 : -1;
        const data = this.state.data;
        data.sort((a, b) => ascending * a[sortKey].localeCompare(b[sortKey]));
        this.setState({data});
    }

    render() {
        return <table>
            <thead>
            <tr>
                <th onClick={() => this.onSort('modelling_group')}>Group</th>
                <th onClick={() => this.onSort('id')}>Model Name</th>
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
    }
}

export const mapStateToProps = (state: AdminAppState): ModelMetaProps => {
    return {
        models: state.groups.models
    }
};

export const ModelMetaTable = connect(mapStateToProps)(ModelMetaTableComponent);