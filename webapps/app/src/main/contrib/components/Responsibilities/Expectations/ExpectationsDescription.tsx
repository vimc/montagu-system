import * as React from "react";
import {Country, ExpectationMapping, NumberRange} from "../../../../shared/models/Generated";
import {Popover, PopoverBody} from "reactstrap";

interface State {
    showCountries: boolean;
}

interface Props {
    countries: Country[]
    targetKey: string;
}

export class CountriesList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            showCountries: false
        };
    }

    toggle() {
        this.setState({
            showCountries: !this.state.showCountries
        });
    }

    render() {
        const countriesList = this.props.countries.map(c => c.name).join(", ");

        return <span><a href="#" id={this.props.targetKey}
                       onClick={this.toggle}>view list</a>
            <Popover placement="right" isOpen={this.state.showCountries} target={this.props.targetKey}
                     toggle={this.toggle}>
                <PopoverBody>{countriesList}</PopoverBody>
            </Popover></span>
    }
}

export class ExpectationsDescription extends React.Component<ExpectationMapping, State> {

    render(): JSX.Element {

        const expectation = this.props.expectation;
        const numCountries = expectation.countries.length;
        const numYears = expectation.years.maximum_inclusive - expectation.years.minimum_inclusive + 1;
        const numAges = expectation.ages.maximum_inclusive - expectation.ages.minimum_inclusive + 1;
        const numCohorts = expectation.cohorts.maximum_birth_year - expectation.cohorts.minimum_birth_year + 1;
        const numOutcomes = expectation.outcomes.length;

        return <div className="mt-3 mb-5 p-3 border">
            <div className="h3">Template for {this.applicableScenarios()}</div>
            <div>
                Expecting data for:
                <ul>
                    <li id={"years"}>{numYears} years: {rangeAsString(expectation.years)}</li>
                    <li id={"ages"}>{numAges} ages: {rangeAsString(expectation.ages)}</li>
                    {expectation.cohorts.minimum_birth_year &&
                    <li id={"cohorts"}>{numCohorts} cohorts: {expectation.cohorts.minimum_birth_year} - {expectation.cohorts.maximum_birth_year}</li>}
                    <li id={"countries"}>{numCountries} countries: <CountriesList targetKey={`countries-${expectation.id}`}
                                                                                  countries={expectation.countries} /></li>
                    <li id={"outcomes"}>{numOutcomes} outcomes: {expectation.outcomes.join(", ")}</li>
                </ul>
            </div>
            <div>
                <button>Download template</button>
            </div>
        </div>
    }

    applicableScenarios() {
        return this.props.applicable_scenarios.join(", ");
    }
}

function rangeAsString(range: NumberRange) {
    return `${range.minimum_inclusive} - ${range.maximum_inclusive}`
}