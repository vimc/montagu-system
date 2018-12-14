import * as React from "react";
import {ChangeEvent} from "react";
import {branch, compose, renderNothing} from "recompose";
import {connect} from 'react-redux';
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {Dispatch} from "redux";
import {BurdenOutcome} from "../../../actionTypes/EstimateTypes";
import {estimatesActionCreators} from "../../../actions/estimatesActionCreators";
import {isNullOrUndefined} from "util";
import {ScenarioChart} from "./ScenarioChart";
import withLifecycle, {LifecycleMethods} from "@hocs/with-lifecycle";
import {FormGroup, Input, Label} from "reactstrap";
import {ILookup} from "../../../../shared/models/Lookup";
import {DataPoint} from "../../../reducers/estimatesReducer";
import {NumberRange} from "../../../../shared/models/Generated";

export interface DiagnosticSectionPublicProps {
    scenarioId: string,
    setId: number
}

export interface DiagnosticSectionProps {
    getData: (outcome: BurdenOutcome,
              scenarioId: string,
              setId: number) => void;
    deaths: ILookup<DataPoint[]>;
    dalys: ILookup<DataPoint[]>;
    cases: ILookup<DataPoint[]>;
    ages: NumberRange;
    years: NumberRange;
    scenarioId: string,
    setId: number
}

interface DiagnosticSectionState {
    outcome: BurdenOutcome
}

export class DiagnosticSectionComponent extends React.Component<DiagnosticSectionProps, DiagnosticSectionState> {

    constructor(){
        super();
        this.state = {
            outcome: BurdenOutcome.DEATHS
        }
    }

    onChangeOutcome(e: ChangeEvent<HTMLInputElement>){
        this.setState({
            outcome : e.target.value as BurdenOutcome
        });
    }

    render() {
        let data = null;
        switch(this.state.outcome){
            case BurdenOutcome.DEATHS:
                data = this.props.deaths;
                break;
            case BurdenOutcome.DALYS:
                data = this.props.dalys;
                break;
            case BurdenOutcome.CASES:
                data = this.props.cases
        }

        return <div className={"mt-5"}>
            <h2>Diagnostics</h2>
            <p>As a quick check on your most recently uploaded estimates for this scenario, the following graph shows
                key outcomes aggregated across all countries, disaggregated by age.</p>
            <FormGroup>
                <Label for="outcome">Burden outcome:</Label>
                <Input type="select" name="outcome" id="outcome" style={{width: "100px"}}
                       defaultValue={"deaths"} onChange={this.onChangeOutcome.bind(this)}>
                    <option value={"deaths"}>Deaths</option>
                    <option value={"cases"}>Cases</option>
                    <option value={"dalys"}>Dalys</option>
                </Input>
            </FormGroup>
            <ScenarioChart scenarioId={this.props.scenarioId}
                           setId={this.props.setId}
                           ages={this.props.ages}
                           years={this.props.years}
                           data={data}
                           outcome={this.state.outcome}/>
        </div>
    }
}

const mapStateToProps = (state: ContribAppState, props: DiagnosticSectionPublicProps): Partial<DiagnosticSectionProps> => {

    const expectations = state.responsibilities.responsibilitiesSet &&
        state.responsibilities.responsibilitiesSet.expectations
            .find(e => e.applicable_scenarios.indexOf(props.scenarioId) > -1)
            .expectation;

    return {
        scenarioId: props.scenarioId,
        dalys: state.estimates.dalys && state.estimates.dalys[props.setId],
        deaths: state.estimates.deaths && state.estimates.deaths[props.setId],
        cases: state.estimates.cases && state.estimates.cases[props.setId],
        ages: expectations && expectations.ages,
        years: expectations && expectations.years
    };
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<DiagnosticSectionProps> => {
    return {
        getData: (outcome: BurdenOutcome,
                  scenarioId: string,
                  setId: number) => dispatch(estimatesActionCreators.getEstimates(outcome, scenarioId, setId))
    }
};

const lifecyleProps: Partial<LifecycleMethods<DiagnosticSectionProps>> = {
    onDidMount(props: DiagnosticSectionProps) {
        props.getData(BurdenOutcome.DEATHS, props.scenarioId, props.setId);
        props.getData(BurdenOutcome.DALYS, props.scenarioId, props.setId);
        props.getData(BurdenOutcome.CASES, props.scenarioId, props.setId);
    }
};


export const DiagnosticSection = compose<DiagnosticSectionProps, DiagnosticSectionPublicProps>(
    connect(mapStateToProps, mapDispatchToProps),
    withLifecycle(lifecyleProps)
)(DiagnosticSectionComponent);