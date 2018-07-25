import * as React from "react";

import "../../../../shared/styles/forms.scss";
import {validations} from "../../../../shared/modules/reduxForm";
import {ReduxFormInput} from "../../../../shared/components/ReduxForm/ReduxFormField";
import {AdminAppState} from "../../../reducers/adminAppReducers";
import {compose} from "recompose";
import * as Validation from "../../../../shared/validation/Validation";
import {usersActionCreators} from "../../../actions/usersActionCreators";
import {Field, reduxForm} from "redux-form";
import {montaguForm} from "../../../../shared/components/ReduxForm/MontaguForm";
import {ReduxFormProps} from "../../../../shared/components/ReduxForm/types";
import {ReduxFormValidationErrors} from "../../../../shared/components/ReduxForm/ReduxFormValidationError";

interface Fields {
    newPassword: string;
    resetToken: string;
}

export interface SetPasswordFormProps {
    resetToken: string;
}

interface InternalProps extends ReduxFormProps<Fields>, SetPasswordFormProps {
}

export class SetPasswordFormComponent extends React.Component<InternalProps, undefined> {
    render() {
        const resetToken = this.props.resetToken;
        const submit = (values: Fields) => this.props.submit({...values, resetToken})
        return <form className="form" onSubmit={this.props.handleSubmit(submit)}>
            <div className="fields">
                <Field
                    name="newPassword"
                    type="password"
                    component={ReduxFormInput}
                    label="New password"
                    validate={[validations.required, (name: string) => Validation.minLength(name, 8)]}
                />
            </div>
            <button type="submit">Update</button>
            <div><ReduxFormValidationErrors errors={this.props.errors}/></div>
        </form>;
    }
}

const enhance = compose(
    reduxForm({form: 'setPassword'}),
    montaguForm<AdminAppState, Fields>({
        form: 'setPassword',
        mapErrorsFromState: (state: AdminAppState) => state.users.setPasswordErrors,
        submit: v => usersActionCreators.setPassword(v.resetToken, v.newPassword)
    })
);

export const SetPasswordForm = enhance(SetPasswordFormComponent) as React.ComponentClass<SetPasswordFormProps>;