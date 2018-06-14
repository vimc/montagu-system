import * as React from "react";
import {branch, compose, renderNothing} from "recompose";
import {connect} from 'react-redux';

import {AdminAppState} from "../../../reducers/adminAppReducers";
import {CreateModellingGroupForm} from "./CreateModellingGroupForm";

interface CreateModellingGroupSectionProps {
    canCreateModellingGroups: boolean;
}

interface State {
    show: boolean
}

export class CreateModellingGroupSectionComponent extends React.Component<Partial<CreateModellingGroupSectionProps>, State> {

    render() {
        if (this.state.show) {
            return <div>
                <CreateModellingGroupForm/>
            </div>;
        } else {
            return <button onClick={() => this.setState({show: true})}>
                Add new group
            </button>;
        }
    }
}

export const mapStateToProps = (state: AdminAppState): Partial<CreateModellingGroupSectionProps> => {
    return {
        canCreateModellingGroups: state.auth.permissions.indexOf("*/users.create") > -1
    }
};

const enhance = compose(
    connect(mapStateToProps),
    branch((props: CreateModellingGroupSectionProps) => !props.canCreateModellingGroups, renderNothing)
);

export const CreateModellingGroupSection = enhance(CreateModellingGroupSectionComponent);