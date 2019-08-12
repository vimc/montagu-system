import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {connect} from "react-redux";
import {ILookup} from "../../../../shared/models/Lookup";
import {UncontrolledTooltip} from "reactstrap";

interface ModelMetaRow {
    code: string | null
    is_dynamic: boolean
    citation: string;
    gender: string | null;
    gender_specific: boolean | null;
    id: string;
    modelling_group: string;
    disease: string;
    max_countries: number | null;
    years: string;
    ages: string;
    cohorts: string;
    outcomes: string;
    has_dalys: boolean;
    scenario_count: number;
    scenarios: string[];
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
    if (typeof a == "number" || typeof b == "number") {
        if (a == null) {
            return 1;
        }
        if (b == null) {
            return -1;
        }
        return (a as number) - (b as number)
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

    createHeader = (key: keyof ModelMetaRow, displayName: string, minWidth: string) => {
        return <th className={"sortable " + this.calculateClass(key)}
                   style={{minWidth: minWidth}}
                   onClick={() => this.onSort(key)}>{displayName}</th>
    };

    render() {

        return <div>
            <p>Click on a column header to sort</p>
            <table>
                <thead>
                <tr>
                    {this.createHeader("modelling_group", "Group", "7em")}
                    {this.createHeader("id", "Model Name", "10em")}
                    {this.createHeader("disease", "Disease", "8em")}
                    {this.createHeader("is_dynamic", "Model Type", "9em")}
                    {this.createHeader("scenario_count", "Scenarios", "8.5em")}
                    {this.createHeader("code", "Code", "6em")}
                    {this.createHeader("gender", "Gender", "7em")}

                    {this.createHeader("max_countries", "Max Countries", "10.5em")}
                    {this.createHeader("years", "Years", "6.5em")}
                    {this.createHeader("ages", "Ages", "6em")}
                    {this.createHeader("cohorts", "Cohorts", "7.5em")}
                    {this.createHeader("outcomes", "Outcomes", "8.5em")}
                    {this.createHeader("has_dalys", "DALYs", "7em")}
                </tr>
                </thead>
                <tbody>
                {this.state.data.map(function (model: ModelMetaRow, index: number) {
                    const scenarioDetailsLink = model.scenario_count > 0 ?
                        <div><a href="#" id={`scenario-details-link-${index}`}>view</a></div> : "";

                    const scenarioDetailsTooltip = model.scenario_count > 0 ?
                        <UncontrolledTooltip  target={`scenario-details-link-${index}`}
                                              className={"model-meta-tooltip"}
                                              placement={"right"}>
                            {
                                model.scenarios.map(function(scenario: string, index: number) {
                                    return (<div>{scenario}</div>);
                                })
                            }
                        </UncontrolledTooltip> : "";

                    return (
                        <tr key={index} data-item={model}>
                            <td data-title="group">{model.modelling_group}</td>
                            <td data-title="name">{model.id}</td>
                            <td data-title="disease">{model.disease}</td>
                            <td data-title="type">{model.is_dynamic ? "Dynamic" : "Static"}</td>
                            <td data-title="scenarios">{`${model.scenario_count} scenario` +
                                                            (model.scenario_count === 1 ? "" : "s")}
                                {scenarioDetailsLink}
                            </td>
                            <td data-title="code">{model.code}</td>
                            <td data-title="gender">{model.gender ? model.gender : "NA"}</td>
                            <td data-title="max_countries">{model.max_countries}</td>
                            <td data-title="years">{model.years}</td>
                            <td data-title="ages">{model.ages}</td>
                            <td data-title="cohorts">{model.cohorts}</td>
                            <td data-title="outcomes">{model.outcomes}</td>
                            <td data-title="dalys">{model.has_dalys ? "Yes" : "No"}</td>
                            {scenarioDetailsTooltip}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

    }
}


export const mapStateToProps = (state: AdminAppState): ModelMetaProps => {

    const expectationNotFound  = "Error: expectation not found for model";

    return {
        models: state.groups.models.map(m => {
            const modelValues = {
                ...m,
                code: m.current_version.code,
                is_dynamic: m.current_version.is_dynamic,
                disease: m.disease.name,
                max_countries: m.current_version ? m.current_version.countries.length : null
            };

            const filteredExpectations = state.groups.expectations
                .filter(e => e.modelling_group == m.modelling_group && e.disease == m.disease.id)
                .sort((a,b) => a.touchstone_version < b.touchstone_version ? 1 : -1); //sort by touchstone version desc

            const modelExpectation = filteredExpectations.length ? filteredExpectations[0] : null;

            if (modelExpectation) {
                const expectation = modelExpectation.expectation;

                const cohorts = (expectation.cohorts.minimum_birth_year && expectation.cohorts.maximum_birth_year) ?
                    `${expectation.cohorts.minimum_birth_year} - ${expectation.cohorts.maximum_birth_year}` :
                    (expectation.cohorts.minimum_birth_year) ? `Min ${expectation.cohorts.minimum_birth_year}` :
                        (expectation.cohorts.maximum_birth_year) ? `Max ${expectation.cohorts.maximum_birth_year}` :
                            "Any";

                return {
                    ...modelValues,
                    outcomes: expectation.outcomes.join(", "),
                    has_dalys: expectation.outcomes.indexOf("dalys") > -1,
                    years: `${expectation.years.minimum_inclusive} - ${expectation.years.maximum_inclusive}`,
                    ages: `${expectation.ages.minimum_inclusive} - ${expectation.ages.maximum_inclusive}`,
                    cohorts: cohorts,
                    scenario_count: modelExpectation.applicable_scenarios.length,
                    scenarios: modelExpectation.applicable_scenarios
                }
            } else {
                return {
                    ...modelValues,
                    outcomes: expectationNotFound,
                    has_dalys: false,
                    years: expectationNotFound,
                    ages: expectationNotFound,
                    cohorts: expectationNotFound,
                    scenario_count: 0,
                    scenarios: []
                }
            }

        })
    }
};

export const ModelMetaTable = connect(mapStateToProps)(ModelMetaTableComponent);