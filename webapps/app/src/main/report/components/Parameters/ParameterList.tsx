import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";

import "../../../shared/styles/common.scss";

export class ParameterList extends React.Component<ILookup<string>, undefined> {
    render() {
        const parameters = Object.getOwnPropertyNames(this.props);
        if (parameters.length == 0) {
            return null;
        }

        const parameterList = parameters.map((paramName) =>
            <div className="row" key={paramName}>
                <div className="col-12">
                    {paramName}: {this.props[paramName]}
                </div>
            </div>
        );

        return <div>
            <div className="row">
                <div className="col-12 sectionTitle">Parameters</div>
            </div>
            {parameterList}
        </div>;
    }
}