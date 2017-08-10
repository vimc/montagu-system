import * as React from "react";
import { DemographicStatisticType } from "../../../../shared/models/Generated";

interface Props {
    set: DemographicStatisticType;
}

export class DemographicDataSet extends React.Component<Props, undefined> {
    render() {
        return <a href="#">{ this.props.set.name }</a>;
    }
}