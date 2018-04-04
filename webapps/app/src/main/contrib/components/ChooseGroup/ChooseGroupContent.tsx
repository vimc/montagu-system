import * as React from "react";
import { compose, branch, renderComponent } from "recompose";
import { connect } from 'react-redux';

import { ModellingGroup } from "../../../shared/models/Generated";
import { GroupList } from "./GroupList";
import { ButtonLink } from "../../../shared/components/ButtonLink";
import { LoadingElement } from "../../../shared/partials/LoadingElement/LoadingElement";
import {ContribAppState} from "../../reducers/contribAppReducers";

export interface ChooseGroupProps {
    groups: ModellingGroup[];
}

export const ChooseGroupContentComponent: React.SFC<ChooseGroupProps> = (props: ChooseGroupProps) => {
    if (props.groups.length > 1) {
        return <div>
            <div>
                You are a member of multiple modelling groups.
                Which one do you want to act as currently?
            </div>
            <div className="gapAbove">
                <GroupList groups={props.groups}/>
            </div>
        </div>;
    } else {
        // This is a placeholder until we have automatic redirection working
        const url = `/${props.groups[0].id}/`;
        return <span>
            <ButtonLink href={url}>Next</ButtonLink>
        </span>;
    }
}

export const mapStateToProps = (state: ContribAppState): Partial<ChooseGroupProps> => {
    return {
        groups: state.groups.userGroups,
    }
};

export const ChooseGroupContent = compose(
    connect(mapStateToProps),
    branch((props: ChooseGroupProps) => (!props.groups || props.groups.length < 1), renderComponent(LoadingElement))
)(ChooseGroupContentComponent) as React.ComponentClass<Partial<ChooseGroupProps>>;