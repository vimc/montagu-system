import * as React from "react";
import {ILookup} from "../../../../shared/models/Lookup";
import {format} from "d3-format";
import {
    HorizontalGridLines,
    XYPlot,
    VerticalBarSeries,
    Hint,
    VerticalBarSeriesCanvas,
    VerticalGridLines,
    XAxis,
    FlexibleWidthXYPlot,
    YAxis,
    ChartLabel
} from 'react-vis';
import {NumberRange} from "../../../../shared/models/Generated";
import {interpolatePlasma} from "d3-scale-chromatic";
import {DataPoint} from "../../../reducers/estimatesReducer";
import {isNullOrUndefined} from "util";
import {branch, compose, renderComponent} from "recompose";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";

export interface ChartProps {
    data: ILookup<DataPoint[]>;
    ages: NumberRange;
    scenarioId: string,
    setId: number
    outcome: string
}

class ScenarioChartComponent extends React.Component<ChartProps> {

    renderBars() {
        const children = [];
        for (let x = this.props.ages.minimum_inclusive; x <= this.props.ages.maximum_inclusive; x++) {
            const data = this.props.data[x.toString()];
            if (data) {
                children.push(<VerticalBarSeries key={x}
                                                 color={interpolatePlasma(x / this.props.ages.maximum_inclusive)}
                                                 data={this.props.data[x.toString()]}/>)
            }
        }

        return children
    }

    render() {
        const title = `Yearly ${this.props.outcome} across all countries, disaggregated by age`
        return (
            <div className={"bg-light p-3 border border-secondary"}>
                <div className={"mt-2"} style={{fontWeight: "bold"}}>{title}</div>
                <XYPlot height={300} width={600} stackBy="y">
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis title={"Year"} tickFormat={(tick: any) => {
                        return tick.toString();
                    }}/>
                    <YAxis title={""} tickFormat={(tick: any) => {
                        return format('.2s')(tick);
                    }}/>
                    {this.renderBars()}
                </XYPlot>
            </div>
        );
    }
}


function notReady(props: ChartProps): boolean {
    return isNullOrUndefined(props.data);
}

export const ScenarioChart = compose<ChartProps, ChartProps>(
    branch(notReady, renderComponent(LoadingElement))
)(ScenarioChartComponent);

