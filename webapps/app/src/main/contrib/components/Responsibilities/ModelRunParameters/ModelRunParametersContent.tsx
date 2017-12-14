import * as React from "react";
import {ModelRunParameterSetsList} from "./ModelRunParameterSetsList";
import {ModelRunParameterUploadSection} from "./ModelRunParameterUploadSection";

export class ModelRunParametersContent extends React.Component<undefined, undefined> {
    render(): JSX.Element {
        return <div className="mt-2">
            <ModelRunParameterSetsList />
            <ModelRunParameterUploadSection />
        </div>;
    }
}