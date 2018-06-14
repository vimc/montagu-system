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

export interface CreateModellingGroupFormFields {
    name: string;
    description: string;
}

export class CreateModellingGroupFormComponent
    extends React.Component<ReduxFormProps<CreateModellingGroupFormFields>, undefined> {

    render() {
        return <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
            <table className="tableForm specialColumn">
                <tbody>
                <tr>
                    <td>Name</td>
                    <td>
                        <Field
                            name="name"
                            label={"name"}
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


function mapStateToProps(state: AdminAppState): Partial<ReduxFormProps<CreateModellingGroupFormFields>> {
    return {
        errors: state.groups.createGroupErrors,
    }
}

export function mapDispatchToProps(dispatch: Dispatch<any>): Partial<ReduxFormProps<CreateModellingGroupFormFields>> {
    return {
        submit: (values: CreateModellingGroupFormFields) => dispatch(modellingGroupsActionCreators
            .createModellingGroup(
                values.name, values.description
            ))
    }
}

export const CreateModellingGroupForm = compose(
    reduxForm({form: 'createUser'}),
    connect(mapStateToProps, mapDispatchToProps),
)(CreateModellingGroupFormComponent);
