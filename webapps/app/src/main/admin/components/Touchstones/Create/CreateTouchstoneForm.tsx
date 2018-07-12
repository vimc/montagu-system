import * as React from "react";
import {Field, reduxForm} from "redux-form";
import {compose} from "recompose";
import {validations} from "../../../../shared/modules/reduxForm";
import {ReduxFormInput, ReduxFormTextArea} from "../../../../shared/components/ReduxForm/ReduxFormField";
import {
    ReduxFormValidationErrors
} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {ReduxFormProps} from "../../../../shared/components/ReduxForm/types";
import {adminTouchstoneActionCreators} from "../../../actions/adminTouchstoneActionCreators";
import {montaguForm} from "../../../../shared/components/ReduxForm/MontaguForm";

export interface TouchstoneCreation {
    comment: string;
    description: string;
    id: string;
}

export class CreateTouchstoneFormComponent
    extends React.Component<ReduxFormProps<TouchstoneCreation>, undefined> {

    render() {
        return <form className="form mb-5" onSubmit={this.props.handleSubmit(this.props.submit)}>
            <table className="tableForm specialColumn">
                <tbody>
                <tr>
                    <td>Id</td>
                    <td>
                        <Field
                            name="id"
                            label={"id"}
                            component={ReduxFormInput}
                            type="text"
                            validate={[validations.required, validations.id]}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>
                        <Field
                            name="description"
                            label={"description"}
                            component={ReduxFormTextArea}
                            cols={35}
                            rows={5}
                            validate={[validations.required]}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Comment</td>
                    <td>
                        <Field
                            name="comment"
                            label={"comment"}
                            component={ReduxFormTextArea}
                            cols={35}
                            rows={5}
                        />
                    </td>
                </tr>
                </tbody>
            </table>

            <ReduxFormValidationErrors errors={this.props.errors}/>
            <button type="submit">Create touchstone</button>
        </form>
    }
}

export const CreateTouchstoneForm = compose(
    reduxForm({form: 'createTouchstone'}),
    montaguForm<AdminAppState, TouchstoneCreation>({
        form: 'createTouchstone',
        mapErrorsFromState: (state: AdminAppState) => state.touchstones.createTouchstoneErrors,
        submit: (values) => adminTouchstoneActionCreators.createTouchstone(values)
    }),
)(CreateTouchstoneFormComponent);
