import * as React from "react";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {connect} from "react-redux";
import {ILookup} from "../../../../shared/models/Lookup";
import {UncontrolledTooltip} from "reactstrap";
import {Country, Outcome, ResearchModelDetails, TouchstoneModelExpectations} from "../../../../shared/models/Generated";

export interface ModelMetaRow {
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
    outcomes_details: Outcome[];
    has_dalys: boolean;
    scenario_count: number;
    scenarios: string[];
    countries: Country[];
}

interface ModelMetaPublicProps {
    obsoleteOnly: boolean,
}

interface ModelMetaProps {
    obsoleteOnly: boolean,
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

function createTooltip(target: string, content: any){
    return <UncontrolledTooltip  target={target}
                                 className={"model-meta-tooltip"}
                                 autohide={false}
                                 placement={"right"}>
        {content}
    </UncontrolledTooltip>
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

    createExpectationHeaders = () => {
        return <React.Fragment>
            {this.createHeader("scenario_count", "Scenarios", "8.5em")}
            {this.createHeader("years", "Years", "6.5em")}}
            {this.createHeader("ages", "Ages", "6em")}
            {this.createHeader("cohorts", "Cohorts", "7.5em")}
            {this.createHeader("outcomes", "Outcomes", "8.5em")}
            {this.createHeader("has_dalys", "DALYs", "7em")}
        </React.Fragment>
    };

    createExpectationCells = (model: ModelMetaRow, index: number) => {
        const scenarioDetailsLink = model.scenario_count > 0 ?
            <div key={`scenario-details-${index}`}><a href="#" id={`scenario-details-link-${index}`}>view</a></div> : "";

        const outcomesDetailsLink = model.outcomes_details.length > 0 ?
            <div key={`outcomes-details-${index}`}><a href="#" id={`outcomes-details-link-${index}`}>definitions</a></div> : "";

        const outcomesDetailsTooltip = model.outcomes_details.length > 0 ?
            createTooltip(`outcomes-details-link-${index}`,
                model.outcomes_details.map(function(outcome: Outcome, outcomeIdx: number) {
                    return (<div key={`outcome-${index}-${outcomeIdx}`}><strong>{`${outcome.code}: `}</strong>{`${outcome.name}`}</div>);
                }))
            : "";

        const scenarioDetailsTooltip = model.scenario_count > 0 ?
            createTooltip(`scenario-details-link-${index}`,
                model.scenarios.map(function (scenario: string, scenarioIdx: number) {
                    return (<div key={`scenario-${index}-${scenarioIdx}`}>{scenario}</div>);
                }))
            : "";

        return <React.Fragment>
            <td data-title="scenarios">{`${model.scenario_count} scenario` + (model.scenario_count === 1 ? "" : "s")}
                {scenarioDetailsLink}
            </td>
            <td data-title="years">{model.years}</td>
            <td data-title="ages">{model.ages}</td> }

