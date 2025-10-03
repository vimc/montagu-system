import * as React from "react";
import {connect} from 'react-redux';
import {branch, compose, renderComponent} from "recompose";
import {isEqual} from "lodash";

import {ModellingGroup, ModelRunParameterSet, TouchstoneVersion} from "../../../../shared/models/APITypes";
import {Alert} from 'reactstrap';
import {longestTimestamp} from "../../../../shared/Helpers";
import {ModelRunParameterDownloadCertificate} from "./ModelRunParameterDownloadCertificate";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../../reducers/contribAppReducers";
import {FileDownloadLink} from "../../../../shared/components/FileDownloadLink";

export interface ModelRunParametersStatusProps {
    disease: string;
    set: ModelRunParameterSet;
    group: ModellingGroup;
    touchstone: TouchstoneVersion;
}

export class ModelRunParametersStatusComponent extends React.Component<ModelRunParametersStatusProps> {
    render(): JSX.Element {
        return <div>
            <Alert color="warning">
                {this.alertContent()}
                <div className="clearfix"></div>
            </Alert>
        </div>;
    }

    alertContent(): JSX.Element {
        const {group, touchstone, set} = this.props;
        if (set) {
            const url = `/modelling-groups/${group.id}/model-run-parameters/${touchstone.id}/${set.id}/`;
            const timestamp = longestTimestamp(new Date(set.uploaded_on));
            const alertText = `You last uploaded a parameter set on ${timestamp}`;
            const downloadCertificateLink = <ModelRunParameterDownloadCertificate set={this.props.set}/>;
            return <span>{alertText} {downloadCertificateLink}
                <br/>
                <FileDownloadLink href={url}>Download data set</FileDownloadLink>
            </span>
        } else {
            return <span>You have not uploaded any parameter sets for {this.props.disease}</span>;
        }
    }
}

export const getLastSetForDisease = (allSets: ModelRunParameterSet[], disease: string): ModelRunParameterSet => {
    const sets = allSets
        ? allSets.filter(s => s.disease == disease)
        : [];
    if (sets.length) {
        return sets[0]
    }
    return null;
};

export const mapStateToProps = (state: ContribAppState, props: Partial<ModelRunParametersStatusProps>): Partial<ModelRunParametersStatusProps> => {
    return {
        disease: props.disease,
        set: state.runParameters.sets && state.runParameters.sets.length ? getLastSetForDisease(state.runParameters.sets, props.disease) : null,
        group: state.groups.currentUserGroup,
        touchstone: state.touchstones.currentTouchstoneVersion,
    };
};

export const ModelRunParametersStatus = compose(
    connect(mapStateToProps),
    branch((props: ModelRunParametersStatusProps) => !props.group || !props.touchstone, renderComponent(LoadingElement)),
)(ModelRunParametersStatusComponent) as React.ComponentClass<Partial<ModelRunParametersStatusProps>>;
