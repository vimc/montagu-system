import * as React from "react";
import {ILookup} from "../../../shared/models/Lookup";
import {ReportDownloadSection} from "../Reports/DownloadSection";

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

        return <ReportDownloadSection title={"Parameters"}>
            {parameterList}
        </ReportDownloadSection>;
    }
}