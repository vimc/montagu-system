import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {connect} from "react-redux";
import {ILookup} from "../../../../shared/models/Lookup";

interface ModelMetaRow {
    code: string | null
    is_dynamic: boolean
    citation: string;
    gender: string | null;
    gender_specific: boolean | null;
    id: string;
    modelling_group: string;
    cohorts: string;
    outcomes: string;
    has_dalys: boolean;
}

interface ModelMetaProps {
    models: ModelMetaRow[]
}

interface State {
    cols: ILookup<boolean>
    data: ModelMetaRow[]
}

function compare(a: unknown, b: unknown) {
    if (typeof a == "boolean" || a == null || b == null) {
        return (a === b) ? 0 : a ? -1 : 1;
    }
    if (typeof a == "string") {
        return a.localeCompare(b as string)
    }
    return 0
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

    onSort(sortKey: keyof ModelMetaRow) {

        const cols: ILookup<boolean> = {...this.state.cols};
        cols[sortKey] = !this.state.cols[sortKey];

        const ascending = cols[sortKey] ? 1 : -1;
        this.setState({
            cols: {...cols},
            data: this.state.data.sort((a, b) => ascending * compare(a[sortKey as keyof ModelMetaRow],
                b[sortKey as keyof ModelMetaRow]))
        });
    }

    calculateClass(id: string) {
        if (this.state.cols[id] === true) {
            return "asc"
        }
        if (this.state.cols[id] === false) {
            return "desc"
        }
        return ""
    }

    createHeader = (key: keyof ModelMetaRow, displayName: string, limitWidth: boolean = false) => {
        return <th className={"sortable " + this.calculateClass(key) +
                        limitWidth ? " modelMetaLimitedWidthHeader" : ""}
                   onClick={() => this.onSort(key)}>{displayName}</th>
    };

    render() {

        return <div>
            <p>Click on a column header to sort</p>
            <table>
                <thead>
                <tr>
                    {this.createHeader("modelling_group", "Group")}
                    {this.createHeader("id", "Model Name")}
                    {/*{this.createHeader("disease", "Disease")}*/}
                    {this.createHeader("is_dynamic", "Model Type")}
                    {this.createHeader("code", "Code")}
                    {this.createHeader("gender", "Gender")}

                    {/*<th>Max Countries</th>*/}
                    {/*<th>Years</th>*/}
                    {/*<th>Ages</th>*/}
                    {this.createHeader("cohorts", "Cohorts")}
                    {this.createHeader("outcomes", "Outcomes", true)}
                    {this.createHeader("has_dalys", "DALYs")}
                </tr>
                </thead>
                <tbody>
                {this.state.data.map(function (model: ModelMetaRow, index: number) {
                    return (
                        <tr key={index} data-item={model}>
                            <td data-title="group">{model.modelling_group}</td>
                            <td data-title="name">{model.id}</td>
                            <td data-title="type">{model.is_dynamic ? "Dynamic" : "Static"}</td>
                            <td data-title="code">{model.code}</td>
                            <td data-title="gender">{model.gender ? model.gender : "NA"}</td>
                            <td data-title="cohorts">{model.cohorts}</td>
                            <td data-title="outcomes" className="modelMetaLimitedWidthCell">{model.outcomes}</td>
                            <td data-title="dalys">{model.has_dalys ? "Yes" : "No"}</td>
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
        models: state.groups.models.map(m => {
            //TODO: get disease from model - what if not found?
            const expectation = state.groups.expectations.find(e => e.modelling_group == m.modelling_group
                && e.disease == "YF").expectations;
            const cohorts = (expectation.cohorts.minimum_birth_year && expectation.cohorts.maximum_birth_year) ?
                    `${expectation.cohorts.minimum_birth_year} - ${expectation.cohorts.maximum_birth_year}` :
                (expectation.cohorts.minimum_birth_year) ? `Min ${expectation.cohorts.minimum_birth_year}` :
                (expectation.cohorts.maximum_birth_year) ? `Max ${expectation.cohorts.maximum_birth_year}` :
                "Any";
            return {
                ...m,
                code: m.current_version.code,
                is_dynamic: m.current_version.is_dynamic,
                outcomes: expectation.outcomes.join(", "),
                has_dalys: expectation.outcomes.find(o => o =="dalys"),
                cohorts: cohorts
            }})
    }
};

export const ModelMetaTable = connect(mapStateToProps)(ModelMetaTableComponent);