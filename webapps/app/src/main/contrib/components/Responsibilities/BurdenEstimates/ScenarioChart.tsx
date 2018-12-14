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
    years: NumberRange;
    scenarioId: string,
    setId: number
    outcome: string
}

class ScenarioChartComponent extends React.Component<ChartProps> {

    ageRange() {
        return this.props.ages.maximum_inclusive - this.props.ages.minimum_inclusive;
    }

    renderBars() {
        const children = [];
        const numChildren = this.ageRange();
        const ages = this.props.ages;
        for (let x = ages.minimum_inclusive; x <= ages.maximum_inclusive; x++) {
            const data = this.props.data[x.toString()];
            if (data) {
                children.push(<VerticalBarSeries key={x}
                                                 color={interpolatePlasma((x - ages.minimum_inclusive) / numChildren)}
                                                 data={this.props.data[x.toString()]}/>)
            }
        }

        return children
    }

    renderKey() {

        const children = [];
        const numChildren = this.ageRange();
        const fraction = (1 / numChildren);
        for (let x = 1; x <= numChildren; x++) {
            children.push(<span key={x} style={{borderRight: `1px solid ${interpolatePlasma(fraction * x)}`}}/>)
        }

        return <div className={"key float-right m-2"}>
            <span>ages:</span>
            <div>0 <span className="float-right">{this.props.ages.maximum_inclusive}</span></div>
            {children}
        </div>
    }

    render() {
        const title = `Yearly ${this.props.outcome} across all countries, disaggregated by age`;
        const yearRange= [this.props.years.minimum_inclusive, this.props.years.maximum_inclusive];
        return (
            <div className={"bg-light p-3 border border-secondary graph-wrapper"}>
                <div className={"m-2 chart-title"}>{title}</div>
                {this.renderKey()}
                <XYPlot height={300} width={600} stackBy="y">
                    <VerticalGridLines/>
                    <HorizontalGridLines/>
                    <XAxis xDomain={yearRange} tickFormat={(tick: any) => {
                        return tick.toString();
                    }}/>
                    <YAxis tickFormat={(tick: any) => {
                        return format('.2s')(tick);
                    }}/>
                    <CustomAxisLabel title={'Year'} xAxis/>
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

const CustomAxisLabel: any = (props: {
    title: string,
    xAxis?: boolean,
    // note these next two are passed down from the parent XYPlot/Flexible*XYPlot
    innerWidth?: number,
    innerHeight?: number
}) => {
    // since we rotate the y label, we have to adjust it to center
    // (ideally we'd rotate about the correct origin, but i couldn't get that working)
    const yLabelOffset = {
        y: props.innerHeight / 2 + props.title.length * 3, // '3' might be different for you depending on your font size/char width
        x: 10
    };

    const xLabelOffset = {
        x: props.innerWidth / 2,
        y: 1.2 * props.innerHeight // 1.2 was enough for me to get it below x axis. you may need a diff't #
    };
    const transform = props.xAxis
        ? `translate(${xLabelOffset.x}, ${xLabelOffset.y})`
        : `translate(${yLabelOffset.x}, ${yLabelOffset.y}) rotate(-90)`;

    return (
        <g transform={transform}>
            <text style={{fontSize: "80%"}}>{props.title}</text>
        </g>
    );
};

CustomAxisLabel.displayName = 'CustomAxisLabel';
CustomAxisLabel.requiresSVG = true;
