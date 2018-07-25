import * as React from "react";
import {CohortRestriction, ExpectationMapping, NumberRange} from "../../../../shared/models/Generated";
import {CountriesList} from "./CountriesList";

export class ExpectationsDescription extends React.PureComponent<ExpectationMapping> {

    render(): JSX.Element {

        const expectation = this.props.expectation;
        const numCountries = expectation.countries.length;
        const numYears = expectation.years.maximum_inclusive - expectation.years.minimum_inclusive + 1;
        const numAges = expectation.ages.maximum_inclusive - expectation.ages.minimum_inclusive + 1;

        const cohorts = this.cohortsText();

        return <div className="mt-3 mb-5 p-3 border">
            <div className="h3">Template for {this.applicableScenarios()}</div>
            <div>
                Expecting data on:
                <ul id={"outcomes"}>
                    {expectation.outcomes.map(o => <li>{o}</li>)}
                </ul>
                For all combinations of:
                <ul>
                    <li id={"countries"}>{numCountries} countries: <CountriesList targetKey={`countries-${expectation.id}`}
                                                                                  countries={expectation.countries} /></li>
                    <li id={"years"}>{numYears} years: {rangeAsString(expectation.years)}</li>
                    <li id={"ages"}>{numAges} ages: {rangeAsString(expectation.ages)}</li>
                    {cohorts && <li id={"cohorts"}>{cohorts}</li>}
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

    cohortsText(){
        const cohorts = this.props.expectation.cohorts;
        if (cohorts.maximum_birth_year == null){
            if (cohorts.minimum_birth_year == null){
                return null
            }
            else {
                return `Not including cohorts born before ${cohorts.minimum_birth_year}`
            }
        }
        else if (cohorts.minimum_birth_year == null){
            return `Not including cohorts born after ${cohorts.maximum_birth_year}`
        }
        return `Not including cohorts born before ${cohorts.minimum_birth_year} or after ${cohorts.maximum_birth_year}`
    }
}

function rangeAsString(range: NumberRange) {
    return `${range.minimum_inclusive} - ${range.maximum_inclusive}`
}