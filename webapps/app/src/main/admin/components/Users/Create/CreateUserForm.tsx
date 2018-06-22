import * as React from "react";
import {Field, reduxForm} from "redux-form";
import {compose} from "recompose";
import {validations} from "../../../../shared/modules/reduxForm";
import {ReduxFormField} from "../../../../shared/components/ReduxForm/ReduxFormField";
import {
    ReduxFormValidationErrors
} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {usersActionCreators} from "../../../actions/usersActionCreators";
import {ReduxFormProps} from "../../../../shared/components/ReduxForm/types";
import {montaguForm} from "../../../../shared/components/ReduxForm/MontaguForm";

export interface CreateUserFormFields {
    name: string;
    email: string;
    username: string;
}

function processName(name: string) {
    return name.toLowerCase().replace(/[^a-z]/gi, "");
}

export function suggestUsername(name: string): string {
    const names = name.split(" ");
    let username = processName(names[0]);
    if (names.length > 1) {
        username += ("." + processName(names[names.length - 1]));
    }
    return username;
}

export class CreateUserFormComponent extends React.Component<ReduxFormProps<CreateUserFormFields>, undefined> {
    onNameChange(e: any) {
        const {value} = e.target;
        this.props.changeFieldValue('username', suggestUsername(value));
    }

    render() {
        return <form className="form" onSubmit={this.props.handleSubmit(this.props.submit)}>
            <table className="tableForm specialColumn">
                <tbody>
                <tr>
                    <td>Full name</td>
                    <td>
                        <Field
                            name="name"
                            label={"Full name"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required]}
                            onChange={(e) => this.onNameChange(e)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>
                        <Field
                            name="email"
                            label={"Email address"}
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required, validations.email]}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Username</td>
                    <td>
                        <Field
                            label={"Username"}
                            name="username"
                            component={ReduxFormField}
                            type="text"
                            validate={[validations.required, validations.username]}
                        />
                    </td>
                </tr>
                </tbody>
            </table>

            <ReduxFormValidationErrors errors={this.props.errors}/>
            <button type="submit">Save user</button>
        </form>
    }
}

export const CreateUserForm = compose(
    reduxForm({form: 'createUser'}),
    montaguForm<AdminAppState, CreateUserFormFields>({
        form: 'createUser',
        errors: (state: AdminAppState) => state.users.createUserErrors,
        submit: (values: CreateUserFormFields) =>
            usersActionCreators.createUser(values.name, values.email, values.username)
    })
)(CreateUserFormComponent);
