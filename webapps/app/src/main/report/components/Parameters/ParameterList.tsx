import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";

const styles = require("../../../shared/styles/common.css");

export class ParameterList extends React.Component<ILookup<string>, undefined> {
    render() {
        const parameters = Object.getOwnPropertyNames(this.props);
        if (parameters.length == 0) {
            return null;
        }

        const parameterList = parameters.map((paramName) =>
            <div key={paramName}>
                {paramName} : {this.props[paramName]}
                </div>
        );

        return <div>
            <div className="row">
                <div className={"col-12 " + styles.sectionTitle}>Parameters</div>
            </div>
            {parameterList}
        </div>;
    }
}