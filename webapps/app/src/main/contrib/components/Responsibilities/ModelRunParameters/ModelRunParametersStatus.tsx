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
    token: string,
    groupId: string,
    touchstoneId: string
}

export class ModelRunParametersStatus extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            set: null,
            token: null,
            groupId: "",
            touchstoneId: ""
        }
        this.refreshToken = this.refreshToken.bind(this)
        this.onChange = this.onChange.bind(this)
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

    getTokenBySet(set: ModelRunParameterSet, tokens: TokensMap) {
        if (!set) return null;
        if (tokens[set.id]) return tokens[set.id];
        return null;
    }

    componentDidMount() {
        const s = runParametersStore.getState();
        const set = this.getLastSetForDisease(s.parameterSets, this.props.disease);
        const token = this.getTokenBySet(set, s.oneTimeTokens);
        this.setState({
            set: set,
            token: token,
            groupId: s.groupId,
            touchstoneId: s.touchstoneId
        });
        runParametersStore.listen(this.onChange);
        if (this.state.set) {
            runParameterActions.fetchToken(this.state.groupId, this.state.touchstoneId, this.state.set.id)
        }
    }

    componentWillUnmount() {
        runParametersStore.unlisten(this.onChange);
    }

    onChange(storeState: RunParametersState) {
        const oldSetId = this.state.set ? this.state.set.id : null;
        const set = this.getLastSetForDisease(storeState.parameterSets, this.props.disease);
        this.setState({
            set: set,
            token: this.getTokenBySet(set, storeState.oneTimeTokens),
            groupId: storeState.groupId,
            touchstoneId: storeState.touchstoneId
        });
        const newSetId = this.state.set ? this.state.set.id : null;
        if (newSetId && oldSetId != newSetId) {
            runParameterActions.fetchToken(storeState.groupId, storeState.touchstoneId, newSetId)
        }
    }

    refreshToken(setId: number) {
        return () => {
            runParameterActions.clearToken(setId);
            runParameterActions.fetchToken(this.state.groupId, this.state.touchstoneId, setId)
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
                token={this.state.token}
                refreshToken={this.refreshToken(set.id)}
                enabled={!!this.state.token}
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