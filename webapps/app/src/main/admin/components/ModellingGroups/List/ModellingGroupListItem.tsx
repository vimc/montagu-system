import * as React from "react";
import { ModellingGroup } from "../../../../shared/models/Generated";

export class ModellingGroupListItem extends React.Component<ModellingGroup, undefined> {
    render() {
        return <div>{ this.props.description }</div>;
    }
}