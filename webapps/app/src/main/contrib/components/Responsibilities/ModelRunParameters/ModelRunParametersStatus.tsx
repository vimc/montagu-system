import {ModelRunParameterSet} from "../../../../shared/models/Generated";
import * as React from "react";
import {Alert} from 'reactstrap';
import { isEqual, clone } from 'lodash';
import {longestTimestamp} from "../../../../shared/Helpers";
import {ModelRunParameterDownloadCertificate} from "./ModelRunParameterDownloadCertificate";
import {RunParametersState, runParametersStore, TokensMap } from "../../../stores/RunParametersStore";
import {runParameterActions} from "../../../actions/RunParameterActions";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton/OneTimeButton";

interface Props {
    disease: string;
}

interface State {
    set: ModelRunParameterSet,
    tokens: TokensMap,
    groupId: string,
    touchstoneId: string
}

export class ModelRunParametersStatus extends React.Component<Props, State> {

    constructor(props: Props) {
        super();
        const storeState = runParametersStore.getState();
        this.state = {
            set: this.getLastSetForDisease(storeState.parameterSets, props.disease),
            tokens: storeState.oneTimeTokens,
            groupId: storeState.groupId,
            touchstoneId: storeState.touchstoneId
        }
        this.refreshToken = this.refreshToken.bind(this)
    }

    getLastSetForDisease(allSets: ModelRunParameterSet[], disease: string) {
        const sets = allSets
            ? allSets.filter(s => s.disease == disease)
            : []
        if (sets.length) {
            return sets[0]
        }
        return null;
    }

    componentDidMount() {
        runParametersStore.listen(this.onChange.bind(this));
        if (this.state.set) {
            runParameterActions.fetchToken(this.state.groupId, this.state.touchstoneId, this.state.set.id)
        }
    }

    onChange(storeState: RunParametersState) {
        const oldSetId = this.state.set ? this.state.set.id : null;
        this.setState({
            set: this.getLastSetForDisease(storeState.parameterSets, this.props.disease),
            tokens: storeState.oneTimeTokens
        })
        const newSetId = this.state.set ? this.state.set.id : null;
        if (newSetId && oldSetId != newSetId) {
            runParameterActions.fetchToken(storeState.groupId, storeState.touchstoneId, newSetId)
        }
    }

    refreshToken(setId: number) {
        return () => {
            runParameterActions.clearToken(setId);
            const s = runParametersStore.getState();
            runParameterActions.fetchToken(s.groupId, s.touchstoneId, setId)
        }
    }

    render(): JSX.Element {
        let alertContent = <span>You have not uploaded any parameter sets for {this.props.disease}</span>;
        const set = this.state.set;
        if (set) {
            const alertText
                = `You last uploaded a parameter set on ${longestTimestamp(new Date(set.uploaded_on))}`;

            const downloadCertificateLink = <ModelRunParameterDownloadCertificate set={set}/>;

            // TODO add link when API endpoint implemented
            const downloadParamsLink = <OneTimeButton
                token={this.state.tokens[set.id]}
                refreshToken={this.refreshToken(set.id)}
                enabled={!!this.state.tokens[set.id]}
                element="Link"
            >
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