import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import {Alert} from 'reactstrap';
import { isEqual, clone } from 'lodash';
import {longestTimestamp} from "../../../../shared/Helpers";
import {ModelRunParameterDownloadCertificate} from "./ModelRunParameterDownloadCertificate";
import {RunParametersState, runParametersStore, TokensMap } from "../../../stores/RunParametersStore";
import {runParameterActions} from "../../../actions/RunParameterActions";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton";

interface Props {
    disease: string;
}

interface State {
    sets: ModelRunParameterSet[],
    tokens: TokensMap
}

export class ModelRunParametersStatus extends React.Component<Props, State> {

    constructor(props: Props) {
        super();
        const storeState = runParametersStore.getState();
        this.state = {
            sets: storeState.parameterSets
                ? storeState.parameterSets.filter(s => s.disease == props.disease)
                : [],
            tokens: storeState.oneTimeTokens
        }
        this.refreshToken = this.refreshToken.bind(this)
    }

    componentDidMount() {
        runParametersStore.listen(this.onChange.bind(this));
        if (this.state.sets.length) this.fetchOneTimeTokens();
    }

    fetchOneTimeTokens() {
        const s = runParametersStore.getState();
        this.state.sets.map(set => setTimeout(() => {
            runParameterActions.fetchToken(s.groupId, s.touchstoneId, set.id)
        }));
    }

    onChange(storeState: RunParametersState) {
        const oldStateSets = clone(this.state.sets)
        this.setState({
            sets: storeState.parameterSets
                ? storeState.parameterSets.filter(s => s.disease == this.props.disease)
                : [],
            tokens: storeState.oneTimeTokens
        })
        if (!isEqual(oldStateSets, this.state.sets)) {
            this.fetchOneTimeTokens();
        }
    }

    refreshToken(setId: number) {
        return () => {
            runParameterActions.clearToken(setId);
            const s = runParametersStore.getState();
            setTimeout(() => {
                runParameterActions.fetchToken(s.groupId, s.touchstoneId, setId)
            })
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
            const downloadParamsLink = <OneTimeButton
                token={this.state.tokens[lastUploaded.id]}
                refreshToken={this.refreshToken(lastUploaded.id)}
                enabled={!!this.state.tokens[lastUploaded.id]}>
                Download data set
            </OneTimeButton>;


            alertContent = <span>{alertText} {downloadCertificateLink}
                <br/> {downloadParamsLink}
            </span>
        }

        return <div>
            <Alert color="warning">{alertContent}
                <div className="clearfix"></div>
            </Alert>
        </div>
    }
}