            <td data-title="cohorts">{model.cohorts}</td>
            <td data-title="outcomes">{model.outcomes}
                {outcomesDetailsLink}
            </td> }
            <td data-title="dalys">{model.has_dalys ? "Yes" : "No"}</td>
            {scenarioDetailsTooltip}
            {outcomesDetailsTooltip}
        </React.Fragment>
    };

    render() {

        const obsolete = this.props.obsoleteOnly;

        if (obsolete && this.state.data.length == 0) {
            return "";
        }

        return <div>
            {obsolete && <p>The following obsolete models were also found.</p>}
            <p>Click on a column header to sort</p>
            <table className={"model-meta-table"}>
                <thead>
                <tr>
                    {this.createHeader("modelling_group", "Group", "7em")}
                    {this.createHeader("id", "Model Name", "10em")}
                    {this.createHeader("disease", "Disease", "8em")}
                    {this.createHeader("is_dynamic", "Model Type", "9em")}
                    {this.createHeader("code", "Code", "6em")}
                    {this.createHeader("gender", "Gender", "7em")}
                    {this.createHeader("max_countries", "Max Countries", "6.5em")}
                    { obsolete || this.createExpectationHeaders() }
                </tr>
                </thead>
                <tbody>
                {this.state.data.map((model: ModelMetaRow, index: number) =>  {

                    const countriesDetailsLink = model.max_countries > 0 ?
                            <div key={`countries-details-${index}`}><a href="#" id={`countries-details-link-${index}`}>view</a></div> : "";

                    const countriesDetailsTooltip = model.max_countries > 0 ?
                            createTooltip(`countries-details-link-${index}`,
                                model.countries.map(function (country: Country, countryIdx: number) {
                                    return (<div key={`country-${index}-${countryIdx}`}>{`${country.name} (${country.id})`}</div>);
                                }))
                            : "";

                    return (
                        <tr key={index} data-item={model}>
                            <td data-title="group">{model.modelling_group}</td>
                            <td data-title="name">{model.id}</td>
                            <td data-title="disease">{model.disease}</td>
                            <td data-title="type">{model.is_dynamic ? "Dynamic" : "Static"}</td>
                            <td data-title="code">{model.code}</td>
                            <td data-title="gender">{model.gender ? model.gender : "NA"}</td>
                            <td data-title="max_countries">{model.max_countries}
                                {countriesDetailsLink}</td>
                            {obsolete || this.createExpectationCells(model, index)}

                            {countriesDetailsTooltip}
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

    }
}


export const mapStateToProps = (state: AdminAppState, props: ModelMetaPublicProps): Partial<ModelMetaProps> => {

    const modelExpectations: ILookup<TouchstoneModelExpectations[]> = {};
    state.groups.models.forEach((model) => {
        modelExpectations[model.id] = state.groups.expectations
            .filter(e => e.modelling_group == model.modelling_group && e.disease == model.disease.id);
    });

    const includedModels = state.groups.models.filter((model) => {
        //A model is considered obsolete if it has no expectations
        return (props.obsoleteOnly && modelExpectations[model.id].length == 0) ||
            (!props.obsoleteOnly && modelExpectations[model.id].length > 0)
    });

    return {
        obsoleteOnly: props.obsoleteOnly,
        models: includedModels
            .map(m => {
            const modelValues = {
                ...m,
                code: m.current_version.code,
                is_dynamic: m.current_version.is_dynamic,
                disease: m.disease.name,
                max_countries: m.current_version ? m.current_version.countries.length : null,
                countries: m.current_version ? m.current_version.countries.sort((a,b) => a.name > b.name ?  1 : -1)
                                            : []
            };

           if (!props.obsoleteOnly) {
                const modelExpectation = modelExpectations[m.id]
                    .sort((a,b) => a.touchstone_version < b.touchstone_version ? 1 : -1)[0]; //sort by touchstone version desc
                const expectation = modelExpectation.expectation;

                const cohorts = (expectation.cohorts.minimum_birth_year && expectation.cohorts.maximum_birth_year) ?
                    `${expectation.cohorts.minimum_birth_year} - ${expectation.cohorts.maximum_birth_year}` :
                    (expectation.cohorts.minimum_birth_year) ? `Min ${expectation.cohorts.minimum_birth_year}` :
                        (expectation.cohorts.maximum_birth_year) ? `Max ${expectation.cohorts.maximum_birth_year}` :
                            "Any";

                const outcome_codes = expectation.outcomes.map(o => o.code);

                return {
                    ...modelValues,
                    outcomes: outcome_codes.join(", "),
                    outcomes_details: expectation.outcomes,
                    has_dalys: outcome_codes.indexOf("dalys") > -1,
                    years: `${expectation.years.minimum_inclusive} - ${expectation.years.maximum_inclusive}`,
                    ages: `${expectation.ages.minimum_inclusive} - ${expectation.ages.maximum_inclusive}`,
                    cohorts: cohorts,
                    scenario_count: modelExpectation.applicable_scenarios.length,
                    scenarios: modelExpectation.applicable_scenarios
                }
            } else {
                return {
                    ...modelValues,
                    outcomes: null,
                    outcomes_details: [],
                    has_dalys: false,
                    years: null,
                    ages: null,
                    cohorts: null,
                    scenario_count: 0,
                    scenarios: []
                }
            }

        })
    }
};

export const ModelMetaTable = connect(mapStateToProps)(ModelMetaTableComponent);