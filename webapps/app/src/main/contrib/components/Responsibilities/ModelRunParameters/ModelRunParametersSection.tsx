import * as React from "react";
import {ModelRunParametersStatus} from "./ModelRunParametersStatus";
import {ModelRunParametersForm} from "./ModelRunParametersForm";

interface Props {
    url: string;
    disease: string;
}

export class ModelRunParametersSection extends React.Component<Props, undefined> {

    render(): JSX.Element {

        return <div>
            <h2 className="largeSectionTitle mb-0">Disease: {this.props.disease}</h2>
            <hr className="mt-1"/>
            <ModelRunParametersStatus disease={this.props.disease} />
            <ModelRunParametersForm disease={this.props.disease} url={this.props.url} />
        </div>
    }
}