import * as React from "react";
import { connect } from 'react-redux';
import { compose, branch, renderComponent} from "recompose";
import { Action, Dispatch } from "redux";
import {isEqual} from "lodash";

import {ModellingGroup, ModelRunParameterSet, Touchstone} from "../../../../shared/models/Generated";
import {Alert} from 'reactstrap';
import {longestTimestamp} from "../../../../shared/Helpers";
import {ModelRunParameterDownloadCertificate} from "./ModelRunParameterDownloadCertificate";
import {TokensMap } from "../../../stores/RunParametersStore";
import { OneTimeButton } from "../../../../shared/components/OneTimeButton/OneTimeButton";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {runParametersActionCreators} from "../../../actions/runParametersActionCreators";

export interface ModelRunParametersStatusProps {
    disease: string;
    set: ModelRunParameterSet;
    group: ModellingGroup;
    touchstone: Touchstone;
    loadToken: (groupId: string, touchstoneId: string, setId: number) => any;
    token: string;
}

export class ModelRunParametersStatusComponent extends React.Component<ModelRunParametersStatusProps> {
    componentDidMount() {
        if (this.props.set) {
            this.props.loadToken(this.props.group.id, this.props.touchstone.id, this.props.set.id);
        }
    }

    componentWillReceiveProps(nextProps: ModelRunParametersStatusProps) {
        if (!isEqual(this.props.set, nextProps.set)) {
            this.props.loadToken(this.props.group.id, this.props.touchstone.id, nextProps.set.id);
        }
    }

    render(): JSX.Element {

        let alertContent = <span>You have not uploaded any parameter sets for {this.props.disease}</span>;
        if (this.props.set) {

            const alertText
                = `You last uploaded a parameter set on ${longestTimestamp(new Date(this.props.set.uploaded_on))}`;

            const downloadCertificateLink = <ModelRunParameterDownloadCertificate set={this.props.set}/>;

            const downloadParamsLink = <OneTimeButton
                token={this.props.token}
                refreshToken={() => this.props.loadToken(this.props.group.id, this.props.touchstone.id, this.props.set.id)}
                enabled={!!this.props.token}
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
        </div>;
    }
}

export const getLastSetForDisease = (allSets: ModelRunParameterSet[], disease: string) : ModelRunParameterSet => {
    const sets = allSets
        ? allSets.filter(s => s.disease == disease)
        : [];
    if (sets.length) {
        return sets[0]
    }
    return null;
}

export const getTokenBySet = (set: ModelRunParameterSet, tokens: TokensMap) : string => {
    if (!set) {
        return null;
    }
    if (tokens[set.id]) {
        return tokens[set.id];
    }
    return null;
}

export const mapStateToProps = (state: ContribAppState, props: Partial<ModelRunParametersStatusProps>): Partial<ModelRunParametersStatusProps> => {

    const newProps : Partial<ModelRunParametersStatusProps> = {
        disease: props.disease,
        set: state.runParameters.sets.length ? getLastSetForDisease(state.runParameters.sets, props.disease) : null,
        group: state.groups.currentUserGroup,
        touchstone: state.touchstones.currentTouchstone,
    }
    newProps.token = newProps.set ? getTokenBySet(newProps.set, state.runParameters.tokens) : null;

    return newProps;
};

export const mapDispatchToProps = (dispatch: Dispatch<Action>): Partial<ModelRunParametersStatusProps> => {
    return {
        loadToken: ((groupId: string, touchstoneId: string, setId: number) => {
            dispatch(runParametersActionCreators.getOneTimeToken(groupId, touchstoneId, setId))
        })
    }
};

export const ModelRunParametersStatus = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: ModelRunParametersStatusProps) => !props.group || !props.touchstone, renderComponent(LoadingElement)),
)(ModelRunParametersStatusComponent) as React.ComponentClass<Partial<ModelRunParametersStatusProps>>;
