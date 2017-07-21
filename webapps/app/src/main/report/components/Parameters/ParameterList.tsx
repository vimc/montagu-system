import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";

export class ParameterList extends React.Component<ILookup<string>, undefined> {
    render() {

        const parameters = Object.getOwnPropertyNames(this.props);
        const parameterList =
            parameters.map((paramName) => <span key={paramName}>{paramName} : {this.props[paramName]} </span>);

        if (parameters.length == 0)
            return <div>none</div>

        return <div>{parameterList}</div>

    }
}