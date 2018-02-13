import * as React from "react";
import { connect } from 'react-redux';

import { ModellingGroup } from "../../../shared/models/Generated";
import { GroupList } from "./GroupList";
import { ButtonLink } from "../../../shared/components/ButtonLink";
import { modellingGroupsActions } from "../../actions/modellingGroupsActions";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";

import { Dispatch } from "redux";

import "../../../shared/styles/common.scss";
import {ContribAppState} from "../../reducers/contribReducers";

export interface ChooseGroupProps {
    groups: ModellingGroup[];
    getGroups: () => void;
    ready: boolean;
}

export class ChooseGroupContentComponent extends React.Component<ChooseGroupProps, undefined> {
    componentDidMount() {
        this.props.getGroups()
    }

    render() {
        if (this.props.ready) {
            if (this.props.groups.length > 1) {
                return <div>
                    <div>
                        You are a member of multiple modelling groups.
                        Which one do you want to act as currently?
                    </div>
                    <div className="gapAbove">
                        <GroupList groups={this.props.groups}/>
                    </div>
                </div>;
            } else {
                // This is a placeholder until we have automatic redirection working
                const url = `/${this.props.groups[0].id}/`;
                return <span>
                    <ButtonLink href={url}>Next</ButtonLink>
                </span>;
            }
        } else {
            return <LoadingElement />;
        }
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ChooseGroupProps> => {
    return {
        groups: state.groups.items,
        ready: state.groups.items && state.groups.items.length > 0
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<ContribAppState>): Partial<ChooseGroupProps> => {
    return {
        getGroups : () => dispatch(modellingGroupsActions.getGroups())
    }
};

export const ChooseGroupContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChooseGroupContentComponent);