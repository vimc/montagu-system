import * as React from "react";
import {change, Field, formValueSelector, reduxForm} from "redux-form";
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
import {ChangeEvent} from "react";
import {titleCase} from "../../../../shared/Helpers";

function stripBadChars(data: string){
    return data.replace(/[^a-z\s]/gi, "");
}

export function suggestId(pi: string, institution: string): string {

    if (!pi || !institution)
        return null;

    pi = stripBadChars(pi);
    institution = stripBadChars(institution);

    const acronym = institution.split(' ').filter(w => w.length > 0)
        .map(w => w[0]
            .toUpperCase()).join("");
    const lastName = titleCase(pi.split(' ')
        .filter(w => w.length > 0)
        .pop());

    return `${acronym}-${lastName}`
}

interface CreateGroupProps extends ReduxFormProps<ModellingGroupCreation> {
    pi: string,
    institution: string
}

export class CreateModellingGroupFormComponent
    extends React.Component<CreateGroupProps, undefined> {

    onPIChange(e: ChangeEvent<HTMLInputElement>) {
        const {value} = e.target;
        if (this.props.institution) {
            this.props.changeFieldValue('id', suggestId(value, this.props.institution));
        }
    }

    onInsititutionChange(e: ChangeEvent<HTMLInputElement>) {
        const {value} = e.target;
        if (this.props.pi) {
            this.props.changeFieldValue('id', suggestId(this.props.pi, value));
        }
    }

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
                            onChange={(e) => this.onInsititutionChange(e)}
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
                            onChange={(e) => this.onPIChange(e)}
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
                            validate={[validations.required, validations.id]}
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

// This is a redux-form utility that allows you to retrieve the current values of form fields from the store state
// see usage below in mapStateToProps
const selector = formValueSelector('createGroup');

function mapStateToProps(state: AdminAppState): Partial<CreateGroupProps> {
    return {
        errors: state.groups.createGroupErrors,
        institution: selector(state, "institution"),
        pi: selector(state, "pi") //we map these 2 fields to props so we can use them to suggest an id
    }
}

export function mapDispatchToProps(dispatch: Dispatch<any>): Partial<CreateGroupProps> {
    return {
        submit: (newGroup: ModellingGroupCreation) => dispatch(modellingGroupsActionCreators
            .createModellingGroup(newGroup)),
        changeFieldValue: (field: string, value: string) => {
            dispatch(change('createGroup', field, value))
        }
    }
}

export const CreateModellingGroupForm = compose(
    reduxForm({form: 'createGroup'}),
    connect(mapStateToProps, mapDispatchToProps),
)(CreateModellingGroupFormComponent);
