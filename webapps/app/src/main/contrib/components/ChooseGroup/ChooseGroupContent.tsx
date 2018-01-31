import * as React from "react";
import { connect } from 'react-redux';

import { ModellingGroup } from "../../../shared/models/Generated";
import { GroupList } from "./GroupList";
import { ButtonLink } from "../../../shared/components/ButtonLink";
import { ModellingGroupsActions } from "../../actions/ModellingGroupsActions";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";

import "../../../shared/styles/common.scss";

export interface ChooseGroupProps {
    groups: ModellingGroup[];
    dispatch?: any;
    ready: boolean;
}

export class ChooseGroupContentComponent extends React.Component<ChooseGroupProps, undefined> {
    componentDidMount() {
        this.props.dispatch(ModellingGroupsActions.getGroups());
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

const mapStateToProps = (state: any) => {
    return {
        groups: state.groups.items,
        ready: state.groups.items && state.groups.items.length
    }
};

export const ChooseGroupContent = connect(mapStateToProps)(ChooseGroupContentComponent);