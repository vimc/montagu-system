import * as React from "react";
import {branch, compose, renderNothing} from "recompose";
import {connect, Dispatch} from 'react-redux';

import {AdminAppState} from "../../../reducers/adminAppReducers";
import {CreateModellingGroupForm} from "./CreateModellingGroupForm";
import {modellingGroupsActionCreators} from "../../../actions/modellingGroupsActionCreators";

interface CreateModellingGroupSectionProps {
    canCreateModellingGroups: boolean;
    show: boolean;
    setShowForm: () => void;
}

export const CreateModellingGroupSectionComponent = (props: CreateModellingGroupSectionProps) => {

    if (props.show) {
        return <div>
            <CreateModellingGroupForm/>
        </div>;
    } else {
        return <button onClick={() => props.setShowForm()}>
            Add new group
        </button>;
    }
};

export const mapStateToProps = (state: AdminAppState): Partial<CreateModellingGroupSectionProps> => {
    return {
        canCreateModellingGroups: state.auth.permissions.indexOf("*/users.create") > -1,
        show: state.groups.showCreateGroupForm
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<CreateModellingGroupSectionProps> => {
    return {
        setShowForm: () => dispatch(modellingGroupsActionCreators.setShowCreateGroup(true))
    }
};

const enhance = compose<CreateModellingGroupSectionProps, {}>(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: CreateModellingGroupSectionProps) => !props.canCreateModellingGroups, renderNothing)
);

export const CreateModellingGroupSection = enhance(CreateModellingGroupSectionComponent);