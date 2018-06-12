import * as React from "react";
import {connect} from "react-redux";
import {compose, branch, renderComponent} from "recompose";
import {Dispatch} from "redux";
import {isEqual} from "lodash";

import {AdminAppState} from "../../../reducers/adminAppReducers";
import {LoadingElement} from "../../../../shared/partials/LoadingElement/LoadingElement";
import {usersActionCreators} from "../../../actions/usersActionCreators";

export interface AddRolesPublicProps {
    username: string;
    userRoles: string[];
}

export interface AddRolesProps extends AddRolesPublicProps {
    allRoles: string[];
    addRoleToUser: (username:string, role:string) => void;
}

interface AddRolesState {
    availableRoles: string[];
    selectedRole: string;
}

export class AddRolesComponent extends React.Component<AddRolesProps, AddRolesState> {
    componentWillMount() {
        this.setState({
            availableRoles: [],
            selectedRole: ""
        });
        this.setAvailableRoles(this.props.userRoles);
    }

    componentWillReceiveProps(nextProps: AddRolesProps) {
        if (!isEqual(this.props.userRoles, nextProps.userRoles)) {
            this.setAvailableRoles(nextProps.userRoles);
        }
    }

    setAvailableRoles(userRoles: string[]) {
        const roles = this.props.allRoles.filter(r => userRoles.indexOf(r) == -1);
        this.setState({
            availableRoles: roles,
            selectedRole: roles.length > 0 ? roles[0] : ""
        })
    }

    handleChange(e: any) {
        this.setState({
            selectedRole: e.target.value
        });
    }

    handleClick(e: any) {
        e.preventDefault();
        this.props.addRoleToUser(this.props.username, this.state.selectedRole);
    }

    render() {

        if (this.state.availableRoles.length == 0) {
            return <div className="form-group row">
                <div className="col">
                    <div className="alert alert-warning">
                        This user has all possible roles.
                    </div>
                </div>
            </div>
        }

        return <form>
            <div className="form-group row">
                <div className="col">
                    <select className="form-control" onChange={this.handleChange.bind(this)}
                            value={this.state.selectedRole}>
                        {this.state.availableRoles
                            .map(r => <option value={r} key={r}>{r}</option>)}
                    </select>
                </div>
                <div className="col">
                    <button className="btn-success" onClick={this.handleClick.bind(this)}>Add role</button>
                </div>
            </div>
        </form>;
    }
}

const mapStateToProps = (state: AdminAppState, props: AddRolesPublicProps) :Partial<AddRolesProps> => {
    return {
        allRoles: state.users.allUserRoles,
        userRoles: props.userRoles,
        username: props.username
    }
};

export const mapDispatchToProps = (dispatch: Dispatch<AdminAppState>): Partial<AddRolesProps> => {
    return {
        addRoleToUser: (username:string, role:string) => dispatch(usersActionCreators.addGlobalRoleToUser(username, role))
    }
};

export const AddRoles = compose(
    connect(mapStateToProps, mapDispatchToProps),
    branch((props: AddRolesProps) => !props.allRoles.length, renderComponent(LoadingElement))
)(AddRolesComponent) as React.ComponentClass<Partial<AddRolesProps>>;