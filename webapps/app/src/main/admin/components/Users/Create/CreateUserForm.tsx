import { FormConnector, ReformProps } from "alt-reform";
import { CreateUserFields, createUserFormStore } from "./CreateUserFormStore";
import { ValidationError } from "../../../../shared/components/Login/ValidationError";
import * as React from "react";

const commonStyles = require("../../../../shared/styles/common.css");
const formStyles = require("../../../../shared/styles/forms.css");

export class CreateUserFormComponent extends React.Component<ReformProps, undefined> {
    render() {
        const fields = this.props.fields as CreateUserFields;
        return <form className={commonStyles.gapAbove} onSubmit={this.props.submit}>
            <div className={commonStyles.sectionTitle}>Add new user</div>
            <table className={formStyles.tableForm}>
                <tbody>
                <tr>
                    <td>Full name</td>
                    <td><input name="name" type="string" {...fields.name} /></td>
                    <td><ValidationError message={this.props.errors.name}/></td>
                </tr>
                <tr>
                    <td>Email address</td>
                    <td><input name="email" type="email" {...fields.email} /></td>
                    <td><ValidationError message={this.props.errors.email}/></td>
                </tr>
                <tr>
                    <td>Username</td>
                    <td><input name="username" type="string" {...fields.username} /></td>
                    <td><ValidationError message={this.props.errors.username}/></td>
                </tr>
                </tbody>
            </table>
            <div className={commonStyles.gapAbove}>
                <ValidationError message={this.props.store.state.submitError}/>
            </div>
            <div className={commonStyles.gapAbove}>
                <button type="submit">Save user</button>
            </div>
        </form>;
    }
}

export const CreateUserForm = FormConnector(createUserFormStore())(CreateUserFormComponent);