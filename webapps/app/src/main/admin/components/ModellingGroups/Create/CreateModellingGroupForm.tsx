import * as React from "react";
import {change, Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {compose} from "recompose";
import {Dispatch} from "redux";
import {validations} from "../../../../shared/modules/reduxForm";
import {ReduxFormField} from "../../../../shared/components/ReduxForm/ReduxFormField";
import {
    ReduxFormValidationErrors
} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {modellingGroupsActionCreators} from "../../../actions/modellingGroupsActionCreators";
import {ReduxFormProps} from "../../../../shared/components/ReduxForm/types";
import {ModellingGroupCreation} from "../../../../shared/models/Generated";

export class CreateModellingGroupFormComponent
    extends React.Component<ReduxFormProps<ModellingGroupCreation>, undefined> {

    render() {
        return <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
            <table className="tableForm specialColumn">
                <tbody>
                <tr>
                    <td>Institution</td>
                    <td>
                        <Field
                            name="institution"
                            label={"institution"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required]}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Principal investigator</td>
                    <td>
                        <Field
                            name="pi"
                            label={"pi"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required]}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Id</td>
                    <td>
                        <Field
                            name="id"
                            label={"id"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required]}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>
                        <Field
                            name="description"
                            label={"description"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required]}
                        />
                    </td>
                </tr>
                </tbody>
            </table>

            <ReduxFormValidationErrors errors={this.props.errors}/>
            <button type="submit">Create group</button>
        </form>
    }
}


function mapStateToProps(state: AdminAppState): Partial<ReduxFormProps<ModellingGroupCreation>> {
    return {
        errors: state.groups.createGroupErrors,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<any>): Partial<ReduxFormProps<ModellingGroupCreation>> {
    return {
        submit: (newGroup: ModellingGroupCreation) => dispatch(modellingGroupsActionCreators
            .createModellingGroup(newGroup))
    }
}

export const CreateModellingGroupForm = compose(
    reduxForm({form: 'createUser'}),
    connect(mapStateToProps, mapDispatchToProps),
)(CreateModellingGroupFormComponent);
