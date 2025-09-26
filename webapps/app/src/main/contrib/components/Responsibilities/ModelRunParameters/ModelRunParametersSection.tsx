import * as React from "react";

import {ModelRunParametersStatus} from "./ModelRunParametersStatus";
import {ModelRunParametersForm} from "./ModelRunParametersForm";

interface Props {
    disease: string;
}

export class ModelRunParametersSection extends React.Component<Props, undefined> {

    render(): JSX.Element {
        return <div>
            <h2 className="largeSectionTitle mb-0">Disease: {this.props.disease}</h2>
            <hr className="mt-1 dashed"/>
            <ModelRunParametersStatus disease={this.props.disease} />
            <ModelRunParametersForm disease={this.props.disease} />
        </div>
    }
}