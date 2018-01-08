import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import {Alert} from 'reactstrap';
import {longestTimestamp} from "../../../../shared/Helpers";
import {ModelRunParameterDownloadCertificate} from "./ModelRunParameterDownloadCertificate";
import {RunParametersState, runParametersStore} from "../../../stores/RunParametersStore";

interface Props {
    disease: string;
}

interface State {
    sets: ModelRunParameterSet[]
}

export class ModelRunParametersStatus extends React.Component<Props, State> {

    constructor(props: Props) {
        super();
        const storeState = runParametersStore.getState();
        this.state = {
            sets: storeState.parameterSets
                ? storeState.parameterSets.filter(s => s.disease == props.disease)
                : []
        }
    }

    componentDidMount() {
        runParametersStore.listen(this.onChange.bind(this));
    }

    onChange(storeState: RunParametersState) {

        if (storeState.parameterSets) {
            this.setState({sets: storeState.parameterSets.filter(s => s.disease == this.props.disease)})
        }
    }

    render(): JSX.Element {

        let alertContent = <span>You have not uploaded any parameter sets for {this.props.disease}</span>;

        const hasSets = this.state.sets.length > 0;

        if (hasSets) {
            const lastUploaded = this.state.sets[0];
            const alertText
                = `You last uploaded a parameter set on ${longestTimestamp(new Date(lastUploaded.uploaded_on))}`;

            const downloadCertificateLink = <ModelRunParameterDownloadCertificate set={lastUploaded}/>;

            // TODO add link when API endpoint implemented
            const downloadParamsLink = <a href="#">View parameter set</a>;

            alertContent = <span>{alertText} {downloadCertificateLink}
                {/*<br/> {downloadParamsLink}*/}
            </span>
        }

        return <div>
            <Alert color="warning">{alertContent}
                <div className="clearfix"></div>
            </Alert>
        </div>
    }
}